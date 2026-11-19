# Lector en frío: «Polígonos y cuadriláteros» (geometria.poligonos-y-cuadrilateros)

19 nov 2026, cierre de la Etapa 6 (`docs/metodo/unidad/cierre-delegado.md`). Dos lectores nuevos, solo con las capturas a 390 px
(`--entera --lector`) de /tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e6-cierre-pol/lector/: el lector A con las ideas 1 a 3 y el B con las ideas 4 a 6 y las 18 tarjetas de ejemplos.
Sus informes van tal cual; al final, «Correcciones de la ronda 1».

## Lector en frío A: Polígonos, parte 1 (momentos)

Ideas leídas: suma de ángulos interiores (idea 1), ángulos exteriores (idea 2) y número de diagonales (idea 3).
Solo hice la parte 1. Las tarjetas de ejemplos (parte 2) no son de este encargo.

Aviso, una sola vez: de Lee solo veo la tarjeta 1, de Mira solo el paso 1 y de «Así se resuelve» solo el paso 1
(«¿Qué me piden?»). No lo cuento como falla.

---

### Idea 1: Suma de ángulos interiores

**1 Lee.**
1. Veo un pentágono ABCDE gris con dos cordeles que salen de A (a C y a D) y lo parten en tres triángulos; hay una lupa.
   Tarjeta 1/4: «Un terreno de lados rectos».
2. Solo leer.
3. n es el número de lados o de esquinas; A, B, C, D y E son las esquinas (vértices).
5. Se entiende. Las palabras con puntitos (polígono, vértices, convexo) imagino que se pueden tocar.

**2 Juega.**
1. El mismo pentágono, ahora con arcos rojos en las esquinas y los triángulos numerados 1, 2 y 3. Debajo dice
   «n = 5: 3 parcelas; 3 · 180° = 540°». Hay una leyenda (n, A, línea fina, parcela, arco), un deslizador de lados con
   − y +, el botón «Volver al inicio» y la nutria Neri.
2. Misión: agregar esquinas hasta que salgan 6 parcelas, o sea llegar a n = 8.
3. n = lados; A = la estaca; línea fina = cordel, que es una diagonal; parcela = triángulo; arco = ángulo interior.
4. Aprendí que cada esquina que agrego da una parcela más, y que siempre hay n − 2 parcelas.
5. Nada me trabó.

**3 Predice.**
1. Un pentágono con una estaca O adentro y cinco cordeles de O a cada esquina; hay arcos rojos en las esquinas y los
   ángulos que quedan en O no están marcados.
2. Me piden cuánto suman los 5 ángulos interiores. Opciones: 540°, 900°, «Depende de dónde quede O» y 720°.
3. O es la estaca de adentro y los arcos son los ángulos del terreno.
5. El recuadro «Datos» dice que alrededor de O se forma una vuelta de 360°. Eso casi me dice que tengo que restarla. No
   regala la respuesta, pero ayuda mucho. Mi respuesta es 5 · 180 − 360 = 540°.

**4 Mira.**
1. El mismo dibujo con O, un botón de reproducir y una barra con 4 pasos. El paso 1 dice «5 · 180° = 900°».
4. Aprendí que con la estaca adentro salen 5 triángulos, pero los ángulos de O no son del terreno y hay que quitarlos.
5. En el paso 1 aparece 900°, que es una de las opciones malas. Si yo marqué 900°, por un momento parece que acerté. Los
   pasos 2 a 4 no los veo; supongo que ahí restan 360°.

**5 La regla.**
1. El pentágono con las diagonales desde A, la regla escrita, la fórmula S = (n − 2) · 180° (S en morado, n en
   naranja) y un «Vale si».
3. S es la suma de los ángulos interiores y n es el número de lados. Lo de «en un cuadrilátero, 360°» está bien como
   ejemplo.
5. Nada.

**6 Así se resuelve.**
1. Un hexágono ABCDEF que, según el texto, no está a escala. Las esquinas A, B, C y D tienen marcados 125°, 135°, 120° y
   150°, y E y F están marcadas con x.
2. Piden lo que mide cada uno de los dos ángulos iguales, E y F.
3. x es el ángulo de E y también el de F.
5. Los números 120° y 135° están muy juntos, uno encima del otro, en el lado derecho, y dudé cuál era de B y cuál de C.
   El texto lo aclara. Mi cuenta: S = 4 · 180 = 720; 720 − 530 = 190; x = 95°.

**7 Ahora tú.** Un polígono de 7 lados: (7 − 2) · 180 = 900°, la C. La opción 1260° es la trampa de 7 · 180. Está bien.

