# Propuesta de ideas: «Factorización» (`algebra.factorizacion`)

Etapa 7 del plan de calidad, rama «Expresiones algebraicas» (quinta unidad, después de «Exponentes y radicales»,
«Productos notables», «Polinomios» y «División de polinomios») · encargo con criterio delegado
(`docs/metodo/unidad/etapa-delegada.md`) · 19 nov 2026

Gerson: delegaste el criterio, así que esta propuesta ya está aplicada (la unidad entera, sin `calidad: 2`). Lo que decidí
sin ti está al final, en «Decisiones tomadas (Gerson revisa después)», cada punto con su motivo y la alternativa que
descarté. No encontré ningún conflicto crítico.

Lo que leí: `CLAUDE.md`, `docs/plan-calidad.md` §3, `docs/molde-unidad.md`, `docs/metodo/unidad/` (LEEME, 1-ideas,
2-ejemplos, 3-practica, reglas-validador, etapa-delegada), las decisiones de las etapas 2 a 6, la propuesta modelo
(`docs/etapa6/propuesta-algebra.md`), las tres unidades anteriores de la rama con `calidad: 2` (`productos-notables.js`,
`polinomios.js`, `division-de-polinomios.js`, con sus auditorías y sus lectores en frío en `rutinas/auditoria/` y
`rutinas/frio/`; de División, sobre todo lo que se corrigió: el 0 en violeta, el «·» entre igualdades, la letra a sin
decir en los datos, el glosario que adelantaba la misión), la teoría actual (`contenido/teoria/algebra/factorizacion.js`),
su ficha en `catalogo/cursos/algebra.json`, sus plantillas (`cuadrado-crece`, `division-polinomios`,
`ecuaciones-polinomiales`), `nucleo/repaso-tipos.js`, `docs/temario-completo.md` §9, la nota de álgebra en
`docs/investigacion/algebra-funciones-ideas-erroneas.md` (AL8, AL11 y AL12 tocan esta unidad), `rutinas/teoria-algebra.md`,
`catalogo/pruebas/algebra.json`, `docs/datos/admision-unmsm.csv` y las unidades vecinas (`productos-notables`,
`division-de-polinomios`, `ecuaciones-polinomiales`, `inecuaciones`, que define «factor», y
`ecuaciones-lineales-y-cuadraticas`, que define «raíz»).

## Qué se pregunta en los exámenes

En `docs/datos/admision-unmsm.csv` hay **3 preguntas de San Marcos** clasificadas en esta unidad, y otras cinco que
factorizan en el camino:

| Periodo (pregunta) | Qué piden | Idea |
| --- | --- | --- |
| 2025-II (42) | Factorizar una cúbica por Ruffini con números racionales que la anulan y asignar los factores a medidas | 5 (nivel 3: coeficiente principal distinto de 1) |
| 2025-II (39) | MCD de dos polinomios: factorizar los dos, tomar lo común y evaluarlo en un número | 6 (nivel 3) |
| 2027-I (39) | Dos cúbicas con MCD dado; completar los factores y evaluar el MCM | 6 (nivel 3) |
| 2025-I (42, Productos notables) | Diferencia de cubos y de sextas potencias: factorizar para hallar cada cubo | 2 (nivel 3, sin copiar) |
| 2023-I (38), 2025-II (38) (Inecuaciones) | Una cúbica o una cuadrática factorizada por aspa | 3 (práctica; la inecuación no entra) |
| 2022 (39, 40), 2026-II (41) (Ecuaciones polinomiales) | Una cúbica con un número que la anula, factorizada por Ruffini | 5 (la ecuación no entra) |

El banco Cuzcano trae unas 18 fichas (MCM 5, MCD 4, factor común e identidades 3, cambio de variable 3, factores primos y
su conteo 3). En el repo no hay preguntas de la UNI clasificadas (semana 7 de su sílabo). La prueba del curso no tiene
ningún ítem de esta unidad (po-02, «teorema del factor», está en la reserva y es de Ecuaciones polinomiales).

---

## 0. Diagnóstico de la teoría actual contra el contrato

