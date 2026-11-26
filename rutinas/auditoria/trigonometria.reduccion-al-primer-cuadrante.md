# Auditoría de contenido: «Reducción al primer cuadrante» (trigonometria.reduccion-al-primer-cuadrante)

26 nov 2026. Auditor externo del cierre delegado (`docs/metodo/unidad/cierre-delegado.md`), que no escribió la unidad.
Contrato: `docs/plan-calidad.md` §3. Vara: `docs/molde-unidad.md` §10. Reglas automáticas:
`docs/metodo/unidad/reglas-validador.md`. Decisiones del autor: `docs/etapa9/propuesta-trigonometria.md`. Antes de esta
auditoría pasó el redactor (`rutinas/redaccion/trigonometria.reduccion-al-primer-cuadrante.md`), que dejó cinco puntos
para el auditor; aquí van como A1 a A5.

**Qué se revisó.**
- La teoría `contenido/teoria/trigonometria/reduccion-al-primer-cuadrante.js` (v0.2.0, sin `calidad: 2`): las 5 ideas con
  sus 7 momentos, los 75 ejemplos, «Ahora tú» y «Así se resuelve» (400 semillas por idea), el glosario, las mesas y la
  historia.
- La pieza `nucleo/kit/piezas/trig-pos.js` (con el ventilador nuevo de esta unidad) y su prueba.
- La práctica `plantillas/trig-reduccion/`: 15 tipos en las 5 ideas, `casos.json` (30) y `papel.json`.
- La app a 390 px con `--entera` (servidor propio, puerto 4232): 35 momentos y 75 tarjetas, en
  `/tmp/claude-0/-home-user-Mesa-de-Estudios/c6e6072f-61c1-5ae4-9fde-081abfdefa41/scratchpad/cierre-trig/lector/` (antes)
  y `…/cierre-trig/despues/` (con las correcciones).

**Cuentas.** Rehechas con scripts propios en
`/tmp/claude-0/-home-user-Mesa-de-Estudios/c6e6072f-61c1-5ae4-9fde-081abfdefa41/scratchpad/cierre-trig/`. De la unidad y
del generador solo leen el texto (pregunta y opciones); el valor sale de `Math.sin`/`Math.cos` con el ángulo de verdad:
- `cuentas.js 400`: el texto de la pregunta se traduce a una expresión (sen 307°, 5 sen 217° + 4 tan 135°, sen(−θ)/sen θ
  con θ = 40°, tan(270° + φ) con φ = 23° y 61°, 17π/6 → 510°, |…|, sen φ = 5/13 → φ = asen(5/13)); α y θ de la idea 1, por
  su cuadrante. Exige que la opción marcada sea la única que calza (tolerancia 0,03 solo con 37° y 53°, por la
  convención 3-4-5; exacta en lo demás). **«Ahora tú» y «Así se resuelve»: 4 666 comprobaciones en 400 semillas por idea,
  0 fallas. Práctica: 6 000 problemas (400 por tipo) y los 30 casos de `casos.json`, 6 864 comprobaciones, 0 fallas.**
  Cada problema de la práctica trae datos.
- `errores.js`: en las preguntas de una sola razón, cada distractor rehecho por su error (TR12 y TRRD-SIGNO-REF: signo
  contrario; TR15: el menos de −θ olvidado; TRNEG-TODO-NEG: menos de más en cos o sec; TR11 y TR14: la cofunción, con el
  signo que dice su `siFuera`). **2 400 distractores, 0 fallas**; el `siFuera` dice el error que da su valor.
- Los 75 ejemplos, a mano con el volcado `dump.js` (enunciado, datos, alternativas, resuelto y respuesta en texto): cada
  respuesta y, en los 25 de nivel 3, la letra y el valor de **cada alternativa equivocada con el error que dice su
  resuelto**. Todo cuadra salvo M2 (la D del ejemplo 15 de la idea 3). Confirmado lo que pidió el redactor: en los
  ejemplos 12 y 13 de la idea 3, la C («signos al revés en las dos piezas») da 1 − (−1) = 2. En el 13 de la idea 2, D
  (−3) es sec + tan sin el csc: «suma tan 315° y no la multiplica por csc 150°» se lee bien así.
- Las 5 predicciones y sus distractores; las 5 misiones (las comprueba la prueba propia en toda la grilla).
- Letras de las respuestas de los 25 ejemplos de nivel 3: A 5, B 6, C 7, D 4, E 3 (ninguna pasa del 40 %).
- Validador con `calidad: 2` simulada, 200 semillas (`validar.js`): sin problemas antes y después.
- `herramientas/ecuaciones-ancho.js` a 390 px: todo cabe (44 pantallas) antes y después.

