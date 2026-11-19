# Etapa 7: decisiones (19 nov 2026)

**Gerson delegó el criterio** (19 nov): nada esperó su visto bueno. Cada propuesta termina en «Decisiones tomadas
(Gerson revisa después)» y cada auditoría marca lo «decidido por la sesión». Gerson revisa todo después (ideas,
ejercicios y exámenes) como control de calidad. Valen las decisiones generales de `docs/etapa2/` a `docs/etapa6/`.

Igual que en la Etapa 6: una unidad entera la escribe un solo agente (`docs/metodo/unidad/etapa-delegada.md`, ahora con
las diecisiete lecciones de los auditores de las Etapas 5 y 6), y el cierre lo hacen otros: un auditor que rehace todas
las cuentas por otro camino y corrige, y dos lectores en frío que solo ven capturas (`cierre-delegado.md`,
`lector-delegado.md`). Todos los agentes corrieron en Opus 5.5. Es la unidad siguiente de la rama de entrada de cada
curso.

## Las ocho unidades

| Unidad | Ideas | Práctica | Estado |
| --- | --- | --- | --- |
| razonamiento-verbal.sentido-contextual | 5 | sentido-contextual | calidad 2 |
| quimica.nomenclatura-inorganica | 6 | nomenclatura-practica | calidad 2 |
| fisica.dinamica | 6 | fis-dinamica | calidad 2 |
| algebra.factorizacion | 6 | factorizacion-practica | calidad 2 |
| aritmetica.mcd-y-mcm | 6 | mcd-mcm | calidad 2 |
| trigonometria.triangulos-rectangulos | 5 | trig-resolucion (nueva) | calidad 2 |
| razonamiento-matematico.certezas | 6 | rm-certezas | calidad 2 |
| geometria.circunferencia | 6 | geo-circunferencia (nueva) | calidad 2 |

Informes en `rutinas/auditoria/<unidad>.md` y `rutinas/frio/<unidad>.md`.

## Lo grave que encontraron los auditores (todo corregido, con una prueba que falla con la versión de antes)
- **Nomenclatura:** en «¿Cuál es un peróxido?» el MnO₂ también salía correcto (45 de 400 semillas).
- **Dinámica:** en la idea 6 las cadenas del columpio salían horizontales y la normal del carrito de cabeza apuntaba
  hacia arriba.
- **Factorización:** factorizaciones incompletas como respuesta (4x² − 16x + 16 = (2x − 4)² en 145 de 400) y «a y b son
  los dos términos» en la diferencia de cuadrados.
- **MCD y MCM:** la explicación del distractor del cociente en Euclides era falsa en 73 de 80 casos.
- **Certezas:** «36 asegura 3 en cada mes» (falso); «con buena suerte: 10 pruebas» cuando son 9; casos de «Ahora tú»
  que repetían ejemplos o la predicción.
- **Circunferencia:** en la idea 5, «Así se resuelve» de las semillas impares (200 de 400) decía algo falso (el
  interior «queda entre la mitad del arco chico y la del grande»).
- **Triángulos rectángulos:** ninguna grave; quince medias (figuras «no a escala» que dejaban medir la respuesta,
  igualdades con «=» y redondeo, la altura de los ojos que no se sumaba).

## Decisiones generales de la etapa
- **Avance:** las unidades que conservaron ids con otra Predice van a `REHECHAS_E6` en `nucleo/avance.js` (Nomenclatura,
  Sentido contextual, Factorización, MCD y MCM, Certezas, Triángulos rectángulos y Circunferencia); Dinámica tiene su
  `sinHuella` propio. Quien terminó todas las ideas de antes conserva «Ya la estudié» si la unidad sumó ideas.
- **Prueba de animación:** las ideas y mesas de Nomenclatura son de buscar entre opciones; se excusan como las de Enlace.
- **Prueba del curso:** las formas ya tenían 10 pares; los ítems nuevos van a la reserva (fz-01/02, ari-35/36,
  fis-29/30, qui-22, rm-24/25, tri-14/15, ci-01/02).
