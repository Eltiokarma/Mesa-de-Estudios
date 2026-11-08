# Códigos de error de los generadores de razonamiento matemático (rutina rm-procesos, 8 nov 2026)

Los generadores `plantillas/rm-*` (formato «predicciones») arman sus alternativas incorrectas con errores con nombre. Los que ya tienen código en `aritmetica-razonamiento-ideas-erroneas.md` (AR1–AR22, RM1–RM6) usan ese código. Los demás salen de las trampas que se infirieron de los solucionarios de admisión de San Marcos (`docs/clasificacion/trampas-admision-unmsm/rm-a.md` y `rm-b.md`) y entran aquí como **hipótesis**: no hay dato de alumnos. Los datos del colegio dirán cuáles se eligen de verdad.

El id de cada alternativa es `<código>-<detalle>` (por ejemplo `RMP20-una-vuelta-menos`): el código agrupa el error y el detalle dice su cara en ese problema. Rangos: RMP1–RMP2 compartidos; RMP10–RMP79, un bloque de diez por grupo de generadores.

## Compartidos

| Código | Error | Trampa de origen |
| --- | --- | --- |
| RMP1 | Puntos contra intervalos (el error de la cerca): cortes por tramos, n tomas = n − 1 intervalos, estacas compartidas contadas dos veces, contar estados en vez de movimientos, contar la salida como encuentro | rm-a #3 |
| RMP2 | Quedarse con la primera solución o estrategia que funciona, sin minimizar ni maximizar | rm-a (sueltas: «primera solución diofántica sin minimizar») |

## Deducción lógica (`rm-deduccion`)

| Código | Error | Trampa de origen |
| --- | --- | --- |
| RMP70 | Leer el condicional como bicondicional | rm-a #25 |
| RMP71 | Usar la recíproca, negar las dos partes o negar «si p, q» como «ni p ni q» | negar mal un condicional |
| RMP72 | Quedarse con un reparto que cumple todas las pistas menos una | nueva |
| RMP73 | Leer «todos los A son B» o «algunos A no son B» al revés (conversión ilícita), en una premisa o en la conclusión | rm-a #25 |
| RMP74 | Poner «algunos» donde vale «ninguno», o leer «algunos» como «todos» o «ningún» | rm-a #25 |
| RMP75 | Leer «algunos son» como «solo algunos» | nueva |
| RMP76 | Encadenar por un término medio que no conecta (efecto atmósfera) | nueva |
| RMP77 | Elegir lo posible y no lo necesario | rm-a #16 |
| RMP78 | Creer que no se deduce nada cuando sí se deduce algo | nueva |
| RMP79 | Tomar la primera parte de un contrafáctico («si X fuera…») como un dato | hueco de admisión 2021 |
