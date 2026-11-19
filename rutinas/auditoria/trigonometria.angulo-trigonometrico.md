# Auditoría de contenido: «Ángulo trigonométrico y sistemas de medida» (trigonometria.angulo-trigonometrico)

19 nov 2026. Auditor externo (fase 7 del método), que no escribió la unidad. Contrato: `docs/plan-calidad.md` §3 y §5.
Formato: `docs/teoria.md` 4e, 4f, 4h y §5. Vara: `docs/molde-unidad.md` §10. Reglas automáticas:
`docs/metodo/unidad/reglas-validador.md`. Decisiones: `docs/etapa5/propuesta-trigonometria.md` (§9, decisiones 1 a 24).
Lo que vieron los dos lectores en frío de esta ronda está en `rutinas/frio/trigonometria.angulo-trigonometrico.md`;
aquí se cita solo cuando el código lo confirma o lo agrava.

**Qué se revisó.**
- La teoría `contenido/teoria/trigonometria/angulo-trigonometrico.js` (v0.3.0, sin `calidad: 2`):
  - las 5 ideas con sus 7 momentos;
  - los 75 ejemplos;
  - «Ahora tú» y «Así se resuelve» (200 semillas de cada uno por idea);
  - el glosario (19 términos), las 3 mesas y la historia.
- Las piezas `trig-giro` y `trig-medida`, con sus pruebas.
- La práctica `plantillas/trig-sistemas-angulares/`: 15 tipos en las 5 ideas, `casos.json` (30) y `papel.json` (8).
- La app a 390 px con `--entera`: los 35 momentos y los 75 ejemplos. Servidor propio en el puerto 4313.

**Cuentas.** Se rehicieron con un script propio
(`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e5-cierre-trig/cuentas.js`). De la unidad y del
generador solo lee el texto; cada respuesta sale del enunciado por otro camino: todo ángulo se lleva a grados con su
unidad escrita (°, ′, ″, ᵍ, ᵐ, ˢ, rad, π), las frases de vuelta («una vuelta y tres cuartos») se leen con una tabla propia,
la x de las figuras se busca de 0,25 en 0,25 con α > 0 y β < 0, y las condiciones entre S y C se resuelven por fuerza
bruta (S de 0,1 en 0,1 hasta 1000), lo que también prueba que hay **un solo** ángulo que las cumple. Además evalúa toda
igualdad o desigualdad numérica escrita en cualquier texto (resueltos, `siFuera`, Datos, lecturas del juego en toda su
grilla, Mira, reglas, glosario, Lee y las tres mesas en toda su grilla), con unidades y sin ellas.
- **Resultado (versión de antes): 13 214 comprobaciones cuadran en la respuesta; 341 no.**
  - «Ahora tú»: 1 000 casos (200 por idea), con la correcta, cuatro opciones distintas y ningún distractor que valga lo
    mismo que la correcta.
  - «Así se resuelve»: 1 000 casos.
  - Los 75 ejemplos, con la letra del nivel 3 en la alternativa que da la cuenta; además, a mano, cada alternativa
    equivocada de los 25 de nivel 3 con el error que dice el resuelto.
  - Las 5 predicciones con cada distractor rehecho (−90°: 390, 90 y 270 · 40,5°: 35, 45 y 50 · 50ᵐ: 27, 30 y 45 ·
    2π: 6, π y «depende» · 27°: 57, 28,5 y 30).
  - Las 5 misiones en toda su grilla (37, 41, 48, 15 y 17 casos): cada una se cumple con un solo caso y no al abrir.
  - La práctica: 1 000 problemas (200 por idea, con `{ idea }`), los 30 de `casos.json` (y su texto esperado) y los 8 del
    papel (con las semillas `papel-1` a `papel-8`, contra `papel.json`).
- **Lo que no cuadró, y no lo ve ninguna prueba de hoy:**
  - 256 igualdades falsas en la lectura de la mesa `tres-escalas` («θ = 5° = 5,56ᵍ»: es 5,555…ᵍ) (M1);
  - 16 `siFuera` de «Ahora tú» de la idea 3 que dicen un camino que no da su valor (A1);
  - un «=» entre 360°/π y 360°/3,1416 (B1);
  - 67 «Ahora tú» de dos giros seguidos que dibujan uno solo (M6, también del lector A).
  - El único que queda después de corregir es un falso positivo del script: en un resuelto, «x = 150» describe el error
    de una alternativa, y el script le pone la x de la respuesta.

