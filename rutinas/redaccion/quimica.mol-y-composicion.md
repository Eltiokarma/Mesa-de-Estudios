# Redacción · quimica.mol-y-composicion (26 nov 2026)

Pasada del redactor (`docs/metodo/unidad/redaccion-delegada.md`, criterio `escribidor-escribano`) sobre
`contenido/teoria/quimica/mol-y-composicion.js` y la práctica de su ficha: `plantillas/mol-practica/` (generador y
`papel.json`, regenerado con `node herramientas/papel-generador.js mol-practica`) y `plantillas/mol-composicion/papel.json`
(solo la notación de Datos). La escena vieja `plantillas/mol-composicion/index.html` («rehacer») no se tocó.

No se cambió ningún número, respuesta, distractor, dato, color, ecuación ni dibujo. Las opciones de Predice y de «Ahora
tú» conservan su texto; cambiaron sus `siFuera` y las soluciones. Se mantuvo la notación decidida: N como número de
entidades (con su aviso en «Lee»), masas atómicas sin «=» y redondeos con «≈». `calidad: 2` sigue.

## Qué cambió, por tipo de problema

1. **`siFuera` y explicaciones en molde «Bien X. Pero Y.» (teoría: unos 75; práctica: todas, unas 70).** Se
   reescribieron con el acierto dicho en palabras, el caso en que la respuesta sería cierta y la razón, en varias formas
   («Sería… si…; aquí…», «X está bien, pero…», «Ese número cuenta…, y se pide…»). En la práctica no había prueba que
   exigiera el «Bien»; la cabecera del generador ya no lo promete.
   - Antes: «Bien promediar. Pero 25 u sería con los tres igual de abundantes; el ²⁴Mg es casi 8 de cada 10.»
     Después: «El promedio sería 25 u si los tres isótopos fueran igual de abundantes, pero el ²⁴Mg es casi 8 de cada
     10 átomos y lo jala hacia 24 u.»
   - Antes: «Eso cuenta átomos: cada H₃PO₄ trae 8. Se piden moléculas.» Después: «Ese número cuenta átomos: cada
     molécula de H₃PO₄ trae 8, y se piden moléculas.»
   - Antes: «Bien los ${c} de ${e} por unidad y los … mol. Sobra multiplicar otra vez por 2.» Después: «Contar 3 átomos
     de C por unidad y usar los 2 mol está bien, pero sobra multiplicar otra vez por 2.»
2. **Soluciones y pasos en rótulo (ejemplos, Mira, «Así se resuelve», «Ahora tú», práctica).** «Moles:», «Átomos:»,
   «En 100 g:», «Entre el menor: 1 : 1,5. Por 2: 2 : 3.», «M(NaCl) = … g/mol.» sueltos pasaron a oraciones con verbo y
   el enlace dicho. Los repartos de alternativas («la A …; la B …; la C …; la D …») se partieron en dos oraciones con
   «y» y verbos completos («da por falsa la II», «toma los 500 mg como si fueran 500 g»).
   - Antes: «Entre el menor: 1 : 2,67, como 1 : 8/3. Por 3: 3 : 8.» Después: «Al dividir entre el menor queda
     1 : 2,67 ≈ 1 : 8/3, y al multiplicar por 3, 3 : 8.»
   - Antes (aportes): «litio-6: 0,0759 × 6,015 ≈ 0,457; litio-7: …» Después: «el litio-6 aporta 0,0759 × 6,015 ≈ 0,457;
     el litio-7 aporta …».
   - Pasos «pide»/«datos» sin verbo pasan a «Se pide…», «Se conocen…».
   - Enunciados de la práctica sin verbo («Una muestra de 27 g de H₂O.», «El compuesto NaOH.», «La sal hidratada …»)
     pasan a «Se tiene una muestra de…», «Se analiza el compuesto…», «Se tiene la sal hidratada…».
