# Auditoría de contenido: «Materia y energía» (quimica.materia-y-energia)

17 nov 2026. Auditor externo, sin editar la unidad. Contrato: `docs/plan-calidad.md` §3 (13 puntos) y §5. Formato:
`docs/teoria.md` 4e, 4f, 4h y §5. Vara: `docs/molde-unidad.md`, con §5b reescrito («un color fijo por magnitud… también
en la práctica»). Decisiones: `docs/etapa2/decisiones.md`; mandan sus «Cambios posteriores». Lo que ya corrigió el
lector en frío (`rutinas/frio/quimica.materia-y-energia.md`) no se repite aquí. La idea 6 no pasó por el lector en frío.

**Qué se revisó.**
- `contenido/teoria/quimica/materia-y-energia.js` y su test: las 6 ideas, los 90 ejemplos, «Ahora tú» en las semillas
  0 a 399 y «Así se resuelve», el glosario y el laboratorio.
- Las piezas `quim-vasos`, `quim-particulas` y `quim-cocina`, sus pruebas y el motor `plantillas/materia-energia/motor.js`.
- La práctica, con `{ unidad: 'quimica.materia-y-energia' }`:
  - `sustancias-mezclas`, `densidad-propiedades`, `cambios-materia`, `calor-sensible-latente`, `masa-energia` y
    `vida-media`, cada una con 3 semillas por tipo (y por subtipo);
  - lo que sacan aquí `quimica-conceptos` (ramas y sustancias) y `conversiones-quimica` (variaciones y densidad);
  - la escena `materia-energia` y los nueve `papel.json`.
- La app a 390 × 844: 42 momentos y 90 ejemplos (`node herramientas/capturas-teoria.js`, servidor del puerto 4173).
- Scripts y capturas en el scratchpad de la sesión (`aud-quim/`): `cuentas.py`, `dump-gen.js`, `dump-teo.js`, `ver.js` y
  `cap/`.

**Pruebas.** `node --test` de la unidad y de los 8 generadores: 287 de 287. `contenido/teoria/teoria.test.js`: 157 de
157.

**Cuentas.** Rehechas con `aud-quim/cuentas.py`, que no carga la unidad, el motor ni las plantillas. Lee los volcados
(enunciado, `_datos`, alternativas) y recalcula con fórmulas propias.
- 169 de 169 cuadran:
  - los 30 ejemplos de nivel 3 (en total, 49 comprobaciones);
  - 24 cuentas más de la teoría: niveles 1 y 2, la misión de 5,2 mg, el 0,7 % del Predice del Sol, Mira de calor y el
    glosario;
  - 96 problemas de los generadores: 3 por tipo y subtipo, recalculados desde `_datos`, nunca desde sus cuentas.
- Además, 40 casos de «Ahora tú» (semillas 0 a 9 de las ideas 2, 4, 5 y 6), rehechos desde el texto de la pregunta:
  40 de 40.
- Los tipos que se responden clasificando, sin cuenta, se revisaron a mano en las mismas semillas. Están todos bien:
  lupas, materiales, fases y componentes, métodos de separación, intensivas, fenómenos, propiedades y verdadero o
  falso.
