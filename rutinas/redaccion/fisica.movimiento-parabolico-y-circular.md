# Redacción: fisica.movimiento-parabolico-y-circular

26 nov 2026. Pasada aparte sobre una unidad ya cerrada (`calidad: 2`), con `docs/metodo/unidad/redaccion-delegada.md`
(incluido el cambio del 26 nov: explicar, no solo pulir, con los topes nuevos) y el criterio de `escribidor-escribano`.
Solo texto: ningún número, respuesta, distractor, dato ni dibujo cambió. La marca `calidad: 2` se queda.

Archivos: `contenido/teoria/fisica/movimiento-parabolico-y-circular.js` y la práctica propia de la unidad,
`plantillas/fis-parabolico/generador.js` (con su prueba y su `papel.json`, regenerado con
`herramientas/papel-generador.js`). `tiro-parabolico` y `cinematica-medias` son compartidas con Movimiento circular y
no se tocaron.

## Qué cambió, por tipo de problema

**1. Reglas sin porqué ni caso.** Las cinco reglas decían qué pasa pero no por qué, y la 2 le atribuía la tangencia a
la rapidez. Ahora cada una dice la causa y trae un caso con números de la unidad.

> Regla 1, antes: «De lado avanza parejo, como un MRU; hacia abajo cae como si la soltaran. El tiempo de caída sale
> solo de la altura; con él se halla el alcance.»
> Después: «De lado, la piedra avanza parejo, porque nada la empuja ni la frena de lado. Hacia abajo cae como si la
> soltaran, porque al salir no tenía velocidad hacia abajo. Por eso el tiempo de caída depende solo de la altura: desde
> 45 m tarda 3 s, salga rápida o lenta, y con él sale el alcance.»

> Regla 4, antes: «Arriba la velocidad vertical es cero: de ahí salen el tiempo de subida y la altura máxima. El
> alcance es lo de lado por el vuelo; es máximo a 45°.»
> Después: «En la cima, la velocidad vertical es cero, y de ahí salen el tiempo de subida y la altura máxima. El
> alcance es la velocidad de lado por el tiempo de vuelo, el doble de la subida. Es máximo a 45°, y los ángulos
> complementarios, que suman 90°, dan el mismo: uno gana subiendo lo que el otro gana avanzando.»
> (Lo de los complementarios estaba en la condición, que no es su lugar, y «Ahora tú» lo pregunta.)

**2. «Vale si» que no continuaba la frase o traía datos que no eran condición.** Las cinco condiciones empiezan ahora
como subordinada y dicen qué pasa si no se cumplen. «La academia dice semiparabólico» pasó a la tarjeta 1 de Lee.

> Condición 1, antes: «Vale si sale de lado, sin aire, con g = 10 m/s². h se mide hacia abajo. La academia dice
> semiparabólico.»
> Después: «Vale si la piedra sale de lado, no hay resistencia del aire y g = 10 m/s²; h se mide hacia abajo desde
> donde sale. Si sale inclinada, ya lleva velocidad hacia arriba o hacia abajo y no cae como la soltada.»

**3. Explicaciones de alternativas en molde «Bien X. Pero Y.»** (unas 60 en la teoría y las 69 de la práctica). Eran dos
oraciones sin verbo («Bien el despeje: eso vale t².») o con un elogio que no se sostenía. Ahora nombran el
razonamiento equivocado, dicen por qué falla y qué había que mirar.

> Predice 2, antes: «Bien las dos partes: 15 de lado y 20 hacia abajo. Pero forman un ángulo recto: no se suman así.»
> Después: «Las dos partes están bien, 15 m/s de lado y 20 m/s hacia abajo, pero sumarlas valdría si fueran en la
> misma dirección; forman un ángulo recto, como los catetos de un triángulo.»

> Ahora tú 1 (tiempo de caída), antes: «Bien que dividas una distancia entre una rapidez. Pero esa rapidez es de lado:
> no la hace bajar.»
> Después: «Dividir la altura entre una rapidez daría el tiempo si bajara con esa rapidez, pero esta rapidez es de lado
> y no la hace bajar.»

> Práctica (avioneta, P4), antes: «Bien la altura. Pero el paquete no cae recto: sigue avanzando con la avioneta.
> 125 m no es.»
> Después: «Dar 125 m es suponer que el paquete cae recto, pero sale con la rapidez de la avioneta y sigue avanzando de
> lado mientras cae.»

**4. Jerga «lo de lado», «lo que sube», «la parte»**, que en tan θ se leía como distancias («lo que baja entre lo que
avanza»). Ahora es «la velocidad hacia abajo entre la de lado», «la componente que sube», «la componente de lado», en
toda la unidad y en la práctica.

**5. Pasos de «Así se resuelve», soluciones y Mira sin porqué o sin verbo.** «Primero el tiempo, con lo que avanzó de
lado; después, lo que cae en ese tiempo.» pasa a «El tiempo de vuelo sale de lo que avanzó de lado, porque de lado la
rapidez no cambia; lo que cae en ese tiempo es la altura.» «Sumar»/«Comprobación: … Sí cuadra.» pasa a «Para comprobar:
… justo lo que dice el enunciado.» Mira: «Se parte en dos. Las flechas van en m/s, no en metros.» pasa a «La rapidez de
salida se parte en dos componentes; las flechas miden velocidad, en m/s, no distancia.»

**6. Lee en ráfaga.** Oraciones de 4 a 9 palabras unidas con punto («Es un tiro horizontal.», «Vas a elegir con qué
rapidez sale la piedra.») se integraron con su enlace; la tarjeta 2 de A5 tenía una oración sin verbo («Con las dos,
dónde está a cada instante.»).

