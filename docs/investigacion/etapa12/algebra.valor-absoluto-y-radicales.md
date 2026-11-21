# AL12 · Álgebra · Valor absoluto y ecuaciones con radicales

> Parte del documento de ChatGPT de las 32 unidades (21 nov 2026), por verificar. Cómo se leyó la evidencia y el contrato común de las escenas: `docs/investigacion/etapas-9-12/como-leer.md`.


## 1. Resumen en cinco líneas

El valor absoluto expresa una distancia sin dirección.  
Sus ecuaciones e inecuaciones se separan en casos justificados.  
La raíz principal tiene un dominio y un signo definidos.  
Elevar al cuadrado puede introducir candidatos que no cumplen la ecuación inicial.  
Lo más difícil es mantener las restricciones hasta la comprobación final.

## 2. Qué se pregunta en los exámenes

| Tipo | Universidad | Dificultad | Frecuencia | Fuente |
|---|---|---|---|---|
| Ecuaciones e inecuaciones con valor absoluto y radicales | UNI, CEPREUNI | Media/alta | Inclusión curricular; no estimada | CEPREUNI |
| Valor absoluto y función raíz cuadrada | UNMSM | Media | Temario histórico; no equivale a verificar ecuaciones radicales en examen | UNMSM, 5.2 y 18.3 |
| Signo mediante valor absoluto en una expresión trigonométrica | UNI | Alta | Aparición como requisito, 2021-1, Matemática 17 | UNI |

## 3. Errores típicos

| Código | Qué hace | Por qué | Estado | Fuente |
|---|---|---|---|---|
| V-DIS | Elige solo un lado de una distancia o permite distancia negativa | Mezcla distancia y posición dirigida | Hipótesis | Diseño propio |
| V-RAI | Escribe $\sqrt{x^2}=x$ para todo real | Confunde raíz principal con las soluciones de una ecuación | Hipótesis | Diseño propio; regla contrastada con Abramson |
| V-EXT | Conserva todos los resultados tras cuadrar | Confunde implicación con equivalencia | Hipótesis | Diseño propio |

No se localizó y leyó un estudio original específico suficiente para atribuir estos tres errores a una población concreta.

## 4. Lo que la unidad da por sabido

Recta real, signos, ecuaciones lineales y cuadráticas, intervalos e inecuaciones. No requiere funciones inversas trigonométricas.

## 5. Las ideas, en orden

### Idea 1. A la misma distancia — ¿Por qué una condición puede dar dos posiciones?

**Aprende:** el valor absoluto cuenta separación, no orientación.

**Lee / objeto:** una cinta métrica sobre una mesa de costura, con marca de referencia. «La posición indica dónde queda una pieza». «La separación compara dos posiciones». «Moverse a un lado o al otro cambia la ubicación».

**Juega:** coloca una ficha a una separación dada, únicamente a la derecha de la referencia; el sistema comprueba la distancia. El lado izquierdo se habilita después.

**Predice:** al habilitar ambos lados de una referencia interior a la regla, ¿cuántas posiciones quedan a una misma distancia positiva, menor que el espacio disponible a cada lado? A) Dos, una a cada lado **[correcta]**. B) Solo una, a la derecha [V-DIS]. C) Solo una, a la izquierda [V-DIS]. D) Ninguna, porque la posición de un lado tendría etiqueta negativa [V-DIS].

**Mira:** refleja la ficha respecto de la marca y compara las separaciones.

**La regla:** $x$ es posición, $c$ referencia y $r$ distancia. El valor absoluto $\vert u\vert$, «valor absoluto de u», vale $u$ si $u\ge0$ y $-u$ si $u<0$. Para $\vert x-c\vert=r$: si $r>0$, $x=c-r$ o $x=c+r$; si $r=0$, $x=c$; si $r<0$, no hay solución. La letra $u$ representa la expresión interior, no otra distancia.

**Palabras:** *referencia*: punto desde el cual comparar; ejemplos: cero de una regla, marca central, posición inicial. *Distancia*: separación sin signo; ejemplos: de una ficha a la marca, entre dos postes, entre dos números.

**Así se resuelve:** $\vert ax+b\vert=r$: revisar $r$; plantear $ax+b=r$ y $ax+b=-r$ cuando corresponde; resolver sin dividir por $a=0$; verificar. **Ahora tú:** lectura de distancia → ecuación con interior lineal → casos de parámetro.

### Idea 2. Dentro o fuera — ¿Qué posiciones quedan cerca de una referencia?

**Aprende:** las desigualdades de distancia producen una franja interior o dos exteriores.

**Lee / objeto:** molde de tela con una marca y un margen ajustable. «Un margen admite varias posiciones». «Una frontera puede estar incluida». «La tolerancia describe cuánto se permite apartarse».

**Juega:** sitúa un broche dentro de una banda abierta marcada; valida varias posiciones sin mostrar una condición de exterior.

**Predice:** para quedar a una distancia mayor que el margen positivo indicado respecto de una marca central, ¿qué región sirve? A) Las dos regiones exteriores **[correcta]**. B) Solo la exterior derecha [V-DIS]. C) Solo la exterior izquierda [V-DIS]. D) La región interior entre los dos límites [V-DIS].

**Mira:** ilumina ambos exteriores y prueba por separado las fronteras.

**La regla:** para $r>0$, $\vert u\vert<r$ equivale a $-r<u<r$; $\vert u\vert>r$ equivale a $u<-r$ o $u>r$. Las versiones no estrictas incluyen fronteras. Para $r=0$ o $r<0$, decidir desde $\vert u\vert\ge0$, no aplicar mecánicamente intervalos. Con varios valores absolutos, dividir la recta en los ceros de sus interiores y resolver cada fórmula dentro de su intervalo.