**Ejercicio inventado.** Un octógono convexo tiene seis ángulos de 130° y los otros dos iguales. ¿Cuánto mide cada uno
de esos dos? S = 6 · 180 = 1080°; 1080 − 6 · 130 = 300; cada uno mide 150°.

---

### Idea 2: Ángulos exteriores del polígono

**1 Lee.**
1. Un pentágono regular con franjas grises alrededor (son las calles), arcos rojos adentro, un arco turquesa en B
   entre el lado y una línea punteada, y un mototaxi entre A y B. Tarjeta 1/4: «Doblar en una esquina».
2. Solo leer.
3. El arco turquesa es lo que gira el mototaxi, o sea el ángulo exterior. La línea punteada es la calle vieja que sigue
   de largo.
5. La tarjeta dice «como en Triángulos». Yo no sé qué es eso; supongo que es otra unidad. Las franjas grises no se
   explican en ninguna leyenda (Lee, Juega, Predice).

**2 Juega.**
1. El pentágono con 108° en carmín adentro y 72° en turquesa afuera, en B. Debajo dice «n = 5: 108° adentro y 72° de
   giro: suman 180°». Hay una leyenda y un deslizador de esquinas.
2. Misión: elegir la plaza en la que el mototaxi gira 45° en cada esquina, o sea n = 8.
3. n = esquinas; arco carmín = ángulo interior; arco turquesa = ángulo exterior; punteado = la calle que sigue de largo.
4. Aprendí que con más esquinas el mototaxi gira menos en cada una, y que el ángulo de adentro y el giro siempre suman
   180°.
5. Nada.

**3 Predice.**
1. Un pentágono irregular con giros de 70° en D, 85° en C, 60° en B y 75° en E, todos en turquesa. En A hay un «?» con
   un arco negro, no turquesa, y el mototaxi está en el lado ED.
2. Me piden cuánto gira el mototaxi en la quinta esquina. Opciones: 110°, 72°, 70° y 250°.
3. Los números turquesa son giros; el «?» es el giro en A.
5. Dudé si el «?» era un giro, porque su arco es negro y no turquesa como los otros. El 85° queda arriba, sobre el lado
   DC, más cerca del medio que de C, y dudé un poco si era de C o de D. Mi respuesta: 360 − 290 = 70°. Por el camino
   de los Datos (540°) me sale 110° adentro y 70° afuera. El 110° es buena trampa.

**4 Mira.**
1. El mismo dibujo y una barra con 5 pasos. El paso 1 muestra 60° + 85° + 70° + 75° + ?, con los números en turquesa.
4. Aprendí que los giros de una vuelta completa suman 360°, y que si sé cuatro saco el quinto.
5. Neri dice «sigue la nariz del mototaxi». Lo entendí más o menos: al volver mira hacia donde empezó.

**5 La regla.**
1. El mismo pentágono, ahora con 70° en A, más la regla y la fórmula: «exteriores: 360° y cada exterior = 360° ÷ n».
3. «exteriores» y «cada exterior» van en turquesa y n en naranja.
5. En A ya no está la línea punteada que había en Predice y Mira, y el arco de 70° está en otro lugar, debajo del lado
   AB. Me hizo dudar si es el mismo ángulo que el «?» de antes. La palabra «equiángulo» no aparece en esta regla («si
   son todos iguales»), pero en el paso siguiente sí se usa.

**6 Así se resuelve.**
1. No hay dibujo, solo el enunciado: cada ángulo interior de un polígono equiángulo mide 174°.
2. Piden el número de lados, n.
3. n es el número de lados.
5. «Equiángulo» es nueva para mí. Tiene puntitos, así que la tocaría; por el contexto entiendo que tiene todos los
   ángulos iguales. Mi cuenta: exterior = 6°; n = 360 ÷ 6 = 60.

**7 Ahora tú.** Un polígono equiángulo de 6 lados: exterior 60°, interior 120°, la C. El 60° es la trampa del exterior.
Está bien.

**Ejercicio inventado.** El mototaxi gira 40° en cada esquina de una plaza de esquinas iguales. ¿Cuántas esquinas tiene
la plaza y cuánto mide cada ángulo de adentro? n = 360 ÷ 40 = 9; interior = 180 − 40 = 140°.

---

### Idea 3: Número de diagonales

**1 Lee.**
1. Un geoplano redondo con 6 clavos (A a F), lados punteados y tres ligas naranjas de A a C, a D y a E. Tarjeta 1/3:
   «El geoplano».
