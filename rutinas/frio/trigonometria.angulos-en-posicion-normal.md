# Lector en frío: trigonometria.angulos-en-posicion-normal

Ronda 1 (20 nov), con el método de `docs/metodo/unidad/4-lector-frio.md`; capturas `--entera --lector` del servidor del
auditor (puerto 4452; primer estado de cada momento: solo la tarjeta 1 de Lee y el paso 1 de Mira y de Así se resuelve),
en `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e8-cierre-pn/lector/` (35 momentos, 75
tarjetas y 15 en `lector/`, sin capturas repetidas por md5). Dos lectores nuevos, sin código: A con los momentos de las
ideas 1 a 3; B con los de las ideas 4 y 5 y las 15 tarjetas de ejemplos (n.º 3, 8 y 14 de cada idea). Los dos
respondieron todo bien; ningún número mal en pantalla.

## Lector en frío A, parte 1 (momentos): Ángulos en posición normal

Ideas: 1 «Las razones salen de P» (razones-coordenadas), 2 «El signo sale de x, y» (signos-cuadrante), 3 «Cero no es "no definida"» (cuadrantales). Pantallas de celular en tema claro. Solo miré las 21 imágenes.

De Lee solo veo la tarjeta 1/4; de Mira, el paso 1; de «Así se resuelve», el paso 1 («¿Qué me piden?»). Lo digo una vez y no lo cuento como falla.

### Idea 1: Las razones salen de P

**1 Lee.** Veo: una cuadrícula gris, los ejes x e y, un cuadradito gris con un círculo en el origen (la plaza, aunque el dibujo no lo dice) y una casita con un punto negro y la palabra «casa», 2 a la derecha y 3 arriba. Tarjeta «El plano del pueblo»: la plaza es el centro, cada cuadra es la unidad y la casa está 2 al este y 3 al norte. Me piden leer. Hay botones «Siguiente tarjeta» e «Ir directo a jugar». Duda: el cuadradito del origen no tiene nombre en el dibujo. Me imagino que es la plaza por el texto.

**2 Juega.** Veo la cuadrícula, la plaza en el origen, P (la casa) con un círculo morado para arrastrar, el segmento verde «x = 4», el naranja «y = 3», el segmento r de la plaza a P y el ángulo θ en rojo. Debajo: r = √(16 + 9) = 5 y sen θ = y/r = 3/5, una lista de lo que significa cada letra (θ es el giro antihorario desde la calle al este, x son las cuadras al este (+) o al oeste (−), y son las cuadras al norte (+) o al sur (−), r es la distancia en línea recta y P es la casa) y dos deslizadores, uno para x y otro para y. Misión: «Pon la casa al oeste, a 5 cuadras de la plaza, con sen θ = 4/5». Sin jugar, lo resuelvo en papel: oeste → x < 0; r = 5 y sen θ = 4/5 → y = 4, x = −3. Aprendí que el seno es y entre r, y que r sale de Pitágoras.
Dudas: «al oeste, a 5 cuadras de la plaza» se puede leer como «5 cuadras al oeste» (x = −5), y con eso sen θ = 4/5 sale imposible. Solo vale si «a 5 cuadras» es la distancia en línea recta (r). Mara pregunta «¿Qué número de la casa usa el seno?», y «número de la casa» me suena a la dirección (por ejemplo, el n.º 245), no a la coordenada.

**3 Predice.** Veo P(−12, 5) con la casa arriba a la izquierda, el segmento naranja (y), el verde (x), r = 13 y θ en el origen. Pregunta: ¿cuánto vale cos θ? En Datos: x = −12, y = 5, r = 13. Opciones: −12, 5/13, 12/13 y −12/13. Mi respuesta es la D, −12/13. Aquí no hay opción «No sé», pero en «Ahora tú» sí. En el dibujo, el arco de θ es una marca chiquita en el origen: no se ve bien que gire de la calle al este hasta la casa (unos 157°).

**4 Mira.** El mismo dibujo con la barra de pasos 1/5: «El lado final va de la plaza a la casa, en P(−12, 5)». Aprendí que el lado final es el segmento de la plaza a la casa y que primero se escriben las coordenadas con su signo. No tengo dudas.

