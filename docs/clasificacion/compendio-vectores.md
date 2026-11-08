# Compendio de vectores: qué tipos de problema trae y qué le falta a la escena

8 de noviembre de 2026 · Clasificación de un compendio de academia, comparada con `plantillas/vectores/`

> **El libro sirve solo como mapa** (regla 5 de `CLAUDE.md`): dice qué tipos de problema salen, cuántos y dónde están las trampas. No se copia nada al producto: ni enunciados, ni números, ni figuras, ni textos. Todo lo de abajo describe **tipos** en abstracto y con palabras nuestras. Los PDF (`fuentes/libros/cuzcano-analisis-vectorial-1-64.pdf` y `…-61-128.pdf`) **no se versionan**: `.gitignore` excluye `fuentes/**/*.pdf`.

**Fuente:** Tarazona, *Análisis vectorial. Teoría y práctica*, Editorial Cuzcano, 2005 (segundo tiraje), tomo 2 de una colección de física de 24 tomos.

**Qué se vio.** El libro completo llega en dos escaneos que se superponen en cuatro páginas (61 a 64 del PDF original); se contaron una sola vez. Cada problema tiene su número, así que no hay riesgo de duplicar.

La presentación dice que el libro trae 150 problemas resueltos y 50 propuestos, «tipo examen UNI», tomados como referencia de exámenes y seminarios del CEPRE-UNI y de exámenes de admisión, y que insiste en los vectores unitarios por el plan de estudios de la UNI. La teoría cubre vector, propiedades, descomposición, paralelos, resultante de dos vectores, unitarios, forma cartesiana y producto escalar y vectorial. Después vienen la miscelánea, los propuestos y una tabla de claves.

- **200 problemas:** 150 resueltos y 50 propuestos (estos, solo con su clave). Hay además seis ejemplos de teoría sin número.
- **13 resueltos se repiten** con otro método (figura contra componentes, o paralelogramo contra fórmula, o producto escalar contra geometría). Quedan 137 resueltos distintos.
- **Origen.** 67 de los 150 resueltos (45 %) llevan la marca «Sem. CEPRE-UNI»; cuatro dicen el ciclo, de fines de los 90 y comienzos de los 2000. Dos propuestos dicen «Examen UNI», uno con año. Los demás no dicen de dónde vienen.
- **Notables.** Unos 46 de los 150 resueltos (31 %) dependen de un triángulo notable: el de 37°/53° (3-4-5), el de 30°/60° (con 120° como suplemento) y el de 45°. Aparecen también los notables «extendidos» de academia: los de 16°/74° (7-24-25), 8°/82°, «medio 53°» y «medio 37°». Cuando el ángulo de la figura no es notable, el libro **gira los ejes** hasta que lo sea (unos 6 problemas).

## Resumen en cinco líneas

1. **Lo más frecuente del libro es el vector unitario** (T12: 33 de 200), seguido de **expresar un vector en función de otros dentro de una figura con puntos medios, baricentro o arcos** (T4: 26) y de **incógnitas en componentes con una condición** (T10: 23). La escena solo tiene un unitario y nada de T4 ni de T10.
2. La familia **«mira la figura y cierra polígonos»** (figuras regulares, irregulares y sólidos: T1a, T1b, T1c y T2) suma **38 de 200**, y casi un tercio de ella está en **sólidos** (cubo, paralelepípedo, cuña, tetraedro), que la escena no dibuja.
3. La escena cubre lo **directo** de dos vectores (R a partir de a, b y θ, el rango, la componente con 37°), pero no lo **inverso** (T8: 18). El **producto escalar y el vectorial** (T13: 15) están en el motor y en ningún paso.
4. Hay trampas que se repiten y no tienen código: **contar mal cuántas veces queda un vector**, **0 escalar contra vector nulo** y **«faltan datos»**, **suma por diferencia en los puntos medios**, **pesos cruzados al dividir un segmento**, **tangente invertida**, **olvidar la segunda solución**, **escalar por vectorial** (cos por sen) y **sentido del producto vectorial**.
5. Casi todo se presta a generador, pero `nucleo/predicciones.js` hoy solo arma **alternativas numéricas positivas**. Los tipos cuya respuesta es una expresión vectorial (pA + qB), un vector (a; b; c) o un par (m; n) piden extender el núcleo con alternativas de texto.

---

## 1. Los tipos

Los códigos T1 a T13 son nuestros. «Res.» cuenta los resueltos, «Prop.» los propuestos y «CEPRE» los resueltos con la marca «Sem. CEPRE-UNI».

