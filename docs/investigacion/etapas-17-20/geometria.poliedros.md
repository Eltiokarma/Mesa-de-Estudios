# Geometría · Poliedros

Identificador: `geometria.poliedros`. Etapa 17. Propuesta para quinto de secundaria y postulantes peruanos que estudian solos en celular. Consulta: 21 de noviembre de 2026. Escenas y consignas propias; las referencias delimitan exigencias. No es una unidad implementada ni un banco final de ejercicios.

## 1. Resumen en 5 líneas

La unidad enseña a reconocer un poliedro y distinguir sus caras, aristas y vértices, incluidos los que una imagen oculta.
Construye el conteo por incidencias y la relación de Euler antes de clasificar los cinco poliedros regulares convexos.
Relaciona objetos, desarrollos planos y secciones para decidir qué longitudes y ángulos corresponden al sólido real.
Deduce las relaciones métricas principales del cubo, tetraedro y octaedro, y diferencia superficie, volumen y escala.
La mayor dificultad es coordinar lo que se ve con las propiedades: una perspectiva deforma la imagen, pero no cambia el objeto.

## 2. Qué se pregunta en los exámenes

La muestra reúne cuestionarios UNI, una reproducción UNMSM, material preuniversitario y un temario UNSA; no permite estimar frecuencia general. La dificultad es una valoración pedagógica: inicial para reconocer, intermedia para enlazar relaciones y alta para reconstruir configuraciones o combinar condiciones.

| Tipo de pregunta | Universidad | Dificultad | Frecuencia comprobable | Fuente |
|---|---|---|---|---|
| Comparar conteos antes y después de añadir una parte a un poliedro | UNI 2018-II | Alta: cambios de elementos y Euler | Un caso localizado | [F01], segunda prueba, pregunta 29, página impresa 40; oficial |
| Completar un bloque de cubitos e identificar vistas | UNI 2018-II, razonamiento matemático | Intermedia: reconstrucción de partes ocultas | Dos casos, sin inferir frecuencia de teoría de poliedros | [F01], primera prueba, preguntas 2–3, página 9 |
| Relacionar un desarrollo con el cubo armado | UNI 2019-II, razonamiento matemático | Intermedia a alta: vecindades y orientación | Un caso localizado | [F02], primera prueba, pregunta 10; oficial |
| Hallar volumen del cubo desde la distancia de un vértice a una diagonal | UNMSM, atribuido a 2012-I | Alta: perpendicular, triángulo auxiliar y arista | Un caso en reproducción; autenticación institucional pendiente | [F03], pregunta 50; recopilación externa |
| Elementos, convexidad, Euler y suma de ángulos de caras | CEPRE-UNI 2023-2 | Inicial a alta según condiciones | Presencia en sílabo, no frecuencia de examen | [F04], geometría, página 8 del PDF |
| Existencia y propiedades de regulares y conjugados | CEPRE-UNI 2023-2 | Intermedia: clasificación por propiedades | Presencia en sílabo | [F04], «Poliedros regulares» |
| Euler; medidas de tetraedro, cubo y octaedro; identificación de los otros regulares | CEPRE-UNMSM 2024-II | Intermedia a alta: seleccionar relaciones métricas | Presencia en un boletín, no examen de admisión | [F05], semana 13, páginas 23–25; copia externa |
| Diedros, poliedros y Euler | UNSA, proceso ordinario 2023 | El temario no mide dificultad | Presencia en temario histórico | [F06], página 2; oficial |
| Tipos específicos y recurrencia | UNA Puno y UNSAAC | No determinada | Sin muestra verificada en esta entrega | Pendiente; no significa ausencia del tema |

El orden responde a dependencias conceptuales. Estimar frecuencia requiere una serie completa por años, modalidades y áreas. Prismas y pirámides se sistematizan después; cualquier herramienta necesaria se explica aquí.

## 3. Errores típicos

DOCUMENTADO identifica un error descrito en el original; la lectura parcial de [F11] se declara expresamente. HIPÓTESIS indica una anticipación que necesita validación. Un mecanismo propuesto por un autor no equivale a una causa demostrada. No se trasladan resultados de otras edades o países a postulantes peruanos.

| Código | Qué cree o hace el alumno | Por qué puede hacerlo y alcance de la interpretación | Etiqueta | Fuente con autor y año |
|---|---|---|---|---|
| P-OCUL | Cuenta solo las caras visibles. | Trata la imagen como inventario completo; el informe lo propone como interpretación. | DOCUMENTADO | MINEDU–UMC, 2001, ítem 6, [F11]; original indexado, lectura parcial |
| P-FRENTE | Cuenta lados de la figura frontal cuando se piden caras. | Confunde figura plana y cuerpo; explicación posible del informe. | DOCUMENTADO | MINEDU–UMC, 2001, ítem 6, [F11]; lectura parcial |
| P-CONFUNDE | Intercambia caras, aristas y vértices. | Recuerda cantidades sin asociarlas al elemento pedido. | HIPÓTESIS | Diseño propio, 2026 |
| P-CORTE | Resta la esquina cortada sin añadir vértices nuevos. | Entiende cortar únicamente como quitar. | HIPÓTESIS | Diseño propio, 2026 |
| P-SUPER | Añade vértices del corte y conserva el retirado. | Superpone los estados inicial y final. | HIPÓTESIS | Diseño propio, 2026 |
| P-DOB | Cuenta lados de caras como aristas diferentes. | No reconoce que el borde es compartido. | HIPÓTESIS | Diseño propio, 2026; no se atribuye a [F09] |
| P-CARAS | Declara regular un sólido solo por sus caras iguales. | Omite la configuración de los vértices. | HIPÓTESIS | Diseño propio, 2026; antecedente relacionado en [F10] |
| P-CONV | Usa convexidad como condición suficiente de regularidad. | Confunde definiciones próximas. | DOCUMENTADO | Mántica y Freyre, 2019, grupo T y M, pp. 217–219, [F10] |
| P-UNION | Cree que unir dos poliedros impide obtener uno regular. | Clasifica por fabricación, no por propiedades. | HIPÓTESIS | Diseño propio, 2026 |
| P-NUM | Acepta cualquier reunión de seis cuadrados como desarrollo. | Cuenta piezas sin comprobar su destino al plegar. | HIPÓTESIS | Diseño propio, 2026 |
| P-AREA | Confunde igual área de cartón con igual sólido obtenible. | Sustituye una condición espacial por una de cantidad. | HIPÓTESIS | Diseño propio, 2026 |
| P-GIRO | Gira el papel para intentar reparar un desarrollo inválido. | Confunde orientación y conexiones entre caras. | HIPÓTESIS | Diseño propio, 2026 |
| P-ROT | Sigue una cara y pierde la posición de las otras al girar. | No coordina el movimiento del conjunto. | DOCUMENTADO | Gutiérrez, 1996, ejemplos de pp. 13–16, [F07] |
| P-ASPECTO | Decide medidas por la apariencia en perspectiva. | La imagen domina las propiedades geométricas. | DOCUMENTADO | Fujita y colaboradores, 2020, respuestas y episodios, [F08] |
| P-DIAG | Iguala una arista del cubo con una diagonal de cara. | Extiende la igualdad de aristas a otros segmentos. | DOCUMENTADO | Fujita y colaboradores, 2020, Q2-(2), [F08] |
| P-PERP | Supone perpendiculares segmentos de caras perpendiculares. | Transfiere una propiedad de planos a segmentos cualesquiera. | DOCUMENTADO | Fujita y colaboradores, 2020, Q5, [F08] |
| P-CUBITOS | Cuenta caras como cubos, duplica esquinas u omite el interior. | No organiza el bloque en capas completas. | DOCUMENTADO | Battista y Clements, 1995, cajas A–C, [F09] |
| P-LIN | Duplica área y volumen cuando se duplica la arista. | Aplica proporcionalidad simple a toda magnitud. | HIPÓTESIS | Diseño propio, 2026 |
| P-SUPVOL | Hace crecer el volumen como el área. | Imagina solo la envoltura del objeto. | HIPÓTESIS | Diseño propio, 2026; no se atribuye este error de escala a [F09] |
| P-DIM | Intercambia factores o unidades de área y volumen. | Asocia exponentes a etiquetas sin distinguir dimensiones. | HIPÓTESIS | Diseño propio, 2026 |

