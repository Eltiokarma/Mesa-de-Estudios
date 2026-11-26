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
