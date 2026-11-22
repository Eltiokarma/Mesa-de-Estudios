# TR12 · Trigonometría · Funciones trigonométricas inversas

> Parte del documento de ChatGPT de las 32 unidades (21 nov 2026), por verificar. Cómo se leyó la evidencia y el contrato común de las escenas: `docs/investigacion/etapas-9-12/como-leer.md`.


## 1. Resumen en cinco líneas

Una inversa trigonométrica devuelve un ángulo principal a partir de una razón.  
Restringir una rama evita que una entrada produzca muchas respuestas.  
Componer una función con su inversa exige respetar dominios e intervalos principales.  
Resolver una ecuación trigonométrica requiere recuperar también las otras soluciones.  
Lo más difícil es distinguir inversa, recíproca y conjunto completo de ángulos.

## 2. Qué se pregunta en los exámenes

| Tipo | Universidad | Dificultad | Frecuencia | Fuente |
|---|---|---|---|---|
| Composición de arco seno y arco coseno con ángulos restringidos | UNI | Alta | Un caso identificado: Matemática 19, 2021-1 | Solucionario, p. 21 del PDF |
| Dominios, rangos y gráficas de las seis inversas | CEPRE-UNI | Media/alta | Temario explícito; sin frecuencia de examen | Sílabo 2023-2, p. 11 del PDF |
| Inversa de una función y restricciones | UNMSM | Media/alta | Temario general de funciones; no se confirma mención específica de las seis inversas trigonométricas | Reglamento 2023-I |
| Valor principal frente a solución general | CEPRE-UNI | Alta | Enlace explícito con ecuaciones trigonométricas del sílabo | Sílabo 2023-2 |
| Funciones trigonométricas inversas: dominio, rango e interpretación gráfica | UNSA | Media/alta, valoración de diseño | Inclusión en temario de admisión 2027; no frecuencia de examen | RCU 0028-2026, contenido indexado del PDF oficial |

La pregunta UNI observada combina funciones inversas y un intervalo. No se reproduce su enunciado ni se generaliza su presencia a todas las convocatorias.

## 3. Errores típicos

| Código | Qué hace | Por qué | Estado | Fuente |
|---|---|---|---|---|
| I-REC | Interpreta la inversa del seno como su recíproco | El exponente menos uno se usa en contextos distintos | Hipótesis de error estudiantil; el libro advierte la ambigüedad, pero no mide incidencia | OpenStax, §6.3, como apoyo conceptual |
| I-RAM | Devuelve cualquier ángulo compatible sin respetar la rama | Confunde relación inversa con función inversa elegida | Hipótesis | Diseño propio |
| I-CAN | Cancela una composición en cualquier orden sin revisar intervalos | Extiende una identidad fuera de su dominio de validez | Hipótesis | Diseño propio |
| I-ALL | Considera que el valor principal es la única solución de la ecuación | Omite periodicidad y simetría | Hipótesis | Diseño propio |
| I-CON | Supone que todas las convenciones de arco cotangente coinciden | Desconoce que se debe declarar la rama | Hipótesis | Diseño propio |

No se localizó un estudio original suficiente sobre estos errores específicos en postulantes peruanos. La advertencia de un manual no se presenta como hallazgo empírico.

## 4. Lo que la unidad da por sabido

TR9–TR11, radianes, intervalos, dominio y rango, composición, ecuaciones elementales y raíces reales. La inyectividad se explica al comenzar; no se presupone comprendida por recordar el nombre.

## 5. Las ideas, en orden

### Idea 1. Elegir una respuesta — ¿Cómo volver de una razón a un ángulo?

**Aprende:** comprende por qué la inversa necesita una rama definida.

**Lee / objeto:** escalera apoyada en una pared y cinta que mide longitudes. «Las longitudes permiten formar una razón». «Ahora buscamos un ángulo». «El aparato deberá mostrar una sola respuesta para cada entrada permitida». No se anuncian todavía intervalos principales.

**Juega:** ajusta la inclinación de una escalera en el intervalo agudo hasta obtener una razón dada; valida longitud e inclinación. No presenta el segundo ángulo compatible de la circunferencia.

**Predice:** si ahora se permite toda una vuelta, una misma lectura de seno puede corresponder a dos posiciones. ¿Cómo puede definirse una función inversa que entregue un solo ángulo? A) Elegir previamente una rama donde no se repitan las salidas **[correcta]**. B) Devolver siempre ambos ángulos como una sola salida angular [I-RAM]. C) Tomar el recíproco de la lectura [I-REC]. D) Afirmar que la otra posición nunca existió [I-ALL].

**Mira:** destaca una rama y conserva, fuera de ella, las otras posiciones como soluciones de la relación original.