`factorizacion.js` (v0.2.0, `estado: 'completa'`, sin `calidad: 2`) tenía 5 ideas (`factor-comun`, `aspa-simple`,
`aspa-doble`, `teorema-factor`, `mcd-mcm`) y tres mesas con retos comprobados. Se quedan: el rectángulo con el alto
compartido del factor común, el aspa que reconstruye el término central, la tabla de la doble especial con «lo que
falta», la tabla de exponentes del MCD y el MCM, y las tres mesas (con colores y letras nuevas).

1. **Punto 1: ninguna primera pantalla tiene un objeto.** Las cinco ideas juegan con baldosas abstractas, tablas o una
   curva; la feria y el terreno de Juliaca solo están escritos en «Lee».
2. **Puntos 2, 3 y 12:** no hay `mision`, `leyenda`, `aprendizaje`, `actividad` ni `pregunta`; las consignas describen
   controles («Elige el número k y el factor m»).
3. **Punto 13:** ningún ejercicio trae `datos`; no hay ejemplos resueltos (0 de 75); el glosario no tiene `simple` ni
   tres ejemplos.
4. **§5b: colores viejos.** El término central y lo que se comprueba en verde (junto al naranja de x: protanopía 0,010) y
   lo que falta en carmín (es de los ángulos). Las tres mesas usan verde y carmín.
5. **Punto 9 y lo que viene después:** la idea 4 dice «raíz» y «la gráfica corta el eje» (es de Ecuaciones polinomiales
   y de Funciones), la mesa de raíces dice «el coeficiente de x² es −(r₁ + r₂ + r₃)» (Cardano-Vieta, de Ecuaciones
   polinomiales), y la idea 1 usa «racionales» y «reales» sin presentarlos.
6. **Regla 3:** la lectura del juego 1 da la factorización entera («2x² + 6x = 2x(x + 3)») y la de la idea 5 da el MCD
   que pide la predicción con otros números; Lee 3 del aspa doble trae el polinomio de la predicción.
7. **«Así se resuelve» es «Ahora tú» con la semilla + 900** en las cinco ideas, y «Ahora tú» no llega a examen: no hay
   factores primos que contar, ni Ruffini con coeficiente principal distinto de 1, ni MCD evaluado.
8. **Punto 7:** las reglas separan con «   ·   » (en álgebra se lee como producto).
9. **Las identidades no tienen idea propia** («Factor común e identidades» es un tema del catálogo), y la factorización
   «completa» se define con números «racionales» y «reales» que la rama todavía no presentó.
10. **Práctica:** la ficha lista `division-polinomios` (mezcla División con MCD y MCM y no mira la unidad: 6 de cada 8
    problemas son de División) y `ecuaciones-polinomiales` (Cardano-Vieta, bicuadradas, conjugadas: de la unidad
    siguiente; tampoco mira la unidad). No hay práctica por idea.
11. Detalles: la cabecera dice «3.º de secundaria»; los títulos son frases («Si P(a) = 0, hay factor») y no el tema.

---

## 1. Las ideas, en orden

**Seis ideas.** Las cinco de hoy conservan su `id` y entra una nueva en el segundo lugar. No hace falta partir la unidad
(decisión 1).

| # | `id` | Título | `aprendizaje` |
| --- | --- | --- | --- |
| 1 | `factor-comun` | Factor común y agrupación | Factorizar es escribir como producto: se saca lo que se repite en todos los términos, el MCD de los coeficientes y cada letra con su menor exponente; agrupando, aparece un binomio común. |
| 2 | `identidades` (nueva) | Productos notables al revés | Una diferencia de cuadrados, un trinomio cuadrado perfecto o una suma o diferencia de cubos se factorizan leyendo al revés su producto; se sigue hasta que cada factor sea primo. |
| 3 | `aspa-simple` | Aspa simple | Para factorizar un trinomio se parte el primer término en dos con x y el último en dos números; si los productos en cruz suman el término central, cada fila es un factor. |
| 4 | `aspa-doble` | Aspa doble y doble especial | Con seis términos en x e y, tres aspas comprueban los tres términos de en medio; con cuarto grado en una letra, la columna del medio pone lo que falta del término en x². |
| 5 | `teorema-factor` | Divisores binómicos y teorema del factor | Si P(a) = 0, x − a es un factor de P y la fila de Ruffini da el otro; los números por probar dividen al término independiente. |
| 6 | `mcd-mcm` | MCD y MCM de polinomios | Con P y Q factorizados, el MCD lleva los factores comunes con su menor exponente y el MCM todos los factores con su mayor exponente; MCD · MCM = P · Q. |

