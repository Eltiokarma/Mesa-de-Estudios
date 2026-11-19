# Auditoría de contenido: «Polígonos y cuadriláteros» (geometria.poligonos-y-cuadrilateros)

19 nov 2026. Auditor externo con criterio delegado (cierre de la Etapa 6, `docs/metodo/unidad/cierre-delegado.md`), que no
escribió la unidad. Contrato: `docs/plan-calidad.md` §3 y §5. Formato: `docs/teoria.md` 4e, 4f, 4h, 4i y §5. Vara:
`docs/molde-unidad.md` §10. Reglas automáticas: `docs/metodo/unidad/reglas-validador.md`, y la lista «Lo que encontraron los
auditores de la Etapa 5» de `docs/metodo/unidad/etapa-delegada.md`. Decisiones: `docs/etapa6/propuesta-geometria.md` (§9,
decisiones 1 a 24). Lo que vieron los dos lectores en frío está en `rutinas/frio/geometria.poligonos-y-cuadrilateros.md`;
aquí se cita cuando el código lo confirma o lo agrava.

**Qué se revisó.**
- La teoría `contenido/teoria/geometria/poligonos-y-cuadrilateros.js` (v0.3.0, sin `calidad: 2`): 6 ideas con sus 7
  momentos, los 90 ejemplos, «Ahora tú» (30 tipos) y «Así se resuelve», el glosario (20 términos), las 3 mesas.
- El bloque `parcela` de `nucleo/kit/piezas/geo-objeto.js` (terreno, plaza, geoplano y canal) y lo que la unidad usa del
  `armazon` y de la figura de examen `angulos`.
- La práctica `plantillas/geo-poligonos-cuadrilateros/`: 20 tipos en las 6 ideas, `casos.json` (20) y `papel.json` (8).
- La app a 390 px con `--entera`: los 42 momentos y los 90 ejemplos (servidor propio en el puerto 4413). Capturas en
  `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e6-cierre-pol/lector/`.

