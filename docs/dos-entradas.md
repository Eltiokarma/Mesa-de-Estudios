# Una base, dos entradas y gráficos que se adaptan

15 de noviembre de 2026. Claude propuso una base compartida con dos formas de entrar (explorar y prepararse para el examen) y una calidad gráfica que se adapta al equipo. ChatGPT estuvo de acuerdo con esa dirección y la ajustó. **Gerson eligió la versión de ChatGPT.** Si algo de aquí choca con `CLAUDE.md`, manda `CLAUDE.md`.

## Decisiones de Gerson (15 nov)

### 1. Tres decisiones independientes, no dos tipos de alumno

Todo alumno necesita comprender, practicar y tener curiosidad. Uno de academia puede estar trabado justo porque nunca entendió el concepto. Uno de 2.º necesita practicar para consolidarlo. Por eso la app no divide a los alumnos por «los que entienden» y «los que practican».

| Decisión | Qué determina |
| --- | --- |
| Qué quiere hacer hoy | Explorar, entender algo o prepararse para un examen |
| Qué sabe y qué está estudiando | Contenidos, dificultad, explicaciones y ayudas |
| Qué puede mover su equipo y qué prefiere | Calidad gráfica, movimiento y ahorro de recursos |

- El grado **sugiere** un punto de partida, pero no encierra al alumno.
- El alumno cambia de intención **dentro de la misma sesión**. Por ejemplo: falla un ejercicio, abre una explicación interactiva y vuelve a intentarlo.

### 2. Un mundo en 3D, pero sin exigir que todo sea three.js

- La mesa, los objetos y los laboratorios pueden ser tridimensionales.
- Textos, botones y formularios siguen en HTML, encima del 3D, y se integran con él. La documentación de three.js contempla esa mezcla (*Aligning HTML Elements to 3D*).
- **El alumno con el peor celular también recibe una experiencia bonita y completa.** Se bajan primero sombras, resolución y animaciones. Lo que se puede experimentar no se recorta.
- Hay un **modo ahorro** que el alumno elige a mano.
- Técnica: limitar la resolución (`setPixelRatio`) y dibujar solo cuando algo cambia. `app/prueba3d/` ya dibuja solo cuando algo cambia (rama `claude/awesome-einstein-ch5g9a`).
- El video muestra una dirección visual. Todavía falta comprobar que funcione con interacción en teléfonos reales.

### 3. Se juega libre

- No toda interacción se vuelve una pregunta obligatoria. Por ejemplo, girar una molécula no exige contestar nada.
- La exploración libre trae invitaciones como «¿quieres probar un reto?».
- Cuando se enseña un concepto concreto, sí hay preguntas, pistas, ejemplos y comprobaciones. La evidencia favorece el descubrimiento **con apoyo** sobre el descubrimiento sin ayuda (Alfieri y otros, 2011, metaanálisis; en las fuentes de `docs/fundacional.md`). Eso respalda diseñar buenas ayudas, no poner un cuestionario antes de cada interacción.
- **Se miden por separado** dos resultados: disfrutar explorando y demostrar lo aprendido.

**Cómo convive con la regla 3 de `CLAUDE.md`** (jugar, después predecir, después ver): la exploración libre de la mesa no es una escena de ejercicio. Cuando el alumno entra a aprender un concepto, la escena sigue la regla 3 tal cual. **Gerson lo confirmó el 15 nov y quedó como excepción escrita en la regla 3.**

### 4. Alcance y fechas con prudencia

- Compartir código ahorra trabajo, pero dos experiencias siguen necesitando diseño, contenido y pruebas cada una.
- Que el 3D convenza al director es una **hipótesis del piloto**, no un supuesto. Se observa junto con su utilidad en clase.

## Respuestas a las tres preguntas

1. **Por dónde empieza Exploración:** con 3.º y 4.º de secundaria. Hay que comprobar qué contenidos existentes encajan y qué saberes previos piden.
2. **Fechas:** diciembre de 2026 sigue como objetivo de un **piloto acotado**, siempre que funcione el recorrido esencial. Marzo de 2027 es la meta de **ampliación**.
3. **Integrar a `main`:** los cambios actuales se prueban primero en una versión de prueba y en el Redmi 15C antes de integrarlos. **Cambió el mismo 15 nov:** Gerson decidió que Vercel publique solo `main` y que todo vaya a `main`; él lo prueba ahí. Hoy son los 187 commits de `claude/awesome-einstein-ch5g9a`: la ronda 3 de teoría y `app/prueba3d/`. Se revisa qué incluyen y cómo funcionan.

## Lo que sigue: una unidad completa antes de tres

Una sola unidad que tenga entero el recorrido:

1. entrar;
2. explorar libre;
3. pedir ayuda;
4. resolver un reto;
5. guardar;
6. regresar otro día y encontrarla donde quedó.

Con esa unidad se comprueba si lo bonito del video también es agradable de usar.

## Decidido después (15 nov)

- **three.js entra al kit.** En el Redmi 15C corrió a 60 fps, sin cuadros perdidos, con los tres objetos girando sin parar (`docs/pendientes.md`, «Prueba 3D con three.js»).
- **Orden de las unidades.** A Gerson le gustaron las tres y no tiene preferencia, así que Claude propuso este orden:
  1. **La molécula que gira (geometría molecular)** va primero. Fue la que más le gustó a Gerson. Ya existe la escena `plantillas/enlace/` con su motor y sus casos, que se aprovechan. Y se juega libre fácil: girar la molécula y tocar átomos no exige preguntas.
  2. El prisma que se corta (geometría del espacio).
  3. Los cubitos (vistas en razonamiento matemático).
- **WebGL 2 en el colegio.** Gerson lo pregunta, y además queda como requisito en `docs/guia-profesores.md`.

## La primera unidad 3D: enlace químico (15 nov, rama `claude/sweet-maxwell-0knzks`)

Se construyó sobre la rama de teoría `claude/awesome-einstein-ch5g9a`, que ya traía los retos comprobados, el glosario, la ayuda tras dos errores, la colección y el retomar. Lo nuevo:

- **Pieza `quim-molecula-3d`** (`nucleo/kit/piezas/`), la primera pieza viva del kit: trae `montar(el)` además de `dibujar()`. `app/teoria.js` la monta una vez y después solo la actualiza. Los lienzos WebGL se sueltan al cambiar de pieza o de ruta.
- **Mesa «La molécula que gira»**, la primera del laboratorio de `quimica.enlace-quimico`:
  - once moléculas, de CH₄ a XeF₄;
  - dipolos y pares libres a la vista u ocultos;
  - cinco retos comprobados.

  Todo lo calcula el motor de `plantillas/enlace` (regla 1).
- **Recorrido comprobado con Playwright** en un Android emulado, sin errores:
  1. entrar;
  2. girar y tocar un átomo;
  3. lograr un reto;
  4. guardar dos casos, que además cumplen el reto de comparación;
  5. recargar;
  6. ver «Tu colección · 2» y «Lo último que hiciste».

**Lo que pedía la lista antes de publicar:**
- **Respaldo sin WebGL 2:** hecho. Es la proyección plana con `quim-molecula` y el aviso «Vista plana».
  - Se ve desde el ángulo más cercano a 30° y 20° sin átomos encimados. Una vista de frente aplanaría el CH₄ en un cuadrado de 90°.
  - El respaldo no gira.
- **Teclado:** hecho. Las flechas giran 15° e Inicio vuelve a la vista de partida.
- **Service worker:** hecho. three.js va en la cáscara (v185).
- **Modo ahorro:** hecho. Está en Perfil → Gráficos en 3D: resolución 1×, sin suavizado y esferas con menos caras.
- **Mesa 3D del inicio:** después, como se decidió.

**Falta:**
- probarla en el Redmi;
- integrarla a `main`, junto con la rama de teoría;
- sumar la molécula a la «Muestra jugable» de la bienvenida (la entrada de exploración);
- el prisma y los cubitos.

## La unidad completa (15 nov, tarde, en `main`)

**Lo integrado.** La rama `claude/sweet-maxwell-0knzks`, que traía la ronda 3 de teoría, la molécula 3D y la prueba 3D, pasó entera a `main`.

**Lo que faltaba del recorrido**, sin más predicciones (excepción de la regla 3):

- **Pedir ayuda, en cualquier reto de cualquier mesa:**
  - **«Pista»:** la del reto (`pista`, de 16 palabras o menos) o una general;
  - **«Muéstrame»:** después de la pista. Pone el caso de la grilla que cumple el reto y cambia menos controles, y lo calcula el motor (regla 1). No está en los retos que piden casos guardados.
  - Lo visto con «Muéstrame» queda como «Lo viste con ayuda», no como logrado, y «Otro reto» lo salta.
  - Los 5 retos de la molécula traen su pista propia, revisada contra el motor de `plantillas/enlace`.
- **El 3D que se corta vuelve solo.** Si Android corta el dibujo 3D, queda la vista plana con «Volver al 3D», y se rearma solo al regresar a la app.
- **La lupa con la pieza 3D:** el mismo lienzo pasa a pantalla completa, sin abrir un segundo contexto WebGL, con − y + para acercar. Además se acerca con el pellizco y con Ctrl + rueda.
- **Medición, por separado:**
  - **explorar:** al salir del laboratorio queda un evento `explora` con el tiempo, los casos probados, las mesas, los guardados, los retos y las ayudas;
  - **aprender:** `invitacion` dice con cuánta ayuda se logró cada reto, y `reto-ayuda` dice si fue pista o «Muéstrame»;
  - **el informe:** `herramientas/analizar-medicion.js` arma la tabla «Laboratorio: explorar y aprender, por separado» y la lista de las palabras del glosario más consultadas.

