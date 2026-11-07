# Fuentes por conseguir

4 de noviembre de 2026 · Lista para Gerson

Son los libros, tesis y artículos que la investigación de `docs/investigacion/` cita sin haberlos leído completos: los leí a través de resúmenes o de otros autores, o no se pudieron descargar. Con el texto completo se pueden confirmar porcentajes y completar las tablas de ideas erróneas.

**Cómo pasármelos.** Pon cada PDF en la carpeta indicada, con el nombre sugerido. Los PDFs no se suben a GitHub (`.gitignore` excluye `fuentes/**/*.pdf`), así que en cada sesión nueva hay que volver a ponerlos, o pasármelos directamente en el chat como hiciste con el zip. Marca la casilla cuando lo consigas.

Prioridad: **A** cambia una tabla o una decisión; **B** confirma un dato que ya está, con otra fuente; **C** es contexto.

## 1. Lo más útil

| ✓ | Prioridad | Qué | Para qué | Dónde está | Guardar como |
| --- | --- | --- | --- | --- | --- |
| [ ] | A | **Prospectos y temarios de admisión** de la UNA Puno, la UNSA y la UNSAAC, y los prospectos oficiales de la UNI y San Marcos. Ya están el sílabo del CEPRE-UNI 2026-2 y 13 temarios del CEPRE-UNMSM (ver `docs/taxonomia-*.md`) | Fijar la taxonomía (tarea 2 de `CLAUDE.md`). Sin ellos, la taxonomía es una propuesta | Se compran o se descargan en cada universidad. El de física de la UNSAAC estaba en `ccomputo.unsaac.edu.pe/admision/files/temario/fisicaa.pdf`, pero el servidor no respondió | `fuentes/prospectos/<universidad>-<año>.pdf` |
| [ ] | A | **Exámenes pasados de la UNA Puno** (y de las otras, si hay). De San Marcos ya hay 44 simulacros oficiales. De la UNA Puno solo hay un solucionario de academia de un examen extraordinario (blog pdfz.blogspot.com), y trae únicamente razonamiento matemático y verbal: falta la prueba de conocimientos (física y química), idealmente oficial, de la DIAD o del CEPREUNA. Del CEPREUNA ya hay 7 cuadernillos (2018-II a 2020-I, de javiernc.jimdofree.com), pero son solo de lenguaje y literatura | Clasificar 50 problemas reales (tarea 3) | Universidades, academias, solucionarios | `fuentes/examenes/<universidad>-<año>-<fase>.pdf` |
| [ ] | A | **Kaltakci (2012)**, tesis doctoral: *Development and application of a four-tier test to assess pre-service physics teachers' misconceptions about geometrical optics*. Universidad Técnica de Medio Oriente (METU), 536 páginas | Porcentajes de ideas erróneas en espejos esféricos y lentes; completa dos informes | Acceso abierto: <https://etd.lib.metu.edu.tr/upload/12614699/index.pdf>. Desde aquí, el servidor cortó la conexión; desde tu navegador debería bajar | `fuentes/libros/kaltakci-2012-tesis-optica.pdf` |
| [ ] | A | **Datos por pregunta del FCI de la PUCP** (Castillo, Moscoso, Phan y Quiroz, 2013) | Mejor fuente de distractores con alumnos peruanos. El artículo solo publica resultados por tema | No es un archivo: hay que pedírselos a los autores. Los correos están en el artículo (por ejemplo, `hcastil@pucp.edu.pe`) | `fuentes/libros/pucp-fci-por-pregunta.xlsx` |

## 2. Artículos clásicos que solo leí a través de otros

Casi todos están en el *American Journal of Physics* (AJP) o *The Physics Teacher* (TPT), que son de pago. Se consiguen con acceso universitario, pidiéndolos a los autores, o en ResearchGate.

### Óptica

| ✓ | Prioridad | Referencia | Para qué |
| --- | --- | --- | --- |
| [ ] | B | Goldberg y McDermott (1987), *An investigation of student understanding of the real image formed by a converging lens or concave mirror*, AJP 55(2), 108–119. DOI 10.1119/1.15254 | Es la fuente original de lentes y espejos cóncavos. Confirmar media lente, sin pantalla y sin lente |
| [ ] | B | Goldberg y McDermott (1986), *Student difficulties in understanding image formation by a plane mirror*, TPT 24, 472–480 | Confirmar el "~30 %" y el "~70 %" de espejos, que hoy vienen de una diapositiva sin cita |
| [ ] | B | Galili y Hazan (2000), *Learners' knowledge in optics: interpretation, structure and analysis*, International Journal of Science Education 22(1), 57–88 | El modelo de fondo ("la imagen viaja entera"), en el que se apoya la propuesta de óptica |
| [ ] | B | Kaltakci-Gurel, Eryilmaz y McDermott (2016), *Identifying pre-service physics teachers' misconceptions and conceptual difficulties about geometrical optics*, European Journal of Physics 37(4). DOI 10.1088/0143-0807/37/4/045705 | Espejos esféricos y convexos |
| [ ] | C | Kaltakci-Gurel, Eryilmaz y McDermott (2017), artículo del test de cuatro niveles, Research in Science & Technological Education 35(2), 238–260. DOI 10.1080/02635143.2017.1310094 | Versión corta de la tesis; sirve si la tesis no baja |
| [ ] | C | Flerackers, Janssen y Poulis (1984), sobre combinaciones de lentes sin convención de signos, Physics Education | Ver si mide errores de signo en sistemas de lentes |

### Cinemática

| ✓ | Prioridad | Referencia | Para qué |
| --- | --- | --- | --- |
| [ ] | A | Trowbridge y McDermott (1980), *Investigation of student understanding of the concept of velocity in one dimension*, AJP 48(12), 1020–1028. DOI 10.1119/1.12298 | Porcentajes de "misma posición, misma velocidad" (K1) |
| [ ] | A | Trowbridge y McDermott (1981), *Investigation of student understanding of the concept of acceleration in one dimension*, AJP 49(3), 242–253 | Porcentajes de K2 y K3 |
| [ ] | B | McDermott, Rosenquist y van Zee (1987), *Student difficulties in connecting graphs and physics: Examples from kinematics*, AJP 55(6), 503–513. DOI 10.1119/1.15104 | Ejemplos originales de "la gráfica como foto" |
| [ ] | C | Jimoyiannis y Komis (2001), *Computer simulations in physics teaching and learning: a case study on students' understanding of trajectory motion*, Computers & Education 36(2), 183–204 | Simulaciones y tiro parabólico; respalda el formato del laboratorio |
| [ ] | C | McCloskey (1983), *Intuitive physics*, Scientific American 248(4) | Trayectorias con "ímpetu" |

### Dinámica

