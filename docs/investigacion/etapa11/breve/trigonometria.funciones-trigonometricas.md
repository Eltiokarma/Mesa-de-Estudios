# TR11 · Trigonometría · Funciones trigonométricas

> Parte del documento de ChatGPT de las 32 unidades (21 nov 2026), por verificar. Cómo se leyó la evidencia y el contrato común de las escenas: `docs/investigacion/etapas-9-12/como-leer.md`.


## 1. Resumen en cinco líneas

Una función trigonométrica asigna una salida a cada entrada permitida.  
Las gráficas muestran variación, repetición, extremos y ausencia de valores.  
Amplitud, desplazamiento y periodo describen transformaciones diferentes.  
Los denominadores y las restricciones del problema determinan el dominio.  
Lo más difícil es distinguir el movimiento circular del gráfico de sus lecturas.

## 2. Qué se pregunta en los exámenes

| Tipo | Universidad | Dificultad | Frecuencia | Fuente |
|---|---|---|---|---|
| Dominio, rango, periodo y gráfica de las seis funciones | CEPRE-UNI | Media/alta | Temario explícito; sin recuento | Sílabo 2023-2, pp. 10–11 del PDF |
| Parámetros en funciones transformadas | CEPRE-UNI | Alta | Temario explícito | Sílabo, funciones generalizadas |
| Funciones trigonométricas y sus propiedades | UNMSM | Media/alta | Temario histórico, apartado 25 | Reglamento 2023-I |
| Rangos de expresiones compuestas y restricciones | Preparación transversal | Alta | Propuesta de transferencia; no incidencia medida | Diseño basado en los contenidos citados |
| Funciones trigonométricas: dominio, rango y gráfica | UNSA | Media/alta, valoración de diseño | Inclusión en temario de admisión 2027; no frecuencia de examen | RCU 0028-2026, contenido indexado del PDF oficial |

No se identificó en el examen UNI 2021-1 un conjunto suficiente para ordenar estos tipos por frecuencia.

## 3. Errores típicos

| Código | Qué hace | Por qué | Estado | Fuente |
|---|---|---|---|---|
| F-UNI | No explica por qué un ángulo tiene un único seno | Conocimiento de procedimientos poco conectado con la asignación entrada–salida | Documentado en entrevistas; no conclusión sobre todo alumno | Weber, 2005, pp. 101–102 |
| F-RAN | Admite seno o coseno fuera de su rango | No controla la respuesta con la representación | Documentado en respuestas del estudio | Weber, 2005, p. 100 |
| F-PAR | Confunde cambio vertical, amplitud y periodo | Trata todos los parámetros como cambios de tamaño | Hipótesis | Diseño propio |
| F-DOM | Rellena discontinuidades de una razón con denominador cero | Lee la gráfica como un trazo que siempre debe continuar | Hipótesis | Diseño propio |
| F-DEP | Elige por separado valores incompatibles de una misma entrada | Ignora dependencia entre términos de una expresión | Hipótesis | Diseño propio |

## 4. Lo que la unidad da por sabido

TR10, función, dominio, rango, intervalos, operaciones con reales y transformación de expresiones. Para el último nivel: máximo y mínimo de una cuadrática en un intervalo, con repaso disponible desde Álgebra. No se necesitan derivadas.

## 5. Las ideas, en orden

### Idea 1. Registrar una vuelta — ¿Cómo nace una gráfica?

**Aprende:** construye una curva a partir de pares de entrada angular y salida.

**Lee / objeto:** rueda de bicicleta junto a una cinta donde se anotan lecturas. «Registraremos una lectura por cada giro elegido». «La entrada será el ángulo». «La cinta conservará el orden de esas entradas».

**Juega:** coloca las lecturas de una media vuelta en sus casillas correspondientes; valida cada par con el punto de la rueda. No muestra la segunda mitad ni la repetición.

**Predice:** si una misma altura aparece en dos posiciones diferentes, ¿deja el seno de ser función? A) No; cada entrada sigue teniendo una sola salida **[correcta]**. B) Sí, toda salida debe corresponder a una sola entrada [F-UNI]. C) Sí, una entrada recibe todas las alturas de la vuelta [F-UNI]. D) Para evitar repetir alturas, el seno debe superar uno [F-RAN].

