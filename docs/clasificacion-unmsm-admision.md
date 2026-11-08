# Qué pregunta San Marcos en su examen de admisión (2019-I a 2027-I) y cuánto cubre hoy la app

8 de noviembre de 2026 · rutina `examenes-unmsm` · continúa la medición de simulacros de `docs/clasificacion-unmsm.md`

**Datos.** Se usaron 50 exámenes de admisión de San Marcos de 14 periodos, de 2019-I a 2027-I. Son los PDF de Saco Oliveros registrados en `fuentes/drive.tsv`, que no se versionan.
- 47 salen de solucionarios con texto, que traen el examen entero, la resolución y un titular de tema.
- 3 son exámenes de 2021 escaneados sin solucionario, pasados por OCR.

Se clasificó pregunta por pregunta en los ocho cursos de la app. El trabajo lo hicieron ocho subagentes, uno o dos cursos por subagente, y un revisor contrastó una muestra con el PDF.

**Archivos.**
- `docs/datos/admision-unmsm.csv`: una fila por pregunta, con ids, unidad, tema, tipo, módulo, cobertura y lo que falta.
- `docs/datos/admision-unmsm-tablas.md`: todas las tablas.
- `docs/clasificacion/trampas-admision-unmsm/`: las trampas por curso.

Ninguno de estos archivos trae enunciados, datos numéricos ni soluciones (regla 5 de `CLAUDE.md`).

## Resumen en diez líneas

1. Hay **2550 preguntas** de los ocho cursos. En admisión **cada día de examen es un examen distinto**: no se encontró ninguna pregunta repetida entre días ni entre periodos. En los simulacros, en cambio, las áreas compartían banco.
2. **Razonamiento verbal y razonamiento matemático son el 53 %** de lo que la app enseña y se pregunta (1340 de 2550). Desde 2025-I son 10 y 10 preguntas por examen. Las ciencias y las matemáticas traen de 2 a 7 preguntas por curso.
3. **Cobertura: 57 % «sí», 42 % «a medias» y 1 % «no».** «A medias» significa que la unidad tiene módulo pero ese tipo de problema no se trabaja, o se toca de pasada. Las 19 que quedan en «no» no tienen ni unidad en el catálogo: diagramas de flujo, trasvases y operadores en razonamiento matemático, y una de unidades en química.
4. **El hueco más grande está en verbal: los textos A/B.** Son dos autores que debaten un tema, con 240 preguntas, en los 14 periodos. Es un tercio de todo verbal y la app no tiene ni un par de textos.
5. **Verbal es solo lectura.** Del 2019 en adelante no salió ningún ejercicio suelto: ni analogías, ni series, ni conectores, ni eliminación, ni plan de redacción, ni definiciones. Ocho de las 18 unidades de verbal del catálogo no tienen ninguna pregunta. Cada examen trae siempre un texto mixto (continuo con gráfico o infografía), un par A/B y un texto en inglés.
6. **Razonamiento matemático es visual y espacial, y ahí está flojo.** No cubren del todo:
   - rutas, vistas de sólidos, dados y lectura de palabras en arreglos: 43 de 54;
   - rumbos y trasvases: 30 de 33;
   - rodamientos y giros: 27 de 41;
   - dados y dominó: 23 de 23;
   - certezas: 21 de 30.

   Lo que sí se cubre bien: calendarios, verdades y mentiras, cuadros de doble entrada, ordenamiento, tablas y gráficos, y trazos de un solo golpe.
7. **Física: la app está casi completa.** 61 % «sí» y ninguna unidad sin módulo. Lo que falta son tipos de problema dentro de unidades que ya existen:
   - hidrodinámica (Bernoulli, caudal);
   - ley de Snell y ángulo límite;
   - condensadores en asociación;
   - Kirchhoff con dos fuentes y efecto Joule;
   - potencia como fuerza por velocidad;
   - ecuación horaria del MAS;
   - relatividad.

   **Termodinámica no salió nunca**: el temario de San Marcos no la trae.