| Tipo | Qué se pide (en abstracto) | Res. 1–80 | Res. 81–150 | Prop. | **Total** | CEPRE |
| --- | --- | --- | --- | --- | --- | --- |
| **T12** | **Vector unitario**: la constante o el parámetro que lo hace unitario (a veces con dos raíces y una condición de signo), el unitario de una suma o diferencia, el paralelo o antiparalelo, un vector de módulo dado paralelo a otro, el paralelo a una recta, en sólidos con coordenadas, a partir de una relación entre unitarios, y proposiciones sobre unitarios | 9 | 17 | 7 | **33** | 13 |
| **T4** | Vector incógnita en función de otros dos o tres dentro de una figura con **puntos medios, baricentro, un segmento dividido en m:n, o arcos de circunferencia** (triángulo, trapecio, paralelogramo, rectángulo, cuadrilátero, triángulos anidados, cuadrado con cuartos de circunferencia, cubo) | 13 | 7 | 6 | **26** | 5 |
| **T10** | **Incógnitas en componentes con una condición**: la resultante tiene módulo dado y está sobre un eje, es nula o tiene la dirección de un vector; dos vectores paralelos con parámetros (aparecen ecuaciones de segundo grado); sistemas con A + B, A − B y otras combinaciones; módulos a partir de las componentes de la resultante; la fuerza mínima para una dirección dada | 5 | 9 | 9 | **23** | 9 |
| **T8** | **Dos vectores con la ley de cosenos**, sobre todo **al revés**: el ángulo a partir de una relación entre la suma y la diferencia, los módulos a partir del máximo y el mínimo, el módulo y la dirección de la diferencia, el rango del ángulo, tres vectores que se anulan (o unitarios con coeficientes) y deducir la ley de senos | 8 | 2 | 8 | **18** | 0 |
| **T2** | **Sólidos**: tetraedro, paralelepípedo, pirámide, cubo y cuña; la resultante de vectores sobre aristas y diagonales, ya sea cerrando polígonos o con coordenadas (i, j, k), o qué igualdad es la correcta | 5 | 8 | 3 | **16** | 6 |
| **T13** | **Producto escalar y vectorial**: el ángulo entre combinaciones (también en 3D), el módulo del vectorial a partir del escalar, la dirección con la mano derecha, la condición de perpendicularidad, el cociente de proyecciones, el área de un triángulo, la normal a un plano, el unitario que minimiza un escalar, vectores que cumplen un escalar dado (infinitos) y deducir la ley de senos | 0 | 11 | 4 | **15** | 4 |
| **T5** | **Combinación lineal o descomposición en direcciones dadas**: los escalares de mA + nB + pC = 0 o de C = mA + nB, en una cuadrícula (enteros mínimos), en ejes oblicuos, o por componentes; también el vector con componentes dadas a lo largo de dos direcciones no perpendiculares | 6 | 5 | 2 | **13** | 6 |
| **T7** | **Descomposición con notables**: llevar vectores de módulo y ángulo dados a i y j y sumarlos. Incluye desplazamientos con puntos cardinales (noreste y similares), fuerzas sobre un cuerpo y el recorrido mínimo por calles. Cuando no hay notable, se giran los ejes | 5 | 3 | 2 | **10** | 3 |
| **T1a** | **Figura regular o simétrica**: vectores sobre un polígono regular, un rombo, un triángulo equilátero con su baricentro o una circunferencia con vectores a 120° o con un ángulo literal; la resultante es múltiplo de un vector conocido | 5 | 1 | 3 | **9** | 5 |
| **T1b** | **Polígonos cerrados en figura plana irregular**: muchos vectores se reducen a k veces uno o a una suma corta, y luego se calcula el módulo | 7 | 1 | 1 | **9** | 6 |
| **T3** | **Cuadrícula o coordenadas**: resultante de varios vectores dibujados en una malla o en el plano cartesiano, y el ángulo con un lado o con un eje | 6 | 0 | 3 | **9** | 3 |
| **T6** | **Proyección y cambio de ejes**: la componente de un vector en la dirección de otro y en la perpendicular; las componentes en ejes girados; la distancia de un punto a una recta con vectores; la proyección sobre un eje de vectores paralelos | 2 | 4 | 0 | **6** | 2 |
| **T9** | **Operaciones con componentes**: módulo de una combinación, o el vector (la tercera fuerza) que falta para que la combinación sea nula o tenga una resultante dada | 4 | 1 | 0 | **5** | 3 |
| **T1c** | **Qué relación es correcta o incorrecta**, o qué vector cierra el polígono | 2 | 0 | 2 | **4** | 0 |
| **T11** | **Ángulo a partir de componentes**: dos vectores dados por componentes (uno con parámetro) o hallados de A + B y A − B, y el ángulo de una combinación con el eje x | 3 | 1 | 0 | **4** | 2 |
| | **Total** | **80** | **70** | **50** | **200** | **67** |

### Método que enseña el libro, tipo por tipo

