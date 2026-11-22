# RM12 · Razonamiento matemático · Cortes, pesadas y balanzas

> Parte del documento de ChatGPT de las 32 unidades (21 nov 2026), por verificar. Cómo se leyó la evidencia y el contrato común de las escenas: `docs/investigacion/etapas-9-12/como-leer.md`.


## 1. Resumen en cinco líneas

El resultado de un corte depende de la forma y de las operaciones permitidas.  
Una balanza de brazos iguales compara masas mediante equilibrio.  
Una pesada informativa divide los casos posibles según sus resultados.  
El número mínimo exige una estrategia que funcione en el peor caso.  
Lo más difícil es explicitar supuestos antes de aplicar una fórmula de conteo.

## 2. Qué se pregunta en los exámenes

| Tipo | Universidad | Dificultad | Frecuencia | Fuente |
|---|---|---|---|---|
| Cortes, pesadas y balanzas | UNMSM | Media/alta | Temario histórico; no estimada | UNMSM, Habilidad lógico-matemática 1.3 y 1.5 |
| Equivalencia entre masas de objetos | UNI | Media | Aparición 2021-1, primera prueba 8 | UNI |
| Estrategias de identificación con pesadas limitadas | Propuesta de preparación | Alta | Sin aparición específica verificada | Diseño deductivo propio |

## 3. Errores típicos

| Código | Qué hace | Por qué | Estado | Fuente |
|---|---|---|---|---|
| C-SUP | Aplica cortes+uno sin mirar forma o apilamiento | Omite condiciones geométricas | Hipótesis | Diseño propio |
| C-EQU | Retira masas distintas de platos equilibrados | No conserva equivalencia | Hipótesis específica; antecedente general algebraico | Diseño propio |
| C-INF | Cuenta tres resultados por pesada sin verificar que discriminen casos | Confunde límite de información y estrategia realizable | Hipótesis | Diseño propio |

## 4. Lo que la unidad da por sabido

Conteo, suma, igualdad, ecuaciones simples, división entera y peor caso. Se supone balanza ideal de brazos iguales, sin errores de lectura.

## 5. Las ideas, en orden

### Idea 1. Qué cuenta como corte — ¿Cuándo un corte añade una pieza?

**Aprende:** el modelo geométrico y las reglas de manipulación determinan el conteo.

**Lee / objeto:** cuerda abierta y lámina de cartón, sin instrumentos peligrosos reales. «Un corte es una operación definida». «Una pieza puede tener una forma distinta de otra». «Apilar cambia cuántas capas atraviesa la operación».

**Juega:** marca cortes distintos en una cuerda recta abierta, sin doblar; valida el número de piezas. No muestra cuerda cerrada ni cortes planos.

**Predice:** una cuerda forma un aro cerrado. Al cortar una sola vez, ¿cuántas piezas separadas quedan? A) Una cuerda abierta **[correcta]**. B) Dos piezas, aplicando siempre cortes más uno [C-SUP]. C) Ninguna pieza, confundiendo abrir el aro con eliminar la cuerda [C-SUP]. D) Tres piezas, contando los dos extremos nuevos además de la cuerda [C-SUP].

**Mira:** abre el aro y sigue la única pieza continua.

**La regla:** n cortes en puntos interiores distintos de una cuerda abierta sin apilar producen n+1 piezas; en un aro, n cortes distintos producen n piezas para n≥1. Para una lámina convexa con n cortes rectos completos, sin reacomodar, el máximo es $1+n(n+1)/2$: cada nueva recta puede cruzar todas las anteriores en puntos distintos dentro y añadir una pieza más que esos cruces. Con concurrencias, paralelas, cortes que no atraviesan o apilamiento cambia el conteo. Para un sólido convexo y n planos en posición general, la extensión es $1+n+\binom n2+\binom n3$; se deriva contando las regiones que cada plano nuevo corta, no se aplica a cualquier secuencia física.

**Palabras:** *pieza*: parte conectada que queda separada; ejemplos: tramo de cuerda, región de cartón, bloque de un sólido. *Posición general*: configuración que evita coincidencias que reducen el máximo; ejemplos: cruces interiores distintos, rectas no paralelas, sin tres rectas concurrentes en el caso plano.

**Así se resuelve:** dibujar forma inicial; declarar corte y reacomodo; contar cuánto añade cada operación; sumar y construir un caso que alcance el máximo. **Ahora tú:** cuerda → aro → lámina; sólido solo como ampliación.

### Idea 2. Conservar equilibrio — ¿Qué se puede retirar de ambos platos?

**Aprende:** transforma equivalencias de masa sin cambiar su validez.

**Lee / objeto:** balanza de mercado con paquetes y pesas. «Brazos iguales comparan masas». «Paquetes del mismo tipo representan igual masa». «La tara debe estar incluida o descontada».

**Juega:** agrega masas iguales a ambos platos equilibrados; valida equilibrio. No permite retirar objetos distintos.

**Predice:** un paquete equivale a dos pesas iguales. Si se sustituye ese paquete por una sola de esas pesas en una balanza antes equilibrada, ¿qué ocurre con ese plato? A) Sube porque se ha reducido su masa **[correcta]**. B) Sigue equilibrado porque se sustituyó un objeto por otro [C-EQU]. C) Baja porque se añadió una pesa, ignorando la masa retirada [C-EQU]. D) No puede decidirse aunque la equivalencia del paquete esté dada [C-EQU].

