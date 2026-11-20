# Auditoría de contenido: «Proporcionalidad y semejanza» (geometria.proporcionalidad-y-semejanza)

20 nov 2026. Auditor externo con criterio delegado (cierre de la Etapa 8, `docs/metodo/unidad/cierre-delegado.md`), que no
escribió la unidad. Contrato: `docs/plan-calidad.md` §3 y §5. Formato: `docs/teoria.md` 4e, 4f, 4h, 4i y §5. Vara:
`docs/molde-unidad.md` §10. Reglas automáticas: `docs/metodo/unidad/reglas-validador.md` y las listas «Lo que encontraron los
auditores» (Etapas 5, 6 y 7) de `docs/metodo/unidad/etapa-delegada.md`. Decisiones: `docs/etapa8/propuesta-geometria.md`.
Lo que vieron los dos lectores en frío está en `rutinas/frio/geometria.proporcionalidad-y-semejanza.md`; aquí se cita cuando
el código lo confirma o lo agrava.

**Qué se revisó.**
- La teoría `contenido/teoria/geometria/proporcionalidad-y-semejanza.js` (sin `calidad: 2`): 6 ideas (thales, bisectriz,
  semejanza, encajados, area-y-escala, ceva-menelao) con sus 7 momentos, los 90 ejemplos, «Ahora tú» (30 tipos) y «Así se
  resuelve» (12), el glosario (18 términos) y las 3 mesas.
- El bloque `semejante` de `nucleo/kit/piezas/geo-objeto.js` y sus muestras (`geo-objeto-semejante.muestras.json`).
- La práctica nueva `plantillas/geo-semejanza/` (24 tipos, `casos.json` con 24 casos, `papel.json` con 8) y el papel de las
  escenas viejas `ampliadora` y `geo-proporcionalidad` (a «Más mesas del tema» con `"rehacer"`).
- La reserva ps-01 y ps-02 de `catalogo/pruebas/geometria.json` (formas A y B) y su verificador.
- Lo que el autor tocó en dos unidades con `calidad: 2` o vecinas: `triangulos.js` (la tarjeta Lee «Nombres que vienen
  después» y dos comentarios) y `puntos-notables.js` (el glosario recibe «incentro»).
- `nucleo/repaso-tipos.js`, fila `geo-proporcionalidad`.
- La app a 390 px con `--entera --lector`: los 42 momentos y los 90 ejemplos (servidor propio en el puerto 4457). Capturas de
  antes en `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e8-cierre-ps/lector/` (132, md5 sin
  repetidas; 18 copias del lector en `lector/lector/`); de después, en `…/e8-cierre-ps/despues/`.

**Cuentas.** Rehechas con scripts propios en `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e8-cierre-ps/aud/`,
que no usan el código de la unidad ni los scripts del autor: de la unidad y del generador solo leen el texto y, en
`figuras.js`, las coordenadas de las figuras.
- `resolver.js` + `ahora.js`: **4 800 casos** (400 semillas de «Ahora tú» y 400 de «Así se resuelve» por idea), resueltos desde
  el enunciado: Thales tramo con tramo y la parte con el todo; la paralela en el triángulo y su recíproco; el pie de la
  bisectriz interior (BD = a·c/(b + c)) y el exterior (CE = a·b/(c − b), E más allá de C si AB > AC); sombras, espejo, AA, LAL,
  LLL (lados ordenados); la antiparalela (AD = AE · AC/AB), el puntal, el lado que se repite (AB² = AD · AC), los cruzados y el
  cuadrado inscrito; áreas con k², el lindero, perímetro y área, las raíces; Ceva con el producto de razones y **Menelao por
  coordenadas** (el triángulo armado con sus tres lados, F y D en sus lados, E como corte de la recta FD con CA, y de qué lado
  cae E). Por caso: que el triángulo exista, una sola correcta, ningún distractor que valga la respuesta, opciones distintas
  y toda igualdad «a op b = c» escrita.
- `practica.js`: **9 632 problemas** (400 por cada uno de los 24 tipos, los 24 de `casos.json` y los 8 del papel), por el mismo
  camino; además, que la explicación «X cm es …» de cada distractor dé su valor y que no nombre temas posteriores.
