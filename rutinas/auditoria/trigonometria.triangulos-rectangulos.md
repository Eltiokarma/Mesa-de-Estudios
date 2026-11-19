# Auditoría de contenido: «Resolución de triángulos rectángulos» (trigonometria.triangulos-rectangulos)

19 nov 2026. Auditor externo del cierre delegado (`docs/metodo/unidad/cierre-delegado.md`), que no escribió la unidad.
Contrato: `docs/plan-calidad.md` §3 y §5. Formato: `docs/teoria.md` 4e, 4f, 4h y §5. Vara: `docs/molde-unidad.md` §10.
Reglas automáticas: `docs/metodo/unidad/reglas-validador.md`. Lo aprendido en las Etapas 5 y 6: `etapa-delegada.md`, «Lo
que encontraron los auditores». Decisiones del autor: `docs/etapa7/propuesta-trigonometria.md` (§9, decisiones 1 a 22).
Lo que vieron los dos lectores en frío está en `rutinas/frio/trigonometria.triangulos-rectangulos.md`; aquí se cita
cuando el código lo confirma o lo agrava.

**Qué se revisó.**
- La teoría `contenido/teoria/trigonometria/triangulos-rectangulos.js` (v0.2.0, sin `calidad: 2`): las 5 ideas con sus 7
  momentos, los 75 ejemplos, «Ahora tú» y «Así se resuelve» (400 semillas de cada uno por idea), el glosario (16
  términos), las 5 mesas y la historia.
- La pieza nueva `nucleo/kit/piezas/trig-vista.js` (22 objetos) con su prueba.
- La práctica `plantillas/trig-resolucion/`: 15 tipos en las 5 ideas, `casos.json` (30) y `papel.json` (8).
- La app a 390 px con `--entera` (servidor propio, puerto 4437): los 35 momentos y las 75 tarjetas
  (`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e7-cierre-tr/lector/`, sin capturas repetidas
  por md5), y galerías de las figuras dibujadas con la pieza (`…/e7-cierre-tr/gal/`).

**Cuentas.** Rehechas con scripts propios (`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e7-cierre-tr/`:
`cuentas.js` y `cuentas-mas.js`; `node cuentas.js 400` y `node cuentas-mas.js 400`). De la unidad y del generador solo
leen el texto. Ninguna respuesta sale de las razones de la unidad: los puntos se ponen en el plano y se mide.
- **Ángulos de la convención** como los de sus triángulos: 37° = atan2(3, 4), 53° = atan2(4, 3), 16° = atan2(7, 24),
  74° = atan2(24, 7); los demás, en radianes. Un ángulo medido se lee en «grados del examen» solo si cae exacto en uno de
  ellos.
- **Lados y alturas**: un rayo sale con su ángulo desde un punto (la estaca, el ojo, la punta) y corta el suelo, una
  vertical o una horizontal; los largos salen con `hypot`. La altura sobre la hipotenusa y sus dos pedazos, con el pie de
  la perpendicular.
- **Elevación y depresión**: la depresión se mide en el plano entre la horizontal de arriba y la visual (`angEn`), y la
  «medida desde la vertical» con el rayo girado.
- **Dos ángulos hacia la misma punta**: la altura se busca por bisección hasta que las dos distancias al pie, medidas con
  los rayos, se resten (o se sumen, a lados opuestos) lo que dice el enunciado; la rapidez, con d = v · t.
- **Ángulo de observación**: φ = atan2(h₂, d) − atan2(h₁, d) con los dos extremos; con un borde bajo los ojos, el ángulo
  entre las dos visuales medido en el plano (y comprobado con atan2 de los dos extremos); el mayor φ, buscado a pasos de
  0,0001 m.
- **Igualdades**: toda cadena «x = y ≈ z» con lados numéricos (seno, coseno y tangente de notables con la convención) en
  resueltos, `siFuera`, Mira, misiones, lecturas del juego en toda su grilla, Lee y glosario: «=» exacta, «≈» con su
  redondeo.

