# GE9 · Geometría · Puntos notables del triángulo

> Parte del documento de ChatGPT de las 32 unidades (21 nov 2026), por verificar. Cómo se leyó la evidencia y el contrato común de las escenas: `docs/investigacion/etapas-9-12/como-leer.md`.


## 1. Resumen en cinco líneas

Cada punto notable nace de una condición geométrica distinta.  
Las medianas, bisectrices, mediatrices y alturas no son intercambiables.  
Las distancias a lados se miden perpendicularmente.  
Algunos centros pueden quedar fuera del triángulo.  
La dificultad principal es abandonar el triángulo simétrico y horizontal como único modelo.

## 2. Qué se pregunta en los exámenes

| Tipo | Universidad | Dificultad | Frecuencia | Fuente |
|---|---|---|---|---|
| Identificar baricentro, incentro, excentro, circuncentro y ortocentro | UNMSM | Media | Temario histórico; no estimada | UNMSM, 9.4 |
| Relaciones de distancias, ángulos y posición de centros | UNI, CEPREUNI | Media/alta | Preparación curricular; sin conteo de preguntas | CEPREUNI |
| Elegir el centro que satisface una condición | Propuesta alineada | Alta | No se verificó un ítem oficial específico | Temarios; diseño original |

## 3. Errores típicos

| Código | Qué hace | Por qué | Estado | Fuente |
|---|---|---|---|---|
| C-ALT | Solo reconoce altura con base horizontal o interior | Dependencia de una figura prototípica | Documentado | Morales y Damián, 2021, preguntas 3–5 |
| C-REC | Confunde o representa mal las rectas notables | Conocimiento incompleto de sus condiciones | Documentado | Morales y Damián, 2021, preguntas 2–7 |
| C-CEN | Considera todos los centros interiores o equivalentes | Generaliza desde triángulos simétricos | Hipótesis para los distractores concretos | Diseño propio |

El estudio original corresponde a estudiantes de la Universidad Autónoma de Guerrero, México; no describe una muestra peruana.

## 4. Lo que la unidad da por sabido

Triángulos, perpendicularidad, punto medio, bisectriz angular, congruencia, semejanza y distancia punto-recta. La existencia de un triángulo exige desigualdad triangular.

## 5. Las ideas, en orden

### Idea 1. Encontrar el balance — ¿Qué punto reúne las medianas?

**Aprende:** la mediana une un vértice con el punto medio del lado opuesto.

**Lee / objeto:** placa triangular uniforme de cartón de una imprenta. «Los tres vértices delimitan la placa». «Un punto medio divide un lado en partes iguales». «El material del modelo tiene espesor y densidad uniformes».

**Juega:** marca los tres puntos medios y une cada uno con el vértice opuesto; éxito si las tres construcciones son correctas. Aún no se revela la razón de segmentos.

**Predice:** si la placa se vuelve escalena, ¿la mediana debe seguir siendo perpendicular al lado? A) No necesariamente **[correcta]**. B) Sí, porque toda mediana es altura [C-REC]. C) Sí, mientras la base esté horizontal [C-ALT]. D) Sí, porque todos los centros siempre coinciden [C-CEN].

**Mira:** deforma la placa conservando los puntos medios y compara con una perpendicular.

**La regla:** en el triángulo $ABC$, $M$ es punto medio de $BC$; $AM$ es mediana. Las tres medianas concurren en el baricentro $G$, siempre interior, y $AG:GM=2:1$. La relación se justifica mediante semejanza y segmentos medios. Coincide con el centro de masa solo para la lámina uniforme idealizada; no para cualquier placa con adornos o agujeros.

**Palabras:** *mediana*: unión hacia el punto medio opuesto; ejemplos: desde A, desde B, desde C. *Baricentro*: encuentro de las medianas; ejemplos: placa escalena, cartón isósceles, triángulo equilátero.

**Así se resuelve:** identificar vértice y punto medio; reconocer mediana; dividir el segmento total en tres partes de razón, dos hacia el vértice y una hacia el punto medio. **Ahora tú:** construcción → longitudes → combinación de medianas.

### Idea 2. Igual distancia a bordes — ¿Dónde cabe una circunferencia tangente a los tres lados?

**Aprende:** la equidistancia a lados conduce a bisectrices e incentro.

