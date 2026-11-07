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
