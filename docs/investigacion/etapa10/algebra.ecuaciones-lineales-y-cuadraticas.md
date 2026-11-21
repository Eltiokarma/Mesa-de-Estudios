# AL10 · Álgebra · Ecuaciones de primer y segundo grado

> Parte del documento de ChatGPT de las 32 unidades (21 nov 2026), por verificar. Cómo se leyó la evidencia y el contrato común de las escenas: `docs/investigacion/etapas-9-12/como-leer.md`.


## 1. Resumen en cinco líneas

Resolver significa encontrar valores que hacen verdadera una igualdad.  
Las transformaciones deben conservar sus soluciones.  
Se estudian ecuaciones lineales, cuadráticas y sistemas lineales de dos variables.  
Se distingue una solución, ninguna e infinitas.  
Lo más difícil es reconocer restricciones antes de dividir o descartar raíces.

## 2. Qué se pregunta en los exámenes

| Tipo | Universidad | Dificultad | Frecuencia | Fuente |
|---|---|---|---|---|
| Parámetro y número de soluciones lineales | UNI | Alta | Aparición verificada, 2021-1, Matemática 7; frecuencia no estimada | UNI |
| Compatibilidad de sistema lineal | UNI | Alta | Aparición verificada, 2021-1, Matemática 10 | UNI |
| Ecuaciones de primer y segundo grado y relación raíces–coeficientes | UNMSM | Media/alta | Inclusión curricular histórica | UNMSM, 15 y 17.13 |

## 3. Errores típicos

| Código | Qué hace | Por qué | Estado | Fuente |
|---|---|---|---|---|
| E-EQU | Opera solo en un miembro | No trata la igualdad como relación que conservar | Documentado; explicación causal por validar | Booth y otros, 2014, tablas 3–4 |
| E-SIG | Pierde signos al transformar | Interpreta «pasar» sin identificar la operación | Documentado; interpretación didáctica | Booth y otros, 2014 |
| E-CAS | Divide por un parámetro que puede ser cero o retiene una sola raíz | Ignora los casos del dominio | Hipótesis | Diseño propio |

## 4. Lo que la unidad da por sabido

Operaciones con reales y fracciones, distributiva, factorización elemental, potencia y raíz cuadrada principal. Los números complejos no son requisito: se trabaja en reales.

## 5. Las ideas, en orden

### Idea 1. Mantener el equilibrio — ¿Qué cambio conserva las soluciones?

**Aprende:** una transformación equivalente mantiene exactamente los valores posibles.

**Lee / objeto:** balanza de un mercado con paquetes iguales y pesas. «Los paquetes iguales tienen la misma masa». «Cada plato representa un total». «La igualdad compara ambos totales».

**Juega:** añade y retira pesas iguales de ambos platos hasta aislar un paquete; el programa comprueba equilibrio y aislamiento. Solo se permite operar simétricamente.

**Predice:** si se retira una pesa únicamente del plato izquierdo de una balanza equilibrada, ¿qué sucede? A) El izquierdo sube y se pierde la igualdad **[correcta]**. B) Sigue equilibrada porque la incógnita no cambió [E-EQU]. C) El izquierdo baja, porque retirar se interpreta como añadir peso [E-SIG]. D) La igualdad se conserva siempre que se retire cualquier objeto del lado que contiene la incógnita [E-EQU].

**Mira:** se inclina la balanza; aparecen después los dos miembros de la igualdad.

**La regla:** $x$ es la incógnita; $a,b,c$ son coeficientes conocidos. De $ax+b=c$ se obtiene $ax=c-b$. Si $a\ne0$, $x=(c-b)/a$. Si $a=0$, hay infinitas soluciones cuando $b=c$, y ninguna cuando son distintos. Sumar la misma cantidad o multiplicar por una misma cantidad no nula conserva equivalencia; dividir exige denominador no nulo. Se comprueba sustituyendo en la igualdad inicial.

**Palabras:** *incógnita*: valor que falta; ejemplos: una masa, una cantidad, un precio. *Equivalente*: que acepta exactamente los mismos valores; ejemplos: sumar en ambos miembros, restar en ambos, dividir ambos por un número no nulo.

**Así se resuelve:** $a(x+b)=c$, con $a\ne0$: dividir por $a$; restar $b$; obtener $x=c/a-b$; sustituir. **Ahora tú:** una operación → paréntesis y fracciones → parámetro que anula el coeficiente.

### Idea 2. Dos raíces posibles — ¿Qué cambia cuando aparece un cuadrado?

**Aprende:** la factorización y el discriminante describen todas las raíces reales.

**Lee / objeto:** marco rectangular ajustable de un taller. «Una medida puede determinar otra». «El área combina dos longitudes». «Una restricción física acompaña a la igualdad».

**Juega:** modifica un lado, con el otro fijado, hasta alcanzar un área indicada. La relación de ambos lados variables aún está bloqueada.

**Predice:** fuera del modelo físico, se busca un número cuyo cuadrado sea una cantidad positiva dada. ¿Qué conjunto de respuestas corresponde? A) Dos números opuestos **[correcta]**. B) Solo el positivo [E-CAS]. C) Solo el negativo [E-CAS]. D) Ninguno, porque un número negativo siempre da un cuadrado negativo y el positivo no puede tener pareja [E-SIG].

**Mira:** dos entradas de signos opuestos dan el mismo cuadrado; una longitud física rechaza la entrada negativa por contexto, no por álgebra.

