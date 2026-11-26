# Diagnóstico: ¿se reconoce cada objeto? (26 nov 2026)

Encargo: `docs/metodo/dibujos-reconocibles.md`, paso 2. Prueba del lector en frío: un alumno de 5.º que solo ve el
dibujo, sin leer el texto de la app, ¿diría qué es? Cada objeto se miró en su primer uso (la tarjeta de «Lee» si la hay;
si no, la primera figura que lo dibuja), dentro de una `.te-fig` como en la app, a 390 px. Las capturas salen de
`node herramientas/dibujos-objetos.js <carpeta>` (servidor propio con `PORT`) y están en `docs/dibujos/capturas/`.

Por qué no con `herramientas/capturas-teoria.js`: saca todas las pantallas de una unidad (más de 150 unidades, varias
horas) y el objeto sale igual, porque la app pinta la figura con el mismo `dibujar(datos, estado)`. El script nuevo
dibuja solo la figura con los estilos de la app, en claro, oscuro y (con `--ancha`) a 1280 px.

Los diagramas propios del tema (árbol de factores, losetas de álgebra, gráficas, sectores «de examen», notación de Lewis)
se marcan «se reconoce» si se leen como lo que son: no prometen un objeto del mundo.

**Totales: 185 objetos; 122 se reconocen, 56 a medias, 7 no se reconocen.**
La columna «Después» dice qué pasó en el paso 3 (redibujo); «Etapa 9» = pieza que no se toca en este encargo.

## Álgebra

| Pieza · objeto | Veredicto | Qué se ve (y qué falta) | Captura | Después |
|---|---|---|---|---|
| alg-caja · (sin objeto) | se reconoce | caja con alto, largo y ancho | [ver](capturas/alg-caja--sin-objeto.webp) |  |
| alg-caja · caja | se reconoce | caja parada | [ver](capturas/alg-caja--caja.webp) |  |
| alg-losetas · (sin objeto) | se reconoce | losetas de álgebra (material, no objeto real): se reconocen como fichas | [ver](capturas/alg-losetas--sin-objeto.webp) |  |
| alg-losetas · casillero | a medias | cubito, cuadrado, tira y puntito sobre casillas: el casillero no se ve como mueble; vale como tabla | [ver](capturas/alg-losetas--casillero.webp) |  |
| alg-losetas · deposito | se reconoce | varilla, plancha y bloque | [ver](capturas/alg-losetas--deposito.webp) |  |
| alg-losetas · giro | se reconoce | losetas de colores | [ver](capturas/alg-losetas--giro.webp) |  |
| alg-losetas · lote | a medias | terreno: solo un rectángulo con rayas; falta cerco o pasto que diga «terreno» | [ver](capturas/alg-losetas--lote.webp) |  |
| alg-losetas · medidas | se reconoce | fichas de letras (diagrama) | [ver](capturas/alg-losetas--medidas.webp) |  |
| alg-losetas · pedido | se reconoce | losetas | [ver](capturas/alg-losetas--pedido.webp) |  |
| alg-losetas · piezas | se reconoce | losetas | [ver](capturas/alg-losetas--piezas.webp) |  |
| alg-losetas · piso | se reconoce | piso armado con losetas | [ver](capturas/alg-losetas--piso.webp) |  |
| alg-losetas · tamano | se reconoce | losetas | [ver](capturas/alg-losetas--tamano.webp) |  |
| alg-objeto · (sin objeto) | a medias | hoja doblada por la mitad: la hoja rayada se ve; el «una capa» de lado es una raya suelta | [ver](capturas/alg-objeto--sin-objeto.webp) |  |
| alg-objeto · caja | se reconoce | caja de cartón con cinta, rotulada | [ver](capturas/alg-objeto--caja.webp) |  |
| alg-objeto · cometa | se reconoce | cometa con cola de lazos | [ver](capturas/alg-objeto--cometa.webp) |  |
| alg-objeto · hoja | a medias | hoja doblada: la vista de lado de 4 capas se entiende a medias | [ver](capturas/alg-objeto--hoja.webp) |  |
| alg-objeto · huertos | a medias | huerto: cuadro con «v» y cerco; sin plantas ni surcos no dice huerto | [ver](capturas/alg-objeto--huertos.webp) |  |
| alg-objeto · mesa | no se reconoce | mesa dividida en cuatro: es un cuadrado partido; nada dice mesa | [ver](capturas/alg-objeto--mesa.webp) |  |
| alg-objeto · taco | a medias | taco de papel: cubo rayado; se lee como cubo, no como taco de notas | [ver](capturas/alg-objeto--taco.webp) |  |
| alg-objeto · terreno | se reconoce | terreno con cerco y casita | [ver](capturas/alg-objeto--terreno.webp) |  |
| alg-objeto · triplay | a medias | plancha de triplay: rectángulo rayado; falta veta o canto de madera | [ver](capturas/alg-objeto--triplay.webp) |  |
| alg-reparto · (sin objeto) | se reconoce | diagrama de losetas (material) | [ver](capturas/alg-reparto--sin-objeto.webp) |  |
| alg-reparto · angosto | se reconoce | diagrama de losetas | [ver](capturas/alg-reparto--angosto.webp) |  |
| alg-reparto · cuaderno | se reconoce | cuaderno anillado | [ver](capturas/alg-reparto--cuaderno.webp) |  |
| alg-reparto · pasadizo | se reconoce | diagrama de losetas con sobrantes | [ver](capturas/alg-reparto--pasadizo.webp) |  |

