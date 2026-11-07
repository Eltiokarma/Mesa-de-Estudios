# Rutina de física: reporte

Cada ejecución construye una plantilla de escena de física, completa y revisada, en la rama `rutina/fisica`. La conversación principal la integra (catálogo, diseño, pendientes). Orden de la lista: dinámica, tiro parabólico, estática, choques, fluidos, MAS, electrostática, ondas, termodinámica, magnetismo e inducción.

## Reglas vigentes para las próximas plantillas

- **Pastillas de «¿Qué pasa si…?» bloqueadas** (decisión de Gerson, 6 nov 2026, recibida de la conversación principal). Se puede ir a un experimento solo si todos los anteriores ya tienen respuesta. Los respondidos se revisitan libremente. Los bloqueados llevan `disabled`, `aria-disabled` y aria-label «Experimento N, bloqueado», igual que los puntos del paso a paso. También se cierran las otras vías de salto, como el hash o el teclado. La pestaña entre modos no se bloquea. En `dinamica/` lo arregla la conversación principal: no tocarla.
- Dinámica ya está integrada en `claude/awesome-wozniak-5etl1n` (catálogo, diseño, pendientes y el pedido del informe). Tiro parabólico (6 nov) y estática (7 nov) quedaron hechos (abajo). La próxima ejecución sigue con **choques (impulso y cantidad de movimiento)**.
- Los avisos de «terminado» van a la conversación principal nueva: `session_01P39d2yUDZET7Wso3ubSiiV` (desde el 7 nov; la anterior era `session_01P39d2yLWTLWLv3TGZ6FkHB`). Ella integra estática.
- Desde el 7 nov la rutina sigue el método de `docs/metodo/`: constructor, verificador independiente con `entradas.py`, revisor y correcciones al mismo constructor. Lecciones nuevas de ese brief: al menos 4 predicciones en el paso a paso, opciones con la misma forma, ningún distractor que coincida con la respuesta, nombres de experimentos sin la respuesta y dibujo fijo y compacto arriba en el celular mientras hay predicción pendiente.

## 7 nov 2026 · Estática: equilibrio y torque (`plantillas/estatica/`)

La pidió la conversación principal, a pedido de Gerson, porque el disparo del día anterior no llegó. Antes de empezar traje la rama principal y revisé que ninguna rama tuviera algo de estática: nadie lo estaba tocando.

**Cómo se hizo.** Con el método de `docs/metodo/`:
- un subagente constructor con `brief-plantilla.md` y el encargo concreto;
- un verificador independiente con `brief-verificador.md`, que trabajó sobre las entradas sin respuestas armadas con `entradas.py`;
- un revisor con `brief-revisor.md`;
- las correcciones, que volvieron al mismo constructor. Al final hice dos retoques yo.

**Qué hay.**
- `motor.js` (MotorEstatica, UMD):
  - la barra con peso propio, homogénea o por tramos, con uno o dos apoyos o cuerdas y una carga desconocida; los momentos respecto a cualquier punto; si se vuelca;
  - el momento de una fuerza inclinada, con su brazo y su pie;
  - el centro de gravedad de masas puntuales y de figuras compuestas (con el hueco que se resta);
  - el bate cortado en su punto de equilibrio, por tramos o cónico;
  - el nudo con dos cuerdas, por componentes y por Lamy;
  - la polea fija, el roce estático en el piso y en la rampa, y el par de fuerzas.

  Usa los ángulos de academia, también sus suplementos (143° y otros). Cada resultado trae `errores`.
- `casos.json`: 21 casos y 42 llamadas. Incluye todas las filas de Balanza y Nudo del informe.
- `motor.test.js`: ΣF = 0 y Στ = 0 respecto a varios puntos (también con la barra inclinada), el triángulo del nudo cerrado y lo que enseña la escena: E1, E3, E4, E5, E6/E9, E7, E8 y E10. También prueba los errores de entrada y el papel.
- `papel.json`: 10 problemas propios: palanca, tablón con peso propio, viga en dos apoyos, llave con fuerza inclinada, dos nudos, dos centros de gravedad, roce estático y barra articulada con cable.
- `index.html`:
  - **Paso a paso** (8 pasos, 5 predicciones que bloquean): la barra de 6 m y 30 kg con el apoyo a 2 m. Pregunta el peso en A (150 N), la reacción del apoyo (450 N), la barra inclinada que se queda quieta (E3), el bate cortado (la parte gruesa pesa más, E1) y el momento de una fuerza inclinada (60 N·m). En un paso se arrastra el punto O: Στ = 0 respecto a cualquier punto (E5). El explorador deja arrastrar el apoyo y el bloque.
  - **¿Qué pasa si…?** (5, con pastillas bloqueadas en orden): el nudo de 37° y 53° (E8, E7), el nudo de 53° y 53° (62,5 N, no 50), la tabla en el hielo (el par, E4), la cuerda y la rueda (E9, E6, E7) y la caja en el piso (E10).
  - En el celular, el dibujo queda compacto y fijo arriba mientras hay predicción pendiente.

