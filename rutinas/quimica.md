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
- **Revisor:** rehízo a mano los cálculos y lo probó con Playwright. Encontró lo siguiente, y ya está todo corregido (el constructor volvió a probar 6 combinaciones con Playwright: 0 errores, sin desbordes y la balanza entera en 1366):
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


## 7 nov 2026 · atomo-y-tabla (pedido de la conversación principal; el disparo programado no llegó)

**Antes de empezar.** Junté `claude/awesome-wozniak-5etl1n` en la rama sin conflictos: entraron mol-composicion integrada y muchas plantillas nuevas, y `npm test` dio 1389 en verde. Desde esta ejecución sigo el método de `docs/metodo/`:
1. el constructor recibe `brief-plantilla.md` y el encargo, y arma la plantilla completa;
2. el verificador usa `brief-verificador.md`, con las entradas sin respuestas de `entradas.py`;
3. el revisor usa `brief-revisor.md`;
4. las correcciones vuelven al mismo constructor.

**Qué se hizo.** `plantillas/atomo-y-tabla/`, para las unidades `quimica.estructura-atomica` y `quimica.tabla-periodica`. El informe es `docs/investigacion/atomo-enlace-ideas-erroneas.md`.

- **`motor.js`** (`window.MotorAtomo`):
  - partículas de átomos e iones, con sus errores;
  - configuración por Möller, con excepciones solo en Cr y Cu (más Mo, Ag y Au declaradas);
  - cajas con Hund y Pauli;
  - cationes que pierden primero los de mayor n, con el error "quitar los últimos en llenarse";
  - números cuánticos del último electrón (convención declarada: cajas de −l a +l, primero las flechas hacia arriba);
  - ubicación: período, grupo 1–18 y A/B, y bloque;
  - datos de Z = 1–36: primera energía de ionización (NIST, en kJ/mol), radio calculado (Clementi 1967), electronegatividad de Pauling y radios iónicos de Shannon;
  - energías sucesivas de Na, Mg y Al;
  - series isoelectrónicas.
- **`casos.json`:** 29 casos. **`papel.json`:** 10 problemas. **`motor.test.js`:** 58 pruebas, entre ellas que ningún error típico coincida con la respuesta.
- **`index.html`:**
  - **Paso a paso:** 8 pasos con 5 predicciones:
    - partículas del ⁵⁶Fe³⁺;
    - configuración del Fe³⁺ (todas las opciones incorrectas son hipótesis);
    - Na⁺ y un electrón libre (TP1, TP2);
    - la segunda ionización del Na (TP3, TP4);
    - por qué baja la energía de ionización del P al S (TP6, TP7, TP4).
  - **¿Qué pasa si…?:** 5 experimentos bloqueados en orden: Mg contra Al (TP7), átomos contra iones, una serie isoelectrónica, Cr y Ni, y qué es ser electronegativo (TP8).
  - **Explorador:** una tabla tocable que hace de mapa (energía de ionización, radio o electronegatividad), con el átomo y sus cajas, y botones para quitar o agregar electrones.

**Subagentes.**
- **Verificador:** sin leer el motor (solo su cabecera) y con su propio programa, recalculó los 29 casos (unas 150 comprobaciones). Todos coinciden. Las únicas diferencias son de redondeo en dos energías sucesivas, de menos de 0,03 %. Su texto quedó en el campo `"verificacion"`.
- **Revisor:** no encontró nada grave. Ninguna opción incorrecta es defendible, los números están bien y los respaldos coinciden con el informe. Hallazgos de gravedad media:
  - el paso a paso regalaba las respuestas de los experimentos Mg–Al y Cr–Ni;
  - una frase falsa sobre el octeto;
  - el átomo con bandas se parecía al modelo de Bohr;
  - contraste de las fichas dentro de las opciones;
  - la escala de radios teórica, distinta de la de los libros;
  - textos cortados en el celular.
  
  Todo quedó corregido. El constructor volvió a probar las 8 combinaciones con Playwright, sin problemas, y las 58 pruebas pasan. Decisiones mías:
  - en el explorador, Mg, Al, Cr, Cu y Ni quedan con "?" hasta responder su experimento;
  - se queda la escala de Clementi, nombrada en pantalla con el aviso "tu libro usa radios medidos, con otros números y el mismo orden".

