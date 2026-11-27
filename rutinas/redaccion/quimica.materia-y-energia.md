# Redacción · quimica.materia-y-energia · 26 nov 2026

Pasada del redactor (`docs/metodo/unidad/redaccion-delegada.md`) sobre una unidad cerrada (`calidad: 2`). Solo texto:
ningún número, respuesta, distractor, dato ni dibujo cambió. Se leyó lo que ve el alumno en las seis ideas (Lee,
consigna, misión, lecturas en vivo, Predice con sus `siFuera`, Mira, regla y condición, «Así se resuelve» y «Ahora tú»
en 20 semillas, los 15 ejemplos de cada idea), el glosario, la historia, las dos mesas del laboratorio y la práctica
que es solo de esta unidad: `materia-energia` (papel a mano), `sustancias-mezclas`, `densidad-propiedades`,
`cambios-materia`, `calor-sensible-latente`, `masa-energia` y `vida-media` (generadores y su papel, regenerado con
`herramientas/papel-generador.js`). `quimica-conceptos` y `conversiones-quimica` no se tocaron: los comparten otras
unidades.

## Qué se cambió, por tipo de problema

1. **Marco roto en «Vale si» (A2).** Cinco de las seis condiciones no formaban oración con el «Vale si» que antepone
   el lector (`app/teoria.js`, `te-cond`): «Vale si Se decide por las partículas…», «Vale si Las intensivas reconocen…»,
   «Vale si Propiedad física: se mide…», «Vale si Δm es…», «Vale si t y la vida media, en la misma unidad». Se
   reescribieron como subordinadas. En la idea 2, la frase «por las intensivas se reconoce una sustancia y se separa una
   mezcla» pasó a la regla, y la condición quedó con la correspondencia método–propiedad.
2. **Telegrama en Mira, reglas y pasos (A1, A6).** Rótulos con dos puntos en lugar de verbo: «Agua destilada: todas sus
   partículas son H₂O. Una sola clase: sustancia pura.», «Cambio físico: … Químico: … Nuclear: …», «Reemplazo.»,
   «Multiplico.», «Divido.», «A gramos.», «La diferencia.», «El tiempo.». Se escribieron con sujeto, verbo y el enlace
   (así que, porque, pero).
3. **Ráfaga en soluciones de ejemplos y en «Ahora tú».** «Fases: zonas con borde; lo disuelto no cuenta aparte.
   Componentes: sustancias; el hielo es agua.», «Cu y Sn: elementos.», «Cerrado: nada entra ni sale…», «Variación: por
   1,8, sin sumar 32.». Se integraron en oraciones completas.
4. **`siFuera` sin el porqué.** Varios decían qué revisar sin decir qué estaba mal («Revisa cuál de ellas crece…»,
   «Casi: revisa cuántos átomos…»). Ahora dicen qué tendría que cambiar y qué pasa aquí, sin delatar la correcta.
5. **Concordancia y plantillas que se rompían con ciertos casos.** «Después: CO₂ y H₂O, que antes no estaba»
   (ahora concuerda en número), «Ya van 0 en CO₂» (ese tramo ya no se escribe cuando es cero), «Son 1 químicos» en
   `cambios-materia` (ahora «Solo uno es químico»), «Se duplican volumen, que son extensivas» en
   `densidad-propiedades` (ahora concuerda cuando hay una sola extensiva).
6. **Glosario e historia.** «defecto de masa», `simple`: «Lo poquito que se pierde de peso…» confundía masa y peso
   (ahora «Lo poquito de masa que se pierde…»). «vida media», `simple`: decía «la mitad» sin decir de qué. En la historia,
   la oración de 8 palabras («Por eso importa dónde termina el sistema…») se integró a la anterior.
7. **Lecturas en vivo** del juego de la idea 3: «Antes y después, H₂O: de líquido a gas, más separadas.» pasó a «El H₂O sigue
   igual: pasa a gas y sus moléculas se separan.» (12 palabras, el tope).

## Antes y después

- Regla, idea 3. **Antes:** «Cambio físico: las mismas partículas cambian de estado, forma o lugar. Químico: aparecen
  sustancias nuevas con los mismos átomos. Nuclear: un átomo pasa a ser de otro elemento.» **Después:** «En un cambio
  físico, las mismas partículas cambian de estado, de forma o de lugar. En uno químico aparecen sustancias nuevas, hechas
  con los mismos átomos. En uno nuclear, un átomo pasa a ser de otro elemento.»