- `figuras.js`: **2 454 figuras** después (645 antes: muchas no tenían dibujo): juegos en toda su grilla, Lee, Predice, revelar,
  Mira, regla, ejemplos y 400 semillas de «Así se resuelve» y «Ahora tú». **1 288 pares de paralelas** marcadas (paralelas de
  verdad); **1 739 pares de ángulos** con la misma marca, iguales, y **618 rectos**; **741 pies de bisectriz interior**
  (D en BC con BD/DC = AB/AC) y **82 exteriores** (E en la recta BC, BE/CE = AB/AC, perpendicular a la interior); 82 parejas
  de semejantes (DE/AB = EF/BC = FD/CA, en ese orden); **32 Ceva** (cevianas concurrentes en P, producto 1) y **8 Menelao**
  (F, D, E alineados, producto con signo −1); 5 fotos (la grande, k veces la chica); los juegos de Thales (las dos razones
  iguales en toda la grilla) y de la rampa (AE/AC = AD/AB, puntal perpendicular). Rótulos a escala contra lo dibujado y
  figuras «sin escala» que de verdad van a escala.
- A mano: **los 90 ejemplos** con sus 30 de nivel 3 y la explicación de cada alternativa, **las 6 predicciones con cada
  distractor**, ps-01 y ps-02 en sus dos formas (36 m, 18 km, 10 cm y 10 m, con cada distractor) y el papel de
  `geo-proporcionalidad` y `ampliadora`.
- Misiones por fuerza bruta en su grilla: Thales solo AB = 50; bisectriz solo AC = 60; semejanza solo EF = 2; encajados solo
  AE = 2,4; áreas solo k = 3; Ceva, las 5 parejas con BD/DC · CE/EA = 1 (a propósito). Ninguna se cumple al abrir.
