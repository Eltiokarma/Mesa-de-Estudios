# Catálogo de contenidos

Aquí se declara **qué** enseña la app: cursos, unidades y temas, en qué universidad entra cada uno y qué plantillas lo cubren. Las plantillas (`plantillas/<id>/`) son el **cómo**. Agregar un curso o una unidad es agregar o editar un JSON de esta carpeta; no hace falta tocar código. `npm test` valida que todo esté bien enlazado (`catalogo/catalogo.test.js`).

## Archivos

- `universidades.json`: las universidades y dónde está su temario.
- `cursos/<id-curso>.json`: un archivo por curso, con sus unidades.
- `plantillas/<id>/plantilla.json` (fuera de esta carpeta): la ficha de cada plantilla.

## Formato de un curso (`cursos/<id>.json`)

```json
{
  "id": "fisica",
  "nombre": "Física",
  "area": "ciencias",
  "formato_principal": "escena",
  "unidades": [
    {
      "id": "fisica.optica-geometrica",
      "nombre": "Óptica geométrica",
      "temas": ["Reflexión y refracción", "Espejos esféricos", "Lentes delgadas"],
      "universidades": {
        "uni":   { "semanas": [19] },
        "unmsm": { "temas": [17] }
      },
      "potencial_visual": "alto",
      "grado": 5,
      "plantillas": ["optica-lente-delgada"],
      "investigacion": "docs/investigacion/optica-ideas-erroneas.md"
    }
  ]
}
```

| Campo | Qué es |
| --- | --- |
| `id` (curso) | En minúsculas, sin tildes ni espacios, con guiones. Igual al nombre del archivo. |
| `area` | `ciencias`, `matematica`, `razonamiento` o `letras`. |
| `formato_principal` | Cómo se enseña sobre todo ese curso: `escena` (simulación con predicción), `predicciones` (preguntas rápidas con errores típicos y explicación, sin escena), `lectura` (textos con preguntas). |
| `unidades[].id` | `<curso>.<unidad>`, único en todo el catálogo. No se cambia nunca una vez publicado: el progreso de los alumnos se guarda con este id. |
| `temas` | Lista corta de subtemas, en palabras propias. |
| `universidades` | Dónde entra la unidad. `uni.semanas`: semanas del sílabo CEPRE-UNI 2026-2. `unmsm.temas`: números de tema del temario CEPRE-UNMSM 2026-I. Si una universidad no la pide, se omite. Se agregan `una`, `unsa`, `unsaac` cuando haya temario. |
| `potencial_visual` | `alto`, `medio` o `bajo`. |
| `grado` | Desde qué grado de secundaria (3, 4 o 5) se puede estudiar la unidad. A un alumno de un grado menor se le muestra como "adelanto" y va al final de su cola; no se le oculta. Es una estimación: ver "Grados" más abajo. |
| `plantillas` | Ids de plantillas que existen en `plantillas/`. Vacío si todavía no hay. |
| `investigacion` | Ruta al informe de errores típicos, o `null`. |

## Formato de la ficha de una plantilla (`plantillas/<id>/plantilla.json`)

```json
{
  "id": "optica-lente-delgada",
  "titulo": "Banco Óptico",
  "formato": "escena",
  "unidades": ["fisica.optica-geometrica"],
  "estado": "borrador",
  "version": "0.1.0",
  "escena": "index.html",
  "motor": "motor.js",
  "casos": "casos.json",
  "pruebas": "motor.test.js",
  "papel": null
}
```

`formato`: `escena` (necesita `escena`, `motor`, `casos` y `pruebas`) o `predicciones` (necesita `generador`, `casos` y `pruebas`; ver `nucleo/predicciones.js`). `estado`: `borrador` (en construcción), `probada` (pasó sus casos de prueba y el pase 2), `publicada` (está en la app). `papel` apunta al archivo de problemas para resolver sin la escena (regla 6), o `null` si falta. El formato está en `plantillas/optica-lente-delgada/papel.json`: `indicacion` y una lista `problemas` con `id`, `nivel`, `enunciado`, `respuesta`, `pasos` y `verificar`, que son los datos con los que la prueba de la plantilla recalcula la respuesta con el motor. La app los muestra en `#/papel/<id>`, con la respuesta escondida y un botón para imprimir.