**Resultado (versión de antes):**
- «Ahora tú»: 2 000 casos (400 por idea) con la correcta, **cada distractor con el valor de su error** (rehecho por el
  mismo camino que la correcta) y las cuatro opciones distintas. Las de letras (idea 1, tipo 3, y el puente de la
  idea 2) se comprueban sustituyendo dos valores de θ.
- «Así se resuelve»: 2 000 casos, con su «≈».
- Los 75 ejemplos y, en los 25 de nivel 3, la letra de la respuesta en su alternativa, **una sola alternativa con el valor
  correcto** y **cada alternativa equivocada con el valor del error que dice su resuelto** (los 100 valores).
- Las 5 predicciones con cada distractor (30, 62,5 y 50 m; 5 m, 10√3 m y 20√3/3 m; 60° y 150° medidos en el plano;
  200√3, 200 y 100 m; el máximo de φ, 30° a √12 m, y φ → 0 junto al poste), las 5 misiones en toda su grilla (un solo caso
  cada una, ninguna al abrir) y las lecturas del juego.
- La práctica: 2 000 problemas (400 por idea, con `{ idea }`), los 30 de `casos.json` y los 8 de `papel.json` (con sus
  resueltos).
- **16 649 comprobaciones cuadran en la teoría y 2 256 en ejemplos, predicciones, misiones y práctica. Ninguna respuesta,
  ningún distractor y ningún resuelto da un valor equivocado.** Lo que no cuadró es de escritura (M5 a M8): 29 cadenas
  con «=» y un redondeo a 3 decimales, 523 alternativas de «Ahora tú» y 22 respuestas de la práctica redondeadas sin «≈»,
  52 casos del puente de la idea 2 con alternativas que son longitudes negativas, y los problemas de dos ángulos con
  personas que miran sin sumar sus ojos (333 de la teoría y 198 de la práctica en 400 semillas).

**Figuras.** Un script propio (`figuras.js`) mide en pantalla, con la geometría de la pieza (lo que ve el alumno), las 6 310
figuras de la unidad (Lee, toda la grilla de los juegos y de la mesa `cometa-libre`, Predice y su revelado, cada paso de
Mira, la regla, los 75 ejemplos y 400 semillas de «Ahora tú» y «Así se resuelve»): (1) dónde queda el rótulo de cada
ángulo respecto de su arco y del suelo; (2) en cada figura «El dibujo no está a escala», si lo pedido se puede medir: un
ángulo pedido a menos de 6° de lo dibujado, o un largo pedido que, medido con la escala de un largo rotulado, queda a menos
de 10 % y más cerca de la correcta que de las otras alternativas; (3) qué figuras a escala dibujan el caso de una
predicción o de una misión.

Validador con `calidad: 2` simulada (`Teoria.problemas`, 400 semillas): **0 problemas** antes de corregir.
`herramientas/ecuaciones-ancho.js`: «todo cabe». Pruebas propias antes de corregir: unidad 8 de 8, pieza 3 de 3,
generador 10 de 10.

## Hallazgos

No hay hallazgos de gravedad Alta: ningún valor está mal en 400 semillas.