## Hallazgos

| # | Gravedad | Punto | Dónde | Evidencia | Corrección propuesta |
| --- | --- | --- | --- | --- | --- |
| M1 | Media | 5, 8 | `reduccion…js:54` (`junto`) | A1 del redactor, confirmado: reemplazaba U+0020 por U+0020. Con espacios duros de verdad, `ecuaciones-ancho` da 35 cuentas y datos fuera de su caja a 390 px. La app ya no parte junto a + − × ÷ · ni antes de «=» (`nucleo/ecuacion.js`). | Que `junto` sea una marca que no cambia nada, con el porqué en el comentario. El mismo error está en `angulo-trigonometrico.js`, `angulos-en-posicion-normal.js` y `triangulos-rectangulos.js` (fuera de alcance). |
| M2 | Media | 13 | idea 3, ejemplo 15 | «**D** mide los agudos hasta el eje y» da 0, la respuesta correcta: con 30° y 60° y los signos bien, −√3/2 + √3/2 = 0. −√3 sale si además se olvida el menos de sen(−210°). | Decir los dos errores y la cuenta: «−√3/2 − √3/2 = −√3». |
| M3 | Media | 3, 9 | idea 5, ejemplo 14 | A3 del redactor, confirmado: con cuatro aspas a 90°, la que está a 270° + φ es la cuarta, no la C; y «aspa C» con la alternativa **C** correcta. La figura rotula P, no C. | Nombrar el aspa por su ángulo y su punta P; agregar φ a la figura. |
| M4 | Media | 3 | idea 4, ejemplo 12 | A4 del redactor: P = 40 · cos 2220° con P la pérdida, y en `letras` P es la punta del objeto. | V para los litros. |
| M5 | Media | 5 (molde §2) | ideas 1–4, 7 resueltos | Un «   ·   » separaba dos igualdades donde «·» también multiplica: «E = 5 · (−3/5) + 4 · (−1) · E = −3 − 4», «17 · 180°/6 = 510° · 510° − 360°», «sen 150° = 1/2 · cos 120°». Se lee como un producto falso. | Cada igualdad en su línea o unidas por «y». |
| M6 | Media | 9, 13 | idea 2 (regla) | La tabla de signos («Positivas: I, todas; II, sen y csc…») está en los Datos de casi todo ejercicio, pero ningún momento la dice: viene de la unidad anterior. El lector A no la reconoció. | Decirla en «Vale si» de la regla de la idea 2. |
| M7 | Media | 3 | idea 2, juego y Predice | `r` en Lee (tarjeta 3) y en Datos de Predice, pero no en el juego ni en la figura; la misión pide sen θ = −1/2. | r en la consigna (sen θ = y/r) y en la leyenda; «r, el radio de la rueda» en Datos de Predice. |
| M8 | Media | 3, 9 | idea 5, Lee y juego; ejemplo 8 | El texto dice «aspa A», «aspa B»; la figura, P y P′ (lector B). El ejemplo 8 da x = r · cos θ y nunca dice qué es θ. | «El aspa A (punta P)…, B (punta P′)»; en Datos, «con θ el ángulo del aspa desde el eje x». |
| M9 | Media | 2 | idea 5, misión | «Que la punta de B suba justo la mitad del largo»: B ya está arriba (lector B). | «Deja P′, la punta de B, a una altura de medio largo del aspa». |
| M10 | Media | 2 | idea 4, misión | «Deja la válvula abajo, a 30° del eje x positivo» admite dos lecturas (lector B). | «…en el IV, 30° debajo del eje x». |
| M11 | Media | 9 | idea 4, regla | La regla dice «si el ángulo es negativo, primero se quita el menos», pero ningún momento de la idea muestra un negativo (lector B). | Un paso de Mira con cos(−480°). |
| M12 | Media | 1, 3 | pieza `trig-pos` | El rótulo de un arco se buscaba hasta 80 px afuera: «α» caía junto a la altura naranja y parecía su nombre (lector A, 5 pantallas y 2 tarjetas). Medido: 121 de 618 rótulos de arco a más de 34 px de su arco en esta unidad y 24 de 233 en «Ángulos en posición normal». | Buscar primero a 12–30 px en todo el arco, después por dentro, después al final del arco; lejos, solo al último. |
| B1 | Baja | 3 | ideas 3 y 5, voz de «Ahora tú» | «¿90° o 270°?» con un caso de 180° + φ; «después, el cuadrante» con 53° (lectores A y B). | Voces que valen para todos los casos. |
| B2 | Baja | 7 | idea 2, lectura en el I | «sen 45° = sen 45° = √2/2» (lector A). | «sen 45° = √2/2: P′ coincide con P». |
| B3 | Baja | 3 | ejemplos con «altura y» | «¿A qué altura y está…?» se lee como errata (lector A). | «¿Cuánto vale y, su altura respecto del centro?». |
| B4 | Baja | 3 | idea 3, figuras | Las puntas de flecha de θ y −θ se juntan cerca del 3 (radios 1,2 y 2,0). | Radios 1,3 y 2,5. |
| B5 | Baja | 1 | idea 1, ejemplo 14 | La figura (no a escala) pone θ en 335°, con α chico, y la respuesta es 280°, con α = 80° (lector A). | Dibujar 300°. |
| B6 | Baja | 1 | ideas 1 y 5, juego | El juego abre con θ = 30° (veleta) y φ = 10° (ventilador): el arco casi no se ve y el rótulo choca con «este». | Abrir en 50° y 30°. |
| B7 | Baja | 1 | pieza, veleta y válvula | La veleta se leía como rosa de los vientos; la válvula, como un punto con un palito. | Aleta que se ensancha y anillo del poste; tapón en la válvula (dibujos de prueba: Gerson decide). |
| B8 | Baja | 10 | laboratorio, mesa «Espejos y cuartos de vuelta» | A6 del redactor: con θ = 0°, las parejas 180° + θ y 180° − θ dan el mismo P′ y la invitación se cumplía, aunque «uno es el reflejo del otro en el eje y» es falso. | Pedir dos P′ distintos. |
| B9 | Baja | 13 | idea 4, ejemplo 14 | Sin figura y con seis líneas de Datos (lector B). | Figura con 17π/6; la línea de la definición de α sale (ver «Para Gerson»). |
| B10 | Baja | 6 | idea 5, Predice | Los valores de sen 20° y cos 20° iban en la pregunta y en Datos. | Pregunta con el ventilador; los valores, solo en Datos. |

