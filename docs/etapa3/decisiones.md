# Etapa 3: decisiones (Gerson, mesa de revisión, 17 nov 2026)

Gerson aprobó en la mesa de revisión (`herramientas/revision/`) las propuestas de esta carpeta **con todas las
recomendaciones de su sección 9**. Valen además todas las decisiones generales de `docs/etapa2/decisiones.md`
(«Cambios posteriores»): un color fijo por magnitud en cada unidad, con su prueba; ninguna figura delata la respuesta;
la letra de una alternativa en negrita; glosario con tope de 30 términos y subrayado gris; grado solo informativo;
Predice con `orden: 'fijo'` cuando sus letras se ven en la figura; zonas `data-toque` para tocar en la figura.

## Numeración (`aritmetica.numeracion`) — `propuesta-aritmetica.md`
- Cinco ideas: `agrupar`, `descomposicion`, `cambio-base`, `base-desconocida` (nueva), `conteo-cifras`.
- La base se llama **n**; los numerales se escriben 342₍₆₎ y a̅b̅c̅₍ₙ₎ con raya (agregar `{ raya }` a `nucleo/ecuacion.js`).
- Objetos: el puesto de caramelos de doña Juana (hilo de la unidad), el quipu en la idea 2 solo si aparece una fuente
  (si no, sale) y el talonario de una rifa en la idea 5.
- Colores: cantidad en base 10 violeta, base turquesa, cifras y restos naranja, segunda base verde; sin carmín.
- Fuera: parte fraccionaria en otras bases, operaciones en otras bases y capicúas.
- Práctica nueva `numeracion-bases` por idea; `numeros-sucesiones` separa por unidad; `grifos` y `cubos` pasan a sus
  unidades. Se queda el conteo de cifras. Tema nuevo en el catálogo: «Base desconocida y cifras ocultas».

## Razonamiento deductivo (`razonamiento-matematico.razonamiento-deductivo`) — `propuesta-razonamiento-matematico.md`
- Cinco ideas, en este orden: `doble-entrada` (primera), `dos-atributos` (nueva), `conclusion-necesaria`,
  `si-entonces`, `parentesco`.
- Paleta de deducción: naranja lo primero, turquesa lo segundo, tinta lo que amarra, violeta lo seguro y lo pedido, gris
  lo descartado; sin verde ni carmín.
- Errores con códigos RMP como hipótesis.

## Segmentos y ángulos (`geometria.segmentos-y-angulos`) — `propuesta-geometria.md`
- Seis ideas: `suma-de-segmentos`, `punto-medio` (nueva), `abertura`, `bisectrices`, `paralelas`, `quiebre`.
- Colores por lo que es cada cosa en la figura: el todo en tinta, los tramos naranja y turquesa; el ángulo dado y sus
  iguales en carmín, su compañero en turquesa; en los ejercicios de las ideas 4 a 6, todo ángulo dado en carmín para
  que el color no dé la respuesta.
- Notación m∠AOB; C(x) y S(x) para complemento y suplemento, sin ningún punto C en esas figuras.
- La predicción de la idea 1 deja de usar Pitágoras.

## Álgebra
- Se sigue el plan: la rama de entrada es «Expresiones algebraicas»; Álgebra empieza por
  `algebra.exponentes-y-productos-notables` (propuesta aparte).
- Lógica y conjuntos se rehace **una sola vez, en Aritmética** (`aritmetica.logica-proposicional` y
  `aritmetica.conjuntos`, donde San Marcos la pregunta), reusando `propuesta-algebra.md`; la unidad de Álgebra apunta a
  esas.

## Segunda ronda (mesa, 17 nov, noche)
- **Visto bueno de las tres ideas 1** (Numeración `agrupar`, Razonamiento deductivo `doble-entrada`, Segmentos y ángulos
  `suma-de-segmentos`): se sigue igual con el resto de ideas. Pendiente anotado: en Razonamiento deductivo, las
  alternativas A–E van en línea aparte, no pegadas al enunciado (ejemplo 13).