### Media (el alumno se traba, duda o la figura le da la respuesta)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 5; Etapa 5 n.º 5 | Pieza, rótulos de ángulos: Predice, revelado y Mira de la idea 4 (el «60°» que se pidió revisar), ejemplos 8 y 10 de la idea 4, ejemplo 11 de la idea 2, juego de la idea 4 con α = β, juego de la idea 1 con H = 20 m, y la mesa `cometa-libre` con la pita corta (todos sus ángulos) | El rótulo cae **bajo el suelo**, lejos del arco (el «60°» de Predice, a 39 px a la izquierda de su vértice y debajo del cerro). Causa: al dibujar 60° como 70° (decisión 17) el vértice queda a 29 px del pie, el rótulo no cabe en la abertura y la pieza lo manda a un lugar «afuera» que está debajo del suelo. En ángulos angostos (37° dibujado de 27°) el rótulo queda dentro, pero a 45-50 px de su arco chico (lectores A y B). | La pieza no pone el rótulo de un ángulo bajo el suelo; si el rótulo queda lejos dentro de la abertura, el arco crece hasta él; en la idea 4, el ángulo mayor no se dibuja más empinado que su valor menos 8°. |
| M2 | 5, 12 | Idea 4, ejemplo 10 «Con 16° y 37°» y «Ahora tú» tipo 1 con 16° y 37° (×10 en 400) | `DIB(16) = DIB(37) = 27°`: los dos lugares se dibujan **en el mismo punto**, con una sola visual y la cota de 44 m de largo cero; el «37°» bajo el suelo. | Dibujo de los dos ángulos con el menor, por lo menos 12° más abajo que el mayor. |
| M3 | 5; Etapa 5 n.º 5 | Idea 5: ejemplos 1, 2, 4, 6, 11; «Así se resuelve» (todas) y «Ahora tú» tipos 0 y 1 | Con la distancia por 0,62, **φ sale dibujado a 1°-4° de su valor** (8° dibujado de 7,8°; 16° de 14,6°; 37° de 39,9°) aunque dice «El dibujo no está a escala»; y el letrero de 9 a 16 m **mide justo 7 m** con la regla de los 9 m (ejemplos 6 y 11, la respuesta). | Fuera de escala, el borde de abajo a otra altura (o la distancia, si está a la altura de los ojos) hasta que φ difiera 12° o más y el largo 15 % o más; la distancia al 75 %. |
| M4 | 5 | Idea 3, ejemplo 11 y «Ahora tú» tipo 2 (22 de 400); idea 5, ejemplo 14; idea 1, ejemplo 15 | El edificio de enfrente mide 21,8 m con la regla de los 9 m de la ventana (es 21: 27° y 36° dibujados se compensan); en «¿A qué distancia?» la distancia pedida mide justo 3√3 con la regla de los 9 m; el río de la tirolesa mide 27 con la de los 50 m (la alternativa más cercana es la correcta, 30). | Ventana: la elevación dibujada se corre de 8° en 8° hasta que lo pedido difiera 15 % (o φ, 12°); letrero: la distancia al 75 %; tirolesa: el río dibujado de 33. |
| M5 | 1; Etapa 5 n.º 1 | Idea 2, «Ahora tú» tipo 0 (26 de 400) | El resuelto escribe **«14 · 7/24 = 4,083 m»**, «20 · 4/3 = 26,667 cm», «24 · 24/7 = 82,286 m» con «=»: no son iguales (la regla `igualdad-falsa` no lo ve: `exTxt` redondea a 3 decimales los racionales). | Un racional que no termina en 3 decimales va con su fracción y su «≈»: «49/12 m ≈ 4,08 m». |
| M6 | 1; Etapa 5 n.º 1 | «Ahora tú» de las ideas 1 a 4 (523 alternativas en 400 semillas); práctica (22 respuestas: «2,04 m», «10,67 m», «4,67 m/s», «12,17 m»…); nivel 3 de los ejemplos (346,4 s, 115,5 s, 519,6 s, 13,44 m, 6,86 m, 37,33 m, 8,57 m) | Alternativas **redondeadas sin «≈»**: «4,08 m» es 49/12; «16,67 m», 50/3. | Con su fracción y «≈» en la teoría; «≈ 4,08 m» en las alternativas de la práctica (la prueba «la correcta no es la central» falla con la fracción); «≈ 346,4 s» en los ejemplos. |
| M7 | 2, 3; Etapa 5 n.º 2 | Idea 2, «Ahora tú» tipo 2 (el puente con la resta, 52 de 400) | Las alternativas **h(sen θ − tan θ)** (negativa para todo θ agudo) y **h(sen θ − cot θ)** (negativa hasta 52°) son longitudes negativas: se descartan sin pensar. | Con la resta: h(sec θ − tan θ), h(csc θ + cot θ) (suma donde se resta, RES-SUMA) y h csc θ (solo el cable). |
| M8 | 2, 10; Etapa 6 n.º 15 | Idea 4: ejemplos 2, 9 y 14, «Ahora tú» tipo 1 (133 de 400), «Así se resuelve» (200 de 400); práctica `separacion` y `altura-dos` (198 de 400) | **«Dos personas / dos niños … ven su punta … ¿Cuánto mide el poste?»** sin la altura de sus ojos, cuando la idea 3 enseña que se suma; la figura dibuja personas con el ángulo en los pies; «Ves la punta… avanzas» y «La punta de una torre se ve… Avanzas» sin decir desde dónde. | «Desde dos puntos del suelo…», «Desde un punto del suelo…», sin personas en la figura. (La combi del juego y de Predice queda: es un vehículo frente a un cerro de 300 m; ver B9.) |
| M9 | 13 | Idea 2: «Así se resuelve» (todas), «Ahora tú» y 9 ejemplos; idea 3: ejemplos de depresión | **Los Datos no traen el valor de la recíproca que se usa** (cot 30° = √3, csc 60° = 2√3/3) y en «Ahora tú» de la idea 2 faltaba tan θ = CO/CA (lector A: «casi caigo en la trampa B»); en las depresiones de las ideas 3 y 4 los Datos no dicen que la depresión mide lo que la elevación (lector B, tarjeta 10). | Datos con las recíprocas que se usan (en la idea 2, las seis, en dos líneas), D2.rz en «Ahora tú», y «alternos internos» en toda depresión. |
| M10 | 6 | Idea 3: Juega, regla y Datos | **h con dos significados**: en el juego y la leyenda es la altura sobre el suelo; en la regla y los Datos, «sobre el ojo: h = d · tan θ» (lector A). La cuenta del juego da 7,27 m y el único tramo naranja mide 10√3/3. | h es siempre la altura sobre el suelo: regla «sobre el ojo: d · tan θ», «h = d · tan θ + ojos»; Datos «la visual sube o baja d · tan θ»; leyenda «altura de la canasta: naranja + 1,5 m». |
| M11 | 3, 6 | Idea 2: Juega y La regla | «cot 45°» aparece en la cuenta del juego antes de definirse; La regla no define cot, sec ni csc, y su frase «el lado que buscas es el cateto conocido por la razón…» se lee mal (lector A). | Lee 3 define las tres recíprocas; la condición de la regla también; la regla: «multiplica el cateto que conoces por la razón de θ que tiene arriba el lado que buscas y abajo el que conoces». |
| M12 | 4, 5 | Idea 5, ejemplo 14 «¿A qué distancia?» (tarjeta 15 del lector B) | La figura ya rotula «30°» (la segunda respuesta) y la pregunta pide dos cosas con alternativas de una sola. | Sin el rótulo de φ y una sola pregunta (la distancia); «abarca 30°» queda en el resuelto. |
| M13 | 8; Etapa 6 n.º 15 | Idea 5, ejemplos 8 y 12; idea 2, ejemplos 2 y 9 | El ejemplo 8 (nivel 2) **repite los números del 12** (nivel 3): ventana a 9 m, edificio a 12 m, 82°; y su figura es un edificio mientras el texto habla de una pantalla de tribuna, sin 9 m ni 12 m (lector B, tarjeta 14). Los ejemplos 2 y 9 de la idea 2 usan el mismo triángulo (8 junto a 37°). | Ejemplo 8: ventana a 7 m, edificio a 24 m, azotea 18 m sobre la ventana (16° + 37° = 53°), con su figura rotulada; ejemplo 9 de la idea 2: 12 cm (área 54 cm²). |
| M14 | 5 | Pieza: rótulos de las cotas | «h = 10 m» y «CO = 10 m» encima de la antena rayada (Juega, Predice y Mira de la idea 2); «?» sobre la escalerita del tobogán (tarjeta 01); «60 m», «300 m» y «15 m» encima del acantilado, del barranco y del edificio (tarjetas 08, 09 y 10); «1,5 m» bajo el suelo junto a «15 m» (idea 3, «Ahora tú»), que parece otra distancia (lectores A y B). | Margen para la cota del lado de afuera de la antena, el poste, el tobogán, el edificio, el faro, el acantilado y el cerro; la cota de los ojos, del lado de adentro. |
| M15 | 2 | Idea 5, Predice y La regla | «En el juego, acercarse agranda φ» suena a regla general; «si un borde queda bajo los ojos, su ángulo se suma» no se entiende hasta la tarjeta 14 (lector B). | «En el juego, de 12 m a 6 m, acercarse agrandó φ.»; condición: «Si el borde de abajo queda bajo tus ojos, es una depresión y se suma.» |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección |
|---|---|---|---|---|
| B1 | 4, 5 | Lee de las ideas 1 y 2 (a escala) | Lee 1 dibuja la cometa a 37°, el ángulo de la predicción (el suelo se mide como 0,8 de la pita); Lee 2 dibuja la antena de 12 m a 60°, el caso de la misión. Sin rótulos, pero a escala. | Cometa a 50°; antena de 9 m a 45° (la de partida del juego). |
| B2 | Regla 4 | Idea 1, «Ahora tú» con triángulo (decisión 18) | El adyacente sin rótulo sale turquesa y el lado pedido en tinta: el lector A creyó por un momento que pedían el verde. | Un lado sin rótulo, en tinta (la prueba de colores lo permite). |
| B3 | 3 | Ejemplo 14 de la idea 1 | «2a(tan θ + 1), la diagonal por base»: «por» se lee como multiplicar (lector B). | «la diagonal como base». |
| B4 | 7 | Idea 3, ejemplo 14 | «300√3 m» partido en dos renglones: `junto` no entraba en los trozos de color. | `junto` también dentro de `{ v, t }`. |
| B5 | 5 | Idea 4, ejemplo 8 | «?» en lo que avanza la combi, que sale de 10 m/s y 6 s (lector B). | Sin rótulo. |
| B6 | 5 | Idea 3, «Así se resuelve» (faro) | No se ve dónde está el pie (lector A). | Ángulo recto en el pie. |
| B7 | 5 | Idea 5, «Ahora tú» con d = 14 y bordes de 14 a 48 m | Figura alta y angosta, «?» y el arco apretados; dos «14 m» juntos (lector B). | No se tocó: la forma la dan los números. |
| B8 | 13 | Idea 5, «Ahora tú» | «tan 16° = 7/24» en Datos recordó la respuesta del ejemplo anterior (lector B). | No se tocó: Datos trae la tabla entera a propósito (no delata cuál se usa). |
| B9 | 10 | Idea 4: juego y Predice | «La combi ve la punta» mide desde el suelo, sin la altura del chofer. | No se tocó (una combi frente a un cerro de 300 m; el texto no dice «tus ojos»). Para Gerson. |
| B10 | — | Idea 3, Juega | Dibujo chico con mucho blanco arriba (lector A): la escala es fija para toda la grilla (el globo más alto). | No se tocó. |
| B11 | — | Ejemplos (circulito 3, 8, 14) | El número del circulito no se explica (lector B). | Fuera de alcance (app). Para la sesión. |
| B12 | 9 | Idea 2, ejemplos 14 y 15 | Sin letra en la respuesta (lector B, tarjeta 06). Es la decisión de la Etapa 3 (figuras con puntos con letras: alternativas por su valor). | No se tocó. |
| B13 | 5 | Pieza, ángulos angostos con rótulos largos («θ = 37°», «θ = 30°») en Predice de las ideas 1 y 2 y en la mesa `cometa-libre` | El rótulo queda afuera de la abertura, a unos 20 px de su arco (sobre la pita o el cable): junto al arco, pero no adentro. | No se tocó (adentro no cabe sin pasar de la figura). |

