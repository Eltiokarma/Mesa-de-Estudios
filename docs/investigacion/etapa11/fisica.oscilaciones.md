# FI11 · Física · Movimiento armónico simple

> Parte del documento de ChatGPT de las 32 unidades (21 nov 2026), por verificar. Cómo se leyó la evidencia y el contrato común de las escenas: `docs/investigacion/etapas-9-12/como-leer.md`.


## 1. Resumen en cinco líneas

Un movimiento periódico no es necesariamente armónico simple.  
El MAS exige una aceleración proporcional al desplazamiento y de sentido opuesto.  
Posición, velocidad y aceleración alcanzan sus extremos en momentos diferentes.  
El período depende del sistema y de las aproximaciones adoptadas.  
Lo más difícil es interpretar el equilibrio y distinguir período de frecuencia.

## 2. Qué se pregunta en los exámenes

| Tipo | Universidad | Dificultad | Frecuencia | Fuente |
|---|---|---|---|---|
| Bloque-resorte y péndulo simple | UNMSM | Media | Temario histórico; no estimada | UNMSM, Física 9.1 |
| Energía del oscilador | UNMSM | Media/alta | Temario histórico; no estimada | UNMSM, 9.2 |
| Relación fase, velocidad, período y sistemas de resortes | Propuesta de preparación | Alta | Sin ítem UNI específico verificado | OpenStax, capítulo 15 |

El péndulo cónico de UNI 2021-1 no se clasifica como pregunta de MAS.

## 3. Errores típicos

| Código | Qué hace | Por qué | Estado | Fuente |
|---|---|---|---|---|
| O-PER | Confunde período y frecuencia | No distingue tiempo por ciclo y ciclos por tiempo | Documentado | Tumanggor y otros, 2020, discusión |
| O-RES | Decide rigidez total contando resortes sin mirar conexión | Usa cantidad de piezas en lugar de la relación mecánica | Documentado | Tumanggor y otros, 2020 |
| O-CEN | Supone velocidad cero en equilibrio o aceleración cero en extremos | Mezcla posición y cambio de posición | Hipótesis de esta propuesta | Diseño propio |
| O-ENE | Identifica fuerza cero con energía cero o duplica energías al transformarlas | No conserva la energía del oscilador ideal | Hipótesis | Diseño propio |

## 4. Lo que la unidad da por sabido

Segunda ley, ley de Hooke básica, energía, seno y coseno como funciones de una fase. La lectura de esas funciones debe diagnosticarse antes: esta unidad no puede exigir TR11 sin ofrecer recuperación si se cursan simultáneamente.

## 5. Las ideas, en orden

### Idea 1. Volver al centro — ¿Qué fuerza produce el MAS?

**Aprende:** el equilibrio es la referencia para el desplazamiento restaurador.

**Lee / objeto:** carrito unido a un resorte horizontal en una mesa de taller. «El resorte tiene una posición de equilibrio». «El desplazamiento se mide desde ella». «La masa puede pasar por ese lugar en movimiento».

**Juega:** arrastra el carro a posiciones a ambos lados y empareja etiquetas de fuerza con el lado hacia el que lo empuja el resorte. No se libera todavía.

**Predice:** al soltar el carrito desde un extremo y llegar al equilibrio ideal, ¿qué ocurre? A) Lo atraviesa con rapidez máxima **[correcta]**. B) Se detiene porque la fuerza neta es cero [O-CEN]. C) Tiene allí aceleración de magnitud máxima [O-CEN]. D) Cambia allí de sentido, confundiendo equilibrio con extremo [O-CEN].

**Mira:** libera el carro y compara flechas de fuerza y velocidad.

**La regla:** $x$ es desplazamiento desde equilibrio; $F$, fuerza neta restauradora; $k>0$, rigidez; $m$, masa. Si $F=-kx$, entonces $a=-k x/m=-\omega^2x$, con $a$ aceleración y $\omega=\sqrt{k/m}$ frecuencia angular. La condición del MAS es esa proporcionalidad con signo opuesto. En un resorte vertical, medir desde el equilibrio desplazado por el peso, no desde su longitud natural.

**Palabras:** *equilibrio*: posición donde la fuerza neta es cero; ejemplos: carro centrado, masa colgante en reposo, péndulo vertical. *Restauradora*: que apunta de regreso al equilibrio; ejemplos: resorte estirado, resorte comprimido, componente tangencial del peso.

**Así se resuelve:** localizar equilibrio; definir eje; sumar fuerzas; expresar la fuerza neta en función de $x$; comprobar si es proporcional y opuesta. **Ahora tú:** dirección → fuerza a cierta posición → identificación del MAS.

### Idea 2. La fase del movimiento — ¿Dónde son máximas rapidez y aceleración?

