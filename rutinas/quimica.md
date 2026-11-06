# Rutina de química: reporte

Cada ejecución construye una plantilla de escena de química nueva, en la rama `rutina/quimica`. Orden: equilibrio-quimico, cinetica, mol-composicion, atomo-y-tabla, enlace, liquidos-y-solidos.

## 6 nov 2026 · equilibrio-quimico

**Qué se hizo.** `plantillas/equilibrio-quimico/` completa:

- `motor.js` (UMD, sin DOM; `window.MotorEquilibrio`):
  - Lee ecuaciones en texto (`"2 SO2(g) + O2(g) = 2 SO3(g)"`) y calcula Δn solo con gases, Q y Kc con concentraciones (los sólidos y líquidos no entran) y Kp ⇄ Kc.
  - Opera con ecuaciones: invertir, escalar y sumar.
  - Halla el equilibrio a volumen fijo (Kc) y a presión total fija (Kp, para el grado α), con grado de reacción y sentido.
  - `perturbar` cubre agregar, quitar, comprimir y gas inerte a volumen fijo; van 't Hoff mueve K con la temperatura.
  - Devuelve también los resultados de los errores típicos (`conMoles`, `soloProductos`, `dividido`).
  - La caja de partículas tiene A ⇌ B (Kc = 4 a 300 K, exotérmica, 3/2 a 400 K) y 2 X ⇌ Y (Kc = 1/8). Las dos reacciones corren siempre (acción de masas, kd/ki = K, Arrhenius) y las partículas siguen a la cuenta continua; en equilibrio, los cambios van en pares.
- `casos.json`: 18 casos. `papel.json`: 9 problemas. `motor.test.js`: 45 pruebas, entre ellas EQ2 a EQ12 con la caja.
- `index.html` (escena):
  - **Paso a paso, 9 pasos.** Tres predicciones que bloquean: qué pasa adentro en equilibrio (EQ2, EQ3 y EQ4), agregar 10 A (EQ1, EQ3 y EQ6) y calentar (EQ8, EQ9 y EQ10). El paso 6 es la cuenta con Q contra K y el 9, un explorador.
  - **¿Qué pasa si…?, 5 casos:** catalizador (EQ12), comprimir 2 X ⇌ Y (EQ10 y EQ11), comprimir A ⇌ B, quitar B (EQ3, EQ10 y una hipótesis) y agregar A y B a la vez (EQ14 y EQ10).
- `plantilla.json` con la unidad `quimica.equilibrio-quimico`.

**Subagentes.**
- **Verificador:** sin leer el motor, recalculó los 27 resultados (18 casos y 9 problemas de papel) con `Fraction` y tablas ICE resueltas como polinomio. La compresión del SO₃ es la raíz real de 2x³ − 5x² + 8x − 1 = 0, con Newton en Decimal. Todos coinciden con el motor.
- **Constructor:** escribió `index.html` con el molde de gases y lo probó con Playwright en 8 combinaciones.
- **Revisor:** volvió a calcular todo a mano (la química está bien) y probó con Playwright. Encontró:
  - el título regalaba la primera predicción;
  - las letras de las opciones A a D chocaban con las sustancias A y B;
  - la forma de las opciones correctas las delataba;
  - los aria-label de los pasos bloqueados mostraban su título;
  - la línea a trazos significaba dos cosas;
  - Q y B tenían la misma forma (triángulo);
  - había números de ítem inferidos en las citas;
  - los ids de error se repetían dentro de un mismo problema;
  - algunas ecuaciones quedaban cortadas.
  
  Todo eso se corrigió:
  - título neutro;
  - opciones numeradas del 1 al 4 (la medición sigue guardando a-d);
  - opciones con el mismo formato, sin la cuenta de la correcta;
  - pasos bloqueados que dicen solo "Paso N, bloqueado";
  - Q con rombo;
  - la curva "sin catalizador" fina y translúcida;
  - citas "ítems 27 a 29" y "ítems 20 a 22", y el 53 % marcado como extensión nuestra;
  - ids de error únicos por opción (EQ12-rendimiento, EQ11-hacia-X, EQ14-hacia-B, etc.);
  - ecuaciones partidas;
  - y los detalles menores (anillo de 0,4 s, rótulo de V fuera de la caja, "rapidez" en todo el texto, aria-live repetido a 1,2 s).

  El constructor volvió a probar las 8 combinaciones con Playwright: 0 errores de consola y sin desborde.
