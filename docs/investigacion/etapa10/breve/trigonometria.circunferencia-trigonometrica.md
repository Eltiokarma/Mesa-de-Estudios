# TR10 · Trigonometría · Circunferencia trigonométrica

> Parte del documento de ChatGPT de las 32 unidades (21 nov 2026), por verificar. Cómo se leyó la evidencia y el contrato común de las escenas: `docs/investigacion/etapas-9-12/como-leer.md`.


## 1. Resumen en cinco líneas

La circunferencia unitaria reúne los valores trigonométricos en una sola representación.  
El radián relaciona longitud de arco y radio.  
Las proyecciones y las intersecciones con tangentes representan las seis razones.  
Los arcos permiten interpretar signos, comparaciones y conjuntos de ángulos.  
Lo más difícil es distinguir una coordenada dirigida de una longitud siempre positiva.

## 2. Qué se pregunta en los exámenes

| Tipo | Universidad | Dificultad | Frecuencia | Fuente |
|---|---|---|---|---|
| Leer seno, coseno y líneas trigonométricas en la circunferencia | CEPRE-UNI | Media | Tema explícito; sin conteo de examen | Sílabo 2023-2, pp. 9–10 del PDF |
| Determinar signos y comparar valores | UNMSM | Media | Tema explícito de circunferencia y razones; sin recuento | Temario 2023-I |
| Combinar posiciones, signos y expresiones algebraicas | UNI | Alta | Transferencia al ítem 17 de Matemática 2021-1; no prueba de frecuencia de gráficos circulares | Solucionario 2021 |

El examen citado no autoriza afirmar que todos estos tipos gráficos aparezcan allí.

## 3. Errores típicos

| Código | Qué hace | Por qué | Estado | Fuente |
|---|---|---|---|---|
| C-RAN | Acepta un coseno mayor que uno | No usa el límite geométrico para controlar la respuesta; interpretación de diseño | Documentado: respuesta fuera de rango en el estudio | Weber, 2005, p. 100 |
| C-NOR | Cree que una rueda más grande produce un seno mayor | Confunde coordenada física y cociente normalizado | Hipótesis | Diseño propio |
| C-NEG | Convierte toda línea trigonométrica en longitud positiva | Omite la dirección de la medida | Hipótesis | Diseño propio |
| C-ARC | Supone que el seno crece siempre que crece el ángulo | Traslada el orden de ángulos al orden de sus senos | Hipótesis específica; Weber investiga la variación, pero no demuestra esta causa | Diseño propio; Weber como contexto |
| C-DIV | Une valores a ambos lados de una división entre cero | Trata una ausencia de valor como un punto ordinario | Hipótesis | Diseño propio |
| C-TAN | Extiende a tangente el intervalo de valores del seno y coseno | Generaliza el rango de unas razones a todas | Hipótesis | Diseño propio |

## 4. Lo que la unidad da por sabido

TR9, coordenadas, proporcionalidad, circunferencia, longitud de arco, intervalos y comparación de números. Los radianes se construyen en la primera idea; no son requisito tácito.

## 5. Las ideas, en orden

### Idea 1. Una escala común — ¿Por qué elegir radio uno?

**Aprende:** normaliza una rueda y relaciona el giro con una medida angular independiente del tamaño.

**Lee / objeto:** dos ruedas de carrito de distinto tamaño sobre una mesa de taller. «Cada rueda tiene un centro y un radio». «Una marca puede recorrer parte del borde». «Podemos comparar recorridos usando una misma escala».

**Juega:** iguala el ángulo de las marcas de ambas ruedas con una plantilla superpuesta; valida coincidencia angular. No muestra aún los cocientes normalizados.

**Predice:** con ambas marcas en el mismo ángulo, ¿qué ocurre al dividir cada altura respecto del centro por su propio radio? A) Se obtienen valores iguales **[correcta]**. B) El mayor corresponde a la rueda más grande [C-NOR]. C) Ambos cocientes necesariamente superan uno [C-RAN]. D) Ambos son positivos aunque la marca esté debajo del centro [C-NEG].

**Mira:** cambia la escala de cada rueda y hace coincidir sus representaciones.

**La regla:** llamar $r$ al radio físico, $s$ a la longitud de arco y $\theta$ al ángulo. Para un recorrido no negativo, $\theta=s/r$ en radianes y $s=r\theta$; los giros dirigidos admiten signo, mientras la longitud física es no negativa. Una vuelta es $2\pi$ radianes y $180^\circ=\pi$ radianes; $\pi$ es la constante de la circunferencia. Al dividir las coordenadas físicas entre $r$, se obtiene el punto normalizado $P=(x,y)$ con $x^2+y^2=1$. En esta escala $x=\cos\theta$ y $y=\sin\theta$. El radio uno es una unidad de la representación, no la afirmación de que toda rueda mide un metro.