- **T1a, T1b, T1c y T2: polígono cerrado.** Se trasladan vectores sin cambiarlos hasta formar polígonos que suman cero, o se parte un vector en dos que siguen la figura. Así la resultante de muchos queda como «k veces un vector conocido». Recién al final se calcula un módulo, con la propiedad de la figura o con Pitágoras. En los sólidos se agrupan las aristas paralelas, y la mitad de los problemas se resuelve también **poniendo coordenadas a los vértices** y restando final menos inicio. El libro resuelve varios de las dos maneras.
- **T4: geometría primero.** Usa el teorema de los puntos medios, el baricentro (2:1), la división de un segmento en m:n y, en la segunda parte, los arcos de circunferencia que dan triángulos de 30°/60° y radios con √2. Se agregan vectores auxiliares proporcionales a los trozos, se escriben dos ecuaciones en triángulos sombreados y, al combinarlas, los auxiliares se cancelan. Deja una **fórmula general**: el vector a un punto que divide un segmento es el promedio de los extremos con pesos **cruzados**. Cuando hay un vector paralelo de largo conocido, usa el unitario: x = (x/y)·y.
- **T3 y T5: contar cuadritos.** Cada vector se lee como (avance horizontal, avance vertical), y en los ejes oblicuos se usa la misma cuadrícula, inclinada. En la combinación lineal se buscan los múltiplos que cierran el polígono (los enteros mínimos y sus múltiplos), o se plantea el sistema 2 × 2 por componentes. Para descomponer en dos direcciones dadas, se trazan paralelas desde la punta.
- **T7, T9 y T10: componentes.** Cada vector se pasa a i y j con el notable, se suma por componentes y se iguala componente a componente. Si los ángulos no son notables, **se giran los ejes** un ángulo que los vuelva notables (el módulo de la resultante no cambia). Con puntos cardinales, se hace coincidir el norte con +y y el este con +x. En T10 aparecen ecuaciones de segundo grado; se descarta la raíz que no cumple la condición o se aceptan las dos.
- **T8: el rombo o la fórmula.** Con módulos iguales, la suma y la diferencia son las diagonales de un rombo y se cortan en ángulo recto. Si no, se usa la fórmula del paralelogramo, se eleva al cuadrado y se despeja cos θ. Con R máx y R mín se arma un sistema 2 × 2. Una combinación de unitarios que se anula forma un triángulo cerrado cuyos lados son los coeficientes, y se reconoce el notable.
- **T12: dividir entre el módulo.** «Paralelo a» significa el mismo unitario (o el opuesto, si es antiparalelo). El vector de módulo dado es ese módulo por el unitario. Para una recta se toman dos puntos. En 3D se ponen coordenadas a los vértices del sólido. El libro anota cuando hay dos respuestas.
- **T13: definición y componentes.** El escalar es AB cos θ = a₁b₁ + a₂b₂ + a₃b₃, y de ahí sale el ángulo. El módulo del vectorial es AB sen θ, que es el área del paralelogramo; la dirección sale de la mano derecha (i × j = k y su ciclo) o del determinante. La proyección es el escalar entre el módulo. Perpendiculares ⇔ escalar nulo. Para minimizar un escalar con un unitario, el libro usa el unitario como (cos θ, sen θ) y una identidad de seno de una resta.
- **T6: proyección o giro.** La componente en una dirección es el cateto junto al ángulo; con ejes girados se resta el ángulo de giro y se busca un notable. La distancia de un punto a una recta se saca con un triángulo semejante o con escalar nulo.

### Trampas que se deducen de las alternativas y de las resoluciones