- **Queda a medias:** en comprimir 2 X ⇌ Y, la opción "K sube" no lleva cantidades. Con K al doble, el equilibrio no da porciones enteras.

**Pruebas.** `npm test`: solo fallan las 2 de catálogo, como se esperaba (`catalogo.test.js` y `app.test.js`), porque la plantilla todavía no está en el catálogo.

**Pendiente.**
- No hay gráfica de "Kp con presiones parciales" en la escena (está en papel, p7). No hay gas inerte a presión constante (EQ14, el caso más fino de Quílez).
- El calor de reacción y la energía de activación de la escena se eligieron para que K salga redonda (4 → 3/2 entre 300 y 400 K); la escena lo dice.
- La gráfica de rapideces muestra un pico de unos 11, no 12, porque el historial guarda un punto cada 0,1 s; el texto dice "unos 12".
- Las opciones de comprimir A ⇌ B, "se gasta todo el A" y las de agregar A y B a la vez (Quílez, sin porcentaje) son hipótesis o tienen respaldo sin cifra.

**Pedidos para la integración (rama principal).**
1. `catalogo/cursos/quimica.json`, unidad `quimica.equilibrio-quimico`: `"plantillas": ["equilibrio-quimico"]`. Después, `npm run catalogo` (así se arreglan las 2 pruebas en rojo y funciona `/app/#/papel/equilibrio-quimico`).
2. `docs/diseno.md`, variables de equilibrio (`plantillas/equilibrio-quimico/`):
   - A (círculo, también [A]): azul #1f5fbf, oscuro #7cb0ff.
   - B (triángulo): naranja #a05200, oscuro #f0a04a.
   - X (círculo pequeño): índigo #3328c4, oscuro #9f9bff.
   - Y (pareja de círculos): siena #773922, oscuro #d9a68c.
   - Q (rombo): fucsia #b0179a, oscuro #fc72ea.
   - K: turquesa #0f766e, oscuro #5ed9c8.
   - T: rojo #c0364a, oscuro #f17384.
   - V: verde #4f7a17, oscuro #a3d65e.
   - Rapidez directa en tinta con línea continua; inversa en tinta a trazos.
   - ΔE00 mínimo entre los que salen juntos: 22,0 en claro y 21,5 en oscuro. Contraste AA en claro y en oscuro.
   - A y X, igual que B e Y, nunca salen juntos.
3. `docs/pendientes.md`, sección 2, línea nueva: "**Equilibrio químico** (`plantillas/equilibrio-quimico/`, hecha el 6 nov 2026 por la rutina de química): A ⇌ B y 2 X ⇌ Y con partículas, Q contra K en vez de la regla de Le Chatelier (Quílez 2017). Falta el gas inerte a presión constante y Kp en la escena (está en papel). ΔH y Ea de la escena elegidos para números redondos."
4. `CLAUDE.md`, Estado: sumar "equilibrio químico" a la lista de plantillas y una línea en Historia como las de las otras escenas: 18 casos verificados aparte, papel, 3 predicciones y 5 "¿qué pasa si…?" con los datos de Bilgin y otros 2003 y Riddle y Lo-Fan-Hin 2023.


## 6 nov 2026 (segunda ejecución) · cinetica

**Antes de empezar.** Junté `claude/awesome-wozniak-5etl1n` en la rama, sin conflictos. Equilibrio químico ya quedó integrado por la conversación principal.

**Qué se hizo.** `plantillas/cinetica/` completa:

