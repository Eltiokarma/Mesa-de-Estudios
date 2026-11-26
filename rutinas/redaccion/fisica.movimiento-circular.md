# Redacción: fisica.movimiento-circular

26 nov 2026. Esta pasada se hizo aparte, sobre una unidad ya cerrada (`calidad: 2`), con
`docs/metodo/unidad/redaccion-delegada.md` y el criterio de `escribidor-escribano`, sobre todo el punto 4, «Explica,
no solo pules». Solo cambió el texto. Ningún número, respuesta, distractor, dato, dibujo ni ecuación cambió: un script
aparte cargó la versión anterior y la nueva y comparó, en las seis ideas, los ejemplos, Mira, la regla, las opciones de
Predice y 200 semillas de «Ahora tú» y «Así se resuelve» (opciones, ecuaciones de la solución, dibujos, pasos y
respuestas), quitando solo los campos de prosa. La única diferencia que encontró está en las seis `condicion`, que se
reescribieron a propósito. La marca `calidad: 2` se queda y el validador sigue en cero.

Archivos: `contenido/teoria/fisica/movimiento-circular.js` y los nueve generadores de práctica que son solo de esta
unidad (`circular-mcu`, `circular-encuentros`, `circular-transmision`, `circular-mcuv`, `circular-enesimo-segundo`,
`circular-horaria`, `circular-grafica`, `circular-aceleracion-total` y `circular-giro-combinado`). Sus `papel.json` se
regeneraron con `herramientas/papel-generador.js`; solo cambió el de `circular-mcu`, porque es el único cuyos pasos
tocan los problemas del papel. `tiro-parabolico` y `cinematica-medias` los comparten otras unidades y no los toqué.

## Qué cambió, por tipo de problema

**1. Las seis reglas ahora explican.** Cada una dice qué es la magnitud, por qué vale lo que dice y un caso concreto.

> Regla B1, antes: «El ángulo girado θ, en radianes, dice cuántos radios mide el arco. Una vuelta son 2π rad, o 360°.
> Un punto a r del eje recorre s = θ · r.»
> Después: «El ángulo girado θ, medido en radianes, dice cuántos radios mide el arco que recorre un punto. Por eso el
> camino de un punto a r del eje es s = θ · r: en la rueda de 8 m, girar 2 rad son 16 m. Una vuelta entera mide 2π
> radios, así que son 2π rad, lo mismo que 360°.»

> Regla B6, antes: «Si la rapidez cambia, hay dos aceleraciones perpendiculares: la tangencial, a lo largo del giro,
> cambia la rapidez; la centrípeta, hacia el centro, la dirección.»
> Después: «Si la rapidez cambia mientras gira, hay dos aceleraciones perpendiculares. La tangencial va a lo largo del
> giro y cambia la rapidez: mide α · r. La centrípeta va hacia el centro y cambia la dirección. Como forman un ángulo
> recto, la total no es su suma: es la diagonal del rectángulo, y sale con Pitágoras.»

La regla B3 dice ahora por qué el de afuera va más rápido («recorre un círculo más grande en el mismo tiempo») y que
con faja la rueda chica gira más rápido. La de B4 dice de qué depende la centrípeta («en la misma curva, el doble de
rapidez da cuatro veces más»), y la de B5, por qué sirven las ecuaciones del MRUV y que desde el reposo θ crece con t².

**2. «Vale si»: las seis condiciones continúan la frase y dicen qué pasa si no se cumplen.** Cuatro empezaban con un
rótulo o un dato («1 vuelta = 2π rad = 360°.», «Una vuelta son 2π rad.», «Faja, cadena o ruedas en contacto: …»,
«MCU: rapidez constante…», «La centrípeta mide v²/r…»), y la de B5 era una lista («α constante; θ en radianes.»).

> B1, antes: «Vale si 1 vuelta = 2π rad = 360°. Rodando sin resbalar, una rueda avanza lo que mide el arco de su borde.»
> Después: «Vale si θ está en radianes: con grados, θ · r sale unas 57 veces más grande. Si una rueda rueda sin
> resbalar, avanza lo que mide el arco de su borde; si patina, avanza menos.»

La de B4 conserva «ω, la velocidad angular», que una prueba exige.

**3. Los `siFuera` de las seis Predice nombran el razonamiento equivocado y dicen por qué falla.** El molde era
«Bien X. Pero Y.» o una media frase («Un radián es un arco de un radio, no una vuelta. Con 6 rad aún no llegaba.»).

