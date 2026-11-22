# RM11 · Razonamiento matemático · Máximos y mínimos

> Parte del documento de ChatGPT de las 32 unidades (21 nov 2026), por verificar. Cómo se leyó la evidencia y el contrato común de las escenas: `docs/investigacion/etapas-9-12/como-leer.md`.


## 1. Resumen en cinco líneas

Optimizar exige definir qué cantidad se busca aumentar o reducir.  
Una cota limita lo posible, pero hay que demostrar que se alcanza.  
Los valores enteros pueden cambiar la solución de un modelo continuo.  
Una garantía se analiza en el peor caso, no en el promedio.  
La dificultad principal es distinguir una buena configuración de una configuración óptima.

## 2. Qué se pregunta en los exámenes

| Tipo | Universidad | Dificultad | Frecuencia | Fuente |
|---|---|---|---|---|
| Problemas de máximos y mínimos | UNMSM | Media/alta | Temario histórico; no estimada | UNMSM, Habilidad lógico-matemática 1.2 |
| Cotas, enteros y configuraciones extremas | Propuesta de preparación | Alta | Sin ítem UNI específico verificado | Diseño alineado al tema |
| Certeza mediante distribución en categorías | Ampliación conceptual del tema | Alta | No se atribuye frecuencia | Deducción incluida en esta propuesta |

## 3. Errores típicos

| Código | Qué hace | Por qué | Estado | Fuente |
|---|---|---|---|---|
| X-COT | Da una cota sin construir un caso que la alcance | Confunde «no puede superar» con «máximo» | Hipótesis | Diseño propio |
| X-ENT | Acepta una solución continua para conteos | Omite integridad o factibilidad | Hipótesis | Diseño propio |
| X-GAR | Usa un caso favorable o promedio para garantizar | Confunde posible con seguro | Hipótesis | Diseño propio |
| X-LAD | Maximiza un lado sin considerar el otro | Confunde una dimensión con el producto que determina área | Hipótesis | Diseño propio |
| X-PER | Supone área fija al fijar perímetro | Confunde superficie y longitud de borde | Hipótesis | Diseño propio |

No se encontró evidencia original específica suficiente sobre estos distractores en pruebas de admisión.

## 4. Lo que la unidad da por sabido

Orden, división entera, operaciones, ecuaciones, área de rectángulos y cuadrados algebraicos. No se usa cálculo diferencial.

## 5. Las ideas, en orden

### Idea 1. Límite y construcción — ¿Cuándo una respuesta es realmente mínima?

**Aprende:** combina una imposibilidad de mejorar con una configuración alcanzable.

**Lee / objeto:** cajas con capacidad fija para transportar frutas. «La capacidad limita cada caja». «Todas las frutas deben viajar». «Una solución válida debe poder construirse».

**Juega:** distribuye una cantidad múltiplo de la capacidad en el menor número de cajas; la validación revisa ocupación. No se presenta un resto.

**Predice:** hay trece frutas y en cada caja caben como máximo seis. ¿Qué mínimo de cajas permite transportarlas todas? A) Tres **[correcta]**. B) Dos, ignorando la fruta restante [X-ENT]. C) Trece sextos de caja, aceptando un conteo fraccionario [X-ENT]. D) Cuatro, una solución factible pero sin justificar que sea mínima [X-COT].

**Mira:** intenta dos cajas, muestra la fruta fuera y construye el caso con tres.

**La regla:** N es total, c capacidad positiva entera y b número de cajas. Debe cumplirse $bc\ge N$; el mínimo es $b=\lceil N/c\rceil$, donde techo significa menor entero mayor o igual al cociente. Para demostrar mínimo: probar que una caja menos no basta y mostrar distribución válida con b. Una cota sin ejemplo alcanzable no cierra la demostración.

**Palabras:** *cota*: límite de lo posible; ejemplos: capacidad total, máximo por caja, mínimo de recipientes. *Factible*: que cumple todas las restricciones; ejemplos: sin sobrecarga, sin frutas fuera, con cajas enteras.

**Así se resuelve:** escribir capacidad; hallar cota entera; intentar una unidad menos; construir la distribución que alcanza la cota. **Ahora tú:** capacidad → restricciones simultáneas → cota no alcanzable.

### Idea 2. Comparar configuraciones — ¿Cómo demostrar un máximo sin probarlo todo?

**Aprende:** usa una desigualdad derivada para justificar el óptimo.

**Lee / objeto:** cerco rectangular de una huerta de maqueta con longitud total fija. «El borde consume material». «La superficie útil es el objetivo». «Cambiar un lado obliga a cambiar otro».

**Juega:** construye rectángulos con el mismo perímetro y registra lados; el área permanece oculta.

**Predice:** entre los rectángulos de un mismo perímetro, con lados positivos y sin otras restricciones, ¿cuál alcanza la mayor área? A) El cuadrado **[correcta]**. B) El de un lado tan largo como sea posible, ignorando el otro [X-LAD]. C) Todos tienen igual área por tener igual perímetro [X-PER]. D) Ninguno puede alcanzar un máximo porque una cota nunca se alcanza [X-COT].