| ✓ | Prioridad | Referencia | Para qué |
| --- | --- | --- | --- |
| [ ] | A | Una copia legible de la **tabla V** de Hestenes, Wells y Swackhamer (1992), *Force Concept Inventory*, TPT 30, 141–158 | Porcentajes por opción de cada pregunta del FCI. La copia que bajé salió ilegible al extraer el texto |
| [ ] | B | Halloun y Hestenes (1985), *Common sense concepts about motion*, AJP 53, 1056–1065 | Fuente original del 65 % → 44 % de "todo movimiento necesita fuerza" |
| [ ] | B | Clement (1982), *Students' preconceptions in introductory mechanics*, AJP 50(1), 66–71. DOI 10.1119/1.12989 | Moneda lanzada hacia arriba, con porcentajes antes y después |
| [ ] | C | Minstrell (1982), *Explaining the "at rest" condition of an object*, TPT 20, p. 10 | La mesa que "no empuja" |
| [ ] | C | McCloskey, Caramazza y Green (1980), *Curvilinear motion in the absence of external forces*, Science 210, 1139–1141 | Fuerza centrífuga y trayectorias curvas |
| [ ] | C | Rosengrant, Van Heuvelen y Etkina (2009), *Do students use and understand free-body diagrams?*, Physical Review ST PER 5, 010108 | Si dibujar el diagrama de cuerpo libre mejora el resultado. Es de acceso abierto en la web de APS |

### Otros temas de física (informes de noviembre de 2026)

Artículos que las investigaciones de estática, ondas, termodinámica y electricidad no pudieron abrir. Casi todos están en revistas en español o en el American Journal of Physics.

| ✓ | Prioridad | Referencia | Para qué |
| --- | --- | --- | --- |
| [ ] | A | McDermott y Shaffer (1992), *Research as a guide for curriculum development: An example from introductory electricity. Part I*, AJP 60(11) | Fuente original de los errores de circuitos; hoy la cifra sale de diapositivas |
| [ ] | A | Maloney, O'Kuma, Hieggelke y Van Heuvelen (2001), *Surveying students' conceptual knowledge of electricity and magnetism* (CSEM), AJP 69(S1) | Porcentajes por pregunta en magnetismo e inducción |
| [ ] | B | Ortiz, Heron y Shaffer (2005), *Student understanding of static equilibrium*, AJP 73(6) | Confirmar el 80 % del bate, que hoy sale de un póster |
| [ ] | B | Lindsey, Heron y Shaffer (2009, 2012), sobre trabajo y energía, AJP | Errores de sistema en energía |
| [ ] | B | Loverude, Kautz y Heron (2002, 2003) y Kautz y otros (2005, partes I y II), AJP | Primera ley, Arquímedes y gases ideales; hoy se usa la tesis de Loverude |
| [ ] | B | Yeo y Zadnik (2001), *Introductory thermal concept evaluation*, The Physics Teacher 39 | Calor y temperatura |
| [ ] | B | Bravo, Pesa y Caballero (2009) sobre sonido, y los artículos de Guisasola y otros sobre inducción, en *Enseñanza de las Ciencias* | Datos en español. El sitio de la revista falló desde aquí |
| [ ] | B | Barniol y Zavala (2016), Physical Review PER, y su versión en español en la Revista Brasileira de Ensino de Física (2019) | Ondas, con alumnos mexicanos |
| [ ] | C | Gutiérrez-Berraondo y otros (2018), Revista Brasileira de Ensino de Física | Energía en sistemas, en español |
| [ ] | C | "Una escoba para barrer algunos preconceptos", Revista Cubana de Física (2007) | Centro de gravedad |
| [ ] | C | Leinonen y otros (2013), sobre termodinámica | No se pudo descargar |

### Química (informes de noviembre de 2026)

| ✓ | Prioridad | Referencia | Para qué |
| --- | --- | --- | --- |
| [ ] | A | Kind (2004), *Beyond appearances: students' misconceptions about basic chemical ideas*, Royal Society of Chemistry | Es la revisión de referencia de toda la química escolar. Es gratuita, pero el sitio de la RSC pidió verificación humana; desde tu navegador debería bajar |
| [ ] | A | Furió, Azcona y Guisasola (2002, 2006) sobre el concepto de mol, *Enseñanza de las Ciencias* | Datos en español sobre mol y cantidad de sustancia |
| [ ] | A | Peterson, Treagust y Garnett (1989), test de enlace y estructura, Journal of Research in Science Teaching 26(4) | Porcentajes por pregunta de enlace, geometría y polaridad |
| [ ] | B | Mulford y Robinson (2002), *An inventory for alternate conceptions among first-semester general chemistry students*, J. Chem. Educ. 79(6) | Porcentajes por opción del inventario de química |
| [ ] | B | Sanger y Greenbowe (1997), sobre celdas electroquímicas, Journal of Research in Science Teaching 34(4) y J. Chem. Educ. 74(7) | Electrones en el puente salino y la disolución |
| [ ] | B | Demerouti, Kousathana y Tsaparlis (2004), sobre ácidos y bases, The Chemical Educator | Ácidos y bases con porcentajes |
| [ ] | B | Quílez y Solaz (1995), Quílez (2004, 2006), sobre Le Chatelier | Equilibrio, en español |
| [ ] | B | Nurrenbern y Pickering (1987), J. Chem. Educ. 64(6); Sanger (2005), J. Chem. Educ. 82(1) | Fuentes originales de "calcular no es entender" en estequiometría |
| [ ] | C | Riboldi, Pliego y Odetti (2004), sobre enlace químico, *Enseñanza de las Ciencias* | Enlace, en español |
| [ ] | C | Artículos de *Educación Química* (UNAM) sobre reactivo limitante y soluciones | El sitio dio error 503 o pidió verificación |
| [ ] | C | Schmidt, Kaufmann y Treagust (2009), sobre ebullición y enlaces, Chemistry Education Research and Practice | Porcentaje de "hervir rompe enlaces covalentes" |

### Matemática: álgebra y funciones (informe del 6 de noviembre de 2026)

En esta sesión no se pudo abrir ningún PDF; las cifras del informe vienen de resúmenes. Ver `docs/investigacion/algebra-funciones-ideas-erroneas.md`.

