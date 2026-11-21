# TR9 · Trigonometría · Reducción al primer cuadrante

> Parte del documento de ChatGPT de las 32 unidades (21 nov 2026), por verificar. Cómo se leyó la evidencia y el contrato común de las escenas: `docs/investigacion/etapas-9-12/como-leer.md`.


## 1. Resumen en cinco líneas

La reducción relaciona un ángulo cualquiera con uno agudo de referencia.  
El signo depende de la ubicación y de las coordenadas que intervienen.  
Las vueltas completas, reflexiones y cuartos de vuelta explican las relaciones.  
Los ángulos sobre los ejes se resuelven directamente, sin inventar un triángulo agudo.  
Lo más difícil es coordinar ángulo de referencia, signo y posible cambio de razón.

## 2. Qué se pregunta en los exámenes

| Tipo | Universidad | Dificultad | Frecuencia | Fuente |
|---|---|---|---|---|
| Determinar signos mediante condiciones con valor absoluto y simplificar | UNI | Alta, integra álgebra | Un caso identificado: Matemática 17, 2021-1 | UNI, solucionario oficial, p. 21 del PDF |
| Reducir ángulos negativos, mayores que una vuelta y suplementarios | CEPRE-UNI | Media | Presencia explícita en temario; no frecuencia de examen | CEPRE-UNI, 2023-2, p. 9 del PDF |
| Razones de ángulos de cualquier magnitud y reducción | UNMSM | Media | Temario histórico; sin recuento de ítems | UNMSM, 2023-I, Trigonometría |

No se establece un ranking de frecuencia entre tipos con una muestra tan limitada. El orden propuesto responde a dependencias conceptuales.

## 3. Errores típicos

| Código | Qué hace el alumno | Por qué | Estado | Fuente |
|---|---|---|---|---|
| R-SIG | Asigna un seno positivo a un ángulo del cuarto cuadrante | No conecta el cálculo con la coordenada vertical; explicación causal propuesta | Documentado: hay respuestas con signo equivocado; la causa no fue demostrada | Weber, 2005, resultados de la pregunta 1, p. 100 |
| R-GIR | Cree que una vuelta adicional cambia todas las razones | Confunde giro acumulado y posición final | Hipótesis | Diseño propio |
| R-COF | Mantiene siempre la misma razón al intercambiar las direcciones horizontal y vertical | Aplica una receta incompleta de reducción | Hipótesis | Diseño propio |
| R-EJE | Trata una división entre cero como cero o como un valor real llamado infinito | Extiende reglas de casos ordinarios a un denominador nulo | Hipótesis | Diseño propio |

Weber estudia dos grupos concretos; sus resultados no estiman prevalencias en postulantes peruanos. Los distractores nuevos no son transcripciones de sus pruebas.

## 4. Lo que la unidad da por sabido

Triángulo rectángulo, seis razones de ángulos agudos, semejanza, coordenadas con signo, grados, giro positivo antihorario y operaciones con fracciones. Incluir una comprobación de entrada sobre el significado de una coordenada negativa. No se exige todavía circunferencia de radio uno.

## 5. Las ideas, en orden

### Idea 1. La posición decide el signo — ¿Cómo representar un giro que supera un ángulo recto?

**Aprende:** extiende las razones trigonométricas mediante coordenadas con signo.

**Lee / objeto:** biela y pedal de una bicicleta detenida, vistos de frente; objeto reconocible en calles y talleres. Tarjetas: «El pedal puede ocupar distintas posiciones alrededor del eje». «Tomaremos la derecha del eje como inicio del giro». «Mediremos la posición respecto del eje, no respecto del suelo». Los ejes aparecen después del objeto.

**Juega:** arrastra el pedal en el semiplano superior y colócalo en una marca de altura indicada respecto del eje; valida posición y lado pedido. No habilita posiciones inferiores.

**Predice:** al moverlo a una posición nueva, abajo y a la derecha del eje, ¿qué signos tienen las lecturas horizontal y vertical? A) Horizontal positiva y vertical negativa **[correcta]**. B) Ambas positivas, porque las distancias son positivas [R-SIG]. C) Ambas negativas, porque el giro pasó de media vuelta [R-SIG]. D) No pueden definirse fuera del primer cuadrante [R-SIG].

**Mira:** conserva el cero en el eje y muestra el desplazamiento hacia abajo; distingue distancia positiva y coordenada negativa.

**La regla:** llamar $x$ a la coordenada horizontal, $y$ a la vertical, $r$ a la distancia positiva del pedal al eje y $\theta$ al ángulo de giro. Las abreviaturas de las fórmulas se leen, en orden, seno, coseno, tangente, cotangente, secante y cosecante. Entonces $r=\sqrt{x^2+y^2}$ y

$$\sin\theta=\frac{y}{r},\quad \cos\theta=\frac{x}{r},\quad \tan\theta=\frac{y}{x},\quad \cot\theta=\frac{x}{y},\quad \sec\theta=\frac{r}{x},\quad \csc\theta=\frac{r}{y}.$$

