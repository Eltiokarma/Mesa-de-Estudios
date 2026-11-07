# Ideas erróneas en trigonometría

6 de noviembre de 2026 · Tarea 4 de `CLAUDE.md`, primer bloque de matemática (sigue a los informes de física y química)

Para qué sirve: da los distractores de las predicciones del curso de trigonometría (`catalogo/cursos/trigonometria.json`). Cubre estas unidades: `angulo-trigonometrico`, `longitud-de-arco-y-sector`, `razones-trigonometricas-agudas`, `triangulos-rectangulos`, `angulos-en-posicion-normal`, `reduccion-al-primer-cuadrante`, `circunferencia-trigonometrica`, `identidades-fundamentales`, `arcos-compuestos`, `arcos-multiples`, `funciones-trigonometricas`, `ecuaciones-trigonometricas` y `triangulos-oblicuangulos`. Quedan fuera la recta, las cónicas, las polares y los complejos (son geometría analítica; van en otro informe), las transformaciones a producto y las funciones inversas, salvo lo que se dice de arco seno en TR22.

**Advertencia sobre el método.** En esta sesión la red solo dejó hacer búsquedas: ninguna página de artículos abrió (ERIC, Dergipark, Springer, RSC, SciELO, ResearchGate y los repositorios universitarios respondieron "host no permitido"). Todo lo que sigue sale de resúmenes, fichas bibliográficas y citas de otros autores que devolvió el buscador. Por eso casi todo queda como "parcial" y cada cifra lleva la nota de dónde la vi. Antes de usar un porcentaje en una decisión, hay que confirmarlo en el texto completo (ver "Huecos").

## Resumen en seis líneas

1. **El radián casi nunca se entiende como razón entre arco y radio.** En Turquía, cerca del 90 % de 93 futuros profesores de matemática definió mal el radián, contra un 60 % que definió mal el grado (Tuna, 2013, según su resumen). En Estados Unidos, ningún futuro profesor de la muestra de Fi (2003) lo definió como razón de dos longitudes, aunque todos convertían bien entre grados y radianes.
2. **"π es 180".** Los futuros profesores tienen dos imágenes de π que no se tocan: π como ángulo (180°) y π como número irracional; además se resisten a aceptar que sen x reciba un número real (Akkoç, 2008, 42 participantes).
3. **Los grados se cuelan donde solo valen radianes.** En una encuesta a 769 universitarios de ciencias de cuatro países, el 70,7 % creyó que las fórmulas de derivadas del seno y del coseno valen igual en grados y en radianes; solo el 26,3 % acertó (Ben-Zion y otros, 2025). Es la misma raíz que usar 60 en vez de π/3 en s = θr.
4. **El seno se piensa como una longitud, no como una razón.** En bachillerato español, la concepción "seno y coseno son longitudes" fue la más frecuente (56,10 %, citado de Martín-Fernández, 2014). De ahí salen "el triángulo más grande tiene mayor seno" y el seno sin signo de un ángulo del tercer cuadrante (Brown, 2005).
5. **Calcular no es entender.** Los alumnos de un curso tradicional no podían estimar sen 20° ni justificar las propiedades de las funciones; los de un curso basado en la circunferencia sí (Weber, 2005). En la secundaria australiana, el error que más pesa es elegir mal la razón, no la cuenta (Kendal y Stacey, 1996 y 1997).
6. **Lo que no tiene estudios:** linealidad (sen(a + b) = sen a + sen b, sen 2x = 2 sen x), periodo de sen(bx), soluciones perdidas al dividir entre sen x, segundo triángulo del caso ambiguo, signo en la ley de cosenos, reducción al primer cuadrante. Quedan como hipótesis de aula, salvo un estudio chileno cualitativo sobre ecuaciones (Castro y Cárcamo).

## De dónde salen los datos