- Validador con `calidad: 2` simulada (`Teoria.problemas`, 400 semillas) y `herramientas/ecuaciones-ancho.js`; la regla del
  papel con la marca simulada (`papel-reglas.js`).

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 10, regla 1 de la Etapa 5 | Idea 6: Datos de Menelao, la regla («están alineados si vale 1»; «vale en los dos sentidos»), el glosario y el dato del generador | Con largos sin signo, el recíproco de Menelao es falso: los tres puntos medios dan 1 · 1 · 1 = 1 y no están alineados (son el caso de Ceva). La regla dice además que los dos teoremas dan «= 1» sin decir cómo se distinguen (lector B). | Menelao en un solo sentido («con F, D y E en una recta»); Ceva con «si y solo si»; la condición dice que a Menelao lo distingue el punto afuera. |
| A2 | 10, regla 3 de la Etapa 5 y 15 de la Etapa 6 | Idea 6: ejemplos «El tramo del tercer lado» (lados 10, 9 y 22) y «Dos tramos con x» (34, 10 y 7); «Ahora tú» y «Así se resuelve»: 376 de 4 800 casos (183 de los 200 «Así se resuelve» de Ceva, p. ej. 7, 3 y 26 m; 91 «Ahora tú» de Ceva y de la x, p. ej. 4, 11 y 23 cm; 99 de Menelao, p. ej. 7, 9 y 2 cm; 3 de LLL, p. ej. 3; 4,5 y 8 cm); práctica `ceva` 209, `menelao` 119 y `ceva-x` 237 de 400; `casos.json` 120 a 123 | El triángulo de lados AB = AF + FB, BC = BD + DC y CA no existe: los datos describen una figura imposible y en Menelao el punto E ni siquiera se puede construir. | Condición `existe(AB, BC, CA)` en los generadores; los dos ejemplos con otros números (AC = 11 cm; 9, 4, 2 y 3 cm). |
| A3 | 10, regla 3 de la Etapa 5 | Idea 3, ejemplo «Dos lados y su ángulo» | AB = 6, AC = 8 y m∠A = 50° dan BC ≈ 6,19 cm, no 7 cm: el triángulo con los cuatro datos no existe. | AB = 5, AC = 8, 60° y BC = 7 (que sí existe), y DE = 7,5 cm; la respuesta sigue en 10,5 cm. |
| A4 | 6 y 13, regla 6 de la Etapa 5 | Datos de semejanza (D_SEM) en las ideas 3 y 4: ejemplos, «Así se resuelve» y «Ahora tú» | «DE/AB = EF/BC = FD/CA = k» con letras que no son las del problema; en encajados choca con sus D y E: en la tarjeta 11 del lector, DE/AB = 1/2 da 6 y la respuesta es 5 (DE va con BC). Es la trampa que la idea 4 enseña a evitar (lector B, nota de la sesión). | Dato sin letras: «los lados frente a ángulos iguales van en pareja, y cada lado del grande es k veces su pareja». |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 5 (regla 5 de la Etapa 5) | Idea 4: regla, Predice, revelar y ejemplos (`figAnti`); juego, Lee y Mira (`figRampa`) | Los rótulos «AB» y «AC» van junto a DB y EC (al 78 % del lado): se leen como sus medidas. En la rampa, «AB = 5 m» queda junto a EB y «AC = 4 m» bajo DC, pegado a «3 m». | AB y AC enteros sobre una llave con la medida en el lomo (cota nueva del bloque `semejante`). |
| M2 | regla 2 de la Etapa 5 | Idea 1, ejemplo «Un tramo que se describe» | «25 cm, DF»: DF = 9 + 15 = 24 cm (lector B, tarjeta 03). | Alternativa y explicación con 24 cm. |
| M3 | 4h, regla 5 | Idea 1: «Así se resuelve» (triángulo) y «Ahora tú» (`figTres`, `figTri`) | Dibujados al revés a propósito: AM de 4 cm se ve más largo que MB de 8 cm, y «Así se resuelve» no decía «no está a escala» (lector A). | Dibujo en el orden de las medidas pero con otra razón (`tOrden`), y el aviso en el enunciado. |
| M4 | 3, molde §3 | «Así se resuelve» y «Ahora tú» de bisectriz y semejanza; tarjetas de encajados y Ceva | Sin dibujo; en los cruzados no se ve cuáles ángulos son alternos (lectores A y B; nota de la sesión). | Dibujos sin escala con el aviso: `dibBis`, `dibSombra`, `figDos`, `figTri`, `figCruz` (nueva) y el terreno; ejemplos 3, 7, 8 y 14 de encajados y 3, 8, 12, 13 y 14 de Ceva. |
| M5 | 1, 2 | Juegos de semejanza y encajados | «Mueve el sol» con un control de EF; la misión de encajados pide AD = 3 y el control mueve AE; «sube 3 m» no está en el dibujo (lectores A y B). | Misiones que nombran lo que se mueve; consigna sin la altura. |
| M6 | 3 | Idea 2, la regla | «La exterior hace lo mismo» sin presentar la bisectriz exterior; las marcas de los dos pares de ángulos en A se enciman (lector A). | Texto que la presenta; mitades exteriores más afuera (radio 34 contra 20). |
| M7 | 1, 9 | Idea 1, Predice | Con DF = 120 m, DF/AC = 1,5, el factor fijo del juego: copiar «DE = 1,5 · AB» da 45 m, la respuesta, sin usar el total. | DF = 160 m (respuesta 60 m; distractores 96, 80 y 100 m rehechos); el atajo da 45 m, que no es opción. |
| M8 | 2, 13 | Pasos que faltan (lector B: tarjetas 05, 06 y 17) | «x + 2 = 6» sin 9 · 4 ÷ 6; «BE = BC + 12» sin decir por qué E queda del lado de C; «x ÷ 2 = 1» sin 3/2 · 4/2 = 3. | El paso escrito en los tres. |
| M9 | regla 2 de la Etapa 5 | Ejemplos «El lado con x» (idea 3), «Tres triángulos por un punto» y «El lado del chico» (idea 5) | «10 y 7 suman o restan las diferencias»; «150 y 64 no salen de sumar las raíces»; «7,2 y 5 restan o parten»: valores sin el error que los produce (lector B, tarjetas 09 y 15). | Distractores con su error: 10 y 9 (restar las diferencias), 10 y 114 cm², 10 y 5 cm. |
| M10 | 3 | Idea 5: Lee y la regla | Lee muestra la «ampliación» del mismo tamaño que la foto (k = 1); en la regla «= k²» baja a otra línea y no se dice cuál es S₂ (lector B). | Lee con k = 1,5; fórmulas con espacios duros; la condición y el dato dicen que S₂ es el área de la grande. |
| M11 | 3 | Idea 6: Lee, Predice y la regla | El pozo P sin letra en Lee; «con largos» y una opción «−1» de signos nunca vistos; las letras C y B de los dos dibujos de la regla casi pegadas (lector B). | P con letra; la pregunta sin «con largos»; la opción «Depende de dónde corte la recta»; el dibujo de Menelao más a la derecha. |
| M12 | 3, 9 | Idea 4: título, Lee y la regla | «Cruzados» en el título sin ningún cruzado en Lee; el «Vale si» era una advertencia (lector B). | Lee nombra los cruzados (como una X) y hay dibujos de cruzados; «Vale si se emparejan los lados frente a ángulos iguales…». |
| M13 | 8 | Idea 3, «Así se resuelve» | Casi repite Predice (alumno de 1,6 m con 2 m de sombra; lector A). | Esa pareja queda fuera del sorteo. |
| M14 | 7 (regla 7) | `ecuaciones-ancho.js` (después de las correcciones) | El dato de Menelao se partía después de «·». | El producto al principio del dato: «todo cabe». |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección |
|---|---|---|---|---|
| B1 | 3 | Idea 1, Lee | Flechitas de paralela sin explicar (lector A). | «sus flechitas lo marcan». |
| B2 | 3 | Idea 1, Juega | Leyenda «AB primera cuadra; DE, en la avenida 2» apretada (lector A). | «AB, DE: las primeras cuadras de cada avenida». |
| B3 | 3 | Idea 1, la regla | «y al revés: misma razón, recta paralela» muy corta (lector A). | «y si los parte igual, es paralela». |
| B4 | 6 | Idea 1, Datos | «AB/BC = DE/EF» en problemas que no nombran A a F (lector B, tarjeta 01). | El dato dice qué son A, B, C y D, E, F. |
| B5 | 5 (rótulos) | Idea 2, Juega | BD y DC con color en la lectura y negros en el dibujo (lector A). | `colores: true` en el juego. |
| B6 | 3 | Mira de bisectriz y semejanza | Neri habla de una paralela que aún no está; «el chico cabe dentro del grande» con los triángulos separados (lector A). | Voces nuevas. |
| B7 | 3 | Idea 4, juego | «1,6 : 4 y … 2 : 5: las dos, 0,4» (lector B). | «AE ÷ AC = 1,6 ÷ 4 = 0,4 y AD ÷ AB = 2 ÷ 5 = 0,4». |
| B8 | 3 | Idea 6, Juega y Mira | Leyenda en desorden; «corta AB en G» con G en la prolongación de BA. | Leyenda por «salen» y «llegan»; «corta la prolongación de BA en G». |
| B9 | regla 5 | Idea 3, ejemplo «Dentro de la sombra» | Dice «no está a escala» y el poste dibujado era justo 4 veces la alumna (la respuesta). | Alumna dibujada de 1,5 (poste 3,3 veces). |
| B10 | regla 5 | 183 figuras sin escala (después) | Con algún rótulo como regla, lo pedido mide la respuesta ±5 % (coincidencia de uno de tres rótulos que no concuerdan entre sí). | Se deja: llevan el aviso y los rótulos se contradicen entre sí. Decidido por la sesión. |
| B11 | 5b | Thales, «?» en tinta | EF «?» en negro, no en turquesa (lector A). | Se deja: es la regla del curso («?» en tinta; prueba de la unidad). Decidido por la sesión. |
| B12 | 3 | Idea 3, Lee | El triángulo de la alumna sale chico (lector A). | Se deja: es la razón real 3 : 1 del juego. |
| B13 | 3 | Idea 5, Lee y juego | El paisaje de la foto parece un ícono de imagen rota (lector B). | Se deja: es dibujo de prueba (M4 del plan); Gerson decide si lo reemplaza. |

