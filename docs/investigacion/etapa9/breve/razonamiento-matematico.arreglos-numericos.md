# RM9 · Razonamiento matemático · Arreglos numéricos y cuadrados mágicos

> Parte del documento de ChatGPT de las 32 unidades (21 nov 2026), por verificar. Cómo se leyó la evidencia y el contrato común de las escenas: `docs/investigacion/etapas-9-12/como-leer.md`.


## 1. Resumen en cinco líneas

Un arreglo se resuelve identificando reglas y restricciones explícitas.  
Una regularidad observada no garantiza una continuación única.  
Un cuadrado mágico impone igualdad de sumas en líneas determinadas.  
Los totales y simetrías permiten reducir la búsqueda.  
Lo más difícil es verificar todas las condiciones, no solo la que sugirió una respuesta.

## 2. Qué se pregunta en los exámenes

| Tipo | Universidad | Dificultad | Frecuencia | Fuente |
|---|---|---|---|---|
| Completar una distribución numérica | UNI | Media | Aparición 2021-1, primera prueba 4 | UNI |
| Arreglos numéricos | UNMSM | Media/alta | Temario histórico; no estimada | UNMSM, Habilidad lógico-matemática 1.4 |
| Patrones en filas, columnas y disposiciones | UNI, CEPREUNI | Media/alta | Preparación curricular | CEPREUNI |
| Cuadrados de orden tres y cuatro, y cuadrados multiplicativos | CEPREUNA | Media/alta | Temario agosto–diciembre de 2026; no frecuencia de examen | PDF oficial, semana 10; contenido indexado, descarga directa no recuperada |

No se confirmó una pregunta oficial específica de cuadrado mágico en la muestra; se incluye por el alcance solicitado.

## 3. Errores típicos

| Código | Qué hace | Por qué | Estado | Fuente |
|---|---|---|---|---|
| M-LOC | Valida una fila y deja de revisar | Generaliza una condición local | Hipótesis | Diseño propio |
| M-UNI | Cree que una regla compatible es la única | No busca alternativas ni distingue regla dada de inferida | Hipótesis | Diseño propio |
| M-REP | Repite o pierde una ficha, o cuenta mal un total | No conserva el inventario | Hipótesis | Diseño propio |

No se encontró investigación original específica suficiente para documentar estos distractores de admisión.

## 4. Lo que la unidad da por sabido

Operaciones enteras, suma, paridad, ecuaciones lineales elementales y lectura de filas/columnas. No se necesitan combinatoria formal ni sucesiones avanzadas.

## 5. Las ideas, en orden

### Idea 1. Leer todas las condiciones — ¿Qué hace válida una distribución?

**Aprende:** una respuesta debe satisfacer el conjunto completo de restricciones.

**Lee / objeto:** casillero de una tienda con fichas numeradas. «Cada casilla tiene una posición». «Las instrucciones pueden restringir líneas diferentes». «El inventario dice qué fichas están disponibles».

**Juega:** llena un tablero respetando una suma por fila y uso único de fichas; la misión no impone sumas de columnas.

**Predice:** si todas las filas suman igual, ¿todas las columnas necesariamente suman igual? A) No **[correcta]**. B) Sí, basta una condición de líneas [M-LOC]. C) Sí, porque no puede existir otro arreglo [M-UNI]. D) Sí, aunque se repitan fichas no permitidas [M-REP].

**Mira:** muestra un arreglo original que cumple filas y no columnas.

**La regla:** distinguir datos, dominio de las casillas y relaciones exigidas. Una regla local no implica automáticamente otra global. Registrar cada condición y marcarla solo tras comprobarla. Si el enunciado no declara una ley, varias reglas pueden ser compatibles con datos finitos; se requiere justificar la elección o reconocer insuficiencia.

**Palabras:** *restricción*: condición que debe cumplirse; ejemplos: no repetir, suma fija, casilla par. *Arreglo*: distribución según posiciones; ejemplos: fila, tabla, círculo.

**Así se resuelve:** inventariar fichas; escribir restricciones; completar casillas forzadas; verificar todas las líneas. **Ahora tú:** una restricción → varias → datos insuficientes.

### Idea 2. La suma común — ¿Cómo se determina la constante mágica?

**Aprende:** el total disponible limita las sumas de cada línea.

**Lee / objeto:** mosaico cuadrado de fichas numeradas. «Un cuadrado tiene igual número de filas y columnas». «Las diagonales principales unen esquinas opuestas». «La suma común es una condición del juego».

**Juega:** completa filas y columnas con suma común, pero las diagonales no se validan ni se muestran sus totales.

**Predice:** si filas y columnas cumplen, ¿ya es necesariamente un cuadrado mágico según la definición que también exige ambas diagonales? A) No **[correcta]**. B) Sí, no hace falta revisar diagonales [M-LOC]. C) Sí, una solución parcial siempre es única [M-UNI]. D) Sí, puede añadirse una ficha para arreglar el total [M-REP].

**Mira:** activa diagonales y prueba un contraejemplo que satisface solo filas y columnas.

