# Redacción · quimica.geometria-molecular · 26 nov 2026

Pasada del redactor (`docs/metodo/unidad/redaccion-delegada.md`, criterio `escribidor-escribano`) sobre una unidad ya
cerrada (`calidad: 2`). Solo cambió el texto. No se tocó ningún número, respuesta, distractor (salvo la redacción de tres
opciones de ebullición, ver el punto 5), dato, dibujo, color ni letra, y la marca `calidad: 2` se queda.

Archivos: `contenido/teoria/quimica/geometria-molecular.js` y la práctica propia de la unidad,
`plantillas/geometria-fuerzas/` (`generador.js`, `papel.json` regenerado con `herramientas/papel-generador.js`, una línea
de `casos.json` y una regex de `generador.test.js`). `enlace` también está en la ficha, pero la comparte Enlace químico,
así que no se tocó.

## Qué cambió, por tipo de problema

**1. `siFuera` del molde «X, cierto. Pero Y.» o «Bien X. Pero Y.»** Era lo que más se repetía: unos 30 en la teoría y
unos 20 en la práctica. Pasan a «Sería así si…», que dice qué tendría que cambiar para que la opción fuera cierta, y
después qué pasa aquí. Ninguna práctica exigía abrir con «Bien», así que no quedó ningún «Bien».

- Antes: «Bien contar los átomos. Pero los pares libres también ocupan lugar.» (forma)
  Después: «Sería así si el átomo central no tuviera pares libres. Los pares libres también ocupan lugar y empujan a los átomos.»
- Antes: «El par empuja, cierto. Pero hay tres H, no dos: no puede ser angular.» (Predice 1)
  Después: «Sería así con dos H, como en el agua. El NH₃ tiene tres H alrededor del N, y con tres no queda angular.»
- Antes: «Más masa suele dar más London, cierto. Aquí pesa más la otra atracción.» (ebullición)
  Después: «Sería así si solo importaran las fuerzas de London, que crecen con la masa. Aquí pesa más otra cosa: el NH₃ forma puentes de hidrógeno.»

**2. Verdadero o falso: el porqué suelto.** La solución pegaba el porqué sin decir de qué afirmación era («I F, II F, III
V. Se nombra solo por los átomos.»). Ahora dice «La I es falsa: la forma se nombra solo por los átomos.», y los porqués de
los cuatro bancos se completaron con su sujeto («tiene tres» → «un carbono sp² tiene tres regiones»; «tiene un H unido a
F» → «el HF tiene un H unido a F»). El `siFuera` pasó de «Bien las otras dos.» a «Las otras dos están bien juzgadas, pero…».

**3. Telegrama en soluciones, pasos y ejemplos.** Rótulos con dos puntos encadenados pasan a oraciones con sujeto y verbo.

- Antes: «CCl₄: cuatro flechas iguales en el tetraedro: se anulan.»
  Después: «En el CCl₄, las cuatro flechas son iguales y se anulan en el tetraedro.»
- Antes: «Apolar: no hay dipolo-dipolo. Sin H unido a N, O o F: no hay puente de hidrógeno. Queda London.»
  Después: «Como es apolar, no hay dipolo-dipolo, y como no tiene H unido a N, O o F, no hay puente de hidrógeno. Solo quedan las fuerzas de London.»
- Antes: «Sin el par, los átomos forman una pirámide: forma piramidal.» (Mira 1)
  Después: «Si no se cuenta el par, los cuatro átomos forman una pirámide: la forma es piramidal.»

**4. Las cuatro condiciones, leídas con «Vale si».** Tres no eran oración: «Vale si doble o triple: una región. Con 5:
…», «Vale si se mira en 3D. Un par libre…», «Vale si para moléculas de tamaño parecido; …». Ahora: «Vale si el central
tiene hasta cuatro regiones, y cada doble o triple cuenta como una; con cinco salen bipirámide, balancín…» (la prueba A1
pide esos nombres en la condición), «Vale si la forma se mira en 3D, no en el dibujo del papel.» y «Vale si las moléculas
que se comparan tienen un tamaño parecido.». Lo que no era condición pasó a la regla: «Cada enlace pi tiene 2
electrones» (idea 2), la excepción de los pares opuestos XeF₂ y XeF₄ (idea 3) y «al hervir se separan moléculas sin
romper enlaces» (idea 4).