| Trampa | Dónde aparece | Cómo se ve en las alternativas |
| --- | --- | --- |
| **Contar mal cuántas veces queda un vector** | T1a, T1b, T2 | La correcta es k·v y aparecen (k − 1)·v, (k + 1)·v, 2k·v y v solo. |
| **Sumar módulos como números** | T1b, T3, T8 | Una alternativa es la suma aritmética de los módulos. |
| **Cero escalar contra vector nulo**, y **«faltan datos»** | T1b, T2, T5, T12, T13 | Están «0» y «0⃗» a la vez. «Faltan datos» aparece en al menos cinco problemas, también en producto escalar, siempre como distractor. |
| **El vector nulo es paralelo a todo** | T10 | Una condición de paralelismo da una raíz que anula un vector. Esa raíz vale, y la clave es «B y D». |
| **Sentido y signo** | T1b, T4, T5, T7, T10, T12 | Están la correcta y su opuesta: v y −v, paralelo y antiparalelo, i − j y j − i, final menos inicio al revés. |
| **Formas equivalentes** | T4, T10 | Dos alternativas dicen lo mismo, y la clave es «C y D» o «B y D». |
| **Suma por diferencia en los puntos medios** | T4 | El segmento entre los puntos medios de las diagonales de un trapecio es la semidiferencia de las bases, y la semisuma sale como distractor. |
| **Baricentro invertido** | T4, T1a | 1/3 contra 2/3 de la mediana. |
| **Pesos cruzados** | T4 | Al dividir un segmento en m:n, el peso de cada extremo es el trozo opuesto. El distractor pone los pesos derechos. |
| **Mitad o cuarto** | T4, T1a | 1/2 contra 1/4, o el lado contra su mitad, cuando el teorema de los puntos medios se aplica dos veces. |
| **Seno y coseno cambiados** | T7, T12 | Con el 3-4-5, la componente x y la y se intercambian. |
| **Ángulo complementario, o el de referencia** | T7, T8, T11 | Aparecen juntos 37° y 53°. Cuando el vector cae en el segundo o el cuarto cuadrante, la clave es el ángulo medido desde +x y el distractor es el ángulo agudo de referencia. |
| **Tangente invertida** | T3, T7 | arctan(y/x) junto a arctan(x/y). |
| **Recorrido contra desplazamiento** | T7 | En el recorrido mínimo por calles, la correcta es la suma de componentes, y el módulo del desplazamiento sale como distractor. |
| **Tomar el máximo y el mínimo como módulos** | T8 | R máx y R mín se usan como A y B. |
| **Raíz que no corresponde** | T8, T10, T12 | Una ecuación de segundo grado da dos raíces y solo una cumple la condición (módulo positivo, parámetro negativo), o valen las dos. |
| **Una sola solución** | T10, T12 | Con solo el módulo y la dirección hay dos sentidos. El libro pone una de clave y reta a encontrar la otra. |
| **Unitario sin dividir, sin escalar o escalado** | T12 | Aparecen el vector director sin escalar y el unitario sin multiplicar por el módulo. El unitario de A + B se confunde con la suma de unitarios. Si A = 2B, se cree que el unitario de A es el doble del de B. |
| **Pendiente a dirección** | T12 | y = mx + b da la dirección (1; m), y los distractores cambian el orden o el signo. |
| **Componente contra módulo** | T6 | Se pide una componente y aparece el módulo. |
| **Proyecciones invertidas** | T13 | El cociente de la proyección de A sobre B y la de B sobre A es A/B. El distractor es B/A o el escalar mismo. |
| **Escalar por vectorial** | T13 | A·B y \|A × B\| salen cambiados (cos por sen). |
| **Sentido del producto vectorial** | T13 | La clave es −k y el distractor +k: mano derecha invertida, o A × B tomado como B × A. |
| **Área sin la mitad** | T13 | El área del triángulo es \|A × B\|/2, y el distractor es el área del paralelogramo. |
| **Ver un sólido como plano** | T2 | Vectores que en el dibujo se cruzan, pero en el espacio son paralelos o se anulan. |
| **Fuerza mínima** | T10 | La fuerza mínima para que la resultante tenga una dirección dada es perpendicular a esa dirección. El distractor es tomarla paralela o igual a otra. |

### Convenciones de academia

- **Notables.** Los de 37°/53° y 30°/60° aparecen con frecuencia parecida; el de 45° es menos frecuente. Aparecen además los «extendidos» de 16°/74°, 8°/82°, «medio 53°» y «medio 37°». Se dibujan como una nube de «recordar». Con el 3-4-5 el valor es aproximado, y el motor ya lo trata así (`trig`, con `{ exacto: true }` para lo real). Los notables extendidos no están en el motor.
- **Girar los ejes** para que un ángulo no notable se vuelva notable, y la diferencia de dos ángulos como notable (por ejemplo, dos vectores en direcciones no notables cuya diferencia sí lo es).
- **Puntos cardinales** con norte = +y y este = +x («al norte del este», noreste = 45°).
- Unidades genéricas («u»), metros o newtons, y cuadrícula de lado 1. Cinco alternativas (A a E), con «Clave: X».
- **Notación.** Flecha encima para el vector y sin flecha para el módulo. Los unitarios son i, j y k, y µ con subíndice para el unitario de un vector o de un eje oblicuo. Los pares van con coma o con punto y coma.
- **Resolver dos veces** el mismo problema (13 casos), y las proposiciones I, II, III con «solo I y II».
- **La respuesta como expresión vectorial** (pA + qB) o como vector con componentes es muy frecuente: hay unos 50 problemas así. Es el formato que nuestro núcleo todavía no arma.
- **Decimales de calculadora** en unos pocos problemas, con ángulos no notables y respuestas con decimales. Son excepción y no conviene imitarlos.

---

## 2. Comparación con la escena `plantillas/vectores/` (0.1.0)

La escena tiene dos modos:

- **Paso a paso:** dos flechas arrastrables, R con catetos perpendiculares, el paralelogramo con la fórmula en vivo, R con un ángulo dado, el rango de R, la componente con 37° y dos pasos de análisis dimensional.
- **«¿Qué pasa si…?»:** dos iguales con 120°, R al abrir θ, el unitario, el hexágono desde un vértice y lo que va dentro del seno.

El motor trae `resultante`, `rango`, `barrido`, `componentes`, `unitario`, `escalar`, `anguloEntre`, `vectorial` (3D), `hexagono` y las funciones de dimensiones.

