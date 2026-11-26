# Redacción: fisica.dinamica

26 nov 2026. Redactor con `docs/metodo/unidad/redaccion-delegada.md` y la skill `escribidor-escribano`, sobre la unidad
ya cerrada (`calidad: 2`). Solo cambió el texto: ningún número, respuesta, distractor, dato, dibujo ni color. La marca
`calidad: 2` se queda y el validador sigue en cero.

Archivos: `contenido/teoria/fisica/dinamica.js`, `plantillas/fis-dinamica/generador.js` (con su `papel.json` regenerado
por `herramientas/papel-generador.js`) y `plantillas/dinamica/papel.json` (papel hecho a mano). `dinamica-fuerzas` es
compartida con Estática y Gravitación: no se tocó.

Leído: las seis ideas con todos sus momentos (Lee, juego, Predice, Mira, regla, «Así se resuelve» y «Ahora tú» en 20 a 24
semillas por idea, con todas sus ramas), los 90 ejemplos, el glosario (13 términos), las tres mesas del laboratorio y
la historia; en la práctica, los 19 tipos del generador y los 10 problemas del papel de la escena.

## Qué cambió, por tipo de problema

**1. Los pasos de solución eran rótulos (unos 130).** En los ejemplos y en «Ahora tú», la mayoría de los pasos eran
«La aceleración:», «Entre la masa:», «El sistema:», «Despejando:», «La masa se va:», «De lado:». Ahora cada paso dice qué
se hace y por qué se hace eso: por qué la normal iguala al peso, por qué la tensión queda fuera del sistema, por qué la
masa se cancela, por qué se usa la fórmula sin tiempo.

> Antes (ejemplo 4.6): «El sistema:» / «El costal: solo la cuerda lo jala de lado.»
> Después: «Primero, el sistema: el peso del balde mueve las dos masas.» / «Después, el costal: solo la cuerda lo jala
> de lado, así que la tensión es su masa por la aceleración.»

> Antes («Ahora tú», idea 3): «a = μk · g; después, con v = 0:» (con μk en texto crudo)
> Después: «Sin empuje, el rozamiento es la fuerza neta, y al dividirlo entre la masa queda a = μₖ · g. Después, con
> v = 0 al final, la fórmula de MRUV da la distancia:» (con el nodo de subíndice)

**2. Los `siFuera` decían «Bien X. Pero Y.» sin nombrar el razonamiento (unos 110).** Ahora nombran lo que hizo el alumno,
dicen por qué falla y qué había que mirar.

> Antes (Predice, idea 1): «Frena, cierto. Pero frenar es cambiar de velocidad: también es acelerar.»
> Después: «Va frenando, cierto, pero frenar es cambiar de velocidad, y todo cambio de velocidad es una aceleración. Si
> su velocidad baja un poco cada segundo, el carrito tiene aceleración, aunque se mueva cada vez más lento.»

> Antes («Ahora tú», idea 4): «Bien que la cuerda jala. Pero solo tiene que acelerar al de atrás, no a los dos.»
> Después: «Igualaste la cuerda a tu jalón. Tu jalón acelera a los dos carritos, pero la cuerda del medio solo tiene que
> acelerar al de atrás, así que jala menos.»

**3. Las reglas no decían por qué ni daban un caso.** Las seis reglas dicen ahora qué es cada término, por qué vale y un
caso que el alumno vio.

> Antes (regla, idea 1): «La fuerza neta, la suma de todas las fuerzas con su sentido, le da al cuerpo una aceleración en
> su mismo sentido. Con la misma fuerza, más masa acelera menos.»
> Después: «La fuerza neta, la suma de todas las fuerzas con su sentido, le da al cuerpo una aceleración que apunta hacia
> donde apunta ella, aunque el cuerpo vaya al otro lado: al frenar un carrito que va a la derecha, la aceleración apunta
> a la izquierda. Con la misma fuerza, más masa acelera menos, porque hay más materia que mover.»

> Antes (regla, idea 6): «La suma de las fuerzas hacia el centro vale m · v²/r: suman las que apuntan al centro y restan
> las que se alejan. Es la fuerza centrípeta.»
> Después: «En una curva, la suma de las fuerzas apunta al centro y vale m · v²/r: suman las que apuntan al centro y
> restan las que se alejan. Esa suma se llama fuerza centrípeta, pero no es una fuerza más que se dibuje: la ponen el
> peso, la normal, una cuerda o el rozamiento.»

**4. «Vale si» sin consecuencia.** Las seis condiciones dicen ahora qué pasa si no se cumplen (desde un vehículo que
frena, las cosas se mueven sin fuerza; con la g de la Tierra en la Luna, el peso sale unas seis veces mayor; con una
polea pesada, cada tramo jala distinto…). La de rozamiento perdió el paréntesis y el «μk» crudo: las reglas y las
condiciones son texto plano por prueba, así que dicen «el coeficiente» en palabras y el símbolo queda en la ecuación.

**5. Las explicaciones de las alternativas de examen eran listas de rótulos (30 ejemplos).** «A olvida el 2; C usa la
velocidad media…» pasa a una oración con el mismo molde en toda la unidad: «Las otras salen de un error: A, si…; C,
si…, y E, si…». En la 2.12 (V o F), la D (VVF) se explicaba como «cree que en la Luna acelera distinto»; ahora dice «si
crees que la masa baja y que por eso acelera distinto», que es lo que da VVF.

