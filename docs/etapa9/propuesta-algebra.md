# Propuesta de ideas: «Binomio de Newton» (`algebra.binomio-de-newton`)

Etapa 9 del plan de calidad, rama «Expresiones algebraicas» (séptima y última unidad, después de «Exponentes y
radicales», «Productos notables», «Polinomios», «División de polinomios», «Factorización» y «Ecuaciones polinomiales») ·
encargo con criterio delegado (`docs/metodo/unidad/etapa-delegada.md`) · 26 nov 2026

Gerson: delegaste el criterio, así que esta propuesta ya está aplicada (la unidad entera, sin `calidad: 2`). Lo que decidí
sin ti está al final, en «Decisiones tomadas (Gerson revisa después)», cada punto con su motivo y la alternativa que
descarté. No encontré ningún conflicto crítico.

Lo que leí: `CLAUDE.md`, `docs/plan-calidad.md` §3, `docs/molde-unidad.md`, `docs/teoria.md` (4e a 4j, §5),
`docs/metodo/unidad/` (LEEME, 1-ideas, 2-ejemplos, 3-practica, reglas-validador, etapa-delegada), las decisiones de las
etapas 2 a 8, la propuesta modelo (`docs/etapa8/propuesta-algebra.md`), la unidad anterior de la rama con `calidad: 2`
(`ecuaciones-polinomiales.js`: cabecera, idea 1 en código, glosario, letras, laboratorio y su prueba propia), la teoría
actual (`binomio-de-newton.js`, v0.2.0), su ficha en `catalogo/cursos/algebra.json`, su escena (`binomio-newton`, con
papel), la investigación de ChatGPT (`docs/investigacion/etapa9/algebra.binomio-de-newton.md`, por secciones, y la breve),
`docs/temario-completo.md` §19, `catalogo/pruebas/algebra.json` (no hay ítems de esta unidad),
`docs/datos/admision-unmsm.csv` y las unidades vecinas: «Productos notables» (su idea 3 abre el cubo de (a + b)³ en ocho
piezas) y «Análisis combinatorio» de Aritmética (en `requiere`: presenta el factorial y el número combinatorio, sin el
contrato todavía).

## Qué se pregunta en los exámenes

- **San Marcos:** en `docs/datos/admision-unmsm.csv` hay **una** pregunta: 2026-I, áreas B y C, n.º 40: el exponente
  del binomio se halla con un término dado y después se usa en una cuadrática. El error que anota el solucionario: usar
  el índice del término igual a su lugar. La investigación cita además San Marcos 2025-II (Medicina, exponentes internos
  desde un término de lugar dado), de una transcripción externa sin cotejar.
- **UNI:** el sílabo CEPRE-UNI 2026-2 trae el binomio en Álgebra (semana 20) y el **binomio generalizado** junto a las
  progresiones; la única pregunta oficial ubicada es de ingreso directo (resto de una potencia grande, con divisibilidad).
- **Banco Cuzcano** (temario §19, unas 100 fichas): término general 19, desarrollo 17, sumas con números combinatorios
  15, término independiente 13, potencia de un polinomio 12. Son de academia: inspiran tipos, no se copian.
- Prioridad que resulta: el término general y el término por su exponente (independiente o de grado dado) son el núcleo;
  número de términos, términos centrales y suma de coeficientes los consolidan; el exponente no natural y el trinomio
  cierran los dos temas del catálogo que piden otra herramienta.

---

## 0. Diagnóstico de la teoría actual contra el contrato

`binomio-de-newton.js` (v0.2.0, `estado: 'completa'`, sin `calidad: 2`) tiene 4 ideas: `pascal-elecciones` (triángulo de
Pascal con una fila que se arrastra), `termino-general` (tabla de términos de (2x + 1)ⁿ), `exponente-no-natural` (curva
exacta y suma parcial de (1 + x)^α) y `potencia-trinomio` (tabla de coeficientes multinomiales); cuatro mesas.

1. **Punto 1: ninguna primera pantalla tiene un objeto.** Las cuatro juegan con el triángulo, tablas o una gráfica.
2. **Puntos 2, 3 y 12:** sin `mision`, `leyenda`, `aprendizaje`, `actividad` ni `pregunta`; las consignas describen
   controles («Elige el exponente n…»).