**5. Textos generados que salían cojos en algunas semillas.**
- «2 enlaces y 0 pares libres», «tiene ningún par libre» y «0 pares libres: forma tetraédrica» pasan a «ningún par libre»
  o «no tiene pares libres» (helper `parTxt` en la teoría; `desc` en la práctica).
- «se ordenan como una trigonal plana» → «se ordenan como un triángulo plano»; la ecuación del resuelto muestra AX₂E₂ con
  subíndices, como ya hacía «Ahora tú».
- «1 enlace pi, de 2 electrones cada uno» → «Hay 1 enlace pi, que tiene 2 electrones.»
- Dos dos puntos seguidos en las razones de ebullición: «El Br₂: es más grande: más fuerzas de London» → «El Br₂: es más
  grande, con más fuerzas de London» (igual el n-pentano y el HCl). Es la redacción de la opción correcta, no su sentido;
  por eso cambió la línea 321 de `casos.json`.
- Resuelto de ebullición: «El etanol forma puentes de hidrógeno; el CH₃OCH₃ no: sus moléculas se atraen más» dejaba
  «sus» apuntando al CH₃OCH₃. Ahora: «Las moléculas del etanol se atraen más, porque el etanol forma puentes de hidrógeno
  y el CH₃OCH₃ no.»

**6. Enunciados de la práctica sin verbo.** «La molécula H₂C=CH₂.» → «La fórmula de la molécula es H₂C=CH₂.»; «El HCl:
molécula polar; sin H unido a N, O o F.» → «El HCl es una molécula polar y no tiene H unido a N, O o F.»; «El HCl y el
F₂, a 1 atm.» → «Se comparan el HCl y el F₂, a 1 atm.»; «Las moléculas …» → «Se comparan las moléculas …» (la regex de
`generador.test.js` que lee esa lista pasó de «Las moléculas» a «las moléculas»). La solución de «¿Qué atracciones hay?»
ya no repite el enunciado: dice qué da cada rasgo («Como es polar, tiene dipolo-dipolo; …, y London la tienen todas.»).

**7. «Lee», «Mira», glosario y laboratorio.** «de la estructura de Lewis (Enlace químico)» → «como los que viste en la
estructura de Lewis»; «Tres atracciones» enlaza las tres en una oración que dice quién suma cuál; «esa es la trampa
medida» (jerga de la investigación) → «esa es la trampa del examen»; glosario: «El enlace de en medio, que tiene todo
enlace.» → «El primer enlace entre dos átomos, el que va justo entre ellos.» y «Una molécula sin lados con carga.» → «Una
molécula sin un lado algo positivo y otro algo negativo.».

**8. Una ecuación que se partía a 390 px** (anterior a esta pasada): la regla de la idea 2 juntaba «doble…; triple…» en
un solo tramo; ahora van separados por el `SEP` de siempre.

## Para el auditor (no lo cambié, o lo cambié solo en el texto)

1. **QM-PI-DOBLE** (electrones pi, valor 4·p): la explicación decía «cuenta los electrones del enlace entero, con el
   sigma», falso cuando hay un triple (H–C≡N da 8, y el triple tiene 6). Reescribí la explicación para que diga lo que el
   valor hace («Sería así si cada enlace pi tuviera 4 electrones»), en la teoría y en la práctica. El valor no cambió.
2. Ejemplo 10 de la idea 2 (PCl₅, sp³d): «El fósforo puede usarlo porque es del periodo 3, donde ya hay orbitales d».
   Es el modelo escolar; la química actual discute que el octeto expandido use orbitales d. Decide si basta así.