- Condición, idea 4. **Antes:** «Vale si la sustancia es pura y la presión, fija. Un punto: K = °C + 273 y °F = 1,8 · °C
  + 32; una variación, sin sumar.» **Después:** «Vale si la sustancia es pura y la presión no cambia. Para leer un punto,
  K = °C + 273 y °F = 1,8 · °C + 32; para una variación no se suma nada.»
- Mira, idea 2. **Antes:** «Arena sin disolver: se filtra. Aceite: se decanta. Sal disuelta: se evapora el agua.»
  **Después:** «La arena sin disolver se filtra, el aceite se decanta, y para sacar la sal disuelta se evapora el agua.»
- Ejemplo 13, idea 4. **Antes:** «Juliaca: sube 70 °C. Lima: sube 83 °C.» / «La diferencia.» **Después:** «En Juliaca el
  agua sube 70 °C hasta hervir, y en Lima sube 83 °C.» / «Lo que hace falta de más en Lima es la diferencia.»

## Para el auditor (no se arregló contenido)

- **Afirmación falsa en el porqué de «mezcla heterogénea»** (teoría, `PORQUE_CLASE`, y `sustancias-mezclas`, `PORQUE`):
  decía «Dos clases de partícula, cada una en su zona», que no vale para el granito (tres minerales), la chicha con hielo
  ni la gaseosa con burbujas. Se cambió solo la redacción a «Hay más de una clase de partícula, y forman zonas distintas,
  con bordes entre ellas: dos fases o más» (y lo mismo en homogénea: «más de una clase»). Conviene que el auditor lo
  confirme.
- **Glosario «defecto de masa», `def`:** la limita a «un proceso nuclear», pero su tercer ejemplo es el balón de gas que
  arde. No se tocó.
- **Condiciones de las ideas 2 y 3:** ya forman oración con «Vale si», pero la de la idea 3 lleva, además, la diferencia
  entre propiedad física y química, que no es una condición de la regla (A7). Si se quiere el campo limpio, esa frase
  iría a una tarjeta de «Lee» o a un paso de Mira.
- **«Así se resuelve» de la idea 1, tipo material:** el paso de datos repite el dato tal cual («El dato dice qué tiene un
  trozo de granito: roca con granos…»), que se lee algo forzado con algunos materiales.
- `node herramientas/ecuaciones-ancho.js quimica.materia-y-energia` (390 px): 0 no caben y 15 se parten después de
  «=» o «;». Las 15 son ecuaciones o líneas de datos que esta pasada no tocó (p. ej. «Q = m · cₑ · ΔT = 200 g · 1
  cal/(g·°C) · 18 °C = 3600 cal», Mira de la idea 4; «Tras n vidas medias queda m = m₀/2ⁿ…», datos de la idea 6). Tres
  textos que esta pasada había alargado («Multiplico por c²…» en seis ejemplos de la idea 5, el ejemplo 12 de la idea 5
  y el ejemplo 1 de la idea 4) se partían igual y se acortaron hasta que dejaron de hacerlo.
- Una frase nueva con un dato que ya estaba en la unidad: en el ejemplo 6 de la idea 4, «Un litro de agua tiene 1000 g»
  (la ecuación ya escribía m = 1000 g).

## Comprobación

- `node --test contenido/teoria/teoria.test.js`: 164 pasan, 0 fallan (con la unidad en `calidad: 2`, es decir, con las
  reglas del validador corriendo).
- Pruebas de la práctica (`plantillas/{materia-energia,sustancias-mezclas,densidad-propiedades,cambios-materia,
  calor-sensible-latente,masa-energia,vida-media}/*.test.js`): 226 pasan, 0 fallan.
- `node herramientas/papel-reglas.js`: ningún hallazgo en estas plantillas. Papeles regenerados con
  `herramientas/papel-generador.js`; `npm run catalogo` corrido para el glosario.

## Verificación (26 nov)

Verificador de cierre. Se resolvieron las notas y se rehicieron a mano las cuentas de las explicaciones de alternativas
que esta pasada reescribió con sentido nuevo (densidad, intensivas, cambios, calor, escalas, Δm · c², vida media y las
dos tandas de `siFuera` de la idea 1): cuadran con el valor de cada distractor, salvo lo que sigue.

