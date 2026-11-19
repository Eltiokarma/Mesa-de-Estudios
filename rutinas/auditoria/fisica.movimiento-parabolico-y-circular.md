# Auditoría de contenido: «Movimiento parabólico» (fisica.movimiento-parabolico-y-circular)

19 nov 2026. Auditor externo (fase 7 del método), que no escribió la unidad. Contrato: `docs/plan-calidad.md` §3 y §5.
Formato: `docs/teoria.md` 4e, 4f, 4h y §5. Vara: `docs/molde-unidad.md` §10. Reglas automáticas:
`docs/metodo/unidad/reglas-validador.md`. Decisiones: `docs/etapa5/propuesta-fisica.md`, parte A (§1 a §9, decisiones 1 a
16). Lo que vieron los dos lectores en frío de esta ronda está en `rutinas/frio/fisica.movimiento-parabolico-y-circular.md`;
aquí se cita solo cuando el código lo confirma o lo agrava. No toqué Movimiento circular (otro auditor trabaja en ella).

**Qué se revisó.**
- La teoría `contenido/teoria/fisica/movimiento-parabolico-y-circular.js` (v0.4.0, sin `calidad: 2`):
  - las 5 ideas con sus 7 momentos (A1 `un-reloj-dos-ejes`, A2 `velocidad-en-vuelo`, A3 `tiro-oblicuo`, A4
    `altura-y-alcance`, A5 `ecuaciones-en-el-plano`);
  - los 75 ejemplos;
  - «Ahora tú» y «Así se resuelve» (200 semillas de cada uno por idea);
  - el glosario (15 términos), las 2 mesas y la historia.
- La pieza `nucleo/kit/piezas/fis-tiro.js` y su prueba.
- La práctica `plantillas/fis-parabolico/` (17 tipos en las 5 ideas, `casos.json` con 19 casos, `papel.json` con 8) y el
  papel de `plantillas/tiro-parabolico/` que la unidad comparte con Movimiento circular.
- La app a 390 px con `--entera`: los 35 momentos y los 75 ejemplos. Servidor propio en el puerto 4319.