2. Solo leer.
3. Los clavos son vértices; la liga es un segmento.
5. Nada.

**2 Juega.**
1. El mismo geoplano. Debajo dice «n = 6: del clavo A salen 6 − 3 = 3 ligas». Hay una leyenda, un deslizador de clavos
   y botones de clavo de partida (A, B, C y D; la D quedó sola en otra línea).
2. Misión: poner clavos hasta que del clavo marcado salgan 5 ligas, o sea n = 8.
3. n = clavos; liga naranja = una diagonal desde el clavo marcado; punteado = dos clavos vecinos, que serían un lado.
4. Aprendí que de cada clavo salen n − 3 ligas, porque no se une consigo mismo ni con sus dos vecinos.
5. Nada.

**3 Predice.**
1. Un geoplano de 10 clavos (A a J) con 7 ligas naranjas desde A.
2. Me piden cuántas ligas hay en total si pongo una entre cada par de clavos que no son vecinos. Opciones: 70, 45, 7 y 35.
3. Las ligas naranjas son las de A.
5. El recuadro «Datos» dice «cada liga une dos clavos», y Neri pregunta «¿la liga de A a E también sale de E?». Las dos
   pistas juntas casi me dicen que divida entre 2. No regalan el número, pero ayudan demasiado. Mi respuesta:
   10 · 7 ÷ 2 = 35. El 70 es buena trampa.

**4 Mira.**
1. El mismo geoplano y una barra con 4 pasos. El paso 1 dice «10 − 3 = 7».
4. Aprendí que cada liga se cuenta dos veces si cuento desde cada clavo, por eso hay que dividir entre 2.
5. Neri dice «Cuenta puntas de liga, no ligas». Me costó entenderlo a la primera; después me di cuenta de que cada liga
   tiene dos puntas.

**5 La regla.**
1. El geoplano de 10 clavos con todas las diagonales: las de A en naranja y las demás en negro fino. Abajo, la regla y la
   fórmula diagonales = n · (n − 3) ÷ 2.
3. «diagonales» va en morado y n en naranja.
5. El dibujo es una maraña y en el celular no se puede contar nada. Esta pantalla no tiene leyenda que diga qué son las
   líneas negras; supongo que son las demás diagonales.

**6 Así se resuelve.**
1. No hay dibujo: un polígono convexo tiene 90 diagonales.
2. Piden el número de lados, n.
3. n es el número de lados.
5. Nada. Mi cuenta: n(n − 3) = 180; 15 · 12 = 180; n = 15.

**7 Ahora tú.** Un polígono de 9 lados: 9 · 6 ÷ 2 = 27, la C. El 54 es la trampa de no dividir. Está bien.

**Ejercicio inventado.** Un polígono convexo tiene 20 diagonales. ¿Cuántos lados tiene? n(n − 3) = 40; 8 · 5 = 40;
n = 8.

---

## Lo que me trabó

- Suma de ángulos, 3 Predice: el recuadro «Datos» ya dice que alrededor de O hay 360°, y eso casi dice que hay que
  restarlo.
- Suma de ángulos, 4 Mira, paso 1: muestra 900°, que es una opción mala de Predice; parece que confirma el error.
- Suma de ángulos, 6 Así se resuelve: los números 120° y 135° están juntos en el dibujo y no se sabe bien cuál es de B y
  cuál de C.
- Ángulos exteriores, 1 Lee: «como en Triángulos» nombra algo que no conozco.
- Ángulos exteriores, 1 Lee y 2 Juega: las franjas grises alrededor de la plaza no se explican en la leyenda.
- Ángulos exteriores, 3 Predice y 4 Mira: el arco del «?» en A es negro y no turquesa como los otros giros.
- Ángulos exteriores, 3 Predice: el 85° queda lejos de C, en el medio del lado DC; dudé si era de C o de D.
- Ángulos exteriores, 5 La regla: en A desaparece la línea punteada y el arco de 70° cambia de lugar respecto al «?».
- Ángulos exteriores, 6 Así se resuelve: aparece «equiángulo» sin que la regla use esa palabra.
- Diagonales, 3 Predice: el recuadro «Datos» («cada liga une dos clavos») y Neri juntos casi dicen que hay que dividir
  entre 2.
- Diagonales, 4 Mira: «Cuenta puntas de liga, no ligas» es confuso a la primera.
- Diagonales, 5 La regla: el dibujo con todas las diagonales es una maraña en el celular y no dice qué son las líneas
  negras.