> B4 («hacia afuera»), antes: «Hacia afuera se siente empujado quien va en la moto. La aceleración apunta al centro.»
> Después: «Quien va en la moto se siente empujado hacia afuera, pero eso es su cuerpo, que tiende a seguir en línea
> recta. La aceleración de la moto es lo que la saca de esa recta, y apunta al otro lado.»

**4. Las explicaciones de «Ahora tú» de las seis ideas** (unas 90 plantillas) dejaron el «Bien que… Pero…» y pasaron a
oraciones que dicen qué estuvo bien, qué faltó y por qué.

> B3, Beto «al revés», antes: «Bien que la rapidez cambie con el radio. Pero al revés: más cerca del eje, más lento.»
> Después: «Es cierto que la rapidez cambia con el radio, pero al revés. Más cerca del eje, el círculo es más chico,
> así que Beto va más lento que Ana, no más rápido.»

> B4, «v² · r», antes: «Bien la rapidez al cuadrado. Pero se divide entre r: un giro más cerrado acelera más.»
> Después: «La rapidez al cuadrado está bien, pero se divide entre r, no se multiplica. Una curva más cerrada, de radio
> menor, hace girar más rápido la flecha y acelera más.»

**5. Las líneas que explican las alternativas de los 30 ejemplos de nivel 3** eran listas de rótulos
(«la A promedia; la C busca…; la D resta los períodos; la E los suma.»). Ahora cada alternativa va en su oración y dice
qué hizo mal.

> 2.11 «Se cruzan en la pista», antes: «La A promedia; la C busca cuándo vuelven juntos a la salida; la D resta los
> períodos; la E los suma.»
> Después: «La A promedia los períodos, pero el cruce llega antes que la vuelta de cualquiera de los dos. La C busca
> cuándo vuelven juntos a la salida, que es otra pregunta. La D resta los períodos y la E los suma: lo que se suma son
> los ángulos.»

**6. Pasos de los ejemplos, de «Así se resuelve» y de Mira con el porqué.** Antes eran rótulos como «Se despeja r:»,
«El ángulo:», «Se restan:», «Con Pitágoras:», «ω, y después v.» o «Comprobación: … Sí cuadra.». Ahora dicen por qué se
hace eso («ω va en rad/s, así que primero se pasa el período a segundos», «Al restar las dos ecuaciones, el radio de B
desaparece y queda solo ω») y qué significa el resultado («Compruebo: … el arco del enunciado, así que el radio está
bien»). Los pasos de Mira cuentan el porqué de cada cambio: en B5, «Como ya parte más rápido, gira 6 rad, el triple que
en el primero».

**7. Lee y misiones.** Las tarjetas de Lee presentan cada término en palabras (uniforme, frecuencia con rpm y un
ejemplo, velocidad angular comparada con la rapidez, tangente como «rozándolo sin entrar», MCUV como «varía, pero de
manera pareja»). La de B1 conserva «Si llevaste Trigonometría», que una prueba exige. Ninguna adelanta una Predice: el
validador atrapó una («la que va hacia el centro» en B6) y se cambió por «la que apunta al centro».

**8. Glosario.** Los 15 `simple` llevan ahora un caso de la vida diaria (el segundero, la cadena de la bicicleta, el
auto que dobla, el ventilador que arranca), dentro del tope de 14 palabras y sin la clave de ninguna Predice. No corrí
`npm run catalogo`, así que la prueba «glosario … archivos de la app al día» de `teoria.test.js` falla hasta que la
sesión integre.

**9. Práctica.** En los nueve generadores reescribí las explicaciones de menos de 14 palabras (unas 20, por ejemplo
«Tomaste π rad como una vuelta. Una vuelta son 2π rad.» pasó a «Tomaste π rad como una vuelta, pero π rad es media
vuelta. Una vuelta entera son 2π rad, así que cada vuelta cuenta el doble.»), y siete pasos de rótulo de
`circular-mcu` («El tiempo en segundos:», «El radio en metros:», «Misma ω:»), que ahora dicen por qué.

## Para el auditor

1. **La escena `plantillas/movimiento-circular/` (index.html, 1529 líneas, y su `papel.json` hecho a mano) no la
   revisé.** Es solo de esta unidad; queda para otra pasada.
2. **Pasos de la práctica.** En los generadores, muchos pasos de la solución siguen siendo solo la cuenta
   («acp = v²/r = 3²/1,2 = 7,5 m/s².», «Respuesta: 20 rad/s.», «αB = αA = 4 rad/s² (mismo eje).»). Ya traen la fórmula
   y casi siempre el motivo en una nota; no los reescribí por tiempo.