| Tipo | Total | Cobertura | Qué tiene la escena / qué falta |
| --- | --- | --- | --- |
| T12 unitario | 33 | **A medias** | El unitario de un vector 2D dado. Falta el de módulo dado paralelo a otro, el antiparalelo, el de una suma, la constante que lo hace unitario, la recta, el 3D y las proposiciones. |
| T4 vector en función de otros | 26 | **No** | Nada |
| T10 incógnitas con condición | 23 | **No** | Nada |
| T8 dos vectores, ley de cosenos | 18 | **A medias** | Lo directo: R con θ, el rango, iguales con 120° y abrir θ. Falta lo inverso: θ a partir de \|A + B\| = k\|A − B\|, los módulos a partir del máximo y el mínimo, la diferencia y su dirección, el rango del ángulo y tres vectores que se anulan. |
| T2 sólidos | 16 | **No** | El motor tiene 3D (`vectorial`), pero la escena no dibuja sólidos. |
| T13 producto escalar y vectorial | 15 | **No** (solo motor) | `escalar`, `anguloEntre` y `vectorial` existen sin ningún paso. |
| T5 combinación lineal | 13 | **No** | Nada |
| T7 descomposición con notables | 10 | **A medias** | La componente x con 37°. Falta sumar varios por componentes, los puntos cardinales, el giro de ejes y el recorrido por calles. |
| T1a figura regular | 9 | **A medias** | El hexágono desde un vértice. Falta el rombo, la circunferencia, el triángulo con baricentro y otros polígonos. |
| T1b polígonos cerrados en figura irregular | 9 | **No** | Solo el método del polígono con dos vectores. |
| T3 cuadrícula | 9 | **A medias** | Hay cuadrícula con flechas arrastrables, pero con dos vectores. |
| T6 proyección y cambio de ejes | 6 | **A medias** | La sombra sobre los ejes, no sobre otro vector ni en ejes girados. |
| T9 operaciones con componentes | 5 | **A medias** | El motor suma, pero ningún paso pide el módulo de una combinación kA + mB. |
| T1c qué relación es correcta | 4 | **No** | Nada |
| T11 ángulo desde componentes | 4 | **No** | `anguloEntre` existe, sin paso. |

**Lo que falta, ordenado por frecuencia en el libro.** No cubiertos:
1. T4 (26)
2. T10 (23)
3. T2 (16)
4. T13 (15)
5. T5 (13)
6. T1b + T1c (13)
7. T11 (4)

A medias:
1. T12 (33)
2. T8 inverso (18)
3. T7 (10)
4. T1a (9)
5. T3 (9)
6. T6 (6)
7. T9 (5)

**Lo que la escena tiene y el libro no:** el análisis dimensional, que en esta colección va en el tomo 1, y el barrido de R al abrir θ como gráfica.

**Otras escenas que ya tocan algo de esto:**
- `plantillas/numeros-complejos/`: la flecha en el plano, con módulo y conjugado por cuadritos.
- `plantillas/geometria-analitica/`: coordenadas, punto medio y división de un segmento. La fórmula de T4 es la misma, con vectores.
- `plantillas/geometria-espacio/`: el cubo que gira, útil para T2.
- `plantillas/matrices/`: el determinante como área con signo, que es lo mismo que \|A × B\| en el plano.

Conviene enlazarlas, no duplicarlas.

---

## 3. Contraste con la tabla de errores

**No hay informe de ideas erróneas sobre vectores** en `docs/investigacion/`. La cabecera de `motor.js` y el modo 2 de `index.html` lo dicen, y sus códigos `VE-…` son todos hipótesis. Los únicos respaldos indirectos que usa la escena son E8 de `estatica-energia-ideas-erroneas.md` (tensiones sumadas como números, Flores-García y otros, 2009) y M2 de `momento-gravitacion-ondas-ideas-erroneas.md` (rapideces restadas sin sentido, Saifullah y otros, 2017). Barniol y Zavala (2014, *Test of understanding of vectors*) figura como pendiente. Es la fuente obvia para convertir estas hipótesis en errores documentados, y además mide producto escalar y vectorial.

### Trampas del libro que **coinciden** con códigos que ya existen

| Trampa del libro | Código existente | Comentario |
| --- | --- | --- |
| Sumar módulos como números | `VE-suma-modulos` (parcial, por E8 y M2) | Coincide. En el libro sale también con muchos vectores. |
| R = 0 o «se anulan» | `VE-se-anulan` | Coincide en parte: el libro lo usa además como 0 escalar contra vector nulo (nuevo). |
| Contar solo la diagonal en el hexágono | `VE-hex-solo-diagonal` | Es un caso de «contar mal cuántas veces queda un vector» (nuevo y más general). |
| Seno y coseno cambiados | `VE-sen-cos-cambiados` | Coincide. También TR9 de `trigonometria-ideas-erroneas.md`. |
| Signo de la ley de cosenos y Pitágoras con cualquier ángulo | `VE-coseno-con-menos`, `VE-pitagoras-siempre` | Coinciden en T8. También TR24 de trigonometría. |
| Mínimo cero o rango mal puesto | `VE-minimo-cero`, `VE-entre-modulos`, `VE-maximo-perpendicular` | Se relacionan con R máx y R mín y con el rango del ángulo, pero el libro pregunta al revés. |
| Unitario sin dividir | `VE-unitario-sin-dividir`, `VE-unitario-unos` | Coinciden. Faltan «sin escalar», «suma de unitarios» y «unitario escalado» (nuevos). |
| Una sola solución | TR22 y TR23 de trigonometría | Es la misma idea en otro tema; para vectores no hay código. |
| Sólido leído como plano | GE13 de `geometria-ideas-erroneas.md` | Es la misma idea en otro tema; para vectores no hay código. |
| Raíz que no corresponde | TR21 de trigonometría (no verifica) | Pariente. |
| Ángulo de referencia contra ángulo desde +x | TR12 de trigonometría (signo por cuadrante) | Pariente. |

