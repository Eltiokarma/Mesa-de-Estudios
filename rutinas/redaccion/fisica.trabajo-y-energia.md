# Redacción: fisica.trabajo-y-energia

26 nov 2026. Hice esta pasada aparte, sobre una unidad ya cerrada (`calidad: 2`). Seguí
`docs/metodo/unidad/redaccion-delegada.md` con el criterio de `escribidor-escribano`, y sobre todo su punto 4, «Explica,
no solo pules». Solo cambió el texto. Ningún número, respuesta, distractor, dato, dibujo ni ecuación cambió, y lo
comprobé con un script: los 500 campos `ecuacion`, `respuesta`, `alternativas`, `datos` y opciones de los ejemplos, Mira,
regla, Predice y controles son idénticos, y en 200 semillas por idea las respuestas, Datos, opciones y ecuaciones de
«Ahora tú» y «Así se resuelve» no cambian. La marca `calidad: 2` se queda y el validador sigue en cero.

Archivos: `contenido/teoria/fisica/trabajo-y-energia.js` y la práctica que es solo de esta unidad:
`plantillas/fis-energia/generador.js` (con su `papel.json` regenerado con `herramientas/papel-generador.js`), su
`generador.test.js` y `plantillas/energia-potencia/generador.js`. En 600 semillas, los enunciados, Datos y alternativas
de los dos generadores no cambian.

## Qué cambió, por tipo de problema

**1. Las seis reglas explican.** Cada una dice qué es el término, por qué vale y un caso que el alumno reconoce.

> Regla 1, antes: «Una fuerza trabaja solo con su parte a lo largo del camino, por la distancia. A favor del avance, el
> trabajo es positivo; en contra, negativo; de lado, cero.»
> Después: «El trabajo de una fuerza es su parte a lo largo del camino por la distancia d que avanza; esa parte la da el
> coseno del ángulo. Si la fuerza ayuda al avance, el trabajo es positivo; si lo frena, como el rozamiento, es negativo,
> y si va de lado, como la normal en un piso plano, es cero.»

> Regla 5, antes: «Con rozamiento, la energía mecánica baja: el trabajo del rozamiento, que es negativo, se suma y lo que
> falta se vuelve calor. Ese trabajo depende del camino recorrido.»
> Después: «Con rozamiento, la energía mecánica baja: al final queda la del comienzo más el trabajo del rozamiento, que
> es negativo porque frena. Lo que falta no desaparece: se vuelve calor. Como el rozamiento frena en cada metro, su
> trabajo depende de cuánto camino desliza el cuerpo, y no solo de la altura.»

La regla 2 dice ahora qué es la energía cinética y qué hace el trabajo neto («si es positivo, acelera, y si es
negativo, frena»). La 3 explica la referencia y por qué el cambio de energía no depende de ella. La 4 pone el caso del
niño que pierde altura y gana rapidez. La 6 dice por qué la eficiencia nunca pasa de 1.

**2. «Vale si»: las seis condiciones continúan la frase y dicen qué pasa si no se cumplen.** Antes había listas de
rótulos («h, la altura sobre la referencia; x, la deformación…; Δ, …») y frases que no completaban el marco («Vale si
el peso y los resortes son fuerzas conservativas; el rozamiento, no: …»). Ahora: «Vale si solo trabajan el peso y los
resortes; la normal de una pista quieta no trabaja. Si hay rozamiento, la energía mecánica baja: parte se vuelve
calor.» Lo que era definición de letras pasó a la regla o a la leyenda.

**3. Los `siFuera` de las seis Predice** dejaron el molde «X, cierto. Pero Y.» y nombran el razonamiento con su porqué.

> Predice 1 («500 J»), antes: «Bien la fuerza y la distancia. Pero tu mano empuja hacia arriba y la mochila avanza de
> lado.»
> Después: «Multiplicar 50 N por 10 m valdría si tu mano empujara hacia donde avanzas. Pero tu mano empuja hacia arriba
> y la mochila avanza de lado: mira el ángulo entre la fuerza y el camino.»

> Predice 5 («En la de 37°: la rampa la empuja más»), antes: «La normal es mayor en la de 37°, cierto. Eso da más
> rozamiento, no más rapidez.»
> Después: «Es cierto que la rampa de 37° empuja más a la caja, pero la normal no la hace avanzar: va de lado al camino.
> Una normal mayor solo da más rozamiento, y eso frena.»

