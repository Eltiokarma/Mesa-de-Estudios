# Sistema de diseño

5 de noviembre de 2026 · Lo que ya está en `app/estilos.css`. Si algo cambia allá, se actualiza aquí.

## Dos familias de color que no se mezclan

| Familia | Colores | Dónde se usa | Dónde no |
| --- | --- | --- | --- |
| **Marca** | Morado `#7b61ff` (`--brand`), lima `#d6f36a` (`--lime`) | La cáscara: bienvenida, inicio, cursos, progreso, perfil, botones de la práctica | Nunca dentro de una escena: ahí el morado es la distancia focal y el verde, la separación entre lentes |
| **Variables** | `--c-o` naranja, `--c-i` turquesa, `--c-h` rojo, `--c-d` verde (y el morado `--c-f` solo en escenas) | Enunciados, soluciones y dibujos: cada variable tiene un color y lo conserva en el texto, la figura y la ecuación (regla 4) | Nunca como decoración |

Correcto e incorrecto usan `--ok` (verde) y `--warn` (rojo), siempre con texto (“¡Bien!”, “Elegiste la B…”) y nunca solo con el color.

El modo oscuro redefine todos los tokens. Se sigue al sistema o se fija en Perfil → Apariencia.

## Tipografía y forma

- Letra del sistema (`system-ui`): no se descarga nada, así carga rápido en celulares de gama baja y sin conexión.
- Tamaños: títulos de 26 px (30 px en pantalla grande), secciones de 19 px, texto de 16 px y enunciados de 17 a 18 px.
- Números con `tabular-nums`. Se escribe con coma decimal y espacio de miles.
- Bordes redondeados: 24 px en tarjetas grandes y 16 px en filas y alternativas. Una sola sombra suave (`--shadow`).

## Componentes

| Componente | Clase | Uso |
| --- | --- | --- |
| Tarjeta destacada | `.reto` | Una por pantalla: el reto de hoy |
| Estadística | `.stat` | Las cifras de “Hoy” y los resultados de las pruebas |
| Fila | `.item` | Listas que llevan a otra pantalla |
| Tarjeta de curso | `.curso` | Grilla de cursos con barra de avance |
| Chip | `.chip` | Elegir una opción (universidad, grado, tema) |
| Alternativa | `.alt` | Predicciones. Lleva una letra (A–E) y cambia a `ok` o `mal` |
| Variable | `.var.c-*` | Un dato del enunciado con su color |
| Aviso | `.aviso` | Una sola línea en lima para motivar o para ofrecer el siguiente paso |

## Dos pantallas: celular y laboratorio de cómputo

- **Celular (lo primero).** Una columna de hasta 560 px y una barra de navegación abajo, al alcance del pulgar.
- **Pantalla grande (desde 900 px).**
  - La barra pasa a un menú lateral fijo de 240 px, con el logo.
  - Inicio, progreso y perfil se arman en dos columnas.
  - Los cursos van en una grilla que se llena sola y las unidades en dos columnas.
  - La bienvenida pone la portada a la izquierda y el formulario a la derecha.
  - La práctica se queda en 760 px, como una hoja, con las alternativas en dos columnas.
- **Con mouse y teclado** (`hover:hover` y `pointer:fine`):
  - Las tarjetas responden al pasar el puntero.
  - En la práctica, A–E o 1–5 eligen una alternativa y Enter pasa al siguiente problema.
  - Debajo de las alternativas aparece una pista con esos atajos. En el celular no se muestra.

La forma de la página la decide la clase `con-nav` y el atributo `data-ruta` del `body`, que pone `app.js` en cada cambio de pantalla.

## Pendiente

- Probar en computadoras como las del colegio (tarea `la2` de la hoja de ruta): resolución, navegador y velocidad.
- Escenas en pantalla grande: el Banco Óptico ya ocupa todo el ancho. Las escenas nuevas se diseñan primero para el celular y se revisan a 1366 × 768.