3. **Punto 13:** ningún ejercicio trae `datos`; 0 de 60 ejemplos; el glosario no tiene `simple` ni tres ejemplos.
4. **§5b, colores viejos:** el coeficiente en verde junto a la a naranja (protanopía), el error en carmín, k turquesa y
   también b, con la fila de Pascal en verde.
5. **Lo previo delata:** Lee de la idea 1 escribe (a + b)² = a² + 2ab + b² y dice «cada número suma los dos de arriba»
   antes de jugar; el título de la idea 2 («El término k + 1 lleva bᵏ») es su regla.
6. **Huecos del temario:** el término independiente, el número de términos, los términos centrales y la suma de
   coeficientes (más de un tercio del banco) no tienen idea propia: salen sueltos en «Ahora tú».
7. **«Así se resuelve» es «Ahora tú» con la semilla + 900.**
8. **Práctica:** la ficha lista solo la escena `binomio-newton` (un tablero de caminos con papel de 41 problemas). No hay
   práctica por idea.

---

## 1. Las ideas, en orden

**Seis ideas.** Conservan su `id` las cuatro de antes (con otra Predice); entran `termino-buscado` y `suma-coeficientes`.

| # | `id` | Título | `aprendizaje` |
| --- | --- | --- | --- |
| 1 | `pascal-elecciones` | Elegir en cada paréntesis | Cada término de (a + b)ⁿ sale de elegir a o b en cada paréntesis; el coeficiente de aⁿ⁻ᵏbᵏ cuenta las maneras de elegir k veces b: C(n, k). |
| 2 | `termino-general` | El término de lugar k + 1 | El término de lugar k + 1 es C(n, k)aⁿ⁻ᵏbᵏ, con a y b enteros: su número y su signo también se elevan. |
| 3 | `termino-buscado` | Un término por su exponente | Para hallar el término independiente o el de un exponente dado, se escribe el exponente de x del término general y se iguala. |
| 4 | `suma-coeficientes` | Cuántos términos y cuánto suman | (a + b)ⁿ tiene n + 1 términos, con uno o dos centrales; sus coeficientes suman lo que vale con cada letra igual a 1. |
| 5 | `exponente-no-natural` | Exponente que no es natural | Con α fraccionario o negativo, (1 + x)^α no termina: sus coeficientes son α(α − 1)…(α − k + 1)/k! y la suma sirve si x está entre −1 y 1. |
| 6 | `potencia-trinomio` | La potencia de un trinomio | En (a + b + c)ⁿ, el coeficiente de aᵖbᵠcʳ es n!/(p! q! r!), con p + q + r = n. |

`pregunta` (Resumen): 1 «¿De dónde salen los coeficientes de (a + b)ⁿ?» · 2 «¿Cómo se halla un término sin desarrollar
todo?» · 3 «¿Cómo se encuentra el término que no tiene x?» · 4 «¿Cuántos términos tiene (a + b)ⁿ y cuánto suman sus
coeficientes?» · 5 «¿Qué pasa con el desarrollo si el exponente no es natural?» · 6 «¿Cómo se desarrolla un trinomio
elevado a n?».

**Por qué va cada una ahí y qué da por sabido**

1. **Elegir en cada paréntesis.** La base: (a + b)ⁿ es multiplicar n paréntesis, y cada término sale de elegir una letra
   en cada uno. Da por sabido distribuir (Productos notables, donde ya se abrió (a + b)² y (a + b)³) y, de «Análisis
   combinatorio», el factorial y el número combinatorio como herramienta (van como dato; decisión 1). Aquí se ve por qué
   el número combinatorio es el coeficiente: cuenta en qué paréntesis se eligió b. El triángulo de Pascal entra como la
   tabla de esos conteos (cada número suma los dos de arriba) y la simetría C(n, k) = C(n, n − k).
2. **El término de lugar k + 1.** Con lo de la 1, el término que lleva k veces b, escrito con su lugar (t₍ₖ₊₁₎, como
   el «término de lugar k» de División). Lo nuevo: a y b son monomios con número y signo, que se elevan enteros.
3. **Un término por su exponente.** Con el término general de la 2 escrito en x, el exponente de x depende de k: igualarlo
   a 0 da el término independiente; a un número, el de ese grado. Si no sale un k natural entre 0 y n, ese término no
   existe. Incluye hallar n o un parámetro (la pregunta de San Marcos 2026-I).
