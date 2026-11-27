# Redacción · quimica.enlace-quimico · 26 nov 2026

Pasada del redactor (`docs/metodo/unidad/redaccion-delegada.md`, criterio `escribidor-escribano`) sobre una unidad ya
cerrada (`calidad: 2`). Solo texto: ningún número, respuesta, distractor, dato, dibujo, color ni letra cambió (salvo las
dos correcciones de notación de la práctica que se anotan abajo, en el punto 7). La marca `calidad: 2` se queda.

Archivos: `contenido/teoria/quimica/enlace-quimico.js` y la práctica propia de la unidad,
`plantillas/enlace-lewis/generador.js`, con su `papel.json` regenerado con `herramientas/papel-generador.js` (son los
mismos 8 problemas, con las mismas respuestas; cambian los enunciados, los pasos y las explicaciones). `enlace` y
`quimica-conceptos` también están en la ficha, pero los comparten otras unidades, así que no se tocaron.

## Qué cambió, por tipo de problema

**1. `siFuera` y explicaciones con el molde «Bien X. Pero Y.» o «X, cierto. Pero…» (lo que más se repetía: unos 35 en la
teoría y unos 40 en la práctica).** En la teoría pasan a «Sería así si…», que dice qué tendría que cambiar para que la
opción fuera cierta, y después qué pasa aquí. Cuando el alumno sí acertó en algo, eso queda en una oración completa
(«La proporción está bien, pero…»). En la práctica, cuya cabecera pedía abrir con lo que el alumno hizo bien, dejé el
mismo criterio y cambié la cabecera para decirlo; el «Bien» suelto ya no aparece.

- Antes: «Bien calcular ΔEN. Sería polar si los dos átomos jalaran distinto.» (salía también cuando la correcta era
  iónica, donde los átomos sí jalan distinto)
  Después: «Sería covalente polar si se unieran dos no metales distintos, con una ΔEN menor que 1,7.»
- Antes: «Bien la idea del octeto. Pero el Xe pasa: cuenta sus enlaces y pares.»
  Después: «Sería así si el Xe cumpliera el octeto, pero pasa de 8: cuenta 2 por cada enlace y 2 por cada par libre.»
- Antes: «Fue distinto al formarse, cierto. Después, los cuatro pares se comparten igual.» (Predice del NH₄⁺)
  Después: «Sería así si el enlace recordara de dónde salió su par. Ya formado el ion, los cuatro pares se comparten
  igual.»
- En `casoTipo` y `casoClase`, la explicación ahora dice qué hay en el caso («Aquí hay K (metal) y Br (no metal).»,
  «Aquí el Xe queda con 12.»).

**2. Telegrama con rótulo y dos puntos en soluciones, pasos y «Mira».** «CaO: metal con no metal, iónico.», «Sal seca:
iones Na⁺ (chicos, +)…», «CO₂: el carbono aporta 4…», «Sumo.», «Resto la menor de la mayor.» pasan a oraciones con sujeto
y verbo que dicen la consecuencia.

- Antes: «X conduce solo fundido y funde alto: iónico. Q funde bajo y no conduce: covalente molecular. R conduce sólido:
  metálico.»
  Después: «X funde a alta temperatura y conduce solo fundido, así que es iónico. Q funde bajo y no conduce: es covalente
  molecular. R conduce sólido, así que es metálico.»
- Antes: «Excepciones: el boro queda con 6; el azufre del SF₆, con 12.»
  Después: «Hay excepciones al octeto: el boro del BF₃ queda con 6 electrones, y el azufre del SF₆, con 12.»

**3. Reglas y condiciones que leídas con su marco no eran oración.** Las cinco reglas se reescribieron con verbo («Un metal
con un no metal forma enlace iónico: iones que se atraen en una red…»). Las cinco condiciones completan ahora «Vale si…»:

- «Vale si la ΔEN (diferencia…) es una guía; mandan los elementos. El HF…» → «Vale si primero se miran los elementos y la
  ΔEN, la diferencia de electronegatividad, se usa solo como guía: el HF, con 1,78, es covalente polar porque une dos no
  metales.»
- «Vale si metales de los grupos 1, 2 y 13…» → «Vale si se unen metales de los grupos 1, 2 y 13 con no metales…»
- «Vale si en la mayoría de las moléculas…» → «Vale si se trata de la mayoría de las moléculas, sobre todo de las que
  tienen átomos del periodo 2; …»
- «Vale si solo los átomos del periodo 3 en adelante…» → «Vale si el átomo que pasa de 8 es del periodo 3 en adelante…»
- «Vale si se mueven electrones…» → «Vale si entre un dibujo y otro solo se mueven electrones, nunca átomos…»

**4. Textos generados que salían cojos en algunas semillas.**
- «¿Qué tipo de enlace une las partículas del plata (Ag)?» (resuelve de la idea 1 y práctica) → «de la plata (Ag)».
- «Entrega sus 1 de valencia», «le quedan 0, ningún par libre», «El Si usa 4 y le quedan 0», «4 de sus 4 pares», «Lo que
  entregan los Ca (2)» (con un solo Ca) y «los 2 que le quedan forman pares libres» (un solo par): cada uno tiene ahora su
  forma para 1 y para 0.
- V/F: la solución pegaba el porqué sin decir de cuál afirmación era («I F, II V, III F. Es una red de iones…»); ahora
  «La I es falsa, la II es verdadera y la III es falsa. La I es falsa porque es una red de iones…».
- La explicación de la fórmula «inversa» decía a la vez que la opción era así y que no lo era; ahora «Ahí cada ion lleva
  su propia carga como subíndice, y así la carga total no da 0. El subíndice de cada uno es la carga del otro.»
- `POR_QUE.metalico` decía que el mar «se mueve»; ahora se mueven los electrones.

**5. Enunciados de la práctica sin verbo.** «Las partículas del KBr.», «El enlace P–Cl.», «La estructura de Lewis del
SO₃²⁻.», «Las especies O₂²⁻, NO…», «El compuesto Na₂S.» pasan a «Piensa en las partículas del KBr.», «Dos átomos forman
el enlace P–Cl.», «Vas a dibujar la estructura de Lewis del SO₃²⁻.», «Compara estas especies: …», «Piensa en el compuesto
iónico Na₂S.». «Sólido no conduce la corriente» → «No conduce la corriente cuando está sólido» (teoría y práctica).

**6. «Lee», lecturas en vivo, misiones y glosario.** «Una pila, un foquito y dos cables.» → «El probador tiene…». «La
escalera» se presenta como «la línea en escalera». Los electrones de valencia se dicen en palabras la primera vez («los de
su último nivel»). Las lecturas del probador decían «Sal seca: no prende» sin decir qué no prende; ahora «La sal seca no
prende el foquito…». Glosario: el `simple` de «enlace metálico» decía que los átomos «comparten» sus electrones, que es lo
que afirma el distractor covalente; ahora «sueltan electrones, y esos electrones se mueven entre todos». «Ocho electrones
afuera» → «en el último nivel».

**7. Práctica: dos fallas de notación (las anoto también para el auditor).**
- `SUP` solo tenía 1 a 3, así que las opciones del error QM-ION-OCTETO salían «Br7⁺», «Mg6⁻», «S6⁺». Agregué ⁴ a ⁷.
- En `formulaIonica`, `SUB[1]` es `''` y el `||` lo cambiaba por «1»: salían «Ca1I₂», «Na₂S1», «K₄S1». Cambié `||` por
  `??`. Ojo: «Ca1I₂» y «Na₂S1» eran la respuesta correcta escrita de otra forma, es decir, había dos alternativas correctas
  en esas semillas. Con el arreglo se descartan como repetidas y el generador elige otro distractor. Ningún valor cambió.

## Para el auditor (no lo cambié)

