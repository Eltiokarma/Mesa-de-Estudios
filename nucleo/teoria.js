/*
 * Teoría interactiva (docs/teoria.md): el formato de una unidad, su validación y el reparto de personajes.
 * Sin DOM: la pantalla está en app/teoria.js. Funciona en el navegador (window.Teoria) y en Node (pruebas).
 *
 * Una unidad de teoría es un archivo contenido/teoria/<curso>/<unidad>.js que llama a Teoria.unidad({...}).
 * Cada unidad tiene de 2 a 6 ideas, y cada idea recorre los mismos cinco momentos (regla 3: jugar, después
 * predecir, después ver):
 *   1. juega    el alumno mueve la figura sin preguntas (obligatorio, `minimo` cambios distintos)
 *   2. predice  una pregunta neutra sobre algo que el juego no mostró; bloquea hasta responder
 *   3. mira     la explicación como línea de tiempo de la misma figura (Kit.lineaTiempo)
 *   4. regla    la regla con su ecuación y la condición que la hace verdadera; queda en el resumen de repaso
 *   5. ahora tú un caso nuevo, generado con semilla, sin la ayuda del juego
 * Todo número que se ve lo calcula el archivo con código (regla 1); el texto cumple los topes de PRESUPUESTO.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(root, nodo ? require('./ecuacion.js') : root.Ecuacion, nodo ? require('./kit/kit.js') : root.Kit,
    nodo ? require('./glosario.js') : root.Glosario);
  if (nodo) module.exports = api;
  else root.Teoria = Object.assign(root.Teoria || {}, api);
})(typeof self !== 'undefined' ? self : this, function (root, Ecuacion, Kit, Glosario) {
  'use strict';

  // Los ocho compañeros (docs/teoria/fuentes/guia-personajes.pdf). La asignación es provisional, como dice la guía.
  // `voces`: lo que dice cada uno cuando la unidad no trae su propia `voz`, escrito con su voz de la guía (≤ 16 palabras).
  const PERSONAJES = {
    'aritmetica': { id: 'luma', nombre: 'Luma', animal: 'tortuga', voces: {"prediccion": "Antes de comprobar, ¿qué esperas que pase?", "coincide": "Coincide. Comprobemos por qué.", "noCoincide": "No coincide. Revisemos qué cambió respecto al caso anterior.", "mira": "Paso a paso. Comprueba qué se conserva en cada uno.", "regla": "Esta es la regla. Revisa cuándo vale.", "ahora": "Un caso nuevo. Fija primero la unidad.", "acierto": "La cuenta coincide.", "error": "Revisemos qué representa cada parte y prueba otro.", "nose": "Bien que lo digas. Mira cómo se resuelve y prueba otro.", "fin": "Terminaste esta unidad. Tus reglas quedan en el resumen.", "llegada": "Buen día. Elige qué hacemos hoy, con calma.", "regreso": "Volviste. Lo último fue {lugar}.", "despedida": "Lo de hoy quedó anotado. Vuelve cuando quieras.", "ayuda2": "Dos intentos no salieron. Revisemos qué representa cada parte, paso a paso."} },
    'algebra': { id: 'nox', nombre: 'Nox', animal: 'cuervo', voces: {"prediccion": "Antes de transformar, ¿qué crees que pasa?", "coincide": "Coincide. Ahora veamos por qué se conserva.", "noCoincide": "No coincide. Probemos con un caso concreto.", "mira": "Sigue la transformación paso a paso.", "regla": "Esta es la estructura. Fíjate en su condición.", "ahora": "Otra expresión. Revisa la condición antes de operar.", "acierto": "Se conserva en cada paso.", "error": "Creo que falta un paso. Revisa la solución.", "nose": "Veamos el camino completo. Luego intenta otro.", "fin": "Terminaste esta unidad. El resumen guarda las reglas.", "llegada": "Hola. ¿Exploramos una estructura o seguimos lo de antes?", "regreso": "Creo que lo último fue {lugar}. ¿Seguimos?", "despedida": "Lo de hoy quedó guardado. La estructura seguirá aquí.", "ayuda2": "Dos veces no encajó. Probemos con un caso concreto antes de seguir."} },
    'fisica': { id: 'tilo', nombre: 'Tilo', animal: 'gato bicolor', voces: {"prediccion": "Antes de ver la respuesta: ¿qué crees que pasa?", "coincide": "Coincide. Veamos qué lo explica.", "noCoincide": "Tu predicción no coincide. Veamos por qué.", "mira": "Avanza paso a paso y mira qué cambia en cada uno.", "regla": "Esta es la regla, y abajo, cuándo vale.", "ahora": "Un caso nuevo, ahora sin el juego.", "acierto": "Coincide con la regla.", "error": "Comparemos tu cuenta con la escena y prueba otro.", "nose": "Honesto. Aquí está el camino; prueba otro.", "fin": "Unidad terminada. Las reglas quedan en el resumen.", "llegada": "Hola. Hay cosas que mover hoy. Tú eliges cuál.", "regreso": "Lo último fue {lugar}. ¿Seguimos ahí?", "despedida": "Lo de hoy quedó guardado. El universo puede esperar a mañana.", "ayuda2": "Dos intentos no salieron. Volvamos a mirar qué supuesto falla."} },
    'quimica': { id: 'bruna', nombre: 'Bruna', animal: 'castora', voces: {"prediccion": "Antes de mirar, anota tu predicción.", "coincide": "Coincide. Ahora veamos qué lo justifica.", "noCoincide": "No coincide. Revisemos el inventario.", "mira": "Revisemos el proceso paso a paso.", "regla": "Esta es la regla. Anota cuándo se cumple.", "ahora": "Caso nuevo. Primero el inventario.", "acierto": "Comprobado.", "error": "Revisemos cada elemento en la solución y prueba otro.", "nose": "Veamos la solución. Después, otro caso.", "fin": "Unidad completa. Todo queda en el resumen.", "llegada": "Hola. Elige la mesa; el inventario lo vemos juntos.", "regreso": "Volviste. Lo último fue {lugar}.", "despedida": "Lo de hoy quedó guardado. Hasta la próxima.", "ayuda2": "Dos intentos sin salir. Revisemos el inventario elemento por elemento."} },
    'geometria': { id: 'neri', nombre: 'Neri', animal: 'nutria', voces: {"prediccion": "Antes de medir, ¿qué crees que pasa?", "coincide": "Coincide. Ahora, por qué pasa siempre.", "noCoincide": "No coincide. Midamos de nuevo la figura.", "mira": "Sigue la construcción paso a paso.", "regla": "Esta es la propiedad. ¿Qué hipótesis la sostiene?", "ahora": "Otra figura. Ubica primero los datos.", "acierto": "La medida lo confirma.", "error": "Contrastemos el dibujo con la medida y prueba otra.", "nose": "Construyámoslo paso a paso. Luego prueba otra figura.", "fin": "Unidad terminada. Las propiedades quedan en el resumen.", "llegada": "Hola. Mueve una figura y mira qué se conserva.", "regreso": "Lo último fue {lugar}. ¿Le damos otra vuelta?", "despedida": "Lo de hoy quedó guardado. Mañana seguimos midiendo.", "ayuda2": "Dos veces no salió. Construyámoslo de nuevo, paso a paso."} },
    'trigonometria': { id: 'mara', nombre: 'Mara', animal: 'coneja', voces: {"prediccion": "Antes de ver, ¿qué esperas?", "coincide": "Coincide. Veamos de dónde sale.", "noCoincide": "No coincide. Recuperemos la convención.", "mira": "Paso a paso, conservando origen y sentido.", "regla": "Esta es la convención. Fíjate cuándo vale.", "ahora": "Un caso nuevo. Ubica primero el ángulo.", "acierto": "Correcto, con su signo.", "error": "Revisemos la convención en la solución y prueba otro.", "nose": "Veamos la solución con calma y prueba otro.", "fin": "Unidad terminada. El resumen guarda las convenciones.", "llegada": "Hola. Fijemos el origen y empecemos.", "regreso": "Lo último fue {lugar}. Sigamos desde ahí.", "despedida": "Lo de hoy quedó guardado. Descansa; los ángulos no se mueven.", "ayuda2": "Dos intentos no salieron. Recuperemos la convención con calma."} },
    'razonamiento-matematico': { id: 'faro', nombre: 'Faro', animal: 'zorro', voces: {"prediccion": "¿Qué apuestas antes de ver?", "coincide": "Coincide. ¿Vale en todos los casos? Veamos.", "noCoincide": "No coincide. Busquemos el caso que lo explica.", "mira": "Veamos la jugada paso a paso.", "regla": "Esta es la regla. ¿Hay algún caso que la rompa?", "ahora": "Otro reto. Prueba las posibilidades.", "acierto": "Bien justificado.", "error": "Busquemos el contraejemplo en la solución y prueba otro.", "nose": "Vale decirlo. Mira la jugada y prueba otro.", "fin": "Unidad terminada. Las reglas quedan en el resumen.", "llegada": "Hola. ¿Un reto o un juego libre?", "regreso": "Lo último fue {lugar}. ¿Otra jugada?", "despedida": "Lo de hoy quedó guardado. Mañana hay más.", "ayuda2": "Dos intentos fallidos también enseñan. Busquemos el caso que lo explica."} },
    'razonamiento-verbal': { id: 'iris', nombre: 'Iris', animal: 'lechuza', voces: {"prediccion": "Elige antes de ver la respuesta: después lo comprobamos en el texto.", "coincide": "Se sostiene. Veamos qué frase lo permite.", "noCoincide": "Esa lectura no se sostiene. Volvamos a la frase.", "mira": "Volvamos al texto, paso a paso.", "regla": "Esta es la regla. Vuelve a ella cuando dudes con un texto.", "ahora": "Otro texto. Lee primero lo que dice.", "acierto": "Bien sustentado en el texto.", "error": "Volvamos a las palabras exactas en la solución.", "nose": "Veamos qué dice el texto. Luego prueba otro.", "fin": "Unidad terminada. Las reglas quedan en el resumen.", "llegada": "Hola. Elige un texto o un juego con palabras.", "regreso": "Lo último fue {lugar}.", "despedida": "Lo de hoy quedó guardado. El texto seguirá aquí.", "ayuda2": "Dos lecturas no se sostuvieron. Volvamos a la frase exacta."} },
  };

  // Qué expresión (E0–E9 de la guía) y qué pose (contrato de nucleo/mascota.js) toma el personaje en cada momento.
  // La expresión viaja como data-expresion para el futuro .riv; la pose es la que entiende el respaldo SVG de hoy.
  const ACTUACION = {
    llegada: { expresion: 'E0', pose: 'saluda' },
    consigna: { expresion: 'E1', pose: 'señala' },
    juego: { expresion: 'E0', pose: 'reposo' },
    prediccion: { expresion: 'E3', pose: 'espera' },
    coincide: { expresion: 'E7', pose: 'celebra' },
    'no-coincide': { expresion: 'E5', pose: 'acompaña' },
    mira: { expresion: 'E4', pose: 'reposo' },
    regla: { expresion: 'E6', pose: 'reposo' },
    'ahora-tu': { expresion: 'E1', pose: 'reposo' },
    lee: { expresion: 'E4', pose: 'reposo' },
    resuelve: { expresion: 'E4', pose: 'reposo' },
    acierto: { expresion: 'E7', pose: 'celebra' },
    error: { expresion: 'E8', pose: 'acompaña' },
    ayuda: { expresion: 'E8', pose: 'ayuda' },
    fin: { expresion: 'E6', pose: 'hito' },
    pausa: { expresion: 'E9', pose: 'reposo' },
  };

  // Topes de palabras (docs/escena-viva.md, regla 1, ampliada para la teoría en docs/teoria.md).
  const PRESUPUESTO = {
    titulo: 6, consigna: 25, voz: 16, pregunta: 40, opcion: 14, siFuera: 20,
    paso: 14, regla: 30, condicion: 22, historia: 70, enunciado: 40, solucion: 20, lectura: 12,
    // Fase 2 (decisión de Gerson, 15 nov): «Lee» (tarjetas para leer) y «Así se resuelve» (ejercicio resuelto paso a paso).
    tarjeta: 45, resuelto: 30, respuesta: 14,
    // Contrato «se entiende sin profesor» (16 nov): qué debe poder decir el alumno y qué es cada símbolo.
    aprendizaje: 25, leyenda: 8,
    // Datos y fórmulas de un ejercicio (Gerson, 16 nov: «todos los datos deben darse, incluso las fórmulas»), una por línea.
    dato: 22,
    // Resumen (16 nov): qué va a hacer el alumno en el juego, dicho antes de jugar.
    actividad: 16,
  };
  // Los siete momentos posibles, en orden. «Lee» y «Así se resuelve» van solo si la idea los trae (momentosDe).
  const MOMENTOS = ['lee', 'juega', 'predice', 'mira', 'regla', 'resuelve', 'ahora-tu'];
  const momentosDe = idea => MOMENTOS.filter(m => (m !== 'lee' || (idea && idea.lee)) && (m !== 'resuelve' || (idea && idea.resuelve)));
  // Los pasos de un ejercicio resuelto: cómo se ataca un problema, en este orden (docs/teoria.md, 4e).
  const PASOS_RESUELTO = {
    pide: '¿Qué me piden?', datos: '¿Qué tengo?', regla: '¿Qué regla uso?', cuentas: 'Las cuentas', sentido: '¿Tiene sentido?',
    // Donde no hay cuentas (razonamiento verbal, algunas ideas de lógica o de clasificación), «aplica» reemplaza a «cuentas».
    aplica: 'Lo aplico',
  };
  // Texto plano de un texto con partes de ecuación (variables, subíndices, fracciones), para contar y revisar.
  const plano = x => Ecuacion.texto(x === undefined || x === null ? '' : x);
  const palabras = x => Kit.palabras(plano(x));

  // ---------- Registro (navegador) ----------
  // Los números que se leen en un texto, normalizados para compararlos: «× 4» → 4, «6,5 m» → 6.5, «10 000» → 10000,
  // «1/3» y «1 / 3» → 1/3. El signo no cuenta (−3 y 3 son el mismo número escrito). Un número pegado detrás de una letra
  // («P1», «x2») es un nombre, no un valor, y no cuenta. Los superíndices (m²) no son cifras ASCII y tampoco.
  function numerosDe(txt, acc = new Set()) {
    const norma = x => String(Number(x.replace(',', '.')));
    const s = String(txt || '').replace(/(\d)[   ](?=\d{3}(?!\d))/g, '$1');
    for (const m of s.matchAll(/(?<![A-Za-zÀ-ÿα-ωΑ-Ω_\d.,])(\d+(?:[.,]\d+)?)(?:\s*\/\s*(\d+(?:[.,]\d+)?))?/g)) acc.add(m[2] ? `${norma(m[1])}/${norma(m[2])}` : norma(m[1]));
    return acc;
  }
  // El texto que se lee en un SVG (sus <text>), sin etiquetas.
  function textoSVG(svg) {
    return (String(svg).match(/<text\b[\s\S]*?<\/text>/g) || []).map(t => t.replace(/<[^>]+>/g, ' ')).join(' · ')
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).replace(/&amp;/g, '&');
  }
  const unidades = {};
  // El validador completo (retos en toda la grilla, glosario, semillas de «Ahora tú») corre en las pruebas (npm test):
  // en el celular del alumno no se repite, porque tardaba segundos al abrir cada unidad (15 nov). En la computadora de
  // desarrollo (localhost) o con ?revisar en la dirección, sí corre, pero después de mostrar la unidad.
  const revisarAqui = () => { try { const l = root.location; return !!l && (/^(localhost|127\.0\.0\.1)$/.test(l.hostname) || /[?&]revisar\b/.test(l.search)); } catch (e) { return false; } };
  function unidad(def) {
    if (revisarAqui()) setTimeout(() => {
      const p = problemas(def);
      if (p.length && root.console) root.console.warn(`Teoría ${def && def.unidad}:`, p);
    }, 1500);
    unidades[def.unidad] = def;
    if (root && typeof root.dispatchEvent === 'function' && typeof root.CustomEvent === 'function') {
      root.dispatchEvent(new root.CustomEvent('teoria:unidad', { detail: def.unidad }));
    }
    return def;
  }

  // ---------- Validación (Node y navegador) ----------
  // problemas(def, { temas, semillas }) → lista de textos; vacía si la unidad cumple el formato.
  //   temas: los temas de la unidad en el catálogo; si se dan, cada uno tiene que estar en alguna idea.
  function problemas(def, o = {}) {
    const out = [];
    const mal = (donde, que) => out.push(`${donde}: ${que}`);
    const tope = (donde, campo, texto) => {
      const n = palabras(texto);
      if (n > PRESUPUESTO[campo]) mal(donde, `${campo} de ${n} palabras (tope ${PRESUPUESTO[campo]})`);
    };
    const ecuacion = (donde, e) => { try { Ecuacion.revisar(e, donde); } catch (err) { out.push(err.message); } };
    // Datos de un ejercicio (punto 13 del contrato, docs/plan-calidad.md): las equivalencias, los valores de academia
    // (cos 37° = 4/5) y las fórmulas van en `datos`, una por línea, y se ven en un recuadro aparte. En el enunciado no:
    // así se audita de un vistazo qué se le da al alumno, y el enunciado no se alarga.
    const datos = (donde, enun, ds, exige) => {
      if (/\bDatos?\s*:/.test(plano(enun))) mal(donde, 'el «Dato:» va en el campo datos, no en el enunciado');
      if (ds === undefined) { if (exige && def.calidad >= 2) mal(donde, 'sin datos: en calidad 2 todo ejercicio da sus datos (contrato, punto 13)'); return; }
      if (!Array.isArray(ds) || ds.length < 1 || ds.length > 6) { mal(donde, 'datos: de 1 a 6 líneas'); return; }
      ds.forEach((x, i) => { if (!x || (Array.isArray(x) && !x.length)) mal(`${donde} dato ${i + 1}`, 'vacío'); else { tope(`${donde} dato ${i + 1}`, 'dato', x); ecuacion(`${donde} dato ${i + 1}`, Array.isArray(x) ? x : [x]); } });
    };
    if (!def || typeof def !== 'object') return ['la unidad no es un objeto'];
    if (!/^[a-z-]+\.[a-z0-9-]+$/.test(def.unidad || '')) mal('unidad', `id inválido «${def.unidad}»`);
    if (!/^\d+\.\d+\.\d+$/.test(def.version || '')) mal(def.unidad, 'falta version x.y.z');
    if (!Array.isArray(def.ideas) || def.ideas.length < 1) { mal(def.unidad, 'sin ideas'); return out; }
    if (def.ideas.length > 6) mal(def.unidad, `${def.ideas.length} ideas: el tope es 6 (divide la unidad en lecciones más chicas)`);
    if (def.historia) {
      if (!def.historia.texto) mal('historia', 'sin texto');
      else tope('historia', 'historia', def.historia.texto);
      if (def.historia.pregunta) tope('historia', 'voz', def.historia.pregunta);
    }
    // Dibuja con la pieza dada (o la de la idea) y revisa que el SVG sea sano y la pieza pura.
    function dibujaCon(donde, dib, id) {
      const P = id && Kit.piezas[id];
      if (!id) { mal(donde, 'sin pieza'); return null; }
      if (!P) { mal(donde, `pieza «${id}» no registrada (¿falta en requiere?)`); return null; }
      if (!dib) { mal(donde, 'sin dibujo'); return null; }
      try {
        const svg = P.dibujar(dib.datos, dib.estado || {});
        if (typeof svg !== 'string' || !svg.includes('<svg')) { mal(donde, 'la pieza no devolvió un SVG'); return null; }
        if (/NaN|undefined|Infinity/.test(svg)) mal(donde, 'el SVG muestra NaN, undefined o Infinity');
        if (svg !== P.dibujar(dib.datos, dib.estado || {})) mal(donde, 'la pieza no es pura: el mismo estado dio otro SVG');
        const alt = P.alt(dib.datos);
        if (!alt || alt.length < 15) mal(donde, 'texto alternativo vacío o muy corto');
        return svg;
      } catch (err) { mal(donde, `la pieza falló: ${err.message}`); return null; }
    }
    // Juego (de una idea o una mesa del laboratorio): controles, dibujo en el inicio y los extremos, lectura y arrastres.
    function revisarJuego(d, j, piezaPorDefecto, conMinimo) {
      if (!j.consigna) mal(d, 'sin consigna'); else tope(d, 'consigna', j.consigna);
      if (j.voz) tope(d, 'voz', j.voz);
      const ctr = j.controles || [];
      if (!ctr.length && typeof j.montar !== 'function') mal(d, 'sin controles');
      for (const c of ctr) {
        if (!c.id || !c.etiqueta) mal(d, 'control sin id o etiqueta');
        if (c.opciones) { if (!(c.opciones.length >= 2)) mal(d, `control ${c.id}: opciones de 2 o más`); continue; }
        if (!(c.max > c.min) || !(c.paso > 0)) mal(d, `control ${c.id}: min, max y paso`);
        else if (c.inicio < c.min || c.inicio > c.max) mal(d, `control ${c.id}: inicio fuera de rango`);
        else if (Math.abs(ajustar(c, c.inicio) - c.inicio) > 1e-9) mal(d, `control ${c.id}: inicio ${c.inicio} no cae en la grilla min + k·paso`);
        if (c.color && !Ecuacion.COLORES.includes(c.color)) mal(d, `control ${c.id}: color ${c.color}`);
      }
      if (typeof j.dibujo !== 'function') { mal(d, 'dibujo(valores) debe ser una función'); return; }
      const base = inicio(j);
      const casos = [base];
      for (const c of ctr) {
        if (c.opciones) for (const op of c.opciones) casos.push(Object.assign({}, base, { [c.id]: op.valor }));
        else casos.push(Object.assign({}, base, { [c.id]: c.min }), Object.assign({}, base, { [c.id]: c.max }));
      }
      for (const v of casos) {
        dibujaCon(`${d} ${JSON.stringify(v)}`, j.dibujo(v), j.pieza || piezaPorDefecto);
        if (typeof j.lectura === 'function') {
          const l = j.lectura(v);
          ecuacion(`${d} lectura`, l);
          tope(d, 'lectura', l);
          if (/NaN|undefined|Infinity/.test(Ecuacion.texto(l))) mal(`${d} lectura`, 'muestra NaN o undefined');
        }
      }
      // Arrastres: la manija cae dentro de la figura y moverla da valores de controles que existen.
      for (const ar of j.arrastres || []) {
        const da = `${d} arrastre ${ar && ar.id}`;
        if (!ar || !/^[a-z0-9-]+$/i.test(ar.id || '') || typeof ar.donde !== 'function' || typeof ar.mover !== 'function') { mal(da, 'necesita id, donde(valores) y mover(punto, valores)'); continue; }
        if (!ar.etiqueta) mal(da, 'sin etiqueta (la lee el lector de pantalla)');
        if (ar.color && !Ecuacion.COLORES.includes(ar.color)) mal(da, `color ${ar.color}`);
        for (const v of casos) {
          const svg = dibujaCon(`${da} ${JSON.stringify(v)}`, j.dibujo(v), j.pieza || piezaPorDefecto);
          const caja = svg && /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(svg);
          let pt;
          try { pt = ar.donde(v); } catch (err) { mal(da, `donde falló: ${err.message}`); break; }
          if (!pt || !Number.isFinite(pt.x) || !Number.isFinite(pt.y)) { mal(da, `donde(${JSON.stringify(v)}) no da { x, y } finitos`); break; }
          if (caja && (pt.x < -1 || pt.y < -1 || pt.x > +caja[1] + 1 || pt.y > +caja[2] + 1)) mal(da, `la manija cae fuera de la figura en ${JSON.stringify(v)}`);
          for (const [dx, dy] of [[0, 0], [24, 0], [-24, 0], [0, 24], [0, -24]]) {
            let cambio;
            try { cambio = ar.mover({ x: pt.x + dx, y: pt.y + dy }, Object.assign({}, v)); } catch (err) { mal(da, `mover falló: ${err.message}`); break; }
            if (!cambio || typeof cambio !== 'object') { mal(da, 'mover debe devolver un objeto { control: valor }'); break; }
            for (const [k, val] of Object.entries(cambio)) {
              const c = ctr.find(x => x.id === k);
              if (!c) mal(da, `mover cambia «${k}», que no es un control (todo arrastre necesita su alternativa con − y +)`);
              else if (!c.opciones && !Number.isFinite(val)) mal(da, `mover da ${k} = ${val}`);
            }
          }
          // Si la manija no cae en su sitio, el dedo la «suelta»: mover sobre su propio punto no debe cambiar nada.
          const quieto = ar.mover({ x: pt.x, y: pt.y }, Object.assign({}, v)) || {};
          for (const [k, val] of Object.entries(quieto)) {
            const c = ctr.find(x => x.id === k);
            if (c && !c.opciones && Math.abs(ajustar(c, val) - v[k]) > 1e-9) mal(da, `en ${JSON.stringify(v)} la manija no está donde dice su valor (${k}: ${v[k]} → ${ajustar(c, val)})`);
          }
        }
      }
      if (conMinimo && !(j.minimo >= 1)) mal(d, 'minimo: cuántos casos distintos prueba el alumno antes de seguir (1 o más)');
    }

    function revisarContrato(d, idea, exige) {
      const j = idea.juega;
      // pregunta: la que responde la idea; la muestra el Resumen (16 nov) sin adelantar la regla.
      if (idea.pregunta !== undefined) { tope(d, 'voz', idea.pregunta); if (!/\?\s*$/.test(idea.pregunta)) mal(d, 'pregunta: debe terminar en «?»'); }
      else if (exige) mal(d, 'sin pregunta: la que responde la idea, para el Resumen');
      if (idea.aprendizaje !== undefined) tope(d, 'aprendizaje', idea.aprendizaje);
      else if (exige) mal(d, 'sin aprendizaje: la frase que el alumno debe poder decir al terminar el juego');
      // actividad: qué va a hacer en el juego, sin adelantar lo que va a descubrir; la muestra el Resumen.
      if (idea.actividad !== undefined) tope(d, 'actividad', idea.actividad);
      else if (exige) mal(d, 'sin actividad: qué vas a hacer en el juego, para el Resumen');
      if (j.mision !== undefined) {
        const m = j.mision;
        // La misión se revisa como un reto del laboratorio: el motor la comprueba y alguien la puede lograr.
        revisarInvitacion(`${d} misión`, j, Object.assign({}, m, { texto: m.texto }));
        if (m.logrado && m.logrado.length >= 2) mal(`${d} misión`, 'logrado(valores) mira solo el caso actual');
      } else if (exige) mal(d, 'sin misión en el juego: una meta que el motor comprueba («Haz que…»)');
      // resumen: los valores del juego con que el Resumen dibuja su figura (si no, el inicio del juego).
      if (j.resumen !== undefined) {
        const ids = new Set((j.controles || []).map(c => c.id));
        if (!j.resumen || typeof j.resumen !== 'object' || Object.keys(j.resumen).some(x => !ids.has(x))) mal(d, 'resumen: valores de los controles del juego ({ id: valor })');
      }
      if (j.leyenda !== undefined) {
        if (!Array.isArray(j.leyenda) || !j.leyenda.length) mal(d, 'leyenda: lista de { s, t } (símbolo y qué es)');
        else for (const x of j.leyenda) {
          if (!x || !x.s || !x.t) { mal(d, 'leyenda: cada símbolo con s y t'); continue; }
          ecuacion(`${d} leyenda`, [x.s]);
          tope(d, 'leyenda', x.t);
        }
        if (j.mision && typeof j.mision.logrado === 'function') leyendaSinRespuesta(d, idea);
      } else if (exige) mal(d, 'sin leyenda: cada símbolo de la figura y la lectura dicho en palabras');
    }
    // La leyenda de Juega no muestra la respuesta de la misión (auditoría de Exponentes y radicales, M1, y Numeración, M8;
    // 18 nov). La leyenda es fija y se lee antes de jugar: si escribe un número que solo se ve con la misión cumplida
    // («× 4», «64 m²»), le regala la respuesta al alumno y además contradice la figura. Se juntan:
    //   1. los números de la leyenda: todos los del símbolo (s) y, de la descripción (t), solo los de una cuenta escrita
    //      (tras =, ×, ·, √ o ∛: «√100», «= 10»). Así «cada doblez multiplica las capas por 2» no cuenta como respuesta
    //      aunque la misión se cumpla con n = 2 (falso positivo de la primera versión, Exponentes y radicales, idea 1);
    //   2. los que se ven al abrir el juego: lectura y texto del dibujo en el inicio, consigna, misión, etiquetas de los
    //      controles y su valor inicial, y en un control de opciones el texto de todas (se ven como botones; 18 nov);
    //   3. los de la lectura y el texto del dibujo en los casos de la grilla que cumplen la misión (o su testigo).
    // Falla si un número está en 1 y en 3 pero no en 2.
    function leyendaSinRespuesta(d, idea) {
      const j = idea.juega, ctr = j.controles || [], P = Kit.piezas[j.pieza || idea.pieza];
      const vistos = (v, acc) => {
        try { if (typeof j.lectura === 'function') numerosDe(plano(j.lectura(v)), acc); } catch (err) { /* lo revisa revisarJuego */ }
        try {
          if (P && typeof j.dibujo === 'function') { const dib = j.dibujo(v); if (dib) numerosDe(textoSVG(P.dibujar(dib.datos, dib.estado || {})), acc); }
        } catch (err) { /* lo revisa revisarJuego */ }
        return acc;
      };
      const ley = new Set();
      for (const x of j.leyenda) if (x && x.s && x.t) {
        numerosDe(plano([x.s]), ley);
        for (const m of plano(x.t).matchAll(/[=×·√∛]\s*(\d[\d.,]*(?:\s*\/\s*\d[\d.,]*)?)/g)) numerosDe(m[1], ley);
      }
      if (!ley.size) return;
      const v0 = inicio(j), alAbrir = vistos(v0, new Set());
      numerosDe(plano(j.consigna), alAbrir); numerosDe(plano(j.mision.texto), alAbrir);
      for (const c of ctr) {
        numerosDe(plano(c.etiqueta), alAbrir);
        if (c.opciones) c.opciones.forEach(o => numerosDe(plano(o.texto), alAbrir));
        else numerosDe(`${Kit.formatear(v0[c.id], c.decimales === undefined ? 2 : c.decimales)}${c.unidad ? ` ${c.unidad}` : ''}`, alAbrir);
      }
      const ok = v => { try { return j.mision.logrado(v) === true; } catch (err) { return false; } };
      const t = j.mision.testigo;
      const cumplen = Array.isArray(t) && t.length ? [t[t.length - 1]] : muestra(grilla(ctr).filter(ok), 400);
      const alCumplir = new Set();
      for (const v of cumplen) vistos(v, alCumplir);
      const regalados = [...ley].filter(x => alCumplir.has(x) && !alAbrir.has(x));
      if (regalados.length) mal(`${d} leyenda`, `muestra ${regalados.map(x => `«${x}»`).join(', ')}, que solo se ve con la misión cumplida (al abrir el juego no está): la leyenda no da la respuesta; dila con palabras o con lo que se ve al empezar`);
    }
    // Una invitación del laboratorio: { texto, logrado, bien?, testigo? }. logrado(valores, guardados, mesa) → true solo si
    // se cumplió. Se busca un caso que la cumpla en la grilla de los controles (toda, o una muestra fija si es muy grande);
    // y no debe estar cumplida ya en el inicio. Si `logrado` pide dos argumentos o más, mira también los casos guardados:
    // se prueban pares de una muestra repartida por toda la grilla (ronda 3: antes, solo los primeros 160 casos).
    // `testigo`: casos que la cumplen, para las grillas enormes o las coincidencias raras; el último es el actual y todos
    // cuentan como guardados. El validador comprueba que el testigo de verdad la cumpla con valores de la grilla.
    function revisarInvitacion(di, mesa, inv) {
      if (typeof inv === 'string') { mal(di, `«${inv}» sin comprobación: escríbela como { texto, logrado(valores) }`); return; }
      if (!inv || !String(inv.texto || '').trim()) { mal(di, 'sin texto'); return; }
      tope(di, 'voz', inv.texto);
      if (inv.bien !== undefined) tope(di, 'voz', inv.bien);
      if (inv.pista !== undefined) tope(di, 'voz', inv.pista);
      if (typeof inv.logrado !== 'function') { mal(di, 'sin logrado(valores): el motor tiene que poder comprobarla'); return; }
      const ctr = mesa.controles || [];
      let fallo = false;
      const ok = (v, g) => { try { return inv.logrado(v, g, mesa) === true; } catch (err) { if (!fallo) mal(di, `logrado falló: ${err.message}`); fallo = true; return null; } };
      if (ok(inicio(mesa), [])) mal(di, 'ya está cumplida al abrir la mesa: el reto tiene que pedir mover algo');
      if (fallo) return;
      if (inv.testigo !== undefined) {
        const t = Array.isArray(inv.testigo) ? inv.testigo : null;
        if (!t || !t.length || t.length > 6) { mal(di, 'testigo: lista de 1 a 6 casos { control: valor }'); return; }
        for (const v of t) for (const c of ctr) if (!v || v[c.id] === undefined || ajustar(c, v[c.id]) !== v[c.id]) { mal(di, `testigo: ${JSON.stringify(v)} no es un caso de la grilla (${c.id})`); return; }
        if (!ok(t[t.length - 1], t)) mal(di, `el testigo no la cumple («${inv.texto}»)`);
        return;
      }
      const casos = grilla(ctr);
      let alcanza = false;
      if (inv.logrado.length >= 2) {
        // Pares: una muestra de hasta 500 casos repartidos por toda la grilla (siempre la misma), todos contra todos.
        const m = muestra(casos, 500);
        for (const b of m) { for (const a of m) { const r = ok(b, [a, b]); if (r === null) return; if (r) { alcanza = true; break; } } if (alcanza) break; }
      } else for (const v of casos) { const r = ok(v, []); if (r === null) return; if (r) { alcanza = true; break; } }
      if (!alcanza) mal(di, `nadie la puede lograr con los controles de la mesa («${inv.texto}»); si es una coincidencia rara, da un testigo`);
    }
    function muestra(casos, n) {
      if (casos.length <= n) return casos;
      let a = 987654321; const r = () => { a = (Math.imul(a, 1103515245) + 12345) >>> 0; return a / 4294967296; };
      return Array.from({ length: n }, () => casos[Math.floor(r() * casos.length)]);
    }
    // Con calidad: 2, cada término propio del glosario trae 3 ejemplos o más (Gerson, 16 nov: «más ejemplos por término»).
    if (def.calidad >= 2) for (const g of def.glosario || []) {
      const n = Array.isArray(g.ejemplos) ? g.ejemplos.length : g.ejemplo ? 1 : 0;
      if (n < 3) mal(`glosario «${g.termino}»`, `${n} ejemplo(s): con calidad 2 van 3 o más`);
    }
    // Con calidad: 2, cada idea estrena de 2 a 4 términos con su aproximación (`simple`), que el Resumen muestra como
    // «Palabras de esta idea» (Gerson, 16 nov: el Resumen «se siente que cae en nada» sin definiciones).
    if (def.calidad >= 2 && Glosario && Array.isArray(def.ideas)) Glosario.porIdea(def).forEach((es, k) => {
      const n = es.filter(e => e.simple).length, i = def.ideas[k];
      if (n < 2 || n > 4) mal(`idea «${i && i.id}»`, `${n} palabra(s) con simple en el Resumen: con calidad 2 van de 2 a 4 (términos que la idea estrena)`);
    });
    // A qué idea pertenece cada mesa (Gerson, 16 nov): el laboratorio se agrupa por idea. laboratorioIdeas = { mesa: [ideas] }.
    if (def.laboratorio !== undefined) {
      const L = def.laboratorioIdeas, idsIdeas = new Set((def.ideas || []).map(i => i && i.id));
      const idsMesas = new Set((Array.isArray(def.laboratorio) ? def.laboratorio : []).map(m => m && m.id));
      if (!L || typeof L !== 'object') mal(def.unidad, 'laboratorioIdeas: a qué idea pertenece cada mesa ({ mesa: [ideas] })');
      else {
        // Lista vacía: la mesa no practica ninguna idea de la unidad (va en «Más mesas del tema»).
        for (const m of idsMesas) if (!Array.isArray(L[m])) mal(def.unidad, `laboratorioIdeas: la mesa «${m}» no dice su idea`);
        for (const [m, is] of Object.entries(L)) {
          if (!idsMesas.has(m)) mal(def.unidad, `laboratorioIdeas: «${m}» no es una mesa`);
          for (const i of Array.isArray(is) ? is : []) if (!idsIdeas.has(i)) mal(def.unidad, `laboratorioIdeas: «${i}» no es una idea`);
        }
      }
    }
    // Laboratorio: mesas de juego libre, sin preguntas. Si la unidad no trae, el lector usa el juego de cada idea.
    if (def.laboratorio !== undefined) {
      if (!Array.isArray(def.laboratorio) || !def.laboratorio.length || def.laboratorio.length > 5) mal(def.unidad, 'laboratorio: de 1 a 5 mesas (una puede ser la mesa 3D)');
      const mids = new Set();
      for (const [k, mesa] of (Array.isArray(def.laboratorio) ? def.laboratorio : []).entries()) {
        const dm = `laboratorio ${k + 1} (${mesa && mesa.id})`;
        if (!mesa || !/^[a-z0-9-]+$/.test(mesa.id || '') || mids.has(mesa.id)) { mal(dm, 'id inválido o repetido'); continue; }
        mids.add(mesa.id);
        if (!mesa.titulo) mal(dm, 'sin título'); else tope(dm, 'titulo', mesa.titulo);
        if (!mesa.pieza) mal(dm, 'sin pieza');
        revisarJuego(dm, mesa, mesa.pieza, false);
        // Invitaciones juguetonas (opcionales): retos libres con los controles reales de la mesa. Cada una trae
        // `logrado(valores, guardados)`, que el motor evalúa: el lector dice «¡Lo lograste!» solo si de verdad pasó.
        if (mesa.invitaciones !== undefined) {
          if (!Array.isArray(mesa.invitaciones) || !mesa.invitaciones.length || mesa.invitaciones.length > 6) mal(dm, 'invitaciones: lista de 1 a 6');
          else for (const [ki, inv] of mesa.invitaciones.entries()) revisarInvitacion(`${dm} invitación ${ki + 1}`, mesa, inv);
        }
      }
    }

    const ids = new Set();
    for (const [k, idea] of def.ideas.entries()) {
      const d = `idea ${k + 1} (${idea && idea.id})`;
      if (!idea || !/^[a-z0-9-]+$/.test(idea.id || '')) { mal(d, 'id inválido'); continue; }
      if (ids.has(idea.id)) mal(d, 'id repetido');
      ids.add(idea.id);
      if (!idea.titulo) mal(d, 'sin título'); else tope(d, 'titulo', idea.titulo);
      if (!Array.isArray(idea.temas) || !idea.temas.length) mal(d, 'sin temas del catálogo');
      const pieza = nombre => {
        const id = nombre || idea.pieza;
        if (!id) { mal(d, 'sin pieza'); return null; }
        const P = Kit.piezas[id];
        if (!P) { mal(d, `pieza «${id}» no registrada (¿falta en requiere?)`); return null; }
        return P;
      };
      const dibuja = (donde, dib, nombre) => {
        const P = pieza(nombre);
        if (!P || !dib) { if (!dib) mal(donde, 'sin dibujo'); return; }
        try {
          const svg = P.dibujar(dib.datos, dib.estado || {});
          if (typeof svg !== 'string' || !svg.includes('<svg')) mal(donde, 'la pieza no devolvió un SVG');
          else if (/NaN|undefined|Infinity/.test(svg)) mal(donde, 'el SVG muestra NaN, undefined o Infinity');
          if (svg !== P.dibujar(dib.datos, dib.estado || {})) mal(donde, 'la pieza no es pura: el mismo estado dio otro SVG');
          const alt = P.alt(dib.datos);
          if (!alt || alt.length < 15) mal(donde, 'texto alternativo vacío o muy corto');
        } catch (err) { mal(donde, `la pieza falló: ${err.message}`); }
      };
      const opciones = (donde, ops) => {
        if (!Array.isArray(ops) || ops.length < 2 || ops.length > 5) { mal(donde, 'de 2 a 5 opciones'); return; }
        const buenas = ops.filter(x => x.correcta);
        if (buenas.length !== 1) mal(donde, `${buenas.length} opciones correctas (debe haber una)`);
        const vistos = new Set();
        for (const x of ops) {
          if (!x.id || vistos.has(x.id)) mal(donde, `opción sin id o repetida (${x.id})`);
          vistos.add(x.id);
          const txt = plano(x.texto);
          if (!txt.trim()) mal(donde, 'opción vacía');
          if (vistos.size && ops.filter(y => plano(y.texto) === txt).length > 1) mal(donde, `opción repetida «${txt}»`);
          tope(donde, 'opcion', x.texto);
          if (!x.correcta && !x.siFuera) mal(donde, `la opción ${x.id} no trae siFuera («sería cierto si…»)`);
          if (x.siFuera) tope(donde, 'siFuera', x.siFuera);
          if (/NaN|undefined|null|Infinity/.test(txt)) mal(donde, `opción con ${txt}`);
        }
      };

      // 0. Lee (opcional): de 2 a 4 tarjetas cortas para leer antes de jugar. No pregunta nada y no bloquea.
      if (idea.lee !== undefined) {
        const L = idea.lee, ts = L && L.tarjetas;
        if (!Array.isArray(ts) || ts.length < 2 || ts.length > 4) mal(d, 'lee: de 2 a 4 tarjetas');
        else for (const [i, t] of ts.entries()) {
          const dd = `${d} lee tarjeta ${i + 1}`;
          if (!t || !t.texto) { mal(dd, 'sin texto'); continue; }
          if (t.titulo) tope(dd, 'titulo', t.titulo);
          tope(dd, 'tarjeta', t.texto);
          if (t.ecuacion) ecuacion(dd, t.ecuacion);
          if (t.dibujo) dibuja(dd, t.dibujo, t.pieza);
        }
      }

      // 1. Juega
      if (!idea.juega) mal(d, 'sin juega (regla 3: se juega antes de cualquier pregunta)');
      else revisarJuego(`${d} juega`, idea.juega, idea.pieza, true);
      // Contrato «se entiende sin profesor» (docs/plan-calidad.md, 16 nov): la misión del juego, la leyenda de símbolos y
      // lo que el alumno debe poder decir al terminar. Opcionales mientras la unidad no esté rehecha; obligatorios si la
      // unidad declara calidad: 2 (la unidad ya pasó por el contrato).
      if (idea.juega) revisarContrato(d, idea, def.calidad >= 2);

      // 2. Predice
      const p = idea.predice;
      if (!p) mal(d, 'sin predice');
      else {
        if (!p.pregunta) mal(d, 'predice sin pregunta'); else tope(`${d} predice`, 'pregunta', p.pregunta);
        // Predice lleva solo la información necesaria (equivalencias, valores), nunca la fórmula: se predice antes de
        // aprender la regla (Gerson, 17 nov: «no me debían dar toda la ecuación, solo información necesaria»).
        datos(`${d} predice`, p.pregunta, p.datos);
        if (Array.isArray(p.datos) && p.datos.some(x => /[A-Za-zθρ]\s*[²³]?\s*=\s*[^0-9\s−-]/.test(plano(x)) && !/^\s*\d/.test(plano(x)))) mal(`${d} predice`, 'datos de una predicción: equivalencias y valores, no fórmulas');
        opciones(`${d} predice`, p.opciones);
        // Orden fijo: solo si las letras se ven en la figura; entonces la correcta no puede ir siempre primera.
        if (p.orden !== undefined && p.orden !== 'fijo') mal(`${d} predice`, "orden: solo 'fijo'");
        if (p.orden === 'fijo' && Array.isArray(p.opciones) && p.opciones[0] && p.opciones[0].correcta) mal(`${d} predice`, 'orden fijo con la correcta primera: muévela');
        dibuja(`${d} predice`, p.dibujo, p.pieza);
        dibuja(`${d} predice (revelar)`, p.revelar, p.pieza);
        if (p.voz) tope(`${d} predice`, 'voz', p.voz);
      }

      // 3. Mira
      const m = idea.mira;
      if (!m || !Array.isArray(m.pasos) || m.pasos.length < 2) mal(d, 'mira con 2 pasos o más');
      else {
        if (m.pasos.length > 7) mal(d, `mira con ${m.pasos.length} pasos (tope 7)`);
        for (const [i, paso] of m.pasos.entries()) {
          const dd = `${d} mira paso ${i + 1}`;
          if (!paso.texto) mal(dd, 'sin texto'); else tope(dd, 'paso', paso.texto);
          if (paso.ecuacion) ecuacion(dd, paso.ecuacion);
          dibuja(dd, { datos: m.datos, estado: Object.assign({}, m.base || {}, paso.estado || {}) }, m.pieza);
        }
      }

      // 4. Regla
      const r = idea.regla;
      if (!r || !r.texto) mal(d, 'sin regla');
      else {
        tope(`${d} regla`, 'regla', r.texto);
        if (r.ecuacion) ecuacion(`${d} regla`, r.ecuacion);
        if (!r.condicion) mal(d, 'regla sin condición (cuándo vale)'); else tope(`${d} regla`, 'condicion', r.condicion);
        // Dibujo propio de la regla (opcional, 18 nov): { pieza?, datos, estado? }, puro y sin NaN, como los otros momentos.
        if (r.dibujo !== undefined) {
          if (!r.dibujo || typeof r.dibujo !== 'object' || r.dibujo.datos === undefined) mal(`${d} regla (dibujo)`, 'el dibujo de la regla es { pieza?, datos, estado? }');
          else {
            const pz = figuraRegla(idea).pieza;
            if (!pz || !Kit.piezas[pz]) mal(`${d} regla (dibujo)`, `pieza «${pz}» no registrada (¿falta en requiere?)`);
            else dibuja(`${d} regla (dibujo)`, r.dibujo, pz);
          }
        }
      }

      // 4c. Ejemplos resueltos (opcional; pestaña «Ejemplos», Gerson 16 nov): 3 niveles × 5, resueltos enteros (no paso a
      // paso), con texto en colores y su dibujo. Cada uno: { nivel, titulo, enunciado, figura?, solucion: [{ texto, ecuacion? }],
      // respuesta }. Se escriben a mano, con los números ya comprobados; el validador mira forma, topes y dibujos.
      if (idea.ejemplos !== undefined) {
        const EJ = idea.ejemplos;
        if (!Array.isArray(EJ) || EJ.length !== 15) mal(d, 'ejemplos: 15 (5 por nivel, niveles 1, 2 y 3)');
        else {
          for (const nv of [1, 2, 3]) if (EJ.filter(e => e && e.nivel === nv).length !== 5) mal(d, `ejemplos: el nivel ${nv} necesita 5`);
          const vistos = new Set();
          EJ.forEach((e, k) => {
            const de = `${d} ejemplo ${k + 1}`;
            if (!e || ![1, 2, 3].includes(e.nivel)) { mal(de, 'nivel 1, 2 o 3'); return; }
            if (!e.titulo) mal(de, 'sin título'); else tope(de, 'titulo', e.titulo);
            if (!e.enunciado) mal(de, 'sin enunciado'); else { tope(de, 'enunciado', e.enunciado); ecuacion(de, Array.isArray(e.enunciado) ? e.enunciado : [e.enunciado]); }
            datos(de, e.enunciado, e.datos, true);
            // Alternativas de un ejemplo tipo examen (opcional): van en su propia línea, bajo el enunciado, con las letras
            // A a E que pone el lector (Gerson, mesa del 17 nov: no pegadas al enunciado).
            if (e.alternativas !== undefined) {
              if (!Array.isArray(e.alternativas) || e.alternativas.length < 2 || e.alternativas.length > 5) mal(de, 'alternativas: de 2 a 5 (A a E)');
              else e.alternativas.forEach((a, i) => { if (!a || !plano(a).trim()) mal(de, `alternativa ${'ABCDE'[i]} vacía`); else { tope(de, 'opcion', a); ecuacion(de, Array.isArray(a) ? a : [a]); } });
            }
            // Un dato real (el volumen del Titicaca, la lluvia de Juliaca) lleva su fuente (Gerson, 16 nov).
            if (e.fuente !== undefined && (typeof e.fuente !== 'string' || e.fuente.length < 8 || e.fuente.length > 140)) mal(de, 'fuente: texto de 8 a 140 caracteres');
            if (e.figura) dibujaCon(`${de} figura`, e.figura, e.figura.pieza);
            if (!Array.isArray(e.solucion) || e.solucion.length < 1 || e.solucion.length > 4) mal(de, 'solucion: de 1 a 4 líneas');
            else e.solucion.forEach((x, i) => { if (!x || !x.texto) mal(`${de} línea ${i + 1}`, 'sin texto'); else tope(`${de} línea ${i + 1}`, 'resuelto', x.texto); if (x && x.ecuacion) ecuacion(`${de} línea ${i + 1}`, x.ecuacion); });
            if (!e.respuesta) mal(de, 'sin respuesta'); else tope(de, 'respuesta', e.respuesta);
            const todo = plano(e.enunciado) + (e.solucion || []).map(x => plano(x && x.texto) + plano((x && x.ecuacion) || '')).join(' ') + plano(e.respuesta || '');
            if (/NaN|undefined|Infinity/.test(todo)) mal(de, 'muestra NaN o undefined');
            if (vistos.has(plano(e.enunciado))) mal(de, 'enunciado repetido'); vistos.add(plano(e.enunciado));
          });
        }
      }

      // 4b. Así se resuelve (opcional): un ejercicio resuelto paso a paso, generado y calculado por el motor.
      if (idea.resuelve !== undefined) {
        const R = idea.resuelve;
        if (!R || typeof R.generar !== 'function') mal(d, 'resuelve.generar(semilla) debe ser una función');
        else {
          const vistos = new Set();
          for (let s = 0; s < 12; s++) {
            const dd = `${d} resuelve semilla ${s}`;
            let c;
            try { c = R.generar(s); } catch (err) { mal(dd, `falló: ${err.message}`); continue; }
            if (!c || !c.enunciado) { mal(dd, 'sin enunciado'); continue; }
            tope(dd, 'enunciado', c.enunciado);
            datos(dd, c.enunciado, c.datos, true);
            if (c.dibujo) dibuja(dd, c.dibujo, R.pieza);
            if (!Array.isArray(c.pasos) || c.pasos.length < 3 || c.pasos.length > 6) { mal(dd, 'de 3 a 6 pasos'); continue; }
            const tipos = c.pasos.map(x => x && x.tipo);
            if (tipos[0] !== 'pide') mal(dd, 'el primer paso es «pide» (qué me piden)');
            if (!tipos.includes('cuentas') && !tipos.includes('aplica')) mal(dd, 'falta el paso «cuentas» (o «aplica», si no hay cuentas)');
            if (!tipos.includes('regla')) mal(dd, 'falta el paso «regla» (qué regla uso)');
            for (const [i, x] of c.pasos.entries()) {
              const di = `${dd} paso ${i + 1}`;
              if (!x || !PASOS_RESUELTO[x.tipo]) { mal(di, `tipo: ${Object.keys(PASOS_RESUELTO).join(', ')}`); continue; }
              if (!x.texto) mal(di, 'sin texto'); else tope(di, 'resuelto', x.texto);
              if (x.ecuacion) ecuacion(di, x.ecuacion);
              if (x.dibujo) dibuja(di, x.dibujo, R.pieza);
              if (/NaN|undefined|Infinity/.test(plano(x.texto) + plano(x.ecuacion || ''))) mal(di, 'muestra NaN o undefined');
            }
            if (!c.respuesta) mal(dd, 'sin respuesta'); else tope(dd, 'respuesta', c.respuesta);
            if (/NaN|undefined|Infinity/.test(plano(c.enunciado) + plano(c.respuesta || ''))) mal(dd, 'el enunciado o la respuesta muestran NaN o undefined');
            vistos.add(plano(c.enunciado));
          }
          if (vistos.size < 3) mal(d, `resuelve da solo ${vistos.size} enunciados distintos en 12 semillas (se necesitan 3 o más)`);
        }
      }

      // 5. Ahora tú
      const a = idea.ahoraTu;
      if (!a || typeof a.generar !== 'function') mal(d, 'ahoraTu.generar(semilla) debe ser una función');
      else {
        const vistos = new Set();
        const N = o.semillas || 40;
        // También las semillas de la prueba de entrada del tema (500 + k): app/teoria.js, Teoria.entrada.
        for (const s of [...Array(N).keys(), ...Array.from({ length: 6 }, (_, k) => 500 + k)]) {
          let c;
          try { c = a.generar(s); } catch (err) { mal(`${d} ahoraTu semilla ${s}`, `falló: ${err.message}`); continue; }
          const dd = `${d} ahoraTu semilla ${s}`;
          if (!c || !c.pregunta) { mal(dd, 'sin pregunta'); continue; }
          tope(dd, 'enunciado', c.pregunta);
          datos(dd, c.pregunta, c.datos, true);
          opciones(dd, c.opciones);
          if (c.dibujo) dibuja(dd, c.dibujo, a.pieza);
          if (!c.solucion || !c.solucion.texto) mal(dd, 'sin solución');
          else { tope(dd, 'solucion', c.solucion.texto); if (c.solucion.ecuacion) ecuacion(dd, c.solucion.ecuacion); }
          if (/NaN|undefined|Infinity/.test(plano(c.pregunta))) mal(dd, 'la pregunta muestra NaN o undefined');
          vistos.add(plano(c.pregunta) + JSON.stringify((c.opciones || []).map(x => plano(x.texto))));
          if (out.length > 60) break;
        }
        if (vistos.size < Math.min(5, N)) mal(d, `ahoraTu da solo ${vistos.size} casos distintos en ${N} semillas (se necesitan 5 o más)`);
      }
    }
    if (Glosario) for (const q of Glosario.revisar(def)) mal(def.unidad, q);
    if (!['borrador', 'completa'].includes(def.estado)) mal(def.unidad, 'estado: «borrador» o «completa»');
    if (o.temas) {
      const cubiertos = new Set(def.ideas.flatMap(i => i.temas || []));
      // Una unidad «completa» cubre todos los temas del catálogo; un borrador puede dejar temas para después.
      if (def.estado === 'completa') for (const t of o.temas) if (!cubiertos.has(t)) mal(def.unidad, `el tema del catálogo «${t}» no está en ninguna idea`);
      for (const t of cubiertos) if (!o.temas.includes(t)) mal(def.unidad, `«${t}» no es un tema del catálogo de esta unidad`);
    }
    return out;
  }

  // Todos los casos de la grilla de controles; si son más de 20 000, una muestra fija (misma semilla siempre).
  // La usan el validador de retos y el «Muéstrame» del laboratorio (app/teoria.js).
  function grilla(ctr) {
    const dom = ctr.map(c => c.opciones ? c.opciones.map(o => o.valor)
      : Array.from({ length: Math.floor((c.max - c.min) / c.paso + 1e-9) + 1 }, (_, k) => ajustar(c, c.min + k * c.paso)));
    const total = dom.reduce((n, d) => n * d.length, 1);
    const caso = idx => { const v = {}; ctr.forEach((c, k) => { v[c.id] = dom[k][idx % dom[k].length]; idx = Math.floor(idx / dom[k].length); }); return v; };
    if (total <= 20000) return Array.from({ length: total }, (_, i) => caso(i));
    let a = 12345; const r = () => { a = (Math.imul(a, 1103515245) + 12345) >>> 0; return a / 4294967296; };
    return Array.from({ length: 20000 }, () => caso(Math.floor(r() * total)));
  }

  // Valores iniciales de los controles de juega.
  function inicio(juega) {
    const v = {};
    for (const c of (juega && juega.controles) || []) v[c.id] = c.opciones ? (c.inicio !== undefined ? c.inicio : c.opciones[0].valor) : c.inicio;
    return v;
  }

  // Ajusta un valor de control a su paso y rango (lo que dibuja la pieza es siempre un valor limpio).
  function ajustar(c, v) {
    if (c.opciones) return c.opciones.some(o => o.valor === v) ? v : c.opciones[0].valor;
    // La grilla del control cuenta desde su mínimo: con min 25 y paso 20 da 25, 45, 65… (no 20, 40, 60).
    const n = Number.isFinite(+v) ? Math.round((+v - c.min) / c.paso) : 0;
    const r = Math.min(c.max, Math.max(c.min, c.min + n * c.paso));
    return Math.round(r * 1e6) / 1e6;
  }

  // La figura de «La regla» (Gerson, mesa del 18 nov): la regla puede traer su propio dibujo, `regla.dibujo` = { pieza?,
  // datos, estado? }, con las mismas letras de la regla. Si no lo trae, va la figura del último paso de «Mira», como
  // antes. La pieza, si el dibujo no la dice: la de la regla, la de «Mira» o la de la idea. Devuelve { pieza, datos, estado }.
  function figuraRegla(idea) {
    const r = (idea && idea.regla) || {}, m = (idea && idea.mira) || {};
    if (r.dibujo) return { pieza: r.dibujo.pieza || r.pieza || m.pieza || idea.pieza, datos: r.dibujo.datos, estado: r.dibujo.estado || {} };
    const pasos = m.pasos || [];
    return { pieza: m.pieza || idea.pieza, datos: m.datos, estado: Object.assign({}, m.base || {}, (pasos[pasos.length - 1] || {}).estado || {}) };
  }

  // La pestaña «Ejemplos» de una idea se abre recién después de su «Predice» (Gerson, mesa del 18 nov: antes de predecir,
  // los ejemplos le mostraban resuelta la situación de la predicción). `si` es el estado guardado de la idea
  // (est.teoria[unidad].ideas[idea]): vale la predicción ya respondida o la idea terminada. Una idea sin «Predice» no se
  // bloquea.
  function ejemplosAbiertos(idea, si) {
    if (!idea || !idea.predice) return true;
    return !!(si && ((si.prediccion !== undefined && si.prediccion !== null) || si.hecha));
  }

  // Baraja las opciones con la semilla del caso, para que la correcta no quede siempre en el mismo lugar.
  function barajar(ops, semilla) {
    let a = (semilla * 2654435761) >>> 0;
    const r = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const x = ops.slice();
    for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; }
    return x;
  }

  return { unidad, unidades, problemas, plano, inicio, ajustar, grilla, barajar, figuraRegla, ejemplosAbiertos, numerosDe, textoSVG, PERSONAJES, ACTUACION, PRESUPUESTO, MOMENTOS, momentosDe, PASOS_RESUELTO, palabras };
});
