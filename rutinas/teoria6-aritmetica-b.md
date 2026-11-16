# Ronda 6: «Lee» y «Así se resuelve» en aritmética, parte B (16 nov 2026)

Encargo: `rutinas/encargos/teoria6-aritmetica-b.md`. Rama `teoria6/aritmetica-b`, un commit por unidad. No se integró a main.

**Resumen.** Las 9 unidades de la lista quedaron con los dos momentos en **todas** sus ideas (46 ideas). Cada unidad la escribió un subagente en una copia aparte del repo, tocando solo su archivo. La sesión principal revisó, probó e integró. En «Lee» van de 3 a 4 tarjetas por idea. Cada «Así se resuelve» usa `azar(s + 900)` y las mismas funciones o motor que el «Ahora tú» de su idea (regla 1), y alterna los mismos tipos de problema por semilla.

**Pruebas.**
- Por unidad: `npm run catalogo` y la prueba de la unidad en `contenido/teoria/teoria.test.js` (el validador revisa 12 semillas de `resuelve`), todas en verde.
- `npm test` completo antes del último push: 8788 de 8788 en verde.
- Recorrido con Playwright a 360 × 780 en una idea por unidad: `rutinas/teoria6-aritmetica-b/pw.js <puerto> <salida> <unidad> [idea]`, con un alumno `{ uni: 'unmsm', grado: '5' }` en `localStorage['lab-v1']`. Comprueba lo siguiente:
  - la idea abre en «Lee»;
  - el botón pasa de tarjeta en tarjeta (lo dicen los puntos) y en la última dice «Siguiente: Juega»;
  - «Ir directo a jugar» salta al juego;
  - con `momento: 'resuelve'`, el botón revela los pasos uno por uno;
  - sale la respuesta;
  - «Otro ejemplo» cambia el enunciado;
  - no hay errores de consola.
- Ideas recorridas, todas en ok: numeracion/cambio-base, cuatro-operaciones/otras-bases, divisibilidad/restos-potenciales, numeros-primos-y-divisores/factorizacion, mcd-y-mcm/mcd-cintas, numeros-racionales/exacto-periodico, potenciacion-y-radicacion/perfectos, sucesiones-y-series/diferencias y razonamiento-numerico/moviles. El script también pasa en la unidad de referencia, razones-y-proporciones. Miré las capturas: los pasos se ven con su color y la figura cambia en el paso de las cuentas.

## Por unidad: qué cuenta «Lee» y qué resuelve «Así se resuelve»

### aritmetica.numeracion (4 ideas)
- **agrupar**
  - Lee: contar por grupos (huevos por docena en la feria), el nombre «base» (10 monedas de un sol por un billete de 10) y qué mirar (la fila llena, las fichas rojas, el numeral).
  - Resuelve: la menor base de un numeral, o n fichas en base b pasadas a numeral. El rótulo del enunciado dice «n fichas», sin el numeral, para no regalar la respuesta.
- **descomposicion**
  - Lee: el valor posicional con 555, cómo se escribe y se lee la base con (213)₅, y qué mirar.
  - Resuelve: (c)_b a base 10. La tabla polinómica se llena en las cuentas; el paso de sentido comprueba que el valor queda entre b^(k−1) y b^k.
- **cambio-base**
  - Lee: la misma plata juntada de otra forma, dividir con resto (17 chuños en bolsas de 5) y qué mirar.
  - Resuelve: de base 10 a base b con divisiones sucesivas, o de base a a base c pasando por base 10.
- **conteo-cifras**
  - Lee: cuántas cifras gasta una página, contar de a hasta z, y las dos tiras.
  - Resuelve: las cifras para numerar de 1 a P (por bloques), o cuántos numerales de k cifras hay en base b.

### aritmetica.cuatro-operaciones (6 ideas)
- **sumatorias**
  - Lee: latas apiladas en escalera, las palabras sumandos, consecutivos y sumatoria, y contar filas y columnas.
  - Resuelve: una suma de 1 a k, los boletos de una rifa de lo a hi, o los pares hasta 2k.
- **complemento**
  - Lee: el vuelto de 37 soles con un billete de 100, el nombre CA y qué marca cada punto de la recta.
  - Resuelve: CA(N), con la recta; la cota aparece en las cuentas.