## Informe del lector en frío B: paralelogramos, rectángulo-rombo-cuadrado y trapecios

Soy un alumno de 5.º que no conoce la app. Miré solo las imágenes. De Lee solo veo la primera tarjeta (1/4 o 1/3), de Mira solo el paso 1/5 y de «Así se resuelve» solo el paso 1 («¿Qué me piden?»). Lo digo esta vez y no lo cuento como falla.

## Parte 1: momentos

### Idea 4: El paralelogramo y sus propiedades

**1 Lee.**
1. Veo un marco ABCD inclinado. Abajo, AB = 60 cm (naranja); a la izquierda, AD = 40 cm (verde). Tiene flechitas en los lados y bolitas (pernos) en las esquinas. Abajo está la tarjeta 1/4, «Un marco que se inclina», y la nutria Neri.
2. Me piden leer: don Julián arma un marco con dos listones de 60 y dos de 40, y puede inclinarlo sin que cambien de largo.
3. A, B, C, D son las esquinas, 60 cm y 40 cm son los largos y las flechitas marcan qué lados son paralelos (eso lo entiendo recién en Juega, donde lo explican).
5. Nada me trabó.

**2 Juega.**
1. Veo el marco recto, con los cuatro ángulos de 90° marcados con cuadraditos. Hay un círculo en D para arrastrar, una lectura «m∠A = 90°: m∠C = 90°; m∠B = m∠D = 90°», una leyenda de letras y un control de m∠A con − y +.
2. La misión: inclinar el marco hasta que la esquina B mida 110°.
3. La leyenda lo explica bien: AB y CD son los de 60, AD y BC los de 40, m∠A es cuánto se abre A y las flechitas marcan los lados paralelos.
4. Aprendí que, al inclinarlo, las esquinas de enfrente se abren juntas.
5. Dudé un poco: la misión habla de B, pero el control y su número son de A. Tuve que pensar que B = 110° quiere decir A = 70°. No sé si la lectura de arriba muestra B mientras muevo el control (en la captura todo marca 90°).

**3 Predice.**
1. Veo el marco inclinado y la pregunta de los dos cordeles AC y BD. El recuadro Datos dice que los listones de enfrente miden igual. Hay cuatro opciones.
2. Me piden predecir qué pasa siempre con los cordeles.
3. Igual que antes.
5. Está claro. El dibujo no muestra los cordeles, así que no me regala la respuesta. La pista de Neri («imagina el marco casi recto») ayuda a descartar la C.

**4 Mira (paso 1/5).**
1. El marco con un botón de play: «Los listones de enfrente van paralelos: AB ∥ CD y AD ∥ BC».
3. ∥ quiere decir «paralelo». Lo deduzco por la frase.
4. Aprendí que los lados de enfrente son paralelos.
5. Neri dice «El cordel parte el marco en dos triángulos», pero en este paso no hay ningún cordel dibujado. Me confundió un poco.

**5 La regla.**
1. El marco con sus dos diagonales, que se cortan en O.
2. Leer la regla: lados opuestos iguales, ángulos opuestos iguales, vecinos suman 180° y las diagonales se cortan en su punto medio.
3. Los colores de AB, CD y m∠A coinciden con los del dibujo.
5. La fórmula pone AO = OC pero no BO = OD; la frase sí lo dice para las dos. Es un detalle menor.

**6 Así se resuelve (paso 1).**
Es el problema de las bisectrices de A y B, con m∠A = 80°. Datos: vecinos suman 180°, qué es una bisectriz y que el triángulo suma 180°. Paso 1: «Piden el ángulo en P». Lo seguí. Yo lo calculo así: B = 100°, las mitades son 40° y 50°, y APB = 90°. No tiene dibujo en este paso. Uno ayudaría a ubicar P.

**7 Ahora tú.**
Datos: m∠A = 3x + 10° y m∠C = x + 38°, y piden m∠B. Como A = C, 3x + 10 = x + 38, así que x = 14, A = 52° y B = 128°. Respuesta C. Las opciones 52°, 14° y 90° son buenas trampas. El dibujo marca A, C y el «?» en B, y avisa que no está a escala. Está claro.

**Ejercicio inventado.** En el paralelogramo ABCD, m∠B es el doble de m∠A. ¿Cuánto mide m∠C? Como A + B = 180°, 3A = 180°, A = 60° y C = A = 60°.

### Idea 5: Rectángulo, rombo y cuadrado