1. Ecuación de la regla de la idea 5 («orden promedio = pares compartidos ÷ número de enlaces», como fracción) se parte
   después del «=» a 390 px (`node herramientas/ecuaciones-ancho.js`). Ya estaba así antes de esta pasada; acortar los
   rótulos de la fracción no alcanzó y lo dejé como estaba.
2. Lee de la idea 2: «En cada grano hay billones de partículas». Un grano de sal tiene del orden de 10¹⁸ iones
   (trillones). «Billones» se queda corto, aunque no es falso del todo. De memoria, por confirmar.
3. Mesa «Dos átomos»: el tipo se decide por metal o no metal, y la invitación 3 dice que un metal con un no metal forma
   iones «aun por debajo de 1,7». En la mesa salen el Mg–H o el Na–H, que la química de base trata como hidruros iónicos;
   está bien para la mesa, pero no conviene generalizarlo fuera de ella.
4. `casoClase`: el `siFuera` de las opciones incorrectas ahora dice qué pasa aquí («Aquí el B queda con 6.»). Revisar que
   eso no se lea como pista antes de responder (solo se muestra después).
5. Práctica, error EN7 de la carga formal: la alternativa para el O₃ y el NH₄⁺ vale «+2», que no es la carga de la
   especie (0 y +1). La explicación nueva («Esa cuenta no es la de la carga formal…») es neutral, pero el distractor no
   sale de un error claro.
6. Idea 1, regla: la condición carga el caso del HF, que es un dato y no una condición; lo dejé porque sin él la regla
   pierde su excepción más preguntada, pero podría mudarse a una tarjeta de «Lee».

## Comprobaciones

- `node --test contenido/teoria/quimica/enlace-quimico.test.js`: 13 de 13 (incluye la simulación del validador con
  calidad 2, los topes de palabras y la tabla aparte de «Ahora tú» en 400 semillas).
- `node --test plantillas/enlace-lewis/generador.test.js`: 8 de 8; `papel.json` regenerado (mismas 8 respuestas).
- `node --test contenido/teoria/teoria.test.js`: la unidad pasa (prueba 87); 163 de 164 en total. La que falla es la del
  glosario: `app/datos/glosario/algebra.json` no está al día (obra de otra unidad). Como cambié dos `simple` del glosario
  de química, `app/datos/glosario/quimica.json` también queda por regenerar: hace falta `npm run catalogo` al integrar
  (no lo corrí, por la convivencia).
- `node herramientas/ecuaciones-ancho.js quimica.enlace-quimico`: 0 que no caben y 1 partida en mal sitio (la del punto 1
  de arriba, anterior a esta pasada).
- Muestra leída entera: 12 a 16 semillas de «Ahora tú» y 8 de «Así se resuelve» por idea, y 5 problemas por idea de la
  práctica, más los tipos de dos pasos.

## Verificación (26 nov)

Verificador de cierre de la pasada. Revisé las seis notas, rehice la cuenta de las explicaciones de alternativas con
sentido nuevo (teoría y práctica: iones, fórmula iónica, electrones transferidos y repartidos, pares libres, electrones
del central, carga formal, resonancia, N₂) y comparé el archivo con el de antes: las 119 ecuaciones de la teoría son las
mismas, ningún número de las soluciones se cayó y ninguna comparación de texto del código (`includes`, `split(':')` de
`CLASE_X`) dejó de coincidir.

Lo corregido, cada cosa con una prueba que falla con la versión anterior:

- **Nota 5 (práctica, carga formal).** El error EN7 (tomar la carga de la especie entera) daba «+2» en el O₃ y en el
  NH₄⁺, que no sale de ningún error. Ahora da la carga de la especie (O₃ → 0, con la explicación de la teoría: «Sería así
  si la carga formal fuera la de la molécula entera…»). En el NH₄⁺ esa carga es la correcta (+1) y se descarta; para que
  el NH₄⁺ siga saliendo entra un distractor nuevo, `QM-CF-SIN-ENLACES` (valencia menos libres, sin restar los enlaces;
  respaldo «hipótesis»). Prueba: `plantillas/enlace-lewis/generador.test.js`, «redacción: EN7 de la carga formal…».