**4. Las explicaciones de «Ahora tú»** (unas 90 plantillas en seis ideas, y las 12 de los signos del trabajo) dejaron el
«Bien X. Pero Y.» por oraciones que dicen qué estuvo bien, qué se hizo y por qué falla:

> Idea 2, «sin restar v₀», antes: «Bien la energía del final. Pero ya tenía energía al empezar: se resta.»
> Después: «La energía del final está bien, pero el cuerpo ya se movía al empezar y tenía energía cinética. El trabajo
> neto es solo lo que ganó, así que esa energía inicial se resta.»

**5. Pasos de «Así se resuelve», soluciones y los 90 ejemplos con el porqué.** Los rótulos «Se despeja:», «La masa se
cancela:», «El trabajo:», «Primero k:», «Por la rapidez:», «Lo útil:» o «En 18 s:» pasaron a decir qué se hace y por
qué. Las líneas de distractores de los ejemplos de examen dicen ahora qué cuenta hace cada alternativa.

> Ejemplo 4.3 (el pozo), antes: «A rapidez constante, el trabajo del torno es lo que gana la energía potencial:» y
> «Se despeja h:».
> Después: «A rapidez constante el obrero no gana energía cinética, así que todo el trabajo del torno se vuelve energía
> potencial:» y «Se despeja h dividiendo el trabajo entre el peso, 80 · 10 = 800 N:».

> Ejemplo 1.11, distractores, antes: «A usa la normal igual al peso; … D da el trabajo de la cuerda; E olvida el 0,5.»
> Después: «A toma la normal igual al peso y olvida que la cuerda levanta; … D calcula el trabajo de la cuerda,
> 50 · 4 · 0,8, y no el del rozamiento; E olvida multiplicar por el coeficiente 0,5.»

**6. Lee y Mira.** Las tarjetas de Lee dicen ahora qué es cada energía con un caso («si choca con algo, lo empuja o lo
rompe»; «si los sueltas, se ponen en movimiento») y por qué el área bajo F–x es el trabajo. La primera tarjeta de la
idea 1 ya no tiene la oración de seis palabras. Los pasos de Mira cuentan el porqué («6² es cuatro veces 3²»; «60 J, y
no los 90 J del empujón: por eso el carrito sale más lento»). Los mensajes de misión cambiaron «¡160 J!» por el hecho.

**7. Glosario.** Los 16 `simple` llevan un ejemplo de la vida diaria dentro del tope de 14 palabras («como tu empujón a
un carrito», «una combi rápida golpea más fuerte», «por eso se calientan los frenos»). No corrí `npm run catalogo`.

**8. Práctica.** En `fis-energia` reescribí las 63 explicaciones: ya no empiezan con «Bien», dicen qué estuvo bien y
por qué falla, y el «μ_k» crudo salió de ellas, porque la app las muestra sin convertir subíndices
(`app/practica.js:208`); ahora dicen «el coeficiente». Las 19 soluciones dicen el porqué del primer paso. En
`generador.test.js` cambié la exigencia de que la explicación empiece con «Bien» por una que comprueba lo mismo (que
nombre lo bien hecho: «bien», «cierto» o «comienzo») y que no sea un telegrama con «Bien» ni lleve «_». En
`energia-potencia` las explicaciones ya eran completas; solo cambié 11 rótulos de solución («Rapidez en m/s:»,
«Fuerzas que se oponen:», «Masas por tramo:»…) por oraciones. Su `papel.json` es hecho a mano y no lo toqué.

## Para el auditor

1. **Ecuaciones a 390 px:** `ecuaciones-ancho.js` (servidor propio en el puerto 4249, ya cerrado) da 0 que no caben y
   14 que se parten después de «=» con un resto corto («… = ⏎ 240 J», «… = ⏎ 18 000 J»), en ejemplos de las ideas 1, 2,
   4 y 6. Las ecuaciones son idénticas a las de antes, así que ya estaban.
2. **`plantillas/energia/index.html`** (la escena vieja, 1714 líneas) no la revisé: no es práctica de generador y su
   texto no pasa por la teoría. Su `papel.json` y el de `energia-potencia`, hechos a mano, ya explican cada paso.
