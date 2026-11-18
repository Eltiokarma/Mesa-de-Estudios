/*
 * Pieza «alg-cubo-3d» (15 nov 2026, ronda 4 del 3D, docs/3d.md): el cubo de arista a + b que se abre en sus ocho
 * piezas, y se gira con el dedo. Sirve a dos unidades: productos notables ((a + b)³ = a³ + 3a²b + 3ab² + b³) y
 * binomio de Newton (los coeficientes 1, 3, 3, 1 cuentan cuántas piezas de cada tipo hay).
 *
 * Afirmación de la figura: (a + b)³ no es a³ + b³; entre los dos cubos de las esquinas hay seis bloques, tres a²b y
 * tres ab². Las piezas, su lugar al abrirse y sus volúmenes los calcula plantillas/cuadrado-crece/motor.js
 * (piezasCubo, con pruebas): la pieza solo dibuja (regla 1). Girar no cambia el cubo.
 *
 * datos = {
 *   a, b:   largos (positivos),
 *   abrir:  de 0 (cubo cerrado) a 1 (las piezas separadas),
 *   solo:   null | 'a3' | 'a2b' | 'ab2' | 'b3'   // deja a la vista un tipo de pieza; las otras quedan tenues
 *   vista:  { giro, inclinacion },                // opcional; sin ella, 35° y 25°
 *   colores: { a3, a2b, ab2, b3 },                // opcional: el color de cada tipo ('c-o'…, o 'ink' para la tinta)
 *   alt,
 * }
 * Colores (regla 4, los de la unidad): por defecto a y a³ en c-o, b y b³ en c-i, a²b en c-d, ab² en c-f. Una unidad con
 * otra paleta los da en datos.colores (Productos notables, 18 nov: a²b violeta y ab² en tinta, sin verde junto al naranja).
 *
 * Respaldo (dibujar): las piezas proyectadas en el plano desde datos.vista, de atrás hacia adelante. Se usa mientras
 * carga three.js, sin WebGL 2, en Node (pruebas) y en las miniaturas de la colección.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const Kit = nodo ? require('../kit.js') : root.Kit;
  if (nodo) require('../vivo3d.js');
  // El motor se busca al usarlo: en la app, las piezas y los motores de «requiere» cargan en paralelo.
  const M = nodo ? require('../../../plantillas/cuadrado-crece/motor.js') : null;
  const api = fabrica(Kit, () => M || root.MotorCuadrado);
  Kit.registrar(api);
  if (nodo) module.exports = api;
})(typeof self !== 'undefined' ? self : this, function (Kit, motor) {
  'use strict';
  const rad = g => g * Math.PI / 180;
  const f = (n, d = 2) => Kit.formatear(n, d);
  const E = 0.5;                       // unidades de la escena por unidad de largo: a + b = 8 mide 4
  const HUECO = 1.4;                   // separación total entre capas con abrir = 1, en unidades de largo
  const COLOR = { a3: 'c-o', a2b: 'c-d', ab2: 'c-f', b3: 'c-i' };
  const NOMBRE = { a3: 'a³', a2b: 'a²b', ab2: 'ab²', b3: 'b³' };
  const LADO = ['de ancho', 'de fondo', 'de alto'];
  const vistaDe = d => d.vista || { giro: 35, inclinacion: 25 };
  const colorDe = (d, tipo) => (d.colores && d.colores[tipo]) || COLOR[tipo];
  const varDe = c => (c === 'ink' ? '--ink' : `--${c}`);
  const cubo = d => motor().piezasCubo({ a: d.a, b: d.b, hueco: HUECO, f: d.abrir || 0 });
  // Cuántas piezas hay de cada tipo y cuánto mide cada una: lo que el motor arma, contado.
  function cuenta(d) {
    const c = cubo(d), t = {};
    for (const p of c.piezas) { t[p.tipo] = t[p.tipo] || { n: 0, volumen: p.volumen }; t[p.tipo].n++; }
    return { arista: c.arista, volumen: c.volumen, suma: c.sumaPiezas, tipos: t };
  }
  // Motor (x, y, z con z hacia arriba) → escena (x, alto, fondo), centrada y a escala.
  const escena = (d, x, y, z) => { const m = (d.a + d.b) / 2; return [(x - m) * E, (z - m) * E, (y - m) * E]; };
  function girar(p, giro, inc) {
    const a = rad(giro || 0), b = rad(inc || 0);
    const x = p[0] * Math.cos(a) + p[2] * Math.sin(a), z = -p[0] * Math.sin(a) + p[2] * Math.cos(a);
    return [x, p[1] * Math.cos(b) - z * Math.sin(b), p[1] * Math.sin(b) + z * Math.cos(b)];
  }
  // Qué lados de una pieza miden b: una pieza a²b eligió b en uno de los tres lados (eso cuenta el coeficiente 3).
  const ladosB = p => [p.i, p.j, p.k].map((s, n) => (s ? LADO[n] : null)).filter(Boolean);
  const dice = (d, p) => {
    const lb = ladosB(p);
    return `Pieza ${NOMBRE[p.tipo]}: ${f(p.w)} · ${f(p.p)} · ${f(p.h)} = ${f(p.volumen)}.${lb.length && lb.length < 3 ? ` Mide b ${lb.join(' y ')}.` : ''}`;
  };

  function alt(d) {
    if (d.alt) return d.alt;
    const c = cuenta(d), t = c.tipos, abierto = (d.abrir || 0) > 0 ? 'abierto en sus ocho piezas' : 'cerrado, con sus ocho piezas';
    const parte = k => (t[k] ? `${t[k].n === 1 ? `${NOMBRE[k]} = ${f(t[k].volumen)}` : `${t[k].n === 3 ? 'tres' : t[k].n} ${NOMBRE[k]} de ${f(t[k].volumen)}`}` : '');
    const solo = d.solo && t[d.solo] ? ` A la vista, solo ${t[d.solo].n === 1 ? 'la pieza' : `las ${t[d.solo].n} piezas`} ${NOMBRE[d.solo]}.` : '';
    return `Cubo de arista ${f(d.a)} + ${f(d.b)} = ${f(c.arista)}, ${abierto}: ${['a3', 'a2b', 'ab2'].map(parte).join(', ')} y ${parte('b3')}; suman ${f(c.suma)}.${solo}`;
  }

  // ---------- Respaldo plano: cada pieza con sus caras visibles, de atrás hacia adelante ----------
  const CARAS = [  // índices de esquina (bit 0: x, bit 1: alto, bit 2: fondo) y normal en la escena
    { v: [1, 3, 7, 5], n: [1, 0, 0] }, { v: [0, 4, 6, 2], n: [-1, 0, 0] },
    { v: [2, 6, 7, 3], n: [0, 1, 0] }, { v: [0, 1, 5, 4], n: [0, -1, 0] },
    { v: [4, 5, 7, 6], n: [0, 0, 1] }, { v: [0, 2, 3, 1], n: [0, 0, -1] },
  ];
  const TONO = [0.62, 0.62, 0.85, 0.4, 0.5, 0.5];   // cara de arriba más clara: el volumen se lee sin luz
  function plano(d) {
    const v = vistaDe(d), W = 320, H = 260, c = cubo(d), PX = 220 / Math.max(4, (c.arista + HUECO) * E * 1.9);
    const p2 = q => { const g = girar(q, v.giro, v.inclinacion); return [W / 2 + g[0] * PX, H / 2 - g[1] * PX, g[2]]; };
    const piezas = c.piezas.map(p => {
      const esq = [];
      for (let k = 0; k < 8; k++) esq.push(escena(d, p.x + (k & 1 ? p.w : 0), p.y + (k & 4 ? p.p : 0), p.z + (k & 2 ? p.h : 0)));
      const centro = girar(escena(d, p.x + p.w / 2, p.y + p.p / 2, p.z + p.h / 2), v.giro, v.inclinacion);
      const caras = CARAS.map((cara, n) => ({ n, puntos: cara.v.map(k => p2(esq[k])), ve: girar(cara.n, v.giro, v.inclinacion)[2] > 1e-9 })).filter(x => x.ve);
      return { tipo: p.tipo, volumen: p.volumen, prof: centro[2], caras, tenue: !!d.solo && d.solo !== p.tipo };
    }).sort((x, y) => x.prof - y.prof);
    return { piezas, W, H };
  }
  function dibujar(d) {
    const pl = plano(d), n = x => Math.round(x * 100) / 100;
    const cuerpo = pl.piezas.map(p => p.caras.map(c => `<polygon points="${c.puntos.map(q => `${n(q[0])},${n(q[1])}`).join(' ')}" fill="var(${varDe(colorDe(d, p.tipo))})" fill-opacity="${p.tenue ? 0.08 : TONO[c.n]}" stroke="currentColor" stroke-opacity="${p.tenue ? 0.25 : 0.8}" stroke-width="1.2" stroke-linejoin="round"/>`).join('')).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${pl.W} ${pl.H}" width="${pl.W}" height="${pl.H}" role="img" aria-label="${alt(d).replace(/"/g, '&quot;')} Vista plana." class="kit-svg" font-family="inherit"><g class="kit-piezas">${cuerpo}</g></svg>`;
  }

  // ---------- En vivo: la escena sobre la base común (nucleo/kit/vivo3d.js) ----------
  const SPEC = {
    plano: d => dibujar(d),
    vista: d => vistaDe(d),
    clave: d => JSON.stringify(d.vista || null),     // cambiar a, b o abrir no devuelve la cámara a su sitio
    distancia: 9, distMin: 4.5, distMax: 15,
    tocar: o => (o && o.userData && o.userData.dice) || '',
    construir(T, grupo, d, e, h) {
      const tinta = h.varCss('--ink', '#2d2340'), c = cubo(d), tocables = [], rotulo = {};
      const cerca = p => 2 * p.j + p.k + 0.5 * p.i;      // adelante, arriba y a la derecha: lo que se ve primero
      for (const p of c.piezas) if (!rotulo[p.tipo] || cerca(p) > cerca(rotulo[p.tipo])) rotulo[p.tipo] = p;
      for (const p of c.piezas) {
        const tenue = !!d.solo && d.solo !== p.tipo;
        const geo = new T.BoxGeometry(p.w * E, p.h * E, p.p * E);
        const m = new T.Mesh(geo, h.material(h.varCss(varDe(colorDe(d, p.tipo)), '#888'), tenue ? { transparent: true, opacity: 0.1, depthWrite: false } : {}));
        const centro = escena(d, p.x + p.w / 2, p.y + p.p / 2, p.z + p.h / 2);
        m.position.set(...centro);
        m.userData.dice = dice(d, p);
        grupo.add(m); tocables.push(m);
        const borde = new T.LineSegments(new T.EdgesGeometry(geo), new T.LineBasicMaterial({ color: new T.Color(tinta), transparent: tenue, opacity: tenue ? 0.25 : 1 }));
        borde.position.copy(m.position); grupo.add(borde);
        // Rótulos solo con el cubo abierto (cerrado, el de una pieza escondida caería sobre otra): uno por tipo, en la
        // pieza más cercana a la vista de partida, o uno por pieza si ese tipo está solo a la vista.
        if (!tenue && (d.abrir || 0) > 0 && (d.solo === p.tipo || rotulo[p.tipo] === p)) {
          h.etiqueta(new T.Vector3(...centro), NOMBRE[p.tipo], { color: colorDe(d, p.tipo) === 'ink' ? null : colorDe(d, p.tipo), letra: true });
        }
      }
      // Los largos a y b, bajo la arista de adelante: el lado del cubo es a + b.
      if (!d.solo) {
        const dz = HUECO * (d.abrir || 0) / 2, frente = d.a + d.b + dz + 0.5, abajo = -dz - 0.5;
        h.etiqueta(new T.Vector3(...escena(d, d.a / 2 - dz, frente, abajo)), 'a', { color: 'c-o', letra: true });
        h.etiqueta(new T.Vector3(...escena(d, d.a + d.b / 2 + dz, frente, abajo)), 'b', { color: 'c-i', letra: true });
      }
      return { tocables, aria: alt(d) };
    },
  };
  const montar = (el, op) => Kit.vivo3d.montar(el, SPEC, op);

  return { id: 'alg-cubo-3d', dibujar, alt, montar, plano, girar, cuenta, COLOR, NOMBRE };
});
