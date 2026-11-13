# Escena viva: el ejercicio se cuenta solo

13 de noviembre de 2026. Contrato común del rediseño: lo leen las rutinas de kit, mascota y la tanda de 7000 ejercicios antes de escribir código. Si una regla de aquí choca con `CLAUDE.md`, manda `CLAUDE.md`. Complementa `docs/diseno.md` (colores, pegatinas) y la sección B de `docs/pendientes.md` (plan de tres capas: alma, movimiento y escenas).

## 1. Diagnóstico (medido el 13 nov, celular de 390 px)

| Dónde | Qué se ve | Qué incumple |
| --- | --- | --- |
| Escena MRUV, paso a paso | Entre 112 y 231 palabras en pantalla por paso, 9 pasos que se recorren con «Siguiente». La explicación está debajo de las gráficas: al leer el paso 5, las gráficas quedan fuera de la pantalla | Contigüidad espacial y temporal (Mayer): el texto que explica el área bajo v-t no está junto al área. El fenómeno se entiende leyendo, no mirando |
| Escena MRUV, paso 5 | Al alumno le aparece «El objetivo más difícil del test de Beichner (1994)… solo el 23 % lo logró» | Coherencia: un dato de investigación no es para el alumno. Va a `docs/investigacion/` |
| Práctica `rm-balanzas` | El enunciado narra en texto las tres balanzas («(1) a la izquierda, 1 rombo; a la derecha, 2 círculos…») y debajo vienen dibujadas | Redundancia: el texto repite la figura y compite con ella |
| Prácticas `porcentajes-sucesivos` y `vectores-ley-cosenos` | Solo texto y alternativas; sin figura. La solución es una lista numerada de frases | No hay una representación que deje ver la relación. Parece libro |
| Retroalimentación de la práctica | El error se explica con un párrafo; nada cambia en un dibujo | El error se cuenta, no se muestra |

Veredicto en dos ejes: **¿se entiende?** a medias (se entiende leyendo); **¿se siente?** no (la cáscara es acogedora y el ejercicio, seco). El problema dominante está en la capa de **representación**, no en el acabado: pulir colores no lo arregla.

## 2. Carácter

- **Tres adjetivos:** acogedora (ya decidido el 5 nov), **viva** (lo que importa se mueve porque el alumno lo mueve) y **precisa** (cada número que se ve es real y tiene unidad).
- **Firma: el hilo de color.** La variable que está en el enunciado viaja, con su color, al dibujo y a la ecuación (regla 4). Se repite en cuatro lugares: el dato del enunciado, el objeto del dibujo, el término de la ecuación y el control que la mueve. Al tocar un dato del enunciado se ilumina su objeto, y al revés.
- **La mascota** es marco: vive en un lugar fijo, actúa entre tareas y descansa mientras el alumno piensa (sección 6).

## 3. Reglas del ejercicio vivo

1. **Presupuesto de texto** (se comprueba con `herramientas/validar-ejercicios.js`):
   - enunciado de 40 palabras como máximo, sin contar los datos con color;
   - cada paso de la solución, 14 palabras como máximo, más su ecuación;
   - la explicación de un error, 20 palabras como máximo: el resto lo dice el dibujo;
   - en pantalla nunca hay más de 60 palabras fuera del enunciado.
   Los exámenes oficiales reproducidos (regla 5) conservan su enunciado tal cual: el presupuesto se aplica a lo que escribimos nosotros.
2. **Figura primero.** Todo ejercicio trae una figura armada con una pieza del kit (sección 5). El enunciado no narra lo que la figura ya muestra.
3. **La respuesta se manipula cuando el tipo lo permite.** Arrastrar un valor sobre una barra o una recta, mover un punto o una flecha, poner fichas. Las alternativas A–E quedan para lo que no se puede manipular y para las pruebas de entrada y salida, que se parecen al examen. Toda manipulación tiene alternativa sin arrastrar (botones − y +, o escribir el valor).
4. **Predecir sigue bloqueando (regla 3).** Es el único punto que bloquea. Después, nada depende de «Siguiente».
5. **La solución es una línea de tiempo, no una lista.** Cada paso es un estado de la figura; el alumno arrastra un cursor de pasos (o toca ▶, que avanza y se detiene en cada paso esperando). Cada paso deja rastro: lo calculado se queda dibujado. El estado final se entiende sin haber visto la animación (se puede saltar al final).
6. **El error se muestra.** La opción elegida se dibuja como fantasma sobre la misma figura, junto a la correcta, con una línea de texto. Por ejemplo: la barra del 45 % (sumar descuentos) frente a la del 40,5 % (multiplicar lo que queda).
7. **Rótulos pegados a lo que nombran.** Nada de leyendas lejanas. Una lectura en vivo (valor con unidad, cifras tabulares) no cuenta como texto.
8. **Nada de investigación en pantalla.** Fuentes, porcentajes de estudios y códigos de error van a `docs/` y a la medición, nunca al alumno.
9. **Movimiento con oficio.** Se anima el cambio que hay que inferir y se congela lo que hay que comparar. La interfaz usa `micro` 120, `corto` 200, `medio` 320 y `largo` 480 ms, y cada paso de explicación, `paso` 900 ms con pausa estable. Con `prefers-reduced-motion`, los mismos estados sin traslados.

