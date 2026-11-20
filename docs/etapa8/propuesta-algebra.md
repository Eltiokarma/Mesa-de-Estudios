# Propuesta de ideas: «Ecuaciones polinomiales» (`algebra.ecuaciones-polinomiales`)

Etapa 8 del plan de calidad, rama «Expresiones algebraicas» (sexta unidad, después de «Exponentes y radicales»,
«Productos notables», «Polinomios», «División de polinomios» y «Factorización»; la sigue «Binomio de Newton») · encargo
con criterio delegado (`docs/metodo/unidad/etapa-delegada.md`) · 19 nov 2026

Gerson: delegaste el criterio, así que esta propuesta ya está aplicada (la unidad entera, sin `calidad: 2`). Lo que decidí
sin ti está al final, en «Decisiones tomadas (Gerson revisa después)», cada punto con su motivo y la alternativa que
descarté. No encontré ningún conflicto crítico.

Lo que leí: `CLAUDE.md`, `docs/plan-calidad.md` §3, `docs/molde-unidad.md`, `docs/teoria.md` (4e a 4j, §5),
`docs/metodo/unidad/` (LEEME, 1-ideas, 2-ejemplos, 3-practica, reglas-validador, etapa-delegada), las decisiones de las
etapas 2 a 7, la propuesta modelo (`docs/etapa7/propuesta-algebra.md`), la unidad anterior de la rama con `calidad: 2`
(`factorizacion.js`, con su auditoría y su lector en frío: lo que se corrigió fue la factorización incompleta como
respuesta, «a y b los dos términos», la convención de factor primo sin «enteros», los menos de teclado, las alternativas
con fichas de color y los datos que daban la respuesta), la teoría actual (`ecuaciones-polinomiales.js`, v0.2.0), su ficha
en `catalogo/cursos/algebra.json`, sus plantillas (`ecuaciones-polinomiales`, `polinomios`), `nucleo/repaso-tipos.js`,
`docs/temario-completo.md` §10, `docs/investigacion/algebra-funciones-ideas-erroneas.md` (AL8, AL14 y AL15 tocan esta
unidad), `catalogo/pruebas/algebra.json` (po-02 en la reserva), `docs/datos/admision-unmsm.csv` y las unidades vecinas
(`factorizacion`, `binomio-de-newton`, `ecuaciones-lineales-y-cuadraticas`, `numeros-complejos`, `inecuaciones`).

## Qué se pregunta en los exámenes

En `docs/datos/admision-unmsm.csv` hay **12 preguntas de San Marcos** de esta unidad (y una de Factorización que resuelve
una cúbica):

| Periodo (pregunta) | Qué piden | Idea |
| --- | --- | --- |
| 2019-I (52), 2027-I (41) | Cardano-Vieta en cúbicas: suma de cubos de las raíces; la tercera raíz con la suma de productos de a dos | 2 (nivel 3 y «Ahora tú») |
| 2019-I (47), 2024-II (38) | Cúbica por tanteo en una caja (aristas con x; caja sin tapa por recortes) | 3 (nivel 3, práctica) |
| 2022 (39), 2026-II (41) | Una raíz conocida fija un parámetro; factorizar la cúbica | 3 (nivel 2 y 3) |
| 2022 (40) | Igualar dos modelos polinomiales (tanques) y resolver la cúbica | 3 (práctica) |
| 2027-I (39) | Raíz triple y comparación de coeficientes | 1 (nivel 3) |
| 2027-I (41) | Paridad de raíces complejas al reconstruir la cúbica (trampa: cambiar el signo de la parte real) | 4 (Predice y «Ahora tú») |
| 2019-II (37), 2023-I (38) | Bicuadradas desde un enunciado (consecutivos, precio; trampa: tomar las raíces negativas) | 5 (nivel 3 y «Ahora tú») |
| 2024-II (42) | Bicuadrada sin raíces reales (trampa: «no tiene raíces») | 5 (nivel 3) |

El banco Cuzcano trae unas 65 fichas (bicuadradas y recíprocas 17, relaciones entre raíces y coeficientes 15, grado
superior 11, transformación de ecuaciones 9, paridad 8). En el repo no hay preguntas de la UNI clasificadas (semanas 4
y 10 de su sílabo). La prueba del curso tiene po-02 (teorema del factor con un parámetro) en la reserva.

---

## 0. Diagnóstico de la teoría actual contra el contrato

