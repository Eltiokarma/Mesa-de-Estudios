# Rutina de física: reporte

Cada ejecución construye una plantilla de escena de física, completa y revisada, en la rama `rutina/fisica`. La conversación principal la integra (catálogo, diseño, pendientes). Orden de la lista: dinámica, tiro parabólico, estática, choques, fluidos, MAS, electrostática, ondas, termodinámica, magnetismo e inducción.

## Reglas vigentes para las próximas plantillas

- **Orden vigente** (aviso de la conversación principal, 7 nov 2026): choques, fluidos, MAS, ondas mecánicas, termodinámica y, después, gravitación. Electrostática, magnetismo, inducción, física moderna y ondas electromagnéticas pasaron a la rutina de física B (rama `rutina/fisica-b`): ya no son de esta lista.
- **Celular:** en las plantillas nuevas, usar `nucleo/celular.js` (ejemplo en `plantillas/mruv/`) en vez de copiar a mano el lienzo compacto y sticky.

- **Pastillas de «¿Qué pasa si…?» bloqueadas** (decisión de Gerson, 6 nov 2026, recibida de la conversación principal). Se puede ir a un experimento solo si todos los anteriores ya tienen respuesta. Los respondidos se revisitan libremente. Los bloqueados llevan `disabled`, `aria-disabled` y aria-label «Experimento N, bloqueado», igual que los puntos del paso a paso. También se cierran las otras vías de salto, como el hash o el teclado. La pestaña entre modos no se bloquea. En `dinamica/` lo arregla la conversación principal: no tocarla.
- Dinámica ya está integrada en `claude/awesome-wozniak-5etl1n` (catálogo, diseño, pendientes y el pedido del informe). Tiro parabólico (6 nov), estática, choques, fluidos, MAS, ondas mecánicas, termodinámica y gravitación (7 nov) quedaron hechos (abajo). Con esto la lista de física está completa. **Lista nueva (huecos de escenas hechas):** dinámica, tiro parabólico, energía, calorimetría, circuitos, espejos y Banco Óptico 0.3.0, todas hechas (abajo). La siguiente ejecución espera un orden nuevo de Gerson.
- Los avisos de «terminado» van a la conversación principal nueva: `session_01P39d2yUDZET7Wso3ubSiiV` (desde el 7 nov; la anterior era `session_01P39d2yLWTLWLv3TGZ6FkHB`). Ella integra estática.
- Desde el 7 nov la rutina sigue el método de `docs/metodo/`: constructor, verificador independiente con `entradas.py`, revisor y correcciones al mismo constructor. Lecciones nuevas de ese brief: al menos 4 predicciones en el paso a paso, opciones con la misma forma, ningún distractor que coincida con la respuesta, nombres de experimentos sin la respuesta y dibujo fijo y compacto arriba en el celular mientras hay predicción pendiente.

## 7 nov 2026 · Banco Óptico 0.3.0: correcciones (`plantillas/optica-lente-delgada/`)

La conversación principal lo agregó a la lista después de espejos. Lleva las mismas correcciones y no tiene contenido nuevo.

**Qué cambió.**

- **Celular.**
  - El lienzo acepta pinch-zoom.
  - Las animaciones usan Celular.bucle, sin requestAnimationFrame directo.
  - Hay tres arrastres con Celular.arrastre: el objeto en «Una lente», el objeto O en «Dos o tres lentes» y la pantalla en «Correr la pantalla». Hacen lo mismo que los deslizadores. Al arrastrar O el marco queda fijo, porque Chromium manda pointerdown antes que touchstart.
  - En los modos 1 y 2, al responder la pantalla baja hasta la retroalimentación; en el modo 3, el lienzo sube a la vista.
- **Colores.**
  - Chips al 8 % y .v.hl con contorno.
  - A tiene color propio, separado de h, y los rayos se separaron de f.
  - El anillo de foco va en tinta.
  - Lo correcto y lo incorrecto se marcan con --ok y --warn.
  - Los deslizadores llevan el color de su variable, y d₁₂ y d₂₃ van con el color de d.
- **Accesibilidad.** Los pasos bloqueados se leen «Paso N, bloqueado» y el aria-live solo anuncia la cabecera.
- **Retroalimentación.** Cada opción tiene la suya, en los 4 experimentos y en los dos pasos 3, con «hipótesis nuestra» donde no hay dato.
- **Respaldos.** Solo E5-pantalla-cualquier-lado bajó a parcial: el informe la describe sin cifra. Siguen 6 documentados, con cifras de John y otros (2017).
- **Opciones emparejadas.** Las de «Pantalla» y «Lente más ancha»; la correcta de «Correr la pantalla» ahora dice «La misma imagen, pero borrosa». La c de «Quitar la pantalla» era defendible y se reemplazó por «Se forma en otro lugar» (hipótesis).
- **Textos.**
  - Rayo por el centro: «como un vidrio de ventana».
  - «Paralelos al eje».
  - Decimales con coma: antes Chromium sacaba punto.
  - Rótulos que antes se enciman, ahora con un rotulador común.
  - Comillas latinas.
- **Desbordes a 390 px.** Las notas de las ecuaciones bajan a otra línea y las filas con «→» se parten. Se midió cada paso con scrollWidth, también con los deslizadores en sus extremos.
- **Casos.**
  - casos.json pasó al formato fn/args/espera con la función `problema()`, sin cambiar valores.
  - Valores exactos, con tolerancia 1e-9.
  - 9 casos: entran la imagen intermedia en el foco de la lente siguiente y o = 4 del explorador.
  - 30 pruebas.
- **Papel.** p8 tiene datos nuevos (f₁ = 8, f₂ = 12, d = 44, o₁ = 12; A = 3 e imagen a 74 cm), porque antes repetía el problema guiado.

**Verificador independiente.** Recalculó los 7 casos de dos maneras: con la ecuación de la lente encadenada en fracciones exactas, con el objeto virtual como o < 0, y con matrices ABCD y dos rayos paraxiales. Todo coincide. La conversación principal verificó los casos 8 y 9 y el nuevo p8.

**Revisor de contenido.**
- **Lo grave:** una retroalimentación nueva del paso 3 de «Una lente» decía que un objeto muy lejano forma su imagen entre la lente y F′. Es falso: con una lente convergente y un objeto real, la imagen siempre cae más allá de F′. Se corrigió.
- **Lo medio:** decimales con punto, desbordes de .eqs, la retroalimentación fuera de la pantalla en el celular, el anillo de foco del color de f, la opción c de «Quitar la pantalla» y d₁₂/d₂₃ sin color.
- **Lo bajo:** subíndices separados, la correcta que se distinguía en «Correr la pantalla», el arrastre de O, la opción c del paso 3, «algo más de un tercio», rótulos encimados y leyendas sin A ni rayos.
- **Lo que está bien:** los 6 respaldos documentados tienen su cifra, el convenio de signos es igual al de espejos y los números están bien.

**Colores** (para `docs/diseno.md`):

| Variable | Claro | Oscuro |
| --- | --- | --- |
| o | #a05200 | #f0a04a |
| f | #6b3dbd | #ab8cf2 |
| i | #0f766e | #3dcdc3 |
| h | #b02c41 | #f17384 |
| A | #3d2e00 | #ffdc14 |
| d | #466d14 | #a3d65e |
| rayos | #035c8c | #5cb8ff |

- Es la misma paleta que espejos.
- Antes h y A eran iguales y f–rayos tenía ΔE00 de 17,3 y 15,9. Ahora el mínimo es 22,0 en claro (f–rayos) y 21,5 en oscuro (A–d).
- AA mínimo: 4,63.

**Pedidos para la integración.**
1. `npm run catalogo` (0.3.0).
2. Colores en docs/diseno.md.
3. En `docs/investigacion/optica-ideas-erroneas.md`:
   - la tabla «Cruce», opción a, dice «Parcial», pero el código registra hipótesis (un escalón abajo); hay que actualizarla;
   - conviene confirmar en el PDF de John y otros (2017) qué mitad taparon. Si fue la de abajo, el «46 dijeron mitad de arriba» no corresponde al error de la escena.

## 7 nov 2026 · Calorimetría 0.2.0: dilatación y transferencia de calor (`plantillas/calorimetria/`)

Es el punto 4 de la lista nueva. El título pasa a «Temperatura y calor».

**Qué hay de nuevo.**