- **defecto-exceso**
  - Lee: maples de 30 huevos, dividendo, divisor y cociente, y qué son «defecto» y «exceso».
  - Resuelve: el resto por exceso (con la recta), o el dividendo a partir de d, el cociente por defecto y el resto por exceso.
- **otras-bases**
  - Lee: agrupar de cinco en cinco, cómo se lee (34)₅, y cuándo se lleva 1.
  - Resuelve: una suma en base b con la tabla, o una resta pasando por base 10.
- **multiplicar-partes**
  - Lee: factores y producto, 12 kilos de papa a 3 soles cobrados por partes, y los pedazos de la tira.
  - Resuelve: cuánto cambia el producto si un factor sube o baja k, o un producto por partes.
- **cifras-producto**
  - Lee: 48 sacos de chuño de 52 kilos (¿cientos o miles?), qué es acotar, y comparar el producto de los menores con el de los mayores.
  - Resuelve: cuántas cifras tiene A × B, o el cociente entero de A entre B.

### aritmetica.divisibilidad (5 ideas)
- **filas-de-m**
  - Lee: 24 panes en bolsas de 6, divisor y múltiplo con m | n, y las fichas rojas.
  - Resuelve: n fichas en filas de m, ¿cuántas sobran?
- **restos-suman**
  - Lee: huevos por docenas (30 = 12·2 + 6), qué es ser congruentes y el bloque de la derecha.
  - Resuelve: el resto de a + b o de a·b conociendo los restos de a y de b.
- **restos-potenciales**
  - Lee: qué día será dentro de 100 días, base y exponente, y el primer resto que se repite en la tabla.
  - Resuelve: el resto de b^e entre k, con la tabla y la fila del lugar resaltada.
- **criterios**
  - Lee: 5 877 como cifras en lugares, qué es un criterio y la columna turquesa.
  - Resuelve: el resto de N entre 3, 9, 11 o 4 con su criterio, y se comprueba con la división completa.
- **diofanticas**
  - Lee: juegos de 4 y 6 soles en la feria (¿se puede gastar justo 22?) y el nombre que viene de Diofanto.
  - Resuelve: si ax + by = c tiene soluciones enteras (con el mcd), o cuántas formas hay de comprar.

### aritmetica.numeros-primos-y-divisores (6 ideas)
- **rectangulos**
  - Lee: 12 naranjas en filas, la palabra divisor, y contar rectángulos.
  - Resuelve: cuál de 4 números es primo, probando con los primos hasta la raíz.
- **criba**
  - Lee: criba quiere decir colador, Eratóstenes, tachar múltiplos.
  - Resuelve: hasta qué primo basta tachar para llegar a N.
- **factorizacion**
  - Lee: desarmar 36 en primos, los exponentes y la sigla PESI solo nombrada.
  - Resuelve: factorizar n con la tabla de divisiones, o decidir si a y b son PESI.
- **divisores**
  - Lee: 12 huevos en bolsas iguales, que una potencia con exponente 0 vale 1, y contar filas y columnas.
  - Resuelve: la cantidad o la suma de los divisores de 2ᵃ·3ᵇ·5ᶜ.
- **euler**
  - Lee: puestos de una feria del 1 al 15, cómo se lee φ(n), y comparar un primo con un compuesto.
  - Resuelve: φ(n) con la fracción de cada primo; la grilla sale si n ≤ 30.
- **fermat-wilson**
  - Lee: restos con los domingos de feria, el factorial y qué columnas mirar.
  - Resuelve: a^e mód p con Fermat, o (p − 2)! mód p con Wilson.

### aritmetica.mcd-y-mcm (5 ideas)
- **mcd-cintas**
  - Lee: la vendedora que corta cintas sin retazos, divisor común, y el sobrante de cada cinta.
  - Resuelve: el frente de lotes iguales (MCD por primos), o cuántos trozos salen de dos cintas. Las tiras salen cortadas en las cuentas.
- **mcm-coinciden**
  - Lee: dos combis en un paradero, múltiplo común, y los minutos con punto en las dos filas.
  - Resuelve: cuándo vuelven a salir juntas, o a qué altura coinciden dos pilas de cajas. El punto del MCM aparece en las cuentas.