La evidencia peruana [F11] es histórica y de primaria: se leyó el fragmento original indexado del ítem 6 y se verificaron título y año; falló el acceso directo. No se reproducen porcentajes. Las otras investigaciones se leyeron en sus originales.

Para validar los distractores se recogerá una justificación breve: una alternativa elegida no demuestra por sí sola qué pensó el alumno.

## 4. Lo que la unidad da por sabido

Se necesitan segmento, polígono, triángulo, cuadrado y pentágono; interior y borde; congruencia; y regularidad de polígonos, entendida como igualdad de lados y ángulos. Se recuperan con piezas superponibles.

Para el conteo: operaciones y despeje de una igualdad sencilla. Para medir: cuadrados, raíces, unidades de longitud, áreas de rectángulos y triángulos, Pitágoras y semejanza. Antes de la idea 5 se recuperan ángulo recto, hipotenusa, punto medio y altura. En un equilátero se reconstruye con medianas que su centro está a dos tercios de la mediana desde el vértice. Si se usa coseno, se entrega la ley de cosenos explicada en el triángulo correspondiente.

No se presuponen Euler, los cinco regulares, desarrollos válidos, diagonales espaciales, diedros ni volúmenes de pirámides. Una comprobación inicial de vocabulario activa apoyos, no impide entrar. Las fórmulas permanecen disponibles en los ejercicios; no se exige haber cursado la unidad siguiente.

Los signos se leen: =, igual a; +, más; −, menos; ×, por; /, dividido entre; <, menor que; °, grado; √, raíz cuadrada. Un exponente 2 se lee «al cuadrado» y 3, «al cubo».

## 5. Las ideas, en orden

Cada idea sigue Lee → Juega → Predice → Mira → La regla → Así se resuelve → Ahora tú. El vocabulario acompaña las explicaciones y queda disponible para consulta.

Escenas y contrastes son propios. El equipo fijará y recalculará los ejercicios finales. Las interacciones tendrán alternativa por toques y el color se acompañará de rótulos o tramas.

### Idea 1. El objeto completo

**Pregunta que responde:** ¿qué contamos cuando hablamos de las caras, aristas y vértices de una caja?

**Aprendizaje:** el alumno identifica elementos del sólido y conserva los que existen aunque una vista los oculte.

**Objeto de la primera pantalla:** una caja cerrada de cartón en el mostrador de una bodega, con etiqueta de entrega. Se idealiza como cúbica, sin espesor, sin atribuirle medidas comerciales. Primero se ve el paquete, sin ejes ni líneas auxiliares; hay tres caras visibles y aún no se permite girarlo.

#### Lee

1. Una caja ocupa un lugar y tiene una superficie que la separa de lo que está afuera. La foto muestra solo una parte de esa superficie.
2. Llamaremos cara a cada zona plana que forma el exterior del modelo. Para reconocerla puedes imaginar que la cubres con una sola tarjeta rígida.
3. Donde dos caras se encuentran hay una arista. Donde terminan y se reúnen varias aristas hay un vértice: una esquina del modelo.
4. La etiqueta y la cinta pertenecen al paquete real. El modelo geométrico conserva su forma y deja fuera esos detalles de fabricación.

#### Juega

El alumno coloca una tarjeta en una cara visible, una cinta sobre una arista de esa cara y un botón en un extremo de esa arista. Misión: **«Señala una cara, una arista de esa cara y un vértice de esa arista»**. Se comprueban las tres relaciones; una selección errónea conserva las correctas.

No se ofrece contador total, giro ni revelación de elementos ocultos antes de predecir.

#### Predice

Se presenta otra caja de igual forma, cerrada y vista desde otra esquina; solo se ven tres caras. **«¿Cuántas caras tiene en total, incluyendo las ocultas?»** Aún no se muestra su giro.

| Opción | Respuesta | Valor y error asociado |
|---|---|---|
| A | Tres: las que aparecen en la imagen | Incorrecta: P-OCUL |
| B | Seis: la vista deja algunas ocultas | Correcta |
| C | Cuatro: cuento los cuatro lados de la parte que miro de frente | Incorrecta: P-FRENTE |
| D | Ocho: cuento todas sus esquinas | Incorrecta: P-CONFUNDE |

#### Mira

La caja gira por pasos; cada cara recibe una etiqueta que conserva al reaparecer. Al levantarla se revela la inferior. El contador aumenta solo ante una cara nueva y termina en seis. Después se explican las diferencias con aristas y vértices y se ofrece transparencia junto al objeto opaco.

#### La regla

Un poliedro es aquí un sólido limitado por caras poligonales planas que cierran una superficie sin cruces. Cada arista une dos caras y sus extremos son vértices. Las caras son regiones completas de la frontera: pintar una línea dentro de una cara no crea dos caras del sólido.

El cubo tiene seis caras cuadradas congruentes, doce aristas y ocho vértices. Congruentes significa igual forma y tamaño, aunque la perspectiva muestre una cara más estrecha. Girar cambia lo visible, no el inventario. Una línea discontinua representa una arista oculta; se introduce junto al modelo que la revela.

Un poliedro es convexo si todo segmento entre dos de sus puntos queda dentro o sobre su frontera. Se comprueba con puntos y segmentos, no porque parezca redondo. Una caja rectangular puede ser convexa sin ser cúbica; una hendidura puede volver no convexo al modelo.

Una pelota, un vaso curvo y una moneda real no son poliedros ideales; dibujar polígonos no crea caras planas. Se precisa la idealización y se excluyen de este alcance superficies abiertas o cuerpos unidos solo por una punta.

#### Palabras nuevas

| Palabra | Explicación de todos los días | Tres ejemplos |
|---|---|---|
| Cara | Una parte plana del exterior que puedes cubrir sin doblar la tarjeta que apoyas | La tapa de la caja ideal; su fondo; uno de sus costados |
| Arista | El borde recto donde se encuentran dos de esas partes planas | El encuentro entre tapa y costado; entre dos costados; entre fondo y costado |
| Vértice | Una esquina puntual donde se reúnen bordes | Una esquina superior del cubo; una inferior; una punta de un modelo de cuatro caras |
| Convexo | Sin una entrada que haga salir del objeto un segmento trazado entre dos de sus puntos | Un cubo; una caja rectangular cerrada; un bloque de cuatro caras triangulares sin hendiduras |

#### Así se resuelve

**Caso original:** dos vistas de una caja rectangular cerrada muestran caras diferentes. Se pregunta si cambia su cantidad total.

1. Se confirma que es la misma caja, sin cortes ni añadidos.
2. Se identifican tapa, fondo, frente, parte posterior y dos costados; los nombres dependen de esta posición.
3. Se emparejan las caras repetidas entre vistas y se reconstruyen las ocultas mediante el cierre de la caja.
4. Se verifican seis caras en ambas vistas: girar no añadió ni retiró ninguna. Se comprueba con el modelo.

Una silueta sin descripción suficiente puede admitir varios sólidos; no siempre es posible completar lo oculto.

#### Ahora tú

- Identificar cara, arista y vértice primero en el objeto y después en una vista fija.
- Emparejar vistas y justificar qué elementos siguen existiendo aunque estén ocultos.
- Distinguir aristas de líneas impresas y costuras coplanares.
- Clasificar convexidad con un segmento testigo y separar objetos curvos de poliedros.
- Seleccionar afirmaciones sobre elementos visibles y totales con varias vistas: nivel de admisión sin información indispensable omitida.

### Idea 2. Contar lo compartido

**Pregunta que responde:** ¿cómo comprobar un conteo y actualizarlo cuando cambia la forma?

**Aprendizaje:** el alumno usa relaciones entre caras, aristas y vértices, contando cada elemento compartido una sola vez.