- **Nota 2 (Lee de la idea 2).** Un grano de sal de unos 0,06 mg tiene unos 10¹⁸ iones: «billones» (10¹²) se quedaba
  corto por un millón. Ahora «más de un trillón de partículas». Prueba: `enlace-quimico.test.js`, «el grano de sal…».

Decidido por la sesión, Gerson revisa después:

- Nota 1 (ecuación de la regla 5 que se parte a 390 px): anterior a la pasada y de maquetación; se queda.
- Nota 3 (Mg–H y Na–H iónicos en la mesa): se queda; es la mesa de exploración y la química de base los trata así.
- Nota 4 (`casoClase` dice «Aquí el B queda con 6»): se queda; el `siFuera` se muestra después de responder, no es pista.
- Nota 6 (el HF en la condición de la idea 1): se queda; es la excepción más preguntada.

Comprobaciones: prueba de la unidad 14 de 14; `plantillas/enlace-lewis/generador.test.js` 9 de 9, con `papel.json`
regenerado (`papel-generador --revisar`: al día); validador con `calidad: 2` en 200 semillas: 0; regla del papel: 0;
`contenido/teoria/teoria.test.js`: 163 de 164, la que falla es «glosario: … archivos de la app al día»
(`app/datos/glosario/quimica.json` sin regenerar; hace falta `npm run catalogo` al integrar).

## Segunda pasada: explica (27 nov)

Gerson vio la primera pasada y dijo que los textos seguían cortos y sin mucho significado. Esta pasada sigue el punto 4
de `docs/metodo/unidad/redaccion-delegada.md` («Explica, no solo pules»): cada texto dice ahora qué significa lo que
afirma y por qué es así. Ningún número, respuesta, distractor, dato, dibujo, color ni letra cambió; los enunciados y
las preguntas de los generadores tampoco (el oráculo de la prueba los lee). La marca `calidad: 2` se queda.

Archivos: `contenido/teoria/quimica/enlace-quimico.js`, `plantillas/enlace-lewis/generador.js` y su `papel.json`
regenerado (los mismos 8 problemas, con las mismas respuestas).

### Qué cambió, por tipo de texto

- **Reglas (las cinco).** Cada una dice qué hace cada átomo con sus electrones y por qué sale lo que sale: el metal cede
  y queda positivo, el no metal recibe y queda negativo, «como los electrones que salen son los que llegan, la carga
  total da cero»; en Lewis, por qué se resta la carga del ion; en la resonancia, que ninguna estructura describe sola la
  especie y qué significa la fracción del recuadro.
- **«Vale si» (las cinco).** Cada condición dice además qué pasa cuando no se cumple: la ΔEN sola falla con el HF; con
  hierro o cobre la carga del ion no sale del grupo; un átomo del periodo 2 que pasa de 8 delata una estructura mal
  hecha; si un átomo cambia de lugar ya no es resonancia.
- **Lee y Mira.** Cada tarjeta y cada paso dicen el porqué del hecho: por qué la sal seca no conduce y disuelta sí, qué
  es una molécula, por qué el carbono del CO₂ necesita los dobles, qué es el H⁺ y por qué el dativo se llama así, por qué
  el ion real de la tiza no es ninguno de los tres dibujos.
- **`siFuera` de Predice y explicaciones de alternativas (teoría, 75 ejemplos y práctica).** Cada una nombra el
  razonamiento equivocado, dice por qué falla y qué se debió mirar. Las de los ejemplos de nivel 3, que eran listas de
  letras («La A invierte los dos primeros. La C…»), dicen ahora qué confunde cada letra y cuál es el hecho que la tumba.
