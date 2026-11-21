# FI9 · Física · Impulso, cantidad de movimiento y choques

> Parte del documento de ChatGPT de las 32 unidades (21 nov 2026), por verificar. Cómo se leyó la evidencia y el contrato común de las escenas: `docs/investigacion/etapas-9-12/como-leer.md`.


## 1. Resumen en cinco líneas

La cantidad de movimiento combina masa y velocidad con dirección.  
El impulso mide el efecto acumulado de una fuerza durante un intervalo.  
La conservación se aplica a un sistema con impulso externo neto nulo.  
Los choques se distinguen por el comportamiento de su energía cinética.  
Lo más difícil es elegir el sistema y conservar los signos de las velocidades.

## 2. Qué se pregunta en los exámenes

| Tipo | Universidad | Dificultad | Frecuencia | Fuente |
|---|---|---|---|---|
| Impulso y conservación de cantidad de movimiento | UNMSM | Media/alta | Temario histórico; no estimada | UNMSM, Física 2.4 |
| Elegir conservación en colisiones y separaciones | UNI: alineación temática por confirmar con muestra específica | Alta | No se verificó aquí un ítem oficial de choque | Se propone desde el contenido físico, no se atribuye aparición |
| Fuerza media, área fuerza-tiempo y velocidad final | Aplicación de la unidad | Media | No estimada | Moebs, Ling y Sanny, capítulo 9 |

## 3. Errores típicos

| Código | Qué hace | Por qué | Estado | Fuente |
|---|---|---|---|---|
| M-VEC | Trata la cantidad de movimiento como escalar | No incorpora el cambio de dirección | Documentado | Singh y Rosengrant, 2003, resultados de momento |
| M-SIS | Conserva el momento de cada objeto por separado | No delimita el sistema que intercambia fuerzas internas | Documentado | Singh y Rosengrant, 2003 |
| M-ENE | Conserva energía cinética en todo choque o explosión | Confunde conservación de energía total con cinética | Documentado | Singh y Rosengrant, 2003 |
| M-TIE | Decide el impulso solo por la fuerza máxima | Omite la duración | Documentado en el estudio; distractor adaptado | Singh y Rosengrant, 2003 |

## 4. Lo que la unidad da por sabido

Masa, velocidad vectorial, componentes, segunda ley de Newton, energía cinética y áreas de rectángulos/triángulos. No necesita integración: las gráficas de fuerza se limitan a áreas elementales o fuerza media dada.

## 5. Las ideas, en orden

### Idea 1. Empujar durante un tiempo — ¿Qué cambia realmente el movimiento?

**Aprende:** fuerza y duración determinan juntas el cambio de cantidad de movimiento.

**Lee / objeto:** pelota de vóley y guante de recepción. «La pelota tiene masa y velocidad». «El contacto dura un intervalo». «El movimiento antes y después puede tener sentidos diferentes».

**Juega:** modifica una fuerza constante con duración fija hasta detener una pelota virtual de masa y velocidad dadas; el programa comprueba velocidad final cero. La duración variable está bloqueada.

**Predice:** para la misma pelota y el mismo cambio de velocidad, ¿qué pasa con la magnitud de la fuerza neta media al duplicar el tiempo de frenado? A) Se reduce a la mitad **[correcta]**. B) Se duplica [M-TIE]. C) Permanece igual porque solo importa cuánto cambia la velocidad [M-TIE]. D) Se reduce a la cuarta parte, usando dos veces el cambio de tiempo [M-TIE].

**Mira:** compara contactos con igual área fuerza-tiempo y distinta duración.

**La regla:** $\vec p=m\vec v$, donde $m$ es masa, $\vec v$ velocidad y $\vec p$ cantidad de movimiento. El impulso $\vec J=\Delta\vec p=m(\vec v_f-\vec v_i)$ para masa constante. También $\vec J=\vec F_{\mathrm{med}}\Delta t$, con fuerza neta media y duración. En una gráfica de una componente de fuerza frente al tiempo, el área con signo da esa componente del impulso. Un rebote exige restar velocidades con sus signos, no solo rapidez final menos inicial.

**Palabras:** *impulso*: efecto acumulado de un empuje; ejemplos: recepción, golpe breve, frenado prolongado. *Vector*: cantidad con dirección; ejemplos: velocidad, fuerza, cantidad de movimiento.

**Así se resuelve:** fijar sentido positivo; escribir velocidades inicial y final con signo; obtener $\Delta p$; dividir por duración para fuerza media; comprobar unidades. **Ahora tú:** detener → rebotar → gráfica por tramos.

### Idea 2. Mirar el conjunto — ¿Qué se conserva cuando dos objetos interactúan?

**Aprende:** las fuerzas internas no cambian el momento total del sistema.

**Lee / objeto:** dos carritos de un puesto sobre una pista horizontal idealizada. «Un sistema reúne los objetos elegidos». «Una fuerza puede venir de dentro o de fuera». «El intervalo de observación debe declararse».

**Juega:** delimita un sistema que incluya ambos carritos y clasifica contactos como internos o externos; la validación comprueba la frontera. No ejecuta aún el choque.

**Predice:** durante un choque con impulso externo horizontal despreciable, ¿qué conserva su cantidad de movimiento? A) El conjunto de ambos **[correcta]**. B) Cada carrito por separado [M-SIS]. C) La suma de rapidez por masa, sin signos [M-VEC]. D) Solo se conserva si también queda igual la energía cinética [M-ENE].

**Mira:** muestra los cambios opuestos de los carritos y su suma horizontal constante.

**La regla:** $\vec P=\sum_j m_j\vec v_j$ es cantidad de movimiento total, con $j$ como índice de objetos. Cumple $\vec P_f-\vec P_i=\vec J_{\mathrm{ext}}$. Si el impulso externo neto es cero, se conserva; si es despreciable, la conservación es aproximada. Se aplica por componentes. Tener fuerzas externas no impide conservar una componente cuando su impulso neto en esa dirección es nulo.

