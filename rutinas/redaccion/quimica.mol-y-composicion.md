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