**Para Gerson, en el Redmi:** el recorrido completo de enlace químico, en su laboratorio y la mesa «La molécula que gira»:
1. entrar;
2. girar y tocar átomos;
3. pedir pista y «Muéstrame»;
4. lograr otro reto solo;
5. guardar dos moléculas;
6. cerrar la app y volver otro día.

**Decisión de Gerson (15 nov): three.js se baja con la app.** El archivo de three.js (unos 137 KB comprimido) se sigue guardando en la cáscara del service worker, al instalar. Así el 3D abre sin conexión desde el primer día, aunque el colegio no tenga buena señal cuando el profesor pida abrirlo. A cambio, también lo baja quien nunca usa el 3D. Se descartó bajarlo recién la primera vez que se abre el 3D.

## Decisiones de Gerson tras probar la app (15 nov, noche)

**Lo que dijo:**
- «A cada rato me querían mandar a resolver ejercicios o examen o laboratorio, no pude estudiar nada ni hojear nada.»
- La teoría se siente insuficiente y desordenada.
- El glosario es feo.
- El 3D se siente frío.

**Lo que decidió:**
1. **La prueba del tema es opcional y va después de la teoría,** con un botón para volver a tomarla cuando quiera.
2. **Se mantiene jugar, predecir y ver, pero se puede leer.** Leer es una actividad lúdica, no trabajo, si el texto es digerible. La ficha de reglas queda abierta para hojear.
3. **Los topes de texto se amplían por ahora;** el diseño puede cambiar.
4. **El glosario es el otro 50 % de la teoría:** a color, con botones y deslizable, como los ejercicios.
5. **Faltan ejercicios resueltos paso a paso,** para que el alumno sepa por dónde empezar el análisis.

**Fase 1, hecha:**
- **La prueba del tema:** sin candado, ofrecida al terminar la teoría y con una puerta en la unidad («Opcional…» o «volver a tomarla»). Cada intento trae otras preguntas.
- **Inicio, curso y unidad, centrados en la teoría:**
  - «Estudiar la teoría» en el reto de hoy;
  - «Teoría ›» en lo que sigue;
  - las tarjetas del curso dicen «Teoría · N ideas»;
  - las pruebas del curso bajan al final;
  - la puerta Teoría es la principal.
- **Teoría:**
  - fila fija con Resumen (antes «Reglas»; 16 nov), Glosario y Laboratorio;
  - la ficha de reglas, abierta;
  - la consigna, arriba de la figura (la figura fija la tapaba);
  - botones «Siguiente: …».
- **Un color por función:**
  - jugar, en naranja;
  - comprobar (predice y ahora tú), en morado;
  - leer y ver (mira y la regla), en turquesa;
  - ayuda, en verde;
  - las puertas de la unidad, con el color de su función.
- **Escenas de ejercicios:**
  - barra «‹ Volver a la unidad», que reemplaza el «‹ App» chico;
  - la pregunta que espera al juego ya no parece apagada: dice «↑ Primero juega con la figura».
- **El título de la unidad** se parte con guion («proporcio-nes»), no a la mitad de la palabra.

**Fase 2, hecha (15 nov, noche)** (molde en `docs/teoria.md`, 4e):
- **El glosario en tarjetas de colores:** buscador arriba, un mazo deslizable por idea, «Ver ejemplo», «Verla en la teoría», «Ya me la sé» y un repaso con tarjetas que se voltean. Vale para las 152 unidades sin tocar su contenido.
- **El momento «Lee»:** de 2 a 4 tarjetas para leer antes de jugar. No pregunta ni bloquea, y no adelanta la respuesta de «Predice».
- **«Así se resuelve»:** un ejercicio del mismo tipo que «Ahora tú», calculado por las mismas cuentas y revelado paso a paso: qué me piden, qué tengo, qué regla uso, las cuentas y si tiene sentido. Trae «Otro ejemplo».
- Los dos momentos son opcionales por idea: las unidades que no los traen siguen igual.
- **Probado en:** Razones y proporciones y Movimiento parabólico y circular (ideas 1 y 2 de cada una).
- La animación de la base 3D (el cañón) se hizo antes, en la ronda 5 (`docs/3d.md`, sección 6).

**Siguiente:** con el visto bueno de Gerson, la ronda 6 llena «Lee» y «Así se resuelve» en las 152 unidades.
