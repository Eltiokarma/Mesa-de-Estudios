# Redacción: fisica.estatica

26 nov 2026. Pasada aparte sobre una unidad ya cerrada (`calidad: 2`), con `docs/metodo/unidad/redaccion-delegada.md`
y el criterio de `escribidor-escribano`. Solo cambió el texto: ningún número, respuesta, distractor, dato ni dibujo. La
marca `calidad: 2` se queda y el validador sigue en cero.

Archivos: `contenido/teoria/fisica/estatica.js` y la práctica `plantillas/fis-estatica/generador.js`, con su
`papel.json` regenerado por `herramientas/papel-generador.js` (no se edita a mano). `plantillas/estatica` (la escena
vieja, solo de esta unidad) no se tocó: su papel y sus textos ya explican el porqué paso a paso. `dinamica-fuerzas` es
compartida y quedó fuera.

## Qué cambió, por tipo de problema

**1. Explicaciones de alternativa en molde «Bien X. Pero…»** (unas 110 en «Ahora tú» y 80 en la práctica). El molde
dejaba la primera mitad sin verbo y no decía qué razonamiento falló ni qué había que mirar. Ahora cada `siFuera` nombra
lo que el alumno hizo, dice por qué falla y qué fuerza o qué parte había que usar. En la práctica la prueba exige que
la explicación empiece por «Bien» y muestre su valor: se mantiene, pero con una oración completa («Bien calculado el
peso, pero…»).

> Antes (idea 1, cuerda del techo): «Bien restar. Pero el jalón se resta una sola vez: es una sola fuerza sobre la
> persona.»
> Después: «Restaste el jalón dos veces. Su pareja actúa sobre la cuerda, no sobre la persona: en el DCL de la persona
> hay una sola fuerza de la cuerda.»

> Antes (idea 3, el ropero quieto): «Bien comparar con el tope. Pero el piso frena lo que empujas, no lo que falta.»
> Después: «Restaste tu empujón del tope: eso es lo que le falta al rozamiento para llegar a su límite. Para que el
> cuerpo siga quieto, el piso frena lo mismo que empujas.»

**2. Explicaciones de las alternativas en los ejemplos de examen**, que eran listas de rótulos separados por punto y
coma («la C suma el jalón; la D da la cuerda»). Ahora cada letra lleva su razón en una oración.

> Antes (idea 1, ejemplo 11): «La A cree que marca el peso; la C suma el jalón; la D da la cuerda; la E resta los 200 N
> dos veces.»
> Después: «La A supone que la balanza marca siempre el peso y olvida la cuerda. La C suma los 200 N como si la cuerda
> empujara hacia abajo. La D da solo la cuerda, y la E resta los 200 N dos veces, aunque son una sola fuerza.»

**3. Reglas y «Vale si».** Las seis reglas dicen ahora qué es cada término, qué dice el recuadro y por qué vale; las
seis condiciones continúan «Vale si» y dicen qué pasa cuando no se cumplen.

> Regla 3, antes: «Mientras no desliza, el rozamiento estático vale lo justo para el equilibrio, hasta un tope: su
> coeficiente por la normal. Al deslizar, el cinético vale su coeficiente por la normal.»
> Después: «Mientras el cuerpo no desliza, el rozamiento estático frena lo justo para que siga quieto, y puede crecer
> hasta un tope: su coeficiente por la normal. Cuando desliza, el cinético ya no se ajusta: vale siempre su coeficiente
> por la normal, y suele ser menor que ese tope.»

> Regla 5, antes: «El torque mide cuánto hace girar una fuerza, un peso o una mano: τ = F · d, con d su brazo. Sin
> girar, los de un sentido igualan a los otros.»
> Después: «El torque mide cuánto hace girar una fuerza: es la fuerza por su brazo d, la distancia del eje a la línea
> de la fuerza. Si algo no gira, los torques que lo harían girar en un sentido igualan a los del sentido contrario; por
> eso un peso chico lejos equilibra uno grande cerca.»