**Pruebas.** `npm test`: 1435 pasan y solo fallan las 2 del catálogo. En Playwright, a 390 y 1366, claro y oscuro, con y sin movimiento reducido: sin errores ni desbordes.

**Subagentes.**
- **Verificador independiente** (leyó solo la cabecera del motor). Usó fracciones exactas y otro camino en cada caso:
  - momentos respecto a otro extremo y suma de fuerzas;
  - nudos por componentes y por Lamy;
  - bate cónico por centroides de trapecio;
  - láminas por resta de momentos de área y por franjas.

  No encontró ninguna discrepancia numérica. Señaló tres cosas, y se corrigieron:
  - el signo de `punta.tau` en el bate;
  - que faltaba documentar que 143° se toma como notable;
  - el nombre de un caso.
- **Revisor de contenido.** Recalculó todos los números y estaban bien. Lo que se corrigió:
  - **Graves:**
    - en el bate, dos opciones decían lo mismo («pesan igual»), con una de ellas ya contradicha por el enunciado;
    - en la cuerda y la rueda, D llegaba a la misma conclusión que A y su respaldo era «documentado» sin dato para ese error.
  - **Medios:**
    - la opción de 100 N de la barra pasó a «parcial» (el 80 % es del bate, no de esta barra);
    - en el nudo, dos opciones concluían «la 1»;
    - «la parte a lo largo apunta al eje» era falso según el dibujo, igual que en el papel p4;
    - el roce máximo se pintaba en el verde de N;
    - «Dos cuerdas distintas» insinuaba la respuesta (ahora «El nudo de 37° y 53°»);
    - en el celular, la polea se metía en la rueda.
  - **Menores:** rótulos encimados, unidades, aria-live, el color del deslizador y la leyenda de F.
  - **Confirmó que son correctas** dos cosas que le pedí revisar: la barra inclinada 16° sobre el pasador queda en equilibrio indiferente (el centro de gravedad del sistema queda siempre bajo el pasador), y el turquesa de T₂ no choca con nada en esta escena.

**Colores** (para `docs/diseno.md`). Variables de estática (`plantillas/estatica/`):

| Variable | Color | Claro | Oscuro |
| --- | --- | --- | --- |
| P | azul | #1f5fbf | #7cb0ff |
| N (reacción, normal) | verde | #4f7a17 | #a3d65e |
| f (roce) | ámbar | #8f5800 | #ffc04d |
| T y T₁ | rojo | #c0364a | #f17384 |
| F (fuerza aplicada) | fucsia | #a10fbf | #cf6bfa |
| T₂ (la segunda cuerda del nudo) | turquesa | #0f766e | #5ed9c8 |

- Los primeros cinco son los mismos de dinámica. T₂ usa el turquesa que en dinámica es la aceleración; aquí no hay aceleración.
- El brazo y el momento τ de cada fuerza van en el color de esa fuerza («τ = fuerza × brazo»). Masa, metros, ángulos, el punto O, ΣF y Στ van en tinta.
- ΔE00: el par más cercano de los que salen juntos es F–P, con 27 en claro y 29 en oscuro.
- AA: el mínimo es 4,55 (N sobre su chip, que va con fondo al 4 % en vez del 8 %, porque al 8 % daba 4,33).

**Pedidos para la integración.**
1. En `catalogo/cursos/fisica.json`, unidad `fisica.estatica`, agregar `"plantillas": ["estatica"]`. Luego `npm run catalogo`.
2. En `docs/diseno.md`, el párrafo de colores de arriba. Hay que decidir si el chip de N al 4 % se vuelve la norma o si se oscurece un poco el verde.
3. En `docs/pendientes.md` y `CLAUDE.md`: «Estática (`plantillas/estatica/`, 7 nov 2026): barra con peso propio, momentos respecto a cualquier punto, bate cortado, nudo, polea y roce estático; 21 casos verificados aparte; 10 problemas de papel; 5 predicciones y 5 «¿qué pasa si…?» con los datos de Ortiz y otros (2005), Fischer y otros (2014) y Flores-García y otros (2009)». Subir también el conteo de pruebas.
4. Si física llega a 4 plantillas o más, rebalancear `catalogo/pruebas/fisica.json`, como dice `docs/metodo/LEEME.md`.

