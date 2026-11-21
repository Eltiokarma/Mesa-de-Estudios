# AL9 · Álgebra · Binomio de Newton

> Parte del documento de ChatGPT de las 32 unidades (21 nov 2026), por verificar. Cómo se leyó la evidencia y el contrato común de las escenas: `docs/investigacion/etapas-9-12/como-leer.md`.


## 1. Resumen en cinco líneas

La unidad explica cómo desarrollar una potencia de una suma o diferencia de dos términos.  
Parte de decisiones repetidas y de la propiedad distributiva.  
Construye el coeficiente como un conteo de selecciones.  
Permite buscar un término particular sin expandir todo.  
La dificultad central es coordinar coeficiente, exponentes, signo y posición.

## 2. Qué se pregunta en los exámenes

| Tipo | Universidad | Dificultad | Frecuencia | Fuente |
|---|---|---|---|---|
| Desarrollo y término general de una potencia binómica | UNI, preparación CEPREUNI | Media | Inclusión curricular; no estimada | CEPREUNI, sucesiones y binomio |
| Coeficiente o término con una potencia determinada | UNI, propuesta alineada al tema | Alta | Sin aparición específica verificada | CEPREUNI; Abramson, 9.6 |
| Productos notables y operaciones polinómicas | UNMSM | Media | Temario histórico; no prueba una pregunta de binomio general | UNMSM, 17.6 y 17.10 |

## 3. Errores típicos

| Código | Qué hace | Por qué | Estado | Fuente |
|---|---|---|---|---|
| B-DIS | No multiplica todos los términos entre sí | Aplicación incompleta de la distributiva; causa individual por comprobar | Documentado en multiplicación polinómica | Booth y otros, 2014, tablas 3–4 |
| B-IND | Confunde posición con número de elecciones del segundo término | Los índices empiezan en lugares distintos | Hipótesis | Diseño propio |
| B-SIG | Omite la alternancia de signos | Trata la resta como un adorno de la base | Hipótesis específica del binomio | Diseño propio |
| B-CON | Cuenta cantidades seleccionadas como si fueran maneras distintas, o ignora el orden de posiciones | No distingue cantidad elegida y número de selecciones | Hipótesis | Diseño propio |

## 4. Lo que la unidad da por sabido

Multiplicación de monomios, distributiva, exponentes naturales, términos semejantes y números combinatorios como conteo sencillo. Si no conoce combinaciones, la idea 2 las construye desde selecciones de posiciones; no exige una unidad posterior.

## 5. Las ideas, en orden

### Idea 1. Todas las elecciones — ¿De dónde salen los términos mezclados?

**Aprende:** cada factor aporta una elección y todas deben contarse.

**Lee / objeto:** una bandeja de una panadería con casillas para dos clases de pan, reconocible por su uso cotidiano. Tarjeta 1: «Cada casilla recibe una elección». Tarjeta 2: «Una fila registra el orden de las elecciones». Tarjeta 3: «Dos filas pueden tener la misma cantidad de cada clase y distinto orden».

**Juega:** completa todas las filas posibles de dos casillas usando fichas de dos colores, sin repetir filas; el programa comprueba cobertura. Solo hay dos casillas.

**Predice:** al abrir una tercera casilla, ¿qué ocurre con las filas que mezclan ambos colores? A) Existen varias: importa en qué casilla queda cada color **[correcta]**. B) No existen; solo se usan filas de un color [B-DIS]. C) Solo hay una fila por cada cantidad de un color, sin importar el orden [B-CON]. D) Solo se admite una ficha del segundo color, aunque las casillas no impongan esa restricción [B-CON].

**Mira:** despliega la tercera casilla y agrupa las filas por cantidades, conservando sus órdenes visibles.

**La regla:** llamamos $a$ y $b$ a los dos términos y $n$ al número natural de factores. En $(a+b)^n$, cada producto elige un término de cada factor. Al reunir productos iguales, sus cantidades se convierten en coeficientes. No se puede sustituir la potencia de una suma por la suma de potencias. Para $n=0$, el valor es uno cuando la base no es cero.