## Lo que está bien y hay que copiar al molde

- **Ninguna cuenta equivocada** en 2 000 «Ahora tú», 2 000 «Así se resuelve», 75 ejemplos (con sus 100 alternativas
  equivocadas), 5 predicciones, 5 misiones, 2 000 problemas de práctica, 30 casos y 8 de papel, rehechos con puntos en el
  plano y ángulos de la convención como los de sus triángulos.
- **Cada distractor vale lo que dice su error**, también los de letras (comprobados con dos valores de θ).
- **Números exactos** en toda la unidad (a + b√2 + c√3 + e√6): ninguna raíz se redondea antes de tiempo.
- **Misiones de una sola salida**, ninguna al abrir; **predicciones que el juego no muestra** (el juego de la cometa no
  da el suelo; el de la antena no da el cable; el del globo no mide desde arriba).
- La regla de colores por magnitud, con prueba en todas las figuras y textos.
- La convención del examen en cada línea de Datos con 37°, 53°, 16° o 74° (ahora también con cot, sec y csc).

## Reglas que faltan en el contrato o el validador

| Regla | ¿Automática? |
|---|---|
| **El rótulo de un ángulo nunca va bajo el suelo y queda junto a su arco** (M1). | Sí, por pieza: caja del rótulo contra la línea del suelo y distancia al vértice. Esta pieza ya lo prueba. |
| **Dos ángulos de una misma figura que se dibujan «no a escala» no pueden caer en el mismo dibujo** (M2: 16° y 37° a 27°). | Sí: la función que cambia la abertura es inyectiva y conserva el orden (prueba). |
| **«No está a escala» no basta: lo pedido no se mide** (M3, M4). Un ángulo pedido, a 6° o más; un largo, medido con otro rotulado, a 5 % o más (o más cerca de otra alternativa). | Sí: geometría de la pieza contra la respuesta. Esta unidad ya lo prueba. |
| **Un racional que no termina va con «≈», también en alternativas** (M5, M6): `igualdad-falsa` no ve «= 4,083 m» porque el lado izquierdo es una cuenta con fracción. | Sí: evaluar «a · b/c = d» y comparar exacto; una alternativa decimal sin «≈» vale su número exacto (prueba del generador). |
| **Ninguna alternativa con letras es negativa para un valor admisible** (M7). | Sí: sustituir valores de θ. |
| **Quien mira con ojos suma su altura, o el enunciado dice «desde el suelo»** (M8). | Parcial: buscar «personas», «niños», «ves» en problemas de dos ángulos sin «ojos» ni «suelo». |
| **Los Datos traen el valor de toda razón que usa el resuelto** (M9). | Sí: cada «cot 30° = …» del resuelto tiene su «cot 30° =» en Datos (prueba de esta unidad). |
| **Dos ejemplos de una idea no usan los mismos números** (M13). | Sí: comparar la lista ordenada de números de los enunciados (prueba de esta unidad). |