**5 La regla.** Veo P(x, y) en el segundo cuadrante, el segmento y naranja, el x verde, r y θ con su arco desde el eje x positivo. Están las seis razones, cada una con el color de su letra, y también r = √(x² + y²) > 0. Vale si P no es el origen; si x = 0, no existen tan ni sec, y si y = 0, no existen cot ni csc. Mara dice: «x, el adyacente, e y, el opuesto, pueden ser negativos; r, nunca». No tengo dudas: se entiende bien.

**6 Así se resuelve.** Veo P en el cuarto cuadrante con el arco de θ casi completo. El problema es P(2, −3) y piden cos θ. Datos: las fórmulas, r y «Racionalizar: a/√b = a√b/b». Paso 1: «¿Qué me piden?». Mi cuenta da r = √13 y cos θ = 2/√13 = 2√13/13. No tengo dudas.

**7 Ahora tú.** P(12, −9), y piden sen θ. Mi cuenta: r = 15, así que sen θ = −9/15 = −3/5, la opción B. El dibujo tiene proporciones correctas (4 : 3). No tengo dudas.

**Ejercicio mío.** El lado final de θ pasa por P(−8, −15). Piden tan θ y sec θ. Mi cuenta: r = √(64 + 225) = 17, tan θ = −15/−8 = 15/8 y sec θ = 17/−8 = −17/8.

### Idea 2: El signo sale de x, y

**1 Lee.** Veo una rueda de la fortuna: un círculo gris con rayos, cabinas cuadradas, dos patas que bajan del centro, los ejes x e y, la cabina P en el primer cuadrante y θ. La tarjeta dice que el origen va en el centro y que θ se mide desde el rayo de la derecha en sentido antihorario. Me piden leer. Duda: las dos patas de la rueda salen del origen y parecen dos lados finales más, en los cuadrantes III y IV.

**2 Juega.** Veo la rueda con los cuadrantes I a IV marcados, P con un círculo para arrastrar, «x > 0» en verde, «y > 0» en naranja, θ = 45° y el deslizador de θ. Abajo dice: «Cuadrante I: sen θ > 0; cos θ > 0», con la lista de letras. Misión: dejar la cabina donde el seno sea negativo y el coseno positivo. Respuesta: en el cuadrante IV, por ejemplo θ = 315°. Aprendí que el signo de x y el de y deciden el signo de sen y cos. Duda menor: la etiqueta «y > 0» queda encima de la línea del círculo.

**3 Predice.** P en el cuadrante III (θ = 225°) con «x < 0» y «y < 0». Piden el signo de tan θ = y/x. Datos: en III, x < 0 e y < 0. Mi respuesta es la A, «Positivo». Dudas: el arco de θ es chico y no se ve que llegue a 225° (parece terminar cerca de 180°), y «x < 0» está apretado junto al arco y a θ. Además, el recuadro Datos casi da la respuesta: menos entre menos.

**4 Mira.** Veo el paso 1/4: «I: las seis +», «En el I, x e y son positivas: las seis razones son positivas». Aprendí que el cuadrante I tiene todo positivo. Duda menor: «las seis +» en el dibujo es muy telegráfico.

**5 La regla.** Veo los ejes con «I: todas», «II: sen, csc», «III: tan, cot» y «IV: cos, sec». La tabla dice que sen lleva el signo de y, cos el de x y tan el de y/x. Vale si el ángulo está fuera de los ejes. Duda: el dibujo no dice qué significa «II: sen, csc». Supongo que son las razones positivas, pero no está escrito: solo «I: todas» da la pista.

**6 Así se resuelve.** Veo los ejes vacíos con I a IV. Piden el signo de E = (sen 140° · cos 220°)/tan 310°, y el paso 1 dice que piden el signo, no el valor. Mi cuenta: sen 140° es + (II), cos 220° es − (III) y tan 310° es − (IV), así que E = (+ · −)/− = +. Duda: el dibujo no muestra los ángulos 140°, 220° ni 310°, así que no ayuda en este problema.

