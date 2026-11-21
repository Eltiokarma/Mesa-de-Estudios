# GE12 · Geometría · Áreas de regiones triangulares y cuadrangulares

> Parte del documento de ChatGPT de las 32 unidades (21 nov 2026), por verificar. Cómo se leyó la evidencia y el contrato común de las escenas: `docs/investigacion/etapas-9-12/como-leer.md`.


## 1. Resumen en cinco líneas

El área mide superficie y se conserva al recortar y recomponer sin superposiciones.  
Base y altura deben corresponder y ser perpendiculares.  
Los datos disponibles determinan qué expresión de área conviene.  
Los cuadriláteros se comprenden mediante particiones en triángulos.  
La dificultad principal es separar área, perímetro y factores de escala.

## 2. Qué se pregunta en los exámenes

| Tipo | Universidad | Dificultad | Frecuencia | Fuente |
|---|---|---|---|---|
| Áreas de triángulos y cuadriláteros | UNMSM | Media/alta | Temario histórico; no estimada | UNMSM, 11.2 |
| Área con lados, inradio, circunradio y relaciones de áreas | UNI, CEPREUNI | Alta | Temario explícito; no estimada | CEPREUNI |
| Regiones compuestas y semejanza | Propuesta alineada | Alta | Sin ítem específico contado | Temarios; diseño propio |

## 3. Errores típicos

| Código | Qué hace | Por qué | Estado | Fuente |
|---|---|---|---|---|
| A-ALT | Usa lado oblicuo como altura | No exige perpendicularidad; apoyo parcial en dificultades de altura | Hipótesis de aplicación a áreas | Morales y Damián, 2021, no estudia este distractor exacto |
| A-PER | Supone igual área al mantener perímetro | Confunde borde y superficie | Hipótesis | Diseño propio |
| A-ESC | Multiplica área por el factor lineal de semejanza | No considera dos dimensiones | Hipótesis | Diseño propio |

## 4. Lo que la unidad da por sabido

Alturas, semejanza, triángulos, cuadriláteros, perímetro, Pitágoras, seno elemental, inradio y circunradio. Se recupera conversión de unidades cuadradas.

## 5. Las ideas, en orden

### Idea 1. Recortar sin perder — ¿Por qué aparece la mitad en el área triangular?

**Aprende:** dos triángulos congruentes forman un paralelogramo de igual base y altura.

**Lee / objeto:** retazo triangular de tela sobre una mesa. «La superficie se puede cubrir con unidades cuadradas». «Un corte no crea tela». «La altura se mide perpendicular a la base elegida».

**Juega:** empareja dos retazos congruentes para formar un paralelogramo sin huecos; el programa comprueba cobertura y ausencia de superposición. No permite cambiar la inclinación.

**Predice:** si se desplaza un vértice paralelo a una base fija y se mantiene la altura, ¿cómo cambia el área triangular? A) Permanece igual **[correcta]**. B) Aumenta si se alarga un lado oblicuo [A-ALT]. C) Disminuye si se acorta un lado oblicuo [A-ALT]. D) No puede decidirse sin conocer el nuevo perímetro [A-PER].

**Mira:** mueve el vértice sobre una paralela y conserva la base y la franja de altura.

**La regla:** $S$ es área; $b$, base; $h$, altura correspondiente. Para triángulo $S=bh/2$; para paralelogramo $S=bh$. La altura puede caer en la prolongación de la base. Las unidades de área son cuadradas: convertir longitudes primero o elevar al cuadrado el factor de conversión. Recortar y recomponer conserva área si no hay huecos ni solapamientos.

**Palabras:** *área*: superficie cubierta; ejemplos: retazo, baldosa, terreno idealizado. *Altura correspondiente*: separación perpendicular a la base elegida; ejemplos: interior, exterior, lado perpendicular.

**Así se resuelve:** elegir base; localizar perpendicular; convertir unidades; aplicar la relación; verificar que no se usó el lado inclinado. **Ahora tú:** altura visible → altura exterior → recortes y áreas iguales.

### Idea 2. Elegir por los datos — ¿Cómo hallar área sin una altura entregada?

**Aprende:** distintas fórmulas describen la misma superficie bajo datos diferentes.

**Lee / objeto:** parcela triangular de una maqueta, con cintas que pueden medir lados o radios. «Cada instrumento entrega un tipo de dato». «La altura puede estar oculta». «Una figura necesita medidas compatibles para existir».

