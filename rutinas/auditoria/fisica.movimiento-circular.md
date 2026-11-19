# Auditoría de contenido: «Movimiento circular» (fisica.movimiento-circular)

19 nov 2026. Auditor externo (fases 7 y 8 del método), que no escribió la unidad. Contrato: `docs/plan-calidad.md` §3 y §5.
Formato: `docs/teoria.md` 4e, 4f, 4h y §5. Vara: `docs/molde-unidad.md` §10. Reglas automáticas:
`docs/metodo/unidad/reglas-validador.md`. Decisiones: `docs/etapa5/propuesta-fisica.md`, parte B y su sección «Cambios
de la parte B (19 nov)». Lo que vieron los dos lectores en frío de esta ronda está en
`rutinas/frio/fisica.movimiento-circular.md`; aquí se cita solo cuando el código lo confirma o lo agrava.

**Qué se revisó.**
- La teoría `contenido/teoria/fisica/movimiento-circular.js` (v0.2.0, sin `calidad: 2`): las 6 ideas con sus 7
  momentos, los 90 ejemplos, «Ahora tú» y «Así se resuelve» (200 semillas de cada uno por idea), el glosario (15
  términos), las 2 mesas y la tabla de letras.
- La pieza `nucleo/kit/piezas/fis-giro.js` (con su prueba).
- La práctica: los nueve generadores `plantillas/circular-*` (con `TIPOS_POR_IDEA`), su `casos.json` y su `papel.json`;
  la escena `plantillas/movimiento-circular` (`rehacer: true`); el lado B (latitud) de `plantillas/cinematica-medias`.
- La app a 390 px con `--entera`: los 42 momentos y los 90 ejemplos (servidor propio en el puerto 4320), y
  `herramientas/ecuaciones-ancho.js` sobre la unidad (56 pantallas, 794 renglones: nada se sale del ancho).

**Cuentas.** Se rehicieron con scripts propios en el scratchpad (`e5-cierre-cir/`), que del contenido solo leen el
texto que ve el alumno:
- `igualdades.js`: evalúa toda igualdad o aproximación numérica escrita («=», «≈», «, unos …»), con π, √, ½, potencias
  y sen/cos/tan, en resueltos, `siFuera`, Mira, reglas, lecturas del juego en toda su grilla, mesas, glosario,
  «Ahora tú» y «Así se resuelve» (200 semillas por idea), los generadores (200 semillas por idea) y su papel. **2 133
  igualdades; 33 falsas, 7 distintas** (M4: todas del redondeo de un múltiplo de π).
- `cuentas.js`: «Ahora tú» y «Así se resuelve» rehechos desde el texto de la pregunta, con fórmulas escritas aparte
  (el ángulo del MCUV integrado paso a paso; el instante de B6 por bisección). 2 400 casos: **la correcta cuadra en los
  2 400**; además, **3 516 opciones equivocadas** rehechas con el error que dice su código, y ninguna vale lo que la
  correcta. Lo que no cuadra: 180 casos con 3 opciones (M5) y un distractor con su valor redondeado (M4).
- `ejemplos.js`: los 88 ejemplos numéricos contra valores calculados a mano (en los 30 de nivel 3, las cinco
  alternativas con el error que nombra el resuelto); los 2 conceptuales (V/F y la aceleración con î y ĵ), a mano.
  Cuadran las respuestas; dos explicaciones de distractores no (M6). Letras de nivel 3: 6 de cada una, A a E.
- Las 6 predicciones con cada distractor (2π; 360, π y 1 · 0,5 s; 2, 120 y 1/120 · 2 vueltas; 1, ½ y 4 · 18; 6, 10 y 12)
  y las 6 misiones en toda su grilla (24, 1 331, 2 401, 9, 2 430 y 9 casos): cada una se logra (1, 1, 3, 1, 5 y 1
  maneras, sin contar el reloj) y ninguna al abrir.
- La práctica: 3 semillas o más de cada uno de los 45 tipos y subtipos de los nueve generadores y de la latitud, rehechas
  a mano desde el enunciado (encuentros contando grados por segundo, transmisiones rueda por rueda, MCUV con la ω
  media, gráficas ω–t por áreas con su cruce por cero, poleas móviles, balas y plataformas): todas cuadran.
