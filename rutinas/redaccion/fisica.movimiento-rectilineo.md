# Redacción: fisica.movimiento-rectilineo

26 nov 2026. Pasada aparte sobre una unidad ya cerrada (`calidad: 2`), con `docs/metodo/unidad/redaccion-delegada.md`
(versión con «Explica, no solo pules» y los topes nuevos) y el criterio de `escribidor-escribano`. Solo texto: ningún
número, respuesta, distractor, dato, ecuación ni dibujo cambió. La marca `calidad: 2` se queda y el validador sigue en
cero.

Archivos: `contenido/teoria/fisica/movimiento-rectilineo.js` y la práctica que es solo de esta unidad,
`plantillas/fis-mru/generador.js` (con su prueba y su `papel.json`, regenerado con `herramientas/papel-generador.js
fis-mru`). Las plantillas compartidas de la ficha (`mruv`, `cinematica-medias`, `velocidad-relativa`) no se tocaron.

## Qué cambió, por tipo de problema

**1. Reglas que enunciaban sin explicar.** Las cinco dicen ahora qué es cada término, por qué vale y, donde cabe, un
caso concreto (tope 60). Se conservan las frases que leen las pruebas («La academia escribe x = x₀ ± v · t», «De
frente, v de B es negativa», «No es el promedio de las rapideces, salvo que…», «Río arriba, u es negativa»…).

> Regla 1, antes: «En el MRU, la posición cambia igual cada segundo; el signo de v da el sentido. La academia escribe
> x = x₀ ± v · t: igual, con el signo fuera de v.»
> Después: «En el MRU la velocidad no cambia, así que la combi se mueve lo mismo en cada segundo: en t segundos,
> v · t. Eso se suma a la marca de salida, x₀. Si va hacia el lado −, v es negativa y la posición baja. La academia
> escribe x = x₀ ± v · t: es igual, con el signo fuera de v.»

> Regla 3, antes: «Velocidad media: desplazamiento entre tiempo. Rapidez media: distancia recorrida entre tiempo. No
> es el promedio de las rapideces, salvo que los tramos duren lo mismo.»
> Después: «La velocidad media es el desplazamiento entre el tiempo: solo mira dónde empezaste y dónde terminaste. La
> rapidez media es todo el camino entre el tiempo; si vuelves a la partida, la primera es 0 y la segunda no. No es el
> promedio de las rapideces, salvo que los tramos duren lo mismo: el que dura más pesa más.»

**2. «Vale si» con el marco roto o sin decir qué pasa si no se cumple.** Las cinco condiciones continúan «Vale si» y
dicen qué pasa fuera de ella. Antes, la de la idea 4 empezaba con un rótulo («Vale si tₑ: instante del encuentro…») y
la de la idea 5 era taquigrafía («Vale si una misma recta, cada v con su signo…»).

> Condición 4, después: «Vale si los dos van en MRU y, si uno sale antes, D se mide cuando sale el otro; si la
> velocidad de A menos la de B no es positiva, D no se cierra y no hay encuentro (tₑ: instante del encuentro; D:
> separación al empezar).»

**3. Explicaciones de alternativas (`siFuera` de Predice y de «Ahora tú») en molde «Bien X. Pero Y.»**, con la
primera parte sin verbo. Ahora nombran el razonamiento equivocado, dicen por qué falla y qué había que mirar.

> Predice 3, antes: «(2 + 6) ÷ 2 serviría si los dos tramos duraran lo mismo. La ida dura más.»
> Después: «El promedio (2 + 6) ÷ 2 trata los dos tramos como si duraran lo mismo, pero a 2 m/s la ida tarda el triple
> que la vuelta, así que pesa más en la media.»

> «Ahora tú» 1, antes: «Bien que multipliques v por t. Pero va hacia la derecha: la posición sube.»
> Después: «Multiplicaste bien v por t, pero la combi va hacia la derecha, así que su posición sube y lo que avanzó se
> suma.»

**4. Pasos de Mira, de «Así se resuelve» y de los ejemplos en rótulo** («La pendiente:», «Todo a metros y segundos.»,
«Primer tramo, desde el paradero:», «Comprobación: … Coinciden.»). Ahora dicen qué se hace y por qué.

> Ejemplo de A2, antes: «Desde los 2 s hasta los 0 s se retroceden 2 s de recta: 10 m menos.»
> Después: «Para ir de los 2 s a los 0 s, se retroceden 2 s de recta, y la posición baja 10 m.»

> Mira de A4, antes: «La alcanza donde las rectas se cruzan: misma x, mismo t.» (además, «la» por el mototaxi)
> Después: «La combi lo alcanza donde las rectas se cruzan: los dos tienen la misma x en el mismo t.»

**5. Lee, misiones y `aprendizaje`.** Arreglos de enlace («x₀ (se lee «equis sub cero») es la marca donde…»,
«Mientras juegas, mira…»). El `aprendizaje` de la idea 5 traía «v_B/A = v_B − v_A» con guion bajo crudo; ahora va en
palabras.

**6. Práctica (`fis-mru`).** Las 198 explicaciones seguían el molde «Bien X. Pero Y.»; ahora son una oración completa
(«La salida y la velocidad están bien, pero en t = 0 todavía no avanzó…», «Está bien que multipliques…, pero…», «Es
cierto que avanza…, pero…»). El cambio se hizo con un script y se revisó una por una; 19 se reescribieron a mano
(compuestos, ternarios, «Restar los dos viajes para que se vaya lo que rema el bote…»). Las soluciones escritas que
eran rótulos («Pendiente: v = …», «Camino: …», «Tiempos: …», «Este +: A +2…») dicen ahora qué se calcula y por qué.
La prueba `generador.test.js` exigía que cada explicación empezara con «Bien»: **se quitó solo esa exigencia** (se
mantienen la de mostrar el valor, no nombrar letras y el tope de 40 palabras).

