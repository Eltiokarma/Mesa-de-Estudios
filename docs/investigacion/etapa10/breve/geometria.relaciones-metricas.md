# GE10 · Geometría · Relaciones métricas

> Parte del documento de ChatGPT de las 32 unidades (21 nov 2026), por verificar. Cómo se leyó la evidencia y el contrato común de las escenas: `docs/investigacion/etapas-9-12/como-leer.md`.


## 1. Resumen en cinco líneas

Las longitudes desconocidas se relacionan por semejanza y geometría del triángulo.  
El triángulo rectángulo requiere identificar hipotenusa, catetos y proyecciones.  
En triángulos generales se elige entre mediana, bisectriz y otras relaciones.  
En circunferencias se distinguen segmentos interiores, exteriores y totales.  
Lo más difícil es asociar cada fórmula con una configuración válida.

## 2. Qué se pregunta en los exámenes

| Tipo | Universidad | Dificultad | Frecuencia | Fuente |
|---|---|---|---|---|
| Pitágoras, mediana, bisectriz, métricas de triángulo y circunferencia | UNMSM | Media/alta | Temario histórico; no estimada | UNMSM, 10.3–10.6 |
| Configuración con semicircunferencias y tangencia | UNI | Alta | Aparición 2021-1, Matemática 13 | UNI |
| Seleccionar relación a partir de proyecciones y secantes | UNI, CEPREUNI | Alta | Preparación curricular | CEPREUNI |

## 3. Errores típicos

| Código | Qué hace | Por qué | Estado | Fuente |
|---|---|---|---|---|
| L-HIP | Usa Pitágoras sin ángulo recto o toma mal la hipotenusa | Decide por la apariencia del dibujo | Hipótesis | Diseño propio |
| L-COR | Empareja segmentos no correspondientes | Memoriza letras en vez de semejanzas | Hipótesis | Diseño propio |
| L-TOT | Confunde tramo exterior con secante completa | No identifica los extremos de cada medida | Hipótesis | Diseño propio |

No se atribuyen estos errores específicos al estudio de rectas notables: sería extender su resultado más allá de lo leído.

## 4. Lo que la unidad da por sabido

Semejanza, ángulos inscritos, tangencia, ecuaciones cuadráticas, razones trigonométricas elementales y puntos notables. Las proyecciones se construyen aquí antes de usarse.

## 5. Las ideas, en orden

### Idea 1. Proyectar sobre la hipotenusa — ¿De dónde salen los productos de segmentos?

**Aprende:** las relaciones métricas del rectángulo son consecuencias de semejanza.

**Lee / objeto:** escuadra triangular de carpintería con una cinta perpendicular al lado largo. «La escuadra fija un ángulo recto». «La cinta llega perpendicularmente al lado opuesto». «Su pie divide ese lado».

**Juega:** ubica el pie de la perpendicular y empareja los ángulos de los tres triángulos; valida correspondencia. No muestra productos de longitudes.

**Predice:** al comparar un triángulo pequeño con el grande semejante, ¿qué criterio permite emparejar sus lados? A) Los ángulos correspondientes **[correcta]**. B) Que ambos lados se vean horizontales [L-COR]. C) Que ambos lados ocupen la izquierda del dibujo [L-COR]. D) Que los lados tengan igual longitud, aunque los triángulos sean de distinto tamaño [L-COR].

**Mira:** gira por separado los triángulos y conserva las marcas de ángulos iguales.

**La regla:** en $ABC$ recto en $A$, $a=BC$, $b=CA$, $c=AB$. Si $D$ es pie de la altura, $h=AD$, $p=BD$, $q=DC$, entonces $a=p+q$, $b^2=aq$, $c^2=ap$, $h^2=pq$, $bc=ah$ y $a^2=b^2+c^2$. Se deducen emparejando lados de triángulos semejantes; $bc=ah$ también iguala dos expresiones del área.