**Mira:** señala dos entradas distintas y una salida compartida, sin asignar dos salidas a la misma entrada.

**La regla:** llamar $x$ a la entrada angular real, medida en radianes, y $f(x)$ a la salida de la función. Para $f(x)=\sin x$ y $f(x)=\cos x$, el dominio es $\mathbb R$, conjunto de los reales, y el rango es $[-1,1]$. Ambas tienen periodo fundamental $2\pi$: es el menor desplazamiento positivo que repite todos sus valores. El seno es impar y el coseno par: $\sin(-x)=-\sin x$, $\cos(-x)=\cos x$. Si $k$ es entero, los ceros del seno son $k\pi$; sus máximos se alcanzan en $\pi/2+2k\pi$ y sus mínimos en $3\pi/2+2k\pi$. Los ceros del coseno son $\pi/2+k\pi$; sus máximos se alcanzan en $2k\pi$ y sus mínimos en $\pi+2k\pi$. El seno crece entre $-\pi/2+2k\pi$ y $\pi/2+2k\pi$ y decrece entre $\pi/2+2k\pi$ y $3\pi/2+2k\pi$; el coseno decrece entre $2k\pi$ y $\pi+2k\pi$ y crece entre $\pi+2k\pi$ y $2\pi+2k\pi$. Estas variaciones se leen en las proyecciones del círculo.

**Palabras:** *función*: regla que da una sola salida para cada entrada permitida; ejemplos: seno de un ángulo, precio de un peso dado con tarifa fija, altura modelada en un instante. *Periodo*: separación de entrada después de la cual se repite todo el comportamiento; ejemplos: una vuelta del seno, una vuelta del coseno, media vuelta de la tangente.

**Así se resuelve:** identificar entrada y salida; ubicar puntos de control; seguir la variación; repetir el patrón; leer ceros, extremos y tramos. **Ahora tú:** lectura de puntos → intervalos de crecimiento → propiedades simultáneas sin confundir función e inyectividad.

### Idea 2. Cambiar la oscilación — ¿Qué modifica cada parámetro?

**Aprende:** separa cambios verticales de cambios en la escala y el inicio angular.

**Lee / objeto:** mecanismo de manivela ideal que mueve una marca de arriba abajo, acompañado de su registro. «La marca tiene un nivel medio». «Su recorrido puede ser más ancho». «El registro también puede comenzar en otra posición del giro».

**Juega:** ajusta solo desplazamiento vertical y amplitud para alcanzar dos niveles objetivo; valida máximo y mínimo. Mantiene fija la escala horizontal.

**Predice:** si el registro completa dos ciclos en el intervalo antes ocupado por uno, conservando sus niveles máximo y mínimo, ¿qué cambió? A) El periodo se redujo a la mitad **[correcta]**. B) La amplitud se duplicó [F-PAR]. C) El nivel medio se duplicó [F-PAR]. D) El seno dejó de tener una única salida por entrada [F-UNI].

**Mira:** compara ciclos y mantiene las líneas de altura máxima y mínima.

**La regla:** en $f(x)=D+A\sin(Bx+C)$, o con coseno, $A$ es el coeficiente vertical, $B$ la escala angular, $C$ la fase dentro del argumento y $D$ el desplazamiento vertical. Para $A\ne0$ y $B\ne0$, la amplitud es $\lvert A\rvert$, el rango $[D-\lvert A\rvert,D+\lvert A\rvert]$, el periodo fundamental $2\pi/\lvert B\rvert$ y el desplazamiento horizontal $-C/B$, porque $Bx+C=B(x+C/B)$. Un $A$ negativo refleja respecto del nivel medio; no es una amplitud negativa. Los extremos y ceros se hallan imponiendo al argumento los valores correspondientes y resolviendo para $x$, dentro del dominio pedido. Si $A=0$ o $B=0$, la función es constante y no tiene un menor periodo positivo. Para un intervalo restringido de entrada, no suponer que alcanza todo el rango de la función completa: comprobar extremos disponibles y fronteras.