`ecuaciones-polinomiales.js` (v0.2.0, `estado: 'completa'`, sin `calidad: 2`) tiene 6 ideas (`grado-raices`, `viete`,
`raices-racionales`, `conjugadas`, `cambio-de-variable`, `binomica`), cada una con su juego sobre una gráfica, una
tabla, una recta o el plano complejo, y tres mesas. Se quedan: la cúbica que sube y baja (idea 1), la tabla de
candidatos p/q (idea 3), las raíces de u que vuelven a x en la recta (idea 5) y dos mesas (con colores nuevos).

1. **Punto 1: ninguna primera pantalla tiene un objeto.** Las seis juegan con ejes, tablas, la recta o el plano; el
   terreno de Juliaca solo está escrito en «Lee» de la idea 1.
2. **Puntos 2, 3 y 12:** no hay `mision`, `leyenda`, `aprendizaje`, `actividad` ni `pregunta`; las consignas describen
   controles («Mueve c en y = x³ − 3x + c»).
3. **Punto 13:** ningún ejercicio trae `datos`; no hay ejemplos resueltos (0 de 90); el glosario no tiene `simple` ni
   tres ejemplos.
4. **§5b: colores viejos.** La incógnita naranja, las raíces verdes (junto al naranja: protanopía 0,010), el módulo y
   los valores calculados en carmín (es de los ángulos).
5. **Punto 9 y lo que viene después:** la idea 6 (zⁿ = w) usa módulo, ángulo y el plano complejo (forma polar y De
   Moivre son de «Números complejos», otra rama y grado 5); la idea 4 dibuja el plano complejo; la idea 1 dice
   «complejas» sin presentar nada.
6. **Regla 4 (lo previo no delata):** Lee de la idea 3 ya trae la tabla de seis candidatas y su juego muestra cuáles
   pasan por el eje; la predicción de la idea 1 («corta en 3 puntos… ¿cuántas no reales?») tiene dos respuestas si un
   corte es una raíz triple.
7. **«Así se resuelve» es «Ahora tú» con la semilla + 900** en las seis ideas.
8. **Punto 7:** las reglas y Mira separan con «   ·   » (en álgebra se lee como producto).
9. **Notación:** las raíces se llaman r₁, r₂, r₃ (r es el resto en División y en Factorización).
10. **Práctica:** la ficha lista `polinomios` (escena de Polinomios, con un problema de papel de esta unidad sin datos) y
    `ecuaciones-polinomiales` (generador de admisión con 16 tipos, sin `datos` por línea y sin separar por idea; lo
    comparte «Números complejos»). No hay práctica por idea.
11. Detalles: la cabecera dice «4.º de secundaria»; los títulos son frases («Los coeficientes delatan las raíces»).

---

## 1. Las ideas, en orden

**Seis ideas, con sus seis `id`** (cambia la Predice de todas). No hace falta partir la unidad.

| # | `id` | Título | `aprendizaje` |
| --- | --- | --- | --- |
| 1 | `grado-raices` | Raíces y grado | Con P factorizado, cada factor que vale 0 da una raíz; una repetida cuenta tantas veces como su exponente y, con las no reales, hay tantas raíces como el grado. |
| 2 | `viete` | Raíces y coeficientes | En ax³ + bx² + cx + d = 0, las raíces suman −b/a, sus productos de a dos suman c/a y su producto es −d/a, sin hallarlas. |
| 3 | `raices-racionales` | Raíces racionales | Si una fracción reducida es raíz de un polinomio con coeficientes enteros, su numerador divide al término independiente y su denominador al principal; cada raíz hallada baja el grado. |
| 4 | `conjugadas` | Raíces en pareja | Con coeficientes enteros, una raíz con raíz cuadrada inexacta o con i llega con su conjugada: 2 + √3 con 2 − √3, y 1 + 2i con 1 − 2i. |
| 5 | `cambio-de-variable` | Bicuadradas y recíprocas | En ax⁴ + bx² + c = 0 se cambia x² por u: cada u positivo da dos raíces opuestas y cada u negativo, dos no reales; en una recíproca se usa t = x + 1/x. |
| 6 | `binomica` | Ecuaciones de dos términos | xⁿ = a se resuelve factorizando: tiene n raíces; con n impar, una real; con n par, dos opuestas si a > 0 y ninguna si a < 0; las demás, no reales y en pareja. |

