# Redacción · trigonometria.reduccion-al-primer-cuadrante (26 nov 2026)

Pasada del redactor (`docs/metodo/unidad/redaccion-delegada.md`, criterio `escribidor-escribano`) sobre
`contenido/teoria/trigonometria/reduccion-al-primer-cuadrante.js` y su práctica `plantillas/trig-reduccion/`
(generador y `papel.json`, regenerado con `node herramientas/papel-generador.js trig-reduccion`).

No se tocó ningún número, respuesta, distractor, dato numérico, color, letra ni dibujo. Tampoco cambió el orden en que
el azar de «Ahora tú» y de la práctica pide sus números: los `casos.json` siguen pasando y el papel tiene las mismas
ocho respuestas. Los enunciados de «Ahora tú» y de «Así se resuelve» quedaron como estaban, porque la prueba propia los
lee con expresiones regulares para recalcular la respuesta.

## Qué cambió, por tipo de problema

1. **Pasos y soluciones telegráficos (ejemplos, «Así se resuelve», «Ahora tú», práctica).** Eran rótulos con dos
   puntos o listas de datos sueltos («II, signo del coseno, −2»). Ahora cada paso dice qué se hace y por qué, con un
   verbo, y anuncia la ecuación que sigue.
   - Antes: «sec 120°: II, signo del coseno, −2. tan 315°: IV, −1. csc 150°: II, signo del seno, 2.»
     Después: «sec 120° = −2, porque en el II la secante sigue al coseno; tan 315° = −1, porque está en el IV, y
     csc 150° = 2, porque en el II la cosecante sigue al seno.»
   - Antes: «11π/4 = 495° → 135° (II): tan 135° = −1. 13π/3 = 780° → 60°: cos 60° = 1/2.»
     Después: «11π/4 = 495°, que sin la vuelta es 135°, en el II: tan 135° = −1. 13π/3 = 780°, que sin dos vueltas
     es 60°: cos 60° = 1/2.»
   - Antes (Así se resuelve, idea 1): «En el IV, α se mide hasta el eje x positivo (360°):» Después: «En el IV, el eje
     x más cercano es el positivo, que está a 360°, así que α es lo que le falta a θ para llegar ahí:»
   - Los «Se reemplaza:», «La altura:», «Con el dato:», «Se multiplica:» sueltos dicen ahora qué se reemplaza o con
     qué valor («Se reemplaza α por 25°:», «La altura es el radio por ese seno:», «Con el valor de cos 20° del
     enunciado:»). El paso «¿Tiene sentido?» empieza con «Comprobación:» y dice qué se comprobó, en vez de «cuadra».
2. **`siFuera` en molde «X está bien; Y».** El punto y coma unía el acierto con el error sin decir la relación. Ahora
   el contraste va con «pero» y el porqué completo.
   - Antes: «El tamaño, 3/4, está bien; en el II tan es negativa: sale −3/4.»
     Después: «El tamaño, 3/4, está bien, pero en el II la tangente es negativa: sale −3/4.»
   - Antes: «Cada pieza vale 1 o −1, bien; pero no todas cambian de signo: el coseno y la secante, no.»
     Después: «Ver que cada pieza vale 1 o −1 está bien, pero no todas cambian de signo: el coseno y la secante no
     cambian.»
3. **La razón por su abreviatura con un adjetivo que no concuerda.** «sen es negativa», «cos es positiva», «falta el
   signo de cos». Se agregaron tres ayudas de texto (`elN`, `delN`, `sgTxt`, en la unidad y en el generador) para decir
   «el seno es negativo», «la tangente es positiva», «el signo del coseno». Los cálculos no las usan.
4. **El marco «Vale si» roto en las cinco reglas.** Las condiciones empezaban con mayúscula y no completaban el marco
   («Vale si En el I, α = θ. Lado final sobre un eje…», «Vale si Vale para las seis razones…», «Vale si Con φ agudo
   se lee el cuadrante…»). Ahora cada una es una subordinada: «Vale si θ termina dentro de un cuadrante; en el I,
   α = θ…», «Vale si θ no está sobre un eje, con cualquiera de las seis razones…», «Vale si φ es agudo: así se sabe el
   cuadrante del ángulo…».
5. **Consignas, pasos de «Mira» y tarjetas de «Lee» entrecortados.** Ejemplos: «El minutero gira −θ desde el 3
   (horario); la línea punteada, θ hacia atrás.» pasa a «El minutero gira −θ desde el 3, en sentido horario; la línea
   punteada marca el giro θ, del mismo tamaño, en sentido antihorario.»; «P y P′, igual de lejos del eje y: mismo valor
   absoluto.» pasa a «P y P′ están igual de lejos del eje y, así que sus cosenos miden lo mismo sin contar el signo.»;
   la tarjeta «Ya conoces las cofunciones…» (que suena a «como ya sabes») pasa a «Las cofunciones van en parejas…».
6. **Enunciados de la práctica sin verbo.** «Un ángulo negativo: −30°.», «Se quiere cot 217° con un ángulo agudo.»,
   «Un ángulo en radianes: 29π/6.» pasan a «El ángulo −30° gira en sentido horario.», «El ángulo 217° no es agudo.»,
   «El ángulo 29π/6 está en radianes.».