8. **Química: el hueco es biomoléculas y productos naturales** (vitaminas, colorantes, hormonas, alcaloides). 25 de 27 preguntas quedan a medias, sube desde 2023 y casi siempre es contar carbonos sp2, grupos funcionales o enlaces pi en una molécula grande. Orgánica en total es el 26 % de la química, igual que en los simulacros.
9. **Geometría y trigonometría son las peor cubiertas de matemática** (46 % y 52 % «sí»). Los huecos:
   - sólidos de revolución y troncos;
   - relaciones métricas (Euclides, Ptolomeo, tangente): 0 de 11 en «sí»;
   - áreas sombreadas circulares;
   - ángulos verticales con dos observaciones;
   - ecuaciones trigonométricas en un intervalo.

   Aritmética (71 %) y álgebra (63 %) están mejor; en álgebra falta Cardano-Vieta y las inecuaciones de planteo con solución entera.
10. Lo que más cambió frente a los simulacros: **cinemática y dinámica sí salen en admisión**. Ocupan el 18 % de la física, y en los simulacros oficiales casi no aparecían. La **lente delgada sigue sin salir ni una vez**.

## Cómo es el examen

| Periodos | Preguntas | Verbal | RM | Aritmética | Álgebra | Geometría | Trigonometría | Física | Química |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2019-I a 2020-I | 125 | 20–25 | 15 | 4 | 4–5 | 3–4 | 3 | 7 | 6–7 |
| 2021 a 2024-II | 100 | 15 | 15 | 3–4 | 2–4 | 3 | 2–3 | 4–7 | 4–7 |
| 2025-I a 2027-I | 100 | 10 (n.º 11–20) | 10 (n.º 21–30) | 4 | 2–4 | 3–4 | 2–3 | 4–7 | 4–7 |

- **Física y química** dependen del área.
  - Ingenierías y Ciencias Básicas (B, C): 7 de cada una.
  - Salud y Medicina (A): 5 de física y 6–7 de química.
  - Económico-Empresariales y Humanidades (D, E): 4 y 4.
- **Desde 2025-I la numeración empieza en 11.** Ni el solucionario ni la hoja de claves de la academia traen las preguntas 1 a 10. No sabemos qué son. Si fueran de verbal o de RM, este conteo los subestima.
- **Archivos de 2024-I en adelante.** Cada día trae un examen para un par de áreas («áreas B-C», «D-E»). Algunos solucionarios agregan al final unas «preguntas adicionales» de la otra área; se clasificaron con id propio, con sufijo `b` cuando reusan el número.

## Qué temas salen y en cuántos periodos

Ordenados por número de preguntas; «periodos» cuenta en cuántos de los 14 aparece la unidad. Las tablas completas, con los temas finos, están en `docs/datos/admision-unmsm-tablas.md`.

### Física (277 preguntas; 86 % de cálculo; 44 % con potencial visual alto)

| Unidad | Preguntas | Periodos | Sí / a medias |
| --- | --- | --- | --- |
| Trabajo, energía y potencia | 24 | 12 | 13 / 11 |
| Corriente y circuitos | 23 | 12 | 8 / 15 |
| MAS | 23 | 12 | 18 / 5 |
| Temperatura y calor | 22 | 13 | 15 / 7 |
| Fluidos | 21 | 10 | 12 / 9 |
| Dinámica | 20 | 13 | 13 / 7 |
| MRU, MRUV y caída libre | 20 | 10 | 11 / 9 |
| Electrostática y condensadores | 16 | 12 | 6 / 10 |
| Física moderna | 16 | 11 | 10 / 6 |
| Ondas mecánicas y sonido | 16 | 8 | 12 / 4 |
| Magnetismo | 14 | 10 | 6 / 8 |
| Vectores y análisis dimensional | 12 | 8 | 11 / 1 |
| Impulso y choques; parabólico y circular | 10 cada una | 8–9 | 6 / 4; 8 / 2 |
| Inducción; óptica geométrica | 8 cada una | 6 | 6 / 2; 4 / 4 |
| Estática; gravitación; ondas EM | 7; 3; 3 | 6; 3; 3 | casi todo «sí» |
| Termodinámica | 0 | 0 | — |

