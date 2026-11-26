# Propuesta de ideas: Fluidos

26 de noviembre de 2026. Unidad: **fisica.fluidos**. Etapa 12. Archivo de teoría: contenido/teoria/fisica/fluidos.js.

Propuesta previa a la implementación. Los casos numéricos de abajo son testigos de diseño: falta convertirlos en motores, recorrer las semillas, contrastar cada alternativa y comprobar la presentación. No se declaran hechas las pruebas ni las capturas.

## 0. Base, investigación y alcance

Se consultó el main de GitHub el 26 de noviembre: **94f40db7ee81125c144f8bbbe2eca328d757f8ea**. La teoría de Fluidos, la unidad modelo Trabajo y energía y las dos plantillas heredadas del checkout coinciden, por hash Git de sus blobs, con esa base.

La investigación disponible es docs/investigacion/etapa12/breve/fisica.fluidos.md, junto con su LEEME.md. El archivo largo docs/investigacion/etapa12/fisica.fluidos.md no está publicado: estado.md lo marca pendiente. La breve propone cuatro ideas, pero deja fuera el desarrollo cuantitativo de tensión superficial que ya figura en la ficha. Se aprovechan sus condiciones físicas y su distinción entre evidencia e hipótesis; no se adopta su reparto de cuatro ideas.

La unidad actual tiene seis identificadores, sin los quince ejemplos por idea. Se conservan los seis, con títulos nuevos que no anticipen respuestas. Se cubrirán los siete temas del catálogo: densidad y presión; presión hidrostática y atmosférica; manómetro, barómetro y vasos comunicantes; Pascal; Arquímedes; tensión superficial; caudal, continuidad y Bernoulli. Torricelli será una aplicación del último bloque.

Fluidos abre la rama «Fluidos y calor»; no tiene una unidad anterior dentro de esa rama. Se mantiene Trabajo, energía y potencia, con calidad 2, como referencia de tono, soluciones y explicaciones. Oscilaciones recién rehecha no sustituye a ese modelo auditado.

La instrucción actual del usuario manda sobre la receta antigua de Datos: **no se incluyen fórmulas de resolución en Datos**. Sí se dan entradas, condiciones del modelo y equivalencias necesarias. Cada fórmula aparece en Mira, Regla o la solución cuando corresponde usarla.

No se identifica un conflicto crítico con una decisión escrita. El alcance de seis ideas resuelve la omisión de tensión superficial en la breve, sin reducir lo publicado.

## 1. Las ideas en orden

| Orden e identificador | Título propuesto | Frase de aprendizaje | Alcance |
| --- | --- | --- | --- |
| 1. presion-profundidad | Un líquido y una superficie | Distingo masa, densidad, fuerza y presión; calculo la presión con una referencia y una profundidad vertical. | Primero densidad y presión media; después presión hidrostática, absoluta y manométrica. |
| 2. vasos-comunicantes | Leer columnas de líquido | Recorro columnas en reposo para comparar presiones y distinguir un desnivel de un desplazamiento desde el nivel inicial. | Un líquido comunicado, capas inmiscibles, manómetro abierto y barómetro ideal. |
| 3. prensa-hidraulica | Dos pistones conectados | Relaciono presión, fuerza, área y desplazamiento de los pistones sin confundir transmisión de presión con igualdad de fuerzas. | Pascal, áreas, volumen conservado y balance ideal de trabajo a igual altura. |
| 4. empuje | Un bloque dentro del líquido | Calculo el empuje con el volumen desplazado y lo combino con las otras fuerzas para interpretar flotación y una lectura. | Inmersión parcial y completa; equilibrio libre o con suspensión; densidad media. |
| 5. tension-superficial | La fuerza de una película | Identifico la longitud de contacto activa y calculo la fuerza de una superficie líquida, contando sus caras. | Película plana, alambre, una o dos interfaces; extensión breve de capilaridad con contacto ideal. |
| 6. bernoulli | Seguir el líquido que pasa | Distingo caudal, rapidez y presión; aplico continuidad y el balance de energía con sus condiciones. | Caudal, área frente a diámetro, continuidad, Bernoulli horizontal y con desnivel, Torricelli. |

La primera idea conserva su identificador histórico aunque su entrada comience por densidad y presión media. La hidrostática llegará después de establecer esas cantidades; no se dará todo en la primera tarjeta.