**Errores corregidos (cada uno con una prueba que falla con la versión del redactor):**
- **Regresión de esta pasada, idea 1, «Así se resuelve»:** el paso de datos buscaba `c.porque.startsWith('Agua e
  iones')`, pero el porqué ahora empieza por «Hay agua e iones…», así que con agua salada decía «En la lupa hay dos clases
  de partícula» (son tres: H₂O, Na⁺ y Cl⁻). Ahora busca «iones de la sal». Prueba nueva en `materia-y-energia.test.js`.
- **«Dos clases» con agua salada (venía de antes):** en la teoría, `siFueraClase` decía «Son dos clases, bien contadas» y
  «Hay dos clases de átomo»; en `sustancias-mezclas`, cuatro explicaciones decían «hay dos clases de partícula», también
  con el vaso de agua salada y el de agua salada con arena. Ahora dicen «más de una clase». Pruebas nuevas en la unidad y en
  `plantillas/sustancias-mezclas/generador.test.js`; `papel.json` regenerado.
- **Regresión de esta pasada, ejemplo 12 de la idea 5 («El balón que casi no pierde»):** al acortarlo se perdió
  «(3 × 10⁸)²», y la prueba propia de la unidad fallaba («usa c² sin mostrar (3 × 10⁸)²»). Ahora: «…con la energía del
  balón y c², que es (3 × 10⁸)², o sea 9 × 10¹⁶.» A 390 px no se parte.
- **Glosario «defecto de masa», `def`** (nota del redactor): se limitaba a «un proceso nuclear» y su tercer ejemplo es el
  balón de gas que arde. Ahora: «Diferencia entre la masa de un sistema antes y después de soltar energía; solo se nota en
  un proceso nuclear.» (Cuenta del ejemplo rehecha: 4,6 × 10⁸ J ÷ 9 × 10¹⁶ ≈ 5 × 10⁻⁹ kg.)
- **Idea 3, contar moléculas:** «te pasaste por una», después de «Contaste los átomos», no decía de qué; ahora «por una
  molécula».

**Notas confirmadas o decididas:**
- El porqué de «mezcla heterogénea» con «más de una clase de partícula»: correcto (granito, chicha con hielo).
- Condición de la idea 3 con la frase de propiedad física y química: se deja; se lee de corrido detrás de «Vale si» y la
  ahoraTu de propiedades la usa. Decidido por la sesión, Gerson revisa después.
- Paso de datos de la idea 1, tipo material («El dato dice qué tiene un trozo de granito: …»): se deja; se entiende con
  los diez materiales. Decidido por la sesión, Gerson revisa después.
- `ecuaciones-ancho` (servidor propio, 390 px): 0 no caben y los mismos 15 cortes después de «=» o «;» que ya anotó el
  redactor, todos en ecuaciones o datos anteriores a esta pasada.
- Pruebas de la práctica que exigían que cada explicación empezara por «Bien» (`sustancias-mezclas`,
  `densidad-propiedades`, `cambios-materia`, `calor-sensible-latente`, `masa-energia`, `vida-media`): se quitó solo esa
  comprobación; respaldo, escala y valor de cada error siguen. Las explicaciones de esas plantillas todavía abren con
  «Bien:»; reescribirlas queda para una pasada de redacción.

**Comprobación:** `materia-y-energia.test.js` 35/35; práctica (las siete plantillas) 227/227; validador con `calidad: 2`
en 200 semillas: 0 hallazgos; `papel-reglas.js`: nada de estas plantillas; `papel-generador.js --revisar`: al día.
`teoria.test.js` (última corrida): 163 de 164; la unidad pasa, y la única falla es `quimica/mol-y-composicion.js`, otra unidad en obra. La prueba del glosario, que en una corrida anterior fallaba por `app/datos/glosario/*.json` desfasado, ya pasa.
## Segunda pasada: explica (27 nov)

Gerson vio la unidad en la app y dijo que los textos seguían cortos y sin mucho significado. Esta pasada sigue el punto 4
de `docs/metodo/unidad/redaccion-delegada.md` («Explica, no solo pules») con los topes nuevos. Solo texto: ningún
número, respuesta, distractor, dato ni dibujo cambió; `calidad: 2` se queda.

