# Pendientes y traspaso

5 de noviembre de 2026 · Cierre de la sesión de trabajo con Gerson. La siguiente sesión empieza aquí, en otra ventana y con otra cuenta de Claude. Léelo después de `CLAUDE.md`.

## Cómo arrancar una sesión nueva

```bash
npm test
```

Deben pasar 1882 pruebas.

```bash
npm run dev
```

Abre la app en <http://localhost:4173/app/> y el Gantt editable en <http://localhost:4173/gestion/>.

```bash
bash fuentes/descargar.sh
```

Baja los PDF de Google Drive (simulacros y temarios de San Marcos), que no se versionan. Solo hace falta para clasificar preguntas.

Si hay que hacer OCR, instala tesseract en español: `apt-get install -y tesseract-ocr tesseract-ocr-spa poppler-utils`. Luego usa `herramientas/ocr_pdf.sh`.

- **Si el servidor local muere:** se reinicia con `node herramientas/servidor.js`. También hay que reiniciarlo después de cambiar `herramientas/construir-catalogo.js`, porque guarda el módulo en memoria.
- **Para verificar a mano:** Playwright y Chromium ya vienen instalados en el entorno en la nube (`require('playwright')`). Las capturas *fullPage* pierden la emulación táctil, así que lo que depende de `hover` se revisa con capturas normales.

## Qué hay hecho

| Bloque | Estado |
| --- | --- |
| Documentos | Fundacional, arquitectura, diseño, temarios de la UNI y de San Marcos, clasificación de San Marcos, 12 informes de ideas erróneas, visión a futuro y hoja de ruta (Gantt) |
| Catálogo | 8 cursos y 151 unidades, con su universidad (UNI, San Marcos) y su grado (3.º, 4.º o 5.º, estimado) |
| App (PWA) | Bienvenida, inicio, cursos, práctica, lápiz y papel, progreso y perfil. Funciona sin conexión y en celular y computadora (menú lateral desde 900 px, atajos de teclado). Diseño acogedor con ilustraciones SVG propias |
| Medición | Pruebas de entrada y salida y registro anónimo de cada predicción, también desde las escenas. Se exporta a CSV o JSON desde Perfil; `herramientas/analizar-medicion.js` junta los archivos |
| Plantillas de escena | Banco Óptico (lentes), espejos esféricos, circuitos de corriente continua, calorimetría con cambios de fase, trabajo y energía (rampa con resorte), MRUV con gráficas, reactivo limitante con partículas, gases a nivel de partículas, soluciones con cuadros y puntos, ácidos, bases y pH, y la celda galvánica. Cada una con motor, casos verificados con fracciones, paso a paso con predicción, "¿qué pasa si…?" y 9 problemas de papel |
| Plantillas de predicciones | Reactivo limitante (química) y aumentos y descuentos sucesivos (aritmética), con generador por semilla |

## Pendientes, en orden de prioridad

### 1. Contenido para el lanzamiento (lo más importante)

Cada módulo nuevo sigue el molde de `plantillas/circuitos-cc/`:
- `motor.js`, `casos.json` verificados con fracciones por otro método, `motor.test.js` y `papel.json`;
- `index.html` con "Paso a paso" y "¿Qué pasa si…?" y la cáscara crema;
- `registrarPrediccion` con ids de error del informe.

Después se agrega a la unidad en `catalogo/cursos/*.json` y se corre `npm run catalogo`.