Los temas finos que más se repiten son:
- flotación;
- nivel de intensidad sonora;
- calorimetría con y sin cambio de fase;
- resistencias en serie y en paralelo;
- energía en el MAS;
- condensadores;
- campo de hilos;
- fotoeléctrico;
- análisis dimensional.

En óptica salen espejos (4) y refracción (4), pero **ninguna lente**.

### Química (307 preguntas; 57 % conceptual)

| Unidad | Preguntas | Periodos | Sí / a medias |
| --- | --- | --- | --- |
| Estequiometría (con pureza, rendimiento y limitante) | 34 | 14 | 27 / 7 |
| Funciones orgánicas | 32 | 13 | 21 / 11 |
| Biomoléculas y productos naturales | 27 | 9 | 2 / 25 |
| Reacciones y balance | 24 | 12 | 14 / 10 |
| Electroquímica | 21 | 14 | 18 / 3 |
| Hidrocarburos | 21 | 11 | 14 / 7 |
| Ácidos y bases | 15 | 10 | 14 / 1 |
| Soluciones | 14 | 9 | 5 / 9 |
| Enlace; átomo; mol y composición | 13 cada una | 8–11 | 7 / 6; 8 / 5; 13 / 0 |
| Ambiente; cinética; nomenclatura | 12; 12; 10 | 9 | 9 / 3; 6 / 6; 7 / 3 |
| Gases; líquidos y sólidos; recursos; tabla | 8–9 | 6–7 | gases 9 / 0; el resto mitad y mitad |
| Materia; equilibrio químico | 6; 5 | 4–5 | 3 / 3; 4 / 1 |

Estequiometría y electroquímica salen en **todos** los periodos. Orgánica (funciones, hidrocarburos y biomoléculas) suma 80 preguntas, el 26 %.

### Aritmética (184) y álgebra (160), casi todo cálculo

- **Aritmética:**
  - racionales y fracciones del resto: 18, en 9 periodos;
  - proporcionalidad y regla de tres: 15, en 11;
  - sucesiones: 15, en 12;
  - divisores: 14;
  - probabilidad, con Bayes: 14;
  - divisibilidad y estadística: 12 cada una;
  - combinatoria: 10;
  - interés, numeración y porcentajes: 9 cada una.
- **Álgebra:**
  - funciones: 24, en 13 periodos;
  - sistemas de ecuaciones de planteo: 23, en 12;
  - inecuaciones: 21, en 12;
  - exponenciales y logaritmos: 15;
  - ecuaciones polinomiales: 12;
  - programación lineal y ecuaciones lineales y cuadráticas: 10 cada una;
  - división de polinomios: 9.

### Geometría (169) y trigonometría (113), casi siempre con figura

- **Geometría:**
  - sólidos de revolución: 25, en 12 periodos;
  - congruencia y geometría analítica (parábola y elipse): 20 cada una;
  - prisma y pirámide: 16;
  - áreas y semejanza: 14 cada una;
  - circunferencia: 12;
  - relaciones métricas: 11.
- **Trigonometría:**
  - triángulos rectángulos y ángulos verticales: 13;
  - ángulo doble y triple: 11;
  - ecuaciones: 10;
  - ángulos compuestos: 9;
  - oblicuángulos: 8.

### Razonamiento matemático (650; por familia de temas)