- **Cuatro pestañas en una grilla de 2 columnas.** A 390 px cada una mide 172 px y no hay desborde (scrollWidth = clientWidth).
  - «Dilatación» (8 pasos y 5 predicciones): el riel, la placa con 2α, la arandela, la tira bimetálica (de 120 °C, con un botón para enfriar) y el agua de 0 a 10 °C con la fórmula de Kell. Al final hay un explorador con asa.
  - «Transferencia» (9 pasos y 6 predicciones): el hielo sobre aluminio y madera (comparación cualitativa), Fourier, la ventana (caras a 20 y 5 °C, con la nota del aire pegado al vidrio), la barra en serie con la unión que se arrastra, la olla con convección, la noche en Puno (pérdida radiativa) y Stefan, marcado «Para la UNI».
  - «¿Qué pasa si…?» suma «Dos tazas» y llega a 6 experimentos.
- **Motor.** 14 funciones nuevas con `errores`, más las de apoyo, y las tablas de materiales, líquidos y efusividad. Las funciones de antes no cambian.
- **Casos y pruebas.** 39 casos, de los cuales 24 son nuevos, y 69 pruebas.
- **Letras.**
  - ℓ para la longitud, porque L es el calor latente.
  - 2α y 3α para área y volumen.
  - Q/t para el flujo.
- **Respaldos.**
  - Q2 documentado (Jara Guerrero 1991: el 48 % de 113 dijo que el hielo se derrite antes sobre la madera).
  - Parcial: Q10 («Dos tazas», porque no está el PDF de Georgiou y Sharma), Q11 (el agujero), Q12 (las nubes), Q6 y Q7.
  - Todo lo demás es hipótesis.
- **Papel.**
  - Salen p4, p7 y p9 y entran p10 a p13: el riel, la arandela, el derrame y la barra en serie.
  - El riel de p10 tiene datos distintos a los de la escena.
  - Quedan 10 problemas.
- **Lo que se arregló de lo publicado.**
  - Chips al 8 % y .v.hl con contorno.
  - La leyenda que regalaba el experimento 1.
  - Las opciones correctas que iban sin razón, ahora parejas.
  - «Toco el metal» C y D pasan a parcial.
  - Retroalimentación por distractor.
  - pinch-zoom.
  - Todas las animaciones con Celular.bucle.
  - Pasos bloqueados que se anuncian «Paso N, bloqueado».

**Verificador independiente.**
- **Métodos:** fracciones exactas y Decimal de 50 dígitos.
  - Dilatación exacta con (1+αΔT)ⁿ, comparada con 2α y 3α.
  - Timoshenko para la tira.
  - Resistencias ℓ/(kA) para la serie.
  - Stefan como razón de T⁴.
  - Bisección y búsqueda dorada para Kell y el frasco.
- **Resultado:** los 24 casos coinciden.
- **Pedidos, ya aplicados:**
  - la tabla de efusividades en la cabecera;
  - que los nombres de los casos 18 y 19 digan que usan la aproximación;
  - tolerancias escritas como relativas.

**Revisor de contenido.** No encontró nada grave.
- **Lo medio:**
  - el eje «no entra» delataba la respuesta de la arandela;
  - la «temperatura de contacto» de 18 °C sobre un hielo que se derrite no era física, y tampoco la cifra de 5,5 veces;
  - la noche en Puno no conectaba la pérdida con «amanece más fría»: ahora hay texto y el cielo está oscuro;
  - la razón del parcial de «Dos tazas» contradecía el informe;
  - la tira terminaba curvada hacia la opción incorrecta;
  - la fórmula del explorador se leía «212 × 10⁻⁶»;
  - los exploradores no actualizaban el aria-live;
  - la ventana parecía un dato real.
- **Lo bajo:**
  - unidades de k;
  - límites de los deslizadores;
  - mercurio a −40 °C;
  - ejes en turquesa;
  - p10 y p13;
  - una opción D.

**Colores** (para `docs/diseno.md`):

| Variable | Claro | Oscuro |
| --- | --- | --- |
| T | #c0364a | #f17384 |
| Q y Q/t | #1f5fbf | #7cb0ff |
| m | #a05200 | #f0a04a |
| c | #466d14 | #a3d65e |
| L | #a10fbf | #cf6bfa |
| α | #3328c4 | #9f9bff |
| ℓ | #0f766e | #5ed9c8 |
| A | #7d6a00 | #e3c84a |
| V | #5a1f08 | #f57a1f |
| k | #255c1f | #5fe06a |

- **ΔE00 mínimo por pestaña** (claro / oscuro):
  - Paso a paso y «¿Qué pasa si…?»: 25,9 / 26,9.
  - Dilatación: 24,5 / 26,9.
  - Transferencia: 20,4 / 21,2.
- **Pares por debajo de 20.** c–k (8,8), L–α, Q–α, c–A, m–A y m–V nunca salen en la misma pestaña. c va solo en las dos primeras y k solo en Transferencia.
- **AA mínimo:** 4,54.
- **Cruces con otras escenas:**
  - m, c y L cambiaron: diseno.md todavía trae m #b85a06, c #4f7a17 y L #6b3dbd morado.
  - Q sigue azul aquí, mientras que en termodinámica es naranja.

**Pedidos para la integración.**
1. `npm run catalogo`: cambian el título y la versión 0.2.0. No hace falta una unidad nueva, porque `fisica.temperatura-y-calor` ya trae dilatación y transferencia.
2. Llevar los colores a docs/diseno.md.
3. Actualizar pendientes. Si Gerson saca Stefan, se borran el paso 8 de Transferencia y su caso.

## 7 nov 2026 · Espejos esféricos 0.2.0: el doblez (`plantillas/optica-espejo-esferico/`)

Punto 6 de la lista nueva.

**Qué hay de nuevo.**

- **Paso 7, «La hoja que se dobla».** Muestra una lente de la misma f cuya hoja de salida se dobla 180° sobre la línea del espejo, como la página de un libro, con la regla de i viajando en la hoja.
  - No es metáfora: el rayo reflejado es el espejo del que atraviesa la lente.
  - F′ cae sobre F, 2F′ sobre C, y la imagen conserva su distancia a la bisagra.
  - Así se ve que «i > 0 = delante» es la misma regla de la lente, y la escena dice de frente que es un «truco de papel»: en el espejo la luz nunca pasa detrás.
  - Mientras la hoja está de canto no se pinta la imagen, para no reforzar S1.
  - En los cuadros intermedios una cota dice «30 cm, medidos en la hoja».
  - Con movimiento reducido son 3 cuadros (s = 0, 0,2 y 1), con un botón.
  - La pestaña de la hoja se arrastra (Celular.arrastre) y también hay deslizador y teclado.
  - El paso a paso queda con 10 pasos.
- **Experimento 5, «Doblo la hoja del convexo».** La imagen virtual pasa detrás, a 5 cm.
- **Motor.** Funciones nuevas: PROYECCION, pendienteLente, plegar, anchoHoja, sDeCanto, sMasCercano y hojaDeSalida. La cabecera describe cada campo.
- **Casos y pruebas.**
  - casos.json se migró al formato fn/args/espera, sin cambiar valores, y ahora entradas.py lo lee.
  - Hay 22 casos (D1 a D15 nuevos) y 62 pruebas, entre ellas 11 de propiedad.
- **Papel.** Entra p10 (la imagen de la lente y la del espejo, 72 cm entre ellas). Quedan 10 problemas.
- **Predicciones nuevas.**
  - El signo de i en el paso 7: los tres distractores son hipótesis.
  - Dónde queda la imagen del convexo al doblar: S1 parcial y dos hipótesis.
- **Lo que se arregló de lo publicado.**
  - 7 respaldos «documentado» pasaron a parcial.
  - El 80 % de lentes ahora se atribuye a John, Molepo y Chirwa (2017), no a Goldberg y McDermott.
  - «41,6 %» pasó a «cerca del 42 %».
  - Hay retroalimentación por distractor.
  - pinch-zoom.
  - «Muevo el ojo» usa Celular.arrastre, y el dedo lejos desplaza la página.
  - Celular.bucle en todas las animaciones.
  - Pasos bloqueados «Paso N, bloqueado».
  - Chips al 8 %.

**Verificador independiente.** Recalculó los 22 casos (los 7 migrados también):
- con 1/o + 1/i = 2/R en fracciones;
- con trazado de dos rayos con reflexión exacta;
- con el doblez como matriz de rotación más la proyección.

Con s = 1, la imagen de la lente doblada cae donde la pone el espejo. Todo coincide. Pidió documentar en la cabecera las salidas de hojaDeSalida, y ya está.

**Revisor de contenido.**
- **Lo grave:** con movimiento reducido, el cuadro intermedio (s = 0,5) dibujaba la imagen pegada a la línea del espejo mientras decía «sigue a 30 cm», justo la idea S1. Además, la regla de i se salía del lienzo. Se arregló con tres cambios: la regla siempre dentro, la cota medida en la hoja y el cuadro en s = 0,2.
- **Lo medio:**
  - la B del paso 3 decía «a 30 cm» y delataba la respuesta;
  - la D de «Quito la pantalla» era defendible y su retroalimentación era falsa;
  - una fuente citaba una cifra de Redish que el informe pide no usar con alumnos;
  - la lente abierta podía sembrar S6 («la luz atraviesa el espejo»), y ahora se presenta como truco de papel.
