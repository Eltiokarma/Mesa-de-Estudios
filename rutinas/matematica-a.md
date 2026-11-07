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
