# Rutina de vectores (8 nov 2026)

Rama `rutina/vectores`, creada desde `claude/awesome-wozniak-5etl1n`. Encargo: generadores G1 a G3, vectores 0.2.0 y la decisión de núcleo para G4 a G7. Mapa: `docs/clasificacion/compendio-vectores.md` (regla 5: no se abrió ningún PDF; todo enunciado y número es propio).

## Tarea 1: generadores G1 a G3 (formato «predicciones»)

Los tres están enganchados a `fisica.magnitudes-y-vectores`, después de la escena `vectores`, igual que porcentajes sucesivos. Corrí `npm run catalogo`. Mis G1, G2 y G3 son el G1, el G2 y el G7 del mapa.

| Módulo | Tipos | Respuesta |
| --- | --- | --- |
| `plantillas/vectores-ley-cosenos/` (G1, T8) | \|A + B\| y \|A − B\| (directo); el ángulo a partir de \|A + B\| o de A + B + C = 0; el ángulo con módulos iguales y \|A + B\| = k·\|A − B\| (o al revés), con k = 2, 3 o √3; R para un ángulo dado a partir del máximo y el mínimo | entero o a√b, o un ángulo |
| `plantillas/vectores-componentes/` (G2, T7, T9 y T11) | módulo de la resultante de 2 a 4 vectores, también como fuerza que equilibra un anillo o como desplazamiento con puntos cardinales (norte = +y); módulo de una combinación como 2A − B + C; ángulo de la resultante con +x (0° a 360°) | entero o k√n (n = 2, 3, 5), o un ángulo |
| `plantillas/vectores-productos/` (G3, T13) | A·B en 2D y 3D; ángulo entre A y B con coseno notable; m para que A ⊥ B; c en A × B = c·k; \|A × B\| a partir de \|A\|, \|B\| y A·B; área de un triángulo de vértices enteros | entero con signo, a√b, ángulo o u² |

**Convención de academia sin miedo.** sen 37° = 3/5 y cos 37° = 4/5. En G2, cada problema usa una sola familia de ángulos (37°/53°, 45°, 30° o 60°) con módulos que dan componentes exactas. Así R² sale entero y la resultante es «de academia»: entera o k√2, k√3, k√5.

**Distractores.** Cada uno tiene código, explicación y respaldo. Solo entran los que se escriben igual que la correcta: si la correcta es a√b, no se mezcla con un decimal que la delataría. Hay pruebas para eso.
- Parciales (E8 y M2 de `docs/investigacion/`): `VE-suma-modulos` y `VE-resta-modulos`.
- Del mapa y de la escena, como hipótesis: `VE-coseno-con-menos`, `VE-pitagoras-siempre`, `VE-sen-cos-cambiados`, `VE-angulo-complementario`, `VE-maximo-minimo-como-modulos`, `VE-tangente-invertida`, `VE-angulo-de-referencia`, `VE-sentido-opuesto`, `VE-recorrido-vs-desplazamiento`, `VE-escalar-por-vectorial`, `VE-mano-derecha-invertida` y `VE-area-sin-mitad`.
- Nuevos (hipótesis):
  - en G1: `VE-diferencia-con-mas`, `VE-sin-raiz`, `VE-angulo-interior` (el ángulo interior del triángulo de tres vectores que se anulan), `VE-razon-invertida`, `VE-diagonales-perpendiculares`, `VE-angulo-con-resultante` (θ/2) y `VE-promedio-max-min`;
  - en G2: `VE-signo-por-cuadrante`, `VE-componentes-sumadas`, `VE-resta-como-suma` y `VE-coeficiente-olvidado`;
  - en G3: `VE-escalar-sin-signos`, `VE-escalar-cruzado`, `VE-escalar-como-suma`, `VE-escalar-signo-final`, `VE-signo-del-escalar`, `VE-perpendicular-sin-escalar-cero`, `VE-despeje-signo`, `VE-despeje-multiplica`, `VE-despeje-sin-coeficiente`, `VE-escalar-uno`, `VE-signo-determinante`, `VE-vectorial-modulos`, `VE-producto-modulos`, `VE-identidad-con-mas` y `VE-vertices-sin-restar`.

**Pruebas.** Cada `generador.test.js` incluye:
- `probarGenerador` sobre 600 semillas: una sola correcta, 4 o 5 opciones distintas, todos los errores con código y respaldo;
- un recálculo independiente en cada semilla, por otro camino: componentes en vez de ley de cosenos, polarización para A·B, determinante 3 × 3 y Herón para el área;
- los `casos.json`: 29 casos (7, 14 y 8), con una semilla por tipo y familia más `entrada-1` y `salida-1`. Los verificó un subagente a ciegas, sin ver los generadores, con aritmética exacta en Q(√2, √3). Cuadraron todos.

**Cambio chico en el núcleo** (`nucleo/predicciones.js`, compatible hacia atrás, con pruebas nuevas en `nucleo/predicciones.test.js`):
- `armar` acepta `negativos: true`, para respuestas con signo como A·B, m o c;
- `armar` acepta `texto: fn`, para escribir y comparar las opciones como las ve el alumno;
- hay un `radical(x)` nuevo que escribe 5√3, √26/2 o −2√2.

Lo pedía el mapa («convendría además una opción para aceptar respuestas negativas»). No es `armarTexto` (ver la tarea 3).

**Colores.** Los generadores usan la paleta de la app (`c-o`, `c-i`, `c-h`, `c-d`): A naranja, B turquesa, θ rojo, R verde. No hay colores nuevos.

Playwright: los tres módulos funcionan a 390 y 1366 px, sin errores de consola ni desbordes.
