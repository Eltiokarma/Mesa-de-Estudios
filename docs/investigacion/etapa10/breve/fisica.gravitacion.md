# FI10 · Física · Gravitación universal

> Parte del documento de ChatGPT de las 32 unidades (21 nov 2026), por verificar. Cómo se leyó la evidencia y el contrato común de las escenas: `docs/investigacion/etapas-9-12/como-leer.md`.


## 1. Resumen en cinco líneas

Dos masas se atraen y ejercen fuerzas iguales en magnitud sobre cuerpos distintos.  
La distancia relevante se mide entre centros en el modelo esférico.  
El campo gravitatorio permite separar la fuente de la masa de prueba.  
La órbita es caída continua, no ausencia de gravedad.  
Lo más difícil es distinguir altura, radio orbital, fuerza y aceleración.

## 2. Qué se pregunta en los exámenes

| Tipo | Universidad | Dificultad | Frecuencia | Fuente |
|---|---|---|---|---|
| Fuerza gravitatoria y dinámica circular | UNMSM | Media/alta | Temario histórico; no estimada | UNMSM, Física 2.3 |
| Variación de campo, órbitas y energía | Extensión de preparación | Alta | Sin ítem oficial específico verificado en esta revisión | OpenStax, capítulo 13 |
| Órbita elíptica como problema geométrico | UNI | Alta | 2021-1, Matemática 20; no se cuenta como pregunta de ley gravitatoria | UNI |

## 3. Errores típicos

| Código | Qué hace | Por qué | Estado | Fuente |
|---|---|---|---|---|
| G-PAR | Confunde reacción al peso con la fuerza que sostiene al cuerpo | Mezcla fuerzas equilibrantes e interacción entre cuerpos | Documentado | Zhou, Zhang y Xiao, 2015, resultados |
| G-DIS | Usa altura sobre el suelo en vez de distancia al centro | Toma el dibujo de la superficie como origen universal | Hipótesis | Diseño propio |
| G-CER | Supone que en órbita no hay gravedad o que la masa mayor tiene más aceleración | Asocia caída con descenso visible; confunde fuerza y aceleración | Hipótesis | Diseño propio |
| G-MAS | Atribuye fuerzas mutuas desiguales a masas o movimientos distintos | Confunde fuerza de interacción con aceleración | Hipótesis | Diseño propio |
| G-ORB | Decide la rapidez orbital por la longitud de la órbita sin ajustar el periodo | Omite la dinámica gravitatoria | Hipótesis | Diseño propio |

## 4. Lo que la unidad da por sabido

Vectores, segunda y tercera leyes de Newton, aceleración centrípeta, energía mecánica, potencias y raíces. Se explicita la aproximación de fuente central mucho más masiva para las órbitas.

## 5. Las ideas, en orden

### Idea 1. Atracción mutua — ¿Quién tira de quién?

**Aprende:** la interacción tiene dos fuerzas, aplicadas a objetos diferentes.

**Lee / objeto:** globo terráqueo y maqueta identificada como satélite peruano. «La maqueta representa dos cuerpos con masa». «Cada fuerza tiene un cuerpo que la recibe». «Las separaciones se miden entre puntos definidos».

**Juega:** coloca etiquetas de fuerza sobre el cuerpo receptor correcto y une sus centros; la validación comprueba emisor y receptor. No compara aceleraciones.

**Predice:** al interactuar gravitatoriamente la Tierra y un satélite, ¿cómo se comparan las magnitudes de las fuerzas que ejercen uno sobre otro? A) Son iguales **[correcta]**. B) La que ejerce la Tierra es mayor por su masa [G-MAS]. C) La que ejerce el satélite es mayor porque se mueve más [G-MAS]. D) El satélite no ejerce fuerza porque está en órbita [G-CER].

**Mira:** aparecen fuerzas opuestas en cuerpos distintos y aceleraciones de diferente magnitud.

**La regla:** $M,m$ son masas; $r$, distancia entre centros; $G$, constante gravitatoria universal. Para masas puntuales, o cuerpos con distribución de masa esféricamente simétrica observados externamente, la magnitud de la fuerza es $F=GMm/r^2$, dirigida hacia la otra masa. Ambas fuerzas tienen igual magnitud y sentidos opuestos, pero no se anulan en el diagrama de un solo cuerpo. Al cambiar $r$, comparar el cuadrado del factor de distancia.