- **Lo bajo:**
  - el enunciado del paso 7 con la ecuación;
  - opciones del paso 3 más parejas;
  - la fuente del paso 7;
  - rótulos de F′ y de la pestaña;
  - la redacción y el orden de p10;
  - el id de la opción B;
  - el anillo de 2F′ con s ≥ 0,9.
- **Lo que se confirmó bien:** la física del doblez y que el convenio de signos es uno solo en la escena, el motor, el papel y el Banco Óptico.

**Colores** (para `docs/diseno.md`):

| Variable | Claro | Oscuro |
| --- | --- | --- |
| o | #a05200 | #f0a04a |
| f | #6b3dbd | #ab8cf2 |
| i | #0f766e | #3dcdc3 |
| h | #b02c41 | #f17384 |
| R | #466d14 | #a3d65e |
| rayos | #035c8c | #5cb8ff |
| A (nuevo) | #3d2e00 | #ffdc14 |

- A ya no comparte el rojo con h. Es el mismo ocre oscuro y amarillo del roce de energía, en otra escena.
- Par mínimo: f–rayos, con ΔE00 22,0 en claro y 25,6 en oscuro.
- AA mínimo: 4,63.

**Pedidos para la integración.**
1. `npm run catalogo` (0.2.0).
2. Los colores en docs/diseno.md.
3. En `docs/investigacion/optica-espejos-esfericos.md`, el «Hecho» quedó atrás: todavía dice «Falta la animación del doblez», «4 preguntas» y «9 problemas», y la tabla del paso 3 trae A y D como documentado (ahora son parcial).

## 7 nov 2026 · Circuitos 0.2.0: medidores que se arrastran (`plantillas/circuitos-cc/`)

Es el punto 5 de la lista nueva.

**Qué hay de nuevo.**

- **Pestaña «Medir» (tercera).** El circuito mixto tiene una pila de 6 V, B1 y, en paralelo, B2 y B3, todas de 12 Ω. Son 8 pasos con 5 predicciones:
  - M0, el amperímetro en serie;
  - M1, dónde se pone;
  - M2, el amperímetro en paralelo, que hace un corto;
  - M3, el voltímetro en serie, que marca casi la fem;
  - M4, el voltímetro real de 60 Ω, que marca 3,75 V.

  Además hay un banco libre con medidores ideales y reales (rₐ y Rᵥ).
- **Arrastre.** Usa Celular.arrastre, con imán al puesto más cercano a 48 px y el medidor 28 px sobre el dedo. Hay también un modo de dos toques y teclado: Enter, flechas, Escape y Supr. Los puestos se abren en orden.
- **Motor.** El amperímetro ideal es una rama de resistencia 0 y el voltímetro ideal no conduce; los reales llevan Rint.
  - Funciones: conectarMedidor, conectarMedidores, efectoMedidor (con siete diagnósticos), PUESTOS_MIXTO (diez puestos), medidoresMixto y prediccionesMedidores.
  - Avisos nuevos: `lectura-indeterminada` y `nodo-flotante`. Corrigen un error de antes: un amperímetro ideal en paralelo con un cable marcaba la mitad sin avisar.
  - Un amperímetro en paralelo nunca da «bien» ni «carga».
  - Los 9 casos de antes siguen igual.
- **Casos y pruebas.** 29 casos (20 nuevos) y 68 pruebas, entre ellas que el medidor real tiende al ideal.
- **Respaldos.**
  - Parciales: C15 («el amperímetro consume»), C2 y C7, con datos de errores vecinos.
  - Hipótesis, con «hipótesis nuestra» en pantalla: el amperímetro en paralelo y el voltímetro en serie (C15v). El informe los pone en «sin respaldo».
- **Papel.** Entran p10 (amperímetro en paralelo y voltímetro en serie) y p11 (voltímetros de 10 kΩ y 1 MΩ); sale p6. Siguen siendo 10, de básico a avanzado.
- **Lo que se arregló de lo publicado.**
  - Chips al 8 % y .v.hl con contorno.
  - Las tres correctas sin razón de «¿Qué pasa si…?».
  - Cinco «documentado» sin cifra pasaron a parcial.
  - Retroalimentación por distractor en el modo 2.
  - La cita del paso 3 («una», no «la primera»).
  - pinch-zoom.
  - La B3 quitada en el paso 8 ya no pasa al explorador.
  - Los pasos bloqueados se leen «Paso N, bloqueado».

**Verificador independiente.** El casos.json de esta plantilla tiene otro formato que entradas.py, así que la conversación principal le armó las entradas a mano, sin los valores.
- Recalculó los casos 10 a 28 con reducción serie-paralelo, fracciones y divisores, sin el método nodal. Los 19 coinciden.
- Pidió documentar en la cabecera PUESTOS_MIXTO y los diagnósticos. Ya está.
- Después de la revisión, cambiaron los diagnósticos de dos casos sin cambiar sus números:
  - el 23 (amperímetro de 2 Ω en paralelo) pasa a corto-elemento;
  - el 26 pasa a corto-pila.
- La conversación principal verificó el caso 29 (amperímetro de 0,1 Ω en la pila: 60 A) con fracciones.

**Revisor de contenido.**
- **Lo grave:**
  - La tabla del paso 8 daba «Sin el medidor: 0,33 A · 200 %» con el amperímetro mal conectado, y eso reforzaba los distractores M2 a y M3 a. Ahora dice «— (mal conectado)».
  - Un amperímetro real en paralelo con la pila salía «bien» con 60 A. Ahora es cortocircuito.
- **Lo medio:**
  - «Cambió un poco» salía siempre; ahora va según cambioMax.
  - La opción d de M2 no coincidía con su código.
  - En el celular, el bloque fijo ocupaba 450 de 844 px; ahora ocupa 253.
  - Desborde a 320 px.
  - Una retroalimentación remitía al paso equivocado.
  - El nombre de la fila con dos medidores.
- **Lo bajo:** textos de circuito abierto y de M4, la letra R repetida (ahora Rᵥ y rₐ), rótulos encimados a 320, la pastilla de corto cortada y el orden del papel.

**Colores** (para `docs/diseno.md`):
- **--corto nuevo:** #b81c0c en claro y #ff6b33 en oscuro.
  - Contraste: 6,15 en claro y 5,78 en oscuro.
  - ΔE00 de 22,6 o más con I, V, R, P y la tinta.
- --corto queda a 9,6 de --warn, pero nunca salen juntos: --warn va solo en las opciones.
- I, V, R y P no cambian; entre ellos el ΔE00 mínimo es 31,7 en claro.

**Pedidos para la integración.**
1. `npm run catalogo` (0.2.0).
2. Llevar --corto y su nota a docs/diseno.md.
3. Actualizar pendientes.
4. Que entradas.py acepte el formato de casos de circuitos (circuito/helper + esperado), o migrar circuitos al formato fn/args/espera, para que la próxima verificación no se arme a mano.

## 7 nov 2026 · Tiro parabólico 0.2.0: ruedas, pared y encuentros (`plantillas/tiro-parabolico/`)

Es el punto 2 de la lista nueva.

**Qué hay de nuevo.**

- **Tres pestañas:**
  - «Paso a paso», igual que antes.
  - «¿Qué pasa si…?»: los 4 de tiro, más «La pared» (altura del impacto) y «El golpe» (rapidez del impacto).
  - «Ruedas» (`#ruedas`), nueva: la rotonda y la honda (se mudaron con sus mismos ids), más la cadena (faja), la rueda de atrás (mismo eje), el frenado (MCUV) y la pista (encuentros, con un arco grueso que muestra lo que falta cerrar).
  - El explorador tiene una pared opcional que se arrastra.
- **Motor:**
  - Nuevas: `impactoPared`, `mcuvDatos` (tres de ω0, ω, α, t, θ) y `encuentroPista` (alcance y cruce, ventaja inicial y n-ésimo encuentro).
  - `mcuv` gana `frena: true`, sin retroceso.
  - `transmision` acepta engranaje, faja cruzada, sentido y la entrada por v1, f1 o rpm1.
  - Los 17 casos de antes siguen tal cual.
