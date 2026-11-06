# Arquitectura: una app que crece por módulos

4 de noviembre de 2026 · Responde al pedido de Gerson: que entren aritmética, álgebra, trigonometría, geometría y los dos razonamientos, y que agregar cursos, unidades y módulos sea fácil en el futuro.

## La idea

Separar **qué** se enseña de **cómo** se enseña y de **dónde** se muestra:

| Capa | Qué es | Dónde vive | Quién la cambia |
| --- | --- | --- | --- |
| Catálogo | Cursos, unidades y temas; en qué universidad entra cada uno; qué módulos los cubren | `catalogo/` (JSON) | Se edita un archivo; no se toca código |
| Módulos | Las plantillas: escena, motor, casos de prueba y problemas de papel | `plantillas/<id>/` | Cada módulo es independiente; se agrega una carpeta |
| Núcleo compartido | Piezas que usan varios módulos: dibujo de flechas y cotas, colores por variable, gráficas de funciones, geometría plana | `nucleo/` (todavía no existe) | Se crea recién cuando un segundo módulo necesite lo mismo que el primero |
| App | La PWA: bienvenida, inicio, cursos, progreso y perfil; carga los módulos y funciona sin conexión | `app/` (primera versión) | Lee el catálogo; no conoce los módulos por dentro |
| Datos del alumno | Progreso, predicciones, repasos pendientes | En el celular primero; sincronización después | Se guardan con el **id de la unidad**, que nunca cambia |

Así, la app nunca tiene una lista de cursos escrita en el código: la saca del catálogo. Agregar trigonometría es agregar `catalogo/cursos/trigonometria.json`; agregar una plantilla es agregar su carpeta y nombrarla en la unidad que cubre.

## Tres formatos de módulo

No todo se enseña con una escena. Cada curso declara su `formato_principal` y cada módulo puede ser de uno de estos tipos:

| Formato | Para qué | Ejemplos | Qué trae |
| --- | --- | --- | --- |
| **Escena** | Pasar del enunciado al modelo con una simulación | Física, geometría, trigonometría, funciones en álgebra | `motor.js` + `index.html` + `casos.json` + problemas de papel |
| **Predicciones** | Preguntas rápidas donde las alternativas son errores típicos, con explicación inmediata | Química conceptual, aritmética, gran parte del razonamiento matemático | Banco de preguntas propias con su error típico por alternativa; un motor que genera variantes y verifica la respuesta |
| **Lectura** | Textos con preguntas, un paso previo antes de las alternativas y explicación de por qué cada alternativa es correcta o no | Razonamiento verbal, comprensión de lectura | Banco de textos propios en `contenido/`, `nucleo/lectura.js` y `app/lectura.js` (sección «Formato lectura») |

Los tres comparten las reglas de `CLAUDE.md`: predecir antes de ver, errores reales como alternativas, contenido propio y problemas de papel. Lo que cambia es la interfaz.

En matemática, el potencial es desigual:
- **Geometría y trigonometría** son las más visuales de todo el examen: figuras que se arrastran, la circunferencia trigonométrica, ángulos que se mueven.
- **Álgebra** gana con escenas donde hay funciones y gráficas, y con predicciones en el resto.
- **Aritmética y razonamiento matemático** van mejor con predicciones que se generan solas: el motor crea un problema con números nuevos, calcula la respuesta y arma las alternativas a partir de errores típicos. La regla 1 se cumple igual: la respuesta la calcula el código, nunca un modelo de lenguaje.
- **Razonamiento verbal** es lectura.

## Qué se hace ahora y qué se deja para después

**Ahora:**
- El catálogo con 8 cursos (física, química, aritmética, álgebra, geometría, trigonometría, razonamiento matemático y razonamiento verbal), sus unidades y dónde entran en la UNI y en San Marcos. Formato en [`catalogo/LEEME.md`](../catalogo/LEEME.md).
- La ficha `plantilla.json` de cada módulo (hoy, solo el Banco Óptico).
- Una prueba (`catalogo/catalogo.test.js`) que corre con `npm test` y avisa si una unidad cita una plantilla que no existe, si un id se repite o si una plantilla no está en el catálogo.

