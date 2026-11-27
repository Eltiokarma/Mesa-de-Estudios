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
## Segunda pasada: explica (27 nov)

Encargo: `docs/metodo/unidad/redaccion-delegada.md`, punto 4 («Explica, no solo pules») y topes nuevos del punto 6;
criterio `escribidor-escribano`. Gerson vio la unidad en la app y la encontró corta y sin mucho significado. Esta pasada
agrega el porqué, un caso conocido y lo que pasa si no se cumple. Solo texto: ningún número, respuesta, distractor,
dibujo, color ni letra cambió, y la marca `calidad: 2` se queda.

Archivos: `contenido/teoria/quimica/tabla-periodica.js`, `plantillas/tabla-ubicacion/generador.js` y su `papel.json`
(regenerado con `herramientas/papel-generador.js`: los mismos 8 problemas, solo cambian los pasos).

### Qué cambió, por tipo de texto

- **Reglas (4) y «Vale si» (4).** Cada regla dice ahora por qué vale lo que dice («porque cada fila empieza a llenar un
  nivel nuevo») y trae un caso que el alumno reconoce (el sodio y el potasio, el cloro con 3s² 3p⁵, el hierro con 4s² 3d⁶).
  Cada condición dice además qué pasa cuando no se cumple: por masa, el argón caería entre dos metales; si termina en d,
  el grupo se cuenta de otro modo; al calentarse, un semimetal conduce más.
- **`siFuera` de Predice (12) y de «Ahora tú» (unos 45 moldes en las cuatro ideas).** El molde «Bien X. Pero Y.» pasa a
  una sola oración con «pero», que nombra el razonamiento equivocado y lo explica con un caso o con su cuenta. Varios
  `siFuera` fijos ahora usan los datos del caso («El Z = 16 es menor que el del argón, 18…»).
- **Explicaciones de alternativas de los 60 ejemplos.** Las de nivel 3 dicen ahora por qué falla cada letra («…pero
  esos subniveles van por dentro», «…aunque está a su derecha en la misma fila»), no solo qué hizo.
- **Pasos de «Así se resuelve» y soluciones.** Cada paso dice por qué se hace eso («cada gas noble cierra una fila»,
  «la regla compara dentro de una fila o de una columna») y qué significa el resultado.
- **Mira (24 pasos) y Lee.** Cada paso agrega el porqué del cambio que se ve: «esa manera de portarse vuelve cada 8
  elementos», «del potasio al kriptón hay 18, porque en el medio aparecen 10 metales», «los d van por dentro».
- **Verdadero o falso (tres bancos, 30 afirmaciones).** El porqué de cada afirmación pasa de un rótulo («son los
  grupos A») a una razón con un caso («son los grupos A, los que terminan en s o en p, como el sodio o el cloro»).
- **Glosario.** Los 16 `simple` llevan ahora un ejemplo de la vida o de la tabla, dentro de las 14 palabras («Un gas que
  casi no reacciona con nada, como el helio de los globos»). El de «grupo» no dice que los de una columna se parecen,
  y el de «semimetal» no nombra al silicio, porque los dos adelantarían una predicción.
- **Práctica `tabla-ubicacion`.** Las 15 familias de explicaciones y las soluciones siguen la misma pauta.
- **Errores de lengua que salían en algunas semillas:** «El plata tiene…» → «La plata tiene…» (Así se resuelve, idea
  3); «los 1 electrón de ese nivel dicen» → «el electrón de ese nivel dice»; «tiene diez: en un subnivel d caben…» (dos
  dos puntos) → «tiene diez, porque…»; «son metales: quedan a la izquierda…» → «…quedan a la izquierda…, así que son
  metales». El `siFuera` por defecto («Bien el camino…») hablaba de gases nobles también en la idea 2, donde no hay;
  ahora es general.

### Seis ejemplos de antes y después

1. **Regla de la idea 1.**
   Antes: «Si los elementos se ordenan por Z, sus propiedades se repiten cada cierto número de lugares: es la ley
   periódica. Cada una de las 7 filas es un periodo, y cada una de las 18 columnas, un grupo o familia de elementos
   parecidos.» Vale si «los elementos se ordenan por número atómico, no por masa.»
   Después: «… es la ley periódica. Cada una de las 7 filas es un periodo y termina en un gas noble. Cada una de las 18
   columnas es un grupo o familia, y sus elementos se portan parecido, como el sodio y el potasio.» Vale si «los
   elementos se ordenan por número atómico, no por masa; por masa, el argón quedaría entre el potasio y el calcio, y un
   gas caería en la columna de los metales.»