### Trampas **nuevas** (irían como `hipotesis`)

| Código propuesto | Error |
| --- | --- |
| `VE-cuenta-repetido` | Cuenta mal cuántas veces queda el vector común al cerrar polígonos (k ± 1, 2k). |
| `VE-cero-escalar` | Confunde 0 (módulo) con 0⃗ (vector). |
| `VE-faltan-datos` | Elige «faltan datos» cuando la figura o los datos alcanzan. |
| `VE-nulo-no-paralelo` | Descarta la solución que da el vector nulo, que es paralelo a todos. |
| `VE-sentido-opuesto` | Da el opuesto: −v por v, antiparalelo por paralelo, o resta inicio menos final al revés. |
| `VE-formas-equivalentes` | No reconoce que dos expresiones son iguales. |
| `VE-semisuma-por-semidiferencia` | Pone la semisuma (mediana del trapecio) donde va la semidiferencia, o al revés. |
| `VE-baricentro-invertido` | Usa 1/3 donde va 2/3 de la mediana, o al revés. |
| `VE-pesos-derechos` | Al dividir un segmento en m:n, pone a cada extremo el peso de su propio trozo. |
| `VE-tangente-invertida` | Toma arctan(x/y) por arctan(y/x). |
| `VE-angulo-complementario` | Da el complemento del ángulo pedido. |
| `VE-angulo-de-referencia` | Da el ángulo agudo de referencia en vez del ángulo medido desde +x (segundo, tercer o cuarto cuadrante). |
| `VE-recorrido-vs-desplazamiento` | Confunde el recorrido mínimo por calles con el módulo del desplazamiento. |
| `VE-maximo-minimo-como-modulos` | Toma R máx y R mín como los módulos. |
| `VE-raiz-que-no-cumple` | Se queda con la raíz que no cumple la condición del problema, o descarta una que sí cumple. |
| `VE-una-sola-solucion` | Solo da un sentido cuando se fija el módulo y la dirección. |
| `VE-unitario-sin-escalar` | Para «vector de módulo dado paralelo a v» se queda con el unitario o con v. |
| `VE-suma-de-unitarios` | Toma la suma de los unitarios como el unitario de la suma. |
| `VE-unitario-escalado` | Cree que el unitario cambia con el módulo (si A = 2B, µA = 2µB). |
| `VE-pendiente-a-direccion` | Pasa la pendiente a una dirección mal: (m; 1) o (1; −m). |
| `VE-componente-vs-modulo` | Da el módulo cuando se pide una componente. |
| `VE-proyecciones-invertidas` | Invierte el cociente de proyecciones (B/A por A/B). |
| `VE-escalar-por-vectorial` | Usa cos donde va sen, o al revés (A·B contra \|A × B\|). |
| `VE-mano-derecha-invertida` | Da el sentido opuesto del producto vectorial, o no ve que A × B = −B × A. |
| `VE-area-sin-mitad` | Da \|A × B\| como área del triángulo, sin dividir entre 2. |
| `VE-minimo-no-perpendicular` | No ve que el vector mínimo para fijar una dirección es perpendicular a ella. |
| `VE-solido-plano` | Lee la figura de un sólido como plana (pariente de GE13). |

---

## 4. Propuestas

### (a) Escena de vectores 0.2.0

Los tipos más frecuentes que faltan son T4, T10, los polígonos cerrados con los sólidos, T5 y T13. Juntos son 105 de 200. Se proponen **dos pestañas nuevas**, «Figuras» y «Componentes», más experimentos en «¿Qué pasa si…?», todos con el patrón de la escena: predicción que bloquea, la escena cambia después de responder y un color por vector. Las figuras y los números son nuestros.

**Pestaña «Figuras»** (T1, T2 y T4)