| ✓ | Prioridad | Referencia | Para qué |
| --- | --- | --- | --- |
| [ ] | A | Clement (1982), *Algebra word problem solutions*, JRME 13(1), 16–30; y Clement, Lochhead y Monk (1981), American Mathematical Monthly 88 | Confirmar el 63 % de aciertos y el reparto de errores en el problema de estudiantes y profesores (AL1, AL2) |
| [ ] | A | Hart (ed.), *Children's understanding of mathematics: 11–16* (1981), capítulo de álgebra de Küchemann; y Küchemann (1978), Mathematics in School 7(4) | Porcentajes por ítem y por edad de los usos de la letra (AL3 a AL5) |
| [ ] | A | Knuth, Stephens, McNeil y Alibali (2006), JRME 37(4); Knuth y otros (2008), MTMS 13(9); Alibali y otros (2007), Mathematical Thinking and Learning 9(3) | Confirmar 29 % y 46 % de definición relacional del signo igual (AL6) |
| [ ] | A | *Errores algebraicos más comunes en los estudiantes de primer ingreso*, Educación y Humanismo (2015), Universidad de Guadalajara; Gamboa, Castillo e Hidalgo (2019), Actualidades Investigativas en Educación 19(1); Aguerrea, Solís y Huincahue (2022), Uniciencia 36(1) | Datos por ítem de ingresantes latinoamericanos (binomio, raíces, logaritmos, cuadráticas) |
| [ ] | A | Agencia de Calidad de la Educación (Chile), *Aprendiendo de los errores* (SIMCE) | Porcentaje del error del binomio al cuadrado (AL8) |
| [ ] | A | Tesis de la Universidad de Piura sobre errores algebraicos en 2.° y 4.° de secundaria (repositorio ALICIA de CONCYTEC) | Únicos datos peruanos encontrados |
| [ ] | B | Almog e Ilany (2012), ESM 81(3); Tsamir y Almog (2001), IJMEST 32(4); Blanco y Garrote (2007), EJMSTE 3(3) | Porcentajes en inecuaciones y valor absoluto (AL19 a AL23) |
| [ ] | B | Vinner y Dreyfus (1989), JRME 20(4); Breidenbach y otros (1992), ESM 23; Carlson (1998), RCME III | Porcentajes sobre el concepto de función y covariación (AL26, AL30) |
| [ ] | B | Zazkis, Liljedahl y Gadowsky (2003), Journal of Mathematical Behavior 22(4) | Desplazamientos de gráficas (AL28) |
| [ ] | B | Clement (1985), *Misconceptions in graphing*, PME 9; Leinhardt, Zaslavsky y Stein (1990), Review of Educational Research 60(1) | Confirmar "hasta la mitad" en pendiente y altura (AL25) |
| [ ] | B | Ganesan y Dindyal (2014), MERGA 37; Chua y Wood (2005), The Mathematics Educator 8(2) | Porcentajes de errores en logaritmos (AL10, AL31) |
| [ ] | B | Ochoviet y Oktaç (2009), The Mathematics Enthusiast 6(1); Ochoviet (2009), tesis CICATA-IPN; Vaiyavutjamai y Clements (2006), MERJ 18(1) | Producto cero, cuadráticas y sistemas (AL14, AL17) |
| [ ] | C | Socas (1997), en Rico (coord.), Horsori; Ruano, Socas y Palarea (2008), PNA 2(2); Ursini y Trigueros (1997, 2003) | Marcos en español (España y México) para clasificar los errores |
| [ ] | C | Matz (1982), en Sleeman y Brown (eds.); Booth (1984), NFER-Nelson; Kirshner y Awtry (2004), JRME 35(4); Kieran (1981, 1992, 2007) | Clásicos de la linealidad indebida y del signo igual |

### Trigonometría (informe del 6 de noviembre de 2026)

En esa sesión no abrió ninguna página de artículos; todo salió de resúmenes. Varios son de acceso abierto y deberían bajar desde un navegador.

| ✓ | Prioridad | Referencia | Para qué |
| --- | --- | --- | --- |
| [ ] | A | Tuna (2013), *A conceptual analysis of the knowledge of prospective mathematics teachers about degree and radian*, World Journal of Education 3(4). DOI 10.5430/wje.v3n4p1. Acceso abierto | Confirmar el ≈90 % que define mal el radián (TR2) |
| [ ] | A | Akkoç (2008), *Pre-service mathematics teachers' concept images of radian*, IJMEST 39(7), 857–878. Copia en la página de la autora (mimoza.marmara.edu.tr) | Conteos por ítem de "π es 180" y de entradas en grados (TR1, TR3) |
| [ ] | A | Martín-Fernández (2014), actas SEIEM XVIII, y Martín-Fernández, Ruiz-Hidalgo y Rico (2016), *Enseñanza de las Ciencias* 34(3). En Funes y en la web de la revista | A qué muestra corresponde el 56,10 % de "el seno es una longitud" (TR7) |
| [ ] | B | Weber (2005), *Students' understanding of trigonometric functions*, MERJ 17(3). ERIC EJ747914, acceso abierto | Cifras por curso (TR13) |
| [ ] | B | Brown (2005), tesis, Illinois State; Fi (2003), tesis, Universidad de Iowa | Signo de sen 210° (TR12) y definición del radián (TR2) |
| [ ] | B | Kendal y Stacey (1996), actas de MERGA, y (1997), *Vinculum* 34(1) | Cuánto pesa elegir mal la razón (TR9) |
| [ ] | B | Castro y Cárcamo, errores en ecuaciones trigonométricas, Bolema (SciELO Brasil); Torres-Corrales y Montiel-Espinosa (2021), *Educación Matemática* 33(3) | Las dos fuentes latinoamericanas (TR21, TR10, TR25) |
| [ ] | C | Moore (2013), ESM 83(2), y (2014), JRME 45(1); De Kee, Mura y Dionne (1996), FLM 16(2); Gür (2009), ERIC EJ860819 | Secuencia de "medir con arcos" y casos cualitativos |

### Matemática: aritmética y razonamiento matemático (informe del 6 de noviembre de 2026)

En esta sesión no se pudo abrir ningún PDF; las cifras del informe vienen de resúmenes. Ver `docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md`.

| ✓ | Prioridad | Referencia | Para qué |
| --- | --- | --- | --- |
| [ ] | A | Jacobs Danan y Gelman (2018), *The problem with percentages*, Phil. Trans. R. Soc. B 373 (acceso abierto en PMC5784045) | Confirmar el reparto de errores por tipo (sumar porcentajes, base equivocada) para la plantilla `porcentajes-sucesivos` (AR1 a AR4) |
| [ ] | A | Maz y Gutiérrez (2008), *Errores de los estudiantes de magisterio frente a situaciones que implican porcentajes* (acceso abierto en Helvia, Universidad de Córdoba) | Único dato en español sobre porcentajes (AR1, AR3) |
| [ ] | A | Navarro-Pelayo, Batanero y Godino (1996), Educación Matemática 8(1); Batanero, Navarro-Pelayo y Godino (1997), ESM 32; tesis de Roa (2000), Universidad de Granada (las tres en acceso abierto) | Confirmar 37,8 % (error de orden) y 66,6 % (enumeración sin sistema), y sacar el porcentaje del error de repetición (AR17 a AR19) |
| [ ] | A | Hart (ed.), *Children's understanding of mathematics: 11–16* (1981), capítulo de razón; Karplus, Karplus y Wollman (1974), School Science and Mathematics 74(6) | Porcentajes del Sr. Bajo y el Sr. Alto y de la respuesta aditiva por ítem (AR6) |
| [ ] | A | Van Dooren y otros (2005), Cognition and Instruction 23(1); De Bock, Verschaffel y Janssens (1998), ESM 35 | Porcentajes por grado de la ilusión de linealidad (AR7), base de la regla de tres inversa y del reparto |
| [ ] | B | Lecoutre (1992), ESM 23; Cañizares y Batanero (1998), ICOTS 5; Cardeñoso y otros (2017), AIEM | Confirmar el 51 % (dados) y el 25 %, y la cifra argentina del sesgo de equiprobabilidad (AR20) |
| [ ] | B | Resnick y otros (1989), JRME 20(1); Steinle y Stacey (1998), MERGA 21 | Confirmar el 40 % de la regla del número entero en decimales (AR11) |
| [ ] | B | Fischbein y Schnarch (1997), JRME 28(1) | Porcentajes por edad de representatividad y recencia (AR21, AR22) |
| [ ] | B | Pollatsek, Lima y Well (1981), ESM 12; estudio *Why is calculating the average speed difficult?* | Promedio ponderado y velocidad media (AR14, AR15) |
| [ ] | B | Informes de la Evaluación Censal de Estudiantes (Minedu, 2.º de secundaria) e ítems liberados de PISA para el Perú | Porcentajes por opción con alumnos peruanos en ítems de proporción y porcentaje |
| [ ] | C | Stacey (1989), ESM 20; Cerdán (2010), PNA 4(3) | Objeto entero en sucesiones (RM2) y catálogo español de errores de traducción (RM1) |

