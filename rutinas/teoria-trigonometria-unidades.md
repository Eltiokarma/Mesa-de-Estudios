# Reportes por unidad: teoría de Trigonometría (14 nov 2026)

Reportes de cada unidad, tal como los dejó quien la escribió (la sesión principal o sus subagentes), con lo que se vio y se corrigió en las capturas. El resumen está en `rutinas/teoria-trigonometria.md`.

## trigonometria.angulo-trigonometrico — completa (4 ideas)

Unidad modelo, escrita por la sesión principal. Ideas: sentido y signo (trig-plano, espiral para más de una vuelta), tres sistemas (D/180 = G/200 = R/π, predicción 40ᵍ → 36°), radián (predicción: una vuelta mide 2π ≈ 6,28 radios, no 6), minutos no son décimas (recta, predicción 2° 15′ = 2,25°). Colores: θ, D, G y R en c-o (un mismo giro en tres escalas); s c-i; r c-d; n c-h. En las capturas se corrigió: el rótulo «inicial» chocaba con la x del eje (pasó a un rótulo bajo el eje); la lectura repetía el ángulo; el control de 15 en 15 daba grados centesimales periódicos (pasó a 18 en 18); la pieza recta rotulaba mal con cada = 4 (se usan rayitas de 12′); «·» entre dos fórmulas se leía como producto (pasó a «;»).

## trigonometria.longitud-de-arco-y-sector — completa (5 ideas)

Archivo: contenido/teoria/trigonometria/longitud-de-arco-y-sector.js. teoria.test.js en verde.

### Ideas
1. `arco` — El arco cuenta radios — Longitud de arco.
2. `sector` — El área lleva dos radios — Área del sector y del trapecio circular.
3. `trapecio-circular` — Sector grande menos sector chico — Área del sector y del trapecio circular.
4. `vueltas-rueda` — La rueda gira lo que avanza — Número de vueltas de una rueda (la moneda que rodea a otra igual da 2 vueltas).
5. `faja-y-eje` — Mismo borde o mismo ángulo — Ruedas, poleas y engranajes (faja / engranaje en el juego; eje común en la predicción; dientes en Mira y Ahora tú).

### Piezas
Solo `trig-plano` (sectores con r0 para la banda, arcos, rayos con cx/cy para ruedas, segmentos para faja y dientes). Ninguna pieza nueva.

### Colores
θ y n (vueltas) naranja c-o; s, L, l, d (largos recorridos) turquesa c-i; r, R, h verde c-d; A rojo c-h.

### Códigos de error
TR4 (existente). Hipótesis nuevas: ARCO-DIVIDE, ARCO-AREA, ARCO-DIAM, SEC-LINEAL, SEC-ARCO-CUADRADO, SEC-ANGULO, SEC-ARCO, SEC-MITAD, TRAP-RESTA, TRAP-GRANDE, TRAP-MITAD, VUEL-CONTACTO, VUEL-TRASLADA, VUEL-DIAMETRO, VUEL-RADIO, VUEL-SIN-PI, VUEL-DENTRO, VUEL-FUERA, POL-FAJA-EJE, POL-PROPORCIONAL, POL-SENTIDO, POL-IGUAL (error objetivo de la matriz), POL-INVERSA.

### Pedidos al molde
- Animación de la rueda que rueda (gesto propio o `montar`): hoy la rueda salta de posición con el control d; rodar con rastro de la marca (cicloide) enseñaría más. Caso: idea 4.
- Ahora tú sin figura deja un hueco alto arriba (ideas 4 y 5): sería mejor que la zona de figura se pliegue si el caso no trae dibujo.

### No verificado
- Celular real, lector de pantalla. La convención de examen para «número de vueltas» por dentro (R − r)/r se tomó de la matriz y del cálculo; no contrastada con un examen.

### Capturas (claro y oscuro, 360 px): hallazgos corregidos
- Rótulo «60° = π/3» del ángulo cruzado por el lado del sector en Mira de la idea 1: pasa a «60°» (la conversión queda en la ecuación).
- Idea 2: con r = 2, s y A daban el mismo número (7,33 y 7,33 cm²): el juego pasa a r = 3 cm.
- Idea 2, Mira: la circunferencia punteada se salía de la ventana: quitada.
- Idea 3: «A = 2π» chocaba con «l = 2π/3» y luego con el lado de 60°: movido a (2,4; 1,95), revisado con render en color y grises.
- Idea 3, Ahora tú: la ventana cortaba los sectores de 120°: ventana calculada con cos θ.
- Idea 3, regla: la ecuación partía en dos líneas; segunda forma escrita como (L + l)h/2.
- Idea 4: el rótulo «centro: 2π · 2r» chocaba con la moneda de abajo: movido a la esquina.
- Idea 5: los rótulos 120° y 60° chocaban con el arco turquesa del borde: pasan debajo de cada rueda («A: 120°», «B: 60°»); en la revelación, «90°» va bajo el centro.
- Idea 5: el control de r de B empezaba en el máximo (el + no hacía nada): inicio en 1 cm.

## trigonometria.razones-trigonometricas-agudas — completa (4 ideas)

Archivo: contenido/teoria/trigonometria/razones-trigonometricas-agudas.js. teoria.test.js en verde.

### Ideas
1. `razon-cociente` — Una razón es un cociente — Definición en el triángulo rectángulo (predicción: triángulos 3-4-5 y 6-8-10, ¿cuál tiene mayor sen θ?).
2. `notables` — Medio cuadrado, medio equilátero — Ángulos notables (predicción: sen 60° a partir de sen 30°, con TR10).
3. `aproximados` — 37° es un redondeo — Ángulos aproximados (37°, 53°, 16°, 74°) (predicción: ¿el 3-4-5 tiene exactamente 37°? El juego muestra el opuesto con un decimal, así 37° parece dar 3,0; la revelación muestra 3,01 y 36,87°).
4. `complementarias` — Complementarias y recíprocas — Razones recíprocas y complementarias (predicción: cos 65° a partir de sen 25°; Ahora tú contrasta sen = cos (suman 90°) con tan · cot = 1 (iguales)).

### Piezas
Solo `triangulo` (lados con color, ángulos, `paso`, `final`, `fantasma`). Ninguna pieza nueva.

### Colores
θ naranja c-o; CO rojo c-h; CA turquesa c-i; H verde c-d (siempre nombrados desde θ).

### Códigos de error
Existentes: TR7, TR8, TR9, TR10. Hipótesis nuevas: RAZ-FALTA-ANGULO, REC-INVERSA, NOT-MISMO, NOT-RECIPROCA, NOT-CAMBIA, APROX-EXACTO, APROX-ENTERO, APROX-MEDIR, COMP-MISMO-ANG, COMP-CALC, COMP-IGUALA, COMP-180, REC-COMPLEMENTO.

### Pedidos al molde
- La pieza `triangulo` no tiene `hasta` (algo que se ve solo en algunos pasos) ni distancia de rótulo por lado: el rótulo de la hipotenusa cae en el centro de la caja y elige lado al azar del signo; se resolvió con `lado: -1`. Pedido: `hasta` y `dist` por lado.
- El rótulo de un lado elige «afuera» respecto al centro de toda la figura: con dos triángulos juntos, los rótulos interiores se cruzan (ver hallazgos). Pedido: centro por grupo.

### No verificado
- Celular real; lector de pantalla. En Ahora tú de la idea 3, el distractor «razón invertida» da valores como 178,57 (dado²/correcto): es el error real, pero queda lejos; quizá convenga otro.

### Capturas (claro y oscuro): hallazgos corregidos
- Idea 1: con los triángulos 3-4-5 dentro del 6-8-10, los rótulos 3, 5, 8 y 10 chocaban con vértices y escuadras: ahora van lado a lado, con θ en los dos.
- Idea 1, regla: la ecuación con sen, cos y tan partía «cos θ =» de su fracción: quedan sen y cos; tan pasa a la condición.
- Rótulo de la hipotenusa dentro del triángulo y sobre el ángulo: `lado: -1` en todos.
- Idea 2: el paso de Mira del medio cuadrado no tenía figura: Mira suma el medio cuadrado al lado (paso 3); √3 forzado del lado de afuera.
- Idea 3: Mira con 3-4-5 y 7-24-25 juntos quedaba diminuta y los rótulos 36,87° y 53,13° se tapaban: queda el 3-4-5 grande y el 7-24-25 va en el recuadro fantasma (16,26° y 73,74°); el 7-24-25 se dibuja en Ahora tú.
- Idea 3: «Vale si úsalas…» no se leía bien tras «Vale si»: condición reescrita. Igual en la idea 2.
- Idea 4: lectura del juego partida en dos líneas: «otro agudo» → «otro». Regla con tres fórmulas en tres líneas: quedan dos.
- Idea 4, Ahora tú: aparecían distractores negativos (−16°): se descartan los valores ≤ 0.