- **`investigacion.md`.** Esta unidad no tenía informe (`"investigacion": null`), así que un subagente lo armó: CI1 a CI13, con 14 errores de examen que quedan como hipótesis. **Ojo:** la red de la sesión no dejó abrir ningún artículo; solo pasaba el buscador. Las ideas están ubicadas en sus estudios (Çakmakçı 2010, Kolomuç y Tekin 2011, Kurt y Ayas 2012, Popova y Bretz 2018 y otros), pero las cifras salieron del buscador y van "por verificar". Por eso la escena no muestra ningún porcentaje de cinética. La única cifra es la de Riddle y Lo-Fan-Hin (2023) sobre catalizador y rendimiento, que ya estaba en el informe de equilibrio.
- **`motor.js`** (UMD, sin DOM; `window.MotorCinetica`):
  - **Cálculo:**
    - ley de velocidad y factor al cambiar concentraciones (con el error "sin exponentes");
    - órdenes y k desde una tabla de velocidades iniciales (con el error "proporción directa"), y unidades de k;
    - leyes integradas y vida media de orden 0, 1 y 2, y lo que queda tras n vidas medias;
    - Arrhenius: k a otra temperatura y Ea desde dos k;
    - la regla de 10 °C (con el error lineal) y el perfil de energía con catalizador.
  - **Caja de discos que chocan de verdad.** Choques elásticos medidos en el instante de contacto, Maxwell y termostato. Un choque A–B forma C si su energía por la línea de centros llega a Ea y si B llega por el lado reactivo de A (±60°). La fracción eficaz sigue a p·e^(−Ea/RT) de la teoría de colisiones, a pocos por ciento.
- **`casos.json`:** 13 casos. **`papel.json`:** 9 problemas. **`motor.test.js`:** 40 pruebas, incluida la teoría de colisiones contada en la caja.
- **`index.html`:**
  - **Paso a paso, 9 pasos.** Tres predicciones: la rapidez en el tiempo (CI1, CI2), por qué acelera el calor (CI3, CI4) y qué hace el catalizador (CI7). Muestra contadores de choques (todos, con energía y eficaces), un histograma de energía con la línea de Ea, la gráfica en el tiempo y el perfil de energía con el eje "avance de la reacción" (CI12).
  - **¿Qué pasa si…?, 5 casos:** el doble de A, el doble de A y de B, el producto final con catalizador (EQ12), una barrera más alta (CI13, CI5) y orientación libre.

**Subagentes.**
- **Investigador:** escribió `investigacion.md`; se topó con el bloqueo de red.
- **Verificador:** sin leer el motor, recalculó los 22 resultados (13 casos y 9 de papel) con Fraction, Decimal y una segunda vía (vidas medias contadas, RK4). Coinciden todos.
- **Constructor:** hizo `index.html` y lo probó con Playwright.
- **Revisor:** encontró dos fallas graves del motor, que corregí yo:
  - los choques se medían con los discos ya encimados, y la fracción eficaz salía 7–19 % baja;
  - formar C se llevaba la energía del choque y la caja se enfriaba.

  Ahora el motor retrocede hasta el instante de contacto, el subpaso se achica con √T, los discos nacen sin encimarse y C nace con velocidad térmica. La prueba bajó su tolerancia de 15 % a 8 %. El revisor también halló:
  - el histograma decía lo contrario en oscuro;
  - la caja densa daba ×2,4 y ×5,7 donde la ley dice ×2 y ×4;
  - q5 delataba la correcta;
  - el paso 1 regalaba parte de la respuesta del paso 5;
  - algunas citas no calzaban con el informe;
  - la letra A se usaba también como factor de Arrhenius;
  - las cuentas de fondo eran lentas en un celular lento.
  
  Todo eso pasó al constructor, junto con la **regla nueva de Gerson**: en "¿Qué pasa si…?", un experimento queda bloqueado hasta que se responden los anteriores.

**Pruebas.** `npm test` solo falla en las 2 pruebas de catálogo, como se espera.

**Correcciones aplicadas** (el constructor las probó de nuevo con Playwright: 0 errores, sin desbordes, unos 60 fps; con la CPU ×4 más lenta, la primera tabla de "¿Qué pasa si…?" sale a los 5–6 s):
- experimentos bloqueados hasta responder los anteriores (disabled, aria-disabled y "Experimento N, bloqueado");
- el histograma se nombra por rol ("grises: no alcanzan Ea · en tinta: sí");
- q1 y q2 con una caja menos densa (radio 0,015), que da ×1,9–2,2 y ×4,2–4,5;
- el paso 1 ya no regala la respuesta;
- citas corregidas y CI13 como hipótesis;
- Z para el factor de Arrhenius;
- semillas al azar y cuentas de fondo más cortas, con prioridad para el modo visible.