| Id | Módulo | Informe de ideas erróneas | Nota |
| --- | --- | --- | --- |
| ma2 | Geometría | Hechas: `ampliadora`, `triangulo-estira`, `angulo-inscrito`, `poligonos`, `solidos` y `geometria-analitica` | Falta congruencia (sesión matematica-b) |
| ma1 | Trigonometría | Hechas: `cinta-radio`, `circunferencia-trig`, `caso-ambiguo` e `identidades-trig` | Faltan funciones trigonométricas inversas (sesión matematica-a) |
| ma3 | Álgebra | Hechas: `grafica-perillas`, `traductor-enunciados`, `cuadrado-crece` (productos notables y factorización), `sucesiones`, `exponenciales-logaritmos` y `polinomios` (Ruffini, resto, raíces racionales) | Faltan números reales, lógica y conjuntos, matrices, complejos, binomio de Newton y programación lineal |
| ma1 a ma3 | Trigonometría, geometría, funciones | Informes del 6 nov: `trigonometria-`, `geometria-` y `algebra-funciones-ideas-erroneas.md` | Cifras de resúmenes, por verificar con los PDF (`fuentes/por-conseguir.md`); cada informe trae 3 escenas y casos |
| ma4 | Aritmética | Hechas: `porcentajes-sucesivos` (predicciones), `regla-de-tres`, `probabilidad-dados`, `sucesiones` y `fracciones` (fracciones, decimales, MCD y MCM, promedios) | Hechas también `interes` y `divisores` (7 nov). Faltan numeración, cuatro operaciones, potenciación, mezclas y razonamiento numérico |
| ra1 | Razonamiento matemático | Hechas: `probabilidad-dados`, `regla-de-tres` (engranajes), `traductor-enunciados` (planteo), `sucesiones` (patrones con palitos, Gauss, series) y `orden-informacion` (orden, verdades y mentiras, certezas) | Faltan sucesiones, planteo de ecuaciones, edades y móviles, orden de información y verdades y mentiras |
| ra2 y pl4 | Razonamiento verbal y formato lectura | `razonamiento-verbal-ideas-erroneas.md` (RV1 a RV34, ninguno documentado; hecho por la rutina) | Formato lectura hecho en la app (pl4, 6 nov); la rutina sigue con los 30 textos, los de entrada y salida, los ejercicios sueltos y la guía docente |

### 2. Detalles de las plantillas ya hechas

- **Mol y composición** (`plantillas/mol-composicion/`, rutina de química, 6 nov 2026): balanza, lupa y cuenta a la vez; mol contra masa, átomos en u, fórmula empírica y molecular; 16 casos verificados aparte; 10 de papel. Falta la escena de rendimiento y pureza. Pendiente de color: C–Ca y m–O (heredados de limitante) bajo ΔE00 20.

- **Tiro parabólico y circular** (`plantillas/tiro-parabolico/`, rutina de física, 6 nov 2026): dos movimientos con sombras sobre los ejes y estroboscopio, MCU, MCUV y transmisión; 17 casos verificados aparte; 10 de papel; 3 predicciones y 6 «¿qué pasa si…?» (Prescott y Mitchelmore 2005, Thornton y Sokoloff 1998). Falta en la escena: MCUV, transmisión, encuentros en la circunferencia e impacto contra una pared (están en el motor y el papel).
- **Formato lectura y banco de razonamiento verbal** (rutina verbal, 6 nov 2026; pl4 implementada el mismo día): diseño en `docs/formato-lectura.md` y los primeros 6 textos en `contenido/razonamiento-verbal/`. Ya está en la app: `nucleo/lectura.js` (con pruebas sobre los textos reales), `app/lectura.js` (los seis tipos de paso previo, que bloquean las alternativas; hoja que sube en el celular y dos columnas en la PC; texto pintado con evidencia, distractor e idea), la ficha `plantillas/lectura-verbal/` en las 8 unidades que tocan los textos, `codigos.json` generado del informe, y la medición (`previo`, `lectura`, posición en el banco, resumen por código RV en `analizar-medicion.js`). Detalle en `docs/arquitectura.md` (sección «Formato lectura»). Falta:
  - Llegar a 30 textos: hay 18 de práctica (t013 a t018 integrados el 7 nov 2026) más la pareja de entrada y salida t000a y t000b; faltan 12 en dos tandas.
  - Ejercicios sueltos (analogías, plan de redacción, eliminación, término excluido, oraciones incompletas): la app y el núcleo ya los muestran y califican (probados con ejercicios de muestra); falta escribirlos y las unidades de término excluido y oraciones incompletas en el catálogo. Al agregar un texto o ejercicio con una unidad nueva, sumarla a `plantillas/lectura-verbal/plantilla.json` y nombrar el módulo en la unidad (la prueba avisa); luego `npm run catalogo`.
  - Lápiz y papel (regla 6): falta `herramientas/papel-lectura.js` y que `vPapel` acepte enunciados de varios párrafos (sección 7.6 del diseño). Por eso la ficha sigue en `borrador` con `papel: null`.
  - Revisión independiente del 6 nov aplicada en el código: pruebas de entrada y salida con orden A→B o B→A y eventos `item` (Hake y errores RV antes y después), corrección neutra del paso previo cuando la frase del código no aplica (con aviso en las pruebas), oración mixta evidencia y distractor con contorno, opción `"explicar": "al-final"`, `intento` y retomar un texto a medias, hoja con lo demás `inert`, selección en color de marca, tarjetas que piden mover algo antes de confirmar. Lo de contenido (sondas, distractores, explicaciones de los previos, orden de preguntas, textos t000a y t000b) quedó para la rutina verbal; hoy 59 respuestas incorrectas de pasos previos no tienen explicación propia (14 caen en la frase neutra; ver el diagnóstico de `nucleo/lectura.test.js`).
  - **Decidido (Gerson, 6 nov 2026):** en el celular la barra de abajo no desaparece en la lectura. Los colores evidencia, distractor e idea reusan `--c-i`, `--c-o` y `--c-d`; la revisión midió contraste AA y ΔE00 ≥ 25 entre las tintas, pero naranja y verde se acercan con protanopía o deuteranopía (ΔE00 3,6 a 9,5): por eso cada color va siempre con su marquita y una frase.

