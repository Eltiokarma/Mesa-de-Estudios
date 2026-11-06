# Ideas erróneas en cinética química

6 de noviembre de 2026 · Tarea 4 de `CLAUDE.md`. Cubre velocidad de reacción, teoría de colisiones, energía de activación y perfil de energía, factores (concentración, temperatura, superficie y catalizador), ley de velocidad, orden de reacción y vida media. En el sílabo CEPRE-UNI la velocidad de reacción entra junto con equilibrio químico (ver [taxonomía](../../docs/taxonomia-uni-2026.md) y el informe de [equilibrio, ácidos y electroquímica](../../docs/investigacion/equilibrio-acidos-electroquimica-ideas-erroneas.md), que ya trae el error "el catalizador da más producto", EQ12).

**Advertencia antes de leer.** En esta sesión **no pude abrir ningún artículo completo**. La red del entorno solo deja pasar el buscador: las descargas directas (curl) a ijpce.org, eduhk.hk, dergipark.org.tr, open.metu.edu.tr, core.ac.uk y atlantis-press.com fueron rechazadas por la política del proxy (403 al CONNECT), y WebFetch no resolvió ijpce.org ni www.eduhk.hk. No es una verificación anti-bots: es la configuración de red de la sesión. Por eso **ninguna cifra de este informe está leída en la fuente original**. Las pocas cifras que aparecen salieron del texto que devolvió el buscador, casi siempre de un artículo que cita a otro, y van marcadas "vía buscador, por verificar". No sirven todavía para escribir en una opción "lo cree el X %". Lo que sí queda firme es **qué ideas están documentadas y en qué estudio**, y el tamaño de las muestras.

## Resumen en siete líneas

1. **La cinética está menos estudiada que el equilibrio**, y casi todo viene de Turquía (Çakmakçı 2010, con 191 escolares y futuros profesores; Kolomuç y Tekin 2011, con 70 profesores; Kolomuç y Çalık 2012, con 70 profesores y 72 escolares de 11.º grado). Bain y Towns (2016) lo resumen en dos líneas de trabajo: ideas de los alumnos y propuestas de enseñanza.
2. **"Velocidad" se confunde con tiempo o con cantidad.** Un artículo que cita a Çakmakçı (2010) dice que el 33 % de los escolares cree que la velocidad es "el tiempo que tarda la reacción" (vía buscador, por verificar).
3. **Temperatura y energía de activación se mezclan.** Documentado: "al calentar baja la energía de activación", "calentar no acelera una reacción exotérmica" y "las exotérmicas tienen menor energía de activación" (Çakmakçı 2010; Kolomuç y Tekin 2011). Sin porcentajes leídos.
4. **El catalizador es el punto más débil.** Ideas documentadas: sube la energía de activación, cambia la energía cinética de las moléculas, no participa en la reacción. Según un estudio de 2024 que cita a Kolomuç y Çalık (2012), solo el 5 % de los alumnos explica bien cómo actúa (vía buscador, por verificar).
5. **Los profesores tienen los mismos errores que los alumnos.** Kolomuç y Çalık (2012) concluyen que los profesores parecen ser la fuente principal; Kolomuç y Tekin (2011) documentan en profesores que "la velocidad es el producto de las concentraciones de los reactivos".
6. **Cinética y termodinámica se cruzan.** Futuros profesores turcos explican la rapidez con datos termodinámicos (Sözbilir, Pınarbaşı y Canpolat, 2010); universitarios húngaros relacionan K con la velocidad y confunden ΔH con Eₐ (Turányi y Tóth, 2013, según citas).
7. **Los errores de cálculo del examen no tienen estudios con porcentaje**: orden igual al coeficiente, orden 2 tratado como lineal, vida media de primer orden que depende de la concentración, la regla de los 10 °C mal aplicada, el catalizador que cambia ΔH. Van como hipótesis.

## Catálogo con respaldo

Columna "Cifra": **"sin cifra leída"** quiere decir que la idea está documentada en el estudio (según su resumen o según otros artículos que lo citan), pero no vi el porcentaje. **"Vía buscador"** quiere decir que la cifra la leí en el texto que devolvió el buscador, tomado de un artículo que cita al original; está por verificar con el PDF.

Muestras de los estudios (según resúmenes y registros de catálogo):