- **euclides**
  - Lee: las partes de una división (23 papas en bolsas de 5), Euclides y su algoritmo.
  - Resuelve: el MCD por divisiones sucesivas, o qué par menor conserva el MCD.
- **mcd-por-mcm**
  - Lee: el producto de primos, el exponente y cómo se lee la tabla de exponentes.
  - Resuelve: el MCM a partir del producto y el MCD, o el otro número.
- **fraccion-continua**
  - Lee: la fracción en escalones (7/3 = 2 + 1/3) y la notación [2; 3].
  - Resuelve: la fracción continua de a/b, o su valor sin el último término. Ese valor se coteja dentro del código con el convergente del motor.

### aritmetica.numeros-racionales (5 ideas)
- **equivalentes**
  - Lee: un queso partido en 5 en la feria, numerador y denominador con sus colores.
  - Resuelve: el número del recuadro (simplificar y amplificar), comprobado con productos cruzados.
- **orden-recta**
  - Lee: cada número tiene su lugar en la recta (como en una wincha) y 3/2 kg de quinua.
  - Resuelve: cuál fracción es mayor, en cruz y con denominador común.
- **exacto-periodico**
  - Lee: 3/4 de sol son 75 céntimos, período, exacto y periódico, y seguir la columna de restos.
  - Resuelve: si el decimal es exacto, periódico puro o mixto, factorizando el denominador.
- **generatriz**
  - Lee: 0,333… = 1/3, puro contra mixto, y restar las colas.
  - Resuelve: la generatriz con 10ᵏ⁺ᵖx − 10ᵏx, simplificada y comprobada dividiendo.
- **otras-bases**
  - Lee: los khipus en base 10 y cómo se marca la base.
  - Resuelve: si 1/n es exacta en base B, comparando primos.

### aritmetica.potenciacion-y-radicacion (4 ideas)
- **perfectos**
  - Lee: 3³ con una caja de chuño, cuadrado y cubo perfecto, la factorización y las columnas «¿par?» y «¿de a 3?».
  - Resuelve: el factor mínimo que vuelve a N un cuadrado o un cubo perfecto, con la tabla de exponentes.
- **exclusion**
  - Lee: la cifra de las unidades y qué es un criterio de exclusión.
  - Resuelve: ¿es N un cuadrado perfecto? Por la última cifra y los cuadrados vecinos.
- **raiz-entera**
  - Lee: un piso cuadrado con 50 losetas (solo la pregunta) y la raíz con residuo.
  - Resuelve: la raíz cuadrada o cúbica entera y su residuo, con fichas si N ≤ 120.
- **aproximadas**
  - Lee: √2 es irracional y no hay calculadora en el examen, y qué son décimas y centésimas.
  - Resuelve: entre qué enteros o décimas está √N, o √(a + b) sin repartir la raíz.

### aritmetica.sucesiones-y-series (5 ideas)
- **progresion-aritmetica**
  - Lee: sucesión, término y lugar, la alcancía 3, 8, 13, 18 y la diferencia común.
  - Resuelve: cuántos términos hay, o cuánto vale el término de lugar k.
- **suma-rectangulo**
  - Lee: las ventas de quinua de la semana y qué son las sumas notables.
  - Resuelve: los 4 tipos de «Ahora tú»: progresión aritmética, 1 + … + n, impares y cuadrados.
- **progresion-geometrica**
  - Lee: un aviso que se reenvía a 3 en el grupo del colegio, la razón como cociente y por qué restar no sirve.
  - Resuelve: el término de lugar k, o la suma de los k primeros términos.
- **diferencias**
  - Lee: primeras y segundas diferencias con 1, 4, 9, 16, y polinomio y grado.
  - Resuelve: el término que sigue con segundas diferencias constantes; la tabla cambia en las cuentas.
- **suma-infinita**
  - Lee: pasos que se achican hacia la orilla del lago y qué es un límite.
  - Resuelve: a₁/(1 − r), o «no tiene límite» cuando r = 3/2.

### aritmetica.razonamiento-numerico (6 ideas)
- **falsa-suposicion**
  - Lee: entradas de dos precios en la feria y qué es un canje.
  - Resuelve: n cajas, monedas o entradas de dos valores con su total, ¿cuántas de las mayores?
- **regresivo**
  - Lee: el número pensado, operación inversa (sin decir el orden) y cómo leer la tabla.
  - Resuelve: «Pensé un número…», deshaciendo en la tabla.
