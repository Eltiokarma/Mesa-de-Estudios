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
| `plantillas` | Ids de plantillas que existen en `plantillas/`. Vacío si todavía no hay. |
| `investigacion` | Ruta al informe de errores típicos, o `null`. |

## Formato de la ficha de una plantilla (`plantillas/<id>/plantilla.json`)

```json
{
  "id": "optica-lente-delgada",
  "titulo": "Banco Óptico",
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

`estado`: `borrador` (en construcción), `probada` (pasó sus casos de prueba y el pase 2), `publicada` (está en la app). `papel` apunta al archivo de problemas para resolver sin la escena (regla 6), o `null` si falta.