- **Çakmakçı (2010):** 191 estudiantes turcos de secundaria y de pregrado (estos últimos, futuros profesores de química). Tareas escritas y entrevistas individuales. Tiene una tabla de distribución de las ideas alternativas por grupo, que no pude ver.
- **Çakmakçı, Leach y Donnelly (2006):** velocidad y su relación con la concentración o la presión; secundaria y universidad. Solo la referencia.
- **Kolomuç y Tekin (2011):** 70 profesores de química de 40 ciudades de Turquía; prueba de 5 preguntas abiertas.
- **Kolomuç y Çalık (2012):** 70 profesores y 72 escolares de 11.º grado; prueba de 19 ítems (9 principales y 10 secundarios); entrevistas a 10 profesores y 13 escolares.
- **Yan y Subramaniam (2018):** 137 escolares de 12.º grado (Singapur, por el autor); prueba de cuatro escalones; 25 ideas alternativas, casi el 70 % salidas de preguntas con gráficas. Solo el resumen vía buscador.
- **Jusniar y otros (2020):** 245 escolares de 11.º grado de Gowa, Indonesia; seis ideas erróneas de velocidad que se arrastran al equilibrio (correlación de Spearman 0,39). Solo el resumen vía buscador.
- **Kurt y Ayas (2012):** 41 escolares turcos de 11.º grado, intervención constructivista. Solo citas.
- **Taştan Kırık y Boz (2012):** 110 escolares turcos de 11.º grado, aprendizaje cooperativo contra enseñanza tradicional, con el "Reaction Rate Concept Test". Solo el resumen.