**Palabras:** *interacción*: influencia mutua; ejemplos: Tierra-satélite, Tierra-Luna, dos masas. *Centro*: referencia del modelo esférico; ejemplos: centro terrestre, centro lunar, centro de una esfera homogénea.

**Así se resuelve:** identificar masas y centros; convertir distancia a metros; aplicar la ley; comparar fuerzas y luego aceleraciones con $F/m$. **Ahora tú:** razón de fuerzas → cambio de distancia → superposición vectorial de dos fuentes.

### Idea 2. Campo y altura — ¿Por qué cambia el peso sin cambiar la masa?

**Aprende:** el campo depende de la fuente y la distancia, no de la masa de prueba.

**Lee / objeto:** una pesa de laboratorio junto a una maqueta de planeta con niveles de altura. «La masa acompaña al objeto». «El peso es una fuerza». «La altura empieza en la superficie elegida».

**Juega:** a un radio fijo cambia la masa de prueba y comprueba el cociente fuerza/masa; el programa exige un cociente objetivo. No deja cambiar altura.

**Predice:** si la altura del satélite sobre la superficie es igual al radio planetario, ¿qué distancia hay del satélite al centro? A) Dos radios **[correcta]**. B) Un radio, usando solo la altura [G-DIS]. C) Medio radio, dividiendo en vez de sumar las distancias [G-DIS]. D) Cero, confundiendo altura sobre la superficie con separación del centro [G-DIS].

**Mira:** superpone el radio del planeta y la altura, de extremo a extremo.

**La regla:** $R$ es radio planetario, $h$ altura y $g$ magnitud del campo. Fuera de la esfera, $r=R+h$, $g=GM/r^2$ y el peso es $mg$. Los campos de varias fuentes se suman como vectores. La energía potencial gravitatoria, $U=-GMm/r$, toma cero en el infinito; para ascensos pequeños, su cambio se aproxima por $mg\Delta h$ si $g$ casi no varía. No aplicar la ley externa dentro de un planeta sin modelo de distribución de masa.

**Palabras:** *campo*: efecto de la fuente por unidad de masa; ejemplos: cerca de la Tierra, sobre la Luna, a cierta altura. *Potencial*: energía por unidad de masa asociada a una posición; ejemplos: superficie, órbita baja, referencia en el infinito.

**Así se resuelve:** sumar radio y altura; calcular la razón $g_2/g_1=(r_1/r_2)^2$; mantener masa; obtener el nuevo peso. **Ahora tú:** masa/peso → razón de campos → energía entre dos radios.

### Idea 3. Caer alrededor — ¿Cómo se sostiene una órbita?

**Aprende:** la gravedad proporciona la aceleración que curva la trayectoria.

**Lee / objeto:** maqueta de lanzamiento horizontal alrededor del globo. «La velocidad tiene dirección tangente». «La trayectoria puede curvarse». «El tiempo de una vuelta se llama período».

**Juega:** ajusta velocidad tangencial hasta mantener una órbita circular al radio fijo; éxito si el radio se mantiene dentro de una tolerancia declarada durante una vuelta. No muestra una segunda altura.

**Predice:** en una órbita circular de radio mayor alrededor de la misma fuente dominante, ¿cómo cambia la rapidez orbital? A) Es menor **[correcta]**. B) Es mayor porque la circunferencia es más larga [G-ORB]. C) Es igual porque todas las órbitas circulares tendrían el mismo periodo [G-ORB]. D) Es cero porque allí ya no habría gravedad [G-CER].

**Mira:** compara dos órbitas, distinguiendo rapidez y tiempo de vuelta.