- **Álgebra, `propuesta-algebra-exponentes.md` aprobada con todas sus recomendaciones**: la unidad se parte en dos, como
  Magnitudes y Vectores: «Exponentes y radicales» (ideas `leyes-exponentes`, `radicales`, `exponente-fraccionario`
  nueva; conserva el id `algebra.exponentes-y-productos-notables`) y «Productos notables» (`cuadrado-suma`,
  `suma-por-diferencia` nueva, `cubo-binomio` nueva, `radicales-dobles`, `racionalizar`; unidad nueva
  `algebra.productos-notables`, con el avance migrado). Colores: a naranja, b turquesa, base y total en tinta, violeta
  al resultado (exponentes) y a las piezas del medio que se olvidan (2ab, 3a²b); sin carmín ni verde junto a naranja.
- **Letras de las alternativas** (toda la app): se quedan A–E como en el examen; donde la figura tiene puntos con
  letras, ningún resuelto nombra una alternativa por su letra.

## Tercera ronda (mesa, 17 nov, noche): Exponentes y radicales
- **Visto bueno de la idea 1** `leyes-exponentes` («El exponente cuenta factores», la hoja que se dobla, pieza
  `alg-objeto`): se sigue igual con `radicales` y `exponente-fraccionario`.
- La pregunta del Resumen pasa a «¿Qué significa un exponente negativo, como el de 2⁻³?» (la de la propuesta descartaba
  dos alternativas de Predice).
- La unidad queda sin historia hasta tener una fuente comprobada (la de Descartes se fue con Productos notables).
- Ningún ejemplo resuelto pide el valor de un exponente negativo: la pestaña Ejemplos se abre antes de Predice.
- La escena `cuadrado-crece` queda compartida entre Exponentes y radicales, Productos notables y Factorización hasta que
  cada unidad tenga la suya.

## Cuarta ronda (mesa, 18 nov)
- **Toda la app:** la pestaña Ejemplos de una idea se abre recién después de su Predice. La Regla puede llevar un dibujo
  propio (opcional), con sus mismas letras. Las escenas que esperan rehacerse van al final de Ejercicios, en «Más mesas
  del tema» (primero la de Numeración).
- **Exponentes y radicales:** se queda el título «La raíz cuadrada es un lado»; **«valor absoluto» vuelve a definirse en
  «Valor absoluto y radicales»** y aquí se marca como «se explica en…»; la práctica vieja `sistemas-ecuaciones` sale de
  la unidad (el repaso usa `exponentes-radicales`).
- **Productos notables:** visto bueno de la idea 1 (`cuadrado-suma`); se sigue con las otras cuatro ideas. **«binomio»
  vuelve a definirse en Binomio de Newton.**
- **Numeración:** el quipu queda fuera hasta comprobar la fuente; la escena vieja va a «Más mesas del tema».
- **Segmentos y ángulos:** la predicción nueva de la idea 1 va; el reloj propio con el ángulo no convexo en el juego; x
  sin «°» (m∠AOB = 3x + 29°, x = 17) en la unidad y su práctica.
- **Razonamiento deductivo:** nombres de columna girados en el cuadro en L; «cada grupo tiene al menos un integrante»
  como dato; la tabla completa de nombres de parentesco en Datos; el contrafáctico se lee como la teoría («si p, q») en
  toda la unidad y su práctica; puntajes y edades pasan a Ordenamiento de información.

## Quinta ronda (mesa, 18 nov, mañana)
- **Productos notables:** visto bueno de las ideas 2 a 5 y de su práctica; la pregunta del Resumen de la idea 3 pasa a
  «¿Qué piezas forman el cubo de una suma?»; las piezas ab² en tinta (violeta solo para 2ab y 3a²b); la figura del
  juego se reajusta de escala al mover a y b; el índice de la raíz cúbica en turquesa; los distractores que juntan dos
  errores se quedan como hipótesis.
- **Segmentos y ángulos:** las marcas de igualdad van siempre sobre una llave que une las puntas de su tramo.
- **Razonamiento deductivo:** en la tabla de 8 casos, r va en tinta (la paleta no tiene tercer color).
- **Molde (todas las unidades):** el dibujo de un ejemplo muestra lo que cada dato marca por sí solo, nunca lo que sale
  de juntarlos (`docs/molde-unidad.md` §3).

## Orden de trabajo
Fase 2 del método: la idea 1 de cada unidad completa, para el visto bueno de Gerson en la mesa, antes del resto.