El segundo bloque aplica la relación hidrostática a referencias y conexiones nuevas, sin repetir otra idea completa sobre la forma de un vaso. El sexto distingue explícitamente dos preguntas: cuánto fluido pasa y cómo se distribuyen presión, rapidez y altura.

## 2. Primera pantalla y objetos

| Idea | Objeto visible | Lo que se puede leer antes de Predice | Lo que queda reservado |
| --- | --- | --- | --- |
| 1 | Recipiente transparente con una cara plana presionada por un pistón; balanza y volumen rotulado como apoyo de lectura. | Masa, volumen, área de contacto y fuerza normal son cantidades distintas; un sensor informa presión. | Cambiar el área manteniendo la fuerza. |
| 2 | Tubo en U con un solo líquido y una rama conectada a una cámara de gas; nivel inicial marcado. | Las alturas se miden verticalmente desde una referencia común; el sensor puede comparar el gas con el aire exterior. | Dos líquidos de distinta densidad y la diferencia entre sus superficies finales. |
| 3 | Dos pistones prismáticos horizontales conectados por un líquido, con sus centros a igual altura. | El fluido está confinado, los pistones tienen áreas distintas y se pueden aplicar cargas. | Cuánto recorre el otro pistón; el juego previo compara fuerzas. |
| 4 | Bloque prismático sostenido por un mecanismo de suspensión sobre una tina. | Se ve qué parte del bloque entra al líquido y qué volumen desplaza. La lectura de fuerza permanece tapada. | La lectura del dinamómetro y la comparación entre peso y empuje. |
| 5 | Marco con película líquida y una varilla móvil de longitud fija, mostrada con las dos caras identificadas. | Hay una propiedad del líquido, γ, y una longitud de contacto. La fuerza se mide con un sensor. | Cambiar la longitud manteniendo el líquido. |
| 6 | Conducto horizontal de sección uniforme con marcas de volumen que cruzan una sección. | Área, rapidez y volumen por tiempo son medidas distintas. | El estrechamiento; las lecturas de presión se incorporan después de Predice. |

Los glosarios previos definirán términos sin hacer la cuenta reservada ni escribir su dependencia completa. Por ejemplo, «presión» se presentará como la magnitud que caracteriza la acción normal distribuida de un fluido y se mide en pascales; la relación operacional con fuerza y área se desarrolla después de Predice. No se pondrá en su ejemplo una misma fuerza actuando sobre media área.

### Pieza y escala

Se construirá **fis-fluidos-e12**, una pieza propia de esta unidad en nucleo/kit/piezas. Usará T.rotulo, T.flecha, T.linea y las herramientas geométricas existentes. No se creará un renderizador de tipografía ni se modificará fis-vasos. fis-estatica queda disponible para una suspensión, un balance de fuerzas o el marco de una película.

La pieza antigua requiere precaución y no se reutilizará intacta:

- fis-vasos.js:127–129 normaliza los anchos de la prensa por la suma de áreas. Al variar un área cambia el dibujo de la otra, aunque su valor permanezca fijo.
- En 151–153 normaliza las secciones del conducto por el área mayor; en 165 cada piezómetro usa una escala vertical diferente.
- En 146 aparecen A₁ y A₂ sin color. El nuevo contenido utilizará nodos formales en HTML y rótulos simples del kit en SVG.
- En 217–228 el texto alternativo enumera alturas finales y no admite un alt del caso. No se permitirá que revele la altura que se pregunta.

Contrato geométrico previsto:

1. Una escala fija de longitud por escena y entre estados comparables. Las cotas usan el mismo origen y la misma transformación que los objetos.
2. Conductos y pistones prismáticos con una profundidad perpendicular común: el ancho visible puede representar el área de manera lineal. Si se dibuja una sección circular, su diámetro se obtiene de la raíz del área, no del área directamente.
3. Una misma escala de fuerza para todas las flechas de una comparación; lo mismo para rapidez. Una presión es escalar: las flechas muestran fuerzas normales, no una supuesta «dirección de la presión».
4. Los niveles de un tubo en U conservan el volumen. Se distinguirán la superficie inicial, la interfaz, la altura de cada columna y el desnivel entre superficies.
5. Los piezómetros usarán altura geométrica y presión con una referencia común. No se normalizará cada columna a su propio espacio disponible.
6. Cuando la inmersión sea un dato o un estado observable del juego, el bloque mostrará esa fracción geométrica exacta. Si es la incógnita, se usará un esquema independiente de su solución. La suspensión necesaria estará presente.
7. Una incógnita no se dibujará con una cota calculada ni aparecerá en alt. Si se pregunta un estado posterior, la figura previa mostrará el estado inicial.
8. Cifras, control, lectura, dibujo y misión procederán del mismo estado canónico. La animación no introducirá una evolución que el modelo no calcula.