**Después, cuando haga falta y no antes:**
- `nucleo/`: se extrae la primera pieza compartida cuando el segundo módulo la necesite. Hacerlo antes sería adivinar.
- `app/`: ya existe una primera versión (bienvenida, inicio, cursos, progreso y perfil, sin conexión). Falta el planificador y el modo lápiz y papel.
- ~~El motor de predicciones generadas.~~ Hecho (5 nov 2026): `nucleo/predicciones.js`, `app/practica.js` y dos módulos (`estequiometria-limitante`, `porcentajes-sucesivos`). Cada alternativa incorrecta lleva el id del error, su explicación y su respaldo (`documentado` o `hipotesis`); la medición registra cuál eligió cada alumno.
- Biología y los cursos de letras: el catálogo ya los admite (`area: "letras"`); se agregan cuando entren al alcance.

## Pruebas de entrada y salida por curso (la1, 6 nov 2026)

Miden lo que se aprende en el piloto. El banco vive en `catalogo/pruebas/<curso>.json`, uno por curso con plantillas (6 nov 2026: física 10 ítems, química 10, geometría 9, trigonometría 10, álgebra 10, aritmética 8 y razonamiento matemático 8, por forma; 130 en total, y 2 pares en reserva en álgebra). `npm run catalogo` lo copia a `app/datos/pruebas.json` sin los campos de verificación ni la reserva; el servidor local lo arma al vuelo. Si solo cambió el banco, basta con regenerar ese archivo (`construirPruebas` en `herramientas/construir-catalogo.js`).

```json
{
  "curso": "fisica", "version": "1.0.0", "fecha": "2026-11-06", "minutos": 15,
  "informes": ["docs/investigacion/cinematica-ideas-erroneas.md"],
  "errores": { "G2-lee-el-eje": { "respaldo": "documentado", "describe": "Lee el corte con el eje en vez de la pendiente" } },
  "pares": [{
    "par": "fis-01", "plantilla": "mruv", "unidad": "fisica.movimiento-rectilineo",
    "mide": "Leer la velocidad como pendiente de una recta x-t que no pasa por el origen",
    "A": { "enunciado": "…(0 s; 6 m) y (5 s; 26 m)…", "datos": { "t1": 0, "x1": 6, "t2": 5, "x2": 26 },
           "opciones": [ { "texto": "4 m/s", "valor": 4, "correcta": true },
                         { "texto": "6 m/s", "valor": 6, "error": "G2-lee-el-eje" } ] },
    "B": { … }
  }]
}
```

| Campo | Qué es |
| --- | --- |
| `pares` | De 8 a 10. Cada par es una pregunta con dos versiones paralelas, `A` y `B`: misma plantilla, misma unidad, mismo número de opciones y **los mismos códigos de error**. El id del ítem es `par` + forma (`fis-01A`). |
| `opciones` | De 3 a 5. Una con `correcta: true`; cada incorrecta con `error`, un código de los informes de `docs/investigacion/` o de las escenas (el mismo que registran las escenas). |
| `valor` / `clave` | Lo que calcula el motor: un número (`valor`) o un texto (`clave`; si falta, se compara el `texto`). |
| `datos` | Los números del enunciado, que recibe el verificador. Los que no salen en el enunciado (la altura de la vela, el radio de la bombilla) van dentro de `datos.modelo`. La prueba exige que cada número de `datos` aparezca en el enunciado. |
| `transferencia` | (opcional, por par) `true` si mide una idea que el módulo no practica directamente; sirve para cursos con un solo módulo (hoy ningún par lo usa: aritmética ya tiene cuatro módulos). El análisis puede separar esos pares. |
| `reserva` | (opcional, en el banco) pares ya verificados de una plantilla que todavía no está en el catálogo (hoy, `cuadrado-crece` en álgebra). No van a la app; la prueba avisa cuando la plantilla entra al catálogo y hay que pasarlos a `pares` (cuidando el máximo de 10). |
| `errores` | Diccionario de los códigos usados, con `respaldo` (`documentado`, `parcial`, `hipotesis`) y una descripción corta que ve el analista y el alumno al final de la salida. |

