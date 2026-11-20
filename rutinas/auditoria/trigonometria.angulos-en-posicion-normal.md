# Auditoría de contenido: «Ángulos en posición normal» (trigonometria.angulos-en-posicion-normal)

20 nov 2026. Auditor externo del cierre delegado (`docs/metodo/unidad/cierre-delegado.md`), que no escribió la unidad.
Contrato: `docs/plan-calidad.md` §3 y §5. Formato: `docs/teoria.md` 4e, 4f, 4h y §5. Vara: `docs/molde-unidad.md` §10.
Reglas automáticas: `docs/metodo/unidad/reglas-validador.md`. Lo aprendido en las Etapas 5 a 7: `etapa-delegada.md`, «Lo
que encontraron los auditores» y «Lo que salió al cerrar la Etapa 7». Decisiones del autor:
`docs/etapa8/propuesta-trigonometria.md` (§9, decisiones 1 a 23). Lo que vieron los dos lectores en frío está en
`rutinas/frio/trigonometria.angulos-en-posicion-normal.md`; aquí se cita cuando el código lo confirma o lo agrava.

**Qué se revisó.**
- La teoría `contenido/teoria/trigonometria/angulos-en-posicion-normal.js` (v0.2.0, sin `calidad: 2`): las 5 ideas con sus
  7 momentos, los 75 ejemplos, «Ahora tú» y «Así se resuelve» (400 semillas de cada uno por idea), el glosario (17
  términos), las 3 mesas y la historia.
- La pieza nueva `nucleo/kit/piezas/trig-pos.js` (el plano de `trig-plano` con cinco objetos de fondo) con su prueba.
- La práctica `plantillas/trig-posicion-normal/`: 15 tipos en las 5 ideas, `casos.json` (32) y `papel.json` (8); y el papel
  de la escena compartida `circunferencia-trig` en lo que toca a esta unidad (p1 a p6).
- La prueba del curso: `tri-16` y `tri-17` de la reserva (`catalogo/pruebas/trigonometria.json`).
- La app a 390 px con `--entera` (servidor propio, puerto 4452): los 35 momentos y las 75 tarjetas
  (`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e8-cierre-pn/lector/`, rehechas hoy, también
  Predice de las ideas 4 y 5; sin capturas repetidas por md5).