| Fuente | Muestra | Instrumento | Qué aporta | Cómo la leí |
| --- | --- | --- | --- | --- |
| Tuna (2013), Turquía | 93 futuros profesores de matemática | Cuestionario y análisis cualitativo y cuantitativo | Porcentaje que define bien el grado (≈40 %) y el radián (≈10 %) | Resumen |
| Akkoç (2008), Turquía | 42 futuros profesores; 6 entrevistas | Cuestionario y entrevistas | Imagen del radián dominada por la del grado; dos imágenes de π; rechazo de entradas reales | Resumen y citas de Moore (2013) |
| Topçu, Kertil, Akkoç, Yılmaz y Önder (2006), Turquía | 37 futuros y 14 profesores en ejercicio; 4 entrevistas | Cuestionario (PME 30) | Lo mismo que Akkoç, también en profesores en ejercicio | Ficha y citas |
| Fi (2003), Estados Unidos | Futuros profesores de secundaria (Universidad de Iowa) | Tesis doctoral | Convierten bien, pero nadie define el radián como razón | Citas de terceros |
| Ben-Zion, Segal, Liu, Wang, Rajak y Finkelstein (2025), Israel, EE. UU., China e India | 769 universitarios y posgraduados de ciencias e ingeniería | Encuesta | 70,7 % cree que grados y radianes valen igual al derivar; 59 % acierta en contexto físico | Resumen |
| Williams (sin fecha), Georgia College, EE. UU. | 60 estudiantes (44 de cálculo) | Cuestionario | 28,3 % "π rad = 1 rad"; 6,7 % "la circunferencia entera es 1 rad"; seno confundido con la coordenada x | Fragmentos; trabajo de estudiante, sin revisión por pares |
| Martín-Fernández, Ruiz-Hidalgo y Rico (2014, 2016), España | Estudiantes de bachillerato | Explicación verbal y escrita de "qué es el seno" | Categorías: longitud, cociente, coordenada; 56,10 % y 46,32 % | Resúmenes y citas; no sé aún a qué muestra va cada cifra |
| De Kee, Mura y Dionne (1996), Canadá (Quebec) | Alumnos de secundaria | Entrevistas | "El coseno es una longitud que depende de un punto"; el ángulo depende del largo de sus lados | Cita en una presentación del CIEAEM |
| Brown (2005), EE. UU. | Estudiantes de secundaria y universidad (tesis, Illinois State) | Tareas y entrevistas | Modelo razón, distancia y coordenada; quien piensa en distancias falla el signo de sen 210° | Citas de terceros |
| Weber (2005), EE. UU. | Dos cursos universitarios de trigonometría (lectura de las citas: 31 estudiantes en total) | Comparación de curso tradicional y experimental, entrevistas | Sin circunferencia, no estiman ni justifican | Resumen y citas |
| Kendal y Stacey (1996, 1997), Australia | 8 cursos de 10.º grado asignados al azar | Prueba y retención a fin de año | Método de razones mejor que el de circunferencia para triángulos; el error principal es elegir la razón | Resumen y fragmentos |
| Gür (2009), Turquía | 140 alumnos de 10.º grado | Prueba diagnóstica de 7 preguntas y entrevistas | Tipos de error: uso impropio de fórmulas, orden de operaciones, "valor y lugar" del seno y el coseno | Resumen de ERIC |
| Castro y Cárcamo (Bolema), Chile | 60 estudiantes de primer año de ingeniería (Universidad de Atacama) | Cuestionario escrito, análisis cualitativo | Errores en ecuaciones de forma cuadrática, fracciones algebraicas y falta de verificación | Resumen |
| Torres-Corrales y Montiel-Espinosa (2021), México | Primer año de ingeniería | Experimento de diseño (socioepistemología) | Antecedentes: no se distingue razón trigonométrica de relación proporcional; se aplica en triángulos no rectángulos | Resumen |

**Cautelas.** Cuatro de las fuentes más claras (Tuna, Akkoç, Topçu y Fi) estudian a **futuros profesores**, no a escolares. Si ellos fallan en definir el radián, es razonable esperar que un postulante también falle, pero el porcentaje no se traslada. No encontré ningún estudio peruano publicado con porcentajes; solo un trabajo de suficiencia profesional de Iquitos con 25 alumnos de 5.º de secundaria, que vi en un resultado de búsqueda y no pude abrir (68 % desaprobó "razones trigonométricas"). No lo uso como dato.

## Catálogo con respaldo

Respaldo: **documentado** (dato cuantitativo en estudio publicado), **parcial** (estudio cualitativo, muestra pequeña o cifra vista solo en citas) o **hipótesis** (sección siguiente).

### Ángulo, radián, arco y sector