**La regla:** llamar $u$ al número que entra en la inversa y $\theta$ al ángulo que sale. Se define $\theta=\arcsin u$, leído «arco seno de u», por $\sin\theta=u$ y $\theta\in[-\pi/2,\pi/2]$, con $u\in[-1,1]$. Se define $\theta=\arccos u$ por $\cos\theta=u$ y $\theta\in[0,\pi]$, también con $u\in[-1,1]$. Se define $\theta=\arctan u$ por $\tan\theta=u$ y $\theta\in(-\pi/2,\pi/2)$, con $u$ real. Estas restricciones hacen que cada valor admitido tenga un único ángulo: la función restringida es inyectiva. Arco seno y arco tangente son crecientes; arco coseno es decreciente. Sus gráficas se obtienen intercambiando entrada y salida de la rama correspondiente. El símbolo $\sin^{-1}$ puede significar inversa según el contexto, pero no debe confundirse con $1/\sin$: en la app se usará «arco seno» o $\arcsin$.

**Palabras:** *inversa*: función que recupera la entrada dentro de una elección permitida; ejemplos: arco seno, arco coseno, arco tangente. *Rama principal*: parte elegida para entregar una sola respuesta; ejemplos: rama del seno entre menos y más un cuarto de vuelta, semicircunferencia del coseno, rama central de la tangente.

**Así se resuelve:** comprobar dominio de la entrada; identificar razón y rama; localizar el ángulo compatible; expresar en la unidad pedida; verificar función directa e intervalo. **Ahora tú:** dominio → valor principal conocido → comparación y rango de una inversa compuesta con una expresión lineal.

### Idea 2. El orden importa — ¿Cuándo se pueden deshacer dos operaciones?

**Aprende:** revisa el intervalo antes de simplificar composiciones.

**Lee / objeto:** medidor de inclinación con una marca que puede dar una vuelta completa. «El medidor utiliza una rama declarada». «El giro real puede quedar fuera de ella». «Compararemos el giro original con el ángulo que informa el medidor».

**Juega:** convierte un ángulo del intervalo principal en su seno y vuelve mediante arco seno; valida recuperación dentro de ese intervalo. No permite ángulos externos.

**Predice:** para un giro del segundo cuadrante, ¿el arco seno de su seno devuelve necesariamente el giro original? A) No; devuelve el ángulo compatible dentro de la rama principal **[correcta]**. B) Sí, ambas operaciones se cancelan siempre [I-CAN]. C) Devuelve el recíproco del seno [I-REC]. D) Devuelve el giro original más todas sus vueltas como un único valor principal [I-ALL].

**Mira:** muestra dos posiciones con el mismo seno y selecciona la que está en la rama del arco seno.

**La regla:** $\sin(\arcsin u)=u$ y $\cos(\arccos u)=u$ si $u\in[-1,1]$; $\tan(\arctan u)=u$ para todo real. En el otro orden, $\arcsin(\sin\theta)=\theta$ solo en $[-\pi/2,\pi/2]$, $\arccos(\cos\theta)=\theta$ solo en $[0,\pi]$ y $\arctan(\tan\theta)=\theta$ solo en $(-\pi/2,\pi/2)$. Fuera de esos intervalos se usa periodicidad y simetría para hallar el representante principal. Para composiciones cruzadas, resolver el ángulo de la función interior y fijar el signo con su rama; por ejemplo, $\cos(\arcsin u)=\sqrt{1-u^2}$ y $\sin(\arccos u)=\sqrt{1-u^2}$ en $[-1,1]$. La raíz es no negativa por los intervalos elegidos, no por una regla universal sobre todos los cuadrantes. Además, $\arcsin u+\arccos u=\pi/2$ en ese dominio. Para argumentos que contienen otra expresión, imponer primero que esa expresión pertenezca al dominio de la inversa.

**Palabras:** *composición*: usar una salida como entrada de otra función; ejemplos: seno después de arco seno, arco coseno después de coseno, coseno después de arco seno. *Representante*: ángulo elegido entre otros compatibles; ejemplos: uno en la rama principal, uno dentro de una vuelta, uno en el intervalo pedido.

**Así se resuelve:** evaluar o acotar la expresión interior; revisar la rama exterior; ubicar el representante; aplicar simetría si corresponde; comprobar dominio y signo. **Ahora tú:** composición directa → composición en orden inverso fuera de rama → combinación con intervalo como el tipo observado en UNI.

### Idea 3. Una respuesta o todas — ¿Qué diferencia hay entre invertir y resolver?

**Aprende:** reconstruye las soluciones de una ecuación a partir del valor principal.

**Lee / objeto:** rueda de taller con un sensor de altura. «El sensor puede activarse en más de una posición». «También puede activarse en vueltas posteriores». «El encargo debe indicar si pide una lectura principal o todos los giros».