`pregunta` (Resumen): 1 «¿Cuántas raíces tiene un polinomio de grado n?» · 2 «¿Qué dicen los coeficientes sobre las
raíces?» · 3 «¿Qué fracciones pueden ser raíces de un polinomio con coeficientes enteros?» · 4 «¿Qué otra raíz llega
con 2 + √3?» · 5 «¿Cómo se resuelve una ecuación con x⁴, x² y un número?» · 6 «¿Cuántas raíces reales tiene xⁿ = a?».

**Por qué va cada una ahí y qué da por sabido**

1. **Raíces y grado.** La base: qué es resolver una ecuación factorizada (producto cero), la raíz repetida y el conteo
   del teorema fundamental. Da por sabido factorizar (Factorización) y, de «Ecuaciones de primer y segundo grado», qué es
   una raíz y el discriminante como herramienta (decisión 1). Presenta «raíz no real» sin escribirla: un factor de grado
   2 con Δ < 0 aporta dos.
2. **Raíces y coeficientes.** Con el conteo de la 1, las tres raíces de una cúbica se leen en sus coeficientes. La suma
   y el producto de las dos raíces de una cuadrática son de «Ecuaciones de primer y segundo grado»: aquí van como dato.
3. **Raíces racionales.** Para hallar las raíces de una cúbica sin factorizar: la lista de candidatos (Factorización ya
   probaba divisores; aquí se nombra la raíz racional y se dice por qué la lista es esa), Ruffini para bajar el grado y
   la fórmula general (como dato) para lo que queda.
4. **Raíces en pareja.** Las raíces irracionales y no reales que salen de la fórmula general de la 3. Presenta i como
   dato (i² = −1; «Números complejos» la explica después) para escribir las no reales que la 1 solo contaba.
5. **Bicuadradas y recíprocas.** Un cambio de variable que deja una cuadrática; los u negativos dan las parejas no reales
   de la 4.
6. **Ecuaciones de dos términos.** Al final, porque usa todo: factorizar con identidades, contar (1), la fórmula general
   con Δ < 0 y la pareja (4).

**Qué no entra** (es de otra unidad): forma polar, módulo y argumento de un complejo, De Moivre y las raíces de zⁿ = w en
el plano (Números complejos); operar con complejos más allá de i² = −1; la fórmula de Cardano para la cúbica; desarrollar
(x ± 1)⁴ con el binomio de Newton (va como dato cuando hace falta); inecuaciones y funciones.

---

## 2. Objeto de la primera pantalla

Sigue el hilo de la rama: **el maestro Rubén enchapa pisos en Juliaca** (losetas de x dm, el pasadizo, el cuaderno con la
tabla de Ruffini). Ahora Rubén conoce cuánto debe medir algo y busca la medida: eso es una ecuación.

| Idea | Objeto (primera tarjeta de «Lee» y juego) | Qué es cada cosa |
| --- | --- | --- |
| 1 | **El pasadizo de 15 dm²** de x por (x + 2) dm (Lee) y **la curva de una cúbica en el cuaderno** (juego) | la medida que sirve es una raíz; −5 también cumple la ecuación, pero no es un largo |
| 2 | **La caja de cartón de Rubén** con aristas de 1 a 5 dm (Lee y juego) | las aristas son las raíces; la suma de aristas, la mitad del cartón y el volumen son −b, c y −d |
| 3 | **La caja de 60 dm³** de x por (x + 1) por (x + 2) (Lee) y **la tabla de Ruffini del cuaderno** (juego) | el número que se prueba, la fila de abajo y el resto que da 0 |
| 4 | **El huerto cuadrado de 2 m²** del colegio (Lee) y **la tabla de las dos raíces** (juego) | el lado √2 y su opuesto −√2 salen juntos; la compañera de 2 + √3 |
| 5 | **Los dos huertos cuadrados** de 1 m² y 4 m² (Lee) y **la recta con las áreas u y los lados x** (juego) | cada área u da dos lados x opuestos |
| 6 | **La caja cúbica de 8 dm³** (Lee) y **la recta con las raíces reales de xⁿ = a** (juego) | la arista es la raíz real; las otras dos raíces no se ven |