Validador con `calidad: 2` simulada (`Teoria.problemas` con 200 semillas): **0 problemas, 0 pendientes**, antes y después
de las correcciones. `herramientas/papel-reglas.js`: sin hallazgos de esta plantilla. Pruebas propias antes de corregir:
unidad 14 de 14, generador 11 de 11, piezas 7 + 7, todas en verde.

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 10, 13 | Idea 3, «Ahora tú» tipo 2 (`casoEntreSistemas`, tabla `T`, fila de los segundos) | «Un ángulo mide 81″… ¿Cuántos segundos centesimales?»: la opción MIN-SIN-SISTEMA vale 135ˢ (81 · 100/60, cambia 60 por 100 una sola vez), pero su `siFuera` dice «Cambiar entre 60 y 100 partes está bien; falta además cambiar el grado». Al alumno que puso 135ˢ le dice que su paso estaba bien, y no lo está: sin cambiar el grado sale 225ˢ. Pasa en 16 de 200 semillas (todas las de segundos). El generador sí lo hace bien (225k, y 135k con su propio código MIN-UNA-VEZ). | El valor de ese error, 225k, como en el generador. |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 5, 7 | Mesa `tres-escalas` (`lectura`) | «θ = 5° = 5,56ᵍ = π/36 rad»: el número centesimal va redondeado con «=». En 256 de las 145 posiciones × 2 tramos de la grilla la igualdad es falsa; solo los múltiplos de 9° son exactos. | «=» solo si la cuenta es exacta; si no, el redondeo al final con «≈». |
| M2 | Regla 3; 4f | Glosario, «vuelta» | Su definición dice «360°, 400ᵍ o 2π rad». La idea 4 pregunta cuántas pitas (radios) caben en la vuelta, y la palabra «vuelta» se puede tocar en la misma pregunta: la definición da 2π. Además, «vuelta» se toca desde la idea 1, donde ᵍ y rad todavía no se presentaron. `glosario-predice` no lo ve: «vuelta» no la estrena la idea 4. | «Giro completo que regresa al lado inicial: 360°.» Cada sistema dice su vuelta en su propio término. |
| M3 | Regla 3; 4f | Glosario, «fórmula general de conversión» | Lo estrena la idea 5 con `simple`, así que sale en «Palabras de esta idea» antes del juego. Su definición es «S/180 = C/200 = R/π» y su segundo ejemplo «S = 9k, C = 10k y R = πk/20»: la regla que mide la predicción (S + C = 57). Es el M2 de Divisibilidad con otra forma. | Sin `simple` (la idea 5 queda con 3 palabras: S, C y R). |
| M4 | 3, letras | `DS.scr` (Datos de los 15 ejemplos, «Así se resuelve» y «Ahora tú» de la idea 5), `D.scr` del generador y la regla de la idea 5 | «S = 9k, C = 10k y R = πk/20» sin decir qué es k. `letras-datos` pasa porque k está en `letras`, que el alumno no ve. Los ejemplos se abren después de Predice y antes de «Mira», que es lo único que lo dice. La regla salta de S/180 a S = 9k sin decir de dónde sale el 20 (lector B). | Datos: «…, con k = S ÷ 9 = C ÷ 10.» Regla: «Como 180 = 9 · 20 y 200 = 10 · 20, cada cociente es k/20.» |
| M5 | 13, regla 3 | Idea 4, Predice (`datos`) | «Largo del borde de una rueda: 2 · π · radio»: es la relación que se predice; dividir entre el radio da la respuesta (lector B). Predice lleva equivalencias y valores, nunca la fórmula (Gerson, 17 nov). La propuesta lo decidió así (§4), con el motivo de que es de Geometría. | Solo valores: «Cada pita mide un radio de la rueda» y π ≈ 3,1416. Decidido por la sesión; Gerson revisa después. |
| M6 | 4; molde §3 | Idea 1, «Ahora tú» tipo 0 (`casoSeguidos`) | Dos giros seguidos con un solo giro dibujado (67 de 200 semillas); y en la llave nadie dice que la bolita negra es su marca (lector A). | Los dos giros, cada uno con su dato; la frase «La bolita negra marca un brazo de la llave». |
| M7 | Molde §3 (figura sin respuesta) | Idea 2: «Así se resuelve» y los ejemplos «De centesimales a sexagesimales», «De sexagesimales a centesimales», «Un cuarto de vuelta», «El signo no cambia», «¿Cuál abre más?», «El suplemento, en centesimales» y «Suma de dos escalas». Idea 4: «Así se resuelve». Idea 4, ejemplo «Tres pitas sobre la llanta» | En el transportador de dos escalas la aguja marca a la vez el dato y la respuesta (la otra escala); «Ahora tú» de la idea 2 ya va sin figura por eso (comentario de `casoConvierte`), y sus ejemplos y su «Así se resuelve» no. En el de la idea 4, la aguja está en 60° con el «?». En «Tres pitas», las pitas numeradas 1, 2, 3 son la respuesta. Lector B: tarjetas 04 y 10, y el «Así se resuelve» del radián. | Sin transportador en esos ejemplos; «Así se resuelve» abre con la aguja en el cero y la muestra en el paso de la cuenta; las pitas sin numerar. |
| M8 | 3 | Idea 3, Predice | Pregunta en minutos centesimales con opciones en ᵐ; los Datos no dicen el símbolo. Lee 3 lo presenta, pero un alumno que va directo a jugar no lo ve (lector A). | Pregunta y Datos dicen «(ᵐ)» en palabras: «El minuto centesimal se escribe con una m pequeña arriba: ᵐ». |
| M9 | 2, 3 | Idea 1, Juega | El lector A no supo si el control llega a los negativos, ni si su − y su + son «menos grados» o el sentido. | La consigna dice «va de −540° a 540°»; la etiqueta del control, «− gira a la derecha, + a la izquierda» (es cierto: bajar θ es girar en sentido horario). |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección |
|---|---|---|---|---|
| B1 | 5 | Ejemplo «Radianes sin π» | «2 · 180°/π = 360°/3,1416»: con 3,1416 es una aproximación. | «≈». |
| B2 | 7 | Mira 1 de la idea 3; «Ahora tú» tipo 0 de la idea 3; ejemplos «Un cuarto de grado», «En centesimales es directo», «Segundos de un sistema al otro» y «Minutos de un sistema al otro» | «27/60 °»: el ° queda suelto junto a la fracción (lector A). | «27′ = 27/60 de grado = 0,45°». |
| B3 | 3 | Idea 3, «Ahora tú» tipo 0 (variante 1) | «Un ángulo mide 2,45°» se confunde con 2° 45′ (lector A). | «…, en grados con decimales (no son minutos)». |
| B4 | 6 | Idea 2: voz del juego y Lee 4 | «¿Cuál es siempre el mayor?» es falso en el cero (lector A). | «Fuera del cero, …». |
| B5 | 4 | Idea 2, La regla | La regla usaba la figura del último paso de Mira: 55ᵍ y 40,5° en el mismo ángulo recto, que parece sumar unidades distintas. «de ᵍ a °» se lee raro (lector A). | `regla.dibujo` propio (el recto: 90° y 100ᵍ en la misma raya); «a sexagesimales: × 9/10». |
| B6 | 1, 3 | Idea 3, Juega | La misión dice «con la aguja» y se ve una marca redonda; la lupa muestra de 1° a 2° y se pide 2,75° (lector A). | Consigna: «“Grados” elige el grado; la marca redonda corre por sus minutos»; la misión, igual. |
| B7 | 13 | Idea 4, La regla | «Vale si no depende del tamaño del círculo» no es una condición (lector B). | «arco y radio, en la misma unidad: el tamaño de la rueda no importa». |
| B8 | 3 | Idea 4, juego; pieza `trig-medida` | El «1» sobre la pita se leyó como 1 cm; en las tarjetas 10 y 12, «?» y «3 rad» quedaban fuera de la zona que barre el ángulo (lector B). | El juego sin números de pita y la lectura «1 pita de arco, 1 radio»; la pieza pone el rótulo dentro de la abertura desde dos pitas. |
| B9 | 3 | Idea 5: Lee, Predice, Mira | «DRG» sin decir; la fila RAD de Predice vacía; Mara dice «los tres números» en un paso con dos (lector B). | Lee 1 dice qué hace DRG; «?» en las tres filas; la voz de Mira. |
| B10 | Ejemplos | Tarjetas 06, 09, 14 y 15 del lector B, y «Una expresión con S y C» | 30ᵍ = 27° sin el × 9/10; «no resta los minutos» no explica 59° 20′; el 19 sin unidad en el color de S; 100k² sin (10k)² ni por qué no sirve k = −2; «tacha las letras: (2 + 1)/1» (tachando, abajo queda 1 − 1 = 0). | Lo que falta, escrito. |
| B11 | 1 | Idea 1, ejemplo «El timón en una curva» | Un timón quieto, sin giros: no dice nada (lector B, tarjeta 03). | Sin figura. |
| B12 | 13 | Idea 4, «Ahora tú» tipo 1 (`casoRadios`) | Con media pita sale la opción RAD-RESTA «−6 rad», un distractor que nadie elegiría. | Solo si la pita es más larga que el radio. |
| B13 | Retos | Mesa `arco-sale` | «Lleva el arco casi a la vuelta completa» se cumple con 6 y con 6,25 pitas; el `bien` dice «con 6 radios». | Un `bien` que sirva para los dos. |
| B14 | 8 | Idea 2, el transportador | Las rayitas cada 10° no se cuentan a 390 px (lector A). La lectura dice los dos números, y la misión no necesita contarlas. | La consigna dice que la lectura da los dos números. El dibujo, para Gerson. |
| B15 | 8 | Tarjeta 08 (lupa con 1° 30′ 36″) | Bajo la marca de la aguja hay una rayita corta encimada (minutos con decimales). | Se deja: dibujo de prueba de la pieza, para Gerson. |