**Cuentas.** Rehechas con scripts propios en
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e6-cierre-pol/aud/`. De la unidad y del generador
solo leen el texto (y, en `figuras.js`, las coordenadas de la figura): cada respuesta sale del enunciado por fuerza bruta o
construyendo la figura y midiéndola, nunca con la fórmula de la unidad.
- `ahora.js`: **2 400 casos de «Ahora tú» y 2 400 de «Así se resuelve»** (400 semillas por idea) y **8 028 de la práctica**
  (400 por tipo, los 20 de `casos.json` y los 8 del papel). La suma de los interiores sale de medir los ángulos de un
  polígono inscrito irregular; las diagonales, contando pares no vecinos; los lados desde un total, buscando el n que lo
  da; el hexágono equiángulo, caminando con giros de 60° hasta que cierre; las bisectrices de C y D, cortando las dos
  bisectrices de un cuadrilátero construido y midiendo CED; paralelogramo, rombo, rectángulo, cuadrado con equilátero y
  trapecio, con coordenadas; «el nombre más preciso», recorriendo los paralelogramos que cumplen lo dicho. Por caso: una
  sola correcta, que ningún distractor valga la respuesta y opciones distintas. **0 fallas.**
- `figuras.js`: **1 024 figuras** (juegos en toda su grilla, Lee, Predice, Mira, ejemplos y 400 semillas de «Así se
  resuelve» y «Ahora tú»): **3 349 ángulos rehechos por coordenadas** contra su `mide` (0 diferencias); los 28 rótulos de
  ángulo de figuras a escala contra lo que miden (0 falsos); en las figuras sin escala, el «?» lejos de la respuesta (0
  fallas); si una figura a escala deja medir lo pedido (ángulo, o largo con la escala de sus rótulos); **737 rótulos de
  lado**: si van sobre lo que miden (M1, M2) y a una sola escala; y las construcciones: cordeles n − 3 y parcelas n − 2 que
  cubren el terreno, ligas n − 3 del clavo marcado y las 35 de GEO10, cada giro de la plaza = 180° − su interior, M, N, P y
  Q puntos medios con MN = semisuma y PQ = semidiferencia medidos, O en el medio de las diagonales, rombos con diagonales
  perpendiculares, E en las bisectrices dibujadas, el hexágono con sus seis 120° y el triángulo de afuera equilátero.
- `repite.js`: «Así se resuelve» contra los ejemplos y «Ahora tú» contra «Así se resuelve», en 400 semillas.
- A mano: **los 90 ejemplos**, con sus 30 de nivel 3 y la explicación de **cada alternativa** (rehecha con la cuenta del
  error), y **las 6 predicciones con cada distractor** (900° = 5 · 180°, 720° = 4 · 180°; 250° = 540° − 290°, 72° y
  110°; 70 = 10 · 7, 45 = 10 · 9 ÷ 2; 7 m, 6 m y 2 m). Las 90 respuestas cuadran; las explicaciones falsas, en M10.
- Igualdades: el validador con `calidad: 2` y **400 semillas** (`igualdad-falsa` y las demás) y la prueba propia de la
  unidad (más de 2 000 cuentas «a op b = c»): ninguna falsa.

Validador con `calidad: 2` simulada (`Teoria.problemas`, 400 semillas): **0 problemas, 0 pendientes.**
`herramientas/ecuaciones-ancho.js`: todo cabe (58 pantallas). Pruebas propias antes de corregir: unidad 15 de 15,
generador 10 de 10, `geo-objeto` en verde. Ninguna de las faltas de abajo la ve una regla de hoy.

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 13, 4h | Idea 2, ejemplo 11 «El hexágono equiángulo» | «Al prolongar AB, CD y EF sale un triángulo. ¿Cuánto mide su perímetro?»: «su» se lee como el del triángulo (24 cm, que es una alternativa); la respuesta es el del hexágono (17 cm). «Ahora tú» y la práctica sí dicen «del hexágono». | «¿Cuánto mide el perímetro del hexágono?». |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 3, molde §3 (lección M10 de Congruencia) | Idea 4: ejemplo 9 y «Ahora tú» tipo 3 (80 de 400), `figBisA` | La medida de BC («12 cm») va sobre el tramo BE (en t = 0,28 o 0,5; E en 0,70): se lee BE = 12 cm. El «?» de EC, al lado. | El rótulo dice el lado: «BC = 12 cm», «EC = ?». |
| M2 | 3, 8 | Idea 6: Predice, revelar, Mira 4 y 5 y La regla (`figCanalPQ`) | «?» y «3 m» de PQ quedan en el centro de MN (PQ está en el medio de MN): el lector B leyó «MN = 3 m» y «¿cuánto mide MN?» (7 m es una opción). En la regla, MN y PQ van violeta en la fórmula y en tinta en el dibujo. | «PQ = ?», «PQ = 3 m»; MN y PQ en tinta en la fórmula. |
| M3 | 3, 8 | Rótulos de ángulo junto a otro vértice (`figuras.js`): idea 2, ejemplos 2 («75°» de C a 34 px de D) y 14 (cuatro de cinco giros junto al vértice siguiente); idea 1, «Así se resuelve» (135° de B junto a C, lector A); idea 4, ejemplos 6 y 13; idea 6, ejemplo 8; el juego del mototaxi con 6 o más esquinas y el marco | El rótulo de un exterior va por su bisectriz, que corre junto al lado siguiente; en un hexágono de 320 px queda junto al otro vértice, y el arco crece hasta él. Lector B, tarjeta 06: «C sin arco, D con dos, 55° y 60° junto a E: no pude saber qué ángulo es de qué vértice». | De varias formas, la primera con cada rótulo más cerca de su vértice que de otro punto con letra; donde ninguna sirve, marcas sin número (el enunciado ya da los valores sin vértice); una prueba. |
| M4 | Molde §2, 4h | Idea 1, «Así se resuelve» (lados desde la suma) | Con 9 y 15 lados repite los ejemplos «Lados desde la suma» (1 260°) y «La suma de un examen» (2 340°, nivel 3) en 37 de 400 semillas por firma y el doble contando el de nivel 3; con 12 lados, un «Ahora tú» (7 de 400). | Lista sin 9, 12 ni 15 lados; prueba en 400 semillas. |
| M5 | 4h, 8 | Idea 5, ejemplo 8 «La diagonal corta del rombo» y «Ahora tú» tipo 3 (`figRombo`) | Con m∠A = 64° se dibuja de 100° (la única de tres formas con el «?» lejos): BD se ve como la diagonal larga y el título dice «la corta» (lector B, tarjeta 14). | La esquina se dibuja aguda si el enunciado la da aguda, a 8,5° o más de la respuesta; prueba. |
| M6 | 4h, molde §3 | Idea 5, ejemplo 14 «Dos cuadrados encajados» (San Marcos 2026-II) | Sin dibujo: el lector B no vio cómo cada lado de 14 cm se parte en 3k y 4k («la que más lo necesita»). | Dibujo sin escala (el vértice de adentro parte el lado 3 a 1), con el 37° en una esquina. |
| M7 | 13 | Idea 6: «Ahora tú» tipo 2 (PQ), ejemplos «Un pedazo de la mediana» y «Los extremos de la mediana»; práctica `pq` | El enunciado dice «las diagonales cortan la mediana en P y Q»; los Datos hablan de «los puntos medios de las diagonales» y nadie dice que son los mismos puntos. El resuelto de MP usa que P es el medio de AC. | Dato: «La mediana del trapecio corta cada diagonal en su punto medio». |
| M8 | 13, molde §2 (la regla dice todo lo que se pide) | Idea 5, «Ahora tú» tipo 0 (el nombre más preciso) | Los Datos y la regla van de «rectángulo → diagonales iguales»; la pregunta va al revés (lector B: «dudé si podía usarlos así»). | La recíproca en la condición de la regla y en los Datos. |
| M9 | 4h, regla 4 de la Etapa 5 | Predice de las ideas 1 y 3 | Idea 1: «Los ángulos que se juntan alrededor de O forman una vuelta: 360°» casi dice que se resta (lector A). Idea 3: «Cada liga une dos clavos» con la voz «¿La liga de A a E también sale de E?» dicen que se divide entre 2. | Idea 1: «Una vuelta entera mide 360°». Idea 3: solo «Del clavo A salen 7 ligas» y una voz neutra. |
| M10 | 10, molde §2 | Explicaciones de alternativas (rehechas a mano) | Idea 4, ejemplo 15: «72 cm cuenta dos veces BC» (72 = 4 · 18; con BC dos veces más sería 90). Idea 6, ejemplo 14: «la mayor es la mitad de la suma más la diferencia» se lee 15 + 10 = 25, que es una alternativa (lector B); y «suman 30 y se llevan 10» salta el duplicar. Lo mismo en el ejemplo 7. | «72 cm, los cuatro de 18»; «las bases suman 2 · 15 = 30 cm y se llevan 2 · 5 = 10 cm; se suman las dos cosas y se saca la mitad». |
| M11 | Regla 5 de la Etapa 5 | Idea 2, ejemplo 1 «La plaza de ocho esquinas» | A escala y sin aviso: el arco del giro en B mide 45°, la respuesta. | Plaza estirada, «El dibujo no está a escala». |
| M12 | 4, 3 | Idea 2, La regla (figura de «revelar») | La punteada de A se va en el corte 1 y el 70° queda sin su calle (lector A: «no sé si es el mismo ángulo que el ?»). | La prolongación sigue visible. |
| M13 | 8 | Idea 3, La regla | Las 35 diagonales de 10 clavos: «una maraña; no dice qué son las líneas negras» (lector A). | Dibujo propio: el geoplano de 6, con las 3 de A en naranja y las otras 6. |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección |
|---|---|---|---|---|
| B1 | Molde §3 | Idea 6, ejemplo 3 «La base que falta» | A escala sin aviso, pero BC (5 cm) y MN (9 cm) a escalas distintas (1,09 y 1,32 por unidad). | Sin escala y con el aviso. |
| B2 | 8 | Idea 4, ejemplo 13 | E no está en la bisectriz dibujada de B (40,6° y 44,4°). | E con AE = AB. |
| B3 | Letras | Idea 2, ejemplo 12 y «Ahora tú» tipo 4 | «4e + e = 180°» sin decir qué es e (no está en `letras`). | «Si cada exterior mide e, …». |
| B4 | Título | Idea 4, ejemplo 12 «Dos bisectrices que se cruzan» | Con BC = 15 cm > 2 · AB, no se cruzan dentro del paralelogramo. | «Dos bisectrices hasta BC». |
| B5 | 2 | Ideas 4 y 5, misiones | «(arrastra D o usa el control)» describe los botones; la del marco pide B y el control mueve A (lector B). | «hasta que la esquina B, la vecina de A, mida 110°». |
| B6 | 3 | Tarjetas 01 y 07 del lector B | «Desde un vértice salen triángulos: 12 − 2»; «8 · 5» sin decir que 5 = 8 − 3. | Redacción. |
| B7 | 10, molde §7 | Práctica `cuad-eq` | Con el equilátero de afuera, el distractor 7,5° («no hay que partirlo en dos») no sale de un error real. | Fuera. |
| B8 | 4h | Idea 1, Juega | La lectura al abrir dice «n = 5: … = 540°», y Predice pregunta por un terreno de 5 lados. | Se deja: Predice pregunta otra cosa (si depende de cómo se parte), que el juego no mostró. Decidido por la sesión. |
| B9 | 13 | «Ahora tú»: idea 2 tipo 2 (18 de 400), idea 5 tipo 1 (6), idea 6 tipo 3 | «12x + 0° = 360°», «BD = 3 · 10 + 0». | Sin el «+ 0». |
| B10 | 3 | Lector A y B, menores | «como en Triángulos» en Lee; las franjas grises sin leyenda; «equiángulo» sin estar en la regla; «el fondo corrido» sin decir a dónde; voz de Mira de la idea 4 que habla del cordel que no está; «Cuenta puntas de liga, no ligas». | Redacción y leyenda. |
| B11 | 2 | Idea 5, ejemplo 1 | A escala, BD mide lo mismo que AC = 100 cm. | Se deja: es la propiedad que se aplica, como el 360° de la loseta. |
| B12 | 4 | Idea 2, Predice | El arco del «?» en A va en tinta y no en turquesa como los otros giros (lector A). | Se deja: la regla del curso pone lo pedido en tinta. Decidido por la sesión. |

## Lo que está bien y hay que copiar al molde

- **Las respuestas**: 12 828 casos de teoría y práctica rehechos aparte sin una falla, y una prueba propia que ya rehace
  cada «Ahora tú» y «Así se resuelve» desde el enunciado.
- **Fidelidad de las figuras**: cada ángulo declara `mide` y ninguno miente (3 349 rehechos); las construcciones (cordeles,
  parcelas, ligas, puntos medios, bisectrices, el hexágono) son de verdad.
- **Las figuras sin escala con el «?» lejos de la respuesta**, comprobadas en todas las semillas (decisión 19).
- **Misiones con una sola solución** y lecturas que enuncian una relación verdadera en toda la grilla.
- **Las explicaciones de los distractores de «Ahora tú»** dicen el valor que produce su error (revisadas por tipo).

## Reglas que faltan en el contrato o el validador

| Regla | ¿Automática? |
|---|---|
| **Un rótulo de largo dice de qué lado es si el lado está partido por un punto con letra o si es un tramo dentro de otro trazo** (M1, M2; segunda vez: M10 de Congruencia). | Sí: colinealidad y proyección de los puntos con letra sobre el lado; ya va en la prueba de esta unidad. |
| **Cada rótulo de ángulo queda más cerca de su vértice que de cualquier otro punto con letra** (M3). Hoy `rotulosPropios` mira solo los vértices con ángulo marcado. | Sí, en `geo-objeto` (`rotulos` da las cajas); los exteriores de un polígono de 6 o más lados en 320 px no lo cumplen nunca: ahí, marcas sin número. |
| **Una pregunta con dos figuras en el enunciado nombra de cuál es lo pedido** («su perímetro» tras «sale un triángulo», A1). | Parcial: «su/sus» + magnitud después de dos sustantivos de figura. |
| **«Así se resuelve» no repite un ejemplo** (M4): hoy `resuelve-repite` compara solo con «Ahora tú». | Sí: firma de números y pregunta contra los ejemplos de la idea. |
| **Un dato une lo que dice el enunciado con lo que dice la fórmula** (M7: «donde las diagonales cortan la mediana» y «los puntos medios de las diagonales»). | No: a mano. |
| **En una figura a escala, ningún arco ni largo mide la respuesta** (M11, B1; extiende la de Congruencia a los arcos sin «?» y a la escala de los rótulos). | Sí: ya va en la prueba de esta unidad. |
| **Una solución no escribe «+ 0» ni «1x»** (B9). | Sí: expresión regular sobre las soluciones en 400 semillas. |

## Correcciones (19 nov)

Fase 8 del método (`docs/metodo/unidad/6-correcciones.md`), junto con las notas de los dos lectores en frío (ver
`rutinas/frio/geometria.poligonos-y-cuadrilateros.md`, «Correcciones de la ronda 1»). Archivos:
`contenido/teoria/geometria/poligonos-y-cuadrilateros.js` y `poligonos-y-cuadrilateros.test.js`;
`plantillas/geo-poligonos-cuadrilateros/generador.js` y `generador.test.js` (`casos.json` y `papel.json` no cambian: ningún
tipo del papel ni de los casos se tocó en lo que comprueban). **No se tocó** el bloque `parcela` de `geo-objeto` (no hizo
falta), `app/` ni `nucleo/`. Copias de antes en
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e6-cierre-pol/antes/`.