| # | Idea errónea | Lo correcto | Cifra | Fuente |
| --- | --- | --- | --- | --- |
| CI1 | **La velocidad es el tiempo que tarda la reacción**, o la cantidad de producto que se forma. "Más rápida" = "da más". | La velocidad es cuánto cambia la concentración **por unidad de tiempo** (mol/(L·s)). El tiempo es inverso a la velocidad; la cantidad de producto la fija la estequiometría (y el equilibrio), no la rapidez. | 33 % de los escolares de secundaria cree que la velocidad es el tiempo que tarda y no sabe definirla (vía buscador, por verificar; N del subgrupo no visto). | Çakmakçı (2010), citado por un artículo de 2024; Bain y Towns (2016) lo citan como "dificultad para definir velocidad" |
| CI2 | **La velocidad es constante durante toda la reacción** mientras no cambien la temperatura, la concentración inicial o el catalizador. O al revés: crece con el tiempo. | La velocidad baja a medida que se gastan los reactivos (salvo en orden cero). La pendiente de la curva concentración-tiempo se aplana. | Sin cifra leída. Una revisión dice que "muchos alumnos" lo suponen. Jusniar y otros (2020) incluyen "el cambio de la velocidad en el tiempo" entre sus seis ideas erróneas. | Revisión no identificada, vía buscador; Jusniar y otros (2020), resumen |
| CI3 | **Calentar no acelera una reacción exotérmica** (o la frena), y siempre acelera la endotérmica. A igual temperatura, una exotérmica y una endotérmica tienen la misma velocidad. | La temperatura acelera **toda** reacción, exotérmica o endotérmica: sube la fracción de choques con energía suficiente. Lo que depende del signo de ΔH es el desplazamiento del **equilibrio**, no la velocidad. | Sin cifra leída. | Çakmakçı (2010) y Kolomuç y Tekin (2011), según citas y la lista de Çakmakçı, Leach y Donnelly (2006) |
| CI4 | **Al calentar cambia la energía de activación** (baja, y por eso va más rápido; o baja y "por eso frena"). | Eₐ es propia del camino de reacción; la temperatura no la cambia. Cambia cuántas moléculas la superan. | Sin cifra leída. Aparece en la tabla de ideas alternativas de Çakmakçı (2010) según el buscador. Jusniar y otros (2020) tienen un ítem sobre "el efecto de la temperatura". | Çakmakçı (2010); Jusniar y otros (2020) |
| CI5 | **Las reacciones exotérmicas tienen menor energía de activación** que las endotérmicas; Eₐ y ΔH se confunden. | Eₐ (altura de la loma) y ΔH (diferencia entre productos y reactivos) son independientes: hay exotérmicas lentísimas (la combustión del papel a temperatura ambiente). | Sin cifra leída. | Çakmakçı (2010), tabla, vía buscador; Turányi y Tóth (2013) citado por "confundir entalpía con energía de activación" |
| CI6 | **La energía de activación es la energía cinética de los reactivos.** | Eₐ es la energía mínima que debe tener el choque (en la dirección adecuada) para reaccionar. Las moléculas tienen energías repartidas; Eₐ es una barrera, no una propiedad de cada molécula. | Sin cifra leída. Un estudio turco de 2010 dice que "un número relevante" de alumnos lo cree; el texto se cortó antes de la cifra. | Vía buscador; probablemente Çakmakçı (2010), por confirmar |
| CI7 | **El catalizador sube la energía de activación, o cambia la energía cinética de las moléculas** (la sube, o la baja "para que choquen mejor"). "Activa" las moléculas. | El catalizador abre otro camino con **menor** Eₐ, en los dos sentidos. No cambia la energía de las moléculas ni la temperatura. | Solo el 5 % de los alumnos explica bien el efecto del catalizador (Kolomuç y Çalık 2012, según un artículo de 2024; vía buscador, por verificar). Sin cifra leída para cada idea. | Kurt y Ayas (2012), según una revisión ("acelera bajando la energía cinética"); otra fuente, vía buscador, dice que "la mayoría" cree que sube la Eₐ y la energía cinética; Çalık y otros, Kolomuç y Tekin (2011) y Taştan y otros, según una revisión; Jusniar y otros (2020), ítem del catalizador |
| CI8 | **El catalizador no participa en la reacción** ni cambia su mecanismo; "solo está ahí". | El catalizador participa (se combina y se libera) y por eso cambia el mecanismo; se recupera al final sin consumirse. | Sin cifra leída. | Çakmakçı (2010), lista citada vía buscador |
| CI9 | **La velocidad es el producto de las concentraciones de los reactivos**, elevadas a sus coeficientes de la ecuación balanceada. | Los exponentes (órdenes) se miden en el laboratorio. Solo en una etapa elemental coinciden con los coeficientes. | Sin cifra leída. Documentado **en profesores** (de 70). | Kolomuç y Tekin (2011), según Bain y Towns (2016) y otros |
| CI10 | **Cinética y termodinámica (o equilibrio) son lo mismo.** Una reacción con K grande, o muy exotérmica, o espontánea, "es rápida". | K y ΔG dicen hasta dónde llega la reacción; Eₐ dice qué tan rápido. Una reacción puede ser espontánea y lentísima (diamante → grafito). | Sin cifra leída. Los futuros profesores "intentan interpretar la cinética con datos termodinámicos". Los universitarios húngaros relacionan K con la velocidad. Çakmakçı (2010) concluye que entender mal termodinámica y equilibrio pesa en las ideas de cinética. | Sözbilir, Pınarbaşı y Canpolat (2010), resumen; Turányi y Tóth (2013) y Çakmakçı (2010), según citas |
| CI11 | **La etapa lenta no es la que fija la velocidad**, o todas las etapas pesan igual. | En un mecanismo, la etapa más lenta limita la velocidad total (como el tramo más angosto de una tubería). | Sin cifra leída. Algunos futuros profesores no sabían que la etapa lenta es la determinante. | Taştan Kırık, Yalçınkaya y Boz (2010), resumen vía buscador |
| CI12 | **En el diagrama de energía, el eje horizontal es el tiempo** y los picos son sustancias intermedias. | El eje horizontal es la "coordenada de reacción" (avance del camino), no el tiempo. Los picos son estados de transición; los valles entre picos, intermediarios. | 10 de 17 estudiantes (del tema "significado de los rasgos del diagrama") leen los picos como intermediarios, en una muestra de 36 alumnos de química orgánica II (vía buscador, por verificar). La lectura del eje como tiempo se reporta como persistente, sin cifra. | Popova y Bretz (2018), citado vía buscador |
| CI13 | **Mayor energía de activación, mayor constante de velocidad.** | Con la ecuación de Arrhenius, k = A·e^(−Eₐ/RT): más Eₐ, menor k. | 13 estudiantes (26 %) manipulan Arrhenius y concluyen que más Eₐ da más k (vía buscador; el buscador lo atribuye a un estudio de diagramas de energía, probablemente Popova y Bretz, 2018; por verificar). | Por confirmar |

**Factores con poca evidencia.** Para concentración y presión, el estudio de referencia es Çakmakçı, Leach y Donnelly (2006), que no pude leer. Para la **superficie de contacto** no encontré ningún estudio con la idea errónea descrita; queda como hipótesis (abajo).