`pregunta` (Resumen): 1 «¿Qué se saca cuando todos los términos comparten algo?» · 2 «¿Cómo reconoces un producto notable
para factorizarlo?» · 3 «¿Cómo se factoriza un trinomio que no es cuadrado perfecto?» · 4 «¿Qué se hace con seis
términos, o con cuarto grado?» · 5 «¿Cómo hallas un factor de grado 1 de una cúbica?» · 6 «¿Qué exponente lleva cada
factor en el MCD y en el MCM?».

**Por qué va cada una ahí y qué da por sabido**

1. **Factor común.** La base: qué es factorizar (el pasadizo de Rubén: hallar sus lados). Da por sabido multiplicar
   polinomios (Polinomios) y la distributiva (Productos notables).
2. **Identidades (nueva).** Productos notables leídos al revés; necesita el factor común (se saca primero) y estrena
   «factor primo» y la factorización completa, que usan las ideas 3 a 6.
3. **Aspa simple.** El trinomio que no es cuadrado perfecto. El cuadrado perfecto de la idea 2 es el caso con las dos
   filas iguales.
4. **Aspa doble y doble especial.** El aspa simple (3) aplicada tres veces.
5. **Divisores binómicos.** Para lo que el aspa no alcanza (cúbicas). Usa Ruffini y el teorema del resto de División, y
   la factorización completa (2) para seguir abriendo la fila nueva.
6. **MCD y MCM.** Al final, porque factoriza con todo lo anterior.

**Qué no entra** (es de otra unidad): «raíz», ecuaciones, el número de raíces, Cardano-Vieta y las raíces irracionales o
complejas (Ecuaciones polinomiales); números reales o irracionales como coeficientes (la factorización es con enteros);
inecuaciones; fracciones algebraicas. «P(a) = 0» se dice «a anula a P» (el verbo de División). La bicuadrada aparece solo
como trinomio en x² que se abre con aspa, sin resolver nada.

---

## 2. Objeto de la primera pantalla

Sigue el hilo de la rama: **el maestro Rubén enchapa pisos en Juliaca** con losetas de x dm de lado, tiras de x por 1 y
cuadraditos de 1 por 1 (Polinomios y División). Factorizar es lo contrario de multiplicar: con un pedido de piezas, armar
un rectángulo sin que sobre ni falte nada; sus lados son los factores.

| Idea | Objeto (primera tarjeta de «Lee» y juego) | Qué es cada cosa |
| --- | --- | --- |
| 1 | **El pedido de 2 losetas y 4 tiras**, que Rubén quiere poner en un solo pasadizo | el ancho más grande que deja usar todo el pedido es el factor común; el largo, lo que queda |
| 2 | **Un piso cuadrado**: 1 loseta y 9 cuadraditos, y Rubén decide cuántas tiras comprar | el piso cuadrado es (x + 3)²; las tiras son el doble producto |
| 3 | **El pedido de 1 loseta, 7 tiras y 12 cuadraditos** para un pasadizo | ancho x + m y largo x + n: las tiras se reparten entre los dos lados |
| 4 | **Un terreno partido en nueve parcelas** (Lee) y **la hoja del cuaderno de Rubén** con las tres columnas del aspa doble (juego) | cada fila, un factor; cada aspa, un término de en medio |
| 5 | **La hoja del cuaderno de Rubén** con la tabla de Ruffini (la de División) | el número que prueba, la fila del cociente y la casilla del resto |
| 6 | **Dos pasadizos con el mismo ancho** (Lee) y **la tabla de factores** de P y Q (juego) | el ancho común es el MCD |

