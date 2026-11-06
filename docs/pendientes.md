# Pendientes y traspaso

5 de noviembre de 2026 · Cierre de la sesión de trabajo con Gerson. La siguiente sesión empieza aquí, en otra ventana y con otra cuenta de Claude. Léelo después de `CLAUDE.md`.

## Cómo arrancar una sesión nueva

```bash
npm test
```

Deben pasar 869 pruebas.

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
| ma2 | Geometría | Hechas: `ampliadora` (semejanza, área y volumen), `triangulo-estira` (líneas notables y área) y `angulo-inscrito` (ángulos en la circunferencia) | Las tres escenas del informe están hechas; faltan polígonos, congruencia, espacio y analítica |
| ma1 | Trigonometría | Hecha: `cinta-radio` (sistemas de medida, arco, sector, ruedas) | Siguen la circunferencia que se desenrolla y el compás del caso ambiguo |
| ma3 | Álgebra | Hecha: `grafica-perillas` (transformaciones, inversa, inecuaciones, valor absoluto) | Siguen el traductor de enunciados y el cuadrado que crece |
| ma1 a ma3 | Trigonometría, geometría, funciones | Informes del 6 nov: `trigonometria-`, `geometria-` y `algebra-funciones-ideas-erroneas.md` | Cifras de resúmenes, por verificar con los PDF (`fuentes/por-conseguir.md`); cada informe trae 3 escenas y casos |
| ma4 | Aritmética | `aritmetica-razonamiento-ideas-erroneas.md` | Porcentajes sucesivos ya existe; suma-descuentos y se-compensan ya tienen respaldo (AR1, AR2) |
| ra1 | Razonamiento matemático | Mismo informe (RM1 a RM6, casi todo hipótesis) | Formato predicciones |
| ra2 y pl4 | Razonamiento verbal y formato lectura | `razonamiento-verbal-ideas-erroneas.md` (RV1 a RV32, ninguno documentado; hecho por la rutina) | La rutina sigue con el diseño del formato lectura, 30 textos propios y la guía docente |

### 2. Detalles de las plantillas ya hechas

- **Cinética** (`plantillas/cinetica/`, rutina de química, 6 nov 2026): caja de discos con teoría de colisiones (energía y orientación), temperatura, catalizador y perfil de energía. Informe `docs/investigacion/cinetica-ideas-erroneas.md` (CI1 a CI13) con cifras sin verificar por el bloqueo de red: la escena no muestra porcentajes de cinética. La fracción contada queda unos pocos por ciento bajo la teoría. Falta en la escena: orden ≠ coeficiente y vida media.

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

### Rutinas automáticas (6 nov 2026)

Tres conversaciones aparte trabajan solas cada día, cada una en su rama y sin tocar catálogo, app, nucleo ni estos documentos: física (`rutina/fisica`, 2:13 a. m.), química (`rutina/quimica`, 4:37 a. m.) y razonamiento verbal con la guía docente (`rutina/verbal`, 4:41 p. m.). Cada una deja su reporte en `rutinas/<curso>.md` con los pedidos de integración. Integrarlas: leer el reporte, revisar, hacer merge a esta rama, agregar al catálogo, `npm run catalogo`, subir `VERSION` y documentar.

### 3. Plataforma

- **pl6, pulido visual (65 %):**
  - Animaciones suaves al acertar y al subir la racha.
  - Una tipografía redondeada común entre la app y las escenas.
  - Revisar el modo oscuro de las ilustraciones.
  - Llevar a `nucleo/` lo que cada escena repite (la cinta y la gráfica ya dejan el dibujo fijo arriba mientras se elige: `.bench` sticky y lienzo de ~240 px) y las revisiones vuelven a encontrar: en el celular, subir el lienzo al responder (scrollIntoView y animar después) y dejar que el dedo desplace la página sobre el dibujo salvo cerca de lo que se arrastra (touch-action: pan-y). Salió en la celda, la ampliadora y el triángulo.
- **la1, pruebas de entrada y salida por curso (hecha el 6 nov 2026):** banco en `catalogo/pruebas/` (formato en `docs/arquitectura.md`), dos formas paralelas A y B por curso en orden contrabalanceado, 50 ítems por forma en física, química, geometría, trigonometría, álgebra y aritmética, cada respuesta y cada distractor verificados con el motor de su plantilla. La app pide la entrada al entrar al curso por primera vez y ofrece la salida en el curso (o la habilita el profesor con `?salida=<curso>`). Se registra cada respuesta y `analizar-medicion.js` da la ganancia de Hake y los errores antes y después. Falta:
  - Razonamiento matemático y verbal: sin banco hasta que tengan módulos. Al agregar una plantilla a un curso, sumar sus ítems (la prueba avisa).
  - Aritmética son 8 ítems de porcentajes porque es su único módulo; trigonometría, 8 de la cinta del radio.
  - La equivalencia de A y B es por diseño (ítems isomorfos); hay que confirmarla con los datos del colegio (columna «Forma A / B»).
  - Los enunciados no usan los colores de variables (una prueba es neutra) ni tienen figuras: todo va en texto.
  - **Para Gerson:** ¿la entrada debe ser obligatoria (hoy se puede decir «Ahora no», y se registra cuántas unidades del curso ya había abierto)? ¿El profesor habilita la salida solo con el enlace (sin clave) o hace falta un código? ¿Revisar la redacción de los 100 ítems con un profesor del colegio?
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