2. **Regla de la idea 2.**
   Antes: «El periodo es el número del nivel más alto que tiene electrones. En los grupos A, los electrones de ese
   nivel, que son los de valencia, dan el número romano del grupo y los puntos del símbolo de Lewis.»
   Después: «El periodo es el número del nivel más alto que tiene electrones, porque cada fila empieza a llenar un nivel
   nuevo. En los grupos A, los electrones de ese nivel, que son los de valencia, dan el número romano del grupo y los
   puntos de Lewis: el cloro, 3s² 3p⁵, tiene 7 y está en el VIIA.»
3. **Explicación de alternativa, Predice de la idea 1** (la que elige «como el hierro, que también tiene muchos
   protones»).
   Antes: «Los dos tienen muchos protones, cierto. Pero el parecido lo da la columna, no cuántos protones hay.»
   Después: «Tener muchos protones no basta para parecerse: el kriptón, con 36, es un gas, y el hierro, con 26, un metal
   duro. Lo que se repite es el lugar en la columna, y encima del rubidio está el potasio.»
4. **Explicación de alternativa, «Ahora tú» de la idea 1** (familia del Z = 16, el que cuenta hacia el otro lado).
   Antes: «Contaste bien 2 lugares desde el gas noble. Pero el elemento va antes de él, no después, y del otro lado
   queda otra familia.»
   Después: «Contaste bien 2 lugares, pero hacia el lado equivocado. El Z = 16 es menor que el del argón, 18, así que
   va antes de él; a esa distancia, del otro lado, queda otra familia.»
5. **Paso de «Así se resuelve», idea 1** (Z = 56).
   Antes: «Está 2 lugares después del xenón, que es su gas noble más cercano.»
   Después: «Como hay 5 gases nobles antes, el elemento está en el periodo 6. Está 2 lugares después del xenón, que
   cierra la fila de arriba, así que se cuenta desde el grupo 1.»
6. **Explicaciones de alternativas de un ejemplo de examen, idea 1** («Tres vecinos», Z = 35, 36 y 37).
   Antes: «La A olvida que el periodo termina en el 36. La B confunde estar junto al mismo gas noble con ser familia.»
   Después: «La A olvida que el periodo 4 termina en el 36: el 37 ya abre otra fila. La B confunde estar junto al mismo
   gas noble con ser familia, pero X va antes del gas y R, después, en columnas opuestas.»

### Para el auditor

1. **Práctica, `anomalo`, error QM-ANOMALO-GRUPO** (Cr → grupo 7; Cu, Ag, Au → grupo 12): la explicación decía «el grupo
   suma los electrones que tiene, no los que tendría», pero sin el cambio la suma da lo mismo (la solución misma lo
   dice). La alternativa es la suma correcta más 1; ahora la explicación dice eso: «sumaste un electrón de más: el que
   pasó del s al d se cuenta una sola vez». Cambia el sentido del texto, no el número: conviene confirmar.
2. **Datos que agregó esta pasada, de memoria, por confirmar:** el argón (39,9) pesa más que el potasio (39,1), así que
   por masa iría entre el potasio y el calcio (no se escribió la cifra); el argón de los focos rodea el filamento sin
   quemarlo; «halógeno» quiere decir «que forma sal»; de cada cinco elementos, unos cuatro son metales; el cobre y la
   plata conducen muy bien la electricidad; un semimetal como el silicio conduce más al calentarse; el ancho de los
   bloques (2, 6, 10 y 14 columnas, contando el f en sus dos filas); el 3d empieza a llenarse en el escandio, el que
   sigue al calcio.
3. **Tope de `siFuera` en Predice:** `docs/teoria.md` (esquema de la línea 79) todavía dice «≤ 20», mientras
   `nucleo/teoria.js` y la tabla del §5 dicen 40. Los `siFuera` de Predice de esta unidad tienen ahora de 28 a 39
   palabras; el validador los acepta. Hay que corregir el esquema de `teoria.md`.
4. **Explicaciones de la práctica:** `herramientas/validar-ejercicios.js --auditar` mide las explicaciones contra 20
   palabras (presupuesto de `escena-viva.md`); ahora tienen de 20 a 33. No es una prueba que falle, pero el número de
   esa auditoría sube.
5. `papel-reglas.js` marca `quimica-conceptos p2 [papel-datos]`, una plantilla compartida que esta pasada no tocó.

### Comprobaciones (27 nov)

- `node --test contenido/teoria/quimica/tabla-periodica.test.js`: 23 de 23, con la simulación de `calidad: 2` (60
  semillas, glosario incluido).