**A5 del redactor (abscisa x).** Se acepta: «abscisa» se dice antes, en la leyenda del juego de la idea 2 («x: distancia a
la derecha (+) o izquierda (−)») y en `letras` («x: la abscisa de P»), y el coseno con signo pide abscisa, no distancia.

## Lo que está bien y hay que copiar al molde
- **Distractores con el error dicho en su `siFuera`**: los 2 400 de las preguntas de una razón dan el valor de su error, y
  cuando dos opciones salen del mismo error (cofunción con y sin signo), el `siFuera` dice cuál de los dos es.
- **Figuras «no a escala» que no regalan la respuesta** en los ejemplos que despejan θ (idea 1): el ángulo dibujado es
  otro, y el enunciado lo avisa.
- **Errores de nivel 3 con cuentas rehacibles**: «multiplica por 4 solo θ» da 60°, «mide desde el eje y» da 700°. Cada
  explicación se puede rehacer con un número.
- La prueba propia recalcula la alternativa correcta con Math en 400 semillas, y las misiones en toda la grilla.

## Reglas que faltan en el contrato o el validador
| Regla | Qué pide | ¿Automática? |
| --- | --- | --- |
| `separador-producto` | Un «   ·   » no separa dos igualdades si alguna tiene un «·» de producto o termina en número y la otra empieza con número. | Sí: buscar el separador entre dos tramos con «=» y un «·» o número a los lados. |
| `rotulo-arco-cerca` | El rótulo de un arco queda a 46 px o menos de su arco (caja contra curva). | Sí, en la prueba de la pieza; esta unidad ya la tiene (`reduccion…test.js`). |
| `objeto-letra-alternativa` | En un ejemplo con alternativas, ningún objeto se nombra con una letra de A a E («aspa C», «punto B»). | Sí: `/\b(aspa|cabina|punto…) [A-E]\b/` en el enunciado. Con puntos de figura (geometría) ya está la decisión de nombrar por valor. |
| `junto-hace-algo` | Una ayuda que dice cambiar espacios cambia algo (`x.replace(/ /g, ' ')` con el mismo carácter). | Sí: en las pruebas, `junto('a b') !== 'a b'` si se declara como espacio duro. Mejor: una sola ayuda en el kit. |
| `voz-caso` | La voz de «Ahora tú» no nombra un caso que no sale («¿90° o 270°?» con 180°). | No del todo: el auditor. |