**Pendiente.**
- Los datos de tabla los escribió el constructor de memoria a partir de las fuentes. El verificador y el revisor los cotejaron, también de memoria, y no hallaron errores, pero nadie los confirmó contra la fuente: hay que contrastarlos con el libro que use el colegio.
- Configuraciones de Z > 36: solo se modelan Mo, Ag y Au como excepciones.
- Del informe falta lo de enlace: geometría y polaridad, ebullición y red iónica. Eso va en las plantillas que siguen, `enlace` y `liquidos-y-solidos`.

**Pedidos para la integración.**
1. En `catalogo/cursos/quimica.json`, poner `"plantillas": ["atomo-y-tabla"]` en `quimica.estructura-atomica` y en `quimica.tabla-periodica`. Después, `npm run catalogo`. Si química llega a 4 plantillas o más, rebalancear `catalogo/pruebas/quimica.json`, como dice `docs/metodo/LEEME.md`.
2. En `docs/diseno.md`, las variables de átomo y tabla (`plantillas/atomo-y-tabla/`):
   - protones Z: rojo #b02c41 (oscuro #f17384), oscurecido para pasar AA dentro de las opciones ya respondidas;
   - neutrones: granate #66003d (oscuro #ffc2ea);
   - electrones: azul #1f5fbf (oscuro #7cb0ff);
   - electrón que sale o entra: ámbar #8f5800 (oscuro #ffc04d);
   - nivel n: verde #466d14 (oscuro #a3d65e);
   - radio: turquesa #0f766e (oscuro #5ed9c8);
   - energía de ionización: fucsia #a10fbf (oscuro #cf6bfa);
   - electronegatividad: tostado #5a1802 (oscuro #f96c1f);
   - en tinta: A, q, l, mₗ, mₛ, período y grupo;
   - ΔE00 mínimo: 20,6 en claro (Z–neutrones) y 22,2 en oscuro;
   - contraste mínimo: 4,53;
   - Z queda cerca del rojo de los avisos, y el aviso siempre va con texto.
   - los neutrones se escriben con la palabra entera, porque n es el nivel.
3. En `docs/pendientes.md` y `CLAUDE.md`, una línea como las de las otras plantillas.


## 7 nov 2026 · enlace (pedido de la conversación principal, que ahora es session_01P39d2yUDZET7Wso3ubSiiV)

**Contexto.** Átomo y tabla quedó integrado. La conversación principal abrió una rutina de química B (`rutina/quimica-b`: materia, nomenclatura y orgánica). A esta rutina le quedan enlace y líquidos y sólidos. Puedo llevar hasta 3 subagentes a la vez y uso `nucleo/celular.js`. El constructor se cortó dos veces por el límite de 5 horas; guardé el avance en commits "en curso" y lo retomé.

**Qué se hizo.** `plantillas/enlace/` (unidad `quimica.enlace-quimico`; informe `atomo-enlace-ideas-erroneas.md`):

- **`motor.js`** (`window.MotorEnlace`):
  - Lewis de átomo central único con iones, carga formal, octeto incompleto o expandido y número de estructuras de resonancia;
  - VSEPR: AXₙEₘ, geometría de dominios y molecular, hibridación y ángulos;
  - posiciones 3D (pares libres ecuatoriales en sp³d; AX₂E₂ con los pares arriba) y el dibujo plano del papel;
  - polaridad como suma de vectores de ΔEN de Pauling, con los pares libres sin dipolo propio (simplificación declarada);
  - tipo de enlace con los cortes 1,7 y 0,4, y un aviso cuando chocan con la clase de átomos (HF, B–F);
  - red de NaCl.
  - El O₃ quedó fuera del catálogo del motor: el modelo lo daría apolar.
- **Números:** 58 casos, 10 problemas de papel y 80 pruebas.
- **`index.html`:**
  - **Paso a paso:** 8 pasos con 5 predicciones:
    - pares libres del NH₃;
    - su forma (EN8);
    - su hibridación (EN12);
    - polaridad del CH₂Cl₂ (EN10: 56 % y 71 %; EN11);
    - moléculas en un trozo de NaCl (EN1: 92 % de 102).
  - **¿Qué pasa si…?:** 5 experimentos bloqueados en orden: CO₂ contra SO₂, BF₃ contra NH₃, XeF₄, clorometanos y resonancia del CO₃²⁻ (EN6).
  - **Explorador:** central, ligandos y pares libres, o 40 moléculas del examen, con lo de «¿Qué pasa si…?» tapado hasta responder.

