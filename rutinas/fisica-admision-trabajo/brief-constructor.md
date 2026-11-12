# Brief común: constructor de generadores de física (rutina física-admisión, 8 nov 2026)

Repo: /home/user/Mesa-de-Estudios, rama `rutina/fisica-admision` (ya hecha el checkout; NO cambies de rama, NO hagas commit ni push: la conversación principal integra). Hay otros constructores trabajando en paralelo en otras carpetas de `plantillas/`: toca SOLO las carpetas de tu encargo. No toques `catalogo/`, `app/`, `docs/` (salvo que tu encargo lo diga), ni `nucleo/` (si crees que hace falta un cambio en un núcleo, dilo en tu respuesta en vez de hacerlo).

## Lee primero
- `CLAUDE.md` (reglas que no se rompen; en especial 1, 2, 3, 4, 5 y 6).
- `nucleo/predicciones.js`, `nucleo/azar.js`, `nucleo/probar-generador.js`.
- El modelo a imitar: `plantillas/circular-horaria/` (generador.js, generador.test.js, casos.json, plantilla.json). Mira también un generador con armarTexto si te hace falta una respuesta que no es número (`plantillas/vectores-combinacion/`).
- `docs/clasificacion/trampas-admision-unmsm/fisica.md` (trampas que se repiten en la admisión de San Marcos) y `docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md` (códigos U1–U8 de unidades y PR1–PR7 de proporcionalidad: úsalos tal cual o con sufijo, `U1-kmh`, `PR2-raiz`).
- El informe de ideas erróneas de tu tema en `docs/investigacion/` (te lo digo en el encargo) para los códigos con respaldo `parcial` o `documentado`. En la duda, baja a `hipotesis`. Los errores sin código van como hipótesis con un código nuevo con prefijo de tema.
- La lista de huecos de tu lote (archivo en el encargo): filas del CSV de admisión de San Marcos que la app cubre solo a medias. Las columnas FALTA y RESUMEN dicen QUÉ TIPO de problema hay que poder generar.

## Regla 5, sin excepción
El CSV y los PDF son solo un mapa de qué se pregunta. No copies enunciados, números, figuras ni soluciones de academia. No abras los PDF de `fuentes/`. Los problemas, contextos y números son propios (contextos peruanos cotidianos están bien: combis, Juliaca, el lago, la chacra, el mercado), con números variados por la semilla.

## Qué entregas por cada generador `plantillas/<id>/`
1. `generador.js` con la misma envoltura que circular-horaria (navegador `window.Generadores[id]` y Node), cabecera que describe los tipos, convenciones y de dónde salen los errores. Varios tipos y subtipos que cubran TODAS las filas de tu lote que te asigno a ese id. Números "de examen": respuestas limpias (enteros o pocos decimales), coma decimal (P.formatear), g = 10 m/s² salvo que el tipo pida otra cosa, datos completos en el enunciado.
   - Regla 4: cada variable con su color con `P.v(clave, texto)` y el objeto `variables` (nombre y color: usa las letras de color que ya usan los otros generadores, mira circular-horaria y los demás `plantillas/*/generador.js`), el mismo en enunciado, pregunta y solución.
   - Regla 3: 4 o 5 alternativas; cada incorrecta sale de un error con id, explicación que dice qué se hizo mal y cómo es lo correcto (en español claro y neutro, tú), y respaldo + fuente (ruta existente). Los distractores salen de las trampas reales (columna TRAMPA y el archivo de trampas). Nada de distractores al azar.
   - La pregunta NO revela la respuesta, y la solución da los pasos con colores.
   - `_datos` con todo lo necesario para recalcular por otro camino (tipo, sub y los datos numéricos).
2. `generador.test.js`: `probarGenerador(gen, { semillas: 600, recalcular })` con un recálculo independiente por OTRO camino (no copiar la fórmula del generador: simulación numérica, otra ley, conservación, bisección, etc.); prueba de casos.json como en circular-horaria; prueba de que salen todos los tipos/subtipos; unidades iguales en las alternativas; sin «de el» ni «a el»; y la prueba de papel.json (abajo).
3. `casos.json`: entre 10 y 16 casos que recorran todos los tipos: `{ plantilla, tolerancia, nota, verificacion: "PENDIENTE", casos: [{ semilla, entrada (= _datos), esperado: { respuesta, exacta } }] }`. Calcula los esperados tú a mano/con python aparte, no copiando la salida del generador sin mirarla.
4. `papel.json` (regla 6): `{ titulo, indicacion, problemas: [ { id, nivel, enunciado, respuesta, pasos: [...], verificar: [ { tipo, args, espera } ] } ] }` con 5 a 10 problemas propios para lápiz y papel, texto plano sin HTML. En `generador.test.js` agrega una prueba que valide la estructura (5 a 10 problemas, ids únicos, enunciado, respuesta, pasos, verificar, sin HTML) y que recalcula cada `verificar` con una función propia del test (tipo → cálculo) y compara con `espera`.
5. `plantilla.json`: `{ id, titulo, formato: "predicciones", unidades: [...ids de catalogo/cursos/fisica.json...], estado: "borrador", version: "0.1.0", generador: "generador.js", casos: "casos.json", pruebas: "generador.test.js", papel: "papel.json" }`. Títulos cortos y cotidianos («La combi y el río», «El foco que calienta»).

## Antes de responder
- `node --test plantillas/<id>/` en verde para cada id, y luego `npm test` completo en verde (si falla algo fuera de tus carpetas, dilo sin arreglarlo).
- Imprime 3 problemas de ejemplo por tipo en texto plano y léelos como un postulante: ¿se entiende?, ¿los datos alcanzan?, ¿alguna incorrecta es defendible como correcta? Corrige.

## Tu respuesta (corta)
Por cada id: tipos y subtipos, qué filas del lote cubre (los ids del CSV), códigos de error nuevos (con su respaldo), cuántas pruebas, y qué filas del lote NO quedan cubiertas y por qué. Además la línea de colores usados.