1. **«¿Cuántas veces queda?»** (T1a y T1b). Hay un polígono generado por el motor, con varios vectores sobre lados y diagonales. La predicción es «la resultante es ¿cuántas veces el vector marcado?», con las opciones k, k − 1, k + 1, la suma de los módulos y «faltan datos». Al responder, las flechas se deslizan hasta formar polígonos cerrados que se sombrean y se tachan. Códigos: `VE-cuenta-repetido`, `VE-suma-modulos` y `VE-faltan-datos`.
2. **«El punto que se desliza»** (T4). Dos vectores salen de un punto y un punto P se arrastra sobre el segmento que une sus puntas. Se predice con qué pesos se combina el vector a P cuando P divide el segmento en una razón dada: los pesos cruzados (correcta), los derechos, 1/2 y 1/2, o la suma sin dividir. Al arrastrar P, los pesos se ven como barras de color que cambian. Códigos: `VE-pesos-derechos` y `VE-semisuma-por-semidiferencia`.
3. **«Puntos medios y baricentro»** (T4). En un triángulo arrastrable se trazan la base media y el baricentro, y se predice la fracción de la mediana (2/3, 1/3, 1/2 o 3/4). Después, en un trapecio, se predice el vector entre los puntos medios de las diagonales: semidiferencia contra semisuma. Códigos: `VE-baricentro-invertido` y `VE-semisuma-por-semidiferencia`.
4. **«El cubo que se suma»** (T2), reusando la idea del cubo que gira de `plantillas/geometria-espacio/`. Vectores sobre aristas y diagonales. Se predice la resultante; al responder, el cubo gira, las aristas paralelas se iluminan del mismo color y aparecen las coordenadas de los vértices. Así se ven los dos métodos del libro. Código: `VE-solido-plano`.

**Pestaña «Componentes»** (T5, T7, T10 y T12)

5. **«Cerrar con enteros»** (T5). En una cuadrícula hay tres vectores que no cierran. El alumno mueve m y n con perillas hasta cerrar el polígono. Antes predice el signo y el tamaño de m y n. Los distractores son el signo cambiado, m y n cambiados y una solución no mínima. Códigos: `VE-sentido-opuesto` y `VE-cuenta-repetido`.
6. **«Girar los ejes»** (T7 y T6). Hay varios vectores con ángulos no notables, y una perilla gira los ejes. Se predice si el módulo de la resultante cambia al girar los ejes (no cambia, pero las componentes sí). Después se gira hasta que aparece un notable. Códigos: `VE-componente-vs-modulo` y `VE-angulo-de-referencia`.
7. **«Dos sentidos»** (T10 y T12). Se fija el módulo de la resultante y que esté sobre un eje, y se pide la incógnita. Al responder se muestran las dos soluciones. También va aquí el vector de módulo dado paralelo a otro, con el unitario que se estira. Códigos: `VE-una-sola-solucion`, `VE-unitario-sin-escalar` y `VE-unitario-escalado`.

**Nuevos en «¿Qué pasa si…?»** (T8 inverso y T13)

8. **«El ángulo escondido».** Dos vectores iguales y una perilla de θ. Se predice el ángulo para el que la suma es k veces la diferencia; después se ve el rombo con las diagonales perpendiculares. Variante: dados el máximo y el mínimo, ¿cuánto mide cada vector? Códigos: `VE-angulo-complementario` y `VE-maximo-minimo-como-modulos`.
9. **«La sombra y el área»** (T13). Dos flechas arrastrables, con la proyección de una sobre otra (escalar) y el paralelogramo que forman (vectorial). Se predice qué pasa con cada uno al llevar θ a 90°: el escalar se anula y el área es la mayor. Después, el sentido de A × B con una flecha que sale o entra de la pantalla. Códigos: `VE-escalar-por-vectorial`, `VE-mano-derecha-invertida` y `VE-area-sin-mitad`.

El motor necesitaría funciones nuevas, todas sin DOM y con su campo `errores`:
- `division(A, B, m, n)` y `baricentro(...)`
- `combinacion(lista)` para mA + nB + pC = 0 con enteros mínimos, y `descomponer(C, u, v)` en dos direcciones
- `poligonoFigura(tipo, param)` y `cubo(aristas)` para la reducción a k·v
- `inversoSumaDiferencia(k)` y `desdeMaxMin(Rmax, Rmin)`
- `girarEjes(lista, angulo)`
- `proyeccion(u, v)` y `area(u, v)`
- los notables extendidos en `trig` (16°/74° y 8°/82°, marcados como aproximados, como el 3-4-5)

Cada una necesita sus casos en `casos.json` verificados aparte (regla 2).

### (b) Generadores (formato «predicciones»)

`nucleo/predicciones.js` (`armar`) hoy acepta solo **valores numéricos positivos**: descarta `valor <= 0` y formatea números. Sirve tal cual para G1, G2, G6 y parte de G7. Para G3 a G5 hay dos caminos:
- preguntar por un escalar que resuma la respuesta, como hace el libro («halle m + n», «halle α − β», «halle A² + B² + C²»);
- agregar al núcleo `armarTexto`, con alternativas de texto y comparación por igualdad, para expresiones como pA + qB, vectores (a; b; c) o pares (m; n).