**7 Ahora tú.** θ = 280°, con P en el cuadrante IV. Piden los signos de csc θ y sec θ. Respuesta: csc es − (signo de y) y sec es + (signo de x), la opción D. El dibujo es correcto. No tengo dudas.

**Ejercicio mío.** Piden el signo de E = (cos 100° · tan 200°)/sen 300°. Mi cuenta: cos 100° es − (II), tan 200° es + (III) y sen 300° es − (IV), así que E = (− · +)/− = +.

### Idea 3: Cero no es «no definida»

**1 Lee.** Veo los ejes con N, S, E y O, una rosa de los vientos gris en el origen y una flecha horizontal con plumas («>») en el oeste y punta en P, en el este. La tarjeta habla de la veleta, de P a 40 cm, y dice que «el origen va en su eje y el eje x, hacia el este». Dudas: «en su eje» (el eje de la veleta) junto a «el eje x» confunde, porque son dos «ejes» distintos en la misma frase. Además, la flecha cruza todo el dibujo de oeste a este y no es claro que r = 40 sea solo del centro a P. Las plumas «>» parecen otra punta.

**2 Juega.** Veo P(40, 0) con un círculo para arrastrar, la rosa de los vientos y la cuenta sen θ = 0/40 = 0 y cos θ = 40/40 = 1. Están la lista de letras, con N, E, S y O, y el deslizador de θ en 0°. Misión: que el coseno valga −1. Respuesta: θ = 180°, con P(−40, 0). Aprendí que sobre un eje una coordenada vale 0. Duda menor: la «O» de oeste se parece al cero, sobre todo junto a coordenadas como (40, 0).

**3 Predice.** Veo P(0, 40) en el norte y θ = 90° con su arco. Piden tan θ. Datos: x = 0, y = 40 y r = 40. Mi cuenta: tan θ = 40/0, que no está definida, la opción A. Me gustó la opción B («un número infinitamente grande») como trampa. Duda: el título de la idea («Cero no es "no definida"») ya me avisa que algo «no está definida».

**4 Mira.** Veo el paso 1/4: «Al norte, la punta está sobre el eje y: x vale 0» y P(x, y) = (0, 40). Aprendí que en 90° x = 0. Duda: la etiqueta verde «x = 0» está a la derecha, sobre el eje x positivo, lejos de P, y parece que marca un punto del eje x.

**5 La regla.** Veo los cuatro puntos: 0°: (a, 0), 90°: (0, a), 180°: (−a, 0) y 270°: (0, −a). También dice 0/a = 0 («cero arriba») y a/0 no está definida («cero abajo»), y «Vale si a ≠ 0». Mara dice: «Cero es un valor; "no está definida" es que no hay valor». Dudas: en esta pantalla no dice qué es «a» (recién en Datos de la pantalla siguiente aparece «con r = a»). Además, la regla dice «no existen tan ni sec» y el título, «no definida»: son dos formas de decir lo mismo.

**6 Así se resuelve.** Piden E = (2 sen 90° + 3 cos 180°)/sec 0°. Datos: las fórmulas y los cuatro puntos con r = a. Mi cuenta: (2·1 + 3·(−1))/1 = −1. Duda: el dibujo son los ejes vacíos con I a IV, pero el problema es de ángulos sobre los ejes. Sirven más los cuatro puntos de la regla.

**7 Ahora tú.** θ = 270°, con P al sur. Piden cot θ. Mi cuenta: cot θ = x/y = 0/(−a) = 0, la opción D. El Datos «a/0 no da ningún número» es una buena trampa hacia C. El arco de θ es chico y su punta no llega bien al eje y negativo. Las plumas «v» de la flecha, al norte, parecen otra punta que baja hacia el centro.

**Ejercicio mío.** Calcula E = (3 cos 0° − sen 270°)/csc 90°. Mi cuenta: (3·1 − (−1))/1 = 4. Además, tan 180° = 0/(−a) = 0 y sec 90° = a/0, que no está definida.

### Lo que me trabó