3. **«Vale si» roto: las seis condiciones.** Ninguna continuaba la frase. Idea 1: «Las abundancias…» → «las abundancias
   de todos los isótopos del elemento suman 100 %». Idea 2: «Cada masa atómica va por su subíndice. Di qué entidad
   cuentas…» → «la masa molar suma cada masa atómica por su subíndice y queda dicho qué entidades se cuentan…». Idea 3:
   «Igual con iones… Para contar átomos, por Nₐ.» → «se cuentan todos los átomos de una unidad, con el paréntesis y el
   agua de los hidratos (CuSO₄·5H₂O: 5 aguas por unidad); los iones de una sal se cuentan igual.» Idea 4: el dato de la
   muestra («en m gramos hay % · m / 100») pasó a la regla, que es la que debe decir lo que pide «Ahora tú», y la
   condición quedó «M es la masa molar de la fórmula completa, también con el agua cuando el compuesto es un hidrato».
   Idea 5: «cada porcentaje se lee como gramos en 100 g del compuesto y k sale entero; sin la masa molar, solo se puede
   hallar la empírica». Idea 6: «el sistema está cerrado, como pide Lavoisier: …». Para esta última se cambió una línea
   de `mol-y-composicion.test.js`, que fijaba el inicio roto (`/^Lavoisier pide un sistema cerrado/` →
   `/^el sistema está cerrado, como pide Lavoisier/`).
4. **Reglas y aprendizaje telegráficos.** Idea 6: «Sistema cerrado: … Un compuesto: … Dos compuestos de lo mismo: …» →
   tres oraciones completas con la ley de Dalton dicha como en Datos. Ídem el `aprendizaje`. Idea 5: «Si sale ,5,
   multiplica todo por 2; ,33 o ,67, por 3» → «si un cociente termina en ,5, multiplica todo por 2, y si termina en ,33
   o ,67, por 3».
5. **Lecturas en vivo** (tope 12): «20 % de cloro-35 → promedio 36,57 u, …» → «20 % de cloro-35 da 36,57 u, cerca del
   cloro-37»; «n = 0,5 mol de H₂O → m = …» → «…, que pesan m = …»; «2 H₂O → 4 H, 2 O (2 × los subíndices)» → «En 2 H₂O hay
   4 H y 2 O»; composición: «El O es 1 de 3 átomos y 88,9 % de la masa»; leyes: «En 36 g de agua, O : H = 32 : 4 = 8 : 1».
   La de la idea 5 («C₂H₄: C 85,7 % y H 14,3 %; C : H = 2 : 4 = 1 : 2») se dejó: ya está en el tope y la fija la prueba.
6. **Lee y consignas.** Tarjetas partidas en ráfaga se enlazaron («…pero unos tienen 18 neutrones y otros 20: son dos
   isótopos…»; «Así como una docena son 12 cosas, un mol son…»; «Lo mismo vale para cualquier sustancia: su masa
   molar…»). La tarjeta «Convención del examen» decía «H = 1, C = 12…», contra la notación decidida: ahora «H 1, C 12…».
7. **Signo «≈» en números chicos.** La función `ig` medía la tolerancia en absoluto, así que «28 / 6,02 × 10²³ =
   4,651 × 10⁻²³ g» salía con «=» (es un redondeo). Ahora la tolerancia es relativa; solo cambiaron esas igualdades
   (ejemplo «Una sola molécula de agua» y el tipo «una sola molécula» de «Ahora tú»), comprobado con un volcado antes y
   después.
8. **Sueltos.** Concordancias armadas («X pesa 3 de eso» → «3 veces eso»; «queda 11,2 g» → «quedan 11,2 g»), «más chica»
   → «más pequeña», «la medida chiquita» → «la unidad muy pequeña» (glosario), «Mismos moles, mismo número de
   moléculas.» → oración completa; laboratorio: consignas y retos sin flechas ni rótulos, lectura «76 % de 35 u y 24 %
   de 37 u dan 35,48 u». `mol-composicion/papel.json`: los ocho paréntesis «(N = 14, H = 1…)» pasan a «(masas
   atómicas: N 14; H 1…)».

## Para el auditor (no se cambió)

1. **Glosario de la app:** cambiaron dos textos del glosario (`simple` de «unidad de masa atómica» y un ejemplo de
   «cantidad de sustancia»); `app/datos/glosario/quimica.json` queda desfasado hasta correr `npm run catalogo` al
   integrar (por eso falla «glosario: … archivos de la app al día» en `teoria.test.js`; no se corrió por convivencia).
2. **La tiza (idea 3 y 4):** la unidad dice que la tiza es «casi toda carbonato de calcio». Muchas tizas escolares son de
   yeso (sulfato de calcio); conviene «una tiza de carbonato» o revisar la que se vende en el Perú (de memoria, por
   confirmar).