**Palabras:** *factor*: una pieza que se multiplica; ejemplos: un paréntesis, un número, un monomio. *Término*: una parte separada por suma o resta; ejemplos: $a$, $b$, $ab$.

**Así se resuelve:** representar $(a+b)(a+b)$; elegir una entrada por factor; escribir $aa,ab,ba,bb$; reunir $ab$ y $ba$. **Ahora tú:** enumerar elecciones → completar un desarrollo parcial → detectar una expansión incompleta.

### Idea 2. Contar sin dibujar — ¿Cuántas veces aparece cada producto?

**Aprende:** el coeficiente cuenta cuáles posiciones aportan el segundo término.

**Lee / objeto:** la misma bandeja, ahora con fundas numeradas. «Las posiciones tienen nombre». «Elegir posiciones no equivale a ordenar panes». «Un mismo grupo puede describirse de varias maneras».

**Juega:** marca todas las parejas de posiciones de una bandeja de cuatro casillas; gana al registrar cada pareja una sola vez. La consulta de otras cantidades queda bloqueada.

**Predice:** en la bandeja de cuatro posiciones, ¿cómo se compara la cantidad de maneras de elegir tres posiciones con la de elegir una? A) Son iguales **[correcta]**. B) Elegir tres da el triple de maneras [B-CON]. C) Elegir tres da una sola manera, porque la cantidad ya está fijada [B-CON]. D) Elegir tres es imposible, porque solo se cuentan selecciones de una posición [B-CON].

**Mira:** empareja cada selección de tres posiciones con la única posición que dejó libre.

**La regla:** $k$, número de elecciones de $b$, toma valores enteros de cero a $n$. Su coeficiente es $\binom nk=n!/[k!(n-k)!]$; el signo «!» se lee factorial y significa multiplicar los enteros positivos hasta ese número, con $0!=1$. Así,

$$(a+b)^n=\sum_{k=0}^{n}\binom nk a^{n-k}b^k.$$

La suma, representada por $\sum$, reúne todos los valores de $k$. La simetría $\binom nk=\binom n{n-k}$ viene de elegir posiciones ocupadas o libres. Hay $n+1$ términos antes de posibles cancelaciones por valores particulares.

**Palabras:** *coeficiente*: cuántas copias del mismo producto se reúnen; ejemplos: copias de $a^2b$, de $ab^2$, de $b^3$. *Combinación*: un grupo en el que el orden de elección no crea otro grupo; ejemplos: dos casillas, tres libros elegidos, cuatro delegados.

**Así se resuelve:** para un producto con $k$ elecciones de $b$, identificar $n$; escoger sus posiciones; multiplicar el coeficiente por $a^{n-k}b^k$. **Ahora tú:** coeficiente dado $n,k$ → término central → comparación de coeficientes simétricos.

### Idea 3. Buscar el término — ¿Cómo localizar una potencia sin desarrollar todo?

**Aprende:** la condición del problema se aplica al exponente y luego se comprueba el índice.

**Lee / objeto:** etiquetas de cajas con expresiones algebraicas, como inventario de una imprenta. «La etiqueta distingue una clase de producto». «La posición se cuenta desde la primera caja». «Un signo pertenece al término completo».

**Juega:** ordena etiquetas de un desarrollo con suma según sus exponentes; la misión exige ningún exponente ausente. No se muestra una base con resta.

**Predice:** al cambiar el segundo término por su negativo, ¿qué posiciones cambian de signo? A) Las que seleccionan ese término un número impar de veces **[correcta]**. B) Todas [B-SIG]. C) Solo desaparecen las mezcladas [B-DIS]. D) Las de posición impar porque posición y elecciones son iguales [B-IND].

**Mira:** colorea por separado el número de elecciones y la posición de cada término.

