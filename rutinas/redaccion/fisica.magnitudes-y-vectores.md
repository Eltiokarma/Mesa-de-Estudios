# Redacción: fisica.magnitudes-y-vectores

26 nov 2026. Pasada aparte sobre una unidad ya cerrada (`calidad: 2`), con `docs/metodo/unidad/redaccion-delegada.md`
(incluido el cambio del mismo día: explicar, no solo pulir) y el criterio de `escribidor-escribano`. Solo texto: ningún
número, respuesta, distractor, dato, ecuación ni dibujo cambió. La marca `calidad: 2` se queda y el validador sigue en
cero.

Archivos: `contenido/teoria/fisica/magnitudes-y-vectores.js` y la práctica de su ficha, que es solo de esta unidad:
`plantillas/conversion-unidades/` y `plantillas/areas-volumenes/` (generador, prueba y `papel.json` regenerado con
`herramientas/papel-generador.js`) y `plantillas/analisis-dimensional/` (generador y `papel.json`, que está escrito a
mano).

## Qué cambió, por tipo de problema

**1. Reglas que decían qué hacer sin decir qué es ni por qué.** Las tres reglas dicen ahora qué es el término nuevo (el
factor de conversión, la dimensión), por qué vale lo que dicen y un caso. En la idea 3, la regla también dice cómo se
lee el recuadro: «[d]» es «la dimensión de d».

> Regla 1, antes: «Cambiar de unidad no cambia lo medido: el poste es el mismo y la combi va igual de rápido. Cambia el
> número: se multiplica por factores que valen 1.»
> Después: «Cambiar de unidad no cambia lo medido: el poste es el mismo y la combi va igual de rápido; solo cambia el
> número. Un factor de conversión es una fracción con la misma cantidad arriba y abajo, como 1000 m sobre 1 km, así que
> vale 1. Multiplicar por 1 no cambia lo medido, y la unidad vieja se tacha.»

> Regla 3, antes: «Los dos lados de una fórmula de física tienen la misma dimensión, y en una suma, cada término también.
> Las dimensiones se multiplican y se dividen como letras.»
> Después: «La dimensión dice de qué está hecha una magnitud: longitud L, masa M o tiempo T. Los dos lados de una fórmula
> tienen la misma dimensión, porque no se igualan metros con segundos, y en una suma, cada término también. En el
> recuadro, [d] se lee «la dimensión de d»: d, v · t y ½ a · t² son longitudes.»

**2. «Vale si» sin consecuencia, o con una advertencia pegada.** Las tres condiciones continúan «Vale si» y dicen qué
pasa si no se cumplen. La de la idea 3 era una condición seguida de «Ojo: …»; ahora el aviso es la consecuencia.

> Condición 2, antes: «Vale si se cambia de unidad dentro de una misma magnitud: un área no se pasa a volumen, ni un
> largo a área.»
> Después: «Vale si se cambia de unidad dentro de una misma magnitud, un área a otra área o un volumen a otro volumen. Un
> largo no se pasa a área: 2 m no son 4 m², porque falta saber el ancho.»

**3. Explicaciones de alternativas que nombraban la cuenta y no el razonamiento.** Los `siFuera` de Predice y de
«Ahora tú» (unos 45) dicen ahora qué pensó el alumno («como si el centímetro fuera más grande que el metro»), por qué
falla y qué debió mirar.

> «Ahora tú» 1, antes: «Dividir achica el número; el centímetro es más chico, el número sube.»
> Después: «Dividir achica el número, como si el centímetro fuera más grande que el metro; es más chico, así que en el
> largo caben muchos y el número sube.»

> Predice 1, antes: «Esos son los metros de un minuto. Una hora tiene 3600 segundos.»
> Después: «Dividiste entre 60, como si una hora tuviera 60 segundos, y esos son los metros de un minuto. Una hora tiene
> 60 minutos de 60 segundos: 3600 s.»

**4. Pasos y soluciones en telegrama.** En los 45 ejemplos, en «Así se resuelve» y en las soluciones de «Ahora tú», los
rótulos («Factor con g arriba y kg abajo.», «El auto: los km a metros…», «Error típico: …», «Ojo: …») pasan a oraciones
que dicen qué se hace y por qué, y las soluciones de «Ahora tú» dicen qué significa el resultado.

> Ejemplo 2 de la idea 1, antes: «Factor con g arriba y kg abajo.»
> Después: «Se multiplica por el factor que tiene g arriba y kg abajo, y los kilogramos se tachan.»

> Solución de «Ahora tú» (m/s a km/h), antes: «Por 3600 y entre 1000: es multiplicar por 3,6.»
> Después: «Multiplicar por 3600 y dividir entre 1000 es lo mismo que multiplicar por 3,6. El número sube porque en una
> hora se avanza mucho más que en un segundo.»

**5. Lee, Mira, misiones y glosario.** Tarjetas en ráfaga unidas («…se llama magnitud, y el número que sale depende…»);
pasos de Mira sin verbo o en jerga («Algo entre algo igual da 1» pasa a «Una cantidad dividida entre otra igual a ella
da 1»); la consigna sin verbo de la idea 2; «Una pastilla pesa menos de un gramo» (masa por peso) pasa a «tenga menos de
un gramo de medicina». En el glosario, «arriba y abajo dice lo mismo» pasa a «dicen» y el ejemplo de m² a cm² se dice
entero.

