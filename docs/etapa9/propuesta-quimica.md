# Propuesta de ideas: «Reacciones químicas y balance»

`quimica.reacciones-y-balance` · Etapa 9 del plan de calidad, segunda unidad de la rama «Cálculos químicos» (la sigue
«Estequiometría») · fases 1 a 5 con criterio delegado (`docs/metodo/unidad/etapa-delegada.md`) · 26 nov 2026

Gerson delegó el criterio: esta propuesta se ejecuta sin esperar su visto bueno. Lo que decidí está al final, en
«Decisiones tomadas (Gerson revisa después)», cada una con su motivo y la alternativa descartada. **No hay ningún
conflicto crítico.** La decisión más grande es **seis ideas sin partir la unidad**: los cinco temas del catálogo, con el
balance redox partido en dos (igualar electrones con el EO, e ion-electrón con el medio), porque el ion-electrón es lo que
más pregunta San Marcos (sección 0) y no cabe en una sola idea con el medio básico.

Lo que leí: `CLAUDE.md`, `docs/plan-calidad.md` §3, `docs/molde-unidad.md`, `docs/metodo/unidad/` (LEEME, 1 a 3,
`reglas-validador.md`, `etapa-delegada.md`), `docs/teoria.md` (4e a 4j y §5), las decisiones de las etapas 2 a 8,
`docs/etapa8/propuesta-quimica.md` (modelo de formato), la unidad modelo `mol-y-composicion.js` (mapa, idea 1 en código,
glosario y laboratorio), la teoría de hoy (`reacciones-y-balance.js`, v0.1.0, cinco ideas sin ejemplos ni «Lee»), su
ficha en `catalogo/cursos/quimica.json`, sus dos plantillas (`balance-reacciones`, escena con un motor que balancea por
álgebra, da EO, redox e ion-electrón en ácido y básico; `clasificar-reacciones`, generador de 60 ecuaciones compartido
con Electroquímica), los informes `estequiometria-ideas-erroneas.md` (ES11 a ES14),
`equilibrio-acidos-electroquimica-ideas-erroneas.md` (EC9, EC11) y `quimica-materia-nomenclatura-organica` (MA1 a MA8),
la investigación de ChatGPT de la etapa (`docs/investigacion/etapa9/quimica.reacciones-y-balance.md` y su versión breve),
`docs/temario-completo.md` (unidad 7), `catalogo/pruebas/quimica.json` (qui-13 ya es de esta unidad; las formas tienen 10
pares; qui-23 es el último de la reserva), las 24 preguntas de San Marcos de la unidad en `docs/datos/admision-unmsm.csv`
y las vecinas: `materia-y-energia.js` (idea 3: físico, químico y nuclear por las partículas; su «Mira» ya cuenta los átomos
del propano), `nomenclatura-inorganica.js` (idea 1: EO y «la suma de los EO es la carga»), `mol-y-composicion.js` (idea 6:
Lavoisier y sistema cerrado) y `estequiometria.js` (para no adelantar razón molar ni reactivo limitante).

---

## 0. Qué pregunta la admisión

- **San Marcos** (24 preguntas de la unidad entre 2019-I y 2027-I en `admision-unmsm.csv`): clasificación de reacciones
  (8: por su forma, por el calor, combustión que también es redox, reversible), balance redox ion-electrón en medio ácido
  (6, con el coeficiente del agua, los electrones ganados y la especie oxidada), agentes oxidante y reductor (4, el alto
  horno, la tostación), dismutación (2), balance y suma de coeficientes (4, casi siempre como paso de un cálculo).
- **UNI** (CEPRE-UNI, semanas 8 y 9): las mismas, más el medio básico y el método algebraico (investigación, §02; el
  examen UNI 2020-1 pidió el coeficiente del oxidante en medio básico).
- **Banco de academia** (temario, unidad 7): ion-electrón 43 fichas, clasificación 28, agentes 17, tanteo 14.

La rama del examen es: leer una ecuación → clasificarla → balancearla → decir quién se oxida → balancear la redox. Eso es
el orden de las ideas.

## 1. Diagnóstico de la teoría actual

