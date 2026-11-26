# Propuesta de ideas: «Reducción al primer cuadrante»

`trigonometria.reduccion-al-primer-cuadrante` · Etapa 9 del plan de calidad, segunda unidad de la rama «Ángulos de
cualquier medida» (la primera, «Ángulos en posición normal», tiene `calidad: 2` desde el 20 nov) · fases 1 a 5 con
criterio delegado (`docs/metodo/unidad/etapa-delegada.md`) · 26 nov 2026

Gerson delegó el criterio: esta propuesta es el guion de la unidad y se usa para escribirla. Las dudas van como
**decisiones tomadas** (sección 9), cada una con su motivo y la opción descartada. No hay ningún conflicto crítico.

**Estado (26 nov, fases 1 a 5 hechas):** las cinco ideas están escritas enteras (Lee con el objeto, juego con misión,
predicción, Mira, regla con dibujo, «Así se resuelve», «Ahora tú» de tres tipos con datos y nivel de examen, glosario con
`simple` y 15 ejemplos cada una), con un objeto nuevo en `trig-pos` (el ventilador, dibujo de prueba), el laboratorio de
dos mesas con los colores nuevos y la práctica nueva `plantillas/trig-reduccion/` (15 tipos, 30 casos verificados aparte y
8 de papel). La unidad no declara `calidad: 2`; con la marca simulada y 400 semillas, el validador no da faltas. Lo que
cambió durante la escritura está en la sección 9 (decisiones 13 a 17); la nota de la sesión sobre la idea 1 (α con su
propio color) cambió la decisión 5.

Lo que leí: `CLAUDE.md`, `docs/plan-calidad.md` §3, `docs/molde-unidad.md`, `docs/teoria.md` (4e a 4j y §5),
`docs/metodo/unidad/` (LEEME, 1-ideas, 2-ejemplos, 3-practica, reglas-validador y etapa-delegada), las decisiones de
`docs/etapa2/` a `docs/etapa8/`, `docs/etapa8/propuesta-trigonometria.md` (modelo de formato: títulos, §1, §5, §6, §9),
la unidad modelo `angulos-en-posicion-normal.js` (mapa, la idea 1 entera en código con sus ayudas, el cierre con glosario
y laboratorio, y su prueba propia), la pieza `trig-pos` y su prueba, la teoría actual de esta unidad (v0.1.0, cuatro ideas
sin contrato), su ficha en `catalogo/cursos/trigonometria.json`, sus dos plantillas (`circunferencia-trig`, escena
compartida, y `trig-oblicuangulos`, que no trae ningún tipo de reducción), `docs/investigacion/trigonometria-ideas-erroneas.md`
(TR11, TR12, TR14, TR15, TR16), la investigación de ChatGPT (`docs/investigacion/etapa9/trigonometria.reduccion-al-primer-cuadrante.md`
por secciones, y la versión breve para contrastar), `docs/temario-completo.md` (unidad 7), la prueba del curso
(`ct-01` y `ct-02` ya son de esta unidad), las tres preguntas de San Marcos de `docs/datos/admision-unmsm.csv` y, para no
repetir ni adelantar, el glosario y las ideas de «Razones trigonométricas» (cofunción y complementarios ya están ahí),
«Ángulo trigonométrico» (radianes) y «Circunferencia trigonométrica» (la que sigue: radio 1 y líneas).

---

## Lo que pregunta la admisión

**Catálogo:** UNI, semana 5; San Marcos, tema 6. **Banco Cuzcano:** ninguna ficha propia (el temario lo dice); los
formatos salen de los exámenes.

**San Marcos, admisión real 2019-I a 2027-I:** tres preguntas de esta unidad y cuatro de otras que la usan como paso.

