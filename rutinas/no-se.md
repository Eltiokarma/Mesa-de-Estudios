# Rutina «No sé» y alternativas (8 nov 2026)

Rama `rutina/no-se`, desde `claude/awesome-wozniak-5etl1n`. Dos ideas aprobadas por Gerson, tomadas de un sistema de tutoría.

## Tarea 1. La opción «No sé»

- **Pruebas de entrada y salida** (por curso y de lectura): cada ítem trae «No sé» al final, sin letra, con borde punteado y texto suave (`.alt.nose` en `app/estilos.css`). Se registra un `item` con `nose: true`, `opcion: ''`, `correcta: false`, `error: ''`; la `prueba` lleva `nose` (cuántas) y un `0` en `respuestas`. La entrada sigue sin retroalimentación. Textos de la intro: «Si no lo sabes, marca "No sé": nos ayuda más que adivinar».
- **Práctica con generadores** (`app/practica.js`): «No sé» muestra la correcta y la solución sin marcar error (recuadro gris `.retro.nose`) y registra una `prediccion` con `nose: true`. También en las tres preguntas de entrada y salida del módulo.
- **Escenas**: no se tocaron (regla 3).
- **Medición**: `resumir` (por módulo) y `resumirCursos` (por curso y por plantilla) dan `nose` y `confianza` (confianza calibrada = aciertos / (respondidas − «No sé»)). En Hake, «No sé» = no acierto. Columna `nose` al final del CSV. Datos viejos sin el campo: igual que antes. `analizar-medicion.js` muestra las columnas.
- **Teclado**: 0 o N, también en el aviso de teclas.
- **Docs**: `docs/guia-profesores.md`, `docs/arquitectura.md`, `docs/fundacional.md` (Frary 1988 sobre corrección por adivinanza; Hasan, Bagayoko y Kelley 1999 sobre el CRI; el efecto en la medición queda como hipótesis).
- **Pruebas**: unitarias en `catalogo/pruebas/pruebas.test.js`, `nucleo/lectura.test.js` y `nucleo/medicion.test.js`. Navegador: `rutinas/no-se/navegador.js` (Playwright, 390 y 1366 px; necesita `npm run dev`): entrada de física con «No sé» por clic, 0 y N; salida bloqueada sin el enlace y luego abierta con `?salida=fisica`, con la otra forma del orden; práctica de `porcentajes-sucesivos`; entrada de lectura. 44 comprobaciones en verde, sin errores de JavaScript ni desborde horizontal. El orden A→B / B→A y el bloqueo de la salida no cambian.

## Tarea 2. Alternativas que no delatan la correcta

`herramientas/alternativas.js` (tabla: `node herramientas/alternativas.js`) y `herramientas/alternativas.test.js`. Umbrales: más larga sola > 35 % (con 20 ítems o más), única que justifica > 10 %, única con marcas ≥ 1, letra más frecuente en un generador > 50 %.

Antes: todo dentro de los umbrales salvo la pista 2 en lectura, que tenía 12 casos (5 %); 2 eran falsos positivos de la regla («un puesto que», que se arregló en la regla, y uno que bajó al contar «por eso» en una incorrecta). Se corrigieron 10 preguntas (t008, t010, t011, t019, t023, t026, t029, t035 ×2, t051, t053): una incorrecta tomó la forma de la correcta («porque», «así que», «por eso» o dos puntos) con el mismo código y el mismo sentido. Los textos subieron de versión y se regeneró `papel.json`. Después: 0.

| Fuente | Ítems | Más larga sola (antes → después) | Única que justifica | Marcas | Letra más frecuente |
| --- | --- | --- | --- | --- | --- |
| banco (7 cursos) | 260 | 7 % → 7 % (azar 25 %) | 0 | 0 | — |
| lectura | 231 | 17 % → 17 % (azar 23 %) | 12 → 0 | 0 | — |
| 18 generadores | 300 c/u | 0 % a 19 % (azar 20 a 23 %) | 0 | 0 | 21 % a 28 % |

En el banco la correcta casi nunca es la más larga (7 %) y casi nunca la más corta (6 %): queda en el medio. No es una pista que sirva para adivinar, pero un alumno muy entrenado podría descartar los extremos; queda anotado.

## Archivos compartidos tocados

`nucleo/pruebas.js`, `nucleo/lectura.js`, `nucleo/medicion.js`, `app/prueba.js`, `app/practica.js`, `app/lectura.js`, `app/estilos.css`, `herramientas/analizar-medicion.js`, los tres docs y diez textos de `contenido/razonamiento-verbal/textos/` con sus `papel.json`. No se subió `VERSION` de `app/sw.js` ni se corrió `npm run catalogo`: la integración debe hacer las dos cosas (cambió la cáscara de la app).

## Lo que queda

- «No sé» no está en la práctica de lectura (solo en sus pruebas), porque el pedido era para generadores; decidir si se agrega.
- `app/app.js` (panel del perfil) muestra entrada y salida por curso sin «No sé»; podría mostrar cuántos marcó.
- Las diez correcciones de lectura no tuvieron revisión a ciegas aparte: son cambios de forma, con el mismo código.
- Ningún dato real todavía: la utilidad de «No sé» es hipótesis hasta el colegio.