Piezas: **una nueva, `alg-caja`** (dibujo de prueba): la caja de cartón de Rubén en perspectiva, con sus tres aristas
rotuladas (un número o un texto como «x + 1»), el volumen y, si se pide, el cartón desplegado; para la idea 2 y la Lee de
la 3. Las demás ya existen y no se tocan: `alg-reparto` (el pasadizo y la tabla de Ruffini), `alg-objeto` (los huertos y
la caja cúbica de Exponentes), `alg-tabla`, `ejes` y `recta`.

---

## 3. Misión de «Juega»

| Idea | Contexto + misión | Controles | `logrado` | Lectura en vivo |
| --- | --- | --- | --- | --- |
| 1 | «En el cuaderno de Rubén está la curva de y = x³ − 3x + d. Corta el eje x donde el polinomio vale 0.» **Haz que la curva toque el eje x sin cruzarlo.** | d (el término independiente), de 0 a 4 | d = 2 | «3 reales y 0 no reales: 3 + 0 = 3, el grado» |
| 2 | «Rubén arma cajas de cartón; el polinomio (x − largo)(x − ancho)(x − alto) vale 0 en sus aristas.» **Arma la caja cuyo polinomio es x³ − 9x² + 26x − 24.** | largo, ancho y alto, de 1 a 5 dm | las aristas 2, 3 y 4 (en cualquier orden) | «x³ − 6x² + 11x − 6: 1 + 2 + 3 = 6; 1 · 2 · 3 = 6» |
| 3 | «En su cuaderno, Rubén prueba números en la tabla de Ruffini de 2x³ − 7x² + 2x + 3.» **Encuentra la raíz que no es un número entero.** | el número que se prueba: ±1, ±3, ±1/2, ±3/2 | −1/2 | «P(1/2) = 5/2: el resto no es 0» |
| 4 | «Una raíz de un polinomio con coeficientes enteros es 2 + √3.» **Elige la compañera para que (x − raíz)(x − compañera) tenga coeficientes enteros.** | la compañera: 2 + √3, −2 + √3, −2 − √3, 2 − √3 | 2 − √3 | «suman 4 y multiplican 1: x² − 4x + 1» |
| 5 | «Dos huertos cuadrados tienen áreas u₁ y u₂; sus lados cumplen una bicuadrada.» **Haz que la ecuación sea x⁴ − 13x² + 36 = 0.** | u₁ y u₂, de −4 a 9 | {4, 9} | «u = 4 da x = ±2; u = −1 no da reales» |
| 6 | «La ecuación xⁿ igual a 1, o a −1, tiene n raíces. En la recta se ven solo las reales.» **Haz que la ecuación tenga dos raíces reales y cuatro no reales.** | n, de 2 a 6; el número, 1 o −1 | n = 6 y el número 1 | «x⁴ = 1: 2 reales y 2 no reales; 2 + 2 = 4» |

Cada misión tiene un solo caso en su grilla (salvo la 2, donde las seis permutaciones son la misma caja) y no está
cumplida al abrir; lo comprueba la prueba propia. La predicción queda fuera de lo jugado: el juego 1 es de grado 3 (la
predicción, de grado 5); el 2 es mónico con raíces positivas (la predicción tiene a = 2 y producto negativo); el 3 tiene
principal 2 y término independiente 3, y su raíz no entera es −1/2 (la predicción, al revés: principal 3 e independiente 2, y la respuesta 3/2); el 4 solo tiene raíces
con √ (la predicción, una con i); el 5 da la ecuación desde las áreas (la predicción pide contar raíces reales desde la
ecuación); el 6 usa xⁿ = ±1 (la predicción, la suma de las raíces no reales de x³ = 8).

---

## 4. La predicción de cada idea

La app baraja las opciones. `datos` lleva solo valores y equivalencias. Todo error es hipótesis (TAL-, hipótesis de
diseño que van a `rutinas/teoria-algebra.md` al cerrar) salvo AL8 y AL15 (investigación). Ninguna predicción repite un
código.