## trigonometria.triangulos-rectangulos — completa (3 ideas)

Archivo: contenido/teoria/trigonometria/triangulos-rectangulos.js. teoria.test.js en verde.

### Ideas
1. `un-lado-un-angulo` — Un lado y un ángulo bastan — Resolver con un lado y un ángulo (juego: H y θ; predicción: con el cateto adyacente a 60° = 5, la hipotenusa, que obliga a dividir).
2. `elevacion-depresion` — Desde la horizontal del ojo — Ángulos de elevación y depresión (juego: elevación desde el suelo; predicción: depresión de 37° desde un faro de 30 m; Ahora tú incluye la altura del instrumento, error objetivo de la matriz).
3. `angulo-observacion` — Lo que abarca la mirada — Ángulo de observación (letrero de 2 m a 6 m; el juego va de 6 a 12 m, donde β solo crece al acercarse; la predicción pregunta qué pasa al seguir acercándose: máximo de 30° en d = 2√3 m y luego baja a 0°).

### Piezas
Solo `triangulo` (suelo, visuales, horizontal, `final`, `fantasma`). Ninguna pieza nueva.

### Colores
Ángulos θ, α, β naranja c-o; opuesto CO / altura h rojo c-h; adyacente CA / distancia d turquesa c-i; hipotenusa H / visual verde c-d (los mismos de razones-trigonometricas-agudas).

### Códigos de error
Existente: TR9. Hipótesis nuevas: RES-MULTIPLICA, RES-COMPLEMENTO, DEP-VERTICAL, ELEV-OJO (error objetivo de la matriz), OBS-CRECE, OBS-CONSTANTE, OBS-45, OBS-SOLO-ARRIBA, OBS-SUMA, OBS-RESTA-ALTURAS.

### Pedidos al molde
- La pieza `triangulo` reescala la figura a su caja: en el juego, la torre de 30 m y la de 10 m se ven del mismo tamaño. Para «elevación» convendría una escala fija opcional (`escala` o `ventana` en datos). Caso: idea 2 y 3.
- Rótulo de un lado vertical largo («letrero») cruzaba la línea: se cambió por «4 m». Pedido: revisar el ancla del rótulo en lados verticales.

### No verificado
- Celular real; lector de pantalla. Los ángulos 37°/53°/16° de Ahora tú se usan siempre con «convención 3-4-5» o «7-24-25» escrita; el resultado real difiere en décimas (8° es 8,13° exacto): está dicho en la unidad de razones, no se repite aquí.

### Capturas (claro y oscuro): hallazgos corregidos
- Idea 3: la figura del juego quedaba muy aplanada con d = 16 m: rango de 6 a 12 m.
- Idea 3: el rótulo «β ≈ 13,4°» cruzaba las visuales: el dibujo dice «β» y el valor va en la lectura.
- Idea 3: «ojo» y «d = 1 m» se tapaban cuando el ojo está cerca: sin «ojo» si d < 4 m; Mira rotula solo «β».
- Idea 3: «letrero» cruzaba el poste: pasa a «4 m».
- Idea 1, Ahora tú: el distractor de «nombrar desde el otro agudo» salía con decimales largos y se descartaba: ahora se escribe exacto (n√3, fracción /3 o decimal corto).

## trigonometria.recta-en-el-plano — completa (6 ideas)

Archivo: contenido/teoria/trigonometria/recta-en-el-plano.js. teoria.test.js en verde.

### Ideas (una por tema; seis temas, seis ideas)
1. `distancia` — La distancia es una hipotenusa — Distancia entre dos puntos (predicción: A(−2; 3), B(4; −5), con DIST-SUMA y DIST-SIGNO).
2. `division` — Promedio con pesos cruzados — División de un segmento y punto medio (el juego solo muestra el punto medio; la predicción es AP : PB = 1 : 3).
3. `baricentro-area` — Caja menos esquinas — Baricentro y área con coordenadas (juego con base horizontal; predicción con un triángulo sin lados horizontales; Mira: caja 4 × 5 menos tres esquinas = ½|det|, y G).
4. `pendiente` — Lo que sube por paso — Pendiente e inclinación (el juego excluye Δx = 0; la predicción es la recta vertical: «no tiene pendiente», con el distractor «∞, un número muy grande»; Mira lleva a θ = 135°).
5. `ecuaciones` — Tres ecuaciones, una recta — Ecuaciones de la recta (punto-pendiente, y = mx + b y general; m = −A/B).
6. `paralelas-perpendiculares` — Paralelas, perpendiculares y distancia — Paralelas, perpendiculares y distancia a una recta (juego: m₂ contra m₁ = 1/2; predicción: distancia del origen a 3x + 4y − 10 = 0, el ejemplo de la matriz; Ahora tú incluye la perpendicular a una horizontal, error objetivo de la matriz).

### Piezas
Solo `trig-plano` (cuadrícula con números, segmentos de borde a borde calculados en el archivo, arcos con centro, puntos con `lado`). Ninguna pieza nueva.

### Colores
Δx turquesa c-i; Δy rojo c-h; distancias y áreas (d, A) verde c-d; pendiente m e inclinación θ naranja c-o (la recta cuya pendiente se estudia, también naranja).

### Códigos de error (todos hipótesis; no hay informe de esta unidad en docs/investigacion/)
DIST-SUMA, DIST-SIN-RAIZ, DIST-SIGNO, DIV-PESOS, DIV-MEDIO, DIV-TERCIO, AREA-MITAD, AREA-SIN-ABS, AREA-CAJA, BAR-MITAD, BAR-SUMA, BAR-MEDIO-LADO, PEND-VERT-CERO, PEND-SOLO-DY, PEND-INFINITO, PEND-INVERSA, PEND-SIGNO, INCL-NEGATIVA, INCL-COMPLEMENTO, ECU-B-PUNTO, ECU-INVIERTE, ECU-SIGNO, ECU-M-GENERAL, PAR-PERP, PERP-INVERSA, PERP-SIGNO, PERP-HORIZONTAL (error objetivo de la matriz), DIST-SIN-NORMA, DIST-SUMA-COEF, DIST-CORTE.

### Pedidos al molde
- `trig-plano` no rellena polígonos: el área de la idea 3 se muestra con contorno, caja punteada y rótulos de las esquinas, sin sombrear. Pedido: `poligonos: [{ puntos, color }]` con relleno tenue (como `sectores`).
- `trig-plano` no tiene rectas oblicuas de borde a borde (solo y = k o x = k): el archivo recorta y = mx + b a la ventana (función `recta`). Si otras unidades lo necesitan, conviene `rectas: [{ m, b }]` en la pieza.
- La cuadrícula solo aparece con números (`numeros > 0`); en figuras con coordenadas negativas los números chocan con los rótulos. Pedido: cuadrícula sin números.
- Con varios controles, el script de recorrido solo pulsa «+»: controles que empiezan en el máximo no cuentan casos. Se ajustaron los inicios; vale como regla para todos.

### No verificado
- Celular real; lector de pantalla. En Ahora tú de la idea 2 el distractor DIV-TERCIO puede quedar lejos del segmento (por ejemplo (−21; 11)).