### Qué se cambió, por tipo

1. **Reglas (las seis).** Cada una dice ahora qué es el término nuevo, por qué vale y un caso: la «clase de partícula»
   con el H₂O y el agua con azúcar que engaña a la vista (idea 1); la barra de oro partida (2); el agua que hierve y sigue
   siendo H₂O (3); por qué el termómetro no sube en un cambio de estado (4); por qué unos miligramos dan tanta energía
   (5); qué es la vida media y la serie 16 → 8 → 4 (6). La regla 6 presenta m₀.
2. **Recuadro de la idea 1.** Ya no son rótulos sueltos: la primera línea dice qué es una fase («fase: zona que se ve
   pareja, con un borde»), y debajo van homogénea y heterogénea y qué cuenta como componente.
3. **«Vale si» (seis).** Cada condición dice además qué pasa si no se cumple: el agua con hielo que parece mezcla (1), el
   método que deja juntos los componentes (2), el aspecto que engaña (3), el agua que hierve antes en Juliaca (4), la
   energía que sale demasiado grande con la masa entera o en gramos (5), n que sale mal con días y semanas (6).
4. **`siFuera` de las seis predicciones y de casi todas las alternativas de «Ahora tú».** Cada una nombra el razonamiento,
   dice por qué falla y qué había que mirar. Las de la idea 1 y la idea 3 dependen ahora de la respuesta correcta (antes,
   «Viste partículas de varios átomos, bien» salía también para el oro y el diamante, y «Viste elementos en la lista»
   para el gas de encendedor, que no tiene ninguno). Los métodos de separación dicen qué propiedad sí servía.
5. **Pasos de «Así se resuelve» y soluciones.** «Reemplazo los datos en la fórmula» pasó a decir qué se multiplica o se
   divide y por qué (cada mL tiene tantos gramos; cada gramo pide tantas calorías). Las soluciones dicen el porqué del
   resultado. Fases y componentes, y el único material de una lista, se arman con dos funciones nuevas (`cuentaSistema`,
   `cuatroPorque`): antes, la solución de fases hablaba del hielo aunque el vaso no tuviera hielo.
6. **Lee y Mira.** La tarjeta de la lupa define «clase de partícula»; la del calor específico ya no cuelga el «Por eso»
   del aceite; los pasos de Mira dicen el porqué (el triple de masa en el triple de volumen; el tramo plano más largo;
   ninguna reacción cambia un elemento).
7. **Ejemplos.** Se completaron los de un solo renglón seco (idea 1: 1, 3, 4 y 5; idea 2: 2, 7, 8, 11, 13 y 14; idea 3:
   12; idea 4: 7, 10 y 13).
8. **Glosario.** Los `simple` llevan ahora un caso de la vida del alumno (la limonada, el mate, la chicha, el corcho que
   flota) y se agregó a «estado de agregación». No se pudo agregar a compuesto, molécula, componente ni a los dos tipos
   de mezcla: el validador pide de 2 a 4 términos con `simple` por idea, y la idea 1 ya tiene cuatro.
9. **Práctica.** Las 194 explicaciones de `sustancias-mezclas`, `densidad-propiedades`, `cambios-materia`,
   `calor-sensible-latente`, `masa-energia` y `vida-media` dejaron de abrir con «Bien:» (lo que había anotado el
   verificador) y dicen el porqué. Arreglos de concordancia: «Lo cumplen la sal de mesa. En total son 1.» (ahora «Solo
   lo cumple… En total es 1.»), «el temperatura de fusión», «el longitud» y «la 3.ª parte» (ahora «la tercera parte»).

### Antes y después

- **Regla, idea 1.** *Antes:* «Una sustancia pura tiene una sola clase de partícula, y una mezcla tiene varias. Si todos
  los átomos de la sustancia pura son de un mismo elemento, es un elemento; si une átomos distintos, es un compuesto.»
  *Después:* «Una clase de partícula es un tipo de molécula o de átomo, como el H₂O. Una sustancia pura tiene una sola
  clase, y una mezcla tiene varias. El aspecto engaña: el agua con azúcar se ve como agua sola y es mezcla. Si una
  sustancia pura tiene un solo elemento, es un elemento; si une átomos distintos, es un compuesto.» Y el recuadro pasó
  de «homogénea: 1 fase · heterogénea: 2 fases o más» a «fase: zona que se ve pareja, con un borde · homogénea: 1 fase;
  heterogénea: 2 o más · componentes: cuántas sustancias distintas hay».