3. Condición de la idea 4: «Vale si las moléculas que se comparan tienen un tamaño parecido.» Los ejemplos del NH₃ y el
   PH₃ o del H₂O y el H₂S comparan masas distintas, y ahí el puente gana igual. La condición vale para el orden general
   de las fuerzas; quizá convenga decir «cuando ninguna forma puentes de hidrógeno».
4. «Puente de hidrógeno: un H unido a N, O o F atrae un par libre de N, O o F vecino» (dato) frente al glosario, que dice
   «un par libre de otra molécula vecina» sin nombrar N, O o F. No es falso, pero las dos versiones no coinciden.
5. Práctica `cualPolar` y `puente`: «Se comparan las moléculas X, Y, Z, W.» sigue siendo una lista sin «y» final, porque
   la prueba la separa por comas.

## Comprobaciones

- `node --test contenido/teoria/quimica/geometria-molecular.test.js`: 15 de 15 (incluye la simulación del validador con
  calidad 2 y los oráculos de «Ahora tú» en 400 semillas).
- `node --test contenido/teoria/teoria.test.js`: la unidad pasa (topes de palabras incluidos). La última corrida tuvo una
  falla ajena: `geometria.puntos-notables`, glosario de 31 palabras, de otra unidad en obra.
- `node --test plantillas/geometria-fuerzas/generador.test.js`: 8 de 8; `papel.json` regenerado (8 problemas).
- `node herramientas/ecuaciones-ancho.js quimica.geometria-molecular`: la primera corrida marcó la partida del punto 8;
  arreglada, la segunda dio «todo cabe» (40 pantallas).
- Lectura de 40 semillas por idea de «Ahora tú», 6 de «Así se resuelve» y 300 de la práctica, en busca de concordancias,
  ceros y porqués sueltos.

## Verificación (26 nov)

Verificador de cierre de la pasada. Revisé las cinco notas, rehice la cuenta de las explicaciones de alternativas con
sentido nuevo (regiones, ángulos, forma, hibridación, sigma y pi, polaridad, fuerzas y ebullición, en la teoría y en la
práctica) y comparé con la versión de antes: de las 75 ecuaciones solo cambian las dos que el redactor anotó (AX₂E₂ con
subíndices y el `SEP` de la regla 2), y siguen coincidiendo las comparaciones de texto del código (`como.split('; ')`,
`bien.startsWith('Puente')`, la regex «las moléculas» de la prueba).

Lo corregido, con una prueba que falla con la versión anterior:

- **«Sería así si la molécula fuera plana» a moléculas planas** (hallazgo propio). Las explicaciones nuevas del ángulo de
  90° (QM-ANGULO-PLANO) y de la forma «del papel» (EN8) decían eso al BF₃, el BCl₃, el CH₂O o el SO₃, que son planos, y a
  moléculas angulares o en T, que también lo son. Ahora: «Sería así si los enlaces formaran una cruz, como en el dibujo
  del papel…» y «Sería así si los átomos se repartieran por igual en el plano del papel…», en la teoría y en la práctica.
- **QM-HIB-SIEMPRE-SP3 en la práctica** (hallazgo propio). Cuando el central es sp³ sin pares libres (CH₄, CCl₄, CHCl₃),
  la alternativa vale sp², y la explicación decía «No todo átomo central es como el carbono del metano». Ahora dice su
  valor: «Sería sp² con tres regiones; este átomo tiene cuatro.» (y «Sería sp³ con cuatro regiones…» en el otro caso).
- **Nota 3 (condición de la idea 4).** «Vale si las moléculas que se comparan tienen un tamaño parecido» dejaba fuera los
  ejemplos del NH₃ y el PH₃ o del H₂O y el H₂S. Ahora: «Vale si las moléculas tienen un tamaño parecido, o si una forma
  puentes de hidrógeno: el puente gana aun frente a una molécula más pesada, como el NH₃ frente al PH₃.»

Pruebas nuevas: `geometria-molecular.test.js` («redacción: «plana» no se le dice a una molécula plana…») y
`plantillas/geometria-fuerzas/generador.test.js` («redacción: el dibujo del papel no se confunde con «plana»…»).