**La regla:** $T_{k+1}$, término situado en la posición $k+1$, es $\binom nk a^{n-k}b^k$. En una diferencia se incorpora el signo dentro de $b$. Si los términos contienen la variable $x$, se suman sus exponentes después de multiplicar; se iguala ese exponente al solicitado y se exige $k$ entero entre cero y $n$. Un término independiente tiene exponente cero. Para sumar coeficientes de un polinomio en $x$, se evalúa en $x=1$; esto se justifica porque todas sus potencias pasan a valer uno.

**Palabras:** *índice*: número que identifica una entrada; ejemplos: $k=0$, $k=1$, $k=n$. *Independiente*: que ya no cambia con la variable elegida; ejemplos: una constante, un término con $x^0$, el valor fijo de una etiqueta.

**Así se resuelve:** escribir el término general de $(x^2+x^{-1})^n$, con $x\ne0$; su exponente es $2n-3k$; igualarlo al exponente pedido; comprobar el índice y obtener el coeficiente. **Ahora tú:** posición → potencia específica → término independiente con índice admisible → suma de coeficientes.

## 6. Letras y símbolos

| Símbolo | Significado | Unidad / advertencia |
|---|---|---|
| $a,b$ | Términos del binomio | Algebraicos; no longitudes |
| $n,k$ | Número de factores; elecciones del segundo término | Enteros sin unidad |
| $x$ | Variable del polinomio o expresión | Sin unidad en esta unidad |
| $T_{k+1}$ | Término en esa posición | Expresión algebraica; T no es temperatura |
| $!,\binom nk,\sum,\ne$ | Factorial, combinación, suma, distinto de | Operadores |

## 7. Otras formas de explicarla

El árbol de decisiones prepara la distributiva; crece demasiado para exponentes altos. El triángulo de Pascal permite verificar coeficientes, pero debe explicarse como suma de conteos vecinos, no como una tabla para memorizar. El modelo de área sirve para el cuadrado de un binomio; extenderlo literalmente a exponentes mayores crea falsas dimensiones físicas. Referencia conceptual: Abramson, 9.6; escenas propuestas aquí.

## 8. Datos del mundo

El BCRP emitió en 2021 una moneda de un sol dedicada a Toribio Rodríguez de Mendoza. Sirve para contar selecciones de fichas que representan monedas, no para suponer que ejemplares distinguibles son combinaciones idénticas. Fuente: ficha BCRP. Cantidades y organización de bandejas: supuestos de diseño.

## 9. Dudas y decisiones

Se limita el teorema a exponente entero no negativo; no incluye series binomiales infinitas. La investigación de Booth respalda el error distributivo general, no una prevalencia específica del binomio. Falta un recuento de preguntas oficiales recientes. El propietario debe decidir si combinaciones tendrá una recuperación breve o una unidad previa obligatoria.

## 10. Fuentes

- CEPREUNI (2023). *Sílabo del ciclo básico, archivo 2023-2*. [Documento](https://www.cepre.uni.edu.pe/assets/archivos/comunicados/Syl_Bas_PS_2023-2.pdf).
- UNMSM (proceso 2023-I). *Reglamento de admisión*, temario de conocimientos. [Documento](https://medicina.unmsm.edu.pe/wp-content/uploads/2023/02/Reglamento-de-Admision-2023-I.pdf).
- Booth, J. L.; Barbieri, C.; Eyer, F.; Paré-Blagoev, E. J. (2014). *Persistent and Pernicious Errors in Algebraic Problem Solving*. [Original](https://files.eric.ed.gov/fulltext/EJ1059995.pdf).
- Abramson, Jay (autor principal; 2021). *College Algebra 2e*, 9.6, The Binomial Theorem. [OpenStax](https://openstax.org/books/college-algebra-2e/pages/9-6-binomial-theorem).
- BCRP (2021). *Moneda conmemorativa: Toribio Rodríguez de Mendoza*. [Ficha](https://www.bcrp.gob.pe/docs/Billetes-Monedas/Monedas-de-Coleccion/bicentenario-2021/bicentenario-3-trdm.pdf).
