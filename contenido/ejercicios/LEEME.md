# Ejercicios entrantes (tanda de 7000)

Aquí se define cómo entra al repo cada ejercicio que manda Gerson (de academia o de examen) y cómo avanza hasta la app. El plan de la tanda está en [`docs/ejercicios-7000.md`](../../docs/ejercicios-7000.md). El formato que ve el alumno está en [`docs/escena-viva.md`](../../docs/escena-viva.md), sección 4.

- `esquema.json`: JSON Schema de un ejercicio.
- `tipos.json`: registro de tipos de problema. Cada tipo se mapea una sola vez y el mapeo vale para todos sus ejercicios.
- `ejemplos/`: tres ejercicios de juguete, inventados.
- Lo valida y lo cuenta `herramientas/validar-ejercicios.js`.

## Dónde viven los 7000

**Los ejercicios de academia no se versionan** (regla 5): sus enunciados y números no pueden entrar al repo. Van a `fuentes/ejercicios/<lote>/`, que hay que agregar a `.gitignore` antes de recibir la tanda. Al repo solo llegan:
- los conteos (tablas de `--contar`);
- los tipos de `tipos.json`, con nombres nuestros;
- los ejercicios oficiales y los propios, en `contenido/ejercicios/<lote>/`.

## Un archivo, uno o muchos ejercicios

El validador lee, recursivamente, cualquier carpeta:
- `.json` con un ejercicio, una lista de ejercicios o `{ "lote": …, "ejercicios": [ … ] }`;
- `.jsonl` con un ejercicio por línea, que es lo más barato para 7000.

`esquema.json` y `tipos.json` se saltan. Un `tipos.json` dentro de la carpeta manda sobre el de aquí.

## Campos

| Campo | Desde | Qué es |
| --- | --- | --- |
| `id` | crudo | Estable: no se cambia ni se reutiliza. `<lote>-<número>`: `of-unmsm-2025-I-0012`, `ac-vectores-0347`, `pr-…` |
| `estado` | crudo | `crudo` → `clasificado` → `mapeado` → `verificado` → `publicado` |
| `origen` | crudo | `{ tipo: "oficial", universidad, periodo }` (con `area`, `numero` y `fecha` si se saben), `{ tipo: "academia", fuente }` (referencia interna, nunca se muestra) o `{ tipo: "propio" }` |
| `enunciado`, `pregunta` | crudo | Texto con marcadores `{clave}` que apuntan a `datos`, o lista de segmentos como en los generadores (`"texto"` o `{ v, t }`) |
| `datos` | crudo, si se puede | `{ clave: { valor, unidad, texto, color, nombre } }`. Son los datos con color (regla 4): no cuentan para el presupuesto |
| `respuesta` | crudo, si la fuente la trae | `{ valor, unidad }` y, si se manipula, `tipo`, `control` y `tolerancia` (contrato, sección 4) |
| `clave_fuente`, `alternativas_fuente` | crudo | La letra y las alternativas tal como vienen. Solo sirven para clasificar y verificar |
| `curso`, `unidad`, `tipo` | clasificado | Unidad del catálogo y tipo `<unidad sin curso>/<tipo>`, por ejemplo `porcentajes/descuentos-sucesivos` |
| `mapeo` | mapeado | `{ via, generador, subtipo, pieza }`. Si falta, vale el de su tipo en `tipos.json` |
| `verificacion` | verificado | `{ por: "generador" \| "motor" \| "calculo-independiente", funcion, resultado, coincide: true }`. Regla 1: lo recalcula código, nunca un LLM |
| `escena`, `pasos`, `alternativas`, `fantasmas` | verificado (solo instancias fijas) | El formato vivo del contrato. Si el ejercicio va por generador, estos campos los produce el generador |
| `dificultad`, `figura_fuente`, `duplicado_de`, `lote`, `notas` | opcional | `figura_fuente`: la fuente traía figura, que se rehace siempre. `duplicado_de`: el mismo problema con otros números, para no contarlo dos veces |

## Los estados

1. **crudo.** Llegó: `id`, `origen` y `enunciado`. Si se puede, también `respuesta` o `clave_fuente`.
2. **clasificado.** Tiene `curso`, `unidad` (que existe en `catalogo/`) y `tipo`.
3. **mapeado.** Su tipo, o su propio `mapeo`, dice cómo llega a la app:
   - `generador`: ya existe en `plantillas/<id>/`, con el `subtipo` de su `_datos.tipo`;
   - `pieza`: hay pieza del kit, pero falta el generador;
   - `instancia`: un ejercicio fijo, con su escena y sus pasos escritos aquí. Solo para oficiales o propios;
   - `nuevo`: no hay nada. Es **huérfano**, como el tipo sin mapeo.
4. **verificado.** `respuesta.valor` recalculado por código (`verificacion.coincide: true`). Si es instancia fija, trae `escena`, `pasos` y `alternativas`, y cumple el presupuesto de texto.
5. **publicado.** Está en la app. **Un ejercicio de academia nunca llega aquí**: su tipo se publica a través de un generador con números nuestros.

## Relación con el formato vivo (`docs/escena-viva.md`, sección 4)

| Contrato | Aquí |
| --- | --- |
| `escena.pieza`, `escena.datos`, `escena.alt` | Igual. La pieza sale del catálogo de `nucleo/kit/piezas/`; mientras ese catálogo no exista, el validador acepta las seis piezas previstas del contrato con un aviso |
| `respuesta` (`tipo`, `control`, `tolerancia`, `unidad`) | En el mismo objeto `respuesta`, junto a `valor`, como hoy en los generadores |
| `pasos[i]` = `{ estado, texto, ecuacion }` | Igual. `texto` ≤ 14 palabras; la ecuación no cuenta |
| `fantasmas` | Igual. Sus claves deben ser ids de error de `alternativas` |
| `alternativas[].error` = `{ id, explicacion, respaldo, fuente }` | Igual que en `nucleo/predicciones.js`. `explicacion` ≤ 20 palabras |

## Presupuesto de texto (contrato, regla 3.1)

Una palabra es un trozo separado por espacios que tiene al menos una letra. Los números, los signos y los datos con color (`{clave}` o `{ v, t }`) no cuentan. Los límites:
- enunciado y pregunta juntos, 40 palabras como máximo, salvo las preguntas oficiales, que van tal cual;
- cada paso, 14;
- cada explicación de error, 20.

El presupuesto no se aplica a los de academia, que no se publican. Antes de `verificado` es un aviso; desde `verificado`, un error.

## Comandos

```sh
node herramientas/validar-ejercicios.js --validar contenido/ejercicios/ejemplos   # errores y avisos; sale con 1 si hay errores
node herramientas/validar-ejercicios.js --contar fuentes/ejercicios/lote-01       # tabla de conteo (--json para JSON)
node herramientas/validar-ejercicios.js --auditar                                 # presupuesto de los generadores de hoy
```