| Idea | Pregunta y datos | Correcta | Distractores (código) |
| --- | --- | --- | --- |
| 1 | «Un polinomio de grado 5 tiene 3 raíces reales distintas y ninguna se repite. ¿Cuántas raíces no reales tiene?» Datos: grado 5; 3 raíces reales, cada una una sola vez | 2 | 0, cree que la gráfica muestra todas (TAL-SOLO-REAL) · 3, una no real por cada real (TAL-NOREAL-ESPEJO) · 5, toma el grado (TAL-GRADO) |
| 2 | «En 2x³ − 6x² + 4x + 10 = 0, ¿cuánto vale el producto de sus tres raíces?» Datos: 2x³ − 6x² + 4x + 10 = 2(x³ − 3x² + 2x + 5) | −5 | 5, no cambia el signo (TAL-SIGNO-VIETE) · −10, no divide entre a (TAL-NORMALIZA) · 3, da la suma (TAL-PRODUCTO) |
| 3 | «Un polinomio con coeficientes enteros empieza con 3x³ y termina en + 2. ¿Cuál de estos números NO puede ser una raíz suya?» Datos: divisores de 2: 1 y 2; de 3: 1 y 3 | 3/2 | 2/3, −1/3 y 2 sí pueden: cree que la fracción se arma al revés (TAL-PQ-INVERTIDO) |
| 4 | «Un polinomio de grado 3 con coeficientes enteros tiene la raíz 2 + 3i. ¿Cuál de estos números también es raíz, seguro?» Datos: i² = −1 | 2 − 3i | −2 + 3i, cambia el signo de la parte real (TAL-CONJ-REAL, la trampa de San Marcos 2027-I) · −2 − 3i, toma el opuesto (TAL-CONJ-OPUESTO) · 3 + 2i, cruza las partes (TAL-CONJ-CRUZA) |
| 5 | «¿Cuántas raíces reales tiene x⁴ + 3x² − 4 = 0?» Datos: x⁴ = (x²)² | 2 | 4, cree que cada u da dos reales (TAL-BICUAD-TODAS) · 1, toma solo la positiva (TAL-BICUAD-POSITIVA) · 0, descarta todo por un u negativo (TAL-BICUAD-NINGUNA) |
| 6 | «x³ = 8 tiene la raíz real 2. ¿Cuánto suman sus dos raíces no reales?» Datos: x³ − 8 = (x − 2)(x² + 2x + 4) | −2 | 0, cree que son opuestas (TAL-BIN-OPUESTAS) · 2, no cambia el signo (TAL-BIN-SIGNO) · 4, da el producto (TAL-BIN-PRODUCTO) |

---

## 5. Tabla de letras y símbolos

| Símbolo | Un solo significado en la unidad | Aviso |
| --- | --- | --- |
| x | la incógnita; en Lee de las ideas 1 y 3, una medida en dm | |
| x₁, x₂, x₃, x₄ | las raíces, en orden | como en las academias; no se usa r (es el resto en División) |
| P, Q | el nombre de un polinomio en un enunciado | |
| a, b, c, d | los coeficientes de ax³ + bx² + cx + d (o de ax² + bx + c, o ax⁴ + bx² + c) | a es el coeficiente principal; d, el término independiente (también en el juego 1: x³ − 3x + d). La idea 6 no usa letra para el número de xⁿ: dice «xⁿ igual a un número» |
| m | el exponente de un factor repetido (la multiplicidad) | |
| A, B | en una identidad, lo que va al cuadrado o al cubo (A² − B² = (A + B)(A − B)) | mayúsculas, para no chocar con los coeficientes |
| n | el grado; en la idea 6, el exponente de xⁿ (que es el grado) | |
| p, q | el numerador y el denominador de un candidato p/q (idea 3) | q no es el cociente de Ruffini en esta unidad |
| k | un número por hallar en un enunciado (un parámetro) | |
| u | la variable auxiliar u = x² (idea 5) | |
| t | la variable auxiliar t = x + 1/x (idea 5) | |
| i | el número con i² = −1 (ideas 4 a 6) | se explica en «Números complejos»; aquí solo como dato |
| Δ | el discriminante b² − 4ac (de «Ecuaciones de primer y segundo grado») | va como dato cada vez |

## 6. Mapa de colores por magnitud (§5b)

| Token | Magnitud |
| --- | --- |
| tinta | el polinomio y la ecuación enteros, la incógnita x, y lo que se pide con «?» |
| `f` violeta | las raíces (lo que se busca casi siempre): los puntos de la curva sobre el eje, las aristas de la caja, la raíz hallada en la tabla, los lados x de los huertos |
| `o` naranja | los coeficientes que se leen (a, b, c, d; d en el juego 1) |
| `i` turquesa | el número que se prueba en la tabla de Ruffini, la compañera que se elige y las variables auxiliares u y t |
| `h` carmín, `d` verde | **no se usan** |

