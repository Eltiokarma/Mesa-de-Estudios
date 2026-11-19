# Auditoría de contenido: «Longitud de arco y sector circular» (trigonometria.longitud-de-arco-y-sector)

19 nov 2026. Auditor externo del cierre delegado (`docs/metodo/unidad/cierre-delegado.md`), que no escribió la unidad.
Contrato: `docs/plan-calidad.md` §3 y §5. Formato: `docs/teoria.md` 4e, 4f, 4h y §5. Vara: `docs/molde-unidad.md` §10.
Reglas automáticas: `docs/metodo/unidad/reglas-validador.md`. Lo aprendido en la Etapa 5: `etapa-delegada.md`, «Lo que
encontraron los auditores». Decisiones del autor: `docs/etapa6/propuesta-trigonometria.md` (§9, decisiones 1 a 19). Lo que
vieron los dos lectores en frío está en `rutinas/frio/trigonometria.longitud-de-arco-y-sector.md`; aquí se cita cuando el
código lo confirma o lo agrava.

**Qué se revisó.**
- La teoría `contenido/teoria/trigonometria/longitud-de-arco-y-sector.js` (v0.2.0, sin `calidad: 2`): las 5 ideas con sus
  7 momentos, los 75 ejemplos, «Ahora tú» y «Así se resuelve» (400 semillas de cada uno por idea), el glosario (12
  términos), las 5 mesas y la historia.
- La pieza `nucleo/kit/piezas/trig-arco.js` (ocho objetos) con su prueba, y la figura `trig-plano` de la mesa `rodea`.
- La práctica `plantillas/trig-arco-sector/`: 15 tipos en las 5 ideas, `casos.json` (30) y `papel.json` (8).
- La app a 390 px con `--entera`: los 35 momentos y las 75 tarjetas (servidor propio en el puerto 4417), y una galería de
  las 112 figuras de la unidad dibujadas con la pieza (scratchpad `e6-cierre-arc/gal/` y `gal2/`).
- Coherencia con la unidad anterior de la rama (`rutinas/auditoria/trigonometria.angulo-trigonometrico.md`): ver B19.

**Cuentas.** Rehechas con un script propio (`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e6-cierre-arc/`:
`cuentas.js`, `cuentas-teoria.js`, `cuentas-ejemplos.js`, `cuentas-practica.js`; se corre con `node correr.js 400`). De
la unidad y del generador solo lee el texto. Ninguna respuesta sale de las fórmulas de la unidad; cada una sale por un
camino numérico:
- **grados a radianes**: la fracción de vuelta por el largo de una poligonal de 200 000 lados sobre la circunferencia de
  radio 1 (no se escribe π · g/180); los centesimales, igual con 400;
- **arcos**: largo de la poligonal inscrita; el ángulo o el radio con un arco dado, por bisección sobre ese largo;
- **áreas de sector y de trapecio circular**: suma de celdas polares (punto medio en r y en θ); el radio, el ángulo o el
  ancho desde un área, por bisección; un trapecio dado por sus dos arcos y su ancho, buscando el ángulo y el radio de
  adentro que dan esos dos arcos;
- **vueltas**: la rueda se hace rodar a 20 000 pasos chicos; en cada paso se busca el giro con el que el punto de la llanta
  que tocaba no se mueve (sin deslizar) y se suman los giros. Así en una recta (una rueda de radio 1 a lo largo de 1 m;
  otra rueda es la misma figura a otra escala), por fuera y por dentro de otra rueda (el centro da la vuelta entera);
- **faja, cadena y engranajes**: se gira la rueda 1; la faja corre el largo de la poligonal de su borde y la rueda 2 gira,
  por bisección, hasta que su borde corre lo mismo; el eje común copia el giro.