### Lo que el autor tocó fuera de la unidad

- `triangulos.js` (`calidad: 2`): la tarjeta Lee dice que incentro y excentro se explican en Puntos notables; 37 palabras, el
  validador con calidad 2 da 0 problemas y su prueba propia pasa. No rompe nada.
- `puntos-notables.js`: el glosario recibe «incentro» (con `formas` desde el catálogo). La unidad no tiene `calidad: 2`; con
  la marca simulada, su glosario entero (también incentro) pide `simple` y tres ejemplos: es lo mismo que les falta a sus
  otros términos, para su propia etapa. El catálogo arma bien el término: definido en Puntos notables y marcado en
  Triángulos, Segmentos y ángulos (en `ver`) y Puntos notables.
- `nucleo/repaso-tipos.js`: mandaba a esta unidad las variantes `incentro` y `cuerdas` de `geo-proporcionalidad`; además, el
  papel de esa escena marcaba como de Proporcionalidad el problema del incentro (p6) y el de las cuerdas (p5).

## Lo que está bien y hay que copiar al molde

- **Las figuras son fieles**: 2 454 figuras con paralelas de verdad, bisectrices que llegan a su pie, semejantes en el orden
  de los vértices, cevianas concurrentes y Menelao alineado; ningún ángulo marcado igual que no lo sea.