- **Escenas que salen de una unidad** por traer temas de después: `trig-angulos-verticales` y `circunferencia-trig` dejan
  Triángulos rectángulos; `fracciones-problemas` deja MCD y MCM; MCD y MCM de polinomios salen de División (Etapa 6).
- **Lecciones nuevas para el método** (`etapa-delegada.md`, puntos 13 a 17): migrar el avance, nada de «[object Object]»,
  preguntas posibles y sin repetir, que la pregunta no delate la correcta, no romper el catálogo.

## Para que Gerson mire primero (decididas por la sesión)
Cada propuesta y cada auditoría tiene su lista completa. Las que más cambian lo que ve el alumno:
1. **MCD y MCM:** seis ideas con dos nuevas (`mismo-resto`, `multiplos-tramo`) y la fracción continua dentro de
   Euclides, con su escalera dibujada. Colores fijos: MCD turquesa, MCM violeta, lo que sobra naranja; las cantidades en
   tinta (no en violeta como en el resto de la rama). La propuesta la marca como la que más conviene mirar.
2. **Factorización:** con coeficientes enteros; los factores primos se cuentan distintos y sin la constante (va como dato
   en cada ejercicio). Entra la idea `identidades`. Las alternativas de «Ahora tú» van en tinta.
3. **Dinámica:** la aceleración y la fuerza neta en tinta (a⃗ punteada al lado del cuerpo), porque el carmín es del peso.
   El plano inclinado va con el rozamiento (idea 3), no con las poleas.
4. **Nomenclatura:** EO en violeta; tarjeta «Convención del examen» nueva (el examen acepta los tres sistemas y usa
   «anhídrido» y -oso/-ico; la IUPAC 2005 ya no los recomienda). Oxácidos y sales solo por la tradicional.
5. **Certezas:** el alumno hace de mala suerte en todos los juegos (elige qué sale); las bolitas llevan la letra de su
   color y van en tinta; el bingo con los números a la vista; la predicción de la idea 3 es de guantes y su «Así se
   resuelve» también.
6. **Triángulos rectángulos:** una sola regla para las ideas 1 y 2 (buscado = conocido · razón); h es siempre la altura
   sobre el suelo; el dibujo de la idea 4 usa el ángulo mayor menos 8°; la combi que mira el cerro sin la altura del
   chofer queda para Gerson.
7. **Sentido contextual:** la idea nueva `sentido-figurado`; la unidad pide Analogías; códigos RVS1 a RVS8 y el formato
   UNI como hipótesis.
8. **Circunferencia:** los arcos en color de dato (naranja el que abarca el ángulo, turquesa el otro), los ángulos en
   carmín; «circunferencia», «radio» y «diámetro» se mudan desde Congruencia; Pitot y Poncelet fuera del glosario (su
   definición sería la respuesta); el teorema de la tangente va en Relaciones métricas.
9. **Dibujos de prueba** nuevos en todas las piezas de la etapa (los rollos, la rifa, el paquete, la cometa, la antena,
   el globo, los guantes, las llaves, el tanque echado, la bandeja, los faroles…): Gerson decide cuáles reemplaza.

## Pendientes que dejó la etapa
- `quim-cadena`: el cloro en el árbol todavía en letra sin serifa (se lee «CI»).
- `nucleo/ecuacion.js`: la flechita de ΣF⃗ y de a⃗ se corre.
- `geo-objeto`: rótulos de Polígonos junto a otro vértice (de la Etapa 6).
- App: el número del circulito de los ejemplos; espacios de más en Predice de verbal; las voces de verbal que hablan de
  «el texto».
- Piezas compartidas de álgebra: la ✗ montada sobre la «y» en `alg-tabla`, el cuadradito suelto en `alg-losetas`.
- MCD y MCM: las tarjetas 05 y 06 piden un dibujo de losetas y de cubo que no existe.
- Validador: `igualdad-falsa` no detecta «= 4,083 m» (lo vio el auditor de Triángulos rectángulos).
