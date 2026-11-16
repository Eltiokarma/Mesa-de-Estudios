# Encargo, ronda 6: «Lee» y «Así se resuelve» en geometría (parte B) (16 nov 2026)

Eres una sesión paralela del proyecto Mesa de Estudios (repo Eltiokarma/mesa-de-estudios).

Gerson probó la app y decidió dos cosas:
- Leer también es lúdico, si la teoría se presta para ser digerible.
- Faltaban ejercicios resueltos paso a paso, para que el alumno sepa por dónde empieza el análisis.

Con eso nacieron dos momentos nuevos por idea: **«Lee»** y **«Así se resuelve»**. El molde ya existe, está probado y Gerson lo aprobó («Dale con Lee y Así se resuelve»). Tu trabajo son estas 9 unidades de geometría, ni una más:

- `geometria.simetria`
- `geometria.areas-poligonales`
- `geometria.longitud-y-areas-circulares`
- `geometria.geometria-del-espacio`
- `geometria.poliedros`
- `geometria.prisma-y-piramide`
- `geometria.solidos-de-revolucion`
- `geometria.geometria-analitica`
- `geometria.razonamiento-con-figuras`

## Arranque
1. Trabaja en la rama `teoria6/geometria-b`, que sale de `main`. Si no estás en ella, créala desde `origin/main`.
   - Sube solo a `teoria6/geometria-b` (`git push -u origin teoria6/geometria-b`). Nunca a main ni a otra rama. No abras PR.
2. Lee, en este orden:
   1. `CLAUDE.md`;
   2. **la sección 4e de `docs/teoria.md`, que manda**, y la sección 5 (topes);
   3. las dos unidades de referencia, donde las ideas 1 y 2 ya traen los dos momentos:
      - `contenido/teoria/aritmetica/razones-y-proporciones.js`;
      - `contenido/teoria/fisica/movimiento-parabolico-y-circular.js`.
3. Mira cómo los muestra el lector: `app/teoria.js`, funciones `lee()` y `resuelve()`. No lo cambies.

## Qué hacer en cada idea de cada unidad
**Todas las ideas** llevan los dos momentos. Si una unidad de tu lista ya los trae en algunas ideas, completa las demás.

### 1. `lee`: de 2 a 4 tarjetas, antes del juego
- **Para qué sirve:** contexto cercano (Juliaca, Puno, el Perú, la vida diaria), vocabulario de la idea y qué mirar al jugar.
- **No adelanta la respuesta de «Predice»** (regla 3). Lee la pregunta de `predice` antes de escribir: si una tarjeta deja deducir la opción correcta, sobra.
- **Forma de cada tarjeta:**
  - frases completas, en tono de conversación;
  - 45 palabras o menos;
  - un `titulo` corto;
  - una `ecuacion` solo si ayuda a leer.
- **Última tarjeta:** puede decir qué mirar en el juego.
- **Glosario:** si usas una palabra técnica nueva, va al `glosario` de la unidad.

### 2. `resuelve`: un ejercicio resuelto, después de «La regla»
- **Es del mismo tipo que `ahoraTu`.** Usa las mismas cuentas o el mismo motor (regla 1: nada escrito a mano), con otras semillas (`azar(semilla + 900)`).
- **Pasos con tipo fijo:**
  1. `pide`: siempre el primero;
  2. `datos`;
  3. `regla`: obligatorio;
  4. `cuentas`: obligatorio. En razonamiento verbal, o donde no hay cuentas, va `aplica` («Lo aplico»);
  5. `sentido`: comprueba con las unidades, el orden de magnitud o el dato de vuelta.
- **Topes:** de 3 a 6 pasos; cada paso de 30 palabras o menos, más su ecuación.
- **El paso `regla`** dice la regla de la idea en palabras del alumno, no copia `regla.texto`.
- **Dibujo:** si la idea tiene figura, el enunciado lleva `dibujo`, y el paso de las cuentas puede cambiarla.
- **Revisa a mano las cuentas de 3 semillas** antes del commit.

## Objetos que la figura no dibuja (pedido de Gerson)
Gerson encontró una consigna que decía «El lápiz crece y se encoge solo» sobre una barra: no había ningún lápiz. En cada unidad de tu lista, revisa la consigna, la `voz`, `lee`, «Mira», las preguntas y la lectura:
- Si un texto nombra un objeto que la figura no muestra (un lápiz, una combi, una persona, un vaso…), **cambia el texto para que diga lo que se ve** (por ejemplo, «la barra naranja»).
- **No dibujes objetos nuevos.** Los vectores son de Gerson (`CLAUDE.md`).
- Anota cada caso en el reporte, en «Pedidos de vectores para Gerson»: unidad, idea, qué objeto haría falta y para qué.
- Revisa también que lo que dice el texto sea creíble (un lápiz de 2,5 m no lo es).

## Reglas que no se rompen
- **Las de `CLAUDE.md`:**
  - regla 1: el cálculo, en el motor;
  - regla 3: jugar, predecir, ver;
  - regla 4: un color por variable, el mismo de la unidad;
  - regla 5: contenido propio, sin copiar manuales.
- **Qué no se toca:**
  - `app/`, `nucleo/` y `plantillas/`;
  - las unidades que no están en tu lista;
  - las preguntas de «Predice» y sus opciones, «Mira», «La regla», «Ahora tú», los juegos y las mesas, salvo para corregir un objeto que no se dibuja;
  - los `id` de ideas, mesas y controles.
- **Después de cada unidad:**
  - corre `npm run catalogo` y `node --test contenido/teoria/teoria.test.js 'nucleo/**/*.test.js'` (el validador revisa 12 semillas de `resuelve`);
  - recorre con Playwright a 360 × 780 una idea de la unidad, con `npm run dev` corriendo y un alumno `{ uni: 'unmsm', grado: '5' }` en `localStorage['lab-v1']`, y comprueba que:
    - la idea abre en «Lee», el botón pasa de tarjeta en tarjeta y «Ir directo a jugar» salta al juego;
    - en «Así se resuelve» (pon `momento: 'resuelve'` en `est.teoria[unidad].ideas[idea]`), el botón revela los pasos uno por uno, sale la respuesta y «Otro ejemplo» cambia el enunciado;
    - no hay errores de consola;
  - mira las capturas.
- **Commits:** uno por unidad («Lee y Así se resuelve en <unidad>»), con push después de cada commit. `npm test` completo en verde antes del último push.
- **Idioma:** con el usuario, español peruano informal. El contenido para alumnos va en español claro y neutro, con la voz de Neri (nutria).
- Puedes repartir las unidades entre subagentes, cada uno en una copia aparte del repo y tocando solo el archivo de su unidad. Tú revisas, pruebas e integras.

## Al terminar
Deja `rutinas/teoria6-geometria-b.md` con:
- por unidad, qué cuenta «Lee» en cada idea y qué ejercicio resuelve;
- las semillas que revisaste a mano;
- los objetos corregidos y los **pedidos de vectores para Gerson**;
- lo que no se pudo y por qué;
- lo no verificado.

Súbelo con el último commit. No integres a main: la sesión principal integra.
