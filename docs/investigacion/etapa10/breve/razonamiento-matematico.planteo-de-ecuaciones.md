# RM10 · Razonamiento matemático · Planteo de ecuaciones

> Parte del documento de ChatGPT de las 32 unidades (21 nov 2026), por verificar. Cómo se leyó la evidencia y el contrato común de las escenas: `docs/investigacion/etapas-9-12/como-leer.md`.


## 1. Resumen en cinco líneas

Plantear significa traducir relaciones, no palabras aisladas.  
La incógnita necesita nombre, unidad y dominio.  
Cada igualdad debe conservar el significado del enunciado.  
Las soluciones algebraicas se verifican en la situación original.  
La dificultad central es comparar cantidades en el mismo momento y con la misma referencia.

## 2. Qué se pregunta en los exámenes

| Tipo | Universidad | Dificultad | Frecuencia | Fuente |
|---|---|---|---|---|
| Simbolización de enunciados mediante ecuaciones | UNMSM | Media/alta | Temario histórico; no estimada | UNMSM, Habilidad lógico-matemática 2.4 |
| Relaciones simultáneas entre símbolos y totales | UNI | Media | Aparición 2021-1, primera prueba 6 | UNI |
| Problemas de cantidades, edades y operaciones | UNI, CEPREUNI | Media/alta | Preparación curricular | CEPREUNI |

## 3. Errores típicos

| Código | Qué hace | Por qué | Estado | Fuente |
|---|---|---|---|---|
| E-REL | Invierte una comparación o traduce palabra por palabra | No representa quién es referente de quién | Hipótesis | Diseño propio |
| E-TIE | Compara edades de momentos distintos o cambia el significado de x | Pierde la referencia temporal | Hipótesis | Diseño propio |
| E-DOM | Acepta cualquier raíz aunque viole cantidades o datos | Se detiene al terminar el álgebra | Hipótesis | Diseño propio |

Los errores de manipulación algebraica están documentados en Booth y otros (2014), pero no se usan como prueba de estas dificultades de traducción específicas.

## 4. Lo que la unidad da por sabido

Operaciones, ecuaciones lineales y cuadráticas, sistemas de dos variables, fracciones y unidades. El foco está en modelar, no en volver a enseñar despejes.

## 5. Las ideas, en orden

### Idea 1. Nombrar la cantidad — ¿Qué representa exactamente x?

**Aprende:** define la incógnita antes de operar.

**Lee / objeto:** dos canastas con cantidades de fruta comparadas por tarjetas. «Una cantidad puede servir de referencia». «La diferencia es una relación». «La letra conserva su significado».

**Juega:** arma dos canastas que cumplan una diferencia dada; el programa comprueba la relación. No se muestra una comparación multiplicativa.

**Predice:** una canasta tiene el triple de frutas que otra. ¿Cómo se obtiene su cantidad a partir de la segunda? A) Multiplicando por tres **[correcta]**. B) Sumando tres frutas [E-REL]. C) Dividiendo entre tres [E-REL]. D) Restando tres frutas [E-REL].

**Mira:** agrupa tres copias de la canasta de referencia.

**La regla:** x es la cantidad desconocida definida con unidad y dominio; y, una segunda cantidad si hace falta. «a unidades más que x» se representa $x+a$; «k veces x», $kx$, con a diferencia y k factor conocidos. El orden de una resta o cociente depende de los referentes. Una ecuación compara expresiones de magnitudes compatibles. «Más que» no prescribe por sí solo cuál cantidad se debe despejar.

**Palabras:** *referente*: cantidad usada para comparar; ejemplos: canasta menor, precio inicial, edad actual. *Incógnita*: cantidad específica que falta; ejemplos: frutas, soles por unidad, años.

**Así se resuelve:** escribir «x representa…»; representar cada cantidad con x; expresar el total o comparación; comprobar con un ejemplo sencillo antes de resolver. **Ahora tú:** diferencia → múltiplo → relación con fracciones.

### Idea 2. Coordinar condiciones — ¿Qué cambia y qué permanece?

**Aprende:** alinea tiempo, unidades y condiciones simultáneas.

**Lee / objeto:** álbum familiar ficticio con una línea temporal. «Cada foto corresponde a un momento». «Todos envejecen el mismo tiempo entre dos fechas». «Edad actual y edad futura son cantidades distintas».

**Juega:** desplaza juntas las edades de dos personas una misma cantidad de años; valida coherencia temporal. No compara cocientes de edades.

**Predice:** hoy una persona tiene el doble de edad que otra, cuya edad es positiva. Después del mismo número positivo de años para ambas, ¿cómo será el cociente entre la edad de la mayor y la menor? A) Menor que dos **[correcta]**. B) Igual a dos, conservando siempre la proporción [E-REL]. C) Mayor que dos por sumar tiempo solo a la mayor [E-TIE]. D) Cero, confundiendo cociente de edades y diferencia entre los años transcurridos [E-REL].

**Mira:** desplaza ambas edades y distingue diferencia constante de razón variable.

