# Ronda 3 de la teoría, física: glosario por tema y retos comprobados (15 nov 2026)

Encargo: `rutinas/encargos/teoria3-fisica.md`. Rama `teoria3/fisica`. Las 19 unidades de física (menos la referencia, `movimiento-rectilineo`) tienen glosario y retos comprobados por el motor en todas sus mesas.

**Cómo se hizo.** Se trabajó en cuatro bloques en paralelo, con un reparto previo de términos por unidad para que ninguno se definiera dos veces. Después se integró en el orden del curso, con un commit por unidad, y se cerró con una pasada de palabras de dos sentidos (al final de este reporte).

**Pruebas:**
- `npm test`: 8549 de 8549.
- `teoria.test.js` + `glosario.test.js`: 161 de 161.

**Recorrido con Playwright** (`rutinas/teoria3-fisica/pw.js`, 360 × 780):
- En cada unidad abre la primera idea y toca un término; la hoja muestra «Nuevo en este tema» o «Se explica en…».
- Abre el glosario del tema y busca una palabra.
- En cada una de las 57 mesas busca un caso que cumpla un reto, con el mismo `logrado`, y lo pone con los controles reales. Las 57 dijeron «✓ Lo lograste», con la línea de Tilo. No hubo errores de página.

## Términos por unidad

Los datos salen de `app/datos/glosario/fisica.json`. Hay 260 términos en el curso.

| Unidad | Propios | Heredados que usa | Retos por mesa |
|---|---|---|---|
| magnitudes-y-vectores | 15 | 6 | suma-libre 4, componentes 3, productos-libre 4 |
| movimiento-parabolico-y-circular | 15 | 7 | tiro-libre 4, rueda 4, giro 4 |
| estatica | 15 | 7 | palanca-libre 4, caja-con-masa 4, nudo-libre 3 |
| dinamica | 8 | 13 | bloque-libre 4, ascensor-libre 4, loma 3 |
| gravitacion | 12 | 11 | dos-orbitas 3, elipse-libre 4, atraccion 3 |
| trabajo-y-energia | 10 | 10 | cuerda-libre 4, rampa 4, empujon 3 |
| impulso-y-choques | 10 | 10 | golpe-libre 4, choque-libre 4, centro-libre 4 |
| oscilaciones | 10 | 15 | resorte-libre 4, pendulo-libre 3, coseno 3 |
| ondas-mecanicas | 15 | 9 | guitarra 4, cuerda-fija 4, parlantes 3 |
| fluidos | 15 | 7 | presion-total 4, bloque-libre 4, prensa 3 |
| temperatura-y-calor | 15 | 9 | mezcla-libre 4, curva-calentamiento 4, varilla 4 |
| termodinamica | 14 | 7 | camino-libre 4, primera-ley 4, gas-ideal 4 |
| electrostatica | 15 | 8 | coulomb-libre 4, campo-y-potencial 4, placas 4 |
| corriente-y-circuitos | 15 | 13 | pila-reostato 4, dos-ramas 4, recta-vi 3 |
| magnetismo | 9 | 8 | cable-que-gira 4, cables-distintos 4, brujula 4 |
| induccion-electromagnetica | 12 | 16 | barra-libre 4, espira-gira 4, flujo-tiempo 4 |
| ondas-electromagneticas | 11 | 13 | regla-continua 5, onda-larga 4, cambio-medio 4 |
| optica-geometrica | 18 | 3 | frontera-libre 4, banco-libre 4, fabricante 4 |
| fisica-moderna | 14 | 19 | dos-metales 4, lampara-libre 3, horno-estrella 4 |

Óptica tiene 18 términos: pasa el ideal de 15, pero queda bajo el tope de 24. Los ejes de la óptica (refracción, espejos, lentes y potencia) tienen vocabulario propio.

## Retos: tipos

