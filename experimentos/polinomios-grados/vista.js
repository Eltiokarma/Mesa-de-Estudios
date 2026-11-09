(function () {
  'use strict';
  const M = window.MotorPolinomios, ejercicios = window.EjerciciosPolinomios;
  const $ = id => document.getElementById(id);
  let indice = 0;
  const respuestas = new Map();
  function variable(nombre, exponente) {
    if (exponente === 0) return '';
    return `<span class="${nombre}">${nombre}${exponente === 1 ? '' : `<sup>${exponente}</sup>`}</span>`;
  }
  function formula(terminos) {
    if (!terminos.length) return '0';
    return terminos.map((t, i) => {
      const signo = t.c < 0 ? '− ' : i ? '+ ' : '';
      const coef = Math.abs(t.c) === 1 && (t.x || t.y) ? '' : String(Math.abs(t.c));
      return signo + coef + variable('x', t.x) + variable('y', t.y);
    }).join(' ');
  }
  function resolver(e) {
    if (e.tipo === 'grados') { const r = M.analizar(e.terminos); return { respuesta: r.grado, analisis: r }; }
    const r = M.explorar(e.familia, e.desde, e.hasta); return { respuesta: r.valores.length, exploracion: r };
  }
  function exponenteAfin(e) {
    if (e.a === 0) return e.b / e.d;
    const n = `${e.a === 1 ? '' : e.a === -1 ? '−' : e.a}n`;
    const numerador = n + (e.b === 0 ? '' : e.b > 0 ? `+${e.b}` : `−${-e.b}`);
    return e.d === 1 ? numerador : e.b === 0 ? `${numerador}/${e.d}` : `(${numerador})/${e.d}`;
  }
  function formulaFamilia(familia) {
    return familia.map(t => `${t.c === 1 ? '' : t.c}${variable('x', exponenteAfin(t.x))}${variable('y', exponenteAfin(t.y))}`).join(' + ');
  }
  function mostrarAnalisis(r) {
    const filas = r.terminos.map((t, i) => {
      const ancho = 100 / Math.max(r.grado, 1);
      const barras = `<div class="barras" aria-hidden="true"><span class="barra-x" style="width:${t.x * ancho}%">${t.x || ''}</span><span class="barra-y" style="width:${t.y * ancho}%">${t.y || ''}</span></div>`;
      return `<tr><td>${formula([t])}</td><td><span class="x">${t.x}</span> + <span class="y">${t.y}</span> = ${r.gradosTerminos[i]}${barras}</td></tr>`;
    }).join('');
    return `<p>Después de reducir:</p><div class="formula">${formula(r.terminos)}</div><div class="tabla"><table><thead><tr><th>Término</th><th>Suma de exponentes</th></tr></thead><tbody>${filas}</tbody></table></div><p class="resumen"><strong>Grado absoluto: ${r.grado}.</strong> Grado relativo en <span class="x">x</span>: ${r.gradosRelativos.x}; en <span class="y">y</span>: ${r.gradosRelativos.y}.<br>Homogéneo: ${r.homogeneo ? 'sí' : 'no'}. Completo en x: ${r.completo.x ? 'sí' : 'no'}; en y: ${r.completo.y ? 'sí' : 'no'}.</p><p class="nota">Completo en una variable significa que aparecen todas sus potencias, desde el grado mayor hasta cero, después de reducir.</p>`;
  }
  function revelar(valor) {
    const e = ejercicios[indice], r = resolver(e);
    $('feedback').textContent = valor === r.respuesta ? `Tu predicción coincide: ${r.respuesta}. Veamos por qué.` : `Predijiste ${valor}; el resultado es ${r.respuesta}. Revisemos el procedimiento.`;
    $('explicacion').textContent = e.explicacion;
    if (r.analisis) $('resultado').innerHTML = mostrarAnalisis(r.analisis);
    else {
      const filas = r.exploracion.filas.map(f => `<tr><td>${f.n}</td><td class="${f.admisible ? 'ok' : 'no'}">${f.admisible ? 'Sí' : 'No'}</td><td>${f.admisible ? `Grado ${f.analisis.grado}` : f.motivos.join(' ')}</td></tr>`).join('');
      $('resultado').innerHTML = `<p class="resumen">Valores admisibles: <strong>${r.exploracion.valores.join(', ')}</strong>. Son ${r.respuesta} valores.</p><div class="tabla"><table><thead><tr><th>n</th><th>¿Admisible?</th><th>Comprobación</th></tr></thead><tbody>${filas}</tbody></table></div>`;
    }
    $('solucion').hidden = false;
    $('siguiente').disabled = indice === ejercicios.length - 1;
    $('instruccion').textContent = indice === ejercicios.length - 1 ? 'Terminaste esta prueba. Puedes revisar tus respuestas o practicar en papel.' : 'Ya puedes pasar a la siguiente actividad.';
  }
  function cargar() {
    const e = ejercicios[indice];
    $('progreso').textContent = `ACTIVIDAD ${indice + 1} DE ${ejercicios.length}`;
    $('titulo').textContent = e.titulo; $('contexto').textContent = e.contexto;
    $('pregunta').textContent = e.pregunta;
    $('expresion').innerHTML = e.tipo === 'grados' ? formula(e.terminos) : formulaFamilia(e.familia);
    $('respuesta').value = respuestas.has(e.id) ? respuestas.get(e.id) : '';
    $('feedback').textContent = ''; $('resultado').replaceChildren(); $('solucion').hidden = true;
    $('anterior').disabled = indice === 0; $('siguiente').disabled = true;
    $('instruccion').textContent = 'Responde primero para ver la explicación y avanzar.';
    if (respuestas.has(e.id)) revelar(respuestas.get(e.id));
  }
  $('prediccion').addEventListener('submit', event => {
    event.preventDefault();
    const raw = $('respuesta').value.trim(), value = Number(raw);
    if (!raw || !Number.isSafeInteger(value) || value < 0) return;
    respuestas.set(ejercicios[indice].id, value); revelar(value);
  });
  $('anterior').addEventListener('click', () => { if (indice > 0) { indice--; cargar(); } });
  $('siguiente').addEventListener('click', () => {
    if (respuestas.has(ejercicios[indice].id) && indice < ejercicios.length - 1) { indice++; cargar(); }
  });
  cargar();
})();
