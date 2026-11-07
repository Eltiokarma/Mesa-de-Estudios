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