| Familia | Preguntas | Periodos | Sí / a medias / no |
| --- | --- | --- | --- |
| Relojes | 40 | 13 | 30 / 10 / 0 |
| Rutas y caminos mínimos | 36 | 14 | 19 / 17 / 0 |
| Certezas | 31 | 12 | 10 / 21 / 0 |
| Balanzas y pesadas | 31 | 11 | 25 / 6 / 0 |
| Simetrías y giros | 29 | 13 | 19 / 10 / 0 |
| Arreglos numéricos | 28 | 14 | 21 / 7 / 0 |
| Calendarios | 27 | 13 | 25 / 2 / 0 |
| Cubos, sólidos y vistas | 27 | 12 | 1 / 26 / 0 |
| Verdades y mentiras | 26 | 14 | 25 / 1 / 0 |
| Ordenamiento y parentesco | 26 | 13 | 20 / 6 / 0 |
| Rodamientos, ruedas y poleas | 26 | 12 | 6 / 20 / 0 |
| Traslados de fichas y juegos | 24 | 12 | 3 / 20 / 1 |
| Tablas, gráficos y suficiencia | 22 | 9 | 22 / 0 / 0 |
| Situaciones deportivas (tabla de goles) | 21 | 11 | 19 / 2 / 0 |
| Inducción y series | 21 | 12 | 13 / 8 / 0 |
| Cuadro de doble entrada | 20 | 12 | 17 / 3 / 0 |
| Cortes y estacas | 20 | 11 | 9 / 11 / 0 |
| Máximos y mínimos | 19 | 10 | 8 / 8 / 3 |
| Frecuencia de sucesos; trazos de un solo golpe | 18 cada una | 10 | 12 / 6; 17 / 1 |
| Rumbos y desplazamientos | 16 | 10 | 1 / 15 / 0 |
| Dados y dominó | 15 | 8 | 0 / 15 / 0 |
| Lectura de palabras en arreglos; conteo de figuras | 14 cada una | 8 | 0 / 14; 10 / 4 |
| Trasvases | 13 | 10 | 0 / 8 / 5 |
| Diagramas de flujo | 12 | 8 | 0 / 0 / 12 |
| Planteo y otros | 41 | 11 | 17 / 23 / 1 |

### Razonamiento verbal (690)

**Por tipo de texto:**
- textos A/B: 240;
- texto mixto o discontinuo: 225;
- inglés: 210;
- texto continuo: 15, solo hasta 2021.

**Por tipo de pregunta:**
- inferencia: 128;
- sentido contextual: 79;
- extrapolación: 50;
- incompatibilidad y tema central: 47 cada una;
- compatibilidad: 27;
- controversia A/B: 23;
- intención: 15;
- en inglés: inferencia 35, sentido contextual 33, incompatibilidad 28.

**Cobertura:** el texto mixto está bien cubierto (217 de 225). El inglés va a medias en sentido contextual, extrapolación, incompatibilidad, título y dato. Ninguna pregunta de textos A/B está cubierta del todo.

## Cobertura de la app por curso

| Curso | Preguntas | Sí | A medias | No |
| --- | --- | --- | --- | --- |
| Física | 277 | 170 (61 %) | 107 (39 %) | 0 |
| Química | 307 | 196 (64 %) | 110 (36 %) | 1 |
| Aritmética | 184 | 130 (71 %) | 54 (29 %) | 0 |
| Álgebra | 160 | 101 (63 %) | 59 (37 %) | 0 |
| Geometría | 169 | 78 (46 %) | 91 (54 %) | 0 |
| Trigonometría | 113 | 59 (52 %) | 54 (48 %) | 0 |
| Razonamiento matemático | 650 | 350 (54 %) | 282 (43 %) | 18 (3 %) |
| Razonamiento verbal | 690 | 367 (53 %) | 323 (47 %) | 0 |
| **Total** | **2550** | **1451 (57 %)** | **1080 (42 %)** | **19 (1 %)** |

Cobertura medida contra los 116 módulos de `app/datos/catalogo.json` de hoy, entre escenas y generadores. «Sí» quiere decir que el módulo enseña ese tipo de problema, no que la pregunta esté resuelta en la app.

