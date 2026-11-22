# AL11 · Álgebra · Inecuaciones

> Parte del documento de ChatGPT de las 32 unidades (21 nov 2026), por verificar. Cómo se leyó la evidencia y el contrato común de las escenas: `docs/investigacion/etapas-9-12/como-leer.md`.


## 1. Resumen en cinco líneas

Una inecuación describe un conjunto de valores, no necesariamente un número.  
Se representan soluciones con intervalos y extremos incluidos o excluidos.  
Se justifican los cambios de sentido al operar con negativos.  
Los productos y cocientes se analizan por signos.  
La dificultad principal es distinguir raíces, puntos prohibidos e intervalos válidos.

## 2. Qué se pregunta en los exámenes

| Tipo | Universidad | Dificultad | Frecuencia | Fuente |
|---|---|---|---|---|
| Inecuaciones lineales y cuadráticas | UNMSM | Media | Temario histórico; no estimada | UNMSM, 15.3 |
| Racionales y análisis del conjunto solución | UNI, CEPREUNI | Alta | Temario de preparación; no estimada | CEPREUNI |
| Interpretar información como $x^2<x$ | UNI | Media | Aparición 2021-1, primera prueba 5; no mide frecuencia global | UNI |

## 3. Errores típicos

| Código | Qué hace | Por qué | Estado | Fuente |
|---|---|---|---|---|
| I-SIG | Conserva el sentido al dividir por negativo | Trata el orden igual que una igualdad | Documentado; causa individual por validar | Booth y otros, 2014, tablas 3–4 |
| I-PUN | Entrega solo las raíces | Confunde límites de intervalos con soluciones | Hipótesis | Diseño propio |
| I-DOM | Incluye un denominador cero o un extremo prohibido | No separa dominio de signo | Hipótesis | Diseño propio |
| I-ORD | Cree que cambiar signos iguala números o impide compararlos | Confunde signo, igualdad y orden | Hipótesis | Diseño propio |

## 4. Lo que la unidad da por sabido

Orden de reales, ecuaciones lineales y cuadráticas, factorización y operaciones con fracciones. Se introduce aquí la notación de intervalos.

## 5. Las ideas, en orden

### Idea 1. Una franja de valores — ¿Qué significa cumplir una desigualdad?

**Aprende:** una solución puede ser un intervalo completo.

**Lee / objeto:** estante con límite de carga, mostrado antes de cualquier recta. «La carga se compara con una capacidad». «La igualdad puede estar permitida o prohibida». «Una condición acepta varios valores».

**Juega:** carga cajas sin superar un máximo visible; el programa valida varias configuraciones. La misión no usa coeficientes negativos.

**Predice:** dos números distintos están ordenados de menor a mayor. Al reemplazarlos por sus opuestos, ¿qué sucede? A) Su orden se invierte **[correcta]**. B) Conservan siempre el orden [I-SIG]. C) Se vuelven iguales por tener ambos el signo cambiado [I-ORD]. D) Ya no pueden compararse porque alguno puede ser negativo [I-ORD].

**Mira:** refleja tarjetas numéricas respecto del cero y muestra su orden.

**La regla:** $x$ es la variable; $a,b$ son constantes. En $ax<b$, si $a>0$, $x<b/a$; si $a<0$, $x>b/a$. Si $a=0$, se decide si $0<b$ es verdadero. Sumar lo mismo conserva el orden. Paréntesis excluye un extremo; corchete lo incluye. El infinito nunca se incluye. «Y» requiere intersección; «o» requiere unión.

**Palabras:** *intervalo*: franja de valores sin saltos; ejemplos: entre dos límites, por debajo de un máximo, por encima de un mínimo. *Extremo*: frontera de la franja; ejemplos: mínimo permitido, máximo excluido, punto de inicio.

**Así se resuelve:** $ax+b<0$: restar $b$, separar los casos del signo de $a$, dividir y expresar la franja. **Ahora tú:** leer intervalos → desigualdad lineal → doble desigualdad y casos con coeficiente cero.

### Idea 2. El signo entre raíces — ¿Por qué no basta resolver la igualdad?

**Aprende:** las raíces separan tramos donde un producto conserva su signo.

**Lee / objeto:** regla de un taller con dos marcas que delimitan posiciones de un deslizador. «Una marca divide el recorrido». «La posición se compara con ambas marcas». «Un producto combina las dos comparaciones».

**Juega:** ubica el deslizador a izquierda, entre y derecha de las marcas; clasifica el signo de cada diferencia por separado. No se muestra el producto.

**Predice:** entre dos marcas distintas, una diferencia es positiva y la otra negativa. ¿Cuál es el resultado de multiplicarlas? A) Un número negativo **[correcta]**. B) Un número positivo [I-SIG]. C) Cero, como si todo el intervalo fuera una raíz [I-PUN]. D) No está definido, aunque no se esté dividiendo [I-DOM].

**Mira:** combina ambas tarjetas de signo y prueba una posición de cada tramo.

**La regla:** $r_1,r_2$ son raíces reales. En $a(x-r_1)(x-r_2)$, con $a\ne0$, se ordenan las raíces, se identifica el signo de cada factor y se multiplican los signos. Una raíz de multiplicidad par no cambia el signo; una impar sí. Las raíces entran solo en desigualdades no estrictas. Si una cuadrática no tiene raíces reales, conserva el signo de su coeficiente principal. No es obligatorio memorizar una alternancia: se comprueba cada tramo.

