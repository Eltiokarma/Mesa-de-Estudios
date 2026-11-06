# Rutina de física: reporte

Cada ejecución construye una plantilla de escena de física, completa y revisada, en la rama `rutina/fisica`. La conversación principal la integra (catálogo, diseño, pendientes). Orden de la lista: dinámica, tiro parabólico, estática, choques, fluidos, MAS, electrostática, ondas, termodinámica, magnetismo e inducción.

## Reglas vigentes para las próximas plantillas

- **Pastillas de «¿Qué pasa si…?» bloqueadas** (decisión de Gerson, 6 nov 2026, recibida de la conversación principal). Se puede ir a un experimento solo si todos los anteriores ya tienen respuesta. Los respondidos se revisitan libremente. Los bloqueados llevan `disabled`, `aria-disabled` y aria-label «Experimento N, bloqueado», igual que los puntos del paso a paso. También se cierran las otras vías de salto, como el hash o el teclado. La pestaña entre modos no se bloquea. En `dinamica/` lo arregla la conversación principal: no tocarla.
- Dinámica ya está integrada en `claude/awesome-wozniak-5etl1n` (catálogo, diseño, pendientes y el pedido del informe). La próxima ejecución sigue con **tiro parabólico (y circular uniforme)**.

## 6 nov 2026 · Dinámica (`plantillas/dinamica/`)

**Qué hice.** Plantilla de escena "Fuerzas, plano inclinado y poleas", la primera de la lista.

- `motor.js` (UMD, sin DOM): segunda ley con roce estático que se ajusta hasta μs·N y cinético μk·N. Cubre plano inclinado (con fuerza paralela y velocidad inicial, y qué pasa después de detenerse), piso con tirón en ángulo (y si lo levanta), plano o mesa con polea, Atwood, ascensor, cajas en contacto, empujón que se suelta, resultante de fuerzas y centrípeta. Usa los ángulos de academia (sen 37° = 3/5; también 53°, 16° y 74°); con `exacto: true` usa el seno de verdad. Cada resultado trae `errores`: los números de las ideas erróneas, para armar las opciones.
- `casos.json`: 21 casos (más sus "tambien"), entre ellos las filas de "Casos de prueba propuestos" del informe.
- `motor.test.js`: corre los casos, arma la segunda ley de cada cuerpo por separado con componentes propias (no las del motor) sobre una grilla de entradas, y comprueba lo que enseña la escena: la normal no es el peso, el roce estático crece hasta su máximo, en el plano sin roce a no depende de la masa, la tensión de Atwood queda entre los dos pesos, la tercera ley, el empujón que no se gasta y la balanza que no ve la velocidad. También prueba los errores de entrada y los 9 problemas de papel. Son 46 pruebas.
- `papel.json`: 10 problemas propios, con contexto local: mercado, ascensor en Puno, saco de papa, caja en el patio, baldes, cajas en contacto, piedra que gira.
- `index.html`:
  - **Paso a paso** (7 pasos), con el saco de 10 kg en la rampa de 37° y μ = 0,5. Tres predicciones que bloquean: cuántas fuerzas actúan (D1, D6, D8), cuánto vale la normal (las opciones del informe) y cuánto vale el roce. Después vienen la segunda ley con la animación, la respuesta y un explorador. En el explorador se arrastra la punta de la rampa (o se usan las flechas del teclado) y se mueven ángulo, masa, μs y μk.
  - **¿Qué pasa si…?** (6): el saco quieto (roce estático 60 y no 64), Atwood (T = 24), la balanza en el ascensor a velocidad constante, las cajas en contacto (D10 y D11), el empujón sobre hielo (D1 y D2) y el tirón en ángulo (N = 70).
  - Cada flecha lleva su agente ("P = 100 N · Tierra"). Antes de predecir, la fuerza desconocida va a trazos y con "?". En el celular, al responder, el lienzo sube y anima unos 380 ms después. La página se desplaza con el dedo, salvo cerca de la punta de la rampa. Hay modo oscuro y movimiento reducido.
- `plantilla.json`: unidad `fisica.dinamica`, versión 0.1.0, estado borrador.

**Pruebas.** `npm test`: 579 pasan (46 de dinámica) y fallan solo las 2 esperadas (`catalogo.test.js` y `app.test.js`), porque la plantilla aún no está en el catálogo.

**Subagentes.**
- *Verificación independiente* (sin leer el motor): recalculó los 21 casos con fracciones exactas desde el diagrama de cuerpo libre, y donde pudo por un segundo camino (bloque por bloque, trabajo y energía). No hubo discrepancias en 106 comprobaciones. Sugirió agregar el límite justo a 37° con μs = 3/4, el ascensor con a < −g, el saco que no se mueve y el empujón que no vence el roce. Los agregué y los volvió a verificar. También sugirió empujar el saco con 120 N y no con 150 N, para que el roce estático no coincida en número con el cinético. Lo cambié en los casos y en el papel.
- *Revisión de contenido* (física, citas, predicciones, letras y colores, español, papel). Recalculó todo y la física numérica salió bien. Encontró lo siguiente, y lo apliqué:
  - Tres cosas graves:
    - la leyenda del lienzo nombraba las tres fuerzas antes de la predicción «¿cuántas fuerzas?»;
    - la opción de 30 N en Atwood se atribuía a una categoría del FCI («gana el más fuerte») que habla de hacia dónde se mueve el sistema, no de la tensión; ahora es hipótesis;
    - la cifra de Bao y otros (60 % a 90 %) se aplicaba a «una caja empuja a otra», donde ellos encontraron respuestas mezcladas; ahora dice «en choques».
  - Además:
    - la fuerza entre cajas, que estaba en verde como N, ahora es C, con color propio;
    - en «el saco quieto» se dibujaba el 60 antes de predecir;
    - la normal ahora nace en la cara apoyada;
    - el «se levanta» del tirón era imposible con 50 N;
    - citas con «citados por Mora y Herrera (2009)» y «creemos que sale de…» donde la idea es nuestra;
    - el 65 % ya no se repite para dos afirmaciones;
    - la opción «0 N porque se mueve» pasó a hipótesis;
    - el paso del roce ahora comprueba que el saco desliza;
    - «chica» → «pequeña»;
    - el roce se rotula fₛ o fₖ.
  - En el papel agregué la velocidad constante (p4) y un problema de dinámica circular (p10). Ahora son 10 problemas.
