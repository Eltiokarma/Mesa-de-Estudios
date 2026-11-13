/*
 * «¿Cuál pesa más?»: la pantalla y el «jugo» (animación, chispas, sonido). Prototipo.
 * La lógica vive en motor.js (window.CualPesaMas); aquí solo se pinta y se anima.
 * Sin dependencias: Web Animations API, un <canvas> para chispas y confeti, y Web Audio para los sonidos.
 * Con prefers-reduced-motion: sin movimiento ni chispas; quedan los colores, los textos y el sonido.
 * Parámetros de la dirección: ?segundos=60&semilla=abc
 */
(function () {
  'use strict';
  const M = window.CualPesaMas;
  const $ = id => document.getElementById(id);
  const q = new URLSearchParams(location.search);
  const DURACION = Math.max(10, Number(q.get('segundos')) || 60) * 1000;
  const reducido = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Puntos sin separador hasta 9999 y con espacio fino desde 10 000 (SI): «2,800» se leería como 2,8.
  const fmt = n => { const t = String(Math.round(n)); return t.length > 4 ? t.replace(/\B(?=(\d{3})+$)/g, '\u202f') : t; };
  const esperar = ms => new Promise(ok => setTimeout(ok, ms));
  const NOMBRES = { 1: 'Sumas y restas', 2: 'Productos y potencias', 3: 'Decimales, fracciones y %', 4: 'Unidades', 5: 'Notables y potencias de 10' };
  const RESORTE = 'cubic-bezier(.34,1.56,.64,1)';
  const SALIDA = 'cubic-bezier(.4,0,1,1)';

  // Una animación que no se queda pegada: con movimiento reducido dura 0.
  function anim(el, cuadros, ms, extra) {
    if (!el || !el.animate) return Promise.resolve();
    const a = el.animate(cuadros, Object.assign({ duration: reducido() ? 0 : ms, easing: 'ease-out', fill: 'both' }, extra));
    return a.finished.catch(() => {});
  }
  const pose = nombre => { try { window.Mascota && Mascota.pose(nombre); } catch { /* sin mascota */ } };

  // ---------- Sonido (Web Audio, sintetizado: no hay archivos que bajar) ----------
  let ctx = null;
  function audio() {
    if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch { ctx = null; } }
    if (ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function tono(f, ms, tipo = 'sine', vol = 0.12, demora = 0, f2 = null) {
    const c = audio(); if (!c) return;
    const t = c.currentTime + demora / 1000;
    const o = c.createOscillator(), g = c.createGain();
    o.type = tipo; o.frequency.setValueAtTime(f, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + ms / 1000);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + ms / 1000);
    o.connect(g).connect(c.destination); o.start(t); o.stop(t + ms / 1000 + 0.02);
  }
  const sonido = {
    bien: racha => { const f = 523 * Math.pow(1.06, Math.min(racha, 12)); tono(f, 120, 'triangle', 0.14); tono(f * 1.5, 160, 'sine', 0.1, 70); },
    mal: () => { tono(220, 180, 'square', 0.05, 0, 150); tono(160, 220, 'triangle', 0.08, 90, 120); },
    nivel: () => [523, 659, 784, 1047].forEach((f, i) => tono(f, 160, 'triangle', 0.12, i * 85)),
    tic: () => tono(1200, 40, 'square', 0.03),
    record: () => [523, 659, 784, 1047, 1319].forEach((f, i) => tono(f, 220, 'triangle', 0.13, i * 110)),
  };

  // ---------- Chispas y confeti en un <canvas> ----------
  const lienzo = $('chispas'), pincel = lienzo.getContext('2d');
  let parts = [], girando = false;
  function medir() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    lienzo.width = innerWidth * dpr; lienzo.height = innerHeight * dpr;
    pincel.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  addEventListener('resize', medir); medir();
  const COLORES = ['#7f5ae0', '#a58cf0', '#ffd3e2', '#ff7a9c', '#f5b301', '#1f9d6b', '#3dcdc3'];
  function chispas(x, y, n = 18, colores = COLORES) {
    if (reducido()) return;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + Math.random() * 0.4, v = 3 + Math.random() * 4;
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 1.5, g: 0.18, vida: 1, baja: 0.025 + Math.random() * 0.015,
        r: 3 + Math.random() * 4, c: colores[i % colores.length], forma: i % 3 === 0 ? 'estrella' : 'bola', giro: 0, vg: 0 });
    }
    andar();
  }
  function confeti(n = 140) {
    if (reducido()) return;
    for (let i = 0; i < n; i++) {
      parts.push({ x: Math.random() * innerWidth, y: -20 - Math.random() * innerHeight * 0.5, vx: (Math.random() - 0.5) * 2.4, vy: 2 + Math.random() * 3,
        g: 0.05, vida: 1, baja: 0.004 + Math.random() * 0.003, r: 5 + Math.random() * 5, c: COLORES[i % COLORES.length],
        forma: 'papel', giro: Math.random() * 6, vg: (Math.random() - 0.5) * 0.3 });
    }
    andar();
  }
  function estrella(x, y, r) {
    pincel.beginPath();
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; pincel.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
    pincel.closePath(); pincel.fill();
  }
  function andar() {
    if (girando) return;
    girando = true;
    const cuadro = () => {
      pincel.clearRect(0, 0, innerWidth, innerHeight);
      parts = parts.filter(p => p.vida > 0 && p.y < innerHeight + 40);
      for (const p of parts) {
        p.vx *= 0.985; p.vy += p.g; p.x += p.vx; p.y += p.vy; p.vida -= p.baja; p.giro += p.vg;
        pincel.globalAlpha = Math.max(0, Math.min(1, p.vida * 1.6));
        pincel.fillStyle = p.c;
        if (p.forma === 'bola') { pincel.beginPath(); pincel.arc(p.x, p.y, Math.max(0, p.r * p.vida), 0, 7); pincel.fill(); }
        else if (p.forma === 'estrella') estrella(p.x, p.y, Math.max(0, p.r * 1.4 * p.vida));
        else { pincel.save(); pincel.translate(p.x, p.y); pincel.rotate(p.giro); pincel.scale(1, Math.cos(p.giro * 2)); pincel.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); pincel.restore(); }
      }
      pincel.globalAlpha = 1;
      if (parts.length) requestAnimationFrame(cuadro); else girando = false;
    };
    requestAnimationFrame(cuadro);
  }

  // ---------- Pequeños efectos del DOM ----------
  const centro = el => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };
  function flota(texto, x, y, color) {
    const d = document.createElement('div');
    d.className = 'flota'; d.textContent = texto; d.style.left = x + 'px'; d.style.top = y + 'px';
    if (color) d.style.color = color;
    document.body.appendChild(d);
    anim(d, [
      { opacity: 0, transform: 'translate(-50%,-50%) scale(.5)' },
      { opacity: 1, transform: 'translate(-50%,-90%) scale(1.15)', offset: 0.25 },
      { opacity: 0, transform: 'translate(-50%,-220%) scale(1)' },
    ], 800).then(() => d.remove());
  }
  // El anillo del toque: el dedo «deja huella» (también se ve en el video).
  addEventListener('pointerdown', e => {
    if (reducido()) return;
    const t = document.createElement('div');
    t.className = 'toque'; t.style.left = e.clientX + 'px'; t.style.top = e.clientY + 'px';
    document.body.appendChild(t);
    anim(t, [{ transform: 'scale(.4)', opacity: 1 }, { transform: 'scale(1.6)', opacity: 0 }], 420).then(() => t.remove());
  }, { passive: true });

  // Un número que cuenta hasta su valor nuevo.
  const cuentas = new WeakMap();
  function contar(el, hasta, ms = 420) {
    const desde = Number(el.dataset.valor || 0);
    el.dataset.valor = hasta;
    cancelAnimationFrame(cuentas.get(el));
    if (reducido() || desde === hasta) { el.textContent = fmt(hasta); return; }
    const t0 = performance.now();
    const paso = t => {
      const k = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(desde + (hasta - desde) * e);
      if (k < 1) cuentas.set(el, requestAnimationFrame(paso));
    };
    cuentas.set(el, requestAnimationFrame(paso));
  }
  async function cartel(titulo, sub) {
    const c = document.createElement('div');
    c.className = 'cartel';
    c.innerHTML = `<span>${titulo}${sub ? `<small>${sub}</small>` : ''}</span>`;
    document.body.appendChild(c);
    const s = c.firstChild;
    await anim(s, [
      { transform: 'translateX(-120vw) rotate(-8deg) scale(.8)' },
      { transform: 'translateX(0) rotate(2deg) scale(1.08)', offset: 0.35 },
      { transform: 'translateX(0) rotate(0) scale(1)', offset: 0.75 },
      { transform: 'translateX(120vw) rotate(8deg) scale(.9)' },
    ], 1400, { easing: 'ease-in-out' });
    c.remove();
  }

  // ---------- El juego ----------
  const el = { izq: $('izq'), der: $('der'), iguales: $('iguales') };
  let rng, estado, ronda, bloqueado = true, activo = false, t0 = 0, ultimoSeg = null, nRonda = 0;
  const RECORD = 'cual-pesa-mas:record';
  const record = () => Number(localStorage.getItem(RECORD) || 0);

  function pintarMejor() { const r = record(); $('mejor').textContent = r ? `Tu récord: ${fmt(r)}` : ''; }
  pintarMejor();

  function pintarRacha() {
    const dots = $('racha').children, enNivel = estado.enNivel;
    for (let i = 0; i < dots.length; i++) dots[i].classList.toggle('on', i < enNivel);
  }
  function pintarCombo(antes, ahora) {
    const c = $('combo');
    if (ahora > 1) {
      c.textContent = 'x' + ahora;
      if (ahora !== antes) {
        c.classList.add('on');
        anim(c, [{ transform: 'scale(.3) rotate(-20deg)', opacity: 0 }, { transform: 'scale(1.35) rotate(6deg)', opacity: 1, offset: 0.6 }, { transform: 'scale(1) rotate(0)', opacity: 1 }], 420, { easing: RESORTE });
      } else {
        anim(c, [{ transform: 'scale(1)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1)' }], 200);
      }
    } else if (antes > 1) {
      anim(c, [{ transform: 'scale(1) translateY(0)', opacity: 1 }, { transform: 'scale(.6) translateY(18px) rotate(14deg)', opacity: 0 }], 320, { easing: SALIDA })
        .then(() => c.classList.remove('on'));
    }
  }

  async function empezar() {
    audio();
    rng = Azar.crear(q.get('semilla') || String(Date.now()));
    estado = M.nuevo(); nRonda = 0;
    $('puntos').dataset.valor = 0; $('puntos').textContent = '0';
    $('combo').classList.remove('on'); $('nivel').textContent = 'Nivel 1';
    $('tiempo').classList.remove('apuro'); $('seg').classList.remove('apuro');
    $('tiempo').firstElementChild.style.transform = 'scaleX(1)';
    pintarRacha();
    const pantalla = $('fin').hidden ? $('inicio') : $('fin');
    await anim(pantalla, [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(40px)' }], 320, { easing: SALIDA });
    pantalla.hidden = true; pantalla.getAnimations().forEach(a => a.cancel());
    pose('saluda');
    await cartel('¡A jugar!', NOMBRES[1]);
    activo = true; t0 = performance.now(); ultimoSeg = null;
    requestAnimationFrame(reloj);
    mostrarRonda();
  }

  function reloj(t) {
    if (!activo) return;
    const resta = Math.max(0, DURACION - (t - t0));
    $('tiempo').firstElementChild.style.transform = `scaleX(${resta / DURACION})`;
    const s = Math.ceil(resta / 1000);
    if (s !== ultimoSeg) {
      ultimoSeg = s; $('seg').textContent = s;
      const apuro = s <= 10;
      $('tiempo').classList.toggle('apuro', apuro); $('seg').classList.toggle('apuro', apuro);
      if (s <= 5 && s > 0) { sonido.tic(); anim($('seg'), [{ transform: 'scale(1.6)' }, { transform: 'scale(1)' }], 300, { easing: RESORTE }); }
    }
    if (resta <= 0) { terminar(); return; }
    requestAnimationFrame(reloj);
  }

  async function mostrarRonda() {
    ronda = M.ronda(rng, estado.nivel); nRonda++;
    for (const lado of ['izq', 'der']) {
      const b = el[lado];
      b.classList.remove('bien', 'mal', 'era');
      b.querySelector('.ex').textContent = ronda[lado].texto;
      b.querySelector('.val').textContent = '';
      b.setAttribute('aria-label', ronda[lado].texto);
    }
    el.iguales.classList.remove('bien', 'mal', 'era');
    if (nRonda <= 2) $('globo').textContent = nRonda === 1 ? 'Toca la tarjeta que vale más.' : 'Si valen lo mismo, toca «Iguales».';
    pose('reposo');
    const entra = (b, demora) => anim(b, [
      { opacity: 0, transform: 'translateY(26px) scale(.85)' },
      { opacity: 1, transform: 'translateY(0) scale(1)' },
    ], 340, { easing: RESORTE, delay: reducido() ? 0 : demora });
    await Promise.all([entra(el.izq, 0), entra(el.der, 60), entra(el.iguales, 120)]);
    if (activo) bloqueado = false;
  }

  const relacion = () => {
    const c = M.comparar(ronda.izq.valor, ronda.der.valor);
    return `${ronda.izq.texto} ${c > 0 ? '>' : c < 0 ? '<' : '='} ${ronda.der.texto}`;
  };
  const conUnidad = v => M.mostrar(v) + (ronda.si ? ' ' + ronda.si : '');

  async function responder(lado) {
    if (bloqueado || !activo) return;
    bloqueado = true;
    const boton = el[lado];
    const correcto = lado === ronda.respuesta;
    const antes = M.multiplicador(estado.racha);
    const res = M.anotar(estado, correcto);
    estado = res.estado;

    // Los dos valores aparecen siempre: el alumno ve por qué.
    for (const l of ['izq', 'der']) {
      const v = el[l].querySelector('.val');
      v.textContent = '= ' + conUnidad(ronda[l].valor);
      anim(v, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }], 200, { delay: 80 });
    }

    if (correcto) {
      boton.classList.add('bien');
      anim(boton, [{ transform: 'scale(.92)' }, { transform: 'scale(1.08)', offset: 0.45 }, { transform: 'scale(1)' }], 380, { easing: RESORTE });
      const p = centro(boton);
      chispas(p.x, p.y, 14 + Math.min(estado.racha, 10) * 2);
      flota(`+${res.ganados}`, p.x, p.y - 30);
      sonido.bien(estado.racha);
      contar($('puntos'), estado.puntos);
      anim($('puntos'), [{ transform: 'scale(1)' }, { transform: 'scale(1.12)' }, { transform: 'scale(1)' }], 260);
      pintarCombo(antes, res.multiplicador);
      $('globo').innerHTML = `<span><b class="ok">¡Bien!</b> ${relacion()}</span>`;
      if ([3, 6, 10].includes(estado.racha)) pose('celebra');
    } else {
      boton.classList.add('mal');
      anim(boton, [0, -10, 9, -7, 5, -2, 0].map(x => ({ transform: `translateX(${x}px)` })), 380, { easing: 'linear' });
      const buena = el[ronda.respuesta];
      buena.classList.add('era');
      anim(buena, [{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], 420, { delay: 200, iterations: 2 });
      if (navigator.vibrate) navigator.vibrate(60);
      sonido.mal();
      pintarCombo(antes, 1);
      $('globo').innerHTML = `<span><b class="mal">Casi.</b> ${relacion()}</span>`;
      pose('acompaña');
    }
    pintarRacha();
    if (res.cambio === 1) {
      $('nivel').textContent = 'Nivel ' + estado.nivel;
      await esperar(380);
      sonido.nivel(); pose('celebra');
      const p = centro($('nivel')); chispas(p.x, p.y, 24);
      anim($('nivel'), [{ transform: 'scale(1)' }, { transform: 'scale(1.5)' }, { transform: 'scale(1)' }], 500, { easing: RESORTE });
      await cartel(`¡Nivel ${estado.nivel}!`, NOMBRES[estado.nivel]);
    } else {
      if (res.cambio === -1) $('nivel').textContent = 'Nivel ' + estado.nivel;
      await esperar(correcto ? 560 : 1500);
    }
    if (!activo) return;
    // Salen: la buena sube, la otra cae.
    await Promise.all(['izq', 'der', 'iguales'].map(l => anim(el[l], [
      { opacity: 1, transform: 'translateY(0) scale(1)' },
      { opacity: 0, transform: l === ronda.respuesta ? 'translateY(-30px) scale(1.05)' : 'translateY(16px) scale(.9)' },
    ], 180, { easing: SALIDA })));
    if (activo) mostrarRonda();
  }

  async function terminar() {
    activo = false; bloqueado = true;
    $('seg').textContent = '0';
    sonido.tic();
    await cartel('¡Tiempo!');
    const nuevoRecord = estado.puntos > record() && estado.puntos > 0;
    if (nuevoRecord) localStorage.setItem(RECORD, String(estado.puntos));
    $('fin-aciertos').textContent = `${estado.aciertos}/${estado.aciertos + estado.fallos}`;
    $('fin-racha').textContent = estado.mejorRacha;
    $('fin-nivel').textContent = estado.nivelMax;
    $('fin-puntos').dataset.valor = 0; $('fin-puntos').textContent = '0';
    $('fin-record').innerHTML = '';
    const fin = $('fin');
    fin.hidden = false;
    await anim(fin, [{ opacity: 0, transform: 'translateY(60px)' }, { opacity: 1, transform: 'translateY(0)' }], 420, { easing: RESORTE });
    contar($('fin-puntos'), estado.puntos, 1100);
    await esperar(1150);
    if (nuevoRecord) {
      $('fin-record').innerHTML = '<span class="record">¡Nuevo récord!</span>';
      anim($('fin-record').firstChild, [{ transform: 'scale(0) rotate(-12deg)' }, { transform: 'scale(1.25) rotate(4deg)', offset: 0.6 }, { transform: 'scale(1) rotate(0)' }], 520, { easing: RESORTE });
      sonido.record(); confeti(); pose('hito');
    } else {
      $('fin-record').innerHTML = `<div class="mejor">Tu récord: ${fmt(record())}</div>`;
      pose('acompaña');
    }
    pintarMejor();
  }

  for (const lado of ['izq', 'der', 'iguales']) el[lado].addEventListener('click', () => responder(lado));
  addEventListener('keydown', e => {
    const k = { ArrowLeft: 'izq', ArrowRight: 'der', ArrowDown: 'iguales', '=': 'iguales' }[e.key];
    if (k) responder(k);
  });
  $('jugar').addEventListener('click', empezar);
  $('otra').addEventListener('click', empezar);
  pose('saluda');

  // Para las pruebas en el navegador (y el video): leer la ronda sin tocar el DOM.
  window.JuegoCualPesaMas = { ronda: () => ronda, estado: () => estado, listo: () => activo && !bloqueado };
})();