**Objeto de la primera pantalla:** una caja de regalo de cartón, cerrada, junto a etiquetas removibles. Sus bordes y esquinas se identifican antes de mostrar registros numéricos.

#### Lee

1. Al recorrer una cara puedes encontrar un borde que ya habías visto desde otra. Es el mismo borde del objeto.
2. Un registro útil permite reconocer cada pieza y comprobar si ya pasó por el conteo. Las etiquetas ayudan a volver sobre el recorrido.
3. Hoy compararemos objetos antes y después de un cambio. El registro inicial se conserva para poder revisar qué apareció y qué desapareció.
4. Una diagonal une vértices que no son vecinos por un borde. Más adelante distinguiremos las que están en una cara de las que atraviesan el interior.

#### Juega

Misión: **«Entrega un inventario en el que cada elemento tenga una sola etiqueta»**. Se tocan caras, aristas y vértices de dos modelos cerrados, uno cúbico y otro de caras triangulares. Se permite giro y transparencia. La app valida cobertura sin duplicados y avisa cuando una pieza ya tiene etiqueta.

No se presenta aún una relación entre totales ni se corta ningún modelo.

#### Predice

Se anuncia un corte pequeño de una esquina del cubo: atraviesa sus tres aristas incidentes sin alcanzar otras. No se ejecuta. **«¿Qué inventario tendrá el sólido restante?»** Se conserva el registro inicial: seis caras, ocho vértices y doce aristas.

| Opción | Respuesta | Valor y error asociado |
|---|---|---|
| A | Siete caras, siete vértices y doce aristas | Incorrecta: P-CORTE |
| B | Siete caras, diez vértices y quince aristas | Correcta |
| C | Siete caras, once vértices y quince aristas | Incorrecta: P-SUPER |
| D | Siete caras, diez vértices y dieciocho aristas | Incorrecta: P-DOB |

#### Mira

El corte elimina un vértice, crea tres y añade una cara triangular. Los tres bordes nuevos se recorren desde ambas caras, con una sola etiqueta por borde. Los tramos restantes de aristas antiguas siguen contando. Se comparan antes y después desde igual orientación.

#### La regla

Sean \(n_c\), «n sub c», el número de caras; \(n_a\), «n sub a», el número de aristas; y \(n_v\), «n sub v», el número de vértices. Para un poliedro convexo cerrado se cumple la relación de Euler:

\[
n_c+n_v=n_a+2.
\]

Euler no define regularidad ni garantiza que cualquier inventario sea realizable. Aquí se usa en poliedros convexos cerrados; no se extrapola a cajas abiertas, cuerpos separados o túneles. También puede cumplirse en poliedros no convexos sin túneles: no convexidad no significa automáticamente fallo de la relación.

Para justificarlo se lleva el armazón a una red plana sin cruces, incluyendo una región exterior. Quitar una arista de un recorrido cerrado une dos regiones: desaparecen una arista y una región. Se continúa hasta dejar una red conectada sin recorridos cerrados: tiene una arista menos que vértices y una región exterior. La diferencia entre vértices menos aristas más regiones sigue siendo dos. Esta red es una representación auxiliar, no cartón deformado. [F12]

Cada arista del poliedro pertenece a dos caras. Si \(p_i\), «p sub i», es el número de lados de la cara indicada por el índice \(i\), al sumar lados de todas las caras cada arista se cuenta dos veces:

\[
\sum_{i=1}^{n_c}p_i=2n_a.
\]

El signo \(\sum\), «sumatoria», indica sumar una vez por cara. Si todas tienen \(p\) lados, \(p n_c=2n_a\). Si en cada vértice concurren \(q\) aristas, \(q n_v=2n_a\), porque cada arista tiene dos extremos. Si esa concurrencia varía, se suman las cantidades por vértice en lugar de usar un único \(q\).

La suma de todos los ángulos interiores de todas las caras se designa \(\Theta\), «theta mayúscula». Al sumar \(180^\circ(p_i-2)\) por cada cara y usar el conteo de lados, se obtiene \(\Theta=360^\circ(n_a-n_c)=360^\circ(n_v-2)\). Son ángulos de polígonos planos; esta suma no es la de los ángulos diedros entre caras. La deducción permite elegir una relación cuando el problema proporciona ángulos en vez de un dibujo.

Una diagonal espacial une vértices que no están en una misma cara. Hay \(n_v(n_v-1)/2\) pares de vértices; se restan aristas y diagonales de caras. Una cara de \(p_i\) lados tiene \(p_i(p_i-3)/2\) diagonales: desde cada vértice se excluyen él mismo y sus vecinos, y cada segmento se cuenta desde ambos extremos. Así:

\[
n_d=\frac{n_v(n_v-1)}{2}-n_a-\sum_{i=1}^{n_c}\frac{p_i(p_i-3)}{2}.
\]

\(n_d\), «n sub d», cuenta diagonales espaciales, no longitudes. La fórmula exige vértices y caras geométricos de un poliedro convexo, sin puntos añadidos sobre aristas. Dos caras no comparten una diagonal de cara. Si el enunciado pide diagonales «totales», debe aclarar si incluye las de caras.

#### Palabras nuevas

| Palabra | Explicación de todos los días | Tres ejemplos |
|---|---|---|
| Incidencia | Una relación de pertenencia entre piezas del objeto | Una arista pertenece a dos caras; un vértice es extremo de una arista; una cara contiene varios vértices |
| Inventario | Registro de lo que hay sin repetir una misma pieza | Lista de caras rotuladas; lista de bordes identificados; lista de esquinas recorridas |
| Diagonal espacial | Un atajo recto entre esquinas que no queda sobre una sola cara | Unión de esquinas opuestas de un cubo; unión de esquinas opuestas de una caja alargada; otra diagonal interior de esa caja |
| Relación de Euler | Una comprobación que enlaza tres conteos del sólido | Revisar un cubo; revisar el cubo con una esquina cortada; completar un conteo de un modelo convexo de caras triangulares |

#### Así se resuelve

**Caso original:** una maqueta convexa cerrada tiene cuatro caras triangulares y cuatro hexagonales. Se piden sus vértices.

1. Las condiciones permiten usar incidencias y Euler. Hay \(n_c=4+4=8\) caras.
2. Al sumar lados de caras se obtiene \(4\times3+4\times6=36\) incidencias.
3. Cada arista apareció dos veces: \(n_a=36/2=18\).
4. Euler da \(n_v=n_a+2-n_c=18+2-8=12\).
5. Se verifica el inventario: ocho caras más doce vértices igualan dieciocho aristas más dos. No se redondean conteos imposibles.

#### Ahora tú

- Obtener un conteo faltante con Euler y justificar sus condiciones.
- Hallar aristas desde cantidades de caras de distintos tipos, explicando el doble conteo.
- Detectar inventarios incompatibles; distinguir condición necesaria de construcción posible.
- Actualizar elementos al cortar una esquina o añadir una punta con la operación completamente definida.
- Combinar suma de ángulos de caras, incidencias y Euler.
- Contar diagonales espaciales o relacionar estados inicial y final al nivel de la UNI, con casos propios.

### Idea 3. Regular exige más

**Pregunta que responde:** ¿por qué tener caras iguales no basta y por qué solo hay cinco regulares convexos?

**Aprendizaje:** el alumno verifica las condiciones de regularidad en caras y vértices y deduce las posibilidades mediante ángulos planos.

**Objeto de la primera pantalla:** adornos de cartulina para una feria escolar, con piezas triangulares y cuadradas unibles por bordes completos. Se empieza en la mesa de manualidades, sin una lista inicial de nombres.

#### Lee

1. Las piezas de una manualidad pueden tener la misma forma y el mismo tamaño. En geometría decimos que son congruentes.
2. Un triángulo equilátero tiene sus tres lados iguales; sus tres ángulos también son iguales. Un cuadrado reúne la misma igualdad en sus cuatro lados y cuatro ángulos.
3. Al juntar piezas, podemos mirar tanto sus caras como lo que ocurre alrededor de cada esquina. El objeto completo guarda información que una cara sola no muestra.

