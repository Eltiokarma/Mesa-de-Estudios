# Alternativas para los problemas de lápiz y papel (paso 4 del repaso)

Decisión de Gerson (14 nov 2026): los problemas de `plantillas/<id>/papel.json` reciben alternativas, **una pregunta por magnitud**. Mientras un problema no las tenga, la cola de repaso lo usa como autoevaluación («Me salió», «No me salió» o «No sé»). Con ellas, se mide el acierto. El molde es `plantillas/gases/papel.json`.

## El formato

Cada problema puede traer `"preguntas"`, una por cada magnitud que pide:

```json
"preguntas": [
  {
    "id": "p1a",
    "enunciado": "Un tanque de 41 L contiene 320 g de oxígeno (O₂) a 27 °C.",
    "pregunta": "¿Qué presión tiene el gas dentro del tanque?",
    "unidad": "atm",
    "decimales": 2,
    "correcta": { "fn": "estado", "args": [{ "V": 41, "n": 10, "T": 300 }], "campo": "P", "valor": 6 },
    "errores": [
      { "id": "GQ13-masa-atomica", "respaldo": "parcial",
        "explicacion": "Usaste 16 g/mol, la masa de un átomo. El O₂ tiene dos: 32 g/mol, y salen 10 mol, no 20.",
        "fn": "estado", "args": [{ "V": 41, "n": 20, "T": 300 }], "campo": "P", "valor": 12 }
    ]
  }
]
```

- **`id`** es único en el archivo: la letra del problema más a, b, c (`p6a`, `p6b`).
- **`enunciado`** es el texto del problema **sin las preguntas**, porque la pregunta va aparte. Si el problema pide varias cosas, cada pregunta repite solo los datos que necesita, y puede dar como dato lo que otra pregunta calculó (gases `p6b` da «La presión total es de 9 atm»).
- **`pregunta`** pide una sola magnitud.
- **`unidad` y `decimales`** dicen cómo se escribe el número. Se escribe con coma decimal, con `Predicciones.formatear`.
- **`correcta` y cada error** son una llamada al motor de la plantilla: `fn`, `args` y `campo`. El campo puede ser `"P"`, `"gases.He.P"` o `"valor"` (el resultado mismo). **Regla 1:** el número lo da el motor, nunca un modelo. `valor` es ese resultado ya calculado, con 12 cifras significativas, para que el repaso no cargue el motor.
- **Un error** es la misma llamada con el argumento que cambia la equivocación típica, la que ya cuentan los pasos del problema. Por ejemplo: 16 g/mol en lugar de 32, °C en lugar de K, la presión manométrica en lugar de la absoluta, el coeficiente olvidado.
- **Si el motor no calcula una equivocación,** no se inventa el número: o se agrega al motor una función pequeña, con su caso en `casos.json` verificado aparte, o ese error no entra.
- **Un valor puede ser texto,** si el motor devuelve texto («tautología»).

## Las reglas que revisa la prueba

`herramientas/papel-opciones.test.js` recorre todos los `papel.json` que traen preguntas y falla si:

- un `valor` no es el que da el motor con sus `args`;
- hay menos de **dos errores** que se vean distintos de la correcta y entre sí, ya escritos con su unidad;
- un error está fuera de escala (de 1/20 a 20 veces la correcta; las trampas de unidades U1–U8, QU, AU y RU pueden llegar a 1000, como en los generadores);
- falta el código, el respaldo (`documentado`, `parcial` o `hipotesis`) o la explicación, o la explicación pasa de 30 palabras.

Además, el `motor.test.js` de la plantilla sigue comprobando `verificar`.

## Cómo se escribe cada error

- **El código** sale del informe de ideas erróneas del tema (`docs/investigacion/`), con un sufijo que diga el caso: `GQ13-masa-atomica`, `QU3-celsius`. Si no hay código, se usa el prefijo del tema con un nombre (`GQ-boyle-al-reves`) y respaldo `hipotesis`. Los códigos de unidades están en `docs/investigacion/unidades-ideas-erroneas.md`.
- **El respaldo** es el que tiene ese código en su informe. Si la equivocación solo se parece a una documentada, es `parcial`. Si no hay estudio, es `hipotesis`.
- **La explicación** dice qué hizo el alumno y por qué no va, en tono amable y sin investigación a la vista (`herramientas/tono.test.js`). No dice «Elegiste» ni nombra autores o estudios. Ejemplo: «Usaste 27 °C. En PV = nRT la temperatura va en kelvin: 27 + 273 = 300 K.»

## Cómo se agrega sin reformatear el archivo

Los `papel.json` están formateados a mano. `herramientas/json-papel.js` inserta solo el bloque `"preguntas"` dentro de cada problema y deja el resto del archivo igual, byte por byte:

```js
const J = require('./herramientas/json-papel.js');
const texto = fs.readFileSync(ruta, 'utf8');
fs.writeFileSync(ruta, J.insertarPreguntas(texto, { p1: [...], p5: [...] }));
```

Lo práctico es un guion propio que arme las preguntas con `fn`, `args` y `campo`, calcule cada `valor` con `PapelOpciones.calcular(motor, x)` redondeado con `+v.toPrecision(12)` y llame a `insertarPreguntas`. Es lo que se hizo con gases. El guion no se sube.

## Cómo se trabaja una escena

1. Lee `motor.js` y `papel.json`, y el informe de ideas erróneas del tema.
2. Por cada problema: una pregunta por magnitud, y de dos a cuatro errores sacados de sus pasos.
3. Calcula con el motor, inserta, corre `node --test herramientas/papel-opciones.test.js plantillas/<id>/motor.test.js` y después `npm test`.
4. Un commit por escena. Si cambia la cáscara de la app, sube `VERSION` en `app/sw.js`; agregar preguntas a un `papel.json` no la cambia.

Una pregunta queda fuera si no hay dos errores que el motor pueda calcular con honestidad. Mejor menos preguntas que un distractor inventado.