1. Cinco ideas, **sin «Lee», sin ejemplos, sin «Así se resuelve», sin misiones, sin leyenda ni Datos** en ningún ejercicio.
2. **La idea 1 repite Materia y energía** (físico contra químico por las partículas, con el hielo y la sal), y su Predice
   (el sólido blanco de AgNO₃ con NaCl) la responde su propio juego, que muestra justo esa mezcla.
3. **La Predice de la idea 2 usa redox** (EO del hidrógeno y del oxígeno), que la unidad enseña en la idea 4.
4. **Colores contra la regla**: coeficientes naranja, EO verde (naranja–verde 0,010 en protanopía), y la lupa mezcla átomos
   con colores de variable (`color: 'o'` en Fe, `'h'` en O).
5. **Ion-electrón en una sola idea** con permanganato, sin el medio básico, sin igualar electrones con su regla y con «la
   suma de las cargas» como único distractor de carga.
6. El juego de la idea 3 mueve solo el H₂O (el alumno puede no tocar nada) y la mesa del laboratorio no tiene meta.

## 2. Qué se queda, qué cambia y qué sale

- **Se quedan**: las lupas de partículas (`quim-particulas`, ahora con la paleta de elementos), la recta de EO de la idea 4,
  el óxido de hierro de «Mira» de la idea 3, el alto horno de la Predice de la idea 4 (misma pregunta y mismas opciones) y
  la Predice del H₂O₂ de la idea 3 (misma pregunta y mismas opciones). Las dos mesas del laboratorio, con colores nuevos.
- **Cambian**: la idea 1 pasa de «¿hubo reacción?» a «qué dice la ecuación y qué indicio vas a ver»; la Predice de la idea
  2 pasa al calor del horno de cal; la idea 5 vieja (`ion-electron`) pasa a ser la 6, con el medio básico.
- **Entra**: la idea `cambio-eo` (igualar los electrones perdidos y ganados, con el conteo de átomos que cambian por
  fórmula y la dismutación), entre los agentes y el ion-electrón.
- **Salen**: las especies inventadas A, B, X, Y de la lupa en Mira y Predice (quedan solo en el juego de la idea 2, donde son
  el patrón); «Sí/No» como únicas opciones de la idea 1.
- **Plantillas**: `balance-reacciones` (escena) va a «Más mesas del tema» con `"rehacer": true`; su motor queda como el
  cálculo de toda la teoría (regla 1). `clasificar-reacciones` (generador compartido) se queda en la ficha con
  `"rehacer": ["quimica.reacciones-y-balance"]`, y su papel dice de qué unidad es cada problema. Práctica nueva
  `reacciones-practica` con `TIPOS_POR_IDEA`.

## 3. Las ideas, en orden

| # | `id` | Título (≤ 6 palabras) | `aprendizaje` |
| --- | --- | --- | --- |
| 1 | `indicios` | Indicios y ecuación química | Gas, precipitado, color o calor son indicios de reacción; la ecuación escribe reactivos → productos con su estado, y el (g) o el (s) anuncian lo que se verá. |
| 2 | `clasificar` | Clases de reacciones | Por su forma: adición, descomposición, desplazamiento simple o doble; por el calor: exotérmica o endotérmica. Una reacción lleva varias etiquetas a la vez. |
| 3 | `tanteo` | Balance por tanteo | Se cambian los coeficientes, nunca los subíndices, hasta que cada elemento tenga los mismos átomos a los dos lados, con los enteros más pequeños. |
| 4 | `oxida-reduce` | Oxidación, reducción y agentes | Oxidarse es perder electrones (sube el EO); reducirse, ganarlos (baja). El oxidante es el reactivo que se reduce; el reductor, el que se oxida. |
| 5 | `cambio-eo` (nueva) | Electrones perdidos, electrones ganados | Los electrones de una fórmula son los átomos que cambian por su salto de EO; se multiplica hasta que los perdidos sean los ganados y se balancea el resto. |
| 6 | `ion-electron` | Ion-electrón: ácido y básico | Cada semirreacción se balancea con H₂O (oxígeno), H⁺ (hidrógeno) y e⁻ (carga); se igualan electrones y se suman. En básico, H⁺ + OH⁻ se vuelven agua. |

**Por qué va cada una en su lugar y qué da por sabido**