**Subagentes.**
- **Verificador:** con `entradas.py` y sin leer el motor, recalculó todo con fracciones y vectores 3D. Coinciden 322 campos de 58 casos; las 4 diferencias son de convención.
- **Revisor:** dos graves, ya en corrección:
  - la opción 4 del CH₂Cl₂ («Polar, y lo sería cualquier…») era defendible: ahora el enunciado pide la respuesta y la razón correctas;
  - el modelo sin dipolo de los pares libres invierte NH₃ contra NF₃: el explorador ya no muestra el tamaño del dipolo y avisa del caso.
  
  Medios:
  - el turquesa del dipolo se confundía con el verde de «correcto»: pasa a marrón rojizo;
  - la correcta siempre caía en la posición 2 o 3 y solía ser la más larga;
  - un enunciado que delataba la respuesta;
  - «tetraédrica» defendible para el NH₃;
  - el paso 6 regalaba el experimento 1;
  - analogías visibles en el explorador (CS₂ y NO₂⁻);
  - fórmulas mal escritas en el menú;
  - un desborde en el celular;
  - notas de los cortes de ΔEN.
  
  Además, 7 bajos.
- **Estado:** todo corregido. El constructor volvió a probar las 8 combinaciones con Playwright: sin errores, sin desbordes, con el lienzo visible y el dedo bien. Las 80 pruebas pasan. Además:
  - la correcta ya no es la más larga en ninguna de las 10 predicciones y cambia de posición;
  - el híbrido de resonancia se dibuja con una raya llena y otra a trazos.

**Pendiente.**
- Las flechas son ΔEN del modelo, no el momento dipolar medido: no sirven para ordenar CH₃Cl, CH₂Cl₂ y CHCl₃, ni para comparar NH₃ con NF₃. La escena lo dice.
- El H₂S sale polar aunque su enlace S–H queda «casi apolar» por el corte; hay una nota.
- Del informe falta la escena de ebullición y fuerzas intermoleculares: va en líquidos y sólidos.