4. **Cuántos términos y cuánto suman.** Cuántos valores toma k (n + 1), cuál está al medio (uno o dos centrales, con el
   lugar de la 2) y la suma de coeficientes (letras = 1), con la de (a + b)ⁿ, 2ⁿ, como caso. Va después de la 3 porque
   el término central se halla con el término general.
5. **Exponente que no es natural.** Lo que pasa con la fórmula de los coeficientes cuando α no es natural: el factor
   (α − k) nunca llega a 0. Se queda en (1 + x)^α con los primeros términos y la condición −1 < x < 1, sin series ni
   convergencia formal (decisión 3).
6. **La potencia de un trinomio.** Al final, porque extiende la 1 a tres letras: elegir a, b o c en cada paréntesis.

**Qué no entra** (decisión 3 y 7): sumas de combinatorios con índices (∑ k C(n, k)), restos con el binomio
(divisibilidad, de Aritmética), el binomio generalizado con convergencia y cotas de error, el término máximo y el número
de términos racionales de una potencia con radicales.

---

## 2. Objeto de la primera pantalla

Sigue el hilo de la rama: **el maestro Rubén enchapa pisos en Juliaca.** Ahora arma **cenefas**: una franja de n losetas
en fila, cada una **blanca o gris**. Cada loseta es un paréntesis de (a + b)ⁿ: blanca es elegir a, gris es elegir b. Una
cenefa con 2 grises de 5 es un producto a³b²; todas las cenefas con 2 grises juntas dan el coeficiente.

| Idea | Objeto (primera tarjeta de «Lee» y juego) | Qué es cada cosa |
| --- | --- | --- |
| 1 | **Las cenefas de Rubén** (Lee y juego): todas las franjas de n losetas con k grises | blanca: a; gris: b; el número de cenefas: el coeficiente |
| 2 | **Una cenefa de 5 losetas** con 2 grises (Lee) y **el cuaderno de Rubén** con la lista de términos de (2x − 1)⁵ (juego) | el lugar de la cenefa en la lista y las k grises |
| 3 | **La cenefa con rótulos**: cada blanca aporta x² y cada gris 1/x (Lee y juego) | el exponente de x que suma la cenefa |
| 4 | **Todas las cenefas de n losetas** agrupadas por grises (Lee y juego) | cuántos grupos hay (términos) y cuántas cenefas en total (la suma) |
| 5 | **La calculadora** (Lee: √1,02 con dos y tres términos) y **el cuaderno con los coeficientes** de (1 + x)^α (juego) | el coeficiente que se vuelve 0 o nunca llega a 0 |
| 6 | **Cenefas de tres colores**: blanca, gris y negra (Lee y juego) | blanca a, gris b, negra c; el número de cenefas con p, q y r de cada color |

Piezas: **una nueva, `alg-cenefa`** (dibujo de prueba): las franjas de losetas en una rejilla (cada loseta con su letra
dentro: el color guía, la letra identifica), agrupadas por cuántas grises tienen, con rótulos por loseta («x²», «1/x»)
y el conteo de cada grupo; y la fila de paréntesis «(a + b)(a + b)…» con la letra elegida marcada en cada uno. Las demás
ya existen y no se tocan: `alg-tabla` (el cuaderno), `ejes` (la mesa de la serie) y `alg-cubo-3d` (la mesa del cubo).
La calculadora de la Lee 5 sale de `arit-calculadora` (compartida; solo se usa).

---

## 3. Misión de «Juega»

