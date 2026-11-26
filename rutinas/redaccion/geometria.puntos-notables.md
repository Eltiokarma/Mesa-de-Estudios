# Redacción · geometria.puntos-notables (26 nov 2026)

Pasada del redactor (`docs/metodo/unidad/redaccion-delegada.md`, criterio `escribidor-escribano`) sobre
`contenido/teoria/geometria/puntos-notables.js` y su práctica `plantillas/geo-puntos-notables/` (generador y
`papel.json`, regenerado con `node herramientas/papel-generador.js geo-puntos-notables`).

Se leyó todo el texto que ve el alumno: las seis ideas (Lee, consigna, misión, lecturas en vivo, leyendas, voces,
Predice, Mira, regla y «Vale si»), los 90 ejemplos, «Así se resuelve» y «Ahora tú» en 20 semillas por idea, las tres
mesas del laboratorio, el glosario y la práctica. Cambiaron unas 360 líneas de texto en la teoría y unas 110 en el
generador. No se tocó ningún número, respuesta, distractor, dato, color ni dibujo. Los enunciados y preguntas que lee
el juez propio de la prueba (`puntos-notables.test.js`) conservan sus frases; las lecturas en vivo conservan el molde
que la prueba revisa («le faltan … m», «el más corto es P…»).

## Qué cambió, por tipo de problema

1. **Explicaciones de las alternativas en molde de lista (la última línea de unos 45 ejemplos).** Eran rótulos pegados
   con punto y coma, sin decir qué eran. Ahora abren con «Las otras alternativas:» y cada una dice qué cuenta hace.
   - Antes: «12 cm es la mediana entera; 4 cm es GM; 6 cm, su mitad; 6,5 cm, la mitad de AB.» («su mitad», ¿de qué?)
     Después: «Las otras alternativas: 12 cm es la mediana entera, 4 cm es GM, 6 cm es la mitad de la mediana y
     6,5 cm es la mitad de AB.»
2. **Pasos de «Las cuentas» y de las soluciones sin verbo.** «Área, semiperímetro y división.», «La mitad y después el
   doble.», «El semiperímetro y la resta.», «Primero AF, después AC.», «El tercer ángulo:», «Pitágoras:» y otros
   recibieron sujeto, verbo y el porqué.
   - Antes: «El central, y después los dos ángulos iguales de la base de BOC.»
     Después: «Primero se halla el ángulo central, y después se reparte lo que falta para 180° entre los dos ángulos
     iguales de BOC.»
   - Antes: «Pitágoras para la hipotenusa, y después la mitad.» Después: «Con Pitágoras se halla la hipotenusa, y R es
     su mitad.»
3. **`siFuera` en molde «X está bien; pero Y» y explicaciones que no dicen el porqué (teoría y práctica).** El punto y
   coma antes de *pero* pasó a coma en todo el archivo, y las que solo nombraban la regla ajena («2A vale para el
   circuncentro; H es el ortocentro», «180° − A sale con dos alturas; aquí hay radios de O») dicen ahora qué es cada
   cosa («…aquí H es el ortocentro, el cruce de las alturas»; «180° − A es el ángulo entre dos alturas; aquí los lados
   de BOC son radios»). Las que decían «no copia A» o «no su copia» dicen «no mide lo mismo que A».
   - Antes: «Duplicar está bien; pero lo que falta para 90°, no BEC.»
     Después: «Duplicar está bien, pero se duplica lo que le falta a BEC para 90°, no BEC.»
4. **Pasos de Mira que saltaban o se partían.** El 2 : 1 del baricentro ahora dice por qué: «MN une los puntos medios de
   dos lados, así que es paralela a AB…» y «Por eso el triángulo GMN es el GAB reducido a la mitad, y GM mide la mitad
   de AG». En Euler, la oración partida en dos pasos («Los puntos medios de los tres lados…» / «…y los pies…») quedó en
   dos oraciones completas, y «Los cuatro centros de un triángulo escaleno.» recibió verbo. En el incentro, «Es I.» y
   «Con I se arman tres triángulos…» pasaron a «…es el incentro I» y «Al unir I con los vértices salen tres triángulos
   de altura r, y sus áreas suman r · s».
