# Redacción: fisica.mruv-y-caida-libre

26 nov 2026. Esta pasada se hizo aparte, sobre una unidad ya cerrada (`calidad: 2`). Seguí
`docs/metodo/unidad/redaccion-delegada.md` con el criterio de `escribidor-escribano`, y la segunda vuelta siguió el
punto 4, «Explica, no solo pules», que llegó a mitad del trabajo. Solo cambió el texto: ningún número, respuesta,
distractor, dato, dibujo ni ecuación. Comparé todos los campos `ecuacion` antes y después, y son idénticos. La marca
`calidad: 2` se queda y el validador sigue en cero.

Archivos: `contenido/teoria/fisica/mruv-y-caida-libre.js` y la práctica que es solo de esta unidad,
`plantillas/fis-mruv/generador.js`. Su `papel.json` se regeneró con `herramientas/papel-generador.js`, y en
`generador.test.js` se quitó solo la exigencia de que cada explicación empiece con «Bien». `mruv` y
`cinematica-medias` también los usa Movimiento rectilíneo uniforme, así que no los toqué.

## Qué cambió, por tipo de problema

**1. Las reglas ahora explican.** Cada regla dice qué es el término, por qué vale lo que dice y un caso concreto.
La línea de la academia, «La academia escribe …: la misma …», se queda, porque las pruebas la leen.

> Regla B1, antes: «La aceleración es cuánto cambia v cada segundo; al frenar, a y v tienen signos contrarios. La
> academia escribe v = v₀ ± a·t: la misma regla, con a sin signo.»
> Después: «La aceleración es cuánto cambia la velocidad en cada segundo: de 4 a 10 m/s en 3 s, gana 2 m/s cada
> segundo. Su signo dice hacia dónde cambia v, no hacia dónde va: al frenar, a y v tienen signos contrarios aunque
> avance. La academia escribe v = v₀ ± a·t: la misma regla, con a sin signo.»

> Regla B3, antes: «En v–t, la pendiente es la aceleración y el área, el desplazamiento: sobre el eje suma, bajo el eje
> resta. La distancia recorrida, d, las suma sin signo.»
> Después: «En la gráfica v–t, la pendiente es la aceleración, porque mide cuánto sube v en cada segundo, y el área
> bajo la línea es el desplazamiento, porque velocidad por tiempo da metros. El área sobre el eje suma y la de bajo el
> eje, que es ir hacia atrás, resta. La distancia recorrida, d, suma las dos sin signo.»

La regla B2 dice ahora cómo se elige la ecuación: «si no dan el tiempo, sirve la de v²; si no dan a, la de la
velocidad media». La regla B4 recibió lo que antes estaba en su condición, es decir, dónde se alcanzan y dónde van igual
de rápido.

**2. «Vale si»: las seis condiciones continúan la frase y dicen qué pasa si no se cumplen.** Antes empezaban con
«a no cambia…», «sin aire, cerca del suelo. Aquí…» o «la línea es v, no el camino. Las áreas…», y mezclaban datos
que no eran condiciones.

> B5, antes: «Vale si desde el reposo y sin aire; h es lo que cae, medido hacia abajo desde donde se suelta. g = 10 m/s².»
> Después: «Vale si el cuerpo sale del reposo, el aire no lo frena y h se mide hacia abajo desde donde se suelta, con
> g = 10 m/s². Si el aire frena mucho, como a una hoja extendida, cae más lento que lo que dicen estas fórmulas.»

**3. Los `siFuera` de las seis Predice nombran el razonamiento equivocado y dicen por qué falla.** El molde era
«Bien X. Pero Y.».

> B1 (la opción 0), antes: «Bien: no cambió de sentido. Pero su velocidad sí cambió, de 20 a 8 m/s.»
> Después: «Seguir yendo hacia la derecha no quiere decir que no acelere: la aceleración mide si cambia la velocidad,
> y aquí bajó de 20 a 8 m/s. Solo sin ese cambio valdría 0.»

> B5 («la piedra, en la décima parte del tiempo»), antes: «Bien: la Tierra jala más a la piedra. Pero sin aire, a todo
> le da la misma aceleración.»
> Después: «Ese razonamiento supone que diez veces más peso da diez veces más aceleración. La Tierra jala más a la
> piedra, pero también le cuesta más moverla, y sin aire las dos aceleran igual.»