| # | Idea errónea | Ejemplo tipo examen | Dato | Fuente | Respaldo |
| --- | --- | --- | --- | --- | --- |
| TR1 | **"π es 180".** π se lee como un símbolo de ángulo y no como el número 3,14…; un radián sería "una parte de π" o "π radianes = 1 radián". | "Un ángulo mide 2 rad. ¿Cuántos grados son?" Responde 360° (lee 2 como 2π) o no sabe qué hacer porque no hay π. | Dos imágenes de π separadas (cualitativo, 42 futuros profesores). "π rad = 1 rad": 28,3 % de 60 estudiantes. | Akkoç (2008); Topçu y otros (2006); Williams (s. f.) | Parcial |
| TR2 | **El radián no es una razón entre arco y radio.** Se sabe convertir, pero no qué mide. | "En una circunferencia de radio 5 cm, un arco de 5 cm, ¿qué ángulo central abarca?" No ve que es 1 rad sin calcular. | Radián mal definido: ≈90 % de 93; grado mal definido: ≈60 %. Ninguno lo define como razón (Fi). | Tuna (2013); Fi (2003), citado por Akkoç y Moore | Documentado |
| TR3 | **La entrada de sen, cos y tan es siempre en grados.** sen 2 se lee sen 2°; se resiste a sen x con x real. | "¿Cuánto vale sen(π/6)?" bien, pero "sen 3 es positivo o negativo" lo trata como sen 3°. | 70,7 % de 769 cree que grados y radianes valen igual al derivar (26,3 % acierta). | Ben-Zion y otros (2025); Akkoç (2008) | Documentado (en contexto de cálculo) |
| TR5 | **La circunferencia entera mide 1 radián** (o el radián es "la vuelta"). | "¿Cuántos radianes tiene una vuelta?" Responde 1. | 6,7 % de 60. | Williams (s. f.) | Parcial |
| TR6 | **El ángulo depende del largo de sus lados.** Un ángulo dibujado con lados más largos "es más grande". | Dos ángulos iguales dibujados con lados de distinto largo: elige el de lados largos como mayor. | Sin porcentaje. | De Kee, Mura y Dionne (1996), citado en una presentación del CIEAEM | Parcial |

### Razones en el triángulo rectángulo

| # | Idea errónea | Ejemplo tipo examen | Dato | Fuente | Respaldo |
| --- | --- | --- | --- | --- | --- |
| TR7 | **El seno es una longitud** (el cateto opuesto, el segmento vertical), no un cociente. | "En un triángulo de catetos 6 y 8, ¿cuánto vale sen θ?" Responde 6. | Concepción "longitud": 56,10 %; "cociente": 46,32 % (las categorías se solapan). | Martín-Fernández (2014), citado en Martín-Fernández, Ruiz-Hidalgo y Rico (2016); De Kee y otros (1996) | Documentado, con reserva (cifra vista en citas) |
| TR8 | **La razón depende del tamaño del triángulo:** el triángulo más grande tiene mayor seno. Consecuencia directa de TR7. | "Se duplican los lados de un triángulo 3-4-5. ¿Qué pasa con sen θ?" Responde "se duplica". | Sin porcentaje. De Kee y otros: "el coseno depende de un punto y no de un ángulo". | De Kee y otros (1996) | Parcial |
| TR9 | **Elige mal la razón** (usa seno donde va tangente, confunde opuesto y adyacente). | Ángulo de elevación de 53° a 30 m: calcula 30·sen 53° = 24 en vez de 30·tan 53° = 40. | El error de cálculo es menor; el que pesa es elegir la razón. Sin porcentaje en lo que vi. | Kendal y Stacey (1996, 1997) | Parcial |
| TR10 | **La razón es proporcional al ángulo:** si el ángulo se duplica, el seno se duplica. | "sen 30° = 1/2, entonces sen 60° = 1." | Sin porcentaje; dificultad reportada como antecedente. | Torres-Corrales y Montiel-Espinosa (2021) | Parcial |
| TR11 | **El seno es la coordenada x** (cruza seno y coseno). | En la circunferencia, mide sen 30° en el eje horizontal: ≈0,87. | Sin porcentaje claro en el fragmento. | Williams (s. f.) | Parcial |
| TR25 | **Usa razones del triángulo rectángulo en un triángulo que no lo es.** | Triángulo de lados 5, 7, 8: "sen A = 5/8" porque 8 es el lado mayor. | Sin porcentaje. | Torres-Corrales y Montiel-Espinosa (2021), como antecedente | Parcial |

### Circunferencia, signos, funciones y ecuaciones