5. **Reglas y «Vale si».** Las reglas dicen lo que «Ahora tú» pide con frases completas («…que siempre queda dentro del
   triángulo»; la del incentro suma «y el área es r por s»; la de Euler dice por qué puntos pasa la circunferencia de
   nueve puntos). Las condiciones continúan «Vale si»: la del baricentro («…; con las medianas de B y de C pasa igual»,
   que no era condición) pasa a «AM va de A al punto medio M del lado opuesto; con las medianas que salen de B y de C
   pasa lo mismo»; la del circuncentro dice «el ángulo BOC menor» cuando A es obtuso; la del ortocentro, «primero se mira
   qué rectas forman el ángulo en H»; la del excentro dice qué es «relativo a BC».
6. **Ambigüedad y jerga.** Glosario: «En un rectángulo, el pie de una altura puede ser un vértice» (se leía como el
   cuadrilátero) pasa a «En un triángulo rectángulo…»; «Su centro: un excentro» y la definición sin sujeto de la
   circunferencia de nueve puntos recibieron verbo. En «Ahora tú» de Euler, las preguntas sin verbo («Una fuente a la
   misma distancia de tres muros…») pasan a oración («Una fuente debe quedar a la misma distancia de los tres muros
   rectos que la rodean, que forman un triángulo»), y «el encargo pide otra cosa» pasa a «el enunciado describe otra
   cosa». En la escena del parque, «el borde pasa la vereda» pasa a «pisa la vereda», que es la palabra de la consigna.
7. **Microtexto de las mesas y lecturas.** Las felicitaciones de las invitaciones sin verbo («Vertical cuando AB = AC.»,
   «Obtuso y todo, las seis siguen iguales: bases iguales y altura común.», «Misma altura sobre BC, mismas seis áreas…»)
   pasaron a oraciones de hasta 16 palabras. Las lecturas del ortocentro («Tres ángulos agudos: …», «Ángulo recto en B:
   …») recibieron verbo.

Dos correcciones las pidió el validador al redactar y quedaron como estaban: el `simple` y la definición de «recta de
Euler» no pueden nombrar O, G y H porque son la respuesta de su Predice (el glosario se puede tocar antes de
responder).

## Para el auditor

1. **Alta. Idea 5, «Así se resuelve», semilla del ángulo BEC (t = 1, A entre 30° y 120°).** El paso «sentido» dice
   «Es 90° − A ÷ 2, y sale agudo: E ve a BC más cerrado que A». La segunda parte es falsa cuando A < 60° (con A = 40°,
   BEC = 70°, más abierto que A). No se tocó; conviene quitar la comparación con A o limitar A a más de 60°.
2. **Media. Glosario, «punto notable».** La definición dice «tres líneas del mismo tipo» y el excentro es el cruce de
   una bisectriz interior y dos exteriores. Revisar si la definición debe nombrar el caso del excentro.
3. **Baja. Idea 6, ejemplo 14.** Decía que el baricentro y el ortocentro «no equidistan de nada». Se reescribió como «en
   general, no quedan a igual distancia de los tres vértices», que es lo que la solución necesita (en el equilátero sí
   equidistan). Confirmar que es la lectura que quería el autor.
4. **Baja. Idea 4, condición de la regla.** m∠BHC = 180° − m∠A vale también cuando el obtuso es A; la condición dice
   «el triángulo es acutángulo» y avisa que con un obtuso hay que mirar las rectas. No es falso, pero es más restrictivo
   de lo necesario.
5. La línea de datos `D_CENTROS` («G: cruce de medianas. O: de mediatrices, equidista…») se dejó en forma de leyenda:
   no cabe en 22 palabras como oración completa sin perder lo que equidista. Si se quiere en prosa, habría que partirla
   en dos líneas de datos.

## Pruebas

- `node --test contenido/teoria/geometria/puntos-notables.test.js`: 11 de 11 (incluye el validador con `calidad: 2` en
  200 semillas).
- `node --test plantillas/geo-puntos-notables/generador.test.js`: 9 de 9; `papel.json` regenerado.
- `contenido/teoria/teoria.test.js` y `herramientas/ecuaciones-ancho.js`: ver el mensaje de cierre de la sesión.
