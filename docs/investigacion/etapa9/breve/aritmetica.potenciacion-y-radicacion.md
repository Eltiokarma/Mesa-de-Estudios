# AR9 · Aritmética · Potenciación y radicación

> Parte del documento de ChatGPT de las 32 unidades (21 nov 2026), por verificar. Cómo se leyó la evidencia y el contrato común de las escenas: `docs/investigacion/etapas-9-12/como-leer.md`.


## 1. Resumen en cinco líneas

La potencia representa multiplicación repetida y sus extensiones coherentes.  
El exponente cero y el negativo se explican con cocientes.  
La raíz principal se diferencia de las soluciones de una ecuación.  
Los exponentes racionales reúnen potencias y raíces bajo condiciones de existencia.  
Lo más difícil es conservar signos, paréntesis y dominio.

## 2. Qué se pregunta en los exámenes

| Tipo | Universidad | Dificultad | Frecuencia | Fuente |
|---|---|---|---|---|
| Operar potencias y raíces en naturales y reales | UNMSM | Media | Temario histórico; no estimada | UNMSM, 2.2 y 5.1 |
| Interpretar potencias en numeración posicional | UNI | Media | Aparición 2021-1, Matemática 3; aplicación, no prueba aislada de leyes | UNI |
| Simplificar exponentes y radicales con restricciones | UNI, CEPREUNI | Media/alta | Preparación curricular; no estimada | CEPREUNI |

## 3. Errores típicos

| Código | Qué hace | Por qué | Estado | Fuente |
|---|---|---|---|---|
| P-NEG | Interpreta un exponente negativo como resultado negativo | Confunde inverso multiplicativo y opuesto; explicación propuesta en el resumen | De segunda mano | Cangelosi y otros, 2013, registro ERIC |
| P-SUM | Distribuye potencias o raíces sobre sumas | Extiende una propiedad de productos a otra operación | Hipótesis específica | Diseño propio |
| P-RAI | Da dos valores a una raíz principal o ignora su dominio | Mezcla operación y ecuación | Hipótesis | Diseño propio |
| P-EXP | Asigna cero a todo exponente inferior a cero | Confunde el exponente con el valor de la potencia | Hipótesis | Diseño propio |

## 4. Lo que la unidad da por sabido

Productos, cocientes, fracciones, orden, signos y paréntesis. Se recupera primero la prioridad de operaciones si falta.

## 5. Las ideas, en orden

### Idea 1. Multiplicar otra vez — ¿Qué cuenta el exponente?

**Aprende:** la base se repite como factor, no como sumando.

**Lee / objeto:** cajones iguales de una tienda apilados en capas. «Cada nivel agrupa unidades». «Una etiqueta indica el tamaño de cada agrupación». «Agrupar y sumar son operaciones distintas».

**Juega:** construye dos niveles de agrupación con igual cantidad de unidades por grupo; valida el total contando objetos. Los exponentes negativos están bloqueados.

**Predice:** se continúa bajando el exponente de una base positiva distinta de uno, dividiendo por esa base en cada paso. ¿Qué tipo de valor corresponde a un exponente negativo? A) Un único valor positivo **[correcta]**. B) Un valor negativo por el signo del exponente [P-NEG]. C) Cero, porque ya se pasó del exponente cero [P-EXP]. D) Dos valores opuestos, como si se estuviera resolviendo una ecuación cuadrática [P-RAI].

**Mira:** extiende el patrón de cocientes a cero y a exponentes negativos.

**La regla:** $a$ es base; $m,n$ son exponentes enteros. Para $n>0$, $a^n$ multiplica $n$ factores. Si $a\ne0$, $a^0=1$ y $a^{-n}=1/a^n$. Se cumple $a^ma^n=a^{m+n}$, $a^m/a^n=a^{m-n}$ con denominador no nulo, $(a^m)^n=a^{mn}$, $(ab)^n=a^nb^n$ donde existan las expresiones. No se distribuye sobre sumas. Una base negativa entre paréntesis tiene signo según la paridad; $-a^2$ significa el opuesto de $a^2$. No se asigna valor a $0^0$ en esta unidad.

**Palabras:** *base*: cantidad que se repite; ejemplos: dos unidades, tres factores iguales, una fracción repetida. *Exponente*: contador de factores y su extensión; ejemplos: positivo, cero, negativo.

**Así se resuelve:** $a^m/a^n$, con $a\ne0$: cancelar factores comunes; si sobran abajo, escribir su recíproco; expresar con $m-n$. **Ahora tú:** significado → leyes combinadas → signos y paréntesis.

### Idea 2. Reconstruir una medida — ¿La raíz tiene uno o dos resultados?

**Aprende:** la raíz principal es una operación con una convención precisa.

**Lee / objeto:** baldosa cuadrada y caja cúbica, mostradas físicamente. «Un lado determina una superficie». «Una arista determina un volumen». «La operación de regreso busca la medida».

**Juega:** ajusta una arista positiva hasta obtener un volumen objetivo; solo muestra entradas positivas.

**Predice:** para una raíz de índice impar y una entrada negativa, ¿qué resultado real corresponde? A) Un único número negativo **[correcta]**. B) Un único número positivo, ignorando el signo [P-RAI]. C) Dos números opuestos [P-RAI]. D) Ningún número real, aplicando la restricción de las raíces pares [P-RAI].

**Mira:** representa cubos numéricos con signo mediante valores dirigidos, aclarando que una caja física no tiene volumen negativo.

