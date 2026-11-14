# Auditoría de diseño de la teoría (14 nov 2026, noche)

Pedido de Gerson: ver si la teoría tiene el nivel de diseño esperado, revisándola con los tres skills (`diseno-y-animacion`, `estructura-visual-motion` y `arte-generativo-svg`).

**Método.**
- Se revisaron 8 unidades, una por curso, en sus cinco momentos.
- Celular de 360 × 780 en Playwright, a 2× de densidad, en tema claro y oscuro.
- Unidades: física (desplazamiento y distancia), química (tres enlaces), aritmética (porcentajes sucesivos), álgebra (aspa simple), geometría (suma de ángulos), trigonometría (notables), razonamiento matemático (verdades y mentiras) y verbal (lo implícito).
- Además, una pasada automática por las 152 unidades: abren la idea pedida y la ficha, y no dan error de página.
- Lo que se corrigió va marcado con ✔.

## Veredicto en dos ejes

- **¿Se entiende?** Sí. En los ocho cursos la figura dice la idea y el hilo de color une el control, la figura, el texto y la ecuación. Ejemplos:
  - la paralela por A ordena los tres ángulos en una recta;
  - la barra del segundo descuento muerde lo que quedó;
  - la red de iones contra las moléculas sueltas;
  - la tabla de suposiciones que se descarta al chocar.

  La regla trae su condición, y los `siFuera` empiezan por lo que el alumno pensó bien.
- **¿Se siente?** A medias, y bien encaminado. La estructura es constante y legible. Antes de esta revisión:
  - el compañero hablaba con las mismas frases genéricas en los ocho cursos;
  - la respuesta a una predicción quedaba escondida bajo la barra fija;
  - la revelación, que es el momento clave, ocurría sin ninguna señal.

**Problema dominante:** estaba en la capa de interacción del lector (`app/teoria.js`), no en el contenido. Por eso se corrigió para los 152 de una vez.

## Hallazgos (de mayor a menor gravedad)

| # | Prioridad | Qué pasaba | Qué incumple | Arreglo |
| --- | --- | --- | --- | --- |
| 1 | Alta | Al comprobar, la explicación caía debajo de la barra fija de la acción y el botón ya decía «Ver por qué»: se podía seguir sin leerla | Estado honesto; «nada que haya que leer desaparece» | ✔ La explicación se lleva a la vista (`scrollIntoView` con margen para la barra) |
| 2 | Alta | La figura fija tapaba la pregunta y la primera opción al predecir y en «Ahora tú» | Contigüidad espacial: pregunta, opciones y explicación juntas | ✔ La figura es fija solo en «Juega» y «Mira», cuando se manipula o se avanza por pasos |
| 3 | Media | Las reglas con dos relaciones («Δx = A₊ − A₋ · d = A₊ + A₋») se partían a la mitad de una expresión | Fidelidad: la ecuación es contenido | ✔ El separador `'   ·   '` pasa a línea nueva en la regla grande, y fracciones y raíces no se parten. Las unidades que juntan relaciones con `' · '` o `'; '` deben pasar a `'   ·   '` (pendiente, por unidad) |
| 4 | Media | Los ocho compañeros decían lo mismo: «Avanza paso a paso», «No coincide. Miremos qué cambió», «Revisa la solución» | Guía de personajes: cada uno tiene su voz; la personalidad está en cómo responde | ✔ `Teoria.PERSONAJES[curso].voces`: diez líneas por compañero, con su voz de la guía (Luma «comprueba», Nox «creo que…», Faro «¿hay algún caso que la rompa?»). La prueba vigila el tope de 16 palabras |
| 5 | Media | La revelación cambiaba la figura de golpe, sin señal de dónde mirar | Movimiento con oficio (atención); la excepción reservada de la secuencia | ✔ Fundido corto (`medio` 320 ms, `llegar`) solo al revelar; sin animación con movimiento reducido |
| 6 | Baja | «Otro caso» aparecía dos veces: en la acción principal y como botón secundario | Una acción principal por vista | ✔ El secundario sale solo cuando la principal es «Siguiente idea» |
| 7 | Baja | La ruta de la idea y la ficha abrían siempre la primera idea pendiente (las 8 sesiones lo reportaron) | Orientación | ✔ (commit anterior) |
| 8 | Baja | En el juego se mueve con − y + o con una barra: «A a lo ancho», «A a lo alto». Funciona y es accesible, pero no es el gesto del fenómeno (`pogil-v2-rive.md` §5.2) | Ley 7: la dificultad vive en la idea, no en la interfaz | Pendiente: gesto directo sobre la pieza (arrastrar el vértice, tocar la frase en verbal), con − y + como alternativa |
| 9 | Baja | En algunas ideas la representación del juego no es la de «Mira»: en álgebra, juega con el rectángulo de áreas y explica con el aspa | Afinidad: el mismo objeto de principio a fin | Pendiente: revisarlo por unidad. Puede ser deliberado (dos representaciones), pero entonces «Mira» debería empezar por el rectángulo que el alumno movió |
| 10 | Baja | Las figuras chicas (el texto marcado de verbal) dejan una banda vacía, porque la figura reserva 200 px | Jerarquía y aprovechamiento de la pantalla | Pendiente, menor |

