# Teoría de Química, ronda 2: gesto, llaves, laboratorio y tipografía (14 nov 2026, noche)

Encargo: `rutinas/encargos/teoria2-quimica.md`. Rama `teoria2/quimica`, salida de `claude/awesome-einstein-ch5g9a`. Están hechas las 20 unidades de `contenido/teoria/quimica/`, con un commit por unidad.

**Cómo se trabajó.**
1. La sesión principal agregó geometría a las piezas `quim-*` e hizo gases a mano, como modelo del curso.
2. Las otras 19 unidades las hicieron cuatro subagentes en worktrees aislados, con el mismo brief. La sesión principal integró sus commits con cherry-pick, corrió las pruebas y subió.

**Pruebas.**
- `node --test contenido/teoria/teoria.test.js nucleo/kit/piezas/*.test.js`: en verde después de cada unidad.
- `npm test` completo, antes del último push: ver el final de este archivo.
- Ojo: `node --test nucleo/kit/piezas/` (la carpeta, como dice el encargo) no corre las pruebas en esta versión de Node. Hay que usar el glob.

**Recorrido.** Se hizo en Playwright a 360 × 780 con el script `pw-teoria.js`, que quedó en el scratchpad de la sesión y no se versiona. El recorrido:
- arrastra con el mouse cada manija de las ideas con arrastre e imprime la lectura antes y después;
- recorre cada mesa del laboratorio y guarda 2 casos;
- abre la ficha con todas las ideas marcadas como hechas, para ver las reglas con sus llaves a 360 px.

## Cifras

| | Total |
| --- | --- |
| Ideas | 97 |
| Ideas con arrastre | 47 |
| Ideas sin arrastre (con su razón abajo) | 50 |
| Mesas de laboratorio | 43 (todas las unidades con 2 o 3) |
| Unidades con al menos una idea con arrastre | 20 de 20 |
| Unidades con al menos una mesa con arrastre | 20 de 20 |

Casi todas las ideas sin arrastre **eligen entre sustancias, moléculas, reacciones o procesos distintos** (controles de opciones sin una magnitud continua). Ahí, agarrar algo sería inventar un gesto. En dos casos, el gesto hasta representaría la idea errónea que la unidad combate:
- en aromáticos, deslizar un doble enlace por el anillo dice «los dobles saltan» (EN6);
- en cis-trans, pasar el CH₃ al otro lado dice «el doble enlace gira» (QM-GIRO-DOBLE).

## Por unidad

### Gases

**Ideas con arrastre (3 de 5):**
- una-condicion: el émbolo, que mueve V;
- ecuacion-estado: el émbolo, que mueve P (V = RT/P);
- graham: el punto se desliza por la curva y cae en el gas más cercano.

**Sin arrastre:**
- presiones-parciales: agregar partículas no tiene manija;
- gas-de-reaccion: es una cadena de texto.

**Mesas:**
- cilindro-completo: n, V y T con rangos más amplios, hasta 100 K y presiones altas;
- mezcla-embolo: tres gases bajo el émbolo.

**Hallazgo 9:** comentario en la idea 1 (el émbolo da un estado; la curva P–V los junta).

### Ácidos y bases

**Ideas con arrastre (2 de 4):**
- ph-al-diluir: el pH final se corre por la recta;
- neutralizacion: el punto sobre la curva de titulación, que mueve V.

**Sin arrastre:**
- acido-da-proton: elige entre reacciones;
- fuerte-no-es-concentrado: dos opciones discretas, y la lupa solo cuenta.

**Mesas:**
- vaso-que-se-diluye: el nivel del vaso agrega agua; muestra que el débil se ioniza más al diluir, algo que la idea no deja probar;
- titula-cualquiera: tres ácidos por tres concentraciones, con el HCl punteado para comparar.

**Hallazgo 9:** comentario en neutralizacion.

### Equilibrio químico

**Ideas con arrastre (1 de 4):**
- equilibrio-dinamico: el instante sobre la curva.

**Sin arrastre:**
- kc-kp: tres mezclas fijas;
- grado-reaccion: α no es una posición en la lupa;
- le-chatelier: perturbaciones discretas.

**Mesas:**
- mezcla-libre: Q se arrastra por la recta, que llega a 50;
- desde-cualquier-lado: k de ida y de vuelta, con tres puntos de partida.

**Hallazgo 9:** comentario en grado-reaccion.

### Cinética química