- **Cinética** (`plantillas/cinetica/`, rutina de química, 6 nov 2026): caja de discos con teoría de colisiones (energía y orientación), temperatura, catalizador y perfil de energía. Informe `docs/investigacion/cinetica-ideas-erroneas.md` (CI1 a CI13) con cifras sin verificar por el bloqueo de red: la escena no muestra porcentajes de cinética. La fracción contada queda unos pocos por ciento bajo la teoría. Falta en la escena: orden ≠ coeficiente y vida media.

- **Divisores** (`plantillas/divisores/`, 7 nov 2026, subagentes de la conversación principal): el rectángulo de fichas (divisores como rectángulos, criba, árbol y tabla de exponentes con CD, SD y PD, divisores múltiplos de k, criterios con fichas sobrantes, restos con el patio partido, PESI, φ y el reloj de restos potenciales con el gaussiano); 19 casos verificados aparte; 10 de papel; 6 predicciones y 5 «¿qué pasa si…?»; todos los distractores son hipótesis. Unidades: divisibilidad y números primos y divisores. Falta en la escena: diofánticas, Wilson y Fermat (están en motor y papel). Sin ítems en el banco de aritmética (está en 10).
- **Relojes y calendarios** (`plantillas/relojes-calendarios/`, sesión de matemática B, 7 nov 2026): ángulo entre las agujas con minutero arrastrable, superposiciones en un día, adelantos y atrasos, campanadas, bisiestos y día de la semana; 20 casos verificados aparte; 10 de papel. Errores sin datos (hipótesis). Falta: lo transcurrido contra lo que falta del día, campanadas que dan la hora, desde cuándo se atrasa, «el ayer del pasado mañana», N días con N grande y el ángulo con segundos; algunas conversiones de horas a días están en el HTML. Sin ítems en el banco de razonamiento matemático (tiene 8 pares; caben 2 de esta plantilla).
- **Vectores** (`plantillas/vectores/`, 7 nov 2026, subagentes de la conversación principal): flechas que se arrastran, polígono y paralelogramo, fórmula del paralelogramo y ley de cosenos, rango de R, componentes con el notable 3-4-5 (dicho como aproximación de academia), unitario, hexágono y la balanza de dimensiones con homogeneidad y exponentes; 19 casos verificados aparte; 10 de papel; 6 predicciones y 5 «¿qué pasa si…?». «Sumar módulos» es parcial (E8 de estática y M2 de choques); lo demás, hipótesis. Exponentes con α, β, γ en vez de x, y, z porque x e y son los ejes (**para Gerson:** ¿se queda así?). Falta en escena el producto escalar y vectorial (están en motor y papel). Sin ítems en el banco de física.
- **Interés** (`plantillas/interes/`, sesión de matemática B, 7 nov 2026): la alcancía que gana interés (torre de monedas con la capa de interés sobre interés, recta contra curva, tasa efectiva y capitalización, capital desde el monto, descuento comercial y racional); 20 casos verificados aparte; 10 de papel; 5 predicciones y 6 «¿qué pasa si…?». AR16 pasó a «parcial (adultos)» en el informe. Falta en la escena: vencimiento común (está en p10) y la continua como paso propio; casos de capital a dos tasas. Sin ítems en el banco de aritmética (ya está en 10). **Para Gerson:** Dc cambia de tono entre claro y oscuro (granate y naranja rojizo); ¿se acepta o gris?
- **Polinomios** (`plantillas/polinomios/`, sesión de matemática A, 7 nov 2026): la máquina de Ruffini (fichas con el 0 que falta, el resto es la altura P(a) en la curva, divisor ax + b con el cociente falso, grados, resto por sustitución y raíces racionales); 22 casos verificados aparte; 10 de papel; 7 predicciones y 5 «¿qué pasa si…?»; PO1 a PO34 son hipótesis. Unidades: polinomios, división de polinomios y ecuaciones polinomiales. Falta: Horner animado y la sustitución dibujada paso a paso (experimento 4); en PC, el lienzo del paso 1 queda bajo hasta tocar «Ordenar». Sin ítems en el banco de álgebra (ya está en 10, con 2 por plantilla).
- **Átomo y tabla** (`plantillas/atomo-y-tabla/`, rutina de química, 7 nov 2026): partículas de átomos e iones, configuración con cajas (Hund y Pauli, excepciones Cr y Cu), números cuánticos, ubicación en la tabla, energía de ionización, radio y electronegatividad para Z = 1 a 36, series isoelectrónicas; tabla tocable como mapa; 29 casos verificados aparte; 10 de papel; 5 predicciones y 5 «¿qué pasa si…?». **Falta contrastar con la fuente** las energías de ionización (NIST), los radios (Clementi 1967 y Shannon) y las electronegatividades (Pauling): se escribieron y cotejaron de memoria; hacerlo antes del colegio, con el libro que use el colegio o un subagente con acceso a la web. La escala de radios es la teórica de Clementi y la escena avisa que el libro usa radios medidos. Falta lo de enlace (va en su plantilla).
- **Estática** (`plantillas/estatica/`, rutina de física, 7 nov 2026): barra con peso propio, momentos respecto a cualquier punto, bate cortado, nudo, polea y roce estático; 21 casos verificados aparte; 10 de papel; 5 predicciones y 5 «¿qué pasa si…?» (Ortiz y otros 2005, Fischer y otros 2014, Flores-García y otros 2009). Falta en la escena alargar una sola cuerda del nudo sin cambiar su ángulo (E7); sin ítems en el banco de física todavía. Las opciones del momento inclinado, la reacción y la caja son hipótesis.
- **Dinámica** (`plantillas/dinamica/`, rutina de física, 6 nov 2026): plano inclinado con roce estático que se ajusta, poleas, ascensor, tercera ley y empujón; 21 casos verificados aparte; 10 de papel; 3 predicciones y 6 «¿qué pasa si…?» (Halloun y Hestenes 1985, Bao y otros 2002, Castillo y otros 2013). Falta: dinámica circular en escena (va con tiro parabólico), tren de bloques, bloque sobre bloque, polea móvil y péndulo en un vagón. Para Gerson: en «¿qué pasa si…?» las pastillas dejan saltar sin responder (como en MRUV).
- **Equilibrio químico** (`plantillas/equilibrio-quimico/`, rutina de química, 6 nov 2026): A ⇌ B y 2 X ⇌ Y con partículas, Q contra K en vez de la regla de Le Chatelier (Quílez 2017); 18 casos verificados aparte; 9 de papel. Falta el gas inerte a presión constante y Kp en la escena (está en papel). ΔH y Ea de la escena elegidos para números redondos.