## Correcciones (19 nov)

Fase 8 (`docs/metodo/unidad/6-correcciones.md`), junto con las notas de los dos lectores en frío (ver
`rutinas/frio/trigonometria.triangulos-rectangulos.md`, «Correcciones de la ronda 1»). La versión de la teoría no se
cambió (sigue en 0.2.0, sin `calidad: 2`). Copias de antes en
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e7-cierre-tr/antes/`.

Pruebas nuevas: 8 al final de `triangulos-rectangulos.test.js` («cierre: …»), 1 en `trig-vista.test.js` (rótulos de
ángulo) y 1 en `generador.test.js` («cierre: …»). **Con la versión de antes (unidad, pieza y generador de `antes/`, en un
espejo del repositorio) fallan las 10**; con la de ahora pasan. Se cambió una prueba de la unidad que fijaba lo que cambió
a propósito (colores: un lado sin rótulo puede ir en tinta) y otra se amplió (la convención también en cot, sec y csc).
Después: unidad 16 de 16, pieza 4 de 4, generador 11 de 11, `contenido/teoria/teoria.test.js`,
`herramientas/papel-reglas.test.js`, `herramientas/papel-generador.test.js` y `nucleo/avance.test.js`: 229 de 229.
Validador con `calidad: 2` simulada y 400 semillas: sin problemas. `ecuaciones-ancho.js`: «todo cabe» (50 pantallas, 486
renglones). Papel regenerado con `herramientas/papel-generador.js trig-resolucion` (cambian sus Datos de elevación); `npm
run catalogo` hecho. No se corrió `npm test` completo (otras sesiones trabajando). Capturas de después, a 390 px:
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e7-cierre-tr/despues/`, y galerías por idea en
`…/e7-cierre-tr/gal/`.

