# Encargo, ronda 4: el 3D en razonamiento matemático (15 nov 2026)

Eres una sesión paralela del proyecto Mesa de Estudios (repo Eltiokarma/mesa-de-estudios).

Gerson decidió llevar el 3D (three.js) «a todo lo que se pueda», con la forma que ya probó en su celular: la molécula de enlace químico. Ya hay dos piezas vivas de referencia, la molécula y el prisma que se corta, y una base común que hace todo lo repetido. Tu trabajo es razonamiento matemático.

## Arranque
1. Trabaja en la rama `teoria4/razonamiento-matematico`, que sale de `main`. Si no estás en ella, créala desde `origin/main`.
   - Sube solo a `teoria4/razonamiento-matematico` (`git push -u origin teoria4/razonamiento-matematico`). Nunca a main ni a otra rama. No abras PR.
2. Lee, en este orden:
   1. `CLAUDE.md`, sobre todo la regla 3 y su excepción para la exploración libre;
   2. `docs/3d.md`, el molde de esta ronda, que manda;
   3. `docs/dos-entradas.md`;
   4. la sección 4d de `docs/teoria.md` (retos con `logrado`, `bien` y `pista`, y el glosario).
3. Estudia las dos referencias completas:
   - `nucleo/kit/vivo3d.js`, la base, sobre todo su encabezado;
   - `nucleo/kit/piezas/quim-molecula-3d.js` y `nucleo/kit/piezas/geo-corte-3d.js`, con sus `*.test.js`;
   - la mesa `molecula-gira` en `contenido/teoria/quimica/enlace-quimico.js` y la mesa `prisma-corte` en `contenido/teoria/geometria/prisma-y-piramide.js`.
4. Carga los skills `anthropic-skills:diseno-y-animacion` (con `references/fisica-y-gestos.md` y `references/ensenanza.md`) y `anthropic-skills:estructura-visual-motion` antes de diseñar.

## Qué hacer
### 1. Clasificar las 19 unidades de `contenido/teoria/razonamiento-matematico/`
Clasifica cada unidad según la sección 1 de `docs/3d.md`: **3D necesario**, **3D de contexto** o **plano**. Escribe una razón de una línea.
- Candidatas que vemos desde afuera: vistas de cubitos (la pila y sus vistas de frente, perfil y planta), dados y desarrollos (el dado que se pliega), cubitos pintados (el cubo n × n × n), rutas en el espacio y papel doblado. Esto es una pista, no una orden: decides tú después de leer cada unidad y su escena en `plantillas/`.

### 2. Construir las mesas 3D, empezando por las de «3D necesario»
Sigue el orden del curso en `catalogo/cursos/razonamiento-matematico.json`. Si alcanza el tiempo, sigue con las de contexto. Por cada unidad:
1. **El cálculo,** en un motor con pruebas:
   - reutiliza el de `plantillas/<tema>/motor.js` o `nucleo/geometria3d.js`;
   - si hace falta, un módulo nuevo en `nucleo/` con su `*.test.js` y casos verificados aparte.
2. **Una pieza viva** en `nucleo/kit/piezas/` con prefijo `rm-`, sobre `Kit.vivo3d.montar`, con su respaldo plano SVG, su `alt` y sus pruebas en Node. Una misma pieza puede servir a varias unidades: eso es mejor que repetir.
3. **La mesa 3D,** primera en el `laboratorio` de la unidad:
   - sin cambiar el `id` de las mesas que ya existen;
   - hasta 5 mesas en total;
   - consigna, controles con − y +, `lectura` en vivo y de 3 a 6 retos con `logrado`, `bien` y `pista`.
   - Lo que se mueve en el tiempo lleva un control `t`; nada de animación continua.
4. **El glosario:** las palabras nuevas que use la mesa (docs/teoria.md, 4d).
5. **La pieza en la unidad:** agrega la pieza a `requiere` de la unidad. Si usa `nucleo/geometria3d.js` u otro módulo de `nucleo/` en el navegador, anótalo en el reporte: la sesión principal lo suma a la app.

## Reglas que no se rompen
- **Las de `CLAUDE.md`:**
  - regla 1: el motor calcula; la pieza solo dibuja;
  - regla 4: un color por variable, con rótulos HTML del mismo color;
  - regla 5: contenido propio.
- **Qué no se toca:**
  - `app/`;
  - `nucleo/kit/vivo3d.js`, `nucleo/teoria.js` y `nucleo/glosario.js`;
  - el paquete de three.js;
  - las piezas de otros cursos.
  - Si necesitas algo de ahí (una clase de three.js que falta, un cambio en la base), anótalo en el reporte con el caso que lo pide.
- **Presupuesto de `docs/3d.md`:** 20 000 triángulos, 60 mallas, sin sombras, sin texturas de archivo, sin modelos descargados y un solo lienzo 3D por pantalla.
- **Después de cada unidad:**
  - corre `npm run catalogo` y `node --test contenido/teoria/teoria.test.js nucleo/`;
  - recorre la mesa con Playwright a 360 × 780 y con swiftshader, como dice la sección 4 de `docs/3d.md`;
  - mira las capturas.
  - Para saltar la prueba del tema, guarda antes en localStorage `'lab-v1'` un alumno con `uni: 'unmsm'`, `grado: '5'` y `temas: { '<unidad>': { entrada: { fecha: '2026-11-15', aciertos: 0, total: 5, nose: 0, sabidas: [], expuesto: [] } } }`.
- **Commits:** uno por unidad, con un mensaje en español («3D en <unidad>: <la mesa>»), y push después de cada commit. `npm test` completo en verde antes del último push.
- **Idioma:** habla con el usuario en español peruano informal. El contenido para alumnos va en español claro y neutro; los `bien` y las `pista`, con la voz de Faro (`docs/teoria/fuentes/guia-personajes.txt`).

## Al terminar
Deja `rutinas/teoria4-razonamiento-matematico.md` con:
- la tabla de las 19 unidades: clase, razón y qué se hizo;
- las piezas nuevas y qué unidades las usan;
- los motores o módulos nuevos y sus pruebas;
- los pedidos a la base o a la app, con el caso que los pide;
- lo no verificado;
- el «Reporte de diseño» del skill.

Súbelo con el último commit. No integres a main: la sesión principal integra.