- **Banco Óptico:**
  - Pasar la tipografía a la misma de la app (hoy carga Google Fonts, que sin conexión cae a la del sistema).
  - Revisar a 1366 × 768.
- **Espejos:**
  - Falta la animación del "doblez", que explica por qué la imagen real queda delante del espejo; hoy hay una nota en el paso 7.
  - El 30 % de S1 no se cita al alumno hasta confirmarlo en el artículo original.
- **Circuitos:**
  - Faltan los medidores que se arrastran (amperímetro en paralelo, que hace un corto; C15). El motor ya los resuelve.
  - Algunos rótulos quedan apretados en el celular (junto a B1 y en McDermott).
  - Si el alumno quita B3 en el paso 8, la quitada pasa al explorador.
- **Calorimetría** (`plantillas/calorimetria/`, hecha el 5 nov 2026):
  - La unidad también pide dilatación y transferencia de calor (conducción, convección, radiación); la escena no las cubre todavía.
  - El punto de ebullición según la altitud y lo que "siente" la mano son modelos aproximados (atmósfera estándar con Antoine; efusividades de tabla). Sirven para comparar, no para medir.
  - El vapor de la olla destapada se va: en "Sigo calentando" la animación termina a los 300 s, mientras todavía hierve.
- **Energía** (`plantillas/energia/`, hecha el 6 nov 2026):
  - Falta en la escena la fuerza variable: una gráfica F–x que se arrastra y pinta el área (el motor ya la calcula con `trabajoArea`, y está en los problemas de papel).
  - Las opciones incorrectas de "Cambio la rampa" y de la grúa son hipótesis; las demás salen del test EMCS.
  - La pregunta del paso 6 (doble altura, √2) tiene respaldo solo parcial (Brundage y otros, 2023).