**Lo que se aprende.** Casi todas las ideas documentadas vienen de mezclar dos preguntas: *¿qué tan rápido?* (cinética: Eₐ, choques) y *¿hasta dónde?* (energía y equilibrio: ΔH, K). Al alumno le enseñan las dos con las mismas palabras ("favorece", "desplaza", "activa"). La escena tiene que separar las dos cosas en pantalla: la loma (Eₐ) arriba, el desnivel (ΔH) abajo, y que el catalizador solo mueva la loma. Además, Yan y Subramaniam (2018) encuentran que casi el 70 % de las ideas alternativas salió de preguntas con gráficas: las gráficas de concentración contra tiempo y de energía contra avance son el centro del problema, no un adorno.

## Lo que no tiene respaldo (todavía)

Errores de cálculo típicos de los problemas de admisión. No encontré estudios que los midan; la columna de la derecha dice de qué error documentado saldrían.

| Tema | Error que suponemos | Error documentado del que sale |
| --- | --- | --- |
| Orden de reacción | Tomar el orden igual al coeficiente estequiométrico en una reacción no elemental: para 2 NO + O₂ → 2 NO₂ con ley medida v = k[NO]²[O₂] da igual, pero para 2 N₂O₅ → 4 NO₂ + O₂ (orden 1 medido) daría orden 2 | CI9 (en profesores) |
| Orden 2 | Con v = k[A]², duplicar [A] "duplica" la velocidad (en realidad la cuadruplica); triplicarla da ×3 en vez de ×9 | CI9; razonamiento lineal (ver los informes de álgebra y de semejanza) |
| Orden cero | Creer que con orden cero la reacción no avanza, o que su velocidad baja con el tiempo como en orden 1 | CI2 |
| Método de velocidades iniciales | Leer el orden como el cociente de velocidades y no como el exponente: si al duplicar [A] la velocidad sale ×4, decir "orden 4" | Ninguno directo |
| Unidades de k | Dar a k las mismas unidades en cualquier orden (mol/(L·s)) | Ninguno directo |
| Vida media | Creer que la vida media de primer orden depende de la concentración inicial (más concentrado, tarda más en llegar a la mitad) | CI1 (velocidad = tiempo) y razonamiento "más cantidad, más tiempo" |
| Vida media | Creer que en dos vidas medias se consume todo (la mitad y luego la otra mitad), en vez de quedar 1/4 | Ninguno directo |
| Regla de los 10 °C | Aplicar "cada 10 °C la velocidad se duplica" sumando en vez de multiplicar: de 20 °C a 50 °C, ×6 en vez de ×8; o usarla como ley exacta para cualquier reacción | CI3 y CI4 |
| Arrhenius | Más Eₐ, mayor k; o creer que calentar sube igual la velocidad de todas las reacciones, sin importar Eₐ (las de mayor Eₐ son más sensibles a la temperatura) | CI13 |
| Catalizador | Creer que el catalizador cambia ΔH (o la energía de productos), o que acelera solo la reacción directa | CI5 y CI7; en equilibrio, EQ12 ("da más producto") |
| Catalizador | Creer que el catalizador se gasta y hay que incluirlo en la estequiometría | CI8 |
| Superficie de contacto | Creer que al pulverizar un sólido cambia la cantidad de producto o la Eₐ; o que la superficie no importa porque "la masa es la misma" | CI1 y CI4 |
| Teoría de colisiones | Creer que todo choque produce reacción; o que al calentar 10 °C el número de choques se duplica (en realidad sube cerca de 2 %; lo que se duplica es la fracción de choques eficaces) | CI6 |
| Diagrama de energía | Leer Eₐ de la reacción inversa como la misma de la directa; o medir Eₐ desde el cero del eje y no desde los reactivos | CI5 y CI12 |

Se confirman como en los otros temas: con hojas resueltas en la prueba del colegio y con predicciones de respuesta abierta.

## Propuesta para la plantilla: choques que reaccionan

**Escena.** Una caja 2D con partículas A (círculos de un color) y B (cuadrados de otro). Se mueven con velocidades repartidas según la temperatura (en 2D, la fracción de partículas con energía mayor que E es exactamente e^(−E/kT), lo que deja calcular todo en el motor). Cuando chocan una A y una B, el motor mira dos cosas: si la energía del choque (componente a lo largo de la línea de centros) supera Eₐ, y si la orientación es buena (cada A tiene una "cara" marcada). Si cumple las dos, se convierten en producto C (un tercer color) con un destello. Si no, rebotan.