**Ideas con arrastre (5 de 5):**
- rapidez-pendiente: el inicio de la cuerda;
- perfil-energia: la cima y el nivel de los productos;
- factores-velocidad: la línea de Eₐ;
- orden-reaccion: el punto sobre r–[A];
- vida-media: [A]₀.

**Mesas:**
- perfil-catalizador: con la segunda cima punteada;
- curva-con-todo: órdenes 0, 1 y 2, con k, [A]₀ y el instante.

### Electroquímica

**Ideas con arrastre (3 de 4):**
- espontaneidad: la punta y la cola de la flecha en la escala;
- electrolisis-faraday: el punto, que mueve t, y el extremo de la recta, que mueve I;
- pourbaix: el punto en 2D (pH y E).

**Sin arrastre:**
- pila-galvanica: se eligen metales, y `quim-celda` no expone geometría (ver pedidos).

**Mesas:**
- escala-completa: los 7 pares;
- deposito-libre: 5 metales;
- metal-en-el-mapa.

**Hallazgo 9:** comentario en Faraday (la gráfica m–t y la celda de «Mira»).

### Soluciones

**Ideas con arrastre (4 de 5):**
- curva-solubilidad: el punto en 2D;
- concentracion: el nivel del vaso;
- diluir-y-retirar: el nivel del vaso;
- estequiometria-solucion: el nivel del matraz.

**Sin arrastre:**
- sistemas-dispersos: se distinguen por tamaño; no hay variable continua.

**Mesas:**
- mezcla-dos: dos vasos y la mezcla, a la misma escala;
- dos-sales: KNO₃ contra NaCl.

### Estructura atómica

**Ideas con arrastre (3 de 5):**
- nucleo-identidad: la manija de carga, que saca o trae electrones;
- numeros-cuanticos: el borde del nivel;
- configuracion-electronica: la última flecha se lleva a otra caja, y Z la sigue.

**Sin arrastre:**
- modelos-atomicos y desapareados-isoelectronicos: eligen entre modelos o especies.

**Mesas:**
- arma-ion: Z hasta 20, N hasta 24 y carga de ±3;
- cajas-ion: Z y carga, con la configuración y los desapareados.

**Hallazgo 9:** comentario en la idea 5.

### Tabla periódica

**Ideas con arrastre (3 de 5):**
- periodos-grupos-bloques: la casilla marcada sigue al dedo;
- radio-atomico-ionico: la cabeza de la columna;
- energia-ionizacion: el inicio de la fila.

**Sin arrastre:**
- ubicacion-lewis: el símbolo de Lewis es la respuesta;
- electronegatividad: elige un par de elementos.

**Mesas:**
- tres-propiedades: radio, EI y EN a la vez, del H al Kr;
- dos-elementos: dos casillas arrastrables lado a lado.

**Hallazgo 9:** comentario en la idea 5.

### Enlace químico

**Ideas con arrastre (1 de 5):**
- resonancia: el doble enlace se lleva a otro oxígeno.

**Sin arrastre:**
- tres-enlaces, lewis-octeto, forma-polaridad y fuerzas-intermoleculares: eligen entre sustancias. El ángulo de forma-polaridad pasó al laboratorio.

**Mesas:**
- dos-dipolos: se arrastra el H para abrir el ángulo de 60° a 180°, con μ = 2·μ_enlace·cos(θ/2); en el caso lineal se anula todo;
- resonancia-libre: nitrato y carbonato, con el híbrido.

**Hallazgo 9:** comentario en la idea 5.

### Líquidos y sólidos

**Ideas con arrastre (3 de 5):**
- capilaridad: el punto sobre la curva;
- presion-vapor: la línea de la presión de afuera;
- diagrama-fases: el punto en 2D.

**Sin arrastre:**
- orden-y-libertad: elige entre estados;
- gas-humedo: la temperatura es de opciones, y las moléculas no tienen manija.

**Mesas:**
- dos-liquidos: agua y etanol bajo la misma presión;
- mapa-co2.

**Cambio de contenido:** en la idea 4, el control P pasó a paso 1 (de 1 a 76 atm). Con paso 5 desde 1, el 76 no caía en la rejilla y el validador fallaba.

### Materia y energía

**Ideas con arrastre (2 de 4):**
- calor-sensible-latente: el punto de la curva de calentamiento;
- masa-energia: el punto de la recta.

**Sin arrastre:**
- sustancia-mezcla y fisico-quimico-nuclear: eligen entre muestras o procesos.

