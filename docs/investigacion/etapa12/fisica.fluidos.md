# FI12 · Física · Fluidos

> Parte del documento de ChatGPT de las 32 unidades (21 nov 2026), por verificar. Cómo se leyó la evidencia y el contrato común de las escenas: `docs/investigacion/etapas-9-12/como-leer.md`.


## 1. Resumen en cinco líneas

La presión relaciona fuerza normal y superficie.  
En reposo cambia con la profundidad y permite explicar máquinas hidráulicas.  
La flotación depende del fluido desplazado y del balance de fuerzas.  
En movimiento se combinan conservación de masa y energía bajo condiciones.  
Lo más difícil es distinguir presión de fuerza y volumen total de volumen sumergido.

## 2. Qué se pregunta en los exámenes

| Tipo | Universidad | Dificultad | Frecuencia | Fuente |
|---|---|---|---|---|
| Presión, Pascal, Arquímedes y Bernoulli | UNMSM | Media/alta | Temario histórico; no estimada | UNMSM, Física 5 |
| Peso aparente de un cuerpo sumergido | UNI | Media | Aparición 2021-1, Física 5 | UNI |
| Continuidad y comparación de presión en conductos | Preparación conceptual | Alta | No se verificó un ítem específico en la muestra | OpenStax, capítulo 14 |

## 3. Errores típicos

| Código | Qué hace | Por qué | Estado | Fuente |
|---|---|---|---|---|
| F-PRE | Confunde presión con fuerza o con volumen de agua | Atiende a cantidad total sin considerar área o profundidad | Hipótesis | Diseño propio |
| F-EMP | Decide flotación solo por masa o niega empuje a lo hundido | No construye el balance de fuerzas | Hipótesis específica | Diseño propio |
| F-FLU | Aplica «más velocidad, menos presión» en cualquier comparación | Omite altura, pérdidas y condiciones de Bernoulli | Hipótesis | Diseño propio |
| F-CON | Conserva rapidez en lugar de caudal o aplica factores de área incorrectos | No relaciona área de paso y volumen por tiempo | Hipótesis | Diseño propio |

Loverude, Kautz y Heron (2003) reportan dificultades en flotación y hundimiento; aquí se accedió al resumen, por lo que ese antecedente es **de segunda mano** y no documenta por sí solo cada distractor específico.

## 4. Lo que la unidad da por sabido

Densidad como masa/volumen, fuerzas, equilibrio, energía, áreas y conversiones. Si la densidad no está consolidada se recupera en la primera idea antes de presión hidrostática.

## 5. Las ideas, en orden

### Idea 1. Fuerza repartida — ¿Qué cambia al reducir el área?

**Aprende:** igual fuerza sobre áreas distintas produce presiones distintas.

**Lee / objeto:** dos apoyos de diferente tamaño sobre una almohadilla de taller. «La fuerza se reparte sobre una superficie». «El área mide esa superficie». «Un fluido en reposo empuja perpendicularmente a la pared».

**Juega:** con área fija ajusta la fuerza hasta una presión objetivo; no permite variar el apoyo.

**Predice:** al mantener la misma fuerza normal y reducir el área de apoyo a la mitad, ¿qué ocurre con la presión media? A) Se duplica **[correcta]**. B) No cambia, porque presión y fuerza serían lo mismo [F-PRE]. C) Se reduce a la mitad, tomando presión como proporcional al área [F-PRE]. D) Se cuadruplica, aplicando dos veces el cambio de área [F-PRE].

**Mira:** cambia el apoyo y distribuye la misma fuerza entre menos unidades de área.

**La regla:** $p=F_\perp/A$, donde $p$ es presión media, $F_\perp$ fuerza normal y $A$ área. La presión local coincide con esta media si es uniforme. La densidad $\rho=m/V$, masa $m$ por volumen $V$. Presión absoluta incluye la referencia de vacío; presión manométrica es diferencia respecto de la atmosférica: $p_{\mathrm{abs}}=p_{\mathrm{atm}}+p_{\mathrm{man}}$.

**Palabras:** *presión*: fuerza repartida por superficie; ejemplos: pistón, fondo de recipiente, aire de una pelota. *Densidad*: masa por espacio ocupado; ejemplos: agua, aceite, bloque metálico.

**Así se resuelve:** convertir área a metros cuadrados; escoger fuerza normal; dividir; comprobar si se pide presión absoluta o diferencia. **Ahora tú:** fuerza/área → conversión → presión manométrica.

### Idea 2. Profundidad y transmisión — ¿Importa la forma del recipiente?

**Aprende:** en un líquido homogéneo en reposo la presión depende de profundidad y referencia.

**Lee / objeto:** recipientes transparentes de distintas formas, como jarras y bidones. «El nivel libre es una referencia». «La profundidad se mide verticalmente». «Los recipientes pueden contener el mismo líquido».