- *Prueba en el navegador* (Playwright a 1366 × 768 y 390 × 844, con toque, claro y oscuro, con y sin movimiento reducido). Lo que salió bien:
  - no hay errores de consola;
  - las predicciones bloquean «Siguiente»;
  - en el celular, el lienzo sube a la vista y la animación arranca a unos 400 ms;
  - el arrastre funciona con mouse, con toque y con teclado, y el dedo lejos de la punta desplaza la página.

  Lo que arreglé:
  - en el ascensor, el rótulo del peso tapaba lo que marca la balanza (justo la respuesta);
  - la animación del ascensor seguía corriendo con la pestaña cambiada;
  - el foco se perdía al responder (en los dos modos);
  - el aria-live se reescribía en cada cuadro;
  - el rótulo de ΣF quedaba tapado por el de a;
  - en el explorador, las flechas se cortaban a 0° y a 60°, y el saco tapaba el asa;
  - las ecuaciones del explorador salían cortadas;
  - en Atwood con masas extremas, las flechas se salían del lienzo;
  - había rótulos encimados en las cajas y en el tirón;
  - el empujón repetía el tramo empujado antes de mostrar lo que se preguntaba;
  - en ¿Qué pasa si…?, los datos de color eran paradas del tabulador que no hacían nada.

**Colores** (para `docs/diseno.md`). Variables de dinámica (`plantillas/dinamica/`):

| Variable | Variable CSS | Color | Claro | Oscuro |
| --- | --- | --- | --- | --- |
| Peso P | `--c-P` | azul | #1f5fbf | #7cb0ff |
| Normal N | `--c-N` | verde | #4f7a17 | #a3d65e |
| Roce f | `--c-f` | ámbar | #8f5800 | #ffc04d |
| Tensión T | `--c-T` | rojo | #c0364a | #f17384 |
| Fuerza aplicada F | `--c-F` | fucsia | #a10fbf | #cf6bfa |
| Aceleración a | `--c-a` | turquesa | #0f766e | #5ed9c8 |
| Fuerza de contacto entre dos cajas C | `--c-C` | gris | #6b6b6b | #b5b5b5 |

- La masa, los ángulos y la resultante ΣF van en tinta; ΣF, a trazos.
- Las componentes de una fuerza van en su mismo color, finas y a trazos.
- ΔE00 mínimo: 21,5 en claro y 22,4 en oscuro (el par más cercano es C con a o con P; sin C, 24,4 y 25,3). Todos pasan AA sobre el papel.
- El gris de C solo aparece en el experimento de las cajas, donde no hay ΣF en tinta; la velocidad del ascensor va en gris suave (`--muted`) y no es una variable.

**Pedido para el informe** (no es de mi alcance): en `docs/investigacion/dinamica-ideas-erroneas.md`, la tabla de poleas marca la opción de 30 N como «gana el más fuerte (CI1 del FCI), documentado como categoría». Según la revisión, CI1 trata de hacia dónde se mueve el sistema, no del valor de la tensión: conviene pasarla a hipótesis. Además, el 65 % de Halloun y Hestenes aparece para D1 y para D2; hay que confirmar en Mora y Herrera (2009) si son dos datos o el mismo.

**Para que decida Gerson:** en ¿Qué pasa si…?, las pastillas dejan saltar a otro experimento sin responder (como en MRUV); el botón «Siguiente» sí queda bloqueado.

**Pedidos para la integración.**
1. Catálogo: en `catalogo/cursos/fisica.json`, unidad `fisica.dinamica`, agregar `"plantillas": ["dinamica"]`. Luego, `npm run catalogo`.
2. `docs/diseno.md`: el párrafo de colores de arriba.
3. `docs/pendientes.md`, en "Plantillas de escena": "Dinámica (`plantillas/dinamica/`, 6 nov 2026): plano inclinado con roce estático que se ajusta, poleas, ascensor, tercera ley y empujón; 21 casos verificados aparte; 10 problemas de papel; 3 predicciones y 6 «¿qué pasa si…?» con los datos de Halloun y Hestenes (1985), Bao y otros (2002) y Castillo y otros (2013)".
4. `CLAUDE.md`, en "Historia": una línea parecida. Sube también el conteo de pruebas.

**Pendiente** (para una próxima vuelta de esta plantilla, no para esta ejecución):
- **Dinámica circular.** Está en el motor (`centripeta`), pero no en la escena. Queda para la plantilla de tiro parabólico y circular, segunda en la lista.
- **Clásicos de admisión que faltan en la escena.** Los propuso el verificador: tren de bloques con cuerdas, bloque sobre bloque, polea móvil, péndulo en un vagón que acelera y fuerza horizontal sobre el plano inclinado.
- **Opciones de cálculo sin respaldo.** Las opciones incorrectas de normal, roce, tensión, ascensor y tirón son hipótesis, como dice el informe. Se confirman con los datos del lanzamiento.