- Validador con `calidad: 2` simulada (`Teoria.problemas`, 200 semillas): **0 problemas, 0 pendientes**. Ninguna de las
  faltas de abajo la ve una regla de hoy. Pruebas propias: 291 de 291 en verde antes de corregir (unidad, pieza, nueve
  generadores, escena y `cinematica-medias`). Reglas del papel con `calidad: 2` simulada: limpias en los nueve
  generadores, la escena y `cinematica-medias`; **10 faltas `papel-unidades` en `tiro-parabolico`** (M11).

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | Regla 3; 4f (glosario) | Glosario: «aceleración centrípeta» (`:2435`), «aceleración tangencial» (`:2450`), «aceleración angular» (`:2445`) | Las palabras que estrenan B4 y B6 se abren desde «Palabras de esta idea» antes de jugar. **B4** pregunta si la moto que da vueltas al óvalo siempre a 10 m/s tiene aceleración (trampa MC-A0); el primer ejemplo de «aceleración centrípeta» es «Una moto a 10 m/s en un óvalo de 25 m: 4 m/s²», la misma moto con su aceleración, y es además el ejemplo 1 de la idea. **B6** pregunta qué aceleración le queda al carrusel que gira «sin ir más rápido ni más lento»; el `simple` de «aceleración tangencial» es «La aceleración que hace ir más rápido o más lento» y su `def`, «cambia la rapidez»: es la clave. «aceleración angular» suma «Si gira parejo, α = 0». La regla `glosario-predice` no lo ve: las respuestas no son números. | Ejemplos y `simple` que no sean la predicción: la centrípeta, con un juego del parque y sin decir que la rapidez no cambia; la tangencial, «la parte de la aceleración que va a lo largo del giro» y ejemplos de arranque; quitar «Si gira parejo, α = 0». |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 9; regla 3 | Lee de B1, tarjeta 2 (`:339`); catálogo (`requiere` solo `fisica.mruv-y-caida-libre`) | «En Trigonometría lo viste con una pita» da por sabida una unidad de otro curso que la unidad no pide (la propuesta §8b la deja como consejo). Y si se pidiera, la Predice de B1 (cuántos radianes tiene una vuelta) es la misma de la idea 4 de `trigonometria.angulo-trigonometrico`, que ya la responde. Decisión de Gerson (cambio 2 de la parte B). | Recomiendo no pedir la unidad (el radián se presenta entero en Lee y Mira) y decir la pita como recuerdo opcional: «Si llevaste Trigonometría, es la pita de su rueda». |
| M2 | §5b; 4 | Los nueve `circular-*` (`variables`) y la escena `movimiento-circular` (`index.html:24-40`) | Los generadores siguen con el color por papel de antes: lo que se pide en verde (`d`, que la unidad no usa), ω en turquesa o verde, el tiempo en carmín o turquesa, la aceleración angular en verde o turquesa (`muestra`: 79 tipos). La escena tiene siete colores propios (v magenta, a verde, t naranja, ω turquesa, a_T ocre, α azul, θ azul marino). En la teoría: ω y v naranja, t y T turquesa, θ, s y N violeta, α y las aceleraciones carmín. Es el M5 y el M7 de MRUV. | Colores por magnitud con la tabla `COLORES` de la unidad en los nueve generadores, con prueba en 400 semillas; la escena con las mismas variables `--c-*` y sus textos de color al día. |
| M3 | 3; 6 | 42 «rapidez angular» en ocho generadores y su papel; «rapidez lineal» en `cinematica-medias` | La unidad enseña «velocidad angular» (glosario, B2) y «velocidad tangencial»; «rapidez angular» no se presenta en ninguna parte. Sale en 227 de 400 problemas de `circular-mcu`. | «velocidad angular» y «rapidez» en los enunciados, y el papel regenerado. |
| M4 | 5, 10 | `enPi` (`:83`): «Ahora tú» de B1 (k = 0), «Así se resuelve» de B1 (par) y el distractor `sin-2` de B2 (k = 1) | `enPi` redondea el coeficiente a dos decimales y lo escribe con «=»: «s = π/3 · 8 = 2,67π m», «Comprobación: 8 · 2π/3 = 5,33π m», «ω = 2π/30 = 0,07π rad/s». Son igualdades falsas (8π/3 no es 2,67π) y el examen escribe 8π/3; en B2, «0,03π rad/s» para π/40. 33 casos en 200 semillas. | Que `enPi` escriba toda fracción de π con denominador hasta 60 (8π/3, π/15, π/40) y redondee solo lo que no tiene fracción corta, con «≈». |
| M5 | Molde §2 | «Ahora tú»: B3 k = 1 (73 de 400 de ese tipo), B5 k = 2 (31), B1 k = 1 (22), B4 k = 1 (19), B2 k = 0 (14), B6 k = 2 (13), B5 k = 0 y 1 (8) | 180 de 2 400 casos salen con 3 opciones: dos errores dan el mismo texto y no hay otro de reserva. En B5 k = 2 el distractor `final` ((ω₀ + αt)·t) es siempre igual a `sin-medio`, así que nunca sale. | Un distractor de reserva por tipo, con su error real, y una prueba de 4 opciones distintas en 400 semillas. |
| M6 | Distractores | Ejemplo 5.15 «Lo del cuarto segundo» (`:1786`); ejemplo 4.14 «En media vuelta» (`:1412-1417`) | 5.15: «la **D** olvida restar», pero 28 rad/s² sale de usar (4 − 3)² = 1 en vez de 4² − 3²; olvidar restar es la **A** (1,75). 4.14: «la **D** da la aceleración centrípeta» (5 m/s), pero el enunciado no da el radio del óvalo (lector B, tarjeta 12). | 5.15: «la **D** resta los tiempos antes de elevar: (4 − 3)²». 4.14: el óvalo de 20 m de radio en el enunciado (dato de más, como en el examen). |
| M7 | 9, 3; tabla de letras | Mira de B5 paso 1 (`:1853`); Mira de B6 paso 1 (`:2215`); Mira de B3 (`:1126-1128`) y regla de B3 (`:1134`); regla de B4 (`:1500`) | B5 despeja α con θ = ½·α·t² en el primer paso de Mira, antes de que la regla la presente. B6 escribe «a_T = α · r = 1 · 2» sin decir de dónde sale α = 1 (el juego da 2 m/s cada segundo). B3 usa R para el radio del plato, y su regla, R para el radio de la Tierra, con λ sin presentar: la tabla `LETRAS` le da a R dos significados. La regla de B4 escribe ω² · r sin decir qué es ω en esa idea (lectores A y B). | B5: Mira segundo a segundo (2, 6 y 10 rad) y la fórmula al final, como conclusión. B6: α = a_T ÷ r, a la vista. B3: r y r/2 en Mira; la latitud, solo en los Datos de sus ejercicios. B4: «con ω, la velocidad angular» en la condición. |
| M8 | Regla 3 | Predice de B1, `datos` (`:370`) | «En el juego, la rueda llegó a 6 rad sin completar la vuelta» deja solo dos opciones mayores que 6 (6,28 y 360) (lector A). Los datos de Predice llevan valores, no la pista. | Datos: la definición del radián y «π vale unos 3,14». |
| M9 | 5; 4h | Reglas de B1, B2 y B6; `D4.ac` y `D6.ac` | La app parte el renglón después de un «=» y deja «; 1 vuelta =» arriba y «2π rad = 360°» abajo; «ω = θ/t =» y «2π/T»; «a =» y la raíz; en los Datos de B4, «… = v²/r» y «= ω²·r» (lectores A y B). `ecuaciones-ancho.js` no lo marca: no se sale, se parte. | Reglas más cortas (una igualdad por renglón, lo demás en la condición) y la glosa de los Datos al final. |
| M10 | 3; unidades | `circular-enesimo-segundo`, tipo `alfa` con vueltas (32 de 400) | La aceleración angular se pide en «vueltas/s²», una unidad que la unidad no presenta; el examen la pide en rad/s². | Respuesta en rad/s² (con π), y las vueltas pasadas a radianes en la solución. |
| M11 | Papel; integración | `plantillas/tiro-parabolico/papel.json` (compartido con Movimiento parabólico) | La escena sirve a las dos unidades y sus 10 problemas no dicen de cuál son: con `calidad: 2` en esta unidad, `papel-unidades` falla 10 veces. No es de mi alcance (lo trabaja el otro auditor). | Que el auditor de Parabólico agregue `unidades` a cada problema (los de la pestaña «Ruedas» son de esta). |
| M12 | 1, 8; figuras | Pieza y figuras (lectores A y B) | B1: la «s» del arco cae junto a la pata del soporte y los rayos tachan «r = 8 m». B2 Lee: «12 s» con medio arco (¿período o reloj?). B3: «Beto» escrito sobre el eje; el aspa de «Ahora tú» es un disco, con la flecha lejos del radio dibujado. B6: la «v» encima de la flecha de giro. Ejemplos (idea.número): 3.14 (balde y soga sin dibujar, gargantas sin rótulo), 1.08 (el reloj no muestra los 20 min), 6.04 y 6.08 (dicen ventilador y dibujan un carrusel), 4.03 (a_c sin flecha), rótulos encimados en 1.03, 3.03, 4.14, 5.14 y 6.03. | Rótulos y objetos en su sitio (detalle en Correcciones). |
| M13 | 3; 2 | Juego de B2 (`:714-729`); juego de B5, leyenda (`:1820`) | B2: T y t, los dos en turquesa (son tiempo), y el control del cronómetro sin decir para qué es. B5: «ω: radianes que gira en cada segundo» no vale si acelera (lector B). | B2: leyenda y consigna que dicen cada una en palabras y para qué es el cronómetro. B5: «… en ese instante». |
| M14 | 12 | Regla de B6 sin dibujo propio | La figura de la regla es la del último paso de Mira (a_T = 0), justo el caso sin las dos aceleraciones que la regla enuncia (lector B). | `regla.dibujo` con a_T, a_c y la total. |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección |
|---|---|---|---|---|
| B1 | Códigos | B3 k = 0 (`2pi` con MC-W-SIN-2PI, «olvida el 2π», para un 2π de más); B4 k = 3 (`baja` con MC-TR-INV, de transmisión); B3 k = 3 (dos con MC-TR-W) | El código no describe el error. | MC-2PI-DE-MAS y PR-INV; el tercero se deja (la regla de un código por distractor es de las que siguen a mano). |
| B2 | Redacción | B6 k = 2 | «a los 1 s». | «al cabo de 1 s» o «al segundo». |
| B3 | Letras | `circular-horaria`, tipo `acp` | «a_c = v²/R»: R es la Tierra en la unidad. | r. |
| B4 | 13 | Ejemplo 1.08 (`D1.min` con el horario que no se usa); «Así se resuelve» de B5 par (ω = ω₀ + α·t que no sirve) | Datos que sobran (lector B). | Fuera de esos ejercicios. |
| B5 | Notación | Regla de B5 | El subíndice de ω₀ en la ecuación (HTML) se ve como una «o» al lado del ₀ de la condición (lector B). Es la fuente de la app. | Prueba de que nada escribe «ₒ»; la fuente, para la app. |
| B6 | Figuras | «Así se resuelve» de B6 (φ = ? lejos y sin arco); de B4 (a_c = 2 m/s² sin flecha); Mira de B4 (la flechita de v⃗₁) | Lector B. | φ junto a la flecha total; a_c con su flecha. La flechita es de la app (`{ vec }` con subíndice). |