3. **`mol-composicion/papel.json`, p10:** usa 22,4 L/mol en condiciones normales, que es de la unidad de Gases, no de
   esta. Y el papel viejo no trae campo `datos` (pasa la regla del papel igual).
4. **Laboratorio, reto del mayor % de hidrógeno:** la mejor «molécula» del control es CH₁₄, que no existe; el texto dice
   «Aun con muchísimos H por cada C…», lo que es cierto en el juego pero no en la química.
5. **Ejemplo «El número de masa del liviano» (idea 1):** usa A para el número de masa mientras las alternativas se
   rotulan A–E; la respuesta va sin letra. Podría leerse «A = 35» como la alternativa A.
6. **Ejemplo «El óxido del imán» (idea 5):** la B (Fe₂O₃) se explica «multiplica por 2 en vez de por 3»; 1 : 1,33 × 2 da
   2 : 2,67, que hay que redondear además para llegar a 2 : 3.

## Pruebas

- `node --test contenido/teoria/quimica/mol-y-composicion.test.js`: 14 en verde.
- `node --test plantillas/mol-practica/generador.test.js plantillas/mol-composicion/motor.test.js`: 49 en verde.
- `contenido/teoria/teoria.test.js`: 163 de 164; la falla es la del glosario de la app (punto 1 de arriba).
- Validador (`Teoria.problemas` con las piezas de `requiere`, unidad con `calidad: 2`): sin problemas.
- Regla del papel simulando `calidad: 2`: `mol-practica` y `mol-composicion` sin fallas; `papel-generador --revisar`: al día.
- `node herramientas/ecuaciones-ancho.js quimica.mol-y-composicion`: todo cabe (60 pantallas, 327 renglones).

## Verificación (26 nov)

Verificador de cierre de la pasada. Revisé las seis notas, rehice la cuenta de las explicaciones de alternativas con
sentido nuevo (promedios de isótopos y abundancias, moles, masa, moléculas, átomos e iones, porcentajes, hidratos,
empírica y molecular; teoría y práctica) y comparé con la versión de antes: las 157 ecuaciones de la teoría son las
mismas, `D_HID` sigue teniendo el «·5» y las «5 moléculas» que reemplaza `datosFo`, y el cambio de `ig` (tolerancia
relativa) solo toca los números chicos. Los únicos números que se fueron del texto son los del paracetamol («3,31 mmol,
no 33,1»), que siguen en la respuesta.

Lo corregido, con una prueba que falla con la versión anterior (`mol-y-composicion.test.js`, «redacción: magnetita,
molécula del juego, tiza y el 22,4 L/mol del papel»):

- **Nota 6 (la magnetita).** La B (Fe₂O₃) «multiplica por 2 en vez de por 3» no llegaba a su valor: ahora «…y después
  redondea 2 : 2,67 a 2 : 3».
- **Nota 4 (laboratorio, más H).** El «bien» del reto decía que el H pasa la mitad de la masa con la molécula CH₁₄ del
  juego, que no existe. Ahora: «El H pasa la mitad, pero esa molécula no existe; el CH₄ real tiene 25 %.» (16 palabras,
  el tope de la voz).
- **Nota 2 (la tiza).** Hay tizas de yeso. El «Lee» dice ahora «Las tizas de esta caja son casi todas de carbonato de
  calcio, CaCO₃; hay otras de yeso», y el ejemplo del glosario «Toda tiza pura tiene 40 % de calcio» pasa a «Todo CaCO₃
  puro tiene 40 % de calcio, sea de tiza o de concha». El resto de la unidad nombra la tiza junto a su fórmula.
- **Nota 3 (papel viejo, p10).** Usaba 22,4 L/mol sin darlo: el enunciado lo da ahora («un gas en condiciones normales
  ocupa 22,4 L por mol»).

Decidido por la sesión, Gerson revisa después:

- Nota 3: el problema del gas, que es de Gases, se queda en el papel viejo con su dato.
- Nota 5 («A = 35» en el ejemplo del número de masa): se queda. A es la notación del número de masa y la alternativa A
  es justamente 35, así que no se contradicen.