| Periodo (examen) | Qué piden | Idea donde cae |
| --- | --- | --- |
| 2024-I (2 dic 2023, áreas D y E, n.º 42) | El valor absoluto de una suma de tangentes reducidas, con co-razón | 5, nivel examen. Trampa: conservar el signo positivo |
| 2024-I (9 dic 2023, área A, n.º 40) | El coseno de un ángulo obtuso que se forma al doblar un rectángulo | 2, nivel examen. Trampa: el coseno positivo |
| 2025-I (13 oct 2024, Medicina, n.º 41) | Una expresión con ángulos de más de una vuelta dentro de un problema de volumen | 4, nivel examen |
| 2022, 2027-I (tres) | Ecuaciones, transformaciones y ángulo doble con un paso de reducción | Fuera: son de unidades posteriores |

**UNI:** la investigación cita la pregunta 36 de Matemática 2025-I (una expresión con varias razones de ángulos no
agudos, recíprocas incluidas) y una de 2026-2 con minutos y segundos (atribución de un banco externo, sin cotejo). La
primera entra como formato de nivel examen en las ideas 2 y 5; la segunda queda fuera (decisión 8).

Pesa **reducir con el signo bien puesto** (las tres de San Marcos tienen como trampa el signo) y **combinar varias
reducciones en una expresión**. La co-razón aparece en una de tres.

---

## 0. Qué tiene hoy la unidad y qué se queda o sale

1. **Cuatro ideas** (`angulo-referencia`, `cofuncion`, `mayores-negativos`, `suplementarios-vuelta`) sin Lee, sin misión,
   sin ejemplos, sin «Así se resuelve» ni datos; el plano abstracto en todas las primeras pantallas; colores de la
   versión vieja (θ naranja, α verde junto a y roja: el par verde–naranja no se distingue en protanopía).
2. Lo que sirve: el orden «primero el tamaño, después el signo», los errores TR11, TR12, TR14 y TR15, y el laboratorio
   de dos mesas (`cualquier-giro` y `siete-relaciones`), que se quedan con sus `id` y los colores nuevos.
3. Lo que sale: la idea `suplementarios-vuelta` (180° − θ y 360° − θ son casos del ángulo de referencia: entran en las
   ideas 1 y 2); la predicción de la idea 1 de hoy (cos 210°, la misma que tendría la idea 2 nueva); la idea de la
   co-razón en segundo lugar (va al final, cuando el alumno ya reduce con 180° y 360°).
4. Lo que entra: el ángulo de referencia como idea propia, la paridad (sen(−θ) = −sen θ, que «Ángulos en posición normal»
   dejó para aquí) como idea propia, los radianes como dato en nivel examen, las seis razones (cot, sec y csc vienen de
   «Razones»), y la práctica `trig-reduccion` por idea.

---

## 1. Las ideas, en orden

Cinco ideas. No hace falta partir la unidad ni declarar `septimaIdea`.

| # | `id` | Título (≤ 6 palabras) | `aprendizaje` |
| --- | --- | --- | --- |
| 1 | `angulo-referencia` | El ángulo de referencia | α es el ángulo agudo entre el lado final de θ y el eje x: en el II, 180° − θ; en el III, θ − 180°; en el IV, 360° − θ. |
| 2 | `misma-razon` (nueva) | Misma razón, signo del cuadrante | Una razón de θ vale lo mismo que la misma razón de α, con el signo que esa razón tiene en el cuadrante de θ. |
| 3 | `opuestos` (nueva) | Ángulos opuestos: θ y −θ | −θ es el reflejo de θ en el eje x: x se queda e y cambia de signo; cos(−θ) = cos θ, sen(−θ) = −sen θ, tan(−θ) = −tan θ. |
| 4 | `mayores-negativos` | Primero se quitan las vueltas | Un ángulo de más de una vuelta pierde sus vueltas enteras (θ − 360° · n); uno negativo se vuelve positivo con −θ; después se reduce. |
| 5 | `cofuncion` | Con 90° y 270°, la cofunción | Con 90° ± φ o 270° ± φ la razón cambia a su cofunción; con 180° ± φ o 360° − φ se queda; el signo es el del cuadrante. |

