# Propuesta de ideas: «Exponentes, radicales y productos notables» (`algebra.exponentes-y-productos-notables`)

Etapa 3 del plan de calidad, rama «Expresiones algebraicas» (la de entrada de Álgebra) · fase 1
(`docs/metodo/unidad/1-ideas.md` §A) · 17 nov 2026

Gerson: esto es solo la propuesta. No se escribe nada hasta que la apruebes o la corrijas. Las preguntas que solo tú
puedes contestar están al final (sección 9), cada una con mi recomendación. Las que más pesan son la 1, la 2 y la 3.

Lo que leí: `CLAUDE.md`, `docs/plan-calidad.md` §3 y §7, `docs/molde-unidad.md` entero (§3, §4, §5b y §11),
`docs/etapa2/decisiones.md` con sus «Cambios posteriores», `docs/etapa3/decisiones.md`, las propuestas de aritmética
(numeración) y trigonometría como modelo, la teoría actual (`contenido/teoria/algebra/exponentes-y-productos-notables.js`),
su ficha en `catalogo/cursos/algebra.json`, las dos plantillas que la cubren (`plantillas/cuadrado-crece/`: motor, 20
casos y papel; y `plantillas/sistemas-ecuaciones/`, generador), el informe `docs/investigacion/algebra-funciones-ideas-erroneas.md`
(AL8 a AL12), el bloque F de `docs/investigacion/verificacion-pogil-v2.md`, `rutinas/teoria-algebra.md` (códigos TAL-),
la matriz `docs/teoria/matriz/algebra.json` (unidad 3), `docs/temario-completo.md` §3, las preguntas de
`docs/datos/admision-unmsm.csv`, la prueba `catalogo/pruebas/algebra.json` y, como nivel, las unidades ya rehechas
(`razones-trigonometricas-agudas.js` y `materia-y-energia.js`). Miré también las unidades vecinas para no pisarlas:
`aritmetica.potenciacion-y-radicacion`, `algebra.valor-absoluto-y-radicales`, `polinomios`, `factorizacion` y
`exponenciales-y-logaritmos`.

## Qué se pregunta en los exámenes

`docs/taxonomia-*.md` no traen álgebra. La UNI la pone en sus semanas 2 y 7 y San Marcos en sus temas 2 y 5 (catálogo); en
el repo no hay preguntas de la UNI clasificadas. En `docs/datos/admision-unmsm.csv` hay **6 preguntas de San Marcos** de
esta unidad:

| Periodo (pregunta) | Qué piden | Idea |
| --- | --- | --- |
| 2024-I (39, áreas D y E) | Productos de factores agrupados de a dos, con cambio de variable: la diferencia sale constante | 5 |
| 2024-I (42, áreas B y C) | Se dan la suma y la suma de cubos de dos números; piden su producto con el cubo de un binomio. Trampa: (a + b)³ = a³ + b³ | 6 |
| 2025-I (35, áreas D y E) | Un cuadrado de lado igual a la suma de dos medidas, partido en dos cuadrados y dos rectángulos iguales (con figura). Trampa: olvidar el doble producto o dárselo entero a una sola parte | 4 |
| 2025-I (42, áreas B y C) | Se dan la diferencia de cubos y la de sextas potencias; factorizar para hallar cada cubo | 5 y 6 |
| 2025-II (40, Medicina) | Igualdad de dos expresiones exponenciales con dos variables, por leyes de exponentes | 1 |
| 2026-I (40, área A) | Producto y diferencia de cuartas potencias de una suma y una diferencia: identidad de Legendre | 5 |

**Cinco de las seis son productos notables**, y tres de ellas piden algo que hoy la teoría no enseña: el cubo de un
binomio, la diferencia de cuadrados con potencias altas y Legendre. **Ninguna** pregunta radicales dobles ni
racionalización. El banco Cuzcano trae unas 53 fichas: leyes de exponentes 17 (casi todas con exponentes fraccionarios y
radicales anidados), productos notables 12, identidades condicionales 5, racionalización 5 y propiedades de radicales 4
(`docs/temario-completo.md`).

---

## 0. Diagnóstico de la teoría actual contra el contrato

`exponentes-y-productos-notables.js` (v0.2.0, `estado: 'completa'`, sin `calidad: 2`) tiene 5 ideas: `leyes-exponentes`,
`radicales`, `cuadrado-suma`, `radicales-dobles` y `racionalizar`, y cuatro mesas con retos que el motor comprueba
(`cubo-se-abre` en 3D, `rectangulo-x-p-q`, `raiz-de-la-potencia`, `exponentes-con-signo`). Hay cosas buenas: el cuadrado
de lado a + b con la escala fija y las esquinas que se arrastran, la tabla de potencias que baja de a uno hasta 2⁻³, la
gráfica de √(x²) junto a y = x y la honestidad de «la figura de áreas solo ilustra lados positivos».

1. **Punto 1: ninguna primera pantalla tiene un objeto.** Cuatro ideas juegan con una tabla (`alg-tabla`) y la tercera
   con baldosas sin contexto. El almacén de Juliaca, el terreno de Puno y el patio solo aparecen escritos en «Lee». En el
   kit no hay ninguna pieza de objeto para álgebra.
2. **Puntos 2, 3 y 12: no hay `mision`, `leyenda`, `aprendizaje`, `actividad` ni `pregunta`.** Las consignas describen
   controles («Elige la base y dos exponentes. La tabla escribe…»).