- **Casos y pruebas:** 37 casos (20 nuevos, N1 a N20) y 70 pruebas.
- **Papel:** p2, p8 y p10 son ahora la pared, la pista y la rueda que frena. El revisor cambió sus números para que no repitan los de la escena.
- **6 predicciones nuevas.** Solo 3 de los 18 distractores llegan a parcial: la suma de módulos (Flores-García 2009) y dos de G4 (Beichner 1994). Los demás son hipótesis, porque no hay estudios con cifra de transmisión, MCUV ni encuentros.
- **Notación:** f (vueltas/s) y ω (rad/s), las dos en turquesa; f = ω/2π.
- **Lo que se arregló de lo publicado:**
  - C2, K3, D9, «queda atrás» y P3-cae-en-picada pasan a parcial.
  - Las 9 correctas que iban sin razón ya la llevan.
  - Toda la escena usa `nucleo/celular.js`.
  - El verde de a pasa a #466d14 y los chips van al 8 %.

**Verificador independiente.** Recalculó N1 a N20 por otros caminos:
- la pared con y(x) y su pendiente;
- el MCUV con el área bajo f(t);
- las ruedas contando vueltas por perímetro y dientes;
- la pista con rapidez relativa.

Todo coincide. Pidió aclarar `vueltasEje`, que ahora es |f0|, lo que se lee en el eje al empezar.

**Revisor de contenido.** No encontró nada grave.
- **Lo medio:**
  - el papel repetía los números de la escena;
  - en «Frena la rueda», el pie decía que ac siempre supera a at (al final se hace cero);
  - una fuente le atribuía a Beichner algo que el informe no dice;
  - el rótulo de la respuesta se encimaba en «La pared»;
  - ω iba en vueltas/s;
  - P3 subía de más.
- **Lo bajo:**
  - código y fuente de «El golpe»; la azotea pasó a 50 m para que 25 m de altura y 25 m/s no coincidan;
  - la cadena giraba al revés, como pedaleando hacia atrás;
  - rótulos y redondeos de la pista;
  - el botón de «La rueda de atrás»;
  - el mensaje «cae justo al pie».

**Colores** (para `docs/diseno.md`):
- **at nueva:** #4a3b00 en claro y #ffde0a en oscuro. Contraste 10,3 y 12,3; ΔE00 mínimo 21,7 y 21,3 (con ac). Va en flechas de 4 px con halo y punta rellena.
- **a / ac:** #466d14 en claro. diseno.md todavía trae #4f7a17.
- **Lo demás no cambia:** vx #1f5fbf, vy #c0364a, v #8a2aa8, t #a05200 y ω/f #0f766e (claro).

**Pedidos para la integración.**
1. `npm run catalogo` (versión 0.2.0).
2. En `docs/diseno.md`: at y el verde nuevo de a.
3. Pendientes: corregir la línea de tiro parabólico. Decía que encuentros y pared ya estaban en el motor y en el papel, pero no estaban; ahora sí.

## 7 nov 2026 · Energía 0.2.0: fuerza variable (`plantillas/energia/`)

Este es el punto 3 de la lista nueva.

**Qué hay de nuevo.**

- **Modo «Fuerza variable»** (`#fuerza-variable`): 9 pasos y 4 predicciones que bloquean el avance. Al final hay un explorador con una gráfica F–x de 5 puntos, en x = 0 a 8 m y F de −40 a 40 N, en pasos de 5 N.
  - Los puntos se arrastran con Celular.arrastre (radio de 40 px) o con el teclado.
  - El área positiva va rellena y la negativa rayada. La barra de Ec muestra W neto = ΔEc.
  - Si el carrito se detiene, el área se pinta solo hasta ahí, y se lee «W hasta detenerse = −Ec0».
  - Antes de responder no se pinta ningún área: se ve «W = ?» y barras con «?».
- **Predicciones:**
  - El área de un trapecio (100 J). Los distractores G4 son parciales (Beichner).
  - Dos carritos de 2 y 8 kg con la misma fuerza: misma Ec. W6 es documentado (Singh y Rosengrant 2003, ítem 24).
  - El trabajo negativo resta (24 J).
  - El área del resorte de 0,1 a 0,3 m (24 J, no 36).
- **Motor:**
  - Funciones nuevas: validarGrafica, fuerzaEn, areaPartes, trabajoHasta, fuerzaVariable, recorridoFuerza (tiempo en forma cerrada por tramo) y resorteArea.
  - **Se corrigieron 3 errores de trabajoArea** que ningún caso pisaba:
    - límites al revés (daba −10 donde va −15);
    - fuera de la gráfica: ahora se rechaza con un mensaje;
    - salto vertical (daba 60 J donde van 80 J).
  - Ningún resultado de antes cambió.
- **Casos y pruebas:** 36 casos (19 nuevos) y 71 pruebas, entre ellas Simpson en 200 gráficas al azar, RK4 y el teorema trabajo-energía punto a punto.
- **Papel:**
  - p5 corregido: partía del reposo con F = 0 y nunca arrancaba.
  - p2, p3 y p6 se reemplazaron por p12, p11 y p13.
  - Quedan 10, ordenados por dificultad.
- **Lo que se arregló de lo publicado:**
  - Los pasos bloqueados se leen «Paso N, bloqueado».
  - W9 pasó a parcial.
  - El «20 J» del paso 2 va en el color de Ep.
  - Las leyendas de Ec y Ee ya no salen partidas.
  - Los chips van al 8 %.

**Verificador independiente.** Recalculó los casos 17 a 35:
- las áreas con fracciones exactas;
- los tiempos en forma cerrada (cosh/asinh), contrastados con RK4.

Todos coinciden. Aclaró dos lecturas, y en las dos tenía razón casos.json: v2 es v², y si el carrito se detiene, W es el trabajo hasta detenerse. Ahora las dos están escritas en la cabecera.

**Revisor de contenido.** No encontró nada grave.
- **Lo medio:**
  - El explorador decía «W neto = 20 J» con un carrito que se detenía (lo de arriba).
  - W9 subía de más.
  - La línea de F media no tenía rótulo.
- **Lo bajo:**
  - las opciones de P2 parejas (sin «porque»);
  - el caso en que el carrito llega justo a F = 0;
  - la leyenda;
  - la flecha de v en el borde;
  - rótulos encimados;
  - el rectángulo del paso 2;
  - la barra antes de soltar;
  - el orden del papel;
  - 2 px de desborde en los deslizadores.

**Colores** (para `docs/diseno.md`):

F no pudo quedarse igual. Con el celeste de Ec ningún azul llegaba a ΔE00 ≥ 20, así que también se movió Ec en claro.

| Variable | Claro | Oscuro |
| --- | --- | --- |
| F | #0039a3 | #99b6ff |
| x | #097163 | #52e0c9 |
| Ec | #1c719c | #2fc8ee |
| k | #9500eb | #e9adff |
| Ee | #850068 | #fb1fff |
| m | #ad4500 | igual |
| Ep | #030099 | #7a8aff |
| h | #466d14 | igual |

- En el modo nuevo, el ΔE00 mínimo es 20,1 en claro y 20,4 en oscuro. AA mínimo: 4,52.
- m sobre el papel pasó de 4,39 a 5,44.
- Siguen bajo 20, y ya estaban así: m–roce en los modos 1 y 2 (12,8 y 10,5) y v–P en el modo 2 (13,3 y 12,4). Hace falta un ajuste aparte.
- F–Ep queda en 12,2, pero nunca salen en el mismo modo.

**Arreglo de color posterior (7 nov 2026).** Lo pidió la conversación principal. m–roce y v–P salían juntos con ΔE00 de 10,5 a 13,3, lo que rompía la regla 4. Se movieron solo el roce y P, porque m y v comparten color con otras escenas:

| Variable | Claro | Oscuro |
| --- | --- | --- |
| f (roce) | #8f5800 → #3d2e00 | #ffc04d → #ffdc14 |
| P (potencia) | #b3246b → #520000 | #ff86bd → #7af2ff |

- Ahora ningún par que sale junto queda bajo 20:
  - modo 1: 20,1 en claro y 20,5 en oscuro (Ee–k);
  - modo 2: 21,0 en claro (v–m) y 21,5 en oscuro (f–h).
- Contra la tinta: f 33,8 y P 25,5 en claro; f 37,8 y P 32,1 en oscuro (medido por la conversación principal).
- AA mínimo: 9,4.
- Los dos cambian de tono entre modos:
  - el roce es café muy oscuro en claro y amarillo en oscuro;
  - P es granate en claro y celeste en oscuro, como Dc en interés.

**Pedidos para la integración.**
1. `npm run catalogo` (versión 0.2.0).
2. En `docs/diseno.md`: la tabla de colores de energía, con estos f y P nuevos. Además, cambiar «roce y calor ámbar» y «potencia P magenta».

## 7 nov 2026 · Dinámica 0.2.0: varios cuerpos y movimiento circular (`plantillas/dinamica/`)