**Lo que el lector en frío vio y el código confirma** (y está arriba): M6 (4.14), M7, M8, M9, M12, M13, M14, B4 a B6.

## Lo que está bien y hay que copiar al molde

- **Las cuentas**: 2 400 casos de «Ahora tú» y «Así se resuelve», 3 516 distractores y 88 ejemplos cuadran por otro
  camino. La prueba propia ya mide el arco con cuerdas, integra el giro y saca la aceleración restando velocidades.
- **Los ejemplos de nivel 3 son de examen de verdad** (latitud con π = 3, bicicleta con tres ruedas, agujas que se
  juntan, la aceleración con î y ĵ, el n-ésimo segundo al revés) y cada distractor sale de un error con nombre.
- **La transmisión bien separada**: faja, cadena o contacto igualan v; un mismo eje iguala ω, en los Datos, la regla, los
  `siFuera` («En un mismo eje sí giran igual. Con faja, lo que se iguala es la rapidez del borde») y los generadores.
- **Las flechas de la aceleración apuntan bien**: `dir: 'centro'` y la tangente de la pieza son (−cos, sen) y (−sen,
  −cos) en coordenadas de pantalla; la total de B6 es la suma de las dos, y la Δv⃗ de B4 va de punta a punta.
- **Las misiones**: cada una se logra y no al abrir; la de B5 tiene cinco maneras a propósito, como la de MRUV.
- **Los nueve generadores con `TIPOS_POR_IDEA` y `datos` por tipo**: herramientas, no el paso hecho.