**7. Glosario y laboratorio.** Tres `simple` con ejemplo o más claros (tiro parabólico, tiempo de vuelo, alcance), una
invitación del laboratorio sin «mira la parte».

## Lo que no cambió

- Las lecturas en vivo (tope 12; la de A2 empieza con «Misión (2 s)», que lee una prueba) y los Datos de los
  ejercicios (son leyendas de fórmula).
- Los enunciados de los ejercicios: las pruebas los leen con expresiones regulares para recalcular.
- En la práctica, los subíndices siguen como «v_0y» y «v_y» dentro de las fichas de color: es la notación del formato
  «predicciones», que la app muestra con subíndice (cabecera del generador). En la teoría no hay ningún «_» crudo.

## Prueba de la práctica

`plantillas/fis-parabolico/generador.test.js` exigía que cada explicación empezara con «Bien». Quité solo esa línea (y
el «empieza por lo bien hecho» del título de la prueba); siguen las demás exigencias: código, respaldo, fuente, que
muestre su valor, que no nombre una letra y el tope de 40 palabras.

## Para el auditor

1. **Regla 2 decía algo falso:** «Juntas arman la velocidad: su rapidez sale con Pitágoras y es tangente a la
   trayectoria». Tangente es la velocidad, no la rapidez. Ahora: «Juntas arman la velocidad, tangente a la trayectoria,
   y como forman un ángulo recto, la rapidez sale con Pitágoras».
2. **A4 «Ahora tú», tipo complementario, distractor «mitad» (b/2):** decía «a la mitad cae más cerca», que es falso
   para b = 75° (a 37,5° cae más lejos que a 75°). Ahora dice que la mitad no completa 90° y cae en otro sitio. Los
   números no cambiaron. Lo mismo con «doble» («sube más y avanza menos»): con 15° y 30°, el doble cae más lejos.
3. **A3 «Ahora tú», vuelo-avance, «subida» (tv/2):** la explicación decía «Bien el camino», pero ese valor no sale del
   camino de la pregunta (lo avanzado entre la velocidad de lado). Ahora solo dice que es el tiempo de subida.
4. `ecuaciones-ancho.js`: 57 renglones partidos tras «=», «+» o «·», todos de Datos y ecuaciones que no se tocaron (la
   versión de antes da los mismos 57; uno nuevo que salió de mi texto en el ejemplo 3.12 se arregló).
5. `contenido/teoria/teoria.test.js` falla en «glosario … archivos de la app al día» porque cambié tres `simple` del
   glosario: hace falta `npm run catalogo` al integrar (no lo corrí, por la convivencia).

## Comprobación

- `contenido/teoria/fisica/movimiento-parabolico-y-circular.test.js` (incluye el validador con `calidad: 2` simulada):
  39 en verde.
- `plantillas/fis-parabolico/*.test.js`: 33 en verde. `papel-generador.js --revisar`: al día.
- `contenido/teoria/teoria.test.js`: 163 en verde, 1 falla (la del glosario, punto 5).
- `ecuaciones-ancho.js fisica.movimiento-parabolico-y-circular` (puerto 4245): 56 pantallas, 0 que no caben, 57
  partidas, igual que antes.

## Verificación (26 nov)

Verificador de cierre de la pasada. Resolví las tres notas, rehice la cuenta de los `siFuera` de las cinco ideas en 200
semillas y de las 69 explicaciones de `fis-parabolico` en 1500 semillas, y comparé con HEAD: las 3557 ecuaciones son
idénticas y ningún número, opción ni color cambió.

- **Nota 1 (regla 2): confirmado.** Tangente a la trayectoria es la velocidad; la rapidez es un número. La regla dice
  ahora «Juntas arman la velocidad, tangente a la trayectoria, y como forman un ángulo recto, la rapidez sale con
  Pitágoras», que es correcto.
- **Nota 2 (A4, «mitad» y «doble»): confirmado en todas las semillas.** Lo que dicen ahora («no completa 90° con el de
  antes, y cae en otro sitio») es cierto siempre que la opción se muestra: cuando la mitad o el doble sí completan 90°
  (60° → 30°, 30° → 60°), su valor coincide con la correcta y se descarta. La versión de HEAD fallaba en las 85
  apariciones.
- **Nota 3 (A3, «subida»): confirmado.** Vale la mitad del vuelo y su explicación ya no elogia un camino que no da ese
  valor.

Las tres quedan fijadas en `movimiento-parabolico-y-circular.test.js` («mitad» y «doble» con el alcance recalculado, y la
tangente y «subida»), pruebas que fallan con HEAD.

Corregido en la práctica, con prueba (`fis-parabolico/generador.test.js`, «ninguna explicación dice que un valor en
segundos «es la velocidad»»): «8 s es la velocidad hacia abajo que hace falta, y está bien, pero es una velocidad» se
contradecía. Ahora: «La velocidad hacia abajo que hace falta está bien, pero ese número está en m/s y no en segundos, así
que 8 s no es el instante…».

Decidido por la sesión, Gerson revisa después: las 57 líneas partidas a 390 px (nota 4) se quedan; son anteriores a la
pasada.

Comprobaciones: prueba de la unidad 41 de 41; `fis-parabolico` 34 de 34 (`papel-generador --revisar`: al día),
`tiro-parabolico` 70 y `cinematica-medias` 33, en verde; validador con `calidad: 2` en 200 semillas: 0; regla del papel:
0; `contenido/teoria/teoria.test.js`: 163 de 164 (la del glosario de la app, por los `simple` que cambió el redactor;
hace falta `npm run catalogo`).