## Aritmética

| Pieza · objeto | Veredicto | Qué se ve (y qué falta) | Captura | Después |
|---|---|---|---|---|
| arit-arbol · (sin objeto) | se reconoce | árbol de factores (diagrama propio del tema) | [ver](capturas/arit-arbol--sin-objeto.webp) |  |
| arit-bandejas · (sin objeto) | se reconoce | caramelos envueltos en bandejas | [ver](capturas/arit-bandejas--sin-objeto.webp) |  |
| arit-boleto · (sin objeto) | se reconoce | boleto de rifa con talón | [ver](capturas/arit-boleto--sin-objeto.webp) |  |
| arit-boletos · (sin objeto) | se reconoce | talonario de boletos numerados | [ver](capturas/arit-boletos--sin-objeto.webp) |  |
| arit-calculadora · (sin objeto) | a medias | calculadora: carcasa, pantalla y teclas sin números; se adivina | [ver](capturas/arit-calculadora--sin-objeto.webp) | Etapa 9 |
| arit-calculadora · cuaderno | a medias | calculadora (ídem; Etapa 9) | [ver](capturas/arit-calculadora--cuaderno.webp) | Etapa 9 |
| arit-cintas · (sin objeto) | a medias | rollo de cinta: dos tiras con corte; no se ve el rollo | [ver](capturas/arit-cintas--sin-objeto.webp) |  |
| arit-monedas · (sin objeto) | se reconoce | monedas con su valor | [ver](capturas/arit-monedas--sin-objeto.webp) |  |
| arit-puesto · (sin objeto) | se reconoce | puesto con toldo, bolsitas y caramelos | [ver](capturas/arit-puesto--sin-objeto.webp) |  |
| arit-queque · (sin objeto) | a medias | queque: bandeja marrón partida; se lee como barra o chocolate, falta el bizcocho (corteza, molde) | [ver](capturas/arit-queque--sin-objeto.webp) |  |
| arit-reparto · (sin objeto) | a medias | bolsitas de caramelo en íconos muy chicos | [ver](capturas/arit-reparto--sin-objeto.webp) |  |
| arit-talonario · (sin objeto) | se reconoce | talonario de rifa y último boleto | [ver](capturas/arit-talonario--sin-objeto.webp) |  |

## Física