| Idea | Contexto + misión | Controles | `logrado` | Lectura en vivo |
| --- | --- | --- | --- | --- |
| 1 | «Rubén arma cenefas de n losetas, blancas o grises. Cada cenefa es una manera de elegir a o b en los paréntesis.» **Haz que salgan exactamente 6 cenefas distintas.** | n de 1 a 4; k (grises) de 0 a n | n = 4, k = 2 | «4 losetas con 1 gris: 4 cenefas, el término 4a³b» |
| 2 | «En el cuaderno, Rubén escribe los términos de (2x − 1)⁵ en orden.» **Marca el término cuyo número es −40.** | el lugar marcado, de 1 a 6 | lugar 4 (k = 3) | «Lugar 3: k = 2, C(5, 2) · (2x)³ · (−1)² = 80x³» |
| 3 | «En (x² + 1/x)⁶, cada blanca aporta x² y cada gris 1/x.» **Encuentra la cenefa cuyo término no tiene x.** | k (grises) de 0 a 6 | k = 4 | «2 blancas y 4 grises: x⁴ · x⁻⁴: exponente 0» |
| 4 | «Rubén guarda todas las cenefas de n losetas, juntas por cuántas grises tienen.» **Haz que haya 16 cenefas en total.** | n de 1 a 6 | n = 4 | «n = 3: 4 grupos y 1 + 3 + 3 + 1 = 8 cenefas» |
| 5 | «En el cuaderno están los coeficientes de (1 + x)^α, uno tras otro.» **Elige el α con el que el desarrollo tiene justo 4 términos.** | α: 2, 3, −1, −2 | α = 3 | «α = −1: 1, −1, 1, −1, …: ninguno es 0» |
| 6 | «Ahora Rubén usa tres colores: blanca (a), gris (b) y negra (c), en 4 losetas.» **Arma un grupo de 12 cenefas.** | cuántas grises y cuántas negras (las blancas, lo que falta) | (p, q, r) una permutación de (2, 1, 1) | «2 blancas, 1 gris, 1 negra: 12 cenefas, el término 12a²bc» |

Cada misión se cumple en un solo caso de su grilla (la 6 en las tres permutaciones de un mismo grupo, que son tres
términos con el mismo coeficiente: el texto del `bien` lo dice) y no está cumplida al abrir; lo comprueba la prueba
propia. La predicción queda fuera de lo jugado: el juego 1 llega a n = 4 (la predicción pide n = 5); el 2 tiene el signo
en b (la predicción, en a y con un número en el lugar par); el 3 pide exponente 0 con n = 6 (la predicción, el de x³ con
otro binomio); el 4 da la suma de (a + b)ⁿ (la predicción, la de (2x − 1)⁵, con un número en a); el 5 muestra α naturales
y negativos (la predicción, uno fraccionario); el 6 tiene 4 losetas (la predicción, 6).

---

## 4. La predicción de cada idea

La app baraja las opciones. `datos` lleva solo valores y equivalencias. Los códigos son los de la investigación
(`DIS`, `ORD`, `IDX`, `SIG`, `BLO`, `FAC`, `EXP`, `OBJ`, `GEN`, documentados o de segunda mano según su tabla) o
hipótesis (`TAL-BN-*`, hipótesis de diseño que van a `rutinas/teoria-algebra.md` al cerrar). Ninguna predicción repite
un código.

| Idea | Pregunta y datos | Correcta | Distractores (código) |
| --- | --- | --- | --- |
| 1 | «Al desarrollar (a + b)⁵ y juntar términos semejantes, ¿cuál es el coeficiente de a³b²?» Datos: (a + b)⁵ = (a + b)(a + b)(a + b)(a + b)(a + b) | 10 | 0, cree que solo quedan a⁵ y b⁵ (DIS) · 20, cuenta las dos grises en orden: 5 · 4 (ORD) · 6, multiplica los exponentes 3 · 2 (TAL-BN-EXPONENTES) |
| 2 | «En el desarrollo de (x − 2)⁶ ordenado por las potencias de x de mayor a menor, ¿cuál es el término de lugar 4?» Datos: el primer término es x⁶; C(6, 3) = 20 y C(6, 4) = 15 | −160x³ | 160x³, pierde el signo de (−2)³ (SIG) · 240x², usa k = 4, el número del lugar (IDX) · −40x³, eleva la x y no el 2 (BLO) |
| 3 | «¿Tiene (x² + 1/x)⁵ un término sin x?» Datos: 1/x = x⁻¹; xᵐ · xⁿ = xᵐ⁺ⁿ | No: ningún término | «Sí, el de lugar 4», redondea k = 10/3 (TAL-BN-REDONDEA) · «Sí, el de lugar 3», reparte mitad y mitad (TAL-BN-MITAD) · «Sí: todo desarrollo tiene uno» (TAL-BN-SIEMPRE) |
| 4 | «¿Cuánto suman los coeficientes de (2x − 1)⁵?» Datos: el desarrollo tiene 6 términos | 1 | 32, toma 2⁵ como en (a + b)⁵ (TAL-BN-DOS) · 243, suma sin signos: 3⁵ (TAL-BN-ABS) · −1, pone x = 0 (TAL-BN-CERO) |
| 5 | «(1 + x)³ tiene 4 términos. ¿Cuántos tiene (1 + x)^(1/2)?» Datos: 1/2 no es un número natural | ninguno al final: no termina | 2, redondea 1/2 + 1 (GEN) · 1,5, aplica n + 1 (GEN, otra forma) · 3, como (1 + x)² (TAL-BN-FINITO) |
| 6 | «En (a + b + c)⁶, ¿cuál es el coeficiente de a²b²c²?» Datos: 6! = 720; 2! = 2 | 90 | 720, no divide: cuenta en orden (ORD, otra forma) · 15, solo elige las b como en un binomio (TAL-BN-DOS-LETRAS) · 20, usa C(6, 3) (TAL-BN-MITAD) |

