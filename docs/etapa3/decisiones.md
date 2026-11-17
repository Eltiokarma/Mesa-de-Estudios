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

## Orden de trabajo
Fase 2 del método: la idea 1 de cada unidad completa, para el visto bueno de Gerson en la mesa, antes del resto.