**1 Lee (1/3).**
1. Veo el marco de 80 × 60 cm, inclinado, con dos cordeles: AC naranja y BD verde. Hay un arco en A.
2. Leer: el marco debe quedar a escuadra, con cuatro esquinas de 90°.
5. Nada.

**2 Juega.**
1. Veo el marco a 70°, «AC ≈ 115,3 cm y BD ≈ 82 cm: AC es mayor», la leyenda y el control de m∠A.
2. Enderezar el marco hasta que los cordeles midan igual.
3. La leyenda es clara.
4. Aprendí que los cordeles miden igual solo cuando el marco está a 90°.
5. Comprobé las cuentas: √(80² + 60² + 2·80·60·cos 70°) ≈ 115,3 y √(10 000 − 3283) ≈ 82. Están bien.

**3 Predice.**
1. Un rombo de cuatro listones de 50 cm con A = 60°, sin cordeles dibujados.
2. ¿Cómo se cruzan AC y BD?
5. Está claro. La opción A («en ángulo recto solo si está a escuadra») es una buena trampa.

**4 Mira (1/5).**
«A está a 50 cm de B y de D; C, también: AB = AD y CB = CD». Lo entendí.
4. Aprendí que A y C están igual de lejos de B y de D. Intuyo que por eso AC es la mediatriz de BD.

**5 La regla.**
1. El rombo con diagonales perpendiculares, el cuadradito en O y dos marquitas en A (el ángulo partido).
2. Rectángulo: diagonales iguales. Rombo: diagonales perpendiculares que parten sus ángulos. Cuadrado: las dos cosas.
3. AC es naranja y BD verde, igual en el dibujo y en la fórmula. ⊥ quiere decir «perpendicular».
5. «Vale si son paralelogramos: también tienen todo lo de la idea anterior» se entiende. Ojo con algo: en la idea 4, el naranja era el lado de 60 cm; aquí el naranja es la diagonal AC. Como cambia de idea, no me molestó mucho.

**6 Así se resuelve (paso 1).**
Rombo de diagonales 24 y 32. Datos: el rombo, que las diagonales se cortan en su punto medio, el triángulo 3k-4k-5k y qué es el perímetro. Yo lo calculo así: las mitades son 12 y 16, el lado es 20 y el perímetro 80. Lo seguí.

**7 Ahora tú.**
Un paralelogramo con diagonales iguales y perpendiculares: es un cuadrado (C). No tiene dibujo.
5. Dudé un poco: los Datos dicen «rectángulo → diagonales iguales», pero la pregunta va al revés («diagonales iguales → ¿qué figura?»). Me salvó que la regla dijera «Vale si son paralelogramos».

**Ejercicio inventado.** Un rombo tiene diagonales de 10 cm y 24 cm. ¿Cuál es su perímetro? Las mitades son 5 y 12, el lado es √(25 + 144) = 13 y el perímetro es 52 cm.

### Idea 6: El trapecio y su mediana

**1 Lee (1/3).**
1. Veo el corte de un canal: la boca AD = 6 m (punteada, naranja), el fondo BC = 2 m (verde), las paredes AB y CD, y los puntos M y N con una línea MN. Está sombreado lo que tiene agua.
2. Leer: el canal es un trapecio; la boca y el fondo son las bases.
5. Nada.

**2 Juega.**
1. Veo «MN = 4 m, entre BC = 2 m y AD = 6 m», la leyenda (MN es el borde del agua, la mediana) y dos controles: «BC, el fondo» y «el fondo corrido».
2. Ajustar el fondo hasta que el agua mida 4,5 m: el fondo tiene que ser 3 m, porque (6 + 3) ÷ 2 = 4,5.
4. Aprendí que la línea del agua a media altura mide el promedio de la boca y el fondo.
5. No sé qué es «el fondo corrido» (0 m). Nadie lo explica. Me imagino que mueve el fondo hacia un lado. La pregunta de Neri («¿más cerca de la boca o del fondo?») no me quedó clara, porque la misión es sobre el ancho.

**3 Predice.**
1. Un canal con boca de 10 m, fondo de 4 m y los cordeles AC y BD punteados, que cortan MN en P y Q. Hay un «?» encima de MN.
2. ¿Cuánto mide PQ? Mi respuesta: (10 − 4) ÷ 2 = 3, la A.
5. El «?» está centrado encima de MN, así que se puede leer como «¿cuánto mide MN?». P y Q quedan muy pegados a M y N.

**4 Mira (1/5).**
«La línea del agua MN corta el cordel AC en su mitad, P: AP = PC». Comprobé que el dibujo está a escala: MN ≈ promedio y PQ ≈ semidiferencia.