Por qué este orden: la idea 1 da el tamaño (el agudo), la 2 le pone el signo y ya resuelve cualquier ángulo de 0° a
360°; la 3 y la 4 llevan cualquier ángulo (negativo o de varias vueltas) a ese caso; la 5 es la otra ruta, la que el
examen usa con expresiones de la forma 90° + φ, y junta todo en nivel examen. Ninguna usa algo de una idea posterior.

Temas del catálogo, uno por idea: «Ángulo de referencia» (nuevo), «Ángulos menores de una vuelta», «Ángulos negativos»,
«Ángulos mayores de una vuelta» y «Cofunción con 90° y 270°» (nuevo; reemplaza a «Ángulos suplementarios y de una vuelta»,
que pasa a ser parte de las ideas 1 y 2).

---

## 2. Objeto de la primera pantalla

Todos en la pieza `trig-pos` (el plano de `trig-plano` con un objeto detrás, tenue). Son dibujos de prueba.

| Idea | Objeto | Qué es el origen y qué es P | Por qué ese |
| --- | --- | --- | --- |
| 1 | La veleta de la plaza, vista desde arriba | El poste; la punta de la flecha | La flecha se aparta de la línea este–oeste: ese apartamiento agudo es α |
| 2 | La rueda de la fortuna (unos 10 m de radio) | El centro; la cabina | Dos cabinas a la misma altura tienen el mismo seno; la gemela del cuadrante I lleva α |
| 3 | El reloj de pared | El eje de las agujas; la punta del minutero | El minutero en el 1 y en el 5 están a la misma distancia del 3: θ = 60° y −θ = −60° |
| 4 | La rueda de bicicleta levantada en el taller | El eje; la válvula | Da varias vueltas y la válvula vuelve a los mismos lugares (lo que la unidad anterior llamó coterminales) |
| 5 | Un ventilador de techo, visto desde abajo (objeto nuevo `ventilador` en `trig-pos`) | El eje; la punta de cada aspa | Cuatro aspas a 90°: lo que una sube, la siguiente lo avanza hacia la izquierda |

---

## 3. Misión de «Juega» (meta que el motor comprueba)

| Idea | Controles (rango que no muestra la predicción) | Misión | Única porque |
| --- | --- | --- | --- |
| 1 | θ de 0° a 180°, de 10° en 10° (solo la mitad norte) | «Deja la flecha al noroeste, a 40° de la línea este–oeste.» | θ = 140° es el único del II con α = 40° |
| 2 | θ de 0° a 360°, de 15° en 15°; la lectura da solo el seno | «Pon la cabina abajo a la izquierda, con sen θ = −1/2.» | Abajo a la izquierda (III) solo 210° tiene ese seno |
| 3 | θ de 0° a 180°, de 30° en 30° (el minutero de −θ va en un número); la lectura da solo el seno | «Pon el minutero de −θ en el 5.» | −θ = −60° (θ = 60°) es el único en el 5 |
| 4 | θ de 360° a 1080°, de 30° en 30°; la lectura quita vueltas y da α, sin valores | «Da más de dos vueltas y deja la válvula abajo, a 30° del eje x, a la derecha.» | Entre 720° y 1080° solo 1050° termina en 330° |
| 5 | φ de 0° a 80°, de 10° en 10°; la lectura da solo sen(90° + φ) = cos φ | «Gira hasta que el aspa B suba justo la mitad de su largo.» | sen(90° + φ) = 1/2 solo con φ = 60° |

---

## 4. La predicción de cada idea

Ninguna la muestra el juego, el Lee, la leyenda ni el glosario. `datos` solo con valores y equivalencias.

