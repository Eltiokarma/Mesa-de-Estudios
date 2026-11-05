# Visión a futuro: modo PISA, agilidad mental e interacciones tipo juego

5 de noviembre de 2026 · Ideas dictadas en una sesión aparte. Igual que `docs/vision-futura.md`: **no se desarrolla todavía**. Antes de ejecutar algo de aquí, se discute y se pasa a `docs/fundacional.md` y a la hoja de ruta.

Tres ideas que se refuerzan entre sí:

1. **Modo PISA**: no solo rayar ejercicios de academia, sino problemas en contexto real.
2. **Agilidad mental** (al estilo de la app Peak): calentamientos cortos que automatizan el cálculo que el examen da por sabido.
3. **Interacciones más dinámicas** (al estilo de Brilliant): arrastrar, deslizar, completar con fichas, ordenar, emparejar.

---

## 1. Modo PISA

### Qué es PISA

- PISA (*Programme for International Student Assessment*) es la prueba de la OCDE que se toma cada pocos años a alumnos de 15 años en matemática, lectura y ciencia, y con la que se compara a los países.
- Perú sale entre los últimos de la tabla. *Por verificar con el informe oficial antes de citarlo en el producto o en una presentación:* en PISA 2022 Perú sacó alrededor de 391 en matemática, 408 en lectura y 408 en ciencia, frente a promedios OCDE cercanos a 472, 476 y 485, y la mayoría de alumnos peruanos quedó por debajo del nivel 2 en matemática (el nivel que la OCDE llama "básico").
- Lo que PISA mide no es si el alumno se sabe la fórmula, sino si la **usa en una situación de la vida real**: leer un enunciado largo, sacar los datos que importan de una tabla o un gráfico, decidir qué modelo aplicar, estimar y juzgar si la respuesta tiene sentido.

### Por qué nos importa

- Los colegios (nuestro primer cliente, el piloto) se evalúan con pruebas de este tipo: PISA y, en Perú, las evaluaciones del Minedu (ECE / Evaluación Nacional de Logros de Aprendizaje), que siguen un enfoque parecido. *Por verificar cuál toma hoy el Minedu y en qué grados.*
- Un argumento de venta para el colegio piloto: "no solo prepara para la academia; entrena lo que mide PISA".
- El examen de admisión y PISA piden cosas distintas. La admisión premia velocidad y trucos sobre problemas cerrados; PISA premia leer, modelar y razonar en contexto. **Necesitamos los dos modos**, no reemplazar uno por otro.

### Cómo se vería en la app

- Un **modo PISA** por tema: el mismo concepto de una plantilla (por ejemplo, la lente o el circuito), pero planteado como situación real. Ejemplos de tipo de problema (propios, no copiados):
  - Óptica: ¿a qué distancia pongo el celular de la lupa para que la foto salga nítida?
  - Circuitos: el recibo de luz de la casa; cuánto gasta la terma comparada con el foco.
  - Porcentajes: comparar dos ofertas de una tienda o dos planes de celular.
  - Reactivo limitante: una receta del restaurante con ingredientes que se acaban.
- Con datos que hay que **buscar** (en una tabla, un gráfico, un recibo dibujado) y datos que **sobran**.
- Preguntas abiertas cortas además de alternativas: "¿te alcanza o no? explica en una línea".
- Niveles de dificultad que imitan los niveles de desempeño de PISA (del 1 al 6), para que el colegio vea en qué nivel está cada salón.
- Contexto local: Juliaca, Puno, el mercado, las combis, el lago, la altura (ya hay "modo altura" en circuitos). Que el alumno reconozca su mundo.

### Fuentes por conseguir

- Marcos de evaluación de PISA (matemática, ciencia, lectura) de la OCDE.
- Ítems liberados de PISA y de las pruebas del Minedu: sirven para entender el formato y el nivel. **Regla 5 de `CLAUDE.md`:** no se copian al producto; se escriben problemas propios con el mismo tipo de razonamiento.
- Informe nacional de resultados de Perú en PISA (Minedu / UMC).

Agregar estas fuentes a `fuentes/por-conseguir.md` cuando se retome el tema.

---

## 2. Agilidad mental (al estilo de Peak)

### La idea

- Peak es una app de "entrenamiento cerebral" con minijuegos cortos y bonitos de memoria, atención, cálculo, lenguaje y agilidad mental.
- Lo que vale de Peak para nosotros: **sesiones de pocos minutos, divertidas, con tiempo y con mejora visible**. Si el alumno multiplica, suma, saca porcentajes y despeja rápido, un problema de energía, cantidad de movimiento, óptica o geometría le sale mucho más rápido, porque la cabeza queda libre para pensar en la física y no en la cuenta.
- Pendiente: conseguir capturas de pantalla de los juegos de Peak que más gustaron, para describir qué mecánicas copiar.

### Ojo con la evidencia (de frente)

- La evidencia de que el "entrenamiento cerebral" general (Peak, Lumosity y similares) mejore la inteligencia o el rendimiento en otras tareas es **débil**: se mejora en el jueguito, pero eso casi no se transfiere. A Lumosity la multó la FTC de EE. UU. en 2016 por publicidad engañosa sobre esto, y la revisión de Simons y otros (2016, *Psychological Science in the Public Interest*) llegó a la misma conclusión. *Por verificar y citar en `docs/fundacional.md` antes de usarlo como argumento.*
- Lo que sí tiene sentido: **automatizar los cálculos específicos que el examen pide**. Saber de memoria los triángulos notables o las potencias de 10 libera memoria de trabajo para el razonamiento (teoría de la carga cognitiva). Eso no es "entrenar el cerebro": es práctica deliberada de destrezas concretas.
- Conclusión: copiamos la **forma** de Peak (corto, con tiempo, bonito, con progreso), pero el **contenido** son las destrezas que de verdad aparecen en los problemas de admisión y de PISA. Nunca vender la app como "te hace más inteligente".