| # | Idea errónea | Ejemplo tipo examen | Dato | Fuente | Respaldo |
| --- | --- | --- | --- | --- | --- |
| TR12 | **El seno es una distancia sin signo.** En el tercer y cuarto cuadrante se olvida el signo. | sen 210° = +1/2. | Sin porcentaje; quien tiene la visión "distancia" falla justo en sen 210°. | Brown (2005), citado por terceros | Parcial |
| TR13 | **Sin la circunferencia no hay sentido:** no estima valores ni justifica propiedades (sen x ≤ 1, periodo, signo). | "¿sen 20° es mayor o menor que 1/2?" No sabe sin tabla. | Comparación de dos cursos; sin cifras en lo que vi. | Weber (2005) | Parcial |
| TR16 | **Linealidad:** sen(a + b) = sen a + sen b; sen 2x = 2 sen x; cos(x/2) = (cos x)/2. | "sen 30° + sen 60° = sen 90° = 1." | Sin porcentaje específico. Gür registra "uso impropio de fórmulas"; Matz (1982) explica la extrapolación lineal en álgebra. | Gür (2009); Matz (1982), citado por terceros | Parcial |
| TR20 | **Razón, circunferencia y gráfica son tres temas sueltos.** El seno del triángulo no es "el mismo" que el de la gráfica. | Sabe que sen 90° = 1 pero no reconoce el máximo de y = sen x en x = π/2. | Sin porcentaje: muchos alumnos con comprensión fragmentada. | Brown (2005); Montiel (2005); Torres-Corrales y Montiel-Espinosa (2021) | Parcial |
| TR21 | **Pierde soluciones al dividir entre una función o al factorizar mal, y no verifica.** | 2 sen x cos x = sen x: divide entre sen x, queda cos x = 1/2 y pierde x = 0 y x = π. | Sin porcentaje; errores concentrados en ecuaciones de forma cuadrática y en no verificar. | Castro y Cárcamo (Bolema), 60 estudiantes chilenos | Parcial |

## Lo que no tiene respaldo (todavía)

Son errores que cualquier profesor de academia reconoce y que tienen apoyo en la experiencia o en guías docentes, pero no encontré estudios con datos. Se tratan como hipótesis y se confirman con la medición de la app.

| # | Hipótesis | Ejemplo | Relación con lo documentado |
| --- | --- | --- | --- |
| TR4 | Usa grados en s = θr o en A = θr²/2. | Radio 6, 60°: s = 360 (debería ser 2π ≈ 6,28). | Sale de TR2 y TR3. |
| TR14 | En la reducción al primer cuadrante cambia de función cuando no corresponde (o al revés). | sen(180° − x) = cos x; cos(270° + x) = cos x. | Memorizar la regla sin la circunferencia (TR13). |
| TR15 | Coterminales y negativos: resta mal las vueltas o trata −x como 360° + x sin cambiar el signo de la razón. | sen 1110°: usa 1110 − 1080 = 30, bien, pero sen(−30°) = +1/2. | TR12. |
| TR17 | Notación: lee sen²x como sen(x²) o sen x² como (sen x)². | sen²30° = sen 900°. | Gür (2009) registra errores de "orden de operaciones" sin detallar. |
| TR18 | Periodo de sen(bx): pone 2πb o b en vez de 2π/b. | y = 3 sen 2x: periodo 4π. | Guías docentes lo llaman "muy común"; sin estudio. |
| TR19 | Amplitud con desplazamiento vertical: toma el máximo como amplitud. | y = 2 cos(x/3) + 1: amplitud 3. | Sin estudio. |
| TR22 | Ecuación con una sola solución: la que da la calculadora o la tabla. | sen x = 1/2 en [0, 2π): solo π/6 (falta 5π/6). | Igual que TR23: arco seno da un solo ángulo. |
| TR23 | Caso ambiguo de la ley de senos: no ve el segundo triángulo con el ángulo suplementario. | A = 30°, a = 5, b = 8: solo B = 53°, falta B = 127°. | Solo hay relatos de profesores (página docente de la Universidad de Georgia). |
| TR24 | Ley de cosenos con el signo cambiado, o sin el término 2bc cos A. | b = 5, c = 8, A = 60°: a² = 129 o a² = 89. | Sin estudio. |

## Propuesta para las plantillas

Colores (ver `docs/diseno.md`): uno para el ángulo θ, otro para el radio r, otro para el arco s, otro para el seno y otro para el coseno. El ángulo siempre se dibuja como arco y se escribe en las dos unidades a la vez.

### Escena 1: la cinta del radio (unidades `angulo-trigonometrico` y `longitud-de-arco-y-sector`)