> Condición 1, antes: «Vale si el cuerpo está quieto o a velocidad constante. La pareja mide lo mismo, apunta al revés
> y actúa sobre el otro cuerpo.»
> Después: «Vale si el cuerpo está quieto o va a velocidad constante; si acelera, sus fuerzas ya no suman cero. La
> pareja vale siempre: mide lo mismo, apunta al revés y actúa sobre el otro cuerpo, así que nunca se anulan entre sí.»

**4. Pasos de los 90 ejemplos y de «Así se resuelve»**, que eran rótulos («Torques iguales:», «Se despeja:», «El
peso se va:», «Quieta: …»). Ahora dicen qué se hace, por qué ese punto o esa fuerza y qué significa el resultado.

> Antes (idea 6, ejemplo 5): «Torques respecto de B (ahí N_B no hace torque):» · «Se despeja:»
> Después: «Se toman torques respecto de B, porque ahí N_B no hace torque. El tablón está a 2 m de B, y el pintor, a
> 3 m:» · «Se despeja lo que empuja A. Sale más que la mitad del peso total porque el pintor está más cerca de A:»
> (N_B va como ficha con subíndice.)

**5. Lee y Mira.** Las tarjetas dicen el porqué (la normal se llama así por salir perpendicular, un cable solo puede
jalar, k va en N/m porque son newtons por metro, el tablón puede girar y el nudo no). Los pasos de Mira son oraciones
con el porqué del cambio, sin adelantar la Predice.

**6. Notación.** Había «N_A», «N_B» y «F_e» crudos en pasos que ve el alumno (ejemplos 4 a 7 de la idea 6, Mira 2 de la
idea 6, «Así se resuelve» de las ideas 4 y 6, solución de «Ahora tú» de la idea 4): ahora van con los nodos de
subíndice. Los `aprendizaje` ya no traen «μ_s·N» ni «F_e = k·x». Las misiones cumplidas confirman con el hecho
(«Coincide: …») en vez de «¡Exacto!», «¡Eso!», «¡Ahí!» o «¡Horizontal!».

**7. Glosario.** Los 20 `simple` llevan un caso de la vida del alumno («como la carpeta que sostiene tu cuaderno»,
«una llave larga afloja mejor»), dentro del tope de 14 palabras. Primera ley y DCL siguen sin `simple` (la regla de
calidad 2 limita a 2–4 por idea). No corrí `npm run catalogo`: la prueba «glosario … archivos de la app al día» falla
hasta que la sesión lo corra al integrar.

**8. Lengua.** «Una refrigeradora … ¿Con cuánta fuerza lo frena el piso?» ahora concuerda (`la`/`lo` según el objeto).

## Para el auditor

1. **Idea 6, «Ahora tú» del caballete, y práctica `caballete`, error TQ-INV:** la explicación decía «la carga, con brazo
   corto, debe pesar más», pero con L = 3 m y a = 1 m el brazo de la carga (1 m) es más largo que el del tablón
   (0,5 m) y la carga pesa menos. Ahora dice que se cambiaron los brazos, sin afirmar cuál pesa más. Los números no
   cambiaron.
2. **`ecuaciones-ancho.js fisica.estatica`** (servidor propio en 4247, ya cerrado): 62 pantallas, 0 no caben y 11 se
   parten en mal sitio, todas en ecuaciones que no toqué (Mira 5 a 7 de la idea 1 con «→»; ejemplos 9, 13 y 14 de la
   idea 2; Mira 2 de las ideas 2 y 5; ejemplo 14 de la idea 3; «Así se resuelve» de la idea 6).
3. **Formato de cifras:** «1 000 N», «1 600 N·m», «3 600 N» salen de `Kit.formatear`; la casa escribe 1000. Es del
   formateador común.
4. **Terminología de la escena `plantillas/estatica`:** usa «momento» y «giro» donde la unidad dice «torque». No la
   toqué; si la escena se muestra junto a la unidad, conviene unificar.
5. **Idea 2, «Ahora tú» de cables iguales, error ST-P:** la explicación menciona que a 30° cada cable jala todo el peso,
   que es la misión del juego. Sale después de jugar y de responder; queda a juicio del auditor.