- **No hay ningún error de cálculo.** Los problemas de la unidad son de dibujo, de color y de lo que la práctica saca
  fuera de las decisiones.

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 6, 10 (decisión: toda molécula con los átomos de su fórmula) | `plantillas/cambios-materia/generador.js:163` (`ESP.C3H8`); tipo `lupa`, caso `propano` (semilla 2) | Es el mismo defecto que el lector en frío llamó «el error más grave», y sigue en la práctica. El propano se dibuja con 3 C y **2 H**, aunque el texto alternativo dice «propano (C₃H₈)». En la lupa de antes hay 3 C, 2 H y 10 O; en la de después, 3 C, **8 H** y 10 O. Contando, el alumno ve que aparecen 6 hidrógenos en un frasco cerrado, justo en la idea que enseña que los átomos se conservan. | Dibujar los 8 H, con el hidrógeno chico como en la teoría. Pasar a los generadores la prueba «cada molécula dibujada tiene los átomos de su fórmula» (ver Reglas). |
| A2 | 6, 10 (misma decisión); regla de la idea 3 | `materia-y-energia.js:1147` (`ESP1.glucosa`) y `:1165` (`PROC3.chicha`): el juego de la idea 3, opción «La chicha que fermenta» | La glucosa se dibuja «en corto», con 4 átomos (C, C, H, O) en vez de 24. Después vienen 2 alcoholes completos (18 átomos) y 2 CO₂ (6). La lupa pasa de 4 a 24 átomos (más el agua). La misión de esta idea («partículas nuevas, armadas con los mismos átomos») se cumple con este caso, y su «bien» lo afirma. Mira y la regla dicen «átomos de cada elemento antes = después». La prueba de la unidad exenta la glucosa (`EN_CORTO`), y el lector en frío lo dejó pendiente para Gerson. En la idea 1, la leyenda de lo «en corto» basta, porque ahí no se cuentan átomos. En la idea 3, sí se cuentan. | Sacar la chicha del juego de la idea 3, o dibujar la glucosa con sus 24 átomos en una celda más grande. Prohibir lo «en corto» en la idea que cuenta átomos (ver Reglas). |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 5 (molde §5b: un color por magnitud «también en la práctica») | `densidad-propiedades/generador.js:96,152,171`; `calor-sensible-latente/generador.js:67-68,135,306`; `masa-energia/generador.js:113,190`; `cambios-materia/generador.js:365`; `conversiones-quimica` (densidad y delta) | Cuatro generadores y medio pintan con la regla vieja («lo que se pide, violeta»). Solo `vida-media` sigue a la teoría. **Calor:** ΔT y el Q dado van en turquesa y cₑ en verde; en la teoría, ΔT y la temperatura son verdes, cₑ y L turquesa y Q violeta. Es decir, cₑ y ΔT salen con los colores cambiados. **Densidad:** la masa pedida y el volumen pedido van en violeta (en la teoría, naranja y turquesa). **Masa-energía:** la E dada va en turquesa, el color de c², y la masa pedida y el número de balones en violeta (en la teoría, naranja y carmín). **Balanza de cambios:** la masa final va en violeta y la lana en turquesa. **Conversiones:** ρ turquesa, V verde, las temperaturas naranja y turquesa y ΔT verde. | Una tabla de colores de la unidad, exportada desde la teoría, que cada generador use. Un test que la compare con `variables` (ver Reglas). |
| M2 | 6 (decisión de Gerson: «disuelta, los iones van separados») | `sustancias-mezclas/generador.js:199` y `:205` (`{ titulo: 'Un vaso', capas: [[['H2O', 4], ['NaCl', 2]]] }`); tipo `lupa`, semilla 6 | En la práctica, la sal disuelta se dibuja como par Na–Cl dentro del agua. La teoría la dibuja con los iones sueltos (prueba «la sal disuelta va como iones sueltos»). | Usar `disuelto()` como la teoría, con Na⁺ y Cl⁻ sueltos. Copiar la prueba de la teoría al generador. |
| M3 | 13, 9 | `conversiones-quimica/generador.js:104` (en esta unidad: `delta` y `densidad`), subtipos `densidad/volumen` y `densidad/masa` | En 193 de 400 semillas, los datos son una sola cadena: «Densidad del aluminio: 2,7 g/cm³. 1 L = 1000 cm³; 1 m³ = 10⁶ cm³.». Faltan ρ = m/V y 1 kg = 1000 g, aunque el enunciado da kg y pide m³. La densidad de libro va sin «unos», y el hierro vale 7,8 cuando la teoría y `densidad-propiedades` usan 7,9. Además, pide m³ y escribe «5 × 10⁻⁵ m³» en la idea 2, y las potencias de 10 llegan recién en la idea 5. El título que ve el alumno es «Termómetros, lingotes e **isótopos** que se desintegran», aunque aquí no sale vida media y la idea 6 evita «isótopo» a propósito. | Datos en lista: «Densidad: ρ = m / V», «1 kg = 1000 g», «Hierro: unos 7,9 g/cm³». En esta unidad, solo cm³ y L. Un título por unidad, o sacar «isótopos». |
| M4 | 13, 9 | `quimica-conceptos/generador.js:283-300` (temas `ramas` y `sustancias`) | En esta unidad salen sin datos 2000 de 2000 problemas. Nada da las definiciones entre las que se elige, a diferencia del ejemplo «La cafeína de una bebida». La proposición ram4, «La fisicoquímica estudia la energía, la velocidad y el equilibrio…», es V, pero la unidad solo enseña «la fisicoquímica, la energía de los cambios». «Sustancia simple» (sus1) tampoco se enseña. La mitad de esta práctica es de ramas, que en la teoría ocupan una tarjeta de «Lee». | Datos con las definiciones de la unidad (DEF_SM, DEF_EC, DEF_HH y las ramas de la tarjeta de «Lee»). Reescribir ram4 y sus1 con las palabras de la unidad. Bajar el peso de las ramas. |
| M5 | 9, 13 (decisiones: lo nuclear solo con C-14; E = Δm·c²; escalas solo como variaciones; sin calor latente molar) | `conversiones-quimica/papel.json`; `materia-energia/papel.json` y `materia-energia/index.html` (escena de la unidad, primera plantilla del catálogo) | El papel de conversiones no se filtra por unidad: p2 pide lecturas punto a punto («¿Cuánto marcaría un termómetro en °F?»), p5 usa Å, p6 usa kJ/mol y p7 y p8 son de vida media. Sus datos están en la indicación, no por problema. La escena y su papel dicen «E = mc²» y ponen como ejemplo nuclear «un núcleo de uranio-235 se parte en bario y kriptón» (p3 y la escena). En p6 aparecen «óxido férrico» y «Masas atómicas: Fe = 56, O = 16», que son de nomenclatura y de mol, unidades posteriores. P8 pide que «2 kg de materia se transformaran por completo en energía», que es el error QM-TODA-MASA que la idea 5 corrige. La indicación del papel de la escena trae consejos («Piensa siempre en las partículas…»). | Filtrar el papel por unidad, con los mismos `TIPOS_POR_UNIDAD`. Rehacer la escena y su papel con E = Δm·c², el C-14 y datos por problema, o pasar la escena a «Más mesas del tema». |
| M6 | Molde §3 (la figura muestra el planteamiento, no la respuesta) | Idea 3, ejemplo 15 «Las burbujas del hervor» (`:1440`); captura `ej-fisico-quimico-nuclear-15.png` | El alumno debe decidir si en las burbujas hay H₂ y O₂ o H₂O. La lupa de «Después: el vapor» ya muestra moléculas de H₂O enteras, que es la respuesta. | La lupa de después vacía, con «?» (`{ vacia: true }`), como en «Contar sin balancear». |
| M7 | Molde §3 (los niveles suben) | Idea 3, nivel 3: «Lana de acero cerrada» (`:1422`) y «Las burbujas del hervor» (`:1440`) | Dos de los cinco ejemplos de examen tienen un solo paso. En la balanza cerrada basta con «nada entra ni sale: 200 g», y las burbujas se resuelven con la definición de cambio físico. Los dos son más fáciles que «El óxido del clavo», de nivel 2, que cuenta átomos con subíndices. | Juntar abierta y cerrada en un ejemplo («¿cuál marca más y por cuánto?»). Cambiar el de las burbujas por uno de examen: elegir, entre lupas, la de la electrólisis y la del hervor. |
| M8 | 5 (molde §5b: la respuesta en el color de su magnitud) | Idea 5, «Miligramos a kilogramos» (`:2162`) y «La luz al cuadrado» (`:2157`); captura `ej-masa-energia-05.png` | En la misma ecuación, 5 mg va en naranja y 5 × 10⁻⁶ kg en violeta, y la respuesta (una masa) también en violeta. En «La luz al cuadrado», c² va en violeta y en toda la idea es turquesa. La prueba «un color por magnitud» no lo ve: `potencias()` parte «5 × 10⁻⁶» en dos fichas («5 × 10» y «−6») y la unidad «kg» queda en tinta, así que `clase()` no reconoce la magnitud. | `vO(...)` en la masa y `vI(...)` en c². Arreglar la prueba (ver Reglas). |
| M9 | 10 (aprende algo falso) | `cambios-materia/generador.js:308`, tipo `atomos`, caso `oxido` (semilla 18) | «En un frasco cerrado hay 4 **moléculas de Fe** y 3 moléculas de O₂». El hierro no forma moléculas, y la teoría dice «4 átomos de Fe». | «4 átomos de Fe» cuando la especie es de un solo átomo. |
| M10 | Regla 3 (Predice); molde §2 (el glosario no adelanta la predicción) | Glosario, «propiedad intensiva» (`:3084`), estrenado por la idea 2 | En el Resumen, antes de jugar, «intensiva» abre su hoja con el ejemplo «La temperatura: dos tazas de té a 70 °C juntas siguen a 70 °C». Es casi la respuesta del Predice de las ollas («lo mismo en las dos»). El comentario del glosario solo cuidó que no se nombrara la temperatura de ebullición. | Cambiar el ejemplo por el brillo o la dureza («un clavo y una varilla de hierro igual de duros»). |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| B1 | Molde §2 (opciones de errores reales) | `:1730` (idea 4, tipo 4); idea 5, tipo 3 (`:2108`); idea 1, tipo 2; idea 2, tipo 3 | En 400 semillas, «Ahora tú» sale con 3 opciones en estos casos: idea 4 tipo 4, 80 de 80; idea 5 tipo 3, 80 de 80; idea 1 tipo 2, 80 de 80; idea 2 tipo 3, 27 de 80. En la idea 4 es un error de código: el distractor `mas` (t + 80) vale lo mismo que `todo` (q/m = 80 + t), así que su `siFuera` nunca sale. Las 3 opciones de los tipos 0 y 1 de la idea 3 (físico, químico, nuclear) y las 2 del tipo 2 son categorías naturales: están bien. | Cambiar `mas` por otro error (por ejemplo, calentar desde la temperatura inicial con todo Q). Agregar un tercer distractor a los balones. |
| B2 | 13 | `:1779`, «El calor específico de un metal» | La respuesta dice «, como el aluminio», pero el cₑ del aluminio no está en los datos. | Agregar «Aluminio: cₑ = unos 0,22 cal/(g·°C)» o quitar la coletilla. |
| B3 | 5 (colores de elemento iguales en teoría y práctica) | `sustancias-mezclas/generador.js:62`; `cambios-materia` (ATOMO); figuras de lupa | Las lupas de la práctica van en tinta con rellenos grises: N y H son los dos huecos. Es el par que el lector en frío confundió y que la teoría resolvió con N lleno. El aceite va con 3 C sin decir que es «en corto». | Dibujar con `quim-vasos` y la paleta de elementos, o al menos N lleno y una nota del aceite. |
| B4 | Notación | Teoría: «1 580 g», «1 650 cal», «Unos 1 960», «2 500 mL»; ejemplos y generadores: «1840 g», «1580 g»; `calor-sensible-latente`, tipo `variacion` (semilla 37) | El separador de miles de 4 cifras se escribe de dos maneras en la misma unidad (`f()` de la teoría contra el `replace` de los generadores y `ent6`). La variación escribe «de -10 °C» con guion y no con el signo menos. | Usar el mismo formateo de `ent6` en toda la teoría; «−» en el generador. |
| B5 | Decisiones (escalas: solo variaciones) | `:1947` (condición de la regla de calor) y `DEF_ESCALAS` | La regla enseña la lectura punto a punto («K = °C + 273 y °F = 1,8 · °C + 32»), y Ahora tú la trae en los datos para elegir. La práctica (`calor-sensible-latente`, `conversiones-quimica`) solo da variaciones y dice que lo puntual «va en física». Teoría y práctica no coinciden. | Que Gerson elija: o las dos dan el punto como herramienta para elegir, o ninguna lo da. |
| B6 | Lengua | `densidad-propiedades/generador.js:97` | «La balanza marca 26,7 g para una tuerca de cobre. Al **meterlo**…»; lo mismo con la moneda. | «Al meterlo» → «Al meter el objeto». |
| B7 | Mantenimiento | `:38-39`; comentarios de cabecera (`:20-25`), de la idea 4 y del laboratorio | Hay código muerto con los colores viejos (`m` turquesa, `Q` naranja, `T` carmín, `E` verde). Hay comentarios desactualizados: «colores por papel… naranja el primer dato», «la curva entera, punteada» (se quitó), «lo traduce a carbón quemado», «la meseta… que la idea 3 no alcanza». | Borrar las líneas 38-39 y poner los comentarios al día. |
| B8 | 9; decisión (lo nuclear de la idea 3, solo el C-14) | Glosario, «cambio nuclear» (`:3022`); idea 5 («núcleos de hidrógeno») | «Cambio nuclear» se estrena en la idea 3 y su hoja trae el Sol y «el uranio se parte». En ningún lugar de la unidad se dice qué es un núcleo, aunque la idea 5 y el glosario lo usan. | Ejemplos del glosario: el hueso y dos casos más del C-14 (o los del Sol, marcados «idea 5»). Una línea en «Lee» de la idea 5: «el núcleo: el centro del átomo». |
| B9 | Estilo | `:2313` (tarjeta 3 de «Lee» de la idea 5) | «La energía se mide en joules (J)» se repite (ya está en la tarjeta 1). | Quitarla de la tarjeta 3. |
| B10 | 13 (como la corrección 7 del lector en frío) | `:1220` (FEN3, idea 3, tipo 0) | «El carbono-14 de un hueso antiguo pasa a nitrógeno-14» junto al dato «Cambio nuclear: un átomo pasa a ser de otro elemento» deja la respuesta escrita en el enunciado. Es lo que se corrigió en el ejemplo 07. | Dejarlo solo en el tipo de la lupa, o decir «el hueso pierde carbono-14 y gana nitrógeno-14». |
| B11 | Niveles | Idea 2: «Alcohol y agua» (`:935`, nivel 3) contra «Sal y agua a la vez» (nivel 2) | Las dos piden elegir un método con sus datos. La de nivel 3 suma «qué propiedad», pero la respuesta está en el dato de ebullición. | Un nivel 3 con tres componentes y dos métodos de verdad (agua, sal y arena; filtrar y evaporar). |
| B12 | 10 | Idea 1, «Un cristal de sal» (`:407`) | Dice «un cloro (Cl⁻)» y «cada partícula une átomos». El ion es «cloruro» (así lo nombra `NOM1`), y en un cristal iónico no hay partículas sueltas. | «un ion sodio (Na⁺) junto a un ion cloruro (Cl⁻)». |