| Pieza · objeto | Veredicto | Qué se ve (y qué falta) | Captura | Después |
|---|---|---|---|---|
| fis-combi · (sin objeto) | se reconoce | combi en la pista con paradero | [ver](capturas/fis-combi--sin-objeto.webp) |  |
| fis-dron · (sin objeto) | a medias | mapa con la plaza y la escala: el mapa se lee, pero el dron no aparece | [ver](capturas/fis-dron--sin-objeto.webp) |  |
| fis-estatica · (sin objeto) | a medias | persona de palitos jalando un carrito de papas | [ver](capturas/fis-estatica--sin-objeto.webp) | Etapa 9 |
| fis-fuerzas · avion | se reconoce | avioncito con sus componentes | [ver](capturas/fis-fuerzas--avion.webp) |  |
| fis-fuerzas · bote | a medias | bote: pentágono con una raya; se lee como lápiz o flecha | [ver](capturas/fis-fuerzas--bote.webp) |  |
| fis-fuerzas · caja | se reconoce | caja en el piso | [ver](capturas/fis-fuerzas--caja.webp) |  |
| fis-fuerzas · carretilla | se reconoce | carretilla con mango y rueda | [ver](capturas/fis-fuerzas--carretilla.webp) |  |
| fis-fuerzas · cuadras | a medias | cuadras: franja gris; falta la calle con veredas o manzanas | [ver](capturas/fis-fuerzas--cuadras.webp) |  |
| fis-fuerzas · nudo | no se reconoce | nudo: un circulito con dos flechas; no hay sogas | [ver](capturas/fis-fuerzas--nudo.webp) |  |
| fis-giro · (sin objeto) | se reconoce | rueda de la fortuna con cabinas | [ver](capturas/fis-giro--sin-objeto.webp) |  |
| fis-mruv · (sin objeto) | se reconoce | pista con corredor y gráfica v–t | [ver](capturas/fis-mruv--sin-objeto.webp) |  |
| fis-objeto · atleta | se reconoce | atleta, pista y cronómetro | [ver](capturas/fis-objeto--atleta.webp) |  |
| fis-objeto · bebe | a medias | bebé en balanza: la balanza se lee; el bebé es una cabeza sobre un óvalo | [ver](capturas/fis-objeto--bebe.webp) |  |
| fis-objeto · bloque | se reconoce | bloque de hielo con brillos | [ver](capturas/fis-objeto--bloque.webp) |  |
| fis-objeto · botella | se reconoce | botella de jarabe con su nivel | [ver](capturas/fis-objeto--botella.webp) |  |
| fis-objeto · cabello | se reconoce | cabello bajo la lupa | [ver](capturas/fis-objeto--cabello.webp) |  |
| fis-objeto · caja | se reconoce | caja empujada en el piso | [ver](capturas/fis-objeto--caja.webp) |  |
| fis-objeto · camion | se reconoce | camión con carga | [ver](capturas/fis-objeto--camion.webp) |  |
| fis-objeto · cancha | se reconoce | cancha de fútbol | [ver](capturas/fis-objeto--cancha.webp) |  |
| fis-objeto · cano | se reconoce | caño llenando un balde | [ver](capturas/fis-objeto--cano.webp) |  |
| fis-objeto · caracol | se reconoce | caracol sobre una regla | [ver](capturas/fis-objeto--caracol.webp) |  |
| fis-objeto · comparar | a medias | tres rapideces: solo una tabla; el guepardo, el auto y el caballo no aparecen | [ver](capturas/fis-objeto--comparar.webp) |  |
| fis-objeto · corazon | se reconoce | corazón con su latido | [ver](capturas/fis-objeto--corazon.webp) |  |
| fis-objeto · deposito | se reconoce | depósito con agua y profundidad | [ver](capturas/fis-objeto--deposito.webp) |  |
| fis-objeto · hoja | se reconoce | hoja A4 rayada | [ver](capturas/fis-objeto--hoja.webp) |  |
| fis-objeto · jeringa | se reconoce | jeringa graduada | [ver](capturas/fis-objeto--jeringa.webp) |  |
| fis-objeto · lago | se reconoce | lago con islas | [ver](capturas/fis-objeto--lago.webp) |  |
| fis-objeto · pendulo | se reconoce | péndulo colgado | [ver](capturas/fis-objeto--pendulo.webp) |  |
| fis-objeto · piscina | se reconoce | piscina con andarivel | [ver](capturas/fis-objeto--piscina.webp) |  |
| fis-objeto · piso | se reconoce | piso con losetas | [ver](capturas/fis-objeto--piso.webp) |  |
| fis-objeto · planetas | a medias | dos esferas: la de la raya verde pasa por planeta; la otra es un círculo gris sin rasgo | [ver](capturas/fis-objeto--planetas.webp) |  |
| fis-objeto · plano | se reconoce | plano de un cuarto con puerta y cama | [ver](capturas/fis-objeto--plano.webp) |  |
| fis-objeto · presion | se reconoce | bloque apoyado en el piso | [ver](capturas/fis-objeto--presion.webp) |  |
| fis-objeto · reloj | se reconoce | reloj de agujas | [ver](capturas/fis-objeto--reloj.webp) |  |
| fis-objeto · sol | se reconoce | sol y Tierra | [ver](capturas/fis-objeto--sol.webp) |  |
| fis-objeto · tanque | se reconoce | tanque de agua sobre el techo | [ver](capturas/fis-objeto--tanque.webp) |  |
| fis-objeto · techo | se reconoce | casa con techo y lluvia | [ver](capturas/fis-objeto--techo.webp) |  |
| fis-objeto · terreno | se reconoce | chacra con surcos y estacas | [ver](capturas/fis-objeto--terreno.webp) |  |
| fis-objeto · viento | se reconoce | bus contra el viento | [ver](capturas/fis-objeto--viento.webp) |  |
| fis-pista · (sin objeto) | se reconoce | pista con corredor y valla | [ver](capturas/fis-pista--sin-objeto.webp) |  |
| fis-rio · (sin objeto) | se reconoce | río con bote, remero y orilla | [ver](capturas/fis-rio--sin-objeto.webp) |  |
| fis-sonido · eco | se reconoce | persona gritando frente al cerro | [ver](capturas/fis-sonido--eco.webp) |  |
| fis-sonido · trueno | se reconoce | nube con rayo y persona | [ver](capturas/fis-sonido--trueno.webp) |  |
| fis-tiro · (sin objeto) | a medias | piedra desde una peña: la peña se lee como pared; la piedra es un circulito | [ver](capturas/fis-tiro--sin-objeto.webp) | redibujado: capas de roca y grietas en la cara de la peña; se lee como peña ([antes y después](antes-despues/fis-tiro--sin-objeto.webp)) |
| fis-tiro · agua | a medias | chorro de manguera: la manguera tendida es una raya oscura en el piso; no se lee | [ver](capturas/fis-tiro--agua.webp) | redibujado: manguera enrollada en tres vueltas y boquilla con gatillo; mejora a medias (el rollo queda chico), para diseñador ([antes y después](antes-despues/fis-tiro--agua.webp)) |
| fis-tiro · canica | a medias | canica que sale de una mesa: la mesa de perfil se lee como arco de fútbol | [ver](capturas/fis-tiro--canica.webp) | redibujado: tablero con canto y faldón, patas de atrás tenues; mejora a medias (la mesa alta y angosta todavía se adivina), para diseñador ([antes y después](antes-despues/fis-tiro--canica.webp)) |
| fis-tiro · paquete | se reconoce | avioneta que suelta un paquete | [ver](capturas/fis-tiro--paquete.webp) |  |
| fis-tiro · pelota | a medias | pelota pateada: un circulito en el piso; nada dice pelota ni cancha | [ver](capturas/fis-tiro--pelota.webp) | redibujado: pelota de fútbol con su pentágono y costuras ([antes y después](antes-despues/fis-tiro--pelota.webp)) |
| fis-tiro · piedra | se reconoce | piedra desde la azotea de un edificio | [ver](capturas/fis-tiro--piedra.webp) |  |
| fis-ventana · (sin objeto) | se reconoce | carretera con combi y postes, dos miradas | [ver](capturas/fis-ventana--sin-objeto.webp) |  |
| fis-xt · (sin objeto) | se reconoce | gráfica x–t (diagrama propio del tema) | [ver](capturas/fis-xt--sin-objeto.webp) |  |