3. **Punto 13: ningún ejercicio trae `datos`**, tampoco el papel. No hay ejemplos resueltos (0 de 75). El glosario trae
   17 términos sin `simple` y con un ejemplo o ninguno; «producto notable» se define como algo que «se escribe de
   memoria», justo lo contrario de «criterio, no memoria».
4. **Punto 9: el orden y la regla fallan.** Idea 1: «Ahora tú» pide dividir potencias, pero la regla no dice qué pasa al
   dividir, y (aᵐ)ⁿ está en la regla sin haberse jugado. Idea 2: usa |x| sin presentarlo (se enseña en
   `valor-absoluto-y-radicales`, grado 4, en otra rama). Idea 3: su regla trae la diferencia de cuadrados, que no se juega
   ni se predice, y la idea 5 se apoya en ella. Faltan el **exponente fraccionario** (a^(1/n) = ⁿ√a), corazón de las 17
   fichas de leyes, y el **cubo de un binomio**, que solo está en una mesa y que San Marcos preguntó en 2024-I y 2025-I.
5. **Regla 3: dos predicciones ya se vieron.** Idea 3: el juego llega a a = 5 y b = 2, su lectura da 49 y 29, y la
   predicción pregunta, con a = 5 y b = 2, cuánto le falta a a² + b² para llegar a (a + b)². Idea 5: el juego muestra
   «× (√A + 1)/(√A + 1)» y la predicción pide el conjugado de √5 − √3.
6. **Códigos repetidos.** La predicción de la idea 1 tiene dos incorrectas con TAL-EXP-POR y la de la idea 4, dos con AL9.
   En «Ahora tú», TAL-2AB va dos veces, TAL-DIFCUAD tres y AL9 marca también «q − p», que no es ese error.
7. **Punto 7, y peor que en otras unidades.** Las lecturas de las ideas 2 y 3 y las reglas de las ideas 1 a 4 separan dos
   igualdades con «   ·   »: «(a + b)² = 49 · a² + b² = 29». En una unidad donde «·» es multiplicar, se lee como una
   cuenta falsa. La lectura de la idea 5 da un número suelto («El valor no cambia: ≈ 0,447»).
8. **§5b: colores por papel viejo.** a y su exponente m van los dos en naranja (dos variables de un mismo aᵐ con un
   color), b y n en turquesa, el resultado y los rectángulos ab en verde, pegados a a² naranja (protanopía: 0,010), y el
   carmín (de ángulos) marca «y = x» y lo que no coincide. Lo mismo en las mesas: en `rectangulo-x-p-q` la pieza qx verde
   toca x² naranja, y en `cubo-se-abre` la pieza a²b verde toca a³ naranja.
9. **«Así se resuelve» es el generador de «Ahora tú» con la semilla + 900** en las cinco ideas, y «Ahora tú» no llega a
   examen: no hay exponentes fraccionarios, radicales anidados, cubo, Legendre ni cambio de variable.
10. Detalles: la cabecera dice «3.º de secundaria», la ficha dice `grado: 3` y `potencial_visual: bajo` (falso: es la
    unidad más dibujable del curso), y la prueba del curso tiene solo 2 ítems de la unidad (cc-01 y cc-02).

---

## 1. Las ideas, en orden

Propongo **ocho**, en dos bloques. Las cinco de hoy conservan su `id` (y sus controles: `a`, `m`, `n`, `b`, `ej`, `A`,
`forma`); tres son nuevas. Ocho ideas son muchas para una unidad (trigonometría y numeración tienen cinco), por eso
recomiendo **partirla en dos**, como Magnitudes y Vectores (pregunta 1): el bloque A se queda con el `id` actual y el
bloque B pasa a una unidad nueva, `algebra.productos-notables`. Si prefieres no partirla, el orden es el mismo.

| # | `id` | Título (≤ 6 palabras) | `aprendizaje` |
| --- | --- | --- | --- |
| **A** | | **Exponentes y radicales** | |
| 1 | `leyes-exponentes` | El exponente cuenta factores | Al multiplicar potencias de la misma base se suman los exponentes; al dividir, se restan; al elevar una potencia, se multiplican. Por eso a⁰ = 1 y a⁻ⁿ = 1/aⁿ: un exponente negativo divide, no cambia el signo. |
| 2 | `radicales` | La raíz principal nunca es negativa | √a es el número no negativo que, al cuadrado, da a (el lado de un cuadrado de área a); por eso √(x²) = \|x\|. La raíz se reparte en un producto, √(ab) = √a · √b, pero nunca en una suma. |
| 3 | `exponente-fraccionario` (nueva) | La raíz es un exponente fraccionario | Sacar raíz n-ésima es elevar a 1/n, porque (a^(1/n))ⁿ = a¹; así ⁿ√(aᵐ) = a^(m/n) y los radicales se simplifican con las mismas leyes de los exponentes. |
| **B** | | **Productos notables** | |
| 4 | `cuadrado-suma` | El cuadrado de una suma | (a + b)² tiene cuatro piezas, a², b² y dos rectángulos ab: (a + b)² = a² + 2ab + b². Con una resta, (a − b)² = a² − 2ab + b²: la esquina se quita dos veces y se devuelve una. |
| 5 | `suma-por-diferencia` (nueva) | Suma por diferencia: un rectángulo | Un cuadrado a² sin una esquina b² se rearma en un rectángulo de (a + b) por (a − b): a² − b² = (a + b)(a − b). En (x + p)(x + q) = x² + (p + q)x + pq, el término del medio se anula si q = −p. |
| 6 | `cubo-binomio` (nueva) | El cubo de una suma | (a + b)³ tiene ocho piezas: a³, b³, tres a²b y tres ab², así que (a + b)³ = a³ + b³ + 3ab(a + b); con a + b y ab se halla a³ + b³ sin conocer a ni b. |
| 7 | `radicales-dobles` | Dos números que suman y multiplican | √(A ± 2√B) = √x ± √y si x + y = A y x · y = B, con x ≥ y: es el lado de un cuadrado armado con dos piezas x e y y dos rectángulos √(xy). |
| 8 | `racionalizar` | Racionalizar es multiplicar por uno | Racionalizar es multiplicar arriba y abajo por lo mismo (multiplicar por 1) para que abajo no quede raíz: con √a se usa √a; con √a − √b, su conjugado √a + √b, porque (√a − √b)(√a + √b) = a − b. |