| # | Qué se hizo |
|---|---|
| M1 | Pieza: el rótulo de un ángulo no puede ir bajo el suelo (obstáculo bajo la línea del suelo, solo para ángulos); el arco se dibuja después de colocar el rótulo y, si este quedó dentro de la abertura y lejos, crece hasta él (sin pasar del lado más corto). Unidad: `dibPar` dibuja los dos ángulos de la idea 4 con el mayor a su valor menos 8° (desde 48°) y el menor 12° más abajo. Predice: el «60°» queda dentro de su abertura, junto al arco y sobre el suelo. Prueba (pieza): ningún rótulo de ángulo bajo el suelo ni a más de 90 px de su vértice en toda la teoría. |
| M2 | Con `dibPar`, 16° y 37° se dibujan de 15° y 27°. Prueba: los dos lugares del suelo, a 25 px o más. |
| M3 | `letreroAbre`: fuera de escala, el borde de abajo a otra altura (×0,5, ×1,8, ×0,3…), o la distancia si el borde está a la altura de los ojos, hasta que φ difiera 12° o más y el largo del letrero, medido con el borde de abajo, 15 % o más; la distancia al 75 %. Prueba: en toda figura «no a escala», un ángulo pedido difiere 6° o más y un largo pedido 5 % o más (o queda más cerca de otra alternativa). |
| M4 | `ventanaAbre`: la elevación dibujada se corre de 8° en 8° hasta que la altura pedida difiera 15 % (idea 3) o φ 12° (idea 5, `pide: 'f'`); tirolesa con el río dibujado de 33; letrero con la distancia al 75 %. Misma prueba. |
| M5 | `decExacto`: un racional va con decimales solo si es exacto con 3 cifras; si no, «49/12 m ≈ 4,08 m» (`largo`, `exTxt` y `conOjos`). Prueba: toda cadena «=» de los resueltos de «Ahora tú» y «Así se resuelve» es exacta, y la correcta es lo que da el resuelto. |
| M6 | Teoría: lo mismo en las alternativas; nivel 3 con «≈ 346,4 s», «≈ 115,5 s», «≈ 519,6 s», «≈ 13,44 m», «≈ 6,86 m», «≈ 37,33 m» y «≈ 8,57 m». Generador: `largo` con fracción y «≈» en los resueltos y `opcion` con «≈ 4,08 m» en las alternativas (también en la elevación con ojos). Prueba (generador): una alternativa decimal sin «≈» vale exactamente su número. |
| M7 | Puente con la resta: h(sec θ − tan θ) (RES-COMPLEMENTO), h(csc θ + cot θ) (RES-SUMA, código nuevo, hipótesis) y h csc θ (RES-UN-PASO). Prueba: ninguna alternativa es negativa con θ de 0,2 a 1,4 rad. |
| M8 | «Desde dos puntos del suelo, a lados opuestos…, su punta se ve con…» en los ejemplos 2 y 14, «Ahora tú» tipo 1 (sin personas en la figura) y «Así se resuelve»; ejemplo 9 «Desde un punto del suelo…». Generador: `separacion` y `altura-dos` igual. Prueba (teoría y generador): sin «personas», «niños» ni «Ves la punta» en la idea 4, y «Avanzas» siempre «desde un punto del suelo». |
| M9 | `v4` (sen, cos, tan y cot) en las ideas 3 y 4; `v6` (las seis, en dos líneas de ≤ 22 palabras) en los ejercicios de la idea 2 (no en su Predice) y en el ejemplo 8 de la idea 3; D2.rz en «Ahora tú» de la idea 2; «alternos internos» (D3.alt) en los Datos de toda depresión de las ideas 3 y 4; D4.rzr solo con la cotangente. Prueba: cada «cot/sec/csc g° =» de un resuelto está en sus Datos, y toda depresión trae «alternos internos». |
| M10 | Regla de la idea 3: «sobre el ojo: d · tan θ   ·   h = d · tan θ + ojos   ·   depresión = elevación»; D3.regla: «Con θ medido desde la horizontal del ojo, la visual sube o baja d · tan θ (d, por el suelo).» (también en el generador); leyenda del juego: «altura de la canasta: naranja + 1,5 m». |
| M11 | Lee 3 de la idea 2 define cot, sec y csc; la condición de la regla también; texto nuevo de la regla. |
| M12 | Ejemplo 14 de la idea 5: «¿A qué distancia del poste debes pararte para que abarque el mayor ángulo posible?», sin el rótulo de φ en la figura. |
| M13 | Ejemplo 8 de la idea 5: ventana a 7 m, edificio a 24 m, azotea 18 m sobre la ventana: φ = 16° + 37° = 53°, con figura rotulada (7 m, 24 m, 18 m y el ángulo entero con «?»); `casoVentanaObs` ya no lo saca. Ejemplo 9 de la idea 2: adyacente de 12 cm (área 54 cm²); `casoOtroCateto` excluye 37°/12. Prueba: dos ejemplos de una idea no tienen los mismos números. |
| M14 | Pieza: margen del lado de afuera para la cota (antena 82 px, poste 58, tobogán 48, edificio, faro y acantilado 44, punta del cerro 48); la cota de los ojos, entre la persona y lo que mira. Revisado en las galerías y en las capturas. |
| M15 | Predice: «En el juego, de 12 m a 6 m, acercarse agrandó φ.»; condición de la regla: «Mismo ojo; h₁ y h₂, sobre él. Si el borde de abajo queda bajo tus ojos, es una depresión y se suma.» |
| B1–B6 | Hechos como dice la tabla. B1 con prueba (Lee no dibuja 37° en la idea 1 ni 60° en la idea 2). B4: `junto` entra en `{ v, t }`. |
| B7–B13 | No se tocó (ver la tabla). |

