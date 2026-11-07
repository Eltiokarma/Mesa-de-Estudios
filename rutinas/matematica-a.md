# Rutina de matemática A (álgebra y trigonometría): reporte

Sesión paralela pedida por Gerson. Construye, una por una, plantillas de escena completas y revisadas en la rama `rutina/matematica-a`. La conversación principal las integra (catálogo, diseño, pendientes, CLAUDE.md). Orden de la lista: exponenciales y logaritmos, identidades trigonométricas, polinomios, funciones trigonométricas inversas.

Cada plantilla pasa por tres subagentes: constructor, verificador independiente de los casos (sin leer el motor) y revisor de contenido. Lo que encuentran se aplica antes de pasar a la siguiente.

## 6 nov 2026 · Exponenciales y logaritmos: la escalera de la base (`plantillas/exponenciales-logaritmos/`)

**Qué hice.**

- **`motor.js`** (UMD, sin DOM, fracciones exactas: log₆₄ 8 = 1/2 sale exacto). Cubre logaritmos con propiedades y cambio de base, la inversa de bˣ, ecuaciones exponenciales (igualar bases y cambio de variable u = bˣ), ecuaciones e inecuaciones logarítmicas con el dominio, inecuaciones exponenciales con base < 1, crecimiento, vida media y bˣ contra x². Rechaza la base 0, 1 o negativa y N ≤ 0. Cada resultado trae `errores` y `coinciden`.
- **`casos.json`**: 22 casos. **`motor.test.js`**: 44 pruebas, entre ellas la de propiedades (ningún error típico da la respuesta, en los casos y en un barrido de 300 parámetros por función) y la que comprueba que cada predicción sale del motor con opciones distintas y de la misma forma.
- **`papel.json`**: 10 problemas propios.
- **`plantilla.json`**: unidades `algebra.exponenciales-y-logaritmos` y `algebra.tipos-de-funciones-e-inversa`; borrador 0.1.0.
- **`index.html`**:
  - **Paso a paso** (9 pasos): una escalera donde cada salto multiplica por la base, con un marcador que se arrastra. Tiene 8 predicciones que bloquean:
    - log₂(8·4), con el distractor AL10;
    - log₂(8+8), con AL10 en sus dos formas;
    - el cambio de base, con AL31;
    - la inversa de 2ˣ, que se refleja en y = x y luego tiene la base como perilla (AL29 y reflejos en los ejes);
    - 4^(x+1) = 2^(3x), con AL32;
    - 4ˣ − 3·2ˣ + 2 = 0, con el cambio de variable;
    - log₂x + log₂(x−2) = 3, con la recta del dominio y la raíz extraña;
    - el cultivo que se duplica, en cuadritos contra t² (AL33).
  - **¿Qué pasa si…?** (6): sumar 1 al exponente (AL11), log₂(a²) (AL31), log₅1 + log₅5, (1/2)ˣ > 1/8 (invertir el sentido), la vida media con 96 g y 2ˣ contra x². Las pastillas se bloquean hasta responder las anteriores.
- **Respaldo.**
  - 'Parcial' solo para AL10, AL31 (Chua y Wood 2005, según resúmenes) y AL29.
  - 'Hipótesis' para AL11, AL32 y AL33, y para EL1 a EL25, que son hipótesis nuestras: cada uno lleva su id y su regla en el motor. Ningún error va como 'documentado'.

**Pruebas.** `npm test`: 1313; pasan 1311 y fallan solo las 2 esperadas (catálogo y app). Playwright a 1366×768 y 390×844, claro y oscuro, con y sin movimiento reducido: sin errores de consola. El bloqueo no se salta con clic forzado, quitando `disabled` desde la consola ni con el hash.

**Subagentes.**

- **Verificador independiente** (no leyó el motor): recalculó con fracciones los 21 casos de entonces, sustituyendo raíces, revisando el dominio y componiendo las inversas. No hubo discrepancias. Pidió casos de borde y entraron todos:
  - inecuación logarítmica con base 1/2 y dominio;
  - (1/3)ˣ ≤ 9;
  - log_{1/4} 8 = −3/2;
  - log₃x + log₃(x−8) = 2;
  - ecuaciones sin solución (log₂x = log₂(x−3) y 4ˣ + 3·2ˣ + 2 = 0);
  - vida media con tiempos que no son múltiplos (40√2);
  - inversa con x negativo;
  - bases inválidas.