`pregunta` (Resumen): 1 «¿Por qué 2⁻³ no es un número negativo?» · 2 «¿Por qué √((−5)²) no es −5?» · 3 «¿Qué significa
un exponente como 2/3?» · 4 «¿Por qué (a + b)² no es a² + b²?» · 5 «¿Cómo se calcula 31 · 29 sin multiplicar?» ·
6 «¿Por qué (a + b)³ no es a³ + b³?» · 7 «¿Cómo se quita una raíz que está dentro de otra?» · 8 «¿Cómo se saca una raíz del
denominador sin cambiar el valor?».

`actividad`: 1 «Doblar una hoja y contar sus capas.» · 2 «Juntar dos biohuertos cuadrados en uno solo.» · 3 «Buscar el
exponente que da la arista de una caja.» · 4 «Ampliar un terreno cuadrado por dos lados.» · 5 «Cortar la esquina de un
triplay y rearmarlo en rectángulo.» · 6 «Cortar un taco de madera en ocho piezas.» · 7 «Armar una mesa cuadrada con cuatro
planchas.» · 8 «Calcular el lado de una cometa sin dividir entre una raíz.»

**Por qué va cada una ahí y qué da por sabido**

1. **Leyes.** Es la raíz de toda la rama: polinomios (grados), factorización y exponenciales la usan. Da por sabido
   multiplicar y dividir enteros y fracciones. La potencia se presenta en «Lee» con la hoja. El requisito
   `aritmetica.potenciacion-y-radicacion` es de otro curso: solo aconseja. Estrena: potencia, base, exponente.
2. **Raíz principal.** Necesita la potencia (idea 1). |x| entra como dato y en «Lee» («la distancia de x al cero: |−5| =
   5»), porque el valor absoluto llega mucho después; el índice impar (∛(−8) = −2) va en la regla y en «Ahora tú». Su
   nivel examen trae √((3 − π)²) = π − 3. Estrena: raíz cuadrada, radicando, valor absoluto.
3. **Exponente fraccionario (nueva).** Junta la 1 (potencia de potencia) con la 2 (raíz). Es lo que piden las 17 fichas de
   leyes del banco (√(x · ∛x²) como una sola potencia) y la unidad no lo tiene. Estrena: índice, exponente fraccionario.
4. **Cuadrado de una suma.** Abre el bloque B. Da por sabido la distributividad, que va como dato y en «Lee» (3(x + 2) =
   3x + 6). Su nivel examen trae «a + b = 7 y ab = 12: halla a² + b²» y la figura de San Marcos 2025-I. Estrena: producto
   notable, binomio, doble producto.
5. **Suma por diferencia (nueva).** Necesita la 4 ((a − b)² para Legendre). Hoy está escondida en la regla de `cuadrado-suma`.
   La necesitan la idea 8 (conjugado) y la factorización. Su nivel examen trae el cambio de variable de San Marcos 2024-I,
   Legendre (2026-I) y x⁶ − y⁶ = (x³ + y³)(x³ − y³) (2025-I). Estrena: diferencia de cuadrados, identidad.
6. **Cubo de una suma (nueva).** Necesita la 4 (las mismas piezas, en volumen) y la idea 1 (a³). Trae a³ ± b³ = (a ±
   b)(a² ∓ ab + b²), que usa la idea 8 con raíces cúbicas. Es San Marcos 2024-I y 2025-I. Estrena: arista, volumen, suma de
   cubos.
7. **Radicales dobles.** Necesita la 2 (raíz) y la 4 ((√x + √y)² = x + y + 2√(xy)). Estrena: radical doble.
8. **Racionalizar.** Al final, porque usa la 5 (el conjugado es una suma por diferencia) y la 6 (∛a − ∛b en el nivel
   examen). Estrena: racionalizar, denominador, conjugado.

**Qué no entra** (pregunta 5): (a + b + c)², Argand ((x² + x + 1)(x² − x + 1)) y «si a + b + c = 0, a³ + b³ + c³ = 3abc»
van al laboratorio; las ecuaciones exponenciales van a `exponenciales-y-logaritmos` (aquí solo «pasar a la misma base» en
el nivel examen de la idea 1); las ecuaciones con radicales son de `valor-absoluto-y-radicales`.

---

## 2. Objeto de la primera pantalla

El hilo del bloque B es **el área y el volumen de piezas que se arman**: un terreno, un triplay, un taco de madera, una
mesa. Todos son de problema, con medidas posibles (punto 10).

