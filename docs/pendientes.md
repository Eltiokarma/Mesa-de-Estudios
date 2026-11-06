# Pendientes y traspaso

5 de noviembre de 2026 · Cierre de la sesión de trabajo con Gerson. La siguiente sesión empieza aquí, en otra ventana y con otra cuenta de Claude. Léelo después de `CLAUDE.md`.

## Cómo arrancar una sesión nueva

```bash
npm test
```

Deben pasar 208 pruebas.

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
| Plantillas de escena | Banco Óptico (lentes), espejos esféricos, circuitos de corriente continua, calorimetría con cambios de fase y trabajo y energía (rampa con resorte). Cada una con motor, casos verificados con fracciones, paso a paso con predicción, "¿qué pasa si…?" y 9 problemas de papel |
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
| fi6 | MRUV y gráficas | `cinematica-ideas-erroneas.md` | Siguiente. Datos fuertes (Beichner 1994) |
| qu1 | Reactivo limitante con partículas (escena) | `estequiometria-ideas-erroneas.md` | Ya existe el módulo de predicciones; falta la escena con partículas |
| qu2 a qu4 | Gases y soluciones, pH, redox | Los de química | |
| ma1 a ma3 | Trigonometría, geometría, funciones | Sin informe todavía | Hay que investigar las ideas erróneas antes de construir |
| ma4 | Aritmética | Sin informe | Porcentajes sucesivos ya existe; los errores son hipótesis |
| ra1 | Razonamiento matemático | Sin informe | Formato predicciones |
| ra2 y pl4 | Razonamiento verbal y formato lectura | Sin informe | Textos propios; el formato lectura todavía no existe y se arma con el componente de fichas (pl7, del 10 al 15 nov) |

### 2. Detalles de las plantillas ya hechas

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
- **Todas:** el estado es `borrador`. Pasan a `probada` con los datos del colegio.

### 3. Plataforma

- **pl7, componente completar con fichas (del 10 al 15 nov):** decisión del 6 nov 2026, antes del colegio. Las "nubecitas" estilo Brilliant: huecos en una oración o ecuación y fichas que se arrastran. Sirve al formato lectura (pl4), a razonamiento verbal y a despejar ecuaciones. Lo corrige el código; funciona con el dedo y sin conexión; la medición guarda la respuesta. Ver `docs/investigacion/brilliant.md`.
- **pl6, pulido visual (65 %):**
  - Animaciones suaves al acertar y al subir la racha.
  - Una tipografía redondeada común entre la app y las escenas.
  - Revisar el modo oscuro de las ilustraciones.
- **la1:** pruebas de entrada y salida por curso. Hoy existen por módulo de predicciones (3 + 3 preguntas); faltan en las escenas y por curso.
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
- Capturas de Peak: llegaron las del catálogo y las pantallas (6 nov 2026; anotadas en la sección 2 de `docs/vision-pisa-agilidad-interaccion.md`). Size Counts y Square Numbers ya están confirmados con capturas jugando; solo falta Moving Math (opcional). No se suben al repo; solo se anota lo que muestran.