## Estructura visual (`estructura-visual-motion`)

- **Constantes:**
  - la tarjeta;
  - la barra de los cinco momentos;
  - el lugar del compañero;
  - la acción abajo;
  - los cuatro colores de variable.

  Bien: dan afinidad, y el cambio de idea se lee como «lo mismo con otra idea».
- **Progresión:** la barra de momentos se llena y la figura acumula rastro en «Mira». Funciona.
- **Excepción reservada:** la revelación es el único momento en que la figura cambia por algo que el alumno no hizo. Antes no estaba marcada; ahora tiene su fundido (hallazgo 5) y nada más se anima en el lector.
- **Riesgo, como hipótesis:** el mismo ritmo de cinco momentos repetido en 4 a 6 ideas por unidad puede cansar.
  - Se comprueba en el piloto con el tiempo por momento y el abandono por idea, con los eventos `teoria`.
  - Si se confirma, la salida es acortar «Juega» y «Mira» en las ideas que son variantes de la anterior, no cambiar el molde.

## Dibujo (`arte-generativo-svg`)

- **Las figuras** son del kit: trazo de 3, 2 y 1 px, rótulos pegados a lo que nombran y sin colores de marca. En grises se distinguen bien los valores (revisado en las hojas en tema oscuro).
- **Los ocho compañeros:**
  - se leen a 72 px y parecen de la misma mano: mismo esqueleto, mismo contorno ciruela y la misma economía de detalle;
  - Luma es la más floja, como dijo su sesión;
  - falta la prueba a ciegas («¿qué animal es?») con alguien que no los conozca. La hoja está en `docs/referencias/`.
- **Siguen siendo provisionales:** el arte final es de Gerson.

## Lo que funciona (no romper)

- El hilo de color en la pregunta, la figura y la ecuación. Ejemplos: P₀ y r₁ en porcentajes, y A, B y C en el triángulo.
- Los `siFuera`: «60° es el ángulo interior en C. El exterior es su vecino en la recta».
- La lectura en vivo bajo la figura del juego.
- El tema oscuro, rehecho y no invertido.
- «Casos probados: 1 de 3», que explica qué falta sin deshabilitar el botón.

## No verificado

- El celular real, el lector de pantalla real y alumnos reales.
- Las 152 unidades a mano: aquí se miraron 8, y las demás solo pasaron el recorrido automático.
- Si el servidor de cuentas guarda `est.teoria`.

## Reporte de diseño

```
Ficha de tarea: el alumno de 3.º a 5.º, en un celular de gama baja, juega, predice y entiende una regla con su condición en 2 a 3 minutos por idea.
Sistema: existente (tokens de app/estilos.css, kit). Decisiones nuevas escritas en docs/teoria.md y en este archivo: voces por compañero, separador de relaciones, figura fija solo en juega y mira, fundido de revelar.
Carácter: acogedora, viva y precisa · firma: el hilo de color.
Movimientos: revelar — atención — medio 320 ms, llegar — sin traslado — sin animación con movimiento reducido. Explicación: la línea de tiempo del kit (paso 900).
Verificación: hallazgos 1 a 7 corregidos; las capturas de antes y después se miraron a 360 px en claro y oscuro; npm test 8488 en verde; las 152 unidades abren su idea y su ficha.
No verificado: celular real, lector de pantalla, alumnos.
Hipótesis: con la explicación a la vista, sube la lectura de siFuera (medible: tiempo entre «Comprobar» y «Ver por qué»).
Conflictos: ninguno con CLAUDE.md.
```