## 3. Misiones de los juegos y predicciones reservadas

Las grillas y testigos siguientes son propuestas que deberán comprobarse por fuerza bruta. Ninguna misión estará cumplida al abrir.

### Idea 1: fuerza y presión antes de profundidad

Juego: pistón de área fija de 20 cm². La fuerza normal toma 20, 40, 60 y 80 N. Misión: obtener 30 kPa de presión media. El testigo es 60 N. La escena permitirá comparar registros, no cambiar el área todavía. La densidad se recupera con una tarjeta de masa y volumen; no se confunde con la presión del sensor.

Predice: una fuerza normal de 90 N actúa sobre 30 cm² y el sensor registra inicialmente 30 kPa. Se conserva la fuerza y el área pasa a 15 cm². Se pregunta la nueva presión media. La lectura inicial es un dato medido del caso; permite anticipar el cambio sin exigir una fórmula aún no presentada.

| Opción prevista | Operación del caso |
| --- | --- |
| 60 kPa, correcta | Convertir el área y dividir 90 N entre 0,0015 m². |
| 30 kPa | Conservar la presión inicial. |
| 15 kPa | Hacer la presión proporcional al área. |
| 120 kPa | Aplicar dos veces el factor de reducción del área. |

Mira separará fuerza, área y presión. Después introducirá la presión superficial como referencia para un líquido en reposo. La ecuación hidrostática se presentará con h vertical; nunca como distancia a la pared ni longitud del tubo.

### Idea 2: columnas y referencias

Juego: manómetro en U, ramas de igual sección, líquido de densidad 1000 kg/m³, g = 10 m/s² como dato del modelo. La sobrepresión de la cámara puede ser 0, 500, 1000 o 1500 Pa. Misión: lograr un desnivel de 10 cm entre las superficies. Testigo: 1000 Pa. Las dos superficies se moverán en sentidos contrarios conservando volumen. Solo hay un líquido.

Predice: ambas ramas de un tubo en U están abiertas al mismo aire. Se añaden 15 cm de un líquido inmiscible de densidad 800 kg/m³ sobre agua de 1000 kg/m³. Se pregunta cuánto más alta queda la superficie del líquido ligero que la superficie del agua.

| Opción prevista | Operación del caso |
| --- | --- |
| 3 cm, correcta | La columna de agua sobre la interfaz mide 12 cm; se resta a los 15 cm. |
| 12 cm | Dar la altura del agua sobre la interfaz. |
| 15 cm | Dar toda la columna del líquido ligero. |
| 0 cm | Exigir niveles iguales aunque las densidades difieran. |

La figura previa muestra el tubo antes de añadir el segundo líquido. Mira presenta las alturas finales. Con secciones iguales y agua inicialmente a 20 cm, la interfaz queda a 14 cm, el agua de la otra rama a 26 cm y la superficie ligera a 29 cm. Los 12 cm son un desnivel del agua entre ramas, no un ascenso de 12 cm: desde el nivel inicial, el agua de la otra rama sube 6 cm.

El barómetro se tratará después con presión superior despreciable declarada. No se pondrán presiones exactas de Lima, Arequipa o Juliaca sin medición y condiciones.

### Idea 3: fuerza y volumen en una prensa

Juego: dos pistones horizontales de áreas 10 y 40 cm², centros a igual altura. La fuerza de entrada toma 10, 20, 30 y 40 N. Misión: sostener una resistencia de salida de 120 N. Testigo: 30 N. Se muestran fuerzas y áreas; el recorrido todavía no se compara.

Predice: en otro dispositivo, el área grande es tres veces la pequeña. Para que el pistón grande avance 2 cm, se pregunta cuánto avanza el pequeño.

| Opción prevista | Operación del caso |
| --- | --- |
| 6 cm, correcta | Igualar los dos volúmenes desplazados. |
| 2 cm | Igualar recorridos en lugar de volúmenes. |
| 2/3 cm | Invertir la razón de áreas. |
| 18 cm | Aplicar dos veces la razón de áreas. |

La posición horizontal permite animar los recorridos sin cambiar la altura de los pistones. Se usarán pistones ideales y movimiento cuasiestático: el sensor de salida representa la resistencia que mantiene el balance, no una fuerza adicional omitida.