**Palabras:** *normalizar*: poner medidas distintas en una escala común; ejemplos: dividir por el radio, comparar por cada kilogramo, expresar por cada cien. *Radián*: medida de giro construida comparando arco y radio; ejemplos: una vuelta de $2\pi$, media vuelta de $\pi$, un arco tan largo como su radio.

**Así se resuelve:** identificar unidad angular; convertir si es necesario; dividir coordenadas por el radio; comprobar pertenencia al círculo unitario; leer seno y coseno. **Ahora tú:** grados y radianes → coordenadas normalizadas → un valor faltante con cuadrante que decide el signo.

### Idea 2. Seis lecturas — ¿Dónde están las razones que pueden superar uno?

**Aprende:** relaciona proyecciones y tangentes con los cocientes trigonométricos.

**Lee / objeto:** rueda y dos reglas de taller que tocan su borde en la derecha y arriba. «Una regla puede tocar la circunferencia en un solo punto». «Prolongaremos la dirección de la marca». «Las lecturas conservarán el signo».

**Juega:** en el primer cuadrante, mueve la marca hasta que la intersección de su recta con la regla vertical alcance una señal dada; valida la coordenada. No muestra el caso en que esa recta es paralela a la regla.

**Predice:** cuando la dirección de la marca queda exactamente vertical, ¿qué pasa con su intersección con la regla vertical de la derecha? A) No existe: las rectas son paralelas distintas **[correcta]**. B) Coinciden en una lectura cero [C-DIV]. C) Hay un punto real de coordenada «infinito» [C-DIV]. D) La lectura debe quedar entre menos uno y uno por estar cerca de un círculo [C-TAN].

**Mira:** aproxima por ambos lados y, en la posición exacta, retira el punto de intersección; no dibuja un punto en infinito.

**La regla:** en $P=(x,y)$, seno es $y$ y coseno es $x$. La recta por el origen y $P$ corta la tangente vertical de ecuación $x=1$ en un punto cuya coordenada vertical es $\tan\theta=y/x$, si $x\ne0$. El factor dirigido que multiplica el vector unitario de $P$ para llegar a esa intersección es $\sec\theta=1/x$; su signo puede ser negativo y su distancia física es el valor absoluto. De modo análogo, en la tangente horizontal $y=1$, la coordenada horizontal de la intersección es $\cot\theta=x/y$ y el factor dirigido es $\csc\theta=1/y$, si $y\ne0$. Usar la recta completa, no solo la semirrecta, cuando la intersección queda en sentido opuesto. Seno y coseno están entre $-1$ y $1$; tangente y cotangente pueden tomar cualquier valor real; secante y cosecante tienen valor absoluto al menos uno. Las igualdades $1+\tan^2\theta=\sec^2\theta$ y $1+\cot^2\theta=\csc^2\theta$ se deducen dividiendo $x^2+y^2=1$ por $x^2$ o por $y^2$, con las restricciones respectivas.

**Palabras:** *tangente geométrica*: recta que toca la circunferencia sin atravesarla; ejemplos: regla vertical derecha, regla horizontal superior, línea de apoyo de una rueda ideal. *Medida dirigida*: lectura que conserva hacia qué lado se avanza; ejemplos: altura negativa, avance positivo, factor negativo en la recta del radio.

**Así se resuelve:** ubicar la razón solicitada; construir proyección o intersección; comprobar si existe; conservar el signo; usar una identidad si falta una lectura. **Ahora tú:** identificar líneas → valores fuera del intervalo del seno → razón desconocida y restricciones.

### Idea 3. Un arco como respuesta — ¿Qué posiciones cumplen una condición?

**Aprende:** interpreta comparaciones trigonométricas como conjuntos de posiciones.

**Lee / objeto:** reflector adhesivo en una rueda de bicicleta y una franja horizontal de altura permitida. «La marca puede pasar por una zona permitida». «Los bordes de la zona también necesitan una regla». «Podemos registrar todos los giros de una vuelta que cumplen».

**Juega:** delimita las posiciones de la mitad superior, con el borde incluido; valida la selección completa. No muestra una franja estrictamente por encima de un nivel interior positivo.

**Predice:** si ahora se exige quedar estrictamente por encima de una línea interior situada sobre el centro, ¿qué posiciones sirven durante una vuelta? A) Un arco superior entre dos cruces, sin incluir los cruces **[correcta]**. B) Todo el semicírculo superior [C-ARC]. C) Solo la posición final, porque tiene el mayor ángulo [C-ARC]. D) Los cruces y ningún punto intermedio [C-ARC].

**Mira:** recorre la vuelta completa, compara altura y marca el arco y sus extremos.

