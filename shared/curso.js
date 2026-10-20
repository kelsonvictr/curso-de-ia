/* =========================================================
   Curso de IA — Programa AI  ·  shared/curso.js
   Comportamentos comuns a todos os capítulos: tema, progresso,
   índice, copiar prompt, quiz, abas de estação e entrada suave.
   Sem dependência externa — a página funciona offline.
   ========================================================= */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.CURSO = { $, $$, reduz };

  /* ---------- tema claro/escuro (lembrado por pessoa) ---------- */
  const raiz = document.documentElement;
  try {
    const salvo = localStorage.getItem('curso-ia-tema');
    if (salvo) raiz.dataset.theme = salvo;
  } catch (e) {}
  const btnTema = $('#btn-tema');
  if (btnTema) {
    const rotulo = () => {
      const claro = raiz.dataset.theme === 'light';
      btnTema.textContent = claro ? '🌙' : '☀️';
      btnTema.setAttribute('aria-label', claro ? 'Usar tema escuro' : 'Usar tema claro');
    };
    rotulo();
    btnTema.addEventListener('click', () => {
      raiz.dataset.theme = raiz.dataset.theme === 'light' ? 'dark' : 'light';
      try { localStorage.setItem('curso-ia-tema', raiz.dataset.theme); } catch (e) {}
      rotulo();
    });
  }

  /* ---------- barra de progresso ---------- */
  const barra = $('.progresso');
  if (barra) {
    const atualiza = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      barra.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + '%';
    };
    addEventListener('scroll', atualiza, { passive: true });
    atualiza();
  }

  /* ---------- índice (gaveta) ---------- */
  const indice = $('.indice'), veu = $('.veu');
  const abreIndice = (abrir) => {
    if (!indice) return;
    indice.classList.toggle('aberto', abrir);
    veu && veu.classList.toggle('ativo', abrir);
    if (abrir) { const a = $('a', indice); a && a.focus(); }
  };
  $$('[data-abre-indice]').forEach(b => b.addEventListener('click', () => abreIndice(true)));
  $$('[data-fecha-indice]').forEach(b => b.addEventListener('click', () => abreIndice(false)));
  veu && veu.addEventListener('click', () => abreIndice(false));
  addEventListener('keydown', e => { if (e.key === 'Escape') abreIndice(false); });
  if (indice) {
    $$('a', indice).forEach(a => a.addEventListener('click', () => abreIndice(false)));
    const links = $$('a[href^="#"]', indice);
    const alvos = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
    const io = new IntersectionObserver(ents => {
      ents.forEach(en => {
        if (!en.isIntersecting) return;
        links.forEach(a => a.classList.toggle('ativo', a.getAttribute('href') === '#' + en.target.id));
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    alvos.forEach(s => io.observe(s));
  }

  /* ---------- copiar prompt ---------- */
  $$('.btn-copiar').forEach(btn => {
    btn.addEventListener('click', async () => {
      const pre = $('pre', btn.closest('.prompt'));
      const texto = pre ? pre.innerText : '';
      try {
        await navigator.clipboard.writeText(texto);
      } catch (e) {
        const ta = document.createElement('textarea');
        ta.value = texto; document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); } catch (e2) {}
        ta.remove();
      }
      const antes = btn.textContent;
      btn.textContent = '✓ copiado';
      btn.classList.add('ok');
      setTimeout(() => { btn.textContent = antes; btn.classList.remove('ok'); }, 1600);
    });
  });

  /* ---------- quiz: feedback imediato + tentar de novo ---------- */
  $$('[data-quiz]').forEach(q => {
    const ops = $$('.quiz-op', q), fb = $('.quiz-fb', q);
    ops.forEach(op => op.addEventListener('click', () => {
      const certa = op.hasAttribute('data-certa');
      ops.forEach(o => (o.disabled = true));
      op.classList.add(certa ? 'certa' : 'errada');
      const porque = op.dataset.fb || (certa ? fb.dataset.ok : fb.dataset.erro) || '';
      fb.innerHTML = `<b>${certa ? '✅ Isso.' : '❌ Ainda não.'}</b> ${porque}`;
      if (!certa) {
        const b = document.createElement('button');
        b.className = 'btn quiz-de-novo'; b.type = 'button'; b.textContent = '↺ Tentar de novo';
        b.addEventListener('click', () => {
          ops.forEach(o => { o.disabled = false; o.classList.remove('certa', 'errada'); });
          fb.classList.remove('on'); fb.innerHTML = '';
          ops[0].focus();
        });
        fb.appendChild(document.createElement('br'));
        fb.appendChild(b);
      }
      fb.classList.add('on');
    }));
  });

  /* ---------- abas (estações por área) ---------- */
  $$('[data-abas]').forEach(grupo => {
    const abas = $$('.aba', grupo);
    const seleciona = (aba) => {
      abas.forEach(a => {
        const on = a === aba;
        a.setAttribute('aria-selected', on);
        a.tabIndex = on ? 0 : -1;
        const p = document.getElementById(a.getAttribute('aria-controls'));
        p && p.classList.toggle('ativo', on);
      });
    };
    abas.forEach((a, i) => {
      a.addEventListener('click', () => seleciona(a));
      a.addEventListener('keydown', e => {
        const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        const prox = abas[(i + d + abas.length) % abas.length];
        seleciona(prox); prox.focus();
      });
    });
    seleciona(abas.find(a => a.getAttribute('aria-selected') === 'true') || abas[0]);
  });

  /* ---------- entrada suave ao rolar ---------- */
  const revelas = $$('.revela');
  if (reduz || !('IntersectionObserver' in window)) {
    revelas.forEach(el => el.classList.add('visto'));
  } else {
    const io = new IntersectionObserver(ents => ents.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('visto'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    revelas.forEach(el => io.observe(el));
  }
})();