**La regla:** $r$ es índice entero positivo de la raíz. Si $r$ es par, $\sqrt[r]{a}$ existe en reales para $a\ge0$ y es no negativa; si es impar, existe para todo real y conserva su signo. Para índice par, $\sqrt[r]{a^r}=\vert a\vert$; para impar, vale $a$. El símbolo de raíz principal no incluye «más o menos»: esa doble posibilidad pertenece a ciertas ecuaciones. Las raíces de productos se separan solo bajo condiciones reales válidas; en índice par, usar factores no negativos.

**Palabras:** *índice*: grado de la raíz; ejemplos: cuadrada, cúbica, cuarta. *Principal*: valor elegido por convención; ejemplos: raíz cuadrada no negativa, raíz cuarta no negativa, raíz cúbica única.

**Así se resuelve:** separar de un radicando un factor que sea potencia $r$-ésima; extraerlo con la condición de signo; conservar el resto dentro; verificar elevando. **Ahora tú:** existencia → extracción → radicales con variable y valor absoluto.

### Idea 3. Una misma operación escrita de dos maneras — ¿Cuándo sirve un exponente fraccionario?

**Aprende:** conecta exponente racional y raíz sin perder restricciones.

**Lee / objeto:** ficha de una maqueta cuya escala aparece en dos formatos equivalentes. «Dos etiquetas pueden describir la misma operación». «La entrada permitida importa». «Comparar exige una base común».

**Juega:** empareja potencias enteras con productos repetidos; la misión verifica todas las parejas. Los exponentes fraccionarios permanecen ocultos.

**Predice:** ¿sumar las raíces cuadradas de dos números positivos distintos garantiza obtener la raíz cuadrada de su suma? A) No **[correcta]**. B) Sí, porque la raíz se distribuye sobre toda suma [P-SUM]. C) Sí, siempre que los dos números sean positivos [P-SUM]. D) Sí, siempre que los dos números sean distintos [P-SUM].

**Mira:** compara áreas de cuadrados separados y del cuadrado construido con la suma de sus lados; muestra el término adicional, sin reutilizar un problema de texto.

**La regla:** para $a>0$, $a^{m/r}=\sqrt[r]{a^m}$, con $m$ entero y $r$ entero positivo. Para base cero se requiere exponente positivo. Para base negativa, reducir primero la fracción: se admite denominador impar en la interpretación real adoptada, y no se trasladan todas las leyes sin comprobar dominio. Para racionalizar un denominador cuadrático se multiplica numerador y denominador por su conjugado: $(u+v)(u-v)=u^2-v^2$, siendo $u,v$ los términos del par. Se conserva la condición de denominador no nulo.

**Palabras:** *recíproco*: número que al multiplicar devuelve uno; ejemplos: uno entre dos, uno entre una potencia, inverso de una fracción no nula. *Conjugado*: pareja con el signo intermedio cambiado; ejemplos: suma/resta de dos raíces, número más/menos raíz, dos términos opuestos en el centro.

**Así se resuelve:** pasar a exponentes racionales con base positiva; combinar exponentes de bases iguales; devolver a raíz si ayuda; comprobar denominadores. **Ahora tú:** conversión → comparación con base común → racionalización y simplificación con dominio.

## 6. Letras y símbolos

| Símbolo | Significado | Unidad / advertencia |
|---|---|---|
| $a,b$ | Bases o factores numéricos | Sin unidad |
| $m,n$ | Exponentes enteros | Sin unidad |
| $r$ | Índice de raíz | No radio |
| $u,v$ | Términos de un par conjugado | Sin unidad |
| $\sqrt[r]{}, \vert,\vert,\ne$ | Raíz, valor absoluto, distinto | Operadores |

## 7. Otras formas de explicarla

Agrupaciones anidadas explican exponentes positivos, pero no deben dibujarse «cajas negativas». Área y volumen explican raíces de índices dos y tres, no todos los índices como dimensiones físicas. Una escalera de cocientes justifica exponentes cero y negativos; necesita base no nula. Apoyo matemático: Abramson, 1.3.

## 8. Datos del mundo

La constante de Avogadro tiene valor exacto $6,02214076\times10^{23}\ \mathrm{mol}^{-1}$, según BIPM. Aquí solo sirve como ejemplo auténtico de potencia decimal; no se exige entender el mol antes de estudiarlo en Química. Las agrupaciones comerciales son ficticias.

## 9. Dudas y decisiones

Se excluyen potencias complejas y una construcción formal del exponente irracional. La referencia de Cangelosi se leyó a través de un registro bibliográfico, no se presenta como lectura del artículo completo. Conviene usar bases positivas al iniciar exponentes racionales y reservar bases negativas para el tramo avanzado.

## 10. Fuentes

- UNMSM (proceso 2023-I). *Reglamento de admisión*, Aritmética. [Documento](https://medicina.unmsm.edu.pe/wp-content/uploads/2023/02/Reglamento-de-Admision-2023-I.pdf).
- UNI (2021). *Solucionario Admisión 2021-1*. [Documento](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario2021.pdf).
- CEPREUNI (2023). *Sílabo básico 2023-2*. [Documento](https://www.cepre.uni.edu.pe/assets/archivos/comunicados/Syl_Bas_PS_2023-2.pdf).
- Cangelosi, R.; Madrid, S.; Cooper, S.; Olson, J.; Hartter, B. (2013). *The Negative Sign and Exponential Expressions: Unveiling Students’ Persistent Errors and Misconceptions*. [Registro ERIC, acceso indirecto](https://eric.ed.gov/?id=EJ995569).
- Abramson, Jay (autor principal; 2021). *College Algebra 2e*, 1.3. [OpenStax](https://openstax.org/books/college-algebra-2e/pages/1-3-radicals-and-rational-exponents).
- BIPM (s. f.; consulta 2026). *SI defining constants*. [Fuente oficial](https://www.bipm.org/en/measurement-units/si-defining-constants).