- **edades**
  - Lee: edades en la familia, doble, triple, «hace» y «dentro de».
  - Resuelve: dentro de cuántos años el padre tendrá k veces la edad del hijo (con tiras), o la edad de la madre cuando la hija tenga tal edad.
- **moviles**
  - Lee: Juliaca–Puno, unos 45 km, encuentro y alcance, A y B en la recta.
  - Resuelve: encuentro o alcance en la recta.
- **criptoaritmetica**
  - Lee: letras en vez de cifras, el reverso (47 y 74), y que AB no es A por B.
  - Resuelve: AB + BA = S, ¿A + B?, o ABC − CBA = D, ¿A − C?
- **suficiencia**
  - Lee: qué es una pregunta de suficiencia de datos y cómo leer la tabla.
  - Resuelve: la suma por lado S del triángulo con sus vértices, o si basta el dato (x + y, x·y, 2x + 2y).

Ninguna tarjeta de «Lee» deja deducir la opción correcta de «Predice». Cada subagente lo cotejó con la pregunta y las opciones de su idea, y la sesión principal miró los títulos y las tarjetas de muestra.

## Semillas revisadas a mano

Los subagentes recalcularon aparte 3 o más semillas por idea:

| Unidad | Semillas |
| --- | --- |
| numeracion | 0, 1, 2, 5 y 6 |
| cuatro-operaciones | 0, 1 y 2; repaso de la 3 a la 11 |
| divisibilidad | 0, 1, 2, 3, 9 y 11 |
| numeros-primos-y-divisores | 0 a 5, 7, 10 y 20 |
| mcd-y-mcm | 0 a 3 y 5 |
| numeros-racionales | 0 a 3 |
| potenciacion-y-radicacion | 0, 1, 2, 4, 5 y 7 |
| sucesiones-y-series | 0 a 3 y 11 |
| razonamiento-numerico | 0, 1, 2 y 10 |

La sesión principal volvió a hacer las cuentas de una semilla más en todas las ideas de cada unidad: la 4 en numeracion, la 5 en cinco unidades y la 7 en tres. Todas cuadran. Algunos ejemplos:
- (2312)₇ = 842;
- 144 = (400)₆;
- de 1 a 439 se usan 1 209 cifras;
- 5⁷³ mód 9 = 5;
- 4 660 mód 9 = 7;
- 5x + 8y = 60 tiene 2 formas;
- MCD(24, 42) = 6 y salen 11 trozos;
- MCM(12, 32) = 96;
- [2; 5, 2] sin el último término da 11/5;
- 900 · 30 = 30³;
- ³√412 da q = 7 y r = 69;
- 6, 12, 22, 36, 54 → 76;
- 3 + 9 + … (6 términos) = 1 092;
- 6/(1 − 1/4) = 8;
- 2¹²² mód 19 = 6;
- σ(120) = 360;
- φ(40) = 16;
- (116)₇ + (41)₇ = (160)₇;
- el dividendo es 78 = 12·6 + 6;
- 1/22 = 0,04545… (periódico mixto);
- 0,6111… = 11/18;
- 1/2 = 0,4 en base 8.

## Objetos corregidos

| Unidad / idea | Antes | Después |
| --- | --- | --- |
| numeracion / conteo-cifras, consigna | «Un libro se numera desde la página 1. Arrastra el final del libro…» | «Las páginas de un libro se numeran desde la 1. Arrastra el final de la tira de páginas…» |
| numeracion / conteo-cifras, arrastre (juego y mesa) | «última página del libro» | «final de la tira de páginas» |
| numeracion / laboratorio «libros-largos» | «Arrastra el final del libro…» | «Arrastra el final de la tira de páginas…» |
| mcd-y-mcm / mcm-coinciden, consigna | «Dos combis salen juntas del paradero…» (la recta solo tiene puntos) | «Los puntos naranjas son salidas de una combi, cada a minutos; los turquesa, de otra, cada b. Mira cuándo coinciden.» |
| razonamiento-numerico / suficiencia, consigna | «van en un triángulo … los tres lados suman S» (la pieza es una tabla) | «van en los lados de un triángulo … cada lado suma S» |
| razonamiento-numerico / suficiencia, pregunta de Predice | «en el triángulo» | «en un triángulo» (no apunta a una figura que no está; las opciones no cambian) |
| cuatro-operaciones / complemento, `voz` (no era creíble: la recta queda fija) | «Mira dónde termina la recta cuando N gana una cifra.» | «Mira dónde cae la meta turquesa cuando N gana una cifra.» |

