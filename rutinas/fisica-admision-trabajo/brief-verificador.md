# Brief: verificador a ciegas y revisor de generadores de física

Repo /home/user/Mesa-de-Estudios (solo lectura para ti: NO modifiques el repo, NO hagas commit). Carpeta de trabajo: /tmp/claude-0/-home-user-Mesa-de-Estudios/c8b39758-4441-53d9-bb6a-2d61d043ce18/scratchpad/verif/

Te doy uno o más ids de generadores (`plantillas/<id>/`). Para cada id hay dos archivos en la carpeta de trabajo: `<id>-ciego.json` (enunciado, pregunta y alternativas, sin decir cuál es la correcta) y `<id>-con-claves.json` (lo mismo con la correcta, los errores y la solución).

## Fase 1: a ciegas
SIN leer `generador.js`, `casos.json`, `generador.test.js` ni `<id>-con-claves.json`, resuelve cada problema de `<id>-ciego.json` como lo haría un profesor de física: con tu propio planteamiento (python3 -I con fractions donde se pueda; tolerancia 1e-6). Escribe tu respuesta y la letra que eliges en `<id>-verif.json` y el script en `<id>-verif.py`. Si un enunciado es ambiguo o le faltan datos, anótalo con la interpretación que tomaste. Si ninguna alternativa coincide con tu cálculo, anótalo.

## Fase 2: comparar y revisar
Solo después abre `<id>-con-claves.json` y `plantillas/<id>/casos.json`. Reporta:
1. Discrepancias de letra o valor (semilla, tu valor, el del generador, quién tiene razón y por qué).
2. Revisión de contenido, por gravedad (grave / media / leve): física errada, enunciado ambiguo o con datos de menos, una incorrecta defendible como correcta, una explicación de error que no corresponde a lo que da ese número, distractores poco creíbles o repetidos, respaldo mal puesto (un `documentado` o `parcial` cuya fuente no lo sostiene: abre la fuente citada y búscalo), la pregunta que revela la respuesta, unidades mezcladas en las alternativas, números con más de dos decimales, español poco claro para un postulante de 16 años, algo que parezca copiado de un libro de academia (la regla 5 prohíbe copiar).
3. Cobertura: lee la cabecera de `plantillas/<id>/generador.js` (solo el comentario inicial) y la lista de huecos que te doy; di qué tipos de problema del lote quedan sin cubrir.

## Respuesta (corta)
Por id: coincidencias / total, discrepancias, hallazgos por gravedad con la semilla, y UN texto de 2 a 4 líneas para el campo `"verificacion"` de casos.json (quién, cómo, resultado).
