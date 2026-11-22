# Pendientes y traspaso

Actualizado el 21 de noviembre de 2026. La siguiente sesión empieza aquí, después de `CLAUDE.md`: el estado más reciente, cómo arrancar y lo siguiente. Lo anterior está en `docs/pendientes-archivo.md`, con el índice al final de este archivo; no se lee entero, solo la sección que haga falta (búscala por su título).

Al cerrar una etapa, escribe su «Estado al…» arriba y mueve el anterior al principio de `docs/pendientes-archivo.md`, para que este archivo siga corto.

## Estado al 20 nov: Etapa 8 cerrada (ocho unidades con calidad 2)

Mismo método, con las lecciones 18 y 19 nuevas en `etapa-delegada.md`. La sesión revisa la idea 1 de cada unidad en
capturas y le manda notas al agente mientras sigue escribiendo.

- **Hecho y en main (v313, unas 12 520 pruebas):** Conectores, Ecuaciones polinomiales, Mol y composición, Números
  racionales, Razonamiento inductivo, Ángulos en posición normal, Trabajo y energía y Proporcionalidad y semejanza,
  todas con `calidad: 2`. En química, razonamiento matemático, verbal y trigonometría se abrió la segunda rama.
  Resumen y decisiones para Gerson en `docs/etapa8/decisiones.md`; informes en `rutinas/auditoria/` y `rutinas/frio/`;
  tarjetas en la mesa (ronda 14).
- **Integración:** los bloques de archivos compartidos se copian por unidad con las ayudas de
  `herramientas/integracion/` (`verblk.py` para `catalogo/pruebas/verificar.js`, `avblk.py` para `nucleo/avance.js` y
  su prueba; ver su LEEME), y se comprueba con `node -e require`.
  Cuando cierran varias unidades juntas, se apilan en un worktree y se corre una sola suite.
- **Siguiente:**
  1. Lo que dejó la etapa (`docs/etapa8/decisiones.md`, «Pendientes»): `trig-plano` con el rótulo que esquiva líneas,
     `balanza` numerada solo con más de una, la letra sin serifa de la app, el resultado corto pegado al «=».
  2. Etapa 9: la unidad siguiente de cada rama (álgebra: Binomio de Newton; aritmética: Potenciación y radicación;
     física: Impulso y choques; geometría: Puntos notables; química: Reacciones y balance; RM: Arreglos numéricos;
     verbal: Cohesión y coherencia; trigonometría: Reducción al primer cuadrante).
     Hay investigación previa de ChatGPT, por verificar, para las ocho: `docs/investigacion/etapa9/` (léase su LEEME).
     Para las etapas 10 a 12 también hay (una versión más corta por unidad): `docs/investigacion/etapa10/` a `etapa12/`.
     Etapas 13 a 22 (22 nov): investigación larga en `docs/investigacion/etapa13/` a `etapa16/`, `etapas-17-20/`
     (17 y 18), `etapa19/` a `etapa22/`, cada una con su `estado.md`. Con esto tienen investigación todas las unidades
     por rehacer menos cuatro de la 13 (Soluciones, Juegos recreativos, Resumen y síntesis, Ecuaciones trigonométricas).
     Las etapas 10 a 12 solo tienen la versión breve (unos 11 KB por unidad).

## Cómo arrancar una sesión nueva

```bash
npm run test:corto
```

Deben pasar todas (unas 12 520 al 20 nov; tarda unos 8 minutos). Son las mismas de `npm test`, pero solo imprime las fallas y los totales. Las reglas de lectura medida (qué archivos y carpetas no se leen enteros) están en `CLAUDE.md`, «Cómo se trabaja». El servidor tiene las suyas: `cd servidor && pip install -r requirements.txt -r requirements-dev.txt && python -m pytest -q` (83).

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

## Para Gerson

- El documento fundacional vivo en claude.ai no se actualizó con los cambios de alcance: los cursos de matemática y razonamiento, el lanzamiento en el colegio y la dirección acogedora. Conviene copiarlos desde `docs/fundacional.md` y `docs/diseno.md`.
- `fuentes/por-conseguir.md` tiene la lista de libros y artículos que faltan.

## Índice de `docs/pendientes-archivo.md`

- Estado al 19 nov, cierre: Etapa 7 cerrada (ocho unidades con calidad 2)
- Estado al 19 nov, noche: Etapa 6 cerrada (nueve unidades con calidad 2)
- Estado al 19 nov: Etapa 5 cerrada (diez unidades con calidad 2)
- Estado al 18 nov, cierre: Etapa 4 con el método completo (una ronda de lector)
- Estado al 18 nov, noche: Etapa 4 en fase 2 (las cuatro ideas 1 en la mesa)
- Estado al 18 nov, tarde: Álgebra con el método completo y Etapa 4 propuesta
- Estado al 18 nov, mañana: tres unidades con dos rondas de lector; Álgebra al día
- Estado al 18 nov, madrugada: tres unidades con el método casi completo
- Estado al 17 nov, cierre: Etapa 3 en marcha (fase 2 hecha en tres unidades)
- Estado al 17 nov, noche: Etapa 2 cerrada y la mesa de revisión
- Estado al 17 nov: Etapa 1 cerrada, el molde listo para replicar
- La molécula que gira: primera unidad 3D (15 nov, rama `claude/sweet-maxwell-0knzks`)
- Una base, dos entradas (15 nov): decisión de Gerson
- Recorrido satisfactorio (15 nov): que todos los alumnos se vayan contentos
- Teoría interactiva: molde hecho y ocho cursos en paralelo (14 nov, noche)
- Para la próxima sesión (Gerson, 14 nov): la teoría interactiva — resuelto arriba
- Prueba de estrés de Rive: cifra real (15 nov, Redmi 15C de Gerson)
- Prueba 3D con three.js (15 nov): para correr en el mismo celular
- Prueba de estrés de Rive (versión 0), 14 nov, en `main`
- Tabla viva (versión T), 14 nov, en `main`: para jugar (decisión 20)
- Cola de repaso (versión R), 13 y 14 nov, en `main` (sw v175)
- Estado al 13 nov, tarde: auditoría POGIL v2 y decisiones (léelo primero)
- Estado al 13 nov: rediseño «escena viva»
- Estado al 12 nov y lo que sigue
- Qué hay hecho
- Pendientes, en orden de prioridad