**Cuántos por plantilla.** Con 4 o más plantillas en el curso, 1 o 2 pares por plantilla (aritmética y razonamiento matemático: 2 de cada una); con menos, se reparten los 8 a 10. Si una plantilla del curso no tiene ítems, la prueba solo avisa.

**Verificación (regla 1).** `catalogo/pruebas/verificar.js` tiene un verificador por par que llama al motor de la plantilla (`plantillas/<id>/motor.js`) con los `datos` y devuelve la respuesta y el valor de cada distractor. `catalogo/pruebas/pruebas.test.js` comprueba con eso cada respuesta, cada distractor, que el número escrito en el texto sea el `valor`, que ningún distractor coincida con la respuesta, el formato (`Pruebas.validar`) y que las formas sean paralelas. Aritmética no tiene motor (el generador de porcentajes no expone sus cuentas): sus ítems se recalculan con factores exactos dentro del verificador. Un curso o una plantilla sin ítems no rompe las pruebas: sale un aviso (diagnóstico).

Además, tras la revisión del 6 nov 2026, la prueba exige:
- **Nada repetido de lo que el alumno practica** (`catalogo/pruebas/parecidos.js`): cada enunciado se compara con las preguntas de la escena de su plantilla (cadenas con «¿» de su `index.html`) y con 4000 problemas de su generador. Falla si comparten dos o más números y tres palabras clave, o si comparten cinco palabras clave y el 60 % de las del texto más corto. `node catalogo/pruebas/parecidos.js` lista los parecidos.
- **La respuesta no está escrita en el enunciado** (salvo 0), y **los atajos caen igual en A y B**: si copiar un número del enunciado lleva a un distractor en una forma, debe llevar al mismo distractor en la otra.
- **Forma de las opciones:** en cada ítem, o todas las opciones traen justificación («…, porque…», «…: …») o ninguna; la correcta no es mucho más larga ni mucho más corta que las demás; y en cada curso con 6 o más ítems de cada tipo, la correcta no es la más corta, la más larga, el menor o el mayor valor en más del 40 % de los ítems.

**Contrabalanceo.** `nucleo/pruebas.js` asigna a cada alumno y curso el orden `AB` (A de entrada, B de salida) o `BA`, al azar con una semilla hecha del id anónimo; las opciones se barajan con otra semilla fija por alumno e ítem.

**En la app** (`app/prueba.js`): la entrada aparece la primera vez que el alumno entra al curso o abre una de sus unidades (puede decir «Ahora no»), sin decirle qué acertó. La salida **solo** se puede hacer si el profesor la abrió en ese navegador con `…/app/?salida=fisica` (o `=todas`); si no, la tarjeta del curso dice «La prueba de salida la abre tu profesor». Al terminar la salida se ve solo el puntaje de entrada contra salida; la revisión pregunta por pregunta (qué mide, la correcta y el error) aparece solo si el profesor la abre con `?soluciones=fisica` (o `=todas`). Las habilitaciones quedan en el navegador, también al cambiar de alumno.

**Otro alumno en esta PC** (Perfil, y en Inicio en pantalla grande; ruta `#/otro`): avisa cuántos registros faltan descargar (desde la última descarga, clave `lab-exportado-v1`), ofrece «Descargar y cambiar», y luego crea un id anónimo nuevo y deja en blanco avance y pruebas. Se conservan el colegio, la apariencia y las habilitaciones. Los registros del alumno anterior siguen en el almacenamiento con su id y salen en la próxima descarga (`analizar-medicion.js` los separa por id y quita duplicados).

**La clave no va en texto plano.** En `app/datos/pruebas.json` cada forma trae solo los textos de las opciones y `k`: el índice de la correcta y los códigos de error, mezclados (XOR) con una cifra que sale del id del ítem (`Pruebas.ocultar` y `Pruebas.revelar`). **No es seguridad real**: cualquiera que lea `nucleo/pruebas.js` puede deshacerlo. Solo evita que la respuesta se vea con abrir el JSON.