**Palabras:** *proyección*: tramo que deja una perpendicular sobre una recta; ejemplos: BD, DC, proyección de un cateto. *Hipotenusa*: lado opuesto al ángulo recto; ejemplos: lado largo de escuadra, diagonal de rectángulo, diámetro de un triángulo inscrito rectángulo.

**Así se resuelve:** marcar ángulo recto; identificar cateto y su proyección; seleccionar la igualdad que los une; despejar una longitud positiva; comprobar Pitágoras. **Ahora tú:** una relación → dos relaciones → configuración girada.

### Idea 2. Triángulos sin ángulo recto — ¿Qué información aporta una ceviana?

**Aprende:** cada segmento interior exige una relación acorde con su definición.

**Lee / objeto:** soporte triangular con una varilla desde un vértice al lado opuesto. «La varilla puede llegar a distintos puntos». «Un punto medio y una bisectriz imponen condiciones diferentes». «No se supone un ángulo recto sin marca».

**Juega:** ubica la varilla como mediana y luego como bisectriz usando condiciones geométricas, sin mostrar longitudes calculadas.

**Predice:** una bisectriz parte desde el vértice comprendido entre dos lados desiguales. ¿Qué relación se espera entre los dos tramos del lado opuesto? A) Su razón coincide con la de los lados adyacentes correspondientes **[correcta]**. B) Son necesariamente iguales, como si fuera mediana [L-COR]. C) Su razón se obtiene emparejándolos con los lados adyacentes al revés [L-COR]. D) Cada tramo mide lo mismo que todo el lado opuesto [L-TOT].

**Mira:** compara división en mitades con división en la razón de los lados adyacentes.

**La regla:** se conservan $a=BC,b=CA,c=AB$, ahora sin exigir ángulo recto. Con $\alpha=\angle A$, $a^2=b^2+c^2-2bc\cos\alpha$. La mediana de longitud $m_a$ cumple $m_a^2=(2b^2+2c^2-a^2)/4$. Si $AD$ es bisectriz, $BD/DC=c/b$ y su longitud $\ell_a$ cumple $\ell_a^2=bc[1-a^2/(b+c)^2]$. Para una ceviana general $AD=d$, con $u=BD,v=DC$, Stewart da $b^2u+c^2v=a(d^2+uv)$. Cada caso se deriva al trazar una perpendicular y aplicar Pitágoras en los triángulos resultantes.

**Palabras:** *ceviana*: segmento de vértice a lado opuesto; ejemplos: mediana, bisectriz interior, otra varilla AD. *Correspondencia*: emparejamiento según la configuración; ejemplos: lado opuesto a ángulo, cateto con proyección, bisectriz con lados adyacentes.

**Así se resuelve:** identificar qué define AD; elegir fórmula que contiene los datos; sustituir segmentos con sus extremos; resolver y revisar desigualdad triangular. **Ahora tú:** mediana → bisectriz → ceviana general o comparación angular.

### Idea 3. Productos sobre una circunferencia — ¿Qué segmentos se multiplican?

**Aprende:** la posición del punto determina cómo se leen cuerdas, secantes y tangentes.

**Lee / objeto:** aro de taller atravesado por dos reglas. «Las reglas cortan el aro». «Un punto de cruce puede estar dentro o fuera». «Cada medida tiene dos extremos visibles».

**Juega:** marca segmentos de dos cuerdas que se cruzan dentro; valida extremos y no permite cruce exterior.

**Predice:** desde un punto exterior se trazan dos secantes. En cada secante, ¿qué par de longitudes forma el producto que se compara? A) Tramo exterior y secante completa **[correcta]**. B) Tramo exterior y tramo interior [L-TOT]. C) Tramo interior consigo mismo [L-TOT]. D) Secante completa consigo misma [L-TOT].

**Mira:** desplaza el cruce al exterior y colorea el tramo completo desde ese punto hasta la intersección lejana.