Resumen: **2 Alta, 10 Media, 12 Baja.**

## Lo que está bien y hay que copiar al molde

- **El motor decide las clases (regla 1).** La clase, el tipo de cambio y las fases los decide `MotorMateria` con las
  mismas partículas que se dibujan (`listaDe`, `motor3`). Así el dibujo y la respuesta no se pueden separar. Hay que
  copiarlo en cualquier unidad de clasificación.
- **Pruebas de dibujo de partículas** (`materia-y-energia.test.js`): los átomos por fórmula, que ninguna partícula pise
  a otra, iones con un Cl⁻ por cada Na⁺, que no se junten pares que no se distinguen (`Elementos.CERCANOS`) y que no se
  mezclen paletas. Es la base de las reglas nuevas de abajo; solo falta que cubra la práctica.
- **Datos para elegir.** Los datos traen las definiciones entre las que se elige (las tres de los cambios, homogénea y
  heterogénea), nunca la clase ya decidida. Los métodos de separación van todos, y el que también serviría se saca de
  las opciones (`fuera`).
- **Datos del mundo bien tratados.** Juliaca «a unos 3800 m… unos 87 °C», las densidades y los cₑ con «unos», y las vidas
  medias con «unos» y la fuente en el comentario (NUBASE2020). Las masas son creíbles: gramos solo en fuentes grandes
  que existen; lo de hospital, en fracción.
