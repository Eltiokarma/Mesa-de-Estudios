# AR10 · Aritmética · Sucesiones y series numéricas

> Parte del documento de ChatGPT de las 32 unidades (21 nov 2026), por verificar. Cómo se leyó la evidencia y el contrato común de las escenas: `docs/investigacion/etapas-9-12/como-leer.md`.


## 1. Resumen en cinco líneas

Una sucesión asigna un término a cada posición.  
La regla puede expresarse directamente o mediante términos anteriores.  
Las progresiones aritmética y geométrica tienen estructuras diferentes.  
Una serie suma términos; no es otro nombre para sucesión.  
Lo más difícil es distinguir una regla declarada de una conjetura por pocos datos.

## 2. Qué se pregunta en los exámenes

| Tipo | Universidad | Dificultad | Frecuencia | Fuente |
|---|---|---|---|---|
| Progresiones y sumatorias | UNMSM | Media/alta | Temario histórico; no estimada | UNMSM, 6.6–6.8 |
| Secuencias, notación y series | UNI, CEPREUNI | Media/alta | Preparación curricular; no estimada | CEPREUNI |
| Suma con cancelaciones de radicales | UNI | Alta | Aparición 2021-1, Matemática 9 | UNI |
| Sucesiones lineales, cuadráticas y geométricas; series y sumatorias | CEPREUNA | Media/alta | Temario agosto–diciembre de 2026, semanas 12–13; no frecuencia de examen | PDF oficial indexado |

## 3. Errores típicos

| Código | Qué hace | Por qué | Estado | Fuente |
|---|---|---|---|---|
| S-IND | Cuenta un salto adicional | Confunde posición inicial y número de transiciones | Hipótesis | Diseño propio |
| S-MOD | Supone que toda lista sigue suma constante | Usa el primer patrón familiar | Hipótesis | Diseño propio |
| S-TOT | Confunde término con suma o aplica suma infinita sin condición | No distingue objeto y proceso de acumulación | Hipótesis | Diseño propio |
| S-FAC | Interpreta mal el efecto de repetir un factor | No distingue cantidad actual, factor y cambio entre pasos | Hipótesis | Diseño propio |

No se leyó una investigación original específica que permita afirmar la prevalencia de estos errores.

## 4. Lo que la unidad da por sabido

Operaciones, potencias, fracciones, ecuaciones lineales y lectura de índices. La convergencia se introduce solo en una ampliación al final de la idea 3.

## 5. Las ideas, en orden

### Idea 1. Posición y cambio — ¿Cuántos saltos hay hasta un término?

**Aprende:** la posición no coincide con el número de cambios desde el primer término.

**Lee / objeto:** filas de asientos de un pequeño auditorio. «Cada fila tiene una posición». «La cantidad de asientos es el valor de esa posición». «El organizador debe declarar cómo cambia cada fila».

**Juega:** construye las primeras filas añadiendo siempre el mismo número de asientos; valida la diferencia constante. No permite consultar una fila lejana.

**Predice:** para llegar desde la primera hasta la décima fila, ¿cuántos incrementos entre filas se realizan? A) Nueve **[correcta]**. B) Diez, contando la primera fila como un incremento [S-IND]. C) Once, contando además las dos filas extremas [S-IND]. D) Uno, confundiendo la posición final con una sola transición [S-IND].

**Mira:** cuenta las transiciones entre filas, no las filas.

**La regla:** $a_n$ es el término en la posición entera positiva $n$; $a_1$, el primero; $d$, la diferencia constante. En una progresión aritmética, $a_n=a_1+(n-1)d$. Una definición recurrente indica cómo obtener un término desde otro y necesita un valor inicial. Una lista finita no determina una única continuación sin una condición adicional. Si se declara un patrón cuadrático, las diferencias entre términos consecutivos forman una progresión aritmética. Hasta estudiar sumas, construir cada término acumulando esos incrementos por recurrencia; una coincidencia en pocos datos no demuestra un patrón único.