Primer punto de la lista nueva de Gerson (huecos de escenas ya hechas). Se hizo después del commit de rendimiento (e11c420) y respeta Celular.dpr, Celular.variable y Celular.bucle.

**Qué hay de nuevo.**

- **Tres pestañas, como el Banco Óptico:**
  - «Paso a paso» no cambia.
  - «¿Qué pasa si…?» trae los experimentos de un cuerpo: saco quieto, ascensor, empujón, tirón, el columpio y la loma (estos dos son nuevos y son dinámica circular).
  - «Varios cuerpos» es nueva. Tiene Atwood y las dos cajas, que se mudaron con sus mismos ids de medición, más el tren de carritos, el bloque sobre otro y la polea móvil.
  - Cada pestaña bloquea sus experimentos en orden.
- **Motor:** solo se sumaron funciones (`vertical`, `loma`, `curva`, `tren`, `apilados` y `poleaMovil`), cada una con `errores`. Los 21 casos de antes siguen tal cual.
- **Casos:** ahora son 33. Los 10 nuevos se verificaron aparte, y la conversación principal recalculó los 2 de apilados con roce en el piso.
- **Pruebas:** 66 en verde.
- **Papel:** p3, p5 y p10 se reemplazaron por el carrito con la caja, la polea móvil y el balde en un círculo vertical.
- **5 predicciones nuevas:**
  - el columpio (cuántas fuerzas actúan; centrífuga D9 y «fuerza del movimiento» D1, ambas parciales);
  - la loma (N = 6000 N);
  - el tren (T₂ = 10 N);
  - el bloque sobre otro (van juntos, con 6 N de roce y no 8);
  - la polea móvil (la mitad de rápido).
  
  Los demás distractores son hipótesis.
- **Lo que se arregló de lo publicado:**
  - las predicciones viejas quedaron parejas;
  - D8, D11 y D10 pasaron a parcial;
  - los pasos bloqueados se leen «Paso N, bloqueado»;
  - los tres modos usan nucleo/celular.js;
  - al cambiar de pestaña, la animación salta a su final.

**Verificador independiente.** Recalculó los casos 21 a 30 por caminos distintos:
- ejes a lo largo de la pendiente en la curva;
- la tensión como lo que arrastran los carritos de atrás;
- en la polea móvil, una sola coordenada con masa efectiva m2 + m1/4;
- en apilados, primero el sistema y después el bloque de arriba.

Hizo unas 95 comprobaciones y no encontró discrepancias. Dedujo por su cuenta el Fmax de apilados con roce en el piso y confirmó la corrección del constructor al diseño: (fsA·M − mA·μPiso·M·g)/mB, o fsA si el piso aguanta más.

**Revisor de contenido.**
- **Lo grave:** a 390 px la página medía 448 de ancho, porque las tres pestañas no cabían. Ahora hacen salto de línea. Se medía mal porque innerWidth también daba 448; hay que medir con scrollWidth.
- **Lo medio:**
  - el asa de la rampa se alejaba del puntero por debajo de 30°;
  - las palabras de color no pasaban AA en claro (ahora el fondo va al 8 %, y al 4 % en N);
  - el respaldo de D10 subía de más;
  - el rótulo tapaba el auto de la loma.
- **Lo bajo:** p5 define a₁ y a₂, el rótulo del roce entre bloques, la flecha T del columpio, la amplitud del vaivén y el vacío en el tren.

**Colores** (para `docs/diseno.md`):
- **T₂ nuevo:** #5a1f08 en claro y #f57a1f en oscuro.
  - Contraste: 12,1 en claro y 6,0 en oscuro.
  - ΔE00 mínimo: 22,6 y 21,5, los dos con f.
  - Cambia de tono entre modos (tostado y naranja), como Dc en interés.
- **a₁ y a₂:** van en el turquesa de a, con el rótulo pegado a su cuerpo. Es la misma magnitud con dos valores (decisión aprobada).

**Pedidos para la integración.**
1. `npm run catalogo`: cambió el título y la versión es 0.2.0.
2. En `docs/diseno.md`: T₂, la regla de a₁ y a₂ y el fondo de los chips de dinámica al 8 % (N al 4 %).
3. Actualizar la línea de dinámica en pendientes: falta el péndulo en un vagón y la fuerza horizontal sobre el plano.
4. Las pestañas de las otras escenas con tres modos pueden tener el mismo desborde: medir con scrollWidth.

## 7 nov 2026 · Gravitación universal y satélites (`plantillas/gravitacion/`)

**Qué hay.**

`motor.js` (MotorGravitacion):
- **Valores de academia:** G = 6,67·10⁻¹¹, g0 = 10 m/s² y R = 6400 km. Se toma GM de la Tierra = g0·R², así g0 sale exacto. Otro planeta va como kM masas y kR radios terrestres.
- **Funciones:**
  - `fuerza` (tercera ley), `comparar`, `gAltura`, `alturaParaG` y `planeta`;
  - `orbita` (con estado(t) y las energías), `kepler3` y `geoestacionario`;
  - `escape` y `lanzamiento`: el cañón de Newton, con `vSinChoque`, la rapidez mínima para no chocar con el suelo;
  - `balanza` (ascensor) y `kepler2` (áreas iguales).
- **Errores:** cada resultado trae `errores`: 1/r en vez de 1/r², h en vez de R + h, olvidar el radio, rapidez según la masa, T ∝ r, «no hay gravedad», etc.

`casos.json`: 19 casos, entre ellos los 4 de gravitación que propone el informe: h = R da g/4 y el error lineal da g/2; h = R/2 da 4/9; la estación da 256/289; con a = 4, T sale 8 veces.

`motor.test.js`: 44 pruebas. Comprueba:
- F·r² constante e igual sobre los dos cuerpos;
- v²/r = g;
- T²/r³ constante;
- energía cero con la velocidad de escape;
- en el cañón, energía y momento angular punto a punto;
- áreas iguales medidas con triángulos.

`papel.json`: 10 problemas propios.

`index.html`:
- **Paso a paso:** 8 pasos con 5 predicciones:
  - la fuerza sobre la estación espacial (cerca del 89 %);
  - la fuerza de la estación sobre la Tierra (la misma);
  - a qué altura g baja a la cuarta parte;
  - la rapidez de dos satélites de distinta masa en la misma órbita;
  - el período a 4 veces el radio.

  Dibuja la Tierra y el satélite con las dos fuerzas F, la órbita animada, la cota de h con su rótulo hacia afuera, una flecha de referencia «F en el suelo» y la gráfica g–r contra la curva 1/r a trazos. En el explorador se arrastra el satélite y se cambia su masa.
- **«¿Qué pasa si…?»:** 5 experimentos con pastillas bloqueadas: cuatro veces más lejos, otro planeta, el ascensor con el cable cortado, el cañón de Newton desde una torre imaginaria y la órbita alargada (Kepler II).
- **Antes de responder:** toda fuerza desconocida es un trazo fijo de 12 px con «F = ?», y toda rapidez desconocida, solo el rótulo «v = ?». Así ninguna flecha delata la respuesta.

**Verificador independiente.** Recalculó los 193 campos con fracciones exactas y por otros caminos:
- g = GM/r²;
- T = 2πr/v;
- Newton-Raphson para el geoestacionario;
- rp·vp = ra·va.

Todo coincide y no hay ninguna discrepancia. Pidió aclarar en la cabecera que, en un lanzamiento que cae, rMin y rMax son el perigeo y el apogeo de la cónica completa; ya está.

**Revisor de contenido.** Lo que se corrigió:
- **Lo grave:**
  - El cañón decía que por debajo de la circular la bala cae. Desde 2R solo cae por debajo de 4,6 km/s, que ahora calcula el motor; entre eso y 5,7 km/s da vueltas en una elipse.
  - En el experimento del planeta y en el paso de la tercera ley, la flecha «F = ?» medía lo mismo que la respuesta correcta.
- **Lo medio:**
  - una opción D que no se sostenía;
  - el respaldo de T ∝ r bajó a hipótesis;
  - «recta a trazos» pasó a «curva a trazos»;
  - al cañón le faltaba la flecha de gravedad y la torre imaginaria no estaba explicada;
  - el satélite tapaba la cota de 400 km;
  - faltaba una flecha F en el suelo para comparar;
  - con movimiento reducido, el paso 6 no mostraba 8 vueltas contra 1;
  - la F del explorador no crecía con la masa.
- **Lo bajo:**
  - leyendas y rótulos encimados en el celular;
  - el resaltado de h, r, v y T;
  - textos más precisos;
  - «1000 kg» en vez de «1 t», para no confundir con T;
  - las flechas v del perihelio y del afelio en razón 4:1.

**Colores** (para `docs/diseno.md`):