### Geometría (informe del 6 de noviembre de 2026)

En esta sesión no se pudo abrir ningún PDF; las cifras del informe vienen de resúmenes del buscador. Ver `docs/investigacion/geometria-ideas-erroneas.md`.

| ✓ | Prioridad | Referencia | Para qué |
| --- | --- | --- | --- |
| [ ] | A | De Bock, Van Dooren, Janssens y Verschaffel (2002), ESM 50 (copia en fisme.science.uu.nl); Van Dooren y otros (2008), *The linear imperative*, JRME 39(3) | Confirmar "más del 90 % y del 80 % responde 24 horas" y sacar los porcentajes de volumen (GE1 a GE3) |
| [ ] | A | Gutiérrez y Jaime (1999), J. Math. Teacher Education 2 (PDF en la página de Ángel Gutiérrez, uv.es) | Porcentajes de error al dibujar alturas en triángulos no prototípicos (GE7) |
| [ ] | A | Informes para docentes de la ECE 2016, 2018 y 2019, 2.º de secundaria (UMC del Minedu) | Porcentajes por opción en ítems peruanos de área, perímetro y figuras (GE4, GE5) |
| [ ] | A | D'Amore y Fandiño Pinilla (2007), Relime 10(1) (SciELO México) | Cifras de "más perímetro, más área" (GE5) |
| [ ] | B | Hershkowitz (1989), Focus on Learning Problems in Mathematics 11(1); Vinner y Hershkowitz (1980, 1983) | Fuente original del "menos del 30 %" y del efecto prototipo (GE7 a GE9) |
| [ ] | B | Ben-Chaim, Lappan y Houang (1985), ESM 16(4) | Porcentaje de cada tipo de error al contar cubitos (GE13) |
| [ ] | B | Informe de benchmarking de TIMSS 1999 y los ítems liberados de TIMSS 2011 (NCES) | Confirmar el 29 % del ítem de triángulos que cubren el rectángulo y buscar ítems de volumen y circunferencia (GE4, GE19, GE20) |
| [ ] | B | Aravena, Gutiérrez y Jaime (2016), Enseñanza de las Ciencias 34(1); Espinoza-Vergara y otros (2020), Enseñanza de las Ciencias 38(1) | Niveles de Van Hiele en Chile y uso del ángulo inscrito (GE10, GE12) |
| [ ] | B | Sánchez Sánchez (2016), tesis de la BUAP, y Sánchez y Caballero Juárez (repositorio Funes) | Ilusión de linealidad en alumnos mexicanos, en español (GE1, GE2) |
| [ ] | C | Modestou y Gagatsis (2007), Educational Psychology 27(1); Kospentaris, Spyrou y Lappas (2011), ESM 77 | Porcentajes por ítem de linealidad y de conservación del área (GE3, GE6) |
| [ ] | C | Clements y Battista (1992), capítulo "Geometry and spatial reasoning" del *Handbook* de Grouws (NCTM); Usiskin (1982), informe CDASSG | Marco general y niveles de Van Hiele en unos 2700 alumnos |

### Razonamiento verbal (informe del 6 de noviembre de 2026)

La red no dejó abrir los originales; las cifras del informe salen de resúmenes.

- Terao e Ishii (2020), distractores en preguntas de idea principal.
- Ludewig y otros (2023), inferencias en comprensión lectora.
- Zunino (2016), comprensión de conectores contracausales en español.
- Borzone (2005), referentes y cohesión en lectores hispanohablantes.
- Cain y Nash (2011), conectores y comprensión.
- NITE, informe e239 (analogías verbales en exámenes de admisión).
- Informes de la UMC (Minedu) para el docente de secundaria: resultados por tipo de pregunta en lectura.

## 3. Libros de consulta

Para diseñar plantillas y escribir problemas propios, no para copiar (ver "Uso de fuentes y derechos" en `docs/fundacional.md`).

| ✓ | Prioridad | Libro | Para qué |
| --- | --- | --- | --- |
| [ ] | B | Mayer, *Multimedia Learning*, 3.ª edición (2020), Cambridge University Press | Los principios de diseño del laboratorio salen de aquí; hoy solo leímos un resumen |
| [ ] | B | McDermott y el Physics Education Group, *Physics by Inquiry*, tomos I y II (1996), Wiley | Secuencias de enseñanza probadas para óptica, cinemática y circuitos |
| [ ] | B | Arons, *Teaching Introductory Physics* (1997), Wiley | Catálogo de dificultades por tema, escrito para profesores |
| [ ] | C | Knight, *Five Easy Lessons: Strategies for Successful Physics Teaching* (2002), Addison-Wesley | Errores típicos por capítulo de un curso de mecánica |
| [ ] | C | Un texto de química general con estequiometría y gases (Chang, Whitten o Brown) | Verificar fórmulas para las plantillas de química |
| [ ] | B | Estudios sobre cómo interpretan los escolares el condicional «si p, entonces q» (leído como conjunción o como bicondicional) | Pasar de hipótesis a datos las predicciones de `plantillas/logica/` (pedido de la rutina de aritmética, 7 nov 2026) |
| [ ] | B | Küchemann (1981), «Reflections and rotations», en Hart (ed.), *Children's Understanding of Mathematics: 11–16* (proyecto CSMS), John Murray | Errores de simetría con datos de escolares, para pasar a documentado las predicciones de `plantillas/simetria/` |
| [ ] | C | Manuales de academia (Lumbreras, cepres, separatas) que tengas a mano | Saber qué y cómo se pregunta en Perú. Solo para mapear temas y errores, nunca para copiar. También fija la jerarquía de Δ (disyunción exclusiva) en lógica |