**Palabras:** *factor*: parte multiplicada; ejemplos: $x-r_1$, $x-r_2$, una constante. *Multiplicidad*: cuántas veces se repite una raíz en los factores; ejemplos: simple, doble, triple.

**Así se resuelve:** factorizar; ordenar raíces; probar un punto por intervalo; seleccionar signos y añadir extremos permitidos. **Ahora tú:** producto de dos factores → cuadrática → raíz doble y productos con más factores.

### Idea 3. Los huecos del dominio — ¿Puede una simplificación recuperar un valor prohibido?

**Aprende:** una fracción exige conservar las exclusiones originales.

**Lee / objeto:** reparto de una jarra entre vasos, con el número de grupos regulable. «Un reparto necesita un divisor permitido». «La misma expresión puede escribirse de varias formas». «La escritura inicial conserva información sobre las restricciones».

**Juega:** distribuye cantidades entre números positivos de grupos y verifica el reparto; no permite divisor cero ni cancelaciones.

**Predice:** si se cancela un factor que era cero en cierto valor, ¿ese valor queda permitido? A) No; sigue excluido **[correcta]**. B) Sí, porque el factor desapareció [I-DOM]. C) Es la única solución [I-PUN]. D) Se permite cambiando el signo de la desigualdad [I-SIG].

**Mira:** muestra el hueco en el dominio aun cuando la expresión simplificada dibuje una línea continua.

**La regla:** $P(x)$ y $Q(x)$ nombran numerador y denominador polinómicos. Para $P(x)/Q(x)\ge0$, primero excluir $Q(x)=0$; luego usar raíces de ambos para separar intervalos y comprobar signos. Se incluyen ceros del numerador solo si el denominador no se anula. Multiplicar por $Q(x)$ sin conocer su signo puede cambiar incorrectamente el sentido. La simplificación conserva equivalencia únicamente en el dominio original.

**Palabras:** *dominio*: entradas que tienen sentido; ejemplos: divisor no nulo, cantidad positiva de grupos, radicando permitido. *Punto prohibido*: entrada excluida aunque parezca útil; ejemplos: denominador cero, factor cancelado que se anulaba, extremo abierto.

**Así se resuelve:** escribir exclusiones; factorizar; construir una tabla conjunta de signos; seleccionar intervalos; comprobar un punto interior y cada frontera. **Ahora tú:** una fracción → cancelación con hueco → sistema de restricciones racionales.

## 6. Letras y símbolos

| Símbolo | Significado | Unidad / advertencia |
|---|---|---|
| $x$ | Variable real | Según contexto |
| $a,b$ | Constantes | Coeficiente y término conocido |
| $r_1,r_2$ | Raíces | No radios |
| $P(x),Q(x)$ | Polinomios numerador y denominador | P no es presión |
| $<,>,\le,\ge$ | Menor, mayor y sus versiones inclusivas | Relaciones |
| $\cap,\cup,\infty$ | Intersección, unión, infinito | No son números de prueba |

## 7. Otras formas de explicarla

Recta con regiones coloreadas: útil para extremos, pero el color no reemplaza la notación. Tabla de signos: útil para productos y cocientes, pero debe conservar raíces repetidas y puntos prohibidos. Una gráfica sirve como comprobación aproximada, no prueba de igualdad en una frontera. Diseños derivados de los procedimientos del temario, no tratamientos empíricamente validados aquí.

## 8. Datos del mundo

La cancha reglamentaria de voleibol mide 18 por 9 metros (FIVB, regla 1.1). Puede servir para una restricción geométrica de ubicación; las zonas de seguridad no se inventarán a partir de esas dimensiones. Los límites de carga del estante del juego son ficticios y no instrucciones de uso de un producto.

## 9. Dudas y decisiones

No incluye programación lineal de dos variables. Evitar una regla universal de «signos alternados»: falla en raíces de multiplicidad par. El nivel de factores debe ajustarse al diagnóstico de factorización. No se confirmó una tasa de errores peruana para estas inecuaciones.

## 10. Fuentes

- UNMSM (proceso 2023-I). *Reglamento de admisión*, 15.3 y 16. [Documento](https://medicina.unmsm.edu.pe/wp-content/uploads/2023/02/Reglamento-de-Admision-2023-I.pdf).
- CEPREUNI (2023). *Sílabo básico 2023-2*, inecuaciones. [Documento](https://www.cepre.uni.edu.pe/assets/archivos/comunicados/Syl_Bas_PS_2023-2.pdf).
- UNI (2021). *Solucionario Admisión 2021-1*, primera prueba 5. [Documento](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario2021.pdf).
- Booth, J. L.; Barbieri, C.; Eyer, F.; Paré-Blagoev, E. J. (2014). *Persistent and Pernicious Errors in Algebraic Problem Solving*. [Original](https://files.eric.ed.gov/fulltext/EJ1059995.pdf).
- FIVB (2025). *Official Volleyball Rules 2025–2028*, regla 1.1. [Documento](https://www.fivb.com/wp-content/uploads/2025/01/FIVB-Volleyball_Rules2025_2028-EN-v05.pdf).