**Pruebas.** 16 nuevas: 14 al final de `poligonos-y-cuadrilateros.test.js` («auditoría A1 … B9» y «lector en frío») y 2 al
final de `generador.test.js` («auditoría M7» y «auditoría B7»). Con los archivos de antes fallan las 16 (árbol aparte en
`scratchpad/e6-cierre-pol/antes-arbol/`). Después: unidad 29 de 29, generador 12 de 12 y `geo-objeto` en verde. Validador con
`calidad: 2` simulada, 400 semillas: 0 problemas, 0 pendientes. Recuentos aparte después de corregir: `ahora.js` 4 800 de
teoría y 8 028 de práctica, 0 fallas; `figuras.js` sin rótulos de lado sobre un pedazo ni tramos sin nombre, sin ángulo
pedido medible a escala y sin «?» cerca de la respuesta; `repite.js` sin «Así se resuelve» igual a un ejemplo ni a un «Ahora
tú» (las 14 «coincidencias» del rombo son otro problema con el mismo número: m∠A contra m∠ABC). `npm run -s catalogo`: de
esta unidad no cambia nada en `app/datos/glosario/geometria.json`. No se corrió `npm test` completo (otras sesiones
trabajando); `contenido/teoria/teoria.test.js` falla solo en unidades de otras sesiones (estática, geometría molecular,
analogías y el glosario de química).