**Mesas:**
- hielo-a-vapor: llega a la meseta de hervir, que la idea no alcanza;
- gramo-carbon: hasta 1 g, traducido a toneladas de carbón.

### Mol y composición

**Ideas con arrastre (1 de 5):**
- leyes-ponderales: el extremo de la barra de agua; la razón O : H no cambia.

**Sin arrastre:**
- masa-atomica-promedio: átomos enteros (el borde de la abundancia va en la mesa 1);
- mol-masa-molar: la balanza está siempre en equilibrio;
- relaciones-en-formula: moléculas enteras;
- composicion-formula-empirica: arrastrar un borde inventaría otro compuesto.

**Mesas:**
- isotopos: cualquier par, con el borde de abundancia arrastrable;
- atomos-o-masa: CₓHᵧO_z armada a mano, con el % de átomos y el % de masa lado a lado.

### Estequiometría

**Ideas con arrastre (1 de 4):**
- pureza-rendimiento: el borde de la parte pura y el final de la barra.

**Sin arrastre:**
- via-de-los-moles y reactivo-limitante: partículas o moles enteros;
- masa-equivalente: elige sustancia.

**Mesas:**
- limitante-libre: hasta 12 mol, con el caso en que no sobra nada;
- caliza: dos arrastres.

**Hallazgo 9:** comentario en via-de-los-moles.

### Reacciones y balance

**Ideas con arrastre (1 de 5):**
- ion-electron: se estira la fila de cargas negativas.

**Sin arrastre:**
- indicios, clasificar y oxida-reduce: eligen fenómeno, tipo o reacción;
- tanteo: coeficientes de moléculas enteras.

**Mesas:**
- metano-libre: muestra «cuadra, sin enteros mínimos»;
- semirreacciones: cinco en medio ácido.

**Hallazgo 9:** comentario en indicios.

### Nomenclatura inorgánica

**Ideas con arrastre (1 de 5):**
- estados-oxidacion: los cuadritos del átomo verde; bajados a la fila de abajo, el estado pasa a negativo.

**Sin arrastre:**
- tres-nombres y arbol-funciones: son texto;
- sales: las fichas las pone la regla;
- sales-acidas-basicas-hidratadas: elige la sal.

**Mesas:**
- sal-a-mano: deja armar una sal cargada o sin simplificar;
- estados-raros: peróxido, hidruro, S₂O₃²⁻ y HNO₃.

### Recursos naturales

**Ideas con arrastre (1 de 4):**
- destilar-separa: el plato se corre por el eje de temperatura.

**Sin arrastre:**
- octanaje: moléculas;
- combustion: opciones;
- mena-ley-metal: cadena de texto.

**Mesas:**
- dos-platos;
- mena-barras: ley de 0,5 a 20 % y recuperación de 40 a 100 %;
- oxigeno-libre: muestra dónde aparece el hollín.

**Hallazgo 9:** comentario en destilar-separa.

### Hidrocarburos

**Ideas con arrastre (3 de 6):**
- carbono-enlaces: se tira del enlace C–C (simple, doble, triple);
- formulas-cadenas: el último carbono se estira, se cuelga o cierra el anillo;
- isomeros-estructurales: un carbono cambia de vecino.

**Sin arrastre:**
- aromaticos: el gesto diría EN6;
- cis-trans-optica: el gesto diría QM-GIRO-DOBLE;
- reacciones-organicas: cuatro reacciones distintas.

**Mesas:**
- cadena-que-crece: los casos imposibles los calcula el código;
- a-contra-b: misma molécula, isómeros u otro compuesto, comparando uniones.

### Funciones orgánicas

**Ideas con arrastre (3 de 6):**
- alcohol-fenol-eter: el O;
- aldehido-cetona: el O del C=O se corre;
- nombrar-monofuncional: el OH se desliza.

**Sin arrastre:**
- acido-ester y amina-amida-nitrilo: cambia el entorno, no una posición;
- isomeria-funcion: se elige un par.

**Mesas:**
- grupo-en-la-cadena: el código arma el nombre IUPAC;
- misma-formula.

**Hallazgo 9:** comentarios en las ideas 5 y 6.

### Biomoléculas y productos naturales

**Ideas con arrastre (2 de 5):**
- unir-azucares y peptidos-plegado: se tira de la última unidad.

**Sin arrastre:**
- grasas-trigliceridos: el codo cis no está dibujado;
- vitaminas-solubilidad: llevarla a su columna sería responder «Ahora tú» con el gesto;
- productos-naturales: tres familias.