- Idea 1, Juega: la misión «al oeste, a 5 cuadras de la plaza» se puede leer como x = −5, y con eso sen θ = 4/5 es imposible. Falta decir «a 5 cuadras en línea recta».
- Idea 1, Juega: Mara pregunta «¿Qué número de la casa usa el seno?», y «número de la casa» suena a la dirección, no a la coordenada.
- Idea 1, Lee: el cuadradito del origen (la plaza) no tiene nombre en el dibujo.
- Idea 1, Predice: el arco de θ es una marca chiquita y no se ve que llegue hasta la casa (unos 157°).
- Idea 2, Lee/Juega/Predice: las dos patas de la rueda salen del origen y parecen lados finales en III y IV.
- Idea 2, Predice: el arco de θ = 225° parece terminar cerca de 180°, y «x < 0» está apretado con θ.
- Idea 2, La regla: «II: sen, csc», «III: tan, cot», etc. no dicen que son las positivas.
- Idea 2, Así se resuelve: el dibujo (ejes vacíos) no muestra 140°, 220° ni 310°.
- Idea 3, Lee: «el origen va en su eje y el eje x» mezcla dos «ejes»; la flecha cruza todo el dibujo y no es claro que r = 40 sea del centro a P.
- Idea 3, Lee/Predice/Ahora tú: las plumas de la flecha («>», «v») parecen otra punta.
- Idea 3, Juega/La regla: la «O» de oeste se confunde con el cero junto a coordenadas como (−a, 0).
- Idea 3, Mira: la etiqueta «x = 0» está sobre el eje x positivo, lejos de P.
- Idea 3, La regla: no dice qué es «a» (se entiende recién en la pantalla siguiente, con «r = a»).
- Idea 3, Así se resuelve: el dibujo (ejes con I a IV) no ayuda en un problema de ángulos sobre los ejes.
- Idea 3, Ahora tú: el arco de θ = 270° no llega bien al eje y negativo.

## Lector en frío B: giro horario y coterminales negativos

Soy un alumno de 5.º. Solo miré las imágenes PNG. De Lee, Mira y «Así se resuelve» veo solo la primera tarjeta o el primer paso: lo digo una vez aquí y no lo cuento como falla.

### Parte 1: momentos

#### Idea 4, «El giro horario va con menos» (giro-horario)

**1 Lee.**
1. Veo un reloj con los números del 1 al 12 sobre unos ejes x e y. El origen está en el centro y el eje x pasa por el 3. Hay un punto P en el 3, una tarjeta «1/4 El reloj del aula», la lupa, el enlace «Ir directo a jugar», la coneja Mara y el botón «Siguiente tarjeta».
2. Me piden leer: el minutero empieza en el 3 (el lado inicial) y avanza en sentido horario.
3. x e y son los ejes. P es un punto del minutero (todavía no sé que es la punta). Las palabras con puntitos (origen, minutero, lado inicial, sentido horario) se pueden tocar.
5. Se entiende. En el dibujo no hay ninguna aguja: P es solo un punto.

**2 Juega.**
1. Veo el mismo reloj con un círculo rojo arrastrable en el 3, la misión «Haz que el minutero apunte al 8», la línea «θ = 0°: apunta al 3; sobre un eje», una leyenda (θ, P, 3), un deslizador «θ, giro del minutero» en 0° con −/+ y el botón «Volver al inicio».
2. Me piden arrastrar el minutero hasta el 8.
3. θ es el giro del minutero, horario y negativo. P es la punta del minutero. El 3 es el lado inicial.
4. Aprendí que girar como el reloj da ángulos negativos: el 8 está a 5 espacios, o sea −150°.
5. En 0° el minutero queda encima del eje x y casi no se distingue del eje. El botón del deslizador ya está pegado a la derecha en 0°, así que no sé si «+» lo mueve o no hace nada. Me costó entender que para ir al 8 tengo que llevarlo a la izquierda.

**3 Predice.**
1. Veo el reloj sin aguja, la etiqueta «θ = −300°», el recuadro Datos (30° entre números, una vuelta 360°) y cuatro opciones.
2. Me preguntan en qué cuadrante termina −300°. Me dicen que «el juego llegó hasta −180°».
3. θ es el ángulo y los números romanos son los cuadrantes.
5. Se entiende. Respondo «En el I»: −300° pasa el −270°. La opción C («un negativo no se ubica») es buena trampa. La frase «el juego llegó hasta −180°» me confundió un poco, porque mi misión era el 8 (−150°), no −180°.