La igualdad de trabajos solo se afirmará en ese modelo horizontal sin pérdidas. Si un ejercicio usa alturas distintas, se añadirá la diferencia hidrostática y no se afirmará automáticamente que el trabajo de entrada iguala al de salida: también puede cambiar la energía gravitatoria del líquido.

### Idea 4: volumen desplazado y lectura de fuerza

Juego: bloque prismático de 600 cm³ sostenido mediante un mecanismo externo. Se controla la inmersión, con marcas de 100 cm³. Misión: desplazar 400 cm³ de líquido. El testigo tiene dos tercios del bloque sumergidos. El dinamómetro permanece cubierto; no se liberará el bloque ni se mostrará una fuerza de soporte calculada antes de Predice.

La implementación usa un bloque de 10 × 5 × 12 cm dentro de una tina de base 24 × 10 cm. Hay holgura en ambas direcciones horizontales; el nivel sube según el volumen desplazado dividido entre 240 cm². En la mesa libre, un bloque ancho de 20 × 10 × 5 cm cabe en una tina de base 30 × 20 cm. Se distingue la flotación en equilibrio del estado inicial al soltar un cuerpo que se hundirá; no se representa una animación ni un apoyo inexistentes.

Predice: un bloque de 0,8 kg y 500 cm³ está completamente sumergido en el líquido del modelo, de densidad 1000 kg/m³. Un dinamómetro lo sostiene en reposo, sin contacto con el recipiente. Con g = 10 m/s², se pide su lectura.

| Opción prevista | Operación del caso |
| --- | --- |
| 3 N, correcta | Peso de 8 N menos empuje de 5 N. |
| 8 N | Dar el peso sin considerar al líquido. |
| 5 N | Dar el empuje en lugar de la tensión. |
| 13 N | Sumar peso y empuje aunque actúan en sentidos opuestos. |

Mira separará las tres fuerzas. La flotación libre en equilibrio se estudia después. No se afirmará que todo objeto quieto tiene empuje igual a peso: puede haber suspensión, apoyo o un mecanismo que tire hacia abajo. Los casos de tensión negativa se interpretan como incompatibles con una cuerda que tira hacia arriba; no se muestran como una lectura negativa de ese aparato.

El cuerpo no toca ni sella el fondo. Esa condición evita aplicar sin examen el modelo usual de fluido rodeando al cuerpo. En capas, el empuje total se calculará por los volúmenes desplazados en cada líquido.

### Idea 5: una longitud de contacto y dos caras

Juego: película plana con varilla de 6 cm y dos caras. Se elige un coeficiente didáctico γ entre 0,02; 0,03; 0,04 y 0,05 N/m, sin atribuirlo a una sustancia real. Misión: mantener una fuerza de 4,8 mN. Testigo: γ = 0,04 N/m. La longitud de la varilla permanece fija.

Predice: otra película plana tiene dos caras, γ = 0,03 N/m y varilla de 12 cm. Se pide la fuerza necesaria para mantener la varilla quieta; su peso y el rozamiento de las guías se desprecian.

| Opción prevista | Operación del caso |
| --- | --- |
| 7,2 mN, correcta | Dos contribuciones de γ por 0,12 m. |
| 3,6 mN | Contar una sola cara. |
| 14,4 mN | Contar cuatro caras en lugar de dos. |
| 0,72 mN | Convertir centímetros dividiendo entre 1000 en vez de 100. |

El núcleo será fuerza por longitud de contacto activa. Debe distinguirse la longitud de una varilla de la suma de las líneas que tiran de ella; «dos caras» es una condición física, no un factor escondido.

La capilaridad será una extensión final breve: tubo circular, contacto ideal con θ = 0, gravedad uniforme y volumen del menisco despreciable. Se deducirá la altura por balance entre fuerza en la circunferencia y peso de la columna. Radio y diámetro estarán claramente separados. No se añadirán ley de Laplace, burbujas ni viscosidad cuantitativa.

Se descarta la predicción antigua del clip con «empuje» y «tensión superficial» como opciones excluyentes: ambas contribuciones pueden coexistir. Una ilustración cualitativa no basta para asignar una contribución nula.

### Idea 6: caudal primero, energía después

