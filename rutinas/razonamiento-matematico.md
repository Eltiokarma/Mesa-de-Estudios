# Rutina de razonamiento matemático: reporte

Sesión paralela a la conversación principal, en la rama `rutina/razonamiento-matematico` (sale de `claude/awesome-wozniak-5etl1n`). Orden de la lista: máximos y mínimos; tablas, gráficos y suficiencia; cortes y pesadas; trazos y perímetros con rutas; arreglos numéricos con transformaciones; traslados con frecuencia de sucesos. Cada plantilla pasa por constructor, verificador independiente (sin leer el motor), revisor de contenido y correcciones del mismo constructor.

## 7 nov 2026 · El cordel que encierra (`plantillas/maximos-minimos/`)

**Qué hice.** Unidad `razonamiento-matematico.maximos-y-minimos`. El peor caso de las certezas no se repite: ya está en `orden-informacion`.

- **`motor.js`** (UMD, `MotorMaximos`, sin DOM): rectángulo de perímetro fijo, producto máximo con a·x + b·y fijo, suma mínima, corral contra la pared, recorrido con reflejo en una orilla (A, P, B y B'), ingreso (precio que sube y clientes que bajan), mapas en rueda y tablero con el menor número de colores por fuerza bruta y revisión de una pintura. Exactos como texto (`40/3`, `5 + 3√5`). Cada respuesta trae `errores`, `coinciden` y `repetidos`.
- **`casos.json`:** 22 casos con «tambien». **`motor.test.js`:** 44 pruebas (barridas finas que no superan el máximo, AP + PB ≥ AB', ángulos iguales con la orilla, ingreso simétrico, colores confirmados por vuelta atrás, errores que no coinciden, todos los valores del menú enteros).
- **`papel.json`:** 10 problemas propios (corral de 36 m, suma 20, el río de 60 m, dos corrales con división, producto 49, el río de Ana, la linterna y el espejo, la combi a S/ 2,50, los almuerzos y el tablero 3 × 3 con esquinas).
- **Paso a paso** (8 pasos, 5 predicciones que bloquean):
  1. cordel de 24 m: el cuadrado 6 × 6 (GE5 parcial; alargado e intermedio, hipótesis); la curva del área solo sale al responder;
  2. suma fija y producto máximo (36 − t²);
  3. contra la pared con 40 m: 10 de fondo y 20 junto a la pared, 200 m² (el «cuadrado» de 40/3 m, la razón invertida y el 10 × 10 del corral libre, hipótesis);
  4. el reflejo en la pared;
  5. el río (3, 5 y 6 m): mínimo 10 m (8, 3 + √61 y 14, hipótesis); antes de responder no se dibuja P ni la lectura AP + PB;
  6. mover P (el rayo que rebota hace el camino más corto);
  7. el menú: S/ 10, 66 menús, −3 por sol → S/ 16, 48 menús, S/ 768 (no cambiar 660, igualar factores 576, la mitad hasta el cero 693; hipótesis);
  8. la plaza con jardín central y 5 alrededor: 4 colores (2, 3 y 6, hipótesis); luego el alumno pinta y se marcan los choques.
- **¿Qué pasa si…?** (5, con bloqueo de pastillas): cordel doble (144 m²; 72 es `GE1-area-proporcional-al-lado`, documentado; 60 es AR6, hipótesis), malla mínima para 36 m² (GE5 parcial), B más lejos del río, las chompas de Juliaca (S/ 30, S/ 1350) y la plaza con 6 jardines (3 colores).

**Pruebas.** `npm test`: 1970, pasan 1968; fallan solo `catalogo.test.js` y `app.test.js` (falta integrar). Playwright a 1366×768 y 390×844, claro y oscuro, con y sin movimiento reducido: sin errores de consola ni desbordes; el lienzo queda visible al responder en el celular; el dedo lejos de las asas desplaza la página.

**Subagentes.**

- **Verificador independiente** (solo la cabecera del motor): 191 campos de los 22 casos con fracciones y raíces, el ingreso como punto medio entre los ceros y los colores por enumeración completa con grafos armados aparte. 188 coincidencias; las 3 diferencias eran de formato (orden de sumandos, `sinPintar` como conteo), no de valor; se aclaró la cabecera. Papel recalculado sin errores. Los dos casos del menú, rehechos tras la revisión, los recalculé yo a mano: coinciden.
- **Revisor de contenido.** Se aplicó todo:
  - grave: la «pileta» volvía defendibles los distractores (no se siembra): ahora es un jardín central y se dice que tocarse en un punto no es ser vecinas;
  - grave: el cordel doble se veía a escala con cuadrícula antes de responder: ahora es un contorno con «?»;
  - el 72 m² pasó de AR7 (sin cifra para áreas) a GE1 documentado;
  - la leyenda «flor 1…4» sugería el 4 antes de responder: oculta;
  - el menú tenía un distractor de S/ 22,50 imposible: datos cambiados para que todo sea entero;
  - rótulos encimados en el río, alto del lienzo según la escala, scroll al «Ver el reflejo» en el celular y retoques de texto (40/3 m, t en vez de d, la frase del rayo de luz).

**Colores** (claro / oscuro):

| Variable | Claro | Oscuro |
| --- | --- | --- |
| x (ancho o fondo) | #1f5fbf | #7cb0ff |
| y (largo) | #a05200 | #f0a04a |
| área S | #466d14 | #a3d65e |
| AP | #c0364a | #f17384 |
| PB y PB' | #0f766e | #5ed9c8 |
| recta AB' | #a10fbf | #cf6bfa |
| precio p | #3328c4 | #9f9bff |
| cantidad q | #7d6a00 | #e3c84a |
| ingreso I | #77032c | #fdb4ce |

- ΔE00 mínimo entre los que salen juntos: 26,2 (el revisor lo confirmó). Pares bajo 20 (AB'–p, x–p, S–q, AP–I, y–q) nunca comparten vista.
- Contraste ≥ 4,54:1 (q sobre el chip claro), AA en fondos, tarjetas y chips.
- Flores del mapa (objetos, no variables, con número escrito): claro #f7d774, #a6d4f2, #f4abc9, #b5e3b0; oscuro #7a5f12, #1f5a80, #7f2f58, #2f6b3a. El borde de choque lleva contorno en tinta.

**Pendiente.**

- No hay predicción de «cantidad mínima de personas»; se eligió el mapa de colores.
- Con el fondo en 8 m queda una franja vacía bajo la pared (espacio para arrastrar hasta 14 m).
- En el paso 6, con P en el pie de A, el rótulo de AP roza la cota de 3 m.

**Pedidos para la integración.**

- Catálogo: agregar `"maximos-minimos"` a `plantillas` de `razonamiento-matematico.maximos-y-minimos` y poner su `investigacion` en `docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md`; `npm run catalogo`; subir `VERSION` en `app/sw.js`. Revisar si el banco de razonamiento matemático necesita rebalanceo (el curso pasa a 7 plantillas).
- `docs/diseno.md`: la tabla de colores de arriba.
- `docs/pendientes.md` (fila ra1): «Hecha `maximos-minimos` (perímetro fijo, pared, reflejo en el río, precio que maximiza el ingreso y colores mínimos de un mapa; 22 casos verificados aparte)».
- `CLAUDE.md`, historia: «Máximos y mínimos (7 nov 2026, rutina de razonamiento matemático): `plantillas/maximos-minimos/` (el cordel que encierra: perímetro fijo y suma fija, corral contra la pared, recorrido mínimo con reflejo, precio que maximiza el ingreso y menor número de colores de un mapa; 22 casos verificados aparte).»

## 7 nov 2026 · La bodega en gráficos (`plantillas/tablas-graficos/`)

**Qué hice.** Unidad `razonamiento-matematico.tablas-graficos-y-suficiencia`. Título neutro (regla nueva del brief: no adelanta el eje truncado).

- **`motor.js`** (UMD, `MotorGraficos`, sin DOM; cabecera hasta la línea 121): barras con eje que no empieza en 0 (razón real contra dibujada), crecimientos absoluto y porcentual, sectores (grados ↔ porcentaje ↔ cantidad), pictograma (área con el doble de alto y ancho), campeonato (partidos de n equipos en una o dos ruedas, empates desde los puntos, tabla desde resultados, revisión y `deducirTabla` que prueba los 3^m resultados) y `suficiencia`, que enumera las soluciones con I, con II y con ambas y da la clave A–E con `porClave` (qué error lleva a cada alternativa).
- **`casos.json`:** 21 casos. **`motor.test.js`:** 41 pruebas (sectores suman 360°, tablas al azar coherentes, puntos = 3·partidos − empates, `deducirTabla` recupera una fila borrada, la clave de suficiencia no cambia al reordenar condiciones y coincide con un conteo aparte, ningún error coincide con la respuesta).
- **`papel.json`:** 10 problemas propios (barras, gaseosas, circular, latas, campeonato de Totoras, Uros, Suris y Kantutas, suficiencia de edades y de una cifra…).
- **Paso a paso** (8 pasos, 6 predicciones que bloquean; todo hipótesis nuestra):
  1. Rosita 50 y El Sol 40 con el eje desde 35: 1,25 veces (3 por las alturas, 2 por lo que sobra, 0,8 invertida);
  2. explorar el inicio del eje;
  3. gaseosas: el tramo de mayor crecimiento porcentual es febrero–marzo, 25 % (el más empinado, la base final, el punto más alto);
  4. sector de 72° con 200 alumnos: 40 (144, 72, 20);
  5. explorar el circular;
  6. campeonato de 4 con 7, 4, 4 y 1 puntos: 2 empates (4, 1, «faltan resultados»);
  7. suficiencia, la edad de Ana: la I sola (C «juntas por si acaso»);
  8. suficiencia, cuadernos y lapiceros: juntas (A «parece bastar», la I deja 1 o 4).
- **¿Qué pasa si…?** (5, con bloqueo): latas del afiche al doble (4 veces el área), talleres 40→50 y 80→90, el 25 % del 40 % en el circular (36°), cinco colegios en dos ruedas (20) y la edad de Luis (cada una por separado).

**Pruebas.** `npm test`: 2410, pasan 2407; fallan solo los 2 del catálogo. Playwright a 1366×768 y 390×844, claro y oscuro, con y sin movimiento reducido: sin errores ni desbordes, lienzo arriba al responder en el celular, el dedo lejos de la manija desplaza la página.

**Subagentes.**

- **Verificador independiente** (solo la cabecera): 167 campos con fracciones, suficiencia con condiciones escritas por él y el dominio enumerado, `deducirTabla` enumerando 729 y 59 049 resultados: 0 discrepancias; papel sin errores de número. Pidió arreglar dos textos del papel (p10: quedarse con el primer valor lleva a A, no a C; p2: el «empate» no salía). Los datos nuevos del paso 7 (edad de 3 a 30) y de p8 los recalculé yo a mano: coinciden.
- **Revisor de contenido** (nada grave). Se aplicó todo:
  - AR3 y AR1 pasan de parcial a hipótesis (el informe pone esos errores concretos en «Lo que no tiene respaldo»);
  - misma forma en las opciones del paso 1 (la correcta era la única que leía el eje), del paso 6 y de los exp. 2 y 3;
  - la lectura «lee el eje» del paso 1 soplaba el error: ahora «Mes: octubre»;
  - explicación del 5 × 5 en el exp. 4 corregida;
  - p8 del papel repetía la tabla del paso 6: datos nuevos;
  - rótulos encimados en los exp. 2 y 4, redacción literal de las cinco alternativas de suficiencia, edad de 3 a 30 años en el paso 7 y retoques.

**Colores** (claro / oscuro):

| Escena | Variable | Claro | Oscuro |
| --- | --- | --- | --- |
| Barras | Rosita | #1f5fbf | #7cb0ff |
| Barras | El Sol | #a05200 | #f0a04a |
| Barras | y₀ (inicio del eje) | #a10fbf | #cf6bfa |
| Líneas | b (base) | #0f766e | #5ed9c8 |
| Líneas | Δ | #7d6a00 | #e3c84a |
| Líneas | Δ% | #c0364a | #f17384 |
| Circular | θ | #3328c4 | #9f9bff |
| Circular | p | #466d14 | #a3d65e |
| Circular | c | #77032c | #fdb4ce |
| Campeonato | Pts | #1c5f3a | #5fe0a8 |
| Campeonato | E | #bf2280 | #fb56b9 |
| Suficiencia | información I | #065e74 | #8fd6ec |
| Suficiencia | información II | #9b1e08 | #f56b3d |

- ΔE00 mínimo dentro de cada escena: 27,1 en claro y 26,2 en oscuro (el revisor lo confirmó). Los pares cercanos (13,6 y 10,8) nunca salen juntos.
- Contraste ≥ 4,54:1 sobre papel, tarjeta y chip.
- Los sectores de deportes van en pastel con su nombre (objetos, no variables).

**Pendiente.** No hay promedio ponderado (AR15); podría entrar como tabla de frecuencias en otra plantilla.

**Pedidos para la integración.**

- Catálogo: `"tablas-graficos"` en `razonamiento-matematico.tablas-graficos-y-suficiencia` (con `investigacion` en el informe de aritmética y razonamiento); `npm run catalogo`; `VERSION` de `app/sw.js`; rebalanceo del banco de RM si hace falta.
- `docs/diseno.md`: la tabla de colores de arriba.
- `docs/pendientes.md` (ra1): «Hecha `tablas-graficos` (barras con eje truncado, crecimiento porcentual, circular, tabla de campeonato y suficiencia de datos; 21 casos verificados aparte)».
- `CLAUDE.md`, historia: «Tablas y gráficos (7 nov 2026, rutina de razonamiento matemático): `plantillas/tablas-graficos/` (la bodega en gráficos: eje que no empieza en cero, variación absoluta contra porcentual, sectores, tabla de un campeonato deducida por el motor y suficiencia de datos con las soluciones enumeradas; 21 casos verificados aparte).»

## 7 nov 2026 · La sierra y la balanza (`plantillas/cortes-pesadas/`)

**Qué hice.** Unidad `razonamiento-matematico.cortes-y-pesadas`. Título neutro (no adelanta «n − 1 cortes» ni «+1 estaca»).

- **`motor.js`** (UMD, `MotorCortes`, sin DOM; cabecera hasta la línea 111): cortes en forma abierta y cerrada (`cortar`, `contarPiezas`, `tiempoCortes`), `cortesApilando` (búsqueda en anchura sobre montones), estacas en línea y en contorno (`estacas`, `compararEstacas`), `sogaDoblada`, balanza (`pesar` por fuerza bruta 3^k, `equilibrio`, `masasMedibles`, `agregarPesa`) y monedas (`simularPesadas` en tercios o mitades, `minimoPesadas` que busca el árbol de decisión más bajo, sin la fórmula). Cada respuesta trae `errores`, `coinciden` y `repetidos`.
- **`casos.json`:** 21 casos. **`motor.test.js`:** 45 pruebas (piezas = cortes + 1 en abierta y = cortes en cerrada con 300 casos al azar, la línea lleva una estaca más que el contorno, soga doblada contra otra simulación, apilar da ⌈log₂ n⌉, con potencias de 3 se mide todo de una sola forma, la estrategia en tres grupos halla la falsa en cada posición para n = 3 a 100 y el mínimo es ⌈log₃ n⌉, errores que no coinciden).
- **`papel.json`:** 10 problemas propios (varilla en la obra, postes en Juliaca, corral de alpacas, collar, eucalipto, soga, papa con 1, 3 y 9 kg, 1, 3, 9 y 27 kg, 81 monedas, varilla apilada).
- **Paso a paso** (8 pasos, 5 predicciones que bloquean y 3 de exploración: marcar cortes tocando, equilibrar la balanza, esconder la falsa; todo hipótesis nuestra):
  1. varilla de 12 m en piezas de 2 m, de una pieza a la vez, 3 min por corte: 15 min (18 cuenta piezas, 21 corta los extremos, 9 dos piezas por corte);
  2. marcar cortes;
  3. avenida y corral de 60 m, uno cada 5 m: 13 postes (e_A) y 12 estacas (e_C), cita con cautela «términos de una progresión sin el +1» del informe (sin dato);
  4. soga de 6 m en 3 capas con 2 cortes: 7 pedazos;
  5. pesas de 1, 3 y 9 kg en los dos platillos: 13 masas (3, 7 con un platillo, 26 contando acomodos);
  6. equilibrar;
  7. 9 monedas con una más liviana: 2 pesadas (3 en mitades, 4 de dos en dos, 7 una por una);
  8. esconder la falsa y ver las pesadas, con el peor caso de cada estrategia.
- **¿Qué pasa si…?** (5, con bloqueo; la correcta en otra posición que en el paso a paso): tronco de 3 trozos en 6 min → 6 trozos en 15 min (12 es `AR7-cortes-proporcionales`, hipótesis), aro de 12 m (18 min), 8 m apilando (3 cortes), se agrega la pesa de 27 kg (hasta 40 kg) y 27 monedas (3 pesadas).

**Pruebas.** `npm test`: 2454, pasan 2452; fallan solo los 2 del catálogo. Playwright a 1366×768 y 390×844, claro y oscuro, con y sin movimiento reducido: sin errores ni desbordes, lienzo a la vista al responder en el celular; no hay arrastre (todo se toca y hay botones para el teclado) y el dedo sobre el lienzo desplaza la página.

**Subagentes.**

- **Verificador independiente** (solo la cabecera): 189 campos de los 21 casos con fracciones, soga pasando cada punto al atado, apilado por búsqueda en anchura propia, pesas enumerando 3^k y pesadas por árboles de decisión sin fórmula: 0 discrepancias; papel sin errores. Las correcciones no tocaron el motor ni los valores.
- **Revisor de contenido** (nada grave). Se aplicó todo:
  - la D del paso 1 (9 min) era defendible apilando, lo que la propia escena enseña después: ahora se dice «una pieza a la vez» (también en papel y experimentos);
  - «e» nombraba postes y estacas: ahora e_A y e_C, con un color nuevo para e_C;
  - el exp. 1 mostraba los 2 cortes antes de responder: ahora se ven los 3 trozos juntos;
  - la pestaña «¿Qué pasa si…?» no se bloquea y sus enunciados soltaban respuestas del paso a paso (15 min, 1 a 13 kg, 2 pesadas): reescritos sin las cifras;
  - el paso 8 con suerte daba 1 pesada en mitades: ahora dice el peor caso de cada estrategia;
  - la correcta de los experimentos repetía la secuencia del paso a paso: reordenada; retoques de texto, leyenda y monedas.

**Colores** (claro / oscuro):

| Variable | Claro | Oscuro |
| --- | --- | --- |
| c cortes | #c0364a | #f17384 |
| n piezas | #1f5fbf | #7cb0ff |
| T tiempo | #466d14 | #a3d65e |
| e_A postes | #0f766e | #5ed9c8 |
| e_C estacas | #6b6b00 | #d4d84a |
| d tramo | #a05200 | #f0a04a |
| L largo o contorno | #a10fbf | #cf6bfa |
| M masa | #3328c4 | #9f9bff |
| k pesadas | #77032c | #fdb4ce |

- ΔE00 mínimo entre los que salen juntos: 25,9 en claro y 26,9 en oscuro (el revisor lo confirmó); en la vista del paso 3 (e_A, e_C, d, L), 26,1 y 27,4. Los pares bajo 20 (L–M, n–M, c–k, e_C–T) nunca comparten vista.
- Contraste ≥ 4,56:1 sobre papel, tarjeta y chip (e_C: 5,3 sobre #fdf7f1 y 10,7 sobre #241c2e).
- Varillas, sogas, pesas, monedas y sacos en tonos neutros con su número escrito.

**Pendiente.** El cubo cortado en cubitos no entró (se eligieron la soga doblada y el apilado). El informe no tiene filas sobre cortes ni pesadas: convendría agregarlas como «sin dato».

**Pedidos para la integración.**

- Catálogo: `"cortes-pesadas"` en `razonamiento-matematico.cortes-y-pesadas` (con `investigacion` en el informe de aritmética y razonamiento); `npm run catalogo`; `VERSION` de `app/sw.js`; rebalanceo del banco de RM si toca.
- `docs/diseno.md`: la tabla de colores de arriba.
- `docs/pendientes.md` (ra1): «Hecha `cortes-pesadas` (cortes en abierta y cerrada, estacas, soga doblada, apilado, balanza de dos platillos con 1, 3, 9 y mínimo de pesadas; 21 casos verificados aparte)».
- `CLAUDE.md`, historia: «Cortes y pesadas (7 nov 2026, rutina de razonamiento matemático): `plantillas/cortes-pesadas/` (la sierra y la balanza: cortes contra piezas en varilla y aro, estacas en línea y contorno, soga doblada, apilar para cortar, pesas en los dos platillos y la moneda falsa en tres grupos con el mínimo buscado por árbol de decisión; 21 casos verificados aparte).»
- `docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md`: si te parece, agregar filas «sin dato» para cortes contra piezas, estacas en cerrada y pesadas en mitades.

## 7 nov 2026 · El lápiz y la hormiga (`plantillas/trazos-rutas/`)

**Qué hice.** Unidades `razonamiento-matematico.trazos-y-perimetros` y `razonamiento-matematico.rutas-y-visualizacion-espacial`. El constructor se cortó a medias por el límite de uso; siguió desde el respaldo.

- **`motor.js`** (UMD, `MotorTrazos`, sin DOM; cabecera hasta la línea 131): figuras como grafos (`motor.figuras`: sobre, ventanas, casita, parque, ventanal, chakana, reja), grados e impares, un solo trazo por vuelta atrás con conteo de trabas, cartero (repetir lo mínimo, por fuerza bruta de emparejamientos), perímetros escalonados por coordenadas (sin entrantes = rectángulo que encierra; un entrante suma 2e), caminos en cuadrícula por recurrencia con cruces cerrados y en el espacio (multinomial), la hormiga en la caja con los tres desarrollos y arcos sobre una recta.
- **`casos.json`:** 21 casos (13 con «tambien»). **`motor.test.js`:** 43 pruebas (la regla de los impares contra la vuelta atrás en 400 figuras al azar, cartero contra un Dijkstra sobre estados, caminos por recurrencia, combinatorio y lista, cerrar un cruce quita hasta·desde, escaleras sin entrantes, la hormiga contra una barrida de las seis parejas de caras, un empate de desarrollos va a `coinciden`, errores que no coinciden).
- **`papel.json`:** 10 problemas propios (figuras de un trazo, ventanas, cartero, escalera, chakana, arcos, calles con obras, la caja).
- **Paso a paso** (8 pasos, 5 predicciones que bloquean):
  1. ¿cuál sale de un solo trazo? la casita (menos líneas, sin cruces, «todas si se empieza bien»; hipótesis);
  2. trazar tocando puntos;
  3. parque de 8 × 6 con diagonales: 54 m (48, 60, 96; hipótesis);
  4. perímetro de la escalera: 28 m (14, 24; 34 es el área, `GE4-area-por-perimetro`, parcial porque el dato del TIMSS es del sentido contrario);
  5. escalera, chakana y entrante (se arrastra el fondo);
  6. calles de 4 × 3 cuadras en Juliaca: 35 (12, 128; 19 son los de pocos giros, `AR18-enumeracion-sin-sistema`, documentado con cifra por confirmar);
  7. llenar los cruces;
  8. la caja de 8 × 4 × 2: 10 cm (2√21 por dentro, 14 por aristas, 2 + 4√5; hipótesis), y después los tres desarrollos.
- **¿Qué pasa si…?** (5, con bloqueo): el ventanal (3 trazos), los lazos sobre 12 m (6π; 2π es GE5 parcial), la calle en obras 3 × 3 (8), el dado de 2 cm (2√5) y la araña en la reja 2 × 2 × 1 (30; 120 es AR17 parcial, 243 = 3⁵).

**Pruebas.** `npm test`: 3172, pasan 3170; fallan solo los 2 del catálogo. `herramientas/pasada-celular.py` sin QUEDA. Playwright a 1366×768 y 390×844, claro y oscuro, con y sin movimiento reducido: sin errores ni desbordes, lienzo visible al responder; el revisor comprobó con toques simulados que tocar los cruces y arrastrar el entrante funcionan y que el dedo desplaza la página lejos del mango.

**Subagentes.**

- **Verificador independiente** (cabecera más la definición de las figuras, porque la cabecera no daba los tramos): un trazo por vuelta atrás propia, cartero por Dijkstra y emparejamientos, caminos por tres métodos, perímetros por coordenadas y celdas, la hormiga en fracciones exactas. Todo coincide salvo el cubo: los tres desarrollos empatan y el error del segundo desarrollo se descartaba sin pasar a `coinciden`; arreglado en el motor y el caso. Papel sin errores. El cambio 32 → 243 del exp. 5 lo comprobé yo (3⁵).
- **Revisor de contenido** (nada grave). Se aplicó todo:
  - AR17 del exp. 5 pasa a parcial: el dato es de elegir grupos, no de ordenar pasos repetidos;
  - el distractor 2⁵ = 32 no lo pensaría nadie en una reja de tres direcciones: ahora 3⁵ = 243;
  - la fracción 5!/(2!·2!·1!) se leía mal (raya corta): CSS de `.frac` arreglado (puede pasar en otras plantillas con el mismo CSS);
  - ecuaciones partidas en los pasos 3 y 6, «llega 1 camino», la letra b con un solo significado (el ancho), rótulos y retroalimentaciones más precisas, la indicación del papel ya no resume la regla del rectángulo.

**Colores** (claro / oscuro):

| Grupo | Variable | Claro | Oscuro |
| --- | --- | --- | --- |
| Figuras | impares i | #a10fbf | #cf6bfa |
| Figuras | trazo t | #1f5fbf | #7cb0ff |
| Figuras | repetido R | #a05200 | #f0a04a |
| Escalera | base b | #0f766e | #5ed9c8 |
| Escalera | alto h | #c0364a | #f17384 |
| Escalera | entrante e | #7d6a00 | #e3c84a |
| Calles y reja | m | #466d14 | #a3d65e |
| Calles y reja | n | #77032c | #fdb4ce |
| Calles y reja | N | #3328c4 | #9f9bff |
| Caja y reja | x | #086a96 | #25caf4 |
| Caja y reja | y | #b3246b | #ff86bd |
| Caja y reja | z | #8f5800 | #ffc04d |
| Caja | ruta d | #255c1f | #5fe06a |
| Arcos | G (grande) | #6a3fc0 | #b49cff |
| Arcos | c (chicos) | #7a4a1e | #d9a877 |

- ΔE00 mínimo entre los que salen juntos: 22,7 en claro y 26,2 en oscuro (el revisor lo confirmó). Los pares bajo 20 nunca comparten vista (listados en el CSS). En oscuro, la X de «obras» (`--warn`) queda a 17,4 del granate de n, que solo sale en el texto.
- Contraste ≥ 4,54:1 en claro y 4,64:1 en oscuro, chips incluidos.

**Pendiente.** Proyecciones de un sólido (tema de la unidad de rutas) no entraron. Revisar si el CSS de `.frac` con la raya corta está en otras plantillas.

**Pedidos para la integración.**

- Catálogo: `"trazos-rutas"` en `razonamiento-matematico.trazos-y-perimetros` y `razonamiento-matematico.rutas-y-visualizacion-espacial` (con `investigacion` en el informe de aritmética y razonamiento); `npm run catalogo`; `VERSION` de `app/sw.js`; rebalanceo del banco de RM si toca.
- `docs/diseno.md`: la tabla de colores de arriba.
- `docs/pendientes.md` (ra1): «Hecha `trazos-rutas` (un solo trazo con Euler, cartero, perímetros escalonados con entrante, caminos en cuadrícula con obras y en el espacio, y la hormiga en la caja; 21 casos verificados aparte)».
- `CLAUDE.md`, historia: «Trazos y rutas (7 nov 2026, rutina de razonamiento matemático): `plantillas/trazos-rutas/` (el lápiz y la hormiga: figuras de un solo trazo con los vértices impares y vuelta atrás, recorrido mínimo repitiendo lo menos, escaleras que se corren y el entrante que suma, caminos por las calles con el cruce cerrado y la hormiga que abre la caja; 21 casos verificados aparte).»
- Posible arreglo común: `.frac > span:first-child{align-self:stretch; text-align:center}` y `.frac > span{white-space:nowrap}` donde haya fracciones con denominador ancho.

## 7 nov 2026 · Fichas, banderas y ruedas (`plantillas/arreglos-giros/`)

**Qué hice.** Unidades `razonamiento-matematico.arreglos-numericos` y `razonamiento-matematico.transformaciones-de-figuras`. Título neutro (no adelanta el centro, el doble conteo de los vértices ni la vuelta de más; «espejos» se quitó porque ponía en guardia ante el error del paso 5).

- **`motor.js`** (UMD, `MotorArreglos`, sin DOM; cabecera hasta la línea 154, con las piezas y sus coordenadas): cuadrados mágicos por fuerza bruta (todas las soluciones, simetrías), números en polígonos (suma por lado, vértices, todas las distribuciones y las distintas bajo giros y reflejos), piezas en cuadrícula (giro, reflejo, normalización y comparación), ruedas (vueltas sobre una recta, alrededor por fuera y por dentro, y alrededor de un marco), vuelcos de polígonos (radios y arcos del punto que se sigue) y área barrida por un segmento que gira. Exactos con π como coeficiente («(4 + 2√3)π/3»).
- **`casos.json`:** 22 casos. **`motor.test.js`:** 45 pruebas (los 8 cuadrados mágicos de 1 a 9 son giros y reflejos de uno; el centro es la constante entre 3; lados · S = total + V en todas las distribuciones; 4 giros y 2 reflejos devuelven la pieza; vueltas de la rueda contra una simulación por puntos de contacto; radios de vuelco como distancia real al pivote; área barrida contra suma de anillos; errores que no coinciden).
- **`papel.json`:** 10 problemas propios (cuadrado del 3 al 11, completar un cuadrado, triángulo máximo, 1 a 9 con cuatro por lado, cuadrado con 1 a 8 donde la cuenta da 11,5 y la respuesta es 12, orientaciones de la L, moneda alrededor de otra de radio triple, bicicleta, vuelco de un cuadrado de 4 m y limpiaparabrisas de 120°).
- **Paso a paso** (8 pasos, 5 predicciones que bloquean; todo hipótesis nuestra):
  1. centro del cuadrado mágico de 1 a 9: 5 (9, 1, «cualquiera»);
  2. armar el cuadrado (arrastre o toque; «que lo arme el motor» recorre los 8);
  3. menor suma común por lado con 1 a 6 en el triángulo: 9 (7 contando vértices una vez, 6, 12);
  4. armar el triángulo;
  5. ¿qué pieza se consigue moviendo la bandera sin darle la vuelta? la girada (dos reflejos y otra forma; cita GE9 parcial como contexto);
  6. girar y voltear la bandera;
  7. moneda alrededor de otra igual: 2 vueltas sobre sí misma (1, 0, 3), con cuatro casos animados después;
  8. cuadrado de 2 m que vuelca 4 veces: (2 + √2)π (8 m, 4π, (3 + √2)π).
- **¿Qué pasa si…?** (5, con bloqueo y la correcta en otras posiciones): centro de 2, 5, …, 26 (14), mayor suma con 1 a 9 y cuatro por lado (23), rueda r = 2 alrededor de un marco de lado 6π (7 vueltas), limpiaparabrisas de 10 a 50 cm y 90° (600π cm²) y triángulo de 3 m que vuelca 3 veces (4π).

**Pruebas.** `npm test`: 3311, pasan 3309; fallan solo los 2 del catálogo. `herramientas/pasada-celular.py` sin QUEDA (ninguna animación corre sin parar; no hace falta `Celular.bucle`). Playwright a 1366×768 y 390×844, claro y oscuro, con y sin movimiento reducido: sin errores ni desbordes, lienzo arriba al responder; toques simulados (CDP) a 390×844: arrastrar fichas y tocar ficha y casilla funcionan, y el dedo fuera de las fichas desplaza la página.

**Subagentes.**

- **Verificador independiente** (solo la cabecera): cuadrados por las 9! permutaciones, polígonos por permutaciones con forma canónica, piezas con normalización propia, ruedas por el recorrido del centro y por ángulo acumulado, vuelcos con coordenadas rotadas y áreas como diferencia de sectores: 0 discrepancias; papel sin errores. Pidió cerrar dos lecturas del papel (vueltas «sobre sí misma» en p7; orientación final en p9). Las correcciones no cambiaron ningún valor del motor.
- **Revisor de contenido** (nada grave de matemática). Se aplicó todo:
  - paso 5: «la misma bandera» dejaba defendible el reflejo (una cartulina volteada sigue siendo la misma): ahora «moviendo la bandera sobre la mesa, sin darle la vuelta»;
  - paso 7: la retroalimentación de la B decía algo falso del borde de la moneda;
  - paso 3 y E2: las opciones decían «con los más chicos/grandes en los vértices» y la pareja delataba la correcta: ahora solo número y cuenta;
  - regla 4: en el vuelco el color del lado pintaba también la diagonal (radios en neutro), y A era área en E4 y vértice en E5 (el área ahora es «área barrida»);
  - título, rótulos cortados a 1366, rótulo «2 m» sobre el suelo, alto del lienzo en el celular, fantasmas de la moneda con movimiento reducido y cita de GE9 más fiel.

**Colores** (claro / oscuro):

| Variable | Claro | Oscuro |
| --- | --- | --- |
| c (centro) | #a10fbf | #cf6bfa |
| K (suma de una línea) | #7a4a1e | #d9a877 |
| S (suma por lado) | #a05200 | #f0a04a |
| V (suma de los vértices) | #0f766e | #5ed9c8 |
| g (girada) | #466d14 | #a3d65e |
| e (espejo) | #b3246b | #ff86bd |
| r (la que rueda) | #3328c4 | #9f9bff |
| R (la fija) | #7d6a00 | #e3c84a |
| d (camino del centro) | #255c1f | #5fe06a |
| n (vueltas) | #77032c | #fdb4ce |
| l (lado) | #086a96 | #25caf4 |
| p (recorrido del punto) | #6a3fc0 | #b49cff |
| a (inicio de la plumilla) | #8f5800 | #ffc04d |
| b (final de la plumilla) | #c0364a | #f17384 |
| área barrida | #1f5fbf | #7cb0ff |

- ΔE00 mínimo entre los que salen juntos: 23,5 en claro y 26,2 en oscuro (ruedas y vuelcos); contra la tinta, 23,0 y 19,5 (el revisor lo midió).
- Contraste ≥ 4,54:1 en claro y 4,64:1 en oscuro, chips incluidos.
- Reusa los tonos de `trazos-rutas`.

**Pendiente.** La unidad de transformaciones queda cubierta en unos 4 de sus 6 temas: faltan semejanza (la tiene `ampliadora` en geometría) y aplicaciones de áreas (áreas sombreadas que se trasladan y compensan, lúnulas, la región que barre un cuadrado que gira sobre un vértice). La traslación solo se nombra.

**Pedidos para la integración.**

- Catálogo: `"arreglos-giros"` en `razonamiento-matematico.arreglos-numericos` y `razonamiento-matematico.transformaciones-de-figuras`; `investigacion`: el informe de aritmética y razonamiento en arreglos y `docs/investigacion/geometria-ideas-erroneas.md` en transformaciones. Sugerencia: enlazar también `ampliadora` en transformaciones para la semejanza. `npm run catalogo`; `VERSION` de `app/sw.js`; rebalanceo del banco de RM si toca.
- `docs/diseno.md`: la tabla de colores de arriba.
- `docs/pendientes.md` (ra1): «Hecha `arreglos-giros` (cuadrado mágico, números en polígonos, giro contra reflejo, ruedas que ruedan y vuelcos con el recorrido de un punto; 22 casos verificados aparte). Falta en transformaciones: áreas sombreadas y región barrida al girar».
- `CLAUDE.md`, historia: «Arreglos y giros (7 nov 2026, rutina de razonamiento matemático): `plantillas/arreglos-giros/` (fichas, banderas y ruedas: el centro del cuadrado mágico, la suma por lado con los vértices contados dos veces, la bandera girada contra la volteada, la moneda que da 2 vueltas alrededor de otra y el vértice que vuelca; 22 casos verificados aparte).»

## 7 nov 2026 · La posta, el paradero y la plaza (`plantillas/traslados-sucesos/`)

**Qué hice.** Unidades `razonamiento-matematico.traslados-y-puntos-cardinales` y `razonamiento-matematico.frecuencia-de-sucesos`. Las campanadas ya están en `relojes-calendarios`: aquí solo un problema de papel («cada k, contando la primera»).

- **`motor.js`** (UMD, `MotorTraslados`, sin DOM; cabecera hasta la línea 125, con las configuraciones de `motor.escena`): tomas de pastillas (con o sin la final, varias por toma), sucesos que coinciden (MCM, próxima hora, veces en un lapso, comprobado recorriendo minutos), turnos con ciclo (día de la semana del n-ésimo descanso, comprobado día a día), monedas en triángulo (el mínimo de jugadas para invertirlo por la mayor superposición, revisión de una jugada), recorridos por cuadras (distancia por Pitágoras y rumbo) y giros de brújula.
- **`casos.json`:** 22 casos. **`motor.test.js`:** 41 pruebas (tomas contra una simulación hora a hora, coincidencias por MCM contra un reloj por combi, descansos contra un calendario, mínimo de jugadas contra BFS completa en 3 y 6 monedas y ⌊N/3⌋ hasta 7 filas, distancia contra coordenadas, cuatro giros devuelven el rumbo, errores que no coinciden).
- **`papel.json`:** 10 problemas propios (pastillas, campanadas cada 15 min, combis, turnos de pescado en el menú, caminatas, brújula y triángulo de 15 monedas).
- **Paso a paso** (8 pasos, 6 predicciones que bloquean):
  1. pastillas cada 6 h durante 48 h, con la del inicio y la del final: 9 (8, 7, 10; hipótesis);
  2. la línea de tiempo;
  3. combis cada 16 y 24 min desde las 6:00: juntas otra vez a las 6:48 (6:08 MCD, `AR13-mcd-en-vez-de-mcm` parcial; 6:40 suma y 12:24 producto, hipótesis);
  4. veces juntas de 6:00 a 10:00 contando las puntas: 6 (5, 4, 31);
  5. décimo descanso, primer descanso un lunes, trabaja 5 y descansa el sexto: sábado (viernes, lunes, miércoles);
  6. triángulo de 10 monedas invertido: 3 jugadas (2, 4, 5), arrastrando con el dedo;
  7. el reto de otro camino (4 jugadas);
  8. caminata 7 N, 4 E, 2 S, 8 E: 13 cuadras (15, 21, 17).
- **¿Qué pasa si…?** (5, con bloqueo): 2 pastillas cada 8 h durante 3 días (20), tres combis 8, 10 y 12 (120 min), el guardia que gira (este), triángulo de 6 monedas (2) y caminar y girar (10 cuadras hacia el sureste, opciones 2 × 2).

**Pruebas.** `npm test`: 3700, pasan 3698; fallan solo los 2 del catálogo. `pasada-celular.py` sin QUEDA. Playwright a 1366×768 y 390×844, claro y oscuro, con y sin movimiento reducido: sin errores ni desbordes, lienzo arriba al responder; con toques CDP, arrastrar las monedas funciona y el dedo lejos de ellas desplaza la página; también con teclado.

**Subagentes.**

- **Verificador independiente** (solo la cabecera): tomas hora a hora, coincidencias minuto a minuto, descansos con calendario, monedas por BFS bidireccional (con 10, 2 jugadas no alcanzan y 3 sí) y barrido de traslaciones, recorridos por coordenadas: todos los valores coinciden; pidió precisar la cabecera (`sinMultiplicar` sin toma final, `faltan = null` con repetidas, desempate). Señaló que «cada 6 días desde un lunes» admitía tres lecturas más; el enunciado de la escena ya decía «trabaja 5 y descansa el sexto; su primer descanso fue un lunes» (lo confirmó el revisor). Los casos rehechos (combis 16 y 24, opciones 2 × 2) los recalculé yo: coinciden.
- **Revisor de contenido** (nada grave). Se aplicó todo:
  - el paso de las combis repetía los buses de `fracciones` (12 y 18 a las 6:00) y el ejemplo del informe: ahora 16 y 24 min, de 6:00 a 10:00;
  - el eje de horas descartaba el producto antes de responder: ahora solo «6:00 →» hasta responder;
  - la cuadrícula del plano delataba el giro (y el ancho): caja simétrica antes de responder;
  - las opciones de «caminar y girar» delataban la correcta por mayoría (10 dos veces, sureste tres): ahora 2 × 2;
  - `AR13-producto` no tiene respaldo en el informe: pasa a `coincidencia-producto`, hipótesis (ojo: `fracciones` arrastra el mismo código como parcial);
  - el reto del paso 7 era imposible: reescrito (4 jugadas); retoques de teclado, leyendas y textos.

**Colores** (claro / oscuro):

| Variable | Claro | Oscuro |
| --- | --- | --- |
| k (cada cuántas horas) | #a05200 | #f0a04a |
| t (duración) | #1f5fbf | #7cb0ff |
| n (tomas) | #a10fbf | #cf6bfa |
| P (pastillas) | #77032c | #fdb4ce |
| a (combi A) | #0f766e | #5ed9c8 |
| b (combi B) | #882107 | #fb6a40 |
| c (combi C) | #1d3372 | #becbef |
| M (salen juntas) | #466d14 | #a3d65e |
| s (veces juntas) | #3328c4 | #9f9bff |
| D (días hasta el n-ésimo descanso) | #6a3fc0 | #b49cff |
| r (resto) | #7a4a1e | #d9a877 |
| m (jugadas) | #255c1f | #5fe06a |
| x (este) | #086a96 | #25caf4 |
| y (norte o sur) | #b3246b | #ff86bd |
| d (distancia) | #8f5800 | #ffc04d |

- ΔE00 mínimo entre los que salen juntos: 23,6 en claro y 25,3 en oscuro (el revisor lo confirmó). M y m quedan a unos 9, pero nunca salen juntos; b queda a unos 16 de `--warn` (el aviso siempre lleva texto) y c a unos 13 de la tinta (solo en un experimento).
- Contraste ≥ 4,63:1 en claro y 4,64:1 en oscuro, chips incluidos.

**Pendiente.** Traslado de números (tema de la unidad) no tiene escena propia; las ranas y sapos no entraron.

**Pedidos para la integración.**

- Catálogo: `"traslados-sucesos"` en `razonamiento-matematico.traslados-y-puntos-cardinales` y `razonamiento-matematico.frecuencia-de-sucesos` (con `investigacion` en el informe de aritmética y razonamiento); `npm run catalogo`; `VERSION` de `app/sw.js`.
- `docs/diseno.md`: la tabla de colores de arriba.
- `docs/pendientes.md` (ra1): «Hecha `traslados-sucesos` (pastillas con el +1, sucesos que coinciden por MCM contando la primera, turnos con ciclo, el triángulo de monedas invertido y caminatas con brújula; 22 casos verificados aparte)».
- `CLAUDE.md`, historia: «Traslados y sucesos (7 nov 2026, rutina de razonamiento matemático): `plantillas/traslados-sucesos/` (la posta, el paradero y la plaza: pastillas cada k horas, combis que vuelven a salir juntas, el día del décimo descanso, el triángulo de monedas que se invierte con el mínimo de jugadas y la caminata por cuadras con brújula; 22 casos verificados aparte).»
- En `plantillas/fracciones/` (línea ~769), `AR13-producto` va como parcial y el informe no lo respalda: debería ser hipótesis.