6. **Datos de la práctica** (`D.est`, `D.hooke`, `D.largo`) siguen con «f_s», «μ_s», «F_e», «L_0» en texto: la app de
   práctica los convierte (subíndice de una letra). No los cambié.

## Comprobación

- `contenido/teoria/fisica/estatica.test.js` (con el validador en `calidad: 2` simulada y los topes nuevos): 19 en
  verde.
- `plantillas/fis-estatica/generador.test.js` y `plantillas/estatica/motor.test.js`: en verde (93 entre los tres
  archivos). `papel-generador.js --revisar`: al día.
- `contenido/teoria/teoria.test.js`: 163 en verde, 1 falla esperada (glosario de física desactualizado en
  `app/datos/glosario/fisica.json`, por los `simple` nuevos; se arregla con `npm run catalogo` al integrar).
- `ecuaciones-ancho.js fisica.estatica`: punto 2 de arriba.

## Verificación (26 nov)

Verificador de cierre. Comparé con HEAD: las 10 487 marcas de la teoría (ecuaciones, opciones con su código, respuestas,
letras y figuras de los ejemplos, Mira, regla, Predice, y «Ahora tú» y «Así se resuelve» en 200 semillas por idea) son
idénticas, y en la práctica `fis-estatica` (2800 problemas) las alternativas, sus valores y códigos, el enunciado y los
datos no cambian; los números de la solución de HEAD siguen todos, en orden: no cayó ningún factor. Rehice la cuenta de
los `siFuera` de «Ahora tú» con sentido nuevo (200 semillas) y de las explicaciones de la práctica.

Corregido, cada cosa con una prueba que falla con la versión anterior:

- **TQ-INV del caballete (nota 1).** La explicación dice ahora qué da el error, con los brazos cambiados y su valor, y
  cuál pesa más según la semilla: «Bien los brazos, pero cambiados: la carga por 1 m y el tablón por 0,5 m dan 50 N.
  Cada peso va con el suyo: la carga, 0,5 m hasta el caballete, y el tablón, 1 m; por eso la carga pesa más que el
  tablón.» Con L = 3 m y a = 1 m dice «menos». En la práctica, prueba «verificación 26 nov: en el caballete, TQ-INV dice
  bien cuál pesa más» (`plantillas/fis-estatica/generador.test.js`). En la teoría el mismo arreglo está en el código,
  pero esa alternativa casi nunca llega a mostrarse (es el cuarto de cinco errores y salen los tres primeros: 0 de 400
  semillas); la prueba de `estatica.test.js` lo revisa si llega a salir.
- **E10 en la caja quieta en la rampa, cuando piden lo que empuja la rampa** (no estaba anotado; venía de antes). La
  explicación hablaba del rozamiento («frena solo lo justo») aunque la pregunta era la normal. Ahora dice que ese número
  es el tope del rozamiento y que la normal no lleva el coeficiente. Arreglado en «Ahora tú» y en la práctica, con su
  prueba en cada archivo («verificación 26 nov: … E10 habla de la normal»).

Decidido por la sesión, Gerson revisa después:

- **Las 11 ecuaciones que se parten a 390 px** se quedan: las ecuaciones son idénticas a HEAD, así que ya estaban, y es
  un asunto de maquetación, no de redacción.
- **«Momento» en la escena vieja.** En `plantillas/estatica/papel.json` (hecho a mano, lo ve el alumno) pasé «momento» a
  «torque» (12 veces), como dice la unidad. El `index.html` de la escena, con «momento» y «giro», no se tocó: la escena
  está marcada `rehacer: true` y se rehace entera.
- Las notas 3, 5 y 6 del redactor (formato «1 000», la misión nombrada en ST-P después de jugar, subíndices crudos en
  los datos de la práctica que la app convierte) se quedan como están.

Comprobaciones: `estatica.test.js` 21 de 21; `fis-estatica`, `estatica` y `dinamica-fuerzas` en verde (124 con la
unidad); validador con `calidad: 2` en 200 semillas: 0 hallazgos; regla del papel: 0 faltas; `papel-generador --revisar`:
al día; `contenido/teoria/teoria.test.js`: falla solo «glosario … archivos de la app al día», que espera
`npm run catalogo`.