- Nota 1 (glosario): `app/datos/glosario/quimica.json` se regenera con `npm run catalogo` al integrar.

Comprobaciones: prueba de la unidad 15 de 15; `plantillas/mol-practica/generador.test.js` y
`plantillas/mol-composicion/motor.test.js` en verde (`mol-practica/papel.json` regenerado, al día); validador con
`calidad: 2` en 200 semillas: 0 (la primera versión del «bien» pasó el tope de 16 y se acortó); regla del papel: 0 en
las dos plantillas; `contenido/teoria/teoria.test.js`: 163 de 164 (falla solo el glosario de `app/datos/`).

## Segunda pasada: explica (27 nov)

Gerson vio la unidad y dijo que los textos seguían cortos y sin mucho significado. Esta pasada sigue el punto 4 de
`docs/metodo/unidad/redaccion-delegada.md` («Explica, no solo pules») con los topes del 26 nov. Solo texto: ningún
número, respuesta, distractor, dato, ecuación ni dibujo cambió (comprobado con un volcado de antes y después: las 5131
huellas de la teoría, con ecuaciones, opciones, Datos y respuestas en 60 semillas por idea, son iguales; en la práctica,
1200 problemas con los mismos enunciados, Datos, alternativas, errores y números). `calidad: 2` se queda. Notación
decidida, sin cambios: N es el número de entidades (con su aviso en «Lee»), masas atómicas sin «=» y redondeos con «≈».

### Qué se cambió, por tipo

1. **Reglas (las seis).** Cada una dice ahora qué es lo nuevo, por qué vale y, donde cabe, un caso: la abundancia como
   «cuántos átomos de cada 100» y por qué el isótopo común jala el promedio (1); el mol como cantidad fija «como la docena
   es 12» y por qué la masa molar cambia con la sustancia (2); qué es una unidad, por qué los moles del elemento son los
   del compuesto por sus átomos, con «2 mol de H₂O traen 4 mol de H» (3); el porcentaje como «gramos en cada 100 g» y por
   qué se saca de un mol (4); qué es la empírica y para qué se multiplica por 2 o por 3 (5); el porqué de cada ley:
   los átomos se reacomodan, la fórmula es fija, los átomos van enteros (6).
2. **«Vale si» (seis).** Cada condición dice además qué pasa si no se cumple: el promedio que sale bajo si se deja fuera
   un isótopo (1), el N varias veces mayor si se cuentan átomos donde se piden moléculas (2), los átomos que faltan si se
   olvida el número de afuera (3), el porcentaje que sale más alto con la masa de la sal sin agua (4), el k que no sale
   entero cuando algo se calculó mal (5). La de la idea 6 ya lo decía.
3. **Lee y Mira.** «La unidad u» dice por qué la masa de un isótopo es casi su número de masa; «Dos clases de cloro»
   define isótopo; «Lo que pesa un mol» dice por qué el mismo número sirve en u y en g/mol; «Unidad fórmula» describe el
   cristal; la sal y el porcentaje traen el porqué y un caso (100 g de agua); la empírica dice qué da un análisis y qué
   no; Lavoisier dice qué encontró. Los pasos de Mira dicen el porqué de cada cuenta (tres cuartas partes de los átomos,
   la docena de huevos y la de naranjas, el 3 que repite el SO₄, por qué se toman 100 g, por qué no hay medio átomo, por
   qué la masa se conserva).
4. **`siFuera` de las seis Predice y explicaciones de «Ahora tú» (las cuatro clases de cada idea).** Cada una nombra el
   razonamiento, dice por qué falla y qué había que mirar: la suma de masas «da la masa de tres átomos juntos»; Nₐ entre
   M «dice cuántas moléculas hay en cada gramo»; dividir entre Nₐ «da mucho menos de una molécula»; los iones «se
   sueltan los dos tipos»; la razón de masas «compara gramos, y los átomos pesan distinto». La alternativa doble de una
   empírica ya no repite su porcentaje (que era el mismo del análisis y confundía): dice que por eso da los mismos
   porcentajes (`sinPct` en `erroresEmp`, en la teoría y en la práctica; solo cambia el texto).