| Idea | Objeto (primera tarjeta de «Lee» y juego) | Qué es cada cosa |
| --- | --- | --- |
| 1 | **Una hoja de cuaderno que se dobla por la mitad** (o en tres, como una carta) | cada doblez = un factor 2; capas = 2ᵐ; la cara de arriba, una parte de la hoja |
| 2 | **Dos biohuertos cuadrados del colegio**, con su cerco, al lado de un biohuerto cuadrado que junta las dos áreas | área = radicando; lado del cerco = raíz |
| 3 | **Una caja cúbica de cartón** de 64 dm³ al lado de una loseta cuadrada de 64 dm² | volumen y área = el número; arista y lado = la raíz; exponente = qué raíz |
| 4 | **El terreno cuadrado de Juan, en Juliaca, que compra una franja por el costado y otra por el fondo** para que siga cuadrado | terreno viejo = a²; dos franjas = ab; esquina = b² |
| 5 | **Una plancha cuadrada de triplay en la carpintería**: se le corta una esquina cuadrada, y la tira que sobra se gira para armar un tablero rectangular | plancha = a²; esquina = b²; tablero = (a + b)(a − b) |
| 6 | **Un taco cúbico de madera** que el carpintero corta con tres cortes, uno en cada dirección | taco = (a + b)³; las ocho piezas |
| 7 | **Una mesa cuadrada armada con cuatro planchas**: dos cuadradas, de x y de y dm², y dos rectangulares iguales | área de la mesa = A + 2√B; lado = √x + √y |
| 8 | **Una cometa cuadrada** cuya varilla diagonal mide 1 m | lado = 1/√2 m; racionalizar = calcularlo dividiendo entre 2 |

Pieza nueva: `alg-objeto`, como `trig-objeto` (una pieza con varios objetos), dibujada por la sesión como prueba
(`data-prueba`) con su prueba numérica de encuadre y rótulos (molde §6). `alg-baldosas`, `alg-cubo-3d` y `alg-tabla` quedan
para «Mira», los ejemplos y el laboratorio, al lado del objeto.

---

## 3. Misión de «Juega» (meta que el motor comprueba)

| Idea | Contexto + misión | Controles | `logrado` | Lectura en vivo (enuncia una relación) | `bien` |
| --- | --- | --- | --- | --- | --- |
| 1 | «La hoja ya tiene 3 dobleces por la mitad.» **Dóblala más hasta que tenga 32 capas.** | `a` (2: por la mitad; 3: en tres, con 3 dobleces como máximo); `m`, dobleces hechos, 0–3; `n`, dobleces más, 0–3 | `val.a === 2 && val.m === 3 && val.n === 2` | «8 capas, dobladas 2 veces más, son 32 capas: 2³ · 2² = 2⁵, y 3 + 2 = 5 dobleces» | «Listo: los dobleces se suman, y las capas se multiplican.» |
| 2 | «Dos biohuertos cuadrados se juntan en uno solo, también cuadrado.» **Elige sus áreas para que el biohuerto junto mida 100 m².** | `a`, `b`: áreas de 1 a 100 m² | `val.a + val.b === 100` | «√36 + √64 = 6 + 8 = 14 m de cerco por lado, pero √(36 + 64) = √100 = 10 m: el lado del junto es menor que los dos lados sumados» | «Juntar las áreas no junta los lados: la raíz de la suma no es la suma de las raíces.» |
| 3 | «La caja de cartón tiene 64 dm³.» **Elige el exponente que convierte el volumen en la arista.** | `e`, exponente: 1/3, 1/2, 1, 2 o 3 (nuevo); `V`, 8, 27, 64 o 125 dm³ (nuevo) | `val.e === 1/3` | «64^(1/3) = ∛64 = 4 dm, porque 4 · 4 · 4 = 64». Con 1/2: «64^(1/2) = 8 dm: el lado de la loseta, no la arista» | «Elevar a 1/3 deshace elevar al cubo: esa es la raíz cúbica.» |
| 4 | «El terreno de Juan mide 10 m de lado.» **Amplíalo por el costado y por el fondo hasta que mida 144 m².** | `a`, lado, 4–12 m; `b`, franja, 1–4 m; arrastres `esquina-a` y `esquina-b` (existen) | `val.a === 10 && val.b === 2` | «(10 + 2)² = 144 m² = 100 + 20 + 20 + 4: el terreno de antes, dos franjas de 10 m × 2 m y la esquina de 2 m × 2 m» | «Comprar 2 m por lado no suma 4 m²: suma dos franjas y una esquina.» |
| 5 | «De una plancha cuadrada de triplay se corta una esquina cuadrada.» **Corta y gira la tira para armar un tablero de 13 dm por 7 dm.** | `a`, plancha, 6–12 dm; `b`, esquina, 1–4 dm; `f`, cortar y girar, 0–1 (nuevos; el motor `reacomodo` ya existe) | `val.a === 10 && val.b === 3 && val.f === 1` | «10² − 3² = 100 − 9 = 91 dm² = 13 dm × 7 dm: el mismo triplay, ahora rectángulo» | «Un lado creció 3 y el otro bajó 3: el área es la plancha menos la esquina.» |
| 6 | «El taco se corta a a dm de una esquina, en las tres direcciones.» **Con a = 3 dm, arma un taco de 125 dm³.** | `a`, `b`, 1–4 dm; `abrir`, 0–1 (los de la mesa `cubo-se-abre`) | `val.a === 3 && val.b === 2` | «(3 + 2)³ = 125 dm³ = 27 + 3 · 18 + 3 · 12 + 8: un cubo de 3, tres piezas de 3 · 3 · 2, tres de 3 · 2 · 2 y un cubo de 2» | «Las esquinas a³ y b³ son solo 35 de los 125 dm³: el resto está en las seis piezas del medio.» |
| 7 | «La mesa mide 8 + 2√15 dm².» **Elige las dos planchas cuadradas que la arman.** | `ej`, el área de la mesa (existe); `par`, las dos planchas cuadradas, x + y = A (nuevo) | `val.ej === 1 && val.par === 5` | «Planchas de 5 y 3 dm²: 5 + 3 = 8 y 5 · 3 = 15, así que la mesa mide √5 + √3 ≈ 3,97 dm de lado» | «La suma da el 8 y el producto, lo que va bajo la raíz chica.» |
| 8 | «La varilla diagonal de la cometa mide 1 m, así que su lado mide 1/√2 m.» **Elige por qué multiplicar arriba y abajo para dividir entre un número sin raíz.** | `A`, 2–10 (existe); `por`: √A/√A, 2/2, A/A o √A solo arriba (nuevo) | `val.por === 'raiz'` | «1/√2 = √2/(√2 · √2) = √2/2 ≈ 0,707 m: el mismo lado, y ahora se divide entre 2» | «Multiplicar arriba y abajo por √2 es multiplicar por 1: el lado no cambió.» |