---

## 5. Tabla de letras y símbolos

| Símbolo | Un solo significado en la unidad | Aviso |
| --- | --- | --- |
| a, b | el primer y el segundo término del binomio (a + b)ⁿ; en un ejercicio son monomios como 2x o −3 | con su número y su signo: «b = −3» |
| c | el tercer término del trinomio (a + b + c)ⁿ (solo la idea 6) | ningún coeficiente se llama c en la unidad |
| n | el exponente: cuántos paréntesis iguales se multiplican (un número natural) | n + 1 es el número de términos |
| k | cuántas veces se elige b (el índice), de 0 a n | el lugar es k + 1, no k |
| t₍ₖ₊₁₎ | el término de lugar k + 1, contando desde 1 | como el «término de lugar k» de División |
| C(n, k) | el número combinatorio: de cuántas maneras se eligen k paréntesis entre n | en la academia: Cⁿₖ o (n k); «Análisis combinatorio» lo escribe con subíndice |
| n! | el factorial | de «Análisis combinatorio» |
| x, y | las variables de los monomios | |
| α | el exponente que no es natural (idea 5) | se lee «alfa» |
| p, q, r | cuántas veces se elige a, b y c en el trinomio (idea 6) | p + q + r = n |
| S | la suma de los coeficientes (idea 4) | |
| P | el nombre de un polinomio en un enunciado | |

## 6. Mapa de colores por magnitud (§5b)

| Token | Magnitud |
| --- | --- |
| `o` naranja | el primer término a y lo que se elige de él: las losetas blancas, n − k, p |
| `i` turquesa | el segundo término b y lo que se elige de él: las losetas grises, k, q |
| `f` violeta | lo que se busca: el coeficiente, el término pedido, la suma de coeficientes, el número de cenefas |
| `d` verde | el tercer término c del trinomio y las losetas negras (solo la idea 6), siempre con su letra |
| tinta | n, el lugar, α, la expresión entera y lo que se pide con «?» |
| `h` carmín | **no se usa** |

Pares que van juntos: naranja–turquesa 0,114, naranja–violeta 0,189, turquesa–violeta 0,101 (molde §5b). El verde va
junto al naranja solo en la idea 6 (protanopía 0,010): por eso cada loseta lleva su letra dentro y la negra es la más
oscura (la diferencia de claridad la separa también en gris). En las figuras de Predice y de los ejemplos, lo pedido va
con «?» en tinta. Las alternativas de «Ahora tú» van en tinta (como en Factorización y Ecuaciones polinomiales).

---

## 7. Práctica: qué existe y qué falta por idea

**Hoy:** la ficha lista solo la escena `binomio-newton` («El tablero de los caminos», con papel).

| Idea | Tipos nuevos (plantilla `binomio-practica`, formato `predicciones`) |
| --- | --- |
| 1 Elegir en cada paréntesis | coeficiente de aⁿ⁻ᵏbᵏ · fila siguiente de Pascal · cuántas cenefas (elegir posiciones) · simetría C(n, k) = C(n, m) |
| 2 Término de lugar k + 1 | término de lugar dado · coeficiente de un término con signo · el lugar de un término dado · el exponente n (San Marcos 2026-I) |
| 3 Un término por su exponente | término independiente · coeficiente de xᵐ · existe o no · un parámetro (el término independiente vale un número) |
| 4 Cuántos términos y cuánto suman | número de términos · término central · suma de coeficientes · n desde la suma |
| 5 Exponente que no es natural | coeficiente de x² · coeficiente de x³ · ¿termina? · aproximar con dos o tres términos |
| 6 Potencia de un trinomio | coeficiente de aᵖbᵠcʳ · número de términos · término con números · suma de coeficientes |