- **Las respuestas**: fuera de los triángulos imposibles (A2, A3), las 14 432 respuestas rehechas aparte coinciden, y ninguna
  igualdad escrita es falsa.
- **Las predicciones** tienen cada distractor con el valor de su error y ninguna figura de Predice deja medir la respuesta.
- **La regla del papel** con la marca simulada no da fallas; ps-01 y ps-02 están bien en sus dos formas.

## Reglas que faltan en el contrato o el validador

| Regla | ¿Automática? |
|---|---|
| **Todo triángulo que un enunciado describe por sus lados existe** (A2, A3): también los que salen de sumar tramos (Ceva, Menelao) y los de LAL (ley de cosenos). | Sí: el generador declara los lados en `_datos`; el validador prueba la desigualdad triangular en 400 semillas. |
| **Un teorema se enuncia en el sentido en que vale** (A1): «si y solo si» solo donde el recíproco es cierto con la convención de la unidad. | No: revisión del auditor (lista de teoremas con recíproco falso: Menelao sin signo, Pitágoras con ángulo, etc.). |
| **Un dato con letras usa las del problema o ninguna** (A4). | Sí: letras mayúsculas del dato que no están en el enunciado ni en el dibujo. |
| **El rótulo de un lado entero que tiene otro punto encima va en llave** (M1). | Sí: un `ladosRot` de AB con un punto de la figura sobre AB. |
| **Una predicción no se acierta con el factor fijo del juego** (M7). | Parcial: comparar la respuesta con el factor constante de la lectura del juego. |
| **Un dibujo sin escala respeta el orden de las medidas** (M3). | Sí: para cada par de rótulos de una misma recta, el más largo se ve más largo. |

## Correcciones (20 nov)

Fase 8 (`docs/metodo/unidad/6-correcciones.md`), junto con las notas de los dos lectores en frío (`rutinas/frio/geometria.proporcionalidad-y-semejanza.md`,
«Correcciones de la ronda 1»). Copias de antes en `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e8-cierre-ps/antes/`.

**Archivos.** `contenido/teoria/geometria/proporcionalidad-y-semejanza.js` y `.test.js`; `plantillas/geo-semejanza/generador.js`,
`generador.test.js`, `casos.json` (tres casos rehechos: 120, 122 y 123) y `papel.json` (regenerado: el dato de áreas);
`nucleo/kit/piezas/geo-objeto.js` y `geo-objeto.test.js` (compartidos: cotas, solo en el bloque `semejante`);
`nucleo/repaso-tipos.js` y `repaso-tipos.test.js` (compartidos, bloque propio); `plantillas/geo-proporcionalidad/plantilla.json`
y `papel.json` (p5 y p6); `catalogo/cursos/geometria.json` (compartido: `geo-proporcionalidad` en las fichas de Puntos notables
y Relaciones métricas). **No se tocó** `triangulos.js`, `puntos-notables.js`, `app/` ni `nucleo/teoria.js`.