### Pendiente

- **Para Gerson:** la combi que mira el cerro desde el suelo, sin la altura del chofer (B9); el número del circulito de
  los ejemplos (B11, de la app); RES-SUMA es un código nuevo (hipótesis); la pieza `trig-vista` sigue siendo dibujo de
  prueba.
- **Decidido por la sesión, Gerson revisa después:** en la idea 4, los ángulos «no a escala» se dibujan con `dibPar` (el
  mayor a su valor menos 8°, no +10° como dice la decisión 17 de la propuesta; siguen del mismo lado de 45°); un lado sin
  rótulo va en tinta (decisión 18, ampliada); las alternativas de la práctica con «≈ 4,08 m» y las de la teoría con
  «49/12 m ≈ 4,08 m»; los ejemplos 9 de la idea 2 y 8 de la idea 5 cambian de números.
- **Para la sesión (app y herramientas):** B11; la regla `igualdad-falsa` del validador no ve «14 · 7/24 = 4,083 m» (ver
  «Reglas que faltan»).

### Cuentas rehechas, después

Mismos scripts (`node cuentas.js 400` y `node cuentas-mas.js 400`, con los regex de «Desde dos puntos del suelo» y de
«≈ x» ajustados, y los ejemplos que cambiaron rehechos): **teoría, 17 751 comprobaciones cuadran; 0 no** (3 802
igualdades leídas; 0 redondeos sin «≈»); **ejemplos, predicciones, misiones y práctica (2 038 problemas), 2 261 cuadran; 0
no**. Figuras (`node figuras.js 400`, 6 310 figuras): ningún rótulo de ángulo bajo el suelo; lo único «medible» que queda
es el cateto al lado de su hipotenusa en triángulos de 16° o 60° (a 7 % u 8 %: cualquier triángulo rectángulo lo muestra
menor que la hipotenusa) y una cuenta del script que no lee «2√3 + 1,2 m».