Decidido por la sesión, Gerson revisa después:

- Nota 1 (QM-PI-DOBLE): la explicación del redactor ya da el valor (4 por cada pi); verificado, se queda.
- Nota 2 (PCl₅ y orbitales d): se queda el modelo escolar, que es el que pide el examen.
- Nota 4 (puente de hidrógeno en el dato y en el glosario): no se contradicen; se queda.
- Nota 5 (lista sin «y» en «Se comparan las moléculas…»): se queda, la prueba la separa por comas.

Comprobaciones: prueba de la unidad 16 de 16; `plantillas/geometria-fuerzas/generador.test.js` 9 de 9, con `papel.json`
regenerado (al día); validador con `calidad: 2` en 200 semillas: 0; regla del papel: 0; `contenido/teoria/teoria.test.js`:
163 de 164 (falla solo el glosario de `app/datos/`, por regenerar con `npm run catalogo`).

## Segunda pasada: explica (27 nov)

Gerson vio la unidad y dijo que los textos seguían cortos y sin mucho significado. Esta pasada sigue el punto 4 de
`docs/metodo/unidad/redaccion-delegada.md` («Explica, no solo pules») con los topes nuevos. Solo texto: ningún número,
respuesta, distractor, dato, dibujo, color ni letra cambió; `calidad: 2` se queda. La apertura (`contenido/aperturas/`)
no se tocó: la teoría ahora retoma su hilo (los cuatro enlaces iguales del metano a 109,5°) en dos tarjetas de «Lee».

Archivos: `contenido/teoria/quimica/geometria-molecular.js`; `plantillas/geometria-fuerzas/generador.js`, su `papel.json`
(regenerado: cambian 8 soluciones) y una línea de `generador.test.js` (ver «Para el verificador», punto 1).

### Qué se cambió, por tipo

1. **Reglas (las cuatro).** Cada una dice ahora por qué vale y un caso: las regiones se repelen porque tienen carga
   negativa, y el agua tiene cuatro regiones y es angular (1); el átomo mezcla tantos orbitales como regiones tiene, y el
   sigma es el par que va entre los átomos (2); qué es ser polar (un lado algo positivo y otro algo negativo), con el CO₂
   y el agua como casos (3); por qué hierve más alto la que más se atrae, con el agua frente al H₂S (4).
2. **Recuadro de la idea 1.** Sus rótulos («2 regiones: lineal, 180° · 3: trigonal plana…») se leían sueltos: la regla
   dice debajo que el número cuenta regiones y que las tres primeras formas no tienen pares libres. Los recuadros de las
   ideas 2 a 4 ya se leían como frase y la regla los explica.
3. **«Vale si» (cuatro).** Cada condición dice qué pasa si no se cumple: contar un doble como dos regiones da una de más
   (1); olvidar los pares hace que el O del agua parezca sp, y contar cada par del doble hace que el C del CO₂ parezca sp³
   (2); en el papel, dos átomos iguales dibujados opuestos parecen anularse aunque en el espacio queden del mismo lado (3);
   sin puentes, una molécula mucho más grande puede hervir más alto por London aunque sea apolar (4).
4. **`siFuera` de las cuatro predicciones y explicaciones de «Ahora tú».** Dejan de decir solo «Sería así con otro
   número…»: nombran el razonamiento («Contaste cada par compartido como una región»), dicen por qué falla y dan el número
   que tiene este caso («Este central tiene 5 regiones»). Las de polaridad dicen ahora cuál de las dos cosas falta (los
   pares libres del central o los átomos distintos), y las de fuerzas dependen de la molécula (antes, «Sería así si la
   molécula fuera polar y no tuviera H unido a N, O o F» salía igual para el CCl₄, que es apolar, y para el HF, que sí tiene
   puente).