**Palabras:** *sistema*: conjunto que se analiza; ejemplos: dos carros, pelota y jugador, dos patinadores. *Externo*: que atraviesa la frontera elegida; ejemplos: empuje de una mano ajena, rozamiento del piso, fuerza de una pared.

**Así se resuelve:** dibujar frontera; identificar impulsos externos; elegir componente conservada; igualar sumas inicial y final; comprobar el sentido obtenido. **Ahora tú:** dos cuerpos → retroceso → conservación parcial por componentes.

### Idea 3. Pegarse o rebotar — ¿Qué información adicional determina el choque?

**Aprende:** conservar momento no basta por sí solo para conocer todas las velocidades finales.

**Lee / objeto:** carritos con acoples intercambiables de imán y almohadilla. «El contacto puede deformar objetos». «Dos objetos pueden quedar unidos». «La energía puede transformarse en formas no visibles como movimiento».

**Juega:** realiza un choque que deja ambos carros unidos y alcanza una velocidad final objetivo ajustando la velocidad inicial permitida. El modo rebote está cerrado.

**Predice:** dos carros chocan y quedan unidos; el impulso externo horizontal es despreciable. ¿Qué conservación se puede imponer? A) La cantidad de movimiento total con sus signos **[correcta]**. B) La energía cinética total en todo caso [M-ENE]. C) La cantidad de movimiento de cada carro por separado [M-SIS]. D) La suma de masa por rapidez, omitiendo las direcciones [M-VEC].

**Mira:** compara energía cinética antes y después, incluyendo una etiqueta de energía interna transferida.

**La regla:** $K=\tfrac12mv^2$ es energía cinética, escalar. Choque elástico: se conserva $K$ total; inelástico: no se conserva; perfectamente inelástico: los cuerpos comparten velocidad final. En una dimensión, con objeto 1 detrás y aproximándose al 2, $e=(v_{2f}-v_{1f})/(v_{1i}-v_{2i})$ es coeficiente de restitución; requiere denominador positivo y velocidades de contacto compatibles. Para choques pasivos usuales $0\le e\le1$. Momento más esta relación determinan las velocidades; $e=0$ implica igual velocidad normal inmediata, sin garantizar por sí solo adhesión permanente.

**Palabras:** *inelástico*: parte del movimiento se transforma en energía interna; ejemplos: plastilina que choca, cartón que se deforma, carrito con amortiguador. *Restitución*: comparación entre separación y acercamiento; ejemplos: rebote fuerte, rebote débil, velocidad relativa final nula.

**Así se resuelve:** para cuerpos unidos, $v_f=(m_1v_{1i}+m_2v_{2i})/(m_1+m_2)$; deducirla de momento; comparar después las sumas de $K$, sin imponer igualdad. **Ahora tú:** adherencia → elástico → restitución y pérdida de energía.

## 6. Letras y símbolos

| Símbolo | Significado | Unidad / advertencia |
|---|---|---|
| $m,\vec v,\vec p,\vec P$ | Masa, velocidad, momento individual, total | kg; m/s; kg·m/s |
| $\vec J,\vec F,t$ | Impulso, fuerza neta, tiempo | N·s; N; s |
| $K,e$ | Energía cinética, restitución | J; sin unidad |
| $i,f,j,\mathrm{ext},\mathrm{med}$ | Inicial, final, índice de objeto, externo, medio | Subíndices; j se reserva al objeto |
| $\Delta,\sum,\vec{ }$ | Cambio, suma, carácter vectorial | P no es presión en esta unidad |

## 7. Otras formas de explicarla

Carritos y gráficas de fuerza hacen visible el intercambio; el rozamiento no debe desaparecer sin aviso. Un cojín muestra mayor tiempo de frenado; no implica que toda fuerza instantánea sea constante. El balance de momento se parece a una contabilidad con signos; no debe confundirse con energía, que no lleva dirección. Referencia: OpenStax, capítulo 9.

## 8. Datos del mundo

FIVB especifica 260–280 g para la masa reglamentaria de un balón de voleibol y 65–67 cm de circunferencia. El documento inglés usa «weight», pero gramos son unidad de masa. Elegir una masa dentro de ese intervalo es un supuesto del ejercicio, no una medición de una pelota concreta. Fuente: FIVB, 3.1.

## 9. Dudas y decisiones

El coeficiente de restitución se limita a colisiones unidimensionales o a su componente normal declarada. No se propone golpear objetos reales: es una escena virtual. No se confirmó frecuencia de choques en una serie reciente de exámenes. La evaluación debe pedir justificar la frontera del sistema.

## 10. Fuentes

- UNMSM (proceso 2023-I). *Reglamento de admisión*, Física 2.4. [Documento](https://medicina.unmsm.edu.pe/wp-content/uploads/2023/02/Reglamento-de-Admision-2023-I.pdf).
- Singh, C.; Rosengrant, D. (2003). *Multiple-Choice Test of Energy and Momentum Concepts*, American Journal of Physics 71, 607–617. [Original depositado en 2016](https://arxiv.org/pdf/1602.06497), DOI 10.1119/1.1571832.
- Moebs, W.; Ling, S. J.; Sanny, J. (2016). *University Physics Volume 1*, [9.2, Impulse and Collisions](https://openstax.org/books/university-physics-volume-1/pages/9-2-impulse-and-collisions).
- FIVB (2025). *Official Volleyball Rules 2025–2028*, 3.1. [Documento](https://www.fivb.com/wp-content/uploads/2025/01/FIVB-Volleyball_Rules2025_2028-EN-v05.pdf).