**La regla:** n es orden del cuadrado; $a_{ij}$, valor de fila i y columna j; S, suma mágica. Se exige que cada fila, columna y ambas diagonales principales sumen S. Si T es suma de todas las fichas, $S=T/n$, porque n filas cuentan cada casilla una vez. En el cuadrado normal se usan los enteros de 1 a $n^2$ una vez, y $S=n(n^2+1)/2$. Esto da una condición necesaria; no construye por sí solo el cuadrado ni garantiza existencia para cualquier n.

**Palabras:** *orden*: cantidad de casillas por lado; ejemplos: tres por lado, cuatro por lado, cinco por lado. *Constante mágica*: suma exigida a cada línea; ejemplos: una fila, una columna, una diagonal principal.

**Así se resuelve:** sumar inventario; dividir entre filas; usar sumas parciales para casillas faltantes; revisar diagonales e inventario. **Ahora tú:** constante → casillas → compatibilidad de datos.

### Idea 3. Reducir la búsqueda — ¿Qué permanece al transformar un arreglo?

**Aprende:** usa invariantes y simetrías sin confundir solución con orientación.

**Lee / objeto:** mosaico sobre una bandeja que puede girarse. «Una ficha conserva su valor al girar». «La orientación cambia posiciones». «Hay condiciones que pueden conservarse».

**Juega:** gira una solución completa y registra sus orientaciones sin modificar fichas; no permite intercambios arbitrarios.

**Predice:** ¿intercambiar dos fichas cualesquiera conserva siempre el cuadrado mágico? A) No **[correcta]**. B) Sí, porque el total general no cambió [M-LOC]. C) Sí, todos los arreglos del inventario son la misma solución [M-UNI]. D) Sí, basta copiar una ficha conveniente [M-REP].

**Mira:** intercambia dos fichas y señala qué líneas cambian.

**La regla:** una transformación es válida solo si conserva todas las condiciones. Giros y reflexiones de un cuadrado mágico preservan sus líneas; una permutación arbitraria no. En orden tres, el centro vale S/3 y los pares opuestos suman 2S/3: sumar las cuatro líneas que atraviesan el centro cuenta todas las casillas una vez y el centro tres veces adicionales; usando T=3S se obtiene la relación. No extenderla sin prueba a otros órdenes. En la variante multiplicativa con valores positivos, se exige el mismo producto en filas, columnas y diagonales; el producto de todas las casillas es ese producto común elevado al número de filas. Es otra condición necesaria, no una garantía de construcción. Los tableros de orden cuatro se resuelven comprobando sus restricciones propias; no se les traslada la regla del centro de orden tres.

**Palabras:** *invariante*: propiedad que una transformación conserva; ejemplos: total, inventario, sumas bajo un giro. *Simetría*: cambio de orientación que mantiene estructura; ejemplos: giro de cuarto de vuelta, reflexión vertical, reflexión diagonal.

**Así se resuelve:** fijar centro si corresponde; formar pares opuestos; completar líneas; revisar que cualquier descarte se justifique. **Ahora tú:** simetrías → centro y opuestos → demostrar imposibilidad o soluciones equivalentes.

## 6. Letras y símbolos

| Símbolo | Significado | Unidad / advertencia |
|---|---|---|
| $n,i,j$ | Orden, fila, columna | Enteros |
| $a_{ij},S,T$ | Valor de casilla, suma mágica, total | Números sin unidad |
| $n^2$ | Número de casillas | No área física |

## 7. Otras formas de explicarla

Fichas móviles permiten verificar inventario; el programa debe impedir duplicación accidental. Colores por línea ayudan a detectar restricciones, pero un mismo color no demuestra igualdad. La suma global proporciona una comprobación, no sustituye revisar líneas. Son diseños propios; no se atribuye eficacia empírica.

## 8. Datos del mundo

La moneda BCRP de un sol puede inspirar fichas distinguibles por etiquetas de juego. La numeración se añade en el modelo; no se afirma que las monedas reales tengan los valores de un cuadrado mágico.

## 9. Dudas y decisiones

No se usa la idea de «adivinar la regla del autor» como única validación. Cuando varias soluciones son válidas, el programa debe aceptarlas o declarar una condición que haga única la respuesta. Falta frecuencia comprobada de cuadrados mágicos.

## 10. Fuentes

- UNI (2021). *Solucionario Admisión 2021-1*, primera prueba 4. [Documento](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario2021.pdf).
- UNMSM (proceso 2023-I). *Reglamento de admisión*, Habilidad lógico-matemática 1.4. [Documento](https://medicina.unmsm.edu.pe/wp-content/uploads/2023/02/Reglamento-de-Admision-2023-I.pdf).
- CEPREUNI (2023). *Sílabo básico 2023-2*, sucesiones y distribuciones. [Documento](https://www.cepre.uni.edu.pe/assets/archivos/comunicados/Syl_Bas_PS_2023-2.pdf).
- BCRP (2021). *Moneda: Toribio Rodríguez de Mendoza*. [Ficha](https://www.bcrp.gob.pe/docs/Billetes-Monedas/Monedas-de-Coleccion/bicentenario-2021/bicentenario-3-trdm.pdf).

---


- CEPREUNA (2026). *Temario del ciclo agosto–diciembre 2026*, semana 10 de razonamiento matemático. [PDF oficial](https://sistemas.cepreuna.edu.pe/storage/documentos/08-2026/Temario-20260823_0732008ama.pdf). Se leyó el contenido indexado; la descarga directa agotó el tiempo de respuesta.