**6. Lee y Mira.** Cada tarjeta dice ahora qué es lo que nombra (qué es la normal, qué mide μ, qué es la tensión, qué es
el peso aparente y por qué se llama así) y cada paso de Mira dice por qué pasa lo que muestra («el peso y la normal se
anulan y las ruedas casi no frenan, así que tu empujón es la fuerza neta»). Ninguna tarjeta adelanta la respuesta de su
Predice.

**7. Glosario.** Los 13 `simple` llevan ahora una imagen de todos los días dentro del tope de 14 palabras («Lo que
cuesta cambiar cómo se mueve algo, como frenar un camión lleno»; «Un jalón inclinado, como el de una maleta de
rueditas jalada por el asa»).

**8. Laboratorio y menores.** Las invitaciones dejaron el telegrama («Fuerza máxima, masa mínima y nada de roce» pasa a
«Con la fuerza máxima, la masa mínima y sin rozamiento, sobra lo más posible»). «Kilo» pasa a «kilogramo» en las
consignas y los datos.

**9. Práctica.** En `fis-dinamica`, las explicaciones de error (unas 70) y las soluciones de los 19 tipos siguen el molde de la
teoría (siguen empezando por «Bien» o «Así» y mostrando el valor, como piden las pruebas); se regeneró su `papel.json`.
En el papel de la escena `dinamica`, que ya explicaba bien, solo se unificó «roce» en «rozamiento» (el término de la
unidad) y «Ojo:» pasó a «Cuidado:».

## Comprobaciones

- `contenido/teoria/fisica/dinamica.test.js` (con el validador en `calidad: 2` y 400 semillas), `plantillas/fis-dinamica/*.test.js`
  y `plantillas/dinamica/*.test.js`: 109 en verde.
- `papel-generador.js --revisar`: `fis-dinamica` al día.
- `contenido/teoria/teoria.test.js`: 163 en verde y 1 falla esperada, «glosario … archivos de la app al día», porque
  cambió el glosario y no se corrió `npm run catalogo` (lo corre la sesión al integrar).
- `ecuaciones-ancho.js fisica.dinamica` (servidor propio en el puerto 4248): 60 pantallas, todo cabe. La primera
  pasada encontró un resultado partido después de «=» en un paso nuevo («Así se resuelve», idea 4); se reordenó la
  oración y ya cabe.

## Para el auditor

- No vi cuentas ni afirmaciones falsas en el texto.
- Agregados que conviene mirar: Lee de la idea 2 dice que g «dice cuántos newtons pesa allí cada kilogramo» (N/kg =
  m/s²); la condición de la idea 2, «unas seis veces más grande» (10 ÷ 1,6 = 6,25); la condición de la idea 4, que con
  una polea pesada o una cuerda que pesa cada tramo jala distinto.
- En la práctica siguen los subíndices como «f_k», «μ_k» y «a_c»: la app los convierte (`conSub` de `app/practica.js`).
- La escena vieja `plantillas/dinamica/index.html` (borrador, `rehacer: true`) dice «roce» unas cien veces; no se tocó.
- En el ejemplo 1.14, la alternativa D («Menos de 10 m/s², hacia abajo») se explica como la fuerza del lanzamiento que
  «se va gastando»; mantuve esa lectura, que es la del texto original.

## Verificación (26 nov)

Verificador de cierre. Comparé con HEAD: las 10 893 marcas de la teoría (ecuaciones, opciones con su código, respuestas,
letras y figuras, y «Ahora tú» y «Así se resuelve» en 200 semillas por idea) son idénticas; en `fis-dinamica` (2800
problemas) alternativas, valores, códigos, enunciados y datos no cambian, y los números de la solución de HEAD siguen
todos. Rehice la cuenta de los `siFuera` de «Ahora tú» (200 semillas) y de los tres agregados anotados.

Corregido, con prueba que falla con la versión anterior («verificación 26 nov: si un texto dice que g da los newtons de
cada kilogramo…», en `dinamica.test.js`):

- **Lee de la idea 2, «Cada astro jala distinto».** Decía que g «dice cuántos newtons pesa allí cada kilogramo: en la
  Tierra, 10 m/s²», que mezcla N/kg con m/s² sin decirlo. Ahora: «Cada lugar tiene su g: en la Tierra, 10 m/s²; …
  Ese número dice cuántos newtons pesa cada kilogramo, porque 1 m/s² es lo mismo que 1 N/kg: 1 kg pesa 10 N aquí y
  1,6 N en la Luna.» (60 palabras, en el tope.)

Revisado y queda:

- «Unas seis veces más grande» (10 ÷ 1,6 = 6,25): cierto.
- La polea pesada o la cuerda que pesa hacen que cada tramo jale distinto: cierto en el caso de la idea (bloques que
  aceleran); es la salvedad de siempre de la polea ideal.
- La D del ejemplo 2.12 (VVF): el arreglo del redactor es correcto. «Si crees que en la Luna acelera distinto» daba FVF;
  para VVF hace falta creer además que la masa baja. La prueba nueva fija esa frase.

Decidido por la sesión, Gerson revisa después:

- La escena vieja `plantillas/dinamica/index.html` dice «roce» unas cien veces y no se toca: está marcada
  `rehacer: true`. Su `papel.json`, que el redactor ya pasó a «rozamiento», queda así.

Comprobaciones: `dinamica.test.js` 16 de 16; `fis-dinamica`, `dinamica` y `dinamica-fuerzas` en verde (137 con la
unidad); validador con `calidad: 2` en 200 semillas: 0 hallazgos; regla del papel: 0 faltas; `papel-generador --revisar`:
al día; `contenido/teoria/teoria.test.js`: falla solo «glosario … archivos de la app al día», que espera
`npm run catalogo`.
