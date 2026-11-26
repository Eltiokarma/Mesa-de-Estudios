# Redacción · quimica.tabla-periodica · 26 nov 2026

Pasada del redactor (`docs/metodo/unidad/redaccion-delegada.md`, criterio `escribidor-escribano`) sobre una unidad ya
cerrada (`calidad: 2`). Solo texto: ningún número, respuesta, distractor, dato, dibujo, color ni letra cambió. La marca
`calidad: 2` se queda.

Archivos: `contenido/teoria/quimica/tabla-periodica.js` y la práctica propia de la unidad,
`plantillas/tabla-ubicacion/generador.js` (con su `papel.json` regenerado con `herramientas/papel-generador.js`: mismos
8 problemas, solo cambian los pasos). Las otras plantillas de la ficha (`configuracion-ubicacion`, `quimica-conceptos`,
`atomo-y-tabla`) son compartidas con otras unidades y no se tocaron.

## Qué cambió, por tipo de problema

**1. Telegrama con rótulo y dos puntos (lo más repetido, unos 60 casos).** Soluciones, pasos de «Mira» y pasos de
ejemplos que encadenaban rótulos («Nivel más alto, el 4. Termina en d: sumo.», «Mayor n: 5. Grupo: …») pasan a oraciones
con sujeto y verbo, con la consecuencia dicha («así que», «como…»).

- Antes: «Nivel más alto, el 4. Termina en d: sumo.» (ejemplo «Un metal de Z = 27»)
  Después: «El nivel más alto es el 4, y como termina en d, sumo los s y los d.»
- Antes: «Mayor n: 5. Grupo: 1 + 10 = 11 (IB) (el mismo que da la suma sin el cambio).» (práctica, `anomalo`, y papel p1)
  Después: «El mayor n es 5, y ese es el periodo. El grupo suma los s y los d: 1 + 10 = 11 (IB), lo mismo que daría la
  suma sin el cambio.»
- Antes: «Están en la misma fila: manda la columna.» → Después: «Como están en la misma fila, lo que decide es la columna.»

**2. Regla de cada idea dicha como lista de rótulos.** Las cuatro reglas pasan de «Bloque: el subnivel del último
electrón (s, p, d o f). En el bloque d, el periodo es el mayor n; el grupo suma ns y (n − 1)d.» a «El bloque es el
subnivel (s, p, d o f) donde cae el último electrón. En el bloque d, el periodo es el nivel más alto, n, y el grupo suma
los electrones del ns y los del (n − 1)d.». La de la idea 1 deja de abrir con «Ley periódica:» y dice la ley como
oración condicional. La condición de la idea 3 se leía «Vale si el elemento termina en d. Con el Cr…» (dos oraciones
detrás del marco); ahora es una sola: «Vale si el elemento termina en d y, si es una de las excepciones (Cr, Cu, Ag o
Au), se suman los electrones de su configuración real.»

**3. `siFuera` del molde «Bien X. Pero Y.» sin el porqué.** Se completan los que solo señalaban el error («Bien el
lado. Pero está a 2 lugares…», «Bien dudar. Pero su lugar en la tabla ya lo dice.», «…10 menos.») con lo que el alumno
tiene que cambiar, dentro de las 30 palabras. Ejemplo: «Ese es su grupo, bien hallado. Pero los puntos son los
electrones del nivel 3: 10 menos.» → «…, que son 10 menos que el número del grupo.»

**4. Textos generados que salían cojos en algunas semillas.**
- Verdadero o falso (ideas 1, 3 y 4): la solución pegaba el porqué de una afirmación sin decir cuál era («I V, II F, III
  F. Los pierden y quedan como cationes.»). Ahora: «… La II es falsa: los metales pierden electrones y quedan como
  cationes.». Se arreglaron tres porqués del banco que dependían de un pronombre o traían dos dos puntos.
- Listas sin «y» («los de Z = 2, 10, 18») → «los de Z = 2, 10 y 18».
- «con 1 electrones» (práctica, `z-lugar`, papel p6) → «con 1 electrón».
- «Está a 2 lugares antes de…» → «Está 2 lugares antes de…».

**5. Sujeto que no cuadra y marcos poco claros en «Lee» y consignas.** «Puestos en una sola tira, las marcas…» (el
participio no era de las marcas) → «En una sola tira, las marcas ●, ▲ y ■ aparecen salteadas.». «De Estructura atómica:
los electrones…» → «En Estructura atómica viste que…». Consignas sin verbo («Los grupos 3 a 12, abiertos. Recorre…»,
«Cada elemento, con su configuración abajo.») ahora tienen verbo.

**6. Glosario.** «Está a la izquierda.» (¿de qué?) → «Ocupa la izquierda de la tabla.»; igual en «no metal». «Qué tan
fácil pierde electrones» → «Con qué facilidad pierde electrones». La definición de «ley periódica» se dejó igual: una
versión más clara («repiten sus propiedades…») adelantaba la Predice de la idea 1.