| Idea | Pregunta | Correcta | Distractores (error) | Datos |
| --- | --- | --- | --- | --- |
| 1 | La flecha gira 250°, hasta el suroeste. ¿Cuánto mide su ángulo de referencia α? | 70° | 20° (mide hasta el eje y: TRRD-EJE-Y, documentado como E-REF), 110° (lo que falta para la vuelta, 360° − θ: TRRD-FORMULA), 250° (toma θ por α: TRRD-THETA, E-REF) | 1 vuelta = 360°; media vuelta = 180° |
| 2 | cos 60° = 1/2. ¿Cuánto vale cos 240°? | −1/2 | 1/2 (sin signo: TR12), −√3/2 (cambia a seno: TR14), √3/2 (TR14 y TR12) | cos 60° = 1/2; sen 60° = √3/2 |
| 3 | cos 60° = 1/2. ¿Cuánto vale cos(−60°)? | 1/2 | −1/2 (ángulo negativo, razón negativa: TR15), −√3/2 (TR15 y TR11), √3/2 (TR11) | cos 60° = 1/2; sen 60° = √3/2 |
| 4 | ¿Cuánto vale cos 480°? | −1/2 | 1/2 (quita la vuelta y olvida el signo: TR12), −√3/2 (mide 30° desde el eje y: TRRD-EJE-Y), √3/2 (los dos errores) | 1 vuelta = 360°; cos 60° = 1/2; cos 30° = √3/2 |
| 5 | sen 20° ≈ 0,34 y cos 20° ≈ 0,94. ¿Cuánto vale cos 110°? | ≈ −0,34 | ≈ −0,94 (conserva el coseno: TR14), ≈ 0,34 (sin signo: TR12), ≈ 0,94 (TR14 y TR12) | sen 20° ≈ 0,34; cos 20° ≈ 0,94; 110° = 90° + 20° |

En la idea 5 los datos no traen cos 70°: la ruta del ángulo de referencia (α = 70°) no se puede terminar con ellos, y el
alumno tiene que ver que 110° es 90° + 20°.

---

## 5. Tabla de letras y símbolos (va también en el campo `letras`)

| Letra | Un solo significado en la unidad | Aviso |
| --- | --- | --- |
| θ | El ángulo que se reduce, en posición normal | Como en toda la rama |
| α | El ángulo de referencia de θ: agudo, entre el lado final y el eje x | En «Ángulos en posición normal», α era «otro ángulo del problema»: aquí no |
| β | Otro ángulo del mismo problema (en un par de ejemplos de examen) | |
| φ | Un ángulo agudo que acompaña a 90°, 180°, 270° o 360° en la idea 5 (90° + φ) | En «Triángulos rectángulos», φ era el ángulo de observación: es otra unidad |
| P | La punta del objeto, un punto del lado final | P′, su reflejo (idea 3) o la gemela (idea 2) |
| x, y | La abscisa y la ordenada de P, con su signo | |
| r | El radio de la rueda o el largo de la flecha o del aspa | |
| n | Un número entero de vueltas | |

---

## 6. Mapa de colores (§5b: un color fijo por magnitud en la unidad)

Es el de la rama (el de «Ángulos en posición normal»).

| Token | Magnitud | Dónde |
| --- | --- | --- |
| `h` carmín | **Los ángulos** θ, φ y β, con su arco desde el eje x positivo | Las cinco ideas |
| `f` violeta | **El ángulo de referencia α**, con su arco del lado final al eje x, sin flecha | Las cinco ideas (nota de la sesión, 26 nov) |
| `o` naranja | **La ordenada** y (lo que sube o baja P) | Las cinco ideas |
| `i` turquesa | **La abscisa** x (lo que P avanza a la derecha o a la izquierda) | Las cinco ideas |
| tinta | El lado final, los objetos, los ejes, lo que se pide antes de hallarlo («?»), el signo, el cuadrante y **el valor de una razón en la respuesta** (en negrita) | Todas |
| `d` verde | No se usa | — |

Regla de la respuesta: α en violeta, θ en carmín; el valor de una razón y una expresión reducida («−sen φ»), en tinta y
negrita; un signo o un cuadrante, en tinta y negrita.

---

## 7. Práctica y datos del mundo

### 7a. Qué existe y qué falta