Piezas: `alg-reparto` (de División: el pasadizo y el cuaderno con Ruffini), `alg-losetas` (de Polinomios: el pedido),
`alg-tabla` (las aspas y los exponentes) y `alg-baldosas` (el terreno en parcelas). **No hace falta pieza nueva**
(decisión 7): las tres piezas de objetos ya existen y ninguna se toca.

---

## 3. Misión de «Juega»

| Idea | Contexto + misión | Controles | `logrado` | Lectura en vivo |
| --- | --- | --- | --- | --- |
| 1 | «Rubén tiene (2x² + 4x) dm² de piezas: 2 losetas y 4 tiras.» **Elige el ancho más grande que usa todo el pedido sin que sobre nada.** | ancho cx, c de 1 a 3 | c = 2 | «x · (2x + 4) = 2x² + 4x» o «3x · (x + 1) = 3x² + 3x: falta 1 loseta» |
| 2 | «Rubén tiene 1 loseta y 9 cuadraditos, y quiere un piso cuadrado.» **Elige el lado y las tiras que compra para que todo arme el piso, sin que sobre ni falte nada.** | lado x + s (s de 1 a 4) y tiras t (0 a 8) | s = 3 y t = 6 | «(x + 2)² = x² + 4x + 4: sobran 5 cuadraditos» |
| 3 | «Rubén tiene (x² + 7x + 12) dm² de piezas.» **Arma el pasadizo con todo el pedido, sin que sobre ni falte nada, con el ancho menor que el largo.** | ancho x + m (1 a 6), largo x + n (1 a 8) | m = 3, n = 4 | «(x + 2)(x + 5) = x² + 7x + 10: sobran 2 cuadraditos» |
| 4 | «En el cuaderno, Rubén factoriza 2x² + 7xy + 3y² + 7x + 11y + 6 con dos filas.» **Elige los términos en y y los números para que las tres aspas den 7xy, 11y y 7x.** | términos en y (y y 3y, o 3y e y); números (1 y 6, 6 y 1, 2 y 3, 3 y 2) | y y 3y; 3 y 2 | «aspas: 7xy, 9y y 13x» |
| 5 | «Rubén busca un factor de x³ − x² + x − 6 con la tabla de Ruffini.» **Prueba números en la tabla hasta que el resto sea 0.** | a, de −6 a 6 | a = 2 | «P(1) = −5: resto −5» |
| 6 | «P tiene los factores x − 2 y (x + 2)²; Q, x − 2, x + 2 y x + 3. Tú eliges los exponentes de x − 2.» **Haz que x − 2 vaya al cuadrado en el MCD y también en el MCM.** | exponente de x − 2 en P y en Q, de 0 a 3 | los dos 2 | «grados: MCD 3 + MCM 5 = P · Q 8» (con los dos en 2) |

Cada misión tiene un solo caso en toda su grilla y no está cumplida al abrir (lo comprueba la prueba propia). La
predicción queda fuera de lo jugado: el juego 1 no tiene ningún término que salga entero (la predicción, 6x³ + 3x², sí);
el 2 solo arma un cuadrado (la predicción es una diferencia); el 3 es mónico (la predicción empieza con 2x²); el 4 es el
aspa doble (la predicción, la doble especial); el 5 prueba con un polinomio que solo se anula en 2 (la predicción, un
número negativo); el 6 ya da P y Q factorizados (la predicción hay que factorizarla). En la idea 6 los exponentes del juego
se llaman por su papel («exponente de x − 1 en P»), sin letras.

---

## 4. La predicción de cada idea

La app baraja las opciones. `datos` lleva solo valores y equivalencias. Todo error es hipótesis (TAL-, hipótesis de
diseño que van a `rutinas/teoria-algebra.md` al cerrar) salvo AL8 y AL11 (investigación, parcial). Ninguna predicción
repite un código.