- **Revisor de contenido:** encontró dos fallas graves, las dos corregidas.
  - En el paso 6 se veían los tres arcos ×4 que llegaban a 64 y regalaban x = 2. Ahora se ve uno solo antes de responder.
  - En el experimento 6 los rótulos de las curvas mostraban cuál terminaba arriba.

  También corregí:
  - el paso 4: la escalera ya no destaca 1, 8 y 64, y el enunciado da los logaritmos;
  - la x con dos colores en el paso 8;
  - el experimento «Un salto más», que delataba la respuesta (ahora «Sumar 1 al exponente»);
  - una frase falsa del experimento 6;
  - el paso final de papel p8;
  - el «solo» de las opciones;
  - el 26,7 g, que era la única opción con decimal;
  - «según resúmenes» en la fuente de la inversa;
  - rótulos y ecuaciones que se partían en el celular;
  - el texto para lectores de pantalla.

**Pendiente o dudoso.**

- EL12 («divide entre los periodos») queda como N0/(t/T). El verificador lo pensó como N0/2: es una definición del distractor, no un error de cálculo.
- En el paso 5 el daltonismo se cubre con el rótulo «y = 2ˣ» en el dibujo, no con «la continua».

**Pedidos para la integración.**

1. Catálogo: poner `exponenciales-logaritmos` en `algebra.exponenciales-y-logaritmos` y en `algebra.tipos-de-funciones-e-inversa`, y correr `npm run catalogo`. Sumar ítems de entrada y salida de álgebra (la prueba avisa).
2. `docs/diseno.md`, colores de la escalera de la base. El ΔE00 mínimo es 23,6 en claro y 25,3 en oscuro (el par t–t²); el contraste más bajo, 4,63.

   | Variable | Claro | Oscuro |
   | --- | --- | --- |
   | Base b y factor (naranja) | #a05200 | #f0a04a |
   | Exponente x, logaritmo y la curva log_b x (fucsia) | #a10fbf | #cf6bfa |
   | Potencia N, u, argumentos, bacterias, gramos y la curva bˣ (azul) | #1f5fbf | #7cb0ff |
   | Tiempo t (verde) | #466d14 | #a3d65e |
   | t² (turquesa) | #0f766e | #5ed9c8 |

   El color va por papel, no por letra: x es fucsia cuando es exponente y azul cuando es argumento (paso 8). La recta y = x va en gris a trazos.
3. `docs/investigacion/algebra-funciones-ideas-erroneas.md`: conviene sumar una tabla con EL1 a EL25 como hipótesis nuestras.
4. Líneas para `docs/pendientes.md` y `CLAUDE.md`: «Exponenciales y logaritmos (6 nov 2026, rutina de matemática A): `plantillas/exponenciales-logaritmos/` (la escalera de la base: sumar logaritmos es multiplicar, la inversa reflejada, ecuaciones con el dominio y el cultivo contra t²; 22 casos verificados aparte)».

## 6 nov 2026 · Identidades trigonométricas: alturas que no se suman (`plantillas/identidades-trig/`)

**Qué hice.**

- **`motor.js`** (UMD, sin DOM). Trabaja con números exactos de la forma (n/d)·√r y los escribe con el término positivo primero, por ejemplo (√6 + √2)/4. Usa la convención de academia del molde: 37°, 53°, 16° y 74°, con 37° + 16° = 53° exacto. Cubre:
  - la pitagórica, las recíprocas y por cociente con el signo por cuadrante, y la comprobación de identidades;
  - el seno, el coseno y la tangente de a ± b, con «no existe» en 90°;
  - el ángulo doble (cos 2x en sus tres formas), el ángulo mitad con el signo del cuadrante y el triple.

  Hay 15 errores propios, ID1 a ID15, en `ERRORES`.
- **Casos y pruebas.** `casos.json` tiene 21 casos con sus `tambien`. `motor.test.js` tiene 41 pruebas:
  - la de propiedades: ningún error da la respuesta, en los casos, en un barrido de 300 juegos y en todas las posiciones de arrastre;
  - la de las 14 predicciones: la respuesta sale del motor y las opciones son distintas y exactas.