**La regla:** t es desplazamiento temporal; edades actuales x e y pasan a $x+t$ e $y+t$. La diferencia permanece; la razón generalmente cambia. Para otras situaciones, construir una tabla con magnitud, estado y unidad: compras usan cantidad por precio; movimientos, distancia por tiempo bajo el modelo declarado; mezclas, conservación del componente pertinente. Escribir una ecuación por condición independiente; datos repetidos no agregan información.

**Palabras:** *simultáneo*: referido al mismo momento; ejemplos: edades hoy, precios de una compra, cantidades antes de mezclar. *Independiente*: condición que aporta información nueva; ejemplos: segundo total distinto, diferencia adicional, medida no repetida.

**Así se resuelve:** tabla de momentos; expresar cada edad en el momento correcto; escribir relaciones; resolver sistema; verificar ambas frases originales. **Ahora tú:** edades → dos compras → datos redundantes o insuficientes.

### Idea 3. Volver al problema — ¿Toda raíz es una respuesta?

**Aprende:** el dominio y el contexto filtran candidatos.

**Lee / objeto:** reparto de entradas numeradas para una actividad escolar. «Una entrada es indivisible». «El resultado debe cumplir todos los datos». «Una cuenta correcta puede responder otra pregunta».

**Juega:** prueba candidatos enteros en una condición de reparto; verifica el total. No habilita candidatos negativos o fraccionarios.

**Predice:** si una ecuación produce una cantidad fraccionaria de entradas indivisibles, ¿debe aceptarse automáticamente? A) No **[correcta]**. B) Sí, porque apareció al despejar [E-DOM]. C) Sí, basta invertir la comparación original [E-REL]. D) Sí, cambiando el significado de x al final [E-TIE].

**Mira:** intenta construir el reparto y muestra por qué no coincide con la situación.

**La regla:** resolver genera candidatos; responder exige pertenencia al dominio y sustitución en todas las condiciones originales. Conteos deben ser enteros no negativos; longitudes, positivas según configuración; tiempos deben corresponder al intervalo declarado. Si ningún candidato sirve, revisar planteo y datos, sin redondear para forzar solución. Si varios sirven, se entregan todos o se reconoce insuficiencia según lo preguntado.

**Palabras:** *candidato*: valor que aún debe comprobarse; ejemplos: raíz positiva, raíz negativa, solución de sistema. *Dominio*: valores permitidos por la situación; ejemplos: conteos enteros, edades no negativas, denominadores no nulos.

**Así se resuelve:** listar candidatos; aplicar dominio; sustituir en frases, no solo ecuación transformada; redactar respuesta con unidad. **Ahora tú:** un descarte → cuadrática contextual → unicidad o insuficiencia.

## 6. Letras y símbolos

| Símbolo | Significado | Unidad / advertencia |
|---|---|---|
| $x,y$ | Cantidades desconocidas definidas | Fijas dentro de cada ejercicio |
| $a,k$ | Diferencia y factor conocidos | a conserva unidad; k no |
| $t$ | Desplazamiento temporal | Años en edades |
| $=,\ne$ | Igualdad y diferencia | No son instrucciones de cálculo |

## 7. Otras formas de explicarla

Barras comparativas aclaran quién es referencia; no representan bien magnitudes negativas sin extensión explícita. Tablas temporales evitan mezclar momentos. Representar con objetos permite verificar conteos, pero cantidades grandes requieren una representación abreviada. Son diseños propios; no se atribuye eficacia empírica a la traducción por barras.

## 8. Datos del mundo

La denominación de un sol de la moneda BCRP sirve para comprobantes ficticios. Los precios no son datos actuales de mercado. Los nombres, edades y relaciones familiares de los ejemplos serán ficticios, sin usar información personal del usuario.

## 9. Dudas y decisiones

Se distingue esta unidad de AL10: aquí se evalúa representación y comprobación. No enseñar listas rígidas «palabra→operación». El propietario debe decidir qué contextos de movimiento o mezcla ya están aprendidos para no evaluar conocimientos ajenos al planteo.

## 10. Fuentes

- UNMSM (proceso 2023-I). *Reglamento de admisión*, Habilidad lógico-matemática 2.4. [Documento](https://medicina.unmsm.edu.pe/wp-content/uploads/2023/02/Reglamento-de-Admision-2023-I.pdf).
- UNI (2021). *Solucionario Admisión 2021-1*, primera prueba 6. [Documento](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario2021.pdf).
- CEPREUNI (2023). *Sílabo básico 2023-2*, planteo de ecuaciones. [Documento](https://www.cepre.uni.edu.pe/assets/archivos/comunicados/Syl_Bas_PS_2023-2.pdf).
- Booth, J. L.; Barbieri, C.; Eyer, F.; Paré-Blagoev, E. J. (2014). *Persistent and Pernicious Errors in Algebraic Problem Solving*. [Original](https://files.eric.ed.gov/fulltext/EJ1059995.pdf). Antecedente algebraico, no evidencia específica de los códigos de esta unidad.
- BCRP (2021). *Moneda: Toribio Rodríguez de Mendoza*. [Ficha](https://www.bcrp.gob.pe/docs/Billetes-Monedas/Monedas-de-Coleccion/bicentenario-2021/bicentenario-3-trdm.pdf).