**Aprende:** posición, velocidad y aceleración describen aspectos distintos del mismo ciclo.

**Lee / objeto:** el carrito y una cámara virtual que registra posiciones a intervalos iguales. «Las fotos comparan instantes». «Separaciones mayores indican más rapidez». «La fase indica en qué parte del ciclo estamos».

**Juega:** ordena fotos de medio ciclo hasta que la secuencia sea temporalmente correcta; no aparecen gráficas de aceleración.

**Predice:** en un extremo de una oscilación ideal de amplitud no nula, ¿cómo son la velocidad y la aceleración? A) Velocidad cero y aceleración hacia el equilibrio **[correcta]**. B) Ambas son cero [O-CEN]. C) Rapidez máxima y aceleración cero [O-CEN]. D) Velocidad cero y aceleración alejándose del equilibrio [O-CEN].

**Mira:** congela el extremo y muestra el cambio de sentido posterior.

**La regla:** $A\ge0$ es amplitud, $t$ tiempo y $\varphi$ fase inicial. Una representación es $x=A\cos(\omega t+\varphi)$, $v=-A\omega\sin(\omega t+\varphi)$, $a=-A\omega^2\cos(\omega t+\varphi)$. La fase va en radianes. El período $T=2\pi/\omega$ y la frecuencia $f=1/T$. Además, $v^2=\omega^2(A^2-x^2)$; esta relación da rapidez, no el sentido de la velocidad. La fase inicial se elige usando posición y sentido inicial, no solo una fotografía.

**Palabras:** *amplitud*: máxima separación del equilibrio; ejemplos: extremo derecho, extremo izquierdo en magnitud, desplazamiento máximo de un péndulo pequeño. *Fase*: lugar dentro del ciclo; ejemplos: salida del extremo, cruce central, regreso al extremo.

**Así se resuelve:** identificar $A,T$; calcular $\omega$; usar datos iniciales para $\varphi$; obtener la magnitud solicitada; comprobar signo y límites. **Ahora tú:** extremos → gráfica temporal → fase y rapidez en una posición.

### Idea 3. Cambiar el sistema — ¿Qué modifica el período?

**Aprende:** las fórmulas del período dependen de la fuerza restauradora de cada sistema.

**Lee / objeto:** dos resortes intercambiables y un colgante usado como péndulo. «No todas las oscilaciones tienen el mismo mecanismo». «Las conexiones cambian cómo trabajan los resortes». «La longitud del péndulo llega al centro de la masa suspendida».

**Juega:** compara resortes aislados con masas iguales y alcanza un período objetivo seleccionando una rigidez disponible. No habilita conexiones múltiples ni cambio de masa.

**Predice:** dos resortes iguales se colocan en paralelo y ambos se estiran lo mismo que antes se estiraba uno solo. ¿Qué fuerza restauradora total ejercen? A) El doble **[correcta]**. B) La mitad, tratando el paralelo como serie [O-RES]. C) La misma, contando solo uno de los resortes [O-RES]. D) Cuatro veces, multiplicando dos veces por el número de resortes [O-RES].

**Mira:** muestra que ambos aportan fuerza ante el mismo desplazamiento.

**La regla:** para masa-resorte ideal, $T=2\pi\sqrt{m/k}$. En paralelo $k_{\mathrm{eq}}=\sum_i k_i$; en serie $1/k_{\mathrm{eq}}=\sum_i1/k_i$, para resortes ideales sin masa y conexiones apropiadas. Para péndulo simple de longitud $L$, gravedad $g$, hilo inextensible sin masa y oscilaciones pequeñas, $T\approx2\pi\sqrt{L/g}$. La aproximación usa $\sin\theta\approx\theta$, con ángulo $\theta$ en radianes. No se aplica al péndulo cónico ni a amplitudes grandes sin corrección.

**Palabras:** *rigidez*: resistencia a deformarse; ejemplos: resorte blando, resorte duro, rigidez equivalente. *Péndulo simple*: modelo de masa puntual suspendida; ejemplos: pesa con hilo ligero, pequeña esfera colgante, maqueta idealizada de un colgante.

**Así se resuelve:** reconocer el sistema; hallar rigidez equivalente o longitud efectiva; seleccionar fórmula y supuestos; comparar factores antes de sustituir. **Ahora tú:** cambio de masa → conexiones → comparación de péndulos pequeños.

### Idea 4. Energía que cambia de forma — ¿Por qué la amplitud se mantiene en el ideal?

**Aprende:** la energía se intercambia entre movimiento y deformación.

**Lee / objeto:** carro-resorte con dos recipientes gráficos de energía, después de mostrar el objeto. «La energía se registra por formas». «La deformación puede almacenar energía». «El rozamiento puede transferir energía al entorno».

**Juega:** desplaza el carro detenido hasta una energía elástica objetivo; no permite movimiento ni rozamiento todavía.