**Palabras:** *tolerancia*: separación permitida; ejemplos: margen de un broche, error de una medida, variación de un peso. *Frontera*: punto donde cambia una condición; ejemplos: límite izquierdo, límite derecho, cero del interior.

**Así se resuelve:** $\vert ax+b\vert\le r$, $r\ge0$: escribir la doble desigualdad; resolver según el signo de $a$; intersectar con el dominio. **Ahora tú:** interiores → exteriores → suma de valores absolutos por tramos.

### Idea 3. Candidatos y soluciones — ¿Por qué cuadrar exige volver al inicio?

**Aprende:** la raíz principal y el cuadrado no se cancelan sin condiciones.

**Lee / objeto:** baldosas cuadradas cuya área aparece en una etiqueta. «El lado debe ser una longitud permitida». «Un área puede obtenerse desde un lado». «La operación de regreso necesita una convención».

**Juega:** ajusta lados no negativos para alcanzar áreas propuestas; no aparecen lados dirigidos negativos ni ecuaciones radicales.

**Predice:** si dos números reales tienen cuadrados iguales, ¿qué se puede concluir? A) Son iguales o son opuestos **[correcta]**. B) Son necesariamente iguales [V-EXT]. C) Son necesariamente opuestos distintos, incluso cuando ambos son cero [V-EXT]. D) Ambos deben ser positivos porque sus cuadrados no son negativos [V-RAI].

**Mira:** muestra dos valores opuestos con el mismo cuadrado y compara las expresiones originales.

**La regla:** $\sqrt u$ es la raíz cuadrada principal: existe en reales si $u\ge0$ y es no negativa. Por eso $\sqrt{u^2}=\vert u\vert$. Con $v$ como expresión del segundo miembro, $\sqrt u=v$ equivale conjuntamente a $u=v^2$ y $v\ge0$; el radicando queda entonces no negativo. Para raíces pares se exige radicando no negativo; las impares admiten todo real. Con dos radicales, aislar uno, cuadrar, volver a aislar si hace falta y comprobar todos los candidatos en la ecuación inicial. Los denominadores deben seguir siendo no nulos.

**Palabras:** *radicando*: lo que está dentro de la raíz; ejemplos: un número, $x+c$, un cuadrado. *Extraña*: candidata que apareció al transformar pero falla al inicio; ejemplos: segundo miembro negativo, denominador cero, igualdad original falsa.

**Así se resuelve:** $\sqrt{x+c}=x$: imponer $x\ge0$; cuadrar para obtener $x+c=x^2$; resolver la cuadrática; sustituir cada candidato en la raíz inicial. **Ahora tú:** una raíz aislada → raíz con término exterior → dos radicales y restricciones.

## 6. Letras y símbolos

| Símbolo | Significado | Unidad / advertencia |
|---|---|---|
| $x,c,r$ | Posición variable, referencia, distancia exigida | Longitud en escenas; reales en álgebra |
| $u,v$ | Expresiones auxiliares | Su papel se conserva |
| $a,b$ | Coeficientes del interior lineal | No posiciones adicionales |
| $\vert u\vert,\sqrt u$ | Valor absoluto; raíz principal | No confundir barras con división |
| $<,>,\le,\ge,\ne$ | Relaciones de orden y diferencia | Sin unidad |

## 7. Otras formas de explicarla

La distancia en una regla prepara el valor absoluto; no autoriza a distribuirlo sobre sumas. Un cuadrado geométrico introduce raíz principal; no demuestra que una ecuación cuadrática solo tenga solución positiva. Comparar la gráfica original y la transformada permite ver soluciones extrañas, con el riesgo de ocultar casos por resolución de pantalla. Referencia matemática: Abramson, 1.3; diseños propios.

## 8. Datos del mundo

La ficha BCRP de la moneda conmemorativa de 2021 indica un diámetro de 25,50 mm. Puede utilizarse como medida de referencia para una escena de comparación. No se atribuye a esa moneda una tolerancia industrial no publicada: cualquier banda del juego será hipotética.

## 9. Dudas y decisiones

Los radicales se trabajan sobre reales. No se extienden propiedades de raíces a expresiones con bases negativas sin revisar su dominio. Las ecuaciones con varios valores absolutos son el tramo avanzado, después de las inecuaciones simples. Falta validación empírica local de los distractores.

## 10. Fuentes

- CEPREUNI (2023). *Sílabo del ciclo básico 2023-2*, valor absoluto y radicales. [Documento](https://www.cepre.uni.edu.pe/assets/archivos/comunicados/Syl_Bas_PS_2023-2.pdf).
- UNMSM (proceso 2023-I). *Reglamento de admisión*. [Documento](https://medicina.unmsm.edu.pe/wp-content/uploads/2023/02/Reglamento-de-Admision-2023-I.pdf).
- UNI (2021). *Solucionario Admisión 2021-1*, Matemática 17. [Documento](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario2021.pdf).
- Abramson, Jay (autor principal; 2021). *College Algebra 2e*, 1.3, Radicals and Rational Exponents. [OpenStax](https://openstax.org/books/college-algebra-2e/pages/1-3-radicals-and-rational-exponents).
- BCRP (2021). *Moneda: Toribio Rodríguez de Mendoza*. [Ficha](https://www.bcrp.gob.pe/docs/Billetes-Monedas/Monedas-de-Coleccion/bicentenario-2021/bicentenario-3-trdm.pdf).