## 4. Formato del ejercicio (amplía el formato «predicciones»)

Lo que ya devuelven los generadores (`enunciado`, `pregunta`, `variables`, `alternativas`, `solucion`, `figura`) sigue valiendo: la app viva lee primero los campos nuevos y, si no están, muestra el formato de hoy. Así se migra módulo por módulo, sin romper nada.

```js
{
  // ... campos de hoy ...
  escena: {
    pieza: 'barra-porcentaje',          // id del catálogo de piezas (nucleo/kit/piezas/)
    datos: { total: 300, tramos: [...] }, // lo que necesita la pieza; lo calcula el generador (regla 1)
    alt: 'Barra de S/ 300 que pierde primero el 15 % y luego el 30 % de lo que queda'
  },
  respuesta: {                           // opcional; sin esto se responde con alternativas
    tipo: 'arrastrar',                   // 'elegir' | 'arrastrar' | 'punto' | 'fichas'
    control: 'marca',                    // qué se arrastra dentro de la pieza
    tolerancia: 0.5, unidad: '%'
  },
  pasos: [                               // la línea de tiempo de la solución
    { estado: { corte: 1 }, texto: 'Queda el 85 %.', ecuacion: [v('P','300'), ' × 0,85 = 255'] },
    { estado: { corte: 2 }, texto: 'El 30 % se quita de lo que quedó.', ecuacion: [...] }
  ],
  fantasmas: { 'suma-descuentos': { marca: 45 } } // cómo dibuja la pieza cada error con nombre
}
```

- `escena.pieza` sale de un catálogo cerrado. Una pieza nueva se agrega al catálogo con sus pruebas; no se dibuja a mano dentro de un generador.
- `pasos[i].estado` es lo que la pieza dibuja en ese paso: la pieza es una función pura `estado → dibujo`, y así el cursor puede ir adelante y atrás.
- `fantasmas` usa los mismos `id` de error que las alternativas: la medición no cambia.

## 5. El kit (`nucleo/kit/`)

- **Trazo:** 3 px para la variable en estudio, 2 px para contornos y 1 px para cuadrículas. Puntas redondas. Flechas con la misma punta en todo el kit.
- **Texto en SVG:** 14 px o más medido a 360 px de ancho; cifras tabulares.
- **Color:** solo los tokens de variable (`--c-o`, `--c-i`, `--c-h`, `--c-d` y los de cada curso en `docs/diseno.md`). El color de marca y el del curso nunca entran en la figura.
- **Primeras piezas** (las que más ejercicios cubren): `barra-porcentaje` (porcentajes, fracciones, mezclas, reparto), `recta` (números reales, intervalos, posición), `balanza` (RM, ecuaciones), `flechas` (vectores, fuerzas), `triangulo` (geometría, trigonometría) y `ejes` (gráficas, funciones, MRUV).
- **Línea de tiempo** (`nucleo/kit/linea-tiempo.js`): cursor de pasos con ▶ y pausa, teclado (← →) y foco visible. Es la misma para todas las piezas.

## 6. Mascota (hueco para Rive)

- Lugar fijo en la práctica y en las escenas, junto al mensaje de retroalimentación y fuera de la figura. Se reserva el espacio desde la primera pintura: que llegue o no la mascota no mueve nada.
- **Varias mascotas:** cada una vive en `app/mascotas/<id>/` con `mascota.json` (nombre, archivo `.riv`, máquina de estados, entradas) y un respaldo SVG. Se puede asignar una por curso.
- **Repertorio cerrado** (igual para todas): `reposo`, `saluda`, `señala`, `espera`, `celebra`, `acompaña`, `ayuda` e `hito`.
- **Contrato con el archivo Rive:** máquina de estados `Mesa`, entrada numérica `pose` (0 reposo, 1 saluda, 2 señala, 3 espera, 4 celebra, 5 acompaña, 6 ayuda, 7 hito) y entrada booleana `reducido` (movimiento reducido). Quien diseñe en Rive solo tiene que respetar esos nombres.
- **Eventos de la app → pose:** acierto → `celebra`; error → `acompaña` (lo que se dice va en texto, junto a la figura); «No sé» → `ayuda`; consigna nueva → `señala` y vuelve a `reposo` cuando el alumno toca algo; fin de la práctica o prueba de salida → `hito`.
- Sin `.riv`, o sin conexión antes de cachearlo, se ve el respaldo SVG con la misma pose por clase CSS. La app nunca espera a la mascota.

## 7. Escalar a 7000 ejercicios

El detalle está en `docs/ejercicios-7000.md` (rutina de la tanda). En corto: cada ejercicio entra como JSON con su tipo, se mapea a una pieza del kit y a un generador o a una instancia fija, se valida con `herramientas/validar-ejercicios.js` (presupuesto de texto, pieza existente, respuesta recalculada por código y conteo por curso, tipo y pieza) y recién entonces se publica. La primera tanda migra los tipos con más ejercicios, no los más bonitos.