**Mira:** sustituye el paquete por su equivalente correcto y luego compara con la sustitución incorrecta.

**La regla:** si x e y son masas de tipos de objeto y a,b son sus cantidades, equilibrio significa igualdad de masas totales, por ejemplo ax=by. Se pueden sustituir conjuntos por otros de igual masa, sumar o retirar la misma masa en ambos platos y escalar una equivalencia. Igual número de objetos no significa igual masa. Una balanza de brazos desiguales necesita momentos de fuerza y queda fuera de este modelo.

**Palabras:** *tara*: masa del recipiente descontada del contenido; ejemplos: plato, bolsa, canasta. *Equivalencia*: dos conjuntos con igual masa; ejemplos: paquete y pesas, dos paquetes, sustitución completa.

**Así se resuelve:** identificar tara; traducir cada pesada; sustituir equivalentes; aislar la masa buscada; comprobar todas las balanzas. **Ahora tú:** una igualdad → sustitución → varias relaciones.

### Idea 3. Pesar para distinguir — ¿Cuánta información aporta una pesada?

**Aprende:** diseña una estrategia adaptada a los casos posibles.

**Lee / objeto:** fichas aparentemente iguales y balanza de dos platos. «Se declara que una ficha es más pesada». «Las demás tienen la misma masa». «El resultado determina el siguiente paso».

**Juega:** compara grupos iguales con una ficha pesada conocida visualmente y clasifica izquierda, equilibrio o derecha. No oculta aún su identidad.

**Predice:** hay tres fichas iguales en apariencia; exactamente una pesa más que las otras y no se sabe cuál. Se comparan dos fichas en una balanza de dos platos y quedan equilibradas. ¿Cuál es la más pesada? A) La tercera, que no se pesó **[correcta]**. B) La del plato izquierdo [C-INF]. C) La del plato derecho [C-INF]. D) No se obtiene información porque hubo equilibrio [C-INF].

**Mira:** recorre las tres posibilidades: izquierda pesada, derecha pesada o tercera pesada si equilibran.

**La regla:** k pesadas tienen como máximo $3^k$ secuencias de resultados; es una cota de información, no prueba automática de posibilidad. Si hay N fichas y exactamente una más pesada, las demás iguales, puede dividirse el conjunto de sospechosas en tres grupos de tamaños lo más equilibrados posible, comparando dos de igual tamaño y dejando el resto; cada resultado selecciona un grupo. Repetir y contar el peor camino. Si se desconoce si la anomalía es más pesada o más ligera, los casos son distintos y la estrategia anterior no se traslada sin revisión; una cota necesaria es $2N\le3^k$, pero puede no bastar.

**Palabras:** *caso posible*: explicación todavía compatible; ejemplos: ficha izquierda, derecha, no pesada. *Estrategia*: decisiones condicionadas por resultados; ejemplos: comparar grupos, elegir sospechosos, repetir en el grupo seleccionado.

**Así se resuelve:** enumerar hipótesis; elegir comparación; listar sobrevivientes por resultado; continuar hasta una hipótesis; verificar todos los caminos. **Ahora tú:** tres fichas → más fichas con pesada conocida → demostrar límite y analizar anomalía de signo desconocido.

## 6. Letras y símbolos

| Símbolo | Significado | Unidad / advertencia |
|---|---|---|
| $n,\binom nr$ | Número de cortes y combinación | Conteos; r es tamaño de selección |
| $x,y,a,b$ | Masas y cantidades de objetos | g o kg; conteos |
| $N,k,3^k$ | Sospechosas, pesadas, máximo de secuencias | Conteos |

## 7. Otras formas de explicarla

Recortes virtuales evitan confundir un trazo con una separación efectiva. Árboles de decisión muestran los caminos de las pesadas; no aceptar uno que solo resuelva un caso favorable. Fichas idénticas son una idealización: diferencias visuales no deben revelar la respuesta. Diseños propios, con argumentos de validez incluidos.

## 8. Datos del mundo

La moneda BCRP citada tiene masa nominal de 7,32 g. Puede servir como referencia de escala, pero los acertijos de moneda anómala usan fichas ideales: no se afirma que monedas circulantes reales tengan masas exactamente idénticas ni que una diferencia revele falsificación.

## 9. Dudas y decisiones

La extensión de cortes en sólidos exige su propia secuencia visual dentro de la primera idea y puede dejarse avanzada. Apilar y reacomodar solo se permiten si se declara. «Anomalía desconocida» necesita diseñar y verificar el árbol completo de cada problema; el límite de información no basta.

## 10. Fuentes

- UNMSM (proceso 2023-I). *Reglamento de admisión*, Habilidad lógico-matemática 1.3 y 1.5. [Documento](https://medicina.unmsm.edu.pe/wp-content/uploads/2023/02/Reglamento-de-Admision-2023-I.pdf).
- UNI (2021). *Solucionario Admisión 2021-1*, primera prueba 8. [Documento](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario2021.pdf).
- BCRP (2021). *Moneda: Toribio Rodríguez de Mendoza*. [Ficha](https://www.bcrp.gob.pe/docs/Billetes-Monedas/Monedas-de-Coleccion/bicentenario-2021/bicentenario-3-trdm.pdf).
- Relaciones de cortes y límite de pesadas: deducciones matemáticas expuestas aquí; no se atribuyen a una fuente de investigación de errores.