Además evalúa toda igualdad y desigualdad numérica de todos los textos, con unidades de ángulo (°, ᵍ, rad), de largo y de
área: resueltos, `siFuera`, Datos, opciones, lecturas del juego y de las mesas en toda su grilla, Mira, reglas, Lee,
Predice, glosario, historia y la práctica.
- **Resultado (versión de antes): 28 595 comprobaciones cuadran; 68 no.** Se leyeron 11 514 igualdades.
  - «Ahora tú»: 2 000 casos (400 por idea): la correcta, cuatro opciones distintas, y **cada distractor con el valor de su
    error** (24 errores distintos rehechos con el mismo camino numérico).
  - «Así se resuelve»: 2 000 casos, con su «≈».
  - Los 75 ejemplos y, en los 25 de nivel 3, la letra de la respuesta en su alternativa y **cada alternativa equivocada con
    el valor del error que dice su resuelto** (los 96 valores).
  - Las 5 predicciones con cada distractor (2π/3, 120, 2 y 4π/3 m; ×2 y ×4; 400π, 400π/3, 1600π/3 y 800π cm²; 2, 1, 0 y
    4 vueltas; 2, 1/3, 12 y 1 vuelta), las 5 misiones en su grilla (un solo caso cada una, ninguna al abrir), las lecturas
    del juego en toda su grilla contra la cuenta, y la mesa `rodea` contra la simulación.
  - La práctica: 2 000 problemas (400 por idea, con `{ idea }`), los 30 de `casos.json` (con su texto) y los 8 del papel
    (contra `papel.json`).
- **Lo que no cuadró:**
  - 3 de las 18 lecturas del juego de la rueda dicen «d = 0,18π m», «0,53π m» y «0,88π m» con «=» (son 0,175π, 0,525π y
    0,875π), y 2 de las 16 del juego de la faja, «n₂ = 0,63» y «1,88» (M4);
  - 63 resueltos de la práctica (tipo `grados`, el radio) escriben «r = 4π/3 ÷ 2π/9 = 6 cm» sin paréntesis: leído de
    izquierda a derecha no da 6 (B10).

Validador con `calidad: 2` simulada (`Teoria.problemas` con 400 semillas): **0 problemas, 0 pendientes** antes de
corregir. `herramientas/papel-reglas.js`: sin hallazgos de esta plantilla. `herramientas/ecuaciones-ancho.js`: «todo cabe»
(49 pantallas, 602 renglones). Pruebas propias antes de corregir: unidad 11 de 11, pieza 5 de 5, generador 11 de 11.

## Hallazgos

No hay hallazgos de gravedad Alta: ninguna respuesta, ningún distractor y ningún resuelto está mal en 400 semillas.