## Geometría

| Pieza · objeto | Veredicto | Qué se ve (y qué falta) | Captura | Después |
|---|---|---|---|---|
| geo-objeto · angulos | se reconoce | ángulos con rótulos (diagrama propio; Etapa 9) | [ver](capturas/geo-objeto--angulos.webp) |  |
| geo-objeto · armazon | a medias | armazón de varillas: dos triángulos de doble raya; se adivina la estructura | [ver](capturas/geo-objeto--armazon.webp) | Etapa 9 |
| geo-objeto · carretera | se reconoce | carretera con combi y puntos A, B, C | [ver](capturas/geo-objeto--carretera.webp) |  |
| geo-objeto · cartulina | a medias | cartulina con triángulo y regla: el triángulo se ve, la cartulina es un fondo gris | [ver](capturas/geo-objeto--cartulina.webp) | Etapa 9 |
| geo-objeto · caserio | a medias | caseríos: tres casitas de 10 px en un vértice; el resto es un triángulo | [ver](capturas/geo-objeto--caserio.webp) | Etapa 9 |
| geo-objeto · compas | a medias | compás: patas con bisagra y lápiz; se lee a medias como triángulo | [ver](capturas/geo-objeto--compas.webp) | Etapa 9 |
| geo-objeto · lampara | no se reconoce | lámpara de brazo: un cono y dos rayas; no se reconoce | [ver](capturas/geo-objeto--lampara.webp) | Etapa 9 |
| geo-objeto · parcela | a medias | parcela: pentágono sombreado; falta cerco o cultivo | [ver](capturas/geo-objeto--parcela.webp) | Etapa 9 |
| geo-objeto · parque | no se reconoce | parque: un triángulo con bisectrices; nada dice parque | [ver](capturas/geo-objeto--parque.webp) | Etapa 9 |
| geo-objeto · pasaje | a medias | pasaje: dos franjas grises entre paralelas; se adivinan calles | [ver](capturas/geo-objeto--pasaje.webp) | Etapa 9 |
| geo-objeto · plaza | a medias | plaza: triángulo con veredas anchas y un carrito; a medias | [ver](capturas/geo-objeto--plaza.webp) | Etapa 9 |
| geo-objeto · recta | se reconoce | segmentos en una recta (diagrama propio; Etapa 9) | [ver](capturas/geo-objeto--recta.webp) |  |
| geo-objeto · redondo | a medias | objeto redondo sobre el piso: círculo con cuerda; no dice qué objeto es | [ver](capturas/geo-objeto--redondo.webp) | Etapa 9 |
| geo-objeto · reloj | se reconoce | reloj de mesa | [ver](capturas/geo-objeto--reloj.webp) |  |
| geo-objeto · rieles | a medias | rieles: dos rectas con durmientes finos y una transversal; se adivina la vía | [ver](capturas/geo-objeto--rieles.webp) | Etapa 9 |
| geo-objeto · semejante | no se reconoce | figura con franjas grises y una barra diagonal; no se reconoce el objeto | [ver](capturas/geo-objeto--semejante.webp) | Etapa 9 |
| geo-objeto · soga | a medias | soga tendida: barra rayada con nudos; a medias | [ver](capturas/geo-objeto--soga.webp) | Etapa 9 |
| geo-objeto · tijeral | a medias | tijeral de techo: tres listones; se lee como triángulo de madera | [ver](capturas/geo-objeto--tijeral.webp) | Etapa 9 |
| geo-objeto · tranquera | a medias | tranquera: dos listones en ángulo; falta la tranquera con sus travesaños | [ver](capturas/geo-objeto--tranquera.webp) | Etapa 9 |