Para que la predicción quede fuera de lo jugado: el juego 1 no tiene exponentes negativos; el 3 no tiene 2/3; el 4 solo
amplía (no quita); el 5 nunca multiplica dos números cercanos como 31 · 29; el 7 solo tiene radicales con «+» (el control `sg` pasa a una
mesa); el 8 solo tiene una raíz abajo (la forma `conj` pasa a una mesa). Ningún `bien` dice la respuesta de su predicción.

---

## 4. La predicción de cada idea

La app baraja las opciones. `datos` lleva solo valores y equivalencias, nunca la fórmula. **No hay datos peruanos ni
porcentajes por ítem** (lo dice el informe de álgebra). Respaldo: AL8 y AL9 son parciales (SIMCE, Matz, Aguerrea y otros);
AL11, hipótesis con base en Matz; «omitir el término cruzado» lo vieron Kombat y otros (2023) y Theba y otros (2024), con
estudios débiles (`verificacion-pogil-v2.md`, bloque F); dos trampas salen de las alternativas de San Marcos (2024-I y
2025-I). Todo TAL- es hipótesis de diseño. Ninguna predicción repite un código.

**Idea 1.** «La hoja doblada 3 veces tiene 2³ = 8 capas, y las 8 juntas son 1 hoja. Si 2ᵐ · 2ⁿ = 2ᵐ⁺ⁿ vale también con
exponentes negativos, 2³ · 2⁻³ = 2⁰. ¿Cuánto vale 2⁻³?» Datos: 2³ = 8; la hoja sin doblar tiene 1 capa.

| Opción | Qué mide |
| --- | --- |
| 1/8 | Correcta: cada capa es 1/8 de la hoja |
| −8 | El exponente negativo cambia el signo (TAL-EXP-NEG, hipótesis) |
| −6 | Base por exponente: 2 · (−3) (TAL-EXP-POR, hipótesis) |
| 1/6 | Divide entre 2 · 3, no entre 2 · 2 · 2 (TAL-EXP-FRAC, hipótesis nueva; hoy marcada TAL-EXP-POR) |

**Idea 2.** «Un compañero dice que la raíz y el cuadrado se cancelan, así que √((−5)²) = −5. ¿Cuánto vale √((−5)²)?»
Datos: (−5)² = (−5) · (−5) = 25. El juego nunca tuvo negativos.

| Opción | Qué mide |
| --- | --- |
| 5 | Correcta |
| −5 | √(x²) = x siempre (TAL-RAIZ-X; el «error objetivo» de la matriz; cercano a AL22, parcial) |
| ±5 | Mezcla √ con las dos soluciones de x² = 25 (TAL-RAIZ-DOBLE, hipótesis) |
| 25 | Se queda en el cuadrado (TAL-RAIZ-FALTA, hipótesis) |

**Idea 3.** «Una caja cúbica tiene 27 dm³. Su tapa es un cuadrado. ¿Cuánto vale 27^(2/3), el área de la tapa?» Datos:
27 = 3 · 3 · 3.

| Opción | Qué mide |
| --- | --- |
| 9 dm² | Correcta: (∛27)² = 3² |
| 18 dm² | Multiplica la base por el exponente: 27 · 2/3 (TAL-EXP-POR) |
| 3 dm² | Saca la raíz cúbica y se olvida del 2 (TAL-FRAC-MEDIO, hipótesis nueva) |
| ≈ 140,3 dm² | Invierte índice y exponente: 27^(3/2) (TAL-FRAC-INVIERTE, hipótesis nueva) |

**Idea 4.** «El vecino de Juan tiene un terreno cuadrado de 7 m de lado y cede una franja de 2 m por el costado y otra
por el fondo para la vereda. Lo que le queda sigue siendo cuadrado. ¿Cuántos m² le quedan?» Datos: terreno de 7 m de
lado; franjas de 2 m de ancho.