7. **Historia en ráfaga.** Cinco oraciones cortas sin enlace; ahora tres, con «pero» y «y» donde hay relación, dentro
   de las 70 palabras.
8. **Fallas puntuales de lengua o de sentido.**
   - Así se resuelve, idea 4: «En 600° caben 1 vueltas enteras (360°).» pasa a «En 600° cabe una vuelta entera, de
     360°, y se quita:».
   - Así se resuelve, idea 4: «Piden sen 855°, un ángulo de más de una vuelta.» (sen 855° no es un ángulo) pasa a
     «…, la razón de un ángulo de más de una vuelta.»
   - Mira, idea 4 (rueda de bicicleta): «su ángulo de referencia va hasta el oeste» pasa a «se mide hasta el eje x
     negativo».
   - Lee, idea 1: «Salvo que apunte justo al norte o al sur, la flecha forma… un ángulo agudo» era falso al este y al
     oeste; pasa a «Si la flecha no apunta justo a un punto cardinal…».
   - `aprendizaje` de la idea 3: «x se queda, y cambia de signo» se leía con «y» como conjunción; pasa a «la x se queda
     y la y cambia de signo».
   - Misión de la idea 2: «La gemela está igual de alto, pero arriba» (no está igual de alto) pasa a «La gemela sube
     lo mismo que P baja».
9. **Datos.** Se conservaron las cuentas en palabras que dejó el autor para que nada se parta a 390 px. Solo se quitó
   el «=» de la prosa en dos líneas («Una razón de θ = ± la misma…» pasa a «Una razón de θ vale ± la misma…») y se
   completó «Las demás, negativas» con su verbo. En las predicciones de las ideas 2 y 3, «el coseno es la distancia x…
   entre r» pasa a «el coseno es la abscisa x… dividida entre r» (ver nota 5).
10. **Una igualdad partida.** Con `--momentos=lee`, la tarjeta «Altura con signo» de la idea 2 partía «y = ⏎ r · sen
    θ». Se unió con espacios duros (` `) en esa sola cadena. El barrido completo
    (`--momentos=lee,juega,predice,mira,regla,resuelve,ejemplos,ahora-tu`) queda sin hallazgos.

## Para el auditor

1. **`junto` no hace nada.** En la línea 54 reemplaza un espacio común por otro espacio común (U+0020 por U+0020),
   aunque el comentario dice que los vuelve espacios duros. El barrido a 390 px pasa igual, pero las ecuaciones no
   están protegidas como se cree.
2. **Ejemplos 12 y 13 de la idea 3 («Dos cocientes con −θ», «Dos productos con −θ»).** La explicación de la
   alternativa **C** (2) no describía un error que diera 2: «olvida el signo del seno: 1 − 1 se lee 1 + 1» y «cambia el
   signo de las dos: −1 + 1 se vuelve 1 + 1». Se reescribió con el error que sí da 2: los signos al revés en las dos
   piezas, 1 − (−1) = 2. El número no cambió; conviene confirmarlo.
3. **Ejemplo 14 de la idea 5 («Tres cuartos de vuelta después»).** Con cuatro aspas a 90°, si A está a φ, la que está a
   270° + φ es la cuarta (D), no la tercera (C). Además, «aspa C» se cruza con la alternativa **C**. No se cambió.
4. **Ejemplo 12 de la idea 4 («La pérdida del tanque»).** Usa P para la pérdida de agua, y en `letras` P es la punta
   del objeto. No se cambió.
5. **Datos de las predicciones de las ideas 2 y 3.** «Distancia x» no tiene signo y el coseno sí; por eso pasó a
   «abscisa x». No cambia ningún número ni adelanta la respuesta, pero es una línea de Datos: que el auditor diga si
   la acepta.
6. **Laboratorio, mesa 2, invitación 4.** «Misma altura, mismo seno: uno es el reflejo del otro en el eje y» no se
   comprobó para todas las parejas de la mesa.
7. **El glosario cambió** («ángulo de referencia», «noroeste», «reducir al primer cuadrante», «giros opuestos»), así
   que `app/datos/glosario/trigonometria.json` queda desactualizado hasta correr `npm run catalogo`. No lo corrí,
   porque reescribe archivos de todos los cursos y otros agentes trabajan en ellos (`algebra.json` ya estaba
   desactualizado antes).

## Comprobación

- `node --test contenido/teoria/trigonometria/reduccion-al-primer-cuadrante.test.js plantillas/trig-reduccion/generador.test.js`:
  19 de 19.
- `node --test contenido/teoria/teoria.test.js`: la prueba de esta unidad pasa. Fallan otras tres: `quimica/materia-y-energia`,
  `quimica/propiedades-periodicas` y el glosario, que pide `npm run catalogo` porque `algebra.json` está desactualizado.
  Las tres son de otros agentes.
- Validador con `calidad: 2` simulada (`Teoria.problemas`, 60 semillas): sin problemas.
- `MESA_URL=… node herramientas/ecuaciones-ancho.js trigonometria.reduccion-al-primer-cuadrante`: todo cabe (43
  pantallas), y con todos los momentos (80 pantallas), también.