**Pendiente.**
- **La fracción eficaz contada queda entre 2 y 9 % bajo la teoría, según la caja.** Es un error numérico del paso de tiempo con discos densos. Con un subpaso de 0,001 s coincide, pero cuesta 3 veces más. La escena dice "quedan unos pocos por ciento de diferencia".
- **Cifras de cinética sin verificar.** Hay que leer los originales: Çakmakçı 2010 (J. Chem. Educ.), Kolomuç y Tekin 2011, Kolomuç y Çalık 2012, Jusniar y otros 2020, Popova y Bretz 2018 y Bain y Towns 2016. La red de la sesión bloqueó ijpce.org, eduhk.hk, dergipark.org.tr, files.eric.ed.gov, pubs.rsc.org y pubs.acs.org. Gerson: o se permiten esos sitios en el entorno, o se bajan los PDF a `fuentes/`. Hasta entonces, ninguna opción de cinética dice "lo cree el X %".
- La caja es una reacción elemental (v = k[A][B]). Los órdenes que no coinciden con los coeficientes están solo en papel (p3), no en la escena.
- Vida media y orden de reacción no están en la escena; sí en papel (p4, p5, p9).

**Pedidos para la integración.**
1. `catalogo/cursos/quimica.json`, unidad `quimica.cinetica-quimica`: `"plantillas": ["cinetica"]` y `"investigacion": "docs/investigacion/cinetica-ideas-erroneas.md"`. Después, `npm run catalogo`.
2. Mover `plantillas/cinetica/investigacion.md` a `docs/investigacion/cinetica-ideas-erroneas.md` (yo no puedo tocar `docs/`) y ajustar el enlace en la línea de `CLAUDE.md`.
3. `docs/diseno.md`, variables de cinética (`plantillas/cinetica/`):
   - A azul #1f5fbf (oscuro #7cb0ff), círculo con la marca de su lado reactivo.
   - B naranja #b55302 (oscuro #fb9c5e), cuadrado redondeado.
   - C fucsia #c90eb4 (oscuro #fe3dd6), A y B unidos; el choque eficaz es un anillo en el color de C.
   - T rojo #c0364a (oscuro #f17384).
   - Ea turquesa #1c7170 (oscuro #79c6c5).
   - ΔH verde #198036 (oscuro #4fb256).
   - Rapidez v mostaza #856d02 (oscuro #d8c84a).
   - Choque sin energía, con cruz, y barras bajo Ea, en gris #434038 (oscuro #8c8f85).
   - Choque mal orientado violeta #4b06b9 (oscuro #9978fa).
   - El tiempo va en tinta.
   - ΔE00 mínimo: 22,1 en claro y 20,1 en oscuro. Contraste AA en los dos modos.
4. `docs/pendientes.md`, sección 2: "**Cinética** (`plantillas/cinetica/`, hecha el 6 nov 2026 por la rutina de química): caja de discos con teoría de colisiones (energía y orientación), temperatura, catalizador y perfil de energía. Cifras de ideas erróneas sin verificar (bloqueo de red); la fracción contada queda unos pocos por ciento bajo la teoría. Falta en la escena: orden ≠ coeficiente, vida media."
5. `CLAUDE.md`, Estado: sumar "cinética" a la lista de plantillas y una línea en Historia.


## 6 nov 2026 (tercera ejecución, a pedido de Gerson) · mol-composicion

**Antes de empezar.** Junté `claude/awesome-wozniak-5etl1n` en la rama, sin conflictos. Equilibrio y cinética ya están integrados. A mitad de la ejecución, el constructor se cortó por el límite de uso de 5 horas. Guardé el avance en un commit "en curso" y lo retomé cuando se reinició el límite.

**Qué se hizo.** `plantillas/mol-composicion/` completa, con el informe `docs/investigacion/estequiometria-ideas-erroneas.md` (ES1 a ES7 y ES16 a ES18).

- **`motor.js`** (UMD, sin DOM; `window.MotorMol`). Cubre:
  - fórmulas con paréntesis e hidratos (`CuSO4·5H2O`);
  - masa molar, con el error "sin subíndices" (ES18);
  - moles, moléculas y átomos desde gramos, moléculas o litros en condiciones normales, con el error "fórmula invertida" (ES7);
  - volumen: 22,4 L solo para gases y masa/densidad para líquidos (ES5);
  - masa de una partícula;
  - igualar masas con átomos (ES4);
  - masa atómica promedio;
  - composición centesimal y Proust;
  - fórmula empírica, con los errores "razón de masas" (ES16) y "redondear 1,5";
  - fórmula molecular e hidratos.