### Capturas (claro y oscuro): hallazgos corregidos
- Idea 1: «d ≈ 8,49» y A(−1; −1) chocaban con los números de los ejes: A pasa a (1; 1) y la ventana del juego a [−1; 7,5].
- Idea 1, predicción y Mira: «d = 10» y Δx = 6 sobre los números del eje: esas dos figuras van sin números (las coordenadas están en los rótulos).
- Idea 1 y 2: ecuación de la regla partida en dos líneas: queda una fórmula; Δx = x₂ − x₁ pasa a la condición; M = (A + B)/2 se dice en el texto.
- Idea 2: el tramo PB iba en naranja (color de la pendiente): pasa a neutro; rótulos «1 parte» y «3 partes».
- Idea 2: el control x de B empezaba en el máximo y el recorrido se trababa: inicio en 2.
- Idea 3: «9,5» tapaba la G del baricentro: movido arriba.
- Idea 4: Δx quedaba sobre el eje x y θ ≈ 45° encima: el triángulo parte de (1; −3), sin rótulo de θ en el juego (θ va en la lectura).
- Idea 4 y 5, Ahora tú: soluciones con «6 − (3)» e «y − (3) = 2(x − (2))»: paréntesis solo para negativos.
- Idea 5, Mira: ventana corrida para que (0; −5) no caiga en el borde; rótulo aparte para no tapar Δx.
- Idea 6: «2,5» y «d = 2» se tapaban en la revelación: el 2,5 va a la izquierda del eje.

## trigonometria.angulos-en-posicion-normal — completa (4 ideas)

Archivo: contenido/teoria/trigonometria/angulos-en-posicion-normal.js

### Ideas
1. razones-coordenadas · «Las razones salen de P» · Razones de un ángulo en posición normal (juego: P(x, y) con − +; predicción: P(−6, 8) sobre el mismo lado, TR8)
2. signos-cuadrante · «El signo sale de x, y» · Signos por cuadrante (juego: θ de 30° en 30°, la lectura da sen y cos; predicción: signo de tan 225°)
3. cuadrantales · «Cero no es «no definida»» · Ángulos cuadrantales (predicción: tan 90°, el error objetivo de la matriz)
4. coterminales-negativos · «Vueltas iguales, giros reflejados» · Ángulos coterminales, Ángulos negativos (juego: θ de 45° en 45° más n vueltas; predicción: sen(−30°))

Colores: θ c-o, x c-i, y c-h, r c-d.

### Piezas
Solo trig-plano. Ninguna nueva.

### Códigos de error
Existentes: TR7, TR8, TR11, TR12, TR15 (docs/investigacion/trigonometria-ideas-erroneas.md), TRIG-NEGATIVO (unidad 1).
Nuevos (hipótesis): TRPN-INVERSA, TRPN-TODO-NEG, TRPN-COPIA-SEN, TRPN-TAN-CERO, TRPN-INFINITO, TRPN-CERO-INDEF.

### Pedidos al molde
- trig-plano: el rótulo de un segmento que pasa por el origen cae de un lado u otro según el redondeo (la prueba «lejos del origen» da 0). Lo resolví con un `rotulos` calculado (rotR). Pedido: `lado: 'izquierda' | 'derecha'` explícito, o rótulo con desplazamiento dado.
- trig-plano: `numeros` dibuja cuadrícula y números juntos; los números de los ejes chocan con los rótulos x = …, y = …. Pedido: cuadrícula sin números (o números sin cuadrícula). Hoy uso numeros: 0.

### No verificado
- Celular real, lector de pantalla. Cifras de los errores nuevos (hipótesis).

### Capturas (claro y oscuro) — hallazgos y correcciones
- Idea 1: los números de los ejes chocaban con «x = −3» y «r = 5» → numeros: 0; P lleva sus coordenadas en el rótulo.
- Idea 1: «r = …» caía del lado de la ordenada y tapaba «y = …» → rótulo calculado del lado contrario al pie.
- Idea 1: en la revelación los rótulos de (−6, 8) tapaban P(−3, 4) → la revelación va sin rótulos de segmento, solo cos θ.
- Idea 2: en 180° «x −» chocaba con el rótulo del arco → sin rótulo de signo sobre los ejes.
- Idea 3: «no está definida» cruzaba la circunferencia → «tan 90° = 1/0 · no existe» en dos líneas; sec y csc en dos rótulos.
- Idea 4: «x igual» chocaba con el rótulo de −30° y con el arco de 330° → rótulo propio bajo el eje y solo en el paso 4; arco −30° hasta el paso 3.
- Oscuro: colores y contraste se leen; sin cambios.

## trigonometria.reduccion-al-primer-cuadrante — completa (4 ideas)

Archivo: contenido/teoria/trigonometria/reduccion-al-primer-cuadrante.js

### Ideas
1. angulo-referencia · «Mismo tamaño, otro signo» · Ángulos menores de una vuelta (juego: θ con su ángulo de referencia α y la copia en el I; predicción: cos 210°)
2. cofuncion · «Un cuarto de vuelta intercambia» · Ángulos menores de una vuelta (corrección 1 del expediente: 90°/270° cambian a la co-razón; juego: α de 15° en 15° y Q en 90° ± α; predicción: cos(90° + 20°))
3. mayores-negativos · «Primero se quitan las vueltas» · Ángulos mayores de una vuelta, Ángulos negativos (juego: −720° a 1080°; predicción: sen(−1110°), el ejemplo de TR15)
4. suplementarios-vuelta · «Suplementarios y de una vuelta» · Ángulos suplementarios y de una vuelta (juego: 180° − θ como reflejo en el eje y; predicción: cos(360° − θ), el reflejo en el eje x)

Colores: θ c-o (ángulo original), α c-d (referencia aguda), x c-i, y c-h.

### Piezas
Solo trig-plano. Ninguna nueva.

### Códigos de error
Existentes: TR11, TR12, TR14, TR15.
Nuevos (hipótesis): TRRD-SIGNO-REF, TRRD-ANALOGIA, TRRD-IGUALES.

### Pedidos al molde
- Ninguno nuevo (ver los de angulos-en-posicion-normal sobre rótulos de segmentos por el origen).

### No verificado
- Celular real, lector de pantalla. Cifras de los errores nuevos.

### Capturas (claro y oscuro) — hallazgos y correcciones
- Idea 1: en Mira «−√3/2» chocaba con el rótulo de 210° → el rótulo del arco se va en el paso 3; en la revelación «x = −√3/2» pasa debajo del rayo.
- Idea 2: «y de P» tapaba la P en 20° → sin rótulo; la consigna nombra la altura roja.
- Idea 3: el arco de 330° salía verde (color de α) → naranja, es un giro θ.
- Idea 4: «x igual» quedaba sobre el arco θ y el rayo → rótulo propio debajo del eje x.

## trigonometria.circunferencia-trigonometrica — completa (5 ideas)

Archivo: contenido/teoria/trigonometria/circunferencia-trigonometrica.js

### Ideas
1. arcos-reales · «Cada número es un arco» · Elementos y arcos dirigidos, Ubicación de números reales (juego: t de −3 a 3 con marcas 1…6 sobre la C.T.; predicción: t = 4 termina en el III; distractores TR3 y «un cuadrante por unidad»)
2. lineas-seno-coseno · «Seno y coseno con signo» · Líneas seno y coseno (predicción: cos 100° frente a cos 170°, el error objetivo de la matriz: línea larga ≠ valor mayor)
3. lineas-tangente-cotangente · «Tangente y cotangente: dos rectas» · Líneas tangente y cotangente (juego: solo tan sobre x = 1, de 20° en 20°; predicción: corte de OP con y = 1 en 120°)
4. lineas-secante-cosecante · «Secante y cosecante: los cortes» · Líneas secante y cosecante (recta que toca en P y sus cortes con los ejes; predicción: ¿sec θ = 0,5?)
5. variacion-cuadrantes · «Crecer es subir con signo» · Variación de las líneas por cuadrante (juego: cuadrante y línea sen/cos; predicción: tan en el II)

Colores: arco t/θ c-o; seno y cosecante c-h; coseno y secante c-i; tangente y cotangente c-d (cada recíproca con el color de la coordenada de la que sale; declarado en el encabezado).

### Piezas
Solo trig-plano. Ninguna nueva.

### Códigos de error
Existentes: TR3, TR10, TR11, TR12, TRPN-TAN-CERO (de angulos-en-posicion-normal).
Nuevos (hipótesis): TRCT-CUADRANTE, TRCT-RANGO, TRCT-COPIA, TRCT-SENTIDO, TRCT-MAXIMO.

### Pedidos al molde
- trig-plano no recorta lo que sale de la ventana: la secante y la tangente se restringen a ángulos donde el corte cabe (|valor| ≤ 2). Pedido: recorte (clipPath) a la ventana para poder mostrar la tangente cerca de 90°.
- Con solo cuatro colores, las seis líneas comparten color por pares recíprocos. Si el molde suma un quinto color, tan/cot podrían separarse de sec/csc con más claridad.