**La regla:** $v$ es rapidez orbital y $T$ período. Igualar $GMm/r^2=mv^2/r$ da $v=\sqrt{GM/r}$ y $T=2\pi\sqrt{r^3/(GM)}$. Con $K=mv^2/2$, la energía total circular es $E=K+U=-GMm/(2r)$. La rapidez mínima ideal de escape desde radio $r$ es $v_{\mathrm{esc}}=\sqrt{2GM/r}$, sin atmósfera ni propulsión posterior. Para órbitas elípticas alrededor de la misma fuente dominante, $T^2/a^3$ es constante, con $a$ semieje mayor; el radio vector barre áreas iguales en tiempos iguales. Una órbita circular es un caso particular.

**Palabras:** *órbita*: recorrido ligado a una atracción central; ejemplos: circular, elíptico, satélite terrestre. *Período*: tiempo para repetir una vuelta; ejemplos: satélite, Luna, planeta.

**Así se resuelve:** convertir altura en radio; elegir circular o elíptica; deducir rapidez desde fuerza centrípeta; usar longitud de vuelta para período; comprobar supuestos. **Ahora tú:** órbita circular → comparación de períodos → escape y energía; elipses solo con datos suficientes.

## 6. Letras y símbolos

| Símbolo | Significado | Unidad / advertencia |
|---|---|---|
| $G$ | Constante gravitatoria | N·m²/kg²; no confundir con g |
| $M,m,F,g$ | Masas fuente/prueba, fuerza, campo | kg, kg, N, N/kg = m/s² |
| $r,R,h,a$ | Distancia central, radio planetario, altura, semieje mayor | m; a no es aceleración aquí |
| $v,T,U,K,E$ | Rapidez, período, energía potencial, cinética, total | m/s, s, J, J, J |
| $\pi,\Delta$ | Constante circular, cambio | Sin unidad |

## 7. Otras formas de explicarla

La caída horizontal alrededor de un globo prepara las órbitas; no debe mostrar motores necesarios para sostener la circular ideal. Las flechas de campo ayudan a la superposición, después de identificar los cuerpos. La tela elástica puede sugerir curvatura, pero usa la gravedad para explicar la gravedad y representa otra teoría: no conviene como explicación principal de Newton. Referencia: OpenStax, 13.2 y 13.4.

## 8. Datos del mundo

Una nota oficial del Congreso del 19 de diciembre de 2018, sobre una exposición de CONIDA, reporta 694 km para la altura de observación de PerúSAT-1. Se usa como antecedente aproximado para un modelo orbital, no como telemetría actual ni como distancia al centro de la Tierra. Radio terrestre, masa y constante gravitatoria deberán darse en la ficha de cada problema.

## 9. Dudas y decisiones

No se confirmó aquí una pregunta oficial reciente de gravitación para UNI. El problema de Mercurio del examen citado es geométrico: no se usa para inflar esa evidencia. Se excluyen relatividad y campo interno de esferas salvo una futura ampliación. La referencia orbital histórica requiere actualizarse si se afirma una situación actual del satélite.

## 10. Fuentes

- UNMSM (proceso 2023-I). *Reglamento de admisión*, Física 2.3. [Documento](https://medicina.unmsm.edu.pe/wp-content/uploads/2023/02/Reglamento-de-Admision-2023-I.pdf).
- UNI (2021). *Solucionario Admisión 2021-1*, Matemática 20. [Documento](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario2021.pdf).
- Zhou, S.; Zhang, C.; Xiao, H. (2015). *Students’ Understanding on Newton’s Third Law in Identifying the Reaction Force in Gravity Interactions*. [Original](https://www.ejmste.com/download/students-understanding-on-newtons-third-law-in-identifying-the-reaction-force-in-gravity-4389.pdf), DOI 10.12973/eurasia.2015.1337a. El título del visor está mal indexado; el cuerpo del PDF corresponde al estudio citado.
- Moebs, W.; Ling, S. J.; Sanny, J. (2016). *University Physics Volume 1*, [13.2](https://openstax.org/books/university-physics-volume-1/pages/13-2-gravitation-near-earths-surface) y [13.4](https://openstax.org/books/university-physics-volume-1/pages/13-4-satellite-orbits-and-energy).
- Congreso de la República (2018). *Satélite peruano orbita desde hace 2 años*. [Nota oficial](https://comunicaciones.congreso.gob.pe/noticias/satelite-peruano-orbita-desde-hace-2-anos/).