### Media (el alumno se traba, duda o la figura le da la respuesta)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 5; Etapa 5 n.º 5 | Ejemplos arco 4, 8 y 9; sector 9; trapecio 8, 10 y 13; vueltas 1. «Ahora tú»: arco tipo 1 (133 de 400 semillas), sector tipo 1, ángulo (57 de 400), trapecio tipo 1 (133 de 400) | El ángulo que se pide («θ = ?») está dibujado con su medida: 3 rad a 171,9°, 75°, 0,5 rad, 1,5 rad, **π/2 como ángulo recto** y, en «Ahora tú», el mismo g°, que se distingue a ojo de g/2 y de 10g/9. En trapecio 10 el ancho h se mide con r₁ (la figura está a escala); en vueltas 1 la huella mide 2π radios. Ninguna figura de la unidad dice «El dibujo no está a escala». | El ángulo pedido, dibujado con otra abertura (a 25° o más de la suya), y el aviso en el enunciado; el aviso también donde se mide un largo. |
| M2 | 5 | Pieza, `limpia` (Juega, Predice, Mira y La regla de la idea 3; ejemplos 9 y 12; «Ahora tú» tipo 2) | «r₂ = 40 cm» va debajo del primer tramo del brazo, que mide r₁, y pegado a «r₁ = 20 cm»; «s₁» cruza el arco de afuera; «120°» pisa el arco de adentro; en La regla, s₂, A y s₁ apilados y A cortado; s₁ y s₂ sin «cm» en Mira (lector A). | r₂ como cota del brazo entero; s₁ junto a su arco; θ dentro si cabe y si no bajo el eje; La regla con figura propia; «cm» en los rótulos. |
| M3 | 5 | Pieza, `abanico` con `otro` (Predice, revelar, Mira paso 4 y La regla de la idea 2) | «s = 10π cm» y «A = 100π cm²» del abanico chico caen dentro del grande, y no se sabe de cuál son; A cortado por el arco (lector A). | Con otro abanico detrás, el chico más grande y sus rótulos dentro de su papel; La regla con figura propia. |
| M4 | 1; Etapa 5 n.º 1 | Juego de la rueda (lectura y figura) y de la faja | «d = 0,18π m» (es 0,175π): el número que acompaña a π va exacto (regla `igualdad-falsa`, que no lo ve porque el lado izquierdo es una letra). «n₂ = 0,63» por 0,625. | Tres decimales: 0,175π y 0,625 son exactos. |
| M5 | 8; Etapa 5 n.º 8 | «Ahora tú», 400 semillas | Repite un ejemplo: el minutero de 15 cm y 20 min (4), 50ᵍ con 16 cm (1); el sector de 10 y 6 cm (1), el cerco de 75 m² y 1,5 rad (4), «el triple de su radio» (11); el trapecio de 6, 10 y 4 cm (2), «r₂ el triple de r₁» (13); la rueda de 2 cm por fuera o por dentro de una de 6 cm (11), las ruedas de 0,4 y 0,6 m con 10 vueltas más (16), 8 vueltas y 4,8π m (2); el balde de 30, 60 y 10 cm con 2 vueltas (1). | Excluir esos casos en los generadores. |
| M6 | 4; Etapa 5 n.º 4 | Idea 5, Predice: `voz` | «La rueda y el piñón van fijos a la misma barra» casi dice que giran juntos (lector B). | «Mira qué une al piñón con la rueda de atrás.» |
| M7 | 13 | Idea 5, ejemplo 3 «En un mismo eje» | Datos «Eje común: θ₁ = θ₂» y pregunta «¿cuánto gira la grande?» con 90° dados: el dato es la respuesta (lector B, tarjeta 13). | Preguntar qué parte de una vuelta da la grande (1/4), con «1 vuelta = 360°». |
| M8 | 2; Etapa 5 n.º 2 | Idea 2, «Ahora tú» tipo 1, radio (76 de 400 semillas) | La opción SEC-MITAD vale √(r²/2), que sale de olvidar el 2 (r² = A/θ); su `siFuera` dice «la mitad pasa multiplicando, no dividiendo», que daría r/2. | «Falta el 2: r² = 2 · A ÷ θ = …, no A ÷ θ.» Igual en el generador (`area-grados`). |
| M9 | 10; Etapa 5 n.º 12 | Idea 4, «Ahora tú» tipo 2 (133 de 400) y práctica `dos-ruedas` | «Las ruedas de adelante de un carro… las de atrás, 1 m»: un carro no tiene ruedas de 2 m de diámetro. | Un tractor, como en el ejemplo. |
| M10 | 2 | Idea 4, misión | «Haz que la bici avance justo 0,8π m» abre con r = 0,3 m, que pide n ≈ 1,33 y el control no llega; hay que cambiar r sin que nada lo diga (lector B). | «Con una sola vuelta de la rueda, haz que la bici avance justo 0,8π m.» |
| M11 | 5 | Pieza, `bici` con la rueda de atrás (Predice, Mira y La regla de la idea 5) | «n₂ = 2» arriba de la rueda grande, lejos del piñón; «n₃» encimado en los rayos (lector B). | n₂ junto al piñón, n₃ arriba de la rueda. |
| M12 | 3, 6 | Idea 4, La regla | θ aparece en «d = θ · r» y «θ = 2πn» sin decir qué es; el «Vale si» se lee telegráfico (lector B). | El texto dice «si gira un ángulo θ, en radianes, su centro avanza θ · r»; condición reescrita. |
| M13 | 5, 12 | Idea 1, ejemplo 15 «De un extremo al otro» | El columpio solo dibuja el arco desde donde cuelga quieto: la figura muestra 22,5° y el arco de un lado, que es el error de la alternativa «4 m». | Sin figura. |
| M14 | 1, 3 | Idea 3, Lee 1 (y toda figura del limpiaparabrisas) | El vidrio es un trapecio gris; la tarjeta dice «Esa figura se llama trapecio circular» y el lector A pensó que era el vidrio. | Un parabrisas de bordes curvos y esquinas redondeadas (dibujo de prueba). |
| M15 | Regla 9 (app) | `app/teoria.js`, «Ahora tú» | La correcta del primer caso de cada idea cae siempre en la C (lector A, en las tres ideas que vio): las opciones se barajan con `semilla + 7` y la semilla empieza en 0 en todas las ideas de todas las unidades. | Fuera del alcance (app): barajar con la semilla y el id de la idea. Para la sesión. |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección |
|---|---|---|---|---|
| B1 | 2, 3 | Idea 1, Juega | «0,5 cadenas» suelto y la curva punteada sin leyenda (lector A). | «s = 0,5 cadenas = 0,5 · 1,5 m = 0,75 m»; leyenda «curva punteada: el camino que puede seguir el asiento». |
| B2 | 5 | Pieza, `abanico` | «r = 20 cm» montado sobre la varilla (lector A). | Más separado. |
| B3 | 5 | Pieza, `figura` (tarjetas 01 y 04) | «θ = π/3 rad» cruzado por los radios en sectores estrechos (lector B). | Sube hasta donde la abertura le alcanza. |
| B4 | 5 | Pieza, `figura` de trapecio con r₁ (Así se resuelve 3, tarjeta 07) | El borde de la izquierda es naranja hasta el arco de afuera y «r₁ = 6 m» parece medirlo entero (lectores A y B). | El tramo de afuera, fino y en tinta. |
| B5 | 7 | Ejemplos (tarjetas 10 y 15) | «4π / m», «0,3 / m» partidos en dos renglones. | Espacio duro entre número y unidad en enunciados y resueltos. |
| B6 | Regla 4 | Ejemplos de las ideas 4 y 5; Así se resuelve 4 | Las vueltas dadas (1000, una vuelta, 20 vueltas…) en tinta, el resto con su color; la huella turquesa (d) rotulada «una vuelta» (n) (lector B). | Las vueltas dadas en violeta; la huella «2π · r en 1 vuelta». |
| B7 | Regla 4 | Glosario, «número de vueltas» | «Una rueda que gira 720° da 2 vueltas»: la frase de la respuesta de la moneda (una cifra: `glosario-predice` no la busca). | 1080° y 3 vueltas. |
| B8 | 2 | Voces de «Ahora tú» de las ideas 3 y 5 | «Se restan los cuadrados» en problemas con arcos; «cadena o faja» en problemas de engranajes (lectores A y B). | «Mira qué te dan: los radios o los arcos»; «Cadena, faja o engranaje: mismo arco. Eje: mismo ángulo.» |
| B9 | 3 | Idea 4, Juega | «0,5 vueltas de 0,6π m»: no dice que 0,6π m es una vuelta (lector B). | «…, de 0,6π m cada una». |
| B10 | 1 | Práctica, tipo `grados` (radio): 63 resueltos | «r = 4π/3 ÷ 2π/9 = 6 cm» sin paréntesis. | «(4π/3) ÷ (2π/9)». |
| B11 | 2 | Ejemplos sector 11 y faja 12 | «La 175 m toma 75 ÷ 1,5 = 50 por el radio» no dice que junta dos errores; «240°, horario se queda en el segundo», que gira antihorario. | Dicho en el resuelto. |
| B12 | 3 | Ejemplo arco 8 (tarjeta 02) | «5/12 · 180°»: π desaparece sin aviso (lector B). | «5π/12 rad = 5/12 · 180°», «π se cambia por 180°». |
| B13 | 3 | Ejemplo faja 8 (tarjeta 14) | «la rueda 3, de 15 cm» no dice radio ni se usa (lector B). | Sin el 15 (y así el enunciado cabe en 40 palabras). |
| B14 | 3 | Ejemplos vueltas 8 y 9 (tarjeta 11) | Sin figura: no se ve por qué el centro recorre 6 + 2 (lector B); «por dentro» no se dibuja en ninguna parte. | Una figura para cada uno (la fija, la que rueda y el camino del centro, punteado, sin su radio). |
| B15 | 4 | Idea 2, La regla | La llave «en radianes» bajo θ separa θ de su r² (lector A). | Sin llave: lo dice la condición. |
| B16 | — | Idea 3, «Ahora tú» tipo 2, limpiaparabrisas | El distractor TRAP-SIN-CUADRADO vale lo mismo que TRAP-RESTA (θh²/2) y se descarta siempre: código muerto. | No se tocó (no se ve). |
| B17 | 8 | Idea 5, Así se resuelve | Sin dibujo (la idea 4 sí lo tiene); la pieza `bici` no sirve para dos poleas de 6 a 40 cm. | Para Gerson (dibujo de dos poleas con faja). |
| B18 | Regla 4 | Ancho h en tinta (tarjeta 08) | El lector B lo esperaba con color. Es la decisión 6 de la propuesta (los cuatro colores ya están tomados). | No se tocó. |
| B19 | 5b | Colores frente a «Ángulo trigonométrico» | Allá rad es violeta y ᵍ turquesa; aquí el ángulo es carmín en todo sistema, el turquesa es el arco y el violeta el área y las vueltas. La diferencia está dicha en la cabecera y en la propuesta (§6, decisiones 4 y 19), no al alumno. La notación sí coincide (θ, r minúscula, n; R no se usa). | Para Gerson: si el cambio de color de «rad» entre las dos unidades se le dice al alumno (una línea en Lee 3 de la idea 1). |