**La regla:** para comparar senos se comparan coordenadas verticales; para cosenos, horizontales. Llamar $c$ al nivel de comparación, un número real dado. Para $\sin\theta>c$ con $-1<c<1$, encontrar los cruces de la horizontal $y=c$ y seleccionar los arcos superiores a ella; los cruces se incluyen solo si la desigualdad lo permite. Se procede análogamente con coseno y rectas verticales. Si $c$ está fuera de $[-1,1]$, comprobar si la condición es imposible o universal; los extremos $c=1$ y $c=-1$ se revisan por separado. Para tangente o cocientes, excluir primero denominadores nulos y separar las ramas. Las condiciones simultáneas requieren la intersección de los arcos; las alternativas, su unión. Expresar ángulos en el intervalo pedido y repetir con $2\pi k$ únicamente si se solicitan todas las vueltas, siendo $k$ entero. Los ángulos frontera se proporcionan o se obtienen de razones conocidas: aún no se necesitan funciones inversas.

**Palabras:** *arco permitido*: parte del recorrido que cumple una condición; ejemplos: encima de una línea, a la izquierda de un nivel, dentro de dos restricciones. *Extremo*: lugar donde comienza o acaba un intervalo; ejemplos: cruce incluido, cruce excluido, inicio de una vuelta.

**Así se resuelve:** traducir condición a posición; hallar fronteras dadas; probar un punto de cada arco; decidir extremos; intersectar condiciones y restringir a la vuelta solicitada. **Ahora tú:** signo → comparación con valor notable → dos restricciones y extremos abiertos o cerrados.

## 6. Letras y símbolos

| Letra o símbolo | Significado | Unidad |
|---|---|---|
| $r,s$ | Radio físico y longitud de arco | Misma unidad de longitud |
| $\theta$ | Ángulo dirigido | Radianes, salvo grados explícitos |
| $P$ | Punto de la circunferencia unitaria | No corresponde |
| $x,y$ | Coordenadas normalizadas | Sin unidad |
| $c$ | Nivel real para comparar | Sin unidad |
| $k$ | Entero que cuenta vueltas completas | Sin unidad |
| $\pi$ | Constante de la circunferencia | Sin unidad |
| $\sin,\cos,\tan,\cot,\sec,\csc$ | Las seis razones trigonométricas | Sin unidad |
| $\cap,\cup$ | Intersección y unión de conjuntos | No corresponde |

No usar $s$ para seno ni $c$ para coseno. Las coordenadas físicas previas a normalizar se describen con palabras; $x,y$ quedan reservadas a las normalizadas.

## 7. Otras formas de explicarla

| Representación | Para qué | Riesgo y control |
|---|---|---|
| Ruedas de diferente tamaño | Normalización y radián | Creer que la razón depende del tamaño: comparar cocientes |
| Proyecciones de un punto móvil, como en OpenStax | Seno y coseno | Confundir proyección con arco: usar trazos diferentes |
| Reglas tangentes y recta completa | Tangente, secante y recíprocas | Confundir distancia y factor dirigido: conservar signo y mostrar prolongación |

## 8. Datos del mundo

La ficha BCRP de la moneda de Toribio Rodríguez de Mendoza registra diámetro de 25,50 mm. Puede servir de objeto circular pequeño para fotografiar una marca y luego normalizar su representación. Una fotografía oblicua deforma el círculo: la actividad requiere vista frontal. Los tamaños de ruedas del juego se rotulan «medidas elegidas para el modelo».

## 9. Dudas y decisiones

Se incluyen las seis líneas porque aparecen en el sílabo CEPRE-UNI. Las desigualdades son elementales y se resuelven visualmente; las ecuaciones generales se amplían en TR12. No se presupone que toda representación histórica de secante use la misma convención de segmento dirigido: la app declarará la suya.

## 10. Fuentes

- CEPRE-UNI (2023). *Sílabo del ciclo básico 2023-2*, circunferencia y líneas trigonométricas. [PDF](https://www.cepre.uni.edu.pe/assets/archivos/comunicados/Syl_Bas_PS_2023-2.pdf).
- UNMSM (2023). *Reglamento de admisión 2023-I*, temario de Trigonometría. [PDF](https://medicina.unmsm.edu.pe/wp-content/uploads/2023/02/Reglamento-de-Admision-2023-I.pdf).
- UNI, Oficina Central de Admisión (2021; archivo publicado en 2022). *Solucionario del examen de admisión 2021*. [PDF](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario2021.pdf).
- Weber, Keith (2005). *Students' Understanding of Trigonometric Functions*. Mathematics Education Research Journal, 17(3), 91–112. [Original](https://files.eric.ed.gov/fulltext/EJ747914.pdf).
- Abramson, Jay (2021). *Precalculus 2e*, §5.2. OpenStax. [Fuente](https://openstax.org/books/precalculus-2e/pages/5-2-unit-circle-sine-and-cosine-functions).
- BCRP (2021). *Bicentenario 1821–2021: Toribio Rodríguez de Mendoza*. [Ficha](https://www.bcrp.gob.pe/docs/Billetes-Monedas/Monedas-de-Coleccion/bicentenario-2021/bicentenario-3-trdm.pdf).