**4. Las explicaciones de «Ahora tú» de las seis ideas** (unas 110 plantillas) dejaron el «Bien el 3. Pero…» y pasaron
a oraciones completas que dicen qué estuvo bien, qué faltó y por qué: «Dividir entre 4 s está bien, pero lo que se
divide es el cambio de velocidad…», «Es cierto que tarda 3 s en parar, pero piden la distancia en metros…».

**5. Pasos de «Así se resuelve», de los ejemplos y de Mira con el porqué.** Antes eran rótulos como «La pendiente:»,
«Se suman:», «A m/s:», «La diferencia:», «Comprobación: … Sí llega.» o «Negativa: va contra la velocidad. Es lo
esperado.».

> Así se resuelve B2, antes: «La ecuación que no usa el tiempo: v² = v₀² + 2aΔx. Se despeja a.»
> Después: «Como falta el tiempo, se usa la ecuación que no lo tiene, v² = v₀² + 2aΔx, y de ella se despeja a.»

> Mira B4, antes: «Se cortan en v–t a los 5 s: misma velocidad, no mismo lugar.»
> Después: «En v–t se cortan a los 5 s: ahí tienen la misma velocidad, aunque no estén en el mismo lugar.»

**6. Lee.** Arreglé las frases entrecortadas: «más larga, más rápido» pasa a «cuanto más larga, más rápido va».
«Δv (delta ve) … la del inicio, v₀» ahora nombra las dos velocidades. «La de x = t² es una.» y «Para un triángulo, la
mitad.» quedaron como oraciones completas. La tarjeta de caída libre ahora dice qué la hace caer.

**7. Práctica (`fis-mruv`).** Reescribí las 229 explicaciones: ya no empiezan todas con «Bien», tienen sujeto y verbo
(«El cambio de velocidad, 6 m/s, está bien, pero…», «Es correcto que dividas entre 4 s, pero…») y cierran con «y por
eso X no es la respuesta» en vez de «X no es.». El «v_0» crudo pasó a «v₀» en las explicaciones, porque la app las
muestra sin convertir los subíndices (`app/practica.js:208`). A unas 35 soluciones les agregué el porqué del primer
paso: «No dan el tiempo, así que se usa…», «Como sale del reposo, lo que cae es ½ · g · t²…», «La aceleración es la
pendiente…». Todas siguen dentro del tope de 40 palabras de su prueba.

## Para el auditor

1. **Ecuaciones a 390 px:** `ecuaciones-ancho.js` encuentra 82 ecuaciones partidas: 77 se parten después de «=», 4
   dentro de un paréntesis y 1 después de «→». Por ejemplo, la fórmula de segundo grado en Datos (ejemplo 12 de B4),
   «Δx = 24 − 6 = 18 m; d = 24 + 6 = 30 m» (ejemplo 8 de B3) y el paso 4 del alcance en B4. Esta pasada no las causó,
   porque las ecuaciones son idénticas a las de antes, pero ya estaban ahí.
2. **Práctica, tipo `velocimetro`:** la solución decía «a = 108 km/h = 30 m/s ÷ 6 = 5 m/s²», una cadena de
   igualdades falsa. Ahora dice «En m/s, 108 km/h = 30 m/s, así que la aceleración es 30 ÷ 6 = 5 m/s²». Los números no
   cambiaron.
3. **Práctica, tipo `alcance-detras`:** con a = 2 sale «1t² − 9t − 52 = 0», con el coeficiente 1 escrito. No lo toqué,
   porque el arreglo es código de formato.
4. **No toqué el glosario**, porque cambiarlo obliga a correr `npm run catalogo`. Dejo dos sugerencias: el `simple` de
   «ecuación horaria» dice «a cada hora del reloj», y convendría «en cada instante»; la definición de «parábola» («La
   x–t del MRUV es parte de una») podría decir «es un trozo de parábola».
5. **Explicaciones que agregué (son ciertas, pero conviene revisarlas):** en la Predice de B5, «también le cuesta más
   moverla» (la inercia); en el paso «sentido» de B4, «solo así su media iguala la de él», porque la combi alcanza
   con una media v/2 igual a la del mototaxi; en la solución del encuentro de B6, «la gravedad cambia igual la
   velocidad de las dos, así que se acercan siempre a v₀».

## Comprobación

- `contenido/teoria/fisica/mruv-y-caida-libre.test.js`, que incluye el validador común con `calidad: 2`: 32 de 32
  pasan, sin hallazgos.
