# Rutina unidades-notas (12 nov 2026)

Rama `rutina/unidades-notas`, creada desde `claude/awesome-wozniak-5etl1n`. Tres decisiones de Gerson del 12 nov 2026. `npm test`: 7709 pruebas en verde. No se subió `VERSION` ni se tocó `app/datos/`.

## 1. Trampas de unidades y magnitudes en todos los cursos

**Helper común, mínimo y con pruebas:**
- `nucleo/predicciones.js`: `P.esUnidades(id)`, `P.enEscala(valor, correcta, id, { tope = 20, topeUnidades = 1000 })` y `P.CODIGO_UNIDADES`.
- `nucleo/probar-generador.js`: `topeEscala(a)`, `dentroDeEscala(a, correcta)` y `esTrampaDeUnidades(a)`.
- Un distractor con código U1–U8 (física), QU (química), AU (aritmética, álgebra, geometría y trigonometría) o RU (razonamiento matemático) puede llegar a **1000 veces** la correcta. El resto sigue con 20.
- Las trampas de unidades tienen un margen binario (1e-9) para que un ×1000 exacto no se pierda por redondeo. Los demás distractores conservan el borde estricto.

**Códigos nuevos:** están en `docs/investigacion/unidades-ideas-erroneas.md`: QU1–QU4, AU1–AU4 y RU1–RU2, todos hipótesis.

**Física:** los filtros y las pruebas de escala de 15 generadores usan el helper. Las trampas que se habían perdido volvieron:

| Generador | Trampa |
| --- | --- |
| `carga-en-campo` | `U2-mT` (mT tomados como T, ×1000 o ÷1000) en radio, periodo y riel; `U2-cm` (cm como m) en el riel |
| `induccion-flujo` | `U3-cm2` (cm² entre 100) en carga, fem máxima y fem media; `U6-ms` (ms como s) |
| `condensadores` | `U3-cm2` y `U2-mm`: ya existían, pero el filtro las botaba |
| `circuitos-joule` | `U6-min` (minutos por segundos) ahora sale en 453 de 1500 problemas. Las trampas U2, U5 y U6 quedan fuera de la regla de 60 veces |
| `calor-escalas` | `U8-kelvin` (sumar 273 a una variación) en el sudor. Las trampas U pueden salir del rango físico, tener hasta 3 decimales y siempre va una entre las alternativas |

«g por kg» en la catarata no se pudo poner. Con rapidez inicial da una altura negativa, y sin ella el problema nunca junta 4 alternativas. Queda pendiente.

**Química:** 14 trampas `AQ-` de unidades pasaron a QU1–QU3, en `conversiones-quimica` y `estequiometria-admision`. Ahí ya estaban gramos como kg, 1 L = 100 cm³, restar 273, mL sin pasar a L, etc. Además, `conversiones-quimica` ya respeta el tope de 1000: los cm³ que quedaban en un problema de m³ eran un millón de veces.

**Trigonometría:** `AV-sin-convertir` (km/h como m/s) pasó a `AU3-sin-convertir` en `trig-angulos-verticales`.

**Prueba transversal:** `herramientas/trampas-unidades.test.js` exige que cada generador de su lista saque sus trampas y que ninguna pase de 1000 veces. Hoy cubre 8 generadores.

**Pendiente:** hice un barrido de los generadores de química, aritmética, álgebra, geometría, trigonometría y RM con datos con unidades. Casi ninguno mezcla unidades dentro de un mismo problema: los datos van en cm y la respuesta también. Por eso no tienen dónde poner una trampa sin crear una variante nueva, con datos en cm y respuesta en m², por ejemplo. Por presupuesto no las hice. Los que más la piden:

| Curso | Generadores | Trampa |
| --- | --- | --- |
| Geometría | `geo-areas-circulares`, `geo-troncos-prismas`, `geo-proporcionalidad` (escalas) | AU1 y AU2 |
| Aritmética | `porcentajes-planteo` (L, kg, m³) y `fracciones-problemas` (horas) | AU |
| RM | `rm-relojes` y `rm-rumbos` (km/h y horas) | RU1 y AU3 |
| Química | `soluciones-meq-ppm` (mL/L, ppm en mg) | QU1 y QU2 |
| Química | Å/nm de `conversiones-quimica` (`AQ-potencia-diez-*`) | Falta decidir si van a un QU5 de longitudes |

## 2. Moléculas reales sin exclusión

`nombre-polifuncional` ya no excluye nada. Salen:
- el ácido cítrico y el isocítrico;
- la fenilalanina y la tirosina;
- la glucosa, la ribosa y la fructosa de cadena abierta;
- el ácido salicílico;
- la secuencia del etano (etano-1,2-diol, etanodial, ácido etanodioico).

La prueba ahora exige que salgan con su nombre IUPAC. Ningún otro generador de química excluía moléculas.

## 3. Tarjeta «Convención del examen»

`nucleo/convencion.js` es una tarjeta grande y reutilizable. Lleva:
- un sello «📌 Convención del examen» y un título;
- «Así se responde en el examen de admisión»;
- «En la universidad verás que…», en un recuadro a trazos.

Trae las cuatro convenciones: `hibridacion`, `azufre-expandido`, `dativos` y `etapa-lenta`. Tiene contraste de 7:1 o más en claro y en oscuro (con prueba) y pasa a dos columnas por container query. Está documentada en `docs/diseno.md`, «Convención del examen».

**Dónde está:**

| Lugar | Convención |
| --- | --- |
| `molecula-grande`, paso 1 | hibridación |
| `molecula-grande`, el azufre del ajo | S=O con 10 electrones; reemplaza la letra chica «Algunos libros la escriben S⁺–O⁻» |
| `enlace`, paso 4 | hibridación |
| `cinetica`, «Mecanismos», paso 5 | etapa lenta |
| Práctica | campo `convenciones` del problema, pintado por `app/practica.js` y validado por `probar-generador.js` |
| `quimica-conceptos`, tema de los dativos | dativos |
| `nombre-polifuncional`, hibridación de la secuencia de oxidación | hibridación |

**Playwright:** las tres escenas y la práctica se probaron a 390 y 1366 px, en claro y en oscuro. La tarjeta se ve en todas, sin desbordes ni errores de consola.

## Verificación a ciegas

Diez casos de `casos.json` cambiaron porque cambió el flujo del azar:
- cinco de física: `induccion-flujo` 28 y 39, `cargas-sistema` 15, `energia-potencia` 15 y `fluidos-hidrodinamica` 16;
- cinco de `nombre-polifuncional`: 17, 18, 20, 141 y 373.

Un subagente que no vio el generador los resolvió: 10/10 coinciden en letra y valor. Quedó anotado en el campo `verificacion` de cada `casos.json`. El subagente hizo una observación sobre la semilla 141: la cadena principal del isocítrico tiene 3 C con la regla IUPAC 2013 (más grupos principales) y 5 con la regla antigua (cadena más larga). La app usa la de 2013 y la de 5 no está entre las alternativas.

## Para la integración

- `app/sw.js`: `/nucleo/convencion.js` entró en la CASCARA y `app/app.js` lo carga con la práctica. Hay que **subir `VERSION`**.
- Cambiaron ids de error, `AQ-*` → `QU*` y `AV-sin-convertir` → `AU3-sin-convertir`. Todavía no hay datos de alumnos, así que la medición no pierde historia.