**Predice:** un carrito se libera desde un extremo, sin rozamiento. Al cruzar el equilibrio, ¿qué ocurre con la energía potencial del oscilador medida desde ese equilibrio? A) Se ha transformado en cinética **[correcta]**. B) Toda la energía desaparece porque la fuerza es cero [O-ENE]. C) Sigue siendo toda potencial aunque ya no haya desplazamiento [O-ENE]. D) Se conserva toda la potencial inicial y aparece además igual cantidad de cinética [O-ENE].

**Mira:** se transfieren las cantidades entre recipientes conservando el total.

**La regla:** $U=kx^2/2$, energía potencial del oscilador con referencia en el equilibrio; en un resorte horizontal es elástica y en el vertical combina elasticidad y gravedad salvo una constante; $K=mv^2/2$, energía cinética; $E=K+U=kA^2/2$, constante en el oscilador ideal. Con disipación, esta energía mecánica disminuye y el modelo deja de ser MAS ideal de amplitud constante. En el resorte vertical, la forma cuadrática alrededor del equilibrio incluye el efecto gravitatorio salvo una constante de referencia.

**Palabras:** *disipación*: transferencia que reduce energía mecánica disponible; ejemplos: roce, resistencia del aire, amortiguador. *Energía mecánica*: suma de movimiento y posición en el modelo; ejemplos: carro-resorte, péndulo ideal, oscilador sin fricción.

**Así se resuelve:** hallar $E$ desde la amplitud; calcular $U$ en la posición; obtener $K=E-U$; despejar rapidez y escoger sentido con la fase. **Ahora tú:** fracciones de energía → amplitud desconocida → comparación ideal/disipativo.

## 6. Letras y símbolos

| Símbolo | Significado | Unidad / advertencia |
|---|---|---|
| $x,A,L$ | Desplazamiento, amplitud, longitud de péndulo | m |
| $F,k,m,a,v$ | Fuerza, rigidez, masa, aceleración, velocidad | N, N/m, kg, m/s², m/s |
| $t,T,f,\omega$ | Tiempo, período, frecuencia, frecuencia angular | s, s, Hz, rad/s |
| $\varphi,\theta,g$ | Fase inicial, ángulo pendular, gravedad | rad, rad, m/s² |
| $U,K,E$ | Potencial, cinética, energía mecánica | J; E no es empuje |
| $\mathrm{eq},i,\sum,\approx$ | Equivalente, índice, suma, aproximación | Convenciones |

## 7. Otras formas de explicarla

Fotos equiespaciadas en tiempo aclaran rapidez; no deben confundirse con fotos equiespaciadas en posición. La proyección de un movimiento circular ayuda a la fase cuando ya se conocen seno y coseno; no significa que el objeto oscile siguiendo una circunferencia. Barras de energía muestran conservación; el signo del desplazamiento no vuelve negativa la energía elástica. Apoyo: OpenStax, 15.1 y 15.4.

## 8. Datos del mundo

La moneda conmemorativa BCRP citada tiene una masa nominal de 7,32 g, utilizable como referencia de una pequeña carga experimental. Una moneda extendida no es una masa puntual perfecta: el péndulo del juego se declara ideal y su longitud se mide al centro de masa. No se afirma un valor local de $g$ para Juliaca.

## 9. Dudas y decisiones

La investigación citada se realizó fuera del Perú y no estima errores peruanos. Debe decidirse si los resortes equivalentes entran en el tramo obligatorio o avanzado. Antes de esta unidad, recuperar funciones trigonométricas para evitar introducir símbolos sin comprensión.

## 10. Fuentes

- UNMSM (proceso 2023-I). *Reglamento de admisión*, Física 9. [Documento](https://medicina.unmsm.edu.pe/wp-content/uploads/2023/02/Reglamento-de-Admision-2023-I.pdf).
- Tumanggor, A. M. R.; Supahar; Siringo Ringo, E.; Harliadi, M. D. (2020). *Detecting students’ misconception in simple harmonic motion concepts using four-tier diagnostic test instruments*, Al-Biruni 9(1), 21–31. [Original](https://ejournal.radenintan.ac.id/index.php/al-biruni/article/download/4571/pdf/19396).
- Moebs, W.; Ling, S. J.; Sanny, J. (2016). *University Physics Volume 1*, [15.1](https://openstax.org/books/university-physics-volume-1/pages/15-1-simple-harmonic-motion) y [15.4](https://openstax.org/books/university-physics-volume-1/pages/15-4-pendulums).
- BCRP (2021). *Moneda: Toribio Rodríguez de Mendoza*. [Ficha](https://www.bcrp.gob.pe/docs/Billetes-Monedas/Monedas-de-Coleccion/bicentenario-2021/bicentenario-3-trdm.pdf).