**La regla:** una cuadrática es $ax^2+bx+c=0$, con $a\ne0$. El discriminante, $\Delta=b^2-4ac$, determina dos raíces reales distintas si es positivo, una doble si es cero y ninguna real si es negativo. Las raíces son $x=(-b\pm\sqrt\Delta)/(2a)$, donde $\pm$ indica dos elecciones de signo. Proviene de completar el cuadrado. Si un producto es cero, al menos un factor es cero. Para las raíces $x_1,x_2$, su suma es $-b/a$ y su producto $c/a$.

**Palabras:** *raíz de una ecuación*: un valor que la cumple; ejemplos: primera raíz, segunda raíz, raíz doble. *Discriminante*: cantidad que distingue los casos; ejemplos: positivo, cero, negativo.

**Así se resuelve:** de $x^2+bx+c=0$, completar $(x+b/2)^2=b^2/4-c$; revisar el signo derecho; extraer ambas posibilidades y filtrar el contexto. **Ahora tú:** factorizar → usar discriminante → relacionar raíces y parámetros.

### Idea 3. Cumplir dos condiciones — ¿Basta con satisfacer una ecuación?

**Aprende:** la solución de un sistema satisface simultáneamente sus condiciones.

**Lee / objeto:** dos comprobantes de compra de frutas con precios unitarios desconocidos. «Cada compra aporta un total». «Un precio conserva su significado en ambos comprobantes». «Los datos pueden aportar información nueva o repetirla».

**Juega:** arrastra precios permitidos hasta cumplir dos comprobantes compatibles; se exige que ambos indicadores sean correctos. Los casos contradictorios están ocultos.

**Predice:** dos comprobantes con exactamente las mismas cantidades, pero totales distintos, ¿determinan precios comunes? A) No hay solución común **[correcta]**. B) Se conserva el precio que cumple el primero [E-EQU]. C) Se cambia el signo de un total para hacerlos coincidir [E-SIG]. D) Siempre hay un par de precios por haber dos ecuaciones [E-CAS].

**Mira:** las bandas de precios admitidos no se intersectan.

**La regla:** $y$ es la segunda incógnita; los subíndices 1 y 2 distinguen condiciones. En $a_1x+b_1y=c_1$, $a_2x+b_2y=c_2$, sustituir o combinar ecuaciones conserva soluciones si la operación es reversible. Con $D=a_1b_2-a_2b_1\ne0$, hay solución única: $x=(c_1b_2-c_2b_1)/D$, $y=(a_1c_2-a_2c_1)/D$. Si $D=0$, reducir las ecuaciones: una contradicción da ninguna solución; una identidad deja una condición redundante. No concluir incompatibilidad solo porque $D=0$.

**Palabras:** *sistema*: condiciones que se cumplen juntas; ejemplos: dos compras, dos mezclas, dos relaciones de edades. *Compatible*: que admite alguna solución; ejemplos: un par único, una recta de pares, dos condiciones repetidas.

**Así se resuelve:** despejar $x$ en una condición cuyo coeficiente no sea cero; sustituir en la otra; resolver el caso resultante; comprobar ambos totales. **Ahora tú:** sistema directo → datos redundantes → clasificación con parámetro.

## 6. Letras y símbolos

| Símbolo | Significado | Unidad / advertencia |
|---|---|---|
| $x,y$ | Incógnitas | La misma magnitud en todo un ejercicio |
| $a,b,c$, con subíndices | Coeficientes conocidos | Compatibles con la ecuación; no cambiar su papel |
| $x_1,x_2$ | Raíces de la cuadrática | Misma unidad que x |
| $\Delta,D$ | Discriminante; determinante del sistema | No intercambiarlos |
| $\pm,\ne$ | Dos signos posibles; desigualdad | Sin unidad |

## 7. Otras formas de explicarla

La balanza explica equivalencia con cantidades positivas; no representa masas negativas. Un área ayuda a completar el cuadrado, pero los valores negativos requieren álgebra. Las rectas muestran intersección y paralelismo; una imagen casi coincidente no demuestra igualdad exacta. Las representaciones son propuestas propias apoyadas en las relaciones algebraicas estándar del temario.

## 8. Datos del mundo

La denominación de la moneda BCRP de la ficha de 2021 es un sol. Puede representar unidades monetarias en comprobantes ficticios. Los precios de frutas y cantidades de compra no son cotizaciones observadas.

## 9. Dudas y decisiones

No incluye complejos, ecuaciones cúbicas ni sistemas de tres incógnitas: estos últimos aparecen en UNMSM y requieren una ampliación aparte. El dueño debe decidir si esa ampliación pertenece aquí. El énfasis es clasificar soluciones y verificar restricciones, no memorizar «pasa cambiando signo».

## 10. Fuentes

- UNI (2021). *Solucionario Admisión 2021-1*, Matemática 7 y 10. [Original](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario2021.pdf).
- UNMSM (proceso 2023-I). *Reglamento de admisión*, 15–17. [Original](https://medicina.unmsm.edu.pe/wp-content/uploads/2023/02/Reglamento-de-Admision-2023-I.pdf).
- Booth, J. L.; Barbieri, C.; Eyer, F.; Paré-Blagoev, E. J. (2014). *Persistent and Pernicious Errors in Algebraic Problem Solving*. [Original](https://files.eric.ed.gov/fulltext/EJ1059995.pdf).
- BCRP (2021). *Moneda: Toribio Rodríguez de Mendoza*. [Ficha](https://www.bcrp.gob.pe/docs/Billetes-Monedas/Monedas-de-Coleccion/bicentenario-2021/bicentenario-3-trdm.pdf).