| Idea | Pregunta y datos | Correcta | Distractores (código) |
| --- | --- | --- | --- |
| 1 | «¿Cuál es la factorización de 6x³ + 3x² con todo su factor común afuera?» Datos: 6 = 3 · 2; x³ = x² · x | 3x²(2x + 1) | 3x²(2x), el término que sale entero no deja nada (TAL-UNO-CERO) · 3x(2x² + x), no saca la menor potencia (TAL-COMUN-MENOR) · x²(6x + 3), no saca el 3 (TAL-COMUN-COEF) |
| 2 | «¿Cuál es la factorización completa de x⁴ − 16?» Datos: x⁴ = (x²)²; 16 = 4² = 2⁴ | (x² + 4)(x + 2)(x − 2) | (x² + 4)(x² − 4), se para antes (TAL-INCOMPLETA) · (x² − 4)², toma la resta como cuadrado (AL8) · (x − 2)⁴, reparte la potencia en la resta (AL11) |
| 3 | «¿Cuál es la factorización de 2x² + 7x + 3?» Datos: 2x² = 2x · x; 3 = 1 · 3 | (2x + 1)(x + 3) | (2x + 3)(x + 1), cruza mal (TAL-ASPA-CRUCE) · (x + 1)(x + 3), olvida el 2 (TAL-ASPA-PRINC) · (2x + 1)(2x + 3), parte mal el 2x² (TAL-ASPA-EXTREMO) |
| 4 | «En el aspa doble especial de x⁴ + 5x³ + 9x² + 7x + 2, los extremos se parten en x² · x² y 1 · 2. ¿Qué término en x² tiene que poner la columna del medio?» Datos: x² · 2 = 2x²; 1 · x² = x² | 6x² | 9x², pone el término entero (TAL-DE-TODO) · 12x², suma lo de los extremos (TAL-DE-SUMA) · 3x², pone lo que ya dieron los extremos (TAL-DE-CRUCE) |
| 5 | «Para P(x) = x³ + 2x² − 5x − 6 se sabe que P(−3) = 0. ¿Cuál de estos binomios es un factor de P?» Datos: P(−3): el valor de P cuando x vale −3 | x + 3 | x − 3, copia el signo del número (TAL-FACTOR-SIGNO) · x − 6, toma el término independiente (TAL-FACTOR-INDEP) · x, cree que x siempre es factor (TAL-FACTOR-X) |
| 6 | «P = x² − 1 y Q = x² − 2x + 1. ¿Cuál es el MCD de P y Q?» Datos: x² − 1 = x² − 1²; 2x = 2 · x · 1 | x − 1 | (x − 1)², toma el mayor exponente (TAL-MCD-MAX) · x² − 1, toma P entero (TAL-MCD-SINFACTOR) · 1, no factoriza (TAL-MCD-PRIMOS) |

---

## 5. Tabla de letras y símbolos

| Símbolo | Un solo significado en la unidad | Aviso |
| --- | --- | --- |
| x, y | las variables; en las ideas 1 a 3 y en Lee de la 6, x es el lado de la loseta en dm | y solo en el aspa doble y en factor común con dos letras |
| a, b | en una identidad, los dos términos (a² − b², como en Productos notables) | se dicen «el primer término» y «el segundo término» en la regla |
| a | en la idea 5, el número que anula a P (x − a es el factor), como en División | cada dato que la usa lo dice: «con a el número que anula a P» (lección de M4 de División) |
| P, Q | el nombre de un polinomio en un enunciado | se dicen en el enunciado |
| q | el cociente de Ruffini, que en la idea 5 es el otro factor | el de División |
| m, n | los números de los dos factores en el aspa simple, (x + m)(x + n); en un ejemplo, un número por hallar | m y n no se usan para exponentes (en Polinomios eran exponentes de una ley: aquí no aparecen) |
| MCD, MCM | máximo común divisor y mínimo común múltiplo de dos polinomios | se dicen con su nombre la primera vez |

No se usa r para nada (es el resto de División) ni k (era el lugar de un término). Los exponentes del juego 6 no tienen
letra.

## 6. Mapa de colores por magnitud (§5b)

Sigue a División: **el polinomio entero en tinta (el total), un lado turquesa, el otro violeta y lo que sobra naranja.**

