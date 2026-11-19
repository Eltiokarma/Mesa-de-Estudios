# Reglas del validador para una unidad con `calidad: 2`

Léelo antes de marcar una unidad con `calidad: 2`. Desde el 19 nov 2026 (Etapa 5), al poner esa marca corren, además
del formato de siempre, las reglas de esta lista. Salen de lo que los auditores (`rutinas/auditoria/`) y los lectores en
frío (`rutinas/frio/`) encontraron una y otra vez en las 15 primeras unidades.

- **Dónde están:** las de la teoría, en `nucleo/teoria-reglas.js` (las llama `Teoria.problemas`, que corre en
  `contenido/teoria/teoria.test.js`). Las del papel, en `herramientas/papel-reglas.js` (prueba:
  `herramientas/papel-reglas.test.js`).
- **Cuándo corren:** solo con `calidad: 2`. Una unidad en proceso no las ve. En el celular del alumno no corren nunca.
- **Cómo se lee una falla:** `idea 3 (resultante) ejemplo 6: [letras-datos] en Datos, «B» sin decir qué es…`. Entre
  corchetes va el nombre de la regla, que es el de esta lista.
- **Cómo probar tu unidad:** `node --test contenido/teoria/teoria.test.js` y `node herramientas/papel-reglas.js` (lista
  los hallazgos del papel).

## Reglas de la teoría

| Regla | Qué pide | Cómo se cumple |
| --- | --- | --- |
| `glosario-predice` | El glosario de una idea (`simple`, definición y ejemplos de los términos que la idea estrena) no trae el valor ni la frase que responde su Predice. | Si Predice pregunta por 5 dobleces y la respuesta es «32 capas», ningún ejemplo del glosario dice «con 5 dobleces quedan 32 capas». Usa otro caso (2 dobleces, 4 capas). Tampoco va la respuesta escrita entera, ni cuatro palabras seguidas de ella. El valor se busca cuando la respuesta es un número de dos cifras o más (o con decimales o fracción); una respuesta de una cifra la revisa el auditor. |
| `antes-predice` | Nada de lo que se lee antes de Predice la responde: las tarjetas de «Lee», la consigna y la voz del juego, la misión (su texto, su `bien` y su `pista`) y la leyenda. | No escribas la respuesta entera ni la cuenta que la da («… = 25 m²»). |
| `letras-datos` | Toda letra de una línea de `datos` (ejemplos, Predice, «Así se resuelve» y «Ahora tú») está dicha en ese mismo ejercicio o en la tabla de letras de la unidad. | Ver «La tabla de letras», abajo. |
| `letra-repartida` | La letra de la alternativa correcta se reparte. Se mide en toda la unidad, por separado en los ejemplos de nivel 3 con alternativas y en «Ahora tú», con los casos de 4 o 5 alternativas y solo si hay 10 o más: ninguna letra pasa del 40 % y ninguna falta. | Al escribir los ejemplos, lleva la cuenta de las letras: con 25 ejemplos de A a E, unas 5 veces cada una. En «Ahora tú» la app baraja las opciones; no hay que hacer nada. |
| `respuesta-letra` | En un ejemplo con `alternativas`, la respuesta dice cuál es la suya: por su letra o por su valor. Si da la letra, es la de la alternativa que dice su valor. | Con letra: `respuesta: [{ negrita: 'B' }, ', ', { v: 'c-f', t: '8 m' }]`, con «8 m» en la segunda alternativa. Sin letra: «AC = 17 cm», con «17 cm» en la lista (una sola alternativa calza). Donde la figura tiene puntos A, B, C va sin letra (ver la nota de abajo). |
| `alternativa-sin-explicar` | En un ejemplo con `alternativas`, el resuelto nombra cada alternativa incorrecta, por su letra o por su valor. | Por letra: «**A** resta en vez de sumar; **C** olvida la llevada…». Por valor: «15 cm le resta 2; 34 cm es el doble…». Si varias salen del mismo error, vale «las demás…» o «las otras…». |
| `figura-respuesta` | La figura de un ejemplo o de Predice no escribe el número que se pide. | Lo pedido va con «?». Se miran los números de dos cifras o más de la respuesta que no están en el enunciado ni en los datos; una marca de la escala de un eje (0, 20, 40…) no cuenta. |
| `datos-respuesta` | Los Datos no traen «lo que se pregunta = la respuesta». | Si se pregunta «¿cuánto vale cos 37°?», los datos no dicen «cos 37° = 4/5»: dan el triángulo 3-4-5 y la definición. Una tabla de valores entre los que se elige sí va. |
| `datos-consejo` | Una línea de Datos es equivalencia, valor, constante, definición o fórmula. Nunca un consejo. | No empiezan por «Recuerda», «Ojo», «Cuidado», «No olvides», «Ten en cuenta», «Fíjate», «Conviene», «Primero halla…». El aviso de una letra que choca sí va: «Ojo: aquí T es el período…». |
| `resuelve-repite` | Los 4 primeros casos de «Así se resuelve» no son ninguno de los 12 primeros de «Ahora tú» (mismo enunciado y, si lo llevan, mismo dibujo). | Que `resuelve.generar` y `ahoraTu.generar` saquen sus casos de listas distintas, o de tipos distintos. |
| `leyenda-visible` | Toda letra y todo color que nombra la leyenda del juego se ve en el juego. | La letra («θ», «v₀», «Δx») está escrita en la figura, la lectura, la consigna, la misión o un control, al abrir o en algún caso del juego. Si la leyenda dice «naranja», algo se pinta con `c-o` (turquesa `c-i`, violeta `c-f`, carmín `c-h`, verde `c-d`). Si la letra no está en el juego, su explicación va donde se usa. |