**5 La regla.**
1. El canal con los dos cordeles, P y Q, y «3 m» escrito encima de la línea MN.
2. MN = (AD + BC) ÷ 2 y PQ = (AD − BC) ÷ 2.
3. En la fórmula, MN y PQ están en morado, pero en el dibujo MN es negro y PQ no tiene color.
5. El «3 m» está escrito justo encima del centro de MN, y al primer vistazo leí MN = 3 m (pero MN mide 7 m). Es de PQ.

**6 Así se resuelve (paso 1).**
La mediana mide 13 y PQ mide 5; piden las bases. Yo lo calculo así: suman 26 y se llevan 10, así que miden 18 y 8. Lo seguí.

**7 Ahora tú.**
Bases de 11 y 5: la mediana mide 8 (C). Está claro, aunque los Datos casi regalan la fórmula.

**Ejercicio inventado.** Un trapecio tiene bases de 14 cm y 6 cm. ¿Cuánto miden la mediana y el tramo PQ? MN = 10 cm y PQ = 4 cm.

## Parte 2: tarjetas de ejemplos

Las tarjetas van de tres en tres por tema, con niveles 3, 8 y 14: 01–03 suma de ángulos, 04–06 exteriores, 07–09 diagonales, 10–12 paralelogramo, 13–15 rombo y cuadrado, 16–18 trapecio. Comprobé todas las cuentas y todas están bien.

- **01 (3) ¿Cuántas parcelas?** Piden en cuántos triángulos queda partido un polígono de 12 lados. Tengo todo. Lo sigo, aunque la frase «Desde un vértice salen triángulos: 12 − 2» suena rara. No tiene dibujo y uno ayudaría. Respuesta: 10. Bien.
- **02 (8) Cuatro ángulos en razón.** 10x = 360°, x = 36° y el mayor es 144°. Lo sigo. El dibujo ayuda a ubicar cada ángulo y no da la respuesta. Bien.
- **03 (14) Pentágono 3:4:4:5:2.** 18k = 540°, k = 30° y el mayor es 150°. Lo sigo. El dibujo pone cada k en su vértice, en orden. Los Datos regalan «3k, 4k, 4k, 5k y 2k». Bien.
- **04 (3) Adentro y afuera.** 180° − 130° = 50°. El dibujo con la prolongación punteada ayuda. Bien.
- **05 (8) Giros en razón.** 10x = 360°, x = 36° y 180° − 108° = 72°. Lo sigo. En el dibujo, el «2x» está entre D y C y se puede creer que es de D (el arco sí está en C).
- **06 (14) La sexta esquina.** 360° − 300° = 60° y 180° − 60° = 120°. Las cuentas y la explicación de las trampas están bien. **El dibujo confunde:** C no tiene arco, D tiene dos (uno largo y raro que sale hacia la derecha), B tiene un arco sin número, y 55° y 60° están los dos junto a E. No pude saber qué ángulo es de qué vértice.
- **07 (3) El octógono.** 8 · 5 ÷ 2 = 20. Sale el «5» sin decir que es 8 − 3. Ahí dudé un segundo. Bien.
- **08 (8) De un vértice al total.** n − 3 = 9, n = 12 y 12 · 9 ÷ 2 = 54. Lo sigo. Bien.
- **09 (14) Saludos de una ronda.** 14 · 11 ÷ 2 = 77. La idea de que cada niño es un vértice es buena, y la explicación de las trampas (91, 84, 154 y 11) está bien. Un dibujo de la ronda ayudaría.
- **10 (3) La esquina vecina.** 180° − 65° = 115°. El dibujo ayuda. Muy claro.
- **11 (8) Las mitades de una diagonal.** x = 8, AO = OC = 13 y AC = 26. Lo sigo. No tiene dibujo; uno con O ayudaría.
- **12 (14) Un lado el doble del otro.** 6x = 54, x = 9 y AB = 18. Las trampas están bien explicadas. Bien.
- **13 (3) Perímetro del rombo.** 4 · 7 = 28. Es demasiado fácil y los Datos sobran.
- **14 (8) La diagonal corta del rombo.** B = 116° y 116° ÷ 2 = 58°. Está bien. **El dibujo confunde:** A está dibujado obtuso (casi 100°) aunque dice 64°, así que BD se ve como la diagonal larga, y el título dice «la diagonal corta». Avisa que no está a escala, pero me hizo dudar.
- **15 (14) Dos cuadrados encajados.** 7k = 14, k = 2, el lado de adentro es 10 y 56 + 40 = 96. Las cuentas están bien. **No tiene dibujo** y es la que más lo necesita: me costó imaginar que cada lado de 14 se parte en 3k y 4k. La primera línea, «Cada lado de 14 cm queda partido en los dos catetos», es donde me perdí hasta que lo dibujé yo.
- **16 (3) La base que falta.** 2 · 9 − 5 = 13. El dibujo está a escala y ayuda. Muy clara.
- **17 (8) Trapecio isósceles.** D = 65° y C = 115°. El dibujo es claro y está bien hecho. «Conjugados internos» no se explica, pero los Datos lo dicen.
- **18 (14) Bases desde la mediana.** Está bien: (30 + 10) ÷ 2 = 20. Pero «La mayor es la mitad de la suma más la diferencia» se puede leer como 15 + 10 = 25, que justo es una de las opciones. Además «suman 30 y se llevan 10» salta el paso de duplicar 15 y 5. Ahí me perdí la primera vez.