- **`papel.json`**: 10 problemas propios.
- **`plantilla.json`**: unidades `trigonometria.identidades-fundamentales`, `trigonometria.arcos-compuestos` y `trigonometria.arcos-multiples`.
- **`index.html`**, paso a paso de 8 pasos:
  - (1) La circunferencia que se arrastra, con valores de verdad. Un botón aparte pone el «"37°" de academia» (x ≈ 36,87°, con 3/5 y 4/5 exactos y la cuadrícula de quintos).
  - (2) sen²30°, con TR17.
  - (3) La pitagórica, contando 25 = 9 + 16 cuadritos.
  - (4) sen 75° con barras de alturas (TR16). El punto de a + b queda oculto hasta responder.
  - (5) sen(37° + 16°) con el rectángulo de los cuatro productos.
  - (6) sen 2x.
  - (7) cos 2x, con cuadritos que se cancelan.
  - (8) cos(x/2).

  Hay 6 experimentos de «¿qué pasa si…?»: sec x desde tan x, sen(53° − 37°), cos(37° + 16°), tan(a + b) en la cuadrícula ((2 + i)(3 + i)), cos(x/2) en el IV cuadrante (TR12) y sen 3x. Las pastillas se bloquean hasta responder las anteriores.
- **Respaldo.**
  - **Parcial**, según resúmenes: TR16, solo en sen(a + b), sen 2x y cos(x/2) (Gür 2009 y Matz 1982, citados por terceros), y TR12.
  - **Extensión nuestra de TR16, como hipótesis:** la resta, el coseno de la suma, la tangente y el triple.
  - **Hipótesis:** TR17 e ID1 a ID15.

**Pruebas.** `npm test`: 1434 pruebas; pasan 1432 y solo fallan las 2 esperadas. Playwright, en las 8 combinaciones: sin errores de consola. El bloqueo no se salta con clic forzado, con una pastilla habilitada a mano ni por el hash.

**Subagentes.**

- **Verificador independiente** (no leyó el motor). Comprobó los 19 casos y los 10 de papel con fracciones exactas y un segundo camino: la fórmula contra el valor directo, las tres formas de cos 2x, sen(2x + x) contra 3s − 4s³ y (2 + i)(3 + i). No hubo discrepancias de valor; una sola de forma, (−√3 + √2)/2, que ya se escribe (√2 − √3)/2. Entraron los 12 bordes que pidió:
  - tan(a + b), que no existe en 90°;
  - el ángulo mitad en ⟨360°; 450°⟩ y en ⟨−90°; 0°⟩;
  - cos 2x negativo y cos 2x = 0;
  - a − b negativo;
  - sec y csc fuera del primer cuadrante;
  - identidades falsas con sec y csc;
  - el triple con signo;
  - la pitagórica en el IV cuadrante y sen = 5/4, que el motor rechaza;
  - cos x = ±1, donde `coinciden` lista los distractores iguales a la respuesta (la escena no usa esos casos).
- **Revisor de contenido.** La matemática estaba bien. Lo grave: la parte que se arrastra presentaba la convención de academia como verdad (sen 37° = 0,6 exacto). Ya se corrigió así:
  - el arrastre usa valores reales y arranca en 50°;
  - la academia va en un botón aparte que explica el redondeo;
  - el paso 6 ya no salta a valores reales al terminar.

  Arreglé también:
  - rótulos y barras que se pisaban en el celular, y lecturas cortadas con elipsis justo en la respuesta;
  - el experimento 1, que en su nombre daba la identidad (ahora «sec x desde tan x»);
  - tres casos de un color que nombraba dos cosas. sen(x/2) va en tinta. Las piezas del rectángulo van en tinta con borde granate. 3x cambió de color en oscuro, porque estaba a ΔE00 16 de x/2;
  - x agudo, ahora dicho en el experimento 6;
  - «de academia», escrito donde faltaba;
  - el respaldo de TR16, que se acotó;
  - papel p9, que repetía números de la escena (ahora cos x = −119/169), y p4, que pasó a cos 75°.

**Pendiente o dudoso.**

- «Simplificar y demostrar» está solo en el papel (p2 y p3, comprobados con `identidad`) y en el texto del paso 3; no tiene predicción en la escena.
- Transformaciones de suma a producto: fuera de esta plantilla.

**Pedidos para la integración.**

1. Catálogo: `identidades-trig` en `trigonometria.identidades-fundamentales`, `trigonometria.arcos-compuestos` y `trigonometria.arcos-multiples`, y luego `npm run catalogo`. Sumar ítems a la prueba de trigonometría (la prueba avisa).
2. `docs/diseno.md`, colores de esta escena:

   | Variable | Claro | Oscuro |
   | --- | --- | --- |
   | x | #a10fbf | #cf6bfa |
   | sen | #c0364a | #f17384 |
   | cos | #1f5fbf | #7cb0ff |
   | 2x | #466d14 | #a3d65e |
   | x/2 | #a05200 | #f0a04a |
   | 3x | #3d1c00 | #ff4f14 |
   | a | #7d6a00 | #e3c84a |
   | b | #005c6c | #009ca4 |
   | a + b | #77032c | #fdb4ce |

   - ΔE00 mínimo entre los que salen juntos: 25,9 en claro y 21,6 en oscuro.
   - Contraste más bajo: 4,50 (b sobre su chip, en oscuro).
   - Hay dos reglas de color. Con un solo ángulo x, sen y cos tienen color propio, como en circunferencia-trig. Con a y b, el color va por ángulo.
   - En oscuro, 3x queda a ΔE00 18,4 del rojo de los avisos, que siempre llevan texto.