Seno y coseno existen para todo ángulo; tangente y secante requieren $x\ne0$; cotangente y cosecante requieren $y\ne0$. En los cuadrantes primero, segundo, tercero y cuarto, los signos de seno son $+,+,-,-$; los de coseno, $+,-,-,+$; los de tangente, $+,-,+,-$. Las recíprocas conservan el signo de la razón correspondiente. Sobre los ejes se sustituyen las coordenadas: no se divide entre cero.

**Palabras:** *cuadrante*: una de las cuatro zonas alrededor del origen; ejemplos: arriba-derecha, arriba-izquierda, abajo-izquierda. *Coordenada*: lectura con dirección desde un punto de referencia; ejemplos: desplazamiento a la derecha, altura sobre el eje, descenso bajo el eje.

**Así se resuelve:** ubicar el lado final; asignar signos a las coordenadas; elegir el cociente solicitado; comprobar su denominador; justificar el signo. **Ahora tú:** signo de una razón → signos compatibles → restricciones con valor absoluto y cuadrante.

### Idea 2. Volver a un ángulo agudo — ¿Qué cambia al reflejar o completar vueltas?

**Aprende:** separa el tamaño de la razón de su signo.

**Lee / objeto:** misma bicicleta con una marca adhesiva en el pedal. «Podemos registrar el giro total». «También podemos registrar dónde terminó». «Un espejo permite comparar posiciones respecto de una misma línea».

**Juega:** empareja posiciones reflejadas respecto del eje horizontal y verifica igualdad de distancias al eje; solo una vuelta y sin giros acumulados.

**Predice:** un pedal termina en una posición y otro completa una vuelta adicional antes de detenerse allí. ¿Qué ocurrirá con las razones trigonométricas de sus giros? A) Serán iguales donde estén definidas **[correcta]**. B) Todas aumentarán por la vuelta extra [R-GIR]. C) Todas cambiarán de signo [R-GIR]. D) Se intercambiarán seno y coseno [R-COF].

**Mira:** superpone ambas posiciones y conserva distintos contadores de giro acumulado.

**La regla:** sea $\alpha$ el ángulo agudo de referencia y $k$ un número entero de vueltas. Primero llevar $\theta$ a un representante $\theta_0$ entre $0^\circ$ incluido y $360^\circ$ excluido, con $\theta=\theta_0+360^\circ k$. Toda razón definida conserva su valor al añadir $360^\circ k$. En los interiores de los cuadrantes, $\alpha$ es respectivamente $\theta_0$, $180^\circ-\theta_0$, $\theta_0-180^\circ$ o $360^\circ-\theta_0$. Cada razón de $\theta$ es la misma razón de $\alpha$ con el signo del cuadrante. Además:

$$\sin(-\theta)=-\sin\theta,\qquad \cos(-\theta)=\cos\theta,\qquad \tan(-\theta)=-\tan\theta.$$

La tangente y la cotangente repiten sus valores cada $180^\circ$, donde existen. Para seno y coseno, sumar media vuelta cambia el signo. Las recíprocas se obtienen tomando el recíproco solo cuando el denominador no es cero. Los ángulos cuadrantales se atienden con la idea 1.

**Palabras:** *coterminales*: giros que terminan apuntando en la misma dirección; ejemplos: una vuelta extra, dos vueltas extra, una vuelta menos. *Referencia*: ángulo agudo auxiliar para comparar; ejemplos: inclinación hacia la derecha, inclinación respecto de la izquierda, abertura bajo el eje horizontal.

**Así se resuelve:** retirar vueltas completas; ubicar el cuadrante; obtener el ángulo de referencia; conservar la razón y elegir el signo; verificar casos sobre ejes. **Ahora tú:** reducción de un ángulo → negativo o de varias vueltas → expresión con varias razones y restricciones.

### Idea 3. Un cuarto de vuelta — ¿Cuándo cambia seno por coseno?

**Aprende:** explica el intercambio de razones por intercambio de coordenadas.

**Lee / objeto:** escuadra de carpintería junto a la biela. «La escuadra marca un cuarto de vuelta». «Las lecturas horizontal y vertical se pueden comparar». «Seguiremos la misma marca del pedal».

**Juega:** hace coincidir una plantilla girada un cuarto de vuelta con otra posición del pedal; valida la posición sin mostrar los nombres de las razones transformadas.

**Predice:** un punto inicialmente arriba y a la derecha gira un cuarto de vuelta antihorario. ¿Qué lectura nueva coincide con la anterior lectura horizontal? A) La vertical, con el mismo signo **[correcta]**. B) La horizontal, con el mismo signo [R-COF]. C) La vertical, con signo opuesto [R-SIG]. D) Ninguna, porque ambas aumentan al acumular giro [R-GIR].

**Mira:** desplaza el punto y compara las dos proyecciones antes de escribir relaciones.

**La regla:** el cuarto de vuelta antihorario transforma las coordenadas $(x,y)$ en $(-y,x)$. De ahí:

$$\sin(90^\circ+\theta)=\cos\theta,\quad \cos(90^\circ+\theta)=-\sin\theta,\quad \tan(90^\circ+\theta)=-\cot\theta.$$