- `plantillas/fis-mruv/*.test.js`: 35 de 35 pasan. `papel-generador.js --revisar` dice «al día».
- `contenido/teoria/teoria.test.js`: 229 pasan y 2 fallan, las dos ajenas a esta unidad. Una son los topes del glosario
  de Movimiento parabólico; la otra, que `app/datos/glosario/fisica.json` está desactualizado por cambios del glosario
  de otras unidades. No corrí `npm run catalogo`.
- `ecuaciones-ancho.js fisica.mruv-y-caida-libre` (servidor propio en el puerto 4244, ya cerrado): ver el punto 1.
- Revisé 418 textos distintos de «Ahora tú» y «Así se resuelve» (20 semillas por idea) y 1640 explicaciones de la
  práctica (600 semillas). No hay «NaN», «undefined», «_» crudo, doble espacio ni dos «pero» en una oración.

## Verificación (26 nov)

Verificador de cierre de la pasada. Resolví las notas, rehice la cuenta de los `siFuera` de las seis ideas en 200 semillas
y de las 260 explicaciones distintas de `fis-mruv` en 1500 semillas, y comparé con HEAD: las 2586 ecuaciones son idénticas
y ningún número, opción ni color cambió.

Lo corregido, cada cosa con una prueba que falla con la versión anterior:

- **Nota 3, «1t²».** En `alcance-detras`, con a = 2 m/s², la solución decía «Iguales: 1t² − 9t − 52 = 0»; ahora «Al igualar
  las dos posiciones queda t² − 9t − 52 = 0, de donde t = 13 s». Lo mismo en el alcance desde el paradero, que decía
  «6 · t = 1 · t²». Prueba: `fis-mruv/generador.test.js`, «ninguna ecuación escribe el coeficiente 1».
- **Nota 5, explicación agregada en la Predice de B5.** «Diez veces más peso da diez veces más aceleración» no da «la
  décima parte del tiempo» (con h = ½ g t², el tiempo bajaría a 1/√10, unos 0,32). El error que da ese valor es creer que
  cae diez veces más rápido, y así dice ahora. Las otras dos agregadas son ciertas: «también le cuesta más moverla» (la
  inercia) y «solo así su media iguala la de él» (al alcanzarlo, la combi va a 2v y su media es (0 + 2v) ÷ 2 = v). La del
  encuentro de B6 también: las dos cambian su velocidad igual y se acercan siempre a v₀. Prueba:
  `mruv-y-caida-libre.test.js`, «el siFuera de «la décima parte del tiempo»…».
- **Distractor `por` del tiempo de vuelo (B6).** Vale v₀ · g ÷ 10 = v₀, y su explicación decía «Ese número no sale de
  dividir». Ahora: «Tomaste los 25 m/s de la rapidez como si fueran segundos…». Prueba en la misma unidad.
- **Práctica.** Quedaban seis explicaciones en el molde «Bien X. Falta Y.» (tramo parejo, triángulo de la salida, área del
  primer tramo, lo que cayó hasta el segundo anterior, «Bien 50 + 6 · 7. Pero…»); «Calculaste bien v₀ y g» (son datos, no
  se calculan); «pero salió con 19 m/s: falta v₀²» (sin decir quién salió ni dónde falta); «se acercan a 20 m/s, sin
  dividir; así sale 0,75 s» (el valor sale de dividir entre el doble); y en la velocidad desde la ecuación horaria, el
  valor del error iba tras el valor correcto de a. Todas reescritas. Prueba: «ninguna explicación queda en el molde
  «Bien X.»…».
- **Nota 4, glosario (decidido por la sesión).** Tomé las dos sugerencias: el `simple` de «ecuación horaria» dice «en
  cada instante», y la definición de «parábola», «La gráfica x–t del MRUV es un trozo de esa curva».

Decidido por la sesión, Gerson revisa después: las 82 ecuaciones partidas a 390 px (nota 1) se quedan; son anteriores a la
pasada.

Comprobaciones: prueba de la unidad 34 de 34; `fis-mruv` 37 de 37 (papel regenerado con `papel-generador`, `--revisar`:
al día), `mruv` 51 y `cinematica-medias` 33, en verde; validador con `calidad: 2` en 200 semillas: 0; regla del papel: 0;
`contenido/teoria/teoria.test.js`: 163 de 164 (la del glosario de la app; hace falta `npm run catalogo`).