3. `docs/investigacion/trigonometria-ideas-erroneas.md`: registrar ID1 a ID15 como hipótesis nuestras y anotar que TR16 se extendió a la resta, la tangente y el triple.
4. Líneas para `docs/pendientes.md` y `CLAUDE.md`: «Identidades trigonométricas (6 nov 2026, rutina de matemática A): `plantillas/identidades-trig/` (alturas que no se suman: pitagórica con cuadritos, arcos compuestos con barras y el rectángulo, doble, mitad con signo y triple; academia separada de los valores reales; 21 casos verificados aparte)». Con esto, en la fila ma1 de pendientes quedan faltando transformaciones y funciones inversas.

## 7 nov 2026 · Polinomios: la máquina de Ruffini (`plantillas/polinomios/`)

Un reinicio del contenedor borró el primer avance, y después el límite de uso cortó al constructor. Por eso hay un commit de avance a medias antes del borrador.

**Qué hice.**

- **`motor.js`** (UMD, fracciones exactas). La cabecera para el verificador va hasta la línea 93. Tiene 20 funciones:
  - texto y valor numérico, con P(0) y P(1);
  - grados relativo y absoluto, del producto, de la suma y de la potencia;
  - polinomio completo;
  - Ruffini, también con divisor ax + b y el cociente falso, y división clásica, con su caja de área;
  - resto por sustitución con x² + k, teorema del resto y k para que haya factor;
  - raíces racionales candidatas, suma y curva.

  Cada resultado trae `errores` y `coinciden`, con 34 errores propios: PO1 a PO34.
- **`casos.json`**: 22 casos con sus `tambien`.
- **`motor.test.js`**: 39 pruebas. Incluye:
  - dividendo = divisor·Q + R en Ruffini y en la división clásica;
  - resto = P(raíz);
  - la sustitución coincide con la división;
  - el k de `factorK` anula P;
  - la prueba de propiedades, en los casos y en un barrido de 300;
  - las 12 predicciones de la escena.
- **`papel.json`**: 10 problemas propios.
- **`plantilla.json`**: unidades `algebra.polinomios`, `algebra.division-de-polinomios` y `algebra.ecuaciones-polinomiales` (esta última porque su temario incluye raíces racionales).
- **`index.html`**, paso a paso de 8 pasos con 7 predicciones. Las fichas de los coeficientes bajan por la tabla, con el hueco que se llena con 0. El triángulo a se arrastra sobre la recta, y la curva muestra que el resto es la altura P(a). Las predicciones:
  - T(0) = término independiente;
  - grado absoluto;
  - grado del producto;
  - Ruffini con el 0 que falta;
  - resto entre x + 2 en P(x) = x³ − 4x² − x + 4, con raíces −1, 1 y 4 dentro de la manija;
  - divisor 2x − 1, con el cociente falso;
  - k para que haya factor.

  «¿Qué pasa si…?» tiene 5 experimentos: P(1), los términos de un completo, el grado de la suma, el resto entre x² + 1 por sustitución y las raíces candidatas.
- **Respaldo.** Todos los PO son hipótesis nuestras, porque el informe no trae datos de polinomios. AL16 (el despeje con el signo cambiado) también va como hipótesis. Gamboa y otros (2019) se cita solo como un parecido, sin cifras.

**Pruebas.** `npm test`: 1515; pasan 1513 y solo fallan las 2 esperadas. Playwright en las 8 combinaciones:
- sin errores de consola ni desbordes, y ninguna ecuación pide desplazarse de lado;
- el bloqueo no se salta con clic forzado, consola ni hash;
- en el celular el lienzo se ve al responder, y el dedo lejos del triángulo desplaza la página (lo probó el revisor).

**Subagentes.** Esta vez usé el método vigente de `docs/metodo/`.