**Las 3 que mejor se entienden:** 10, 16 y 17.
**Las 3 que peor:** 06 (el dibujo), 15 (sin dibujo) y 14 (el dibujo contradice el título).

**¿Suben los niveles?** Sí. El 3 es aplicar una regla, el 8 pide una ecuación o dos pasos y el 14 trae opciones con trampas reales y explica cada una. La 13 es casi gratis.

**El recuadro Datos:** ayuda, porque no tuve que memorizar nada. En los niveles 3 casi regala la respuesta (04, 13, 16, Ahora tú de trapecios), y en la 03 da hecho el paso «3k, 4k…». En ninguna distrae.

## Lo que me trabó

- Paralelogramos, Juega: la misión pide «la esquina B mida 110°», pero el control y su número son de A; hay que deducir A = 70°.
- Paralelogramos, Mira 1/5: Neri habla del cordel que parte el marco en triángulos, pero en ese paso no hay cordel dibujado.
- Rectángulo-rombo-cuadrado, Ahora tú: los Datos van de «rectángulo → diagonales iguales» y la pregunta va al revés; dudé si podía usarlos así.
- Trapecios, Juega: el control «el fondo corrido» no se explica.
- Trapecios, Predice: el «?» centrado encima de MN parece preguntar por MN y no por PQ.
- Trapecios, La regla: el «3 m» encima de MN se lee como MN = 3 m; además, MN y PQ son morados en la fórmula pero no en el dibujo.
- Tarjeta 06: los arcos y los números de los ángulos no calzan con los vértices (C sin arco, D con dos, 55° y 60° junto a E).
- Tarjeta 14: el ángulo de 64° está dibujado obtuso y BD se ve larga, pero el título dice «la diagonal corta».
- Tarjeta 15: no tiene dibujo; no se ve cómo cada lado de 14 se parte en 3k y 4k.
- Tarjeta 18: «la mitad de la suma más la diferencia» se puede leer como 25, que es una de las opciones.
- Tarjeta 07: el 5 de «8 · 5» aparece sin decir que es 8 − 3.
- Tarjeta 05: el «2x» queda entre D y C y parece de D.

## Correcciones de la ronda 1

Hechas con las de la auditoría (`rutinas/auditoria/geometria.poligonos-y-cuadrilateros.md`, «Correcciones (19 nov)»), cada una
con su prueba en `poligonos-y-cuadrilateros.test.js` o `generador.test.js`. Archivos: la teoría, su prueba y la práctica
`plantillas/geo-poligonos-cuadrilateros/` (`generador.js` y `generador.test.js`). No se tocó `geo-objeto`, `app/` ni `nucleo/`.

