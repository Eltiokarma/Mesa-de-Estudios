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

**Siguiente en la cola:** `cinetica`.