## Pedidos de vectores para Gerson

1. **numeracion / conteo-cifras**: un libro o cuaderno abierto en su última página, para amarrar la tira de páginas a un objeto real (opcional).
2. **mcd-y-mcm / mcm-coinciden**: dos combis que salen sobre la recta de minutos, una por fila (opcional).
3. **razonamiento-numerico / suficiencia**: un triángulo con los números en los vértices y en los lados, para que se vea que cada vértice cuenta en dos lados. Hoy todo se lee en la tabla.
4. **razonamiento-numerico / moviles**: íconos para A y B (ciclistas o vehículos) sobre la recta (opcional).

## Glosario

- Palabras agregadas: «período» (con `local: true`, porque en interés significa un tramo de tiempo) en racionales; «módulo» y «coeficiente» en divisibilidad (y formas nuevas para «congruencia» y «ecuación diofántica»); «acotar» en cuatro operaciones; «canje», «vértice» y «suficiencia de datos» en razonamiento numérico.
- El validador de un término por curso pasa con todas juntas.

## Lo que no se pudo y por qué

Errores que ya estaban en partes que el encargo no deja tocar («Ahora tú» y «Mira»). Quedan para que Gerson o la sesión principal decidan:
1. **numeros-racionales / exacto-periodico, solución de «Ahora tú»**: muestra la lista de primos sin exponentes, por ejemplo «8 = 2 en primos» o «40 = 2 · 5 en primos». Está mal. Se arregla usando la función nueva `factoriza(y)`, que ya está en el archivo.
2. **potenciacion-y-radicacion / exclusion, «Mira»**: el paso «Ningún cuadrado termina en 2, 3, 7 u 8» resalta las filas n = 2, 3, 7 y 8, pero sus n² terminan en 4, 9, 9 y 4, así que la figura contradice el texto. Hay que resaltar las celdas de n² cuyo final es 2, 3, 7 u 8. «Así se resuelve» no repite el error.
3. **numeracion / agrupar, «Ahora tú» de tipo fichas**: el rótulo de la figura trae `n = (…)_b`, que es la respuesta. «Así se resuelve» evita esa fuga.
4. **razonamiento-numerico / suficiencia, «Ahora tú»**: en el caso x + y con a = b, la opción «contrario» usa el par pensado para x · y, y su `siFuera` muestra un par que no cumple x + y.

Además, en algunas ideas «Así se resuelve» cubre solo uno de los tipos de «Ahora tú»:
- racionales/equivalentes: falta «¿son equivalentes?»;
- racionales/orden-recta: falta «clase de fracción»;
- racionales/otras-bases: falta «0,xy en base B a fracción».

En las demás unidades alterna todos los tipos.

## Lo no verificado

- El recorrido de Playwright se hizo en una idea por unidad, no en las 46. Las demás pasan el validador (12 semillas), pero no se vieron en pantalla.
- No se vio a 360 px:
  - el ancho de las ecuaciones largas (Wilson en primos; la resta en otra base y las cotas en cuatro operaciones);
  - la lista de parejas recortada con «…» en divisibilidad/diofanticas.
- En divisibilidad/restos-potenciales, con ciclos de más de 8 restos (divisores 11 y 13), la tabla muestra 8 filas, como en «Ahora tú». Si el lugar cae fuera, no se resalta ninguna fila.
- La tarjeta «Contar de a hasta z» de numeracion/conteo-cifras enseña z − a + 1, que también está en la regla. No da la respuesta de Predice (192), pero ayuda a descartar la opción 189. Queda a criterio de Gerson.
- En mcd-y-mcm, la semilla 2 de «Así se resuelve» repite el caso de «Predice» (12 y 18 → 36; 24 y 36 → 12). No regala nada, porque va después de Predice.
- En la tarjeta de «Lee» con texto largo, el botón fijo de abajo tapa las últimas líneas hasta que se desliza. Pasa igual en la unidad de referencia.