| # | Qué se hizo |
|---|---|
| A1 | «¿Cuánto mide el perímetro del hexágono?»; el enunciado dice «es equiángulo» (tope de 40 palabras). Prueba. |
| M1 | `figBisA` escribe «BC = 12 cm» y «EC = ?». Prueba: todo rótulo de un lado partido por un punto con letra, o de un tramo dentro de otro trazo, empieza por el nombre del lado. |
| M2 | «PQ = ?», «PQ = 3 m»; la fórmula de la regla escribe MN y PQ en tinta. Misma prueba y una de la regla sin violeta. |
| M3 | Ayudantes `rotulosDeSuVertice`, `cabeBien` y `mejor`: `figAngulos`, `figGiros`, `figTrap` y los ejemplos 6 y 13 de la idea 4 prueban varias formas y usan la primera con cada rótulo más cerca de su vértice que de otro punto con letra (y el «?» a 8° o más). La plaza de ejercicio va más alta (290 px; 300 con 6 lados o más). La sexta esquina, sin número en los giros. Prueba en todos los ejercicios, salvo los pendientes de abajo. |
| M4 | «Así se resuelve» de la idea 1 sortea 19, 21, 23, 25 o 26 lados. Prueba en 400 semillas. |
| M5 | `figRombo` dibuja A de la misma clase que el enunciado, con lo pedido a 8,5° o más, y busca la forma que cabe con el rótulo junto a A. Prueba. |
| M6 | `figEncajados`: los dos cuadrados sin escala, con «14 cm» y el 37°; el enunciado avisa. Prueba. |
| M7 | Dato `D_MEDIOS` («La mediana del trapecio corta cada diagonal en su punto medio») en «Ahora tú» de PQ, en los dos ejemplos y en la práctica `pq`. Pruebas en la teoría y el generador. |
| M8 | La condición de la regla de la idea 5 dice la recíproca, y el dato `D_RECIP` va en el tipo del nombre. Prueba. |
| M9 | Datos y voces de Predice de las ideas 1 y 3 (ver la tabla del lector). Prueba. |
| M10 | «72 cm, los cuatro de 18»; los dos ejemplos de la idea 6 duplican a la vista. Prueba: las frases falsas no vuelven. |
| M11 | La plaza de 8 esquinas va estirada (`estira` en `figPlaza`), sin escala y con el aviso; el giro dibujado mide 32°. Prueba: en toda figura a escala de un ejercicio, ningún arco mide la respuesta. |
| M12 | La prolongación de A queda en todos los cortes de la plaza de doña Rosa. Prueba. |
| M13 | `regla.dibujo` de la idea 3: geoplano de 6 clavos con sus 9 ligas. Prueba. |
| B1 | «La base que falta», sin escala y con el aviso. Prueba: en las figuras a escala, los largos rotulados comparten escala. |
| B2 | E con AE = AB en la bisectriz dibujada (y la forma elegida entre seis). |
| B3 | «Si cada exterior mide e, …» en el ejemplo y en «Ahora tú». Prueba. |
| B4, B5, B6, B10 | Hechos (título, misiones sin botones, redacción de las tarjetas 01 y 07, Lee, leyenda, regla, control del fondo, voces). B10 con prueba. |
| B7 | Fuera el 7,5° de la práctica `cuad-eq`. Prueba. |
| B9 | Sin «+ 0» en las soluciones de los tipos con x. Prueba en 400 semillas. |
| B8, B11, B12 | Se dejan (decidido por la sesión, Gerson revisa después). |