- **MRUV** (`plantillas/mruv/`, hecha el 6 nov 2026):
  - Falta que el alumno dibuje la gráfica con el dedo antes de verla (lo que recomiendan Beichner y Thornton y Sokoloff); hoy elige entre dibujos.
  - Tiro parabólico (P1 a P5 del informe) queda para su propia plantilla, en la unidad de movimiento parabólico.
  - Las opciones del frenado y del quinto segundo son hipótesis.
- **Reactivo limitante con partículas** (`plantillas/limitante-particulas/`, hecha el 6 nov 2026):
  - Faltan las otras dos escenas que propone el informe de estequiometría: composición y fórmula empírica (ES16), y rendimiento y pureza (solo hipótesis).
  - En el modo "¿qué pasa si…?", cada partícula dibujada vale un tercio de mol en el ejemplo del aluminio; se avisa en la caja.
- **Gases** (`plantillas/gases/`, hecha el 6 nov 2026):
  - El contador de choques es el promedio exacto que calcula el motor (las partículas no chocan entre sí); la presión depende además de la fuerza de cada choque, como dicen los textos.
  - Falta del informe: la mezcla con botón "solo O₂" en el explorador, el globo dentro del cilindro (GQ14) y la estequiometría con gases en la escena (sí está en papel).
- **Soluciones** (`plantillas/soluciones/`, hecha el 6 nov 2026 por un subagente):
  - No cubre saturado contra diluido (SO13), volúmenes que no se suman (SO5), solubilidad de gases (SO6) ni coloides.
  - El modelo supone que agregar soluto no cambia el volumen; la escena lo dice. En el explorador, sacar una parte a veces no da puntos enteros: el dibujo redondea y lo avisa.