## 4. Ya leídos completos (no hace falta conseguirlos)

Wörner y otros (2022); John, Molepo y Chirwa (2017); Singh y Schunn (2016); Handayani y Arifin (2021); Taşlıdere y Eryılmaz (2015); Horn y Mikelskis (2001); Beichner (1994); Thornton y Sokoloff (1998); Prescott y Mitchelmore (2005); Carrascosa, Gil Pérez y Valdés (2004); Castillo, Moscoso, Phan y Quiroz (2013); Mora y Herrera (2009); Bao, Hogg y Zollman (2002); Mahajan (2005). Los enlaces están en cada informe de `docs/investigacion/`.

## 5. Matemática avanzada (7 nov 2026, rutina de investigación de matemática)

Fuentes de [`docs/investigacion/matematica-avanzada-ideas-erroneas.md`](../docs/investigacion/matematica-avanzada-ideas-erroneas.md) que solo se vieron por resumen, fragmento o cita: la red de la sesión no dejó abrir ningún texto completo. Prioridad A: puede subir un código de hipótesis a parcial o de parcial a documentado. Guardar como `fuentes/libros/<primer-autor>-<año>-<tema>.pdf`.

### Cónicas

- **A** · Sudihartinih, E. y Purniati, T. (2020). Students' Mistakes and Misconceptions on the Subject of Conics. *International Journal of Education*, 12(2). DOI 10.17509/ije.v12i2.19130. https://ejournal.upi.edu/index.php/ije/article/download/19130/pdf (acceso abierto). Para ver las respuestas erróneas concretas y sus frecuencias en lado recto, asíntotas, focos de la hipérbola y ecuaciones en los dos ejes; puede subir CO2, CO7, CO21–CO23 y CO25–CO27 a parcial o documentado.
- **A** · Karapiçak, S. Tesis de maestría: «10. sınıf öğrencilerinin analitik geometride hata ve kavram yanılgılarının analizi». https://acikbilim.yok.gov.tr/handle/20.500.12812/381714 . Muestra de 2552 alumnos; si incluye la circunferencia, puede dar cifras para CO8, CO9 y CO10.
- **A** · Tesis de YÖK sobre imágenes de la hipérbola en 90 futuros profesores. https://acikbilim.yok.gov.tr/handle/20.500.12812/569819 . Dice que hay ideas erróneas «con sus causas»; puede tocar CO2, CO17, CO18 y CO21.
- **B** · Wright, V. (2013). Pre-service Teachers' Concept Image for Circle and Ellipse. MERGA 36, 682-689. https://acuresearchbank.acu.edu.au/download/6781c252d0976cee28a9cc03df6f21a0343bff7f01616513ac9e55fa6634e23d/146566/Wright_2013_Pre_service_teachers_concept_image.pdf (acceso abierto). Cifras sobre circunferencia como caso de elipse (CO20, CO34–CO37).
- **B** · Boubée, C., Rey, G. y Sastre Vázquez, P. (2018). Errores en situaciones de validación. https://funes.uniandes.edu.co/wp-content/uploads/tainacan-items/32454/1170868/Boubee2018Errores.pdf . Confirmar si los alumnos no consideran la parábola al deformar la elipse (CO31, CO32).
- **B** · Tesis PUCP sobre la elipse en 5.º de secundaria. https://tesis.pucp.edu.pe/bitstreams/7287a9be-1d91-4157-a1d8-3a68db59c7ca/download . Única fuente peruana de secundaria; ver si registra respuestas a la definición con dos focos.
- **B** · Estudio de la Universidad Pasundan sobre dificultades con la elipse. https://journal.unpas.ac.id/index.php/symmetry/article/view/27500 . Ver qué fórmula del lado recto usan (CO25–CO27).
- **C** · Tesis «11. Sınıf Öğrencilerinin Elips, Parabol ve Hiperbol Kavramlarını Oluşturma Sürecinin Araştırılması», Universidad de Trakya. https://dspace.trakya.edu.tr/xmlui/handle/trakya/5576 . Contexto de enseñanza con matemática realista.
- **C** · Revisión de tesis de la MEM-PUCP sobre cónicas (2014-2020). https://tesis.pucp.edu.pe/items/2a58f672-c577-492f-8fae-8d537edf0a35 . Mapa de qué se ha estudiado en el Perú.
- **C** · Rabanal (2003), Universidad Abierta de Filipinas, 16 estudiantes de ingeniería. https://repository.upou.edu.ph/items/3a01530c-8dbe-4efe-872e-3aadadf5773d .
- **C** · Tesis fenomenográfica de la UIN Sunan Gunung Djati, 105 estudiantes. https://digilib.uinsgd.ac.id/143082/66/02.%20ABSTRAK.pdf .
- **C** · González Gallegos, W. M. (2018). Tesis, Universidad de Cuenca. https://dspace-test.ucuenca.edu.ec/bitstream/123456789/30735/1/Tesis.pdf .
- **C** · Tesis de NTNU (Taiwán, 2011) sobre modelos mentales de parábola y elipse. https://etds.lib.ntnu.edu.tw/thesis/detail/6f1ba8ad2ff23de9c1792175bc12355c .

Para abrir las de prioridad A y B hay que permitir en la red de la sesión: ejournal.upi.edu, acikbilim.yok.gov.tr, acuresearchbank.acu.edu.au, funes.uniandes.edu.co, tesis.pucp.edu.pe y journal.unpas.ac.id.

### Coordenadas polares