`TIPOS_POR_IDEA`, prueba en 400 semillas, `casos.json` verificado aparte y papel con datos. **`binomio-newton`** (la escena)
se queda en la ficha y pasa a «Más mesas del tema» (`"rehacer": ["algebra.binomio-de-newton"]`); su papel es de una sola
unidad y no se toca su código. Dos ítems nuevos a la reserva de la prueba del curso (las formas ya tienen 10 pares):
bn-01 (término de lugar dado con signo) y bn-02 (término independiente), con su verificador.

## 8. Datos del mundo

| Dato | ¿Fuente? |
| --- | --- |
| Las cenefas de losetas blancas, grises y negras de Rubén | Valores de problema, sin fuente (el mismo maestro de la rama) |
| √1,02 y √0,98 en la calculadora | Cuenta, sin fuente: la calculadora la hace la unidad |
| Historia: Yang Hui y Newton | Se queda la fuente publicada (The Newton Project, Oxford) |

Descartados de la investigación: la impresora Epson (copiar al 200 % y al 50 % no es un binomio, solo una analogía del
exponente cero), la moneda de un sol y el textil de Taquile (no muestran nada del binomio y no se puede dibujar un patrón
«tradicional» sin fuente).

## 9. Riesgos de orden (`requiere`)

- `requiere` no cambia: `algebra.productos-notables` y `aritmetica.analisis-combinatorio`.
- **«Análisis combinatorio» todavía no se rehízo** (Aritmética). Su teoría presenta el factorial y el número combinatorio
  (con la fórmula y la simetría) y su glosario los define en Aritmética. Aquí **van siempre como dato**: «C(n, k) =
  n!/(k!(n − k)!)» y «n! = 1 · 2 · … · n; 0! = 1», en cada ejercicio que los usa. La idea 1 muestra por qué el número
  combinatorio es el coeficiente (decisión 1). El glosario de Álgebra los define aquí (otro curso, otra entrada).
- De «Productos notables» se usan (a + b)² y (a + b)³ ya desarrollados, sin repetir su cubo de piezas (queda como mesa
  del laboratorio).
- «Término de lugar k» (División de polinomios) tiene el mismo sentido: aquí se usa con su `t`. «Término central» lo
  define Factorización para un trinomio ordenado: aquí va como término `local` con su sentido del desarrollo.
- La idea 2 usa la 1; la 3, el término general de la 2; la 4, el lugar de la 2 para los centrales; la 5, la fórmula de
  los coeficientes que la 1 y la 2 escriben con factoriales; la 6, la 1. Ninguna usa algo posterior.

---

## 10. Decisiones tomadas (Gerson revisa después)

1. **El número combinatorio y el factorial se dan por sabidos como herramienta y van como dato.** Motivo: están en
   `requiere` («Análisis combinatorio»), cuya teoría los presenta; la idea 1 muestra por qué aparecen. Descartado: la idea
   «Cuántas veces aparece» de la investigación, que enseña la combinación desde cero (pisaría Aritmética y pasaría de 6
   ideas).
2. **C(n, k) con paréntesis.** Es la notación de la ficha vieja, de su papel y de OpenStax, y no se confunde con una
   fracción ni con un índice. El glosario dice que en la academia se escribe Cⁿₖ o (n k). Descartado: el subíndice de
   «Análisis combinatorio» (C₅,₂ en el celular se lee mal) y la notación vertical (se lee como fracción).
3. **El exponente no natural se queda, sin series.** Es tema del catálogo y del sílabo UNI; se enseña lo que se pregunta:
   los primeros coeficientes de (1 + x)^α, que no termina, y que la suma sirve con −1 < x < 1 (como condición, sin
   probarla). Descartado: sacarlo a otra unidad (la investigación lo recomienda, pero el catálogo lo pone aquí y la
   unidad publicada lo tenía) y la cota de error.
4. **Las cenefas de Rubén como objeto de toda la unidad.** Una cenefa es una elección de a o b en cada paréntesis: el
   coeficiente cuenta cenefas y la suma total es 2ⁿ. Sigue el hilo de la rama (el maestro que enchapa). Descartado: el
   tablero de áreas (ya está en Productos notables y no llega a n = 5), las cuentas de un llavero de la investigación
   (otro objeto para lo mismo) y el tablero de caminos de la escena vieja (se queda como mesa).