**Palabras:** *amplitud*: distancia del nivel medio a un extremo; ejemplos: recorrido superior, recorrido inferior, mitad del recorrido total. *Fase*: ubicación inicial dentro del ciclo; ejemplos: comenzar en el máximo, comenzar en el nivel medio, comenzar mientras desciende.

**Así se resuelve:** identificar los cuatro parámetros; completar el argumento para leer desplazamiento; obtener periodo y niveles; situar un ciclo; restringir la entrada. **Ahora tú:** amplitud y nivel → periodo y desplazamiento → reconstruir una expresión compatible con una gráfica y su intervalo.

### Idea 3. Valores que no existen — ¿Por qué algunas curvas se separan en ramas?

**Aprende:** determina dominios y rangos de funciones cociente y recíprocas.

**Lee / objeto:** rueda con regla tangente y un cuaderno de mediciones. «Algunas posiciones no producen una intersección». «Registraremos esa ausencia». «Un trazo del gráfico debe respetar las posiciones admitidas».

**Juega:** completa lecturas de tangente en una rama alejada de la dirección vertical; valida cada cociente. No permite atravesar todavía la posición excluida.

**Predice:** al continuar el registro hasta una entrada donde el coseno es cero, ¿qué debe anotarse para la tangente? A) Esa entrada queda fuera del dominio **[correcta]**. B) Cero, para unir las ramas [F-DOM]. C) Uno, porque todos los valores trigonométricos están entre menos uno y uno [F-RAN]. D) Un número real infinito que pertenece al rango [F-DOM].

**Mira:** detiene la evaluación en la entrada excluida y muestra acercamientos laterales separados.

**La regla:** $\tan x=\sin x/\cos x$ y $\sec x=1/\cos x$ excluyen $x=\pi/2+k\pi$. La cotangente $\cot x=\cos x/\sin x$ y la cosecante $\csc x=1/\sin x$ excluyen $x=k\pi$. Tangente y cotangente tienen rango real y periodo fundamental $\pi$; secante y cosecante tienen rango $(-\infty,-1]\cup[1,\infty)$ y periodo $2\pi$. Tangente, cotangente y cosecante son impares; secante es par. Cada rama de tangente es creciente y cada rama de cotangente decreciente. Las asíntotas verticales corresponden a los valores excluidos en estas funciones básicas. Para transformaciones con $A$ y $B$ no nulos, exigir que $Bx+C$ evite esas entradas; el periodo se divide entre $\lvert B\rvert$ y la salida se transforma por $A$ y $D$, con casos degenerados revisados aparte. Si $A=0$, se conservan las exclusiones de la expresión original; multiplicar por cero no define una razón inexistente. Si $B=0$, la expresión es constante solo cuando la función interior existe en $C$; en caso contrario, su dominio es vacío. Para rango de una expresión compuesta, no elegir valores independientes de $\sin x$ y $\cos x$ si comparten entrada. Si se introduce $u=\sin x$ para reducir a una expresión algebraica, $u$ conserva el intervalo permitido y se optimiza allí.

**Palabras:** *dominio*: entradas que se pueden usar; ejemplos: ángulos sin denominador cero, tiempos del modelo, intervalo pedido. *Asíntota*: línea a la que la curva se acerca sin que eso cree un valor en el punto excluido; ejemplos: rama derecha de tangente, rama izquierda de cotangente, crecimiento de secante cerca de su exclusión.

**Así se resuelve:** escribir restricciones antes de simplificar; resolver entradas excluidas; estudiar una rama o intervalo; hallar salidas posibles conservando dependencias; comparar con las condiciones del problema. **Ahora tú:** dominio básico → transformación de tangente o secante → rango de una expresión cuadrática en seno con intervalo dado.

## 6. Letras y símbolos