| Punto | Qué se hizo |
|---|---|
| A, idea 1, Predice: «alrededor de O forman una vuelta» casi dice que se resta | Datos: «En cada triángulo, los tres ángulos suman 180°» y «Una vuelta entera mide 360°» (M9). |
| A, idea 1, Mira 1: 900° parece confirmar la opción mala | «Cinco parcelas desde O: suman 5 · 180°, pero no todo es del terreno.» |
| A, idea 1, Así se resuelve: 120° y 135° juntos, no se sabe cuál es de B | La figura se elige entre 18 giros y estiramientos, con cada rótulo más cerca de su vértice que de otro (M3). **Parcial:** en este hexágono, la mejor forma deja el 135° a 0,71 de su distancia a C (ninguna baja de 0,64), y la captura casi no cambia. Queda pendiente, con la pieza (acercar el rótulo de un obtuso a su vértice). |
| A, idea 2, Lee: «como en Triángulos» | Fuera la referencia (también en Lee 2 de la idea 1). |
| A, idea 2: las franjas grises sin leyenda | Leyenda del juego: «franja gris: las calles alrededor de la plaza». |
| A, idea 2, Predice y Mira: el arco del «?» negro y no turquesa | **Se deja** (B12): la regla del curso pone lo pedido en tinta; el «?» lleva su punteada como los otros giros. Decidido por la sesión, Gerson revisa después. |
| A, idea 2, Predice: el 85° lejos de C | Medido: queda a 40 px de C y a 62 de D (es de C). Se deja. |
| A, idea 2, La regla: la punteada de A desaparece y el 70° cambia de lugar | La prolongación de A sigue en todos los cortes (M12). |
| A, idea 2, Así se resuelve: «equiángulo» no está en la regla | La regla dice «Si son todos iguales (polígono equiángulo)…». |
| A, idea 3, Predice: «cada liga une dos clavos» y la voz «¿también sale de E?» | Datos: solo «Del clavo A salen 7 ligas…»; voz: «Piensa en las ligas de todos los clavos, no solo de A» (M9). |
| A, idea 3, Mira: «Cuenta puntas de liga, no ligas» | «Cada liga tiene dos puntas: ¿cuántas veces la cuentas?» |
| A, idea 3, La regla: la maraña sin leyenda | La regla tiene su dibujo: el geoplano de 6 clavos con sus 9 ligas (3 de A en naranja) (M13). |
| B, idea 4, Juega: la misión pide B y el control es de A | «Inclina el marco hasta que la esquina B, la vecina de A, mida 110°»; la lectura ya dice m∠B. |
| B, idea 4, Mira 1: la voz habla del cordel que no está | «Mira qué pasa cuando un cordel parte el marco en dos triángulos.» |
| B, idea 4, La regla: AO = OC sin BO = OD | **Se deja**: la frase lo dice para las dos; la fórmula ya ocupa el ancho. |
| B, idea 4, Así se resuelve sin dibujo | **Se deja**: el enunciado basta (bisectrices de dos vecinos). |
| B, idea 5, Ahora tú: los Datos van al revés de la pregunta | La recíproca en los Datos y en la condición de la regla (M8). |
| B, idea 6, Juega: «el fondo corrido» sin explicar; la voz | «el fondo, corrido a un lado»; voz: «¿El ancho del agua se parece más al de la boca o al del fondo?» |
| B, idea 6, Predice y La regla: «?» y «3 m» encima de MN; MN y PQ violeta en la fórmula | «PQ = ?» y «PQ = 3 m»; MN y PQ en tinta en la fórmula, como en el dibujo (M2). |
| B, tarjeta 01: «Desde un vértice salen triángulos: 12 − 2» | «Desde un vértice, los triángulos son dos menos que los lados». |
| B, tarjeta 05: «2x» entre D y C | La figura se elige con cada rótulo junto a su vértice (M3). |
| B, tarjeta 06: arcos y números que no calzan con los vértices | En un hexágono de 320 px ninguna forma deja cada número junto a su vértice: los giros van marcados sin número (el enunciado los da sin decir en qué esquina) y el «?» en F (M3). |
| B, tarjeta 07: «8 · 5» sin decir que 5 = 8 − 3 | «Con n = 8, de cada vértice salen 8 − 3 = 5». |
| B, tarjetas 09 y 11 sin dibujo | **Se dejan**: el enunciado basta; la 15 sí lo necesitaba. |
| B, tarjeta 13: demasiado fácil | **Se deja**: es nivel 1, un solo paso. |
| B, tarjeta 14: 64° dibujado obtuso y la «diagonal corta» larga | El rombo se dibuja con A aguda (46°), con el «?» a 9° de la respuesta (M5). |
| B, tarjeta 15: sin dibujo | Dibujo sin escala de los dos cuadrados, con el 14 cm y el 37° (M6). |
| B, tarjeta 18: «la mitad de la suma más la diferencia» se lee 25 | «Las bases suman 2 · 15 = 30 cm y se llevan 2 · 5 = 10 cm. Se suman las dos cosas y se saca la mitad» (M10); igual en el ejemplo 7. |
| B: los Datos del nivel 1 casi regalan (04, 13, 16 y «Ahora tú» de la mediana) | **Se dejan**: el nivel 1 aplica un dato, y la fórmula va en Datos por el punto 13; ninguno trae «lo pedido = el valor». |