| Idea | Hay | Falta (tipos de `trig-reduccion`) |
| --- | --- | --- |
| 1 | nada | `referencia` (1) α de un θ de 0° a 360° · `theta-desde-alfa` (2) θ con su α y su cuadrante · `suma-referencias` (3) suma de los ángulos de 0° a 360° con un α dado |
| 2 | p5 del papel de `circunferencia-trig` | `valor` (1) una razón de θ con su α notable · `reciproca` (2) sec, csc o cot de θ · `expresion` (3) suma y producto de razones reducidas |
| 3 | p6 del papel (con vueltas) | `opuesto` (1) una razón de −θ agudo · `opuesto-obtuso` (2) una razón de −θ con θ de 90° a 360° · `cociente-opuestos` (3) E = sen(−θ)/sen θ + cos(−θ)/cos θ y parecidos |
| 4 | nada | `vueltas` (1) una razón de un θ de 360° a 1440° · `negativo-grande` (2) una razón de −θ con vueltas · `radianes` (3) una expresión con vueltas en grados y en radianes |
| 5 | nada | `cofuncion` (1) la expresión reducida de 90° ± φ o 270° ± φ · `cofuncion-valor` (2) con sen φ o cos φ dados · `expresion-cof` (3) un producto o una suma de varias reducciones (San Marcos 2024-I) |

**Plantilla nueva `plantillas/trig-reduccion/`**, formato `predicciones`: generador con `TIPOS_POR_IDEA` (tres por
idea, niveles 1 a 3), prueba, `casos.json` verificado con un cálculo aparte y `papel.json` con sus datos al final.
`circunferencia-trig` se queda en la ficha con `"rehacer"` para esta unidad (va a «Más mesas del tema»); sus p5 y p6 ya
dicen de qué unidad son. `trig-oblicuangulos` sale de la ficha y de la lista de unidades de su plantilla: no tiene ningún
tipo de reducción y su papel no dice de qué unidad es cada problema (decisión 10). Dos ítems nuevos para la prueba del
curso, a la **reserva** (las formas ya tienen 10 pares): `tri-18` (una razón de un ángulo negativo, paridad) y `tri-19`
(una expresión con cofunción).

### 7b. Datos del mundo

| Dato | ¿Fuente? |
| --- | --- |
| Rueda de la fortuna de unos 10 m de radio | Valor de problema, con «unos» |
| Flecha de veleta, aspa de ventilador, rueda de bicicleta | Sin medidas: el problema no las usa (las razones no dependen del largo) |
| El minutero: 30° entre dos números | Del reloj mismo |
| Historia: Rheticus y el *Opus Palatinum* | Ya trae fuente (MacTutor) |

---

## 8. Riesgos de orden con otras unidades (`requiere`)

**Lo que esta unidad da por sabido** (`requiere`: «Ángulos en posición normal», que a su vez pide «Razones» y «Ángulo
trigonométrico»): las razones con P(x, y) y r, los signos por cuadrante, los cuadrantales, el giro horario y los
coterminales; de «Razones», los valores notables (30°, 45°, 60°, 37°, 53°), cot, sec, csc y la cofunción de
complementarios; de «Ángulo trigonométrico», π rad = 180°. Los valores notables y la regla de signos van como dato en
cada ejercicio (punto 13: criterio, no memoria).

**Dentro de la unidad:** 2 usa 1; 3 usa 2 (para −θ con θ obtuso); 4 usa 1 a 3; 5 usa 1 a 4. Ninguna usa algo posterior.

**Lo que no hay que adelantar:** la circunferencia de radio 1 y las líneas (Circunferencia trigonométrica), las
identidades (sen² + cos² = 1, tan = sen/cos: Identidades fundamentales), el seno de una suma (Arcos compuestos), el
período como concepto de función (Funciones trigonométricas). Por eso la idea 5 no demuestra la cofunción con sen(a + b),
sino con el cuarto de vuelta del punto: (x, y) gira 90° y queda en (−y, x).