**Cuentas.** Se rehicieron con scripts propios en
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e5-cierre-par/cuentas/`. De la unidad y del
generador solo leen el texto. Cada respuesta sale del enunciado con un vuelo simulado paso a paso (`sim.js`: a = (0, −g)
en cada paso de 0,1 ms, el instante pedido por bisección), sin las fórmulas del tiro. Las rapideces y alturas pedidas «al
revés» salen por tanteo sobre la simulación; el ángulo del mayor alcance, recorriendo 5° a 85°.
- **Resultado: todas las respuestas cuadran.**
  - `ejemplos.js`: 188 comprobaciones en los 75 ejemplos. Cada respuesta, y en los 25 de nivel 3 cada alternativa
    rehecha con el error que el resuelto le atribuye.
  - `ahora.js`: 2 000 casos, «Ahora tú» y «Así se resuelve» con 200 semillas por idea. Cuadra la correcta, ningún
    distractor vale lo mismo y no hay opciones repetidas.
  - `todo.js`, primera parte: las 5 predicciones con cada distractor; las 5 misiones en toda su grilla (una sola
    respuesta en A1 a A4; en A5, 3 y 4 o 6 y 8 m/s, como dice la propuesta); la lectura del juego contra el vuelo
    simulado.
  - `todo.js`, segunda parte: la práctica, 1 000 problemas (200 por idea, con `{ idea }`), más los 19 de `casos.json` y
    los 8 del papel.
  - `igualdades.js`: evalúa toda igualdad numérica escrita en 22 369 textos, también en km/h, cm y m. Mira resueltos,
    `siFuera`, explicaciones de alternativas, Mira, reglas, Lee, Predice, glosario, la práctica, el papel y la lectura del
    juego en toda la grilla y fuera de ella.
- **Lo que la respuesta no ve, y sí vieron los scripts:**
  - la lectura del dron (A5) escribe una posición que no es la rapidez por el instante que muestra, en 1 875 instantes
    de la animación (M7);
  - un chorro dibujado que cae en 9,6 m bajo una cota de 8 m (M3);
  - tres explicaciones de alternativas que no dan su valor (M4);
  - 35 figuras donde lo pedido se mide contra una cota con número (M1), con `figuras.js`.

Validador con `calidad: 2` simulada (`Teoria.problemas` con 200 semillas): **0 problemas, 0 pendientes**, antes y después
de las correcciones. Reglas del papel (`herramientas/papel-reglas.js`) con las dos unidades de física simuladas en
calidad 2: antes, 10 fallas `papel-unidades` en `tiro-parabolico`; después, 0. Ninguna de las faltas de abajo la ve una
regla de hoy. Pruebas propias, en verde antes de corregir: unidad 27 de 27, pieza 29 de 29, generador 30 de 30.

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

Ninguno. Las respuestas, los distractores y las reglas son correctos. Nada de lo que sigue lleva a una respuesta falsa.

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | Molde §3 (figura sin respuesta) | `fis-tiro`. Ejemplos 1.6, 1.7, 1.8, 1.10, 1.12, 3.12 y 4.14, «Ahora tú» de A1 (k = 1) y «Así se resuelve» de A1 (las dos ramas) | La pieza dibuja todo a la misma escala de lado y de alto. Cuando se pide una longitud con «?» y la figura trae otra cota con número, se mide una contra otra. En 1.8 la raya «?» mide igual que la de 80 cm: la respuesta es 80 cm (lector B, tarjeta 02). Pasa en 35 figuras distintas (`figuras.js`). | Si hay una cota «?» y otra con número, cada eje con su escala fija y un rótulo «Dibujo sin escala». |
| M2 | 13, 3 (el eje vertical) | Reglas de A3 y A4 (`condicion`); `DB.vyt`, `DB.v2` y `D.v2` del generador | La decisión 13 manda decir en cada condición hacia dónde va lo vertical. A2 lo dice («se mide hacia abajo»). A3 dice «y es la altura sobre la salida», y A4 nada. Las líneas «v_y = v₀ᵧ − g·t» y «v_y² = v₀ᵧ² − 2·g·y» no dicen que el eje va hacia arriba, y en A2 la misma letra v_y se medía hacia abajo. Ningún ejercicio mezcla las dos convenciones (lo revisé en 3 000 casos). A A1 le falta decir que h va hacia abajo. | Una frase por condición; «con el eje hacia arriba» en esas líneas de datos. |
| M3 | 4 (figura que contradice el texto) | Ejemplo 4.12 «Al triple de rapidez» | El texto dice que el chorro cae a 8 m y la cota dice «8 m». Pero la figura dibuja 10 m/s a 37°, y ese chorro cae a 9,6 m, más allá de la cota. A 10 m/s, para caer a 8 m hace falta tan θ = 1/2. | Dibujar vₓ = 20/√5 y v_y = 10/√5. |
| M4 | Distractores (explicación) | Ejemplos 4.14, 5.12 y 5.13 | 4.14: «**A** toma 24 · 4/3 y no divide entre 4» usa H = R·tan θ/4, una fórmula práctica que la unidad no presenta (lector B, tarjeta 12). 5.12: «**D** lee g = 5» no da 12,8 m: con g = 5 sale 6,4 m, que es la B. 5.13: «**B** no divide 5x²/25» no describe 4x − x²; ese resultado sale de elevar la x al cuadrado y no el 5. | Distractores que salgan de las herramientas dadas, con su cuenta: A = 16 m (toma como vuelo solo la subida), D = 2,4 m (no eleva t al cuadrado), B «eleva la x pero no el 5». |
| M5 | 13 | Ejemplos 2.12, 2.14, 4.8 y 4.14; generador `llegada` y `angulo-t` | 2.12 usa «los 30 m/s de lado» y no trae vₓ = v₀ en los datos; `llegada` y `angulo-t` tampoco. 2.14 trae «aceleración en todo el vuelo: g, hacia abajo» y vₓ = v₀, que descartan A, D y E de una conceptual (lector B, tarjeta 06). 4.8 y 4.14 dicen «vuela el doble de lo que sube» o «2 · 0,8v₀/10» sin la ecuación de y ni la regla del tiempo en los datos (lector B, tarjetas 11 y 12). | vₓ = v₀ donde se usa; 2.14 solo con g; 4.8 y 4.14, el tiempo de vuelo desde y = 0 con la ecuación de y en los datos. |
| M6 | Regla 3, glosario | Glosario de A4: «alcance máximo» y «ángulos complementarios» | Los dos se abren antes de jugar («Palabras de esta idea»). «A 30° o a 60° cae más cerca que a 45°» y «30° y 60°.» ponen juntos el ángulo de la consigna y la respuesta de la misión (60°). La regla `glosario-predice` no lo ve: mira la Predice, no la misión. | Otros pares: 40° o 50°; 20° y 70°. |
| M7 | 7 (la lectura), 10 | A5, lectura del juego | Escribe la posición exacta con el instante redondeado: «En 0,63 s: 1,25 m al este» con 2 m/s (lector B). Pasa en 1 875 de los instantes que recorre la animación. | Calcular la posición con el instante que se muestra. |
| M8 | 9, 13 | Regla de A5 | La ecuación de x no trae ½·aₓ·t², pero la condición dice «aceleración constante en cada eje». d = √(x² + y²) no dice que es la distancia al origen, y la regla trae x₀ e y₀. Además, y pasa de «al norte» a «la altura» sin aviso, en la regla y en «Así se resuelve» (lector B). «Dos drones» (5.14) da «distancia al origen» y pregunta la distancia entre los dos. | Los dos ejes con la misma forma; d con su llave «distancia al origen»; la condición y «Así se resuelve» dicen el cambio de vista; 5.14 con su propio dato. |
| M9 | Propuesta §1 (A3) | Regla de A3 | La propuesta pide que la regla de A3 «lleve la línea que traduce el eje al ± de la academia», como en MRUV (M11 de esa auditoría). No la lleva. | La línea en la condición. |
| M10 | 3, 4 (lectores en frío) | A2: juego, leyenda y regla; A3: Mira y regla | (a) La lectura de A2 «Tras 2 s: …», junto a un reloj en 0,21 s, se lee como lo de ahora. (b) vₓ y v_y van en el mismo naranja y sin nombre en el juego. (c) En la regla de A2 solo una de las dos flechas carmín dice «g», y la otra se lee como v_y. (d) En «Mira» de A3, las flechas en m/s se dibujan junto a la regla en metros y parecen llegar a y = 10 m. (e) La figura de la regla de A3 no dice v₀ = 25 m/s. | (a) «Misión (2 s): …». (b) Rótulos v_x y v_y y dos líneas de leyenda (discontinua horizontal y vertical): un color por magnitud, como dice la decisión 3. (c) Una «g» en cada flecha. (d) Sin la regla de la pared mientras se dibujan las flechas, y el paso 1 dice «van en m/s». (e) La flecha de salida, rotulada. |
| M11 | 8 (rótulos que se pisan) | `fis-tiro`: rótulo de la flecha de salida, del ángulo y de las cotas | El rótulo de la flecha («7 m/s», «8 m/s», «15 m/s») cae bajo la manija de arrastre de la app (13 px de halo). En A4 la manija tapa «30°» y se lee «0°». En «Ahora tú» de A3 la flecha mide 30 px y su punta pisa el «30°». La raya del alcance empieza entre la pared y la cota de la altura (lectores A y B: tarjetas 02 y 03, «Así se resuelve» de A1). El dron en la plaza tapa el 0 del eje. | El rótulo después de la punta; la flecha con ángulo más larga (la de la manguera, fija); la cota de la altura en la vertical de salida, y esa vertical punteada cuando no hay cota; los números del eje x más abajo. |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección |
|---|---|---|---|---|
| B1 | 10 (decisión 14) | Generador `alcance-45` (30 y 40 m/s; el papel p8 era el de 40 m/s); teoría `T45` y `RAPIDEZ37` (30 m/s); ejemplo 4.10 | Pelotas pateadas a 30 y 40 m/s. La decisión 14 pone el tope en 25 m/s. | Hasta 25 m/s; 4.10, una piedra con huaraca. |
| B2 | Regla 3 | Glosario «tiempo de subida» | «Si sube con 5 m/s, llega arriba en medio segundo» es el paso 1 de «Mira» de A4. | 15 m/s y 1,5 s. |
| B3 | Distractor | «Ahora tú» de A3, k = 2 | La opción TP-SIN-MEDIO puede salir negativa («−10 m») para una pelota que sigue en el aire (semilla 146). | Descartarla si no es positiva, como ya hace el generador. |
| B4 | Redacción | «Así se resuelve» de A4 y generador `veces` | «Con el mismo ángulo y 1,5 veces de esa rapidez». | «1,5 veces esa rapidez». |
| B5 | Datos | p, q y r de la fórmula general | Aparecen sin decir qué son (lector A, «Así se resuelve» de A3). | «(p, q, r: sus tres números)». |
| B6 | Lectores en frío | Ejemplo 3.14 | «vₓ = 16 m/s; v_y = 12 − …» sin decir de dónde salen 16 y 12. La **E** dice «suma los 20 m/s», que se confunden con la rapidez de salida (lector B, tarjeta 09). | Una línea con las componentes; «suma g · t = 20 m/s». |
| B7 | 5 (color) | Ejemplo 5.3 | La respuesta «7 m» (una distancia) va en naranja, el color de la velocidad. | Violeta. |
| B8 | 4 (encuadre) | Ejemplo 2.7 | La piedra cae a 160 m y la figura abarca 130 m. No se ve (no hay camino dibujado), pero la escala no corresponde. | Ancho de 170 m. |
| B9 | Pedagogía | `DB.trig45` en «el ángulo del mayor alcance» (4.11 y «Ahora tú» k = 3 de A4) | Dar sen 45° en los datos adelanta que el ángulo es 45°. | Se deja: la regla lo dice, y sin el dato el alumno necesitaría memorizar √2/2 (punto 13). |
| B10 | Comentario | `PARTICULAS` | Dice «con distancia entera» y salen 15,62 m, 21,93 m… | Corregir el comentario. |
| B11 | Lectores | Rejilla vacía de «Ahora tú» de A5, «Leer la velocidad» y «Dos drones» | Sin números ni drones (lector B). Si se ponen los números, la figura muestra la respuesta: la prueba de la unidad lo detecta (60 m). | Se deja; los dibujos, para Gerson. |

## Lo que está bien y hay que copiar al molde

- **Cuentas con un segundo camino de verdad**: la prueba de la unidad y la de `fis-parabolico` integran el vuelo paso a
  paso en vez de usar las fórmulas. `casos.json` describe su script (pasos de 10 µs, punto medio, bisección) y los 19
  casos cuadran con el mío.
- **Ninguna mezcla de convenciones**: h y la velocidad hacia abajo viven solo en A1 y A2; desde A3, el eje hacia arriba.
  Ningún ejercicio trae datos de las dos, ni en la teoría ni en la práctica (comprobado en 3 000 casos).
- **Ninguna fórmula práctica en los datos** (decisión 6): t_v = 2v₀ sen θ/g, H = v₀² sen² θ/2g y R = v₀² sen 2θ/g salen
  como resultado en «Mira» y en la regla, nunca en `datos`. La cabecera del generador lo declara, y se cumple.
- **El ángulo de lanzamiento en tinta** en todas partes (pieza, controles, ejemplos y generador), y g en carmín.
- **Misiones con una sola respuesta en su grilla** y predicciones con un código por opción, que ningún juego muestra.
- **Distractores que valen lo que dicen**: 188 comprobaciones en los ejemplos y 2 000 casos generados, con las tres
  excepciones de M4.

## Reglas que faltan en el contrato o el validador

| Regla | ¿Automática? |
|---|---|
| **Una figura no deja medir lo que se pide**: si una cota pide «?» y otra trae un número, en la misma escala, la figura va sin escala o sin una de las dos (M1). | Sí, para piezas que exponen sus cotas en `geometria()` (aquí: `sinEscala`). En general, semi. |
| **Lo que se dibuja cumple el enunciado**: el punto donde cae el camino dibujado coincide con la cota o el blanco del texto (M3). | Sí en piezas con simulación propia: comparar el final del camino con `cotaAlcance.hasta`. |
| **La condición de una regla con eje vertical dice hacia dónde apunta**, y la línea de datos con v_y o y también (M2). | Sí, con una tabla de la unidad (qué ideas miden hacia abajo y cuáles hacia arriba). |
| **El glosario no responde la misión**, además de la Predice: el valor de `logrado` (60°) junto al de la consigna (30°) (M6). | Sí, si la misión declara su valor (como `logrado` lo calcula). |
| **Una lectura que muestra un instante redondeado calcula con ese instante** (M7). | Sí: evaluar «v · t» con los números de la propia lectura en instantes fuera de la grilla. |
| **La explicación de cada distractor usa solo herramientas de los datos o de la regla** (M4). | No (revisión humana). A lo más, buscar fórmulas que no están en ningún dato ni regla de la unidad. |
| **Topes de rapidez por objeto** (pelota pateada ≤ 25 m/s; piedra a mano ≤ 20 m/s) (B1). | Sí, con la tabla de §8 de la propuesta. |

## Correcciones (19 nov)

Fase 8 del método (`docs/metodo/unidad/6-correcciones.md`), junto con las notas de los dos lectores en frío (ver
`rutinas/frio/fisica.movimiento-parabolico-y-circular.md`, «Correcciones de la ronda 1»). La teoría pasa a v0.4.1. Copias de
antes en `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e5-cierre-par/antes/`, y un árbol con la
versión de antes en `.../e5-cierre-par/antes-repo/`, que sirvió para ver fallar las pruebas nuevas.

Pruebas nuevas:
- al final de `movimiento-parabolico-y-circular.test.js`, 11;
- al final de `fis-tiro.test.js`, 5;
- al final de `fis-parabolico/generador.test.js`, 3.

Las 19 fallan con la versión de antes (comprobado en `antes-repo`). Después:
- unidad 38 de 38, pieza 34 de 34, generador 33 de 33, `tiro-parabolico` 70 de 70, `papel-reglas` 6 de 6;
- `contenido/teoria/teoria.test.js`, 163 de 163;
- validador con `calidad: 2` simulada (200 semillas), sin problemas ni pendientes;
- los scripts de cuentas otra vez, todo en verde: 188, 2 000, 1 000, 19 y 8 casos, y 0 igualdades falsas en 22 369 textos;
- `figuras.js`: ninguna figura medible;
- `herramientas/ecuaciones-ancho.js`: «todo cabe» (56 pantallas).

No se corrió `npm test` completo (otras sesiones trabajando). `npm run catalogo` cambió, de esta unidad, solo
`app/datos/glosario/fisica.json` y `app/datos/catalogo.json`; los dos son compartidos. `herramientas/papel-generador.js
fis-parabolico` regeneró el papel: cambian p3, p5 y p7 (el espacio duro de «sen θ») y p8, que pasa de 40 m/s a 25 m/s
(B1). Capturas de después: `.../e5-cierre-par/cor/`.

| # | Qué se hizo |
|---|---|
| M1 | `fis-tiro`: con una cota «?» y otra con número (o con `escala: false`), cada eje lleva su escala (lo de lado, el 62 % del piso; la altura, 110 px) y abajo a la derecha va «Dibujo sin escala». `geometria()` devuelve `sinEscala`, `kx` y `ky`. Pruebas: en la pieza, la mesa de 80 cm ya no tiene sus dos rayas iguales y sin «?» sigue a escala; en la unidad, toda figura así lleva la nota (más de 20 en 60 semillas). |
| M2 | Condiciones: A1 «h se mide hacia abajo»; A3 y A4 «eje vertical hacia arriba» (A3 con «al subir, velocidad positiva»); A5 «y es la altura». `DB.vyt`, `DB.v2` y `D.v2` dicen «con el eje hacia arriba». Prueba en 120 semillas de A3 a A5. |
| M3 | 4.12 dibuja vₓ = 20/√5 y v_y = 10/√5: el chorro cae en la cota de 8 m. Prueba: todo chorro de manguera con cota cae en ella. |
| M4 | 4.14: el tiempo de vuelo sale de y = 0 (0 = 0,8v₀·t − 5t², con la ecuación de y en los datos) y la **A** pasa a 16 m, «toma como vuelo solo la subida». 5.12: la **D** pasa a 2,4 m, «no eleva el tiempo al cuadrado». 5.13: «**B** eleva la x al cuadrado pero no el 5». Recalculado en `ejemplos.js`. Prueba: los valores de A y D, y que ya no se nombra el atajo. |
| M5 | 2.12 trae `DB.vxy` (vₓ = v₀ y v_y = g·t en una línea, para quedar en 6 líneas); 2.14 solo `DA.g`; 4.8 resuelve el vuelo con y = 0. Generador: `D.vx` en `llegada` y `angulo-t`. Pruebas en la unidad y en el generador (300 semillas). |
| M6 | «alcance máximo»: «A 40° o a 50° cae un poco más cerca que a 45°»; «ángulos complementarios»: «20° y 70°». Prueba. |
| M7 | La lectura de A5 calcula con el instante redondeado que muestra. Prueba en cuatro instantes fuera de la grilla. |
| M8 | Regla de A5: x = x₀ + v₀ₓ·t + ½·aₓ·t² e y = y₀ + v₀ᵧ·t + ½·aᵧ·t², y d con la llave «distancia al origen». Condición: «aceleración constante en cada eje (dron: cero); d, distancia al origen. En un tiro de costado, y es la altura: aceleración −g.» «Así se resuelve» dice «Ahora la pelota se ve de costado: x es lo que avanza e y, la altura», y su figura marca con una × el x pedido (sin número, para no dar escala). 5.14 da «Distancia entre dos puntos, uno en cada eje». Prueba. |
| M9 | Condición de A3: «La academia usa ± ½ · g · t²; aquí el eje da el signo.» Prueba. |
| M10 | (a) «Misión (2 s): 8 m/s de lado, 20 m/s abajo». (b) El juego de A2 rotula v_x, v_y y v⃗, y la leyenda tiene «velocidad de lado: la flecha discontinua horizontal» y «velocidad hacia abajo: la flecha discontinua vertical». (c) Cada flecha de g con su «g» (pieza). (d) `MIRA_A3` sin la regla de la pared en los cortes con flechas, y el paso 1 dice «Las flechas van en m/s, no en metros». (e) El último corte rotula «25 m/s». Pruebas en la unidad y en la pieza. |
| M11 | `fis-tiro`: el rótulo de la flecha de lado va 16 px después de la punta; la flecha con ángulo mide 30 + 2·v px (de 40 a 80), y la de la manguera, 72 px; su rótulo va pasando la punta; la cota de la altura va en la vertical de salida, desde debajo del objeto, y sin ella se dibuja esa vertical punteada (también con dos piedras y la regla del agua, donde marca el 0); los números del eje x del dron, 6 px más abajo. Pruebas: rótulos fuera del halo de 13 px de la manija, cotas en la vertical, el dron no tapa el 0. |
| B1 | Generador `alcance-45`: 10, 15, 20 y 25 m/s (el papel p8 pasa a 2,5√2 s y 25 m/s). `T45` sin 30 m/s ni 2√2 s (es el ejemplo 4.11); `RAPIDEZ37` hasta 25; 4.10 es una piedra con huaraca. Pruebas en la unidad (400 semillas) y en el generador. |
| B2 | «Si sube con 15 m/s, llega arriba en 1,5 s.» |
| B3 | La TP-SIN-MEDIO de A3 (k = 2) se descarta si no es positiva. Prueba: ninguna altura negativa en 400 semillas. |
| B4 | «el triple de esa rapidez», «1,5 veces esa rapidez», «la mitad de esa rapidez», en la teoría y en el generador. Prueba. |
| B5 | «Si p · t² + q · t + r = 0 (p, q, r: sus tres números): …», en la teoría y en el generador. Prueba. |
| B6 | 3.14 trae primero v₀ₓ = 20 · 4/5 = 16 m/s y v₀ᵧ = 20 · 3/5 = 12 m/s; la **E** «suma g · t = 20 m/s en vez de restarlo». |
| B7 | «7 m» en violeta. |
| B8 | 2.7 con ancho de 170 m. |
| B9 | Se deja (ver la tabla). |
| B10 | Comentario corregido. |
| B11 | Se deja; para Gerson. |
| Papel de `tiro-parabolico` (pedido de la sesión) | Cada problema dice su unidad (`"unidades"`, después de `"id"`, sin reformatear). Sigue el reparto de `nucleo/repaso-tipos.js`: p2 a p6 y p9, Movimiento parabólico; p1, p7, p8 y p10, Movimiento circular. Con las dos unidades simuladas en calidad 2, `papel-reglas` pasa de 10 fallas a 0. |

Además, cada relación de las cinco reglas va en su renglón: el separador `'   ·   '` en lugar de `';   '`. Así, a 390 px,
«v =» ya no queda al final de un renglón con la raíz en el siguiente. «sen θ» y «cos θ» van con espacio duro, en la regla
y en los datos. Prueba.

### Pendiente

- **De `app/`:** en el juego de A4, la ayuda dice «Arrastra los círculos de la figura, o usa – y +», pero un control de
  opciones (los ángulos) no tiene botones – y + (lector B).
- **Para Gerson:** los dibujos de prueba de `fis-tiro` (la peña, la mesa, la avioneta, la manguera, el dron) y la rejilla
  vacía de A5 (B11). También la nota «Dibujo sin escala», una decisión nueva de esta corrección: es lo menos que cambia la
  figura sin borrar lo pedido.
- **Decidido por la sesión, Gerson revisa después:**
  - con dos piedras (Predice y Mira de A1), el 0 del agua sigue bajo la lanzada, porque las piedras no pueden salir del
    mismo punto sin taparse. Se dibuja la vertical punteada que marca ese 0, y la soltada cae a su izquierda, pegada a la
    peña;
  - la lectura de A2 dice el blanco de la misión («Misión (2 s): …») y no lo de ahora. Con lo de ahora, a los 2,5 s se
    leía «25 m/s», que es la respuesta de la Predice.
- **Las reglas nuevas del validador** quedan como propuesta (tabla de arriba). En esta unidad, varias ya son prueba propia.