**Qué se ve.** Una circunferencia y una cinta del mismo largo que el radio, del color de r. El alumno arrastra el extremo del ángulo; la cinta se dobla sobre el arco y se cuentan cuántas cintas caben: eso es θ en radianes (la idea de Moore, 2013, de medir el ángulo con arcos). Un segundo control cambia el radio: el arco crece, pero el número de cintas no cambia (TR2, TR6). El sector se pinta y su área aparece como "media cinta por arco", es decir θr²/2. Un modo "rueda" hace rodar la circunferencia sobre el piso y deja la huella del arco (número de vueltas).

Predicción 1: *en una rueda de radio 6 cm, ¿cuánto mide el arco de 60°?*

| Opción | Error | Código |
| --- | --- | --- |
| a) 2π cm (≈6,28 cm) | Correcta | — |
| b) 360 cm | Usa 60 en s = θr | TR4 (TR3) |
| c) 6 cm | "Un radián es 60°" (redondea 57,3°) o cree que el arco es el radio | TR2 |
| d) π/3 cm | Da el ángulo en radianes y olvida multiplicar por el radio | TR2 (hipótesis) |

Predicción 2: *se duplica el radio y el ángulo no cambia. ¿Cuántas cintas (radianes) abarca ahora?*

| Opción | Error | Código |
| --- | --- | --- |
| a) Las mismas: la cinta también se duplicó | Correcta | — |
| b) El doble | El ángulo depende del largo de los lados | TR6, TR2 |
| c) La mitad | Piensa que la cinta sigue igual y el arco también | TR2 |
| d) Depende de cuánto mide π | π como ángulo y no como número | TR1 |

Predicción 3: *¿cuántos radianes tiene una vuelta completa?* a) 2π ≈ 6,28 (correcta); b) 1 (TR5); c) 360 (TR3); d) π (confunde la vuelta con la media vuelta; ligado a "π es 180", TR1).

Predicción 4: *una moneda de radio r rueda por fuera de un disco fijo de radio 3r hasta volver al inicio. ¿Cuántas vueltas da sobre sí misma?* a) 4 (correcta; el centro recorre 2π·4r); b) 3 (cuenta solo el arco del disco: TR2, hipótesis); c) 6 (usa diámetros, hipótesis); d) 2 (confunde con el caso por dentro, hipótesis).

### Escena 2: la circunferencia que se desenrolla (unidades `razones-trigonometricas-agudas`, `angulos-en-posicion-normal`, `reduccion-al-primer-cuadrante`, `circunferencia-trigonometrica`, `funciones-trigonometricas`)

**Qué se ve.** A la izquierda, un triángulo rectángulo que el alumno puede agrandar con un dedo sin cambiar el ángulo: las barras de los lados crecen, pero la barra de "sen θ = opuesto/hipotenusa" no se mueve (TR7, TR8). Un botón pone el triángulo dentro de la circunferencia de radio 1: el seno pasa a ser la altura **con signo** del punto (flecha hacia arriba o hacia abajo) y el coseno la abscisa (TR11, TR12). Al arrastrar el punto, a la derecha se dibuja la gráfica de y = sen x punto por punto, con el mismo color (TR20). Un control de "b" comprime la gráfica y cuenta cuántas ondas caben en 2π (TR18); otro de "A" y "D" la estira y la sube, con la amplitud medida desde la línea media (TR19).

Predicción 1: *un triángulo 3-4-5 se agranda a 6-8-10. ¿Qué pasa con sen θ?* a) Sigue siendo 3/5 (correcta); b) se duplica (TR8); c) pasa a 6 (TR7); d) baja porque la hipotenusa creció más (TR8, variante; hipótesis).

Predicción 2: *¿cuánto vale sen 210°?* a) −1/2 (correcta); b) +1/2 (TR12); c) −√3/2 (TR11: toma la abscisa); d) +√3/2 (TR11 y TR12).

Predicción 3: *sen 30° = 1/2. ¿Cuánto vale sen 60°?* a) √3/2 ≈ 0,87 (correcta); b) 1 (TR10, linealidad TR16); c) 1/4 (proporcional al revés, hipótesis); d) 1/2, "el seno no depende del ángulo" (poco probable; sirve de control).