- **1.** Da por sabido cambio físico y químico (Materia y energía, idea 3) y las fórmulas (Nomenclatura). Lo nuevo: la
  ecuación como registro (reactivos, productos, flecha, «+», estados) y la relación entre el estado escrito y el indicio
  que se ve. Nivel de examen: afirmaciones V/F sobre una ecuación con estados y calor.
- **2.** Usa la ecuación de la idea 1. La clasificación redox no entra aquí (es la idea 4); sí la combustión, la
  neutralización y la precipitación como etiquetas de lectura, y la doble flecha como reversible.
- **3.** Usa fórmulas y subíndices (Nomenclatura) y que los átomos se conservan (Materia y energía; Lavoisier está en Mol y
  composición). El paréntesis y la fracción que se multiplica son nivel 2 y 3; el método algebraico, un ejemplo de nivel 3.
- **4.** Usa el EO de Nomenclatura (la suma de los EO es la carga; sus reglas van en Datos). Aquí entran oxidación,
  reducción, agentes y «redox» como etiqueta (la combustión también es redox).
- **5.** Usa la idea 4 y el tanteo de la idea 3. Lo nuevo es contar electrones por fórmula (Fe₂O₃ gana 6, no 3), igualar
  con el mínimo común múltiplo y la dismutación (el mismo elemento sube y baja).
- **6.** Usa las ideas 4 y 5. Lo nuevo es el agua y el H⁺ como parte del registro, la carga como tercera cuenta y el medio
  básico.

## 4. Objeto de la primera pantalla

Pieza nueva `quim-reaccion` (dibujo de prueba, `data-prueba`), vista `objeto`, una por idea, en tinta:

| Idea | Objeto |
| --- | --- |
| 1 | La mesa del laboratorio del colegio con tres vasos: uno burbujea, otro tiene un sólido blanco en el fondo, otro humea. |
| 2 | Un horno de cal: piedras de caliza sobre el fuego. |
| 3 | La hornilla de la cocina con su llama de gas y una olla. |
| 4 | Una lámina de zinc en un vaso con solución azul de sulfato de cobre, que se va cubriendo de cobre. |
| 5 | Un alambre de cobre enrollado en un vaso con nitrato de plata, con los cristales de plata (el «árbol de plata»). |
| 6 | El frasco de permanganato de potasio, morado, con su gotero y un vaso. |

La vista `inventario` de la misma pieza es una tabla «izquierda | derecha» por elemento, carga o electrones, con la ecuación
arriba: la usan el juego de las ideas 5 y 6, sus «Mira» y los ejercicios.

## 5. Misión de «Juega»

| Idea | Juego | Misión (la comprueba el motor) |
| --- | --- | --- |
| 1 | Lupa antes y después de cuatro fenómenos (bicarbonato con ácido, agua que hierve, nitrato de plata con sal, cal viva con agua); la lectura escribe la ecuación con estados | Encuentra el caso con burbujas en que no se forma ninguna sustancia nueva. |
| 2 | Lupa del patrón de cada clase (A, B, X, Y, solo aquí) | Halla la clase en que dos compuestos intercambian sus parejas. |
| 3 | Lupa de CH₄ + O₂ → CO₂ + H₂O con tres coeficientes y la cuenta de C, H y O | Balancea la quema del gas con los enteros más pequeños. |
| 4 | Recta de EO de cuatro reacciones; los saltos se dibujan solos | Halla la reacción en que un no metal se reduce sin oxígeno. |
| 5 | Inventario de electrones de Cu + AgNO₃, con los dos coeficientes | Haz que el cobre pierda tantos electrones como gana la plata. |
| 6 | Inventario de O, H y carga de MnO₄⁻ → Mn²⁺ con H₂O, H⁺ y e⁻ | Balancea la semirreacción del permanganato: O, H y carga iguales. |

Las misiones de las ideas 1, 2 y 4 son de buscar entre opciones, como las de Enlace y Nomenclatura (se excusan igual en la
prueba de animación).

## 6. La predicción de cada idea

