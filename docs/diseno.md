# Sistema de diseño

5 de noviembre de 2026 · Lo que ya está en `app/estilos.css`. Si algo cambia allá, se actualiza aquí.

## Dirección: acogedora

**Decisión de Gerson (5 nov 2026):** la app tiene que sentirse acogedora, "como comer bombones mientras aprendes matemáticas y ciencias". La referencia que manda es el [*study planner* de Pinterest](referencias/ui-study-planner-pinterest.jpg); la [app de ejercicio](referencias/ui-fitness-dribbble.webp) queda solo como referencia de estructura (reto del día, estadísticas, anillo).

- **Ya aplicado (paleta):** fondo crema (`#fbf3ec`), tarjetas blanco cálido, tinta ciruela, lavanda como marca (`#7f5ae0`) y rosa bombón como acento (`#ffd3e2`). Esquinas más redondas (28 px) y sombras con tono ciruela, no gris. El modo oscuro es ciruela profundo, no azul.
- **Ya aplicado (ilustraciones, `app/ilustraciones.js`):** todo en SVG propio y liviano.
  - El gatito de la app: sentado en el reto del día y dormido cuando no hay pendientes.
  - La taza de chocolate con carita, en la tarjeta de racha.
  - El escritorio de noche de la bienvenida: lámpara, libros, gato, taza y un prisma con arcoíris.
  - Un ícono dibujado por curso, sobre su propio pastel.
  - El ícono de la app: la cara del gato sobre lavanda.
- **Falta (semana de pulido, tarea `pl6`):** animaciones suaves al acertar y una tipografía redondeada común a la app y las escenas.
- **Lo que no cambia:** dentro de las escenas mandan los colores de las variables (regla 4). Lo acogedor va en la cáscara, los fondos y las ilustraciones, no en los datos.

Todos los textos pasan el contraste AA (4,5 a 1) sobre su fondo: blanco sobre lavanda 4,7; gris sobre crema 4,6; tinta sobre crema 13,4.

## Dos familias de color que no se mezclan

| Familia | Colores | Dónde se usa | Dónde no |
| --- | --- | --- | --- |
| **Marca** | Lavanda `#7f5ae0` (`--brand`), rosa bombón `#ffd3e2` (`--acento`) | La cáscara: bienvenida, inicio, cursos, progreso, perfil, botones de la práctica | Nunca dentro de una escena: ahí el morado es la distancia focal y el verde, la separación entre lentes |
| **Variables** | `--c-o` naranja, `--c-i` turquesa, `--c-h` rojo, `--c-d` verde (y el morado `--c-f` solo en escenas) | Enunciados, soluciones y dibujos: cada variable tiene un color y lo conserva en el texto, la figura y la ecuación (regla 4) | Nunca como decoración |

**Variables de circuitos** (`plantillas/circuitos-cc/`): corriente I `--c-I` azul (#1f5fbf, oscuro #7cb0ff), voltaje V `--c-V` magenta (#b3246b, oscuro #ff86bd), resistencia R `--c-R` turquesa (#0f766e, oscuro #5ed9c8) y potencia P `--c-P` ámbar (#8f5800, oscuro #ffc04d). El halo de cada bombilla usa `--luz`, la versión luminosa del ámbar, y su área es proporcional a P. Variables de calorimetría (`plantillas/calorimetria/`): temperatura T `--c-T` rojo (#c0364a, oscuro #f17384), calor Q `--c-Q` azul (#1f5fbf, oscuro #7cb0ff), masa m `--c-m` naranja (#b85a06, oscuro #f0a04a), calor específico c `--c-c` verde (#4f7a17, oscuro #a3d65e) y calor latente L `--c-L` morado (#6b3dbd, oscuro #ab8cf2). En las gráficas temperatura-calor, las rampas van en el color de c y las mesetas en el de L. Variables de energía (`plantillas/energia/`): masa m `--c-m` naranja, altura h `--c-h` verde (#4f7a17, oscuro #a3d65e), rapidez v `--c-v` rojo (#c0364a, oscuro #f17384), compresión x `--c-x` turquesa (#0f766e, oscuro #5ed9c8), energía potencial `--c-Ep` índigo (#0b0b8e, oscuro #607ffb), energía cinética `--c-Ec` celeste (#0979aa, oscuro #25caf4), energía elástica `--c-Ee` fucsia (#c610c6, oscuro #f91ff9), constante k `--c-k` morado, fuerza F y su trabajo `--c-F` azul, roce y calor `--c-f` ámbar (#8f5800, oscuro #ffc04d) y potencia P `--c-P` magenta (#b3246b, oscuro #ff86bd). Las energías tienen colores propios: ningún color nombra dos cosas. Los once se eligieron con la diferencia de color CIEDE2000 para que cada par se distinga (la diferencia mínima entre los nuevos y los demás es de 12,6, y el celeste de Ec además se separa al menos 32° en tono) y todos pasan el contraste AA sobre el papel, en claro y en oscuro. Once colores es casi el límite de lo que se distingue a simple vista: una escena nueva no debería necesitar más. Variables de MRUV (`plantillas/mruv/`): posición x `--c-x` azul (#1f5fbf, oscuro #7cb0ff), velocidad v `--c-v` rojo (#c0364a, oscuro #f17384), aceleración a `--c-a` verde (#4f7a17, oscuro #a3d65e) y tiempo t `--c-t` naranja (#b85a06, oscuro #f0a04a). El área bajo v-t va en el color de x (es un desplazamiento) y el área bajo a-t, en el de v (es un cambio de velocidad). El segundo móvil usa los mismos colores con línea a trazos. Cada escena define sus variables; dentro de una misma escena, un color nunca nombra dos cosas.

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
| Aviso | `.aviso` | Una sola línea en rosa bombón para motivar o para ofrecer el siguiente paso |

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