5. **Pasos de «Así se resuelve» y soluciones.** El paso «regla» de cada idea dice por qué se hace eso y no otra cosa
   (no se cuentan moléculas una por una; la fórmula cuenta por unidad, no por gramo; de un mol se conocen las dos masas);
   el paso «sentido» dice qué significa el resultado. Las soluciones de «Ahora tú» dicen por qué se divide o se
   multiplica y qué se espera del resultado.
6. **Ejemplos.** En los de nivel 3, la línea que reparte las alternativas dice ahora qué razonamiento da cada una («la B
   supone que los dos abundan igual», «la E corre la coma un lugar de más: multiplica por 10 000 y no por 1000», «la B
   divide entre la masa molar del hidrato, pero el agua ya se fue»). En los de nivel 1 y 2, las líneas secas («Cada mol
   trae Nₐ moléculas:», «Al dividir entre el menor queda 1 : 3.») dicen el porqué.
7. **Glosario.** Trece `simple` llevan ahora un caso de la vida del alumno (el gramo para el arroz, la nota promedio del
   salón, la docena de huevos, la etiqueta nutricional, «dos de agua por una de arroz», la botella bien tapada).
8. **Práctica.** `plantillas/mol-practica/generador.js`: las mismas explicaciones y soluciones que la teoría, tipo por
   tipo (unas 75); `papel.json` regenerado con `node herramientas/papel-generador.js mol-practica`.
   `plantillas/mol-composicion/papel.json`: los pasos en rótulo («Moles: …», «Masa molar del NH₃: …», «Agua perdida: …»)
   pasan a oraciones con su porqué, las explicaciones de errores de las preguntas dicen por qué fallan, y la indicación y
   las preguntas dejan «H = 1», «Usa C = 12…» por «masas atómicas: H 1…» (la notación decidida).

### Antes y después

- **Regla, idea 2.** *Antes:* «Un mol tiene 6,02 × 10²³ entidades, y la masa molar M, en g/mol, es lo que pesa un mol.
  Los moles n salen de dividir la masa entre M, y N, el número de entidades, es n por Nₐ.» *Después:* «Un mol es una
  cantidad fija de entidades, 6,02 × 10²³, como la docena es 12. La masa molar M, en g/mol, es lo que pesa un mol, y
  cambia con la sustancia porque sus partículas pesan distinto. Por eso los moles n salen de dividir la masa entre M, y N,
  el número de entidades, es n por Nₐ.»
- **Regla, idea 5.** *Antes:* «Para la empírica, pasa cada masa a moles y divide entre el menor; si un cociente termina en
  ,5, multiplica todo por 2, y si termina en ,33 o ,67, por 3. La molecular es k veces la empírica.» *Después:* «La
  fórmula empírica es la razón de enteros más simple entre los átomos. Para hallarla, pasa cada masa a moles y divide
  entre el menor; si un cociente termina en ,5, multiplica todo por 2, y si termina en ,33 o ,67, por 3, hasta tener
  enteros. La molecular repite k veces la empírica.»
- **Condición, idea 3.** *Antes:* «Vale si se cuentan todos los átomos de una unidad, con el paréntesis y el agua de los
  hidratos (CuSO₄·5H₂O: 5 aguas por unidad); los iones de una sal se cuentan igual.» *Después:* «…(CuSO₄·5H₂O: 5 aguas
  por unidad); si se olvida el número de afuera, faltan átomos. Los iones se cuentan igual.»
- **Alternativa de la Predice, idea 2** (18 g de agua y 18 g de azúcar, «Igual en los dos: pesan lo mismo»). *Antes:*
  «Habría igual número de moléculas con 1 mol de cada uno, no con la misma masa: en 18 g caben más moléculas si cada una
  pesa menos.» *Después:* «Un kilo de arroz y un kilo de papas pesan lo mismo, pero el arroz trae muchos más granos,
  porque cada uno pesa menos. Igual número de moléculas habría en 1 mol de cada uno, no en la misma masa.»
- **Alternativa de «Ahora tú», idea 2** (la masa de una sola molécula, con Nₐ / M). *Antes:* «Dividir está bien, pero la
  fracción quedó al revés: la masa del mol va arriba y Nₐ, abajo.» *Después:* «Dividir está bien, pero la fracción quedó
  al revés: Nₐ entre la masa molar dice cuántas moléculas hay en cada gramo, no cuánto pesa una. La masa del mol va
  arriba y Nₐ, abajo.»