**Palabras:** *término*: valor en una posición; ejemplos: primer aforo, segunda cantidad, última fila. *Recurrencia*: instrucción para continuar desde lo anterior; ejemplos: sumar una cantidad, duplicar, sumar los dos anteriores.

**Así se resuelve:** identificar dos posiciones; dividir la diferencia de valores por la diferencia de índices para obtener $d$; recuperar $a_1$; hallar el término solicitado. **Ahora tú:** completar con regla → término lejano → datos no consecutivos.

### Idea 2. Multiplicar en cada paso — ¿Un aumento relativo equivale a uno fijo?

**Aprende:** una razón constante produce una progresión geométrica.

**Lee / objeto:** cintas de papel plegadas en mitades. «Cada pliegue establece un nuevo paso». «El tamaño restante se compara con el anterior». «Una cantidad fija y una fracción fija describen cambios diferentes».

**Juega:** corta sucesivamente a la mitad una tira virtual y registra tres longitudes; la vista no muestra una regla aditiva alternativa.

**Predice:** si una tira sigue reduciéndose a la mitad en cada paso, ¿cómo cambia la cantidad retirada en pasos sucesivos? A) Se hace menor **[correcta]**. B) Permanece constante, como en una resta fija [S-MOD]. C) Se duplica porque se sigue repitiendo la operación [S-FAC]. D) Se vuelve cero después del primer paso porque ya se hizo una mitad [S-FAC].

**Mira:** superpone los trozos retirados y compara sus tamaños.

**La regla:** $q$ es razón constante. Para $q\ne0$, una progresión geométrica cumple $a_n=a_1q^{n-1}$. Si $q=0$, se conserva el primer término dado y todos los posteriores son cero; no se evalúa $0^0$. El cociente de términos consecutivos identifica $q$ cuando el divisor no es cero. Con razón negativa alternan signos; con $q=1$ no cambia el valor. En una variación relativa $p$, expresada como fracción, el factor de aumento es $1+p$, y el de disminución $1-p$. La fórmula se deduce repitiendo la multiplicación.

**Palabras:** *razón*: factor entre términos consecutivos; ejemplos: duplicar, triplicar, tomar la mitad. *Alternancia*: cambio repetido de signo o condición; ejemplos: positivo/negativo, avance/retroceso, saldo a favor/en contra.

**Así se resuelve:** identificar $q$; contar $n-1$ multiplicaciones; escribir el término; comprobar contra el dato inicial y otro dato disponible. **Ahora tú:** razón → término intermedio → comparación de crecimiento aditivo y multiplicativo.

### Idea 3. Acumular — ¿Qué se suma y hasta dónde?

**Aprende:** una suma finita y una suma infinita requieren procedimientos y condiciones distintas.

**Lee / objeto:** frascos de ahorro ficticio, uno por día. «Cada frasco contiene el aporte de un día». «El total junta varios aportes». «La fecha de corte determina cuáles entran».

**Juega:** selecciona exactamente los primeros términos solicitados y suma sus fichas; solo hay una lista finita.

**Predice:** una lista que repite una cantidad positiva para siempre, ¿tiene una suma total finita? A) No **[correcta]**. B) Sí, siempre existe una fórmula finita [S-TOT]. C) Sí, porque todos los patrones se vuelven decrecientes [S-MOD]. D) Basta quitar el primer término para que termine [S-IND].

**Mira:** amplía el número de frascos y muestra que los totales siguen creciendo.

**La regla:** $S_n=\sum_{k=1}^{n}a_k$ es la suma de los primeros $n$ términos; $k$ recorre posiciones. Para progresión aritmética, $S_n=n(a_1+a_n)/2$, obtenida emparejando extremos. Para geométrica con $q\ne1$, $S_n=a_1(1-q^n)/(1-q)$, obtenida restando la suma multiplicada por $q$; si $q=1$, $S_n=na_1$. La suma geométrica infinita con $a_1\ne0$ converge solo si $\vert q\vert<1$, y vale $a_1/(1-q)$. Una suma telescópica se reescribe como diferencias que cancelan términos interiores; deben conservarse los extremos. Para la sucesión cuadrática con primer incremento $d_1$ y segunda diferencia constante $c$, acumular una progresión aritmética da $a_n=a_1+(n-1)d_1+c(n-1)(n-2)/2$. Se usa solo si ese modelo está declarado o justificado.