Pares que van juntos: naranja–violeta 0,189, turquesa–violeta 0,101, naranja–turquesa 0,114 (molde §5b). En las figuras
de Predice y de los ejemplos, lo pedido va con «?» en tinta. Las alternativas de «Ahora tú» van en tinta (como en
Factorización); el color queda en la solución.

---

## 7. Práctica: qué existe y qué falta por idea

**Hoy:** la ficha lista `polinomios` (la escena de Polinomios; su problema de papel p9, de esta unidad, sin datos) y
`ecuaciones-polinomiales` (generador de admisión con 16 tipos, compartido con «Números complejos»).

| Idea | Tipos nuevos (plantilla `ecuaciones-polinomiales-practica`, formato `predicciones`) |
| --- | --- |
| 1 Raíces y grado | total de raíces de un factorizado · reales distintas · no reales (con Δ) · raíz triple y término independiente (San Marcos 2027-I) |
| 2 Raíces y coeficientes | suma · producto · suma de inversos · la tercera raíz y el parámetro (San Marcos 2027-I) |
| 3 Raíces racionales | la que no puede ser raíz · cuántos candidatos · las otras dos raíces · la caja por tanteo (San Marcos 2019-I y 2024-II) |
| 4 Raíces en pareja | la compañera · el factor de grado 2 · el menor grado · la raíz real de la cúbica (San Marcos 2027-I) |
| 5 Bicuadradas y recíprocas | cuántas reales · la mayor raíz · la ecuación en t de una recíproca · el precio (San Marcos 2023-I) |
| 6 Dos términos | cuántas reales · cuántas no reales · producto de las no reales de x³ = k³ · producto de todas las raíces |

`TIPOS_POR_IDEA`, prueba en 400 semillas, `casos.json` verificado aparte y papel con datos. **`ecuaciones-polinomiales`**
(el generador de admisión) se queda en la ficha y en su `plantilla.json`, pero pasa a «Más mesas del tema» para esta
unidad (`"rehacer": ["algebra.ecuaciones-polinomiales"]`) y su papel dice de qué unidad es cada problema; no se toca su
código (decisión 8). **`polinomios`** se queda, también en «Más mesas del tema» para esta unidad (se suma a su lista
`rehacer`), y su p9 lleva datos. Dos ítems nuevos, a la reserva de la prueba del curso (las formas ya tienen 10 pares):
ep-01 (Cardano-Vieta: la tercera raíz y el coeficiente) y ep-02 (bicuadrada: cuántas raíces reales), con su verificador
en `catalogo/pruebas/verificar.js`.

## 8. Datos del mundo

| Dato | ¿Fuente? |
| --- | --- |
| El pasadizo, las losetas de x dm, la caja de cartón de 1 a 5 dm, la caja de 60 dm³ | Valores de problema, posibles, sin fuente (como en Polinomios, División y Factorización) |
| Los huertos cuadrados del colegio (1, 2, 4 y 9 m²) y la caja cúbica de 8 dm³ | Valores de problema, sin fuente (los mismos objetos de Exponentes y radicales) |
| Precios en soles de un acertijo | Valores de problema, sin fuente |
| Historia: el teorema fundamental del álgebra | Se queda la fuente publicada (O’Connor y Robertson, MacTutor); el texto deja de decir «números complejos» |

## 9. Riesgos de orden (`requiere`)

- `requiere` no cambia: `algebra.factorizacion` y `algebra.ecuaciones-lineales-y-cuadraticas`.
- **«Ecuaciones de primer y segundo grado» todavía no se rehízo** (otra rama). Se da por sabido lo que su teoría ya
  presenta y la rama de Expresiones no contradice: qué es una ecuación, una raíz, una ecuación cuadrática y el
  discriminante (su glosario los define). **Van siempre como dato**, en cada ejercicio que los usa: la fórmula general
  x = (−b ± √Δ)/(2a), Δ = b² − 4ac y lo que dice su signo, y la suma −b/a y el producto c/a de las raíces de una
  cuadrática. Lo que la unidad presenta por su cuenta, en «Lee» y en la regla: el producto cero (un producto vale 0 si
  un factor vale 0), la raíz no real (un factor de grado 2 con Δ < 0) y la i (como dato) (decisión 1).