## Lo que está bien y hay que copiar al molde

- **Cuentas sin errores en las respuestas**: 1 000 «Ahora tú», 1 000 «Así se resuelve», 75 ejemplos, 1 000 problemas de
  práctica, 30 casos y 8 de papel, rehechos por otro camino. Cada alternativa equivocada de nivel 3 sale del error que
  dice su resuelto.
- **Una sola respuesta comprobada**: las condiciones entre S y C dan un solo ángulo (fuerza bruta), la x de cada figura
  es única con α > 0 y β < 0, y el rayo ON de la figura está donde lo pone α.
- **La regla de colores por sistema** (° carmín, ᵍ turquesa, rad violeta) con una prueba que la recorre en todos los
  textos y en 400 semillas; y la idea 1 de un solo color, donde el sentido lo dicen la flecha y el signo.
- **Nada adelantado entre unidades**: una prueba exige que el radián no aparezca antes de su idea y que ningún ejercicio
  calcule un arco (Longitud de arco).
- **`conCuatro`**: si un caso sale con menos de cuatro opciones distintas, se arma otro; ninguna semilla queda con tres.
- **Misiones de una sola salida en toda la grilla** y predicciones que el juego no muestra (la grilla de la idea 5 va de
  9° en 9° y no deja ver la suma S + C).

