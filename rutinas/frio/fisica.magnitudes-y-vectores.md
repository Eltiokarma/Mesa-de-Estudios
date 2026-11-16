# Lector en frío: fisica.magnitudes-y-vectores

Método: `docs/plan-calidad.md`, filtro 2. Un agente sin contexto hace de alumno de 5.º y ve solo las capturas a 360 × 780.

## Idea 1, «Otra unidad, otro número»: Juega (16 nov 2026)

**Aprendizaje esperado (no se le mostró):** el poste mide lo mismo en cualquier unidad; cambia el número: en decímetros es 10 veces más y en centímetros, 100 veces más.

**Lo que dijo que aprendió:** «El poste mide lo mismo; lo que cambia es el número según la unidad, porque 1 m = 10 dm = 100 cm, así que de metros a centímetros multiplico por 100 (6,5 m = 650 cm).» Coincide.

**¿Sin profesor?** «Sí. La misión y la leyenda se entienden solas.»

**Lo que señaló y cómo se corrigió:**

| Señal del lector | Corrección |
| --- | --- |
| Las etiquetas «7,4 m», «74 dm» y «740 cm» tapan a medias los números 8, 80 y 800 de las reglas. | La regla no escribe el número que caería bajo la etiqueta. |
| El botón fijo «Siguiente» tapa el pie de la figura. | La figura bajó de 380 a 334 de alto. |
| «Casos probados: 1 de 3» no se entiende. | Dice «Prueba 3 valores distintos: llevas 1.» (en todas las unidades). |
| La pregunta de Tilo («¿cambia el poste o el número?») confunde, porque en el juego el poste sí cambia al mover la barra. | Ahora pregunta: «Mira las tres reglas: ¿marcan alturas distintas o la misma altura con otro número?». |
| No se sabe cuánto vale cada rayita chica ni cuánto baja cada toque del −. | Pendiente: decidir con Gerson si hace falta. |
| El subrayado punteado bajo «L» (término del glosario) no se sabe si se toca. | Pendiente: es de toda la app, no de esta idea. |

## Idea 1 completa: Lee, Predice, Mira, La regla, Así se resuelve y Ahora tú (16 nov 2026)

Se rehízo el resto de la idea:
- **Lee:** se agregaron 4 tarjetas.
- **Combi:** la de Predice, Mira y Así se resuelve se dibuja con una pieza nueva, `fis-combi`.
- **La regla:** se liga al poste y a la combi.
- **Ejercicios:** largos y rapidez, con situaciones creíbles.

Pasaron tres lectores en frío, cada uno nuevo.

**Primer lector («más o menos»).** Encontró:
- en «Mira», el botón grande llevaba a «La regla» desde el paso 1, y se saltó la explicación;
- en «Así se resuelve», el paso nuevo quedaba bajo el botón;
- un salto del poste a los km/h sin presentar las unidades compuestas;
- frases genéricas de Tilo («Antes de mover nada», «Ya tenemos modelo», «Escena nueva, sin el juego»);
- un bus a 144 km/h, que no es creíble.

Todo se corrigió:
- «Mira» avanza con «Paso N de M» (vale para todas las unidades);
- el paso nuevo de «Así se resuelve» queda a la vista (también en todas);
- una tarjeta de «Lee» presenta las unidades compuestas;
- las voces de Tilo cambiaron, y en todos los compañeros «la ficha» pasó a ser «el resumen»;
- los ejercicios usan rapideces creíbles.

**Segundo lector («más o menos»).** Aprendió el método solo y resolvió bien el caso final (108 km/h = 30 m/s). Le quedaron tres preguntas para un profesor:
1. De dónde sale el 3,6.
2. Por qué 1000 m sobre 1 km «vale 1».
3. Cómo se usan los m², que se mencionaban sin ningún ejemplo.

Se corrigió así:
- «Mira» tiene ahora 6 pasos: uno dice que 1000 m y 1 km son el mismo largo, y otro, que por 1000 y entre 3600 es lo mismo que entre 3,6;
- la explicación del error en «Predice» ya no nombra el 3,6 sin contexto;
- las conversiones de áreas y volúmenes salieron de esta idea: llegaban sin preparación. Se proponen para otra idea al reordenar la unidad.

**Revisión a mano de las cuentas** (semillas de «Así se resuelve» y «Ahora tú»):
- 54 km/h = 15 m/s;
- 90 km/h = 25 m/s;
- 108 km/h = 30 m/s;
- 18 m = 1800 cm;
- 8,5 m = 850 cm;
- 55 min = 3300 s;
- 25 m/s = 90 km/h;
- 15 m/s = 54 km/h.

**Tercer lector («más o menos»).** Aprendió la receta (dividir entre 3,6), pero no la idea de los factores. Le faltaba saber:
- por qué 1000 m sobre 1 km «vale 1»;
- por qué la fracción de la hora sale al revés en «Mira» y en «La regla»;
- qué es el «·».

Se corrigió así:
- «Mira» es ahora una cadena de 7 pasos donde las unidades se tachan arriba con abajo; `{ tacha }` es nuevo en `nucleo/ecuacion.js`;
- la regla dice cómo se pone cada factor («arriba si estaba abajo, y al revés»);
- la multiplicación se escribe «×»;
- Tilo ya no dice «Nuestra predicción»;
- se quitó la arroba de «Lee».

**Cuarto lector («más o menos, tirando a sí»).**
- **Lo que logró solo:**
  - resolvió el caso final con los factores tachando unidades (108 km/h = 30 m/s);
  - armó solo el caso al revés con la regla, sin que se lo enseñaran (10 m/s = 36 km/h).
- **Lo que señaló, ya corregido:**
  - por qué 1000 m entre 1 km da 1: ahora «algo entre algo igual da 1»;
  - de dónde salió su error: la explicación muestra 72 × 3,6;
  - de dónde sale el 3600: ahora «60 × 60 s»;
  - el kilogramo de «Lee», que no se usaba: se quitó;
  - la respuesta del ejemplo resuelto: queda a la vista.
- **Lo que queda pendiente (es de toda la app):**
  - el botón fijo tapa parte del contenido hasta que se baja la pantalla;
  - las palabras del glosario, subrayadas con puntos, no dicen que se pueden tocar.