### Letra o valor de una alternativa

Las alternativas llevan A–E como en el examen. **Donde la figura tiene puntos con letras, ningún resuelto nombra una
alternativa por su letra** (decisión de Gerson, `docs/etapa3/decisiones.md`, «Letras de las alternativas»): ahí la
respuesta y las explicaciones van por el valor («AC = 17 cm», «34 cm es el doble»). Por eso `respuesta-letra` y
`alternativa-sin-explicar` aceptan las dos formas. El validador no comprueba que una unidad con puntos evite las
letras: eso lo mira el auditor. La letra de la correcta, para `letra-repartida`, se deduce del valor cuando no se escribe.

### La tabla de letras

`letras-datos` busca en cada línea de Datos las letras de fórmula: una letra sola, con subíndice («t_e», «v_B»), con
«Δ» o griega. No cuentan las unidades («5 m», «m/s»), π, los puntos de una figura tras «∠» o «△», las palabras «a», «y»,
«o», ni, en química, las fórmulas (H₂O) y los subniveles (s, p, d, f).

Una letra está dicha si se cumple una de estas cosas:

1. **El enunciado la usa**: «Una fuerza de A = 50 N…».
2. **El recuadro la dice**: «D: la distancia al cerro», «Densidad: ρ = …», «la base n», «M es el punto medio», «x en
   metros», «con k la medida de una parte», «la distancia recorrida, d, …», «a, b ≥ 0», «g = 10 m/s²», o una glosa al final de la
   fórmula:
   «v = d / t (distancia entre tiempo)».
3. **Está en la tabla de letras de la unidad**, que se arma con:
   - `letras` de la unidad, el campo nuevo: `letras: { v: 'velocidad', t: 'tiempo', t_e: 'instante del encuentro' }`;
   - el `simbolo` de los términos de su glosario;
   - el `simbolo` de los términos del glosario de las unidades que pide: la cadena de `requiere` del catálogo dentro de
     su curso, más las unidades de otro curso que esa cadena pide directamente.
4. **Es una letra cualquiera de una identidad**: está a los dos lados de un «=» («(a + b)² = a² + 2ab + b²»), o dos
   veces en una frase sin «=».
5. **Es una componente**: «A_x», «A_y», «A_z», si «A» está dicha. Con subíndice en mayúscula («v_B»), si «v» está dicha
   y «B» se nombra suelta en el ejercicio («la combi B»).

La manera más corta de cumplir: escribe la tabla de letras de la unidad (molde, §0.4) en `letras`, en vez de dejarla
solo en el comentario de cabecera.

## Reglas del papel