3. **Explicaciones que agregué (son ciertas, conviene revisarlas):** tarjeta de joule, «subir una manzana chica, de
   unos 100 g, un metro hacia arriba» (0,1 · 10 · 1 = 1 J, el mismo dato del glosario); signos, la patada: «en ese
   tiempo la pelota avanza unos centímetros empujada por el pie»; Predice 4, «El recto puede hacerlo llegar antes»;
   ejemplo 5.12 y Predice 5, «una normal mayor solo da más rozamiento».
4. **Glosario:** el `simple` de «joule» dice «subir una manzana chica un metro cuesta uno»; si se lee raro sin la
   unidad, conviene «cuesta un joule», pero el glosario no deja usar el término.
5. Los campos `aprendizaje` no los toqué: la app no los muestra.

## Comprobación

- `contenido/teoria/fisica/trabajo-y-energia.test.js`, con el validador común de `calidad: 2`: 16 de 16 pasan, sin
  hallazgos.
- `plantillas/fis-energia`, `energia-potencia` y `energia`: todas pasan (146 con la unidad).
  `papel-generador.js --revisar` dice «al día».
- `contenido/teoria/teoria.test.js`: la prueba de esta unidad («formato, topes de texto…») pasa. Falla «glosario …
  archivos de la app al día», como se esperaba, porque no corrí `npm run catalogo`.
- Revisé 571 textos distintos de «Ahora tú» y «Así se resuelve» (20 semillas por idea): no hay «Bien» suelto, «Pero»
  de arranque, «_» crudo, doble espacio, «¡», «NaN» ni «undefined».

## Verificación (26 nov)

Verificador de cierre. Comparé con HEAD: las 9882 marcas de la teoría (ecuaciones, opciones con su código, respuestas,
letras y figuras, y «Ahora tú» y «Así se resuelve» en 200 semillas por idea) son idénticas; en `fis-energia` (2800
problemas) y `energia-potencia` (400) alternativas, valores, códigos, enunciados y datos no cambian, y los números de la
solución de HEAD siguen todos. Rehice la cuenta de los `siFuera` de «Ahora tú» (200 semillas) y de las explicaciones de
las dos prácticas (botes, resortes, rampas ásperas, tractor, bombas, collarín, rebotes, eficiencia): cuadran con su
error en todas las semillas.

Corregido, con prueba que falla con la versión anterior («verificación 26 nov: la Predice de los toboganes no afirma que
el recto llegue antes», en `trabajo-y-energia.test.js`):

- **Predice 4, CE-CAMINO.** «El recto puede hacerlo llegar antes» no es seguro: el curvo empieza más empinado (es el
  otro distractor) y una pista así suele llegar antes que la recta. Ahora: «Que el recto sea más corto no lo hace llegar
  con más rapidez: aquí se pregunta la rapidez abajo, no cuánto tarda. Sin rozamiento, esa rapidez depende solo de lo que
  bajó, 4 m en los dos.»

Revisado y queda: el joule como subir unos 100 g un metro (0,1 · 10 · 1 = 1 J); la patada, «la pelota avanza unos
centímetros empujada por el pie» (unos 10 ms a más de 10 m/s); RZ-NORMAL, «una normal mayor solo da más rozamiento»
(N = P · cos 37° > P · cos 53°).

Decidido por la sesión, Gerson revisa después:

- Las 14 ecuaciones que se parten después de «=» a 390 px se quedan: las ecuaciones son idénticas a HEAD y es un asunto
  de maquetación.
- La escena vieja `plantillas/energia/index.html` (`rehacer: true`) y los papeles hechos a mano de `energia` y
  `energia-potencia` no se revisan en esta pasada: la escena se rehace entera y los papeles ya explican cada paso.
- El `simple` del joule («subir una manzana chica un metro cuesta uno») se queda: el glosario no deja repetir el término.

Comprobaciones: `trabajo-y-energia.test.js` 17 de 17; `fis-energia`, `energia` y `energia-potencia` en verde (147 con la
unidad); validador con `calidad: 2` en 200 semillas: 0 hallazgos (el primer arreglo tenía 43 palabras y el validador lo
paró; quedó en el tope); regla del papel: 0 faltas; `papel-generador --revisar`: al día;
`contenido/teoria/teoria.test.js`: falla solo «glosario … archivos de la app al día», que espera `npm run catalogo`.