## Lo que está bien y hay que copiar al molde

- **Ninguna cuenta equivocada** en 2 000 «Ahora tú», 2 000 «Así se resuelve», 75 ejemplos, 2 000 problemas de práctica,
  30 casos y 8 de papel, rehechos por un camino numérico (poligonales, celdas polares, rodar a pasos chicos). Cada
  distractor de «Ahora tú» y cada alternativa de nivel 3 vale lo que da el error que dice su texto.
- **Misiones de una sola salida** en toda la grilla y **predicciones que el juego no muestra** (el columpio solo da
  radianes, el limpiaparabrisas no da áreas, la rueda solo rueda en una recta, la cadena no tiene eje común).
- **La regla de colores por magnitud** con una prueba que la recorre en todos los textos y figuras, en 400 semillas.
- **Nada adelantado**: sin razones trigonométricas, velocidades ni cicloide, y sin R ni L (una prueba lo exige).
- Las cuentas de las monedas en Mira (la marca gira 2φ): comprobadas aparte, posición por posición.

## Reglas que faltan en el contrato o el validador

| Regla | ¿Automática? |
|---|---|
| **Un ángulo que se pide no se dibuja con su medida, y la figura dice «El dibujo no está a escala»** (M1). | Sí, en las piezas con `rot` y `?`: comparar la abertura dibujada con la respuesta. Esta unidad ya lo prueba. |
| **Una igualdad con letra a la izquierda y un número con π a la derecha** («d = 0,18π m») también se mira: el número que acompaña a π va exacto (M4). | Sí: en `igualdad-falsa`, para lecturas del juego, rehacer con los valores del control. |
| **«Ahora tú» no repite un ejemplo** (M5), también con otro objeto (carro / tractor). | Parcial: comparar la lista de números del enunciado con la de cada ejemplo de la idea (da falsos positivos cuando dos tipos usan los mismos números). |
| **Un rótulo de largo va sobre lo que mide entero** (M2, B4): en un tramo partido, con cota. | Parcial, por pieza: la proyección del rótulo sobre el segmento cae en su mitad. Esta unidad lo prueba para r₂ y s₁. |
| **capturas-teoria.js falla si la página muestra «No se pudo cargar el catálogo»** en vez de guardar la captura (pedido de la sesión: en esta unidad las 35 capturas de momentos de la primera ronda salieron iguales, con ese aviso, porque `app/datos/catalogo.json` estaba a medio escribir). | Sí: buscar el aviso en `document.body.innerText` antes de cada captura, y comprobar al final que no haya dos capturas iguales (md5). |