- **Soluciones y pasos de «Así se resuelve».** Dicen por qué se hace la operación («así que se multiplica», «porque un
  anión ganó esos electrones») y qué significa el resultado («Queda con más de 8: su octeto es expandido», «Así no
  sobra ni falta ningún electrón»).
- **V/F.** Las razones del banco (que salen en la solución y en los `siFuera`) explican el porqué; se cuidó que no
  quedaran dos «porque» seguidos al armarse la solución.
- **Glosario.** Los 18 `simple` llevan ahora un caso cotidiano o un ejemplo de la unidad (la sal, el agua, un cable, la
  tiza, el boro del BF₃, la mula para el híbrido), dentro del tope de 14 palabras y sin usar el término.
- **Textos generados que salían raros.** «Los 2 que le quedan, agrupados de dos en dos, forman 1 par libre» tiene ahora
  su forma para un solo par, en la teoría y en la práctica.

### Seis ejemplos de antes y después

1. **Regla, idea 2 (enlace iónico).**
   Antes: «El metal entrega sus electrones de valencia y el no metal recibe los que le faltan para 8. La fórmula da
   carga total cero: dos Al³⁺ y tres O²⁻, Al₂O₃.»
   Después: «El metal entrega sus electrones de valencia y queda como ion positivo; el no metal recibe los que le faltan
   para 8 y queda negativo. Así los dos quedan con los electrones de un gas noble. Como los electrones que salen son los
   que llegan, la fórmula da carga total cero: dos Al³⁺ y tres O²⁻, Al₂O₃.»
2. **Regla, idea 5 (resonancia).**
   Antes: «Si varias estructuras de Lewis válidas solo difieren en dónde va un par, la especie real es un híbrido: los
   electrones se reparten y esos enlaces quedan iguales.»
   Después: «Si varias estructuras de Lewis válidas solo difieren en dónde va un par, ninguna describe sola la especie.
   La especie real es un híbrido, el promedio de todas: los electrones de ese par se reparten y esos enlaces quedan
   iguales. El orden de cada uno es el número de pares compartidos dividido entre el número de esos enlaces.»
3. **Alternativas, ejemplo «El litio con el nitrógeno» (idea 2, nivel 3).**
   Antes: «La A cuenta un solo litio. La B cuenta los átomos de la fórmula. La C cuenta dos veces lo que pasa. La D cuenta
   los 8 puntos del N³⁻, no los que recibió.»
   Después: «La A cuenta un solo litio, pero la fórmula tiene tres. La B cuenta los cuatro átomos de la fórmula, no los
   electrones. La C cuenta dos veces los mismos: los 3 que salen de los litios son los 3 que llegan al nitrógeno. La D
   cuenta los 8 puntos del N³⁻, pero 5 de ellos ya eran del nitrógeno: solo recibió 3.»
4. **Alternativas, ejemplo «Tres sólidos en el laboratorio» (idea 1, nivel 3).**
   Antes: «La A y la E toman a X por metálico, aunque sólido no conduce. La B llama iónico a Q, que funde a 60 °C. La C
   cambia a Q y a R: el que conduce sólido es el metal.»
   Después: «La A y la E toman a X por metálico, pero un metal conduciría también sólido, y X solo conduce fundido. La B
   llama iónico a Q, que funde a 60 °C: unos iones atados en red necesitan mucho más calor para separarse. La C cambia a
   Q y a R. El que conduce sólido es el metal, y el que funde bajo sin conducir está hecho de moléculas.»
5. **`siFuera` de Predice, idea 3 (el N₂ con doble enlace).**
   Antes: «Sería así si hubiera 12 electrones, pero los dos nitrógenos solo traen 10.»
   Después: «Sería así si hubiera 12 electrones, pero los dos nitrógenos solo traen 10. Un doble usa 4 y los cuatro pares
   libres, 8: harían falta 2 electrones que no hay.»
6. **Paso de Mira, idea 1 (el agua con sal).**
   Antes: «En el agua, los iones se separan y se mueven, así que llevan la corriente y el foquito prende.»
   Después: «Al disolver la sal, el agua separa los iones de la red. Ya sueltos, los iones se mueven y llevan su carga de
   un cable al otro: por eso el foquito prende.»