#### Juega

Misión: **«Cierra dos adornos: uno con cuatro triángulos equiláteros iguales y otro con seis cuadrados iguales, sin bordes libres»**. Se emparejan bordes mediante toques o arrastre. Se comprueba uso de piezas, cierre y ausencia de cruces. Se nombran tetraedro regular y cubo, sin presentar aún el criterio general.

#### Predice

Dos tetraedros regulares iguales se pegan por una cara, uno a cada lado; esa cara queda dentro. El exterior tiene seis triángulos equiláteros iguales y se muestran todos sus vértices. **«¿Es regular el nuevo poliedro exterior? Elige conclusión y razón»**.

| Opción | Respuesta | Valor y error asociado |
|---|---|---|
| A | Sí, porque todas sus caras son triángulos equiláteros iguales | Incorrecta: P-CARAS |
| B | Sí, porque no tiene entradas hacia adentro y es convexo | Incorrecta: P-CONV |
| C | No, porque en unas esquinas concurren tres caras y en otras cuatro | Correcta |
| D | No, porque pegar dos poliedros nunca puede producir uno regular | Incorrecta: P-UNION |

#### Mira

Se recorren las cinco esquinas: en las dos puntas concurren tres caras y en las otras tres concurren cuatro. El sólido es convexo, pero no regular. Se muestra además un octaedro formado por dos mitades: la historia de fabricación no decide la clasificación.

#### La regla

Un regular convexo tiene caras que son polígonos regulares congruentes y la misma configuración en todos sus vértices. Con un único tipo de cara regular, se exige igual número de caras concurrentes en cada vértice. Aristas iguales o caras regulares por sí solas no bastan. «Tetraedro» indica cuatro caras; «regular» añade condiciones.

Se conserva \(p\) para lados por cara y \(q\) para aristas concurrentes por vértice, que aquí coincide con el número de caras concurrentes. Sea \(\beta\), «beta», el ángulo interior de una cara regular. Se obtiene dividiendo la suma de ángulos del polígono entre sus lados:

\[
\beta=\frac{(p-2)180^\circ}{p},\qquad q\beta<360^\circ.
\]

La desigualdad corresponde a una esquina convexa auténtica: si las piezas completan una vuelta plana, no forman esa esquina. Deben concurrir al menos tres caras y cada cara tener al menos tres lados. Un triángulo equilátero permite tres, cuatro o cinco caras por vértice; un cuadrado permite tres; un pentágono regular permite tres. Con seis o más lados, tres ángulos ya alcanzan o exceden una vuelta completa. Esas restricciones dejan cinco posibilidades; los modelos cerrados muestran que cada una existe. [F13]

| Poliedro regular convexo | Forma de la cara | \(p\) | \(q\) | Caras \(n_c\) | Aristas \(n_a\) | Vértices \(n_v\) |
|---|---|---|---|---|---|---|
| Tetraedro | Triángulo equilátero | 3 | 3 | 4 | 6 | 4 |
| Hexaedro o cubo | Cuadrado | 4 | 3 | 6 | 12 | 8 |
| Octaedro | Triángulo equilátero | 3 | 4 | 8 | 12 | 6 |
| Dodecaedro | Pentágono regular | 5 | 3 | 12 | 30 | 20 |
| Icosaedro | Triángulo equilátero | 3 | 5 | 20 | 30 | 12 |

La tabla se consulta; sus conteos se reconstruyen con Euler e incidencias. Los nombres sin «regular» solo indican cantidad de caras, no estas formas o cantidades de aristas.

Los duales o conjugados intercambian caras y vértices y conservan aristas: cubo–octaedro, dodecaedro–icosaedro y tetraedro–tetraedro. Se obtiene el dual uniendo centros de caras vecinas de un regular. Es una relación estructural; no asegura iguales medidas.

#### Palabras nuevas

| Palabra | Explicación de todos los días | Tres ejemplos |
|---|---|---|
| Congruente | Que puede encajar exactamente sobre otra pieza, aunque se gire | Dos cuadrados del adorno; dos triángulos de una misma plantilla; dos caras opuestas del cubo |
| Regular | Que repite todas las condiciones exigidas en las caras y las esquinas | Tetraedro regular; cubo; octaedro regular |
| Concurrir | Llegar al mismo punto | Tres caras en una esquina del cubo; cuatro en una punta del octaedro; cinco en una del icosaedro |
| Dual | Otro sólido que cambia caras por esquinas al conservar sus conexiones | Cubo–octaedro; dodecaedro–icosaedro; tetraedro–tetraedro |

#### Así se resuelve

**Caso original:** un regular convexo tiene caras triangulares y cuatro caras en cada vértice. Se pide identificarlo y justificar sus conteos.

1. Se traduce: \(p=3\), \(q=4\). Cuatro ángulos de sesenta grados dejan una esquina convexa posible.
2. Las incidencias dan \(n_c=2n_a/3\) y \(n_v=n_a/2\).
3. Sustituir en Euler deja \(2n_a/3+n_a/2=n_a+2\); resulta \(n_a=12\).
4. Se recuperan ocho caras y seis vértices: es el octaedro regular. Se contrasta con la tabla y se revisa la concurrencia en todo el modelo.

#### Ahora tú

- Distinguir regulares de modelos que cumplen solo algunas condiciones.
- Clasificar posibilidades de \(p\) y \(q\) mediante sus ángulos.
- Reconstruir conteos con Euler e incidencias, consultando los nombres.
- Relacionar un regular con su dual sin suponer iguales medidas.
- Resolver condiciones algebraicas sobre un regular desconocido y descartar configuraciones imposibles.

### Idea 4. Del cartón al sólido

**Pregunta que responde:** ¿qué debe cumplir una plantilla para convertirse en la superficie de una caja?

**Aprendizaje:** el alumno conserva caras y vecindades al plegar, detecta superposiciones y diferencia superficie geométrica de cartulina de fabricación.

**Objeto de la primera pantalla:** una caja cúbica de obsequio con marcas propias y su plantilla. Se presenta armada antes de abrirla; no se utiliza la numeración convencional de un dado.

#### Lee

1. Una caja puede abrirse cortando algunos bordes. Sus caras quedan sobre la mesa y siguen relacionadas por los bordes que no se cortaron.
2. Esa plantilla se llama desarrollo. Doblarla permite comparar el dibujo plano con el objeto que se quiere obtener.
3. En un envase real también hay pestañas para pegar. Para estudiar la superficie primero trabajaremos con las caras, sin esas pestañas.

#### Juega

Una plantilla válida tiene cuatro cuadrados en fila y otros dos, arriba y abajo del segundo. Misión: **«Ocupa las seis posiciones de la caja con una cara en cada posición y ninguna superpuesta»**. El alumno elige apoyo y mueve controles de plegado por pasos. Se validan cobertura y ausencia de superposición; las marcas acompañan sus caras.

El juego no muestra plantillas inválidas. La predicción cambia la distribución, conservando cantidad y tamaño de piezas.

#### Predice

Una pieza rectangular tiene dos filas de tres cuadrados iguales. Solo se dobla por sus separaciones: no se añade ningún corte ni pliegue y no se estira. **«¿Puede cerrar el mismo cubo, con cada cuadrado como una cara y sin superposiciones?»**

| Opción | Respuesta | Valor y error asociado |
|---|---|---|
| A | Sí, porque seis cuadrados siempre forman un cubo | Incorrecta: P-NUM |
| B | Sí, porque tiene la misma área de cartón que la plantilla anterior | Incorrecta: P-AREA |
| C | No; esa distribución no puede ocupar las seis caras conservando todas esas uniones | Correcta |
| D | Sí, si se gira el rectángulo sobre la mesa antes de doblarlo | Incorrecta: P-GIRO |

#### Mira

Se destaca un punto interior donde se reúnen cuatro cuadrados. Mantener esas uniones obligaría a reunir cuatro caras cuadradas en una esquina del cubo, que admite tres. La animación muestra el conflicto y permite comparar con la plantilla válida. Girar el papel no cambia sus conexiones; el argumento no depende de un único intento fallido.