Juego: conducto horizontal de sección uniforme de 4 cm². La rapidez media toma 0,5; 1; 1,5 y 2 m/s. Misión: transportar 0,6 L en un segundo. Testigo: 1,5 m/s. Se ven volúmenes que atraviesan la sección; no hay un estrechamiento ni lectura de presión.

Predice: agua en flujo estacionario atraviesa un conducto sin fugas. El área cambia de 6 a 3 cm² y la rapidez inicial es 2 m/s. Se pide la rapidez en la segunda sección.

| Opción prevista | Operación del caso |
| --- | --- |
| 4 m/s, correcta | Conservar el producto de área y rapidez. |
| 1 m/s | Hacer la rapidez proporcional al área. |
| 2 m/s | Conservar rapidez en lugar de caudal. |
| 8 m/s | Tratar una razón de áreas como si fuera una razón de diámetros. |

Mira contará volúmenes iguales y después incorporará el balance de energía. Continuidad no exige viscosidad nula; Bernoulli sin pérdidas sí necesita su modelo adicional. No se identificará «laminar» con «estacionario» como si fueran sinónimos.

Se incluirá un contraste calculado: al aumentar la rapidez y descender, la presión puede aumentar. Por ejemplo, con ρ = 1000 kg/m³, g = 10 m/s², p inicial de 150 kPa, rapidez de 2 a 4 m/s y descenso de 1 m, el modelo da 154 kPa. En un tramo horizontal con las demás entradas iguales daría 144 kPa. Esto evita convertir «más rápido, menos presión» en una ley sin condiciones.

Torricelli será un caso instantáneo de depósito grande, salida a la atmósfera y rapidez de la superficie despreciable. No se dibujará un nivel constante mientras sale líquido sin una alimentación declarada; tampoco se tratará la rapidez aproximada de superficie nula como una medición real exacta.

## 4. Letras y mapa de colores

Se mantiene la paleta compatible con la unidad de Fluidos: presión turquesa, alturas y medidas geométricas verdes, fuerzas carmín, rapidez naranja y parámetros materiales violetas. Los símbolos, nombres, unidades y formas distinguen las cantidades que comparten un grupo. No se depende solo del color.

| Símbolo | Significado único en la unidad | Unidad | Color |
| --- | --- | --- | --- |
| p | Presión; los subíndices abs, man, atm y 0 identifican referencias | Pa o kPa | Turquesa i |
| F | Fuerza aplicada normal a la cara del pistón o a la superficie indicada | N | Carmín h |
| E | Empuje del fluido; no se usa E para energía | N | Carmín h |
| P | Peso del cuerpo; se distingue de p por letra y unidad | N | Carmín h |
| T | Tensión que lee la suspensión ideal; no es período ni temperatura | N | Carmín h |
| W | Trabajo de una fuerza | J | Naranja o |
| ρ | Densidad; los subíndices distinguen cuerpo y fluidos | kg/m³ | Violeta f |
| m | Masa del cuerpo indicado | kg | Violeta f |
| γ | Coeficiente de tensión superficial | N/m | Violeta f |
| A | Área de la sección o cara indicada | m² | Verde d |
| V | Volumen; V con subíndice s identifica el volumen sumergido | m³ | Verde d |
| h | Profundidad o desnivel vertical especificado entre dos niveles | m | Verde d |
| z | Altura sobre la referencia común de Bernoulli | m | Verde d |
| L | Longitud de contacto indicada en la película | m | Verde d |
| ℓ | Recorrido lineal de un pistón | m | Verde d |
| r, d | Radio y diámetro del tubo circular, respectivamente | m | Verde d |
| v | Rapidez media de paso por una sección; no se usa para volumen | m/s | Naranja o |
| Q | Caudal volumétrico | m³/s o L/s | Naranja o |
| t, Δt | Tiempo o intervalo de tiempo | s | Carmín h |
| g | Módulo de la aceleración de la gravedad | m/s² | Carmín h |
| θ | Ángulo de contacto, medido a través del líquido | rad o grados | Verde d |
| n | Número de caras que aportan una línea de contacto | Sin unidad | Violeta f |

Las longitudes de contacto y los recorridos de pistones tienen símbolos distintos desde el comienzo: L y ℓ, respectivamente. Los subíndices solo distinguen puntos o cuerpos; los factores constantes 1, 2 y π no reciben color de variable.

La tabla cubre toda la unidad, las seis ideas y la práctica. No se reutilizará la clave g del juego antiguo para γ. Los números sustituidos tomarán el color de su magnitud, incluyendo áreas, densidades, masas y coeficientes; colorear solo la letra no basta.