**4 Mira (veo solo el paso 1 de 5).**
1. Veo el reloj, una flechita roja pegada al centro con «−90°», una línea punteada sobre el eje x, el botón ▶, el texto «De 0° a −90°, el minutero recorre el IV: del 3 al 6» y «−90° < θ < 0°: IV».
2. Me piden mirar la animación.
3. θ es el ángulo y IV es el cuarto cuadrante.
4. Aprendí que de 0° a −90° se está en el IV.
5. El texto dice «del 3 al 6», pero en el dibujo no hay ninguna aguja en el 6: solo una flechita en el centro. Puede ser que la animación todavía no empezó.

**5 La regla.**
1. Veo un círculo con el orden en que se recorren los cuadrantes: «1.º IV, 2.º III, 3.º II, 4.º I».
2. Me piden leer la regla: el ángulo negativo recorre IV, III, II, I, con los dos intervalos escritos.
3. θ es el ángulo y los romanos son los cuadrantes.
5. El dibujo con el orden ayuda mucho. «Vale si Sigue: de −180° a −270°…» se lee raro: «Vale si» no se junta bien con «Sigue». Tampoco entiendo bien «Sus razones salen de su P», porque en esta idea no se ve ninguna razón.

**6 Así se resuelve (veo solo el paso 1).**
1. Veo los ejes, P en el IV con su tramo x en verde y su tramo y en naranja, el arco θ y los Datos con las fórmulas.
2. Me piden sen θ para θ = −45° con P(3, −3).
3. x en verde, y en naranja, r es la distancia al origen.
5. Se entiende. Saco la cuenta yo: r = 3√2 y sen θ = −3/(3√2) = −√2/2.

**7 Ahora tú.**
1. Veo los ejes con los cuadrantes, la pregunta por −280°, los Datos y las opciones A–D más «No sé».
2. Me piden el cuadrante de −280°.
3. Los romanos son los cuadrantes.
5. Respondo B («En el I»): −280° está entre −270° y −360°. Nada me trabó.

**Ejercicio mío.** El minutero va del 3 al 10. ¿Qué ángulo gira y dónde termina? Del 3 al 10 hay 7 espacios: 7 · 30° = 210°, y como gira en sentido horario, θ = −210°. Está entre −180° y −270°, así que termina en el II. Comprobación: −210° + 360° = 150°, que está en el II.

#### Idea 5, «Más vueltas, mismo lado final» (coterminales-negativos)

**1 Lee.**
1. Veo una rueda de bicicleta con rayos, centrada en el origen, y la válvula P sobre el eje x positivo. Debajo, la tarjeta «1/4 La rueda de la bicicleta».
2. Me piden leer.
3. P es la válvula. Origen y válvula se pueden tocar.
5. Se entiende.

**2 Juega.**
1. Veo la rueda con P arriba, en 90°, y el arco θ. Debajo: la misión «Haz que la rueda gire −315° en total», la línea «θ = 90° + 360°·(0) = 90°: la válvula queda donde con 90°», la leyenda (θ, n, P) y dos deslizadores: giro base (90°) y n, vueltas (0).
2. Me piden lograr un giro total de −315°.
3. θ es el giro total, n son las vueltas enteras (negativas hacia atrás) y P es la válvula.
4. Aprendí que cambiar n no mueve la válvula: −315° = 45° + 360°·(−1).
5. La frase «la válvula queda donde con 90°» está rota, no se entiende. No sé si el giro base puede ser negativo o si tengo que usar n = −1.

**3 Predice.**
1. Veo la rueda con P en 0° y la etiqueta «θ = 780°». Me dan cos 60° = 1/2.
2. Me piden cos 780°.
5. Respondo 1/2, porque 780° = 60° + 2 · 360°. No veo de dónde sale la opción B (13/2). La idea se llama «coterminales negativos», pero aquí el ángulo es positivo.

**4 Mira (veo solo el paso 1 de 4).**
1. Veo la rueda con P en 60° y el texto «Con 60°, la válvula queda en P. cos 60° = 1/2».
4. Aprendí que primero se ubica el ángulo de menos de una vuelta.
5. Se entiende.