**Juega:** selecciona entre instrumentos los que permiten obtener base y altura de una maqueta; el sistema valida suficiencia. No ofrece todavía tres lados como única información.

**Predice:** se conocen los tres lados de un triángulo válido. ¿Qué afirmación es correcta sobre su área? A) Puede determinarse aunque la altura no se entregue directamente **[correcta]**. B) Es imposible determinarla porque falta una altura escrita [A-ALT]. C) Es igual a la suma de los tres lados [A-PER]. D) Basta usar cualquiera de los lados como base y otro cualquiera como altura [A-ALT].

**Mira:** construye la altura desde los tres lados y muestra por qué ya estaba determinada.

**La regla:** $a,b,c$ son lados, $s=(a+b+c)/2$ semiperímetro, $r$ inradio, $R$ circunradio y $\gamma$ ángulo comprendido entre a y b. Entonces $S=ab\sin\gamma/2$, $S=\sqrt{s(s-a)(s-b)(s-c)}$, $S=rs$, $S=abc/(4R)$. Se justifican respectivamente por altura, eliminación de la altura con Pitágoras, suma de tres triángulos y ley de senos. Exigir desigualdad triangular y medidas positivas; no elegir fórmula solo por su brevedad.

**Palabras:** *semiperímetro*: mitad del recorrido del borde; ejemplos: triángulo escaleno, isósceles, equilátero. *Dato suficiente*: información que determina lo solicitado; ejemplos: base y altura, dos lados y ángulo comprendido, tres lados válidos.

**Así se resuelve:** inventariar datos; descartar fórmulas que requieren una incógnita extra; justificar la elegida; sustituir; comprobar unidades cuadradas. **Ahora tú:** dos lados y ángulo → Herón → inradio/circunradio y relaciones combinadas.

### Idea 3. Partir cuadriláteros — ¿Qué fórmula corresponde a cada figura?

**Aprende:** las fórmulas se deducen de una descomposición y no de la orientación del dibujo.

**Lee / objeto:** mesa, cometa de papel y pieza trapezoidal de tela. «Las figuras tienen propiedades distintas». «Una diagonal puede dividirlas en triángulos». «Los nombres no sustituyen las marcas de paralelismo y perpendicularidad».

**Juega:** corta virtualmente un paralelogramo y recompón un rectángulo; valida misma base y altura. No se permite aún usar un cuadrilátero general.

**Predice:** ¿qué condición permite hallar el área de un cuadrilátero convexo como la mitad del producto de sus diagonales? A) Que las diagonales sean perpendiculares **[correcta]**. B) Ninguna: funciona para todas las diagonales [A-ALT]. C) Que las diagonales sean iguales, aunque no sean perpendiculares [A-ALT]. D) Que los lados opuestos sean iguales, aunque las diagonales sean oblicuas [A-ALT].

**Mira:** cambia el ángulo entre diagonales manteniendo sus longitudes y compara áreas.

**La regla:** rectángulo y paralelogramo: $S=bh$. Trapecio con bases paralelas $B,b$ y altura $h$: $S=(B+b)h/2$, por duplicación y recomposición. Cuadrilátero convexo con diagonales $d_1,d_2$ y ángulo $\phi$ entre ellas: $S=d_1d_2\sin\phi/2$; si son perpendiculares, se elimina el factor seno porque vale uno. Un cuadrilátero general se divide en triángulos con datos suficientes; no se le atribuye fórmula de rectángulo por parecerlo.

**Palabras:** *trapecio*: cuadrilátero con el par de bases paralelas declarado; ejemplos: pieza de tela, sección de canal ideal, tablero trapezoidal. *Descomposición*: separación en piezas que se pueden medir; ejemplos: dos triángulos, rectángulo más triángulo, región grande menos hueco.

**Así se resuelve:** reconocer propiedades marcadas; dibujar una partición; expresar áreas de piezas; sumar o restar sin doble conteo. **Ahora tú:** fórmula directa → altura oculta → región sombreada compuesta.

### Idea 4. Comparar sin calcular todo — ¿Cómo cambia el área al ampliar una figura?

**Aprende:** la relación de áreas depende de qué longitudes o alturas se conservan.