- **Verificador independiente.** Recibió solo las entradas, sin respuestas, y la cabecera del motor. Recalculó 130 campos con fracciones:
  - evaluó con potencias directas;
  - contrastó Ruffini con la división larga;
  - contrastó la sustitución con la división.

  Coincidieron 129. El otro fue una decisión de diseño: PO15 ((−2)² = −4) solo existe con raíz negativa, y quedó escrito en la cabecera. Los 14 bordes que calculó entraron todos, entre ellos:
  - divisor con a negativo;
  - resto 0 y varios ceros;
  - polinomio constante, que el motor rechaza en Ruffini;
  - raíces repetidas y k fraccionario;
  - división clásica con divisor de grado 2, con resto −x, exacta o con dividendo de grado menor.
- **Revisor de contenido.** Encontró dos graves y las corregí:
  - El paso 6 invitaba a buscar un a con resto 0 en un polinomio sin raíz entera. Lo cambié por x³ − 4x² − x + 4 y recalculé las opciones con el motor.
  - PO15 estaba como 'parcial' sin dato. Ahora es hipótesis.

  Corregí también:
  - las ecuaciones cortadas: ahora parten en «=» y en ⟹;
  - las opciones del paso 7, en dos líneas;
  - el paso 2, que tras responder mostraba justo un distractor;
  - la letra a, que nombraba la manija y el coeficiente del divisor;
  - lecturas y chips partidos;
  - las marcas del experimento 5, que se pisaban;
  - textos del paso 1 y de las fuentes.

**Pendiente.** Horner solo aparece en un texto y en el papel, sin animación. En el experimento 4 la tabla comprueba la sustitución, pero no la dibuja paso a paso.

**Pedidos para la integración.**

1. Catálogo: `polinomios` en `algebra.polinomios`, `algebra.division-de-polinomios` y `algebra.ecuaciones-polinomiales`, y luego `npm run catalogo`. Con esta plantilla álgebra pasa de 4 plantillas, así que hay que rebalancear `catalogo/pruebas/algebra.json` (máximo 2 ítems por plantilla).
2. `docs/diseno.md`, colores de la máquina de Ruffini:

   | Variable | Claro | Oscuro |
   | --- | --- | --- |
   | Coeficientes y k | #1f5fbf | #7cb0ff |
   | a | #a05200 | #f0a04a |
   | Resto R = P(a) | #a10fbf | #cf6bfa |
   | Cociente Q | #466d14 | #a3d65e |
   | Exponentes y grado | #0f766e | #5ed9c8 |
   | Divisor | #77032c | #fdb4ce |

   - ΔE00 mínimo entre los que salen juntos: 23,6 en claro y 25,2 en oscuro.
   - Pares bajo ΔE00 20 con los colores de estado, que siempre van con texto:
     - turquesa y verde de «correcto»: 11,1 en claro y 11,0 en oscuro;
     - cociente y «correcto»: 15,6 en claro y 17,3 en oscuro;
     - divisor y rojo de avisos: 17,4 en oscuro.
3. `docs/investigacion/algebra-funciones-ideas-erroneas.md`: registrar PO1 a PO34 como hipótesis nuestras, porque el informe no cubre polinomios.
4. `docs/metodo/entradas.py` se cae cuando `espera` es un valor suelto y no un objeto. Usé una copia corregida en el scratchpad: `pide` = ["valor"].
5. Líneas para `docs/pendientes.md` y `CLAUDE.md`: «Polinomios (7 nov 2026, rutina de matemática A): `plantillas/polinomios/` (la máquina de Ruffini: fichas con el 0 que falta, el resto es la altura P(a) en la curva, divisor ax + b con el cociente falso, grados, resto por sustitución y raíces racionales; 22 casos verificados aparte)».

## 7 nov 2026 · Funciones trigonométricas inversas: la ventana principal (`plantillas/funciones-trig-inversas/`)

Hubo dos cortes por el límite de uso; los avances quedaron en commits parciales.

**Qué hice.**

- **`motor.js`** (UMD; la cabecera para el verificador va hasta la línea 60).
  - Cubre arcsen, arccos, arctan y arccot con los rangos principales de academia: arccot va en ⟨0; π⟩. arcsec y arccsc están en `arco`, pero solo se usan en el papel.
  - Funciones:
    - los cortes de y = k con la onda;
    - la ventana, que sirve solo si es un tramo monótono completo;
    - compuestas con el triángulo;
    - dominio de arcsen(ax + b), que invierte el sentido si a < 0;
    - arcsen x + arccos x;
    - sen⁻¹ y su notación;
    - arctan a + arctan b, con la corrección de ±π cuando ab > 1.
  - La convención de academia («37°», que en realidad mide 36,87°) se marca con `academia` y `gradosReal`.
  - Cada resultado trae `errores` y `repetidos`. Cuando dos errores dan lo mismo, el segundo se descarta y la escena no muestra opciones iguales.