**5 La regla.**
1. Veo la rueda con P en 60°, un arco de 60° y una vuelta completa más con la etiqueta «420°».
2. Me piden leer: α − β = 360°·n y sen(θ + 360°·n) = sen θ.
3. α y β son los dos ángulos y n es un entero.
5. Se entiende. Aquí sí dice «positivo, negativo o 0».

**6 Así se resuelve (veo solo el paso 1).**
1. Veo la rueda con una espiral de vueltas, «1230°», P en el II y los Datos.
2. Me piden el coterminal de 1230° entre 0° y 360°.
5. P ya aparece en el II, cerca de 150°, antes de resolver: el dibujo adelanta dónde cae. Mi cuenta: 1230 − 3 · 360 = 150°.

**7 Ahora tú.**
1. Veo la rueda con P en 0°, «θ = 1320°», los Datos y las opciones 240°, 60°, 120°, 600° y «No sé».
2. Me piden el coterminal de 1320°.
5. Respondo A: 1320 − 1080 = 240°. Otra vez el ángulo es positivo.

**Ejercicio mío.** ¿Qué ángulo entre 0° y 360° es coterminal con −700°? Le sumo dos vueltas: −700° + 720° = 20°. Comprobación: 20 − (−700) = 720 = 360 · 2, y 2 es entero.

**Sobre esta idea:** el nombre habla de negativos, pero en lo que veo solo hay un ángulo negativo: la misión −315° de Juega. Predice (780°), Mira (60°), Así se resuelve (1230°) y Ahora tú (1320°) son todos positivos. No practiqué pasar un negativo a su coterminal positivo hasta las tarjetas de ejemplos (13).

### Parte 2: tarjetas de ejemplos

Las tarjetas vienen de tres en tres: los números 3, 8 y 14 se repiten en cada idea. Revisé todas las cuentas.

| Tarjeta | ¿Qué piden? | ¿Está todo? | ¿Sigo el resuelto? | Dibujo | Algo raro |
|---|---|---|---|---|---|
| 01 (3, tan con P(8, −15)) | tan θ | Sí | Sí. −15/8 ✓ | Ayuda: los colores de x e y | Nada |
| 02 (8, sen + cos con P(−24, −7)) | sen θ + cos θ | Sí | Sí. r = 25, −31/25 ✓ | Ayuda y está a escala | Nada |
| 03 (14, sec + tan con P(−5, 12)) | E | Sí | «tienen la misma abscisa abajo» se lee raro; «denominador» se entendería mejor. −5 ✓ | Ayuda | Revisé las cuatro trampas y todas cuadran |
| 04 (3, signo de tan 300°) | Signo | Sí | Sí ✓ | Ayuda, aunque muestra P en el IV antes del resuelto | Nada |
| 05 (8, tan < 0 y csc < 0) | Cuadrante | Sí | Sí. IV ✓ | Sobra: son solo los cuadrantes | Nada |
| 06 (14, sen = 2/3 en el II) | tan θ | Sí, con racionalizar | Sí. −2√5/5 ✓ | Sobra: no dibuja P(−√5, 2), que ayudaría | Nada |
| 07 (3, tan 180°) | tan θ | Sí | «y = 0 va arriba» se lee raro. 0 ✓ | Confunde un poco: hay una punta de flecha «<» suelta en el eje x positivo, cerca de E, y la «O» de oeste se puede leer como el origen O | Esa punta suelta |
| 08 (8, (tan 360° + sec 180°)/csc 90°) | E | Sí | Sí. −1 ✓ | Sobra | Nada |
| 09 (14, ¿cuál no está definida?) | Opción | Sí | Sí. E ✓ | Sobra | Nada |
| 10 (3, del 3 al 5) | θ | Sí | «Del 3 al 5 hay dos números» me hizo dudar: entre 3 y 5 solo está el 4. Son dos espacios. −60° ✓ | Ayuda: se ve el sentido horario | La aguja tapa el número 5 (encimado) |
| 11 (8, cos(−180°)) | cos | Sí | Sí. −1 ✓ | Ayuda: el arco va por abajo | Nada |
| 12 (14, θ negativo con sen > 0 y cos < 0) | Intervalo | Sí | Sí. D ✓ | Sobra: no marca los intervalos negativos | Nada |
| 13 (3, coterminal de −60°) | Ángulo de 0° a 360° | Sí | Sí. 300° ✓ | Confunde: dice «θ = −60°», pero P está en 0°, sin girar | P no está donde dice θ |
| 14 (8, 1110° y −330°) | ¿Coterminales? | Sí | Sí. 1440/360 = 4 ✓ | Sobra | Nada |
| 15 (14, suman 1000°) | El menor | Sí | Sí. α = 500 + 180n, n = 1, 320° ✓ | Sobra | La explicación de la trampa 140° dice «usa n = 2 y resta mal», pero con n = 2 la resta 1000 − 860 = 140 está bien hecha. El error es usar n = 2, que deja α fuera del rango |

