# Prueba pequeña: polinomios y grados

Seis actividades propias prueban el recorrido predicción → cálculo → explicación. El motor reduce términos semejantes antes de calcular grados y permite explorar exponentes dependientes de un entero en un intervalo explícito. Hay cinco ejercicios propios para papel. Es un experimento separado del catálogo, no un módulo publicado ni una calculadora algebraica general.

Abrir `index.html` directamente: no requiere servidor, conexión ni API. Las respuestas permanecen sólo en memoria mientras la página está abierta. No hay medición ni persistencia entre sesiones todavía.

## Qué se reutilizó

Las fichas locales ya guardadas de polinomios y grados orientaron las condiciones que hay que conservar: exponentes completos, diferencia entre grado absoluto y relativo, homogeneidad, completitud y dominio entero no negativo. Se consultaron las fichas, sin repetir OCR ni leer otra vez los PDF. Los ejercicios, textos y gráficos de esta prueba son propios; no se incluyen recortes ni enunciados de los libros.

Referencias de trabajo: índice `fuentes/cuzcano/archivo-ejercicios.json`, fichas locales de los problemas 240, 241, 248 y 249 de Álgebra. No son ejercicios del producto. Los casos de prueba también cubren cancelaciones, ausencias de potencias y el polinomio cero.

## Contrato del motor

`motor.js` funciona con `require` en Node y con `MotorPolinomios` en el navegador. No usa DOM, red ni evaluación de texto como código.

- `analizar([{c, x, y}, …])`: coeficiente entero seguro y exponentes enteros de 0 a 1000. Máximo 64 términos. Agrupa por ambas potencias, elimina coeficientes cero y devuelve términos reducidos, grado absoluto, grados relativos, homogeneidad y completitud en cada variable. No muta la entrada.
- El polinomio cero devuelve `grado: null`, grados relativos nulos y `homogeneo: null`: no se le atribuye falsamente grado cero. Una constante no nula sí tiene grado cero.
- Completo en x significa que aparecen todas las potencias de x desde su grado hasta cero, con coeficientes no nulos que pueden ser polinomios en y. Análogo para y.
- `explorar(familia, desde, hasta)`: cada exponente tiene forma `{a,b,d}` para `(a*n+b)/d`. Sólo admite coeficientes positivos constantes; así una cancelación no puede esconder exponentes inválidos. Recorre a lo sumo 501 enteros y explica las exclusiones. No resuelve dominios reales ni infiere mínimos globales fuera del intervalo.
- Rechaza coeficientes no enteros, exponentes no admitidos, denominadores no positivos, límites excedidos y operaciones fuera del rango entero exacto. No simplifica primero expresiones con exponentes inválidos que podrían cancelarse.

## Comprobaciones

Desde la raíz:

```sh
npm --prefix experimentos/polinomios-grados test
python experimentos/polinomios-grados/verificar_independiente.py
```

Diecisiete pruebas de Node aprobadas. El contraste de Python usa diferencias finitas de evaluaciones enteras para obtener los grados, en vez de repetir el algoritmo del motor; verifica además las familias con fracciones exactas. El script regenera `papel.html` a partir de `papel.json`.

`verificar_interfaz.cjs` comprueba con Playwright que no se revele la solución antes de responder, los resultados de las seis actividades, la navegación y la conservación de respuestas dentro de la sesión. También revisa el ancho móvil y el acceso a papel. Requiere Playwright ya disponible; no instala ni descarga nada. Puede indicarse el navegador mediante `POLINOMIOS_BROWSER`.

Se comprobó en Chrome local, en escritorio y a 390 px de ancho, y se inspeccionaron las capturas. No se ejecutó la suite completa de la app: este checkout local es parcial y la prueba no modifica plantillas, catálogo, servicio offline ni código de la app existente. Su propio `npm test` pasa.

## Antes de integrar

Evaluar esta prueba con Gerson. Después decidir si el alcance justifica una plantilla del catálogo, añadir medición con el sistema existente y verificar la suite completa del repo. No se ha creado un generador ilimitado de preguntas ni se ha ampliado el OCR. No se atribuyen errores pedagógicos a evidencia no investigada: se pide respuesta numérica libre, sin distractores presentados como documentados.

## Segunda tanda: tres actividades adicionales

Se incorporan homogeneidad con parámetro, potencias ausentes respecto de x y grado mínimo dentro de un intervalo entero explícito. `resolverActividad` concentra el cálculo de las respuestas en el motor; la interfaz sólo presenta el resultado. Para homogeneidad se exige solución única y, para el mínimo, al menos un valor admisible. El contraste independiente lee el banco de datos mediante Node, sin cargar el motor, y comprueba las seis respuestas en Python. Se mantienen los cinco ejercicios de papel y los identificadores de las primeras actividades.