5. **Soluciones y pasos de «Así se resuelve».** Dicen por qué y qué significa: en qué figura se ordenan las regiones
   (nuevo `FIG` en la práctica), cuántos orbitales mezcla el átomo (`MEZCLA`: «5 orbitales salen de mezclar un s, tres p y
   un d»), qué atracción decide y qué hace con la temperatura. Las de verdadero o falso completan su porqué («el par libre
   del N es una cuarta región y empuja a los tres H hacia abajo»).
6. **Lee y Mira.** Una idea por tarjeta, con el porqué: por qué se repelen las regiones, por qué el dibujo de Lewis
   engaña, qué problema resuelve la hibridación (el del metano de la apertura), por qué el pi va por los costados, cómo se
   suman las flechas (dos personas que jalan una soga), qué son las fuerzas de London. Los pasos de Mira dicen por qué el
   par libre cierra el ángulo, por qué se vence el puente al hervir y qué pasaría si el agua siguiera la tendencia.
7. **Ejemplos de nivel 3 (los 20, con sus explicaciones de alternativas).** Cada letra dice qué razonamiento sigue y por qué
   falla, en vez de un rótulo («La D cuenta una región de más» → «La D suma una región que no existe: cuatro enlaces y un
   par son cinco, no seis»). En los de verdadero o falso se dice qué afirmación acepta o niega cada letra. Se completaron
   además diez ejemplos de nivel 1 y 2 de una sola línea seca.
8. **Glosario.** Los 13 `simple` llevan una imagen de la vida del alumno o un caso: el globo amarrado, la V del agua, las
   patas de un compás, el café con leche, los dos extremos de una pila, el aceite, la mano que une a dos moléculas.
9. **Práctica (`geometria-fuerzas`).** Las explicaciones de los 13 tipos se reescribieron con el mismo criterio (máximo
   30 palabras, el límite de `nucleo/papel-opciones.js`), y las soluciones dicen el porqué. Arreglos de paso: la EN8 de
   las moléculas de cinco o seis regiones hablaba del «plano del papel» para una bipirámide (ahora dice lo de los pares
   libres), y la QM-FUERZA de «Puente…» repetía «no tiene H unido a N, O o F» dos veces en el HCl.

### Antes y después

- **Regla, idea 1.** *Antes:* «Las regiones de electrones del átomo central, enlaces y pares libres, se alejan lo más
  posible. La forma molecular se nombra solo por los átomos, aunque los pares libres también empujan.» *Después:* «Las
  regiones de electrones del átomo central (enlaces y pares libres) se repelen, porque tienen carga negativa, y se alejan
  lo más posible. La forma molecular se nombra solo por los átomos, aunque el par libre empuja: el agua tiene cuatro
  regiones y es angular. En el recuadro, el número cuenta regiones; las tres primeras formas no tienen pares libres.»
- **Regla, idea 4.** *Antes:* «Entre moléculas hay fuerzas de London (siempre), dipolo-dipolo (si son polares) y puente
  de hidrógeno (H unido a N, O o F). A más atracción, mayor temperatura de ebullición, porque al hervir se separan
  moléculas sin romper enlaces.» *Después:* «Entre moléculas hay fuerzas de London, que tienen todas; dipolo-dipolo, si
  son polares, y puente de hidrógeno, si tienen un H unido a N, O o F. Al hervir, las moléculas se separan enteras, sin
  romper enlaces, y cuanto más se atraen, más temperatura hace falta para separarlas: el agua, con sus puentes, hierve
  más alto que el H₂S.»
- **Condición, idea 2.** *Antes:* «Vale si los pares libres se cuentan como regiones y cada enlace doble o triple se
  cuenta como una sola.» *Después:* «Vale si los pares libres se cuentan como regiones y cada doble o triple, como una
  sola. Si olvidas los pares, el O del agua parece sp y es sp³; si cuentas cada par del doble, el C del CO₂ parece sp³ y
  es sp.»