## Química

| Pieza · objeto | Veredicto | Qué se ve (y qué falta) | Captura | Después |
|---|---|---|---|---|
| quim-cocina · (sin objeto) | se reconoce | balanza y probeta con la piedra | [ver](capturas/quim-cocina--sin-objeto.webp) |  |
| quim-enlace · (sin objeto) | se reconoce | símbolos de Lewis (notación propia del tema) | [ver](capturas/quim-enlace--sin-objeto.webp) |  |
| quim-enlace · chorro | a medias | chorro de agua y peine: el peine se ve; el caño es una T y el chorro una raya gris | [ver](capturas/quim-enlace--chorro.webp) |  |
| quim-enlace · globos | a medias | cuatro óvalos alrededor de un punto: sin pitas ni nudo no dicen globos | [ver](capturas/quim-enlace--globos.webp) |  |
| quim-enlace · limpiador | se reconoce | botella de limpiador con etiqueta | [ver](capturas/quim-enlace--limpiador.webp) |  |
| quim-enlace · olla | se reconoce | olla con agua hirviendo | [ver](capturas/quim-enlace--olla.webp) |  |
| quim-enlace · probador | se reconoce | pila, foco y vaso con cables | [ver](capturas/quim-enlace--probador.webp) |  |
| quim-enlace · sal | a medias | sal en una cuchara: los cuadraditos se leen; la cuchara es una media luna con palito | [ver](capturas/quim-enlace--sal.webp) |  |
| quim-enlace · soplete | no se reconoce | soplete: un bloque con una hoja; no se reconoce | [ver](capturas/quim-enlace--soplete.webp) |  |
| quim-enlace · tiza | se reconoce | tiza y pizarra con un garabato | [ver](capturas/quim-enlace--tiza.webp) |  |
| quim-enlace · ventana | a medias | ventana con moléculas: el marco se lee como cuadro partido | [ver](capturas/quim-enlace--ventana.webp) |  |
| quim-hotel · (sin objeto) | se reconoce | hotel del electrón (diagrama propio del tema) | [ver](capturas/quim-hotel--sin-objeto.webp) |  |
| quim-lamina · (sin objeto) | a medias | retablo y pan de oro a medias; la «fuente de alfas» es una barra sin rasgo | [ver](capturas/quim-lamina--sin-objeto.webp) |  |
| quim-mol · (sin objeto) | se reconoce | tabla de masa molar (diagrama propio) | [ver](capturas/quim-mol--sin-objeto.webp) |  |
| quim-mol · balanza | se reconoce | vaso de agua en la balanza | [ver](capturas/quim-mol--balanza.webp) |  |
| quim-mol · frasco | se reconoce | frasco en la balanza | [ver](capturas/quim-mol--frasco.webp) |  |
| quim-mol · sal | se reconoce | paquete de sal | [ver](capturas/quim-mol--sal.webp) |  |
| quim-mol · tabla | se reconoce | casilla del cloro en la tabla | [ver](capturas/quim-mol--tabla.webp) |  |
| quim-mol · tiza | se reconoce | caja de tizas | [ver](capturas/quim-mol--tiza.webp) |  |
| quim-mol · vinagre | se reconoce | botella de vinagre | [ver](capturas/quim-mol--vinagre.webp) |  |
| quim-nomenclatura · (sin objeto) | se reconoce | tarjeta de fórmula (diagrama propio) | [ver](capturas/quim-nomenclatura--sin-objeto.webp) |  |
| quim-nomenclatura · agua-oxigenada | se reconoce | frasco de agua oxigenada | [ver](capturas/quim-nomenclatura--agua-oxigenada.webp) |  |
| quim-nomenclatura · bicarbonato | se reconoce | caja de bicarbonato con cuchara | [ver](capturas/quim-nomenclatura--bicarbonato.webp) |  |
| quim-nomenclatura · clavo | se reconoce | clavo con herrumbre | [ver](capturas/quim-nomenclatura--clavo.webp) |  |
| quim-nomenclatura · magnesia | se reconoce | frasco de leche de magnesia | [ver](capturas/quim-nomenclatura--magnesia.webp) |  |
| quim-nomenclatura · permanganato | se reconoce | frasco de permanganato | [ver](capturas/quim-nomenclatura--permanganato.webp) |  |
| quim-nomenclatura · salero | se reconoce | salero y saco de abono | [ver](capturas/quim-nomenclatura--salero.webp) |  |
| quim-objeto · (sin objeto) | se reconoce | hueso de llama y átomos | [ver](capturas/quim-objeto--sin-objeto.webp) |  |
| quim-objeto · combi | a medias | combi vista desde arriba: rectángulo con casillas; se lee como tablero, no como combi | [ver](capturas/quim-objeto--combi.webp) |  |
| quim-objeto · frasco | se reconoce | gotero de sulfato ferroso | [ver](capturas/quim-objeto--frasco.webp) |  |
| quim-objeto · hueso | se reconoce | hueso de llama | [ver](capturas/quim-objeto--hueso.webp) |  |
| quim-objeto · salero | se reconoce | salero | [ver](capturas/quim-objeto--salero.webp) |  |
| quim-tira · (sin objeto) | se reconoce | cristal de sal bajo la lupa | [ver](capturas/quim-tira--sin-objeto.webp) |  |
| quim-vasos · (sin objeto) | se reconoce | tres vasos con líquidos | [ver](capturas/quim-vasos--sin-objeto.webp) |  |

