# Encargos para ChatGPT (24 nov 2026)

Son dos conversaciones independientes que siguen la investigación larga donde quedó: la A con la Etapa 10 y la B con
la Etapa 11. Cada una tiene seis unidades pendientes, de Física a Trigonometría. La Etapa 12 (también con seis
pendientes) se encarga con el mismo texto cuando termine una de las dos: basta cambiar la etapa, la carpeta y la lista.

Los encargos traen las lecciones de la auditoría del 24 nov a las seis unidades largas que ya llegaron (sección 11 de
cada archivo en `etapa10/` a `etapa12/`). Las cuentas estaban bien en las seis. Los fallos repetidos fueron estos:

- tarjetas Lee que adelantaban la respuesta de la predicción o descartaban un distractor (en 4 de 6);
- distractores con un código de error que describe otra conducta (en 5 de 6);
- errores marcados «documentado» con una fuente que no se leyó o que no registra esa conducta;
- una pregunta oficial inventada (UNI 2021-1, pregunta 6) y números de página o de semana mal citados;
- el nombre de una unidad cambiado en `estado.md` (Etapa 12, «Cortes, pesadas y balanzas»).

Cada encargo se pega entero en una conversación nueva.

---

## Conversación A · Etapa 10

```text
Sigues la investigación a fondo de la Etapa 10 del proyecto Mesa de Estudios (repo Eltiokarma/Mesa-de-Estudios), una app peruana de bajo costo para postulantes de 5.º de secundaria y preuniversitario a la UNI, San Marcos, UNA Puno, UNSA y UNSAAC. Ya están hechas y auditadas las unidades 1 y 2 (Álgebra y Aritmética). Te faltan seis, en este orden y de una en una: termina y publica cada unidad antes de empezar la siguiente.

| Orden | Unidad (nombre exacto del catálogo) | Archivo |
| 3 | Física · Gravitación universal | fisica.gravitacion.md |
| 4 | Geometría · Relaciones métricas | geometria.relaciones-metricas.md |
| 5 | Química · Estequiometría | quimica.estequiometria.md |
| 6 | Razonamiento matemático · Planteo de ecuaciones | razonamiento-matematico.planteo-de-ecuaciones.md |
| 7 | Razonamiento verbal · Plan de redacción | razonamiento-verbal.plan-de-redaccion.md |
| 8 | Trigonometría · Circunferencia trigonométrica | trigonometria.circunferencia-trigonometrica.md |

DESTINO: raíz de docs/investigacion/etapa10/. Al terminar cada unidad, actualiza docs/investigacion/etapa10/estado.md (fila de la unidad, contador «Completadas: N de 8» y «Siguiente pendiente»). No toques breve/, LEEME.md, los archivos ya entregados ni otras carpetas. Commit por unidad con el formato «docs(etapa10): investigar a fondo <unidad>». Usa los nombres de unidad de la tabla tal cual; no los cambies.

MODELO: abre docs/investigacion/etapa10/algebra.ecuaciones-lineales-y-cuadraticas.md y copia su forma: diez secciones numeradas (1 Resumen en 5 líneas; 2 Qué se pregunta en los exámenes; 3 Errores típicos, con tabla Código / Qué hace el alumno / Por qué / Etiqueta / Fuente; 4 Lo que la unidad da por sabido; 5 Las ideas, en orden; 6 Tabla de letras y símbolos; 7 Otras formas de explicarla; 8 Datos del mundo; 9 Dudas y decisiones; 10 Fuentes). De tres a seis ideas; cada una con Lee (tres tarjetas), Juega (una misión), Predice (cuatro opciones: una correcta y tres distractores con su código de error), Mira, La regla, Así se resuelve, Palabras nuevas y Ahora tú. Entre 30 y 60 KB. Investiga desde cero en la web; la versión breve (breve/) solo sirve para contrastar al final.

REGLAS DEL PROYECTO, que no se rompen:
1. Jugar, después predecir, después ver. La predicción pregunta por algo que el alumno no vio en el juego.
2. Las tarjetas Lee no preguntan nada ni adelantan la respuesta de la predicción. Tampoco dicen nada que descarte de antemano un distractor. Antes de cerrar cada idea, lee sus tres tarjetas al lado de las cuatro opciones y comprueba que ninguna tarjeta resuelve la predicción.
3. Contenido propio. Los manuales de academia, solucionarios de academia y copias en Scribd, Course Hero o pdfpresanmarcos sirven para saber qué se pregunta; no se copia nada de ellos (problemas, soluciones, textos ni figuras). Las preguntas de exámenes oficiales de admisión de universidades públicas sí pueden citarse, con universidad, periodo y número de pregunta.
4. Un color y una letra por variable: cada letra tiene un solo significado en toda la unidad, el mismo que da la tabla de la sección 6.
5. Las escenas, misiones y ejemplos son originales.

CONTROLES DE CALIDAD (son los fallos que encontró la auditoría en las unidades anteriores; revísalos uno por uno antes de publicar cada unidad):
a. Cada distractor lleva el código de la conducta que produce exactamente ese valor. Si ningún código de la sección 3 la describe, crea uno nuevo y márcalo HIPÓTESIS. No fuerces un código vecino.
b. «DOCUMENTADO» solo si leíste el resultado en el trabajo original y puedes dar la página, tabla o ítem. Si solo viste el resumen, pon «DE SEGUNDA MANO». Si es una propuesta tuya, pon «HIPÓTESIS».
c. Nunca describas una pregunta oficial que no hayas abierto. Cada pregunta citada lleva universidad, periodo, número de pregunta y página del PDF oficial, y su contenido tiene que coincidir. Si no la pudiste abrir, no la cites.
d. Verifica el número de página, de semana del sílabo o de artículo del reglamento en el documento mismo, no en un índice ni en tu memoria.
e. Rehaz cada cuenta de los ejemplos y de las predicciones con un cálculo independiente; la correcta tiene que serlo y cada distractor tiene que dar un valor distinto, que salga del error que dice codificar.
f. La sección 4 nombra todo lo que las ideas usan sin enseñar (por ejemplo, raíces o proporciones).
g. Las magnitudes físicas y químicas llevan unidades SI y valores reales; los datos del mundo (sección 8) traen fuente abierta o quedan marcados como supuesto didáctico.
h. No inventes frecuencias de examen. Si no hay una muestra contada, dilo.
i. Si un enlace no abre, no lo presentes como comprobado: anótalo en la sección 10.

Al final de cada unidad agrega, dentro de la sección 9, un párrafo «Autorrevisión» con lo que comprobaste de los controles a–i y lo que quedó sin verificar.
```