### Notación y presentación

En teoría se usarán los nodos existentes de Ecuacion para subíndices, fracciones, raíces, potencias y vectores cuando correspondan. No se entregarán al alumno cadenas con guion bajo ni sustitutos Unicode fabricados para simular subíndices.

Los rótulos SVG de la pieza propia serán simples: nombres completos o símbolos sin subíndice, y valores con unidades. Una leyenda HTML asociada podrá usar los nodos formales. No se añadirá un nuevo renderizador de texto.

En la práctica se conservará el contrato que acepta strings y P.v: nombres completos como «presión inicial», «volumen sumergido» y «lectura del dinamómetro» cuando los subíndices no sean compatibles. Los estados irán en líneas identificadas. Datos tendrá entradas y condiciones, nunca una receta de cálculo.

Los redondeos llevarán ≈, también en opciones, descartes, lecturas y alt. Una presión absoluta, una diferencia de presión y una presión manométrica no compartirán un rótulo ambiguo de «presión» si el ejercicio exige distinguirlas.

## 5. Glosario y carga de lectura

Se asignarán entre dos y cuatro términos nuevos por idea, con una explicación simple y tres ejemplos. La asignación se comprobará mediante primera aparición y el glosario global; no se duplicarán definiciones heredadas del curso.

| Idea | Candidatos, sujetos a comprobar el catálogo global |
| --- | --- |
| 1 | Presión, densidad, pistón, presión manométrica; la referencia absoluta se explica junto con presión |
| 2 | Manómetro, barómetro, interfaz, vasos comunicantes |
| 3 | Prensa hidráulica, ventaja mecánica, fluido incompresible si no se estrenó antes |
| 4 | Empuje, volumen desplazado, peso aparente |
| 5 | Tensión superficial, línea de contacto, menisco, capilaridad |
| 6 | Caudal, flujo estacionario, línea de corriente, viscosidad |

No se forzarán cuatro términos si ya existen y están bien definidos. «Peso aparente» se explicará como lectura de apoyo o suspensión en el caso especificado, no como otro peso gravitatorio. «Incompresible» no significa inmóvil. El tratamiento de la viscosidad se limita a distinguir el modelo ideal de un flujo con pérdidas.

## 6. Ejemplos y práctica por idea

Cada idea tendrá quince ejemplos: cinco de nivel 1, cinco de nivel 2 y cinco de nivel 3. Los últimos combinarán relaciones, convertirán unidades o reconstruirán un dato; no serán el mismo cálculo con números más grandes. Sus respuestas correctas se repartirán entre las posiciones disponibles de las alternativas.

| Idea | Nivel 1 | Nivel 2 | Nivel 3 |
| --- | --- | --- | --- |
| 1 | Masa/volumen y fuerza/área con unidades compatibles | Conversiones de área y volumen; presión superficial más profundidad | Reconstruir densidad o altura; presión absoluta frente a manométrica; fuerza sobre una cara con presión uniforme |
| 2 | Un líquido y desnivel dado | Dos líquidos; presión de gas; barómetro ideal | Desconocido en columnas por capas; distinguir ascenso individual y diferencia de niveles con conservación de volumen |
| 3 | Razón de fuerzas y áreas | Radio frente a área; desplazamientos por volumen | Dos etapas de pistones, fuerza y recorrido; desnivel declarado sin atribuirle una igualdad de trabajos incorrecta |
| 4 | Empuje con volumen sumergido dado | Tensión, inmersión parcial y fracción flotante | Densidad inferida de dos lecturas; cuerpo en dos líquidos; balance con soporte especificado |
| 5 | Fuerza, longitud activa o coeficiente | Dos caras y conversiones; equilibrio de una varilla | Inferir γ de una película y usar otro montaje; radio capilar con θ = 0 y balance visible |
| 6 | Volumen por tiempo y rapidez media | Continuidad por áreas y diámetros | Continuidad más Bernoulli con altura; presión desconocida; salida ideal de un depósito |

La plantilla nueva prevista es fis-fluidos, con TIPOS_POR_IDEA y familias que permitan una progresión real. Las plantillas heredadas fluidos y fluidos-hidrodinamica pasarán a «Más mesas del tema» con rehacer. Se conservarán sus rutas sin presentarlas como práctica nueva.