### Pendiente

- **Rótulos de ángulo junto a otro vértice que no se resolvieron** (la prueba los nombra): el juego del mototaxi con 6 a 10
  esquinas (un solo giro rotulado, con su arco hasta el número, y la lectura que lo dice), el hexágono de «Así se resuelve» de
  la idea 1 (el 135° de B queda a 0,71 de su distancia a C: pasa la prueba, pero el lector A dudó y la captura casi no
  cambia), el rótulo de A en el juego del
  marco con 50° a 70°, el ejemplo 13 de la idea 4 (el 110° de D junto a E), el ejemplo 8 de la idea 6 (el 65° de A junto a
  B) y unos 8 de 400 casos del rombo de «Ahora tú» con A entre 80° y 86°. Ninguna forma probada lo logra en 320 px; mejorarlo
  pide que `geo-objeto` acerque el rótulo de un ángulo chico a su vértice (pieza compartida con Segmentos, Triángulos y
  Congruencia: no se tocó).
- **Las capturas de después** (`scratchpad/e6-cierre-pol/despues/`) dependen de que el catálogo de la app se arme: en este
  momento `construir-catalogo.js` falla por `contenido/teoria/quimica/geometria-molecular.js` (otra sesión), y el servidor da
  500 en `/app/datos/catalogo.json`. Ver el mensaje final.
- **Decidido por la sesión, Gerson revisa después:** B8 (la lectura del juego de la idea 1 dice 540° con n = 5 y Predice es
  un terreno de 5 lados: lo que se predice es si depende de cómo se parte); B11 (BD = AC a escala en el nivel 1 de la
  ventana: es la propiedad); B12 (el «?» de un giro en tinta, por la regla del curso); los ejemplos de nivel 1 cuyos Datos
  traen la fórmula que se aplica (lector B).