## Correcciones (26 nov)

Hechas por el auditor (paso 3 del cierre), cada una con su prueba en
`contenido/teoria/trigonometria/reduccion-al-primer-cuadrante.test.js` que falla con la versión anterior (comprobado:
con la unidad y la pieza de antes fallan las 7 pruebas nuevas, y con las de ahora pasan las 16).

| # | Qué se hizo | Prueba |
| --- | --- | --- |
| M1 | `junto` es una marca que no cambia nada; el comentario dice por qué (con espacios duros, 35 cuentas se salían). `ecuaciones-ancho`: todo cabe (44 pantallas). | herramienta de ancho |
| M2 | D: «mide los agudos hasta el eje y, 30° y 60°, y además olvida el menos de sen(−210°): −√3/2 − √3/2 = −√3». | «ejemplo 15 de opuestos» |
| M3 | Ejemplo 14 de la idea 5: «Una de ellas forma φ = 37°…, y la que está tres cuartos de vuelta después, a 270° + φ, tiene su punta en P. ¿Cuánto vale la y de P?»; la figura agrega el arco φ y el aspa de 37° punteada; Datos dice qué es θ. | «ni objetos con letras de alternativa…» |
| M4 | V = 40 · cos 2220°. | la misma |
| M5 | Siete resueltos: cada igualdad en su paso o unidas por «y» (ideas 1, 2, 3 y 4). | «ningún resuelto separa dos igualdades…» |
| M6 | «Vale si» de la regla de la idea 2: «Signo del cuadrante de θ: positivas en el I, todas; en el II, sen y csc…». | validador (topes) |
| M7 | Consigna: «Con r el radio, sen θ = y/r»; leyenda «r: el radio de la rueda, unos 10 m»; Datos de Predice: «…entre r, el radio de la rueda». | `leyenda-visible` |
| M8 | Lee y consigna: «El aspa A (punta P)…, B (punta P′)»; ejemplo 8: «¿Cuánto vale la x de P′?», «con θ el ángulo del aspa desde el eje x»; «x = ?» fuera del centro y del aspa de 210°. | revisión en capturas |
| M9, M10 | Misiones reescritas (dentro del tope de 16 palabras). | validador |
| M11 | Mira de la idea 4, paso 4: «Con un ángulo negativo, primero se quita el menos…: cos(−480°) = cos 480° = −1/2». | validador |
| M12 | `trig-pos`: el rótulo de arco prueba primero 12–30 px en todo el arco, después por dentro (arcos de más de 46 px), después junto al final, y lejos al último; deja 6 px de aire contra otro texto («90° + φP»). Esta unidad: de 121 rótulos a más de 34 px a 0 a más de 46 px; «Ángulos en posición normal»: de 24 a 0. Sus pruebas y las de su práctica siguen en verde. | «cada rótulo de arco queda junto a su arco» |
| B1 | Voces: «Primero mira el ángulo: con 90° o 270° la razón cambia; con 180° o 360°, se queda…» y «Primero el reflejo; si el ángulo no es agudo, después el cuadrante». | «voces de Ahora tú…» |
| B2 | «sen 45° = √2/2: P′ coincide con P». | «la lectura no repite el mismo ángulo» |
| B3–B6, B9, B10 | Hechos como dice la tabla. | capturas |
| B7 | Veleta con aleta y anillo del poste; válvula con tapón (dibujos de prueba). | prueba de la pieza |
| B8 | La invitación pide «dos parejas cuyos P′ sean puntos distintos a la misma altura» y lo comprueba. | «la invitación de la misma altura…» |

**Decidido por la sesión, Gerson revisa después.**
- **Datos con la receta** (lector A y coordinación: «recórtalos a valores y equivalencias»). El punto 13 pide que todo
  ejercicio dé también la fórmula que se usa; por eso se quedan la cuenta de α por cuadrante, la tabla de signos, la regla
  de −θ y la de las vueltas. Se quitó solo la línea de la definición de α en las ideas 2 a 5 (36 ejercicios), porque α ya
  está en la tabla de letras y la cuenta de α la nombra. Si Gerson quiere menos, lo siguiente sería quitar la cuenta de α
  desde la idea 3 (ya practicada en dos ideas).
- **El arco de 270° + φ no llega al aspa** (lector B): termina 8° antes del lado final a propósito, para que su punta no
  quede encima del segmento (igual en toda la unidad y en la anterior). No se cambió.
- `junto` con el mismo defecto en tres unidades ya cerradas: se avisa, no se tocó.