## Decisiones de agrupación pendientes (4 nov 2026)

El catálogo inicial de 8 cursos y 151 unidades se armó con los sílabos del CEPRE-UNI 2026-2 y el temario del CEPRE-UNMSM 2026-I. Todos los temas quedaron ubicados; la única excepción es la semana 4 de química de la UNI, que es Semana Santa y no tiene clases. Quedan estas decisiones abiertas:

1. **Mismo contenido en cursos distintos según la universidad.**
   - Geometría analítica: en la UNI está en trigonometría; en San Marcos, en geometría.
   - Lógica y conjuntos: en la UNI está en álgebra; en San Marcos, en aritmética.
   - Sucesiones: aparecen en aritmética y en álgebra.

   Hoy hay unidades separadas en cada curso. Se podría unificar en una sola unidad y permitir que `universidades` apunte al sílabo de otro curso.
2. **Razonamiento matemático en la UNI.** El CEPRE-UNI no tiene sílabo propio de razonamiento matemático. Sus temas están dentro de aritmética (semana 20), geometría (semanas 6, 10, 12 y 20) y álgebra (semana 18), y por ahora quedaron ahí.
3. **Unidades de física que convendría separar cuando haya plantilla:**
   - Bernoulli, que pide solo San Marcos, va hoy dentro de `fisica.fluidos`.
   - Condensadores, dentro de `fisica.electrostatica`.
   - Relatividad, dentro de `fisica.fisica-moderna`.
4. **Cinética química** no tiene informe de errores típicos (`investigacion: null`).
5. **Correspondencia de semanas a revisar:** las sesiones de trigonometría de la UNI en las semanas 0 a 4 se asignaron por fecha impresa. Conviene revisarlas con el PDF.

## Grados (5 nov 2026)

El lanzamiento es con 3.º, 4.º y 5.º de secundaria, y no todos han visto lo mismo. Cada unidad dice desde qué grado se puede estudiar (`grado`). Hoy hay 72 unidades de 3.º, 40 de 4.º y 39 de 5.º.

**Es una estimación y hay que confirmarla con los profesores del colegio.** El Currículo Nacional (CNEB) organiza Ciencia y Tecnología y Matemática por competencias, no por una lista fija de temas por grado, así que cada colegio reparte los temas a su manera. La estimación sigue el orden más común en los colegios y en los ciclos preuniversitarios:

- **Física.** 3.º: magnitudes, vectores y movimiento rectilíneo. 4.º: tiro parabólico y movimiento circular, estática, dinámica, energía, choques, gravitación, fluidos y calor. 5.º: oscilaciones, ondas, termodinámica, electricidad, magnetismo, óptica y física moderna.
- **Química.** 3.º: materia, átomo, tabla periódica, enlace y nomenclatura. 4.º: mol, reacciones, estequiometría, gases, soluciones y orgánica. 5.º: cinética, equilibrio, ácidos y bases, electroquímica y biomoléculas.
- **Matemática.** 3.º: aritmética básica (numeración, divisibilidad, fracciones, razones, porcentajes), expresiones algebraicas y factorización, geometría plana básica y razones trigonométricas. 4.º: inecuaciones, funciones, sistemas, áreas y semejanza, circunferencia trigonométrica e identidades. 5.º: logaritmos, complejos, matrices, sucesiones, combinatoria y probabilidades, geometría del espacio y analítica, y la trigonometría de arcos compuestos en adelante.
- **Razonamiento matemático y verbal:** desde 3.º, porque son habilidades y no temas de un grado.

Cuando el colegio pase su programación anual, se corrige este campo; no hace falta tocar código.