- **`casos.json`:** 16 casos. **`papel.json`:** 10 problemas. **`motor.test.js`:** 37 pruebas. Las pruebas incluyen la empírica de vuelta desde sus porcentajes para 9 compuestos y los porcentajes que suman 100.
- **`index.html`.** Los tres niveles de Johnstone a la vez: balanza arriba, lupa con porciones al centro y la cuenta abajo.
  - **Paso a paso:** 9 pasos con 4 predicciones: mismos moles de O₂ y H₂O (ES3, ES5, ES6), cuántos átomos de C igualan 10 de Mg (ES4), fórmula empírica con 75 % de C (ES16) y empírica contra molecular (ES17).
  - **¿Qué pasa si…?:** 5 experimentos bloqueados en orden: mismos gramos, la razón 1,5 del Fe₂O₃, el O del CaCO₃ (ES18), Proust en el agua y un mol de agua líquida contra 22,4 L (ES5).

**Subagentes.**
- **Verificador:** sin leer el motor, recalculó con `Fraction` 24 resultados (15 casos y 9 de papel), con cada empírica comprobada de vuelta. Coinciden todos.
- **Constructor:** hizo la escena y la probó con Playwright en 6 combinaciones.
- **Revisor:** rehízo a mano los cálculos y lo probó con Playwright. Encontró lo siguiente (las correcciones de la escena están EN CURSO; este reporte se cierra al terminar):
  - la unidad delataba la correcta en el experimento 5;
  - porciones y moléculas se mezclaban;
  - la glucosa se dibujaba como anillo de CH₂O, y además se reconocía de memoria; ahora es un compuesto sin nombre con M = 150;
  - la balanza se cortaba en 1366;
  - la letra N nombraba al nitrógeno y al número de partículas; ahora "partículas" va sin letra;
  - una cita estirada (pasó a hipótesis);
  - el vaso de agua tenía el color del H.
  
  En el motor y en papel, corregí yo:
  - la razón de masas (70/30 → Fe₇O₃);
  - una tolerancia fija en la empírica;
  - p8 ya no repite la escena (ahora es Fe₃O₄);
  - un problema nuevo con 22,4 L contra un líquido (p10).

**Pruebas.** `npm test`: solo las 2 de catálogo en rojo, como se espera.

**Pendiente.**
- El porcentaje va en tinta, no en un color propio: con M y las partículas ya no quedaba un color a ΔE00 ≥ 20.
- Pares de colores heredados de limitante por debajo de 20 que salen juntos: C con Ca (15,2 en claro, 12,1 en oscuro; en CaCO₃, cada átomo lleva su letra) y m con O (18,9 en claro). Conviene que la conversación principal los revise en `docs/diseno.md`.
- Del informe falta la escena de rendimiento y pureza (solo hipótesis); los equivalentes y el redox tampoco están acá.

**Pedidos para la integración.**
1. `catalogo/cursos/quimica.json`, unidad `quimica.mol-y-composicion`: `"plantillas": ["mol-composicion"]`. Después, `npm run catalogo`.
2. `docs/diseno.md`, variables de mol y composición (`plantillas/mol-composicion/`):
   - Elementos como en limitante (H turquesa, C gris oscuro, O rojo, N azul, Ca gris pizarra), más Mg petróleo (#005c6c, oscuro #009ca4), Fe celeste (#0478ac, oscuro #0898d8) y S añil (#3a1fe0, oscuro #9178ff).
   - Masa m en siena (#773922, oscuro #e0a07a), moles n en mostaza (#7d6a00, oscuro #e3c84a), masa molar M en fucsia (#c400ad, oscuro #ff2ed8) y número de partículas en verde (#0a8200, oscuro #2da500), sin letra porque N es el nitrógeno.
   - El % en tinta, con cada tramo de la barra en el color de su elemento.
   - ΔE00 mínimo de los nuevos: 22,3 en claro y 21,2 en oscuro.
3. `docs/pendientes.md`, sección 2: "**Mol y composición** (`plantillas/mol-composicion/`, rutina de química, 6 nov 2026): balanza, lupa y cuenta a la vez; mol contra masa, átomos en u, fórmula empírica y molecular; 16 casos verificados aparte; 10 de papel. Falta la escena de rendimiento y pureza."
4. `CLAUDE.md`: sumar "mol y composición" a la lista de plantillas y una línea en Historia.

**Siguiente en la cola:** `atomo-y-tabla`.