### No verificado
- Celular real, lector de pantalla. Cifras de los errores nuevos.

### Capturas (claro y oscuro) — hallazgos y correcciones
- Idea 1: el rótulo del arco «t = …» y las marcas 1…6 chocaban con A, B y los números → marcas dentro de la circunferencia y «t = …» en el punto final, sin rótulo de arco.
- Idea 3: en 120° «C» y «cot» se encimaban con P → si el tramo es corto, un solo rótulo «C: cot».
- Idea 4: «sec», «csc» y el rótulo del ángulo se tapaban en 210° → los nombres van en los puntos de corte; el arco sin número (el control lo dice); ventana ±2,2.
- Idea 4: el radio OP salía verde (color de tan) → gris de contorno.
- Idea 4: «OS = sec θ = 2» tapaba S → más abajo.

## trigonometria.identidades-fundamentales — completa (4 ideas)

Archivo: contenido/teoria/trigonometria/identidades-fundamentales.js

### Ideas
1. pitagoricas · «Pitágoras dentro de la circunferencia» · Identidades pitagóricas (juego: catetos cos θ y sen θ con hipotenusa 1; predicción: dividir entre cos²θ; Mira: los tres triángulos semejantes de 40°: 1, tan, sec y 1, cot, csc)
2. reciprocas-division · «Recíprocas y cocientes, con dominio» · Identidades recíprocas y por división (juego: tan θ junto a sen/cos; predicción: dónde falla sen θ · csc θ = 1; huecos del dominio en la C.T.)
3. auxiliares · «Al cuadrado aparece el doble» · Identidades auxiliares (pieza ejes: sen⁴ + cos⁴ contra 1; predicción: (sen θ + cos θ)², TR16)
4. simplificar-demostrar · «Demostrar no es probar valores» · Simplificación y demostración (pieza ejes: las dos caras de la igualdad; predicción: sen θ + cos θ = 1 coincide en 0°, 90°, 360° y falla en 45°, el error objetivo de la matriz; √(sen²θ) = |sen θ|; huecos que quedan tras simplificar)

Colores: θ c-o; seno y cosecante c-h; coseno y secante c-i; tangente, cotangente y el radio 1 c-d. En las gráficas, el lado izquierdo naranja y el derecho verde discontinuo.

### Piezas
trig-plano y ejes. Ninguna nueva.

### Códigos de error
Existentes: TR11, TR12, TR16, TRPN-INVERSA.
Nuevos (hipótesis): TRID-DIVIDE, TRID-LINEAL, TRID-DOMINIO, TRID-MITAD, TRID-SIN-CUADRADO, TRID-POTENCIA, TRID-MUESTREO, TRID-RAIZ (declarado; la idea 4 lo muestra en el juego, sin distractor propio todavía).

### Pedidos al molde
- trig-plano no recorta a la ventana: una circunferencia completa con una ventana del primer cuadrante se dibuja fuera de la figura y tapa el texto. Lo resolví con un cuarto de circunferencia como curva. Pedido: clipPath a la ventana.
- «Ahora tú» de simplificar: hoy son opciones; una respuesta que se arma (elegir la identidad de cada paso) mediría mejor la demostración (ya está en docs/teoria.md §10).

### No verificado
- Celular real, lector de pantalla. Cifras de los errores nuevos.

### Capturas (claro y oscuro) — hallazgos y correcciones
- Idea 1: la circunferencia completa de los tres triángulos salía de la figura y tapaba la pantalla → cuarto de circunferencia como curva gris.
- Idea 1: el rótulo «1» del radio caía sobre los catetos → del lado contrario al pie, como en angulos-en-posicion-normal.
- Idea 3: «sen⁴ + cos⁴» se encimaba con la curva → debajo de su mínimo.
- Idea 3, Ahora tú: sen θ cos θ = 7/10 era imposible (|sen θ cos θ| ≤ 1/2) → valores del producto elegidos de una lista válida.

## trigonometria.arcos-compuestos — completa (4 ideas)

Archivo: contenido/teoria/trigonometria/arcos-compuestos.js

### Ideas
1. seno-suma · «El seno no se reparte» · Seno, coseno y tangente de la suma y la diferencia (trig-plano: altura de P = altura de Q + subida; torre sen α + sen β que se pasa del círculo).
2. tangente-suma · «La tangente y su denominador» · Seno, coseno y tangente de la suma y la diferencia (trig-plano: recta x = 1; α + β = 90° hace el rayo paralelo; «Ahora tú» incluye casos «No existe»).
3. una-sola-onda · «Dos ondas, una sola cresta» · Identidades auxiliares (ejes: a sen x + b cos x = R sen(x + φ), máximo √(a² + b²)).
4. tres-angulos · «Tres ángulos que suman 180°» · Suma de tres ángulos (triangulo: tan A + tan B + tan C = producto; tan C = −tan(A + B)).

### Piezas
Usadas: trig-plano, ejes, triangulo. Nuevas: ninguna.

### Códigos de error nuevos (hipótesis)
COMP-DISTRIB, COMP-PROD, COMP-SIGNO, COMP-CRUCE, TANS-DISTRIB, TANS-SIGNO, TANS-CERO, AUX-SUMA, AUX-CUADRADO, AUX-MAYOR, AUX-SIN-K, AUX-SIGNO, TRES-SUPLE, TRES-CERO, TRES-FALTA, TRES-SUMA, TRES-PROD.

### Pedidos al molde
- Ninguno imprescindible. Nota: en `ejes`, el rótulo de un punto va siempre arriba; en un mínimo choca con la curva (se quitó el rótulo del mínimo en la idea 3). Un `lado` para los puntos de `ejes` ayudaría.
- `trig-plano` no recorta lo que sale de la ventana: para ventanas que no bajan de y = −0,3 se usa media circunferencia como arco (`color: null`, `grosor: 'contorno'`).

### Verificación
- teoria.test.js en verde para el archivo. Comprobación independiente (chk1.js): 60 semillas por idea comparando la opción correcta con Math.sin/cos/tan de los ángulos reconstruidos (atan2) y, en la idea 3, con el máximo/mínimo muestreado: 0 discrepancias.
- No verificado: celular real, lector de pantalla.

### Capturas (lo visto y corregido)
- Idea 1: la circunferencia completa se salía de la ventana (y ≥ −0,25) y tapaba la lectura → media circunferencia como arco.
- Idea 1, Mira: rótulos amontonados (cos β sobre el arco α, «sen α·cos β» sobre la torre) → ventana recortada a la derecha (x ≥ −0,75), sin torre aparte, la pila verde se arma bajo P, rótulos puestos a mano; el rayo α pasa a trazo fino para que OQ turquesa se vea debajo.
- Idea 2, Mira: «tan α = 1/2» y «tan β = 1/3» se pisaban (11 px) → ejemplo cambiado a tan α = 1, tan β = 1/3 (tan(α+β) = 2); ventana sin la mitad inferior en Mira y predicción.
- Idea 3: los rótulos «3 sen x» y «4 cos x» caían donde la onda roja coincide con ellas (x = 90°, 360°) → movidos a 150° y 315°; quitado el rótulo «mín −5» que cortaba la curva.
- Idea 4: con A = B = 80° el triángulo quedaba como aguja con rótulos encimados → A y B de 20° a 60°.
- Ahora tú idea 1: factor negativo sin paréntesis («+ −5/13 · 7/25») → paréntesis.
- Tema oscuro revisado (idea 2): legible.

## trigonometria.arcos-multiples — completa (4 ideas)

Archivo: contenido/teoria/trigonometria/arcos-multiples.js

### Ideas
1. angulo-doble · «El doble del ángulo» · Identidades del ángulo doble (trig-plano: la altura de 2θ son dos piezas iguales sen θ cos θ; torre 2 sen θ como contraste).
2. degradacion · «Bajar la potencia» · Degradación de potencias (ejes: sen² x y cos² x entre 0 y 1, centro 1/2, periodo 180°; predicción: A y B en cos² x = A + B cos 2x).
3. angulo-mitad · «El signo de la mitad» · Ángulo mitad (trig-plano: θ hasta dos vueltas y su mitad; θ = 300° da sen(θ/2) = +1/2).
4. angulo-triple · «El triple y su cubo» · Ángulo triple (ejes: el punto (sen θ, sen 3θ) cae en y = 3s − 4s³; sen 3θ = 1/2 tiene tres candidatos, guiño a al-Kashi).