Predicción 4: *¿cuánto vale sen 30° + sen 60°, y es igual a sen 90°?* a) ≈1,37; no es sen 90° = 1 (correcta); b) 1, sí es igual (TR16); c) 1/2 + 1/2 = 1 (TR10 y TR16); d) 2, porque cada uno vale 1 (TR7 con lados unitarios, hipótesis).

Predicción 5: *¿cuál es el periodo de y = 3 sen 2x?* a) π (correcta); b) 4π (TR18); c) 2 (TR18, variante); d) 6π (mezcla amplitud y periodo, hipótesis).

Predicción 6 (ecuación, la gráfica corta la recta): *¿cuántas soluciones tiene 2 sen x cos x = sen x en [0, 2π)?* a) 4: 0, π/3, π y 5π/3 (correcta); b) 2: π/3 y 5π/3 (divide entre sen x: TR21); c) 1: π/3 (TR21 y TR22); d) 3: 0, π/3 y π (olvida el cuarto cuadrante: TR12, TR22).

### Escena 3: el compás del caso ambiguo (unidad `triangulos-oblicuangulos`)

**Qué se ve.** Un ángulo A fijo de 30° con un lado b = 8 dibujado. Desde el extremo de b cuelga un brazo de largo a, como un compás, que el alumno alarga o acorta arrastrando. Donde el brazo toca la base aparecen uno, dos o ningún triángulo, cada uno con su B y su c en vivo. La altura h = b sen A se marca con una línea punteada: si a < h no hay triángulo; si h < a < b hay dos (TR23). Un panel lateral muestra la ley de cosenos como el teorema de Pitágoras "corregido": el término −2bc cos A se dibuja como un rectángulo que se resta o se suma según A sea agudo u obtuso (TR24).

Predicción 1: *con a = 5, ¿cuántos triángulos hay?* a) 2, con B ≈ 53° y B ≈ 127° (correcta); b) 1, con B ≈ 53° (TR23, TR22); c) ninguno, porque a < b (hipótesis); d) 1, con B = 90° (TR25: lo trata como rectángulo).

Predicción 2: *b = 5, c = 8, A = 60°. ¿Cuánto mide a?* a) 7 (correcta); b) √129 ≈ 11,4 (TR24, signo); c) √89 ≈ 9,4 (TR24, sin el término); d) 13 (suma de lados, hipótesis).

## Casos de prueba propuestos

Verificados con `fractions.Fraction` en Python (`python3 -I`; sympy no estaba instalado). Cuando el resultado lleva π o √3, se trabajó el coeficiente racional con fracciones y se comprobó el valor con `math` a 10⁻⁹. Las raíces de la ecuación del caso 11 se contaron además por cambio de signo en una malla de 100 000 puntos. Convención de academia: sen 37° = 3/5 y sen 53° = 4/5, que es exacto si el ángulo se define por la razón (53° ≈ 53,13°).

| # | Unidad | Entrada | Salida esperada | Distractor que debe dar el generador |
| --- | --- | --- | --- | --- |
| 1 | Arco | r = 6 cm, θ = 60° | s = 2π cm | 360 (TR4) |
| 2 | Sector | r = 6 cm, θ = 60° | A = 6π cm² | 12π, sin el ½; 1080, con grados |
| 3 | Conversión | π/12 rad; 2 rad | 15°; 360/π ≈ 114,59° | 360° (TR1) |
| 4 | Sistemas | 40ᵍ | 36° = π/5 rad | 40° |
| 5 | Vueltas | Rueda de r = 1/4 m recorre 10π m; moneda de radio r alrededor de disco de 3r | 20 vueltas; 4 por fuera y 2 por dentro | 40π (s/r sin 2π); 3 |
| 6 | Razones | Catetos 3 y 4; luego 6 y 8 | sen θ = 3/5 en ambos | 6 (TR7); 6/5 (TR8) |
| 7 | Elevación | Distancia 30 m, elevación 53° | h = 40 m | 24 con seno; 18 con coseno (TR9) |
| 8 | Reducción | sen 210°, cos 300°, tan 135°, sen(−30°), sen 1110° | −1/2, 1/2, −1, −1/2, 1/2 | +1/2 en sen 210° (TR12) |
| 9 | Identidades | sen(30° + 60°); sen 30° + sen 60°; 2 sen 30° y sen 60° | 1; (1 + √3)/2 ≈ 1,366; 1 y √3/2 | Iguales (TR16) |
| 10 | Funciones | y = 3 sen 2x; y = 2 cos(x/3) + 1; y = tan 2x | Periodo π y amplitud 3; periodo 6π, amplitud 2, máx. 3 y mín. −1; periodo π/2 | 4π; amplitud 3; π (TR18, TR19) |
| 11 | Ecuaciones | 2 sen x cos x = sen x en [0, 2π); sen x = 1/2 en [0, 2π) | {0, π/3, π, 5π/3}; {π/6, 5π/6} | {π/3, 5π/3} (TR21); {π/6} (TR22) |
| 12 | Oblicuángulos | b = 5, c = 8, A = 60°; caso ambiguo A = 30°, a = 5, b = 8 | a = 7; sen B = 4/5, B ≈ 53,13° o 126,87°, c = 4√3 + 3 ≈ 9,93 o 4√3 − 3 ≈ 3,93 | √129 (TR24); un solo triángulo (TR23) |