Convendría además una opción para aceptar respuestas negativas o cero, que el libro usa (parámetros negativos, escalar nulo).

| Generador | Tipos | Parámetros | Pregunta | Distractores (código) |
| --- | --- | --- | --- | --- |
| **G1 dos vectores** | T8 | Módulos con un factor común; θ notable (37, 53, 60, 90, 120, 127, 143) | R, la diferencia D, θ a partir de una relación suma-diferencia, los módulos a partir de R máx y R mín, o el rango del ángulo | `VE-suma-modulos`, `VE-coseno-con-menos`, `VE-pitagoras-siempre`, `VE-angulo-complementario`, `VE-maximo-minimo-como-modulos` |
| **G2 componentes con notables** | T7, T9, T11, T1c | Dos a cuatro vectores con módulo múltiplo de 5 (o par, para 30°/60°) y ángulos notables en cualquier cuadrante, o con puntos cardinales; escalares chicos | Módulo de kA + mB + C, ángulo con +x, la fuerza que falta o el recorrido mínimo | `VE-sen-cos-cambiados`, `VE-tangente-invertida`, `VE-angulo-de-referencia`, `VE-suma-modulos`, `VE-sentido-opuesto`, `VE-recorrido-vs-desplazamiento` |
| **G3 unitario** | T12 | Vectores enteros con módulo entero (ternas pitagóricas en 2D y cuádruplas en 3D como 1-2-2-3 o 2-3-6-7); vértices de un cubo o de una cuña propios; una recta y = mx + b | Una componente del unitario, la constante que lo hace unitario, una componente del vector de módulo dado paralelo a otro, o la mayor componente de una suma de unitarios | `VE-unitario-sin-dividir`, `VE-unitario-sin-escalar`, `VE-suma-de-unitarios`, `VE-pendiente-a-direccion`, `VE-sentido-opuesto` (antiparalelo), el inverso de la constante |
| **G4 combinación lineal y condiciones** | T5, T10 | Vectores enteros en una cuadrícula; m y n enteros elegidos para construir C = mA + nB; o se dan A + B y A − B; o una resultante con módulo dado sobre un eje | m + n, m/n, A² − B² o el valor de un parámetro | `VE-sentido-opuesto`, m y n cambiados, un múltiplo no mínimo, `VE-una-sola-solucion`, `VE-raiz-que-no-cumple` |
| **G5 punto que divide** | T4 | Triángulo, paralelogramo o trapecio propios; un punto que divide un lado en m:n; un baricentro | Los coeficientes de x = pA + qB, como escalar (p + q, p − q) o como texto con `armarTexto` | `VE-pesos-derechos`, `VE-baricentro-invertido`, `VE-semisuma-por-semidiferencia`, `VE-sentido-opuesto` |
| **G6 polígono regular** | T1a | n de 3 a 8, lado entero, vértice de partida, qué vectores se trazan | El módulo de la resultante, calculado por el motor con `suma` | `VE-cuenta-repetido`, `VE-hex-solo-diagonal` generalizado, `VE-suma-modulos`, `VE-se-anulan` |
| **G7 producto escalar y vectorial** | T13 | Vectores enteros en 2D y 3D, elegidos para que el coseno sea notable (1/2, 3/5, 4/5, 0); un parámetro para la perpendicularidad | El ángulo, \|A × B\| a partir del escalar y los módulos, el valor del parámetro que hace perpendiculares, el área del triángulo o el cociente de proyecciones | `VE-escalar-por-vectorial`, `VE-area-sin-mitad`, `VE-proyecciones-invertidas`, `VE-angulo-complementario`, `VE-faltan-datos` |

Con 5 a 10 valores por parámetro, cada uno da **cientos de variantes**. Por ejemplo, G2 con 8 ángulos, 6 módulos y 4 combinaciones da más de 1500 casos antes de filtrar los que repiten alternativas. Todo el cálculo sale del motor. Cada generador lleva su `generador.test.js`, que, como en `plantillas/porcentajes-sucesivos/`, verifica para muchas semillas que haya 4 o 5 alternativas distintas y que la correcta coincida con un cálculo independiente.

**G1, G2 y G7 se pueden empezar ya:** el núcleo actual alcanza y el motor tiene casi todo (`resultante`, `vector`, `suma`, `polar`, `escalar`, `vectorial`, `anguloEntre`). G3 a G5 piden antes decidir si se extiende el núcleo con alternativas de texto y con valores negativos o nulos.

### Pendiente

- Revisar Barniol y Zavala (2014) para pasar a `parcial` o `documentado` los códigos `VE-…` que el test mida: suma de módulos, componentes, unitario, producto escalar y producto vectorial.
- La clasificación cuenta un solo compendio, con un sesgo claro hacia la UNI y el CEPRE-UNI. Para San Marcos y las universidades de provincia, cruzar con `docs/clasificacion-unmsm.md` y con los temarios antes de fijar prioridades.