**Cuentas.** Rehechas con scripts propios en
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e8-cierre-pn/`: `cuentas.js` (`node cuentas.js
400`), `ejemplos.js` y `figuras.js` (`node figuras.js 400`). De la unidad y del generador solo leen el texto (y, en
`figuras.js`, el SVG que dibuja la pieza). Nada sale del código de la unidad ni de los scripts del autor:
- **Razones desde P(x, y)**: r = `Math.hypot(x, y)` y cada razón como cociente de x, y, r; la coordenada que falta, con
  a² = r² − (la otra)² y el signo del enunciado; el punto medio, promediando.
- **Signos por cuadrante**: el cuadrante de un ángulo sale de los signos de (cos g, sen g); el de dos condiciones, por
  fuerza bruta en los cuatro cuadrantes; «una razón y el cuadrante» arma los dos ángulos de [0°, 360°) con esa razón
  (con las funciones inversas) y se queda con el del cuadrante dado; el otro da el distractor de la raíz.
- **Cuadrantales**: P = (cos g, sen g) redondeado a 1e-12, r = 1; una razón con denominador 0 es «no existe» (`null`),
  nunca 0, y se comprueba aparte que un 0 se escriba «0» y un `null`, «no está definida».
- **Ángulos negativos**: el cuadrante con (cos g, sen g) del ángulo con su signo; el error TR15, con −g; TRNEG-180, con
  g + 180°.
- **Coterminales**: el de [0°, 360°) con `atan2`; «son coterminales» si (α − β)/360 es entero; el α = kβ, recorriendo n.
- **Igualdades**: toda cadena «a = b = c» con números, raíces y fracciones de los resueltos, las soluciones, Mira, la
  regla, Lee, el glosario y las lecturas de toda la grilla de los juegos se evalúa (2 303 igualdades).
- **Lo que no entra**: se buscó en todos los textos el ángulo de referencia, «sen(−θ) = −sen θ», «= −sen 60°», «reduc…»,
  el radio 1, y toda razón de un ángulo de los cuadrantes II a IV con su valor y sin su punto; «sen 390° = sen 30°» solo
  vale si los dos ángulos son coterminales y es la misma razón. Y todo «37°» o «53°» exige «(convención del examen)».

**Resultado (versión de antes):**
- «Ahora tú»: 2 000 casos (400 por idea), «Así se resuelve»: 2 000, práctica: 2 000 problemas (400 por idea, con
  `{ idea }`), los 32 de `casos.json` y los 8 de papel: **ninguna respuesta equivocada**; cada distractor con el valor de
  su error (rehecho por el mismo camino que la correcta), una sola correcta y cuatro opciones distintas. **113 486
  comprobaciones cuadran y 301 no**: todas son explicaciones de distractores que afirman algo falso (M1 y M2).
- Los 75 ejemplos (310 comprobaciones): cada respuesta y, en los 25 de nivel 3, la letra, una sola alternativa con el
  valor correcto y **cada alternativa equivocada con el valor del error que dice su resuelto**. Todo cuadra; una
  explicación no dice el error real (M9, el 140° de «Suman 1000°»).
- Las 5 predicciones con sus distractores y las 5 misiones en toda su grilla (una sola salida, ninguna al abrir, y la
  salida cumple el texto por coordenadas: el 8 del reloj es −150°).
- **Ningún valor sale del ángulo de referencia ni de la paridad** en la unidad ni en su práctica (0 hallazgos en todos los
  textos). Las razones de −45°, −135°… de «Así se resuelve» de la idea 4 salen de su P. La paridad solo aparece en la
  mesa `giro-y-opuesto`, que ya está en «Más mesas del tema» (decisión 14). **Pero el papel de `circunferencia-trig`
  le da a esta unidad p5 (reducir al primer cuadrante) y p6 (la paridad)** (M3).
- **37° y 53° no aparecen** en la unidad ni en su práctica; sí en p3 del papel de `circunferencia-trig` (elevación),
  sin «(convención del examen)» (B5).
- **El reloj gira de verdad en sentido horario con el signo menos**: en las 5 371 figuras (Lee, toda la grilla de los
  juegos y de las mesas, Predice y su revelado, cada paso de Mira, la regla, los 75 ejemplos y 400 semillas de «Ahora tú»
  y «Así se resuelve»), cada uno de los 3 463 arcos barre en pantalla el ángulo pedido con su signo (horario si es
  negativo), con su amplitud (±1°) y termina en la dirección de su lado final. En los ejemplos de la idea 4, el texto y el
  arco dicen el mismo ángulo (−60° del 3 al 5, −300° con P(1, √3), −118,07° con P(−8, −15)).
- **Figuras a escala que regalen una predicción o una misión**: ninguna. Lee, la grilla del juego y la consigna no
  muestran P(−12, 5), el signo de tan 225°, tan 90°, −300° ni el lado de 780° (60° no está en la grilla); las figuras de
  «¿dónde termina?» no dibujan el lado final (decisión 20). Lo que sí adelanta: «Así se resuelve» de los coterminales
  dibuja el giro (y su cuadrante) antes de resolver (M11).
- **Rótulos de ángulos**: 845 de 2 804 pisan un eje, el lado final o un tramo (M5); y 987 figuras tienen el arco de θ con
  menos de 14 px de radio (M6).

Validador con `calidad: 2` simulada (`Teoria.problemas`, 400 semillas): **0 problemas** antes de corregir.
`herramientas/ecuaciones-ancho.js`: «todo cabe» (47 pantallas, 341 renglones). Regla del papel con la marca simulada
(lección 18): sin fallas (`circunferencia-trig` pasa porque tiene `"rehacer"` con esta unidad). Pruebas propias antes de
corregir: unidad 9 de 9, pieza 3 de 3, generador 10 de 10.

## Hallazgos

No hay hallazgos de gravedad Alta: ningún valor está mal en 400 semillas.

### Media (el alumno se traba, duda, la figura le confunde o una explicación le dice algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 2; Etapa 5 n.º 2 | Idea 3, «Ahora tú» tipo 1 (98 explicaciones en 400 semillas); práctica `razon-eje` (70) y `razon-negativo` (78) | Si la razón vale 0 (sen 360°, cot 270°, cos 270°, tan 360°, sen(−180°)…), los distractores «1» y «−1» dicen **«El tamaño 1 está bien; el signo sale del punto»**: es falso, el tamaño es 0. | Con la razón en 0: «1 usa la coordenada que no es 0; en (0, −a), cot 270° tiene el 0 arriba: vale 0» (TR11). |
| M2 | 2; Etapa 5 n.º 2 | Idea 3, «Ahora tú» tipo 3, «con múltiplos de θ» (32 de 400); práctica `multiplos` (23) | El distractor «sin los signos de los puntos» también le quitaba **el menos de la expresión** (`abs[1] · sign(t2)`): en «(3 sen θ − cos 2θ)/(cos (3θ/2) + 3)», sin los signos de los puntos sale −1/3 (la correcta); la opción dice 1/3. | El segundo término conserva su signo: c₁\|v₁\| + c₂\|v₂\| sobre c₃\|v₃\| + d. |
| M3 | 9; Etapa 5 n.º 6 y 11 | Papel de `circunferencia-trig`, p5 y p6 con `"unidades"` de esta unidad (decisión 11) | p5 es «Reduce al primer cuadrante: sen 240°, cos 135°, tan 330°» con el ángulo de referencia; p6 usa «el coseno no cambia con el signo del ángulo» (la paridad). Desde esta unidad, el papel de la escena los muestra (`app/app.js`, filtro por `q.unidades`), y la unidad los deja fuera a propósito. | p5 y p6 solo de «Reducción» (papel y `nucleo/repaso-tipos.js`). |
| M4 | 4, 8 | Idea 5 entera (lector B, nota de la sesión) | La idea de los coterminales «negativos» solo tiene un negativo fuera de los ejemplos: la misión. Predice 780°, Mira 60° y 780°, la regla 420°, «Así se resuelve» de la semilla 0 1230° y el juego abre en 90° + 0 vueltas. | Predice con cos(−660°) (mismos ids de opción), Mira y revelado con −660°, la regla con 60°, 420° y −300°, «Así se resuelve» que alterna empezando por −500° y el juego que abre con n = −1. |
| M5 | 5; Etapa 5 n.º 5 | Pieza: rótulos de los arcos (2 804 en 5 371 figuras) | **845 rótulos de ángulo pisan un eje, el lado final o un tramo**: θ de un giro de 180° o 360° cae justo sobre un eje (trig-plano lo pone en la mitad del arco); θ de P(4, 1) o P(3, 1) sobre el eje x y el lado final (80 de 400 «Así se resuelve» de la idea 1); «−150°», «190°», «1230°» sobre el eje y en la idea 5; «−180°» y «−270°» de Mira 4. El autor movió dos a mano. | La pieza prueba lugares a lo largo del arco (y, si el ángulo es muy angosto, junto al final del arco, del otro lado del lado final) hasta uno que no pise ejes, líneas, puntos, textos ni el arco. |
| M6 | 5 | Pieza: radio de los arcos (lector A) | En 987 figuras el arco de θ mide menos de 14 px: en Predice 1 (157°) queda dentro de la plaza (10 px) y no se ve que llegue a la casa; en Predice 2 (225°) «parece terminar cerca de 180°»; en «Ahora tú» de la idea 3, 270° «no llega al eje». | Radio mínimo de 20 px en la pieza. |
| M7 | 3; Etapa 6 n.º 15 | Idea 1, misión (lector A) | «Pon la casa al oeste, a 5 cuadras de la plaza, con sen θ = 4/5» se lee como x = −5, y así es imposible. | «Pon la casa al oeste, con r = 5 cuadras y sen θ = 4/5.» (r es «distancia en línea recta» en la leyenda). |
| M8 | 5 | Pieza: rueda y veleta (lectores A y B) | Las patas de la rueda de la fortuna salen del origen y «parecen dos lados finales más» en el III y el IV; las plumas de la veleta («>», «v») parecen otra punta de flecha (tarjeta 07: «una punta suelta»); la «O» de oeste se lee como cero junto a (−a, 0). | Patas desde el aro; cola de la veleta como placa tenue; «norte», «este», «sur», «oeste» en palabras. |
| M9 | 2, 3 | Idea 5, ejemplo 15; idea 4, ejemplos 3, 7 y 13 y misión; idea 5, juego, misión y texto alternativo (lector B) | «140° usa n = 2 y **resta mal**» (con n = 2, 1000° − 860° = 140° está bien hecha: el error es n = 2, que deja α fuera del rango); «Del 3 al 5 hay **dos números**» (está el 4: son dos espacios); «la válvula **queda donde con** 90°» (frase rota). | «140° usa n = 2, con α = 860° fuera del rango»; «dos espacios entre números»; «queda igual que con 90°». |
| M10 | 3, 5 | Idea 4: juego, Predice y Mira (lector B) | El juego abre en 0°: el minutero queda tapado por el eje x y el control en su tope; Predice dice «El juego llegó hasta −180°» (la misión era −150°); Mira dice «del 3 al 6» sin minutero en el 6 (solo se dibuja en el paso 4). | El juego abre en −30° (el 4); «El minutero del juego no pasa de −180°»; Mira con el minutero en cada cuarto. |
| M11 | 4; Etapa 5 n.º 4 y 5 | Idea 5: «Así se resuelve» y ejemplo 3 (lector B) | «Así se resuelve» dibuja el giro de 1230° con P en el II antes de resolver (regala el cuadrante); la tarjeta 13 dice «θ = −60°» con P en 0° (la rueda antes de girar, decisión 20) y el lector cree que P está mal. | Arriba, la rueda sin girar; el giro aparece en el paso de las cuentas. P se rotula «P al empezar». |
| M12 | 3, 6 | Reglas de las ideas 2, 3 y 4; Lee 3 (lectores A y B) | La regla de signos no dice que «II: sen, csc» son las positivas; la de cuadrantales usa «a» sin decir qué es; la de negativos se lee «Vale si Sigue: …» y cierra con «Sus razones salen de su P» (no se ve ninguna razón); Lee 3: «El origen va en su eje y el eje x, hacia el este» (dos «ejes»). | «I: todas > 0», «II: sen, csc > 0»…; «Vale si a = r, la distancia al origen…»; los cuatro intervalos en la fórmula y «Vale si θ entre 0° y −360°…»; «El origen va en el poste, y el eje x apunta al este». |
| M13 | 5 | «Así se resuelve» de las ideas 2 y 3; tarjetas 06, 08, 09 y 12; ejemplos de ejes (lectores A y B) | Ejes vacíos con I a IV que no muestran 140°, 220° ni 310°, ni dónde caen 90° y 180°; en la tarjeta 06 (sen θ = 2/3 en el II) no está P. | Los tres lados finales en la idea 2; los ángulos del ejercicio sobre sus ejes en la idea 3 (sin valores); P(−√5, 2) con «x = ?», y = 2 y r = 3 en la tarjeta 06; los cuartos de vuelta horarios (−90°, −180°, −270°, −360°) en los de negativos. |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección |
|---|---|---|---|---|
| B1 | 3 | Idea 1, voz del juego | «¿Qué número de la casa usa el seno?» suena a la dirección (lector A). | «¿Qué coordenada de la casa…?» |
| B2 | 5 | Idea 1, Lee | La plaza no tiene nombre en el dibujo (lector A). | Rótulo «plaza». |
| B3 | 5 | Idea 3, Mira | «x = 0» sobre el eje x positivo, lejos de P (lector A). | Junto a P, sobre el eje y. |
| B4 | 3 | Idea 3, ejemplo 3; idea 1, ejemplo 14 | «y = 0 va arriba»; «tienen la misma abscisa abajo» (lector B). | «La ordenada y = 0 queda arriba del cociente»; «el mismo denominador, la abscisa». |
| B5 | 1, 13 | Papel de `circunferencia-trig`, p3 (elevación, de esta unidad por la decisión 11) | «Usa la convención del triángulo de 37° y 53°» sin «(convención del examen)» ni los valores; «32 · 3/5 ≈ 19,2» es exacto. | «Datos: tan 37° = 3/4 y sen 37° = 3/5 (convención del examen).»; «= 19,2». |
| B6 | 6 | Reglas de las ideas 1 y 3, Mira 3 | «no existen tan ni sec» junto a «no está definida» (lector A: dos formas de decir lo mismo). | «no están definidas» en toda la unidad. |
| B7 | 2 | Idea 5, Predice | La opción 13/2 «no sale de ningún error» (lector B): la explicación no hacía la cuenta. | En la predicción nueva: «−660° es −11 veces 60°, y −11 · 1/2 = −11/2». |
| B8 | 5 | Idea 4, ejemplo 3 (tarjeta 10) | El minutero tapa el 5 (lector B). | No se tocó: el minutero de un reloj pasa por encima de su número. |
| B9 | 5 | Tarjetas 05, 14 y 15 | Plano de cuadrantes sin nada (lector B). | No se tocó: dibujar los ángulos de 14 (1110° y −330°) o de 15 mostraría la respuesta. |
| B10 | 4 | Idea 2, ejemplo 3 (tarjeta 04) | P en el IV antes del resuelto del signo de tan 300° (lector B). | No se tocó: ubicar el cuadrante es el método, no la respuesta. |
| B11 | 5 | Idea 4, Lee 1 | «En el dibujo no hay ninguna aguja» (el minutero en el 3 va sobre el eje x). | No se tocó (Lee no pide nada; el juego ya abre en el 4). |
| B12 | 4 | Idea 3, título | «Cero no es "no definida"» avisa que algo no está definido en Predice (lector A). | No se tocó: es el título de la idea (propuesta §1). Para Gerson. |
| B13 | 5 | Idea 2, juego y Predice | «y > 0» queda sobre el aro; «x < 0» apretado con θ (lector A). | «x > 0» y «x < 0», siempre bajo el eje x. |

## Lo que está bien y hay que copiar al molde

- **Ninguna cuenta equivocada** en 2 000 «Ahora tú», 2 000 «Así se resuelve», 75 ejemplos (con sus 100 alternativas
  equivocadas), 5 predicciones, 5 misiones, 2 000 problemas de práctica, 32 casos y 8 de papel, rehechos con coordenadas y
  `atan2`.
- **«No existe» nunca se confunde con 0**: en los cuadrantales y en los negativos sobre un eje, la correcta dice «0» cuando
  el 0 queda arriba y «No está definida» cuando queda abajo, en las 4 000 semillas de la teoría y la práctica.
- **Ningún valor sale del ángulo de referencia ni de la paridad**: todo ángulo fuera del I trae su punto, es cuadrantal o
  se lleva a su coterminal del I con vueltas enteras. La regla «sin su punto no se pregunta» (decisión 3) se cumple.
- **El giro con signo se dibuja como se dice**: los 3 463 arcos barren su ángulo con su signo y terminan en su lado final;
  las figuras de «¿dónde termina?» no dibujan el lado final.
- Misiones de una sola salida que se comprueban por coordenadas; predicciones que el juego no muestra; letras del nivel 3
  repartidas; colores por magnitud con prueba en figuras y textos.

## Reglas que faltan en el contrato o el validador

| Regla | ¿Automática? |
|---|---|
| **Una explicación que dice «el tamaño está bien» tiene el tamaño de la correcta** (M1). | Sí: si el `siFuera` dice «tamaño … está bien», \|distractor\| = \|correcta\| (lectura de números). |
| **«Sin los signos» quita solo los signos de los puntos, no los de la expresión** (M2). | Parcial: por unidad (esta lo prueba en la teoría y en el generador). |
| **El rótulo de un ángulo no pisa los ejes, el lado final ni los tramos** (M5). | Sí: esta pieza lo hace y lo prueba (`trig-pos.test.js`, «cierre»). Conviene llevarlo a `trig-plano`, que hoy pone el rótulo a ciegas en la mitad del arco: con 180° o 360° cae sobre un eje en cualquier unidad. |
| **El arco de un ángulo mide 20 px o más** (M6). | Sí (prueba de la pieza). Mismo comentario para `trig-plano`. |
| **El papel de una escena compartida no le da a una unidad lo que enseña una posterior** (M3). | Parcial: palabras clave por unidad («Reduce», «sen(−θ)», «ángulo de referencia») contra el `requiere` del catálogo. |
| **Una idea que en su título o su `id` promete negativos los practica en Predice o en «Ahora tú»** (M4). | No: es de lectura. |

## Correcciones (20 nov)

Fase 8 (`docs/metodo/unidad/6-correcciones.md`), junto con las notas de los dos lectores en frío (ver
`rutinas/frio/trigonometria.angulos-en-posicion-normal.md`, «Correcciones de la ronda 1»). La versión de la teoría no se
cambió (sigue en 0.2.0, sin `calidad: 2`). Copias de antes en
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e8-cierre-pn/antes/`.