- **Casos y papel.**
  - `casos.json`: 19 casos con sus `tambien`.
  - `motor.test.js`: 40 pruebas. Incluye propiedades contra Math (imparidad, π − arccos, la suma π/2, que los cortes cumplen la ecuación), la prueba de propiedades y que las 12 predicciones tengan la misma forma y no digan «solo».
  - `papel.json`: 10 problemas propios. p10 es arcsec(−2) + arccsc 2 = 5π/6.
- **`plantilla.json`**: unidad `trigonometria.funciones-trigonometricas-inversas`.
- **`index.html`**: la onda del seno con la recta y = k que se arrastra. Se pinta la ventana principal, solo un corte queda adentro y el tramo se refleja en y = x. Además están la circunferencia («arcsen lee la altura y devuelve el ángulo de la derecha; arccos lee la abscisa y devuelve el de arriba») y el triángulo de las compuestas.
- **Paso a paso:** 8 pasos con 8 predicciones:
  1. los ángulos de seno 1/2 en una vuelta (TR22);
  2. arcsen(−1/2);
  3. arcsen(sen 150°);
  4. arccos(−1/2);
  5. cos(arcsen 3/5);
  6. arccot(−1);
  7. arcsen 0,3 + arccos 0,3;
  8. el dominio de arcsen(2x − 1).
- **¿Qué pasa si…?:** 5 experimentos:
  1. una ventana del seno que se arrastra;
  2. arccos(cos(−60°));
  3. arctan 1000;
  4. sen⁻¹(0,5) en radianes;
  5. arctan(1/2) + arctan(1/3), con la flecha que cae en la diagonal.
- **Respaldo.** Ninguno es 'documentado', porque el informe no trata las inversas.
  - TR12 es 'parcial' solo en el paso 1 (Brown 2005, sin cifra). En los pasos 2, 4 y 6 va como extensión nuestra, hipótesis.
  - TR22 y TR14 son hipótesis. TR17 se cita solo como parecido.
  - IN1 a IN29 son hipótesis nuestras.

**Pruebas.** `npm test`: 1653; pasan 1651 y solo fallan las 2 esperadas. Playwright en las 8 combinaciones:
- sin errores de consola, desbordes ni ecuaciones con scroll lateral;
- el bloqueo no se salta con clic forzado, hash ni pastillas;
- en el celular el lienzo queda fijo arriba mientras la predicción está pendiente;
- el dedo lejos de la manija desplaza la página (lo probó también el revisor en todas las combinaciones).

**Subagentes.**

- **Verificador independiente.** Recibió solo las entradas y la cabecera. Usó métodos distintos: cortes grado a grado, Fraction, Pitágoras exacto y el argumento de (1 + ai)(1 + bi). Coincidieron todos los valores de los 19 casos y los 9 de papel de entonces. Señaló tres distractores dudosos, y los tres se corrigieron:
  - «π/6 y π/3» en el paso 1, ahora «π/3 y 5π/3», que es resolver cos θ = 1/2;
  - el rango cerrado con |k| chico, que ahora solo se genera con |k| ≥ 10;
  - dos errores iguales en arccot(−1).

  Entraron todos sus bordes:
  - k = ±1 y 0;
  - arccos 2, que no existe;
  - arccos(3 − x);
  - arcsen(sen θ) en los cuatro cuadrantes y con más de una vuelta;
  - arccos(cos θ) con θ negativo;
  - sumas de arctan con ab = 1 y con ab > 1 en negativos;
  - arccot(−1/√3);
  - compuestas con signo.

  Un dato del verificador estaba mal: arctan(−2) + arctan(−3) «sin corregir» da π/4, no −π/4, porque (−5)/(1 − 6) = 1. El motor queda con π/4.
- **Revisor de contenido.** Sin graves. Corregí:
  - el paso 6: el punto (−1; 1) delataba el rayo a 135° y ahora sale en la animación;
  - el título del paso 1, que descartaba la opción TR22, y el subtítulo de la página;
  - el paso 5: el color de k también nombraba el cateto, y ahora los lados van en tinta;
  - lecturas cortadas a 390 px;
  - el experimento 5 y p7, que usaban la regla del producto de complejos sin explicarla;
  - la falta de arcsec y arccsc, que la unidad pide: ahora están en p10;
  - textos imprecisos (k = ±1, «la manija de abajo», el semieje);
  - rótulos que se pisaban, que ahora se pintan al final con fondo;
  - el `:hover` que quedaba pegado en el celular;
  - el aria-live al responder.