- `node --test plantillas/tabla-ubicacion/generador.test.js`: 9 de 9. `papel-generador.js --revisar`: al día.
- `contenido/teoria/teoria.test.js`: 162 de 164. La unidad pasa; fallan `quimica/materia-y-energia.js` (otra unidad en
  obra) y la prueba del glosario (`app/datos/glosario/quimica.json` desfasado hasta que se corra `npm run catalogo` al
  integrar).
- `node herramientas/ecuaciones-ancho.js quimica.tabla-periodica`, servidor propio en el puerto 4263: 44 pantallas, 275
  renglones, todo cabe.
- Volcado de lo que ve el alumno en 200 semillas por idea (script en el scratchpad): ningún campo pasa su tope, sin
  «undefined», «NaN» ni dobles espacios.

## Verificación de la segunda pasada (27 nov)

Verificador de cierre. Se leyeron todas las oraciones nuevas (teoría en 60 semillas por idea; `tabla-ubicacion` en 120
por idea) contra HEAD y se resolvieron las notas.

**Datos, opciones y respuestas contra HEAD (200 semillas por idea, más las 500 a 505; la práctica por idea):** iguales,
sin ninguna diferencia fuera del texto.

**Corregido (con prueba que falla con la versión del redactor):**
- **Número atómico, periodo 2 y grupo VIIA (idea 2):** la alternativa Z = 1 decía «Bien el grupo… es el de arriba, en el
  periodo 1», pero el hidrógeno no está encima del flúor. Ahora, cuando no hay nadie arriba: «Restaste 8, como para subir
  una fila, pero el Z = 1 es el hidrógeno, del periodo 1, que no está en este grupo…». (`tabla-periodica.test.js`)
- **Plurales rotos (idea 2):** «Contaste bien los 1 electrones p» (galio, indio) → «el electrón p»; «Ahí hay 1 electrón
  (2s¹), los de valencia» → «el de valencia». (`tabla-periodica.test.js`)
- **`tabla-ubicacion`, misma familia del magnesio y del calcio:** la alternativa QM-CUENTA-GRUPO es el escandio o el
  itrio, con dos electrones en su nivel más alto, y la explicación decía «tiene 2 electrones, no 2». Ahora: «…y su nivel
  más alto también tiene 2 electrones, pero termina en d: su grupo suma también el d y queda en otra columna».
  (`generador.test.js`, que además fija QM-ANOMALO-GRUPO)
- Sin prueba, de precisión: la condición de la idea 1 decía que por masa «un gas caería en la columna de los metales»;
  ahora «en la columna del litio y el sodio, que son metales».

**Notas del redactor, confirmadas:**
- **QM-ANOMALO-GRUPO** (Cr, Cu, Ag, Au): en las cuatro, la alternativa es la suma real más uno (Cr → 7; Cu, Ag, Au →
  12): «sumaste un electrón de más: el que pasó del s al d se cuenta una sola vez» describe bien esa cuenta (2 + 5 o
  2 + 10). Comprobado en 600 semillas.
- **Datos de memoria:** argón 39,95 contra potasio 39,10 (por masa el argón iría en el lugar 19, bajo el sodio); el argón
  rodea el filamento de los focos; «halógeno» viene del griego «que forma sal»; unos 94 de 118 elementos son metales
  (cuatro de cada cinco); el cobre y la plata conducen muy bien; el silicio, semiconductor, conduce más al calentarse;
  bloques de 2, 6, 10 y 14 columnas; el 3d empieza en el escandio. Todo cierto.
- `papel-reglas.js` marca `quimica-conceptos p2 [papel-datos]`: es una plantilla compartida por once unidades de química
  (estas tres incluidas), sin cambios en esta pasada; queda pendiente para quien la rehaga.
- El esquema de `docs/teoria.md` ya dice 40 para el `siFuera` (commit d4a1a36).

**Comprobación:** `tabla-periodica.test.js` 24/24; `tabla-ubicacion` 10/10; validador con `calidad: 2` en 200
semillas: 0; `papel-generador.js --revisar`: al día.

`contenido/teoria/teoria.test.js`: 163 de 164; la única falla, «glosario … archivos de la app al día», espera a
`npm run catalogo`.

Archivos de esta verificación: `contenido/teoria/quimica/tabla-periodica.js`, `contenido/teoria/quimica/tabla-periodica.test.js`,
`plantillas/tabla-ubicacion/generador.js`, `plantillas/tabla-ubicacion/generador.test.js`.