**Pendiente.**
- **En la escena:** no hay un modo que alargue una sola cuerda del nudo sin cambiar su ángulo (contra E7). Hay un deslizador de «profundidad», que alarga las dos.
- **Opciones sin dato:** las del momento inclinado, de la reacción y de la caja son hipótesis.

## 6 nov 2026 · Tiro parabólico y movimiento circular (`plantillas/tiro-parabolico/`)

Antes de empezar revisé que ninguna rama del repo tuviera algo de tiro parabólico: nadie lo estaba tocando.

**Qué hice.**

- **`motor.js`** (UMD, sin DOM) cubre:
  - `proyectil`: oblicuo, horizontal, desde una altura y hacia abajo; da tiempos, altura máxima, alcance, velocidad al llegar, `estado(t)` y `cuando(h)`;
  - `alcanceMaximo`, `mcu` y `mcuv` (con frenado: tParada y vueltas hasta parar);
  - `transmision`: por faja, misma v; en el mismo eje, misma ω;
  - `soltarDelCirculo`: sigue tangente.

  Usa los ángulos de academia, como en dinámica. Cada resultado trae `errores` con los números de las ideas erróneas.
- **`casos.json`**: 17 casos y sus «tambien» (143 claves). Incluye las dos filas de tiro de «Casos de prueba propuestos» del informe de cinemática.
- **`motor.test.js`**: 42 pruebas.
  - Coherencia: la velocidad es la derivada de la posición, la trayectoria es la parábola y(x) y la rapidez final cuadra con la energía.
  - Lo que enseña la escena: P1 y P2 (el tiempo de caída no depende de vx), P3 (avance horizontal igual cada segundo), C1 (a = −g en la cima), ángulos complementarios, 45°, la masa que no entra, ac = v²/r hacia el centro, D9 (tangente al soltarse), el MCUV con frenado y la transmisión.
  - Además: errores de entrada y papel.
- **`papel.json`**: 10 problemas propios: poleas con faja y eje, mirador, 53°, la patada, complementarios, la avioneta, la rueda de bicicleta, la rotonda, la azotea y el disco que acelera.
- **`index.html`**:
  - **Paso a paso** (8 pasos): el cañón a 50 m/s y 37°. Tiene tres predicciones que bloquean:
    - las dos esferas desde 80 m (P1, P2 y C2), con fotos cada 0,5 s y líneas naranjas de igual instante;
    - la velocidad en la cima, con opciones hipotéticas;
    - la aceleración en la cima (C1 y K3).

    Después vienen el alcance, con las sombras sobre los ejes (P3), la respuesta y un explorador. En el explorador se mueven v₀, el ángulo y la altura, se arrastra la boca del cañón o se usan las flechas del teclado, y el disparo anterior queda a trazos.
  - **¿Qué pasa si…?** (6): dos pelotas a 15 y 30 m/s (P2), segundo a segundo (P3), el paquete de la avioneta (P4), 37° o 53°, la cuerda que se rompe (D9) y la rotonda (aceleración centrípeta).
  - **Pastillas bloqueadas** según la regla nueva:
    - un experimento se abre solo si los anteriores tienen respuesta;
    - las bloqueadas llevan `disabled`, `aria-disabled` y «Experimento N, bloqueado»;
    - `ir()` vuelve a comprobarlo, así que tampoco se saltan desde la consola.

    Los puntos del paso a paso dicen «Paso N, bloqueado».
  - **Escala** igual en los dos ejes: la parábola, el cañón y las flechas coinciden. El lienzo toma el alto que pide cada escena, para que el celular no quede con espacio vacío.
- **`plantilla.json`**: unidad `fisica.movimiento-parabolico-y-circular`, versión 0.1.0, borrador.

**Pruebas.** `npm test` (después de traer la rama principal): 802 pasan y solo fallan las 2 esperadas del catálogo.

**Subagentes.**