**Lee / objeto:** marco triangular de madera y disco ajustable. «El disco debe tocar tres bordes». «La distancia a un borde se mide perpendicularmente». «Un ángulo tiene una línea que lo reparte en dos iguales».

**Juega:** coloca un disco tangente a dos lados del marco; verifica dos distancias iguales. El tercer contacto y las bisectrices externas están ocultos.

**Predice:** un punto está a igual distancia de los tres vértices de un triángulo. ¿Eso garantiza que una circunferencia con ese centro sea tangente a los tres lados? A) No **[correcta]**. B) Sí, estar igualmente lejos de vértices equivale a estarlo de lados [C-REC]. C) Sí, toda mediatriz es una bisectriz [C-REC]. D) Sí, el circuncentro y el incentro siempre coinciden [C-CEN].

**Mira:** compara distancias a vértices y perpendiculares a lados en un triángulo escaleno.

**La regla:** las bisectrices interiores concurren en el incentro $I$, interior y equidistante de los lados; esa distancia $r$ es inradio. Si $\alpha$ es el ángulo en $A$, entonces $\angle BIC=90^\circ+\alpha/2$, deducido por suma angular. Una bisectriz interior y dos exteriores concurren en el excentro opuesto $I_A$, exterior y equidistante de las rectas de los lados; su circunferencia toca un lado y prolongaciones de los otros. La bisectriz interna de A divide BC en la razón $AB:AC$.

**Palabras:** *incentro*: punto igualmente alejado de los tres bordes; ejemplos: marco agudo, rectángulo triangular, triángulo obtuso. *Excentro*: centro de una circunferencia tangente por fuera; ejemplos: opuesto a A, opuesto a B, opuesto a C.

**Así se resuelve:** decidir si se comparan lados; trazar bisectrices pertinentes; usar mitades angulares; aplicar suma del triángulo; comprobar contacto perpendicular. **Ahora tú:** identificar → ángulo central entre bisectrices → excentro y prolongaciones.

### Idea 3. Igual distancia a esquinas — ¿Dónde se sitúa el circuncentro?

**Aprende:** la mediatriz compara distancias a los extremos de un segmento.

**Lee / objeto:** plantilla triangular con tres perforaciones para fijar un aro. «Las perforaciones representan vértices». «El aro debe pasar por las tres». «Su centro se busca con distancias iguales».

**Juega:** mueve un punto hasta quedar equidistante de dos perforaciones; valida esa igualdad en varias posiciones. No se presenta todavía un triángulo obtuso.

**Predice:** en un triángulo obtuso, ¿dónde puede quedar el centro de la circunferencia que pasa por los tres vértices? A) Fuera del triángulo **[correcta]**. B) Siempre dentro, porque es un centro [C-CEN]. C) Siempre en el punto de encuentro de las bisectrices [C-REC]. D) Su posición interior o exterior cambia al rotar la hoja [C-ALT].

**Mira:** activa el tercer vértice y deforma el triángulo de agudo a obtuso.

**La regla:** una mediatriz es perpendicular a un segmento en su punto medio. Las tres mediatrices concurren en el circuncentro $O$, con $OA=OB=OC=R$, siendo $R$ circunradio. O es interior si el triángulo es agudo, el punto medio de la hipotenusa si es rectángulo y exterior si es obtuso. La mediatriz no necesita pasar por el vértice opuesto.

**Palabras:** *mediatriz*: línea que reúne puntos igualmente lejos de dos extremos; ejemplos: lado AB, lado BC, lado CA. *Circunradio*: distancia del centro a cada vértice; ejemplos: OA, OB, OC.

**Así se resuelve:** escoger dos lados; construir sus mediatrices; hallar intersección; verificar la tercera distancia; decidir ubicación según ángulos. **Ahora tú:** reconocer condición → radio en triángulo rectángulo → posición exterior.

### Idea 4. Perpendiculares desde vértices — ¿Una altura puede caer en una prolongación?

**Aprende:** la altura se define respecto de la recta del lado, incluso fuera del segmento.

**Lee / objeto:** tijeral triangular dibujado sobre una mesa de carpintería, con escuadra. «La escuadra comprueba un ángulo recto». «Una recta continúa más allá del lado». «Girar la pieza no cambia sus propiedades».