**Pendiente.**

- arcsec y arccsc solo están en el papel.
- φ cambia de papel entre pasos: es el ángulo de partida en el paso 3 y el segundo ángulo en el paso 7, con leyenda.
- En la gráfica ancha del celular, algunas marcas del eje quedan cerca de los rótulos de los cortes.

**Pedidos para la integración.**

1. Catálogo: `funciones-trig-inversas` en `trigonometria.funciones-trigonometricas-inversas`, y luego `npm run catalogo`. Sumar ítems a la prueba de trigonometría y rebalancear si toca (la prueba avisa).
2. `docs/diseno.md`, colores de la ventana principal:

   | Variable | Claro | Oscuro |
   | --- | --- | --- |
   | θ (ángulo devuelto y ventana) | #a10fbf | #cf6bfa |
   | k (número que recibe) | #0f766e | #5ed9c8 |
   | φ (ángulo de partida o segundo arco) | #a05200 | #f0a04a |
   | Lado o razón buscada en la compuesta | #466d14 | #a3d65e |

   - ΔE00 mínimo: 23,6 en claro y 25,3 en oscuro.
   - Contraste mínimo: 4,63.
   - k queda a ΔE00 11 del verde de «correcto», que siempre lleva texto y borde.
3. `docs/investigacion/trigonometria-ideas-erroneas.md`: registrar IN1 a IN29 como hipótesis nuestras, porque el informe no cubre las inversas.
4. Líneas para `docs/pendientes.md` y `CLAUDE.md`: «Funciones trigonométricas inversas (7 nov 2026, rutina de matemática A): `plantillas/funciones-trig-inversas/` (la ventana principal: la recta y = k corta la onda muchas veces y solo un corte cae en la ventana; reflejo en y = x, arcsen y arccos en la circunferencia, compuestas con el triángulo, dominio y suma de arcotangentes; 19 casos verificados aparte)». Con esto, en la fila ma1 de pendientes solo faltan las transformaciones.

**Fin de la lista.** Las cuatro plantillas pedidas están hechas. La conversación principal mandó por mensaje una lista nueva (transformaciones trigonométricas, complejos, matrices, binomio de Newton, números reales, programación lineal y cónicas). Queda en espera hasta que Gerson confirme.

## Lista nueva (confirmada por Gerson el 7 nov 2026)

La conversación principal mandó una lista nueva: transformaciones trigonométricas, números complejos, matrices, binomio de Newton, números reales, programación lineal y cónicas. Gerson la confirmó en esta sesión.

- Números reales, programación lineal, lógica y conjuntos ya los hicieron otras rutinas, así que los salté.
- Quedan cinco: transformaciones, complejos, matrices, binomio y cónicas.
- Corren hasta 3 subagentes a la vez.

## 7 nov 2026 · Números complejos: la flecha en el plano (`plantillas/numeros-complejos/`)

**Qué hice.**