| Variable | Claro | Oscuro |
| --- | --- | --- |
| F fuerza | #a10fbf | #d47afb |
| g gravedad | #456b14 | #a3d65e |
| v velocidad | #b03244 | #f27a8a |
| T período | #964d00 | #f0a04a |
| r distancia al centro | #1f5ebd | #7cb0ff |
| h altura | #0e6d66 | #5ed9c8 |

- Las masas, R, la energía, el área barrida y la aceleración del ascensor van en tinta.
- ΔE00 mínimo dentro de la escena: 23,3 en claro y 25,3 en oscuro (g–h).
- AA mínimo: 4,55.
- **Cruces entre escenas:**
  - En dinámica y estática, el azul es el peso P y el rojo la tensión T.
  - En el MAS, el fucsia es el período T, y aquí el período es naranja.
  - En choques, el verde es la altura h, y aquí h es turquesa.
  - En termodinámica, el naranja es Q.

**Pedidos para la integración.**
1. En la unidad `fisica.gravitacion`, agregar `"plantillas": ["gravitacion"]` y correr `npm run catalogo`.
2. Llevar los colores y sus cruces a `docs/diseno.md`.
3. Actualizar pendientes y `CLAUDE.md`.

## 7 nov 2026 · Termodinámica: primera ley, procesos y máquinas (`plantillas/termodinamica/`)

**Qué hay.**

`motor.js` (MotorTermodinamica): estado del gas ideal, procesos (isobárico, isocórico, isotérmico y adiabático), caminos de varios tramos, ciclo rectangular, primera ley, máquina térmica, Carnot y su ciclo, el juez del inventor, refrigerador y límites. La convención es la de las academias: Q > 0 si el gas recibe calor y W > 0 si el gas hace trabajo, con Q = ΔU + W, R = 8,31 y gas monoatómico. Cada resultado trae `errores`.

- `casos.json`: 20 casos.
- `motor.test.js`: 45 pruebas.
- `papel.json`: 10 problemas propios.

`index.html`:
- **Paso a paso:** 8 pasos con 5 predicciones:
  - el trabajo isobárico, con su signo (paso 2);
  - el calor en el mismo proceso (paso 3);
  - otro camino entre los mismos estados, donde W y Q cambian y ΔU no (paso 5);
  - el trabajo neto de un ciclo (paso 6);
  - la eficiencia de Carnot (paso 7).

  Hay un diagrama P–V con área rayada (W < 0) o rellena (W > 0), un cilindro con mechero, agua fría o baño, y barras de Q, W y ΔU. El explorador final deja arrastrar el estado B en los cuatro procesos.
- **«¿Qué pasa si…?»:** 5 experimentos con pastillas bloqueadas:
  - el cilindro aislado (compresión adiabática);
  - el baño a 300 K (isotérmico);
  - la vuelta al revés (el ciclo antihorario);
  - el inventor que promete superar a Carnot;
  - trabado o libre (Cv contra Cp).

**Verificador independiente.** Recalculó los 20 casos con fracciones exactas y por otros caminos. Todo coincide; solo difiere el nombre de la etiqueta `sentido` del caso isocórico, que no es física.

**Revisor de contenido.** Lo que se corrigió:
- **Lo grave:**
  - «La vuelta al revés» mostraba un «refrigerador» con COP 4,75, por encima de Carnot (0,2). El gas absorbe ese calor mientras se calienta de 300 a 1800 K, no lo saca de un lugar frío. Se quitó el COP y se explica qué llaman refrigerador las academias.
  - El papel p1 tenía datos imposibles para cualquier gas ideal (salía Cv = 2/3 R). Se rehízo con 2250 J, W = 900 J y ΔU = 1350 J.
- **Lo medio:**
  - Mientras la predicción estaba pendiente, la leyenda decía «+ si se expande» y eso regalaba el signo.
  - En «El inventor» la opción C acertaba el veredicto; ahora también se pregunta «¿Por qué?».
  - El «mechero» enfriaba cuando Q < 0; ahora dice «agua fría».
  - En el celular se enciman los rótulos del explorador en los extremos.
  - Dos respaldos eran inconsistentes (T10 y T3).
- **Lo bajo:**
  - p9 decía 3455 en vez de ≈ 3455.
  - La barra pasó a «Qf (sale)».
  - El paso 7 ahora rotula °C = K.
  - Se cambiaron frases de «Cilindro aislado» y la nota del isotérmico.
  - Las barras ya se ven en pantalla grande.
  - Se usan Cp y Cv.

**Colores** (para `docs/diseno.md`):

| Variable | Claro | Oscuro |
| --- | --- | --- |
| P | #1f5fbf | #7cb0ff |
| V | #466d14 | #a3d65e |
| T | #b02c41 | #f5899a |
| Q | #924a00 | #f0a04a |
| W | #a10fbf | #d888fb |
| ΔU | #0c6b63 | #5ed9c8 |

- ΔE00 mínimo dentro de la escena: 23,0 en claro y 23,6 en oscuro.
- AA mínimo: 4,52, el de P sobre una opción ya respondida mal. Pasa justo.
- **Cruces entre escenas:**
  - Q es naranja aquí y azul en calorimetría. Su tono oscuro, #f0a04a, es igual a la m de calorimetría y a la n de gases.
  - En claro, Q queda a 5,3 de la P ámbar de fluidos.
  - W tiene el mismo fucsia que la F de dinámica. El trabajo ya va en tres colores entre escenas: azul en energía, granate en electrostática y fucsia aquí.
  - V y T son casi iguales a las de gases.

**Pedidos para la integración.**
1. En la unidad `fisica.termodinamica`, agregar `"plantillas": ["termodinamica"]` y correr `npm run catalogo`.
2. Llevar los colores y sus cruces a `docs/diseno.md`.
3. Actualizar pendientes y `CLAUDE.md`.

## 7 nov 2026 · Ondas mecánicas y sonido (`plantillas/ondas/`)

**Qué hay.**

`motor.js` (MotorOndas):
- **Cuerda y pulsos:** cuerda con v = √(T/μ), onda y función de onda, la mano que agita, el pulso, una carrera de pulsos y la cuerda con mano y unión, con las reflexiones exactas.
- **Medios y superposición:** cambio de medio (f se conserva; r y t), dos pulsos que se cruzan, onda estacionaria y sus modos.
- **Sonido:** tubos, rapidez del sonido en el aire, decibeles (también con los logaritmos de academia: log 2 = 0,3 y log 3 = 0,48), suma de niveles, distancia, Doppler y onda longitudinal.
- **Errores:** cada resultado trae `errores`. La cabecera explica cómo se calcula cada uno.

`casos.json`: 31 casos, entre ellos todos los de ondas y sonido del informe.

`motor.test.js`: 51 pruebas. Comprueba:
- la ecuación de onda y que la forma se traslada;
- que v no depende de A ni de f;
- el retraso x/v;
- la continuidad en la unión (1 + r = t);
- la superposición;
- la estacionaria como suma de dos ondas viajeras;
- los decibeles y el Doppler;
- que el error `lambdaFija` nunca coincide con la respuesta.

`papel.json`: 9 problemas propios: la soga en la plaza, la guitarra, el bus en Lima, la zampoña y otros.

`index.html`:
- **Paso a paso:** 8 pasos con 4 predicciones:
  - qué hacer para que el pulso llegue antes (una carrera de 5 carriles);
  - la mano a 200 Hz;
  - qué hace la cinta;
  - la fundamental con los dos extremos fijos.

  La cuerda tiene puntos marcados y va sincronizada con la foto y-x y con la y-t de la cinta, en cámara lenta (1 s de pantalla son 10 ms). En el explorador, «Agito yo» deja arrastrar la mano.
- **«¿Qué pasa si…?»:** 5 experimentos con pastillas bloqueadas: la cuerda más tensa, dos cuerdas unidas (con el pulso reflejado invertido y el transmitido), dos pulsos de frente, la pelusa frente al parlante y dos parlantes de 80 dB.
- **Letras:** T es la tensión, en turquesa, porque en v = √(T/μ) sale junto a v. El periodo va sin letra (1/f), y así se explica en el paso 1.

**Verificador independiente.** Usó husos de λ/2, decibeles comparando intensidades, Doppler contando frentes de onda e impedancias Z ∝ 1/v. Coincidieron los 127 campos que se podían recalcular. Encontró que el error `lambdaFija` coincidía con la λ correcta en el caso 9.
- El constructor cambió el motor para que ese error use la frecuencia de antes. Agregó un caso y una prueba de que nunca coincide.
- Esos campos ya no son exactamente los que verificó.
- Los 6 errores que no se podían derivar de la cabecera quedaron documentados en ella.