- **Regla, idea 4.** *Antes:* «Sin cambio de estado, el calor sube la temperatura, y se llama calor sensible. Durante un
  cambio de estado, la temperatura no cambia y el calor se gasta en el cambio: es el calor latente.» *Después:* «Sin
  cambio de estado, el calor sube la temperatura y se llama calor sensible: depende de la masa, del calor específico y
  de cuánto sube. Durante un cambio de estado, como fundir o hervir, la temperatura no cambia aunque entre calor, porque
  ese calor se gasta en soltar las partículas unas de otras: es el calor latente.»
- **Condición, idea 6.** *Antes:* «Vale si el tiempo t y la vida media están en la misma unidad. Lo desintegrado es
  m₀ − m…» *Después:* «Vale si el tiempo t y la vida media están en la misma unidad; si uno va en días y el otro en
  semanas, n sale mal. Lo desintegrado es m₀ − m…»
- **Alternativa de la predicción, idea 1** (agua con hielo, «Una mezcla, porque se ven dos partes»). *Antes:* «Se ven
  dos partes, bien visto: son dos fases. Sería mezcla si hubiera dos clases de partícula.» *Después:* «Se ven dos partes,
  bien visto, pero eso cuenta fases y no sustancias. Para que fuera mezcla haría falta otra clase de partícula, y el
  hielo también es H₂O: es agua en otra fase.»
- **Alternativa de «Ahora tú», idea 2** (densidad con la lectura final de la probeta). *Antes:* «Dividiste la masa, bien.
  El volumen es lo que subió el agua, no la lectura final.» *Después:* «Dividiste la masa, bien, pero entre la lectura
  final de la probeta. Esa lectura incluye los 50 mL de agua que ya había, y el volumen del objeto es solo lo que subió.»
- **Solución de «Ahora tú», idea 1** (de qué está hecho el aire húmedo). *Antes:* «N₂ y O₂: elementos; CO₂ y H₂O:
  compuestos.» *Después:* «N₂ y O₂ son elementos, porque cada fórmula tiene un solo símbolo; CO₂ y H₂O son compuestos,
  porque cada fórmula tiene dos símbolos o más. Como son sustancias distintas y sueltas, juntas forman una mezcla.»

### Para el auditor

- **«Clase de partícula = tipo de molécula o de átomo»** (regla 1, como el ejemplo del método) no nombra los iones: la
  sal de mesa tiene Na⁺ y Cl⁻ y es una sola sustancia. La unidad ya trata la sal como compuesto y el agua salada como
  «agua e iones»; conviene que el auditor decida si la regla debe decir «de molécula, de átomo o de par de iones».
- **Afirmaciones nuevas, ciertas pero sin fuente abierta en esta pasada:** el calor latente se gasta «en soltar las
  partículas unas de otras»; hervir pide más que fundir «porque en el vapor las moléculas quedan muy separadas»; la
  energía nuclear es «millones de veces mayor» que la química para la misma masa; «ninguna reacción química convierte un
  elemento en otro»; una botella vacía y fría también se moja por fuera; el + 32 y el + 273 «corren el cero» y se
  cancelan al restar; el agua destilada es pura porque al destilarla «se le quitó lo que tenía disuelto».
- **Ejemplo 9 de la idea 3** (huevo frito, «las proteínas de la clara se transforman en otras»): no se tocó; la
  desnaturalización se enseña a veces como cambio químico y a veces como físico. Que lo mire el auditor.
- **Condiciones de las ideas 2 y 4:** siguen cargando una frase que no es condición (los métodos de separación; la
  lectura de un punto en K y °F). Se dejaron, con su consecuencia agregada.
- **Glosario de la app:** `app/datos/glosario/quimica.json` queda desfasado hasta que la sesión corra `npm run catalogo`;
  mientras tanto falla la prueba «glosario … archivos de la app al día» de `teoria.test.js`, como prevé el método.