- **`motor.js`**: UMD con aritmética exacta (fracciones y radicales k√m). La cabecera para el verificador va hasta la línea 102. Cubre:
  - potencias de i, con su ciclo y las potencias negativas;
  - operaciones en forma binómica: suma, producto, conjugado y cociente con el conjugado;
  - módulo y argumento principal en ⟨−180°; 180°], con el campo `positivo` en [0°; 360°⟩;
  - polar cis y paso a binómica;
  - producto y cociente en polar;
  - De Moivre con cualquier entero;
  - raíces de la cuadrática con Δ < 0;
  - √(−a)·√(−b).

  Hay errores propios del CX1 al CX35. En la cabecera quedaron escritas tres convenciones:
  - `restaModulos` va a `noAplica` si el módulo sale ≤ 0;
  - `reparte` también se calcula con radicales;
  - «±3i» va pegado y «1 ± 2i» con espacios.
- **`casos.json`**: 19 casos con 84 llamadas en `tambien`.
- **`motor.test.js`**: 38 pruebas.
  - Propiedades: el ciclo de iⁿ, (z/w)·w = z, z·z̄ = |z|², la ida y vuelta entre polar y binómica, De Moivre contra la multiplicación repetida y las raíces de la cuadrática.
  - Ningún error coincide con la respuesta, en los casos y en un barrido de 300.
  - Las opciones de la escena salen del motor.
- **`papel.json`**: 10 problemas propios.
- **`plantilla.json`**: solo la unidad `algebra.numeros-complejos`. No puse `trigonometria.coordenadas-polares-y-complejos`, porque su temario pide coordenadas polares de puntos y forma exponencial.
- **`index.html`**: el plano de Argand con la flecha de z que se arrastra.
  - **Paso a paso** (8 predicciones):
    - i², donde multiplicar por i gira 90°;
    - i⁴³, con las vueltas contadas;
    - (2 + 3i)(1 − 2i);
    - |−4 + 3i|, con la hipotenusa y sus cuadritos;
    - el conjugado como reflejo;
    - (5 + i)/(1 − i);
    - −1 + √3 i en polar;
    - (2 cis 10°)(3 cis 30°), con el triángulo semejante.
  - **¿Qué pasa si…?** (5): i⁻¹, √(−4)·√(−9) = −6, el cociente en polar, (1 + i)⁸ y x² − 4x + 13 = 0.
- **Respaldo.**
  - AL9 es 'parcial' solo en el paso 4. El informe nombra √(a² + b²) = a + b (Aguerrea y otros 2022, sin cifra).
  - AL11 queda como hipótesis.
  - CX1 a CX35 son hipótesis nuestras, porque el informe no trata los complejos.

**Pruebas.** `motor.test.js` pasa 38 de 38. En `npm test` fallan solo las 2 de catálogo y app, y la de matrices, que todavía está a medio hacer en esta rama. La pasada del celular no da QUEDA. Playwright pasa en las 8 combinaciones.

**Subagentes.**

- **Verificador independiente.** Recalculó todo en Q(i) con Fraction y con cmath, sin leer el motor ni `casos.json`. Coincidieron todos los valores y los 10 problemas de papel. Quedaron escritas sus convenciones y entraron sus bordes:
  - i⁻¹⁰⁰ e i⁻²⁰²⁷;
  - z = 0 y la división entre 0;
  - Arg de −5 y de 3i;
  - cocientes entre imaginarios puros;
  - De Moivre con n ≤ 0;
  - un producto que cae en 180° y no en −180°;
  - cuadráticas con a < 0, con Δ > 0 y con Δ = 0;
  - −√3 − i.

  Además, p4 ahora comprueba la igualdad pedida.
- **Revisor de contenido.**
  - **Lo grave:** en el paso 8, z = 2 cis 15° y w = 3 cis 20° casi coincidían y la flecha de w tapaba a z en el celular. Ahora z = 2 cis 10° y w = 3 cis 30°, con la respuesta 6 cis 40°.
  - **También corregí:**
    - los rótulos encimados del paso 7 y las lecturas cortadas;
    - los experimentos 1 y 2, donde la justificación de la correcta la delataba; ahora todas las opciones tienen la misma forma;
    - el distractor «3 + 3i», que no era creíble; ahora es «3 − 2i» (CX35, multiplicar por w y no por w̄);
    - «z = 5 + 1 · i»;
    - el subtítulo, que hablaba de la suma;
    - w sin color en las ecuaciones;
    - el azul de θ, que nombraba dos ángulos; el ángulo del resultado va en tinta;
    - la b de la fórmula cuadrática, que chocaba con Im;
    - el rango de Arg, con la otra convención;
    - el matiz de AL9;
    - el distractor «3 cis 2,5°», que ahora es «3 cis (−60°)».

**Pendiente.** Del temario quedan la forma exponencial, las raíces n-ésimas y las regiones en el plano.

**Pedidos para la integración.**

1. Catálogo: `numeros-complejos` en `algebra.numeros-complejos`, y luego `npm run catalogo`. Rebalancear los ítems de álgebra (la prueba avisa).
2. `docs/diseno.md`. ΔE00 mínimo entre variables: 23,6 en claro y 25,3 en oscuro. Contraste mínimo: 4,63. w queda a ΔE00 11 del verde de «correcto», que siempre lleva texto.

   | Variable | Claro | Oscuro |
   | --- | --- | --- |
   | Re (a) | #a05200 | #f0a04a |
   | Im (b) | #466d14 | #a3d65e |
   | r (flecha de z y \|z\|) | #a10fbf | #cf6bfa |
   | θ (Arg z) | #1f5fbf | #7cb0ff |
   | w | #0f766e | #5ed9c8 |

3. Informe de álgebra: registrar CX1 a CX35 como hipótesis nuestras.
4. Línea para `docs/pendientes.md` y `CLAUDE.md`: «Números complejos (7 nov 2026, sesión de matemática A): `plantillas/numeros-complejos/` (la flecha en el plano: multiplicar por i gira 90°, módulo con cuadritos, conjugado como reflejo, producto que gira y estira, De Moivre; 19 casos verificados aparte)».