- **No se adelanta «Números complejos»:** ni módulo, ni plano complejo, ni forma polar, ni operar con complejos. La i se
  usa solo para escribir las raíces no reales (√−4 = 2i) y el producto de dos conjugadas como diferencia de cuadrados
  con i² = −1. «Unidad imaginaria», «parte real» y «parte imaginaria» son términos de esa unidad: aquí se dicen con
  otras palabras.
- **No se adelanta «Binomio de Newton»:** (x ± 1)⁴ va como dato desarrollado cuando un ejercicio de bicuadradas lo usa.
- «Multiplicidad» la define «Inecuaciones» (otra rama, más adelante) con el mismo sentido: aquí va como término `local`
  (decisión 6). «Conjugado» es de Productos notables y se usa tal cual (la pareja con el signo del medio cambiado).
- La idea 2 usa el conteo de la 1; la 3, la factorización y Ruffini de las unidades anteriores; la 4, la fórmula general
  de la 3; la 5, la pareja no real de la 4; la 6, todo. Ninguna usa algo posterior.

---

## 10. Decisiones tomadas (Gerson revisa después)

1. **Lo de «Ecuaciones de primer y segundo grado» se da por sabido como palabra y va como dato como herramienta.** Raíz,
   ecuación cuadrática y discriminante se usan como palabras (su glosario los define); la fórmula general, Δ y su signo,
   y la suma y el producto de una cuadrática van en los datos de cada ejercicio que los usa, nunca como paso hecho.
   Motivo: esa unidad es de otra rama y no pasó el contrato; su teoría sí presenta las tres cosas, pero el alumno de esta
   rama puede no haberla hecho. Descartado: repetir aquí la fórmula general como idea (sería una séptima idea y pisaría
   esa unidad) o no usarla (sin ella no se termina ninguna cúbica).
2. **La ecuación binómica se resuelve factorizando, sin el plano complejo.** xⁿ = a se abre con diferencia de cuadrados o
   de cubos, y las raíces no reales salen de la fórmula general con Δ < 0. Motivo: el plano, el módulo, el ángulo y De
   Moivre son temas de «Números complejos» (otra rama, grado 5). Descartado: dejar la versión del polígono regular (la
   idea vieja).
3. **La i entra como dato, no como idea.** «i: el número con i² = −1» y «√−n = √n · i» van en los datos de los
   ejercicios con raíces no reales (ideas 4 a 6). Motivo: dos preguntas de San Marcos (2024-II y 2027-I) piden raíces no
   reales en esta unidad, y la unidad que presenta la i viene después en otra rama. Descartado: contar las no reales
   sin escribirlas nunca (no alcanza para la paridad ni para la 2027-I).
4. **Las raíces se llaman x₁, x₂, x₃**, como en las academias. Motivo: r es el resto en División y en Factorización.
   Descartado: r₁, r₂, r₃ (la versión vieja).
5. **«Raíz no real» en vez de «raíz compleja».** Un real también es complejo; «no real» es lo que el alumno ve (la
   gráfica no la muestra). Descartado: «compleja» y «número complejo» en el glosario (se define en «Números complejos»).
6. **«Multiplicidad» va como término `local`**, porque «Inecuaciones» lo define (mismo sentido) y una definición por
   curso no se repite. Descartado: mudar la definición (tocaría otra unidad).
7. **Pieza nueva `alg-caja`** (la caja de cartón con tres aristas, dibujo de prueba). Motivo: la caja hace ver las tres
   relaciones de Cardano-Vieta (suma de aristas, la mitad del cartón, el volumen) y es el contexto de dos preguntas de San
   Marcos. Descartado: la gráfica con tres raíces que se arrastran (la versión vieja, un diagrama) y agregar un objeto a
   `alg-objeto` (es compartida).
8. **Práctica:** plantilla nueva `ecuaciones-polinomiales-practica` por idea, primera en la ficha. `ecuaciones-polinomiales`
   y `polinomios` se quedan en la ficha en «Más mesas del tema» para esta unidad (`rehacer` como lista); los problemas
   de papel de `ecuaciones-polinomiales` dicen su unidad, y p9 de `polinomios` trae datos. No se toca el código de los dos
   generadores viejos. Descartado: sacar `ecuaciones-polinomiales` de la ficha (sus 16 tipos son de admisión y de esta
   unidad; quedaría solo en «Números complejos»).