| Opción | Qué mide |
| --- | --- |
| 25 m² | Correcta: (7 − 2)² = 49 − 28 + 4 |
| 45 m² | (a − b)² = a² − b² (AL8, parcial) |
| 21 m² | Quita las dos franjas enteras y no devuelve la esquina, que se quitó dos veces (TAL-ESQUINA, hipótesis nueva) |
| 35 m² | Quita una sola franja (TAL-2AB; «omitir el término cruzado», estudios débiles; trampa de San Marcos 2025-I) |

**Idea 5.** «¿Cuánto vale 31 · 29?» Datos: 31 = 30 + 1; 29 = 30 − 1; 30 · 30 = 900. (El juego solo usó el triplay.)

| Opción | Qué mide |
| --- | --- |
| 899 | Correcta: 30² − 1² |
| 900 | Se olvida de restar la esquina (TAL-DIFCUAD-FALTA, hipótesis) |
| 901 | Suma la esquina (TAL-DIFCUAD-SUMA, hipótesis) |
| 898 | Resta 2b en vez de b² (TAL-DIFCUAD-2B, hipótesis) |

**Idea 6.** «Dos números suman 5 y su producto es 6. ¿Cuánto vale la suma de sus cubos?» Datos: a + b = 5; ab = 6; 5³ =
125.

| Opción | Qué mide |
| --- | --- |
| 35 | Correcta: 125 − 3 · 6 · 5 |
| 125 | (a + b)³ = a³ + b³ (AL11, hipótesis con base en Matz; trampa de San Marcos 2024-I) |
| 107 | Resta 3ab sin multiplicar por a + b (TAL-CUBO-SUMA, hipótesis nueva) |
| 95 | Resta ab(a + b) una sola vez y no tres (TAL-CUBO-TRES, hipótesis nueva) |

**Idea 7.** «¿A qué es igual √(7 − 2√12)?» Datos: √4 = 2. El juego solo tuvo «+».

| Opción | Qué mide |
| --- | --- |
| 2 − √3 | Correcta: 4 + 3 = 7 y 4 · 3 = 12; con «−», el mayor primero |
| √3 − 2 | Pone primero el menor: da un negativo (TAL-RD-ORDEN, hipótesis) |
| √7 − √12 | Reparte la raíz sobre la resta (AL9, parcial) |
| √6 − 1 | 6 + 1 = 7, pero 6 · 1 no es 12 (TAL-RD-PRODUCTO, hipótesis) |

**Idea 8.** (la de hoy) «¿Por qué expresión conviene multiplicar 1/(√5 − √3) para que el denominador quede sin raíces?»
Datos: (√5)² = 5; (√3)² = 3.

| Opción | Qué mide |
| --- | --- |
| (√5 + √3)/(√5 + √3) | Correcta |
| (√5 − √3)/(√5 − √3) | Multiplica por lo mismo: abajo queda 8 − 2√15 (TAL-RAC-MISMO, hipótesis) |
| √5/√5 | Lo que sirve con una sola raíz (TAL-RAC-UNA, hipótesis) |
| √5 + √3, solo arriba | Cambia el valor: no es multiplicar por 1 (TAL-RAC-UNO, hipótesis) |

Los códigos nuevos van a `rutinas/teoria-algebra.md` como hipótesis.

---

## 5. Tabla de letras y símbolos

| Símbolo | Un solo significado en la unidad | Aviso |
| --- | --- | --- |
| a, b | dos números cualesquiera: la base (idea 1), los radicandos (idea 2), las dos partes de un lado (bloque B) | Es la notación de todos los libros (aᵐ · aⁿ, √(ab), (a + b)²). En cada idea la leyenda dice qué son en el objeto («a: el lado del terreno de antes») |
| m, n | exponentes (idea 1); en a^(m/n) = ⁿ√(aᵐ) (idea 3), m es el exponente y n el índice | **Choca:** en la idea 1 n es el segundo exponente y en la 3 es el índice. Es la notación del libro: se avisa en «Lee» de la idea 3. **Choca también con «m» de metro:** en las ideas con exponente m, las medidas van en dm y nunca en m |
| x | un número cualquiera en √(x²) = \|x\| y en (x + p)(x + q) | — |
| \|x\| | la distancia de x al cero (dato en la idea 2) | El valor absoluto se enseña en `valor-absoluto-y-radicales`; aquí solo como dato |
| √, ∛, ⁿ√ | raíz cuadrada, cúbica y n-ésima; el número chico es el índice | √ siempre es la raíz principal (no negativa) |
| a^(m/n) | exponente fraccionario | En la app se escribe con superíndice fraccionario (`{ sup }` con `{ frac }`); hay que comprobar que `nucleo/ecuacion.js` lo dibuja legible a 360 px |
| p, q | los números de (x + p)(x + q) (idea 5 y su mesa) | — |
| A, B | los números de √(A ± 2√B) (idea 7) | Solo en la idea 7 |
| x, y (idea 7) | las piezas cuadradas que arman el radical doble | En la idea 7, x e y son áreas de piezas, no la variable de la idea 2: la leyenda lo dice |
| · | multiplicar; entre letras no va nada (ab) | **Sale el separador «   ·   » entre igualdades** de reglas, lecturas y «Mira»: se separa con un salto de línea o con «y» |
| ≈ | valor redondeado | 0,707 y 3,97 siempre con «≈» |
| m y d de (m + d)(m − d) | **salen** | «Así se resuelve» de la idea 3 los usa hoy (m choca con el exponente): se reemplaza por (a + b)(a − b) |