## Reglas que faltan en el contrato o el validador

| Regla | ¿Automática? |
|---|---|
| **Toda igualdad numérica escrita es verdadera** (también con π y en todas las semillas): «8 · 2π/3 = 5,33π» no lo es; un redondeo va con «≈» o «unos». El comprobador de este informe (`igualdades.js`) evalúa 2 133 en segundos. | Sí. |
| **El glosario no da la clave de una Predice conceptual**: un ejemplo o un `simple` de un término tocable antes de predecir no repite la situación de la Predice (mismo objeto, «siempre a 10 m/s», «sin ir más rápido ni más lento») ni la frase de su opción correcta. Hoy la regla solo mira números de dos cifras. | Semi (n-gramas de la pregunta y de la correcta contra el glosario). |
| **«Ahora tú» trae 4 opciones distintas en toda semilla** (o el número que declare la idea). | Sí. |
| **Una letra, un significado**: ninguna entrada de `letras` dice «o» («R: radio de la Tierra o de la rueda grande»). | Sí. |
| **Mira no usa la fórmula de su regla antes del último paso**, salvo que la presente ahí. | Semi (la ecuación de la regla, normalizada, contra los pasos 1 a n − 1). |
| **El texto del resuelto que explica un distractor da su valor con los datos del enunciado** (5.15, 4.14). | No (a mano, o con el motor de errores de la unidad). |
| **Los colores de un generador de la unidad salen de su `COLORES`** (sin verde si la unidad no lo usa), y los de una escena de «Más mesas del tema» también. | Sí para generadores; semi para escenas. |
| **Toda magnitud de la práctica tiene el nombre que le da la unidad** («velocidad angular», no «rapidez angular»): las palabras con «angular», «tangencial» y «centrípeta» de los enunciados están en el glosario. | Sí. |