| Token | Magnitud |
| --- | --- |
| tinta | el polinomio que se factoriza (el pedido, el total), las letras x e y, y lo que se pide con «?» |
| `i` turquesa | el factor que se saca o se prueba: el ancho del pasadizo, el factor común, la primera fila del aspa, x − a y el número a que lo anula (como el divisor de División) |
| `f` violeta | el otro factor: el largo del pasadizo, lo que queda dentro del paréntesis, la segunda fila del aspa, el cociente de Ruffini; en la idea 6, el MCD y el MCM (lo que se pide) |
| `o` naranja | lo que sobra o falta del pedido (las piezas que no entran), como el resto de División; en la idea 6, los exponentes de P |
| `i` turquesa (idea 6) | los exponentes de Q |
| `h` carmín, `d` verde | **no se usan** |

En la idea 6 P lleva naranja y Q turquesa como en Polinomios («primer polinomio» y «segundo polinomio»), y el MCD y el MCM
violeta (lo que se pide). Pares que van juntos: turquesa–violeta 0,101, naranja–violeta 0,189, naranja–turquesa 0,114
(molde §5b). En las figuras de Predice y de los ejemplos, lo pedido va con «?» en tinta. Las piezas se distinguen por su
forma; el color dice qué lado son o si sobran. Los productos en cruz del aspa van en tinta (lo que se comprueba), con su
flecha.

---

## 7. Práctica: qué existe y qué falta por idea

**Hoy:** la ficha lista `cuadrado-crece` (escena compartida, ya en «Más mesas del tema»), `division-polinomios` (generador
viejo que quedó solo para esta unidad: división, cocientes notables y MCD y MCM, sin mirar la unidad) y
`ecuaciones-polinomiales` (generador de la unidad siguiente; en el repaso, solo su tipo `divisores` contaba para aquí).

| Idea | Tipos nuevos (plantilla `factorizacion-practica`, formato `predicciones`) |
| --- | --- |
| 1 Factor común | factor común de dos letras · el término que sale entero (el 1) · binomio común con el signo cambiado · agrupar de a dos |
| 2 Identidades | diferencia de cuadrados con coeficientes · trinomio cuadrado perfecto · suma o diferencia de cubos · cuántos factores primos (factor común y dos identidades) |
| 3 Aspa simple | un factor de un trinomio mónico con negativos · aspa con coeficiente principal distinto de 1 · aspa con dos letras · trinomio en x² (factores primos) |
| 4 Aspa doble | un factor del aspa doble · suma de los factores · lo que falta en la doble especial · factores primos de la doble especial |
| 5 Divisores binómicos | el binomio que sale de P(a) = 0 · cuál de los binomios divide a P · suma de los factores primos de una cúbica · cúbica con coeficiente principal 2 o 3 (San Marcos 2025-II) |
| 6 MCD y MCM | MCD de dos factorizados · MCM de dos factorizados · MCD de dos sin factorizar · MCD evaluado (San Marcos 2025-II) · MCM con el MCD dado (San Marcos 2027-I) |

`TIPOS_POR_IDEA`, prueba en 400 semillas, `casos.json` verificado aparte y papel con datos. **`division-polinomios`** se
queda en la ficha (el catálogo no deja una plantilla sin unidad) pero pasa a «Más mesas del tema» (`"rehacer": true`) y,
con `{ unidad: 'algebra.factorizacion' }` (práctica, examen y repaso la piden así), solo da sus tres tipos de MCD y MCM
(decisión 9). **`ecuaciones-polinomiales`** sale de esta unidad: no mira la unidad y daba Cardano-Vieta, bicuadradas y
conjugadas, de la unidad siguiente; su tipo `divisores` pasa a contar para Ecuaciones polinomiales en el repaso (raíces
racionales, su tema). Dos ítems nuevos, a la reserva de la prueba del curso (las formas ya tienen 10 pares): fz-01, cuántos
factores primos tiene un polinomio con factor común y una diferencia de cuadrados, y fz-02, el MCD de dos trinomios que
hay que factorizar, evaluado en un número, con su verificador en `catalogo/pruebas/verificar.js`.

## 8. Datos del mundo

| Dato | ¿Fuente? |
| --- | --- |
| Losetas de 2 a 6 dm, tiras de 1 dm de ancho, cuadraditos de 1 dm; el pasadizo y el piso | Valores de problema, posibles, sin fuente (los mismos de Polinomios y División) |
| El terreno partido en parcelas, la caja de cartulina | Valores de problema, sin fuente |
| Historia: Euclides, Elementos II.4 y II.5 | II.4 ya estaba publicada con su fuente (Joyce, Clark University). Se cambia a II.5 (el rectángulo que, con un cuadrado, completa otro: la diferencia de cuadrados leída al revés), con la fuente de la misma edición |