**Mira:** muestra áreas y una comparación por diferencias cuadradas.

**La regla:** x e y son lados positivos, s su suma fija y A el área. $x+y=s$, $A=xy$. Como $(x-y)^2\ge0$, $xy\le s^2/4$, con igualdad exactamente cuando $x=y=s/2$. Para lados enteros, buscar los enteros admisibles más cercanos entre sí y verificar restricciones. Si una función cuadrática tiene coeficiente negativo, completar el cuadrado identifica su máximo; después debe revisarse el intervalo permitido.

**Palabras:** *objetivo*: cantidad que se optimiza; ejemplos: área, costo ficticio, cantidad de piezas. *Extremo*: mayor o menor valor permitido; ejemplos: máximo alcanzado, mínimo entero, límite en una frontera.

**Así se resuelve:** fijar restricción; expresar área con una variable; completar cuadrado o usar la desigualdad; verificar igualdad y dominio. **Ahora tú:** producto con suma fija → valores enteros → intervalo que excluye el óptimo libre.

### Idea 3. Asegurar en el peor caso — ¿Cuánto basta para garantizar?

**Aprende:** una garantía debe resistir la distribución más desfavorable.

**Lee / objeto:** cajón con medias de dos colores, sin mirar durante la extracción. «Una extracción puede salir de varios colores». «Una garantía vale para cualquier orden permitido». «La reserva de cada color se declara suficiente».

**Juega:** simula extracciones con color visible y consigue un par; no calcula aún garantía sin mirar.

**Predice:** en una bolsa hay medias de dos colores, al menos dos de cada uno. ¿Cuántas extracciones sin mirar garantizan dos del mismo color? A) Tres **[correcta]**. B) Dos, porque a veces sale un par [X-GAR]. C) Cuatro como supuesto mínimo, sin probar si tres ya bastan [X-COT]. D) No existe garantía porque cualquier extracción es incierta [X-GAR].

**Mira:** construye el caso desfavorable de colores distintos y muestra que la siguiente coincide con alguno.

**La regla:** con k categorías, si se colocan más de $k(r-1)$ objetos, alguna categoría contiene al menos r. La garantía mínima bajo disponibilidad suficiente es $k(r-1)+1$: se demuestra construyendo primero la distribución con r−1 en cada categoría. Si hay existencias limitadas, capacidades distintas o se exige un color específico, recalcular el peor caso; no aplicar la fórmula sin revisar.

**Palabras:** *garantía*: resultado inevitable bajo las condiciones; ejemplos: par del mismo color, categoría repetida, recipiente que supera una cantidad. *Peor caso*: organización que retrasa el objetivo; ejemplos: colores alternados, reparto equilibrado, extracción de todos los no deseados primero.

**Así se resuelve:** definir objetivo; construir máximo número de extracciones que aún lo evitan; añadir una; demostrar que basta. **Ahora tú:** dos categorías → varias → inventarios desiguales y objetivo específico.

## 6. Letras y símbolos

| Símbolo | Significado | Unidad / advertencia |
|---|---|---|
| $N,c,b$ | Total, capacidad, cajas | Conteos |
| $x,y,s,A$ | Lados, suma de lados, área | Longitud, longitud, longitud, superficie |
| $k,r$ | Categorías, cantidad objetivo en una categoría | Enteros positivos |
| $\lceil\ \rceil,\ge,\le$ | Techo y relaciones de orden | Operadores |

## 7. Otras formas de explicarla

Construir un caso límite hace verificable el óptimo. El cerco muestra suma fija, pero no representa costos diferentes de materiales sin añadir datos. El cajón muestra garantía, no probabilidad promedio; las animaciones aleatorias solas no prueban un peor caso. Todas son propuestas originales con demostración incluida.

## 8. Datos del mundo

La cancha FIVB de 18 por 9 m ofrece un rectángulo real para comparar perímetro y área. La optimización del cerco es un problema matemático independiente: no se afirma que una cancha deba cambiar de forma ni que sus dimensiones maximicen área.

## 9. Dudas y decisiones

No incluye programación lineal formal ni cálculo. Debe confirmarse si «certezas» será parte de esta unidad o de otra; se incluye como tercer modo de razonamiento extremo. No se confirmó frecuencia UNI específica.

## 10. Fuentes

- UNMSM (proceso 2023-I). *Reglamento de admisión*, Habilidad lógico-matemática 1.2. [Documento](https://medicina.unmsm.edu.pe/wp-content/uploads/2023/02/Reglamento-de-Admision-2023-I.pdf).
- FIVB (2025). *Official Volleyball Rules 2025–2028*, 1.1. [Documento](https://www.fivb.com/wp-content/uploads/2025/01/FIVB-Volleyball_Rules2025_2028-EN-v05.pdf).
- Las cotas, desigualdad de producto y garantía se deducen en esta propuesta; no se atribuyen a un estudio empírico ni a un problema copiado.