Al costado, tres paneles amarrados por color (principio 4):

1. **Histograma de energías de los choques** con una línea vertical en Eₐ. La parte a la derecha de la línea, sombreada, es la fracción eficaz.
2. **Perfil de energía**: loma con altura Eₐ y desnivel ΔH, con el eje horizontal rotulado "avance de la reacción" (no "tiempo", por CI12). Un botón muestra la loma de la reacción inversa (Eₐ + |ΔH| en una exotérmica).
3. **Gráfica [A] contra tiempo** que se dibuja en vivo, con la pendiente (velocidad) marcada en el instante actual. Se ve que la pendiente se aplana (CI2).

Tres contadores grandes: choques por segundo, choques con energía suficiente, choques eficaces (energía y orientación). Así se separan los tres filtros de la teoría de colisiones.

Valores de referencia para el motor (para fijar los casos de prueba): con Eₐ = 4 kT₀, la fracción eficaz por energía es e⁻⁴ ≈ 1,83 %. Si la temperatura sube a 1,25 T₀, pasa a e^(−3,2) ≈ 4,08 % (× 2,23), mientras que el número de choques sube solo √1,25 ≈ × 1,12. Si un catalizador baja Eₐ a 3 kT₀ a la misma temperatura, la fracción pasa a e⁻³ ≈ 4,98 % (× e ≈ 2,72). En unidades de laboratorio: con Eₐ = 50 kJ/mol, de 300 K a 310 K la fracción sube × 1,91 y los choques solo × 1,017 (calculado con R = 8,314 J/(mol·K)).

### Predicción 1: temperatura

*Se calienta la caja de T₀ a 1,25 T₀. La reacción es exotérmica. ¿Qué pasa?*

| Opción | Error que representa | Respaldo |
| --- | --- | --- |
| a) Va más lenta o igual: la reacción ya libera calor y calentarla "la frena" | CI3 | Documentado (Çakmakçı 2010; Kolomuç y Tekin 2011), sin cifra leída |
| b) Va más rápida porque al calentar baja la energía de activación | CI4 | Documentado (Çakmakçı 2010), sin cifra leída |
| c) Va más rápida porque hay el doble de choques | Hipótesis: confundir choques con choques eficaces | Sin respaldo |
| d) Va más rápida: los choques suben poco (cerca de 12 %), pero la fracción de choques con energía suficiente sube más del doble | Correcta | — |

Al revelar: el contador de choques casi no se mueve; el de choques eficaces se dispara. La línea de Eₐ en el histograma **no se mueve**; se mueve la curva.

### Predicción 2: catalizador

*Se agrega un catalizador. ¿Qué cambia en el perfil de energía?*

| Opción | Error que representa | Respaldo |
| --- | --- | --- |
| a) La loma sube: el catalizador "activa" la reacción dándole más energía | CI7 (sube Eₐ) | Documentado según revisiones (Kolomuç y Tekin 2011; Çalık y otros; Taştan y otros), sin cifra leída |
| b) Nada en el perfil: el catalizador cambia la energía de las moléculas para que choquen mejor | CI7 (cambia la energía cinética) | Documentado (Kurt y Ayas 2012, según una revisión), sin cifra leída |
| c) La loma baja y los productos quedan más abajo: se libera más calor | Hipótesis: el catalizador cambia ΔH | Sin respaldo directo; relacionado con CI5 |
| d) La loma baja, en los dos sentidos; el desnivel ΔH no cambia | Correcta | Solo el 5 % explica bien el efecto del catalizador (Kolomuç y Çalık 2012, vía buscador, por verificar) |

Al revelar: el histograma no cambia (misma temperatura) y la línea de Eₐ se corre a la izquierda. Con el botón de la reacción inversa, se ve que también baja su loma. Enlace con la plantilla de equilibrio: la caja llega antes al mismo final (EQ12).

### Predicción 3: la velocidad en el tiempo

*Sin tocar nada, se deja correr la reacción. ¿Qué pasa con la velocidad (choques eficaces por segundo) a medida que pasa el tiempo?*