## Lo que no cambió a propósito
- Preguntas de «Ahora tú» y lecturas en vivo cuyo texto lee la prueba de la unidad (formas «¿En qué periodo y en qué
  grupo…», «queda el…», «justo encima, está el…»).
- Nada antes de la Predice de la idea 1 dice «parecido», «misma columna» ni nombra al rubidio (la prueba lo vigila).
- Los distractores, las alternativas y las respuestas de los ejemplos.

## Para el auditor
1. **Regla de la idea 4:** dice que los no metales «no conducen», mientras `DM.clases` dice «casi no conduce» y la
   misma unidad trata el grafito como no metal que conduce. Se dejó como estaba; «casi no conducen» sería más fiel.
2. **Tarjeta «Qué mirar» de la idea 1:** para caber en 45 palabras salió «sobre la última columna» (del helio). La
   figura lo muestra; si se quiere de vuelta, hay que partir la tarjeta.
3. **Ecuación de la regla de la idea 4:** `ecuaciones-ancho.js` marcaba un corte dentro de «(no metal)». Lo único que
   se tocó en una ecuación es un espacio duro entre «no» y «metal» (U+00A0); el contenido es el mismo.
4. Ejemplo «Dos líquidos» y el banco de V/F: «el mercurio es el único metal líquido a temperatura ambiente». Es la
   convención escolar; el cesio y el galio funden cerca de 29 °C. No se cambió.

## Comprobaciones
- `node --test contenido/teoria/quimica/tabla-periodica.test.js`: 22 de 22 (incluida la simulación de `calidad: 2`).
- `node --test plantillas/tabla-ubicacion/generador.test.js`: 9 de 9.
- `contenido/teoria/teoria.test.js`: la prueba de esta unidad pasa. Fallan las de `materia-y-energia`,
  `propiedades-periodicas` y la del glosario (`app/datos/glosario/*.json` desfasados en siete cursos por cambios de
  otras sesiones; en química, también por las definiciones de esta pasada). Se arregla con `npm run catalogo` al
  integrar; no se corrió aquí porque reescribe archivos compartidos.
- Regla del papel con `calidad: 2` simulada: sin fallas en las plantillas de la ficha.
- `node herramientas/ecuaciones-ancho.js quimica.tabla-periodica`: en la primera corrida (44 pantallas, completa) salió un solo hallazgo, el corte en «(no metal)» del punto 3. Después del espacio duro salieron 0 hallazgos en 34 pantallas, con la regla de la idea 4 revisada. Esa segunda corrida no quedó completa: con el servidor cargado, no abrieron «Mira» y la regla de la idea 1 ni «Así se resuelve» de la idea 3. Esas tres pantallas sí entraron en la primera corrida, sin hallazgos, y sus ecuaciones no cambiaron después. Conviene repetirla con el servidor libre.

## Verificación (26 nov)

Verificador de cierre. Se rehicieron las cuentas de los `siFuera` que esta pasada completó con sentido nuevo (familias
desde el gas noble, periodos y largos, Lewis, grupos A y B, excepciones, carácter metálico) y de las explicaciones de
`tabla-ubicacion`: cuadran. En Lewis, «10 menos que el número del grupo» solo sale en los grupos 13 a 17 (se comprobó en
2000 semillas de la práctica; en los grupos 1 y 2 esa alternativa coincide con la correcta y no sale).

**Error corregido (con prueba que falla con la versión del redactor):**
- **Regla de la idea 4:** «Los no metales … no conducen» → «casi no conducen», como `DM.clases` y la excepción del grafito
  que la misma unidad enseña. Prueba nueva en `tabla-periodica.test.js`.

**Notas confirmadas o decididas:**
- Tarjeta «Qué mirar» de la idea 1: ya no dice «sobre la última columna»; dice «el helio queda siempre en la punta
  derecha». Nada que hacer.
- Espacio duro en «(no metal)» de la ecuación de la regla 4: correcto. `ecuaciones-ancho` repetido con servidor propio:
  «todo cabe» en la unidad, con todas sus pantallas (la corrida que el redactor dejó incompleta).
- «El mercurio es el único metal líquido a temperatura ambiente»: se deja; a 25 °C es cierto (el cesio funde a 28,5 °C
  y el galio a 29,8 °C). Decidido por la sesión, Gerson revisa después si quiere «a 25 °C».

**Comprobación:** `tabla-periodica.test.js` 23/23; `tabla-ubicacion` 9/9; validador con `calidad: 2` en 200 semillas:
0; `papel-reglas.js`: nada de estas plantillas. `teoria.test.js` (última corrida): 163 de 164; la unidad pasa, y la única falla es `quimica/mol-y-composicion.js`, otra unidad en obra. La prueba del glosario, que en una corrida anterior fallaba por `app/datos/glosario/*.json` desfasado, ya pasa.