Resuelve y Ahora tú tendrán bancos distintos; los cuatro primeros casos de Resuelve no repetirán familias o entradas de los doce primeros de Ahora tú. Los generadores no repetirán los casos de ejemplos, misión o Predice. No se completarán alternativas con múltiplos arbitrarios del resultado: cada error tendrá una operación conceptual identificable, recalculada aparte.

En los despejes de nivel 3 se escribirán la relación inicial, el paso que aísla la incógnita y la sustitución. Si se igualan presiones o se cancelan términos atmosféricos, se dirá por qué son comunes. No se saltará de una ecuación de energía a una raíz sin mostrar la reorganización.

El papel previsto tendrá ocho ejercicios: uno por idea y dos integradores. La unidad llevará una prueba propia. Se propondrán hasta dos pares A/B adicionales para la reserva de Física; los diez activos no se sustituirán por conveniencia.

## 7. Comprobaciones previstas

- Respuestas, opciones y siFuera se calcularán con código determinístico. Un oráculo independiente partirá de las entradas, no del resultado declarado.
- Se recorrerán al menos 400 semillas por generador de teoría y práctica, evaluando datos visibles, afirmaciones, igualdades, signos, unidades y alternativas tras el formato.
- Las misiones se comprobarán en toda su grilla; la animación también se probará entre marcas, con la misma precisión que el control visible.
- La hidrostática se contrastará recorriendo columnas y sumando cambios de presión; el empuje, mediante balance de fuerzas o fluido desplazado; la prensa, con conservación de volumen; el flujo, con balances de masa y energía.
- Las áreas y los volúmenes se comprobarán con la geometría renderizada. Se probarán alturas de interfaz, superficies, inmersión, diámetros, posición del cuerpo y referencias.
- El HTML y SVG reales se revisarán contra subíndices crudos, texto convertido a objeto, símbolos sin color y alt que revele una incógnita.
- Se simulará calidad 2 sin marcarla. Se correrán las pruebas pertinentes durante la escritura y la suite completa al cerrar.
- Las capturas quedan pendientes de un navegador conectado al servidor local. El bloqueo EACCES observado durante Oscilaciones no equivale a una revisión visual de Fluidos.

Son comprobaciones pendientes, no resultados de esta propuesta.

## 8. Fuentes y datos del mundo

Se han abierto las siguientes fuentes primarias o publicaciones originales para contrastar esta propuesta. Los ejemplos numéricos anteriores son de diseño propio; no son ejercicios copiados.