---

## 6. Mapa de colores por magnitud (§5b)

Un color fijo por magnitud. El violeta queda para **lo que el alumno busca casi siempre en la unidad**: en el bloque A,
el resultado (las capas, la raíz, la arista); en el bloque B, **las piezas del medio que se olvidan** (2ab, 3a²b), que son
justo el error que la unidad ataca.

| Token | Bloque A: exponentes y radicales | Bloque B: productos notables |
| --- | --- | --- |
| `o` naranja | el primer exponente, m (dobleces hechos); el primer radicando, a (primer biohuerto); el exponente fraccionario (idea 3) | a: el lado de antes, el lado de la plancha, la primera parte del taco; su pieza a² o a³; x en la idea 7 |
| `i` turquesa | el segundo exponente, n (dobleces más); el segundo radicando, b | b: la franja, la esquina, la segunda parte; su pieza b² o b³; y en la idea 7 |
| `f` violeta | el resultado: m + n y las capas, la raíz (el lado del biohuerto junto), la arista | los productos cruzados: las dos franjas ab, las piezas a²b, los rectángulos √(xy); en la idea 5, los lados a + b y a − b del tablero |
| `d` verde | no se usa | solo las piezas ab² del cubo, que no tocan a³ (pregunta 3) |
| tinta | la base (es la misma en toda la cuenta: «misma base»), el número de la idea 3 (64, 27) | el contorno del total (a + b)² y (a + b)³; la cometa y su varilla |
| `h` carmín | **no se usa** (es de ángulos) | **no se usa** |

Pares que van juntos: naranja–turquesa 0,114, naranja–violeta 0,189, turquesa–violeta 0,101. El verde junto a turquesa y
violeta (cubo) no está medido en §5b: se mide con el script de la auditoría antes de usarlo; si no pasa, ab² va en tinta
con trama.

Avisos:
- La respuesta lleva el color de su magnitud (violeta casi siempre; naranja o turquesa si se pide a o b). En «Predice» y en
  los ejemplos, lo pedido va con «?» en tinta hasta comprobar.
- Las mesas son de esta teoría y se corrigen aquí: en `rectangulo-x-p-q`, px y qx en violeta (productos cruzados) y q en
  tinta con rótulo; en `cubo-se-abre`, a²b violeta y ab² verde; en `raiz-de-la-potencia`, y = x en tinta discontinua (hoy
  carmín). La escena `cuadrado-crece` (a verde, b morado) queda distinta hasta que se rehaga.

---

## 7. Práctica: qué existe y qué falta por idea

**Lo que existe hoy:**
- **Escena `cuadrado-crece`** (borrador 0.1.0, dos unidades, 20 casos verificados aparte). Su motor ya calcula casi todo el
  bloque B: `piezasCuadrado`, `restaCuadrado`, `diferenciaCuadrados`, `reacomodo`, `productoX`, `cuboBinomio`,
  `piezasCubo`, `legendre`, `sumaProducto`, y del bloque A `raizDeSuma`, `raizDelCuadrado` y `potenciaDeSuma`. Sirve para
  las misiones 2, 4, 5 y 6. Su papel (10 problemas, sin `datos`) mezcla unidades: p3 y p5 son de factorización, p8 de
  fracciones algebraicas y p9 de logaritmos.
- **Generador `sistemas-ecuaciones`** (cinco unidades): de esta solo es el tipo `exponencial` (aˣ · bʸ = pᴺ, San Marcos
  2025-II). No lee `opts.unidad`: la práctica de esta unidad sale con Vandermonde y matrices.
- Cuatro mesas, los generadores de «Ahora tú» dentro de la teoría, y 2 ítems en `catalogo/pruebas/algebra.json`.

| Idea | Hay | Falta |
| --- | --- | --- |
| 1 Leyes | mesa `exponentes-con-signo`; caso 16 de la escena; papel p7; tipo `exponencial` | tipos «una sola potencia» (producto, cociente, potencia de potencia, con signo), «factor común de potencias» ((2ⁿ⁺³ − 2ⁿ⁺¹)/2ⁿ), «a la misma base» (4ˣ · 8 = 2¹¹); papel |
| 2 Raíz principal | mesa `raiz-de-la-potencia`; casos 12, 13 y 18 de la escena; papel p6 | tipos «√(x²) con x negativo», «√((3 − π)²)», «simplificar √N», «raíz de una suma»; papel |
| 3 Exponente fraccionario | nada | todo: «a^(m/n) a radical y al revés», «radicales anidados como una potencia» (√(x · ∛x²)), «valor de 8^(2/3) + 16^(3/4)»; una mesa; papel |
| 4 Cuadrado | casos 1 a 6 y 14 de la escena; papel p1, p2, p4; ítem cc-01 | tipos «desarrollar (a ± b)²», «a² + b² con a + b y ab», «figura de áreas» (San Marcos 2025-I); papel con datos |
| 5 Suma por diferencia | mesa `rectangulo-x-p-q`; casos 8, 9, 15 (Legendre) y 20 de la escena | tipos «a² − b² de cabeza», «(x + p)(x + q)», «cambio de variable» (2024-I), «Legendre» (2026-I), «x⁶ − y⁶» (2025-I); papel |
| 6 Cubo | mesa `cubo-se-abre`; caso 7; papel p10 | tipos «desarrollar (a ± b)³», «a³ + b³ con a + b y ab» y al revés (2024-I), «a³ − b³ factorizado» (2025-I); papel |
| 7 Radicales dobles | el generador de la teoría | sacarlo a la plantilla; tipos «√(A ± 2√B)» y «√(A + √C), primero el 2»; una mesa con `sg`; papel |
| 8 Racionalizar | el generador de la teoría | sacarlo a la plantilla; tipos «una raíz», «conjugado», «raíz cúbica» (con la idea 6); una mesa con `forma`; papel |