Para complementarios:

$$\sin(90^\circ-\theta)=\cos\theta,\quad \cos(90^\circ-\theta)=\sin\theta,\quad \tan(90^\circ-\theta)=\cot\theta.$$

Las parejas recíprocas son secante con cosecante y tangente con cotangente. Los cuartos de vuelta impares intercambian las parejas seno–coseno, tangente–cotangente y secante–cosecante; los pares mantienen la razón. El signo siempre se justifica con coordenadas o cuadrante, y toda igualdad se aplica en el dominio común. Repetir la transformación permite reducir cualquier múltiplo entero de $90^\circ$ sin aprender una lista desconectada.

**Palabras:** *complementarios*: dos ángulos que completan un ángulo recto; ejemplos: dos partes de una escuadra, dos ángulos agudos de un triángulo rectángulo, dos giros que juntos dan un cuarto de vuelta. *Cofunción*: razón compañera cuando se intercambian las direcciones; ejemplos: seno–coseno, tangente–cotangente, secante–cosecante.

**Así se resuelve:** reconocer cuartos de vuelta; decidir si hay intercambio; determinar signo mediante la posición; controlar existencia; simplificar solo después. **Ahora tú:** complementarios → cuarto de vuelta más un ángulo → reducción combinada con varias vueltas y cocientes.

## 6. Letras y símbolos

| Letra o símbolo | Significado | Unidad |
|---|---|---|
| $x,y$ | Coordenadas horizontal y vertical respecto del eje | Misma unidad de longitud |
| $r$ | Distancia positiva al eje de giro | Longitud |
| $\theta,\theta_0$ | Giro original y su representante en una vuelta | Grados en esta unidad |
| $\alpha$ | Ángulo agudo de referencia | Grados |
| $k$ | Número entero de vueltas completas | Sin unidad |
| $\sin,\cos,\tan,\cot,\sec,\csc$ | Seno, coseno, tangente, cotangente, secante y cosecante | Cocientes sin unidad |
| $^\circ$ | Grado sexagesimal | Unidad angular |

«sen» y «sin» nombran el mismo seno; se usa $\sin$ en las fórmulas por compatibilidad de notación matemática. $r$ no representa rango ni radio uno. $x$ no es todavía una variable angular.

## 7. Otras formas de explicarla

| Representación | Conviene para | Riesgo y control |
|---|---|---|
| Biela de bicicleta; diseño propio | Signos y giros | Confundir altura sobre el suelo con coordenada: fijar cero en el eje |
| Triángulo de referencia, como en OpenStax | Conectar razones agudas y ángulos mayores | Olvidar signos: distinguir longitudes y coordenadas |
| Reflexiones y cuartos de vuelta | Deducir reducción | Convertirlo en nueva receta: mostrar qué coordenada cambia |

## 8. Datos del mundo

La moneda de un sol de Toribio Rodríguez de Mendoza tiene diámetro de 25,50 mm según la ficha del BCRP de 2021. Puede acompañar una plantilla circular física; el radio se obtiene dividiendo el diámetro entre dos. No atribuir esas dimensiones al pedal. La bicicleta y sus dimensiones de actividad son modelos de diseño, no mediciones de una marca comercial.

## 9. Dudas y decisiones

Se conserva la etapa 9 antes de la circunferencia unitaria: se fundamenta en coordenadas y semejanza con radio cualquiera. El temario CEPRE-UNI consultado usa otro orden; no obliga a copiarlo. Se trabajará en grados aquí y se incorporarán radianes explícitamente en TR10. No se confirmó qué tipo es el más frecuente en una serie representativa de admisiones.

## 10. Fuentes

- UNI, Oficina Central de Admisión (2021; archivo publicado en 2022). *Solucionario del examen de admisión 2021*, Matemática 17. [PDF oficial](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario2021.pdf).
- CEPRE-UNI (2023). *Sílabo del ciclo básico 2023-2*, Trigonometría. [PDF oficial](https://www.cepre.uni.edu.pe/assets/archivos/comunicados/Syl_Bas_PS_2023-2.pdf).
- UNMSM (2023). *Reglamento de admisión 2023-I*, anexo de conocimientos. [PDF institucional](https://medicina.unmsm.edu.pe/wp-content/uploads/2023/02/Reglamento-de-Admision-2023-I.pdf).
- Weber, Keith (2005). *Students' Understanding of Trigonometric Functions*. Mathematics Education Research Journal, 17(3), 91–112. [Texto original](https://files.eric.ed.gov/fulltext/EJ747914.pdf).
- Abramson, Jay (2021). *Precalculus 2e*, §5.2. OpenStax. [Circunferencia, seno y coseno](https://openstax.org/books/precalculus-2e/pages/5-2-unit-circle-sine-and-cosine-functions).
- BCRP (2021). *Bicentenario 1821–2021: Toribio Rodríguez de Mendoza*, ficha numismática. [Ficha oficial](https://www.bcrp.gob.pe/docs/Billetes-Monedas/Monedas-de-Coleccion/bicentenario-2021/bicentenario-3-trdm.pdf).