| Fuente | Qué respalda y límite de uso |
| --- | --- |
| [OpenStax, University Physics I, 14.1](https://openstax.org/books/university-physics-volume-1/pages/14-1-fluids-density-and-pressure) | Definiciones de densidad y presión; relación con fuerza normal y equilibrio hidrostático. |
| [OpenStax, 14.2](https://openstax.org/books/university-physics-volume-1/pages/14-2-measuring-pressure) | Referencias absoluta/manométrica, manómetro y barómetro. En el tubo en U distingue alturas desde la interfaz y diferencia de superficies. |
| [OpenStax, 14.3](https://openstax.org/books/university-physics-volume-1/pages/14-3-pascals-principle-and-hydraulics) | Pascal transmite un cambio de presión; no afirma presión total idéntica a diferentes alturas. La igualdad de razones de fuerza/área requiere la condición del montaje. |
| [OpenStax, 14.4](https://openstax.org/books/university-physics-volume-1/pages/14-4-archimedes-principle-and-buoyancy) | Empuje como peso del fluido desplazado y balances de flotación. |
| [OpenStax, 14.5](https://openstax.org/books/university-physics-volume-1/pages/14-5-fluid-dynamics) y [14.6](https://openstax.org/books/university-physics-volume-1/pages/14-6-bernoullis-equation) | Caudal, continuidad y balance ideal de energía. Se conserva el término de altura cuando no es común. |
| [OpenStax, College Physics 2e, 11.8](https://openstax.org/books/college-physics-2e/pages/11-8-cohesion-and-adhesion-in-liquids-surface-tension-and-capillary-action) | La figura 11.26 atribuye dos contribuciones a la película de dos caras. También explica contacto y capilaridad; se tomará solo la extensión delimitada de esta propuesta. |
| [Goszewski, Moyer, Bazan y Wagner, 2012](https://www.per-central.org/document/ServeFile.cfm?DocID=3333&ID=12797) | Investigación original sobre dificultades con presión, profundidad, forma y encierro. Las categorías no validan automáticamente cada distractor numérico nuevo. |
| [Wagner, Carbone y Lindow, 2013](https://www.per-central.org/items/perc/3699.pdf) | Investigación original sobre empuje y volumen desplazado; advierte que una misma elección puede provenir de razonamientos diferentes. No se extrapolan porcentajes a postulantes peruanos. |

La breve citaba una ficha secundaria de Loverude, Kautz y Heron. Se conserva como antecedente por localizar, sin atribuirle porcentajes o resultados que no se hayan leído en el original.

### Admisión y dato real opcional

- [UNI, examen 2021-1 y solucionario oficial](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario2021.pdf), Física 5: se verificó el enunciado de peso aparente de aluminio sumergido y la solución oficial, en las páginas PDF 24 y 48. Prueba presencia de ese tipo de problema en ese examen, no frecuencia general. Una eventual adaptación citará universidad y período, con cálculo y figura propios.
- [UNMSM, reglamento 2023-I](https://medicina.unmsm.edu.pe/wp-content/uploads/2023/02/Reglamento-de-Admision-2023-I.pdf), sección Física 5: incluye fluidos, tensión superficial e hidrodinámica. Es un temario histórico; no se presentará como temario vigente de 2027.
- [FIVB, reglas 2025–2028](https://www.fivb.com/wp-content/uploads/2025/01/FIVB-Volleyball_Rules2025_2028-EN-v05.pdf), regla 3.1: el intervalo publicado de presión interna es 294,3–318,82 hPa. Puede servir para conversión de unidades. Esa línea no explicita por sí sola si el número se interpreta como presión absoluta o manométrica; no se afirmará que el reglamento lo define. Si un ejercicio necesita esa referencia, la declarará como condición didáctica adicional.

No se asignarán presiones exactas a ciudades, densidades exactas a cualquier aceite o madera, ni valores de γ a «agua» o «jabón» sin temperatura y fuente. Los parámetros ideales se rotularán como datos del modelo. g = 10 m/s² será un valor de cálculo, no una medición local.

## 9. Orden y decisiones tomadas (Gerson revisa después)

Se conserva Estática como requisito. Para el balance energético de la idea 6 se propone añadir Trabajo y energía a la ficha: ya comprende Dinámica entre sus antecedentes. No se exige haber estudiado Oscilaciones ni Gravitación. El vocabulario de densidad se recupera en la idea 1; no se presupone que una fórmula conocida se interprete bien.

| Duda | Decisión elegida y motivo | Opción descartada |
| --- | --- | --- |
| 1. ¿Cuatro ideas de la breve o seis? | Conservar los seis identificadores, separar columnas, Pascal y superficie, y cubrir todos los temas publicados. | Dejar tensión superficial como una nota o crear una séptima idea sin necesidad. |
| 2. ¿Reutilizar fis-vasos intacta? | Pieza propia fis-fluidos-e12 con geometría de escala fija y trazos/rotulación existentes; fis-estatica como apoyo. | Normalización por caso, alt que revela niveles o un nuevo renderizador de tipografía. |
| 3. ¿Cómo presentar presión y Datos? | Densidad y presión antes de hidrostática; Datos con valores, equivalencias y condiciones, sin fórmulas de resolución. | Una tarjeta inicial con todas las ecuaciones o un glosario que resuelva Predice. |
| 4. ¿Cómo mover una prensa sin cambiar el modelo? | Pistones horizontales a igual altura para el juego y los recorridos. Los casos con desnivel incluyen su corrección y sus límites energéticos. | Animar pistones verticales y seguir afirmando igualdad de presión a alturas que ya cambiaron. |
| 5. ¿Hasta dónde llevar superficie e hidrodinámica? | Fuerza por longitud activa, película de dos caras y capilaridad breve con θ = 0; continuidad y Bernoulli se distinguen, con Torricelli como aplicación. | Clip con fuerzas falsamente excluyentes, Laplace, burbujas, Poiseuille o «más rápido, menos presión» sin condiciones. |
| 6. ¿Qué valor dar a fuentes y datos reales? | Fuentes primarias abiertas, categorías de errores con su alcance y operaciones nuevas como hipótesis; modelos didácticos declarados. | Frecuencias de admisión no contadas, porcentajes extranjeros trasladados al Perú o datos de ciudades inventados. |

La geometría de la pieza debe validar primero las seis escenas antes de multiplicar los ejemplos. Esta comprobación técnica no permite reducir contenidos ni saltarse los oráculos.

