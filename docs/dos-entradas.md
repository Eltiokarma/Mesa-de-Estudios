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
3. **Integrar a `main`:** los cambios actuales se prueban primero en una versión de prueba y en el Redmi 15C antes de integrarlos. Hoy son los 187 commits de `claude/awesome-einstein-ch5g9a`: la ronda 3 de teoría y `app/prueba3d/`. Se revisa qué incluyen y cómo funcionan.

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

## Antes de que la primera unidad 3D se publique

- **Respaldo para equipos sin WebGL 2:** el dibujo de siempre (Canvas o SVG), con la misma unidad completa.
- **Control con teclado** para girar y elegir, para las computadoras del laboratorio y para accesibilidad.
- **Versión con el service worker:** three.js y la pieza 3D van en la cáscara versionada (`VERSION` de `app/sw.js`). Un `?v=` en la dirección no basta, porque el service worker lo ignora.
- **Modo ahorro** que el alumno elige: menos resolución y sin sombras ni animaciones de adorno.
- **Mesa 3D del inicio:** después de la primera unidad completa, no antes.