## 9. Riesgos de orden (`requiere`)

- `requiere` no cambia: `algebra.division-de-polinomios` (Ruffini, teorema del resto, división exacta) y
  `algebra.productos-notables` (las identidades que aquí se leen al revés).
- **No se adelanta Ecuaciones polinomiales:** ni «raíz», ni ecuaciones, ni cuántos números anulan a un polinomio, ni la
  relación entre esos números y los coeficientes. Los candidatos de la idea 5 son «divisores binómicos»; con coeficiente
  principal distinto de 1, «se prueban también los divisores del término independiente entre los del principal», sin
  nombrar raíces racionales.
- «Factor» lo define Inecuaciones (otra rama, más adelante) con el mismo sentido. Aquí va como término `local` (decisión 5).
- «Diferencia de cuadrados», «suma de cubos», «identidad», «doble producto» y «distributiva» son de Productos notables;
  «anular», «divisible», «regla de Ruffini», «cociente» y «teorema del resto», de División; «coeficiente» y «término
  independiente», de Ecuaciones lineales y cuadráticas («Se explica en…»; los ejercicios los usan solo como palabra).
- La idea 2 usa el factor común de la 1; la 3, el cuadrado perfecto de la 2 como caso de dos filas iguales; la 4, el aspa
  de la 3; la 5, la factorización completa de la 2; la 6, todo. Ninguna usa algo posterior.

---

## 10. Decisiones tomadas (Gerson revisa después)

1. **Entra la idea `identidades` («Productos notables al revés») en el segundo lugar; la unidad queda en seis.** Motivo:
   «Factor común e identidades» es un tema del catálogo y la factorización completa (factor primo) necesita su lugar antes
   de las aspas. Descartado: dejar las identidades como un paso de Mira del factor común (como antes).
2. **La factorización es con coeficientes enteros.** Un factor primo es uno de grado 1 o más que ya no se escribe como
   producto con coeficientes enteros (x² + 4, x² − 2). Motivo: la rama no presentó los reales ni los irracionales, y es lo
   que usan las academias al contar factores primos. Descartado: «completa depende de los números permitidos» de la
   versión anterior, con racionales y reales.
3. **Factores primos se cuentan distintos y sin la constante**: 2x(x + 3)² tiene dos (x y x + 3). Va como dato en cada
   ejercicio que cuenta. Descartado: contar con multiplicidad (algunas academias lo hacen; el dato lo dice siempre).
4. **Los títulos dicen el tema** («Aspa simple», «Divisores binómicos y teorema del factor»); los `id` no cambian.
5. **«Factor» va como término `local`**, porque Inecuaciones lo define (mismo sentido) y una definición por curso no se
   repite. Descartado: mudar la definición (tocaría otra unidad).
6. **Colores: el polinomio en tinta, el factor que se saca o se prueba turquesa, el otro violeta, lo que sobra naranja**;
   en la idea 6, P naranja, Q turquesa, MCD y MCM violeta, como en Polinomios. Motivo: el pasadizo de `alg-reparto` ya pinta
   el ancho turquesa y el largo violeta, y División pintó el divisor turquesa y el cociente violeta: x − a y su cociente
   quedan iguales que allá. Descartado: los colores de Productos notables (a naranja, b turquesa), que pintan términos y no
   factores.
7. **Sin pieza nueva.** El pasadizo, el cuaderno de Ruffini, el pedido, la tabla y las baldosas alcanzan. La primera
   pantalla del aspa doble es el terreno en nueve parcelas (`alg-baldosas`, como el terreno de la versión anterior) y el
   juego, la tabla de tres columnas «en el cuaderno». Descartado: una pieza `alg-aspa` con la hoja cuadriculada (más
   tiempo, y la tabla ya dibuja las flechas del aspa).