**Registro** (`nucleo/medicion.js`): un evento `item` por respuesta (curso, fase, forma, orden, banco, item, par, plantilla, unidad, opcion, correcta, error, ms) y uno `prueba` al terminar (aciertos, total, respuestas, ms, origen, previas, dias; en la salida, origen es siempre `profesor`). Además, `habilitacion` (que: `salida`, `soluciones` o `soluciones-vistas`; curso; origen `profesor`) cuando el enlace del profesor abre algo, y `sesion` (accion `otro-alumno`) al cambiar de alumno. Las columnas nuevas van al final del CSV. `herramientas/analizar-medicion.js` resume por curso: puntajes, ganancia normalizada de Hake, la forma A contra la B en la entrada (para ver si son equivalentes), acierto por plantilla y, por código de error, cuántos alumnos pareados lo cometieron antes y después.

## Formato lectura (pl4, 6 nov 2026)

Razonamiento verbal. El diseño que manda es [`docs/formato-lectura.md`](formato-lectura.md); aquí, cómo quedó en el código.

| Pieza | Archivo | Qué hace |
| --- | --- | --- |
| Banco | `contenido/razonamiento-verbal/` | Textos (`textos/tNNN.json`), ejercicios sueltos (`ejercicios/eNNN.json`, todavía ninguno), `indice.json`, `frases.json` y `codigos.json`. Lo escribe la rutina verbal; `banco.test.js` aplica las reglas editoriales. |
| Códigos | `herramientas/codigos-verbal.js` | Lee las filas `\| RVn \|` del informe y escribe `codigos.json` (nombre, respaldo `documentado`/`parcial`/`hipotesis`, `por_verificar`). Lo corre `npm run catalogo`; una prueba avisa si quedó viejo. |
| Ficha | `plantillas/lectura-verbal/plantilla.json` | `formato: "lectura"`, `banco` y `pruebas` con rutas relativas que deben caer dentro de `contenido/`. `unidades` es justo el conjunto de unidades de las preguntas del índice (la prueba lo exige en los dos sentidos), y cada una nombra `lectura-verbal` en sus `plantillas`. |
| Catálogo | `herramientas/construir-catalogo.js` | Rama `lectura`: `url: "#/lectura/lectura-verbal"`, `banco` (la dirección del índice) y en `archivos` el banco entero ya normalizado (`/contenido/…`): índice, códigos, frases, textos de entrada, salida y práctica, y ejercicios. El service worker los guarda al instalar. |
| Núcleo | `nucleo/lectura.js` (+ `lectura.test.js`) | Sin DOM. `normalizar` (texto o ejercicio con la misma forma), `oraciones` (número seguido), `validar`, `preparar(item, semilla)` (baraja con `nucleo/azar.js`; cada alternativa lleva su letra y `pos`, su lugar en el banco), `calificar`, `calificarPrevio` (las tablas de la sección 5.3: `codigos`, RV4 para la primera oración, el rol; inversa → RV16 en analogías; `retoma` → RV28 al ordenar), `correccionPrevio`, `pintura`, `lista` y `siguiente` (orden del índice, filtrado por unidad, sin repetir hasta acabar) y `ev` (los eventos). |
| Pantalla | `app/lectura.js` + `app/estilos.css` | Ruta `#/lectura/<módulo>/<unidad>`. Flujo de la sección 2 del diseño; detalle abajo. |

**La pantalla.** Al leer, el texto va entero (18 px, interlineado 1,6, 65 caracteres), con el número del párrafo en un círculo y el de cada oración pequeño y gris; "Ya lo leí" registra el tiempo. Por cada pregunta con `previo`, el paso previo va primero y **las alternativas no están en la página** hasta tocar "Confirmar" (en su lugar hay un aviso con candado); elegir no graba nada. Los seis tipos:

- `marcar-oracion`: en celular, la consigna arriba, el texto entero con cada oración como un bloque tocable y "Confirmar" fijo abajo; "Ninguna la dice completa" si el previo la trae. Teclado: ↑ ↓ recorren las oraciones (y eligen), Enter confirma. En un ejercicio de eliminación, las oraciones del cuerpo.
- `clasificar` (con la sonda en un recuadro), `relacion`, `proposito` y `relacion-analogia` (las 12 relaciones escritas con las palabras de la pareja: "LECHE produce VACA"): botones de opción (`role="radio"`); 1–9 o ↑ ↓ eligen, Enter confirma.
- `ordenar`: tarjetas que se arrastran por el asa (dedo o ratón, con eventos de puntero), con botones ↑ ↓ en cada una; con teclado, Espacio toma la tarjeta, ↑ ↓ la mueven y Espacio la suelta.

Después, las alternativas (`.alt`, A–E o 1–5 con teclado) y la explicación: el veredicto, por qué falla la elegida y la frase de su código (`frases.json`), la explicación de la correcta, la corrección del paso previo (su `explicacion` y, si falló, la de lo que eligió o la frase de su código), "Ver las demás alternativas" plegado, y el texto pintado con los tres colores del diseño (evidencia `--c-i`, distractor `--c-o`, idea `--c-d`; si una oración es evidencia y origen del distractor a la vez, va como evidencia con un contorno naranja a trazos, y la explicación dice que de esa misma oración salen la correcta y lo que eligió). Cada bloque de la explicación cita además sus oraciones con su color, así que la idea del previo y la evidencia nunca se pintan sobre la misma copia del texto.

En el celular (menos de 900 px) se esconde la barra de abajo; en las preguntas el texto queda plegado en una franja fija de 56 px ("Ver texto ▾") y se relee en una hoja que sube al 85 % de la pantalla y se cierra deslizando hacia abajo, con "Volver a la pregunta" o con Esc. Desde 900 px: dos columnas, el texto a la izquierda (480 px, fijo y con su propio desplazamiento) y la pregunta a la derecha (520 px). Modo oscuro con los tokens de siempre.

**Pruebas de entrada y salida del módulo.** Si el índice tiene `entrada` y `salida`, son las formas A y B: cada alumno hace A→B o B→A según `nucleo/pruebas.js` (`Pruebas.orden(alumno, 'razonamiento-verbal')`, la misma regla de las pruebas por curso; `Lectura.formaPrueba`). Va primero, sin paso previo ni corrección y con la semilla fija `prueba-A` o `prueba-B`, igual para todos; la salida se ofrece después de 3 textos. Cada pregunta registra un evento `item` (`curso: 'razonamiento-verbal'`, `banco: 'lectura'`, `forma`, `orden`, `item: 't000av1.p1'`, `par: 'p1'`, `plantilla: 'lectura-verbal'`, `opcion`: posición en el banco, `correcta`, `error`, `respaldo`, `ms`) y al final una `prueba` con `curso`, `forma` y `orden`, así que `resumirCursos` y `analizar-medicion.js` dan la ganancia de Hake y los errores RV antes y después, como en los demás cursos (probado con un banco de muestra en `nucleo/lectura.test.js`). Hoy las dos están en `null` en el índice (los textos t000a y t000b los escribe la rutina verbal), así que la práctica empieza directo.

**Medición.** Eventos `lectura` (al tocar "Ya lo leí"), `previo` (opcion: la oración, `ninguna`, la clase, la relación o el orden `III-I-IV-II-V`) y `prediccion` con `opcion` = **posición en el banco** (1 a 5), no la letra; `prueba` con `respuestas` en posiciones. `problema` lleva la versión (`t001v1.p1`). Un código `null` del banco se registra con `error` vacío. `respuestas` es ahora la última columna del CSV. `Medicion.resumirLectura` y la sección "Formato lectura" de `analizar-medicion.js` dan, por módulo y por unidad, el acierto del previo y de la respuesta, y por código RV cuántas veces salió sin alternativas a la vista (previo) y con ellas (respuesta).

**Explicaciones al final.** Con `"explicar": "al-final"` en el texto o en el índice, el alumno responde todas las preguntas (con sus pasos previos) y recién al terminar el texto revisa cada una con su explicación y su texto pintado. Por defecto, la explicación va después de cada pregunta.