El script está en el scratchpad de la sesión (no se versiona); cuando exista la plantilla, estos casos pasan a su `casos.json` y se vuelven a verificar con un cálculo independiente, como en las plantillas de física.

## Huecos y siguientes pasos

- **Leer los textos completos.** Lo más urgente, porque hoy todo viene de resúmenes: Tuna (2013) para confirmar el 90 % y el 40 %; Akkoç (2008) para ver si cuenta respuestas por ítem; Weber (2005) para las cifras por curso; Martín-Fernández (2014) para saber a qué muestra corresponde el 56,10 %; Williams (Georgia College) para el tamaño de cada grupo. Weber y Gür están en ERIC, de acceso abierto; Akkoç está en la página de su autora (Universidad de Mármara). Desde un navegador deberían bajar.
- **Brown (2005)** y **Fi (2003)**, tesis doctorales de Illinois State y de Iowa. La de Fi está en el repositorio de Iowa (ir.uiowa.edu/etd/4936).
- **Kendal y Stacey (1996)** en las actas de MERGA y **(1997)** en *Vinculum*: confirmar qué porcentaje falla por elegir mal la razón.
- **Moore (2013, 2014)** y **Moore, LaForest y Kim (2016)**: dan la secuencia didáctica de "medir con arcos", que es la base de la escena 1.
- **Castro y Cárcamo** (Bolema, SciELO Brasil) y **Torres-Corrales y Montiel-Espinosa (2021)** en *Educación Matemática*: son las dos fuentes latinoamericanas más cercanas; conviene sacar sus categorías y conteos.
- **Sin datos de nadie:** linealidad en identidades, periodo y amplitud, reducción al primer cuadrante, caso ambiguo y ley de cosenos. Para esas, la prueba del colegio debería traer al menos dos preguntas abiertas para recoger respuestas reales antes de fijar los distractores.
- **Sin datos peruanos.** Buscar en Cybertesis (San Marcos), el repositorio de la PUCP y la UNE tesis de maestría sobre trigonometría escolar.
- Añadí estas referencias a `fuentes/por-conseguir.md`.

## Fuentes

Ninguna leída completa: en esta sesión solo funcionó el buscador. Lo que digo de cada una sale de su resumen, su ficha o de las citas indicadas.

