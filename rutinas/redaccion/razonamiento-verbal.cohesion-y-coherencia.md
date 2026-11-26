# Redacción · razonamiento-verbal.cohesion-y-coherencia (26 nov 2026)

Pasada del redactor (`docs/metodo/unidad/redaccion-delegada.md`, criterio `escribidor-escribano`) sobre
`contenido/teoria/razonamiento-verbal/cohesion-y-coherencia.js` y su práctica `plantillas/cohesion-coherencia/`
(generador y `papel.json`, regenerado con `node herramientas/papel-generador.js cohesion-coherencia`).

No se tocó ningún texto de lectura (avisos, mensajes, folletos, hojas de simulacro), ninguna opción, respuesta,
distractor, código, dato, color ni dibujo. Por eso no hizo falta rehacer la prueba propia ni el juez de la práctica:
las dos siguen en verde (85 pruebas), y las alternativas conservan su largo (la correcta sigue sin ser la más larga
ni la más corta).

## Qué cambió, por tipo de problema

1. **`siFuera` en molde (teoría: unas 90; práctica: todas las explicaciones).** Casi todas seguían la plantilla
   «X, bien; pero Y», con un «bien» que no decía qué estuvo bien y una Y que a veces no daba el porqué. Se
   reescribieron con el acierto dicho en palabras y la razón completa. La prueba de la unidad exige que el primer
   tramo reconozca lo que el alumno hizo bien («bien», «cierto», «sí», «acertaste»), así que se conserva ese
   reconocimiento, repartido en tres formas («Es cierto que…, pero», «X, es cierto, pero», «X, sí, pero») para que no
   quede otro molde.
   - Antes: «Viste dos precios, bien; pero son de dos años distintos.»
     Después: «Bien visto que hay dos precios, pero solo chocarían si fueran del mismo año; aquí uno es del año
     pasado y el otro, de este.»
   - Antes: «Concuerda, bien; pero Carlos es quien encontró, no a quien encontró.»
     Después: «Carlos concuerda con «lo», es cierto, pero él es quien encontró a alguien, no a quien encontraron.»
   - Antes: «Tu tía está antes, bien; pero ahí ya está tu mamá haciendo algo.» (el cartel dice «mi tía», «mi mamá»)
     Después: «La tía se nombra antes, sí, pero después de la coma ya hay otra persona que hace algo: la mamá.»
2. **Pasos y soluciones telegráficos o ambiguos (Así se resuelve, ejemplos, Mira, práctica).**
   - Antes: «C nada en un río seco: «por eso» no lo arregla.» Después: «C: alguien nada en un río seco, y «por eso»
     no lo arregla.»
   - Antes: «Ninguna parte de la carga ni de los kilos: no es una cadena, y no se corta.» Después: «Ninguna parte de
     la carga ni de los kilos, así que no es una cadena; tampoco se corta, porque todas hablan de la llama.»
   - Antes (papel): «Aquí: no: cada una dice lo que cree otra persona.», «Cumple: al veterinario.», «Va: La
     enfermera.» Después: «Aquí no chocan, porque cada oración cuenta lo que cree o dice una persona distinta.»,
     «Cumple «Al veterinario»: concuerda con «Él» y, puesto en su lugar, da sentido a la oración.», «Lo que se
     recupera es «La enfermera».»
   - Mira, idea 2: «La que retoma lo dicho es anáfora…» pasa a «La palabra que retoma lo dicho es una anáfora…».
3. **Referente ambiguo en la propia unidad de referentes.** Lee, idea 1: «nadie sabe cuándo encontrarla abierta»
   («la», ¿bibliotecaria o biblioteca?) pasa a «nadie sabe cuándo encontrará abierta la biblioteca».
4. **Lecturas en vivo y consignas con rótulo en lugar de oración.** «Callada la 4: se recupera…» pasa a «Si callas en
   la 4, el lector recupera «un guardaparque»»; «Las dos: repetir» pasa a «Las dos oraciones repiten el nombre»; en
   la idea 5, «La B no presenta…» decía una letra que el alumno no ve en el juego y pasa a «Esta oración no
   presenta…». Consignas 2 y 3: «En negrita, los pronombres: …» pasa a «Los pronombres van en negrita, y…».
5. **Reglas y condiciones.** Regla 2: «da sentido» pasa a «puesto en su lugar, da sentido a la oración»; «el más
   cercano», a «el nombre más cercano». Condición 1: se agrega «y de la misma parte» (la regla ya lo decía). Regla y
   condición 3 (y el paso de la práctica): «con su persona y su número» pasa a «concuerda en persona y número con
   quien hace la acción» (ver nota 1). Idea 5: «no contradice al texto» pasa a «no contradice el texto» (falta de
   régimen).
6. **Sueltos.** Lee: «…un pronombre como «ella», un nombre que se repite» recibe su «o»; Concordancia dice «el mismo
   género (masculino o femenino) y el mismo número (singular o plural)», las palabras de los Datos.

## Para el auditor

1. **Idea 3, «con su persona y su número».** La regla y la condición decían que lo callado se recupera «con su
   persona y su número», pero el ejemplo «Yo llevo el pan; tú, el queso» recupera «llevas», con otra persona. Se
   reescribió como «concuerda en persona y número con quien hace la acción», que vale para ese ejemplo y para
   «Mis primos… Trajeron». Conviene confirmar que es la lectura que quería el autor.
2. **Glosario, «inclusión»:** el ejemplo «La UNI suele preguntar inclusión en Razonamiento Verbal» afirma como hecho
   lo que la cabecera del archivo llama hipótesis («en el repo no hay examen de verbal de la UNI»). No se cambió.
3. **Idea 5, Ahora tú 1:** la incorrecta «Doña Julia no vende pescado» se explica como choque con «esas truchas
   llegan cada mañana»; el choque depende de leer que las truchas llegan a su puesto. Revisar si basta.
4. **Generador, `noCorresponde2` con código RVK8** («repetir de más»): la explicación habla de un sustituto que no
   corresponde. El texto se dejó coherente con lo que muestra la alternativa; el código es decisión del autor.

## Comprobaciones

- `node --test contenido/teoria/razonamiento-verbal/cohesion-y-coherencia.test.js plantillas/cohesion-coherencia/*.test.js`: 85 de 85.
- Validador con `calidad: 2` simulada (200 semillas), dentro de la prueba de la unidad: sin hallazgos.
- `node herramientas/papel-generador.js --revisar`: papel al día.
- `contenido/teoria/teoria.test.js`: 164 de 164.
- `node herramientas/ecuaciones-ancho.js razonamiento-verbal.cohesion-y-coherencia` (con el servidor local): 45
  pantallas, todo cabe.