#### La regla

Un desarrollo válido contiene las caras conectadas por bordes conservados y puede plegarse hasta cerrar la superficie sin huecos ni superposiciones. Igual cantidad de polígonos e igual área no bastan. Hay que seguir vecindades, posiciones opuestas y orientación de marcas.

Cada cara del cubo tiene cuatro vecinas y una opuesta. Caras separadas en el papel pueden tocarse al cerrar un corte; las unidas por un borde lo conservan. No tocarse en el plano no significa ser opuestas. Se fija una cara de referencia, se pliegan sus vecinas y se siguen las restantes.

Una marca viaja con toda su cara y puede quedar girada. El enunciado debe indicar desde qué lado se mira el papel y conservar el exterior. No se usa la regla de un dado de sumar siete en caras opuestas salvo que se dé como dato.

Sea \(S\), «ese», el área de la superficie exterior. Si \(S_i\), «ese sub i», es el área de la cara indicada, entonces \(S=\sum S_i\). Abrir una superficie sin estirarla conserva la suma de las áreas de sus caras. Para un cubo de arista \(a\), «a», longitud común de sus bordes, cada cara tiene área \(a^2\) y \(S=6a^2\). En esta expresión el cuadrado indica dos dimensiones, no seis longitudes.

Pestañas, márgenes y desperdicio de fabricación no pertenecen automáticamente a \(S\). Si se piden, deben darse sus medidas y posición. No se cuentan dos veces regiones compartidas ni se confunde una plantilla ideal con consumo industrial.

#### Palabras nuevas

| Palabra | Explicación de todos los días | Tres ejemplos |
|---|---|---|
| Desarrollo | La superficie abierta y extendida que puede volver a cerrar el objeto | Una plantilla válida de cubo; cuatro triángulos que cierran un tetraedro; una envoltura poliédrica abierta por bordes elegidos |
| Adyacente | Que comparte un borde completo con otra cara | Tapa y costado del cubo; dos caras laterales vecinas; dos triángulos unidos por una arista del tetraedro |
| Superposición | Dos piezas intentando ocupar el mismo lugar | Dos cuadrados sobre la misma cara del cubo; una solapa sobre otra; dos paneles coincidentes en un plegado inválido |
| Superficie | Lo que se recubre por fuera, medido por extensión | Papel sobre una caja; pintura sobre el modelo completo; cartulina de las seis caras sin pestañas |

#### Así se resuelve

**Caso original:** una plantilla válida tiene cuatro cuadrados en fila: estrella, luna, sol y hoja. Encima de luna hay flor y debajo, gota. Se pide la cara opuesta a luna.

1. Se fija luna al frente, conservando el exterior del papel.
2. Estrella y sol se pliegan a sus lados; flor y gota ocupan arriba y abajo.
3. Hoja, unida al borde exterior de sol, termina detrás, frente a luna.
4. La respuesta es hoja: no comparte arista con luna. La transparencia permite comprobarlo; una cara vecina no sería una alternativa válida.

#### Ahora tú

- Emparejar plantilla y sólido, primero plegando y después anticipando.
- Justificar validez o superposición en plantillas con igual cantidad de caras.
- Identificar caras opuestas, vecinas y orientación de marcas: progresión hasta la demanda de la UNI con figuras propias.
- Calcular superficie desde áreas de caras y separar pestañas con datos suficientes.
- Comparar desarrollos de igual superficie y distinto contorno plano, sin confundir área y perímetro.

### Idea 5. Un corte para medir

**Pregunta que responde:** ¿cómo encontrar la figura plana que permite medir dentro de un sólido?

**Aprendizaje:** el alumno construye secciones y triángulos auxiliares, distinguiendo la medida del objeto de su apariencia en perspectiva.

**Objeto de la primera pantalla:** jabón artesanal cúbico sobre una tabla y una lámina translúcida de corte virtual. El objeto precede a puntos y triángulos. Es un modelo ideal; no se pide efectuar cortes físicos.

#### Lee

1. Al cortar un bloque con una superficie plana aparece una nueva región plana. La forma de esa región depende de por dónde pasa el corte.
2. La lámina representa una parte de un plano: aunque la pantalla le dibuje un borde, el plano del modelo continúa más allá.
3. Una sección es la región que comparten el plano de corte y el sólido. Podemos mirarla de frente para estudiarla sin la deformación de la perspectiva.
4. Medir en el dibujo y medir el objeto son cosas distintas. Usaremos las propiedades y los datos que acompañan al modelo.

#### Juega

Misión: **«Sitúa un corte paralelo a la tabla que pase por las tres marcas»**. Están a igual altura en tres aristas verticales. Se desplaza la lámina sin inclinarla y se comprueba que contenga las marcas. Se muestra la sección cuadrada; no se corta aún una esquina.

#### Predice

Se marcan los puntos medios de las tres aristas que llegan a una esquina del cubo, sin cortar aún. **«¿Cómo será la cara nueva de un corte plano por esas marcas al mirarla de frente?»** La perspectiva la hace parecer de lados distintos, aunque las marcas están exactamente a mitad de arista.

| Opción | Respuesta | Valor y error asociado |
|---|---|---|
| A | Un triángulo rectángulo, porque las caras del cubo son perpendiculares | Incorrecta: P-PERP |
| B | Un triángulo equilátero cuyos lados miden lo mismo que una arista completa del cubo | Incorrecta: P-DIAG |
| C | Un triángulo escaleno, porque en el dibujo sus lados se ven diferentes | Incorrecta: P-ASPECTO |
| D | Un triángulo equilátero cuyos lados son menores que una arista completa del cubo | Correcta |

Son variantes nuevas de los patrones de [F08], no los ítems del estudio ni distractores validados allí.

#### Mira

Se corta y se mira la cara nueva de frente. Sus lados son hipotenusas de tres triángulos rectángulos congruentes, formados por medias aristas: resultan iguales. El giro no cambia sus longitudes. Se comparan con una arista usando Pitágoras, no píxeles.

#### La regla

Un plano que atraviesa el interior de un poliedro convexo produce una sección poligonal. Si no contiene caras o aristas completas, sus vértices están en aristas y sus lados sobre caras. Se unen intersecciones de una misma cara, no puntos cercanos en el dibujo. Una tangencia puede producir una cara, segmento o punto: se distingue de un corte interior.

En la predicción, cada lado de la sección es la hipotenusa de un triángulo con catetos \(a/2\) y \(a/2\). Pitágoras da un lado de \(a/\sqrt2\), menor que \(a\). Esta deducción verifica las tres longitudes; que el dibujo parezca equilátero no habría sido una justificación suficiente.

Llamamos \(d_f\), «de sub efe», a una diagonal de cara, y \(d_e\), «de sub e», a una diagonal espacial. En el cubo:

\[
d_f^2=a^2+a^2,\quad d_f=a\sqrt2;\qquad
d_e^2=d_f^2+a^2,\quad d_e=a\sqrt3.
\]

Primero se usa un triángulo de una cara cuadrada; después, esa diagonal y una arista perpendicular a su plano. Cada aplicación de Pitágoras debe señalar su triángulo.

La distancia perpendicular de un vértice del cubo a una diagonal espacial que no lo contiene se designa \(d_{\perp}\), «de perpendicular». Se eligen el vértice y los extremos de esa diagonal: forman un triángulo rectángulo de catetos \(a\) y \(d_f\), e hipotenusa \(d_e\). La misma área calculada con dos bases da \(d_{\perp}d_e=a d_f\). Si el vértice pertenece a la diagonal, la distancia es cero. El dibujo debe precisar cuál diagonal se está usando.

En el tetraedro regular, \(h\), «hache», es la altura a la cara opuesta. Por simetría, su pie está en el centro del equilátero de base. La mediana da una distancia \(a/\sqrt3\) del centro a un vértice. Por Pitágoras, \(h^2=a^2-(a/\sqrt3)^2\), de donde \(h=a\sqrt{2/3}\). Una arista inclinada no reemplaza esta altura perpendicular.