### Colores
θ (o x) naranja, 2θ rojo, θ/2 turquesa, 3θ verde en toda la unidad; una curva lleva el color del ángulo que manda en ella.

### Piezas
Usadas: trig-plano, ejes. Nuevas: ninguna.

### Códigos de error nuevos (hipótesis)
DOBLE-SEN, DOBLE-SIN-2, DOBLE-CUADRANTE, DOBLE-SIGNO, DOBLE-CRUCE, DEG-SIGNO, DEG-MITAD, DEG-DOBLE, MITAD-SIGNO, MITAD-SIGNO-THETA, MITAD-RAIZ, MITAD-DOBLE, TRIPLE-SEN, TRIPLE-CUBO, TRIPLE-SIGNO, TRIPLE-CRUCE. (DEG-UNO quedó declarado en el encabezado pero no se usa.)

### Pedidos al molde
- `nucleo/ecuacion.js`: una `raiz` que contiene una `frac` se dibuja con la barra del radical encima del numerador (parece tachado). Se evitó escribiendo (1 − cos θ)/2 en línea dentro de la raíz. Caso: idea 3, regla y solución.

### Verificación
- teoria.test.js en verde. Comprobación independiente (chk2.js, 60 semillas por idea): doble con atan2 y Math.sin/cos/tan de 2θ; degradación con acos; mitad buscando el único θ del intervalo que tiene ese coseno y evaluando sen/cos(θ/2); triple con asin/acos: 0 discrepancias.
- No verificado: celular real, lector de pantalla.

### Capturas (lo visto y corregido)
- Idea 2, juego: los rótulos «sen x» y «cos² x» se encimaban → movidos a 300° y 225°.
- Idea 2, Mira: «máx 1», «cos 2x» y «sen² x» chocaban arriba → sin rótulo en el punto, sen² x rotulado en 45°.
- Idea 2, predicción revelada: la discontinua ½ + ½ cos 2x tapa a cos² x (coinciden) → rótulo «½ + ½ cos 2x = cos² x» abajo.
- Idea 3: raíz con fracción dentro se veía tachada → fracción en línea dentro de la raíz.
- Idea 3, Mira: «cos θ = 1/2» chocaba con «inicial» y el nombre del eje x → rótulo bajo el eje.
- Idea 4: «3 sen θ» chocaba con el nombre del eje «sen 3θ» → recta más corta; el rótulo de la horizontal pasa a «1/2» junto a su punta izquierda.
- «Ahora tú»: 1 − 7/24² ambiguo → (7/24)²; caso sen θ = 1 trivial → lista cerrada de fracciones; el cubo se escribe 4 · (v)³.
- Tema oscuro revisado (idea 4): legible.

## trigonometria.transformaciones-trigonometricas — completa (4 ideas)

Archivo: contenido/teoria/trigonometria/transformaciones-trigonometricas.js

### Ideas
1. flechas-rombo · «Dos flechas, un rombo» · Suma a producto (trig-plano: flechas unitarias A y B, rombo, diagonal R de largo 2 cos(semidiferencia) sobre la semisuma; predicción A = 20°, B = 280°: R apunta a 330°, al revés de la semisuma 150° — precisión 6 del expediente).
2. producto-suma · «Un producto, dos ondas» · Producto a suma (ejes: 2 cos mx · cos x con su envolvente ±2 cos x; 2 cos 3x cos x = cos 4x + cos 2x).
3. cadena-flechas · «Una cadena de flechas» · Sumatorias de senos y cosenos (trig-plano: n flechas que giran x más; arco de polígono regular inscrito, cuerda sen(nr/2)/sen(r/2) y ángulo medio; predicción: seis flechas de 60° cierran un hexágono y suman 0).
4. doblar-y-doblar · «Doblar y doblar» · Productorias trigonométricas (trig-plano: rayos x, 2x, 4x…; producto = sen 2ⁿx / (2ⁿ sen x); cos 20° cos 40° cos 80° = 1/8 porque sen 160° = sen 20°).

### Colores
A (α, x) naranja, B (β) turquesa, lo que resulta (R, semisuma, α + β, último ángulo) rojo, factor de la semidiferencia (α − β) verde.

### Piezas
Usadas: trig-plano, ejes. Nuevas: ninguna (las flechas se dibujan con `segmentos` con `punta` de trig-plano, que tiene la misma escala en x e y).

### Códigos de error nuevos (hipótesis)
FLECHA-SEMISUMA, FLECHA-ANULA, FLECHA-DIFERENCIA, SP-DISTRIB, SP-CRUCE, SP-SIGNO, PS-COPIA, PS-SIGNO, PS-CRUCE, PS-PRODUCTO, SUM-MULT, SUM-SIGNO, SUM-SIN-DIV, SUM-MITAD, PROD-SUMA, PROD-EXACTO, PROD-SIGNO, PROD-POTENCIA.

### Pedidos al molde
- Ninguno imprescindible. La pantalla antepone «Vale si» a la condición: una condición que empieza por «si…» queda «Vale si si…» (corregido aquí; vale como aviso para todos los cursos).

### Verificación
- teoria.test.js en verde. Comprobación independiente (chk3.js, 60 semillas): ideas 1 y 2 evalúan con Math.sin/cos el lado izquierdo y la opción correcta (y que ningún distractor valga lo mismo); idea 3 suma término a término; idea 4 multiplica los cosenos en radianes: 0 discrepancias.
- Centro de la circunferencia de la cadena en «Mira» (idea 3): circuncentro calculado; radio 1,462 = 1/(2 sen 20°).
- No verificado: celular real, lector de pantalla.

### Capturas (lo visto y corregido)
- Ahora tú idea 1: con 90° o 0° entre los ángulos (cos 90° = 0) dos alternativas valían lo mismo → se descartan esos pares.
- Idea 1, Mira: el rótulo «30°» del arco verde chocaba con la punta de A → quitado (lo dice la ecuación).
- Idea 2: con dos controles, uno quedaba fijo (n = 1, min = max) → un solo control m de 4 a 7, para no mostrar m = 3 (la predicción).
- Idea 2, regla: tres fórmulas en una ecuación se partían en cinco renglones → dos en la ecuación, la de dos senos en la condición.
- Idea 3: la ventana cambiaba de escala con cada caso → ventana fija que contiene todas las cadenas del juego.
- Idea 3, Mira: la circunferencia del polígono se salía de la ventana → ventana ampliada al radio.
- Condición «si cos(semidiferencia) < 0…» se leía «Vale si si…» → reescrita.
- Tema oscuro revisado (ideas 1 y 2): legible.

## trigonometria.funciones-trigonometricas — completa (5 ideas)

Archivo: contenido/teoria/trigonometria/funciones-trigonometricas.js

### Ideas
1. altura-desenrollada · «La altura, desenrollada» · Funciones seno y coseno (la curva registra la altura hasta x; Dom = ℝ, Ran = [−1, 1], T = 2π, cos x = sen(x + π/2), paridad; predicción sen(13π/6)).
2. amplitud-periodo · «Alto y ancho de la onda» · Amplitud, periodo y frecuencia (y = A sen(Bx) con A y B; predicción B = 1/2 → T = 4π).
3. tangente-ramas · «Ramas entre asíntotas» · Funciones tangente y cotangente (asíntotas, Ran = ℝ, T = π; predicción: ¿tan x = 1000?).
4. secante-copas · «Copas fuera de la franja» · Funciones secante y cosecante (franja −1 < y < 1 vacía; predicción: ¿sec x = 1/2?).
5. periodo-general · «El periodo depende de la función» · Periodo de funciones generalizadas (sen Bx, tan Bx, |sen Bx|; predicción sen 2x + sen 3x → 2π; regla con A sen(Bx + C) + D y tan; C y D no cambian T; suma sin múltiplo común no es periódica).

### Colores
x naranja; la función (y) y la amplitud A rojo; B turquesa; T verde; curvas de referencia en tinta, discontinuas.