## Huecos, en orden: temas frecuentes sin escena ni generador

El orden pesa cuántas preguntas sin cubrir hay, en cuántos periodos salen y cuánto ayudaría una escena. La lista larga, unidad por unidad, está en la sección «Huecos por unidad» de `docs/datos/admision-unmsm-tablas.md`.

| # | Curso | Hueco | Preguntas sin cubrir | Periodos | Qué haría falta |
| --- | --- | --- | --- | --- | --- |
| 1 | Verbal | **Textos A/B** (debate o complementarios) | 240 | 14 | Banco de pares de textos con preguntas de controversia, postura de cada autor, coincidencia, síntesis y sentido contextual en uno de los dos |
| 2 | Verbal | **Inglés más allá de la idea principal** | 81 | 14 | Sentido contextual, extrapolación, incompatibilidad, título, dato, antónimo, propósito y «dónde se publicaría» |
| 3 | RM | **Visualización espacial**: cubos y vistas, dados, cubos agujereados, rutas en estructuras 3D | 41 | 12 | Escena de sólidos de cubitos que giran, con sus tres vistas y caras ocultas |
| 4 | RM | **Rumbos, trasvases y traslados de fichas** | 15 + 13 + 20 | 12 | Brújula con rumbos y notables; recipientes sin marcas (estado por estado); fichas con el mínimo de movimientos |
| 5 | Química | **Biomoléculas y productos naturales** | 25 | 9 | Explorador de moléculas grandes: contar sp2/sp3, enlaces pi, grupos funcionales y quiralidad |
| 6 | RM | **Rodamientos y regiones barridas**; certezas sobre sumas; cortes con apilado | 20 + 21 + 11 | 11–12 | Rueda que rueda por un camino quebrado (recorrido del centro), extracción por el peor caso con sumas, piezas que se apilan antes del corte |
| 7 | Geometría | **Sólidos de revolución, troncos y esfera inscrita** | 18 | 12 | Ampliar `solidos` con troncos, esfera inscrita, casquete y volumen desplazado |
| 8 | Geometría | **Relaciones métricas y áreas circulares** | 11 + 8 + 11 | 7–8 | Euclides, tangente, Ptolomeo, corona y áreas sombreadas con círculos |
| 9 | RM | **Lectura de palabras en arreglos** | 14 | 8 | Generador de conteo de lecturas (caminos en un triángulo de letras), enlazado con Pascal |
| 10 | RM | **Diagramas de flujo** (sin unidad en el catálogo) | 12 | 8 | Unidad nueva con un generador: seguir bucles y condiciones |
| 11 | Física | **Circuitos**: Kirchhoff con dos fuentes, efecto Joule, resistividad; **condensadores en asociación** | 15 + 5 | 8–9 | Pasos nuevos en `circuitos-cc` y `electrostatica` |
| 12 | Álgebra | **Ecuaciones polinomiales** (Cardano-Vieta, bicuadradas) e **inecuaciones de planteo con solución entera** | 12 + 12 | 7 | Generadores |
| 13 | Trigonometría | **Ángulos verticales con dos observaciones**, ecuaciones en un intervalo y máximos de a·sen x + b·cos x | 9 + 8 + 5 | 5–6 | Pasos en `circunferencia-trig` y `transformaciones-trig` |
| 14 | Física | **Hidrodinámica** (caudal, continuidad, Bernoulli) y **refracción** (Snell, ángulo límite) | 6 + 4 | 3–4 | Pestaña de tubo con estrechamiento en `fluidos`; rayo que cambia de medio en `optica-lente-delgada` o en `ondas-electromagneticas` |
| 15 | Química | **Soluciones en mEq y ppm** y **clasificación de reacciones** | 9 + 10 | 7 | Generadores |