**Lo que otras unidades toman de aquí:** «Circunferencia trigonométrica», «Triángulos oblicuángulos» (cos de un obtuso)
y «Ecuaciones trigonométricas» piden reducir. Los códigos TR11, TR12, TR14 y TR15 se conservan.

**Avance de los alumnos:** se conservan `angulo-referencia`, `mayores-negativos` y `cofuncion` (las tres con otra
Predice), sale `suplementarios-vuelta` y entran `misma-razon` y `opuestos`. La unidad entra en `REHECHAS_E6` de
`nucleo/avance.js` (una línea con su prueba): las predicciones viejas sin huella de esas tres ideas se vuelven a
preguntar una vez, y quien había terminado las cuatro ideas de antes conserva «Ya la estudié». Las mesas conservan sus
`id`.

---

## 9. Decisiones tomadas (Gerson revisa después)

1. **Cinco ideas, con dos nuevas (`misma-razon` y `opuestos`) y sin `suplementarios-vuelta`.** Motivo: la idea 1 de hoy
   enseñaba a la vez el ángulo agudo y el signo, y su predicción ya era el valor con signo; separarlas deja una
   predicción para cada paso. La paridad tenía media idea dentro de «mayores y negativos». Los suplementarios y los de
   una vuelta son dos filas de la regla de la idea 1. Descartado: las cinco ideas de la investigación (sus ideas 1 y 2,
   vueltas y signos, ya las enseña «Ángulos en posición normal»; su idea 5, condiciones de existencia y cancelación, es
   de «Identidades fundamentales»).
2. **La cofunción al final, sin demostrarla con el seno de una suma.** Motivo: es la ruta que el examen usa en
   expresiones (San Marcos 2024-I) y necesita ya la regla del signo. La justificación es el cuarto de vuelta del punto
   (el aspa del ventilador): (x, y) pasa a (−y, x). Descartado: dejarla en segundo lugar como hoy, o la escuadra de la
   investigación (explica 90° − φ, que ya enseña «Razones»).
3. **Objetos:** la veleta, la rueda de la fortuna, el reloj y la bicicleta de la unidad anterior, y un ventilador de
   techo nuevo en `trig-pos` (bloque propio, cambio aditivo en una pieza compartida). Motivo: la rama ya los presentó y el
   alumno los reconoce; el ventilador es el objeto de cuatro brazos a 90° que pide la cofunción. Descartado: la escuadra,
   la calculadora y la moneda de la investigación (no muestran el giro).
4. **α es el ángulo de referencia en toda la unidad, y φ el agudo de la idea 5.** Motivo: es la letra de los libros y de
   la academia para la referencia; la investigación usa la misma. α cambia de sentido respecto de la unidad anterior
   (allí era «otro ángulo»): se avisa en la tabla de letras y en el glosario. Descartado: β para el representante entre 0°
   y 360° (la investigación lo propone): aquí «quitar vueltas» ya tiene nombre (el coterminal de la unidad anterior) y
   otra letra sobraría.
5. **α en violeta; θ, φ y β en carmín; el valor de una razón en tinta y negrita** (cambiada por la nota de la sesión a la
   idea 1: «un color por variable», θ y α no comparten color). Motivo: de los cinco colores, el verde no puede ir junto
   al naranja de y (0,010 en protanopía) y el violeta era el de la razón pedida; la razón pasa a tinta, como el signo y
   el cuadrante. Descartado: α en verde (protanopía) y la primera versión, θ y α en carmín.
6. **Radianes solo como dato, en los niveles 2 y 3 de la idea 4 y en el examen de la idea 5** («π rad = 180°»). Motivo:
   el examen los mezcla, pero la idea no es convertir (eso es de «Ángulo trigonométrico»). Descartado: una idea propia.
7. **La predicción de la idea 5 usa 20° con valores aproximados** (sen 20° ≈ 0,34, cos 20° ≈ 0,94). Motivo: con 30° la
   ruta de la idea 2 (α = 60°) da la respuesta sin mirar la cofunción; con 20° los datos no traen cos 70° y solo la
   cofunción termina. Descartado: cos 120° con los notables.