**Juega:** ubica sensores a una profundidad objetivo dentro de un recipiente; valida posición vertical. Los otros recipientes aún no tienen lecturas.

**Predice:** a igual profundidad, con igual líquido y presión superficial, ¿cómo se compara la presión en dos recipientes de distinto ancho? A) Es igual **[correcta]**. B) Es mayor en el más ancho por tener más agua [F-PRE]. C) Es mayor en el más estrecho por concentrar el agua [F-PRE]. D) Es cero en ambos porque el agua está quieta [F-PRE].

**Mira:** activa los otros sensores y compara presiones, no fuerzas totales del fondo.

**La regla:** $h$ es profundidad, $g$ gravedad y $p_0$ presión superficial: $p=p_0+\rho gh$, para líquido de densidad constante en reposo. En capas se suman incrementos de cada capa. Un incremento de presión aplicado a un fluido confinado se transmite: para pistones ideales a igual altura, $F_1/A_1=F_2/A_2$. Con desplazamientos de pistón $\ell_1,\ell_2$, el volumen conservado exige $A_1\ell_1=A_2\ell_2$; ganar fuerza exige recorrer menor distancia. Si hay distinta altura, incluir la diferencia hidrostática.

**Palabras:** *hidrostático*: referido al fluido quieto; ejemplos: depósito cerrado, jarra en reposo, manómetro equilibrado. *Pistón*: pieza que empuja al fluido; ejemplos: jeringa, prensa hidráulica, elevador idealizado.

**Así se resuelve:** fijar superficie de referencia; recorrer verticalmente sumando o restando $\rho g h$; igualar presiones en puntos comunicados a igual nivel; obtener incógnita. **Ahora tú:** profundidad → líquidos por capas → prensa con alturas.

### Idea 3. El líquido desplazado — ¿Qué determina el empuje?

**Aprende:** el empuje depende del volumen sumergido y la densidad del fluido.

**Lee / objeto:** bloque sujeto a un dinamómetro sobre una tina. «El dinamómetro registra una fuerza». «Parte del bloque puede quedar bajo el agua». «El líquido ocupa el espacio que el bloque desplaza».

**Juega:** sumerge parcialmente un bloque hasta desplazar un volumen objetivo; se valida ese volumen. No se muestra la lectura de fuerza ni se libera el bloque.

**Predice:** si un objeto se hunde en un líquido, ¿qué puede afirmarse sobre el empuje? A) Puede existir aunque el peso sea mayor **[correcta]**. B) Es necesariamente cero [F-EMP]. C) Es siempre exactamente igual al peso, incluso si acelera hacia abajo sin otras fuerzas [F-EMP]. D) Debe superar al peso para que pueda hundirse desde el reposo [F-EMP].

**Mira:** revela fuerzas en el bloque sumergido y compara su resultante.

**La regla:** $E=\rho gV_s$, donde $E$ es empuje y $V_s$ volumen de fluido desplazado, para densidad uniforme y cuerpo rodeado por el fluido como supone Arquímedes. Flotación libre en equilibrio: $E=mg$. Si un dinamómetro sostiene al cuerpo en equilibrio, su lectura $T=mg-E$, cuando tira hacia arriba; si el resultado fuese negativo se necesitaría otra sujeción. Para cuerpo uniforme flotando, $V_s/V=\rho_{\mathrm{cuerpo}}/\rho_{\mathrm{fluido}}$. No usar volumen total cuando solo hay inmersión parcial.

**Palabras:** *empuje*: fuerza neta del fluido que sostiene parcialmente; ejemplos: bloque sumergido, botella flotante, globo en aire. *Peso aparente*: lectura del apoyo o suspensión; ejemplos: dinamómetro en aire, bajo agua, cuerpo sostenido parcialmente.

**Así se resuelve:** identificar fluido y volumen desplazado; calcular empuje; dibujar fuerzas; aplicar equilibrio o segunda ley; interpretar la lectura. **Ahora tú:** inmersión completa → flotación parcial → sujeción y líquido distinto.

### Idea 4. Conservar caudal y energía — ¿Qué ocurre en un estrechamiento?

**Aprende:** continuidad y Bernoulli responden preguntas diferentes y deben usarse juntas con sus supuestos.

**Lee / objeto:** manguera de riego transparente con dos secciones. «El agua atraviesa secciones». «El caudal cuenta volumen por tiempo». «La altura puede cambiar a lo largo del recorrido».

**Juega:** regula entrada de agua en una manguera de sección uniforme hasta un caudal objetivo. Estrechamientos y desniveles se activan solo después.