- **Paso de «Así se resuelve», idea 3.** *Antes:* «Primero se calculan los moles del compuesto, y después se multiplican
  por los átomos del elemento en cada unidad.» *Después:* «La fórmula cuenta átomos por unidad, no por gramo, así que
  primero se pasa la masa a moles del compuesto; después se multiplica por los átomos del elemento en cada unidad.»

### Para el verificador

1. **Afirmaciones nuevas, ciertas pero escritas de memoria (sin fuente abierta en esta pasada):** cada protón y cada
   neutrón pesa casi 1 u y los electrones casi nada (Lee 1); «en 1 g caben Nₐ veces 1 u» (Lee 2: 1 g / 1,6605 × 10⁻²⁴ g
   ≈ 6,022 × 10²³); Lavoisier vio que el frasco entero pesaba lo mismo y que el metal ganaba la masa que perdía el aire
   (Lee 6, histórico, por confirmar); «el sodio es lo que se cuida en la comida» (Lee 4); la planta aprovecha el
   nitrógeno de la urea (Mira 4); en el líquido las moléculas están juntas (papel p10). La sacarosa tiene 45 átomos
   (C₁₂H₂₂O₁₁: 12 + 22 + 11), comprobado.
2. **Regla 6:** para caber en 60 palabras quedó «porque los átomos se reacomodan» (sin «solo»), y Proust y Dalton se
   justifican con «su fórmula es fija» y «los átomos van enteros». Es la explicación atómica, posterior a las leyes;
   conviene que el verificador decida si la deja así o la marca como explicación y no como el origen de la ley.
3. **Lo que ahora se lee antes de un ejemplo resuelto:** el «Lee» de la idea 4 da «en 100 g de agua hay unos 11 g de
   hidrógeno», que es la respuesta del ejemplo 1 de esa idea, y la regla de la idea 3 da «2 mol de H₂O traen 4 mol de H»,
   el último paso del ejemplo 6. No tocan ninguna Predice ni misión (el validador con `calidad: 2` da 0, también
   `antes-predice`), pero el verificador puede preferir otro caso.
4. **`sinPct` en `erroresEmp`** (teoría y práctica): la explicación de la alternativa doble ya no agrega «Con X, A sería
   p %», porque p era el mismo porcentaje del análisis. Es un cambio de código que solo arma texto.
5. **Práctica, `agua-hidrato`:** la alternativa de la sal sin agua puede pasar de 100 % (105 % con MgSO₄·7H₂O), y se
   descarta sin resolver. No se tocó (es un número); que lo vea el auditor.
6. **`mol-composicion/papel.json`:** se cambiaron la indicación, los pasos y las explicaciones de errores; las cuentas,
   respuestas y `verificar` no. Nₐ sigue con «=» («Nₐ = 6,02 × 10²³»), como en los Datos de la unidad.
7. **Glosario de la app:** cambiaron trece `simple`; `app/datos/glosario/quimica.json` queda desfasado hasta que la
   sesión corra `npm run catalogo` (falla «glosario … archivos de la app al día» en `teoria.test.js`, como prevé el método).

### Comprobación (27 nov)

- `contenido/teoria/quimica/mol-y-composicion.test.js`: 15 de 15. La regla de la idea 2 conserva «N, el número de
  entidades», que fija una prueba.
- `plantillas/mol-practica/generador.test.js` y `plantillas/mol-composicion/motor.test.js`: 49 de 49.
- `contenido/teoria/teoria.test.js`: 163 de 164; falla solo la del glosario de la app (punto 7).
- Validador (`Teoria.problemas` con las piezas de `requiere` y `calidad: 2`, 200 semillas): 0.
- Regla del papel (`papel-reglas.js`) con `calidad: 2`: 0 en `mol-practica` y en `mol-composicion`;
  `papel-generador.js --revisar`: al día. Explicaciones de la práctica: ninguna pasa de 40 palabras en 1800 problemas.
- `node herramientas/ecuaciones-ancho.js quimica.mol-y-composicion` (servidor propio en el puerto 4284, ya cerrado):
  todo cabe, 60 pantallas y 329 renglones.

## Verificación de la segunda pasada (27 nov)

Verificador de cierre, sin commits. Lo comprobado:

- **Nada de fondo cambió.** Contra HEAD, en 200 semillas por idea: «Ahora tú», «Así se resuelve», Predice, ecuaciones de
  Mira y de la regla, los 90 ejemplos y el laboratorio: 0 diferencias en opciones, correctas, errores, Datos, respuestas y
  ecuaciones. Práctica: 1600 problemas iguales salvo las explicaciones. `mol-practica/papel.json`: mismos 8 problemas.
  `mol-composicion/papel.json`: sin contar enunciados, pasos y explicaciones, es igual a HEAD (cuentas, respuestas y
  `verificar`); en los enunciados de las preguntas solo cambió «Usa C = 12…» por «Usa las masas atómicas C 12…», además de la indicación.
- **Decidido, regla 6 (decidido por la sesión, Gerson revisa después).** Las leyes ponderales son anteriores a la teoría
  atómica, así que la regla ya no dice «la masa no cambia porque los átomos se reacomodan»: enuncia las tres leyes y
  cierra con «Los átomos lo explican: se reacomodan sin perderse, la fórmula es fija y van enteros» (60 de 60).
- **Corregido, Lee de la idea 4.** «En 100 g de agua hay unos 11 g de hidrógeno y 89 g de oxígeno» repetía la respuesta
  del ejemplo 1 y, peor, adelantaba la Predice del CH₄: el agua tiene dos H por cada O y aun así el H es apenas el 11 %,
  que es justo lo que la Predice quiere que el alumno descubra (el distractor del 80 % reparte por átomos). Ahora el caso
  no dice nada de átomos: «si un compuesto tiene 40 % de calcio, cada 100 g de él traen 40 g de calcio».
- **Se queda (decidido por la sesión, Gerson revisa después):** la regla 3 usa «2 mol de H₂O traen 4 mol de H», el último
  paso del ejemplo 6. Va después de la Predice (Al₂(SO₄)₃) y los ejemplos son resueltos: no delata nada.
- **`agua-hidrato` (práctica) y su par en la teoría.** Con MgSO₄·7H₂O (105 %), Na₂SO₄·10H₂O (126,8 %) y
  Na₂CO₃·10H₂O (169,8 %), la alternativa de la sal sin agua pasa de 100 %. Es un problema real pero menor: el alumno
  puede descartarla sin resolver, aunque es el error que de verdad comete quien divide entre la sal anhidra. No cambié el
  número (las opciones no se tocan en esta pasada); la explicación de esa alternativa dice ahora, solo cuando pasa de
  100 %, que «el agua es parte de él y no puede pasar de 100 %». Dos pruebas nuevas (`mol-y-composicion.test.js` y
  `mol-practica/generador.test.js`, «verificación 27 nov …») lo fijan y fallan con el texto anterior. **Para Gerson:** si
  quiere un distractor que no se descarte solo, hay que cambiar ese número en las tres sales (es decisión de contenido).
- **`sinPct`** solo arma texto: las opciones son las mismas (comparación de arriba).
- **Datos de memoria, revisados y bien:** Lavoisier calentó metales en frascos cerrados y el conjunto pesó lo mismo (el
  metal ganó la masa del aire que se consumió); la etiqueta de la sal informa el sodio; la urea es abono por su
  nitrógeno (28 g de cada 60 g); protón y neutrón ≈ 1 u; en 1 g caben Nₐ veces 1 u; sacarosa de 342 g/mol y 45 átomos.
- Validador con `calidad: 2` en 200 semillas: 0. Unidad 16 de 16; `mol-practica` 9 de 9; `mol-composicion` 41 de 41;
  regla del papel: 0 en las dos. `mol-practica/papel.json` regenerado con `node herramientas/papel-generador.js
  mol-practica`; `--revisar`: «al día» (`mol-composicion` es papel hecho a mano y no se regenera).
- `teoria.test.js`: 163 de 164; falla solo «glosario … archivos de la app al día» (falta `npm run catalogo`).

Archivos de la segunda pasada: `contenido/teoria/quimica/mol-y-composicion.js`,
`contenido/teoria/quimica/mol-y-composicion.test.js` (prueba nueva del verificador), `plantillas/mol-practica/generador.js`,
`plantillas/mol-practica/generador.test.js` (prueba nueva del verificador), `plantillas/mol-practica/papel.json`,
`plantillas/mol-composicion/papel.json` y este informe.