**Pruebas.** 10 nuevas en la unidad («auditoría …» y «lectores …»), 1 en el generador, 1 en `geo-objeto` y 1 en
`repaso-tipos`: con los archivos de antes fallan las 13 (árbol aparte en `…/e8-cierre-ps/antes-arbol/`; la de repaso, con la
tabla de antes). Después: unidad 20 de 20, generador 12 de 12, `geo-objeto`, `repaso-tipos`, `catalogo`, `papel-reglas`,
`papel-generador`, `catalogo/pruebas`, `geo-proporcionalidad`, `triangulos` y `contenido/teoria/teoria.test.js` en verde.
Validador con `calidad: 2` simulada, 400 semillas: 0 problemas, 0 pendientes. `ecuaciones-ancho.js`: todo cabe (59 pantallas).
Todas las figuras de 400 semillas caben (`escenaCabe` y la prueba de letras de `geo-objeto` con 400 semillas). Recuentos
aparte después: `ahora.js` 4 800 y `practica.js` 9 632 sin una falla ni un triángulo imposible; `figuras.js` sin fallas de
geometría.

| # | Qué se hizo |
|---|---|
| A1 | Menelao en un solo sentido (dato, regla, condición, glosario y generador); Ceva con «si y solo si». Prueba. |
| A2 | `existe(AB, BC, CA)` en `casoCevaTramo`, `casoMene`, `casoCevaX`, `resuelveCM` y en `ceva`, `menelao`, `ceva-x` de la práctica; LLL con el triángulo del «No» posible (teoría y práctica); ejemplos con AC = 11 cm (respuesta 6 cm; alternativas 5, 5,5, 6, 13,2 y 11 cm) y con 9, 4, 2 y 3 cm (AB = 10 cm; 4, 6, 8, 12 y 10 cm). Pruebas en la unidad y el generador. |
| A3 | AB = 5, AC = 8, 60°, BC = 7; DE = 7,5. Prueba (ley de cosenos). |
| A4 | D_SEM sin letras. Prueba. |
| M1 | `cotas` en el bloque `semejante` (llave con el texto en el lomo, obstáculo para los demás rótulos); `figAnti` y `figRampa` las usan para AB y AC. Pruebas en la pieza y la unidad. |
| M2 | 24 cm. Prueba. |
| M3 | `tOrden` y el aviso en «Así se resuelve». Prueba. |
| M4 | Dibujos nuevos (bisectriz, sombras, AA, paralela, terreno, cruzados, Ceva y Menelao). Prueba: «Ahora tú» y «Así se resuelve» de bisectriz y semejanza llevan dibujo y, con «?» sin escala, el aviso. |
| M5 a M14 | Hechos (M5, M7, M10 y M11 con prueba; M14 con `ecuaciones-ancho`). |
| B1 a B9 | Hechos. |
| B10 a B13 | Se dejan (decidido por la sesión, Gerson revisa después). |
| Repaso | Fila de `geo-proporcionalidad` en bloque propio: incentro → Puntos notables, cuerdas → Relaciones métricas; la escena suma esas dos unidades (con `"rehacer"`, va a «Más mesas del tema») y su papel p5 y p6 dicen su unidad. Prueba. |

### Pendiente

- **Decidido por la sesión, Gerson revisa después:** B10 a B13; que `geo-proporcionalidad` aparezca, en «Más mesas del tema»,
  en Puntos notables y Relaciones métricas (es lo que pide la tabla del repaso, que solo acepta unidades de la ficha de la
  escena); la opción «−1» de Predice reemplazada por «Depende de dónde corte la recta» con el código GE-CEV1 (GE-CEV2, «usa −1
  con largos», queda sin uso: la fila de `docs/investigacion/geometria-ideas-erroneas.md` no se tocó).
- **Para la propuesta** (`docs/etapa8/propuesta-geometria.md`): la predicción de Thales pasó de DF = 120 m a 160 m.
- **Cuando Puntos notables llegue a `calidad: 2`:** su ficha lista ahora `geo-proporcionalidad`; la regla del papel la salta
  por `"rehacer"`, pero su glosario (también «incentro») necesita `simple` y ejemplos.
