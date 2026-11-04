# Fuentes por conseguir

4 de noviembre de 2026 · Lista para Gerson

Son los libros, tesis y artículos que la investigación de `docs/investigacion/` cita sin haberlos leído completos: los leí a través de resúmenes o de otros autores, o no se pudieron descargar. Con el texto completo se pueden confirmar porcentajes y completar las tablas de ideas erróneas.

**Cómo pasármelos.** Pon cada PDF en la carpeta indicada, con el nombre sugerido. Los PDFs no se suben a GitHub (`.gitignore` excluye `fuentes/**/*.pdf`), así que en cada sesión nueva hay que volver a ponerlos, o pasármelos directamente en el chat como hiciste con el zip. Marca la casilla cuando lo consigas.

Prioridad: **A** cambia una tabla o una decisión; **B** confirma un dato que ya está, con otra fuente; **C** es contexto.

## 1. Lo más útil

| ✓ | Prioridad | Qué | Para qué | Dónde está | Guardar como |
| --- | --- | --- | --- | --- | --- |
| [ ] | A | **Prospectos y temarios de admisión** de la UNI, San Marcos, UNA Puno, UNSA y UNSAAC (los más recientes) | Fijar la taxonomía (tarea 2 de `CLAUDE.md`). Sin ellos, la taxonomía es una propuesta | Se compran o se descargan en cada universidad. El de física de la UNSAAC estaba en `ccomputo.unsaac.edu.pe/admision/files/temario/fisicaa.pdf`, pero el servidor no respondió | `fuentes/prospectos/<universidad>-<año>.pdf` |
| [ ] | A | **Exámenes pasados de la UNA Puno** (y de las otras, si hay) | Clasificar 50 problemas reales (tarea 3) | Universidades, academias, solucionarios | `fuentes/examenes/<universidad>-<año>-<fase>.pdf` |
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

## 3. Libros de consulta

Para diseñar plantillas y escribir problemas propios, no para copiar (ver "Uso de fuentes y derechos" en `docs/fundacional.md`).

| ✓ | Prioridad | Libro | Para qué |
| --- | --- | --- | --- |
| [ ] | B | Mayer, *Multimedia Learning*, 3.ª edición (2020), Cambridge University Press | Los principios de diseño del laboratorio salen de aquí; hoy solo leímos un resumen |
| [ ] | B | McDermott y el Physics Education Group, *Physics by Inquiry*, tomos I y II (1996), Wiley | Secuencias de enseñanza probadas para óptica, cinemática y circuitos |
| [ ] | B | Arons, *Teaching Introductory Physics* (1997), Wiley | Catálogo de dificultades por tema, escrito para profesores |
| [ ] | C | Knight, *Five Easy Lessons: Strategies for Successful Physics Teaching* (2002), Addison-Wesley | Errores típicos por capítulo de un curso de mecánica |
| [ ] | C | Un texto de química general con estequiometría y gases (Chang, Whitten o Brown) | Verificar fórmulas para las plantillas de química |
| [ ] | C | Manuales de academia (Lumbreras, cepres, separatas) que tengas a mano | Saber qué y cómo se pregunta en Perú. Solo para mapear temas y errores, nunca para copiar |

## 4. Ya leídos completos (no hace falta conseguirlos)

Wörner y otros (2022); John, Molepo y Chirwa (2017); Singh y Schunn (2016); Handayani y Arifin (2021); Taşlıdere y Eryılmaz (2015); Horn y Mikelskis (2001); Beichner (1994); Thornton y Sokoloff (1998); Prescott y Mitchelmore (2005); Carrascosa, Gil Pérez y Valdés (2004); Castillo, Moscoso, Phan y Quiroz (2013); Mora y Herrera (2009); Bao, Hogg y Zollman (2002); Mahajan (2005). Los enlaces están en cada informe de `docs/investigacion/`.