**6. Práctica.** Las pruebas de `conversion-unidades` y `areas-volumenes` exigían que cada explicación empezara con
«Bien»; **quité solo esa exigencia** (la prueba sigue comprobando que cada error es hipótesis), porque producía
telegramas («Bien el 60, pero al revés: …», «Bien: son 105 min. Pero…»). Las unas 180 explicaciones de esos dos
generadores dicen ahora, en una oración, qué estuvo bien y qué cambiar («Usaste el 60, pero al revés: 15 ÷ 60 = 0,25 son
horas, y como el segundo es más chico que el minuto, el número tiene que subir.»). En `analisis-dimensional`, la
explicación que usaba «[Q] = Π[dato]^exp» se dice en palabras, y los rótulos de la solución («Homogeneidad:», «Primer
término:», «Resolviendo:») pasan a oraciones; en su papel, cuatro pasos en telegrama.

## Para el auditor

- `ecuaciones-ancho.js` (servidor propio en el puerto 4241): 16 ecuaciones de los ejemplos se parten después de «=» a
  390 px (idea 1: ejemplos 6, 7, 8, 12, 13, 14 y 15; idea 2: ejemplos 6, 9, 10, 11, 13 y 14, y Mira paso 6; idea 3:
  ejemplos 11 y 13). Son las ecuaciones de siempre, que no toqué.
- `herramientas/papel-reglas.js`: los 7 problemas del papel de `analisis-dimensional` (escrito a mano) salen
  `pendiente [papel-datos]`: dan sus datos con «Usa …» dentro del enunciado y no en `datos`. Ya estaba así.
- Notación en la práctica de `analisis-dimensional`: el texto muestra el acento circunflejo crudo («v = k·P^x·ρ^y»,
  «e^( )»), en el generador y en su papel. El lector de la práctica no tiene nodo de exponente; no lo cambié.
- Ese generador pinta un factor con el verde (`c-d`), que la cabecera de la teoría deja fuera de la unidad por
  protanopía. No es texto; queda anotado.
- `app/datos/glosario/fisica.json` quedó desfasado por el cambio del glosario: hace falta `npm run catalogo` al
  integrar (no lo corrí, por la convivencia).

## Pruebas

- `contenido/teoria/fisica/magnitudes-y-vectores.test.js`: 6 de 6.
- `contenido/teoria/teoria.test.js`, la de esta unidad (validador con `calidad: 2`): en verde. La del glosario falla
  hasta que se corra `npm run catalogo`; las de `movimiento-parabolico-y-circular` y `vectores` son de otros redactores.
- Práctica: `conversion-unidades` 29 de 29, `areas-volumenes` 30 de 30, `analisis-dimensional` 22 de 22;
  `papel-generador.js --revisar` sin pendientes de estas tres.

## Verificación (26 nov)

Verificador de cierre de la pasada. Resolví las cuatro notas, rehice la cuenta de las explicaciones de alternativas con
sentido nuevo (los `siFuera` de Predice y de «Ahora tú» de las tres ideas en 200 semillas, y unas 180 explicaciones de
`conversion-unidades` y `areas-volumenes`) y comparé con HEAD: las 2111 ecuaciones de la teoría (200 semillas de «Ahora
tú» y «Así se resuelve») son idénticas, ningún número, opción ni color de la teoría cambió, y en la práctica las
alternativas, sus valores y sus códigos son los mismos en 400 semillas por generador.

Lo corregido, cada cosa con una prueba que falla con la versión anterior
(`plantillas/analisis-dimensional/generador.test.js`, «redacción: sin «^» crudo, sin verde y el papel con sus datos en
`datos`»):

- **Papel de `analisis-dimensional` (regla papel-datos).** Los 7 problemas pasan sus datos («Usa [v] = LT⁻¹…», «Ojo: T es
  el periodo…») del enunciado a `datos`, una línea por dato con su unidad; p4, que no traía ninguno, recibe [y] = L y
  [t] = T. No se dio nada que se juzgue (la dimensión pedida ni «el seno no tiene dimensión»). Se borró su excepción de
  `herramientas/papel-reglas.js`: la regla del papel ya no tiene pendientes de esta unidad.
- **«P^x» crudo.** La práctica no tiene nodo de exponente, así que las letras van en superíndice Unicode: v = k·Pˣ·ρʸ (en
  el generador y en p1 y p2 del papel). «e^(−B·x)» pasa a «exp(−B·x)», con una línea en los datos: «exp(u) es el número e
  elevado a u».
- **El verde (c-d).** Ninguna variable del generador va en verde: en los exponentes, el segundo factor va en tinta como el
  tercero; en las constantes, el miembro izquierdo va en tinta.

Decidido por la sesión, Gerson revisa después:

- Las 16 ecuaciones de los ejemplos que se parten después de «=» a 390 px se quedan: son anteriores a la pasada y de
  maquetación, no de texto.

Comprobaciones: prueba de la unidad 6 de 6; práctica `conversion-unidades` 29 de 29, `areas-volumenes` 30 de 30,
`analisis-dimensional` 23 de 23 (`papel-generador --revisar`: al día); validador con `calidad: 2` en 200 semillas: 0
hallazgos; regla del papel: 0 faltas y sin excepción; `contenido/teoria/teoria.test.js`: 163 de 164, la que falla es
«glosario: … archivos de la app al día» (`app/datos/glosario/fisica.json` sin regenerar; hace falta `npm run catalogo` al
integrar).