En el octaedro regular, cuatro vértices forman un cuadrado central de lado \(a\). Desde su centro a una esquina hay media diagonal del cuadrado. Pitágoras con una arista hasta una punta permite obtener media diagonal espacial; al duplicarla resulta \(d_e=a\sqrt2\). No corresponde la expresión del cubo.

El diedro mide la abertura entre caras de arista común. Su medida interior \(\delta\), «delta», se obtiene en una sección perpendicular a esa arista, entre las semirrectas de ambas caras y hacia el interior del sólido. Segmentos arbitrarios de las caras no lo miden. El ángulo entre normales exteriores puede ser su suplemento; se precisa cuál se pide.

Para un tetraedro regular se toma el punto medio de una arista y se lo une con los dos vértices opuestos a ella. Los dos segmentos miden \(a\sqrt3/2\), son perpendiculares a la arista común y forman el diedro interior. El lado que une los otros extremos mide \(a\). La ley de cosenos aplicada a ese triángulo da:

\[
\cos\delta=
\frac{(a\sqrt3/2)^2+(a\sqrt3/2)^2-a^2}
{2(a\sqrt3/2)(a\sqrt3/2)}=\frac13.
\]

«Cos» se lee coseno; la ficha entrega la ley utilizada. El ángulo plano de sesenta grados de una cara no es el diedro. Se puede pedir el coseno exacto sin aproximar el ángulo decimalmente.

#### Palabras nuevas

| Palabra | Explicación de todos los días | Tres ejemplos |
|---|---|---|
| Sección | La región que aparece donde el plano atraviesa el objeto | Corte horizontal del jabón; corte de una esquina del cubo; corte central de un octaedro |
| Proyección | La imagen que resulta al representar algo desde una dirección | Vista superior de una caja; vista frontal del bloque; dibujo en perspectiva de una cara cuadrada |
| Altura | Distancia medida perpendicularmente desde un punto al plano elegido | Altura del cubo sobre su base; del tetraedro a la cara opuesta; de una punta del octaedro al cuadrado central |
| Diedro | Abertura entre dos caras, medida mirando en la dirección de su borde común | Dos caras vecinas del cubo; dos del tetraedro; dos del octaedro |

#### Así se resuelve

**Caso original:** un cubo tiene arista \(a\). Se pide expresar la distancia de una esquina a una diagonal espacial que no la contiene.

1. La esquina y los extremos de esa diagonal forman un triángulo rectángulo de catetos \(a\) y \(d_f\), e hipotenusa \(d_e\).
2. Pitágoras da \(d_f=a\sqrt2\) y \(d_e=a\sqrt3\).
3. Se traza la perpendicular pedida y se igualan dos expresiones del área: \(a d_f/2=d_e d_{\perp}/2\).
4. Se despeja \(d_{\perp}=a d_f/d_e=a\sqrt{2/3}\). Es una longitud, obtenida de la geometría, no de medir la imagen.

#### Ahora tú

- Construir una sección siguiendo las caras que atraviesa.
- Elegir entre arista, diagonal de cara y diagonal espacial con fórmulas disponibles.
- Hallar altura o diagonal de un regular mediante un triángulo auxiliar.
- Calcular distancia perpendicular a una diagonal usando dos expresiones del área.
- Identificar el ángulo rectilíneo de un diedro y aplicar la ley de cosenos suministrada.
- Combinar puntos medios, cortes y diagonales al nivel de admisión. Las preguntas de volumen se reservan hasta terminar la idea 6.

### Idea 6. Cubrir, llenar y ampliar

**Pregunta que responde:** ¿cómo cambian la superficie y el espacio ocupado cuando cambia el tamaño?

**Aprendizaje:** el alumno distingue área de volumen, justifica las fórmulas principales y selecciona relaciones según la magnitud pedida.

**Objeto de la primera pantalla:** caja cúbica para bloques de madera y cuadrados de papel para cubrirla. Se distinguen físicamente cubrir y llenar. Se usa un interior cúbico ideal de pared sin espesor, no una capacidad comercial certificada.

#### Lee

1. Recubrir una caja y llenarla son encargos distintos. El papel se coloca sobre las caras; los bloques ocupan el interior.
2. El área se expresa en cuadrados de una unidad de lado. El volumen se expresa en cubos de una unidad de arista.
3. Para comparar tamaños necesitamos saber qué longitud se cambió y cuáles se conservaron. «Más grande» no dice por sí solo cuánto material ni cuánto espacio hay.

#### Juega

Misión: **«Recubre las seis caras y llena el interior sin huecos ni piezas repetidas»**. La caja tiene tamaño fijo compatible con las unidades. Se mueven cuadrados, bloques o capas y se retira una pared para revisar el interior. Se comprueban cobertura y ocupación por separado. No se cambia aún la arista.

#### Predice

Otra caja cúbica tendrá arista doble, con iguales unidades de papel y cubitos. No se recubre ni llena todavía. **«¿Cómo se comparan su área y su volumen con los de la primera?»**

| Opción | Respuesta | Valor y error asociado |
|---|---|---|
| A | El área es cuatro veces mayor y el volumen es ocho veces mayor | Correcta |
| B | Tanto el área como el volumen son el doble | Incorrecta: P-LIN |
| C | Tanto el área como el volumen son cuatro veces mayores | Incorrecta: P-SUPVOL |
| D | El área es ocho veces mayor y el volumen es cuatro veces mayor | Incorrecta: P-DIM |

#### Mira

La cara ampliada contiene dos filas y dos columnas del tamaño de la cara anterior. El interior contiene dos capas, cada una con dos filas y dos columnas de bloques del tamaño del cubo anterior. Se separan las capas y recién entonces aparecen los factores cuatro y ocho.

#### La regla

\(S\) mide la superficie exterior; el volumen \(V\), «uve», mide espacio ocupado. Centímetros cuadrados y centímetros cúbicos cuentan unidades distintas. Convertir unidades exige convertir dos o tres dimensiones. En el cubo, seis cuadrados justifican \(S=6a^2\); filas, columnas y capas justifican \(V=a^3\).

En sólidos semejantes, \(\lambda\), «lambda», es el factor positivo común de las longitudes. El área cambia por \(\lambda^2\), por sus dos direcciones; el volumen, por \(\lambda^3\), por sus tres direcciones. Si se estira solo una dimensión, no se aplica esa comparación global. Se conservan las unidades de comparación.

Para justificar otros volúmenes se introduce aquí la pirámide: una base poligonal y una punta fuera de su plano, unida con sus vértices. Su altura \(h\) es perpendicular a la base; \(S_{\text{base}}\), «ese sub base», es el área de esta. Se justifica \(V=S_{\text{base}}h/3\) así:

1. Un cubo se divide en tres pirámides congruentes: comparten una esquina como punta y tienen por bases las tres caras que no la contienen. Cubren todo el interior sin superposición.
2. Cada una tiene base \(a^2\), altura \(a\) y volumen \(a^3/3\).
3. Ajustar horizontalmente la base y verticalmente la altura multiplica el volumen por el factor de área y el de altura.
4. Pirámides de igual área de base y altura tienen secciones paralelas de igual área a cada nivel, por semejanza. El principio de Cavalieri garantiza igual volumen; comparar capas cada vez más finas explica su sentido. Así se extiende la relación a otras bases. Una sola sección coincidente no basta. [F18]

El tetraedro regular es una pirámide de base equilátera. El área de esa base se obtiene trazando su altura: \(S_{\text{base}}=\sqrt3 a^2/4\). Con la altura espacial deducida en la idea 5 y la relación anterior se obtiene su volumen. El octaedro regular se divide por el cuadrado central en dos pirámides iguales; cada altura es la mitad de su diagonal espacial. Se suman sus volúmenes.

