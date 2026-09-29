(function () {
  'use strict';

  console.log('[Lourvix] Script cargado ✓');

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  try {
    const yearEl = $('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  } catch (err) { console.error('[Año]', err); }

  /* ==========================================================
     NAVBAR · Hamburguesa (no fija)
     ========================================================== */
  try {
    const hamburger = $('#hamburger');
    const navLinks  = $('#navLinks');

    if (hamburger && navLinks) {
      const closeMenu = () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      };
      hamburger.addEventListener('click', () => {
        const open = navLinks.classList.toggle('open');
        hamburger.classList.toggle('active', open);
        hamburger.setAttribute('aria-expanded', String(open));
      });
      $$('a', navLinks).forEach(a => a.addEventListener('click', closeMenu));
      document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
    }
  } catch (err) { console.error('[Navbar]', err); }

  try {
    const typedWord = $('#typedWord');
    if (typedWord) {
      const words = [
        { text: 'Español',  cls: '' },
        { text: 'Portañol', cls: 'is-portunol' }
      ];
      let wordIdx = 0, charIdx = 0, deleting = false;
      const typeLoop = () => {
        const current = words[wordIdx];
        typedWord.classList.remove('is-portunol');
        if (deleting) {
          charIdx--;
          typedWord.textContent = current.text.substring(0, charIdx);
        } else {
          charIdx++;
          typedWord.textContent = current.text.substring(0, charIdx);
        }
        let delay = deleting ? 55 : 130;
        if (!deleting && charIdx === current.text.length) {
          delay = 2200;
          deleting = true;
          if (current.cls) typedWord.classList.add(current.cls);
        } else if (deleting && charIdx === 0) {
          deleting = false;
          wordIdx = (wordIdx + 1) % words.length;
          delay = 500;
        }
        setTimeout(typeLoop, delay);
      };
      typeLoop();
    }
  } catch (err) { console.error('[Typing hero]', err); }

  try {
    const counters = $$('[data-counter]');

    const animateCounter = (el) => {
      const target = parseInt(el.dataset.counter, 10) || 0;
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const duration = 2000;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const value = Math.round(eased * target);
        el.textContent = prefix + value + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = prefix + target + suffix;
      };
      requestAnimationFrame(tick);
    };

    if (counters.length > 0) {
      if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            obs.unobserve(entry.target);
            animateCounter(entry.target);
          });
        }, { threshold: 0.6 });
        counters.forEach(c => obs.observe(c));
      } else {
        counters.forEach(animateCounter);
      }
    }
  } catch (err) { console.error('[Counters]', err); }

  try {
    const qaNav    = $$('.qa-nav button');
    const qaTopics = $$('.qa-topic');
    const qaImages = $$('.qa-visual-img');
    const qaLabel  = $('#qaLabel');
    const qaLabelT = $('#qaLabelTitle');

    const topicMeta = {
      finde:        { n: 'Escena 01', t: 'Fin de semana' },
      libertadores: { n: 'Escena 02', t: 'Copa Libertadores' },
      marvel:       { n: 'Escena 03', t: 'Universo Marvel' }
    };

    qaNav.forEach(btn => {
      btn.addEventListener('click', () => {
        const topic = btn.dataset.topic;
        qaNav.forEach(b => b.classList.toggle('active', b === btn));
        qaTopics.forEach(t => t.classList.toggle('active', t.dataset.topic === topic));
        qaImages.forEach(img => img.classList.toggle('active', img.dataset.topic === topic));
        if (qaLabel)  qaLabel.textContent  = topicMeta[topic].n;
        if (qaLabelT) qaLabelT.textContent = topicMeta[topic].t;
      });
    });

    $$('.qa-item').forEach(item => {
      const btn    = $('.qa-question', item);
      const answer = $('.qa-answer',   item);
      if (!btn || !answer) return;
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        const panel  = item.closest('.qa-topic');
        if (panel) {
          $$('.qa-item', panel).forEach(i => {
            i.classList.remove('open');
            const a = $('.qa-answer', i);
            if (a) a.style.maxHeight = null;
          });
        }
        if (!isOpen) {
          item.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  } catch (err) { console.error('[Atención Visual]', err); }

  try {
    $$('.lock-form').forEach(form => {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const card = form.closest('.fan-card');
        if (!card) return;
        const claveCorrecta = (card.dataset.clave || '').toLowerCase();
        const input   = $('.lock-input', form);
        const msg     = form.parentElement.querySelector('.lock-msg');
        const overlay = card.querySelector('.lock-overlay');
        const content = card.querySelector('.lock-content');
        const success = card.querySelector('.lock-success');
        if (!input) return;

        const valor = input.value.trim().toLowerCase().replace(/\s+/g, '');
        if (valor === claveCorrecta) {
          if (overlay) overlay.classList.add('hidden');
          if (content) content.classList.remove('blurred');
          if (success) {
            success.classList.add('show');
            setTimeout(() => success.classList.remove('show'), 1400);
          }
          input.classList.remove('err');
          if (msg) msg.textContent = '';
        } else {
          input.classList.add('err');
          if (msg) msg.textContent = '❌ Clave incorrecta. Piensa: ¿qué pronombres van aquí?';
          setTimeout(() => input.classList.remove('err'), 500);
        }
      });
    });
  } catch (err) { console.error('[Memoria]', err); }

  try {
    const stackContainer = $('#stackContainer');
    const nextBtn  = $('#nextCard');
    const prevBtn  = $('#prevCard');
    const counterE = $('#stackCounter');
    const totalE   = $('#stackTotal');

    if (stackContainer && nextBtn && prevBtn) {
      const stackData = [
        { id: 'A', text: 'Con el tiempo tan medido a las seis de la tarde, ¿lo apoyas al Atlético-MG en la final de la Copa Libertadores o prefieres ver la que es la película más esperada de Marvel?' },
        { id: 'B', text: 'Tienes el informe listo y empieza el partido. ¿Prefieres entregarlo a tu jefe antes de las seis o verlo a escondidas en la oficina?' },
        { id: 'C', text: 'Estreno de Marvel y la final del Atlético-MG son a la misma hora. Si solo puedes grabar uno: ¿Prefieres verlo en vivo o verla en la primera función?' },
        { id: 'D', text: 'Tu jefe tiene su objetivo claro, el informe, y tú tienes el tuyo, la final de la Libertadores. ¿Prefieres cumplir con el de él o arriesgarte por el tuyo?' },
        { id: 'E', text: 'Tienes dos entradas para el cine. ¿Prefieres invitarla a ella (tu compañera de trabajo que te ayuda con el informe) o invitarlo a él (tu amigo que tiene la camiseta del Atlético-MG)?' },
        { id: 'F', text: 'Ante este gran problema laboral, ¿te organizas para cumplir con tu deber en el trabajo o prefieres escaparte al cine a ver el estreno de Marvel?' }
      ];
      const totalCards = stackData.length;
      let stackIndex = 0;

      if (totalE) totalE.textContent = totalCards;

      const renderStack = () => {
        stackContainer.innerHTML = '';
        stackData.forEach((card, i) => {
          const el = document.createElement('div');
          el.className = 'stack-card';
          el.dataset.idx = i;
          el.innerHTML = `
            <div class="stack-card-inner">
              <span class="chip">${card.id}</span>
              <p>${card.text}</p>
            </div>
          `;
          stackContainer.appendChild(el);
        });
        updatePositions();
      };

      const updatePositions = () => {
        const cards = $$('.stack-card', stackContainer);
        cards.forEach((card, i) => {
          const offset = (i - stackIndex + totalCards) % totalCards;
          if (offset === 0) card.dataset.pos = '0';
          else if (offset === 1) card.dataset.pos = '1';
          else if (offset === 2) card.dataset.pos = '2';
          else if (offset === 3) card.dataset.pos = '3';
          else card.dataset.pos = 'hidden';
        });
        if (counterE) counterE.textContent = stackIndex + 1;
      };

      const nextFn = () => {
        const top = stackContainer.querySelector('.stack-card[data-pos="0"]');
        if (!top) return;
        top.classList.add('leaving');
        setTimeout(() => {
          top.classList.remove('leaving');
          stackIndex = (stackIndex + 1) % totalCards;
          updatePositions();
        }, 550);
      };

      const prevFn = () => {
        stackIndex = (stackIndex - 1 + totalCards) % totalCards;
        updatePositions();
      };

      nextBtn.addEventListener('click', nextFn);
      prevBtn.addEventListener('click', prevFn);

      let tStart = 0;
      stackContainer.addEventListener('touchstart', e => {
        tStart = e.changedTouches[0].screenX;
      }, { passive: true });
      stackContainer.addEventListener('touchend', e => {
        const diff = tStart - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 60) {
          if (diff > 0) nextFn();
          else prevFn();
        }
      }, { passive: true });

      renderStack();
    }
  } catch (err) { console.error('[Stack]', err); }

  try {
    const typeMap = { od: 'od-hl', oi: 'oi-hl', rx: 'rx-hl', ps: 'ps-hl' };
    $$('.lyrics-body .pron').forEach(el => {
      el.addEventListener('click', () => {
        const cls = typeMap[el.dataset.type];
        if (!cls) return;
        if (el.classList.contains(cls)) {
          el.classList.remove(cls);
        } else {
          Object.values(typeMap).forEach(c => el.classList.remove(c));
          el.classList.add(cls);
        }
      });
    });

    const videoFacade = $('#videoFacade');
    if (videoFacade) {
      const openVideo = () => window.open('https://www.youtube.com/watch?v=1m7TF2nVV1c', '_blank', 'noopener');
      videoFacade.addEventListener('click', openVideo);
      videoFacade.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openVideo(); }
      });
    }
  } catch (err) { console.error('[Oído]', err); }

  try {
    const gapsData = [
      { sentence: '¿El proyecto de capacitación de Coca-Cola? _____ presenté al presidente ayer.', answer: ['lo'], gabarito: 'Lo — sustituye el OD masculino singular «el proyecto».' },
      { sentence: 'Cuando el equipo de RH. tiene un problema crítico, _____ reunimos para resolverlo.', answer: ['nos'], gabarito: 'Nos — reflexivo plural: nosotros nos reunimos.' },
      { sentence: 'Esa camiseta del Atlético Mineiro para la final de la Libertadores es muy bonita. ¿Es _____?', answer: ['tuya', 'tuyo'], gabarito: 'Tuya — posesivo femenino singular que concuerda con «camiseta».' },
      { sentence: 'El director _____ pidió el informe de clima organizacional con urgencia.', answer: ['le'], gabarito: 'Le — objeto indirecto: pidió a él / a ella.' },
      { sentence: 'Para no estresarse en el trabajo, Tony Stark _____ concentra viendo películas de Marvel.', answer: ['se'], gabarito: 'Se — reflexivo: él se concentra.' },
      { sentence: 'La nueva playlist de rock en Spotify está increíble. _____ escucho todos los días camino a la oficina.', answer: ['la'], gabarito: 'La — OD femenino singular: «la playlist».' },
      { sentence: 'Antes de comenzar la reunión de planificación estratégica, el equipo _____ organiza intercambiando ideas.', answer: ['se'], gabarito: 'Se — reflexivo: el equipo se organiza.' },
      { sentence: 'La victoria del Flamengo en el Maracaná fue emocionante. ¡El trofeo de la Libertadores ahora es _____!', answer: ['nuestro'], gabarito: 'Nuestro — posesivo masculino singular de posesión colectiva.' },
      { sentence: 'Peter Parker olvidó los documentos en el laboratorio y _____ entregué en su escritorio.', answer: ['se'], gabarito: 'Se — variante de «le» delante de lo/la.' },
      { sentence: 'Mi rutina de ejercicios matutinos me hace _____ sentir mucho más energía para trabajar.', answer: ['me'], gabarito: 'Me — reflexivo / OD: me siento.' }
    ];

    const gapsGrid = $('#gapsGrid');

    const normalizar = (s) => String(s || '').trim().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[¿?¡!.,;:]/g, '');

    const renderGaps = () => {
      if (!gapsGrid) return;
      gapsGrid.innerHTML = '';
      gapsData.forEach((g, i) => {
        const item = document.createElement('div');
        item.className = 'gap-item';
        item.innerHTML = `
          <span class="gap-num">LACUNA ${String(i + 1).padStart(2, '0')}</span>
          <p class="gap-sentence">
            ${g.sentence.replace('_____', `<input type="text" class="gap-input" data-idx="${i}" placeholder="..." autocomplete="off" spellcheck="false" aria-label="Respuesta lacuna ${i + 1}">`)}
          </p>
          <div class="gap-feedback" data-fb="${i}"></div>
        `;
        gapsGrid.appendChild(item);
      });
    };

    renderGaps();
    console.log('[Lacunas] Renderizadas:', $$('.gap-input').length, 'inputs');

    document.addEventListener('click', (e) => {
      const btnCheck = e.target.closest('#btnGapsCheck');
      const btnReset = e.target.closest('#btnGapsReset');

      if (btnCheck) {
        console.log('[Lacunas] Botón COMPROBAR clicado');
        const inputs = $$('.gap-input');
        console.log('[Lacunas] Inputs encontrados:', inputs.length);

        inputs.forEach(inp => {
          try {
            const idx = parseInt(inp.dataset.idx, 10);
            const val = normalizar(inp.value);
            const item = inp.closest('.gap-item');
            const fb   = item.querySelector('.gap-feedback');
            const data = gapsData[idx];

            if (!data) {
              console.warn('[Lacunas] No hay data para idx', idx);
              return;
            }

            const correct = data.answer.some(a => normalizar(a) === val);

            item.classList.remove('correct', 'wrong');
            inp.classList.remove('correct', 'wrong');
            fb.classList.remove('show', 'ok', 'err');

            if (correct) {
              item.classList.add('correct');
              inp.classList.add('correct');
              fb.classList.add('show', 'ok');
              fb.innerHTML = `<strong>¡Correcto!</strong> ${data.gabarito}`;
            } else {
              item.classList.add('wrong');
              inp.classList.add('wrong');
              fb.classList.add('show', 'err');
              fb.innerHTML = `<strong>Casi.</strong> Respuesta correcta: <strong>${data.answer[0]}</strong> — ${data.gabarito}`;
            }
          } catch (innerErr) {
            console.error('[Lacunas] Error en input', inp, innerErr);
          }
        });

        const firstWrong = document.querySelector('.gap-item.wrong');
        if (firstWrong) firstWrong.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      if (btnReset) {
        console.log('[Lacunas] Botón REINICIAR clicado');
        renderGaps();
      }
    });
  } catch (err) { console.error('[Lacunas]', err); }

  try {
    const tfData = [
      { stmt: 'En «Yo le dije la verdad al manager», el pronombre <em>le</em> funciona correctamente como objeto indirecto.', correct: true, why: 'Verdadero — indica a quién fue dicha la verdad.' },
      { stmt: 'Es correcto decir en español «Presenté él» sustituyendo el objeto directo por «él» sin el pronombre adecuado.', correct: false, why: 'Falso — lo correcto es «lo presenté».' },
      { stmt: 'En «Nosotros nos levantamos temprano», el pronombre <em>nos</em> es un reflexivo plural correcto.', correct: true, why: 'Verdadero — acompaña la acción reflexiva de la 1ª persona plural.' },
      { stmt: 'La palabra <em>tuyo</em> es un pronombre personal oblicuo átono de objeto directo.', correct: false, why: 'Falso — «tuyo» es posesivo.' },
      { stmt: 'En «Thor se levanta el martillo», el uso de <em>se</em> es incorrecto en esta posición transitiva directa sin reflexividad real.', correct: true, why: 'Verdadero — «el martillo» es OD; el reflexivo no aplica así.' },
      { stmt: 'El pronombre <em>lo</em> puede sustituir un sustantivo femenino singular como «la música».', correct: false, why: 'Falso — para femenino singular se usa «la».' },
      { stmt: 'En «El jefe nos dio las directrices», el pronombre <em>nos</em> actúa como objeto indirecto (a nosotros).', correct: true, why: 'Verdadero — indica el destinatario de la acción de dar.' },
      { stmt: 'El posesivo <em>nuestro</em> concuerda en género y número con el sustantivo que acompaña (ej.: nuestra rutina).', correct: true, why: 'Verdadero — los posesivos flexionan según la cosa poseída.' },
      { stmt: 'El pronombre reflexivo para la 3ª persona del singular es <em>me</em>.', correct: false, why: 'Falso — el reflexivo de la 3ª persona es «se».' },
      { stmt: 'El cambio de <em>le</em> por <em>se</em> ocurre obligatoriamente cuando el OD (lo/la/los/las) viene justo después (ej.: se lo dije).', correct: true, why: 'Verdadero — regla eufónica: le lo → se lo.' }
    ];

    const tfGrid = $('#tfGrid');
    let tfCompletadas = 0;

    const renderTF = () => {
      if (!tfGrid) return;
      tfGrid.innerHTML = '';
      tfData.forEach((t, i) => {
        const item = document.createElement('div');
        item.className = 'tf-item';
        item.innerHTML = `
          <div class="tf-statement">
            <span class="tf-num">AFIRMACIÓN ${String(i + 1).padStart(2, '0')}</span>
            ${t.stmt}
          </div>
          <div class="tf-controls">
            <button type="button" class="tf-btn" data-idx="${i}" data-val="true">Verdadero</button>
            <button type="button" class="tf-btn" data-idx="${i}" data-val="false">Falso</button>
          </div>
          <div class="tf-feedback"></div>
        `;
        tfGrid.appendChild(item);
      });
    };

    renderTF();

    if (tfGrid) {
      tfGrid.addEventListener('click', e => {
        const btn = e.target.closest('.tf-btn');
        if (!btn || btn.classList.contains('disabled')) return;
        const idx = parseInt(btn.dataset.idx, 10);
        const val = btn.dataset.val === 'true';
        const item = btn.closest('.tf-item');
        const fb = item.querySelector('.tf-feedback');
        const allBtns = $$('.tf-btn', item);
        allBtns.forEach(b => b.classList.add('disabled'));

        const isCorrect = val === tfData[idx].correct;
        item.classList.remove('correct', 'wrong');
        fb.classList.remove('show', 'ok', 'err');

        if (isCorrect) {
          btn.classList.add('selected-correct');
          item.classList.add('correct');
          fb.classList.add('show', 'ok');
          fb.innerHTML = `<strong>¡Correcto!</strong> ${tfData[idx].why}`;
        } else {
          btn.classList.add('selected-wrong');
          item.classList.add('wrong');
          allBtns.forEach(b => {
            if ((b.dataset.val === 'true') === tfData[idx].correct) b.classList.add('reveal-correct');
          });
          fb.classList.add('show', 'err');
          fb.innerHTML = `<strong>Revisa.</strong> ${tfData[idx].why}`;
        }

        tfCompletadas++;
        if (tfCompletadas === tfData.length) setTimeout(dispararConfetes, 400);
      });
    }

    document.addEventListener('click', e => {
      if (e.target.closest('#btnTfReset')) {
        tfCompletadas = 0;
        renderTF();
      }
    });
  } catch (err) { console.error('[TF]', err); }

  try {
    const plumaTabs = $$('.pluma-tab');
    plumaTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const panel = tab.dataset.panel;
        plumaTabs.forEach(t => t.classList.toggle('active', t === tab));
        $$('.pluma-panel').forEach(p => {
          p.classList.toggle('active', p.id === 'panel-' + panel);
        });
      });
    });
  } catch (err) { console.error('[Tabs Pluma]', err); }

  try {
    const tareaText = 'Hasta la próxima clase, intenta enviarme un audio corto de 30 segundos en nuestro chat privado contándome qué película de Marvel vio tu hijo recientemente, usando al menos un «lo» o un «le» en la frase.';
    const tareaEl = $('#tareaTyping');
    const cursorHTML = '<span class="type-cursor"></span>';
    let typingStarted = false;

    const startTyping = () => {
      if (typingStarted || !tareaEl) return;
      typingStarted = true;
      console.log('[Micro-tarea] Iniciando typing');
      let i = 0;
      const step = () => {
        if (i <= tareaText.length) {
          tareaEl.innerHTML = tareaText.slice(0, i) + cursorHTML;
          i++;
          setTimeout(step, 22);
        } else {
          tareaEl.innerHTML = tareaText;
        }
      };
      step();
    };

    if (tareaEl) {
      
      if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) { startTyping(); obs.disconnect(); }
          });
        }, { threshold: 0.1, rootMargin: '0px 0px 100px 0px' });
        obs.observe(tareaEl);
      }

      const onScroll = () => {
        const rect = tareaEl.getBoundingClientRect();
        if (rect.top < window.innerHeight - 50 && rect.bottom > 0) {
          startTyping();
          window.removeEventListener('scroll', onScroll);
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });

      setTimeout(onScroll, 300);

      setTimeout(startTyping, 6000);
    }
  } catch (err) { console.error('[Micro-tarea]', err); }

  let canvas, ctx;
  let confettiPieces = [];
  let confettiAnim = null;

  function dispararConfetes() {
    try {
      canvas = canvas || $('#confetti-canvas');
      if (!canvas) return;
      ctx = ctx || canvas.getContext('2d');
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;

      const COLORS = ['#B7794A', '#D89A6A', '#4C5146', '#A69C6C', '#F3F0E8', '#6B4423'];
      confettiPieces = [];
      for (let i = 0; i < 200; i++) {
        confettiPieces.push({
          x: Math.random() * canvas.width,
          y: Math.random() * -canvas.height,
          w: 5 + Math.random() * 8,
          h: 8 + Math.random() * 12,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          vx: (Math.random() - 0.5) * 2.2,
          vy: 2 + Math.random() * 3.5,
          rot: Math.random() * Math.PI * 2,
          vrot: (Math.random() - 0.5) * 0.22,
          op: 1
        });
      }
      if (confettiAnim) cancelAnimationFrame(confettiAnim);
      animateConfetti();
    } catch (err) { console.error('[Confetti]', err); }
  }

  function animateConfetti() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let allOut = true;
    confettiPieces.forEach(c => {
      c.x += c.vx; c.y += c.vy; c.vy += 0.055; c.rot += c.vrot;
      if (c.y < canvas.height + 40) allOut = false;
      if (c.y > canvas.height - 120) c.op = Math.max(0, c.op - 0.02);
      ctx.save();
      ctx.globalAlpha = c.op;
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rot);
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
      ctx.restore();
    });
    if (!allOut) confettiAnim = requestAnimationFrame(animateConfetti);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  /* Delegación para botón "Celebrar" */
  document.addEventListener('click', e => {
    if (e.target.closest('#btnCelebrate')) dispararConfetes();
  });

  /* Resize canvas */
  window.addEventListener('resize', () => {
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  });

  try {
    $$('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (id.length > 1) {
          const target = $(id);
          if (target) {
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.pageYOffset - 60;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        }
      });
    });
  } catch (err) { console.error('[Anchors]', err); }

  console.log('[Lourvix] Todas las funcionalidades inicializadas ✓');
})();