## Correcciones (19 nov)

Hechas por el mismo auditor (fase 8), con las notas de los dos lectores en frío de la ronda 1
(`rutinas/frio/fisica.movimiento-circular.md`). Archivos tocados: `contenido/teoria/fisica/movimiento-circular.js` y su
`.test.js`; `nucleo/kit/piezas/fis-giro.js` y su `.test.js`; los nueve `plantillas/circular-*/generador.js` y el
`papel.json` de cinco de ellos (regenerados con `herramientas/papel-generador.js`); `plantillas/cinematica-medias/generador.js`
(solo el texto de la latitud); `plantillas/movimiento-circular/index.html`; `docs/investigacion/cinematica-ideas-erroneas.md`
(bloque «Movimiento circular (19 nov)»); y los generados `app/datos/catalogo.json` y `app/datos/glosario/fisica.json`
(`npm run catalogo`). No toqué `app/`, `nucleo/teoria.js`, `nucleo/avance.js`, el catálogo ni nada de Movimiento
parabólico.

**Pruebas.** Nueve pruebas nuevas en `movimiento-circular.test.js` y una en `fis-giro.test.js`; las diez fallan con la
versión de antes (comprobado con una copia de la versión anterior en el scratchpad, `e5-cierre-cir/prueba-antes/`) y pasan
con la nueva. En verde: la unidad (28), la pieza (6), los nueve generadores, la escena, `cinematica-medias`, el validador
común, `papel-reglas`, `papel-generador`, `avance`, catálogo, glosario y app (721 en total). Validador con `calidad: 2`
simulada: 0 problemas. Cuentas otra vez por mi camino: 4 800 casos de «Ahora tú» y «Así se resuelve» (400 semillas) con
7 200 distractores, 2 134 igualdades escritas y los 88 ejemplos numéricos: todo cuadra (los 6 avisos de `ejemplos.js` son
de su lector de π², revisados a mano). Capturas de después: scratchpad `e5-cierre-cir/despues/` (las de antes, en
`lector/`).