| Referencia | Para qué | URL | Prioridad |
| --- | --- | --- | --- |
| Borji, V., Erfani, H. y Font, V. (2020). A combined application of APOS and OSA to explore undergraduate students' understanding of polar coordinates. *IJMEST* 51(3), 405–423. | Cifras por tarea: ver si alguna tarea trata r negativo, cuántos de los 34 fallan y qué hacen (¿ignoran el signo, reflejan?). Podría sumar respaldo a CP3 y llevar CP4, CP5 y CP7 a parcial | https://doi.org/10.1080/0020739X.2019.1578904 | A |
| Habre, S. (2017). Students' challenges with polar functions. *IJMEST* 48(1), 48–66. | Muestra, tareas y respuestas con r negativo; quizás curvas tipo r = a cos θ o rosas (CP15 a CP24) | https://laur.lau.edu.lb:8443/xmlui/handle/10725/4239 ; https://doi.org/10.1080/0020739X.2016.1220027 | A |
| Montiel, M., Vidakovic, D. y Kabael, T. (2008). Relationship between students' understanding of functions in Cartesian and polar coordinate systems. *Investigations in Mathematics Learning* 1(2), 52–70. | Qué ideas cartesianas se trasladan; posible respaldo para CP27, CP25 y CP15 | https://doi.org/10.1080/24727466.2008.11790283 | A |
| Moore, K. C., Paoletti, T. y Musgrave, S. (2014). Complexities in students' construction of the polar coordinate system. *JMB* 36, 135–149. | Medida del ángulo y referencia (CP9, CP2); traslado cartesiano (CP27) | https://digitalcommons.montclair.edu/mathsci-facpubs/57 | B |
| Kabael, T. (2015). Analysis II students' construction of polar functions. *Necatibey Eğitim Fakültesi Elektronik Fen ve Matematik Eğitimi Dergisi*. | Contraste con Montiel y otros; posibles errores de graficar | https://dergipark.org.tr/en/download/article-file/39920 | B |
| Aznar, M. A., Distéfano, M. L., Prieto, G. y Moler, E. (2010). Análisis de errores en la conversión de representaciones de números complejos. | Ítems de módulo y argumento: posible dato para CP10, CP12 y CP13 en la forma polar del complejo | https://funes.uniandes.edu.co/wp-content/uploads/tainacan-items/32454/1181282/Aznar2010Analisis.pdf | A |
| Distéfano, M. L., Aznar, M. A. y Pochulu, M. (2012). Errores asociados a la representación geométrica-vectorial de números complejos. *Unión* 30, 61–80. | Igual que la anterior (argumento y cuadrante) | https://funes.uniandes.edu.co/wp-content/uploads/tainacan-items/32454/1159053/Dist25C325A9fano2012Errores.pdf | A |
| Artículo de *REAMEC* 3(1) (2015) sobre dificultades en coordenadas polares en cálculo de varias variables (UANL); autores por confirmar. | Confirmar autores, a qué categoría va el 56 % y si hay ítems de graficar o convertir | https://periodicoscientificos.ufmt.br/ojs/index.php/reamec/article/download/5306/3501/16900 | B |
| Montiel, M., Wilhelmi, M., Vidakovic, D. y Elstak, I. (2009). *ESM* 72(2), 139–160. | Respuestas de alumnos en polares, si las reporta | https://doi.org/10.1007/s10649-009-9184-2 | C |
| Sayre, E. C. y Wittmann, M. C. (2008). *Phys. Rev. ST PER* 4, 020105 (acceso abierto). | Detalles de cómo deducen x = r cos θ (CP14, TR11) | https://doi.org/10.1103/PhysRevSTPER.4.020105 | C |
| Owusu, Bonyah y Arthur (2023), *Cogent Education*; Zengin y Tatar (2015), *IJMEST*; Alabdulaziz, Aldossary, Alyahya y Althubiti (2021), *Education and Information Technologies* 26, 2685–2713, DOI 10.1007/s10639-020-10371-5 (en línea en noviembre de 2020; alumnas de 3.º de secundaria de Arabia Saudita, unidad de polares y complejos; el total de 60 no está confirmado, solo se vio «30 en el grupo tradicional») | Ver si sus pruebas listan errores por ítem; el de Alabdulaziz es el único escolar | https://doi.org/10.1080/2331186X.2023.2177050 ; https://doi.org/10.1080/0020739X.2014.904529 ; https://doi.org/10.1007/s10639-020-10371-5 | C |

### Matrices y determinantes

| Referencia | Para qué | URL | Prioridad |
| --- | --- | --- | --- |
| Aygör y Özdağ (2012), *Procedia – Social and Behavioral Sciences* 46, 2989–2994 (acceso abierto en ScienceDirect) | Confirmar MT4 con porcentaje; ver si reporta det(A + B) (MT3), el intercambio de filas y otros errores | https://doi.org/10.1016/j.sbspro.2012.05.602 | A |
| Kazunga y Bansilal (2018), «Misconceptions about determinants», Springer | Lista de errores con conteos sobre 116 profesores: det de la inversa, transpuesta (MT25), propiedades (MT3, MT26), det(kA) (MT4, MT24); confirmar la cifra de 34 | https://doi.org/10.1007/978-3-319-66811-6_6 | A |
| Kazunga y Bansilal (2017), *Journal of Mathematical Behavior* | Qué respuestas dieron en el producto fila × columna (MT15, MT16) y en el producto en general (MT1, MT2, MT14) | (buscar por título en ScienceDirect) | A |
| Kazunga y Bansilal (2020), *Educational Studies in Mathematics* 103(3) | Errores en la inversa (MT7, MT13, MT22, MT23) | https://doi.org/10.1007/s10649-020-09935-6 | B |
| Kartini y Alawiyah (2023), *Mosharafa* 12(1) (acceso abierto) | Porcentajes por tipo de error en el producto de matrices, alumnos de secundaria (MT1, MT15, MT16) | https://doi.org/10.31980/mosharafa.v12i1.1811 | B |
| Estudios indonesios de clase XI (Anggriani en *JUDIKA*, *Proximal*, Khairani y Kartini 2021 en *Mosharafa*) | Ver si traen ejemplos de respuestas erróneas concretas en determinante e inversa (MT5, MT18, MT19, MT7) | https://journal.ipm2kpe.or.id/index.php/JUDIKA/article/view/19778 ; https://e-journal.my.id/proximal/article/view/2136 | B |
| Trabajo del proyecto IOLA sobre el determinante (NSF PAR 10566425 y 10566423) | Ideas de los alumnos sobre el determinante como área con signo (MT20) y revisión de la poca literatura que hay | https://par.nsf.gov/servlets/purl/10566425 | B |
| Kinanti (2024), tesis, Universitas Jember | Tipos de error al aplicar Cramer con Sarrus (MT6, MT27 a MT31) | https://repository.unej.ac.id/handle/123456789/119707 | C |
| Tesis de la PUCP sobre errores en sistemas de ecuaciones lineales en ingeniería (clasificación de Socas) | Único antecedente peruano cercano; ver si toca Cramer o la inversa | https://repositorio.pucp.edu.pe/items/c3fe64ad-48c2-4d2f-9aea-b12fabb63dfd | C |
| Stewart, Andrews-Larson, Berman y Zandieh (eds., 2018), *Challenges and Strategies in Teaching Linear Algebra*, Springer (libro completo) | Otros capítulos sobre el producto de matrices (Figueroa, Possani y Trigueros) y las transformaciones (MT17, MT33, MT34) | https://doi.org/10.1007/978-3-319-66811-6 | C |
| Dorier (ed., 2000), *On the Teaching of Linear Algebra*, Kluwer | Marco general (obstáculo del formalismo, modos de descripción de Hillel); no se espera que dé cifras para MT | https://doi.org/10.1007/0-306-47224-4 | C |

### Binomio de Newton