9. **El avance:** las seis ideas conservan su `id` y cambian su Predice; la unidad no suma ideas. Fila nueva en
   `REHECHAS_E6` de `nucleo/avance.js` (marca `prediccionEP`), con su prueba. Sin `estudiada` (no hay ideas nuevas).
10. **Laboratorio:** se quedan «Cúbica con raíces y a libres» (idea 2, con los colores de la unidad y x₁, x₂, x₃) y «Tres
    grados que suben y bajan» (idea 1, «no reales» en vez de «complejas»). Sale «zⁿ = w con w libre» (plano complejo,
    de «Números complejos»; usaba carmín y verde). Descartado: dejarla en «Más mesas del tema».
11. **La predicción de la idea 1 dice «ninguna se repite»** (la vieja tenía dos respuestas si un corte era triple).
12. **Recíprocas:** solo las de grado 4 con coeficientes simétricos (x⁴ + bx³ + cx² + bx + 1), con x² + 1/x² = t² − 2
    como dato. Descartado: las de grado impar (salen dividiendo entre x + 1; quedan para la práctica de admisión vieja).
13. **Transformación de ecuaciones** (9 fichas del banco: la ecuación cuyas raíces son el doble o el inverso) no entra: no
    es tema del catálogo. Descartado: una séptima idea.
14. **Ficha del catálogo:** `potencial_visual` sube de `medio` a `alto` (caja, huertos, curva y tabla), `plantillas` queda
    `["ecuaciones-polinomiales-practica", "polinomios", "ecuaciones-polinomiales"]`; `grado` sin tocar.

## Cambios (19 nov, al escribir las seis ideas y la práctica)

1. **Juego 1:** el término independiente se llama d (x³ − 3x + d), no c: en la unidad, c es el coeficiente de x. La
   misión tiene una sola salida porque d va de 0 a 4 (con d = −2 habría otra).
2. **Notas de la sesión sobre la idea 1:** la fórmula de la regla va en un solo bloque, P(x) = a(x − x₁)…(x − xₙ), con «a:
   coeficiente principal» en la llave; la regla lleva un dibujo propio con la cuenta (x − 1: 1 real; x² + 4: 2 no reales;
   1 + 2 = 3, el grado); el «Vale si» dice «un trinomio sin raíces reales» en vez de Δ (en Mira, «su discriminante es
   negativo»); la gráfica de Predice ya no deja aire debajo. Para eso, la pieza compartida `ejes` acepta
   `ajustado: true` (sin marca, el lienzo termina bajo los números del eje x; cambio aditivo en un bloque propio, las demás
   unidades no cambian).
3. **Juego 3:** el polinomio pasa a 2x³ − 7x² + 2x + 3 (raíces 1, 3 y −1/2): con 2x³ − 3x² − 2x + 3 la raíz de la misión
   era 3/2, la misma respuesta de la predicción (la regla `antes-predice` la marcaba en el «Listo» de la misión).
4. **Juego 4:** cuatro compañeras, no cinco: √3 − 2 es el mismo número que −2 + √3, y con 3 + √2 la suma y el producto no
   se leen.
5. **Idea 6 sin letra para el número** («xⁿ igual a un número»): a ya es el coeficiente principal.
6. **«Número complejo» se queda en el glosario de la unidad** (lo definía la versión anterior y «Números complejos» manda
   a verlo; si sale, su `ver` queda roto). Va como palabra de la idea 4, donde se dice que la i se explica allá.
7. **`glosarioSin: ['recíproca']`:** «recíproca» suelta es aquí la ecuación recíproca, no la de Lógica y conjuntos.
8. **Los datos largos se parten en líneas** (Cardano-Vieta en tres, la fórmula general y Δ en dos) para que ninguna
   ecuación se parta en mal sitio a 390 px (`herramientas/ecuaciones-ancho.js`: «todo cabe»).
9. **Práctica:** 24 tipos (cuatro por idea); las respuestas de conteo van como texto (con 0 como respuesta, en modo
   número la correcta quedaba en un extremo). Ni la teoría ni la práctica repiten una predicción (2 ± 3i, x³ = 8).
10. **Prueba del curso:** ep-01 (la tercera raíz y k: x³ − 10x² + kx − 30 con 2 y 3; x³ − 11x² + kx − 40 con 2 y 4) y
    ep-02 (cuántas raíces reales: x⁴ + 5x² − 36 y x⁴ + 6x² − 7), a la reserva, con su verificador.