- **La idea 6** respeta todas las decisiones y en la práctica tiene los mismos colores que la teoría (`vida-media`). Es
  el modelo para alinear M1. Predice con la tercera lupa en «?», la misión que el motor comprueba y los distractores con
  nombre (AQ-vm-*) le dan un nivel 3 de examen de verdad («La vida media escondida», «De un día al otro»).
- **Cuentas.** 209 de 209 cuadran sin el código de la unidad. Cada constante de ejemplos dice qué cuentas se revisaron
  y con qué script.

## Reglas que faltan en el contrato o el validador

1. **Los átomos por fórmula, también en la práctica.** Un generador que dibuja partículas exporta sus especies, y un
   test común cuenta los átomos contra la fórmula (A1). Automatizable: `cambios-materia` y `sustancias-mezclas` ya
   exportan `ESP`.
2. **Nada «en corto» donde se cuentan átomos.** Una idea cuya regla es la conservación (o cuyo Mira cuenta átomos) no
   dibuja especies abreviadas (A2). Automatizable: la idea declara `cuentaAtomos: true` y el test prohíbe `EN_CORTO`.
3. **Una tabla de colores de la unidad, usada por todos.** La unidad exporta `colores: { masa: 'o', volumen: 'i', … }` y
   cada generador de su catálogo debe coincidir en sus `variables` (por el `nombre` o por una clave de magnitud). Hoy
   el molde §5b lo pide, pero nada lo comprueba fuera de la teoría (M1; es la misma falla que el A1 de trigonometría).
   Automatizable.