- **Alternativa de la predicción, idea 1** (NH₃, «Tetraédrica, porque hay cuatro regiones»). *Antes:* «Sería así si la
  forma se nombrara por las regiones. Las cuatro sí van en tetraedro, pero la forma se nombra solo por los átomos.»
  *Después:* «Contaste bien las cuatro regiones, y sí se ordenan en tetraedro. Pero la forma se nombra por los átomos, y
  en una punta no hay átomo sino el par libre: el N y los tres H forman una pirámide.»
- **Alternativa de «Ahora tú», idea 2** (electrones pi, el valor 4·p). *Antes:* «Sería así si cada enlace pi tuviera 4
  electrones. Cada uno tiene solo 2.» *Después:* «Sería así si cada enlace pi tuviera 4 electrones. Un enlace pi es un
  solo par compartido, así que tiene 2, y los electrones del sigma no se cuentan como pi.»
- **Explicación de alternativas, ejemplo «La razón del CCl₄»** (idea 3, nivel 3). *Antes:* «La B y la C miran un solo
  factor. La D acierta en apolar con una razón falsa: los C–Cl sí son polares. / La E lee la molécula en el plano.»
  *Después:* «La B y la C miran solo los enlaces: que el Cl jale más y que los átomos sean distintos hace polares los
  enlaces, no la molécula. La D acierta en apolar con una razón falsa: los C–Cl sí son polares. / La E lee la molécula en
  el papel, en cruz; y aun en una cruz, cuatro Cl iguales anularían sus flechas.»

### Para el verificador

1. **Prueba ajustada.** `plantillas/geometria-fuerzas/generador.test.js`, línea 92, buscaba la explicación de
   QM-REGION-PARES por su texto («Un par libre es una región, no dos.»); ahora la busca por su id, y sigue comprobando lo
   mismo (que solo salga si el central tiene pares libres).
2. **Afirmaciones nuevas, ciertas en el modelo escolar pero sin fuente abierta en esta pasada:** el par libre empuja más
   «porque solo lo atrae el N y ocupa más espacio cerca de él»; el segundo y el tercer par van por los costados porque la
   línea entre los núcleos «ya está ocupada» por el sigma; un carbono no pasa de cuatro regiones «porque solo tiene un
   orbital s y tres p para mezclar»; las fuerzas de London aparecen «porque los electrones se mueven y por un instante
   dejan un lado cargado»; si el agua hirviera cerca de −80 °C «sería un gas a temperatura ambiente»; el peine cargado
   atrae a las moléculas de agua «por el lado de carga contraria»; «las que forman puentes son polares y suman
   dipolo-dipolo» (vale para todas las moléculas de la unidad: NH₃, HF, H₂O, CH₃OH, H₂O₂, CH₃NH₂).
3. **Corregido de paso (hallazgo propio).** Mi primer borrador del QM-ANGULO-PLANO decía «con menos de seis regiones, los
   enlaces se separan más de 90°», falso para la bipirámide (tiene 90°). Ninguna molécula de esa pregunta tiene cinco
   regiones, pero quedó «con dos, tres o cuatro regiones», en la teoría y en la práctica.
4. **El hilo con la apertura.** La tarjeta «En tres dimensiones» dice que los enlaces del metano no quedan a 90° sino
   «más separados», sin dar el número, y la tarjeta «Orbitales que se mezclan» abre con el choque de la apertura (con un s
   y tres p, los cuatro enlaces saldrían distintos). Ninguna nombra la apertura, para que se entiendan sin haberla leído.
5. **Lo previo.** Ninguna tarjeta de «Lee» ni consigna dice la forma del NH₃, la hibridación del C₂H₂, la polaridad del
   CH₂Cl₂ ni la ebullición del agua frente al H₂S. Las reglas y condiciones que nombran el agua y el H₂S van después de la
   predicción. Las opciones no cambiaron.
6. **Fuera de mi unidad (aviso).** Corrí `node herramientas/papel-generador.js` sin argumento y regeneró el `papel.json`
   de todas las plantillas: cambiaron también los de `enlace-lewis` y `mol-practica`, desde los generadores que otros
   redactores tienen en obra. No los restauré (no sé si ya estaban regenerados antes); quien integre debe regenerarlos o
   revisarlos al cerrar esas unidades.