| Referencia | Para qué | URL | Prioridad |
| --- | --- | --- | --- |
| Batanero, Navarro-Pelayo y Godino (1997), ESM 32, 181–199 | Tabla de frecuencias del error de orden, de repetición y de operación por problema y por grupo; pasar BN12 (y quizá BN13) a documentado | https://www.ugr.es/~batanero/pages/ARTICULOS/Implicitmodel.htm (también hay PDF en la misma carpeta, según el informe de aritmética) | A |
| Navarro-Pelayo, Batanero y Godino (1996), Educación Matemática 8(1) | Versión en español con los mismos datos; confirmar el 37,8 % y el 66,6 % | https://funes.uniandes.edu.co/wp-content/uploads/tainacan-items/32454/1141903/Razonamiento1996Navarro.pdf | A |
| Roa (2000), tesis, Universidad de Granada; Roa, Batanero y Godino (2003), Educación Matemática | Porcentajes de error en universitarios (91 en el artículo, 120 en la ponencia del SEIEM de 2001) | https://dialnet.unirioja.es/descarga/articulo/617785.pdf | A |
| Lecoutre (1992), *Cognitive models and problem spaces in "purely random" situations*, ESM 23, 557–568 | Proporción de equiprobabilidad leída en el texto completo, para BN21 | https://doi.org/10.1007/BF00540060 | B |
| Begué, Batanero, Gea y Díaz-Levicoy (2020), Tangram 3(2), 27–50 | Frecuencia del sesgo de equiprobabilidad en la binomial: principal candidato para documentar BN21 | https://zaguan.unizar.es/record/121598/files/texto_completo.pdf | A |
| Eizenberg y Zaslavsky (2004), MTL 6(1) | Confirmar en la p. 31 el 40 % (43 de 108) y los errores conceptuales | https://doi.org/10.1207/s15327833mtl0601_2 | B |
| Lockwood y Gibson (2016), ESM 91 | Cifras de acierto con y sin listado; respaldo del diseño de la escena | https://par.nsf.gov//servlets/purl/10099133 | B |
| Fischbein y Gazit (1988), *The combinatorial solving capacity in children and adolescents*, ZDM 20(5) | Acierto en combinaciones contra variaciones después de enseñar | (por buscar) | B |
| Tatira (2021), EURASIA 17(12) | Único estudio empírico sobre el desarrollo binomial; ver si reporta errores de coeficiente o signo que se traspasen a n natural | https://www.ejmste.com/download/mathematics-education-students-understanding-of-binomial-series-expansion-based-on-the-apos-theory-11287.pdf | B |
| Informes de examinadores de Edexcel, AQA, OCR y Cambridge International (Additional Mathematics 0606, 9709) | Suelen decir qué fracción de candidatos falló una pregunta de binomio; es lo más cercano a un dato para BN2, BN4 y BN8 | Sitios de cada examinador (Examiner reports) | A |
| Tarlow (2011), *Pizzas, towers, and binomials*, en Maher, Powell y Uptegrove (eds.), *Combinatorics and Reasoning*, Springer | Cómo alumnos de 10.º grado conectan torres, Pascal y coeficientes; ideas para la escena, no cifras | https://rd.springer.com/chapter/10.1007/978-94-007-0615-6_11 | C |
| Tesis peruanas o de pregrado sobre el binomio de Newton (UNMSM, UNI, PUCP, UNA Puno, en ALICIA o RENATI) | Primer dato local, si existe | https://alicia.concytec.gob.pe | B |
| Datos del propio lanzamiento (eventos de predicción de la escena) | Única vía realista para confirmar BN1 a BN27 | — | A |

### Números complejos

| Referencia | Para qué | URL | Prioridad |
| --- | --- | --- | --- |
| Turanlı, Keçeli y Türker (2007), *BAÜ FBE Dergisi* 9(2), 135–149, escolares turcos de 2.º de secundaria | Es la fuente de secundaria más cercana (tamaño de muestra por confirmar); el texto completo puede traer porcentajes por ítem de conjugado, raíces de negativos (CX28) y operaciones (CX7, CX12–CX16) | https://dergipark.org.tr/en/download/article-file/231670 | A |
| Keçeli y Turanlı (2013), universitarios | Lista de errores comunes; ver si trae i² = 1 o √(−a)·√(−b) con cifra | https://dergipark.org.tr/en/download/article-file/87135 | A |
| Lukumon y otros (2026), 18 alumnos nigerianos | Ver qué error exacto cometen en De Moivre (CX30, CX31, AL11), conjugado y cociente | https://journals.iuiu.ac.ug/index.php/ije/article/download/1210/851/2650 | A |
| Smith, Zwolak y Manogue (2019), acceso abierto | Confirmar CX17 y CX18 con conteos; muestra exacta | https://doi.org/10.1103/PhysRevPhysEducRes.15.010138 | A |
| Distéfano, Aznar y Pochulu (2012); Aznar y otros (2010); Andino y otros (2012), Argentina | Errores de universitarios hispanohablantes en módulo, argumento, polar y binómica; quizá con frecuencias | https://funes.uniandes.edu.co/wp-content/uploads/tainacan-items/32454/1159053/Dist25C325A9fano2012Errores.pdf · …/1181282/Aznar2010Analisis.pdf · …/1167354/Andino2012Numeros.pdf | A |
| Seloane, Ramaila y Ndlovu (2025) | Frecuencias por tipo de error antes y después | https://doi.org/10.4102/pythagoras.v46i1.825 | B |
| Panaoura y otros (2006), 95 escolares griegos | Ítems y porcentajes de aciertos por registro | https://doi.org/10.1080/00207390600712281 | B |
| Nordlander y Nordlander (2012) | Las cuatro categorías y las concepciones erróneas listadas (CX29) | IJMEST 43 (número y páginas por confirmar; Taylor & Francis) | B |
| Chin y Jiew (2020), *The Mathematics Enthusiast* 17(1), 2 universitarios | Estudio empírico sobre i = √(−1) (indicio para CX28) | https://scholarworks.umt.edu/tme/vol17/iss1/11 | B |
| Karaaslan, tesis «Karmaşık sayılar konusundaki kavram yanılgıları ve hataları» (Hacettepe) | Posible desglose por error | https://openaccess.hacettepe.edu.tr/handle/11655/19755 | B |
| Karakok, Soto-Johnson y Dyben (2015) | Producto como giro en profesores; solo 3 casos | https://doi.org/10.1007/s10857-014-9288-1 | C |
| Conner, Rasmussen, Zandieh y Smith | Multiplicar por −1 como giro; confirmar año y sede | https://www.academia.edu/26387792 | C |
| Bustamante (2000), tesis PUCP sobre enfoques para presentar los complejos | Única fuente peruana hallada; es sobre enseñanza, no conteo de errores | Repositorio PUCP (no ubicado) | C |
| Tirosh y Almog (1989) y Danenhower (2000) | Citadas en el pedido; no se pudo confirmar que existan con esos datos | — | C |

Hosts que habría que permitir para leer los textos completos: funes.uniandes.edu.co, dergipark.org.tr, journals.iuiu.ac.ug, link.aps.org, pythagoras.org.za.

### Geometría del espacio