3. **`ecuaciones-ancho.js` (puerto 4246, servidor cerrado): 0 no caben y 9 se parten después de «=»** con un resto
   corto. Las ecuaciones no cambiaron, así que vienen de antes: 1.10 «r = … = ⏎ 8 m» en «Así se resuelve» de B1; el
   enunciado de «Así se resuelve» de B6 («ac = ⏎ 6 m/s²»); los datos de B2 («ω = θ/t = ⏎ 2π/T»); los ejemplos 5.10,
   5.15, 4.15, 3.11 y 3.14. El arreglo es partir la cuenta o acortarla, y eso ya no es redacción.
4. **Nada que parezca falso.** Rehice las cuentas de cada alternativa que ahora tiene nombre (por ejemplo, la E de la
   bicicleta, 13,74 m/s, es (20/8)² · 2π · 0,35; la D de 3.14, 16 m/s, sale de invertir la razón). Todas cuadran con
   el error que se les atribuye.
5. El campo `aprendizaje` de cada idea (resumen de una línea) no lo toqué.
6. Los rótulos de las figuras con «_» («a_c», «v⃗_1») no son texto crudo: la pieza `fis-giro` los dibuja con subíndice.

## Comprobaciones

- `contenido/teoria/fisica/movimiento-circular.test.js`, que incluye el validador común con `calidad: 2`: 29 de 29.
- Los `generador.test.js` de los nueve generadores: todos en verde (de 15 a 18 pruebas cada uno).
- `contenido/teoria/teoria.test.js`: falla solo la del glosario, que se espera. Una falla en `dinamica.js` era de otro
  redactor que estaba editando; al volver a correrla, pasó.
- `node herramientas/ecuaciones-ancho.js fisica.movimiento-circular`: ver el punto 3 de arriba.

## Verificación (26 nov)

Verificador de cierre. Comparé con HEAD: las 11 294 marcas de la teoría (ecuaciones, opciones con su código, respuestas,
letras y figuras, y «Ahora tú» y «Así se resuelve» en 200 semillas por idea) son idénticas; en los ocho generadores
`circular-*` que cambiaron (8800 problemas) alternativas, valores, códigos, enunciados y datos no cambian, y los números
de la solución de HEAD siguen todos. Rehice la cuenta de los `siFuera` de «Ahora tú» (200 semillas) y de las
explicaciones de la práctica con razones («la mitad», «el doble», «100 veces», «5 veces»).

Corregido, con prueba que falla con la versión anterior («verificación 26 nov: las explicaciones de PR1 y PR-CUADRADO
dicen la razón que de verdad tiene cada semilla», en `movimiento-circular.test.js`):

- **PR-CUADRADO del óvalo (idea 4).** Decía «Con la mitad de radio, la aceleración es el doble, no cuatro veces» también
  cuando el óvalo tenía un tercio del radio. Ahora sigue a la semilla: «Con un tercio del radio, la aceleración es el
  triple, no nueve veces más.»
- **PR1 del carrusel (idea 3).** Decía «con la mitad de radio va a la mitad» con Beto a 1,5 m y Ana a 3,5 m, o a 1 m y
  4 m. Ahora: «si su radio es una fracción del de Ana, su rapidez es esa misma fracción de la de Ana.»

Decidido por la sesión, Gerson revisa después:

- **Pasos de la práctica que son solo la cuenta** (nota 2): se quedan. En cada problema el primer paso ya dice el
  principio (la faja iguala la rapidez de los bordes, lo girado en el segundo n crece como los impares, el triángulo de
  aceleraciones) y los siguientes son la cuenta con su fórmula. Reescribirlos es otra pasada de redacción sobre ocho
  generadores.
- **Las 9 ecuaciones que se parten después de «=»** (nota 3) se quedan: son idénticas a HEAD y es un asunto de
  maquetación.
- **La escena vieja `plantillas/movimiento-circular/`** (`rehacer: true`) no se revisó ni se reescribe: se rehace
  entera. Queda anotada.

Comprobaciones: `movimiento-circular.test.js` 30 de 30; plantillas de la unidad (`movimiento-circular`, los diez
`circular-*`, `tiro-parabolico`, `cinematica-medias`) en verde (366 con la unidad); validador con `calidad: 2` en 200
semillas: 0 hallazgos; regla del papel: 0 faltas (los de `cinematica-medias` siguen como pendientes con excepción, de
otras unidades); `papel-generador --revisar`: al día; `contenido/teoria/teoria.test.js`: falla solo «glosario …
archivos de la app al día», que espera `npm run catalogo`.