---

## Conversación B · Etapa 11

```text
Sigues la investigación a fondo de la Etapa 11 del proyecto Mesa de Estudios (repo Eltiokarma/Mesa-de-Estudios), una app peruana de bajo costo para postulantes de 5.º de secundaria y preuniversitario a la UNI, San Marcos, UNA Puno, UNSA y UNSAAC. Ya están hechas y auditadas las unidades 1 y 2 (Álgebra y Aritmética). Te faltan seis, en este orden y de una en una: termina y publica cada unidad antes de empezar la siguiente.

| Orden | Unidad (nombre exacto del catálogo) | Archivo |
| 3 | Física · Movimiento armónico simple | fisica.oscilaciones.md |
| 4 | Geometría · Polígonos regulares | geometria.poligonos-regulares.md |
| 5 | Química · Estado gaseoso | quimica.gases.md |
| 6 | Razonamiento matemático · Máximos y mínimos | razonamiento-matematico.maximos-y-minimos.md |
| 7 | Razonamiento verbal · Eliminación de oraciones | razonamiento-verbal.eliminacion-de-oraciones.md |
| 8 | Trigonometría · Funciones trigonométricas | trigonometria.funciones-trigonometricas.md |

DESTINO: raíz de docs/investigacion/etapa11/. Al terminar cada unidad, actualiza docs/investigacion/etapa11/estado.md (fila de la unidad, contador «Completadas: N de 8» y la siguiente unidad). No toques breve/, LEEME.md, los archivos ya entregados ni otras carpetas. Commit por unidad con el formato «docs(etapa11): investigar a fondo <unidad>». Usa los nombres de unidad de la tabla tal cual; no los cambies.

MODELO: abre docs/investigacion/etapa11/algebra.inecuaciones.md y copia su forma: diez secciones numeradas (1 Resumen en 5 líneas; 2 Qué se pregunta en los exámenes; 3 Errores típicos, con tabla Código / Qué hace el alumno / Por qué / Etiqueta / Fuente; 4 Lo que la unidad da por sabido; 5 Las ideas, en orden; 6 Tabla de letras y símbolos; 7 Otras formas de explicarla; 8 Datos del mundo; 9 Dudas y decisiones; 10 Fuentes). De tres a seis ideas; cada una con Lee (tres tarjetas), Juega (una misión), Predice (cuatro opciones: una correcta y tres distractores con su código de error), Mira, La regla, Así se resuelve, Palabras nuevas y Ahora tú. Entre 30 y 60 KB. Investiga desde cero en la web; la versión breve (breve/) solo sirve para contrastar al final.

REGLAS DEL PROYECTO, que no se rompen:
1. Jugar, después predecir, después ver. La predicción pregunta por algo que el alumno no vio en el juego.
2. Las tarjetas Lee no preguntan nada ni adelantan la respuesta de la predicción. Tampoco dicen nada que descarte de antemano un distractor. Antes de cerrar cada idea, lee sus tres tarjetas al lado de las cuatro opciones y comprueba que ninguna tarjeta resuelve la predicción.
3. Contenido propio. Los manuales de academia, solucionarios de academia y copias en Scribd, Course Hero o pdfpresanmarcos sirven para saber qué se pregunta; no se copia nada de ellos (problemas, soluciones, textos ni figuras). Las preguntas de exámenes oficiales de admisión de universidades públicas sí pueden citarse, con universidad, periodo y número de pregunta. En Razonamiento verbal, los textos de lectura de los exámenes (fragmentos de autores) no se copian: las oraciones de los ejercicios se escriben de nuevo.
4. Un color y una letra por variable: cada letra tiene un solo significado en toda la unidad, el mismo que da la tabla de la sección 6.
5. Las escenas, misiones y ejemplos son originales.

CONTROLES DE CALIDAD (son los fallos que encontró la auditoría en las unidades anteriores; revísalos uno por uno antes de publicar cada unidad):
a. Cada distractor lleva el código de la conducta que produce exactamente ese valor. Si ningún código de la sección 3 la describe, crea uno nuevo y márcalo HIPÓTESIS. No fuerces un código vecino.
b. «DOCUMENTADO» solo si leíste el resultado en el trabajo original y puedes dar la página, tabla o ítem. Si solo viste el resumen, pon «DE SEGUNDA MANO». Si es una propuesta tuya, pon «HIPÓTESIS».
c. Nunca describas una pregunta oficial que no hayas abierto. Cada pregunta citada lleva universidad, periodo, número de pregunta y página del PDF oficial, y su contenido tiene que coincidir. Si no la pudiste abrir, no la cites.
d. Verifica el número de página, de semana del sílabo o de artículo del reglamento en el documento mismo, no en un índice ni en tu memoria.
e. Rehaz cada cuenta de los ejemplos y de las predicciones con un cálculo independiente; la correcta tiene que serlo y cada distractor tiene que dar un valor distinto, que salga del error que dice codificar. En Estado gaseoso, fija la constante R y sus unidades y no mezcles °C con K.
f. La sección 4 nombra todo lo que las ideas usan sin enseñar.
g. Las magnitudes físicas y químicas llevan unidades SI y valores reales; los datos del mundo (sección 8) traen fuente abierta o quedan marcados como supuesto didáctico.
h. No inventes frecuencias de examen. Si no hay una muestra contada, dilo.
i. Si un enlace no abre, no lo presentes como comprobado: anótalo en la sección 10.

Al final de cada unidad agrega, dentro de la sección 9, un párrafo «Autorrevisión» con lo que comprobaste de los controles a–i y lo que quedó sin verificar.
```