## Reglas que faltan en el contrato o el validador

| Regla | ¿Automática? |
|---|---|
| **Toda igualdad numérica de un texto es cierta, con sus unidades**: «=» entre medidas en °, ′, ″, ᵍ, ᵐ, ˢ y rad evaluadas a un mismo sistema; un redondeo va con «≈» (M1, B1). | Sí: el evaluador de `cuentas.js` (con unidades y sin ellas) en 200 semillas y en toda la grilla del juego y las mesas. Encontró M1 y B1, y un solo falso positivo (una x de un error escrita en prosa). |
| **Un `siFuera` dice lo que da su valor**: el camino que describe, rehecho, da el número de la opción (A1). | Parcial: necesita que cada error declare su cuenta (`{ id, valor, camino }`) para rehacerla. |
| **`glosario-predice` también para los términos que se tocan en la pregunta de Predice**, no solo los que la idea estrena (M2: «vuelta» en la pregunta del radián). | Sí: las formas del glosario que aparecen en `predice.pregunta`. |
| **Un término con `simple` no trae en su definición la fórmula de la regla de su idea** (M3). | Parcial: comparar con las ecuaciones de `regla`. |
| **Una letra de Datos se dice en el recuadro que el alumno ve**, no solo en `letras` (M4: k). | Sí, para letras que no están en el enunciado ni en otra línea de Datos del mismo ejercicio. |
| **Un instrumento de dos escalas no se dibuja con la aguja en un ejercicio que pide la otra escala** (M7). | Sí, en esta pieza: `transportador` con giro y enunciado «¿Cuánto mide en grados…?». La unidad ya lo prueba. |