**Predice:** en un conducto sin fugas, con flujo estacionario de agua ideal, ¿qué ocurre con la rapidez media al reducir a la mitad el área de paso? A) Se duplica **[correcta]**. B) Se reduce a la mitad, conservando la razón en vez del producto [F-CON]. C) Permanece igual aunque el caudal deba mantenerse [F-CON]. D) Se reduce a la cuarta parte, aplicando un factor cuadrático a un área ya dada [F-CON].

**Mira:** sigue volúmenes iguales por ambas secciones y luego añade lecturas de presión.

**La regla:** $Q=\Delta V/\Delta t=Av$, con $Q$ caudal volumétrico y $v$ rapidez media. En flujo estacionario incompresible sin fugas, $A_1v_1=A_2v_2$; en general se conserva flujo de masa $\rho Av$. Para flujo ideal, estacionario e incompresible a lo largo de una línea de corriente, sin bombas ni pérdidas entre puntos, $p+\rho v^2/2+\rho gz$ es constante, con $z$ altura sobre una referencia común. Más rapidez implica menos presión solo si los demás términos pertinentes no cambian. La viscosidad produce esfuerzos y pérdidas; no se calcula aquí con una ley adicional.

**Palabras:** *caudal*: volumen que pasa por tiempo; ejemplos: grifo, manguera, canal. *Viscosidad*: resistencia interna al deslizamiento del fluido; ejemplos: aceite, agua, miel.

**Así se resuelve:** comprobar régimen; aplicar continuidad; escribir Bernoulli entre puntos; conservar términos de altura y presión; despejar y revisar pérdidas ignoradas. **Ahora tú:** caudal → estrechamiento horizontal → depósito-orificio ideal y desnivel.

## 6. Letras y símbolos

| Símbolo | Significado | Unidad / advertencia |
|---|---|---|
| $p,F_\perp,A$ | Presión, fuerza normal, área | Pa, N, m² |
| $m,V,V_s,\rho$ | Masa, volumen total, sumergido, densidad | kg, m³, m³, kg/m³ |
| $h,z,\ell,g$ | Profundidad, altura, recorrido del pistón, gravedad | m, m, m, m/s² |
| $E,T$ | Empuje, tensión del dinamómetro | N; E no es energía y T no es período |
| $Q,v,t$ | Caudal, rapidez, tiempo | m³/s, m/s, s |
| $\Delta,0,1,2$ | Cambio y referencias/subíndices | Distinguen estados o puntos |

## 7. Otras formas de explicarla

Sensores a igual profundidad corrigen la intuición del recipiente ancho; comparar fuerza total requeriría además área. Jeringas conectadas explican Pascal; no crean energía y no representan pérdidas reales. Contar volúmenes que atraviesan secciones explica continuidad; no autoriza Bernoulli si hay bomba o fuerte disipación. Referencia: OpenStax, 14.4 y 14.6.

## 8. Datos del mundo

FIVB publica una presión interna reglamentaria para el balón de vóley de 294,3–318,82 hPa. Es útil para leer unidades y diferenciar una especificación de una medición. Antes de usarla en una ecuación de gas, el problema debe precisar que se interpreta como sobrepresión y aportar la presión atmosférica correspondiente; no se sustituye directamente por presión absoluta. Fuente: regla 3.1.

## 9. Dudas y decisiones

La tensión superficial figura en el temario UNMSM, pero aquí solo se ubica como fenómeno que puede invalidar el modelo simple de flotación de objetos diminutos; si se evaluará cuantitativamente, requiere una quinta idea propia. Se descartan escenas que atribuyan a Juliaca una presión o ebullición exacta sin medición y condiciones.

## 10. Fuentes

- UNMSM (proceso 2023-I). *Reglamento de admisión*, Física 5. [Documento](https://medicina.unmsm.edu.pe/wp-content/uploads/2023/02/Reglamento-de-Admision-2023-I.pdf).
- UNI (2021). *Solucionario Admisión 2021-1*, Física 5. [Documento](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario2021.pdf).
- Loverude, M. E.; Kautz, C. H.; Heron, P. R. L. (2003). *Helping students develop an understanding of Archimedes’ principle. I. Research on student understanding*. [Resumen consultado](https://www.per-central.org/items/detail.cfm?ID=2647), DOI 10.1119/1.1607335.
- Moebs, W.; Ling, S. J.; Sanny, J. (2016). *University Physics Volume 1*, [14.4](https://openstax.org/books/university-physics-volume-1/pages/14-4-archimedes-principle-and-buoyancy) y [14.6](https://openstax.org/books/university-physics-volume-1/pages/14-6-bernoullis-equation).
- FIVB (2025). *Official Volleyball Rules 2025–2028*, 3.1. [Documento](https://www.fivb.com/wp-content/uploads/2025/01/FIVB-Volleyball_Rules2025_2028-EN-v05.pdf).