### Para el verificador

Afirmaciones nuevas que no son de libro escolar o que simplifican, para revisar:

1. **Dos explicaciones que eran falsas en algunas semillas (anteriores a esta pasada; las arreglé solo en el texto).**
   - Teoría, `casoFormula`, error QM-FORM-CARGA: «un Al³⁺ no alcanza para dos F⁻» (AlF₂; en realidad sobra carga) y
     «dos Li⁺ son demasiados para un N³⁻» (Li₂N; en realidad faltan). Ahora la frase se elige comparando las cargas
     (`F.qm < 2 * F.qx` y `2 * F.qm > F.qx`). Ningún distractor cambió.
   - Ejemplo «Tres enlaces carbono–oxígeno» (idea 5): «La B y la E ponen mal el triple» no valía para la E
     (CO₂ > CO₃²⁻ > CO deja bien al CO). Ahora dice que la E toma al doble del CO₂ por más largo que el de orden 4/3.
2. **Periodo 3 y el octeto expandido.** La tarjeta «No siempre ocho» dice que P y S «son átomos más grandes y pueden
   tener más»; el ejemplo del SF₆ dice que «su último nivel admite más electrones que el de los átomos del periodo 2», y
   el V/F del nitrógeno, que «su último nivel, el segundo, solo admite 8 electrones». Es la explicación escolar; el papel
   de los orbitales d está discutido. Que lo mire alguien de química.
3. **«Si un átomo cambia de lugar, ya no es resonancia: es otra sustancia»** (condición de la idea 5). Pensado como
   isómero; revisar que no choque con nada de Nomenclatura o Geometría molecular.
4. **«El carbono va al centro, porque es el que necesita más enlaces»** (Mira, idea 3). El criterio de libro suele ser
   «el menos electronegativo»; en el CO₂ coinciden.
5. **Datos agregados de memoria:** en el NaCl cada ion está rodeado de seis del otro (siFuera de Predice, idea 1); el
   flúor, con 3,98, es el que más jala (Lee, idea 1); el hierro y el cobre forman iones de carga que no sale del grupo
   (condición, idea 2); un radical reacciona rápido «porque ese electrón suelto se empareja fácil con el de otra
   especie» (Lee, idea 4); un enlace con más pares deja a los átomos «más juntos» y uno con menos «une con menos fuerza»
   (Lee y ejemplo, idea 5).
6. **«Le cuesta menos entregar… que recibir»** (iones, teoría y práctica) reemplaza «le es más fácil»: es la idea de
   energía de ionización dicha sin el término. «El Na⁺ se queda con el nivel de abajo, que ya estaba lleno» (Mira, idea
   2) y «así queda con el nivel de abajo, que ya está lleno» (siFuera de QM-ION-OCTETO) también, incluido el Li⁺, cuyo
   nivel de abajo tiene 2.
7. **Glosario, híbrido de resonancia:** «como la mula: no alterna entre caballo y burro» es la analogía clásica; ver si
   sirve para un alumno de 5.º.
8. **Pendiente de antes, sin cambio:** la ecuación de la regla de la idea 5 se sigue partiendo después del «=» a 390 px.

### Comprobaciones

- `node --test contenido/teoria/quimica/enlace-quimico.test.js`: 14 de 14 (incluye el validador simulado con calidad 2,
  los topes, el oráculo de «Ahora tú» en 400 semillas y las igualdades numéricas escritas).
- Validador aparte con `calidad: 2` en 200 semillas (`Teoria.problemas`): 0.
- `node --test plantillas/enlace-lewis/generador.test.js`: 9 de 9; `papel.json` regenerado con las mismas 8 respuestas
  (`papel-generador --revisar`: enlace-lewis al día; el aviso que sale es de `nomenclatura-practica`, de otra unidad).
