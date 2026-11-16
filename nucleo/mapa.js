/*
 * Mapa del curso (16 nov 2026, pedido de Gerson): las unidades como un árbol que se abre de lo básico a lo complejo.
 * Cada curso se divide en ramas (catalogo/cursos/<curso>.json, `ramas`), y cada unidad dice qué necesita antes
 * (`requiere`, también de otro curso). Dentro de una rama, el piso de una unidad es 1 + el piso más alto de lo que
 * necesita en esa misma rama; lo que necesita de otra rama o de otro curso va escrito en la unidad («Antes: …»).
 * Una rama que no se apoya en otra rama del curso es independiente; si solo algunas de sus unidades se apoyan en otra,
 * igual se puede empezar por ella (conEntrada).
 * Un conocimiento abre el siguiente (Gerson, 16 nov; docs/plan-calidad.md §9): una unidad está abierta si es una raíz,
 * si ya la empezó, o si cada requisito suyo del mismo curso está aprobado (teoría terminada o prueba del tema con 80 %).
 * Los requisitos de otro curso no cierran: son consejo. Un requisito que la universidad no pide tampoco cierra.
 * Funciones puras: sirven en el navegador (window.Mapa) y en Node (pruebas).
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Mapa = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // curso: { id, unidades, ramas }; incluir(u): si la unidad entra (p. ej. la universidad del alumno); hecha(id): si ya
  // la estudió (sirve también para requisitos de otro curso); aprobada(id): si abre lo que sigue (por defecto, hecha);
  // empezada(id): si ya la abrió o estudió algo (no se le vuelve a cerrar).
  function armar(curso, { incluir = () => true, hecha = () => false, aprobada = hecha, empezada = () => false } = {}) {
    const us = new Map(curso.unidades.filter(incluir).map(u => [u.id, u]));
    const faltan = u => (u.requiere || []).filter(p => us.has(p) && !aprobada(p));
    const ramaDe = new Map();
    (curso.ramas || []).forEach((r, i) => r.unidades.forEach(id => ramaDe.set(id, i)));
    const ramas = (curso.ramas || []).map((r, i) => {
      const ids = r.unidades.filter(id => us.has(id)), dentro = new Set(ids), piso = new Map();
      const pisoDe = id => {
        if (piso.has(id)) return piso.get(id);
        const req = (us.get(id).requiere || []).filter(p => dentro.has(p));
        const n = req.length ? 1 + Math.max(...req.map(pisoDe)) : 0;
        piso.set(id, n); return n;
      };
      ids.forEach(pisoDe);
      const nodos = ids.map(id => {
        const u = us.get(id), req = u.requiere || [];
        return { id, unidad: u, piso: piso.get(id), dentro: req.filter(p => dentro.has(p)),
          fuera: req.filter(p => !dentro.has(p)), hecha: hecha(id), faltan: faltan(u),
          abierta: hecha(id) || empezada(id) || !faltan(u).length };
      });
      // Pisos en orden; dentro de un piso, cerca de lo que necesitan (promedio de la posición de sus requisitos).
      const pisos = [];
      for (const n of nodos) (pisos[n.piso] = pisos[n.piso] || []).push(n);
      const pos = new Map();
      pisos.forEach((fila, k) => {
        if (k) fila.sort((a, b) => media(a, pos) - media(b, pos));
        fila.forEach((n, j) => pos.set(n.id, j - (fila.length - 1) / 2));
      });
      const necesita = [...new Set(nodos.flatMap(n => n.fuera).filter(p => ramaDe.has(p) && ramaDe.get(p) !== i)
        .map(p => ramaDe.get(p)))].sort((a, b) => a - b);
      // ¿Se puede empezar la rama sin otra? Sí, si alguna unidad no necesita nada de este curso fuera de la rama.
      const conEntrada = nodos.some(n => !n.dentro.length && !n.fuera.some(p => ramaDe.has(p) && ramaDe.get(p) !== i));
      return { i, nombre: r.nombre, nodos, pisos, necesita, independiente: !necesita.length, conEntrada,
        hechas: nodos.filter(n => n.hecha).length };
    }).filter(r => r.nodos.length);
    return { ramas, siguiente: siguiente(ramas, { hecha }) };
  }
  const media = (n, pos) => (n.dentro.length ? n.dentro.reduce((s, p) => s + pos.get(p), 0) / n.dentro.length : 0);

  // Qué estudiar ahora: la primera unidad abierta sin hacer, rama por rama y piso por piso. Entre las abiertas, primero
  // las que ya tienen también sus requisitos de otro curso (hecha(p) para todos).
  function siguiente(ramas, { hecha = () => false } = {}) {
    const orden = ramas.flatMap(r => r.pisos.flat()).filter(n => !n.hecha && n.abierta);
    return orden.find(n => (n.unidad.requiere || []).every(hecha)) || orden[0] || null;
  }

  // ¿Está abierta una unidad suelta? (para entrar por enlace directo sin armar el mapa). Mismo criterio que armar.
  function abierta(curso, id, opciones = {}) {
    const m = armar(curso, opciones);
    const n = m.ramas.flatMap(r => r.nodos).find(x => x.id === id);
    return n ? { abierta: n.abierta, faltan: n.faltan } : { abierta: true, faltan: [] };
  }

  // La prueba del tema abre lo que sigue con este puntaje o más (4 de 5).
  const APRUEBA = 0.8;

  return { armar, siguiente, abierta, APRUEBA };
});