| Idea | Pregunta | Correcta | Distractores (error) |
| --- | --- | --- | --- |
| 1 | Na₂CO₃(ac) + CaCl₂(ac) → CaCO₃(s) + 2 NaCl(ac): ¿qué verás al mezclar las dos soluciones? | Un sólido blanco: CaCO₃ | NaCl que cristaliza (QM-PRECIP) · burbujas de CO₂ por el carbonato (QM-INDICIO-GAS) · nada: todo sigue disuelto (MA8) |
| 2 | CaCO₃(s) + calor → CaO(s) + CO₂(g), en el horno de cal: ¿cómo se clasifica? | Descomposición y endotérmica | descomposición y exotérmica (QM-CALOR-LADO) · adición y endotérmica (QM-CLASIF, leída al revés) · desplazamiento simple y exotérmica (QM-CLASIF) |
| 3 | (se queda) H₂ + O₂ → H₂O₂ para que cuadren los oxígenos: ¿qué pasó? | Cuadra, pero describe otra sustancia | otra forma válida (ES11) · no cuadra el H (ES12) |
| 4 | (se queda) El alto horno: Fe₂O₃ + 3 CO → 2 Fe + 3 CO₂: ¿el agente reductor? | El CO | Fe₂O₃ porque pierde oxígeno (EC9) · el Fe (QM-AGENTE) · el CO₂ (QM-AGENTE) |
| 5 | Fe₂O₃ pasa a Fe (EO +3 → 0): ¿cuántos electrones gana una unidad de Fe₂O₃? | 6 | 3, el de un solo hierro (S-IGN) · 5, salto más subíndice (S-SUM) · 0, porque es neutro (N-CAR) |
| 6 | NO₃⁻ → NO en medio ácido: ¿cuántas moléculas de agua y de qué lado? | 2 H₂O a la derecha | 3 H₂O a la derecha, una por O del nitrato (QM-AGUA-TODO) · 2 H₂O a la izquierda (QM-AGUA-LADO) · ninguna: la carga se arregla con electrones (W-CAR) |

Datos de cada Predice: solo valores y equivalencias («(s) sólido, (g) gas, (ac) disuelto en agua»; «exotérmica: libera
calor; endotérmica: absorbe calor»; los EO del hierro), nunca la relación que se predice. La 5 no se responde con lo
anterior: la idea 4 solo dice que el hierro baja de +3 a 0. La 6 no la responde el juego: el permanganato pasa a Mn²⁺, que
no tiene oxígeno, y ahí sí van todos los O como agua.

## 7. Tabla de letras y símbolos

| Símbolo | Un solo significado | Aviso |
| --- | --- | --- |
| EO | estado de oxidación de un átomo (viene de Nomenclatura) | La investigación lo escribe «N. O.»; la app ya usa EO |
| e⁻ | electrón | Nunca «e» suelta como incógnita |
| x | el número que se busca en un ejercicio (un coeficiente, los electrones de una semirreacción) | Una sola por ejercicio |
| a, b, c, d | coeficientes desconocidos, en ese orden, en el método algebraico | Solo en los ejemplos de nivel 3 de la idea 3 |
| Q | el calor que la reacción absorbe o libera | Solo en la idea 2 |
| (s), (l), (g), (ac) | sólido, líquido, gas, disuelto en agua | (ac) es el (aq) de los libros en inglés |
| → y ⇌ | se forma; reversible (va en los dos sentidos) | La flecha no es «=» |
| H⁺, OH⁻ | ion hidrógeno, ion hidróxido | No son variables |

## 8. Mapa de colores (un color fijo por magnitud, §5b)

| Magnitud o papel | Token | Por qué |
| --- | --- | --- |
| el coeficiente | `f` violeta | lo que se pide casi siempre (el coeficiente, la suma) |
| el EO | `o` naranja | el primer dato de toda redox |
| los electrones (e⁻ y cuántos) | `i` turquesa | el factor que une la oxidación con la reducción |
| la carga de un ion o de un lado | `h` carmín | lo que se iguala en el ion-electrón |
| fórmulas, subíndices, calor, nombres | tinta | etiquetas, no magnitudes |
| `d` verde | no se usa | naranja–verde 0,010 en protanopía |

Pares (molde §5b): naranja–violeta 0,189; turquesa–violeta 0,101; violeta–carmín 0,167; naranja–turquesa 0,114;
turquesa–carmín 0,077; naranja–carmín 0,062 (EO y carga van siempre con su signo y su nombre: «EO +7», «carga −1»). Las
partículas van con la paleta de elementos (`nucleo/elementos.js`) y nunca en la misma figura que un color de variable.

## 9. Práctica: qué existe y qué se hace