- **pH** (`plantillas/acidos-bases/`, hecha el 6 nov 2026 por un subagente): el H₂SO₄ se toma como diprótico fuerte (convención de academia; su segunda ionización real es parcial). No cubre pares conjugados, Lewis, indicadores ni curvas de titulación dibujadas (hay tabla).
- **Celda galvánica** (`plantillas/celda-galvanica/`, hecha el 6 nov 2026 por un subagente): puente de KNO₃ con nitratos en los vasos (con Ag⁺, el KCl precipitaría AgCl). No cubre la electrólisis del agua ni Nernst; el explorador dibuja Zn, Fe, Cu y Ag (el motor tiene más metales).
- **Todas:** el estado es `borrador`. Pasan a `probada` con los datos del colegio.

### Rutinas y sesiones paralelas (6 nov 2026)

Cinco conversaciones aparte trabajan solas, cada una en su rama y sin tocar catálogo, app, nucleo ni estos documentos. Cada una deja su reporte en `rutinas/<nombre>.md` con los pedidos de integración:

| Sesión | Rama | Qué hace |
| --- | --- | --- |
| Rutina de física (diaria, 2:13 a. m.) | `rutina/fisica` | Una plantilla por ejecución: estática, choques, fluidos, MAS, electrostática, ondas, termodinámica, magnetismo |
| Rutina de química (diaria, 4:37 a. m.) | `rutina/quimica` | Átomo y tabla, enlace, líquidos y sólidos |
| Rutina de razonamiento verbal (diaria, 4:41 p. m.) | `rutina/verbal` | Correcciones de los textos, textos de entrada y salida (t000a, t000b), más textos hasta 30, guía para profesores |
| Paralelo: álgebra y trigonometría (una vez) | `rutina/matematica-a` | Exponenciales y logaritmos, identidades, polinomios, funciones trigonométricas inversas |
| Paralelo: geometría, aritmética y razonamiento (una vez) | `rutina/matematica-b` | Sólidos, geometría analítica, interés, relojes y calendarios, congruencia |

**Cómo integrar:** `git fetch origin rutina/<nombre>`, leer su reporte, ver qué plantillas están terminadas y revisadas, hacer merge a esta rama (si una plantilla está a medias, merge del commit anterior), agregar al catálogo, `npm run catalogo`, subir `VERSION`, colores en `docs/diseno.md`, rebalancear el banco si el curso llega a 4 plantillas, documentar y `npm test` en verde. El método completo está en `docs/metodo/LEEME.md`.

### 3. Plataforma

- **pl6, pulido visual (65 %):**
  - Animaciones suaves al acertar y al subir la racha.
  - Una tipografía redondeada común entre la app y las escenas.
  - Revisar el modo oscuro de las ilustraciones.
  - **Hecho en parte (7 nov 2026):** `nucleo/celular.js` (con pruebas) junta el arreglo común del celular: `compactar`, `alto` con tope, `alResponder` y `arrastre`. MRUV ya lo usa (tope de 340 px por sus tres gráficas). Falta pasar las escenas antiguas que no tienen el dibujo fijo ni el lienzo a la vista al responder: gases, energía, calorimetría, circuitos, espejos, Banco Óptico, limitante, soluciones, pH y celda. Las demás lo tienen copiado a mano y pueden migrar cuando se toquen.
  - Antes: llevar a `nucleo/` lo que cada escena repite (la cinta y la gráfica ya dejan el dibujo fijo arriba mientras se elige: `.bench` sticky y lienzo de ~240 px) y las revisiones vuelven a encontrar: en el celular, subir el lienzo al responder (scrollIntoView y animar después) y dejar que el dedo desplace la página sobre el dibujo salvo cerca de lo que se arrastra (touch-action: pan-y). Salió en la celda, la ampliadora y el triángulo.