## Correcciones (19 nov)

Fase 8 del método (`docs/metodo/unidad/6-correcciones.md`), junto con las notas de los dos lectores en frío (ver
`rutinas/frio/trigonometria.angulo-trigonometrico.md`, «Correcciones de la ronda 1»). La versión de la teoría no se
cambió (sigue en 0.3.0; la sesión la sube al integrar si quiere). Copias de antes en
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e5-cierre-trig/antes/`.

Pruebas nuevas: 10 al final de `angulo-trigonometrico.test.js`, 1 en `generador.test.js` y 1 en `trig-medida.test.js`.
Con la versión de antes fallan las 12 (comprobado con los archivos de antes). Además se ajustaron tres pruebas de la
unidad que fijaban lo que cambió a propósito: el dibujo de dos giros (antes exigía uno), la figura opcional en los
ejemplos de la idea 1 y la forma de la pregunta de minutos en total. Después: unidad 24 de 24, generador 12 de 12,
piezas 7 + 8, `contenido/teoria/teoria.test.js` 163 de 163, papel al día (`papel-generador.js --revisar`), validador
con `calidad: 2` simulada sin problemas, `cuentas.js` 13 438 de 13 439 (el que falta es el falso positivo de arriba),
`herramientas/ecuaciones-ancho.js trigonometria.angulo-trigonometrico`: «todo cabe» (49 pantallas, 529 renglones).
No se corrió `npm test` completo (otras sesiones trabajando). Se corrió `npm run catalogo`: de esta unidad cambia solo
`app/datos/glosario/trigonometria.json` («vuelta» y «fórmula general de conversión»). Capturas de después:
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e5-cierre-trig/despues/` (momentos, ejemplos y
laboratorio a 390 px).