## Para el auditor

1. Textos fijados por pruebas que no se pudieron soltar: la condición de A5 debe contener «cada v con su signo (+ río
   abajo); u se mide desde el agua y c, desde la orilla» (taquigrafía, ejemplo del propio skill); la de A4, «tₑ:
   instante del encuentro; D: separación al empezar» (quedó entre paréntesis al final); y el paso de cuentas de
   «Así se resuelve» de A5 se compara letra por letra («Río abajo: 48 ÷ 6 = 8 m/s. Río arriba, hacia el lado −: …»).
   Si se quieren en prosa, hay que cambiar esas pruebas.
2. Errores de concordancia corregidos: «La alcanza» por el mototaxi en Mira de A4 y en una solución de la práctica.
3. No se tocó el glosario (cambiarlo exige `npm run catalogo`, fuera del encargo). Sus `ejemplos` siguen en rótulo
   («Avanzar 100 m en 20 s: 5 m/s.») y los `simple` no traen un ejemplo de la vida; queda para una pasada con catálogo.
4. `herramientas/ecuaciones-ancho.js`: 28 avisos «partida después de =», los mismos 28 con el archivo original (se
   corrió sobre las dos versiones). Son de ecuaciones y datos que esta pasada no toca.
5. `contenido/teoria/teoria.test.js`: una falla, «app/datos/glosario/fisica.json no está al día», que viene de otras
   unidades de física editadas a la vez (el glosario de esta unidad está idéntico al original). Se arregla con
   `npm run catalogo` al integrar.
6. No vi cuentas ni afirmaciones falsas. Comprobé de nuevo las que se citan en textos nuevos: 30 s contra 10 s en la
   predicción de A3 (el triple), 1 m/s más rápido que 1 km/h, la media que queda entre la menor y la mayor rapidez.

## Comprobación

- `contenido/teoria/fisica/movimiento-rectilineo.test.js` (incluye el validador común con `calidad: 2`): 35 en verde.
- `plantillas/fis-mru/*.test.js`: 39 en verde. `papel-generador.js --revisar`: al día.
- `contenido/teoria/teoria.test.js`: 1 falla ajena (punto 5 de arriba).
- `ecuaciones-ancho.js fisica.movimiento-rectilineo` (servidor propio en el puerto 4243, ya cerrado): ver punto 4.

## Verificación (26 nov)

Verificador de cierre de la pasada. Hice lo que el redactor dejó (los tres textos fijados en pruebas y el glosario), rehice
la cuenta de los `siFuera` de las cinco ideas en 200 semillas y de las 216 explicaciones distintas de `fis-mru` en 600
semillas, y comparé con HEAD: las 2839 ecuaciones son idénticas y ningún número, opción ni color cambió.

- **Textos fijados en pruebas, ahora en prosa** (las pruebas siguen comprobando lo mismo y fallan con el texto anterior):
  la condición de A4 define D y tₑ en la frase («…y D, la separación al empezar, se mide cuando ya se mueven los dos. Si la
  velocidad de A menos la de B no es positiva, D nunca se cierra y no hay instante de encuentro, tₑ.»); la de A5 deja la
  taquigrafía («…y cada velocidad lleva su signo, + río abajo; u se mide desde el agua, y c, desde la orilla.»); y el paso
  de cuentas de A5 dice qué se divide y por qué sale negativo («Río abajo, el bote avanza 48 m en 6 s: 48 ÷ 6 = 8 m/s. Río
  arriba va hacia el lado −, así que su velocidad es negativa: −48 ÷ 8 = −6 m/s.»).
- **Glosario reescrito.** Los `simple` traen un ejemplo de la vida dentro del tope de 14 palabras («Dónde estás, contado
  desde un punto fijo: «a 60 m del paradero».», «…lo que marca el velocímetro», «…como un tren a velocidad fija») y los
  `ejemplos` en rótulo pasan a oraciones («Si avanzas 100 m en 20 s, tu velocidad media es 5 m/s.»). No cambió ningún
  término ni definición.
- **Práctica (`fis-mru`), corregido con prueba** («redacción: el valor del error va con lo que hizo el alumno…», falla en
  135 explicaciones de la versión anterior): en trece plantillas el valor del error iba tras la cuenta correcta y se leía
  como si esa cuenta lo diera («…pero el tiempo es el de los dos tramos, 50 s; así salen 13,5 m/s»; «…la velocidad es
  12 ÷ 3 = 4 m/s, no 12; con eso queda x = 34 m»). Ahora el valor va con lo que hizo el alumno («…pero dividirlo solo entre
  el tiempo del primer tramo da 13,5 m/s; el tiempo es el de los dos tramos, 50 s»). Y «desde ahí la ves con 14 − 4»
  decía que desde la pista se ve la velocidad relativa: ahora «desde tu combi lo ves pasar a 14 − 4 m/s».

Para Gerson (decidido por la sesión): el molde «…; así salen X» sigue en otras explicaciones de la práctica donde la frase
de antes ya nombra el error («se reemplaza t = 4, no 5: así queda…»); ahí se lee bien y se queda.

Comprobaciones: prueba de la unidad 35 de 35; `fis-mru` 40 de 40 (`papel-generador --revisar`: al día), `mruv` 51,
`cinematica-medias` 33 y `velocidad-relativa` 32, en verde; validador con `calidad: 2` en 200 semillas: 0; regla del
papel: 0 (la excepción de `cinematica-medias`, compartida, sigue como estaba); `contenido/teoria/teoria.test.js`: 163 de
164 (la del glosario de la app: ahora también por este glosario; hace falta `npm run catalogo`).