**Repetir y retomar.** `est.practica['lectura-verbal'].intentos` cuenta cuántas veces empezó el alumno cada texto, y `enCurso` guarda el texto a medio hacer (pregunta, si ya registró la lectura, respuestas). Si se va y vuelve, sigue en la pregunta donde quedó, sin registrar otra vez la lectura ni las preguntas ya respondidas. Los eventos `lectura`, `previo` y `prediccion` llevan `intento`, y la semilla del barajado es `${alumno}|${problema}|${intento}`: al repetir un texto cambia el orden. `resumirLectura` cuenta solo la primera respuesta de cada alumno a cada paso previo y a cada pregunta.

**Corrección del paso previo.** Si el banco no trae una explicación para la respuesta elegida, se usa la frase de su código, salvo donde esa frase describe otra cosa (`FRASE_NO_APLICA`: «Ninguna la dice completa» y «Lo dice el texto»); ahí la pantalla dice «La respuesta aceptada es … porque …» con la explicación del previo. `Lectura.avisos` lista las respuestas incorrectas sin explicación propia y la prueba las muestra como diagnóstico (hoy 59, 14 de ellas con la frase neutra), sin fallar: escribirlas es trabajo de la rutina verbal. La frase del código no se repite si ya salió en la alternativa.

**Accesibilidad.** Con la hoja abierta, la cabecera, el panel y la franja quedan `inert`: Tab no sale del texto. Al confirmar el paso previo, el foco va al enunciado (`.preg`, `tabindex="-1"`). Una región viva chica (`#lecVivo`) anuncia solo «Pregunta n de m» y el veredicto. Cada oración lleva «Oración n.» para el lector de pantalla también al leer.

**Claves en texto plano.** El banco se sirve tal cual (`/contenido/…`), con la correcta, los códigos, `rol`, `revision` y `hechos` a la vista de quien abra el JSON. Se acepta porque la lectura es práctica y la corrección necesita las explicaciones en el celular sin conexión; la medición es anónima y no tiene consecuencias para el alumno. `rol` sí lo usa la app (da el código por defecto del paso previo); `revision` y `hechos` no, pero quitarlos exigiría un paso de construcción que copie el banco, y pesan poco. Las pruebas de entrada y salida del módulo también van en claro: si algún día cuentan para algo, conviene mezclar la clave como en `app/datos/pruebas.json`.

**Sin conexión.** `app/sw.js` sirve también `/contenido/` (una prueba de `app/app.test.js` exige que todo lo guardado pase el filtro del `fetch` y que cada `<script>` de `index.html` esté en la cáscara).

## Cómo agregar cosas

**Una universidad nueva** (por ejemplo, la UNA Puno):
1. Completar su entrada en `catalogo/universidades.json`.
2. Hacer su mapa de temario en `docs/`, como `docs/taxonomia-unmsm-2026.md`.
3. Agregar la clave `una` en las unidades que pide. Si pide algo que no existe, se crea la unidad.

**Una unidad nueva:** se agrega al JSON de su curso con un id nuevo. Los ids **no se cambian ni se reutilizan** una vez publicados, porque el progreso de los alumnos se guarda con ellos. Si una unidad se parte en dos, se crean dos ids nuevos y la vieja se marca como retirada; no se renombra.

**Un curso nuevo:** se agrega `catalogo/cursos/<id>.json`. La app lo muestra sin cambios de código.

**Un módulo nuevo:**
1. Crear `plantillas/<id>/` con `plantilla.json`, el motor, los casos de prueba, su prueba y la escena.
2. Nombrarlo en la lista `plantillas` de la unidad que cubre.
3. Correr `npm test`, que debe quedar en verde.

## Decisiones que esta arquitectura evita tomar ahora

- **Framework de la app.** El catálogo es JSON y los módulos son HTML y JavaScript sin dependencias, así que sirven con cualquier framework o sin ninguno.
- **Servidor y cuentas.** Primero todo vive en el celular; la sincronización y el cobro llegan con el piloto pagado (fase 3 del fundacional).
- **Cómo se generan los módulos a escala.** El método se destila después de cuatro plantillas probadas (tarea 6).