**La regla:** con $P$ punto interior de intersección de cuerdas AB y CD, $PA\cdot PB=PC\cdot PD$. Con P exterior y A,C intersecciones cercanas, B,D lejanas, $PA\cdot PB=PC\cdot PD=PT^2$, si PT es tangente en T. Los segmentos son longitudes positivas en estas configuraciones separadas; no se mezcla su versión con segmentos dirigidos. La tangente es perpendicular al radio en T. Los productos proceden de triángulos semejantes por ángulos inscritos y de tangencia.

**Palabras:** *secante*: recta que corta la circunferencia en dos puntos; ejemplos: regla atravesando aro, recta por el centro, corte oblicuo. *Tangente*: recta que toca la circunferencia en un punto; ejemplos: borde de apoyo, regla exterior, lado de un marco tangente.

**Así se resuelve:** decidir posición de P; marcar cercanos y lejanos; sumar tramos para obtener longitud total; escribir producto; resolver longitud positiva y verificar orden de puntos. **Ahora tú:** cuerdas → dos secantes → tangente-secante y radios auxiliares.

## 6. Letras y símbolos

| Símbolo | Significado | Unidad / advertencia |
|---|---|---|
| $A,B,C,D,P,T$ | Puntos geométricos según construcción | T es punto de tangencia |
| $a,b,c$ | Lados BC, CA, AB | Longitud |
| $h,p,q$ | Altura y proyecciones del rectángulo | Longitud |
| $m_a,\ell_a,d,u,v$ | Mediana, bisectriz, ceviana y sus tramos | Longitud; m no es masa |
| $\alpha,\cos$ | Ángulo en A y coseno | Grados en la ficha |

## 7. Otras formas de explicarla

Triángulos recortados permiten ver semejanza, pero no deformarlos al superponer. Una tabla «dato–relación–condición» ayuda a escoger fórmulas; no debe sustituir identificar segmentos. El producto de dos longitudes puede dibujarse como área de un rectángulo auxiliar, sin afirmar que ese rectángulo forma parte del dibujo original. Referencias: Euclides VI.8, III.35 y II.13.

## 8. Datos del mundo

El diámetro nominal de la moneda BCRP de la ficha de 2021 es 25,50 mm. Puede proporcionar una escala real a un círculo idealizado; no se mide una tangencia exacta con una foto ni se supone exactitud ilimitada del borde físico.

## 9. Dudas y decisiones

Stewart queda en el nivel avanzado por carga algebraica. No se trasladan fórmulas del triángulo rectángulo a uno general. La notación de proyecciones se fija por extremos para evitar variantes de academia incompatibles. Frecuencia por subtema no confirmada.

## 10. Fuentes

- UNMSM (proceso 2023-I). *Reglamento de admisión*, 10.3–10.6. [Documento](https://medicina.unmsm.edu.pe/wp-content/uploads/2023/02/Reglamento-de-Admision-2023-I.pdf).
- CEPREUNI (2023). *Sílabo básico 2023-2*. [Documento](https://www.cepre.uni.edu.pe/assets/archivos/comunicados/Syl_Bas_PS_2023-2.pdf).
- UNI (2021). *Solucionario Admisión 2021-1*, Matemática 13. [Documento](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario2021.pdf).
- Euclides (ca. 300 a. C.); edición digital de D. E. Joyce (1996–1998). *Elements*, [VI.8](https://mathcs.clarku.edu/~djoyce/elements/bookVI/propVI8.html), [III.35](https://mathcs.clarku.edu/~djoyce/elements/bookIII/propIII35.html), [II.13](https://mathcs.clarku.edu/~djoyce/elements/bookII/propII13.html).
- BCRP (2021). *Moneda: Toribio Rodríguez de Mendoza*. [Ficha](https://www.bcrp.gob.pe/docs/Billetes-Monedas/Monedas-de-Coleccion/bicentenario-2021/bicentenario-3-trdm.pdf).
