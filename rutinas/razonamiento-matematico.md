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