- **la1, pruebas de entrada y salida por curso (hecha el 6 nov 2026; revisada y ampliada el mismo día):** banco en `catalogo/pruebas/` (formato en `docs/arquitectura.md`), dos formas paralelas A y B por curso en orden contrabalanceado, 66 ítems por forma en siete cursos (física 10, química 10, geometría 10, trigonometría 8, álgebra 10, aritmética 10, razonamiento matemático 8; desde el 7 nov, 2 por plantilla en los cursos de matemática), cada respuesta y cada distractor verificados con el motor de su plantilla. Aritmética y razonamiento matemático llevan 2 pares por cada uno de sus 4 módulos; trigonometría suma la circunferencia y el caso ambiguo; álgebra, el traductor de enunciados (y 2 de `cuadrado-crece` en reserva). Ningún ítem repite una predicción de escena ni un problema de generador (prueba automática), la respuesta nunca está escrita en el enunciado, los atajos caen igual en A y B y las opciones tienen la misma forma. La salida y las soluciones las abre el profesor (`?salida=`, `?soluciones=`) y hay «Otro alumno en esta PC». Falta:
  - Al agregar una plantilla a un curso, sumar sus ítems (la prueba avisa).
  - Álgebra tiene 2 pares de `cuadrado-crece` en `reserva`: cuando esa plantilla entre al catálogo, pasarlos a `pares` (la prueba avisa) y bajar dos de la gráfica con perillas para no pasar de 10.
  - Sin ítems todavía (la prueba avisa): sucesiones en álgebra, tiro parabólico y estática en física, mol y composición en química; razonamiento verbal no tiene banco (formato lectura).
  - La equivalencia de A y B es por diseño (ítems isomorfos); hay que confirmarla con los datos del colegio (columna «Forma A / B»).
  - Los enunciados no usan los colores de variables (una prueba es neutra) ni tienen figuras: todo va en texto.
  - La respuesta en `app/datos/pruebas.json` va mezclada, no cifrada: no es seguridad real.
  - **Decidido (Gerson, 6 nov 2026):** la entrada no es obligatoria mientras estemos en modo prueba (se puede decir «Ahora no» y se registra cuántas unidades del curso ya había abierto); quizá lo sea más adelante. **Para Gerson:** ¿revisar la redacción de los 130 ítems con un profesor del colegio? La guía para profesores (la4) debe explicar los enlaces `?salida=` y `?soluciones=` y el botón «Otro alumno en esta PC».
- **Inicio (7 nov 2026):** «Lo que sigue» recomienda solo unidades con módulo, una por curso primero, y abre el módulo directo.
- **Planificador por semana del CEPRE y modo examen con tiempo:** estaban en la referencia de interfaz y todavía no existen.
- **Medición:** por decisión de Gerson (5 nov 2026), solo se exportan archivos. Un servidor (Railway está disponible) queda para después.

### 4. Lanzamiento en el colegio (diciembre de 2026)

- **Por confirmar con Gerson:**
  - La fecha exacta; el plan asume la semana del 14.
  - El permiso del colegio para los datos anónimos.
  - La programación anual de física, química y matemática del colegio, para corregir el campo `grado` de cada unidad (`catalogo/LEEME.md`, sección "Grados").
- **la2:** probar en celulares de gama baja y en las computadoras del colegio (navegador, resolución, velocidad).
- **la3:** publicar con dominio y HTTPS. Una PWA necesita HTTPS para instalarse y funcionar sin conexión.
- **la4:** una guía corta para profesores: el código de colegio en el enlace (`/app/?colegio=ABC`), cómo descargar los datos de cada alumno y cómo juntarlos con `analizar-medicion.js`.

### 5. Después del lanzamiento

- Analizar los datos y confirmar o descartar las hipótesis de error (la6).
- Destilar el método de construcción de plantillas en un skill (f2a). Ya hay 3 escenas y 2 módulos de predicciones como base.
- Material de la UNA Puno cuando llegue (f2c). UNSA y UNSAAC también.
- Las ideas de `docs/vision-futura.md`, que no se desarrollan todavía.

## Para Gerson

- El documento fundacional vivo en claude.ai no se actualizó con los cambios de alcance: los cursos de matemática y razonamiento, el lanzamiento en el colegio y la dirección acogedora. Conviene copiarlos desde `docs/fundacional.md` y `docs/diseno.md`.
- `fuentes/por-conseguir.md` tiene la lista de libros y artículos que faltan.