**Lo que no hace falta construir para San Marcos.** Ninguna de estas unidades tuvo una sola pregunta en 50 exámenes:
- las ocho unidades de ejercicios sueltos de verbal: analogías, definiciones, conectores, eliminación, plan de redacción, cohesión, texto y contexto, y textos filosóficos;
- termodinámica;
- poliedros;
- lógica y conjuntos de álgebra.

Pueden servir para la UNI o para el colegio, pero no suman en San Marcos.

## Qué cambió respecto a la medición de simulacros

| | Simulacros (`docs/clasificacion-unmsm.md`) | Admisión (este informe) |
| --- | --- | --- |
| Material | 39 simulacros, 7 periodos oficiales | 50 exámenes, 14 periodos |
| Cursos | Física y química | Los ocho cursos de la app |
| Preguntas distintas de física y química | 120 | 584 |
| Repetidas | Muchas: las cinco áreas sacan de un banco común | Casi ninguna: cada día es un examen distinto |
| Cinemática y dinámica | Casi no salen (3 de 57 en física) | 18 % de la física (50 de 277: MRU-MRUV 20, parabólico y circular 10, dinámica 20) |
| Lente delgada | 0 | 0 (en óptica salen espejos y Snell) |
| Lo que más sale en física | Calorimetría, energía, magnetismo, circuitos | Lo mismo arriba (energía, circuitos, calor), con el MAS y fluidos al mismo nivel |
| Química orgánica | 25 % | 26 %; biomoléculas sube desde 2023 |
| Química conceptual | 62 % | 57 % |
| Cobertura de física | Fase 1: 5 % (3 de 57) | 61 % «sí» con los módulos de hoy (los cuatro de la fase 1 solos cubren el 10 %) |

Lo que se mantiene es que **San Marcos premia la amplitud**: en física las 20 unidades salen, menos termodinámica, y ninguna pasa del 9 % de las preguntas. La recomendación de entonces, «una plantilla corta por tema antes que una muy completa de uno solo», ya se cumplió en física y química. El margen ahora está en verbal y en razonamiento matemático, que valen la mitad del examen.

## Trampas típicas y su comparación con los códigos de `docs/investigacion/`

Los solucionarios casi nunca comentan los distractores. Las trampas se dedujeron de las alternativas y de la resolución, así que son **hipótesis de diseño, no datos de alumnos**. El detalle por curso está en `docs/clasificacion/trampas-admision-unmsm/`.

| Curso | Trampas que coinciden con un código | Trampas frecuentes sin código (proponer) |
| --- | --- | --- |
| Verbal | RV11 (términos absolutos, ~97 entre los dos grupos de periodos), RV1 (detalle como tema, ~73), RV18 y RV19 (sentido frecuente o vecino), RV8 (saber del mundo), RV33 (tesis de un solo texto en el par A/B), RV45-RV48 (leer mal el gráfico) | Atribuir a un autor la postura del otro (~29); pareja de términos con una sola mitad correcta (~10); confundir la fase temporal de un proceso (5) |
| RM | RM6 (certezas: peor caso), RM5, AR3, AR7 | Bisiestos mal contados (~11); verdades y mentiras (~11); rodamientos, como la vuelta de más alrededor de otra rueda (~11); puntos contra intervalos; hora marcada contra hora real |
| Física | Q7 (calor latente omitido), MG5, MG8 y MG9 (campo e inducción), S4 y S5 (espejos), G3 y G4, W15, OE12, R3 | Unidades sin convertir (~17); proporcionalidad sin cuadrado, raíz o ½ (~16); fotoeléctrico sin restar la función trabajo (7); decibeles sumados como números (6); periodo, frecuencia y ω confundidos (6); diámetro por radio (5); normal igual al peso con fuerza oblicua (5); condensadores asociados como resistencias (4) |
| Química | Las de estequiometría, redox y pH de los informes | Usar la ecuación sin balancear; potencias de diez; cruzar agente con especie en redox; configuración de iones de transición; grupo contra periodo; enlaces pi contra electrones pi; pureza y rendimiento aplicados al revés |
| Aritmética y álgebra | AR3 y AR4 (porcentaje sobre la base equivocada, ~20), AR8-AR10 (magnitud mal clasificada en la regla de tres, 7) | Tasa y tiempo en periodos distintos (8); contar uno de más o de menos en extremos (7); responder otra cantidad que la pedida (~10) |
| Geometría y trigonometría | TR12 y TR15 (signo según el cuadrante, 9), TR21 (soluciones que sobran, 7), GE1 y GE2 (escalar áreas y volúmenes con la razón lineal, 6), GE19 (radio por diámetro, 5) | Desigualdad estricta o condición de obtusángulo ignorada (5) |