4. **La prueba de colores debe ver las potencias.** Clasificar la ficha antes de `potencias()`, o juntar base,
   exponente y la unidad que sigue (M8). Automatizable.
5. **El papel y la escena se filtran por unidad.** Cada problema de `papel.json` lleva `unidades`, y el validador
   rechaza en una unidad lo que su `TIPOS_POR_UNIDAD` excluye. Una escena que se lista en una unidad de `calidad: 2`
   pasa por las mismas decisiones o va a «Más mesas del tema» (M5). Automatizable en parte: las etiquetas sí; el
   contenido de una escena, a mano.
6. **`calidad: 2` alcanza a todos los generadores de la unidad.** Datos en lista no vacía y con la fórmula de cada tipo
   en 400 semillas, también en los generadores compartidos cuando corren con esa unidad (M3, M4). Automatizable: ya
   existe para los generadores propios.
7. **La figura de un ejemplo no muestra el «después» cuando lo pedido es qué hay después** (M6). Se puede comprobar en
   parte: si la respuesta es un tipo de cambio o una composición, la última lupa va `vacia`. El resto queda para el
   lector en frío.
8. **Cuatro opciones distintas, salvo categorías declaradas.** Un tipo con categorías naturales (físico, químico o
   nuclear; física o química) lo declara; los demás deben dar 4 opciones distintas en 400 semillas (B1). Automatizable.
9. **El título visible de una plantilla compartida, por unidad**, sin palabras que la unidad evita a propósito
   («isótopos», M3). Automatizable con una lista de palabras prohibidas por unidad (la idea 6 ya la tiene en su test).