En ninguna tarjeta encontré números imposibles ni letras o colores que cambien. Las respuestas no se adelantan, salvo un poco en 04, donde P ya está en el IV.

**Las 3 que mejor se entienden:** 02, 11 y 14.
**Las 3 que peor se entienden:** 13 (P no gira), 07 (la flecha suelta y «va arriba») y 10 (lo de «dos números»).
**¿Suben los niveles?** Sí, de verdad. La 3 es una cuenta, la 8 junta dos cosas y la 14 trae alternativas con trampas y pide pensar más (un sistema, racionalizar).
**El recuadro «Datos»:** ayuda, porque trae las fórmulas sin que tenga que memorizarlas, y no regala la respuesta. En las tarjetas 14 repite mucho y alarga la tarjeta.

### Lo que me trabó

- giro-horario, 2 Juega: con θ = 0° el minutero queda encima del eje x y no se distingue; el deslizador ya está en el tope derecho y no sé hacia dónde mover.
- giro-horario, 3 Predice: «El juego llegó hasta −180°» no coincide con mi misión (el 8, −150°).
- giro-horario, 4 Mira (paso 1): el texto dice «del 3 al 6», pero no se ve ninguna aguja en el 6, solo una flechita en el centro.
- giro-horario, 5 La regla: «Vale si Sigue: …» se lee raro, y «Sus razones salen de su P» no se ve en la idea.
- coterminales-negativos, 2 Juega: la frase «la válvula queda donde con 90°» está rota.
- coterminales-negativos, 3 a 7: casi no hay ángulos negativos (780°, 60°, 1230°, 1320°), aunque la idea es de negativos.
- coterminales-negativos, 3 Predice: no entiendo de dónde sale la opción 13/2.
- coterminales-negativos, 6 Así se resuelve: el dibujo ya pone P en el II (150°) antes de resolver.
- Tarjeta 07: una punta de flecha «<» suelta en el eje x positivo; la «O» de oeste parece el origen; «y = 0 va arriba» se lee raro.
- Tarjeta 10: «del 3 al 5 hay dos números» (son dos espacios), y la aguja tapa el 5.
- Tarjeta 13: dice «θ = −60°», pero P está en 0°, sin girar.
- Tarjeta 15: la explicación de 140° («resta mal») no es el error real; el error es usar n = 2.
- Tarjeta 03: «la misma abscisa abajo» se lee raro.
- Tarjetas 05, 06, 08, 09, 12, 14 y 15: el dibujo son solo los cuadrantes vacíos y no ayuda (en la 06 serviría dibujar P(−√5, 2)).

## Correcciones de la ronda 1 (20 nov)

