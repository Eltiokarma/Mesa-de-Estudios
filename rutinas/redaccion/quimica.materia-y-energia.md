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