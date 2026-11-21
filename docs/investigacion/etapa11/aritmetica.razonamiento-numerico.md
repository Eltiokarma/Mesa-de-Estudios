# AR11 · Aritmética · Problemas de razonamiento numérico

> Parte del documento de ChatGPT de las 32 unidades (21 nov 2026), por verificar. Cómo se leyó la evidencia y el contrato común de las escenas: `docs/investigacion/etapas-9-12/como-leer.md`.


## 1. Resumen en cinco líneas

Se elige una estructura numérica antes de calcular.  
Los totales y cambios se reconstruyen mediante operaciones inversas.  
La división entera exige interpretar cociente y resto.  
La numeración posicional ayuda a razonar con cifras sin confundirlas con números.  
La dificultad es decidir qué operación representa la situación y comprobar su sentido.

## 2. Qué se pregunta en los exámenes

| Tipo | Universidad | Dificultad | Frecuencia | Fuente |
|---|---|---|---|---|
| Operaciones, enteros y algoritmo de división | UNMSM | Media | Temario histórico; no estimada | UNMSM, Aritmética 2–3 |
| Cambio de base y valor posicional | UNI | Media/alta | Aparición 2021-1, Matemática 3 | UNI |
| Razonamiento con operaciones y datos suficientes | UNI, CEPREUNI | Alta | Preparación y ejemplos de primera prueba; no estimada | CEPREUNI; UNI |

## 3. Errores típicos

| Código | Qué hace | Por qué | Estado | Fuente |
|---|---|---|---|---|
| N-INV | Deshace operaciones en el mismo orden | Repite la narración sin invertir su estructura | Hipótesis | Diseño propio |
| N-ENT | Acepta una cantidad fraccionaria de objetos indivisibles | Confunde resultado aritmético y respuesta contextual | Hipótesis | Diseño propio |
| N-POS | Suma cifras como si no importara su posición | Trata la escritura como lista de etiquetas | Hipótesis | Diseño propio |

No se encontró una investigación original específica para esta unidad de límites curriculares amplios. No se atribuye a una población la frecuencia de estos distractores.

## 4. Lo que la unidad da por sabido

Cuatro operaciones, fracciones, potencias naturales, operaciones inversas y lectura de problemas breves. El planteo verbal extenso se reserva a RM10.

## 5. Las ideas, en orden

### Idea 1. Deshacer una cadena — ¿Por dónde se empieza a recuperar el inicio?

**Aprende:** la recuperación invierte el orden de operaciones reversibles.

**Lee / objeto:** bandeja de un puesto que recibe y entrega paquetes. «El inventario cambia en pasos». «Cada paso tiene una entrada y una salida». «El último estado no cuenta por sí solo toda la historia».

**Juega:** ejecuta una cadena de añadir y multiplicar cantidades con botones; alcanza un total objetivo conocido desde el inicio. No se habilita la reconstrucción inversa.

**Predice:** para recuperar el inicio de una cadena de operaciones reversibles desde su resultado final, ¿qué se deshace primero? A) La última operación realizada **[correcta]**. B) La primera operación realizada [N-INV]. C) Cualquiera, porque el orden de las inversas nunca importa [N-INV]. D) Se repite la última operación en el mismo sentido [N-INV].

**Mira:** rebobina la secuencia y muestra cada estado recuperado.

**La regla:** $x$ es cantidad inicial, $a$ cantidad añadida, $b\ne0$ factor y $y$ resultado. Si $y=b(x+a)$, entonces $x=y/b-a$: primero se deshace la multiplicación y después la suma. Una operación no reversible, como descartar información o redondear, puede impedir una solución única. Se conservan unidades y restricciones del inventario.

**Palabras:** *inversa*: operación que deshace otra; ejemplos: restar lo añadido, dividir lo multiplicado, sumar lo retirado. *Estado*: cantidad en un momento; ejemplos: inicial, intermedio, final.

**Así se resuelve:** dibujar tres casillas de estado; anotar operaciones entre ellas; recorrerlas al revés con inversas; volver hacia adelante para comprobar. **Ahora tú:** un cambio → cadena de cambios → pérdida de información y falta de unicidad.

### Idea 2. Lo que sobra — ¿Cuándo hay que redondear y hacia dónde?

**Aprende:** el resto decide entre grupos completos, sobrantes o capacidad adicional.

**Lee / objeto:** cajas para empacar frutas por unidades. «Cada caja admite una cantidad fija». «Puede quedar fruta fuera de las cajas completas». «La pregunta decide si se cuentan cajas llenas o cajas necesarias».

**Juega:** llena cajas y deja visibles las unidades sobrantes; cumple la misión de maximizar cajas completas. No se pregunta aún por transportar todo.

**Predice:** si quedan frutas después de llenar varias cajas y todas deben viajar, respetando la capacidad, ¿qué se necesita? A) Una caja adicional **[correcta]**. B) Solo las cajas llenas: se ignora el resto [N-ENT]. C) Una fracción de caja como respuesta final de un conteo de cajas indivisibles [N-ENT]. D) Una caja menos: se redondea siempre hacia abajo [N-ENT].