Valen para toda plantilla (`plantillas/<id>/papel.json`) que sirve a una unidad con `calidad: 2`, en los problemas de
esa unidad. No entran el papel de lectura (formato `lectura`) ni, en `papel-datos` y `papel-unidad`, las escenas con
`rehacer`.

| Regla | Qué pide |
| --- | --- |
| `papel-unidad` | La respuesta lleva su unidad cuando la magnitud la tiene. Si la solución termina en «25 m/s», la respuesta no dice «25». |
| `papel-datos` | Cada problema da sus datos y fórmulas (contrato, punto 13): el campo `datos` (lista de líneas) o «Datos: …» al final del enunciado, como lo arma `herramientas/papel-generador.js`. |
| `papel-unidades` | Si la plantilla sirve a dos unidades o más, cada problema dice de cuáles es: `"unidades": ["fisica.movimiento-rectilineo"]`. |

## Excepciones: la lista de pendientes

Las faltas reales que estas reglas encontraron en las 15 unidades ya hechas no se corrigieron al escribir las reglas.
Están en `EXCEPCIONES`, con unidad, idea, motivo y fecha, en `nucleo/teoria-reglas.js` (46 líneas) y en
`herramientas/papel-reglas.js` (10 líneas). Mientras una falta está en la lista, la prueba no falla.

- La lista no es un permiso: es lo que queda por corregir en esas unidades. `Teoria.pendientes(def)` da las de una unidad.
- Quien corrige una falta borra su línea. Si no la borra, la prueba no falla, pero avisa: «excepción que ya no hace falta».
- Una unidad nueva no agrega excepciones. Si una regla marca algo que está bien (un falso positivo), se afina la regla,
  con su caso de prueba en `nucleo/teoria-reglas.test.js`.

## Lo que sigue a mano

Estas reglas se probaron contra las 15 unidades y no entraron, porque marcaban como falta más de un caso de cada diez
que estaba bien. Las revisan el lector en frío y el auditor.

| Qué revisar | Por qué no es automática |
| --- | --- |
| **Los niveles suben**: el nivel 2 no es la cuenta del nivel 1 con otros números. | Comparar enunciados sin sus números marcó 24 pares, y en la mayoría la dificultad estaba justo en los números (otra base, ceros en medio, potencias de bases distintas). |
| **La respuesta de un ejemplo lleva el color de su magnitud.** | 108 casos, 88 de ellos en dos unidades que no pintan la respuesta (Productos notables, donde el violeta tiene otro papel, y Estructura atómica). Falta decidir si esas dos cambian. |
| **La leyenda se ve al abrir el juego** (antes de mover nada). | Al abrir, 3 de 9 casos estaban bien: la letra sale al elegir otra opción del control. Entró la versión «se ve en algún caso del juego». |
| **La misión tiene una sola respuesta.** | No es general: hay misiones que se cumplen de varias maneras a propósito (las cinco salidas del MRU). El validador ya exige que no esté cumplida al abrir y que alguien la pueda lograr. |
| **La letra de una alternativa va en negrita y en tinta.** | Las unidades no coinciden: cuatro pintan la letra de la respuesta con el color de la magnitud y una prueba suya lo exige. Falta una decisión. |
| **Un código de error por distractor.** | En 29 de las 76 ideas (9 unidades) dos distractores de un mismo «Ahora tú» comparten código, casi siempre el mismo error con otro número. Marcarlo sería exigir un cambio de criterio, no encontrar una falta. |
| **Los Datos no dan el método ni el paso hecho** («regala la fórmula»). | Depende de qué practica el ejercicio. Automático solo el caso literal (`datos-respuesta`). |
| **La explicación de cada distractor da su valor** (rehacer la cuenta del error). | Hace falta el motor de errores de cada unidad. Automático solo que el resuelto nombre cada alternativa, por su letra o su valor (`alternativa-sin-explicar`); la cuenta la rehace la prueba propia de la unidad. |
| **Datos del mundo con fuente, medidas creíbles, colores por magnitud, rótulos que no se pisan, fidelidad de los ángulos.** | Necesitan tablas o geometría de cada unidad: siguen en la prueba propia de cada unidad y de cada pieza. |