## Correcciones (19 nov)

Fase 8 (`docs/metodo/unidad/6-correcciones.md`), junto con las notas de los dos lectores en frío (ver
`rutinas/frio/trigonometria.longitud-de-arco-y-sector.md`, «Correcciones de la ronda 1»). La versión de la teoría no se
cambió (sigue en 0.2.0). Copias de antes en `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e6-cierre-arc/antes/`.

Pruebas nuevas: 5 al final de `longitud-de-arco-y-sector.test.js` («cierre: …»). Con la versión de antes (unidad y pieza
de `antes/`) fallan las 5; se comprobó además, una por una, cada parte de la de los rótulos (r₂, s₁, abanicos, n₂ y n₃).
Se ajustaron dos pruebas de la unidad que fijaban lo que cambió a propósito (la respuesta del ejemplo 3 de la idea 5 y
«tractor») y una del generador («tractor»). Después: unidad 16 de 16, pieza 5 de 5, generador 11 de 11,
`contenido/teoria/teoria.test.js` 164 de 164, `herramientas/papel-reglas.test.js` 6 de 6, papel al día (no cambió),
validador con `calidad: 2` simulada y 400 semillas sin problemas, `ecuaciones-ancho.js`: «todo cabe» (49 pantallas, 611
renglones). No se corrió `npm test` completo (otras sesiones trabajando). `npm run catalogo`: de esta unidad cambia
`app/datos/glosario/trigonometria.json` («número de vueltas»). Capturas de después, a 390 px:
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e6-cierre-arc/despues/` (momentos, ejemplos y
laboratorio), y la galería de todas las figuras en `…/e6-cierre-arc/gal2/`.

| # | Qué se hizo |
|---|---|
| M1 | Ejemplos arco 4 (140°), 8 (110°) y 9 (0,9 rad), sector 9 (120°), trapecio 8 (65°): otra abertura y «El dibujo no está a escala.»; trapecio 10 con r₁ a la mitad y el aviso; trapecio 13 y vueltas 1, el aviso. «Ahora tú» que pide un ángulo (arco tipo 1, sector tipo 1, trapecio tipo 1): dibujado a 100° (o 55° si el pedido está cerca de 100°) y el aviso. Prueba: en los ejemplos y en 400 semillas, aviso y 15° o más de diferencia. |
| M2 | Pieza `limpia`: r₂ es una cota naranja paralela al brazo entero, con su rótulo hacia la mitad; s₂ encima de su arco; s₁ debajo del arco de adentro, tan abajo que sus esquinas no lo toquen (si no cabe, encima, dentro de la banda); h dentro de la banda si es ancha y por fuera si es angosta; θ dentro del arco chico si cabe y, si no, bajo el eje. Predice y Mira de la idea 3, más grandes (`k: 3.6`); «cm» en s₁ y s₂; La regla con figura propia (trapecio con r₁, r₂, h, s₁, s₂ y θ). Prueba: r₂ cae en la mitad del brazo y s₁ más cerca de su arco, en Predice, Mira y toda la grilla del juego. |
| M3 | Pieza `abanico`: con otro detrás, el chico es más grande y su arco y su área van dentro de su papel; Mira paso 4 con rótulos cortos («10π cm», «100π cm²») y el arco del grande («20π cm»); La regla con figura propia (un sector con s, r, θ y A = s · r/2). Prueba: los rótulos del chico, dentro de su radio. |
| M4 | Lecturas y figuras con tres decimales: «d = 0,175π m», «n₂ = 0,625». Prueba: en toda la grilla, el número escrito es exacto. |
| M5 | Exclusiones en `casoExamen1`, `casoAreaArco`, `casoPerimetro` (sin el triple), `casoBandaArcos`, `casoBandaExamen` (sin el triple; sin 50/30/90), `casoAvance`, `casoRodea` (sin 2 y 6 cm), `casoTractor` y `casoBalde`. Prueba en 400 semillas. |
| M6 | Voz de Predice: «Mira qué une al piñón con la rueda de atrás.» Prueba. |
| M7 | Ejemplo 3: «¿qué parte de una vuelta da la grande?», 90°/360° = 1/4, con «1 vuelta = 360° = 2π rad» en Datos. Prueba. |
| M8 | `siFuera`: «Despejar r² es la idea; pero falta el 2: r² = 2 · A ÷ θ = …, no A ÷ θ.» En el generador, «falta el 2: r² = 2A ÷ θ; sin él sale …». Prueba. |
| M9 | «Tractor» en la teoría y en el generador (`dos-ruedas`), con los radios en naranja y las vueltas en violeta. Prueba: ningún «carro» en 400 semillas. Los `casos.json` no cambian (el texto de la correcta es el mismo). |
| M10 | Misión: «Con una sola vuelta de la rueda, haz que la bici avance justo 0,8π m.» (sigue cumpliéndose con un solo caso). Prueba. |
| M11 | Pieza `bici`: con la rueda de atrás, n₂ junto al piñón y n₃ arriba de la rueda. Prueba. |
| M12 | Regla: «Sin deslizar, la rueda da una vuelta cada vez que su centro avanza su borde, 2πr. Si gira un ángulo θ, en radianes, su centro avanza θ · r.»; condición: «no desliza. Por fuera de una rueda fija, el camino del centro tiene radio suma de los radios; por dentro, resta.» (tope de 22 palabras). Prueba del texto. |
| M13 | Ejemplo 15 sin figura (comentario en el código). Prueba. |
| M14 | Pieza `limpia`: el vidrio es un parabrisas con bordes curvos y esquinas redondeadas (poligonal, como pide la prueba de la pieza). **Dibujo de prueba: Gerson revisa después.** |
| M15 | No se tocó (`app/teoria.js` está fuera del alcance). Propuesta para la sesión: `T.barajar(caso.opciones, semilla + 7 + hash(idea.id))`. |
| B1–B15 | Hechos como dice la tabla. B5: un paso final de la unidad pone espacio duro entre número y unidad en los enunciados y resueltos de los ejemplos (también dentro de los textos con color); prueba. B6: las vueltas dadas en violeta en los ejemplos de las ideas 4 y 5. B13: el enunciado pasaba de 40 palabras con «de radio»; se quitó el 15. B14: figura `trig-plano` (`aroFig`) en los ejemplos 8 y 9 de la idea 4. B10: el papel no cambió (no usa ese resuelto). |
| B16–B19 | No se tocó (ver la tabla). |

**Cuentas después de corregir:** ver «Cuentas rehechas, después» al final (mismo script, 400 semillas).

### Pendiente

- **Para Gerson (dibujos de prueba):** el parabrisas nuevo (M14); un dibujo de dos poleas con faja para «Así se resuelve»
  de la idea 5 (B17); la rueda «por dentro» en Mira de la idea 4 (solo la dibujan ahora los ejemplos 8 y 9 y la mesa).
- **Decidido por la sesión, Gerson revisa después:** la figura del ejemplo «De un extremo al otro» se quita (M13); el
  ejemplo 3 de la idea 5 pasa a preguntar la parte de una vuelta (M7); el «carro» pasa a «tractor» (M9); el ancho h sigue
  en tinta (B18, decisión 6 de la propuesta); el cambio de color de «rad» respecto de la unidad anterior no se le dice al
  alumno (B19).
- **Para la sesión (app y herramientas):** M15 (la C en el primer «Ahora tú») y la regla nueva de `capturas-teoria.js`.

### Cuentas rehechas, después

Mismo script (`node correr.js 400`, con los regex de «tractor», de «1/4 de vuelta» y de la lectura de la rueda sin «≈»
ajustados): **28 648 comprobaciones cuadran; 0 no** (11 499 igualdades leídas). Las últimas correcciones de texto (ejemplos
arco 8, sector 11 y faja 12, la regla del sector y las figuras de los ejemplos 8 y 9 de la idea 4) se repasaron después con
6 semillas: 1 457 de 1 457.