| Letra o símbolo | Significado | Unidad |
|---|---|---|
| $x$ | Entrada angular | Radianes; no coordenada horizontal del círculo |
| $f,f(x)$ | Función y su salida | Sin unidad en ejercicios abstractos; declarada en modelos |
| $A,D$ | Coeficiente vertical y desplazamiento vertical | Unidad de la salida |
| $B$ | Factor que escala la entrada angular | Sin unidad si la entrada es angular |
| $C$ | Fase dentro del argumento | Radianes |
| $k$ | Entero para describir repeticiones | Sin unidad |
| $u$ | Variable auxiliar que representa $\sin x$ | Sin unidad |
| $\mathbb R,\infty$ | Reales e indicador de falta de cota | No son unidades; infinito no es un número real |
| $\lvert\cdot\rvert$ | Valor absoluto | La de su argumento |

$A$ no significa área y $D$ no abrevia dominio. El periodo se escribe en palabras en vez de reutilizar una letra del modelo. Las seis funciones mantienen los nombres declarados en TR9.

## 7. Otras formas de explicarla

| Recurso | Para qué | Riesgo y control |
|---|---|---|
| Registrar proyecciones de una rueda, como propone OpenStax | Construcción de seno y coseno | Creer que la curva es la trayectoria de la marca: separar rueda y registro |
| Deslizadores de un parámetro por vez; propuesta propia | Transformaciones | Confundir efectos simultáneos: bloquear los otros parámetros al inicio |
| Tabla con entradas excluidas antes del gráfico | Dominios de cocientes | Convertir asíntotas en valores: distinguir acercamiento y evaluación |

## 8. Datos del mundo

Puede usarse una moneda peruana como disco circular de referencia: BCRP, ficha 2021, diámetro 25,50 mm. No se atribuye una velocidad de rotación medida a esa moneda. Periodos, dimensiones de manivela y recorridos verticales del juego son datos sintéticos, declarados y compatibles con el mecanismo ideal.

## 9. Dudas y decisiones

El sílabo CEPRE-UNI también enumera verso, coverso y exsecante. Se incluyen como glosario de transferencia, no como funciones para memorizar: verso es $1-\cos x$, coverso $1-\sin x$ y exsecante $\sec x-1$; sus propiedades se deducen con las ideas 2 y 3. El dueño debe decidir si desea una práctica extra con esos nombres para UNI. Las transformaciones dependientes del tiempo requieren declarar unidades nuevas; no se introducen silenciosamente aquí.

## 10. Fuentes

- CEPRE-UNI (2023). *Sílabo del ciclo básico 2023-2*, funciones, gráficas y funciones auxiliares. [PDF](https://www.cepre.uni.edu.pe/assets/archivos/comunicados/Syl_Bas_PS_2023-2.pdf).
- UNMSM (2023). *Reglamento de admisión 2023-I*, Trigonometría. [PDF](https://medicina.unmsm.edu.pe/wp-content/uploads/2023/02/Reglamento-de-Admision-2023-I.pdf).
- UNI, Oficina Central de Admisión (2021; archivo publicado en 2022). *Solucionario del examen de admisión 2021*. [PDF](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario2021.pdf).
- Weber, Keith (2005). *Students' Understanding of Trigonometric Functions*. Mathematics Education Research Journal, 17(3), 91–112. [Original](https://files.eric.ed.gov/fulltext/EJ747914.pdf).
- Abramson, Jay (2021). *Precalculus 2e*, §6.1. OpenStax. [Gráficas de seno y coseno](https://openstax.org/books/precalculus-2e/pages/6-1-graphs-of-the-sine-and-cosine-functions).
- BCRP (2021). *Bicentenario 1821–2021: Toribio Rodríguez de Mendoza*. [Ficha](https://www.bcrp.gob.pe/docs/Billetes-Monedas/Monedas-de-Coleccion/bicentenario-2021/bicentenario-3-trdm.pdf).

---


- UNSA, Consejo Universitario (2026). *RCU 0028-2026: Temario y matriz de evaluación de admisión 2027*, Trigonometría. [PDF oficial](https://admision.unsa.edu.pe/wp-content/uploads/2026/03/RCU-0028-Aprobacion-de-TEMARIO-y-MATRIZ-ADMISION-2027.pdf). Se confirmó la inclusión mediante el contenido indexado; el visor no devolvió texto del PDF.