| Opción | Error que representa | Respaldo |
| --- | --- | --- |
| a) Se mantiene igual: no cambió la temperatura ni se agregó nada | CI2 | Documentado (revisión vía buscador; Jusniar y otros 2020), sin cifra leída |
| b) Aumenta, porque cada vez hay más producto | CI1 (velocidad = cantidad de producto) | Documentado (Çakmakçı 2010); 33 % confunde velocidad con tiempo (vía buscador, por verificar) |
| c) Baja, porque quedan menos A y B para chocar | Correcta | — |

### Explorador

- **Deslizador de temperatura** con el histograma en vivo (CI3, CI4).
- **Deslizador de Eₐ** y de ΔH por separado: se puede hacer una exotérmica con loma alta (lenta) y una endotérmica con loma baja (rápida) (CI5, CI10).
- **Interruptor "orientación importa"**: al apagarlo, la velocidad sube por un factor fijo; es el factor estérico.
- **Concentración**: botón para duplicar las A. Los choques A-B se duplican; con dos tipos que deben chocar, duplicar las dos cuadruplica (puente hacia la ley de velocidad; hipótesis de orden 2).
- **Superficie**: un bloque sólido de B que se puede partir en trozos. Solo reaccionan las B de la superficie; al partirlo, la misma masa expone más caras y va más rápido, pero al final sale la misma cantidad de C.
- **Modo vida media** con una reacción A → C de primer orden: marcas automáticas cuando queda 1/2, 1/4, 1/8 de A; se cambia la cantidad inicial y los intervalos no cambian.
- **Modo mecanismo**: dos etapas en serie, una con loma alta y otra baja; la velocidad total la fija la lenta (CI11).

## Huecos y siguientes pasos

- **Nada leído completo.** Prioridad para leer cuando la red lo permita (o si Gerson baja los PDF a `fuentes/`): Çakmakçı (2010) por su tabla de distribución de ideas alternativas; Kolomuç y Tekin (2011), de acceso abierto en ijpce.org; Kolomuç y Çalık (2012), de acceso abierto en el Journal of Baltic Science Education; Jusniar y otros (2020), abierto en ERIC (files.eric.ed.gov, EJ1272391); Çam, Topçu y Sülün (2015), abierto en eduhk.hk; Sözbilir y otros (2010), abierto en ejmste.com; y Bain y Towns (2016), en la RSC.
- **Para habilitarlo**, la sesión necesita que se permitan en la configuración de red del entorno al menos estos hosts: ijpce.org, www.eduhk.hk, files.eric.ed.gov, www.ejmste.com, dergipark.org.tr, open.metu.edu.tr, pubs.rsc.org, pubs.acs.org, www.scientiasocialis.lt. No lo pedí yo: lo decide Gerson.
- **Cifras vía buscador**: las de CI1 (33 %), CI7 (5 %), CI12 (10 de 17) y CI13 (26 %) hay que confirmarlas con el PDF antes de ponerlas en una opción. La de CI13 ni siquiera tiene el artículo confirmado.
- **Sin datos de vida media, órdenes ni unidades de k.** Los estudios abiertos se quedan en lo conceptual; la parte numérica del examen va toda como hipótesis.
- **Ningún dato latinoamericano ni peruano.** Hay que medirlo en el colegio.

## Fuentes