8. **Fuera: minutos y segundos, condiciones de existencia y cancelaciones.** Motivo: la pregunta UNI con minutos tiene
   atribución sin cotejo, y la resta sexagesimal es de «Ángulo trigonométrico»; las condiciones de una expresión son de
   «Identidades fundamentales» (su idea 2, «Recíprocas y cocientes, con dominio»). Un ángulo sobre un eje sí aparece,
   como en la unidad anterior: «no tiene ángulo de referencia», y sus razones salen del punto.
9. **Los datos de cada ejercicio traen la regla de signos y los valores notables que el caso usa** (también los que no
   usa, cuando el ejercicio practica elegir), y desde la idea 2 la regla «misma razón de α, signo del cuadrante de θ».
   Nunca el valor con su signo ni la razón ya reducida. Motivo: punto 13.
10. **`trig-oblicuangulos` sale de esta unidad.** Motivo: no tiene ningún tipo de reducción (su generador no separa por
    unidad), y con `calidad: 2` la regla `papel-unidades` pediría marcar sus ocho problemas, que son de Oblicuángulos.
    Cambio mínimo en su `plantilla.json` (compartido). Descartado: marcar su papel con `"unidades"` (la práctica no sería
    de esta unidad).
11. **Un objeto nuevo en una pieza compartida** (`trig-pos`, tipo `ventilador`): bloque propio, la lista de objetos de
    la prueba de la pieza suma uno; ningún dibujo de la unidad anterior cambia.
12. **Errores:** TR11, TR12, TR14 y TR15 de la investigación de la rama (parciales); los nuevos son hipótesis de aula:
    TRRD-EJE-Y (mide el agudo hasta el eje y; la investigación lo marca como documentado en Díaz Landaverde y Hernández,
    2025, figuras 10–11, como E-REF), TRRD-THETA (toma θ por α), TRRD-FORMULA (usa la cuenta de otro cuadrante),
    TRRD-SIGNO-REF (pone el signo de α, siempre positivo, en vez del de θ), TRRD-VUELTAS (quita una vuelta de menos o de
    más) y TRRD-LINEAL (reparte la razón en una suma: TR16).
13. **Datos sin «=» partido**: la cuenta de α y la regla de −θ van en palabras en el recuadro («Cuenta de α: en el II,
    180° − θ…», «Con −θ, cambian de signo sen, tan, cot y csc; cos y sec quedan igual»). Motivo: a 390 px las igualdades
    se partían después de «=» (`ecuaciones-ancho.js`). La regla de cada idea sí las escribe como igualdades.
14. **Figuras sin escala donde se pide θ** (idea 1, ejemplos 6, 7, 11, 12, 14 y 15, y los tipos «θ desde α» y «θ + β»):
    el lado final va en el cuadrante correcto pero a otro ángulo, y el enunciado dice «El dibujo no está a escala».
    Donde θ es dato y se pide α, la figura va a escala (es el dato dibujado).
15. **Los juegos de las ideas 2 y 3 solo dan senos**, para que la predicción (un coseno) sea nueva; el de la idea 4 no da
    valores; el de la idea 5 da sen(90° + φ) = cos φ y la predicción pide cos(90° + φ).
16. **«Ahora tú» con φ simbólico compara el texto entero** (no solo los números) para no repetir ejemplos: con solo los
    números, 90° + φ y 270° + φ quedaban fuera y salía siempre 360° − φ.
17. **Prueba del curso, a la reserva:** `tri-18` (sen(−1110°) y sen(−780°): vueltas y el menos de −θ) y `tri-19`
    (tan(90° + φ) con tan φ = 1/2 y 1/3), con su verificador aparte en `catalogo/pruebas/verificar.js` y seis códigos
    nuevos en su diccionario. La mesa `cualquier-giro` practica las ideas 4 y 2; `siete-relaciones`, las ideas 5 y 3.