Lo más útil para la app:
1. Las trampas transversales de cálculo (unidades, proporcionalidades, periodo y frecuencia, diámetro y radio) no tienen código en ningún informe y sirven en varios módulos a la vez. Conviene un código común para cada una.
2. En verbal, RV11 y RV1 explican casi la mitad de los distractores. La trampa propia del formato A/B, «la postura del otro autor», necesita un código nuevo, y es justo lo que trabajaría el banco de textos A/B (hueco 1).

## Calidad de los datos

- **Revisión independiente.** Un revisor contrastó 48 preguntas, 6 por archivo de clasificación, con la página del PDF.
  - Acierto: 97,2 % de los campos. Número, curso y clave, 100 %; unidad, tema y tipo, 98 %; cobertura, 90 %.
  - No hubo inflado de «sí»: el error iba al revés. Había 52 preguntas en «no» cuya unidad sí tiene módulo; se pasaron a «a medias», como dice el esquema, y quedó anotado en `nota`.
  - 13 páginas de química estaban corridas en dos y se corrigieron, igual que los 9 errores puntuales de la muestra.
- **Claves.**
  - **Verbal:** la letra se dedujo cruzando la respuesta que reescribe el solucionario con las alternativas.
  - **2021 escaneados:** los 3 exámenes van sin clave (`clave` vacía); traen marcas a mano que coinciden con el cálculo donde se revisó.
  - **Dudosas y sin clave:** 75 preguntas llevan en `nota` una duda sobre la clave o el enunciado, o dicen que no tienen clave. 28 son de verbal y 19 de física; el resto son errores del propio solucionario, como alternativas repetidas, datos inconsistentes o la clave que no está entre las opciones. No deben usarse como modelo sin contrastarlas con la clave oficial.
- **Repetidas.** La regla junta dos preguntas si coinciden el periodo, el comienzo del enunciado, el tema y la clave. Solo encontró un par, y el revisor confirmó que eran distintas: mismo escenario con otros datos. En verbal no se aplica, porque los enunciados son fórmulas («Según el texto…») que se repiten sobre textos distintos.
- **Temas.** Las etiquetas finas varían entre clasificadores. Por eso se cuenta por unidad del catálogo y, en RM y verbal, por familias armadas con reglas fijas (`FAMILIAS` en `herramientas/agregar_admision.py`).
- **Lo que no se midió.** Las preguntas 1 a 10 desde 2025-I, que no están publicadas. Tampoco se midieron los demás cursos del examen: lenguaje, literatura, biología, sociales.

## Cómo repetirlo

1. `bash fuentes/descargar.sh`, o solo las filas `examenes/unmsm-admision` de `fuentes/drive.tsv`.
2. Texto por página con `pdftotext -f N -l N`; OCR de los escaneados con `herramientas/ocr_pdf.sh`. Todo en una carpeta de trabajo fuera del repo.
3. Clasificar según `herramientas/esquema-clasificacion-admision.md`, uno o dos cursos por subagente.
4. Juntar y medir: `python3 -I herramientas/agregar_admision.py <carpeta_jsonl> docs/datos/admision-unmsm.csv docs/datos/admision-unmsm-tablas.md`.