- Çakmakçı (2010), *Identifying alternative conceptions of chemical kinetics among secondary school and undergraduate students in Turkey*, Journal of Chemical Education 87(4), 449–455, doi 10.1021/ed8001336. **No lo pude abrir.** Del registro de catálogo (vía buscador): N = 191, tareas escritas y entrevistas, las ideas persisten en pregrado, influencia de termodinámica y equilibrio. Ideas de su tabla y el 33 % de CI1: solo vía buscador.
- Çakmakçı, Leach y Donnelly (2006), *Students' ideas about reaction rate and its relationship with concentration or pressure*, International Journal of Science Education 28(15), 1795–1815. Solo la referencia.
- Kolomuç y Tekin (2011), *Chemistry teachers' misconceptions concerning concept of chemical reaction rate*, Eurasian Journal of Physics and Chemistry Education 3(2), 84–101, doi 10.51724/ijpce.v3i2.194 (https://ijpce.org/index.php/IJPCE/article/view/194). Acceso abierto, pero **no lo pude abrir** (red de la sesión). Solo el resumen y citas: 70 profesores, 5 preguntas abiertas.
- Kolomuç y Çalık (2012), *A comparison of chemistry teachers' and grade 11 students' alternative conceptions of 'rate of reaction'*, Journal of Baltic Science Education 11(4), 333–346. Solo el resumen vía buscador (70 profesores, 72 escolares, 19 ítems). El 5 % del catalizador sale de un artículo de 2024 que lo cita (Research in Science Education, *Enhancing learners' conceptual understanding of reaction kinetics using computer simulations*), vía buscador.
- Bain y Towns (2016), *A review of research on the teaching and learning of chemical kinetics*, Chemistry Education Research and Practice 17(2), 246–262, doi 10.1039/C5RP00176E. Solo lo que dicen de ella otros artículos, vía buscador.
- Justi (2002), *Teaching and learning chemical kinetics*, en Gilbert y otros (eds.), *Chemical Education: Towards Research-based Practice*, Kluwer, 293–315. Solo la referencia; según otros, dice que los estudios de cinética son escasos comparados con los de termodinámica.
- Kurt y Ayas (2012), *Improving students' understanding and explaining real life problems on concepts of reaction rate by using a four step constructivist approach*, Energy Education Science and Technology Part B 4(2), 979–992. Solo citas: 41 escolares; una revisión le atribuye la idea "el catalizador acelera la reacción bajando la energía cinética de las moléculas".
- Taştan Kırık, Yalçınkaya y Boz (2010), *Pre-service chemistry teachers' ideas about reaction mechanism*, Journal of Turkish Science Education 7(1), 47–60. Solo el resumen vía buscador.
- Taştan Kırık y Boz (2012), *Cooperative learning instruction for conceptual change in the concepts of chemical kinetics*, Chemistry Education Research and Practice 13, 221–236. Solo el resumen: 110 escolares.
- Yalçınkaya, Taştan Kırık, Boz y Yıldıran (2012), *Is case-based learning an effective teaching strategy to challenge students' alternative conceptions regarding chemical kinetics?*, Research in Science & Technological Education. Solo el título en el buscador.
- Yan y Subramaniam (2018), *Using a multi-tier diagnostic test to explore the nature of students' alternative conceptions on reaction kinetics*, Chemistry Education Research and Practice 19(1), 213–226. Solo el resumen vía buscador (137 escolares, 25 ideas, casi 70 % de preguntas con gráficas). Y Yan y Subramaniam (2016), *Diagnostic appraisal of grade 12 students' understanding of reaction kinetics*, CERP 17(4), 1114: solo el título.
- Jusniar, Effendy, Budiasih y Sutrisno (2020), *Misconceptions in rate of reaction and their impact on misconceptions in chemical equilibrium*, European Journal of Educational Research 9(4), 1405–1423. Abierto en ERIC; **no lo pude abrir**. Solo el resumen vía buscador.
- Sözbilir, Pınarbaşı y Canpolat (2010), *Prospective chemistry teachers' conceptions of chemical thermodynamics and kinetics*, Eurasia Journal of Mathematics, Science and Technology Education 6(2), 111–122. Solo el resumen vía buscador.
- Turányi y Tóth (2013), *Hungarian university students' misunderstandings in thermodynamics and chemical kinetics*, Chemistry Education Research and Practice 14(1), 105–116. Solo citas de otros artículos.
- Popova y Bretz (2018), artículos sobre diagramas de coordenada de reacción en Chemistry Education Research and Practice 19(3) (*Organic chemistry students' interpretations of the surface features of reaction coordinate diagrams*, y otro sobre ideas erróneas de universitarios). Solo fragmentos vía buscador; las cifras de CI12 y CI13 están por verificar.
- Gegios, Salta y Koinis (2017), *Investigating high-school chemical kinetics: the Greek chemistry textbook and students' difficulties*, Chemistry Education Research and Practice 18(1), 151–168. Solo el resumen de ERIC vía buscador ("una gran proporción" con baja comprensión; sin cifra).
- Çam, Topçu y Sülün (2015), *Preservice science teachers' attitudes towards chemistry and misconceptions about chemical kinetics*, Asia-Pacific Forum on Science Learning and Teaching 16(2). Abierto; **no lo pude abrir**. Solo el resumen.
- Estudio indonesio sobre el catalizador como concepto umbral (Jurnal Pendidikan MIPA, UPI): 21 escolares y universitarios, entrevistas; solo el resumen, sin cifras.