**Revisor de contenido.** Los números estaban bien. Lo que se corrigió:
- **Lo grave:**
  - el paso 4 ya mostraba la cinta subiendo y bajando, que es la respuesta del paso 5;
  - el paso 3 mostraba 23 ms en el dibujo contra 20 ms en la ecuación;
  - con movimiento reducido, el explorador se quedaba plano;
  - con movimiento reducido, el pulso reflejado invertido de la unión nunca se veía.
- **Lo medio:**
  - el respaldo del paso 4 pasó a parcial (el 46 % es del «sonido agudo más rápido»);
  - una cita decía más que el informe;
  - en los dos parlantes faltaba la premisa de sonidos independientes;
  - los ejes delataban la respuesta antes de responder;
  - una frase del paso 7 se contradecía;
  - los pulsos atravesaban la pared;
  - el medidor quedaba tapado con 10 parlantes y marcaba «?» con un parlante prendido.
- **Lo bajo:** leyendas, forma de las opciones, el enunciado de los pulsos, rótulos encimados, la raíz partida en dos líneas, el charango cambiado por guitarra y la indicación del papel, que adelantaba una predicción.

**Colores** (para `docs/diseno.md`):

| Variable | Claro | Oscuro |
| --- | --- | --- |
| A | #1f5fbf | #7cb0ff |
| f | #a10fbf | #cf6bfa |
| λ | #466d14 | #a3d65e |
| v | #c0364a | #f17384 |
| t | #a05200 | #f0a04a |
| T tensión | #0f766e | #5ed9c8 |
| I | #3328c4 | #9f9bff |
| β | #7d6a00 | #e3c84a |

- μ, x, y, la cuerda y la cinta van en tinta.
- ΔE00 mínimo entre los que salen juntos: 23,6 en claro y 25,3 en oscuro.
- AA mínimo: 4,54.
- Entre escenas: la tensión es turquesa aquí y roja en dinámica; el fucsia es F en dinámica y aquí es f.

**Pedidos para la integración.**
1. En la unidad `fisica.ondas-mecanicas`, agregar `"plantillas": ["ondas"]` y correr `npm run catalogo`.
2. Llevar los colores y sus cruces a `docs/diseno.md`.
3. Actualizar pendientes y `CLAUDE.md`.

**Pendiente.** Tubos y Doppler están en el motor y en los casos, pero no en la escena. Tampoco hay barrido de frecuencias con resonancia.

## 7 nov 2026 · Movimiento armónico simple (`plantillas/mas/`)

**Qué hay.**
- `motor.js` (MotorMAS):
  - `resorte` horizontal y vertical, con deq = mg/k y el mismo período en los dos;
  - `estado(t)` con el punto del círculo de referencia;
  - vmax, amax y energías;
  - `pendulo`, con g efectiva (ascensor o vagón) y corrección de amplitud grande;
  - `comparar`, que da las razones entre dos sistemas;
  - `resortes` en serie y en paralelo.

  π es el real; con `pi2:true`, π² ≈ 10 solo en T y f. Cada resultado trae `errores`.
- `casos.json`: 23 casos, entre ellos los 4 del informe.
- `motor.test.js`: 49 pruebas. Comprueban la conservación de la energía, que v y a sean derivadas numéricas, que el movimiento se repita cada T, la sombra del círculo de referencia, que T no dependa de A ni de la masa del péndulo, el mismo T en vertical y en el ascensor, y que en A/2 la cinética sea 3/4 de E.
- `papel.json`: 10 problemas propios.
- `index.html`:
  - **Paso a paso:** 8 pasos con 4 predicciones: T al soltar desde el doble de amplitud, T con 1,6 kg, dónde va más rápido y dónde acelera más, y Ec en A/2. El bloque y el resorte van sincronizados con las gráficas x-t, v-t y a-t, el círculo de referencia y las barras de energía. En el explorador, el bloque se arrastra (en la mesa o colgado).
  - **«¿Qué pasa si…?»:** 5 experimentos con pastillas bloqueadas: péndulo con la masa, péndulo con el largo, resorte colgado, ascensor y resortes en serie o en paralelo.
  - Usa `nucleo/celular.js`.

**Verificador independiente.** Trabajó con energía para vmax, el círculo de referencia para los instantes, un diagrama de fuerzas para la g efectiva, y fuerza con estiramiento para serie y paralelo. Coincidieron los 23 casos. Encontró un problema real, ya corregido: `errores.periodoConG` daba el período correcto (deq/g = m/k), así que un distractor con ese valor habría sido correcto. Ninguna opción lo usaba.

**Revisor de contenido.** Recalculó todo y estaba bien. Lo que se corrigió:
- **Lo grave:**
  - El paso 2 tenía O1 como «documentado». El 25 % es una explicación de universitarios de tercer año, no esa opción: ahora es «parcial», en sus dos versiones numéricas.
  - Los chips no pasaban AA sobre las opciones ya respondidas. Cambió la paleta y t pasó a tinta.
- **Lo medio:**
  - «a = 0 en los extremos» pasó a C1 «parcial» (Thornton y Sokoloff).
  - En la fuente de O3 cambió «documentado» por «descrito».
  - El subtítulo adelantaba que importan la masa y el largo.
  - Había rótulos encimados en el resorte colgado y en el explorador.
  - «Uno al lado del otro» dibujaba un solo resorte.
  - El chip de cámara lenta ahora aclara que las gráficas marcan el tiempo real, y no sale con movimiento reducido.

**Colores** (para `docs/diseno.md`):

| Variable | Claro | Oscuro |
| --- | --- | --- |
| x | #1f5fbf | #7cb0ff |
| v | #b02c41 | #f6909d |
| a | #466d14 | #a3d65e |
| T período | #a10fbf | #d98bfb |
| Ec | #0b6b63 | #5ed9c8 |
| Ep | #944b00 | #f0a04a |

- t va en tinta, igual que A, m, k, L, g, ω, φ y E.
- ΔE00 mínimo: 23,1 en claro y 23,9 en oscuro.
- AA mínimo: 4,52, también en chips sobre opciones respondidas.
- Entre escenas: el fucsia es F en dinámica y aquí es T; el turquesa es la aceleración en dinámica y aquí es Ec; el naranja de Ep es el de t en otras escenas.

**Pedidos para la integración.**
1. Unidad `fisica.oscilaciones` → `"plantillas": ["mas"]`, y `npm run catalogo`.
2. Los colores en `docs/diseno.md`, con sus cruces entre escenas.
3. Pendientes y `CLAUDE.md`.
4. Hay que decidir si t en tinta (aquí) se vuelve la norma cuando el naranja no pasa AA en chips de opciones respondidas.

**Pendiente.** π² ≈ 10 solo aparece en el papel (p4), no en la escena.

## 7 nov 2026 · Fluidos: presión, Pascal y Arquímedes (`plantillas/fluidos/`)

Se construyó en paralelo con choques, con el mismo método.

**Qué hay.**
- `motor.js` (MotorFluidos):
  - presión manométrica y absoluta a una profundidad;
  - recipientes de cuatro formas (ancho, estrecho, botella con techo y embudo), con la paradoja hidrostática: en la botella, el techo empuja hacia abajo y el fondo recibe 20 000 N aunque el agua pese 11 000 N;
  - presión en cualquier punto;
  - vasos comunicantes, tubo en U con dos líquidos y barómetro;
  - prensa hidráulica con trabajo igual en los dos émbolos;
  - empuje: fracción sumergida, peso aparente, bloque atado al fondo y cinco bloques del mismo tamaño soltados bajo el agua;
  - el bloque en el dinamómetro que baja a un vaso sobre la balanza;
  - continuidad y Bernoulli.

  La cabecera documenta la geometría de cada recipiente.
- `casos.json`: 18 casos. Incluye los nueve que propone el informe.
- `motor.test.js`: 39 pruebas. Comprueba:
  - fuerza en el fondo = peso del agua + fuerza de las paredes, sumada por franjas;
  - presiones iguales en la interfaz del tubo en U;
  - el volumen que baja en la prensa es igual al que sube;
  - las ideas F1, F2, F3, F4, F10, F11, F12 y F13;
  - dinamómetro + balanza = peso total siempre.
- `papel.json`: 9 problemas propios: cisterna, tanque con tubo, tubo en U, barómetro en Juliaca, gata, tronco de eucalipto, piedra en el dinamómetro, vaso en la balanza y manguera. El de Bernoulli es para San Marcos.
- `index.html`:
  - **Paso a paso:** 8 pasos con 6 predicciones:
    - el fondo de los tres recipientes;
    - el sensor bajo el techo;
    - el dinamómetro;
    - la balanza;
    - el bloque 5 cm más hondo;
    - otro bloque del mismo tamaño.

    El sensor se arrastra. El explorador tiene bloque, líquido y profundidad.
  - **«¿Qué pasa si…?»:** 5 experimentos con pastillas bloqueadas: las dos ramas, la prensa, agua sobre mercurio, cinco bloques y un cubo en dos líquidos.
  - Usa `nucleo/celular.js`. El peso se rotula W, para que P sea la presión.