**Juega:** encuentra todas las activaciones en una vuelta para una altura interior positiva; valida las dos posiciones. No habilita vueltas adicionales.

**Predice:** al permitir giros de cualquier número de vueltas, ¿qué ocurre con las soluciones de esa misma condición? A) Se repiten las posiciones compatibles en cada vuelta **[correcta]**. B) Queda únicamente la que devuelve arco seno [I-ALL]. C) Basta tomar el recíproco de la altura normalizada [I-REC]. D) Cada giro coincide con su arco seno sin ajustar la rama [I-CAN].

**Mira:** extiende el contador de giro y registra activaciones equivalentes en nuevas vueltas.

**La regla:** si $u$ es el valor dado y $k$ un entero, para $u\in[-1,1]$:

$$\sin\theta=u\ \Longleftrightarrow\ \theta=\arcsin u+2k\pi\ \text{o}\ \theta=\pi-\arcsin u+2k\pi;$$
$$\cos\theta=u\ \Longleftrightarrow\ \theta=\arccos u+2k\pi\ \text{o}\ \theta=-\arccos u+2k\pi.$$

Para todo $u$ real, $\tan\theta=u$ equivale a $\theta=\arctan u+k\pi$. En los extremos del seno o coseno pueden repetirse soluciones entre familias: no contarlas dos veces. Si se pide un intervalo, seleccionar solo los enteros que sitúan las soluciones en él, respetando extremos abiertos o cerrados. Si el argumento es una expresión del ángulo, resolver esa expresión igual a cada familia y verificar el dominio original. Las ecuaciones que suman funciones inversas requieren además que cada término y cada ángulo principal cumplan sus propias restricciones; no se convierten en una «cancelación» automática.

**Palabras:** *solución general*: forma de expresar todas las respuestas admitidas; ejemplos: familias de seno, familias de coseno, repetición de tangente. *Valor principal*: respuesta única de la inversa elegida; ejemplos: salida de arco seno, salida de arco coseno, salida de arco tangente.

**Así se resuelve:** verificar si el valor pedido es alcanzable; obtener el principal; reconstruir familias con simetría y periodo; filtrar por intervalo; verificar y eliminar duplicados. **Ahora tú:** principal frente a todas → ecuación en intervalo → argumento transformado y condiciones adicionales.

### Idea 4. Declarar la convención — ¿Cómo invertir las otras tres razones?

**Aprende:** maneja arco cotangente, arco secante y arco cosecante con ramas explícitas.

**Lee / objeto:** dos medidores escolares con etiquetas de intervalo. «Un instrumento puede usar una convención declarada». «Hay que leer el intervalo junto al nombre de la operación». «Compararemos salidas que representan la misma razón».

**Juega:** selecciona, entre posiciones de una rueda, la única que pertenece a un intervalo indicado y tiene una cotangente dada; valida razón e intervalo. Solo utiliza una convención.

**Predice:** otro material elige una rama distinta para su arco cotangente. ¿Puede mostrar otro ángulo con la misma cotangente? A) Sí; hay que comparar las convenciones declaradas **[correcta]**. B) No; todo nombre de inversa fija por sí solo cualquier rama posible [I-CON]. C) Sí, porque arco cotangente significa el recíproco numérico de cotangente [I-REC]. D) Las dos salidas deben ser simultáneamente el valor principal de una misma convención [I-RAM].

**Mira:** señala intervalos diferentes y verifica las razones de ambas salidas.

**La regla:** para esta propuesta se adopta $\operatorname{arccot}u=\pi/2-\arctan u$, con dominio real y rango $(0,\pi)$; es decreciente. Se adopta $\operatorname{arcsec}u=\arccos(1/u)$ y $\operatorname{arccsc}u=\arcsin(1/u)$, ambas para $\lvert u\rvert\ge1$. Sus rangos son respectivamente $[0,\pi]\setminus\{\pi/2\}$ y $[-\pi/2,\pi/2]\setminus\{0\}$. Arcosecante es creciente en cada uno de sus dos intervalos de dominio; arcocosecante es decreciente en cada uno. Las gráficas y composiciones se construyen con estas definiciones y sus dominios; no se cambian ramas a mitad del ejercicio. Las funciones directas recuperan $u$ sobre esos dominios; la composición en el orden contrario recupera el ángulo solo si pertenece a la rama elegida. Estas son convenciones de la propuesta, que deben cotejarse con el material específico del examen.

**Palabras:** *convención*: acuerdo que fija cómo se interpreta una notación; ejemplos: intervalo de arco cotangente, sentido positivo de giro, unidad angular. *Recíproco*: número que multiplicado por el original da uno; ejemplos: secante respecto de coseno, cosecante respecto de seno, cotangente respecto de tangente cuando ambas existen.