### Alta

- **A1 (el glosario daba la clave de B4 y B6).** Hecho. «aceleración centrípeta»: el primer ejemplo es ahora el de las
  sillas voladoras (6 m/s a 9 m del eje: 4 m/s²) en lugar de la moto del óvalo que va siempre a 10 m/s; la definición
  sigue sin decir hacia dónde apunta (la prueba de antes lo exige). «aceleración tangencial»: `simple` «La aceleración a
  lo largo del giro» y `def` sin «cambia la rapidez». «aceleración angular»: un esmeril que gana 5 rad/s cada segundo en
  lugar de «Si gira parejo, α = 0». Prueba: «auditoría A1».

### Media

- **M1 (el radián de Trigonometría).** Decidido por la sesión, Gerson revisa después: la unidad no pide
  `trigonometria.angulo-trigonometrico` (propuesta §8b; si lo pidiera, su Predice repetiría la de esa unidad) y la tarjeta
  2 de Lee dice «Si llevaste Trigonometría, es la pita de su rueda». El radián se presenta entero en Lee y en Mira.
- **M2 (colores de la práctica).** Hecho. Los nueve generadores pintan por magnitud con `colorPorMagnitud` (velocidad
  naranja, tiempo turquesa, giro violeta, aceleración carmín, largos y latitudes en tinta; lo pedido, por la unidad de su
  respuesta; sin verde). La escena usa las variables `--c-*` de la unidad (v y ω naranja, t turquesa, θ violeta, acp, aT y
  α carmín, la total a trazos) en claro y oscuro, y sus textos ya no nombran «ocre», «verde» ni «morada». Prueba:
  «auditoría M2 y M3» (400 semillas por generador e idea, y la paleta de la escena).
- **M3 («rapidez angular»).** Hecho: «velocidad angular» en los nueve generadores y su papel; «rapidez» en vez de «rapidez
  lineal» en la latitud. Misma prueba.
- **M4 (π redondeado con «=»).** Hecho: `enPi` escribe la fracción exacta (8π/3, π/15, π/40). Prueba «auditoría M4».
- **M5 (3 opciones).** Hecho: un distractor de reserva por tipo, con su error (AN-GRADOS, AN-POR, PR-CUADRADO y MC-V-W,
  AN-SIN-R, K4, K-MITAD, AN-VUELTA, MC-VR); en B5 k = 2 el `final` que nunca salía pasa a ser la ω tomada como ángulo; en
  B4 k = 1 el radio ya no es 1 m (ω²·r y ω²/r daban lo mismo). Prueba «auditoría M5», en 400 semillas.
- **M6 (explicaciones de distractores).** Hecho: 5.15 dice «la **D** usa (4 − 3)², no 4² − 3²»; 4.14 da el óvalo de 20 m
  de radio y la D «da v²/r, la aceleración centrípeta». Prueba «auditoría M6».
- **M7 (Mira y letras).** Hecho: Mira de B5 va segundo a segundo (2, 6 y 10 rad, con α = 4/1 a la vista) y θ = ½αt² sale
  recién en el último paso; Mira de B6 dice a_T = 2 m/s² y α = a_T ÷ r = 1 rad/s²; Mira de B3 usa r y r/2; la regla de B3
  ya no trae la latitud (queda en los Datos del ejemplo 3.11, con «λ es la latitud» y «R = 6400 km, radio de la Tierra»);
  la regla de B4 dice «Con ω, la velocidad angular (v = ω · r), sale ω² · r»; `letras.R` es solo el radio de la Tierra.
  Prueba «auditoría M7 y lector».
- **M8 (Dato de Predice de B1).** Hecho: «Un radián: el ángulo cuyo arco mide un radio» y «π vale unos 3,14». Misma
  prueba.