## Razonamiento matemático

| Pieza · objeto | Veredicto | Qué se ve (y qué falta) | Captura | Después |
|---|---|---|---|---|
| rm-aros · (sin objeto) | se reconoce | patio con aros y alumnos (diagrama de conjuntos) | [ver](capturas/rm-aros--sin-objeto.webp) |  |
| rm-casos · (sin objeto) | se reconoce | calle con nube y cisterna | [ver](capturas/rm-casos--sin-objeto.webp) |  |
| rm-certeza · (sin objeto) | a medias | tómbola: caja con bolitas; falta el tambor con manija | [ver](capturas/rm-certeza--sin-objeto.webp) | para diseñador: se probó con varillas y manivela y no mejoró (la fila larga de bolitas obliga a una caja ancha; un tambor pide otro acomodo) |
| rm-familia · (sin objeto) | se reconoce | árbol familiar con retratos | [ver](capturas/rm-familia--sin-objeto.webp) |  |
| rm-objeto · (sin objeto) | se reconoce | campeonato con pelotas, tablero y alumnos | [ver](capturas/rm-objeto--sin-objeto.webp) |  |
| rm-orden · (sin objeto) | se reconoce | cola de alumnos y banca numerada | [ver](capturas/rm-orden--sin-objeto.webp) |  |
| rm-patrones · (sin objeto) | se reconoce | figuras de palitos (diagrama propio) | [ver](capturas/rm-patrones--sin-objeto.webp) |  |
| rm-veraz · (sin objeto) | se reconoce | alumnos con globos de diálogo | [ver](capturas/rm-veraz--sin-objeto.webp) |  |
| rm-veraz · caja | a medias | cajas: tres rectángulos con tapa; sin cartón ni cinta se leen como ventanas | [ver](capturas/rm-veraz--caja.webp) |  |