5. **Dos ideas nuevas** (`termino-buscado`, `suma-coeficientes`). Motivo: término independiente, centrales y suma de
   coeficientes son un tercio del banco y la pregunta de San Marcos. La investigación los partía en tres ideas; aquí
   centrales y suma van juntos porque los dos salen de contar los valores de k. Descartado: siete ideas.
6. **El orden: desarrollo de izquierda a derecha por las potencias de a** (la de b sube). «Lugar» cuenta desde 1 e
   «índice» k desde 0, como en la investigación y la academia. Cada enunciado dice el orden cuando a no es lo primero.
7. **Lo que no entra:** sumas de combinatorios con índices, restos con el binomio (Divisibilidad), el término máximo y
   los términos racionales con radicales. Quedan para la práctica de admisión de la escena vieja o para Aritmética.
8. **Pieza nueva `alg-cenefa`** (dibujo de prueba). Descartado: dibujar las franjas con `alg-tabla` (no se ve un objeto)
   y agregar un objeto a `alg-losetas` (es compartida y su loseta es x por x, otra cosa).
9. **El avance:** las cuatro ideas de antes conservan su `id` con otra Predice y la unidad suma dos. Fila nueva en
   `REHECHAS_E6` de `nucleo/avance.js` (marcas `prediccionBN` y `estudiadaBN`), con su prueba: quien terminó las cuatro de
   antes conserva «Ya la estudié».
10. **Laboratorio:** se quedan «Las piezas que se eligen» (el cubo 3D, idea 1), «El triángulo hasta la fila 8» (idea 1),
    «Término general a medida» (idea 3, con los colores de la unidad) y «La serie con otro exponente» (idea 5, sin
    carmín). La escena `binomio-newton` va a «Más mesas del tema».
11. **Ficha del catálogo:** `potencial_visual` de `bajo` a `medio` (las cenefas), `plantillas`:
    `["binomio-practica", "binomio-newton"]`; `grado` sin tocar.

## Cambios (26 nov, al escribir las seis ideas y la práctica)

1. **Losetas naranjas y turquesas, no blancas y grises** (§2): «blanca» y «gris» no se sostienen en el tema oscuro (la
   tinta se invierte). Cada loseta lleva su letra dentro; el color guía y la letra identifica. En la idea 6, la tercera es
   verde.
2. **Notas de la sesión sobre la idea 1:** el ícono de la unidad no muestra la fila 5 (su última fila es 1, 4, 6, 4, 1;
   la regla `icono-respuesta` pasa con la marca simulada); la lectura del juego pinta a y b con su color; las losetas del
   juego son más grandes (menos aire alrededor). C(n, k) va siempre como dato con su fórmula (n!/(k!(n − k)!)) y Mira lo
   presenta en palabras («elegir 2 de 5, sin orden, es el número combinatorio C(5, 2)») antes de usarlo: «Análisis
   combinatorio» está en `requiere` (Aritmética, 5.º), no después.
3. **Juego 2:** en vez de la tabla del cuaderno, los paréntesis de (2x − 1)⁵ con la elección marcada (pieza `alg-cenefa`,
   objeto `parentesis`): el lugar elegido muestra qué paréntesis dan b y abajo se arma el término.
4. **Predicción 3:** «¿Tiene el desarrollo de (x² + 1/x)⁵ algún término sin x?» (correcta: no). La regla usa e₁ y e₂
   (exponentes de x en a y en b), dichos en su llave y en el «Vale si».
5. **Trinomio:** el término se nombra «p veces a, q veces b y r veces c» (no hay superíndice q en Unicode; en las
   ecuaciones va como potencia).
6. **La regla de la idea 1** no lleva la simetría en la ecuación (se partía a 390 px): va en el «Vale si».
7. **Práctica:** 24 tipos (cuatro por idea), todas las respuestas como texto; los errores documentados en otras
   poblaciones llevan `respaldo: 'parcial'`. Prueba del curso: bn-01 (coeficiente con signo) y bn-02 (término
   independiente), a la reserva, con su verificador y sus cinco errores nuevos en el diccionario.
8. **Laboratorio:** «Término general a medida» nombra sus controles por lo que son («exponente de x», «exponente de 1/x»,
   «número del segundo»), sin p, q ni c (que en la unidad son otra cosa); «La serie con otro exponente» pasa a «La suma con
   otro exponente» (la palabra «serie» es de «Sucesiones y series»).