**Así se resuelve:** leer convención; comprobar dominio; reducir a arco seno, coseno o tangente según la definición; escoger el ángulo en la rama; verificar razón directa. **Ahora tú:** dominio de recíprocas inversas → valor principal → composición con control de rama.

## 6. Letras y símbolos

| Letra o símbolo | Significado | Unidad |
|---|---|---|
| $u$ | Número de entrada a una función inversa | Sin unidad |
| $\theta$ | Ángulo de salida o incógnita angular | Radianes salvo indicación |
| $k$ | Entero que describe repeticiones | Sin unidad |
| $\arcsin,\arccos,\arctan$ | Arco seno, arco coseno y arco tangente | Salida angular |
| $\operatorname{arccot},\operatorname{arcsec},\operatorname{arccsc}$ | Arco cotangente, arco secante y arco cosecante con las ramas declaradas | Salida angular |
| $\in,\setminus,\Longleftrightarrow$ | Pertenece, exclusión de elementos, equivalencia | No corresponde |
| $[-1,1],(0,\pi)$ | Intervalos cerrado y abierto, respectivamente | La del contenido |

No usar el exponente menos uno como única explicación de «inversa». «arc sen» y $\arcsin$ son variantes de nombre; el símbolo no sustituye la declaración del intervalo.

## 7. Otras formas de explicarla

| Recurso | Para qué | Riesgo y control |
|---|---|---|
| Escalera y razón de longitudes | Volver de razón a ángulo | Creer que toda inversa solo produce ángulos agudos: pasar luego a la rama completa |
| Rama coloreada en círculo y gráfica, como en OpenStax | Dominios y valores principales | Borrar mentalmente otras soluciones: mantenerlas visibles como relación |
| Dos medidores con convenciones declaradas; diseño propio | Arco cotangente y otras ramas | Relativizar cualquier respuesta: exigir siempre una convención precisa |

## 8. Datos del mundo

No se necesitan medidas externas para justificar las ramas principales. La escalera y la rueda son objetos reconocibles; sus medidas se proponen como datos sintéticos. Para un disco físico peruano puede emplearse la moneda BCRP de 2021 de diámetro 25,50 mm, sin atribuirle funciones de instrumento de precisión.

## 9. Dudas y decisiones

El sílabo CEPRE-UNI incluye las seis inversas. Una línea llama «arco cotangente» a la entrada con símbolo de arco cosecante: se registra como inconsistencia del documento, no se reproduce como definición. Se eligen cuatro ideas para incorporar las tres inversas menos habituales sin sobrecargar la primera. Falta confirmar la convención de arco cotangente y arcosecante en cada banco específico de examen; la propuesta declara una convención coherente y exige mantenerla. No se afirma que estas seis funciones tengan igual peso en San Marcos.

## 10. Fuentes

- UNI, Oficina Central de Admisión (2021; archivo publicado en 2022). *Solucionario del examen de admisión 2021*, Matemática 19. [PDF oficial](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario2021.pdf).
- CEPRE-UNI (2023). *Sílabo del ciclo básico 2023-2*, inversas y ecuaciones trigonométricas. [PDF oficial](https://www.cepre.uni.edu.pe/assets/archivos/comunicados/Syl_Bas_PS_2023-2.pdf).
- UNMSM (2023). *Reglamento de admisión 2023-I*, funciones y Trigonometría. [PDF institucional](https://medicina.unmsm.edu.pe/wp-content/uploads/2023/02/Reglamento-de-Admision-2023-I.pdf).
- Abramson, Jay (2021). *Precalculus 2e*, §6.3, inversas de seno, coseno y tangente. OpenStax. [Fuente](https://openstax.org/books/precalculus-2e/pages/6-3-inverse-trigonometric-functions). Las ramas de las otras tres funciones se declaran como decisión matemática de esta propuesta.
- BCRP (2021). *Bicentenario 1821–2021: Toribio Rodríguez de Mendoza*. [Ficha](https://www.bcrp.gob.pe/docs/Billetes-Monedas/Monedas-de-Coleccion/bicentenario-2021/bicentenario-3-trdm.pdf).

- UNSA, Consejo Universitario (2026). *RCU 0028-2026: Temario y matriz de evaluación de admisión 2027*, Trigonometría. [PDF oficial](https://admision.unsa.edu.pe/wp-content/uploads/2026/03/RCU-0028-Aprobacion-de-TEMARIO-y-MATRIZ-ADMISION-2027.pdf). Se confirmó la inclusión mediante el contenido indexado; el visor no devolvió texto del PDF.