### Piezas
Nueva: nucleo/kit/piezas/trig-onda.js + trig-onda.test.js (7 pruebas).
Afirmación: «el periodo es un largo sobre el eje x, medido con las marcas de π; la misma forma se repite cada T».
Qué trae: eje x en radianes con marcas de π (π/2, π, 3π/2…, raleadas si hay menos de 40 px entre marcas), eje y numérico, curvas con null que se recortan al borde del plano (para tangente y secante), asíntotas verticales discontinuas, rectas y = k, llave de periodo (cota con rótulo), franjas vertical u horizontal (`eje: 'y'`), puntos. Revisada a 360 px en color y en grises (render.js): legible; en grises la llave verde y la curva roja se distinguen por trazo y rótulo.
Comprobé antes que no hubiera otra trig-*.js que sirviera (solo existía trig-plano).

### Códigos de error nuevos (hipótesis)
FUN-DOMINIO, FUN-LINEAL, FUN-SIGNO, FUN-CRUCE, PER-FIJO, PER-MULT, PER-AMPLITUD, PER-TAN, TAN-RANGO, TAN-VENTANA, TAN-ASINTOTA, SEC-CONFUNDE, SEC-INVERSO, SEC-ASINTOTA, SEC-RANGO-SENO, SEC-TODO, SEC-SIN-D, PER-MENOR, PER-SUMA.

### Pedidos al molde
- Un control numérico que muestre su valor en múltiplos de π (hoy el juego mueve x en grados y la lectura lo traduce: «x = 150° = 5π/6»).