**Palabras:** *sumatoria*: instrucción abreviada para sumar; ejemplos: primeros días, primeras filas, aportes consecutivos. *Converger*: acercarse a un total finito; ejemplos: mitades sucesivas, tercios sucesivos, una serie geométrica con razón de magnitud menor que uno.

**Así se resuelve:** identificar el tipo; escribir primero y último término; contar entradas; deducir o seleccionar la suma; revisar que no se confundió $a_n$ con $S_n$. **Ahora tú:** suma finita → suma desde un índice distinto de uno → telescópica → convergencia geométrica.

## 6. Letras y símbolos

| Símbolo | Significado | Unidad / advertencia |
|---|---|---|
| $a_n,a_1$ | Término n y primero | Unidad de la lista |
| $n,k$ | Posición final e índice de suma | Enteros |
| $d,q,p$ | Diferencia, razón, cambio relativo | d conserva unidad; q y p no |
| $d_1,c$ | Primer incremento de la sucesión cuadrática y segunda diferencia constante | Unidad de la lista |
| $S_n,\sum,\infty$ | Suma parcial, sumatoria, infinito | S no significa área |

## 7. Otras formas de explicarla

Escaleras de fichas hacen visible la diferencia; no representan bien razones negativas. Tiras plegadas muestran disminución geométrica; su grosor físico impide plegados infinitos reales. Emparejar extremos justifica la suma aritmética. Apoyo: Abramson, 11.1 y 11.4; situaciones originales.

## 8. Datos del mundo

La denominación de un sol de la moneda BCRP permite expresar aportes discretos sin atribuir tasas de interés reales. Las secuencias de ahorro son decisiones hipotéticas; ninguna rentabilidad se presenta como oferta financiera.

## 9. Dudas y decisiones

La suma infinita es una ampliación conceptual, no requisito de las ideas 1 y 2. No enseñar que una diferencia de segundo orden constante observada en pocos datos demuestra una ley universal. El propietario debe decidir la profundidad de series telescópicas y patrones polinómicos.

## 10. Fuentes

- UNMSM (proceso 2023-I). *Reglamento de admisión*, 6.6–6.8. [Documento](https://medicina.unmsm.edu.pe/wp-content/uploads/2023/02/Reglamento-de-Admision-2023-I.pdf).
- UNI (2021). *Solucionario Admisión 2021-1*, Matemática 9. [Documento](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario2021.pdf).
- CEPREUNI (2023). *Sílabo básico 2023-2*. [Documento](https://www.cepre.uni.edu.pe/assets/archivos/comunicados/Syl_Bas_PS_2023-2.pdf).
- Abramson, Jay (autor principal; 2021). *Precalculus 2e*, [11.1, Sequences](https://openstax.org/books/precalculus-2e/pages/11-1-sequences-and-their-notations) y [11.4, Series](https://openstax.org/books/precalculus-2e/pages/11-4-series-and-their-notations).
- BCRP (2021). *Moneda: Toribio Rodríguez de Mendoza*. [Ficha](https://www.bcrp.gob.pe/docs/Billetes-Monedas/Monedas-de-Coleccion/bicentenario-2021/bicentenario-3-trdm.pdf).

---


- CEPREUNA (2026). *Temario del ciclo agosto–diciembre 2026*, semanas 12–13 de razonamiento matemático. [PDF oficial](https://sistemas.cepreuna.edu.pe/storage/documentos/08-2026/Temario-20260823_0732008ama.pdf). Contenido indexado; descarga directa no recuperada.