- **Verificación independiente** (sin leer el motor). Recalculó todo con fracciones y un segundo camino en cada caso: energía, simetría, v0²·sen 2θ/g, ω²r y el área bajo ω-t. No hubo discrepancias. Pidió casos de borde: raíz negativa en `cuando`, h = 0, giro horario a 37°, 53° y 16°. También pidió MCUV frenando y transmisión, «lo más preguntado que faltaba». Los agregué y los volvió a verificar.
- **Revisión de contenido.** Apliqué casi todo. Lo grave:
  - **La escala vertical ampliada** hacía que la parábola saliera a unos 61° mientras el cañón apuntaba a 37°. Ahora la escala es igual en los dos ejes.
  - **«vy» nombraba dos cosas.** Ahora v₀y es la vertical inicial y vy la del momento, en la escena y en el papel.
  - **«cae en picada» estaba como P5,** pero es P3. P5 es «sigue recto y luego cae».

  Lo medio:
  - **Códigos:** D9 «hacia afuera» pasó a hipótesis. «La aceleración apunta hacia donde se mueve» quedó como K3 documentado (Trowbridge y McDermott, 1981).
  - **Citas:** el 5 % de Thornton y Sokoloff ahora dice «en las tres posiciones».
  - **Pistas antes de predecir:** «Segundo a segundo» mostraba vx antes de responder; ya no.
  - **Precisión física:**
    - «alcance máximo a 45°» ahora va con condiciones;
    - la avioneta ya no deja ambigua la opción A;
    - «desde el reposo» pasó a «sin velocidad vertical al salir»;
    - «T» de vuelo pasó a «t de vuelo»;
    - ac en el círculo.
  - **Papel:** p6 y p8 tenían los mismos números que la escena; los cambié.

  Lo menor: «balas» a 15 m/s pasaron a pelotas, se marca cuándo un auto patinaría, y «rotonda (óvalo)».
- **Prueba en el navegador** (1366 y 390, claro y oscuro, con y sin movimiento reducido). Salió bien:
  - no hubo errores;
  - el bloqueo de predicciones, puntos y pastillas no se pudo saltar ni con clic forzado ni desde la consola;
  - la regla de los 380 ms en el celular se cumple;
  - aria-live cambia una vez por animación.

  Arreglé:
  - «Siguiente» quedaba trabado si se cambiaba de pestaña a mitad de una animación;
  - en el punto de llegada, las flechas de vy y a salían del lienzo y los rótulos se encimaban;
  - la plataforma tapaba los números del eje vertical;
  - el disparo anterior quedaba cortado y con una bola flotando;
  - la rotonda seguía animando escondida;
  - con movimiento reducido no se leía la retroalimentación;
  - el foco se perdía al avanzar;
  - la piedra salía del lienzo;
  - la punta de ω no se veía;
  - las leyendas no coincidían con el dibujo.

**Colores** (para `docs/diseno.md`). Variables de tiro parabólico (`plantillas/tiro-parabolico/`):

| Variable | Color | Claro | Oscuro |
| --- | --- | --- | --- |
| vx `--c-vx` (y su sombra en el suelo) | azul | #1f5fbf | #7cb0ff |
| vy y v₀y `--c-vy` (y su sombra en el eje vertical) | rojo | #c0364a | #f17384 |
| v y v₀ `--c-v` | morado | #8a2aa8 | #ec62e6 |
| aceleración a `--c-a` (g en el tiro, ac en el círculo) | verde | #4f7a17 | #a3d65e |
| tiempo t `--c-t` (y las líneas de igual instante) | naranja | #b85a06 | #f0a04a |
| ω `--c-w` | turquesa | #0f766e | #5ed9c8 |

- Posiciones, alturas, radios y ángulos van en tinta. Las trayectorias van en gris a trazos.
- ΔE00 mínimo: 24,4 en claro y 22,7 en oscuro. Todos pasan AA, aunque el naranja en claro queda al límite (4,39) en texto de 11 a 12 px.

**Pedidos para la integración.**
1. En `catalogo/cursos/fisica.json`, unidad `fisica.movimiento-parabolico-y-circular`, agregar `"plantillas": ["tiro-parabolico"]`. Luego `npm run catalogo`.
2. En `docs/diseno.md`, el párrafo de colores de arriba.
3. En `docs/pendientes.md` y en `CLAUDE.md`: «Tiro parabólico y circular (`plantillas/tiro-parabolico/`, 6 nov 2026): dos movimientos con sombras sobre los ejes y estroboscopio, MCU, MCUV y transmisión; 17 casos verificados aparte; 10 problemas de papel; 3 predicciones y 6 «¿qué pasa si…?» con los datos de Prescott y Mitchelmore (2005) y Thornton y Sokoloff (1998)». Subir también el conteo de pruebas.
4. En el informe de cinemática (no es de mi alcance), aclarar en P3 y P5 que «cae en picada» es P3. Además, la pregunta del 60 % (P3) usó 10 m en el primer segundo, y la escena usa 15 m.

**Pendiente.**
- **En la escena:** MCUV, transmisión, encuentros en la circunferencia e impacto contra una pared (y en x). El motor ya cubre MCUV y transmisión, y están en el papel.
- **Opciones de cálculo:** las opciones incorrectas de la velocidad en la cima, de 37° o 53° y de la honda (opciones C y D) son hipótesis.
- **Explorador:** con ángulos extremos (1° o 90°) la escena queda pequeña dentro del lienzo, por la escala igual. Es aceptable, pero mejorable.

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