- `balance-reacciones` (escena, motor de 462 líneas con 16 casos y papel de 11 problemas sin Datos): a «Más mesas del
  tema» con `"rehacer": true`; el motor sigue como cálculo de la teoría.
- `clasificar-reacciones` (generador de 10 tipos con 60 ecuaciones, compartido con Electroquímica; papel de 16 problemas
  hechos a mano, sin `unidades` ni Datos): se queda con `"rehacer": ["quimica.reacciones-y-balance"]`, y a cada problema de
  su papel se le agrega `"unidades"` (cambio mínimo en un archivo compartido).
- **Nuevo `reacciones-practica`** con `TIPOS_POR_IDEA` (nivel 1, 2 y 3 por idea), banco propio de ecuaciones con sus
  coeficientes escritos y una prueba que los rehace con el motor de `balance-reacciones` (cálculo independiente):
  - `indicios`: hubo-reaccion (1) · indicio (2) · vf-ecuacion (3)
  - `clasificar`: forma (1) · calor (2) · dos-etiquetas (3)
  - `tanteo`: coeficiente (1) · suma (2) · fraccion (3)
  - `oxida-reduce`: agente (1) · salto-eo (2) · es-redox (3)
  - `cambio-eo`: electrones-unidad (1) · coef-oxidante (2) · suma-redox (3)
  - `ion-electron`: agua (1) · electrones (2) · global-acido (3) · basico (3)
- Papel con `herramientas/papel-generador.js` (Datos al final del enunciado).
- Prueba del curso: un par a la reserva (qui-24, ion-electrón: el coeficiente del agua en una global en medio ácido), con
  su recálculo en `catalogo/pruebas/verificar.js`.

## 10. Datos del mundo

Pocos y sin números inventados: el gas de la cocina como metano (el gas natural es casi todo metano), la cal viva como
CaO que sale de calcinar caliza, el permanganato de potasio como sal morada, el árbol de plata como demostración de aula.
Ningún dato puntual con número (no hace falta: la unidad cuenta átomos, cargas y electrones). Las reacciones son las de
los libros (OpenStax Chemistry 2e §4.1, §4.2 y §17.1, en el comentario de cabecera).

## 11. Riesgos de orden con otras unidades (`requiere`)

- Se queda `requiere: ['quimica.nomenclatura-inorganica']`: el EO y sus reglas vienen de ahí y van en Datos. La
  conservación de los átomos viene de Materia y energía (en la cadena de Nomenclatura).
- No adelanto razón molar, gramos ni reactivo limitante (Estequiometría): el coeficiente se lee como «cuántas moléculas o
  unidades».
- Electroquímica (pilas, potenciales) no entra: las semirreacciones se balancean, no se miden.
- El glosario no repite «estado de oxidación», «subíndice», «cambio químico», «ley de Lavoisier» ni «combustión»: ya están
  en el curso.

## 12. Decisiones tomadas (Gerson revisa después)

1. **Seis ideas, sin partir.** Motivo: los cinco temas del catálogo, con el balance redox en dos ideas (igualar electrones
   y el medio), que es lo que más pregunta San Marcos. Descartado: las seis de la investigación (con «Conservar la
   materia» como idea 2), porque Materia y energía y Mol y composición ya la enseñan; y siete ideas con el método
   algebraico aparte (va como ejemplo de nivel 3 del tanteo).
2. **La idea 1 deja «¿físico o químico?» a Materia y energía** y enseña la ecuación con estados y el indicio que anuncia.
   Su Predice nueva (CaCO₃ que precipita) no la responde el juego (que muestra AgCl). Descartado: las dos teteras de la
   investigación (es Materia y energía otra vez).
3. **Se conservan los ids** `indicios`, `clasificar`, `tanteo`, `oxida-reduce` e `ion-electron`; `tanteo` y `oxida-reduce`
   conservan pregunta e ids de sus opciones; `indicios`, `clasificar` e `ion-electron` cambian su Predice y van a
   `REHECHAS_E6` (marca `prediccionRB`), y quien terminó las cinco de antes conserva «Ya la estudié» (`estudiadaRB`).
4. **EO y no «N. O.»**, como en Nomenclatura. **x** para el número que se busca (n es la cantidad de sustancia en Mol).
5. **Colores**: coeficiente violeta, EO naranja, electrones turquesa, carga carmín, sin verde. Descartado: el mapa de hoy
   (EO verde junto al coeficiente naranja).