**Mira:** coloca los sobrantes en una caja adicional y compara las dos preguntas.

**La regla:** $N$ es total entero no negativo; $d>0$, capacidad entera; $q$, cociente; $r$, resto. La división euclídea cumple $N=dq+r$, con $0\le r<d$. Hay $q$ grupos completos y, si se debe alojar todo, $q+1$ grupos cuando $r>0$. Las restricciones no se resuelven con redondeo automático: dependen de qué se pregunta.

**Palabras:** *cociente*: cuántos grupos completos caben; ejemplos: cajas llenas, equipos completos, paquetes iguales. *Resto*: unidades que quedan; ejemplos: frutas sueltas, asientos sin ocupar en el último vehículo, fichas sin agrupar.

**Así se resuelve:** identificar total y capacidad; dividir; expresar cociente y resto; escoger la interpretación; reconstruir el total. **Ahora tú:** reparto → transporte completo → compatibilidad de restos y límites.

### Idea 3. Cifra y valor — ¿Por qué cambiar una cifra de sitio cambia el número?

**Aprende:** cada posición tiene un peso determinado por la base.

**Lee / objeto:** ábaco escolar con columnas. «Cada columna agrupa unidades». «Una ficha cambia de valor según la columna». «El símbolo escrito debe caber en la base elegida».

**Juega:** representa números pequeños con una base fija y cambia grupos completos a la siguiente columna; valida equivalencia. No se permite invertir cifras.

**Predice:** al intercambiar las dos cifras no nulas y distintas de un número de dos cifras, ¿qué ocurre con su valor? A) Cambia porque cambia el valor de posición **[correcta]**. B) Es el mismo porque se mantienen las cifras [N-POS]. C) Se obtiene siempre la suma de ambas cifras [N-POS]. D) Se divide siempre entre diez, sin importar cuáles eran las cifras [N-POS].

**Mira:** intercambia las fichas de columnas y cuenta el valor que representa cada una.

**La regla:** $B\ge2$ es la base entera; $c_i$, cifra de la posición $i$, contada desde cero a la derecha; $s$, posición más alta. El valor es $N=\sum_{i=0}^{s}c_iB^i$, con $0\le c_i<B$; la primera cifra no es cero en la escritura ordinaria de varias cifras. Para convertir a otra base, dividir repetidamente por ella y leer restos en orden inverso. Una condición de cifras se traduce en estas restricciones, no solo en una ecuación real.

**Palabras:** *cifra*: símbolo de una posición; ejemplos: unidades, decenas, centenas. *Base*: cantidad que obliga a formar la siguiente columna; ejemplos: decimal, binaria, otra base entera indicada.

**Así se resuelve:** expandir el numeral; sustituir los pesos; imponer cifras admisibles; comprobar reconstruyendo la escritura. **Ahora tú:** valor posicional → conversión → cifra desconocida con restricciones enteras.

## 6. Letras y símbolos

| Símbolo | Significado | Unidad / advertencia |
|---|---|---|
| $x,y,a,b$ | Cantidad inicial, final, añadido, factor | b es factor; B es base |
| $N,d,q,r$ | Total, divisor/capacidad, cociente, resto | Conteos enteros |
| $B,c_i,i,s,\sum$ | Base, cifra, posición, posición máxima, suma | Sin unidad |

## 7. Otras formas de explicarla

Casillas de estados evitan depender de palabras clave, pero no toda operación puede revertirse. Objetos agrupados aclaran cociente y resto; deben mostrar qué objetos son indivisibles. El ábaco explica pesos posicionales; el color de la ficha no debe convertirse en el valor. Son diseños propios, no intervenciones de eficacia demostrada en esta investigación.

## 8. Datos del mundo

La ficha BCRP citada ofrece denominación de un sol: puede ser unidad de un inventario monetario exacto. El precio de un producto o la cantidad de frutas por caja será explícitamente inventado para el ejercicio; no se presenta como dato del mercado peruano.

## 9. Dudas y decisiones

«Razonamiento numérico» no es una frontera curricular uniforme. Se eligen operaciones inversas, división entera y numeración para evitar duplicar planteo verbal y cuadrados mágicos. El propietario debe confirmar si desea añadir criptoaritmética; no se supone incluida sin ese acuerdo curricular.

## 10. Fuentes

- UNMSM (proceso 2023-I). *Reglamento de admisión*, Aritmética. [Documento](https://medicina.unmsm.edu.pe/wp-content/uploads/2023/02/Reglamento-de-Admision-2023-I.pdf).
- UNI (2021). *Solucionario Admisión 2021-1*, Matemática 3 y razonamiento. [Documento](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario2021.pdf).
- CEPREUNI (2023). *Sílabo básico 2023-2*, razonamiento numérico. [Documento](https://www.cepre.uni.edu.pe/assets/archivos/comunicados/Syl_Bas_PS_2023-2.pdf).
- BCRP (2021). *Moneda: Toribio Rodríguez de Mendoza*. [Ficha](https://www.bcrp.gob.pe/docs/Billetes-Monedas/Monedas-de-Coleccion/bicentenario-2021/bicentenario-3-trdm.pdf).
