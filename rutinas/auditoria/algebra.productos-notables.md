# Auditoría de contenido: «Productos notables» (algebra.productos-notables)

18 nov 2026. Auditor externo (fase 7 del método, `docs/metodo/unidad/5-auditor.md`), sin editar la unidad. Contrato:
`docs/plan-calidad.md` §3 (13 puntos) y §5. Formato: `docs/teoria.md` 4e, 4f, 4h, 4i y §5. Vara: `docs/molde-unidad.md`
§3 (con la regla nueva de qué muestra el dibujo de un ejemplo) y §10. Decisiones: `docs/etapa3/decisiones.md` (Álgebra y
rondas 2 a 5), `docs/etapa3/propuesta-algebra-exponentes.md` y `docs/etapa2/decisiones.md` («Cambios posteriores»).

No se reporta lo que otro agente corrige en paralelo en «Exponentes y radicales» ni lo que cambie en la pieza `alg-objeto`
por esa unidad. Sí va un rótulo de `alg-objeto` que solo dibuja esta unidad (el terreno que se cede, M5).

**Qué se revisó.**
- `contenido/teoria/algebra/productos-notables.js` (v0.4.0, `calidad: 2`): las 5 ideas con sus 7 momentos, los 75
  ejemplos, «Ahora tú» y «Así se resuelve», el glosario (12 términos propios), las 2 mesas y la historia.
- La pieza `alg-objeto` en lo que dibuja esta unidad (terreno, triplay, taco, mesa, cometa) y su prueba numérica.
- La práctica: `plantillas/productos-notables/` (32 tipos, sus subtipos, test, `casos.json` y `papel.json`) y, de
  `plantillas/cuadrado-crece/`, lo que `nucleo/repaso-tipos.js:114` asigna a la unidad (papel p1, p2, p4 y p10) y la
  escena, que el catálogo lista en la unidad.
- La app a 390 × 844 con `--entera` (momentos, 75 ejemplos, glosario y laboratorio) y los momentos a 1280 × 860.
- Scripts y capturas en `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/auditoria-productos/`:
  `volcar.js` (solo extrae textos y `_datos`), `expr.py` (analizador propio de expresiones con √, ∛, ³√, superíndices
  y multiplicación implícita), `verificar.py` y `verificar.txt`; capturas en `cap/` y `cap-ancha/`.

**Cuentas.** Rehechas con `verificar.py`, que no usa el código de la unidad ni del generador. De ellos solo toma los
parámetros (`_datos`) o el texto del enunciado, calcula aparte (polinomios comparados en 4 puntos, x + 1/x = k resuelto
de verdad, a y b hallados de su suma y producto, pares por fuerza bruta) y exige que la alternativa marcada valga eso y
que ninguna otra valga lo mismo.
- **Generador: 96 problemas**, 3 semillas por cada uno de los 32 tipos (con sus subtipos repartidos).
- **«Ahora tú»: 75** (semillas 0–14 de las 5 ideas: 3 por tipo). **«Así se resuelve»: 15** (semillas 0–2).
- **Ejemplos: los 75**, con los 25 de nivel 3, y la letra de cada respuesta contra su alternativa.
- **Distractores explicados en los 25 de nivel 3:** 66 afirmaciones («la B quita una sola franja») rehechas a mano: 63
  dan el valor de su alternativa, una es falsa (M2) y dos no se pueden reproducir (B1).
- Las 5 predicciones con sus distractores, las 5 misiones, los pasos de «Mira» con números ((2 − √3)² = 7 − 2√12;
  1/(√5 − √3) ≈ 1,984 ≈ (√5 + √3)/2), los ejemplos del glosario y la historia (39 + 25 = 64, x = 3).

En total, 261 respuestas rehechas por script y **ningún error de cuenta en una respuesta**. `node --test` de la unidad,
el generador, `cuadrado-crece` y `alg-objeto`: 111 de 111 en verde.

**Lo que dijo el lector en frío, verificado.**
- **Es real y entra en la tabla:**
  - 3ab(a + b) no está en Datos (A1), y además la regla lo muestra cortado en el celular (A1);
  - «x + y = A y x · y = B» se lee mal (M6);
  - p y q sin decir qué son, ±, ∓ y C sin presentar (M7);
  - niveles que no suben en racionalizar y, en parte, en cubos (M8);
  - distractores de nivel 3 sin explicar (B1), con uno mal explicado (M2);
  - el rótulo «esquina: se devuelv…» cortado (M5);
  - «5 + 2√4» en vez de 9 al abrir el juego de la idea 4 (M4);
  - «franjas» y «piezas del medio» en resueltos sin dibujo: solo pesa en «¿Bastan las esquinas?» (B9);
  - el 3 sin color en (x + p)(x + q) y la «varilla larga» de una cometa cuadrada (B6, B10).