Propuesta (pregunta 6): una plantilla nueva de formato `predicciones` por unidad (si se parte: `plantillas/exponentes-radicales/`
y `plantillas/productos-notables/`), con generador, prueba en 400 semillas, `casos.json` verificado aparte y papel de 5 a 10
por idea con sus datos al final; los tipos separados por idea, con los colores y códigos de la teoría. `sistemas-ecuaciones`
pasa a leer `opts.unidad`. `cuadrado-crece` queda en «Más mesas del tema» y su motor se reusa (regla 1). Faltan ítems de las
ideas 1, 3 y 5 a 8 en la prueba del curso.

---

## 8. Datos del mundo

La unidad casi no los necesita: son objetos de todos los días con medidas de problema.

| Dato | ¿Fuente? |
| --- | --- |
| Hoja doblada hasta 6 veces, carta en tres hasta 3; biohuertos de 1 a 100 m², terreno de 10 m en Juliaca, triplay de 10 dm, taco de 5 dm, cometa de 1 m | Valores de problema, posibles y sin fuente. No se afirma un máximo de dobleces |
| Diagonal de un cuadrado = lado · √2 (idea 8) | Relación de geometría: va en `datos`, sin fuente |
| Historia del bloque A: Descartes escribe las potencias como x³ en *La Géométrie* (1637) | **Necesita fuente** antes de escribir (MacTutor, que ya cita la unidad, o Cajori, *A History of Mathematical Notations*). Lo confirmo en la fuente; no lo afirmo de memoria |
| Historia del bloque B: el cuadrado de una suma como áreas en los *Elementos* de Euclides, libro II, proposición 4 | **Necesita fuente**: la edición en línea de D. E. Joyce (Clark University). La de Descartes de hoy pasa al bloque A si se parte |

---

## 9. Preguntas para Gerson

1. **¿Partimos la unidad en dos?** Recomiendo que sí, como Magnitudes y Vectores: **«Exponentes y radicales»** conserva el id
   `algebra.exponentes-y-productos-notables` (ideas 1 a 3) y **«Productos notables»** es una unidad nueva,
   `algebra.productos-notables` (ideas 4 a 8), que pide la primera. `Avance.migrar` pasa a la nueva lo hecho en
   `cuadrado-suma`, `radicales-dobles`, `racionalizar` y las mesas `cubo-se-abre` y `rectangulo-x-p-q`. Factorización,
   ecuaciones de primer y segundo grado y binomio de Newton pasan a pedir «Productos notables»; polinomios sigue pidiendo
   «Exponentes y radicales». El catálogo queda en 154 unidades. Si prefieres una sola unidad, van las ocho ideas en este
   orden.
2. **¿Entran las tres ideas nuevas** (`exponente-fraccionario`, `suma-por-diferencia`, `cubo-binomio`)? Recomiendo que sí:
   el cubo, la diferencia de cuadrados y Legendre son 4 de las 6 preguntas de San Marcos, y el exponente fraccionario es lo
   que piden las 17 fichas de leyes del banco. Hoy las tres faltan o están escondidas en una regla o una mesa.
3. **Colores:** ¿apruebas violeta para el resultado en el bloque A y para **las piezas del medio** (2ab, 3a²b) en el bloque
   B, a naranja, b turquesa, la base y el total en tinta, el verde solo para ab² del cubo (si pasa la medición) y el carmín
   fuera? Recomiendo que sí: pintar en violeta lo que el alumno olvida hace que lo busque, y saca el verde de al lado del
   naranja. También corrijo las tres mesas aquí.
4. **Objetos:** ¿te sirven la hoja doblada, los biohuertos, la caja de cartón, el terreno de Juan, el triplay, el taco de
   madera, la mesa de planchas y la cometa? Recomiendo los ocho, dibujados como prueba en una sola pieza `alg-objeto`. La
   mesa de planchas (idea 7) es el más forzado; si no te convence, la idea 7 usa la misma figura del terreno.
5. **¿Qué queda fuera?** Recomiendo dejar (a + b + c)², Argand y «a + b + c = 0» como mesas del laboratorio, las ecuaciones
   exponenciales para `exponenciales-y-logaritmos` y las ecuaciones con radicales para `valor-absoluto-y-radicales`.
   Radicales dobles se queda con su idea aunque San Marcos no lo haya preguntado: es tema del catálogo y prepara la racionalización.
6. **Práctica:** ¿hago una plantilla `predicciones` por unidad y hago que `sistemas-ecuaciones` separe por unidad?
   Recomiendo que sí; la escena `cuadrado-crece` queda en «Más mesas» y su papel se reparte entre las unidades que toca.
7. **Ficha del catálogo:** recomiendo `potencial_visual: alto`, dejar `requiere: ["aritmetica.potenciacion-y-radicacion"]`
   (es de otro curso: solo aconseja, y la unidad queda abierta) y no tocar `grado: 3`, que ya es solo informativo.
