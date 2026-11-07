/*
 * Motor de «La sierra y la balanza: cortes y pesadas» (razonamiento matemático): cortes de una varilla abierta y de
 * un aro cerrado, estacas en una línea y en un contorno cerrado, cortes de una soga doblada, cortes con piezas
 * apiladas, balanza de dos platillos con pesas y el menor número de pesadas para hallar una moneda falsa.
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorCortes) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Convenciones:
 *   - Longitudes en metros, tiempos en minutos, masas en kilogramos. Todo número debe ser finito; los que se dicen
 *     «positivos» deben ser mayores que cero. Los resultados exactos no se redondean.
 *   - Forma 'abierta': una varilla, soga o avenida con dos extremos. Forma 'cerrada': un aro, collar o cerco que se
 *     cierra sobre sí mismo. Una posición es la distancia desde un extremo (abierta) o desde un punto de partida
 *     marcado en el contorno, en el sentido de la marcha (cerrada).
 *   - Cada resultado que es la respuesta de una predicción trae 'errores' (lo que da cada error típico),
 *     'coinciden' (los nombres de los errores que en ese caso dan justo la respuesta correcta: no se ofrecen y no
 *     van en 'errores') y 'repetidos' ({ nombre: el error anterior de la lista que da lo mismo }; tampoco van en
 *     'errores'). Los errores se revisan en el orden en que se nombran abajo. Cuando la respuesta es un par, los
 *     errores también son pares y se comparan completos.
 *   - Platillos de la balanza: 'junto' es el platillo donde está el objeto que se pesa (una pesa ahí resta), 'otro'
 *     es el platillo de enfrente (una pesa ahí suma); 'fuera' son las pesas que no se usan. Monedas numeradas de 1 a n;
 *     la falsa es más liviana que las demás, que pesan todas igual.
 *
 * Funciones (argumentos entre llaves):
 *   cortar({ forma, largo, tramo, minutos })   partir en piezas iguales de 'tramo' (forma 'abierta' por defecto).
 *                               largo/tramo debe ser un entero ≥ 1. minutos (opcional, ≥ 0) es lo que toma cada corte.
 *                               { forma, piezas: largo/tramo, cortes: piezas − 1 (abierta) o piezas (cerrada),
 *                               posiciones: dónde va cada corte (abierta: tramo, 2·tramo… (piezas − 1)·tramo;
 *                               cerrada: 0, tramo… (piezas − 1)·tramo), tiempo: cortes·minutos (null sin minutos),
 *                               errores (número de cortes): abierta → unoPorPieza (piezas), masUno (piezas + 1),
 *                               dosPorCorte (⌈piezas/2⌉: cree que cada corte suelta dos piezas nuevas);
 *                               cerrada → comoAbierta (piezas − 1), masUno (piezas + 1), dosPorCorte (⌈piezas/2⌉),
 *                               erroresTiempo: lo mismo por minutos, con las mismas claves (null sin minutos) }.
 *   contarPiezas({ forma, largo, cortes })   cortes: lista de posiciones distintas (abierta: 0 < x < largo;
 *                               cerrada: 0 ≤ x < largo). Cuenta las piezas que quedan, sin fórmula: recorre los tramos.
 *                               { cortes: cuántos, piezas, largos: el largo de cada pieza (abierta: de un extremo al
 *                               otro; cerrada: empezando en el primer corte y siguiendo la marcha; sin cortes, [largo]),
 *                               entera: true si es cerrada y no tiene cortes (el aro sigue cerrado: 1 pieza) }.
 *   tiempoCortes({ piezas, minutos, piezasNuevas })   si partir algo en 'piezas' (entero ≥ 2) toma 'minutos', ¿cuánto
 *                               toma partir otro igual en 'piezasNuevas' (entero ≥ 1)? Forma abierta.
 *                               { porCorte: minutos/(piezas − 1), cortes: piezasNuevas − 1, tiempo: (piezasNuevas − 1)·porCorte,
 *                               errores: lineal (minutos·piezasNuevas/piezas: regla de tres con las piezas),
 *                               porPieza (porCorte·piezasNuevas: cuenta un corte por pieza) }.
 *   estacas({ forma, largo, separacion })   estacas o postes cada 'separacion' a lo largo de una línea (abierta, con
 *                               estaca en los dos extremos) o de un contorno (cerrada). largo/separacion entero ≥ 1.
 *                               { tramos: largo/separacion, estacas: tramos + 1 (abierta) o tramos (cerrada),
 *                               errores: abierta → sinMasUno (tramos), masDos (tramos + 2); cerrada → masUno
 *                               (tramos + 1), menosUno (tramos − 1) }.
 *   compararEstacas({ largo, separacion })   la misma longitud en línea abierta y en contorno cerrado.
 *                               { abierta, cerrada, tramos, respuesta: [abierta, cerrada], errores (pares
 *                               [abierta, cerrada]): sinMasUno ([tramos, tramos]), cerradaMasUno ([tramos + 1, tramos + 1]),
 *                               alReves ([tramos, tramos + 1]) }.
 *   sogaDoblada({ largo, capas, posiciones })   una soga de 'largo' se dobla en zigzag en 'capas' (entero ≥ 1) partes
 *                               iguales, y cada corte atraviesa todas las capas. posiciones: dónde se corta el atado,
 *                               medido desde el extremo del atado donde empieza la soga (0 < x < largo/capas, distintas).
 *                               La capa j (desde 0) cubre la soga de j·s a (j + 1)·s, con s = largo/capas; va en un
 *                               sentido si j es par y en el otro si es impar, así que un corte en x corta la soga en
 *                               j·s + x (j par) y en (j + 1)·s − x (j impar).
 *                               { tramo: s, cortes: posiciones.length, puntos: los puntos de corte en la soga estirada
 *                               (ordenados), piezas: puntos + 1, largos: el largo de cada pedazo de un extremo al otro,
 *                               errores: sinCapas (cortes + 1: como si no estuviera doblada), sinMasUno (capas·cortes),
 *                               cadaCapaAparte (capas·(cortes + 1): cada capa como una varilla suelta) }.
 *   cortesApilando({ piezas })   una varilla de 'piezas' metros (entero de 1 a 16) se parte en piezas de 1 m; entre
 *                               corte y corte se pueden apilar los pedazos y cortar varios a la vez (un corte recto
 *                               parte en dos cada pedazo del montón). Búsqueda en anchura sobre los montones posibles.
 *                               { minimo: el menor número de cortes, sinApilar: piezas − 1, cota: ⌈log₂ piezas⌉ (cada
 *                               corte a lo más duplica los pedazos), plan: un plan con 'minimo' cortes, como lista de los
 *                               largos de todos los pedazos después de cada corte (de mayor a menor; no es el único),
 *                               errores: sinApilar (piezas − 1), mitad (⌈piezas/2⌉), unoPorPieza (piezas) }.
 *   pesar({ pesas, masa })      pesas: lista de 1 a 8 enteros positivos (se pueden repetir); masa > 0. Prueba por fuerza
 *                               bruta las 3^k formas de poner cada pesa ('fuera', 'otro' o 'junto') y se queda con las
 *                               que equilibran: masa + Σjunto = Σotro. { posible, formas: cuántas formas equilibran,
 *                               junto, otro, fuera: las pesas (valores, en el orden de la lista) de la forma elegida: la
 *                               que usa menos pesas; si empatan, la primera al recorrer las pesas en el orden dado y
 *                               probar para cada una 'fuera', luego 'otro', luego 'junto' (orden lexicográfico); sin
 *                               solución, posible false y junto, otro y fuera null }.
 *   equilibrio({ pesas, masa, junto, otro })   revisa un acomodo: junto y otro son listas de valores tomados de 'pesas'
 *                               (cada pesa se usa a lo más una vez). { izquierdo: masa + Σjunto (el platillo de la masa),
 *                               derecho: Σotro, diferencia: derecho − izquierdo, estado: 'equilibrio' | 'baja-masa'
 *                               (baja el platillo de la masa) | 'baja-pesas' }.
 *   masasMedibles({ pesas })   todas las masas enteras positivas que se pueden pesar. { masas (ordenadas), cuantas,
 *                               suma: Σpesas, alcance: el mayor M tal que se pesan todas de 1 a M (0 si no se pesa 1),
 *                               completo: alcance = suma, unPlatillo: las masas que se pesan poniendo pesas solo en el otro
 *                               platillo (sumas de pesas, distintas y ordenadas), errores (valores de 'cuantas'):
 *                               unPlatillo (unPlatillo.length), cadaAcomodo (3^k − 1: cuenta cada acomodo y su espejo),
 *                               unaPorPesa (k) }.
 *   agregarPesa({ pesas, nueva })   ¿hasta dónde se pesa todo si se agrega una pesa? { antes: alcance con pesas,
 *                               despues: alcance con la nueva, errores: laMayor (la pesa mayor del juego nuevo),
 *                               siguiente (3 × la pesa mayor), doble (2·antes) }.
 *   simularPesadas({ monedas, falsa, estrategia })   monedas: entero de 2 a 243; falsa: de 1 a monedas. estrategia
 *                               'tercios' (por defecto): con c sospechosas, pone ⌈c/3⌉ en cada platillo (las primeras en
 *                               orden a la izquierda, las siguientes a la derecha) y deja el resto fuera; 'mitades':
 *                               ⌊c/2⌋ en cada platillo y la que sobra (si hay) fuera. Repite hasta que queda una.
 *                               { pasos: [{ izquierda, derecha, fuera (números de moneda), resultado: 'equilibrio' |
 *                               'izquierda-liviana' | 'derecha-liviana', quedan (las sospechosas que siguen) }],
 *                               encontrada, cuantas: pasos.length }.
 *   minimoPesadas({ monedas })   monedas: entero de 3 a 100. Busca el árbol de decisión más bajo: con c sospechosas y las
 *                               demás ya sabidas buenas, prueba poner a sospechosas a la izquierda y b a la derecha (si
 *                               a ≠ b, se completa con |a − b| monedas buenas, si las hay; ninguna pesada puede dejar
 *                               todas las sospechosas como estaban); cada resultado deja a, b o c − a − b sospechosas.
 *                               { pesadas: la altura mínima del árbol, cota: el menor k con 3^k ≥ monedas,
 *                               grupos: [a, a, monedas − 2a] con a = ⌈monedas/3⌉ (la primera pesada en tercios),
 *                               tercios y mitades: lo que tarda cada estrategia de simularPesadas en el peor caso
 *                               (probando la falsa en cada posición), errores: mitades, parejas (⌊monedas/2⌋: pesa de dos
 *                               en dos), unaPorUna (monedas − 2: compara la moneda 1 con cada una de las demás) }.
 *
 * Respaldos (docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md): olvidar el +1 al contar estacas se parece a
 * «cantidad de términos de una progresión sin el +1» (en «Lo que no tiene respaldo», sin dato); la regla de tres con
 * las piezas (tiempoCortes, errores.lineal) se liga a AR7 (ilusión de linealidad), que tiene datos en otros problemas
 * pero no en este. Todo lo demás son hipótesis nuestras.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorCortes = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const EPS = 1e-9;

  function numero(x, que, o) {
    o = o || {};
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error(`${que} debe ser un número`);
    if (o.entero && !Number.isInteger(x)) throw new Error(`${que} debe ser un número entero`);
    if (o.positivo && !(x > 0)) throw new Error(`${que} debe ser mayor que cero`);
    if (o.noNegativo && x < 0) throw new Error(`${que} no puede ser negativo`);
    if (o.min !== undefined && x < o.min) throw new Error(`${que} debe ser al menos ${o.min}`);
    if (o.max !== undefined && x > o.max) throw new Error(`${que} debe ser como mucho ${o.max}`);
    return x;
  }
  function objeto(o, que) {
    if (!o || typeof o !== 'object') throw new Error(`${que} debe ser un objeto con los datos`);
    return o;
  }
  function forma(f) {
    if (f === undefined) return 'abierta';
    if (f !== 'abierta' && f !== 'cerrada') throw new Error("forma debe ser 'abierta' o 'cerrada'");
    return f;
  }
  // Redondea el ruido de coma flotante cerca de un número con hasta 6 decimales.
  function limpio(x) {
    if (typeof x !== 'number') return x;
    for (const p of [1, 100, 1e4, 1e6]) { const y = Math.round(x * p) / p; if (Math.abs(x - y) <= 1e-11 * Math.max(1, Math.abs(x))) return y + 0; }
    return x;
  }
  const casi = (a, b) => Math.abs(a - b) <= EPS * Math.max(1, Math.abs(a), Math.abs(b));
  function igual(a, b) {
    if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((x, i) => igual(x, b[i]));
    if (typeof a === 'number' && typeof b === 'number') return casi(a, b);
    return a === b;
  }
  // Reparte los errores: los que dan la respuesta van a 'coinciden'; los que repiten a uno anterior, a 'repetidos'.
  function armar(correcto, lista) {
    const errores = {}, coinciden = [], repetidos = {}, vistos = [];
    for (const [nombre, valor] of lista) {
      if (igual(valor, correcto)) { coinciden.push(nombre); continue; }
      const antes = vistos.find(v => igual(v[1], valor));
      if (antes) { repetidos[nombre] = antes[0]; continue; }
      vistos.push([nombre, valor]); errores[nombre] = valor;
    }
    return { errores, coinciden, repetidos };
  }
  function cociente(largo, tramo, que) {
    const q = largo / tramo, r = Math.round(q);
    if (!casi(q, r) || r < 1) throw new Error(`${que} debe caber un número entero de veces (al menos una)`);
    return r;
  }

  // ---------- cortes ----------
  function cortar(o) {
    objeto(o, 'cortar');
    const f = forma(o.forma);
    const largo = numero(o.largo, 'largo', { positivo: true }), tramo = numero(o.tramo, 'tramo', { positivo: true });
    const piezas = cociente(largo, tramo, 'el tramo');
    if (o.minutos !== undefined) numero(o.minutos, 'minutos', { noNegativo: true });
    const cortes = f === 'abierta' ? piezas - 1 : piezas;
    const posiciones = [];
    for (let k = f === 'abierta' ? 1 : 0; k < piezas; k++) posiciones.push(limpio(k * tramo));
    const lista = f === 'abierta'
      ? [['unoPorPieza', piezas], ['masUno', piezas + 1], ['dosPorCorte', Math.ceil(piezas / 2)]]
      : [['comoAbierta', piezas - 1], ['masUno', piezas + 1], ['dosPorCorte', Math.ceil(piezas / 2)]];
    const A = armar(cortes, lista);
    let erroresTiempo = null;
    if (o.minutos !== undefined) {
      erroresTiempo = {};
      for (const [k, v] of Object.entries(A.errores)) erroresTiempo[k] = limpio(v * o.minutos);
    }
    return { forma: f, piezas, cortes, posiciones, tiempo: o.minutos === undefined ? null : limpio(cortes * o.minutos),
      errores: A.errores, erroresTiempo, coinciden: A.coinciden, repetidos: A.repetidos };
  }

  function contarPiezas(o) {
    objeto(o, 'contarPiezas');
    const f = forma(o.forma), largo = numero(o.largo, 'largo', { positivo: true });
    if (!Array.isArray(o.cortes)) throw new Error('cortes debe ser una lista de posiciones');
    const xs = o.cortes.map((x, i) => numero(x, `el corte ${i + 1}`)).slice().sort((a, b) => a - b);
    for (const x of xs) {
      if (f === 'abierta' && !(x > EPS && x < largo - EPS)) throw new Error('en una forma abierta, cada corte va entre 0 y el largo, sin tocar los extremos');
      if (f === 'cerrada' && !(x >= -EPS && x < largo - EPS)) throw new Error('en una forma cerrada, cada corte va desde 0 hasta antes del largo');
    }
    for (let i = 1; i < xs.length; i++) if (casi(xs[i], xs[i - 1])) throw new Error('dos cortes en el mismo lugar');
    let largos;
    if (f === 'abierta') {
      const b = [0, ...xs, largo];
      largos = b.slice(1).map((x, i) => limpio(x - b[i]));
    } else if (!xs.length) largos = [largo];
    else largos = xs.map((x, i) => limpio(i + 1 < xs.length ? xs[i + 1] - x : largo - x + xs[0]));
    return { cortes: xs.length, piezas: largos.length, largos, entera: f === 'cerrada' && !xs.length };
  }

  function tiempoCortes(o) {
    objeto(o, 'tiempoCortes');
    const p = numero(o.piezas, 'piezas', { entero: true, min: 2 });
    const m = numero(o.minutos, 'minutos', { positivo: true });
    const N = numero(o.piezasNuevas, 'piezasNuevas', { entero: true, min: 1 });
    const porCorte = m / (p - 1), tiempo = (N - 1) * porCorte;
    const A = armar(tiempo, [['lineal', m * N / p], ['porPieza', porCorte * N]].map(([k, v]) => [k, limpio(v)]));
    return { porCorte: limpio(porCorte), cortes: N - 1, tiempo: limpio(tiempo), errores: A.errores, coinciden: A.coinciden, repetidos: A.repetidos };
  }

  // ---------- estacas ----------
  function estacas(o) {
    objeto(o, 'estacas');
    const f = forma(o.forma);
    const largo = numero(o.largo, 'largo', { positivo: true }), sep = numero(o.separacion, 'separacion', { positivo: true });
    const tramos = cociente(largo, sep, 'la separación');
    const n = f === 'abierta' ? tramos + 1 : tramos;
    const A = armar(n, f === 'abierta' ? [['sinMasUno', tramos], ['masDos', tramos + 2]] : [['masUno', tramos + 1], ['menosUno', tramos - 1]]);
    return { forma: f, tramos, estacas: n, errores: A.errores, coinciden: A.coinciden, repetidos: A.repetidos };
  }
  function compararEstacas(o) {
    objeto(o, 'compararEstacas');
    const a = estacas({ forma: 'abierta', largo: o.largo, separacion: o.separacion });
    const c = estacas({ forma: 'cerrada', largo: o.largo, separacion: o.separacion });
    const t = a.tramos, resp = [a.estacas, c.estacas];
    const A = armar(resp, [['sinMasUno', [t, t]], ['cerradaMasUno', [t + 1, t + 1]], ['alReves', [t, t + 1]]]);
    return { abierta: a.estacas, cerrada: c.estacas, tramos: t, respuesta: resp, errores: A.errores, coinciden: A.coinciden, repetidos: A.repetidos };
  }

  // ---------- soga doblada ----------
  function sogaDoblada(o) {
    objeto(o, 'sogaDoblada');
    const largo = numero(o.largo, 'largo', { positivo: true });
    const capas = numero(o.capas, 'capas', { entero: true, min: 1, max: 20 });
    if (!Array.isArray(o.posiciones) || !o.posiciones.length) throw new Error('posiciones debe ser una lista con al menos un corte');
    const s = largo / capas;
    const xs = o.posiciones.map((x, i) => numero(x, `la posición ${i + 1}`));
    for (const x of xs) if (!(x > EPS && x < s - EPS)) throw new Error('cada corte va dentro del atado, sin tocar los dobleces (0 < x < largo/capas)');
    const ord = xs.slice().sort((a, b) => a - b);
    for (let i = 1; i < ord.length; i++) if (casi(ord[i], ord[i - 1])) throw new Error('dos cortes en el mismo lugar');
    const puntos = [];
    for (let j = 0; j < capas; j++) for (const x of xs) puntos.push(limpio(j % 2 === 0 ? j * s + x : (j + 1) * s - x));
    puntos.sort((a, b) => a - b);
    const C = contarPiezas({ forma: 'abierta', largo, cortes: puntos });
    const c = xs.length;
    const A = armar(C.piezas, [['sinCapas', c + 1], ['sinMasUno', capas * c], ['cadaCapaAparte', capas * (c + 1)]]);
    return { tramo: limpio(s), cortes: c, puntos, piezas: C.piezas, largos: C.largos, errores: A.errores, coinciden: A.coinciden, repetidos: A.repetidos };
  }

  // ---------- cortes apilando ----------
  function cotaDos(n) { let k = 0; while (Math.pow(2, k) < n) k++; return k; }
  function cortesApilando(o) {
    objeto(o, 'cortesApilando');
    const n = numero(o.piezas, 'piezas', { entero: true, min: 1, max: 16 });
    // estado: largos de los pedazos mayores que 1, de mayor a menor (los de 1 m ya están listos)
    const clave = e => e.join(',');
    const inicio = n > 1 ? [n] : [];
    const padre = new Map([[clave(inicio), null]]);
    let frente = [inicio], meta = inicio.length ? null : inicio, prof = 0;
    while (!meta) {
      const sig = [];
      prof++;
      for (const e of frente) {
        // cada pedazo se deja o se corta en a y l − a (a de 1 a ⌊l/2⌋)
        const salidas = [[]];
        for (const l of e) {
          const nuevas = [];
          for (const s of salidas) {
            nuevas.push(s.concat([l]));
            for (let a = 1; a <= Math.floor(l / 2); a++) nuevas.push(s.concat([a, l - a]));
          }
          salidas.length = 0; salidas.push(...nuevas);
        }
        for (const s of salidas) {
          const t = s.filter(x => x > 1).sort((a, b) => b - a), k = clave(t);
          if (padre.has(k)) continue;
          padre.set(k, { de: clave(e), todos: s.slice().sort((a, b) => b - a) });
          if (!t.length) { meta = t; break; }
          sig.push(t);
        }
        if (meta) break;
      }
      frente = sig;
    }
    // rehace el camino; los pedazos de 1 m que van saliendo se suman al final de cada lista
    const camino = [];
    for (let k = clave(meta); padre.get(k); k = padre.get(k).de) camino.unshift(padre.get(k).todos);
    const plan = [];
    let unos = 0;
    for (const s of camino) {
      unos += s.filter(x => x === 1).length;
      plan.push(s.filter(x => x > 1).concat(new Array(unos).fill(1)));
    }
    const A = armar(prof, [['sinApilar', n - 1], ['mitad', Math.ceil(n / 2)], ['unoPorPieza', n]]);
    return { minimo: prof, sinApilar: n - 1, cota: cotaDos(n), plan, errores: A.errores, coinciden: A.coinciden, repetidos: A.repetidos };
  }

  // ---------- balanza ----------
  function listaPesas(p) {
    if (!Array.isArray(p) || p.length < 1 || p.length > 8) throw new Error('pesas debe ser una lista de 1 a 8 pesas');
    return p.map((x, i) => numero(x, `la pesa ${i + 1}`, { entero: true, positivo: true }));
  }
  // recorre las 3^k formas: lugar[i] = 0 fuera, 1 otro, 2 junto (en ese orden, la primera pesa es la más significativa)
  function cadaForma(pesas, fn) {
    const k = pesas.length, total = Math.pow(3, k), lugar = new Array(k);
    for (let m = 0; m < total; m++) {
      let r = m;
      for (let i = k - 1; i >= 0; i--) { lugar[i] = r % 3; r = Math.floor(r / 3); }
      let neto = 0;
      for (let i = 0; i < k; i++) neto += lugar[i] === 1 ? pesas[i] : lugar[i] === 2 ? -pesas[i] : 0;
      fn(lugar, neto);
    }
  }
  function pesar(o) {
    objeto(o, 'pesar');
    const pesas = listaPesas(o.pesas), masa = numero(o.masa, 'masa', { positivo: true });
    let formas = 0, mejor = null, usadas = Infinity;
    cadaForma(pesas, (lugar, neto) => {
      if (!casi(neto, masa)) return;
      formas++;
      const u = lugar.filter(x => x).length;
      if (u < usadas) { usadas = u; mejor = lugar.slice(); }
    });
    if (!mejor) return { posible: false, formas: 0, junto: null, otro: null, fuera: null };
    const de = t => pesas.filter((_, i) => mejor[i] === t);
    return { posible: true, formas, junto: de(2), otro: de(1), fuera: de(0) };
  }
  function equilibrio(o) {
    objeto(o, 'equilibrio');
    const pesas = listaPesas(o.pesas), masa = numero(o.masa, 'masa', { positivo: true });
    const junto = o.junto || [], otro = o.otro || [];
    if (!Array.isArray(junto) || !Array.isArray(otro)) throw new Error('junto y otro deben ser listas de pesas');
    const quedan = pesas.slice();
    for (const v of junto.concat(otro)) {
      const i = quedan.indexOf(v);
      if (i < 0) throw new Error(`no hay una pesa de ${v} disponible`);
      quedan.splice(i, 1);
    }
    const izq = limpio(masa + junto.reduce((s, v) => s + v, 0)), der = otro.reduce((s, v) => s + v, 0);
    const d = limpio(der - izq);
    return { izquierdo: izq, derecho: der, diferencia: d, estado: casi(d, 0) ? 'equilibrio' : d < 0 ? 'baja-masa' : 'baja-pesas' };
  }
  function alcanceDe(masas) { let a = 0; while (masas.has(a + 1)) a++; return a; }
  function masasMedibles(o) {
    objeto(o, 'masasMedibles');
    const pesas = listaPesas(o.pesas);
    const dos = new Set(), uno = new Set();
    cadaForma(pesas, (lugar, neto) => {
      if (neto > 0) { dos.add(neto); if (!lugar.includes(2)) uno.add(neto); }
    });
    const masas = [...dos].sort((a, b) => a - b), unP = [...uno].sort((a, b) => a - b);
    const suma = pesas.reduce((s, v) => s + v, 0), alcance = alcanceDe(dos);
    const A = armar(masas.length, [['unPlatillo', unP.length], ['cadaAcomodo', Math.pow(3, pesas.length) - 1], ['unaPorPesa', pesas.length]]);
    return { masas, cuantas: masas.length, suma, alcance, completo: alcance === suma, unPlatillo: unP,
      errores: A.errores, coinciden: A.coinciden, repetidos: A.repetidos };
  }
  function agregarPesa(o) {
    objeto(o, 'agregarPesa');
    const pesas = listaPesas(o.pesas), nueva = numero(o.nueva, 'nueva', { entero: true, positivo: true });
    const todas = listaPesas(pesas.concat([nueva]));
    const antes = masasMedibles({ pesas }).alcance, despues = masasMedibles({ pesas: todas }).alcance;
    const mayor = Math.max(...todas);
    const A = armar(despues, [['laMayor', mayor], ['siguiente', 3 * mayor], ['doble', 2 * antes]]);
    return { antes, despues, errores: A.errores, coinciden: A.coinciden, repetidos: A.repetidos };
  }

  // ---------- moneda falsa ----------
  function simularPesadas(o) {
    objeto(o, 'simularPesadas');
    const n = numero(o.monedas, 'monedas', { entero: true, min: 2, max: 243 });
    const falsa = numero(o.falsa, 'falsa', { entero: true, min: 1, max: n });
    const est = o.estrategia === undefined ? 'tercios' : o.estrategia;
    if (est !== 'tercios' && est !== 'mitades') throw new Error("estrategia debe ser 'tercios' o 'mitades'");
    let sos = Array.from({ length: n }, (_, i) => i + 1);
    const pasos = [];
    while (sos.length > 1) {
      const c = sos.length, a = est === 'tercios' ? Math.ceil(c / 3) : Math.floor(c / 2);
      const izquierda = sos.slice(0, a), derecha = sos.slice(a, 2 * a), fuera = sos.slice(2 * a);
      let resultado, quedan;
      if (izquierda.includes(falsa)) { resultado = 'izquierda-liviana'; quedan = izquierda; }
      else if (derecha.includes(falsa)) { resultado = 'derecha-liviana'; quedan = derecha; }
      else { resultado = 'equilibrio'; quedan = fuera; }
      pasos.push({ izquierda, derecha, fuera, resultado, quedan });
      sos = quedan;
    }
    return { pasos, encontrada: sos[0], cuantas: pasos.length };
  }
  function peorCaso(n, est) {
    let peor = 0;
    for (let f = 1; f <= n; f++) peor = Math.max(peor, simularPesadas({ monedas: n, falsa: f, estrategia: est }).cuantas);
    return peor;
  }
  function minimoPesadas(o) {
    objeto(o, 'minimoPesadas');
    const N = numero(o.monedas, 'monedas', { entero: true, min: 3, max: 100 });
    // g[c]: menor número de pesadas con c sospechosas y N − c monedas buenas a mano
    const g = new Array(N + 1).fill(Infinity);
    g[0] = 0; g[1] = 0;
    for (let c = 2; c <= N; c++) {
      const buenas = N - c;
      for (let a = 0; a <= c; a++) for (let b = 0; a + b <= c; b++) {
        if (a + b === 0 || Math.abs(a - b) > buenas) continue;
        if (a === c || b === c) continue;                 // no aprende nada: todas siguen sospechosas
        const peor = Math.max(g[a], g[b], g[c - a - b]);
        if (1 + peor < g[c]) g[c] = 1 + peor;
      }
    }
    let cota = 0; while (Math.pow(3, cota) < N) cota++;
    const a = Math.ceil(N / 3);
    const mitades = peorCaso(N, 'mitades');
    const A = armar(g[N], [['mitades', mitades], ['parejas', Math.floor(N / 2)], ['unaPorUna', N - 2]]);
    return { pesadas: g[N], cota, grupos: [a, a, N - 2 * a], tercios: peorCaso(N, 'tercios'), mitades,
      errores: A.errores, coinciden: A.coinciden, repetidos: A.repetidos };
  }

  return { cortar, contarPiezas, tiempoCortes, estacas, compararEstacas, sogaDoblada, cortesApilando,
    pesar, equilibrio, masasMedibles, agregarPesa, simularPesadas, minimoPesadas };
});