Hechas en el cierre, junto con la auditoría (`rutinas/auditoria/trigonometria.angulos-en-posicion-normal.md`,
«Correcciones (20 nov)», donde está cada prueba). Capturas de después, a 390 px:
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e8-cierre-pn/despues/`.

| Nota | Qué se hizo |
|---|---|
| A, idea 1, misión «al oeste, a 5 cuadras» (x = −5 es imposible) | «Pon la casa al oeste, con r = 5 cuadras y sen θ = 4/5.» (M7) |
| A, «¿Qué número de la casa usa el seno?» | «¿Qué coordenada de la casa usa el seno?» (B1) |
| A, la plaza sin nombre | Rótulo «plaza» en Lee 1 (B2). |
| A, arcos que no llegan al lado final (157°, 225°, 270°) | La pieza dibuja todo arco con 20 px o más de radio; se ve completo hasta su lado final (M6). |
| A, patas de la rueda como lados finales; plumas de la veleta como otra punta; la «O» como cero | Patas desde el aro; cola como placa tenue; «norte», «este», «sur», «oeste» en palabras (M8). |
| A, «x < 0» apretado con θ; rótulos θ sobre los ejes | La pieza pone cada rótulo de ángulo donde no pisa ejes, lado final, tramos, puntos ni textos (M5). En la rueda, «x < 0» y «x > 0» van siempre bajo el eje x: arriba los cruzaba el arco de θ. |
| A, «las seis +» y la regla 2 sin decir que son las positivas | «I: todas > 0», «II: sen, csc > 0»… en la regla y en Mira (M12). |
| A, regla 3: «a» sin definir; «no existen» y «no definida» | «Vale si a = r, la distancia al origen. Con x = 0, tan y sec no están definidas; con y = 0, cot y csc.»; «no están definidas» en toda la unidad (M12, B6). |
| A, Lee 3: «en su eje y el eje x» | «El origen va en el poste, y el eje x apunta al este.» (M12) |
| A, Mira 3: «x = 0» lejos de P | Junto a P, sobre el eje y (B3). |
| A, «Así se resuelve» 2 y 3 con ejes vacíos | Los tres lados finales en la idea 2; los ángulos sobre sus ejes en la idea 3 (M13). |
| A, el título de la idea 3 avisa la respuesta | No se tocó: es el título de la idea. Para Gerson (B12). |
| B, el juego del reloj abre tapado por el eje y con el control en el tope | Abre en −30° (el 4) (M10). |
| B, «El juego llegó hasta −180°» | «El minutero del juego no pasa de −180°.» (M10) |
| B, Mira 4 «del 3 al 6» sin aguja | El minutero, con un punto en su punta, en −90°, −180° y −270°, un paso cada uno (M10). |
| B, «Vale si Sigue…» y «Sus razones salen de su P» | Los cuatro intervalos en la fórmula; «Vale si θ entre 0° y −360°; con más de una vuelta hacia atrás, el orden se repite»; la voz dice de dónde sale el valor (M12). |
| B, «la válvula queda donde con 90°» | «queda igual que con 90°» (M9). |
| B, la idea 5 casi sin negativos | Predice con cos(−660°), Mira y revelado con −660°, la regla con −300°, «Así se resuelve» empieza en −500° y alterna, el juego abre con n = −1 (M4). |
| B, la opción 13/2 sin error con nombre | En la predicción nueva: «−660° es −11 veces 60°, y −11 · 1/2 = −11/2» (B7). |
| B, «Así se resuelve» 5 pone P en el II antes de resolver | Arriba, la rueda sin girar; el giro, en el paso de las cuentas (M11). |
| B, tarjeta 13: «θ = −60°» con P sin girar | P se rotula «P al empezar» (M11). |
| B, tarjeta 15: «140° … resta mal» | «140° usa n = 2, con α = 860° fuera del rango» (M9). |
| B, tarjeta 10: «hay dos números» | «dos espacios entre números» (y «espacios» en los demás) (M9). La aguja tapa el 5: no se tocó (B8). |
| B, tarjeta 07: punta suelta, «O», «y = 0 va arriba» | Veleta nueva (M8); «La ordenada y = 0 queda arriba del cociente» (B4). |
| B, tarjeta 03: «la misma abscisa abajo» | «el mismo denominador, la abscisa» (B4). |
| B, tarjetas con cuadrantes vacíos | 06 con P(−√5, 2) y «x = ?»; 08 y 09 con los ángulos en sus ejes; 12 con los cuartos de vuelta horarios (M13). 05, 14 y 15 no se tocaron: dibujar sus ángulos mostraría la respuesta (B9). |
| B, tarjeta 04 muestra P en el IV | No se tocó: ubicar el cuadrante es el método (B10). |