**Mesas:**
- polimero: en anillo hay n uniones;
- grasa-mixta;
- dobles-y-color.

**Hallazgo 9:** comentario en la idea 5.

### Ambiente y química aplicada

**Ideas con arrastre (4 de 6):**
- filtrar-no-desinfecta: la marca baja por la planta;
- reciclaje-flujos: dos bordes;
- polimeros-adicion: el último CH₂ engancha otro etileno;
- superficie-nano-corrosion: el punto sobre la recta.

**Sin arrastre:**
- cadenas-del-aire: juntar cadenas con un gesto sugeriría QA1;
- eutrofizacion: dos estados sin cantidad dibujada.

**Mesas:**
- tres-filtros: tres manijas;
- cubo-partido: A = 6a²k.

**Arreglo de un error previo:** el control «Recolectado» pasó a paso 10. Con paso 20 desde 30, el 50 saltaba a 60.

### Llaves y separadores

- **Llaves:** unas 130 en total, solo en los símbolos que hay que nombrar, con notas de 3 palabras o menos. Varias se acortaron o se quitaron porque partían la ecuación a 360 px.
- **Separadores:** unos 70 se corrigieron a la parte suelta `'   ·   '`. Entre ellos están los que venían pegados al texto, como `'   ·   carga = '`, que no saltaban de línea porque `nucleo/ecuacion.js` solo reconoce la parte exacta.
- **Exponentes:** un «^» de la solución de Kp pasó a `{ sup }`.

## Piezas tocadas

Solo se agregaron exports, con su prueba. El dibujo no cambió: en `quim-fichas`, la única que se reordenó por dentro, se comprobó byte a byte.

| Pieza | Qué se agregó |
| --- | --- |
| `quim-cajas` | `geometria(d)`: `caja(i, k)` y `flecha(i, k, j)` |
| `quim-composicion` | `geometria(d)`: `xDe(fila, acumulado)`, `valorEn(fila, x)` y `y(fila)` |
| `quim-tabla` | `casilla(Z)`, `celda(punto, periodos)` y `zDe(col, per)` |
| `quim-atomo` | `geometria(d).atomo(k)`: centro, núcleo y `radio(capa)` |
| `quim-fichas` | `geometria(d)`: `cajas[]` y `cuadrito(k, signo)` |
| `quim-cadena` | se exporta la `geometria` que ya tenía |

No se tocaron `app/`, `nucleo/teoria.js`, `nucleo/ecuacion.js`, `nucleo/mascota.js` ni las piezas comunes.

## Pedidos al molde (con el caso que los pide)

1. **`barra-porcentaje` sin `geometria`.** Estequiometría (pureza-rendimiento, caliza) y ambiente (reciclaje-flujos, tres-filtros) copiaron sus constantes: x de 10 a 310 y las alturas de las filas. Si la pieza cambia, esas manijas se descolocan. Es una pieza común: la toca quien la mantiene.
2. **`quim-molecula`: posición de cada átomo con el encuadre ya aplicado.** Hoy cada unidad recalcula `encuadre`, y la manija salta cuando la figura se recentra. Lo piden las cadenas de hidrocarburos, funciones, biomoléculas y polímeros.
3. **`quim-celda` sin geometría.** La pila galvánica no tiene nada que agarrar (el electrodo o el puente).
4. **Gesto de «agregar partícula» en `quim-particulas`.** Lo piden presiones parciales, tanteo, limitante, octanaje y gas húmedo. El validador exige que `mover(donde(v))` devuelva v, y eso no encaja con «tocar para agregar una».
5. **Gesto de «elegir arrastrando» entre moléculas o sustancias.** Cubriría la mitad de las ideas sin arrastre. El molde solo tiene manijas sobre una magnitud.
6. **Llaves:**
   - dentro de una llave, la letra suelta no sale en cursiva (la «l» de 2l + 1, la «c» de la luz);
   - una nota más ancha que su símbolo ensancha la ecuación, y las llaves seguidas dejan huecos.
   Habría que medir la nota y dejar que sobresalga hacia los lados.
7. **El validador:**
   - marca «muestra NaN» en cualquier lectura con «NaNO₃». Por eso se sacó el nitrato de sodio de la mesa sal-a-mano;
   - no detecta una pieza que falta en `requiere` si otra unidad ya la cargó en Node. Pasó con `quim-composicion` en recursos naturales: en el navegador la mesa no abría. Ya está corregido en la unidad.