- `node --test contenido/teoria/teoria.test.js`: 163 de 164. Falla «glosario: … archivos de la app al día», porque
  `app/datos/glosario/quimica.json` no está regenerado: hace falta `npm run catalogo` al integrar.
- `node herramientas/ecuaciones-ancho.js quimica.enlace-quimico` (servidor propio en el 4281, ya cerrado): 0 que no
  caben y 1 partida en mal sitio, la de la nota 8.
- Muestra leída: 12 semillas de «Ahora tú» por idea, 7 de «Así se resuelve» y los 75 ejemplos.

## Verificación de la segunda pasada (27 nov)

Verificador de cierre, sin commits. Lo comprobado:

- **Nada de fondo cambió.** Comparé contra HEAD, en 200 semillas por idea, «Ahora tú» (pregunta, Datos, opciones con su
  error y su correcta, respuesta, ecuaciones y dibujo) y «Así se resuelve» (enunciado, Datos, respuesta, ecuaciones), más
  Predice, las ecuaciones de Mira y de la regla, los 75 ejemplos (enunciado, alternativas, Datos, respuesta, ecuaciones) y
  el laboratorio: 0 diferencias. En la práctica, 1400 problemas (400 libres y 200 por idea): mismos enunciados, Datos,
  alternativas, errores, respuestas y nodos de la solución, y ningún número de la solución de antes falta. El `papel.json`
  tiene los mismos 8 problemas, alternativas y respuestas.
- **Las dos explicaciones corregidas por el redactor están bien en todas las semillas.** QM-FORM-CARGA: la frase dice
  «no alcanza» solo si la carga total sale negativa y «trae más carga» solo si sale positiva. Lo fija una prueba nueva en
  `enlace-quimico.test.js` («verificación 27 nov: … QM-FORM-CARGA …», 400 semillas), que falla con la versión de HEAD
  (AlF₂ y Li₂N). El ejemplo «Tres enlaces carbono–oxígeno» queda bien: la E (CO₂ > CO₃²⁻ > CO) solo invierte el CO₂ y el
  CO₃²⁻, y eso es lo que dice ahora.
- **Afirmaciones nuevas revisadas, sin cambios:** octeto expandido («átomos más grandes», «su último nivel admite más
  electrones», «el segundo nivel solo admite 8»): es la explicación escolar (el nivel 3 admite hasta 18), se queda. «El
  carbono va al centro porque necesita más enlaces»: es una de las dos guías de libro y en el CO₂ coincide con la de la
  EN; se queda. «Si un átomo cambia de lugar, ya no es resonancia: es otra sustancia»: correcto como contraste con la
  resonancia; no choca con Geometría ni Nomenclatura. Datos de memoria comprobados: NaCl con coordinación 6, EN del F
  3,98 (la misma tabla de la unidad), Fe y Cu con cargas que no salen del grupo, Na⁺ y Li⁺ con el nivel de abajo lleno.
  La mula como imagen del híbrido es la analogía clásica: **para Gerson** si le sirve a un alumno de 5.º.
- Validador con `calidad: 2` en 200 semillas: 0. Pruebas de la unidad 15 de 15; `enlace-lewis` 9 de 9 y `enlace` 80 de
  80; regla del papel (`papel-reglas.js`): 0 en `enlace-lewis`. `papel.json` regenerado con
  `node herramientas/papel-generador.js enlace-lewis`; `--revisar`: «al día».
- `teoria.test.js`: 163 de 164; falla solo «glosario … archivos de la app al día», hasta que la sesión corra
  `npm run catalogo` al integrar.
- No corrí `ecuaciones-ancho.js`: esta verificación no tocó ninguna ecuación.

Archivos de la segunda pasada: `contenido/teoria/quimica/enlace-quimico.js`, `contenido/teoria/quimica/enlace-quimico.test.js`
(prueba nueva del verificador), `plantillas/enlace-lewis/generador.js`, `plantillas/enlace-lewis/papel.json` y este informe.