- `node herramientas/papel-generador.js` sobre las seis plantillas: los `papel.json` no cambiaron (sus problemas no
  traen las explicaciones de alternativas) y `--revisar` dice «al día». `papel-reglas.js`: nada de estas plantillas.

### Comprobación (27 nov)

- `contenido/teoria/quimica/materia-y-energia.test.js`: 35 pasan, 0 fallan.
- `contenido/teoria/teoria.test.js`: 163 pasan; falla solo la del glosario de la app (falta `npm run catalogo`).
- Validador de `calidad: 2` (`Teoria.problemas`, 200 semillas): 0 hallazgos.
- Práctica (`materia-energia`, `sustancias-mezclas`, `densidad-propiedades`, `cambios-materia`,
  `calor-sensible-latente`, `masa-energia`, `vida-media`): 227 pasan, 0 fallan.
- `node herramientas/ecuaciones-ancho.js quimica.materia-y-energia` (servidor propio en el puerto 4261, ya cerrado): 0
  no caben y los mismos 15 cortes después de «=» o «;» que ya estaban, todos en ecuaciones o datos que esta pasada no
  tocó.

## Verificación de la segunda pasada (27 nov)

Verificador de cierre. Se leyeron todas las oraciones nuevas de esta pasada (teoría en 60 semillas por idea y las seis
plantillas en 120 por idea, contra HEAD) y se resolvieron las notas.

**Datos, opciones y respuestas contra HEAD (200 semillas por idea, más las 500 a 505):** iguales en «Ahora tú», «Así se
resuelve», Predice, Mira y los 90 ejemplos, y en las seis plantillas. Lo único que cambia fuera del texto corrido es el
recuadro de la regla 1, que pasó de rótulos a frases (lo pide el método), y tres ejemplos de la idea 1 cuya solución se
partió en dos pasos.

**Corregido (con prueba que falla con la versión del redactor, en `materia-y-energia.test.js`):**
- **Regla 1, «clase de partícula».** «Un tipo de molécula o de átomo» dejaba fuera la sal de mesa, que la unidad cuenta
  como una sola clase y sustancia pura (y el agua salada, como «agua e iones de la sal»). Ahora: «Una clase de partícula
  es un tipo de molécula, de átomo o de par de iones, como el H₂O o el NaCl. Una sustancia pura tiene una sola clase: es
  elemento si tiene un solo elemento, y compuesto si une varios. Una mezcla tiene varias, aunque se vea pareja: el agua
  con azúcar parece agua sola y es mezcla.» (59 palabras; el tope es 60.)

**Decidido por la sesión, Gerson revisa después:**
- **Ejemplo 9 de la idea 3 (huevo frito).** Se deja como cambio químico, que es como lo enseñan y lo preguntan los
  exámenes escolares; se precisa el porqué: «las proteínas de la clara se deshacen y se unen entre ellas de otra forma, y
  forman algo distinto».

**Confirmado (cierto en química escolar):** el calor latente se gasta en separar las partículas; hervir el agua pide
540 cal/g, casi siete veces lo de fundir (80), porque en el vapor quedan muy separadas; fundir pide más de cuatro veces
lo que calentar 18 °C; la energía nuclear por masa es millones de veces la química (fisión ≈ 8 × 10¹³ J/kg contra
≈ 4,6 × 10⁷ J/kg del gas); un balón de 10 kg da unos 4,6 × 10⁸ J; ninguna reacción química cambia un elemento; una
botella vacía y fría también se moja por fuera; el + 32 y el + 273 solo corren el cero y se cancelan al restar dos
lecturas; el agua destilada es pura porque se le quitó lo disuelto; Juliaca a 87 °C. Las condiciones de las ideas 2 y 4
con una segunda oración se dejan (mismo criterio del 26 nov).

**Comprobación:** `materia-y-energia.test.js` 36/36; práctica (siete plantillas) en verde; validador con `calidad: 2`
en 200 semillas: 0; `papel-generador.js --revisar`: al día; `papel-reglas.js`: nada de estas plantillas (marca solo
`quimica-conceptos p2`, compartida y sin tocar). `teoria.test.js`: 163 de 164; la única falla,
«glosario … archivos de la app al día», espera a `npm run catalogo`.

Archivos de esta verificación: `contenido/teoria/quimica/materia-y-energia.js`, `contenido/teoria/quimica/materia-y-energia.test.js`.