6. **El motor de `balance-reacciones` es el cálculo de la teoría** (balancear, EO, redox, semirreacción en ácido y
   básico, ion-electrón global); la escena va a «Más mesas del tema». El generador nuevo trae su banco con coeficientes y
   su prueba los rehace con ese motor.
7. **`clasificar-reacciones` se queda en la ficha con `rehacer`** para esta unidad: es rico (relacionar, redox, dismutación,
   aguas duras) y el repaso lo asigna entero a esta unidad. Descartado: sacarlo (Electroquímica se quedaría con un
   generador de reacciones) o escribirle Datos a mano a sus 16 problemas.
8. **Dismutación dentro de la idea 5** (condición de la regla, ejemplos de nivel 3 y «Ahora tú» de examen), no como idea.
9. **Objetos de prueba** en la pieza nueva `quim-reaccion` (mesa con tres vasos, horno de cal, hornilla, lámina de zinc,
   árbol de plata, frasco de permanganato) y su vista `inventario`, con su prueba numérica.
10. **No toco** `docs/datos/admision-unmsm.csv` ni `docs/teoria/matriz/quimica.json`.

### Decisiones tomadas al ejecutar (fases 2 a 5, 26 nov)

11. **Notas de la sesión a la idea 1** (aplicadas): cada vaso de la lupa es neutro y la mezcla conserva las partículas de
    los dos vasos (sin moléculas de agua sueltas que se confundían con OH⁻: el agua es el líquido del vaso); el zinc es un
    trozo en el fondo que se achica y el H₂ son burbujas que suben; la leyenda bajo cada vaso nombra todo lo que se ve
    («Fe(OH)₃(s): precipitado»); «soda cáustica (NaOH)», no «soda». La prueba de la unidad comprueba la neutralidad, los
    átomos de antes y después y que no haya dos elementos de colores cercanos en una lupa. La comprobación va en la prueba
    de la unidad (`reacciones-y-balance.test.js`) y no en `quim-reaccion`, porque las lupas son de `quim-particulas`.
12. **`quim-particulas` acepta `cuentaPorFila`** (cambio aditivo en una pieza compartida): la fila de la cuenta se parte en
    renglones; con cuatro especies por vaso, los rótulos se pisaban.
13. **Agua del cambio de estado**: 6 moléculas de agua antes y 6 de vapor después (antes eran 8 y 4).
14. **Electrones transferidos**: el motor de `balance-reacciones` los cuenta desde el que se oxida y suma también el HCl que
    no cambia (K₂Cr₂O₇ + HCl daba 14 en vez de 6). La teoría y la prueba del generador toman el menor de los dos lados; el
    motor no se tocó (es compartido).
15. **El agente que se pide actúa entero**: en «Ahora tú» de la idea 5 y en la práctica no se pide el coeficiente del HNO₃ o
    del HCl cuando parte queda como sal (Cu + HNO₃, K₂Cr₂O₇ + HCl): ahí se pide el otro agente.
16. **Flecha pegada a lo que sigue** («→» con espacio duro): `ecuaciones-ancho.js` marcaba 38 renglones partidos después de
    la flecha; ahora «todo cabe». Coeficiente y fórmula también van con espacio duro («2 H₂O» no se parte).
17. **Sin NaNO₃ escrito**: el validador lee «NaN» dentro de «NaNO₃»; se usan KNO₃, KCl y LiOH en su lugar.
18. **Mesa de las semirreacciones** sin el nitrato que pasa a NO (es la Predice de la idea 6 y el laboratorio se abre antes):
    va el nitrato que pasa a NO₂. La mesa ahora es un inventario de carga (`quim-reaccion`) en vez de `quim-fichas`.
19. **Prueba del curso**: qui-24 a la reserva (ion-electrón en medio ácido, coeficiente del reductor frente al dicromato),
    con su recálculo en `catalogo/pruebas/verificar.js` y tres códigos nuevos (IE-POR-ATOMO, IE-SIN-IGUALAR, IE-COEF-H).
20. **Avance**: entrada en `REHECHAS_E6` con las marcas `prediccionRQ` y `estudiadaRQ` (RB podía chocar con otra unidad).
