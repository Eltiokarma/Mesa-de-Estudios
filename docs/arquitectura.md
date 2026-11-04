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
| **Lectura** | Textos con preguntas y explicación de por qué cada alternativa es correcta o no | Razonamiento verbal, comprensión de lectura | Textos propios, preguntas y explicaciones |

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
- El motor de predicciones generadas, con la primera unidad de aritmética o química que lo use.
- Biología y los cursos de letras: el catálogo ya los admite (`area: "letras"`); se agregan cuando entren al alcance.

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