**Lee / objeto:** dos moldes semejantes para cortar tela. «Una ampliación cambia todas las longitudes por el mismo factor». «El borde y la superficie son cantidades diferentes». «Las piezas pueden compararse sin medir cada una».

**Juega:** amplía un molde y comprueba razones de lados iguales; el panel de área permanece oculto.

**Predice:** si se duplican todas las longitudes de una figura, ¿por qué factor cambia su área? A) Por cuatro **[correcta]**. B) Por dos, usando solo el factor lineal [A-ESC]. C) Por ocho, usando tres dimensiones [A-ESC]. D) Por uno, ignorando el cambio de escala de la superficie [A-ESC].

**Mira:** divide la figura ampliada en unidades de superficie comparables.

**La regla:** con factor de semejanza $k>0$, $S_2/S_1=k^2$. Para triángulos de igual altura, la razón de áreas es la de sus bases; para igual base, la de alturas. Una mediana divide un triángulo en dos áreas iguales. Si las regiones comparten base o altura, usar esa relación antes de buscar medidas innecesarias. Igual perímetro no implica igual área.

**Palabras:** *semejanza*: misma forma con escala uniforme; ejemplos: plano ampliado, molde reducido, dos triángulos equiángulos. *Razón de áreas*: comparación de superficies; ejemplos: doble superficie, cuarta parte, factor cuadrático.

**Así se resuelve:** determinar qué se conserva; escoger razón de bases, alturas o semejanza; asignar un área auxiliar; propagar relaciones y comprobar la suma total. **Ahora tú:** escala → mediana → partición con varias razones.

## 6. Letras y símbolos

| Símbolo | Significado | Unidad / advertencia |
|---|---|---|
| $S$ | Área | m², cm² u otra unidad cuadrada; no usar A a la vez como vértice |
| $a,b,c,B,h$ | Lados, base mayor de trapecio, altura | Longitud; b mantiene papel de lado/base |
| $s,r,R$ | Semiperímetro, inradio, circunradio | Longitud |
| $d_1,d_2,\gamma,\phi,k$ | Diagonales, ángulos, factor de semejanza | Longitud; grados; sin unidad |

## 7. Otras formas de explicarla

Recortes y recomposición explican las fórmulas con conservación visible; impedir superposiciones que simulen una igualdad falsa. Cuadrículas ayudan a distinguir perímetro y área, pero una aproximación por conteo no prueba un resultado exacto en bordes oblicuos. Las razones de áreas reducen cálculos cuando se identifican alturas comunes. Apoyo deductivo: Euclides I.47 y relaciones del temario CEPREUNI.

## 8. Datos del mundo

Una cancha FIVB mide 18 por 9 m. Puede dividirse en regiones triangulares y rectangulares; las áreas se obtendrán por cálculo del equipo. Esta medida no incluye automáticamente toda la zona libre alrededor de la cancha. Fuente: regla 1.1.

## 9. Dudas y decisiones

Se incluye Herón por cobertura del temario, siempre después de base-altura. No se incluyen áreas circulares: corresponden a otra unidad. Las definiciones escolares de trapecio varían; la app debe adoptar una convención y expresar las propiedades necesarias en cada ejercicio.

## 10. Fuentes

- UNMSM (proceso 2023-I). *Reglamento de admisión*, Geometría 11. [Documento](https://medicina.unmsm.edu.pe/wp-content/uploads/2023/02/Reglamento-de-Admision-2023-I.pdf).
- CEPREUNI (2023). *Sílabo básico 2023-2*, Áreas de regiones poligonales. [Documento](https://www.cepre.uni.edu.pe/assets/archivos/comunicados/Syl_Bas_PS_2023-2.pdf).
- Morales Carballo, A.; Damián Mojica, A. (2021). *Errores y dificultades acerca de las rectas notables del triángulo*. [Original](https://funes.uniandes.edu.co/wp-content/uploads/tainacan-items/32454/1190366/Morales2021Errores.pdf). Apoyo limitado al concepto de altura.
- Euclides; edición digital de D. E. Joyce (1996–1998). *Elements*, [I.47](https://mathcs.clarku.edu/~djoyce/elements/bookI/propI47.html).
- FIVB (2025). *Official Volleyball Rules 2025–2028*, 1.1. [Documento](https://www.fivb.com/wp-content/uploads/2025/01/FIVB-Volleyball_Rules2025_2028-EN-v05.pdf).