Pruebas nuevas: 6 al final de `angulos-en-posicion-normal.test.js` («cierre: …»), 2 en `trig-pos.test.js` y 1 en
`generador.test.js`. **Con la versión de antes (unidad, pieza, generador y papel de `antes/`, en un espejo del repositorio,
`…/e8-cierre-pn/espejo/`) fallan las 9**; con la de ahora pasan. Después: unidad 15 de 15, pieza 5 de 5, generador 11 de
11; `contenido/teoria/teoria.test.js` en verde; `nucleo/avance.test.js`, `nucleo/repaso-tipos.test.js`,
`herramientas/papel-reglas.test.js` y `plantillas/circunferencia-trig/motor.test.js` en verde. Validador con `calidad: 2`
simulada y 400 semillas: sin problemas. Regla del papel con la marca simulada: sin fallas. `npm run -s catalogo` hecho.
Papel de la práctica regenerado con `herramientas/papel-generador.js trig-posicion-normal` (no cambió). No se corrió `npm
test` completo (otras sesiones trabajando). Capturas de después, a 390 px:
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e8-cierre-pn/despues/` (110, sin repetidas por
md5; los tres últimos retoques, el rótulo de x en la rueda, «P al empezar» bajo P y el punto en la punta del minutero de
Mira 4, se ven en `…/e8-cierre-pn/galeria.png`). `herramientas/ecuaciones-ancho.js`: «todo cabe» (47 pantallas, 341
renglones).

| # | Qué se hizo |
|---|---|
| M1 | Teoría (`casoEje`) y generador (`opcionesEje`): si la razón vale 0, el ±1 es TR11 con «1 usa la coordenada que no es 0; en (0, −a), cot 270° tiene el 0 arriba: vale 0». Prueba (teoría y generador): ningún «tamaño 1 está bien» con la razón en 0. |
| M2 | Teoría (`casoMultiplos`) y generador (`multiplos`): `abs[0] + abs[1]` (el segundo término ya lleva su signo). Prueba: el distractor vale c₁\|v₁\| + c₂\|v₂\| sobre c₃\|v₃\| + d, rehecho aparte. |
| M3 | Papel de `circunferencia-trig`: p5 y p6 solo de «Reducción» (archivo compartido: solo el campo `unidades`); `nucleo/repaso-tipos.js` igual (archivo compartido, una fila con su comentario). Prueba: ningún problema de esta unidad en ese papel reduce ni usa la paridad. |
| M4 | Predice: «Sabemos que cos 60° = 1/2. ¿Cuánto vale cos(−660°)?», con los mismos ids (`c` 1/2, `crece` −11/2, `signo` −1/2, `no-existe`); la unidad ya está en `REHECHAS_E6` con `coterminales-negativos` entre las que cambian, y la versión 0.2.0 no se publicó todavía. Mira y revelado con −660° (espiral horaria); regla con 60°, 420° y −300°; `RES5` empieza en −500° y alterna; el juego abre con n = −1 (−270°). Prueba: Predice, Mira, regla, juego y «Así se resuelve» tienen negativos; la predicción, rehecha con coordenadas. |
| M5 | Pieza: `rotulosDeArcos` pone el rótulo de cada arco probando lugares a lo largo del arco y a varias distancias, sin pisar ejes, segmentos, rayos, puntos, textos (también los del objeto, como los números del reloj) ni arcos; si el ángulo es muy angosto, junto al final del arco, del otro lado del lado final. El rótulo «−270°» de Mira 4, puesto a mano, pasa al arco. Prueba (pieza): ningún rótulo de ángulo pisa una línea en toda la teoría. `figuras.js`: de 845 a 0. |
| M6 | Pieza: radio mínimo de 20 px para todo arco. Prueba: ningún arco de la teoría con menos de 19,5 px. |
| M7 | «Pon la casa al oeste, con r = 5 cuadras y sen θ = 4/5.» Prueba: la misión dice r = 5. |
| M8 | Pieza: patas de la rueda desde el aro; cola de la veleta como placa tenue; puntos cardinales en palabras. Prueba (pieza). |
| M9 | Ejemplo 15: «140° usa n = 2, con α = 860° fuera del rango; … 860° es ese α de n = 2»; «dos espacios entre números» (ejemplo 3), «4 espacios», «8 espacios» y la misión; «queda igual que con 90°» (lectura), «en el mismo lugar que con 45°» (misión y texto alternativo). Prueba: ninguna de esas frases queda. |
| M10 | Juego de la idea 4 con `inicio: -30`; «El minutero del juego no pasa de −180°.»; Mira con el minutero en −90°, −180° y −270° (un paso cada uno, con un punto en su punta: sobre un eje se confundía con él); «Entre dos números seguidos del reloj hay 30°» en Datos. Prueba. |
| M11 | «Así se resuelve» de la idea 5: arriba, la rueda antes de girar; el giro, en el paso de las cuentas. `antesDe` y la predicción rotulan «P al empezar». Prueba. |
| M12 | Regla 2 con «> 0» en cada cuadrante (y Mira 2); regla 3: «Vale si a = r, la distancia al origen. Con x = 0, tan y sec no están definidas; con y = 0, cot y csc.»; regla 4 con los cuatro intervalos en la fórmula, «Vale si θ entre 0° y −360°; con más de una vuelta hacia atrás, el orden se repite» y la voz «El valor de una razón sale, como siempre, de un punto P del lado final»; Lee 3. Prueba. |
| M13 | `planoEjes` (los ángulos del ejercicio sobre sus ejes, sin valores) en «Así se resuelve» y «Ahora tú» de la idea 3 y en 6 ejemplos de ejes; rayos con sus ángulos en «Así se resuelve» de la idea 2; P(−√5, 2) con «x = ?» en el ejemplo 14 de la idea 2; `planoNeg` (cuartos de vuelta horarios) en los ejemplos 11 y 14 y en dos tipos de «Ahora tú» de la idea 4. Prueba. |
| B1–B7 | Hechos como dice la tabla. B5 con prueba (37° del papel con la convención). B13: en la rueda, «x > 0» y «x < 0» van siempre bajo el eje x (arriba los cruzaba el arco de θ, ahora más grande). |
| B8–B12 | No se tocó (ver la tabla). |

### Pendiente

- **Decidido por la sesión, Gerson revisa después:** **p3 del papel de `circunferencia-trig` (elevación) se queda en esta
  unidad** como repaso, con los Datos de la convención. Moverlo a «Triángulos rectángulos» obliga a volver a listar la
  escena en esa unidad, que el cierre de la Etapa 7 sacó a propósito (su práctica `trig-resolucion` ya trae elevación con
  Datos); y no adelanta nada (es de una unidad anterior). p5 y p6 dejan de ser de esta unidad (M3, contra la decisión 11
  del autor). La predicción de la idea 5 cambia a −660° (M4). Los puntos cardinales van en palabras.
- **Para Gerson:** el título «Cero no es "no definida"» (B12); la pieza `trig-pos` sigue siendo dibujo de prueba.
- **Para la sesión (herramientas):** llevar a `trig-plano` el rótulo de ángulo que esquiva ejes y el radio mínimo (M5,
  M6): hoy solo lo hace `trig-pos`, y con 180° o 360° el rótulo cae sobre un eje en cualquier unidad que use `trig-plano`.

### Cuentas rehechas, después

Mismos scripts (`node cuentas.js 400`, con la predicción de la idea 5 en −660° y «Así se resuelve» de la idea 5 que lee el
giro del paso de las cuentas): **113 941 comprobaciones cuadran; 0 no** (2 303 igualdades). `node ejemplos.js`: 310
cuadran, 0 no. `node figuras.js 400` (5 771 figuras, 3 465 arcos, 2 806 rótulos de ángulo): **0 rótulos sobre una línea,
0 arcos al revés o cortos**.