**Juega:** coloca escuadras para construir alturas en un triángulo agudo girado; valida perpendicularidad y paso por vértice. El caso obtuso está bloqueado.

**Predice:** en un triángulo obtuso, ¿debe rechazarse una altura que llega a la prolongación del lado? A) No **[correcta]**. B) Sí, todas deben ser internas [C-ALT]. C) Sí, basta unir cualquier punto medio [C-REC]. D) Sí, el ortocentro siempre coincide con los otros centros [C-CEN].

**Mira:** prolonga lados y muestra el cruce exterior de las alturas.

**La regla:** las tres alturas concurren en el ortocentro $H$. Es interior en el triángulo agudo, el vértice recto en el rectángulo y exterior en el obtuso. En un triángulo no equilátero, $O,G,H$ están en la recta de Euler y $OG:GH=1:2$; en el equilátero coinciden y no queda una recta única determinada por ellos. Esta relación se demuestra después de construir los tres puntos, usando la homotecia del triángulo de puntos medios.

**Palabras:** *altura*: perpendicular desde un vértice a la recta opuesta; ejemplos: interior, sobre un lado del rectángulo, exterior en obtuso. *Concurrencia*: varias rectas que se encuentran en un punto; ejemplos: medianas, alturas, bisectrices interiores.

**Así se resuelve:** elegir lado de referencia; prolongarlo si hace falta; construir dos alturas; localizar H; comprobar tercera; usar Euler solo si todos los puntos están identificados. **Ahora tú:** construcción girada → clasificación → razón en recta de Euler.

## 6. Letras y símbolos

| Símbolo | Significado | Unidad / advertencia |
|---|---|---|
| $A,B,C,M$ | Vértices y punto medio de BC | Puntos, no medidas |
| $G,I,I_A,O,H$ | Baricentro, incentro, excentro, circuncentro, ortocentro | No intercambiar G con gravedad ni H con pie de altura |
| $r,R,\alpha$ | Inradio, circunradio, ángulo en A | Longitud; longitud; grados |
| $AB,\angle,:$ | Longitud entre puntos, ángulo, razón | Convenciones |

## 7. Otras formas de explicarla

Plegar papel construye mediatrices y bisectrices con gestos distintos; si se usan solo triángulos simétricos, parecen la misma recta. Apoyar una lámina explica el baricentro solo si es uniforme. Construcciones dinámicas que giran y deforman triángulos permiten contrastar definiciones; no se tomarán coincidencias visuales como prueba. La necesidad de variar posiciones se apoya en los errores descritos por Morales y Damián.

## 8. Datos del mundo

FIVB establece una cancha rectangular de 18 por 9 m. Tres esquinas pueden proporcionar un triángulo rectángulo de referencia para el circuncentro, sin atribuir medidas a una cancha escolar real. Los tijerales y marcos de las escenas tienen dimensiones ficticias y no constituyen diseño estructural.

## 9. Dudas y decisiones

La recta de Euler es el tramo avanzado. No se introducen identidades adicionales entre inradio y circunradio que luego no se practicarán. Los puntos de equilibrio reales requieren uniformidad; la escena debe mostrarla. Falta una muestra oficial reciente para estimar frecuencia de cada centro.

## 10. Fuentes

- UNMSM (proceso 2023-I). *Reglamento de admisión*, Geometría 9.4. [Documento](https://medicina.unmsm.edu.pe/wp-content/uploads/2023/02/Reglamento-de-Admision-2023-I.pdf).
- CEPREUNI (2023). *Sílabo básico 2023-2*, Geometría. [Documento](https://www.cepre.uni.edu.pe/assets/archivos/comunicados/Syl_Bas_PS_2023-2.pdf).
- Morales Carballo, A.; Damián Mojica, A. (2021). *Errores y dificultades acerca de las rectas notables del triángulo. Etapa preliminar para la elaboración de trayectorias de aprendizaje*, UNIÓN 17(61). [Original](https://funes.uniandes.edu.co/wp-content/uploads/tainacan-items/32454/1190366/Morales2021Errores.pdf).
- FIVB (2025). *Official Volleyball Rules 2025–2028*, 1.1. [Documento](https://www.fivb.com/wp-content/uploads/2025/01/FIVB-Volleyball_Rules2025_2028-EN-v05.pdf).