- Akkoç, H. (2008). *Pre-service mathematics teachers' concept images of radian*. International Journal of Mathematical Education in Science and Technology 39(7), 857–878. DOI 10.1080/00207390802054458. Texto en <https://mimoza.marmara.edu.tr/~hakkoc/Akkoc_radian.pdf> (no abrió desde aquí).
- Topçu, T., Kertil, M., Akkoç, H., Yılmaz, K. y Önder, O. (2006). *Pre-service and in-service mathematics teachers' concept images of radian*. Actas de PME 30, Praga.
- Tuna, A. (2013). *A conceptual analysis of the knowledge of prospective mathematics teachers about degree and radian*. World Journal of Education 3(4), 1–9. DOI 10.5430/wje.v3n4p1.
- Fi, C. D. (2003). *Preservice secondary school mathematics teachers' knowledge of trigonometry: subject matter content knowledge, pedagogical content knowledge and envisioned pedagogy*. Tesis doctoral, Universidad de Iowa.
- Ben-Zion, Segal, Liu, Wang, Rajak y Finkelstein (2025). *Global blind spot in understanding trigonometric derivatives: a multinational analysis*. Physical Review Physics Education Research 21, 020137. Preprint en <https://arxiv.org/abs/2503.01525>.
- Williams (s. f.; el buscador lo atribuye a Christopher Williams). *Understandings and misunderstandings of trigonometry*. Trabajo de Georgia College & State University, <https://www.gcsu.edu/sites/files/page-assets/node-808/attachments/williams.pdf>.
- Martín-Fernández, E., Ruiz-Hidalgo, J. F. y Rico, L. (2014). *Concepciones del seno y coseno puestas de manifiesto por estudiantes de bachillerato*. Investigación en Educación Matemática XVIII, SEIEM, 455–464. <https://funes.uniandes.edu.co/funes-documentos/concepciones-del-seno-y-coseno-puestas-de-manifiesto-por-estudiantes-de-bachillerato/>.
- Martín-Fernández, E., Ruiz-Hidalgo, J. F. y Rico, L. (2016). *Significado escolar de las razones trigonométricas elementales*. Enseñanza de las Ciencias 34(3), 51–71. DOI 10.5565/rev/ensciencias.1871.
- De Kee, Mura y Dionne (1996). *La compréhension des notions de sinus et de cosinus chez des élèves du secondaire*. For the Learning of Mathematics 16(2), 19–22. Visto en una presentación del CIEAEM (<https://orbi.uliege.be/bitstream/2268/240626/1/CIEAEM-Pre%cc%81sentation.pdf>).
- Brown, S. A. (2005). *The trigonometric connection: students' understanding of sine and cosine*. Tesis doctoral, Illinois State University.
- Weber, K. (2005). *Students' understanding of trigonometric functions*. Mathematics Education Research Journal 17(3), 91–112. <https://files.eric.ed.gov/fulltext/EJ747914.pdf>.
- Kendal, M. y Stacey, K. (1996). *Trigonometry: comparing ratio and unit circle methods*. Actas de MERGA 19. Y (1997) *Teaching trigonometry*, Vinculum 34(1), 4–8.
- Gür, H. (2009). *Trigonometry learning*. New Horizons in Education 57(1), 67–80. <https://files.eric.ed.gov/fulltext/EJ860819.pdf>.
- Castro y Cárcamo. *Errores en la resolución de ecuaciones trigonométricas: un estudio exploratorio con estudiantes de primer año de ingeniería*. Bolema (SciELO Brasil). Año por confirmar en el texto completo.
- Torres-Corrales, D. C. y Montiel-Espinosa, G. (2021). *Resignificación de la razón trigonométrica en estudiantes de primer año de Ingeniería*. Educación Matemática 33(3). DOI 10.24844/EM3303.08.
- Montiel, G. (2005). *Estudio socioepistemológico de la función trigonométrica*. Tesis doctoral, CICATA-IPN, México.
- Moore, K. C. (2013). *Making sense by measuring arcs: a teaching experiment in angle measure*. Educational Studies in Mathematics 83(2), 225–245. Y (2014) *Quantitative reasoning and the sine function: the case of Zac*, Journal for Research in Mathematics Education 45(1).
- Matz, M. (1982). *Towards a process model for high school algebra errors*. En Sleeman y Brown (eds.), *Intelligent Tutoring Systems*, Academic Press. Visto solo en citas.

## Anexo: funciones trigonométricas inversas (7 nov 2026)

Este informe no cubre las inversas. Los errores IN1 a IN29 de `plantillas/funciones-trig-inversas/` (la ventana principal) son hipótesis nuestras: devolver todos los ángulos con ese seno en vez del de la ventana, arcsen(sen x) = x fuera de la ventana, arccos con la ventana del arcsen, sen⁻¹ tomado como 1/sen, dominio de arcsen fuera de [−1; 1] y los demás que lista la cabecera de su `motor.js`. Se confirman con los datos del colegio.


## Transformaciones trigonométricas (TT1 a TT13, 7 nov 2026)

Los errores TT1 a TT13 de `plantillas/transformaciones-trig/` (suma a producto, producto a suma, cocientes y pulsaciones) son **hipótesis nuestras**, sin dato publicado leído; la lista está en `rutinas/matematica-a.md` y en la cabecera del motor. Se confirman o descartan con los datos del colegio piloto.

## Cónicas (CO1 a CO37, 7 nov 2026)

Este informe no cubre las cónicas. Los errores CO1 a CO35 y CO37 de `plantillas/conicas/` (la cuerda del jardinero) son **hipótesis nuestras**, sin dato publicado leído; la lista está en `rutinas/matematica-a.md` y en la cabecera del motor. Falta un informe que los respalde o descarte; mientras tanto se confirman con los datos del colegio piloto.