### Verificación
- teoria.test.js + todas las piezas (node --test contenido/teoria/teoria.test.js nucleo/kit/piezas/*.test.js): 95 en verde. Ojo: `node --test nucleo/kit/piezas/` (la carpeta) falla con MODULE_NOT_FOUND en este Node; hay que pasar el glob *.test.js.
- Comprobación independiente (chk4.js, 60 semillas): valores exactos contra Math.sin/cos; periodos buscando numéricamente el menor T (rejilla π/60) con f(x + T) = f(x); rango de A sec x + D muestreado; dominio de tan/cot comprobando que solo la opción correcta anula el denominador: 0 discrepancias.
- No verificado: celular real, lector de pantalla.

### Capturas (lo visto y corregido)
- Marcas de π encimadas en ventanas de 4π («3π/2 2π 5π/2…») → raleo con umbral de 40 px en la pieza.
- La llave «T = 2π» caía sobre la recta y = −1 → plano baja a −1,9 y la llave va a −1,7.
- Idea 2: la llave chocaba con el valle de la onda con A = 3 → plano de ±4; «sen x» chocaba con «A = 2» en Mira → rótulo abajo.
- Idea 4: la franja sombreaba todo el plano (era vertical) → franja horizontal nueva en la pieza (`eje: 'y'`), de −1 a 1.
- Idea 3, revelación: el rótulo largo chocaba con el nombre del eje y → «tan x = 1000 ↑» (el x ≈ 1,5698 queda en el texto de «coincide»).
- «Ahora tú»: «3sen(5x/2)» sin espacio → «3 sen(5x/2)».
- Tema oscuro revisado (ideas 1, 3 y 4): legible.

## trigonometria.funciones-trigonometricas-inversas — reporte

Archivo: contenido/teoria/trigonometria/funciones-trigonometricas-inversas.js · estado: completa · 5 ideas · teoria.test.js en verde para este archivo.

### Ideas
| id | título | temas | pieza |
|---|---|---|---|
| rama-arcoseno | Una inversa elige una rama | Arco seno, arco coseno y arco tangente; Dominio, rango y gráfica | trig-plano |
| tres-ramas | Cada inversa, su rama | Arco seno, arco coseno y arco tangente; Dominio, rango y gráfica | trig-plano |
| componer | Componer sin cancelar a ciegas | Propiedades | trig-plano |
| grafica-reflejo | La gráfica se refleja | Dominio, rango y gráfica; Arco seno, arco coseno y arco tangente | trig-plano (curvas en radianes, una sola escala) |
| otras-tres | arccot, arcsec y arccsc | Arco cotangente, arco secante y arco cosecante | trig-plano |

Convención de ramas declarada (la misma de plantillas/funciones-trig-inversas/motor.js): arcsen [−90°, 90°], arccos [0°, 180°], arctan (−90°, 90°), arccot (0°, 180°), arcsec k = arccos(1/k) en [0°, 180°] sin 90°, arccsc k = arcsen(1/k) en [−90°, 90°] sin 0°. Al alumno se le dice en la regla de la idea 5 («algunos libros usan otra rama de arccot: revisa la del examen»).

### Piezas
Usada: trig-plano (rama = arco verde grueso con huecos en los extremos abiertos; tan con la recta x = 1 y el punto (1; k); cot con y = 1 y (k; 1)). Nuevas: ninguna.

### Códigos de error
IN1, IN2, IN3, IN4, IN5, IN6, IN7, IN14, IN15, IN16, IN19, IN20, IN26, IN29 (hipótesis, plantillas/funciones-trig-inversas/motor.js). Nuevo (hipótesis): INV-RANGO (cree que arcsen acepta |k| > 1 y da ±90°).

### Pedidos al molde
- Ninguno imprescindible. Un control de opciones con valores numéricos (k ∈ {−2, −1, 1, 1,5, 2, 4}) funciona, pero el recorrido automático solo prueba las primeras opciones.

### No verificado
- Celular real; lector de pantalla. La notación de intervalos usa «[a, b]» y «(a, b)» como la unidad de ecuaciones; el resto del proyecto (motor de inversas) usa «⟨a; b⟩»: decidir una sola para el curso.

### Lo que vi en las capturas y corregí
- La gráfica de reflejo: «y = x» caía en el origen y luego sobre la curva del seno → rótulo arriba a la derecha; «rango» cruzaba el eje x → rótulo arriba; «sen» y «arcsen» van en los extremos de abajo.
- El juego de la gráfica empezaba en k = 0,75 y con 4 toques solo daba 2 casos → inicio en 0,25.
- arccos(0): «x = 0» chocaba con «90°» y el eje y → los nombres de x = c van abajo si c ≤ 0,15.
- arccot(−1): el rótulo «(−1; 1)» se encimaba con «135°» → con tan y cot el ángulo se rotula en su arco; además «(−1, 1)» pasó a «(−1; 1)» como en «Mira».
- «[-2, 0]» con guion ASCII → signo menos tipográfico. «arcsen(sen x = −150°)» → «arcsen(sen x) si x = −150°».
- Seis semillas de arccot con k > 0 daban una sola opción → se agregaron los distractores IN1 (θ + 180°) e IN29 (−θ).
- Revisado en tema oscuro: sin choques nuevos.

## trigonometria.ecuaciones-trigonometricas — reporte

Archivo: contenido/teoria/trigonometria/ecuaciones-trigonometricas.js · estado: completa · 5 ideas · teoria.test.js en verde para este archivo.

### Ideas
| id | título | temas | pieza |
|---|---|---|---|
| cortes-recta | Cuántas veces corta la recta | Ecuaciones elementales | trig-plano |
| solucion-general | La calculadora da un valor | Solución general y particular; Ecuaciones elementales | trig-plano |
| extremos | Los extremos del intervalo cuentan | Solución general y particular | ejes (compacto) |
| factorizar | Factorizar, no dividir | Ecuaciones no elementales | trig-plano |
| sistemas | Un sistema pide ambas | Sistemas de ecuaciones trigonométricas | trig-plano |

Sigue el microguion «Trigonometría 15»: |k| < 1 dos, k = ±1 una, |k| > 1 ninguna; la calculadora da α (valor principal); familias α + 360°n y 180° − α + 360°n; extremos del intervalo (360° fuera de [0°, 360°)).

### Piezas
Usadas: trig-plano, ejes (compacto, gráfica de sen θ de 0° a 720° con la franja del intervalo). Nuevas: ninguna.

### Códigos de error
De docs/investigacion/trigonometria-ideas-erroneas.md: TR21, TR22, TR12 (parcial).
Nuevos (hipótesis): ECU-SIEMPRE-DOS, ECU-RANGO, ECU-INFINITAS, ECU-CUADRANTE, ECU-PATRON, ECU-EXTREMO, ECU-UNA-VUELTA, ECU-FACTOR, ECU-SIS-UNION, ECU-SIS-PRIMERA, ECU-SIS-VACIO.

### Pedidos al molde
- Respuesta que es un conjunto (microguion: «la evaluación compara conjuntos normalizados»). Hoy se evalúa con opciones de listas completas; un selector de ángulos en la circunferencia sería lo fiel.
- trig-plano: elegir el lado del rótulo de una recta (hoy y = k va siempre a la derecha y x = k siempre arriba; para x = k uso `rotulos` aparte, arriba si c ≥ 0 y abajo si c < 0).

### No verificado
- Celular real; lector de pantalla.
- Sistemas con dos ángulos (x + y = S, …), frecuentes en examen, no entran en esta unidad: solo sistemas en un ángulo (intersección de conjuntos).

### Lo que vi en las capturas y corregí
- La recta y = 0,9 rotulada chocaba con el rótulo del corte de 64,2°: ventana x de −1,7 a 1,7 y sin rótulo de la recta en el juego (la lectura dice k).
- El rótulo «α» en la punta del rayo discontinuo chocaba con el rótulo del corte: quitado; en «Mira» el punto dice «α = −30°».
- «x = −1/2» arriba chocaba con el nombre del eje y: rótulo propio abajo (c < 0) o arriba (c ≥ 0).
- «210°330°» se juntaban en la gráfica de «Ahora tú» (extremos): los puntos de la solución van sin rótulo; la ecuación los lista.
- «se pierden si divides» cruzaba el eje y tapaba 0°: ahora 0° y 180° pasan a puntos huecos rojos con «✕».
- «0 soluciónes»: plural corregido. «− −1» en la factorización: signo corregido. «S = {}» → «S = ∅».
- Revisado también en tema oscuro: sin choques nuevos.

## trigonometria.triangulos-oblicuangulos — completa, 5 ideas

Archivo: contenido/teoria/trigonometria/triangulos-oblicuangulos.js. teoria.test.js en verde (60 semillas).

### Ideas
1. ley-de-senos · «Cada lado con su seno» · Ley de senos · trig-plano (triángulo inscrito; predicción: la razón común es el diámetro 2R; Mira traza el diámetro desde B y el triángulo rectángulo A′BC).
2. caso-ambiguo · «Dos triángulos, mismos datos» · Ley de senos · trig-plano (compás de radio a que cuelga de C; predicción: A = 30°, a = 5, b = 8 da dos triángulos aunque la calculadora dé un solo B).
3. ley-de-cosenos · «Pitágoras con corrección» · Ley de cosenos · triangulo (juego A de 30° a 130° con b = 4, c = 6; predicción con 120°, Mira con la altura que cae fuera).
4. proyecciones-tangentes · «La base, suma de dos sombras» · Leyes de proyecciones y de tangentes · triangulo (cotas b cos A y a cos B; predicción con B = 110°, sombra negativa; Mira termina con la de tangentes desde senos + suma a producto).
5. rumbos · «Rumbo: desde norte o sur» · Ángulos horizontales y rumbos · trig-plano (rosa de los vientos; predicción: ángulo interior en el giro N 40° E → S 70° E = 110°; Ahora tú con ángulo o distancia por cosenos).

### Piezas
Usadas: trig-plano, triangulo. Nuevas: ninguna.

### Colores
Par lado–ángulo opuesto: A/a naranja, B/b turquesa, C/c verde; R (2R) y rumbos θ en rojo (no salen juntos). Altura y líneas N–S sin color.

### Códigos de error
Existentes: TR10, TR23, TR24, TR25. Nuevos (hipótesis): LS-RADIO, LS-LADO-MAYOR, LS-NUMERO, LS-INVERSA, LS-OPUESTO, LS-NINGUNO, LS-SEGUNDO-SIEMPRE, LS-TOCA, LC-SUMA, LC-SUPLE, LC-SENO, LP-SIGNO, LP-AGUDO, LT-SIN-TAN, LT-TAN, LT-INVERSA, RUMBO-RESTA, RUMBO-EXTERIOR, RUMBO-SUMA.

### Pedidos al molde
- trig-plano no recorta (kit.css pone overflow visible): el compás del caso ambiguo se dibuja como arco recortado a mano en el archivo (arcoCompas). Un `recorte: true` en la pieza lo evitaría.
- trig-plano: el rótulo de un segmento que sale del origen cae de cualquier lado (el producto punto con el centro es 0). En rumbos se rotulan los tramos con `rotulos` calculados; un `lado` explícito en segmentos ayudaría.

### No verificado
- Celular real, lector de pantalla. Códigos nuevos sin datos de alumnos.

### Capturas: hallazgos y correcciones
- Caso ambiguo: la circunferencia completa del compás salía de la figura y la achicaba → arco recortado, ventana ajustada a la altura.
- Caso ambiguo: «b = 8» chocaba con la recta → rótulo desplazado por la normal.
- Senos: A′ quedaba encima de A (A = 50°, B = 60°) → revelación y Mira con A = 40°, B = 75°, R = 2.
- Cosenos: con A = 150° el rótulo 150° chocaba con «a» → juego hasta 130°; en Mira «b = 5» chocaba con «a = √129» → b sin valor (va en el paso 1).
- Proyecciones: con A, B hasta 80° el triángulo quedaba alto y las cotas encimadas → A, B de 30° a 60°, cotas sin número (los números van en lectura y pasos), a 32 y 56 px; caso obtuso 35°/110° en vez de 25°/120°.
- Rumbos: rótulos de tramos y de C encimados → rótulos de tramos al lado contrario del tercer vértice; arcos de rumbo chicos y el interior más grande.
- Restos menores aceptados: «C = 110°» cruza la línea N–S punteada en C; con A = B = 60° el rótulo «c = 6» queda cerca de las cotas.
- Tema oscuro revisado: sin problemas de contraste visibles.

## trigonometria.areas-y-lineas-notables — completa, 5 ideas

Archivo: contenido/teoria/trigonometria/areas-y-lineas-notables.js. teoria.test.js en verde (60 semillas).

### Ideas
1. area-dos-lados · «El área sigue al seno» · Área de un triángulo con dos lados y el ángulo (juego A de 25° a 165° de 20 en 20: ningún par suplementario a la vista; predicción 30° contra 150°: misma área).
2. heron-semiangulos · «Herón: solo con los lados» · Fórmula de Herón y semiángulos (juego con lados 5–9, siempre cierran; predicción 3, 4, 8: no hay triángulo; Mira deriva Herón desde ½bc sen A con sen y cos de A/2 en el 13-14-15).
3. area-y-radios · «Tres radios, una misma área» · Área con inradio, circunradio y exradio (juego: tres triángulos × r, R, rₐ; predicción R del 6-8-10 = 5; Mira: S = p r con los tres triángulos desde el incentro y S = abc/4R).
4. cevianas · «El largo de una ceviana» · Longitud de cevianas, bisectrices y medianas (juego D de 1 en 1 sobre a = 8: no alcanza el pie de la bisectriz 3,33; predicción: la bisectriz parte en c : b; Mira: Stewart, mediana, bisectriz t² = bc − mn).
5. area-cuadrilatero · «Un cuadrilátero, dos diagonales» · Área de un cuadrilátero (juego θ; predicción: mover el cruce no cambia el área; Ahora tú alterna diagonales y partición en dos triángulos LAL).

### Piezas
Usada: trig-plano. Nuevas: ninguna.

### Colores
Ángulo (A, θ) naranja; largos dados (a, b, c, d₁, d₂) turquesa; largos calculados (h, p, r, R, rₐ, t, m, n) verde; área S rojo.

### Códigos de error
Existentes: TR10, TR25. Nuevos (hipótesis): AREA-ANGULO, AREA-OBTUSO, AREA-SIN-MEDIO, AREA-COS, AREA-UNA-RAMA, HERON-IMPOSIBLE, HERON-PERIMETRO, HERON-SIN-RAIZ, SEMI-CRUZA, SEMI-ENTERO, RADIO-CONFUNDE, RADIO-PERIMETRO, RADIO-ALTURA, EXRADIO-LADO, BIS-MEDIANA, BIS-ANGULOS, BIS-CRUZA, STEW-LADOS, MED-SIN-CUARTO, CUAD-CRUCE, CUAD-FALTAN, CUAD-ROMBO.

### Pedidos al molde
- trig-plano sin relleno de polígonos: el área se muestra con altura y número, no sombreada. Un `poligonos: [{ puntos, color }]` con relleno tenue ayudaría a «ver» S (áreas de triángulo, cuatro triángulos del cuadrilátero, tres triángulos del incentro).
- El exradio queda solo en el juego (opción rₐ), la regla y Ahora tú: en Mira no cabe junto al triángulo sin achicarlo mucho.

### No verificado
- Celular real; lector de pantalla. Códigos nuevos sin datos.
- Brahmagupta (cuadrilátero inscrito) solo aparece en la historia y en la condición de la regla; no se enseña su fórmula.

### Capturas: hallazgos y correcciones
- Idea 1: con A obtuso «h = 5,2» chocaba con «c = 6» → c adentro y h afuera cuando A > 90°, y c más separado.
- Idea 2: los dos rótulos «A/2» se encimaban cerca de A → arcos de radio 3; «S = 84» sobre la bisectriz → movido a la izquierda.
- Idea 5: «d₁ = 8» y «d₂ = 6» tachados por las diagonales y la figura chica → rótulos movidos (d₂ en la mitad de abajo), ventana más ajustada en juego y Mira, y una más grande solo para la predicción.
- Tema oscuro revisado: legible.
- Restos menores aceptados: con θ = 140° los rótulos de d₁ y d₂ quedan cerca; triángulos algo chicos por la escala única.

## trigonometria.conicas — completa, 5 ideas

Archivo: contenido/teoria/trigonometria/conicas.js. teoria.test.js en verde (60 semillas).

### Ideas
1. lugar-parabola · «Un lugar: PF = PD» · Lugar geométrico, Parábola (se mueve P en la cuadrícula y se comparan PF y PD; predicción: la ecuación del lugar, x² = 4y; Mira deriva x² = 4y y ubica el vértice; la regla pide las dos inclusiones).
2. elipse · «La cuerda del jardinero» · Elipse, Lugar geométrico (focos ±c con c de 0 a 3, lápiz P; la suma siempre da 10; predicción: b con c = 4 → 3; Mira: triángulo b, c, a en el punto más alto).
3. hiperbola · «La diferencia que no cambia» · Hipérbola (focos ±5, a de 1 a 4, P en la rama derecha; predicción: b con a = 3 → 4, c² = a² + b²; Mira: vértice, rectángulo 2a × 2b, asíntotas).
4. recta-tangente · «Tocar una sola vez» · Recta tangente a una cónica (y = x + k con k de 0,4 en 0,4, sin pasar por −1; predicción k = −1; Mira: sustituir, Δ = 0, raíz doble T(2; 1); condición: una recta paralela al eje corta una vez sin ser tangente).
5. rotacion-ecuacion-general · «Girar los ejes, no la curva» · Rotación de ejes, Ecuación general de segundo grado (5x² − 6xy + 5y² = 8 fija; se giran x′, y′ y se lee B′; predicción: x² + 2y² + 4 = 0 no tiene puntos aunque B² − 4AC < 0; Ahora tú: ángulo de giro o clasificar con casos vacío y punto).

### Piezas
Usada: trig-plano (curvas paramétricas a una sola escala). Nuevas: ninguna.

### Colores
PF y PF₁ turquesa; PD y PF₂ verde; parámetros p, a, b, c y el ángulo θ de los ejes naranja (no salen juntos); la curva (el lugar) rojo.

### Códigos de error (todos nuevos, hipótesis; el informe de trigonometría deja fuera las cónicas)
LUGAR-CIRCULO, PAR-SIN-4P, PAR-2P, PAR-EJE, ELI-RESTA, ELI-HIP, ELI-C, ELI-EJE, HIP-ELIPSE, TAN-ORIGEN, TAN-SIGNO, TAN-NUNCA, TAN-UN-CORTE, TAN-P, CON-DISCRIMINANTE, CON-PUNTO, ROT-DOBLE, ROT-TAN.

### Pedidos al molde
- trig-plano: el rótulo de `rectas` horizontales cae sobre los números del eje x cuando la recta está cerca (directriz y = −1); se rotuló aparte con `rotulos`. Un `lado` o `en` para el rótulo de una recta ayudaría.
- Un control 2D (tocar un punto de la cuadrícula) haría más natural la idea del lugar geométrico; hoy son dos controles x e y.

### No verificado
- Celular real; lector de pantalla. Códigos sin datos.
- La sección cónica (cortar el cono) solo está en la historia: no hay pieza 3D.

### Capturas: hallazgos y correcciones
- Idea 1: «directriz y = −1» encima de los números del eje x → rótulo propio debajo de la recta, ventana más baja.
- Ideas 2 y 3: números del eje encimados con «c = 4», F₁, «a = 3» → sin números en la revelación y en Mira (los valores van en rótulos); el juego conserva la cuadrícula.
- Idea 3: con a = 1 y P en u = 1,5 la rama salía de la ventana (la pieza no recorta) → u acotado por alto y ancho.
- Idea 4: Ahora tú escribía «y = −1x» y «x² − −2x» → coeficientes con signo bien formateados.
- Idea 5: textos de la predicción sobre los números de los ejes → plano sin números y rótulos corridos.
- Tema oscuro revisado: legible.

## trigonometria.coordenadas-polares-y-complejos — reporte

Archivo: contenido/teoria/trigonometria/coordenadas-polares-y-complejos.js · estado: completa · 5 ideas · teoria.test.js en verde para este archivo.

### Ideas
| id | título | temas | pieza |
|---|---|---|---|
| polar-punto | Un punto, muchos nombres | Coordenadas polares | trig-plano |
| argumento | El cuadrante decide el argumento | Forma trigonométrica de un complejo | trig-plano (plano Re–Im) |
| multiplicar | Multiplicar es girar y estirar | Forma trigonométrica de un complejo | trig-plano |
| de-moivre | De Moivre: potencias que giran | Teorema de De Moivre | trig-plano (escalera z, z², …, zⁿ) |
| exponencial | La forma exponencial | Forma exponencial | trig-plano |

Ejemplos de la matriz: (−2; 30°) = (−√3; −1) (predicción de la idea 1), (1 + i)⁸ = 16 (predicción de De Moivre, versión de (1 + i)² = 2i), e^{iπ} = −1. Radio polar firmado frente a módulo |z| ≥ 0 en las reglas 1 y 2.

### Piezas
Usada: trig-plano (con `nombres: ['Re', 'Im']` para el plano complejo). Nuevas: ninguna.

### Códigos de error
De plantillas/coordenadas-polares/motor.js: CP3 (parcial), CP4, CP5, CP14. De plantillas/numeros-complejos/motor.js: CX11, CX17, CX18 (parciales), CX19, CX20, CX21, CX22, CX23, CX24, CX30, CX31. TR11 (parcial), AL9.
Nuevos (hipótesis): POL-CUADRANTE, POL-ARG-FIJO, POL-REPARTE, POL-EXP-REAL, POL-SIN-I.

### Pedidos al molde
- Raíces n-ésimas (polígono regular de raíces, «devolver una sola raíz» como error objetivo de la matriz) no entraron: harían falta 6 ideas o una respuesta con varias marcas. Si se quiere, una sexta idea cabe en el tope.

### No verificado
- Celular real; lector de pantalla. Notación «cis θ» declarada en la regla de la idea 2; confirmar que es la del examen (algunas academias escriben solo r(cos θ + i sen θ)).

### Lo que vi en las capturas y corregí
- (−2; 30°) se revelaba como «(−1,73; −1)» y las opciones decían «−√3» → rótulo exacto «(−√3; −1)».
- Argumento de −2 − 2i: «|z| = 2√2» se encimaba con «45°» y con los números del eje → rótulo del módulo hacia adentro si a < 0 y sin números del eje en «Mira», la revelación y la solución.
- Producto z·w a escala ±6,4: los arcos medían 20 px y «+120°» tapaba el origen → arcos de radio 1,3 con espiral para la vuelta de más; en el juego, arcos sin rótulo (la lectura da los números).
- (1 + i)⁸ con ventana ±17 dejaba la escalera chica y «(1 + i)⁸ = 16» sobre «Re» → ventana ajustada a la escalera (x −6..19, y −10..5) y rótulo a la izquierda.
- «e^{iθ}» se veía con llaves en la consigna y en un paso de «Mira» → partes de ecuación con superíndice; «e^π» en un siFuera → «e elevado a π».
- «1/2i» ambiguo → «1/2 i». Distractor «θ + n» de De Moivre quitado (no corresponde a un error real). Lectura de De Moivre recortada a 12 palabras.
- Revisado en tema oscuro: sin choques nuevos.