## Razonamiento verbal

| Pieza · objeto | Veredicto | Qué se ve (y qué falta) | Captura | Después |
|---|---|---|---|---|
| rv-definicion · (sin objeto) | se reconoce | ficha y tabla (texto, propio del curso) | [ver](capturas/rv-definicion--sin-objeto.webp) |  |
| rv-escalera · (sin objeto) | se reconoce | cartel de comunicado | [ver](capturas/rv-escalera--sin-objeto.webp) |  |
| rv-soporte · (sin objeto) | se reconoce | hoja de simulacro (texto) | [ver](capturas/rv-soporte--sin-objeto.webp) |  |

## Trigonometría

| Pieza · objeto | Veredicto | Qué se ve (y qué falta) | Captura | Después |
|---|---|---|---|---|
| trig-arco · abanico | a medias | abanico: sector con varillas; se lee a medias (falta el plisado y el mango) | [ver](capturas/trig-arco--abanico.webp) |  |
| trig-arco · bici | a medias | plato y piñón con cadena: se leen como engranajes, no como bicicleta | [ver](capturas/trig-arco--bici.webp) |  |
| trig-arco · columpio | no se reconoce | columpio: dos rayas en A, una línea naranja y un palito; no se reconoce (caso de Gerson) | [ver](capturas/trig-arco--columpio.webp) | redibujado: armazón de madera en perspectiva con travesaño, dos cadenas con eslabones, asiento de tabla y pasto ([antes y después](antes-despues/trig-arco--columpio.webp)) |
| trig-arco · engranajes | se reconoce | dos engranajes con su marca | [ver](capturas/trig-arco--engranajes.webp) |  |
| trig-arco · figura | se reconoce | sector de examen (diagrama propio) | [ver](capturas/trig-arco--figura.webp) |  |
| trig-arco · limpia | a medias | limpiaparabrisas: el parabrisas se adivina; el brazo es una raya gruesa sin pivote ni jebe | [ver](capturas/trig-arco--limpia.webp) |  |
| trig-arco · monedas | a medias | dos círculos lisos; sin canto ni cara no dicen monedas | [ver](capturas/trig-arco--monedas.webp) |  |
| trig-arco · rueda | a medias | rueda chica con rayos: se lee rueda, no bicicleta; la huella es una raya | [ver](capturas/trig-arco--rueda.webp) |  |
| trig-giro · llave | a medias | llave de cruz: una cruz con bolitas; se reconoce solo si uno ya la conoce | [ver](capturas/trig-giro--llave.webp) |  |
| trig-giro · rayos | se reconoce | dos rayos con ángulo (diagrama propio) | [ver](capturas/trig-giro--rayos.webp) |  |
| trig-giro · reloj | se reconoce | reloj de pared | [ver](capturas/trig-giro--reloj.webp) |  |
| trig-giro · tapa | a medias | tapa de botella desde arriba: círculo con estrías; se lee como perilla | [ver](capturas/trig-giro--tapa.webp) |  |
| trig-giro · timon | se reconoce | timón | [ver](capturas/trig-giro--timon.webp) |  |
| trig-giro · transportador | se reconoce | transportador circular | [ver](capturas/trig-giro--transportador.webp) |  |
| trig-medida · calculadora | se reconoce | calculadora con DEG, GRA y RAD | [ver](capturas/trig-medida--calculadora.webp) |  |
| trig-medida · lupa | se reconoce | lupa sobre una escala | [ver](capturas/trig-medida--lupa.webp) |  |
| trig-medida · rueda | se reconoce | rueda de bicicleta con rayos | [ver](capturas/trig-medida--rueda.webp) |  |
| trig-objeto · chacra | a medias | chacra: triángulo con estacas; se adivina el cerco, falta cultivo | [ver](capturas/trig-objeto--chacra.webp) |  |
| trig-objeto · cuerda | a medias | cuerda en triángulo con transportador: los nudos se ven; la cuerda es una raya | [ver](capturas/trig-objeto--cuerda.webp) |  |
| trig-objeto · escalera | se reconoce | escalera apoyada en una pared de ladrillos | [ver](capturas/trig-objeto--escalera.webp) |  |
| trig-objeto · escuadras | se reconoce | juego de escuadras | [ver](capturas/trig-objeto--escuadras.webp) |  |
| trig-objeto · figura | se reconoce | rectángulo de examen (diagrama propio) | [ver](capturas/trig-objeto--figura.webp) |  |
| trig-objeto · loseta | a medias | loseta: cuadrado con diagonal; se lee como figura de examen | [ver](capturas/trig-objeto--loseta.webp) |  |
| trig-objeto · poste | a medias | poste con su cable: el poste es una barrita; falta la base, el travesaño y el anclaje | [ver](capturas/trig-objeto--poste.webp) |  |
| trig-objeto · rampa | a medias | rampa: triángulo sombreado; falta superficie de rampa (baranda, piso) | [ver](capturas/trig-objeto--rampa.webp) |  |
| trig-objeto · repisa | se reconoce | repisa con soporte en una pared | [ver](capturas/trig-objeto--repisa.webp) |  |
| trig-objeto · senal | se reconoce | señal triangular en su poste | [ver](capturas/trig-objeto--senal.webp) |  |
| trig-objeto · sombras | se reconoce | poste, persona, sol y sombras | [ver](capturas/trig-objeto--sombras.webp) |  |
| trig-objeto · techo | se reconoce | techo de calamina sobre la casa | [ver](capturas/trig-objeto--techo.webp) |  |
| trig-objeto · triangulo | se reconoce | triángulo de examen (diagrama propio) | [ver](capturas/trig-objeto--triangulo.webp) |  |
| trig-pos · (sin objeto) | se reconoce | plano del pueblo con plaza y casa | [ver](capturas/trig-pos--sin-objeto.webp) |  |
| trig-vista · (sin objeto) | a medias | cometa amarrada a una estaca: la cometa mide 16 px y se adivina; la estaca es un cuadradito | [ver](capturas/trig-vista--sin-objeto.webp) | redibujado: cometa más grande con varillas, papel en dos paños y cola con lazos; estaca de madera con la pita enrollada ([antes y después](antes-despues/trig-vista--sin-objeto.webp)) |