Cada mesa mezcla cuatro tipos de reto: extremo, caso exacto, forma o patrón, y comparación de dos casos guardados. En cada unidad, al menos uno toca la idea central. Ejemplos:
- **Vectores:** «R = A + B solo si van juntas».
- **Tiro:** «dos ángulos con el mismo alcance».
- **MCU:** «misma rapidez y distinta aceleración».
- **Estática:** «horizontal con masas distintas».
- **Dinámica:** «desliza sin acelerar».
- **Gravitación:** «la masa del satélite no entra».
- **Trabajo:** «trabajo cero jalando con 20 N».
- **Choques:** «el mismo choque elástico y pegado».
- **MAS:** «v y a en sentidos opuestos».
- **Ondas:** «misma v y distinta λ».
- **Fluidos:** «el mismo punto en Lima y Juliaca».
- **Calor:** «distinto calor y la misma temperatura en la meseta».
- **Termodinámica:** «W depende del camino».
- **Electrostática:** «la fuerza cae con 1/r²».
- **Circuitos:** «la R que más potencia recibe está cerca de r».
- **Magnetismo:** «F = 0 con corriente».
- **Inducción:** «apagar el foco moviendo solo v».
- **Ondas EM:** «λ·f = c».
- **Óptica:** «mismo θ₁ que sale y no sale».
- **Moderna:** «brillo máximo sin electrones».

**Cómo se calcula `logrado`.** Usa las mismas funciones que dibujan o leen la mesa. Donde la cuenta estaba metida en `dibujo` o en `lectura`, se sacó a una función con nombre y ahora la usan las dos. Algunas de esas funciones:
- `trabajoCuerda`, `xcmLibre`, `presionTotal`, `tFinal`, `wLibre`;
- `ePlacas`, `reparto`, `femLibre`, `aumentoBanco`, `fDe`.

Los extremos («el mayor…») se calculan recorriendo la grilla de controles, no con un número escrito a mano. Los retos de dos casos guardados piden, igual que la referencia, que el caso actual esté guardado.

## Mesas cambiadas

- **Rangos y controles:** no se amplió ningún rango ni se agregó ningún control. No cambió ningún id de mesa ni de control.
- **`impulso-y-choques` › `choque-libre`:** el control `e` pasó al primer lugar. Sin eso, el validador no alcanzaba el reto «elástico y pegado» con los 160 casos que prueba (ver pedidos al molde). Cambia el orden de los controles en pantalla.
- **`trabajo-y-energia` › `rampa`:** se corrigió la física. La energía potencial de las barras bajaba como h(1−t), pero la bolita se dibuja a una altura h(1−t)². Ahora U = mgh(1−t)², igual que el dibujo. Los extremos t = 0 y t = 1 no cambian.
- **`electrostatica`:** se corrigió un error. La respuesta de la predicción de condensadores en serie decía «guardan 9 μC»; lo correcto es 18 μC (1,5 μF × 12 V).

## Palabras de dos sentidos (decisiones y dudas)

El glosario es por curso: cualquier forma se marca en todas las unidades. Se resolvió así:
- **Términos largos donde la palabra suelta choca:**
  - «fuerza normal» (solo esa forma) y «recta normal»;
  - «empuje hidrostático», porque estática dice «empuje de la mano»;
  - «intensidad de la onda», porque «intensidad» es también corriente;
  - «fase inicial», porque «fase» es también la de la materia;
  - «resistencia eléctrica», porque la referencia dice «resistencia del aire»;
  - «potencia de una lente».
- **No se definieron:**
  - «foco»: es lente, bombilla, foco de la elipse y foco térmico;
  - «nudo»: es el de las cuerdas en estática;
  - «medio»;
  - «flujo» suelto: fluidos dice «flujo estacionario»;
  - «primera ley», «segunda ley» y «tercera ley» sueltas: son de Newton, Kepler y la termodinámica.
- **Textos cambiados para no marcar mal:**
  - estática: «carga», en el sentido de bulto, pasó a «bulto» o «peso», y «poleas en serie» a «una tras otra»;
  - fluidos: «línea de corriente» pasó a «línea de flujo» (la definición de Bernoulli ya no dice «corriente»);
  - óptica: «la potencia» suelta pasó a «la potencia de la lente»;
  - ondas EM: «potencias de diez» pasó a «exponente» y «factor de diez»;
  - termodinámica: «foco a 400 K» pasó a «foco caliente a 400 K»;
  - inducción: «tensión alterna» pasó a «voltaje alterno».