**Verificador independiente.** Leyó solo la cabecera y usó otros caminos:
- prensa por trabajo;
- balanza por el balance de fuerzas del sistema;
- tubo en U igualando presiones;
- paradoja con el peso del agua más la fuerza del techo.

Coincidieron 131 campos. Las 3 diferencias fueron de nombre o de interpretación. Pidió documentar la geometría y los errores en la cabecera, y ya está.

**Revisor de contenido.** Recalculó todo y estaba bien. Lo que se corrigió:
- **Grave:**
  - «Un cubo en dos líquidos» mostraba «E = 12 N» antes de responder.
  - «el más liviano recibe más empuje» iba como documentado sin dato; ahora es hipótesis.
- **Medio:**
  - Los cinco bloques ya no se colorean (madera o metal) antes de responder.
  - La flecha de E ya no se dibuja antes de responder en los pasos 4 y 7, porque descartaba opciones.
  - El código de «agua de encima» pasó a uno propio.
  - Agua sobre mercurio, opción C: pasó a hipótesis.
  - Prensa:
    - «P en todo el aceite» se cambió por «la mano agrega», con los émbolos a la misma altura;
    - quedan «trabajo de la mano» y «trabajo sobre la carga».
  - Rótulos que se encimaban con valores extremos.
- **Bajo:**
  - redondeos que no cuadraban;
  - el paso 6 ahora muestra la diferencia de presiones antes y después;
  - la cita de Loverude (el 10 % es de segundo año).

**Colores** (para `docs/diseno.md`):

| Variable | Color | Claro | Oscuro |
| --- | --- | --- | --- |
| W peso | azul | #1f5fbf | #7cb0ff |
| N (balanza, techo, fondo) | verde | #4f7a17 | #a3d65e |
| T tensión, dinamómetro | rojo | #c0364a | #f17384 |
| F mano | fucsia | #a10fbf | #cf6bfa |
| E empuje | turquesa | #0f766e | #5ed9c8 |
| P presión | ámbar | #a35700 | #ef6f06 |
| h profundidad | sepia | #392f0e | #f9bd0b |

- Dentro de la escena:
  - el ΔE00 mínimo es 24,4 en claro y 25,3 en oscuro (el par N–E);
  - todos los colores pasan AA; el chip de N va con fondo al 4 %.
- Entre escenas (lo detectó el revisor; buscó reemplazos y ninguno quedó mejor, así que se dejan y se documentan):
  - P claro queda a ΔE00 5,9 del ámbar del roce y a 1,9 del naranja de t;
  - h oscuro queda a 5,0 del roce oscuro;
  - h claro casi parece tinta;
  - en gases la presión es azul, y aquí el azul es el peso.

**Pedidos para la integración.**
1. Unidad `fisica.fluidos` → `"plantillas": ["fluidos"]`, y luego `npm run catalogo`.
2. Los colores y sus cercanías en `docs/diseno.md`.
3. En el informe de fluidos, la línea 183 da 15–25 % para «el más liviano recibe más empuje», pero la fila F10 no tiene ese dato (parece mezclar el 15 % de segundo año con el 25 % de aciertos). Conviene corregirla, y separar «agua de encima» (30–50 %, Loverude) en su propia fila.
4. Pendientes y `CLAUDE.md`.

**Pendiente.** Continuidad, Bernoulli y el barómetro están en el motor y en el papel, pero no en la escena. Tensión superficial no se cubre.

## 7 nov 2026 · Choques: impulso y cantidad de movimiento (`plantillas/choques/`)

Gerson pasó a un plan más amplio: ya no hay límite de una plantilla por ejecución, y se permiten hasta 3 subagentes a la vez (aviso de la conversación principal). Choques y fluidos se construyeron en paralelo. A mitad de camino el contenedor se reinició; los constructores se retomaron desde su transcripción y no se perdió nada.

**Qué hay.**
- `motor.js` (MotorChoques):
  - choque en una recta con coeficiente de restitución e: elástico, inelástico y plástico; velocidades finales, p y Ec de cada carrito, Ec perdida, impulsos y v_cm;
  - `escenario`, con el estado en cada instante;
  - choque en el plano;
  - pared y rebote en el piso;
  - impulso y pulsos F-t (triangular, rectangular, seno) con su área;
  - centro de masa y explosión (retroceso);
  - péndulo balístico y su inverso.

  Cada resultado trae `errores`.
- `casos.json`: 21 casos. Incluye los 5 que propone el informe.
- `motor.test.js`: 47 pruebas. Comprueba que p se conserva y la Ec nunca crece, e = alejamiento/acercamiento, J₁ = −J₂, el centro de masa a velocidad constante, que el área de cualquier pulso es J, que solo con masas iguales se intercambian las velocidades, y la pérdida M/(m + M) del péndulo.
- `papel.json`: 10 problemas propios.
- `index.html`:
  - **El riel:** visto de costado, con flechas de v. Debajo, filas de antes y después: p como flechas que se suman con su sentido y Ec como barras (la Ec perdida, rayada). También muestra la caja del sistema, el par de fuerzas y el centro de masa ⊕.
  - **Paso a paso:** 8 pasos con 4 predicciones (p de cada carrito, v', la Ec después y el choque elástico de 1 kg contra 2 kg). Tiene un explorador con la flecha del carrito 1 arrastrable.
  - **«¿Qué pasa si…?»:** 5 experimentos con pastillas bloqueadas y gráficas F-t con el área pintada: dos pelotas y una pared (M3), pared o costal (M7), se quema el hilo, el bloque colgado (M6) y el carrito que rebota (M2).
  - **Celular:** usa `nucleo/celular.js`.

**Verificador independiente.** Trabajó sin el motor ni los casos, con fracciones. Usó el sistema del centro de masa (u' = −e·u), la Ec perdida como (1 − e²)·½μ·v_rel², las áreas F-t por figuras y el triángulo de p en el plano. No hubo discrepancias de física; las diferencias fueron de convención. El distractor `FmaxPorDt` (20 N·s) no lo usa ninguna predicción; en el papel aparece con su unidad.

**Revisor de contenido.** Los números estaban bien, y los cuatro «documentado» tienen dato para ese error en esa pregunta: M3 50 %, M7 19 %, M6 37 % y M2 26 %. Lo que se corrigió:
- **Lo grave:**
  - la letra A nombraba a la vez un carrito y una alternativa; ahora los carritos son 1 y 2 en todo el paso a paso;
  - «El carrito que rebota» mostraba «p después» antes de responder;
  - el chip de p en oscuro no pasaba AA.
- **Lo medio y lo menor:**
  - el subtítulo inexacto;
  - el resaltado al pasar sobre un dato, que se prometía y no existía;
  - los rótulos con «·», que se leían como multiplicación;
  - la forma de las opciones de las pelotas y la tercera ley;
  - «la Ec aparece de la nada»;
  - el Δt pasó al naranja de t de las otras escenas;
  - rótulos encimados.

**Colores** (para `docs/diseno.md`):

| Variable | Color | Claro | Oscuro |
| --- | --- | --- | --- |
| v | rojo, como en MRUV | #c0364a | #f17384 |
| p, también Δp y el área F-t | índigo | #0b0b8e | #7b95ff |
| Ec | celeste | #08709e | #25caf4 |
| F | fucsia, como en dinámica | #a10fbf | #cf6bfa |
| Δt | naranja de t | #a05200 | #f0a04a |
| h | verde | #4b7416 | #a3d65e |

- Masas, e y el centro de masa en tinta.
- ΔE00 mínimo: 22,0 en claro y 21,3 en oscuro (el par p–F).
- AA: el mínimo es 4,56.
- Notas para `diseno.md`:
  - el índigo de p es el mismo de Ep en energía (son cosas distintas en escenas distintas);
  - el celeste de Ec es un poco más oscuro que el de energía, para pasar AA en el chip.

**Pedidos para la integración.**
1. Unidad `fisica.impulso-y-choques` → `"plantillas": ["choques"]`, y luego `npm run catalogo`.
2. Los colores de arriba en `docs/diseno.md`.
3. Pendientes y `CLAUDE.md`.
4. Si toca, rebalancear `catalogo/pruebas/fisica.json`.
5. Fijar en `docs/metodo/` qué significa «parcial». Aquí se usó como «la cara numérica de un error documentado» (por ejemplo, M5).

**Pendiente.** El choque en dos dimensiones está en el motor y en el papel (p10), pero no en la escena.

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