8. **La letra a es el número que anula a P en la idea 5**, como en División, aunque en las identidades a y b sean los dos
   términos. Cada dato que usa a la dice. Descartado: k (en División era el lugar de un término) o r (el resto).
9. **Práctica:** plantilla nueva `factorizacion-practica` por idea, primera en la ficha. `division-polinomios` se queda en
   la ficha en «Más mesas del tema» y con la unidad solo da MCD y MCM (cambio en su `generar`, sin tocar sus tipos).
   `ecuaciones-polinomiales` sale de la ficha y de su `plantilla.json` (sigue en Ecuaciones polinomiales y Números
   complejos); en `nucleo/repaso-tipos.js` su tipo `divisores` pasa a Ecuaciones polinomiales. Descartado: dejarla (el
   examen de la unidad sacaba Cardano-Vieta).
10. **El avance:** las cinco ideas que conservan su `id` cambian su Predice y la unidad suma una idea: fila nueva en
    `REHECHAS_E6` de `nucleo/avance.js` (marca `prediccionFZ`, `estudiadaFZ`), con su prueba.
11. **La mesa «Raíces que se arrastran»** pasa a «Números que anulan a P»: sin «raíz», sin el reto de Cardano-Vieta (el
    coeficiente de x² como suma) y con colores de la unidad. Las otras dos mesas se quedan con colores nuevos.
12. **La bicuadrada** (x⁴ − 13x² + 36) entra como trinomio en x² que se abre con aspa (nivel 3 de la idea 3), sin
    ecuación. Descartado: dejarla para Ecuaciones polinomiales (las academias la factorizan aquí).
13. **Cambio de variable** (los productos de cuatro factores consecutivos) no entra: ya es de Productos notables (San
    Marcos 2024-I, 39) y aquí no tiene idea. Descartado: una séptima idea.
14. **Ficha del catálogo:** `potencial_visual` sube de `bajo` a `alto` (todo se arma con piezas), `plantillas` queda
    `["factorizacion-practica", "cuadrado-crece", "division-polinomios"]`; `grado` sin tocar.

## Cambios (19 nov, al escribir las seis ideas y la práctica)

1. **Juego 1:** el pedido pasa a 2 losetas y 4 tiras (2x² + 4x) y el ancho va de x a 3x: con 4x² + 6x el pasadizo de
   ancho x salía largo y las piezas, chicas. Con 3x falta una loseta (antes «sobra»): la zona de sobras no cabía en el
   lienzo. La predicción no cambia.
2. **Notas de la sesión sobre la idea 1:** la tabla de Predice va sin superíndices ni la potencia del factor común (solo
   «número» y «exponente de x», con «?»); el dibujo de la regla, sin la zona de sobras, para que no quede aire debajo; la
   regla pasó `herramientas/ecuaciones-ancho.js` («todo cabe»).
3. **Juego 6:** el factor que cambia de exponente es x − 2, no x − 1: x − 1 es la respuesta de su predicción y salía en
   la consigna, la misión y Lee (`antes-predice`). Los exponentes se nombran por su papel, sin letras.
4. **«raíz» solo como «raíz cuadrada» o nada:** los textos de la idea 2 que decían «la raíz de 4x²» pasan a «lo que va al
   cuadrado» (la palabra suelta se marcaba con la definición de Ecuaciones lineales, «número que cumple P(x) = 0»).
5. **Sin ambigüedad en «la suma de los dos factores»:** los generadores (teoría y práctica) solo arman casos donde los dos
   factores no tienen un número común (2x + 4y se podría partir otra vez) ni se siguen abriendo (cx² + b primo); así la
   suma es una sola. Lo mismo para los cubos (2x + 4 no va) y el binomio volteado.
6. **El tema del glosario por idea:** «trinomio» lo estrena la idea 2 (sale en «trinomio cuadrado perfecto»); la idea 3
   estrena «aspa simple» y «término central» (con la forma «término del medio»).
7. **Práctica:** 25 tipos (el quinto de la idea 6, `mcm-dado`, es el de San Marcos 2027-I con otros números). Ítems de la
   prueba fz-01 (factores primos de 2x³ − 32x y 2x³ − 50x) y fz-02 (MCD de dos trinomios evaluado), a la reserva.