- **Dudas que quedan:**
  - **«distancia», forma de «distancia recorrida» en la referencia.** También se marca en estática (brazo), gravitación y electrostática (de centro a centro) y en magnetismo, con la definición «todo el camino hecho, sumando idas y vueltas»: ahí es otro sentido. No toqué la referencia. Propuesta: quitar la forma suelta «distancia» de `movimiento-rectilineo` (el término sigue saliendo como «distancia recorrida»), o que el molde permita formas por unidad.
  - **«alcance»,** forma de «alcance horizontal»: podría marcar «al alcance de» si un texto lo usa. Hoy no pasa.
  - **«radiación»** se define en general («paso de energía como ondas») porque se repite en ondas EM y moderna.
  - **«carga» y «sistema aislado»** se definen en electrostática y en impulso, con definiciones que sirven en todo el curso.
  - **Términos que se usan antes de la unidad que los define:**
    - «fuerza», en magnitudes;
    - «peso», en parabólico;
    - «polea» y «plano inclinado», en estática, aunque se definen en dinámica;
    - «órbita», en dinámica.

    El lector muestra «Se explica en…». ¿Movemos «polea» y «plano inclinado» a estática?
  - **Términos de la referencia que ya salen en magnitudes y vectores:** desplazamiento (en la historia), distancia, rapidez y aceleración. No los moví: la referencia queda como está.

## Términos fuera del plan inicial

- **Agregados:**
  - dimensión, masa (en magnitudes);
  - fuerza neta (dinámica);
  - semieje mayor, unidad astronómica (gravitación);
  - trabajo neto, energía potencial (trabajo y energía);
  - fuerza interna, fuerza externa (impulso);
  - temperatura absoluta (termodinámica);
  - malla (circuitos);
  - bobina (inducción);
  - ley de Wien, emisión estimulada, tiempo propio (moderna);
  - «mano derecha», en vez de «regla de la mano derecha».
- **Quitados porque el texto no los trae o por el tope:**
  - ecuación dimensional;
  - inercia, fuerza elástica, máquina simple, centro de gravedad;
  - joule, watt, fuerza conservativa, conservación de la energía mecánica, teorema del trabajo y la energía;
  - fuerza media, conservación de la cantidad de movimiento;
  - rapidez de propagación, armónico;
  - presión manométrica, presión absoluta;
  - calorímetro, dieléctrico;
  - primera y segunda ley de la termodinámica;
  - foco, rayo de luz;
  - potencial de frenado.

## Pedidos al molde

1. **Retos con guardados.** El validador los prueba solo con los primeros 160 casos de la grilla, y la grilla varía primero el primer control. Esto trajo tres problemas:
   - obligó a reordenar los controles de `choque-libre`;
   - dejó la mesa `dos-metales` sin reto de comparación: ahí ningún metal suelta electrones con f ≤ 5;
   - obligó a cambiar un reto de `cables-distintos`.

   Sería mejor una muestra repartida en toda la grilla.
2. **Tope de 4 palabras por término.** No alcanza para «regla de la mano derecha» ni para «primera ley de la termodinámica». Propuesta: subir el tope a 5, o separar el nombre que se muestra de la forma que se busca.
3. **Sentido por unidad.** Haría falta poder dar sentido por unidad, o limitar una forma a ciertas unidades, para palabras como «distancia», «foco», «carga», «potencia» y «corriente». Además, `formasDe` siempre agrega el término mismo como forma.
4. **Topes de `bien`.** Cuentan «m/s²» como varias palabras. El mensaje de error podría decir el conteo.

## Lo no verificado

- **Ejemplos del glosario.** Los números se comprobaron a mano contra las fórmulas de cada archivo, no con un cálculo independiente aparte. Los que redondean:
  - B ≈ 126 μT en la espira;
  - 2,26×10⁸ m/s en agua;
  - f₀ del sodio ≈ 5,6×10¹⁴ Hz;
  - (1 + 0,4)/(1 − 0,4) ≈ 2,33.
- **Datos tomados del código y no contrastados afuera:**
  - Juliaca a 64 kPa;
  - 76 cm de mercurio en Lima;
  - tensión superficial del agua, 0,073 N/m.
- **Recorrido.** Se probó un reto por mesa en el navegador, no los cuatro. Los demás solo los comprueba el validador: se pueden lograr y no están cumplidos al abrir.
- **Capturas.** Se miraron las capturas de algunas unidades, no de las 19.
