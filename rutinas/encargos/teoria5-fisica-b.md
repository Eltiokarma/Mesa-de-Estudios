# Encargo, ronda 5: física animada (parte B) (15 nov 2026, noche)

Eres una sesión paralela del proyecto Mesa de Estudios (repo Eltiokarma/mesa-de-estudios).

Gerson probó la app y decidió: «Todo física debe ser animado, dinámico, sin tener que apretar botones innecesarios, con animaciones que cargan solas. Pueden ser 2D o 3D. Las gráficas, las ecuaciones y sus valores se mueven con la animación.» Vale igual para todo química. El molde ya existe y está probado. Tu trabajo: estas 10 unidades de física, ni una más:

- `fisica.fluidos`
- `fisica.temperatura-y-calor`
- `fisica.termodinamica`
- `fisica.electrostatica`
- `fisica.corriente-y-circuitos`
- `fisica.magnetismo`
- `fisica.induccion-electromagnetica`
- `fisica.ondas-electromagneticas`
- `fisica.optica-geometrica`
- `fisica.fisica-moderna`

## Arranque
1. Trabaja en la rama `teoria5/fisica-b`, que sale de `main`. Si no estás en ella, créala desde `origin/main`.
   - Sube solo a `teoria5/fisica-b` (`git push -u origin teoria5/fisica-b`). Nunca a main ni a otra rama. No abras PR.
2. Lee, en este orden:
   1. `CLAUDE.md`;
   2. **la sección 6 de `docs/3d.md` (animación automática), que manda**, y el resto de ese documento;
   3. la sección 4d de `docs/teoria.md` (retos).
3. Estudia la unidad de referencia `contenido/teoria/fisica/oscilaciones.js`:
   - la idea 1: `bloqueT`, el control `t` con `auto` y el arrastre que convierte la posición en tiempo;
   - la idea 2: el punto que recorre la gráfica;
   - la mesa `resorte-vivo`.

   Para 3D, mira `nucleo/kit/vivo3d.js` (`forma` y `mover`) y las piezas 3D de tu curso.
4. Carga los skills `anthropic-skills:diseno-y-animacion` (con `references/fisica-y-gestos.md`) y `anthropic-skills:estructura-visual-motion` antes de diseñar.

## Qué hacer en cada unidad
1. **En cada idea, el juego se anima solo.**
   - Si el fenómeno ocurre en el tiempo, va un control `t` con `auto`, y `dibujo` y `lectura` leen `valores.t`.
   - Si no hay tiempo, un parámetro que barre su rango con `auto` (modo `'rebota'`), elegido para que la animación muestre la relación central de la idea. Por ejemplo:
     - el ángulo del cañón que dispara una y otra vez;
     - la carga que se acerca;
     - el volumen que se comprime;
     - el reactivo que se agrega.
   - **Las gráficas** llevan el punto que avanza (y, si cabe, la curva que se dibuja hasta `t`).
   - **La lectura** muestra los números del momento.
   - **Arrastrar sigue funcionando** y pausa lo animado si lo toca.
   - **No cambies:**
     - las preguntas de «Predice», ni sus opciones correctas;
     - «Mira»;
     - «La regla»;
     - «Ahora tú».
2. **En el laboratorio:** la primera mesa queda animada, sea una existente animada o una nueva. No cambies los `id` de las mesas que ya existen ni los de sus controles: puedes agregar un control `t`.
   - Si la mesa 3D de la unidad se puede animar, anímala implementando `forma` y `mover` en su pieza, sin rearmar la escena en cada cuadro.
3. **Cámara lenta cuando haga falta,** y la consigna lo dice. La consigna dice qué mirar mientras se mueve, en 25 palabras o menos.
4. **Los retos de las mesas animadas siguen comprobados por el motor.** Puede haber uno de «pausa en el momento justo».
5. **Si una idea de verdad no se presta a animación,** déjala como está y explica por qué en el reporte. Debería ser rara: Gerson pidió todo.

## Reglas que no se rompen
- **Las de `CLAUDE.md`:**
  - regla 1: cada cuadro es `dibujo(valores)` calculado por el motor; nada de física de juegos ni números escritos a mano si el motor los da;
  - regla 3, con su excepción de la exploración libre;
  - regla 4: un color por variable;
  - regla 5: contenido propio.
- **Qué no se toca:**
  - `app/`;
  - `nucleo/teoria.js`, `nucleo/kit/vivo3d.js` y `nucleo/glosario.js`;
  - el paquete de three.js;
  - las piezas o unidades de otros cursos, y **las unidades que no están en tu lista** (otra sesión hace las demás de tu curso).
  - **Las piezas del kit de tu curso** (prefijo `fis-`) y las comunes (`ejes`, `pista`, etc.) se pueden ampliar solo agregando datos opcionales, sin cambiar lo que ya dibujan, y con sus pruebas. Si dos sesiones de tu curso necesitaran la misma pieza, la otra sesión trabaja en paralelo: agrega solo campos nuevos y avísalo en el reporte.
- **Después de cada unidad:**
  - corre `npm run catalogo` y `node --test contenido/teoria/teoria.test.js 'nucleo/**/*.test.js'`;
  - recorre con Playwright a 360 × 780 (en 3D, con swiftshader: `chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })`) cada idea y la primera mesa, y comprueba que:
    - la lectura cambia sola entre dos momentos (espera 700 ms);
    - «⏸ Pausa» la congela;
    - con `reducedMotion: 'reduce'` arranca quieta;
  - mira las capturas.
  - Para la unidad, guarda antes en localStorage `'lab-v1'` un alumno con `uni: 'unmsm'` y `grado: '5'`. Ya no hace falta la prueba del tema.
- **Commits:** uno por unidad, con un mensaje en español («Animación en <unidad>»), y push después de cada commit. `npm test` completo en verde antes del último push.
- **Idioma:** habla con el usuario en español peruano informal. El contenido para alumnos va en español claro y neutro, con la voz de Tilo.

## Al terminar
Deja `rutinas/teoria5-fisica-b.md` con:
- por unidad e idea, qué se anima y con qué control;
- las mesas animadas;
- las piezas tocadas (incluidas `forma` y `mover`);
- lo que no se animó y por qué;
- los pedidos a la base o a la app;
- lo no verificado.

Súbelo con el último commit. No integres a main: la sesión principal integra.