| Sólido regular de arista \(a\) | Área total \(S\) | Volumen \(V\) | Procedencia de la relación |
|---|---|---|---|
| Cubo | \(6a^2\) | \(a^3\) | Seis cuadrados; filas, columnas y capas |
| Tetraedro | \(\sqrt3 a^2\) | \(\sqrt2 a^3/12\) | Cuatro equiláteros; una pirámide con altura calculada |
| Octaedro | \(2\sqrt3 a^2\) | \(\sqrt2 a^3/3\) | Ocho equiláteros; dos pirámides sobre el cuadrado central |

También se puede unir el centro de un regular con todas sus caras y descomponerlo en pirámides. Si \(r\), «erre minúscula», es la distancia perpendicular común del centro a cada cara, las piezas tienen altura \(r\), sus bases suman \(S\) y por ello \(V=Sr/3\). Es una distancia a las caras, no a los vértices. La fórmula sirve para los cinco regulares, siempre que se conozcan las magnitudes que necesita.

Para dodecaedro e icosaedro se entregan área de cara y \(r\), o datos suficientes para hallarlos. Se multiplica aquella por doce o veinte y se usa \(V=Sr/3\); no se memorizan radicales largos. En un envase ideal sin espesor, \(V\) es espacio encerrado, no material de la pared.

#### Palabras nuevas

| Palabra | Explicación de todos los días | Tres ejemplos |
|---|---|---|
| Volumen | Cuánto espacio ocupa o encierra el modelo | Interior ideal de la caja; espacio ocupado por un bloque; suma del espacio de dos piezas sin superposición |
| Escala | Regla que cambia todas las longitudes por el mismo factor | Maqueta a la mitad; cubo con arista doble; adorno con todas las longitudes triplicadas |
| Pirámide | Una pieza con base plana cuyos costados llegan a una sola punta | El tetraedro; una mitad del octaedro; una pieza que une el centro del cubo con una cara |
| Descomponer | Separar mentalmente o físicamente sin perder ni repetir partes | Cubo en capas; octaedro en dos pirámides; regular en pirámides desde su centro |

#### Así se resuelve

**Caso original:** se conoce el área exterior \(S\) de una caja cúbica ideal. Se pide expresar su volumen en función de ese dato.

1. \(S\) corresponde a las seis caras, no a una sola ni al perímetro del desarrollo.
2. Se elige \(S=6a^2\) y se despeja la longitud positiva \(a=\sqrt{S/6}\).
3. Se utiliza \(V=a^3\): el resultado es \(V=[\sqrt{S/6}]^3\).
4. La raíz del área produce longitud; elevarla al cubo produce volumen. La comprobación distingue cubrir de llenar.

#### Ahora tú

- Elegir área o volumen según se pida cubrir o llenar, con las fórmulas disponibles.
- Hallar \(S\) y \(V\) de cubo, tetraedro u octaedro y justificar su descomposición.
- Recuperar arista desde área, diagonal o altura y obtener otra magnitud.
- Comparar escalas y recuperar el factor desde razones de áreas o volúmenes.
- Usar \(V=Sr/3\) distinguiendo distancia a cara de distancia a vértice.
- Resolver un problema de admisión que dé distancia a una diagonal del cubo y pida volumen, o combine corte definido y medida; elegir primero la figura auxiliar.

## 6. Tabla de letras y símbolos de la unidad

Se separan conteos y medidas. Los subíndices precisan la magnitud; se unifican unidades antes de sustituir. mm significa milímetro, cm centímetro y m metro; sus cuadrados y cubos indican área y volumen.

| Letra o símbolo | Significado y lectura | Unidad |
|---|---|---|
| \(n_c\) | Número de caras; «n sub c» | Conteo sin unidad física |
| \(n_a\) | Número de aristas; «n sub a» | Conteo |
| \(n_v\) | Número de vértices; «n sub v» | Conteo |
| \(n_d\) | Número de diagonales espaciales; «n sub d» | Conteo |
| \(p_i\), \(p\) | Lados de la cara indicada; \(p\) cuando todas tienen igual cantidad | Conteo |
| \(q\) | Aristas concurrentes en cada vértice cuando esa cantidad es constante | Conteo |
| \(i\) | Índice que identifica una cara en una suma | Sin unidad |
| \(a\) | Longitud común de las aristas del regular considerado | mm, cm o m |
| \(d_f\) | Longitud de la diagonal de cara indicada | mm, cm o m |
| \(d_e\) | Longitud de la diagonal espacial indicada | mm, cm o m |
| \(d_{\perp}\) | Distancia perpendicular de un punto a la recta indicada | mm, cm o m |
| \(h\) | Altura perpendicular al plano elegido como base | mm, cm o m |
| \(r\) | Distancia perpendicular del centro del regular a sus caras | mm, cm o m |
| \(S\), \(S_i\), \(S_{\text{base}}\) | Área total exterior; área de una cara; área de la base indicada | mm², cm² o m² |
| \(V\) | Volumen | mm³, cm³ o m³ |
| \(\beta\) | Ángulo interior de la cara regular; «beta» | Grados |
| \(\delta\) | Ángulo diedro interior indicado; «delta» | Grados |
| \(\Theta\) | Suma de los ángulos interiores de todas las caras; «theta mayúscula» | Grados |
| \(\lambda\) | Factor positivo de semejanza; «lambda» | Sin unidad |
| \(\sum\) | Sumatoria: sumar los términos indicados | La de sus sumandos |
| \(\sqrt{\phantom a}\), \(\cos\) | Raíz cuadrada; coseno del ángulo indicado | Según la expresión; el coseno no tiene unidad |
| \(=\), \(<\), \(\perp\), \(^{\circ}\) | Igual; menor que; perpendicular; grado | Relación o símbolo de unidad angular |

**Choques:** otros textos usan \(V\) para vértices y \(A\) para aristas o área. Aquí \(V\) es volumen, \(S\) área y los conteos llevan \(n\). Se traduce cualquier leyenda distinta antes de operar. \(a\) es longitud; \(n_a\), cantidad. \(r\) mide hasta una cara, no hasta un vértice. Dos sólidos requieren subíndices identificadores, sin cambiar el significado de la magnitud.

## 7. Otras formas de explicarla

| Recurso | Ideas | Aporte y riesgo |
|---|---|---|
| Caja opaca, etiquetas y giro; luego transparencia | 1–2 | Conserva elementos ocultos. Empezar con transparencia puede confundir líneas y aristas. Diseño propio relacionado con [F11]. |
| Varillas sobre el modelo de caras | 2 | Aclara incidencias; el armazón aislado puede ocultar mentalmente las caras o crear falsos vértices en cruces aparentes. |
| Ejemplos y casos que incumplen una condición | 3 | Enfoque de [F10] para revisar definiciones. Un dibujo extraño debe comprobarse como sólido válido antes de clasificarlo. |
| Polígonos rígidos alrededor de una esquina | 3 | Relaciona ángulos y convexidad [F13]. Una esquina posible no demuestra cierre global. |
| Papel plegable | 4 | Construcciones de Short [F14]. Espesor, pestañas y aproximaciones del papel no son propiedades exactas del ideal. |
| Giro con marcas persistentes | 4 | Responde al seguimiento parcial descrito en [F07]. Evitar que el alumno resuelva solo mediante intentos al azar. |
| Corte y triángulo extraído | 5 | Coordina propiedades y representación [F08]. Conservar rótulos y devolver el triángulo al sólido para mantener su significado. |
| Cubitos y descomposición | 6 | Organiza capas [F09] y justifica volúmenes [F18]. Arena o agua dan comprobaciones aproximadas, no pruebas geométricas. |

Se conserva una referencia visible y una alternativa de imágenes por pasos para la animación.

## 8. Datos del mundo, con fuente