### Qué se practicaría

- Cálculo mental: tablas, multiplicar por 5, 25, 11; dividir entre 0,5 y 0,25; cuadrados y raíces frecuentes.
- Fracciones, porcentajes y porcentajes sucesivos (conecta con la plantilla que ya existe).
- Potencias de 10 y notación científica; prefijos (mili, micro, nano, kilo, mega).
- Conversión de unidades: km/h a m/s, cm a m, L a m³, °C a K.
- Triángulos notables (37° y 53°, 30° y 60°, 45°), senos y cosenos de memoria.
- Despejar una variable de una fórmula en segundos.
- Estimación y orden de magnitud: "¿esta respuesta tiene sentido?".
- Signos: la convención de signos de óptica es justo uno de los errores típicos documentados en `docs/investigacion/`.
- Para razonamiento verbal: juegos de palabras, sinónimos, antónimos, completar oraciones (ver la sección 3).

### Cómo se vería en la app

- Un **calentamiento** de 2 a 3 minutos antes de cada sesión, opcional, con las destrezas que pide el tema del día (si toca óptica: fracciones y signos).
- Racha y récord personal, sin rankings públicos que humillen al que va más lento.
- Que los juegos se generen con el mismo núcleo (`nucleo/`, azar con semilla), con resultados calculados por código, no por un modelo de lenguaje (regla 1).
- Medición: tiempo y aciertos por destreza, para ver si el calentamiento cambia la velocidad en los problemas del tema. Si no la cambia, se quita.

---

## 3. Interacciones más dinámicas (al estilo de Brilliant)

### La idea

- Brilliant es la app de aprendizaje interactivo de matemática y ciencia. Lo nuestro va por el mismo camino, pero más bonito, más acogedor y más tranquilo (`docs/diseno.md`). La idea es **copiar sus buenas ideas, no su producto**.
- Lo que vale de Brilliant: lecciones en pasos cortos, se aprende haciendo y no leyendo, retroalimentación inmediata en cada paso, y muchas formas de responder además de elegir una alternativa.

### Tipos de interacción para agregar al catálogo de formatos

- **Arrastrar** (*drag*): llevar una lente al lugar correcto, armar un circuito, poner cada dato en su lugar de la fórmula.
- **Deslizar** (*slider*): mover un parámetro y ver qué cambia (ya existe en las escenas; generalizarlo).
- **Completar con fichas** ("nubecitas"): una ecuación o una oración con huecos y fichas para soltar en ellos.
- **Ordenar**: los pasos de una solución, de mayor a menor, una secuencia de reacciones.
- **Emparejar**: variable con unidad, concepto con dibujo, fórmula con situación.
- **Clasificar en cajas**: ¿imagen real o virtual?, ¿serie o paralelo?, ¿reactivo o producto?
- **Marcar en el dibujo**: tocar dónde está el foco, dónde se forma la imagen, qué foco se apaga.
- **Sopa de letras y crucigramas**: sobre todo para razonamiento verbal y vocabulario de ciencia.

### Ojo (de frente)

- Cada interacción tiene que **obligar a pensar en el concepto**. Arrastrar un número a un hueco es una alternativa disfrazada si no cambia nada. La sopa de letras divierte, pero enseña poco si no está amarrada a vocabulario que el alumno necesita; úsese como premio o como descanso, no como núcleo.
- Las reglas de siempre siguen: predecir antes de ver (regla 3), un color por variable (regla 4), opciones incorrectas sacadas de errores reales.
- Cada interacción nueva tiene que funcionar con el dedo en un celular barato y sin conexión.

### Cómo encaja en la arquitectura

- Hoy hay dos formatos de módulo: "escena" y "predicciones" (`docs/arquitectura.md`, `nucleo/predicciones.js`). Estas interacciones serían **componentes reutilizables** del núcleo (arrastrar, completar, ordenar, emparejar) que cualquier plantilla usa, con la corrección hecha por código.
- La medición anónima tiene que registrar también estas respuestas, no solo las alternativas.

---

## Cómo encaja con lo que ya existe

| Idea | Ya existe | Qué agrega |
| --- | --- | --- |
| Modo PISA | No: hoy todo apunta al examen de admisión | Problemas en contexto real; argumento para el colegio piloto |
| Agilidad mental | En parte: práctica y "recordar en vez de releer" | Calentamientos cortos de cálculo y unidades, con tiempo y racha |
| Interacciones tipo Brilliant | En parte: deslizadores y arrastre en las escenas; alternativas en "predicciones" | Componentes de respuesta reutilizables en el núcleo |

## Pendientes para cuando se retome

- [ ] Conseguir y leer los marcos de PISA y los ítems liberados; verificar las cifras de Perú.
- [ ] Capturas de los juegos de Peak que más gustaron.
- [ ] Revisar varias lecciones de Brilliant y anotar qué interacciones usan en física y química.
- [ ] Citar en `docs/fundacional.md` la evidencia sobre entrenamiento cerebral y sobre fluidez en cálculo.
- [ ] Decidir cuál de las tres entra primero en la hoja de ruta (propuesta: componentes de interacción, porque los usan las otras dos).