7. `herramientas/validar-ejercicios.js` pide explicaciones de 20 palabras o menos; las de la práctica llegan a 30, el
   límite de `nucleo/papel-opciones.js`, como en la segunda pasada de Materia y energía.

### Comprobación (27 nov)

- `contenido/teoria/quimica/geometria-molecular.test.js`: 16 de 16.
- Validador con `calidad: 2` (`Teoria.problemas`, 200 semillas): 0.
- `plantillas/geometria-fuerzas/generador.test.js`: 9 de 9; `papel-generador.js --revisar`: al día; `papel-reglas.js`:
  nada de esta plantilla.
- `contenido/teoria/teoria.test.js`: 163 de 164; falla solo «glosario … archivos de la app al día» (falta
  `npm run catalogo`, como prevé el método).
- `node herramientas/ecuaciones-ancho.js quimica.geometria-molecular` (servidor propio en el puerto 4282, ya cerrado):
  todo cabe, 40 pantallas.
- Lectura de 16 a 20 semillas por idea de «Ahora tú», las de «Así se resuelve» y 300 por idea de la práctica, en busca de
  concordancias y textos que no cuadren con la molécula.

## Verificación de la segunda pasada (27 nov)

Verificador de cierre, sin commits. Lo comprobado:

- **Nada de fondo cambió.** Contra HEAD, en 200 semillas por idea: «Ahora tú» (pregunta, Datos, opciones con su error y
  su correcta, respuesta, ecuaciones, dibujo), «Así se resuelve», Predice, las ecuaciones de Mira y de la regla, los
  ejemplos y el laboratorio: 0 diferencias. Práctica: 1200 problemas con los mismos enunciados, Datos, alternativas,
  errores, respuestas y nodos, y ningún número de la solución de antes falta. Mismo `papel.json` salvo el texto de las
  soluciones.
- **Prueba ajustada (línea 92 de `generador.test.js`).** Buscar por `QM-REGION-PARES` comprueba lo mismo que antes: ese id
  solo lo usa la explicación de «contaste cada par libre dos veces», en HEAD y ahora.
- **Afirmaciones de modelo escolar, revisadas y bien:** el par libre empuja más porque lo atrae un solo núcleo; el pi va
  por encima y por debajo del eje porque el sigma ocupa la línea entre los núcleos; el carbono no pasa de cuatro regiones
  porque solo tiene un s y tres p; London por el movimiento de los electrones; el agua sería gas cerca de −80 °C sin sus
  puentes; las que forman puentes también son polares (todas las de la unidad); a más regiones, ángulo más cerrado.
- **Corregido:** dos frases decían que el puente «pesa más» que la diferencia de London o de tamaño, en un ejemplo que
  justo compara masas (agua frente a H₂S, NH₃ frente a PH₃): ahora dicen «cuenta más». Es solo palabra; no hay prueba.
- **`papel.json`.** Regenerados con `node herramientas/papel-generador.js <id>` los de `geometria-fuerzas`,
  `enlace-lewis`, `nomenclatura-practica` y `mol-practica` desde sus generadores actuales; `--revisar`: «al día». Los
  cuatro conservan sus 8 problemas con las mismas alternativas y respuestas que en HEAD.
- Validador con `calidad: 2` en 200 semillas: 0. Unidad 16 de 16; `geometria-fuerzas` 9 de 9; regla del papel: 0.
- `teoria.test.js`: 163 de 164; falla solo «glosario … archivos de la app al día» (falta `npm run catalogo`).
- No corrí `ecuaciones-ancho.js`: no cambió ninguna ecuación.

Archivos de la segunda pasada: `contenido/teoria/quimica/geometria-molecular.js`, `plantillas/geometria-fuerzas/generador.js`,
`plantillas/geometria-fuerzas/generador.test.js`, `plantillas/geometria-fuerzas/papel.json` y este informe.