| # | Qué se hizo |
|---|---|
| A1 | La fila de los segundos de `casoEntreSistemas` usa 225k para MIN-SIN-SISTEMA. Prueba: en 400 semillas, esa opción vale n″ ÷ 3600 × 10 000. |
| M1 | La lectura dice «θ = g° = … rad» y después «= …ᵍ» si es exacto o «≈ …ᵍ» si no. Prueba: en toda la grilla, «=» solo con la cuenta exacta. |
| M2 | «vuelta»: «Giro completo que regresa al lado inicial: 360°.» Prueba: sin ᵍ, rad ni π. |
| M3 | «fórmula general de conversión» sin `simple`. Prueba: ninguna palabra del Resumen de la idea 5 trae 9k ni /180. |
| M4 | `DS.scr` y `D.scr` (generador) dicen «k = S ÷ 9 = C ÷ 10» (en el generador, «k = S ÷ 9», por el tope de 22 palabras); la regla dice «Como 180 = 9 · 20 y 200 = 10 · 20, cada cociente es k/20». Pruebas en la unidad y en el generador. El papel se regeneró (cambió la línea de S = 9k en p5 y p8). |
| M5 | Datos de Predice del radián: «Cada pita mide un radio de la rueda» y π ≈ 3,1416; la pregunta dice qué es la línea punteada. **Decidido por la sesión, Gerson revisa después** (contradice la decisión §4 de la propuesta, que dejaba 2 · π · radio). Prueba: sin «2 · π» ni «2π». |
| M6 | `casoSeguidos` dibuja los dos giros (radios 92 y 128, para que los rótulos no se pisen en las 400 semillas de la prueba de la pieza); llave y tapa dicen su marca en la pregunta de los tres tipos que las dibujan. Prueba propia y la de la idea 1 ajustada. |
| M7 | Siete ejemplos de la idea 2 sin transportador; «Así se resuelve» de las ideas 2 y 4 abre con la aguja en el cero (la muestra en el paso de la cuenta); «Tres pitas» sin numerar. Prueba: ningún resuelve dibuja un giro al abrir y ningún ejemplo de la idea 2 usa el transportador. |
| M8 | Pregunta: «El minuto centesimal se escribe con una m pequeña arriba: ᵐ»; Datos con «(°)», «(′)», «(ᵍ)» y «(ᵐ)». Prueba propia. |
| M9 | Consigna con «va de −540° a 540°»; etiqueta «Giro del timón (− gira a la derecha, + a la izquierda)». Prueba propia. |
| B1 | «≈». |
| B2 | «… de grado» en Mira 1, «Ahora tú» (tipos 0 de la idea 3) y los cuatro ejemplos. Prueba: ningún ° ni ᵍ suelto tras una fracción. |
| B3 | «Un ángulo mide 2,45°, en grados con decimales (no son minutos).» |
| B4 | «Fuera del cero» en la voz y en Lee 4. Prueba propia. |
| B5 | `regla.dibujo` con el recto (90° afuera, 100ᵍ adentro, en la misma raya); «a sexagesimales: × 9/10» y «a centesimales: × 10/9». |
| B6 | Consigna y misión de la idea 3 nombran la marca redonda y el control «Grados». |
| B7 | La condición nueva de la regla del radián. |
| B8 | Juego sin números de pita; lectura «1 pita de arco, 1 radio: θ = 1 rad». `trig-medida`: el rótulo del ángulo va a la mitad de su abertura desde 110° (si pisa un número de pita, vuelve a su lugar de antes). Prueba nueva de la pieza. |
| B9 | Lee 1: «La tecla DRG cambia de modo»; Lee 3: «porque 9° y 10ᵍ son el mismo giro»; Predice con «?» en las tres filas; voz de Mira: «Una sola letra, k, para S y C; después, para R». |
| B10 | Tarjeta 06 con «· 9°/10ᵍ»; 09: «copia los 20′ sin restarlos de 60′»; 14: el 19 en negrita, sin color; 15: «C² = (10k)² = 100k² y S² = (9k)² = 81k²» y «k² = 4 da k = 2 o k = −2. El ángulo es positivo, así que k = 2»; «Una expresión»: «tacha las letras de arriba y se queda con 2 + 1» (y el 28, sin color). Prueba de las tarjetas 14 y 15. |
| B11 | Sin figura. Prueba de los ejemplos de la idea 1: figura opcional; si está, sigue sin mostrar resultados. «Dos giros seguidos» rotula el lado inicial. |
| B12 | RAD-RESTA solo con L > r. |
| B13 | «Casi: la vuelta mide 2π ≈ 6,28 radios, y con 6 o 6,25 todavía falta un pedacito.» |
| B14, B15 | No se tocó el dibujo (ver Pendiente). |

### Pendiente

- **Para Gerson (dibujos de prueba):** el transportador de dos escalas, con rayitas que no se cuentan a 390 px; la
  rayita encimada de la lupa cuando la aguja cae entre minutos (tarjeta 08); la bolita negra de la llave, que podría
  dibujarse como un brazo pintado; la línea punteada del lado inicial, que solo nombran Lee 2 y la leyenda del juego.
- **Decidido por la sesión, Gerson revisa después:** M5 (Predice del radián sin 2 · π · radio); M3 («fórmula general
  de conversión» deja de ser palabra del Resumen de la idea 5); B11 («El timón en una curva» sin figura).
- **Las reglas nuevas del validador** quedan como propuesta (tabla de arriba); en esta unidad, varias ya son prueba propia.
- **No se tocó:** el dato 7 del lector B («Los segundos de un grado»: el dato casi es la respuesta) y la fila GRA vacía de
  la tarjeta 13, que es a propósito (no se usa). Los 200ᵍ de la regla del radián vienen de la idea 2.