| Referencia | Para qué | URL | Prioridad |
| --- | --- | --- | --- |
| Kondo, Fujita, Kunimune, Jones y Kumakura (2014), PME 38, vol. 4, 25–32 | Confirmar el total de respuestas del ángulo BGD, las cuentas de 60°, 45° y 22,5° y la muestra; pasaría `anguloEnVertice.angulo.recto` a documentado | https://eprints.soton.ac.uk/445744 | A |
| Kondo, Fujita, Kunimune y Jones (2013), PME 37 | Niveles y la respuesta de 90° por la red | https://eprints.soton.ac.uk/445811/1/Kondo_etc_PME37_2013.pdf | A |
| Fujita y otros (2017), *Journal of Mathematical Behavior*, representaciones del cubo | Porcentajes por respuesta en tareas de ángulos y propiedades del cubo (7.° a 9.° grado) | https://ore.exeter.ac.uk/repository/handle/10871/26954 | A |
| Fujita y otros (2020), *MERJ* 32(2) (acceso abierto) | Tareas con diagramas engañosos en 1357 alumnos; posible cifra para las claves `dibujo` | https://eprints.soton.ac.uk/441656/1/Fujita_etc_spatial_reasoning_skills_2D_3D_2020.pdf | A |
| Götte (2019), tesis de maestría, UNL | Leer los ejemplos de la categoría «analogías» (perpendicularidad recta-plano, paralelismo, cruzadas); si describen «basta una recta» o «no se cortan, entonces son paralelas», `bastaUna` y `paralelas` pasarían a parciales | https://bibliotecavirtual.unl.edu.ar:8443/bitstream/handle/11185/5808/Tesis.pdf | A |
| Widder, Berman y Koichu (2019), JRME 50(5), y su informe PME-NA | Porcentajes de comprensión por boceto del cubo; información engañosa del dibujo | https://nctm.org/Publications/Journal-for-Research-in-Mathematics-Education/2019/Vol50/Issue5/An-A-Priori-Measure-of-Visual-Difficulty-of-2-D-Sketches-Depicting-3-D-Objects | B |
| Parzysz (1988), ESM 19, 79–92 | Texto original de «saber contra ver» | DOI 10.1007/BF00428386 | B |
| Götte y Mántica (2012, RevEM; 2021, UNIÓN) | Ejemplos de errores de perpendicularidad recta-plano | https://dialnet.unirioja.es/descarga/articulo/8833045.pdf ; https://union.fespm.es/index.php/UNION/article/view/187 | B |
| Pittalis y Christou (2010), ESM 75(2) | Tareas de «propiedades matemáticas» de sólidos con porcentaje de acierto | DOI 10.1007/s10649-010-9251-8 | C |
| Estudios indonesios de *dimensi tiga* (Ridha y otros 2023 en *Aksioma*; Asri y otros 2018; Al-Khwarizmi) | Tienen tablas por ítem en distancia y ángulo recta-plano en el cubo, el mismo tipo de problema de academia | https://jurnal.unigal.ac.id/jwp/article/download/4670/4140 ; https://ejournal.iainpalopo.ac.id/index.php/al-khwarizmi/article/download/1177/1159/4610 | C |
| TIMSS Advanced 2008, apéndice de ítems | Buscar ítems liberados de ángulo recta-plano o diedro con porcentaje por opción | https://elvis.bc.edu/timss_advanced/downloads/T08_TR_AppendixD.pdf | C |

Para abrirlas hace falta permitir en la red de la sesión, como mínimo: eprints.soton.ac.uk, ore.exeter.ac.uk, bibliotecavirtual.unl.edu.ar, link.springer.com, doaj.org y funes.uniandes.edu.co. Con las cuatro de prioridad A se podría pasar a documentado el ángulo del cubo y, quizá, las claves `dibujo`. Para el resto, lo más realista sigue siendo lo que propone el informe de geometría: preguntas abiertas en el colegio piloto y distractores sacados de esas respuestas.

### Conteo de figuras

| Referencia | Para qué | URL | Prioridad |
| --- | --- | --- | --- |
| Battista y Clements (1996), JRME 27(3), 258–292 | Confirmar 23 % y 63 % (no confirmados), el tamaño de la muestra y la frecuencia de cada estrategia (solo visibles, caras, doble cuenta de aristas); es lo que puede subir `pila.*` a documentado | https://doi.org/10.5951/jresematheduc.27.3.0258 · https://www.researchgate.net/publication/343754592 | A |
| Ben-Chaim, Lappan y Houang (1985), ESM 16(4), 389–409 | Frecuencia de cada uno de los cuatro errores y la muestra; asignar a cada opción los ≈17, 22, 8 y 8 % y confirmar los aciertos de ≈25 a 50 % | https://doi.org/10.1007/BF00417194 | A |
| Olkun y Knaupp (1999), ERIC ED428954 | Cifras de cubos visibles y caras visibles en escolares | https://files.eric.ed.gov/fulltext/ED428954.pdf | B |
| Tekin (CIMT) y el estudio turco de 6.º grado (ERIC EJ1013939) | Porcentajes de estrategias al contar cubos en 6.º a 8.º | https://www.cimt.org.uk/journal/tekin2.pdf · https://files.eric.ed.gov/fulltext/EJ1013939.pdf | B |
| Battista y otros (1998), JRME 29(5), 503–532 | Niveles de estructuración de cuadrículas; ver si hay tareas con cuadrados de varios tamaños | https://doi.org/10.5951/jresematheduc.29.5.0503 | B |
| Finesilver (2017), estructuración y errores con arreglos 3D en alumnos con necesidades especiales | Catálogo de errores de conteo de cubos con frecuencias | https://kclpure.kcl.ac.uk/ws/files/67257027/Finesilver_2017_3DArrays_MTL_acceptedauthormanuscript.pdf | B |
| Fujita y Jones (2007) y Fujita (2012) | Confirmar el 13 % de 158 futuros profesores que aceptan el cuadrado como rectángulo (`rectangulosCuadricula.sinCuadrados`) | https://eprints.soton.ac.uk/49731/1/Fujita_Jones_RME_vol9_2007.pdf | B |
| Navarro-Pelayo, Batanero y Godino (1996) y Roa (2000) | Confirmar el 37,8 % del error de orden (ya pendiente en AR17) | http://www.revista-educacion-matematica.org.mx/descargas/Vol8/1/05Navarro.pdf | B |
| Ítems liberados de TIMSS (4.º y 8.º) con cubos ocultos | Porcentaje por opción de un ítem real de contar cubos | https://webarchive.library.unt.edu/web/20130318101826/http:/nces.ed.gov/timss/pdf/TIMSS8_Math_ConceptsItems.pdf | C |
| Una tesis o informe peruano sobre conteo de figuras (repositorios PUCP, UNMSM, UNE, UCV) o resultados de la ECE con cubos | Dato local; hoy no existe ninguno encontrado | — | C |

**Para completar en una tarde:** permitir en la red de la sesión `doi.org`, `jstor.org`, `link.springer.com`, `researchgate.net`, `files.eric.ed.gov` y `cimt.org.uk`, y leer las dos fuentes de prioridad A.
