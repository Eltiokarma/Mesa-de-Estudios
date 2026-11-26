# Encargo: que cada objeto dibujado se reconozca (26 nov 2026)

Gerson, 26 nov: en Longitud de arco el texto habla de un columpio y el dibujo es un diagrama de líneas (dos rayas en A,
un círculo, una línea naranja y un palito). Ya tenía `calidad: 2`: ningún filtro preguntaba si el objeto se reconoce.
Gerson eligió que una sesión aparte recorra casi toda la app y redibuje lo que no se reconoce (opción A). La sesión
principal integra el resultado después.

Rama propia: `claude/dibujos-reconocibles`, desde `claude/modest-noether-f3jcuw`. Un commit por pieza. No abras PR.

## Alcance

Los dibujos de prueba: lo que dibujan las piezas de `nucleo/kit/piezas/` con `data-prueba="si"` (unas 60 piezas) y los
objetos de `nucleo/kit/objetos/`, en todas las unidades que los usan, primero las que tienen `calidad: 2`.

**No toques por ahora** (la Etapa 9 las está escribiendo en otra sesión): las piezas `alg-cenefa`, `arit-cuadrado`,
`arit-calculadora`, `quim-reaccion`, `rm-casillas`, `trig-pos`, `geo-objeto`, `fis-estatica` y `fis-gravitacion`, ni las
unidades Binomio de Newton, Potenciación y radicación, Puntos notables, Reacciones y balance, Arreglos numéricos,
Cohesión y coherencia, Reducción al primer cuadrante, Impulso y choques y Gravitación. De esas piezas haz solo el
diagnóstico (paso 2), sin redibujar.

## Pasos

1. **Inventario.** Para cada pieza, la lista de objetos que dibuja (su cabecera los documenta) y qué unidades e ideas
   los usan (grep de `objeto: '<nombre>'` en `contenido/teoria/`). Escríbelo en `docs/dibujos/inventario.md`.
2. **Diagnóstico con capturas.** Saca una captura de cada objeto en su primera pantalla (`node
   herramientas/capturas-teoria.js <unidad> <carpeta> momentos`, servidor propio con `PORT`, cerrado por su PID). Míralo
   sin leer el texto de la app y anota: «se reconoce», «se reconoce a medias» (qué falta) o «no se reconoce». La prueba
   es la del lector en frío: un alumno de 5.º que solo ve el dibujo, ¿diría qué es? Una tabla por curso en
   `docs/dibujos/diagnostico.md`, con la ruta de la captura.
3. **Redibujo** de lo que no se reconoce o se reconoce a medias, con las skills `anthropic-skills:arte-generativo-svg`
   y `anthropic-skills:arte-vectorial`. Ejemplo, el columpio: travesaño de madera con sus dos postes, cadena con
   eslabones (o dos cadenas paralelas en perspectiva), asiento de tabla; si hay un niño, sencillo y sin tapar el arco.
   Las reglas que no cambian:
   - **La geometría de la física no se mueve.** El radio, el ángulo, el arco, los puntos que rotula la pieza y lo que
     comprueban sus pruebas quedan igual: el objeto se viste encima. Si la pieza exporta una función `geometria`, sus
     números no cambian.
   - Los colores de las variables (`docs/diseno.md`) y los rótulos siguen donde están y legibles; nada encimado.
   - Claro y oscuro, a 390 px y a 1280 px.
   - Sigue marcado `prueba: true` / `data-prueba="si"`: Gerson decide después cuáles pasan a un diseñador.
   - Ningún dibujo nuevo delata una respuesta (lección 5 de `docs/metodo/unidad/etapa-delegada.md`).
4. **Comprobación.** Las pruebas de cada pieza tocada y de las unidades que la usan
   (`npm run -s test:corto -- 'nucleo/kit/piezas/<pieza>*.test.js' 'contenido/teoria/<curso>/*.test.js'`), y al final
   `contenido/teoria/teoria.test.js`. Captura de antes y después de cada objeto redibujado en `docs/dibujos/antes-despues/`
   (webp, livianas) y la tabla de `diagnostico.md` actualizada.
5. **Cierre.** Si cambia la cáscara de la app, sube `VERSION` en `app/sw.js`. Mensaje final: cuántos objetos revisados,
   cuántos redibujados por curso, los que quedan para un diseñador y la lista de commits. Sube la rama con
   `git push -u origin claude/dibujos-reconocibles`.

Lee `CLAUDE.md` primero (reglas de lectura medida: no abras enteros los archivos grandes de `contenido/teoria/`; usa
`node herramientas/mapa-unidad.js`). Gasta con medida: el diagnóstico es lo que más vale; redibuja empezando por los
objetos de las unidades con `calidad: 2` que se usan en más ideas.