## Problemas del lector vistos en las capturas (no son de esta rama)

- **La raíz sobre una fracción tacha el numerador** en la regla grande. Se ve en la ficha de gases (Graham: √(M₂/M₁)), también donde no hay llave.
- **La ficha de repaso desborda a lo ancho** (922 px a 360) cuando hay ideas terminadas. Lo causan los `<span class="lector">` de los chips de la fila de ideas.
- **El botón de lupa tapa rótulos** de la figura: el grupo 18 en `quim-tabla`, rótulos de eje en `ejes` y Ag⁺/Ag en la escala.
- **El valor del control se corta a la derecha** con unidades largas («−40 kJ/mo», «0,3 mol/L»).
- **En el laboratorio, la figura fija de arriba** deja asomar textos por el borde derecho.
- **Una vez la ficha se quedó en «Abriendo la teoría…»** con el servidor cargado. Al repetir, abrió bien.

**De la unidad, menores:**
- en la recta Q–K, con Q = K, el punto de Q tapa el rótulo de K;
- en cinética, idea 1, el «0,80» de «Mira» toca el rótulo del eje;
- en arma-ion con carga −2, la manija de carga parece un electrón más.

## No verificado

- **Celular real, dedo real, lector de pantalla y alumnos.** Los gestos se probaron con el mouse de Playwright. El mapa 2D de CO₂, el modo anillo de las mesas de cadenas y las manijas 2 y 3 de tres-filtros se probaron solo en Node o con el mouse.
- **Gestos que en el recorrido no cambiaron la lectura**, porque el desplazamiento de prueba era más corto que el paso: filtrar-no-desinfecta (etapas cada unos 78 px) y polimeros-adicion (solo cambió hacia la izquierda). Se comprobaron con el validador, pero no con un arrastre largo.
- **Tema oscuro:** no se revisó en esta ronda.
- **Datos de manual sin cálculo independiente:** las constantes de Antoine del etanol, los 3,3 × 10⁷ J/kg del carbón y la tabla de solubilidad de dos-sales, interpolada linealmente (anotado en el archivo). El «catalizador que baja Eₐ a la mitad» es un modelo ilustrativo.
- **Recorrido parcial:** en cuatro unidades del grupo A se recorrieron solo las ideas con arrastre, las mesas y la ficha. En las demás, igual que en la ronda 1.

## Reporte de diseño

```
Ficha de tarea: postulante de 3.º a 5.º en un celular de 360 px; en el juego agarra lo que el fenómeno mueve (émbolo, nivel del vaso, punto de una curva, borde de una barra, casilla, último eslabón) y ve responder la otra variable; en el laboratorio compara casos guardados que se leen solos.
Sistema: existente (tokens de app/estilos.css, kit, manija del lector). Sin decisiones nuevas de sistema; las convenciones de esta ronda (lectura del laboratorio = entradas → resultado, una línea de comentario por arrastre) quedan en este archivo.
Carácter: acogedora, viva y precisa · firma: el hilo de color, que ahora llega también a la manija (cada manija lleva el color de la variable que mueve).
Movimientos: ninguno nuevo. El arrastre sigue al dedo 1:1 (lo pinta el lector); sin animación propia en las unidades.
Verificación: las manijas caen en la figura y donde dice su valor (validador, 20 unidades); arrastre real con lectura antes y después en Playwright; 2 casos guardados por mesa; reglas con llaves revisadas en la ficha a 360 px. «No»: la raíz sobre fracción y el desborde de la ficha son del lector y van reportados arriba; los rótulos tapados por la lupa, igual.
No verificado: dispositivo real, lector de pantalla, tema oscuro, personas reales.
Hipótesis: con gesto directo, más alumnos prueban casos extremos antes de predecir. Se mide con los eventos «teoria» (casos distintos por idea y tiempo en «Juega»), comparando las ideas con arrastre y sin él en la misma unidad.
Conflictos: ninguno con CLAUDE.md. Con el skill: «todo arrastre tiene alternativa», que se cumple porque el validador lo exige. Una tensión: en dos ideas el gesto natural representaría la idea errónea, y ahí se priorizó la fidelidad (sin arrastre).
```

## Pruebas finales

`npm test` completo antes del último push: 8495 pruebas, 0 fallos (el mismo número que la línea base: las pruebas de teoría son una por unidad, así que los arrastres y mesas nuevos se validan dentro de ellas).