- **No es hallazgo:**
  - El título «Dos números que suman y multiplican»: está aprobado tal cual en la propuesta (idea 7). La pregunta del
    Resumen y el tema («Radicales dobles») dicen de qué trata.
  - (7 − 2)² dentro de «El cuadrado de una suma»: es a propósito. Nada antes de Predice dice qué pasa con una resta
    (Gerson, 18 nov), y la regla junta las dos.
  - «conjugado» sin presentar: es término del glosario de la idea 5, sale en «Palabras de esta idea» y está subrayado
    en «Mira».
  - La raíz cúbica: viene de «Exponentes y radicales», que es el `requiere` de la unidad, y la regla de la idea 5 la
    trae porque «Ahora tú» la pide (molde §2).
  - El 12 violeta y el 6 sin color en el cubo: Gerson decidió las piezas ab² en tinta (quinta ronda).
  - «binomio» se define en Binomio de Newton por decisión de Gerson (cuarta ronda).
  - «solo se ve el paso 1»: es el primer estado de la captura.

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 13, 8 | Datos `[DF3.cubo]` en `casoCuboSP` (`:877`) y en los 5 ejemplos de nivel 3 de la idea 3 (`:977`, `:987`, `:997` con `cuboR`, `:1007`, `:1017`); generador `sumaProductoCubo` (`generador.js:805`, `:825`) y `papel.json` p7. Regla, `:1113`. Captura `cap/claro-cel-cubo-binomio-5-regla.png` | **La herramienta de todo el nivel examen de la idea 3 no está en ningún recuadro «Datos».**<br>• Los resueltos usan «las seis piezas del medio, que juntas son 3ab(a + b)», pero los datos dan 3a²b + 3ab². Nadie dice que son lo mismo.<br>• La única pantalla que la escribe es la regla, y en el celular la línea sale cortada: «a³ + b³ = (a + b)³ − 3ab(a +». En pantalla ancha sale entera.<br>El lector en frío se perdió justo ahí (ejemplo 09). Con lo que se ve en el celular, el alumno no tiene la herramienta. | Agregar `DF3.sumaSP: 'a³ + b³ = (a + b)³ − 3ab(a + b)'` y su resta (`a³ − b³ = (a − b)³ + 3ab(a − b)`) a esos datos, también en el generador (`D.cuboSP`). En la regla, partir esa línea con su propio `SEP` o achicar la ecuación en el celular (ver «Reglas que faltan»). |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | Molde §3 (niveles) | Idea 1: «Suma y producto», nivel 2 (`:240`), y «Sin conocer los números», nivel 3 (`:276`). Idea 2: «Una resta sin cuadrados», nivel 1 (`:586`), y «Una resta de cuadrados grandes», nivel 2 (`:624`). Idea 5: «El lado de una cometa» y «Se simplifica», nivel 1 (`:1593`, `:1604`), contra «La cometa grande» y «Un número con la raíz», nivel 2 (`:1651`, `:1635`) | **Tres pares repiten la cuenta y solo cambian los números.**<br>• a + b = 9, ab = 20 contra a + b = 7, ab = 12: el nivel 3 solo agrega alternativas.<br>• 7² − 3² contra 75² − 25².<br>• La cometa de 3 m contra la de 4 m (la «simplificación» ya estaba en 6/√3), y 6/√3 contra 3/(2√3).<br>El lector en frío lo vio en racionalizar («13 y 14 casi iguales»). | Nivel 3 de la idea 1: «a − b = 3 y ab = 10: ¿a² + b²?» o «¿(a − b)²?», que cruzan las dos fórmulas. Nivel 2 de la idea 2: 75² − 25² dividido entre 50 · 100, o «x² − y² = 40 con x + y = 10: ¿x − y?». Nivel 2 de la idea 5: la cometa con un número delante (lado de 6/√3) o 2/(3√2). |
| M2 | 10, 13 | Ejemplo «Suma y producto» de la idea 3 (`:974`–`:982`) | «La B quita 3ab sin multiplicar por a + b», pero 125 − 3 · 3 = **116**, y la B es **110**. 110 sale de quitar ab(a + b) = 15 una sola vez, que es TAL-CUBO-TRES. El alumno que comprueba la cuenta no la encuentra. | «La B quita ab(a + b) una sola vez, no tres» (o cambiar la B a 116 y dejar el texto). |
| M3 | Molde §3 (regla del dibujo, 18 nov) | Ejemplo «El lado de la mesa», idea 4 (`:1261`), `ME({ x: 6, y: 2, lados: false, lado: '?' })`. Captura `cap/claro-cel-ej-radicales-dobles-01.png` | La figura rotula una plancha rectangular «√12 dm²». Ese número sale de juntar los dos datos (√6 · √2), que es justo lo que el dibujo no debe mostrar. Además el resuelto no lo usa, y la otra plancha rectangular no tiene rótulo. | `rot: { xy: false }` (sin rótulo en las rectangulares), o `'?'` en las dos si se quiere marcar que existen. |
| M4 | 7, 3 | Juego de la idea 4: `inicio: 4` y `inicio: 1` (`:1418`–`:1419`), lectura en `:1423`. Captura `cap/claro-cel-radicales-dobles-2-juega.png` | La primera pantalla del juego dice «mesa de 5 + 2√4», con la figura en «mesa: 9 dm²» y las planchas rectangulares de «2 dm²». Lo que el alumno ve primero es una raíz que no hacía falta y que contradice el dibujo. El lector en frío no entendió por qué deja la raíz. | Arrancar en x = 6, y = 2 (lejos de la misión: 8 + 2√12), o que la lectura simplifique cuando xy es un cuadrado: «5 + 2√4 = 5 + 2 · 2 = 9». |
| M5 | 8; molde §6 | `alg-objeto.js:500` (rótulo de la esquina del terreno que se cede); «Mira» de la idea 1, pasos 3 a 5, y la regla (`MIRA_CEDE`, `:320`). Captura `cap/claro-cel-cuadrado-suma-5-regla.png` | El rótulo «esquina: se quitó 2 veces» o «se devuelve 1» empieza en x = 226 de un lienzo de 320, con unos 170 px de texto: se sale unos 70 px. En el celular se lee «esquina: se devuelv…». La prueba numérica de la pieza pasa porque ese texto no está en `geometria().textos`: se dibuja directo con `texto()` y no se registra. | Rótulo corto en dos líneas bajo la esquina («esquina» / «× 2» o «+ 1»), y registrarlo en `geometria` para que la prueba lo mida. Prueba: el número de `<text>` del SVG es igual al de `geometria().textos`. |
| M6 | 13 (datos legibles) | `DF4.rd` (`:1169`) y generador `D.rd` (`generador.js:152`); sale en los datos de toda la idea 4 y del papel p3 | «√(A + 2√B) = √x + √y, si x + y = A y x · y = B»: la conjunción «y» se pega a la variable y. El lector en frío lo leyó tres veces. | «…, cuando x + y = A, con x · y = B» (o en dos líneas: «x + y = A» / «x · y = B»). |
| M7 | 3 | Regla de la idea 2 (`:768`–`:770`): p y q. Regla de la idea 3 (`:1114`): ± y ∓. Regla de la idea 4 (`:1456`, `:1459`): ± y C | Cada símbolo debe decirse en palabras en la misma pantalla.<br>• p y q de (x + p)(x + q) aparecen por primera vez en la regla, sin decir qué son. «Lee», «Juega» y «Mira» nunca muestran ese producto.<br>• ± y ∓ no se explican.<br>• C solo sale en «√C = 2√(C/4)».<br>Lo marcó el lector en frío en las tres reglas. | Idea 2: «En (x + p)(x + q), p y q son los números que acompañan a x en cada factor». Idea 3: «± se lee “+ o −”; ∓, el signo contrario». Idea 4: «Si la raíz chica no tiene el 2 delante, se lo pone: √40 = 2√10». |
| M8 | Molde §3 (niveles), 2 | Idea 3: «Suma de cubos», nivel 2 (`:950`), contra «¿Bastan las esquinas?», nivel 1 (`:919`) | El nivel 2 es reemplazar en la fórmula que da Datos (a = x, b = 2). Es más corto que el nivel 1, que pide tres cuentas y comparar. Lo dijo el lector en frío. | Nivel 2: «Factoriza 27x³ + 1» o «x³ + 8y³» (dos pasos: ver los dos cubos y reemplazar). |
| M9 | 10 | Cometa: `resuelve` con varillas de 1 a 8 m (`:1812`); generador `cometa`, de 2 a 9 m (`generador.js:1064`); ejemplos de 3 m y 4 m. Taco: generador `taco` con arista de hasta 10 dm (`:701`); juego y «Lee» de 5 dm | «En agosto, en Puno, los chicos hacen volar cometas» con varillas de 8 y 9 m no es creíble: la del «Lee» mide 1 m. Un «taco» de madera de 50 cm a 1 m de arista pesa de 60 kg a media tonelada. | Varillas de 6 a 15 dm (o de 1 a 2 m). Taco en cm (de 5 a 12 cm de arista), o llamarlo «bloque» si queda en dm. |
| M10 | Glosario; 4f (la misión no se regala) | Glosario «radical doble», ejemplo 2 (`:1996`) | «√(8 + 2√15) = √5 + √3, porque 5 + 3 = 8 y 5 · 3 = 15» es la misión del juego de la idea 4 (8 + 2√15 → planchas de 5 y 3), resuelta. El término sale en «Palabras de esta idea», antes de jugar. | Otro radical: «√(7 + 2√10) = √5 + √2, porque 5 + 2 = 7 y 5 · 2 = 10». |
| M11 | 13, 5 (§5b), 9 | `plantillas/cuadrado-crece/papel.json` p1, p2, p4 y p10, asignados a la unidad en `nucleo/repaso-tipos.js:114`. La escena `cuadrado-crece/index.html:21` | • Ninguno de los cuatro problemas trae datos. Por ejemplo, p2 «99² escribiendo 99 como 100 − 1» y p4 «a + b = 9 y ab = 20» no dan la fórmula.<br>• La escena, que el catálogo lista en la unidad, pinta a azul, b naranja y ab² verde. Es al revés del mapa de la unidad (a naranja, b turquesa) y usa el verde, que §5b saca de esta paleta.<br>• Su paso 4 predice (x − 3)², que es la resta que la idea 1 reserva para su Predice. | Que el repaso de la unidad use solo `productos-notables` (como se hizo con Exponentes y radicales) o dar «Datos:» a los cuatro. Mandar la escena a «Más mesas del tema» hasta rehacerla con la paleta de la unidad. |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| B1 | Opciones (molde §2) | Los 25 ejemplos de nivel 3 | Quedan **34 de las 100 alternativas incorrectas sin explicar**:<br>• idea 1: √34 y 6; 1; 25 y 6 + 2√5; 10; 23 y 7;<br>• idea 2: 7; 8x³ y 2x⁴ + 2; 4,5; 10 y 2x + 2; −2 y 1999;<br>• idea 3: 1; 30; 26;<br>• idea 4: 0; √2 y 0; 2√7 + 2√5 y 4√35; 4 − √6;<br>• idea 5: √5 y 2√5 + 4; √2 y 2√6; (∛3 + ∛2)/5 y ∛9 + ∛4; 1 y √2; 1/3.<br>En «Una resta que da entero» (`:1348`), además, «la B reparte la raíz» no da √3, y «la E saca el 2 y lo deja afuera» no da 2√2 + 1. | Una línea por trampa, como ya tiene «Cuadrados y cubos» (`:1014`). Si una alternativa no sale de ningún error, reemplazarla por una que sí. |
| B2 | 13 (el paso hecho, leve) | `casoNumero` (`:147`) y `casoCuboNum` (`:861`); ejemplos «Un número al cuadrado», «Con decimales», «Un número al cubo» y «Casi cien» | «48 = 50 − 2» va en datos, y elegir esa descomposición es parte de lo que se practica. Además es incoherente: `casoCercanos` (idea 2) y los tipos `numero` y `numero-cubo` del generador no la dan. El lector en frío lo notó («aquí no me dan el 60»). | Quitarla de los datos (la fórmula basta) o darla en todos los casos. Mejor quitarla, como en el generador. |
| B3 | 4e («Así se resuelve» ≠ «Ahora tú») | Idea 4: `resuelve` (`:1464`) y `casoRD` sin menos (tipo 0) | La mesa de A + 2√B dm² pide «dos números que sumen A y multipliquen B» y el lado √x + √y. Es la misma cuenta que «¿A qué es igual √(A + 2√B)?», sin la mesa. En la idea 5 pasa algo parecido con la cometa (d/√2) y `casoUnaRaiz` (K/√A). | Que el resuelto de la idea 4 pida el perímetro o el área de una plancha rectangular, o que el tipo 0 de «Ahora tú» sea siempre con un número delante. |
| B4 | 4f (voz) | `voz` de «Ahora tú»: idea 1 (`:437`) «revisa los signos»; idea 2 (`:796`) «Busca la suma y la diferencia de los mismos dos términos» | La voz es fija para los 5 tipos. «Revisa los signos» sale en (2x + 7)², que no tiene ninguno, y «la suma y la diferencia» sale en (x + 5)(x − 4) y en x⁴. Lo notó el lector en frío. | Voces generales («Dos cuadrados y dos franjas: no te olvides de ninguna»; «¿Qué dos términos se repiten?»), o una `voz` por caso. |
| B5 | Notación | La teoría usa «∛» (regla de la idea 5, `casoCubica` y ejemplos). El generador usa «³√» (`generador.js:88`), «porque ∛ en el celular sale con otra letra» | La misma raíz se escribe de dos maneras en la unidad. En las capturas de la teoría el ∛ se ve bien. | Una sola forma. Si el motivo del generador ya no vale, ∛ en los dos; si vale, ³√ en la teoría. |
| B6 | 5 (§5b) | `BALD_XPQ` (`:559`), ejemplos «Un rectángulo de piezas» y «Signos distintos», `casoXPQ` y generador `xpq` | p va turquesa y q en tinta. Está declarado en la cabecera para la mesa, pero en los ejemplos el «3» de (x + 3) se lee como un olvido (lector en frío, 05). | Decir en la leyenda o en el resuelto que q va en tinta («q, el otro número, en negro»), o darle un color de la tabla. Consultar a Gerson. |
| B7 | 5 (§5b) | Teoría: el total y lo pedido en tinta (cabecera, `:27`). Generador: el resultado en violeta (`VARS.R`, `generador.js:114`) | La misma magnitud (el área del terreno nuevo, a³ + b³) va en tinta en la teoría y en violeta en la práctica. | Que el generador use tinta para el resultado, o que la cabecera de la teoría diga que la práctica lo resalta en violeta. |
| B8 | 4f | Idea 1: tarjetas 1 y 2 de «Lee» («El lado nuevo mide 10 + 2», con franjas de 2 m en la figura) y glosario «doble producto» («En (10 + 2)²…») | La misión «Amplíalo hasta 144 m²» ya está resuelta en «Lee»: b = 2. El juego conserva su valor (contar las piezas), pero la misión queda sin búsqueda. Es texto aprobado por Gerson (cuarta ronda). | Misión 169 m² (b = 3) con el mismo «Lee», o «Lee» con franjas de 3 m. Consultar a Gerson. |
| B9 | Molde §3 | «¿Bastan las esquinas?», idea 3 (`:919`) | El resuelto habla de «las seis piezas del medio: 3 · 4 + 3 · 2» sin figura y sin el «· 1». El lector en frío se perdió ahí. | Figura `TA({ a: 2, b: 1, abrir: 1 })` sin totales, y «3 · 2² · 1 + 3 · 2 · 1² = 12 + 6». |
| B10 | 10 | «Lee» de la idea 5, tarjeta 1 (`:1729`) | «Su varilla larga, de punta a punta»: en una cometa cuadrada las dos diagonales son iguales. | «Una de sus varillas, de punta a punta». |
| B11 | Notación | Ejemplo «Las piezas del taco», idea 3 (`:908`) | Pregunta por «cada pieza a²b», pero el enunciado no dice que a = 3 y b = 1. Solo lo dice el color (WCAG 1.4.1). | «…de arista a + b = 3 + 1 dm…». |
| B12 | `siFuera` | `casoCubica` (`:1562`) | «∛A · ∛A no da A: faltan tres factores». Faltan uno; hacen falta tres. El generador lo dice bien (`generador.js:1147`). | «hacen falta tres factores; con dos no alcanza». |
| B13 | App | Condición de las reglas 1, 2 y 3 (`:411`, `:771`, `:1115`) | Se lee «Vale si Vale para todo a y b…». | «Para todo a y b, también negativos…», o que la app no ponga «Vale si» cuando el texto ya empieza con «Vale». |
| B14 | Molde §7 (pendiente conocido) | `app/practica.js` | La app pasa `{ unidad }`, no `{ idea }`. `TIPOS_POR_IDEA` existe, pero la práctica mezcla las 5 ideas. Es el pendiente de Exponentes (B19), trigonometría y Numeración. | El arreglo de la app que sigue pendiente. |

## Lo que está bien y hay que copiar al molde

- **Cuentas limpias.** 261 respuestas rehechas aparte y ninguna mal. Cada constante de ejemplos dice qué cuentas se
  revisaron y en qué script. El generador recalcula en su test y `casos.json` está verificado aparte.
- **Las predicciones protegidas en toda la unidad, también en la práctica.** El generador devuelve `null` en los casos
  de las 5 predicciones, también escritas de otra forma: 7 − 4√3 es 7 − 2√12 (`generador.js:1039`). Además excluye el
  taco del juego. Es justo lo que le faltó a Exponentes (M4) y está hecho desde el principio.
- **Un objeto por idea, con un hilo** (terreno, triplay, taco, mesa, cometa: áreas y volúmenes de piezas que se arman),
  y la figura de los ejemplos sin la respuesta: «? m²», «lado: ? dm», «?» en las piezas pedidas.
- **Regla del molde §2 cumplida:** cada línea de cada regla tiene su tipo en «Ahora tú». «Ahora tú» llega a examen,
  con preguntas de San Marcos citadas (2024-I, 2025-I, 2026-I).
- **Un color por magnitud con su prueba** (`COLORES` y `ficha`). Las decisiones de Gerson (ab² en tinta, sin verde ni
  carmín) están escritas en la cabecera. La letra de la alternativa va en negrita violeta con U+2060 para que no salga
  en cursiva.
- **Generador modelo para la práctica por idea:** `TIPOS_POR_IDEA`, `NIVEL`, `elegirErrores`, que evita que la correcta
  quede en el centro o en un extremo (anti-adivinanza), y explicaciones que empiezan por lo que el alumno hizo bien y
  muestran el valor de su error.
- **Datos como fórmula general**, con la fórmula entre las que se elige cuando se practica elegir (suma y diferencia de
  cubos juntas en `casoSumaCubos`; `D.cuad` y `D.cuadR` en Legendre).

## Reglas que faltan en el contrato o en el validador

| Regla | ¿Automática? |
|---|---|
| **Toda identidad que escribe un resuelto está en sus datos** (A1). Para cada línea de `regla.ecuacion`, si la ecuación de una solución contiene su expresión propia (p. ej. «3ab(a + b)»), los datos de ese ejercicio deben traer esa línea. Habría encontrado los 5 ejemplos de nivel 3, `casoCuboSP` y el generador. | Semi (por subexpresiones) |
| **Ninguna ecuación se corta en el celular** (A1): con Playwright a 390 px, en «La regla», Datos y resueltos, cada `.ec` cumple `scrollWidth ≤ clientWidth`. Si no, se parte por `SEP` o se achica. | Sí (Playwright) |
| **Todo texto de una pieza entra en su prueba numérica** (M5): el número de `<text>` del SVG es igual al de `geometria().textos`, y cada uno queda dentro del lienzo con 4 de margen. | Sí |
| **Cada alternativa incorrecta de nivel 3 se explica** (B1): su letra aparece en el resuelto. Con un `valorDe` opcional por letra, además, se comprueba que la explicación dé ese valor (M2). | Sí (letra); semi (valor) |
| **Niveles que suben** (M1, M8): normalizar los enunciados de una idea (números → #) y avisar si dos de niveles distintos quedan iguales. Por ejemplo, «Si a + b = # y ab = #, ¿cuánto vale a² + b²?» sale en los niveles 2 y 3. | Sí (aviso) |
| **Los símbolos de la regla están dichos en palabras** (M7): cada letra o signo de `regla.ecuacion` y `condicion` (p, q, C, ±, ∓) aparece en la leyenda de la idea o en el texto de la regla. | Sí |
| **El glosario de la idea no trae la misión cumplida** (M10): el cruce de `leyendaSinRespuesta` también para `def`, `simple` y `ejemplos` de los términos que la idea estrena, y para las tarjetas de «Lee» (B8). | Sí (números) |
| **El juego no abre con una raíz exacta sin simplificar** (M4): en la grilla, avisar de «√k» con k cuadrado perfecto en la lectura. | Sí |
| **Rango creíble de las magnitudes del mundo** (M9): el generador y `resuelve` declaran el rango de su objeto (cometa de 0,6 a 2 m) y el test lo comprueba en 400 semillas. | Semi (el rango se declara a mano) |
| **Todo problema que el repaso asigna a una unidad `calidad: 2` trae datos** (M11), también el papel de escenas compartidas. | Sí |
| **Una escena listada en una unidad `calidad: 2` usa la paleta de la unidad** (M11): sus `--c-*` coinciden con `def.colores` o la escena va a «Más mesas del tema». | Semi |

## Correcciones (18 nov)

Fase 8 del método (`docs/metodo/unidad/6-correcciones.md`). Cada corrección tiene la prueba que la habría detectado:
`contenido/teoria/algebra/productos-notables.test.js` («Correcciones del 18 nov»), `nucleo/kit/piezas/alg-objeto.test.js`
(M5 y M9), `plantillas/productos-notables/generador.test.js` (A1, M6 y M9) y `plantillas/cuadrado-crece/motor.test.js`
(M11). Las respuestas que cambiaron se rehicieron aparte, sin el código de la unidad:
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/correcciones-productos/cuentas-correcciones.py`
(24 de 24 bien). Que ninguna ecuación se salga a 390 px se midió con Playwright (`medir-cortes.js` y `medir-lineas.js`, en
el mismo scratchpad): regla, «Así se resuelve» con todos los pasos, «Ahora tú», Predice y los 75 ejemplos, sin nada
que se salga. La unidad pasa a la versión 0.5.0.

| # | Qué se hizo |
|---|---|
| A1 | `DF3.sumaSP` (a³ + b³ = (a + b)³ − 3ab(a + b)) y `DF3.difSP` (a³ − b³ = (a − b)³ + 3ab(a − b)) en los datos de `casoCuboSP` y de los 5 ejemplos de nivel 3 de la idea 3 (con `DF3.medio`, 3a²b + 3ab² = 3ab(a + b), en «Suma y producto»); en el generador, `D.cuboSP` y `D.difSP` en `sumaProductoCubo` (papel regenerado: p7 la trae). La regla de la idea 3 tiene seis renglones sin ± ni ∓ (los dos cubos, las dos identidades nuevas, la suma y la diferencia de cubos) y cada lado derecho va agrupado para que el renglón se parta después del «=»: a 390 px ningún renglón pasa de 289 de 318 px (antes, 363). Pruebas: toda solución con 3ab(a ± b) trae su identidad en datos (teoría, 400 semillas de «Ahora tú» y 800 del generador) y la regla trae las dos. |
| M2 | La B de «Suma y producto»: «quita ab(a + b) una sola vez, no tres: 125 − 15 = 110». Prueba nueva: una tabla con lo que dice cada una de las 100 explicaciones de distractor de nivel 3, rehecho con números (y en x = 2 y 3 si es un polinomio), contra el valor de su alternativa. |
| M1 | Idea 1, nivel 3: «El producto escondido» (a + b = 7, a² + b² = 25 → ab = 12). Idea 2, nivel 2: «La diferencia escondida» (a + b = 10, a² − b² = 40 → a − b = 4). Idea 5, nivel 2: «El contorno de la cometa» (varilla de 12 dm → 24√2 dm) y «Una suma arriba» ((2 + √2)/√2 = √2 + 1). La prueba nueva de niveles (enunciados con los números cambiados por #1, #2…) encontró dos repeticiones más, que también se cambiaron: «Casi cien» (99³, la forma de 11³) pasó a «Dos cubos casi iguales» (101³ − 99³ = 60 002) y «El orden importa» (√(9 − 2√14), la forma del nivel 2) pasó a «Un producto de radicales dobles» (√(9 − 2√14) · √(9 + 2√14) = 5). |
| M8 | «Suma de cubos con dos letras»: factoriza x³ + 8y³ (hay que ver que 8y³ = (2y)³). |
| M3 | «El lado de la mesa»: `rot: { xy: false }`, las planchas rectangulares sin rótulo. Prueba: la figura no muestra √12. |
| M4 | El juego de la idea 4 abre en x = 7, y = 2 (9 + 2√14) y, cuando el producto es un cuadrado, la lectura saca la raíz: «mesa de 5 + 2 · 2 = 9». Prueba: ninguna lectura de la grilla trae √k con k cuadrado, y el inicio no es la misión. |
| M5 | `alg-objeto`, terreno que se cede: el rótulo de la esquina va en tres renglones («esquina:», «se quitó», «2 veces» o «se», «devuelve») junto a la esquina, y entra en `geometria().textos`. Prueba: el número de `<text>` del SVG es el de `geometria().textos` en todas las muestras y figuras de la teoría de las dos unidades, y el terreno cabe con 4 de margen. Exponentes y radicales, en verde (34 de 34). |
| M6 | «√(A + 2√B) = √x + √y, si x + y = A, x · y = B», en la teoría y en el generador (papel p3 regenerado). |
| M7 | Idea 2: la condición dice «en (x + p)(x + q), p y q son los números que acompañan a x» (la regla tiene tope de 30 palabras). Idea 3: sin ± ni ∓. Idea 4: «El signo ± es «más o menos»: el mismo en los dos lados» y la condición «Si la raíz chica no tiene el 2 delante, se lo pone: √40 = 2√10» (sin C). Prueba: cada letra de la regla se dice en su texto, su condición o la leyenda, y ± o ∓ se explican. |
| M9 | El taco va en cm en toda la idea 3, en la pieza (unidad por defecto `cm`) y en el generador (arista de 10 cm a lo más). Las cometas de los ejemplos y de «Así se resuelve» van en dm (de 6 a 15 dm), el juego de 1 a 2 m, y el generador de 6 a 15 dm. La pieza corre la cometa a la derecha cuando el rótulo de la varilla es largo («12 dm»). |
| M10 | El ejemplo del glosario de «radical doble» pasa a √(7 + 2√10) = √5 + √2. Prueba: ni el glosario ni «Lee» de la idea traen 8 + 2√15 ni √5 + √3. |
| M11 | La escena es compartida (Exponentes y radicales, Productos notables y Factorización): p1, p2, p4 y p10 traen «Datos:» con su fórmula. Prueba en `motor.test.js`. **Pendiente para Gerson:** la paleta de la escena (a azul, b naranja, verde) y su paso 4, que predice (x − 3)²; mandarla a «Más mesas del tema» (`"rehacer": true`) la mueve en las tres unidades. |
| B1 | Las 100 alternativas incorrectas de nivel 3 se explican con el valor que da su error; las que no salían de ningún error se cambiaron por una que sí: E de «Las piezas de un terreno» (2 m, resta los rectángulos), D y E de «El lado de antes» (23 y 20), E de «Con raíces» (5 + 2√5), E de «Cuartas potencias» (2), E de «Una diferencia constante» (−2x), E de «Al revés» (6), E de «Diferencia y producto» (38), las cuatro de «Una resta que da entero», C de «Con número delante y resta» (√15 − 1) y, en la idea 5, la D de las dos sumas y restas con conjugados, la E de «Resta con conjugados» y de «Un número y su inverso», y la C de «Un radical doble abajo». Pruebas: cada letra incorrecta aparece en el resuelto y su valor cuadra (la de M2). |
| B2 | Sin «31 = 30 + 1», «2,1 = 2 + 0,1», «11 = 10 + 1», «99 = 100 − 1» ni «N = M ± d» en datos (`casoNumero`, `casoCuboNum`). Prueba. |
| B3 | Pendiente: «Así se resuelve» de la idea 4 sigue pidiendo las planchas y el lado. |
| B4 | Voces generales: «Dos cuadrados y el doble producto: no te olvides de ninguno»; «¿Qué términos se repiten en los dos factores?». |
| B5 | La teoría escribe la raíz cúbica con el signo de raíz y el índice 3 en turquesa (`c3`, magnitud «índice» en `def.colores`; Gerson, quinta ronda), como Exponentes y radicales; el generador sigue con «³√» y el ³ turquesa. El factor que vale 1 con raíces cúbicas va con su llave violeta («vale 1»). |
| B6 | «p es 5 y q es 3 (q va sin color)». |
| B7 | La cabecera de la teoría dice que la práctica resalta el resultado en violeta. |
| B8 | Sin cambio: texto aprobado (cuarta ronda); queda para Gerson. |
| B9 | «¿Bastan las esquinas?» trae el taco abierto de 2 + 1 cm (sin volúmenes) y «3 · 2² · 1 + 3 · 2 · 1² = 12 + 6 = 18». |
| B10 | «una de sus varillas, de punta a punta» en «Lee», los ejemplos, el generador y el texto alternativo de la pieza. |
| B11 | «de arista a + b = 3 + 1 cm». |
| B12 | «Pero dos raíces cúbicas de A no dan A: hacen falta tres». |
| B13 | Las condiciones empiezan por «a y b son cualquier número…» (la app antepone «Vale si»). Prueba. |
| B14 | Pendiente: es de `app/practica.js` (pasar `{ idea }`), fuera de alcance. |

**Del lector en frío** (lo que la auditoría confirmó): los resueltos de la idea 1 sin dibujo ya no hablan de «franjas»
(dicen «el doble producto, 2ab»; prueba), «¿Bastan las esquinas?» tiene su dibujo, el paso 3ab(a + b) está en datos y
en «Mira» («Las seis del medio, con 3ab de factor común»), «El perímetro de la mesa» explica por qué multiplican 35, y
los niveles de cubos y de racionalizar suben (M1, M8).

**Encontrado al corregir:** `txt()` (la que compara opciones) devolvía '' para fracciones y raíces, así que dos opciones
con fracción se tomaban por iguales y «Ahora tú» de racionalizar solo salía con respuestas sin fracción (11/√11, 4/√2).
Ahora las cuenta. Las soluciones de nivel 3 con cuatro explicaciones se partieron en dos renglones (tope de 30 palabras).

Capturas `--entera` (momentos, ejemplos y glosario, 390 px):
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/correcciones-productos/cap/`.