| Dato comprobable | Fuente | Uso propuesto y límite |
|---|---|---|
| La moneda peruana de un nuevo sol del diseño de 2012 tiene diámetro de 25,50 mm; su diseño incluye un polígono inscrito de ocho lados | BCRP, Circular 024-2012, publicada en El Peruano el 5 de agosto de 2012, [F15] | Contrastar figura dibujada y forma del objeto. El octágono del diseño no convierte la moneda en un poliedro de ocho caras. No se infiere su espesor |
| El catálogo peruano consultado ofrece leche UHT entera Gloria en caja de 946 mL | Tottus Perú, catálogo consultado el 21 de noviembre de 2026, [F16] | Leer una cantidad de producto y diferenciarla del volumen exterior del envase. La página no proporciona las tres dimensiones geométricas necesarias para calcular este último |
| El balón adidas Telstar de México 1970 se confeccionó con 32 paneles: 12 pentagonales negros y 20 hexagonales blancos | adidas, historia del balón en su página institucional de campaña, [F17] | Construir después un modelo ideal con polígonos planos para practicar incidencias. El balón inflado tiene paneles curvos; no se lo llama poliedro regular ni se aplica directamente una fórmula de área de caras planas |

Bodega, feria y jabón son escenas propuestas. Sus futuras dimensiones serán datos didácticos plausibles, no medidas comerciales sin fuente.

## 9. Dudas y decisiones

**Evidencia de admisión.** La reproducción UNMSM 2012-I necesita autenticación institucional; no se equipara a los originales UNI. Temarios y boletines no demuestran frecuencia. No se confirmó una serie para UNA Puno o UNSAAC.

**Evidencia de errores.** [F11] se leyó parcialmente por restricciones de acceso. Sus explicaciones siguen siendo interpretaciones. Las predicciones son nuevas; varios errores de corte, plegado y escala permanecen como hipótesis.

**Alcance elegido.** Se incluyen estructura, clasificación, dualidad y medidas principales de regulares. La pirámide se introduce como herramienta; su estudio sistemático, con prismas y troncos, corresponde a la etapa 18.

**Decisiones del dueño.** Definir si se añadirán fórmulas de dodecaedro e icosaedro en función de la arista; aquí se dan área de cara y distancia al centro. Elegir modelos físicos opcionales con alternativa digital.

**Control de producción.** Recalcular ejercicios nuevos, comprobar plegados y precisar cortes. No medir píxeles para obtener longitudes exactas. Mantener apoyos y fórmulas incluso en el nivel de admisión.

| Idea | Lo que puede usar al comenzar | Qué se reserva para después de predecir | Errores de las tres opciones incorrectas |
|---|---|---|---|
| 1 | Objetos y figuras planas del prerrequisito | Conteo completo y reglas del sólido | P-OCUL, P-FRENTE, P-CONFUNDE |
| 2 | Elementos y convexidad de 1 | Efecto del corte, Euler e incidencias | P-CORTE, P-SUPER, P-DOB |
| 3 | Conteos de 2 y polígonos regulares del prerrequisito | Criterio completo de regularidad y cinco posibilidades | P-CARAS, P-CONV, P-UNION |
| 4 | Caras y esquinas del cubo de 1–3 | Imposibilidad de la nueva plantilla | P-NUM, P-AREA, P-GIRO |
| 5 | Elementos, diagonales como segmentos y Pitágoras recuperado | Forma y medida del corte inclinado; relaciones métricas | P-PERP, P-DIAG, P-ASPECTO |
| 6 | Áreas de caras de 4 y alturas de 5 | Comparación de escala y reglas de volumen | P-LIN, P-SUPVOL, P-DIM |

La idea 5 no pide volúmenes; la 6 los fundamenta. Cada predicción usa una situación no ejecutada en el juego y tres errores identificados.

## 10. Fuentes

«s. f.» indica fecha de publicación no verificada. Consulta: 21 de noviembre de 2026. Se distinguen originales y reproducciones.

| Código | Autor, año, título y enlace |
| --- | --- |
| F01 | Universidad Nacional de Ingeniería, Oficina Central de Admisión (2018). [Solucionario del examen de admisión 2018-2](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario20182.pdf) |
| F02 | Universidad Nacional de Ingeniería (2019). [Solucionario de admisión UNI 2019-2](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario20192.pdf) |
| F03 | Universidad Nacional Mayor de San Marcos, periodo 2012-I; reproducción externa, fecha de carga no verificada. [Examen de admisión UNMSM 2012-I y solucionario](https://es.scribd.com/document/157145544/Examen-de-Admision-Unmsm-2012-i-Solucionario) |
| F04 | Centro Preuniversitario de la UNI (2023). [Guía y sílabo del ciclo preuniversitario 2023-2](https://www.cepre.uni.edu.pe/assets/archivos/comunicados/Syl_Pre_PS_2023-2.pdf) |
| F05 | UNMSM, Centro Preuniversitario (2024). [Boletín de la semana 13, ciclo 2024-II](https://es.scribd.com/document/819003548/BOLETIN-SEMANA-N-13-CICLO-2024-II) |
| F06 | Universidad Nacional de San Agustín de Arequipa, Dirección Universitaria de Admisión (2022, para proceso 2023). [Temario del proceso de admisión ordinario 2023](https://admision.unsa.edu.pe/wp-content/uploads/2022/09/TEMARIO-PROCESO-ORDINARIO-2023-V0.pdf) |
| F07 | Gutiérrez, Ángel (1996). [Visualization in 3-Dimensional Geometry: In Search of a Framework](https://www.uv.es/angel.gutierrez/archivos1/textospdf/Gut96c.pdf). Proceedings of PME 20, volumen 1, pp. 3–19 |
| F08 | Fujita, Taro; Kondo, Yutaka; Kumakura, Hiroyuki; Kunimune, Susumu; Jones, Keith (2020). [Spatial reasoning skills about 2D representations of 3D geometrical shapes in grades 4 to 9](https://link.springer.com/article/10.1007/s13394-020-00335-w). Mathematics Education Research Journal, 32, 235–255 |
| F09 | Battista, Michael T.; Clements, Douglas H. (1995). [Enumerating Cubes in 3-D Arrays: Students' Strategies and Instructional Progress](https://files.eric.ed.gov/fulltext/ED389553.pdf). PME-NA, reunión 17 |
| F10 | Mántica, Ana María; Freyre, Magali Lucrecia (2019). [Análisis de la relación entre imagen y definición en una situación problemática mediada por GeoGebra a partir de no ejemplos del concepto de poliedro regular](https://funes.uniandes.edu.co/wp-content/uploads/tainacan-items/32454/1151704/Mantica2019Analisis.pdf). Educación Matemática, 31(1), 204–234. DOI: 10.24844/EM3101.08 |
| F11 | Ministerio de Educación del Perú, Unidad de Medición de la Calidad (2001). [Análisis de ítemes de las pruebas CRECER 1998: resultados de lógico-matemática en cuarto grado de primaria](https://repositorio.minedu.gob.pe/handle/20.500.12799/388). Boletín UMC 10 |
| F12 | Beardon, Alan (2011). [Euler's Formula and Topology](https://nrich.maths.org/articles/eulers-formula-and-topology). NRICH, University of Cambridge |
| F13 | NRICH, University of Cambridge (s. f.). [Which Solids Can We Make?](https://nrich.maths.org/problems/which-solids-can-we-make?tab=solutions) |
| F14 | Short, Ian (2011). [Paper Folding – Models of the Platonic Solids](https://nrich.maths.org/articles/paper-folding-models-platonic-solids). NRICH |
| F15 | Banco Central de Reserva del Perú (2012). [Circular 024-2012-BCRP: ponen en circulación la nueva moneda de S/. 1,00](https://busquedas.elperuano.pe/dispositivo/NL/823221-1). El Peruano, 5 de agosto de 2012 |
| F16 | Tottus Perú (s. f.; consulta de 2026). [Leche UHT Gloria](https://www.tottus.com.pe/tottus-pe/seleccion/lecheuht) |
| F17 | adidas (s. f.; consulta de 2026). [The History of World Cup Balls from 1970 to the Present Day, sección Telstar](https://www.adidas.com/us/go/campaign/trionda) |
| F18 | Australian Mathematical Sciences Institute, proyecto TIMES (2011). [Cones, Pyramids and Spheres, módulo 12](https://amsi.org.au/teacher_modules/Cones_Pyramids_and_Spheres.html) |