**Pedidos para la integración.**
1. En `catalogo/cursos/quimica.json`, unidad `quimica.enlace-quimico`: `"plantillas": ["enlace"]`. Después, `npm run catalogo` y rebalancear el banco de química si hace falta.
2. En `docs/diseno.md`, variables de enlace (`plantillas/enlace/`):
   - par enlazante azul (#1f5fbf, oscuro #7cb0ff);
   - par libre ámbar (#8f5800, oscuro #ffc04d);
   - dipolo de enlace (ΔEN) fucsia (#a10fbf, oscuro #cf6bfa);
   - dipolo total μ marrón rojizo (#6b260f, oscuro #ff6600), elegido para no confundirse con el verde de «correcto»;
   - Na⁺ granate (#77032c, oscuro #fdb4ce) y Cl⁻ verde (#466d14, oscuro #a3d65e);
   - ΔE00 mínimo 20,7 en claro y 25,2 en oscuro;
   - el rojo de los avisos queda a 17,4 del Na⁺ en oscuro, y el aviso siempre va con texto.
3. En `docs/pendientes.md` y `CLAUDE.md`, una línea como las demás.

## 7 nov 2026 · liquidos-y-solidos (la última de la cola)

**Contexto.** Enlace quedó integrado. La conversación principal trajo la paleta común de elementos (`nucleo/elementos.js`): esta escena la usa, con `Elementos.css([...])`, y se sumó a `nucleo/elementos-escenas.test.js`. Ese test es la única excepción fuera de mi carpeta, y la pidió la conversación principal. Al juntar la rama principal hubo un conflicto en `plantillas/enlace/index.html`: tomé su versión, que es la mía con el Na⁺ de la paleta común. El contenedor se reinició a mitad de camino y retomé a los constructores desde el disco.

**Qué se hizo.** `plantillas/liquidos-y-solidos/` (unidad `quimica.liquidos-y-solidos`). Usa los informes de gases y soluciones (GQ16 a GQ19), de átomo y enlace (EN13 a EN16) y de física (Q9).

- **`motor.js`** (`window.MotorLiquidos`):
  - presión de vapor de agua, etanol y acetona con Antoine (rangos declarados);
  - punto de ebullición según la presión y según la altitud, con la misma atmósfera estándar de calorimetría: una prueba comprueba que Juliaca da igual en las dos;
  - olla a presión;
  - puentes de hidrógeno (EN15) y orden de puntos de ebullición, con datos del CRC;
  - gas recogido sobre agua, humedad relativa y punto de rocío;
  - frasco cerrado (GQ18) con una caja de partículas que se evaporan y condensan hasta igualar los dos flujos;
  - diagramas de fases del agua y del CO₂.
- **Números:** 52 casos, 10 problemas de papel y 80 pruebas.
- **`index.html`:**
  - **Paso a paso:** 8 pasos con 5 predicciones:
    - el frasco grande contra el chico (GQ18);
    - qué hay en las burbujas (EN13);
    - por qué en Puno hierve antes (Q9);
    - H₂O contra H₂S (EN14);
    - quién forma puentes de hidrógeno (EN15).
  - **¿Qué pasa si…?:** 5 experimentos bloqueados en orden: butano contra isobutano (EN16), gas sobre agua, olla a presión, hielo seco y el vapor que se enfría (GQ16).
  - **Explorador:** líquido, temperatura y presión externa.

**Subagentes.**
- **Verificador:** con `entradas.py` y sin leer el motor. 48 de 52 casos coinciden exactos; los otros 4 coinciden una vez declaradas las constantes que faltaban en la cabecera (R, los puntos del CO₂ en Pa).
- **Revisor:** encontró dos graves:
  - la correcta caía siempre en b en «¿Qué pasa si…?»;
  - la barra del gas sobre agua regalaba la respuesta.
  
  Y estos medios:
  - dos opciones con la misma respuesta (Puno, butano);
  - el dibujo del butano insinuaba la respuesta;
  - moléculas encimadas;
  - con movimiento reducido, el paso 3 no mostraba el equilibrio;
  - lecturas con ruido;
  - la T verde dentro del texto verde de «correcto»;
  - el puente de hidrógeno contra la presión externa en oscuro.
  
  Además, 10 bajos.
- **Estado:** todo corregido. Decidí bajar GQ18 y GQ16 a 'parcial', que es lo prudente. Lo que se arregló:
  - las correctas ahora caen en posiciones variadas, y en ninguna predicción la correcta es la más larga;
  - la barra del gas sobre agua solo aparece después de responder;
  - opciones nuevas para Puno y para el butano;
  - el butano sin orientar antes de responder;
  - el paso 3 con el ritmo de equilibrio del motor también con movimiento reducido;
  - el color del puente de hidrógeno pasó a granate/rosa (#570011 / #fbb1e5), porque el propuesto no pasaba AA en oscuro;
  - la cabecera del motor ya declara R y el CO₂ en Pa;
  - con la regla nueva de la conversación principal, el subtítulo y el paso 1 ya no regalan nada.

  Volvió a correr Playwright en las 8 combinaciones, sin errores.

**Pendiente.**
- La humedad relativa solo está en el motor y en el papel; no tiene escena.
- Hay que cotejar con la tabla del colegio:
  - las constantes de Antoine;
  - los puntos de ebullición del CRC;
  - los puntos triples;
  - los momentos dipolares que cita el paso 6 (H₂O 1,85 D y H₂S 0,97 D, de memoria; no salen de un informe).
- El agua tiene dos tramos de Antoine que difieren 0,55 % a 100 °C; el motor deja la ebullición en 100,0 °C entre 760,1 y 764,3 mmHg.

**Pedidos para la integración.**
1. En `catalogo/cursos/quimica.json`, unidad `quimica.liquidos-y-solidos`, poner `"plantillas": ["liquidos-y-solidos"]`. Después, `npm run catalogo` y, si hace falta, rebalancear el banco de química.
2. En `docs/diseno.md`, las variables de líquidos y sólidos (`plantillas/liquidos-y-solidos/`):
   - presión de vapor Pv: azul (#1f5fbf, oscuro #7cb0ff);
   - presión externa Pext: naranja (#a05200, oscuro #f0a04a);
   - temperatura T: verde (#377703, oscuro #97f91f), no rojo, porque el O de la paleta común es rojo;
   - puente de hidrógeno: granate (#570011, oscuro #fbb1e5);
   - presión del gas seco Pgas: fucsia (#a10fbf, oscuro #cf6bfa);
   - los elementos, con la paleta común.

   El ΔE00 mínimo entre variables es 20,4 (puente de hidrógeno contra Pgas).
3. En `docs/pendientes.md` y en `CLAUDE.md`, una línea como las demás.

**Con esto se termina la cola de esta rutina** (equilibrio químico, cinética, mol y composición, átomo y tabla, enlace, líquidos y sólidos). Si Gerson quiere más química A, hay que darle una lista nueva. La química B (materia, nomenclatura y orgánica) va en su propia rutina.

## 7 nov 2026 · lista nueva de la conversación principal (a pedido de Gerson): rendimiento y pureza, biomoléculas, química ambiental

Se trabajó en paralelo, con hasta 3 subagentes a la vez. Las unidades de biomoléculas y de ambiente no tenían informe de ideas erróneas, así que dos investigadores los escribieron dentro de sus plantillas. La red volvió a bloquear los PDF: las cifras nuevas salen de resúmenes y van «por verificar».

### biomoleculas (terminada)

**Qué se hizo.** `plantillas/biomoleculas/` (unidad `quimica.biomoleculas-y-productos-naturales`).
- **`investigacion.md`.** BM1 a BM10 y BMH1 a BMH14. Lo que más se pregunta en academia no tiene ningún estudio con cifra: la desnaturalización que rompe enlaces peptídicos, el almidón igual a la celulosa y los errores de cálculo. Todo eso va como hipótesis.
- **Motor (`window.MotorBiomoleculas`).**
  - Condensación e hidrólisis, restando o sumando un H₂O por unión.
  - Sacáridos, péptidos (n − 1 enlaces) y polisacáridos (162n + 18 exacto, o (C₆H₁₀O₅)ₙ).
  - Triglicéridos con índices de saponificación y de yodo, e hidrogenación.
  - Desnaturalización y plegado, digestión con enlace α o β, y energía con los factores de Atwater.
- **Pruebas.** 30 casos, 10 problemas de papel y 51 pruebas.
- **Escena.** Un taller de bloques: cada bloque es una molécula entera y suelta una gota de agua al unirse.
  - **Paso a paso:** 4 predicciones (sacarosa, Gly-Ala-Ser, clara cocida, almidón contra celulosa).
  - **¿Qué pasa si…?:** 5 experimentos (hidrólisis de la sacarosa, 1000 glucosas, jabón con dos grasas, aceite que gana hidrógeno, vitaminas y energía). El 1 y el 2 se abren recién al responder los pasos 2 y 4, porque si no regalaban sus respuestas. La pestaña sigue abierta.

**Subagentes.**
- **Verificador:** armó cada molécula átomo por átomo y contó por enumeración. Coinciden los 30 casos con sus variantes; las diferencias son solo de forma.
- **Revisor:** ninguna grave. Medias:
  - «¿Qué pasa si…?» regalaba los pasos 2 y 4;
  - el vaso de E1 delataba la respuesta;
  - la forma de las opciones de E5 delataba la correcta;
  - respaldos BM1, BM6 y BM7 bajados a 'parcial';
  - la clara cocida, donde el punteado de las atracciones débiles casi no se veía (ahora hay dos estados fijos y un botón «Ver de nuevo»);
  - las notas sobre los puentes S–S y sobre α y β-glucosa;
  - títulos y botones que anticipaban respuestas.
  
  Todo corregido. Volvió a probar las 8 combinaciones con Playwright y el bloqueo por pasos de punta a punta.

**Pendiente.**
- Las cifras de BM1 a BM10 están por verificar contra los textos completos. La red bloqueó core.ac.uk, files.eric.ed.gov, pmc.ncbi.nlm.nih.gov, lifescied.org y otros.
- Alcaloides, polifenoles y colorantes no tienen escena: el informe no encontró nada.

**Pedidos para la integración.**
1. En `catalogo/cursos/quimica.json`, unidad `quimica.biomoleculas-y-productos-naturales`: `"plantillas": ["biomoleculas"]` e `"investigacion": "docs/investigacion/biomoleculas-ideas-erroneas.md"`. Mover `plantillas/biomoleculas/investigacion.md` ahí. Después, `npm run catalogo`.
2. En `docs/diseno.md`, variables de biomoléculas:
   - n, piezas: granate #570011 / #fbb1e5;
   - k, uniones: naranja #a05200 / #f0a04a;
   - Mp, masa de las piezas: verde #377703 / #97f91f;
   - Ma, 18 del agua: azul #1f5fbf / #7cb0ff;
   - M, masa de la molécula: fucsia #a10fbf / #cf6bfa.
   
   Son los mismos de líquidos y sólidos, con otro significado, y H y O vienen de la paleta común. Ojo: el O queda cerca de `--warn` y el H del verde de `--ok`; los dos siempre van con texto.
3. Una línea en `docs/pendientes.md` y otra en `CLAUDE.md`.

### rendimiento-pureza (terminada)

**Qué se hizo.** `plantillas/rendimiento-pureza/` (unidad `quimica.estequiometria`). Es la escena que faltaba según `docs/pendientes.md`; el informe es `estequiometria-ideas-erroneas.md`. En la sección «Rendimiento y reactivos impuros» todo es hipótesis.
- **Motor (`window.MotorRendimiento`):**
  - pureza;
  - rendimiento teórico, real, porcentual y en cadena;
  - problema inverso;
  - balance de masa en recipiente cerrado (lo que no se formó queda como reactivo sin reaccionar);
  - combustión incompleta;
  - volumen en condiciones normales;
  - equivalentes con θ declarado y la ley de equivalentes;
  - errores típicos: muestra como pura, olvidar el rendimiento, sumar porcentajes, dividir por η.
- **Números:** 29 casos, 10 problemas de papel y 53 pruebas.
- **Escena:**
  - montones de impureza, de puro y de producto, más la caja punteada del teórico;
  - 4 predicciones: el mineral de Fe₂O₃ (100,8 g), el rendimiento porcentual, el recipiente cerrado y el problema inverso;
  - 4 experimentos: rendimiento en cadena con 80 % y 60 %, mejorar la pureza contra mejorar el horno, gas en condiciones normales y equivalentes.

**Subagentes.**
- **Verificador:** recalculó por factores de conversión y por moles. Coinciden 142 de 145 campos; las 3 diferencias eran de interpretación de la cabecera, que ya está aclarada.
- **Revisor:** sin hallazgos graves. Los medios, ya corregidos:
  - la tapa del explorador para el experimento 2 era débil;
  - el experimento 1 ya estaba resuelto en el paso a paso, así que se cambiaron sus números;
  - el dibujo del gas contradecía el enunciado;
  - el reactivo puro no bajaba al reaccionar;
  - el celular en el paso 7;
  - la definición de pureza;
  - el par de colores teo y vol: vol pasó a vino #730030 / magenta #ff47c8;
  - la caja punteada «guardaba» masa.
  
  Además, 10 bajos. Se volvió a probar con Playwright en las 8 combinaciones.

**Pedidos para la integración.**
1. En `catalogo/cursos/quimica.json`, sumar `"rendimiento-pureza"` a las plantillas de `quimica.estequiometria`. Después, `npm run catalogo` y rebalancear el banco si hace falta.
2. En `docs/diseno.md`, los colores de rendimiento y pureza:
   - impureza: café #7a4a1e (oscuro #d9a877);
   - reactivo puro: turquesa #0d6f6b (#4fd1c5);
   - teórico: violeta #6a3fc0 (#b49cff), en la caja punteada;
   - real: verde #36700c (#8fd14f);
   - volumen en condiciones normales: vino #730030 (#ff47c8);
   - equivalentes: naranja #a04f00 (#ffa64d);
   - Fe y O, de la paleta común, solo en la lupa de la hematita.
   
   El ΔE00 mínimo entre los que salen juntos es 20,1. Ojo: el puro y el real quedan cerca del verde de `--ok`, que siempre va con texto.
3. Una línea en `docs/pendientes.md` y otra en `CLAUDE.md`.