- **M9 (fórmulas partidas).** Hecho: la regla de B1 deja «1 vuelta = 2π rad = 360°» en la condición; la de B2 queda
  «f = 1/T; ω = 2π/T» (N/t y θ/t, en el texto); la de B6, «a_T = α · r; a = √(…)» (a_c = v²/r, en la condición); los
  Datos de la centrípeta y de la total empiezan por la fórmula y la glosa va al final. Comprobado en las capturas de
  después. Prueba «auditoría M9».
- **M10 (vueltas/s²).** Hecho a medias: en `circular-enesimo-segundo`, cuando el problema cuenta en vueltas, los Datos
  dicen «Contando en vueltas: θ en vueltas, ω en vueltas/s y α en vueltas/s²; 1 vuelta = 2π rad». No pasé la respuesta a
  rad/s²: cambiaría `casos.json` (verificado a ciegas) y la academia sí pregunta así. Prueba en «auditoría M2 y M3».
- **M11 (papel de `tiro-parabolico`).** Pendiente, fuera de mi alcance: es del otro auditor. Hasta que sus 10 problemas
  digan `unidades`, marcar esta unidad con `calidad: 2` hace fallar `papel-reglas`.
- **M12 (figuras).** Hecho: la pieza evita, si puede, las patas de la rueda, la flecha curva del giro, los troncos de las
  flechas y los bordes de los cuerpos al poner un rótulo (prueba nueva en `fis-giro.test.js`); «r = 8 m» va afuera de la
  rueda y de la llanta; Lee de B1 con 120° (el arco lejos de la pata); «Beto» del lado de afuera de su caballo; «Ahora
  tú» de B3 dibuja el cuerpo que nombra (el aspa es un ventilador) con la flecha en la punta del radio; 1.08 con el camino
  de 20 min punteado; 3.14 dice qué garganta lleva la faja y cuál la soga; 4.03 y «Así se resuelve» de B4 con la flecha
  de a_c; 4.14 con el radio; 6.04 y 6.08 con el ventilador. Pendiente: el balde y la soga dibujados (la pieza no tiene
  balde; van en palabras) y el ángulo φ marcado en un punto (la pieza solo marca ángulos en el eje).
- **M13 (juegos de B2 y B5).** Hecho: B2, consigna «Tú eliges cuánto tarda cada vuelta, T. El cronómetro corre solo; con
  su control lo detienes» y leyenda «T: período: lo que tarda una vuelta» y «t: lo que marca el cronómetro, que corre»;
  Lee de B2 con el reloj en 30 s y una vuelta entera. B5: «ω: qué tan rápido gira en ese instante». T y t siguen los dos
  en turquesa: son la misma magnitud (tiempo, en s) y §5b pide un color por magnitud; decidido por la sesión, Gerson
  revisa después.
- **M14 (regla de B6).** Hecho: `regla.dibujo` con a_T, a_c y la total, a los 2 s del arranque.

### Baja

- **B1.** Hecho: MC-2PI-DE-MAS y PR-INV. Lo de MC-TR-W dos veces se deja.
- **B2.** Hecho: «al cabo de 1 s».
- **B3.** Pendiente (la letra R en `circular-horaria`): cambia texto de una fórmula de los Datos de otro tipo; va con la
  próxima pasada a la práctica.
- **B4.** Hecho en 1.08 (solo el minutero en los Datos). En «Así se resuelve» de B5 se deja ω = ω₀ + α·t: el ejercicio
  practica elegir la fórmula.
- **B5 y B6.** La fuente del subíndice y la flechita de v⃗₁ son de la app; anotado. φ, pendiente (M12).

**Códigos nuevos** en `docs/investigacion/cinematica-ideas-erroneas.md`, «Movimiento circular (19 nov)»: los 33 de la
unidad, con dónde salen y su respaldo (todos hipótesis salvo MC-A0, la trampa 30 de San Marcos 2020-I).

**Para Gerson** (decidido por la sesión, revisa después): M1 (sin pedir Ángulo trigonométrico), M10 (vueltas/s² con su
dato, no en rad/s²) y M13 (T y t del mismo color). Y lo que ya estaba en la propuesta: los dibujos de prueba (el caballo
como un óvalo y la licuadora como un disco, que los lectores no reconocieron del todo).
