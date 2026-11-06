# Rutina de física: reporte

Cada ejecución construye una plantilla de escena de física, completa y revisada, en la rama `rutina/fisica`. La conversación principal la integra (catálogo, diseño, pendientes). Orden de la lista: dinámica, tiro parabólico, estática, choques, fluidos, MAS, electrostática, ondas, termodinámica, magnetismo e inducción.

## 6 nov 2026 · Dinámica (`plantillas/dinamica/`)

**Qué hice.** Plantilla de escena "Fuerzas, plano inclinado y poleas", la primera de la lista.

- `motor.js` (UMD, sin DOM): segunda ley con roce estático que se ajusta hasta μs·N y cinético μk·N. Cubre plano inclinado (con fuerza paralela y velocidad inicial, y qué pasa después de detenerse), piso con tirón en ángulo (y si lo levanta), plano o mesa con polea, Atwood, ascensor, cajas en contacto, empujón que se suelta, resultante de fuerzas y centrípeta. Usa los ángulos de academia (sen 37° = 3/5; también 53°, 16° y 74°); con `exacto: true` usa el seno de verdad. Cada resultado trae `errores`: los números de las ideas erróneas, para armar las opciones.
- `casos.json`: 21 casos (más sus "tambien"), entre ellos las filas de "Casos de prueba propuestos" del informe.
- `motor.test.js`: corre los casos, arma la segunda ley de cada cuerpo por separado con componentes propias (no las del motor) sobre una grilla de entradas, y comprueba lo que enseña la escena: la normal no es el peso, el roce estático crece hasta su máximo, en el plano sin roce a no depende de la masa, la tensión de Atwood queda entre los dos pesos, la tercera ley, el empujón que no se gasta y la balanza que no ve la velocidad. También prueba los errores de entrada y los 9 problemas de papel. Son 45 pruebas.
- `papel.json`: 9 problemas propios, con contexto local: mercado, ascensor en Puno, saco de papa, trineo, baldes, cajas.
- `index.html`:
  - **Paso a paso** (7 pasos), con el saco de 10 kg en la rampa de 37° y μ = 0,5. Tres predicciones que bloquean: cuántas fuerzas actúan (D1, D6, D8), cuánto vale la normal (las opciones del informe) y cuánto vale el roce. Después vienen la segunda ley con la animación, la respuesta y un explorador. En el explorador se arrastra la punta de la rampa (o se usan las flechas del teclado) y se mueven ángulo, masa, μs y μk.
  - **¿Qué pasa si…?** (6): el saco quieto (roce estático 60 y no 64), Atwood (T = 24), la balanza en el ascensor a velocidad constante, las cajas en contacto (D10 y D11), el empujón sobre hielo (D1 y D2) y el tirón en ángulo (N = 70).
  - Cada flecha lleva su agente ("P = 100 N · Tierra"). Antes de predecir, la fuerza desconocida va a trazos y con "?". En el celular, al responder, el lienzo sube y anima unos 380 ms después. La página se desplaza con el dedo, salvo cerca de la punta de la rampa. Hay modo oscuro y movimiento reducido.
- `plantilla.json`: unidad `fisica.dinamica`, versión 0.1.0, estado borrador.

**Pruebas.** `npm test`: 578 pasan y fallan solo las 2 esperadas (`catalogo.test.js` y `app.test.js`), porque la plantilla aún no está en el catálogo.

**Subagentes.**
- *Verificación independiente* (sin leer el motor): recalculó los 21 casos con fracciones exactas desde el diagrama de cuerpo libre, y donde pudo por un segundo camino (bloque por bloque, trabajo y energía). No hubo discrepancias en 106 comprobaciones. Sugirió agregar el límite justo a 37° con μs = 3/4, el ascensor con a < −g, el saco que no se mueve y el empujón que no vence el roce. Los agregué y los volvió a verificar. También sugirió empujar el saco con 120 N y no con 150 N, para que el roce estático no coincida en número con el cinético. Lo cambié en los casos y en el papel.
- *Revisión de contenido* y *prueba en el navegador*: ver abajo.

**Colores** (para `docs/diseno.md`). Variables de dinámica (`plantillas/dinamica/`):

| Variable | Variable CSS | Color | Claro | Oscuro |
| --- | --- | --- | --- | --- |
| Peso P | `--c-P` | azul | #1f5fbf | #7cb0ff |
| Normal N (también la fuerza de contacto entre cajas, que es una normal) | `--c-N` | verde | #4f7a17 | #a3d65e |
| Roce f | `--c-f` | ámbar | #8f5800 | #ffc04d |
| Tensión T | `--c-T` | rojo | #c0364a | #f17384 |
| Fuerza aplicada F | `--c-F` | fucsia | #a10fbf | #cf6bfa |
| Aceleración a | `--c-a` | turquesa | #0f766e | #5ed9c8 |

- La masa, los ángulos y la resultante ΣF van en tinta; ΣF, a trazos.
- Las componentes de una fuerza van en su mismo color, finas y a trazos.
- ΔE00 mínimo: 24,4 en claro y 25,3 en oscuro (el par más cercano es N y a). Todos pasan AA sobre el papel.

**Pedidos para la integración.**
1. Catálogo: en `catalogo/cursos/fisica.json`, unidad `fisica.dinamica`, agregar `"plantillas": ["dinamica"]`. Luego, `npm run catalogo`.
2. `docs/diseno.md`: el párrafo de colores de arriba.
3. `docs/pendientes.md`, en "Plantillas de escena": "Dinámica (`plantillas/dinamica/`, 6 nov 2026): plano inclinado con roce estático que se ajusta, poleas, ascensor, tercera ley y empujón; 21 casos verificados aparte; papel; 3 predicciones y 6 «¿qué pasa si…?» con los datos de Halloun y Hestenes (1985), Bao y otros (2002) y Castillo y otros (2013)".
4. `CLAUDE.md`, en "Historia": una línea parecida. Sube también el conteo de pruebas.

**Pendiente** (para una próxima vuelta de esta plantilla, no para esta ejecución):
- **Dinámica circular.** Está en el motor (`centripeta`), pero no en la escena. Queda para la plantilla de tiro parabólico y circular, segunda en la lista.
- **Clásicos de admisión que faltan en la escena.** Los propuso el verificador: tren de bloques con cuerdas, bloque sobre bloque, polea móvil, péndulo en un vagón que acelera y fuerza horizontal sobre el plano inclinado.
- **Opciones de cálculo sin respaldo.** Las opciones incorrectas de normal, roce, tensión, ascensor y tirón son hipótesis, como dice el informe. Se confirman con los datos del lanzamiento.
