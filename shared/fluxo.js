/* =========================================================
   Curso de IA — shared/fluxo.js
   Fluxo desenhado e animado, etapa por etapa (padrão aprovado:
   lento, sem autoplay, o professor avança fluxo a fluxo).

   <div class="fluxo" data-titulo="…">
     <script type="application/json">{
       "altura": 360,
       "nos": [{"id":"a","x":12,"y":50,"rot":"Você","sub":"escreve","ic":"🙋"}],
       "passos": [{"acende":["a"],"pacote":{"de":"a","para":"b","txt":"pedido"},
                   "legenda":"…","muda":{"b":"novo subtítulo"},"marca":{"b":"ok"}}]
     }</script>
   </div>
   x/y em % do palco. "ic" pode ser emoji ou caminho de .svg/.png.
   "marca": ok | alerta | erro (cor do nó a partir da etapa).
   ========================================================= */
(function () {
  const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NS = 'http://www.w3.org/2000/svg';

  function monta(raiz) {
    const cfg = JSON.parse(raiz.querySelector('script[type="application/json"]').textContent);
    const nos = Object.fromEntries(cfg.nos.map(n => [n.id, n]));
    const ligs = cfg.ligacoes || [];
    raiz.insertAdjacentHTML('beforeend', `
      <div class="fluxo-topo"><span class="fluxo-tit">${raiz.dataset.titulo || 'fluxo'}</span><span class="fluxo-cont"></span></div>
      <div class="fluxo-rolo"><div class="fluxo-palco" style="height:${cfg.altura || 340}px">
        <svg class="fluxo-linhas" aria-hidden="true"></svg>
      </div></div>
      <p class="fluxo-leg" aria-live="polite"></p>
      <div class="fluxo-ctrl">
        <button class="btn" type="button" data-f="ant">‹ Anterior</button>
        <button class="btn" type="button" data-f="rep">↺ Repetir etapa</button>
        <button class="btn prim" type="button" data-f="prox">Começar ›</button>
      </div>`);
    const palco = raiz.querySelector('.fluxo-palco');
    const svg = raiz.querySelector('.fluxo-linhas');
    const leg = raiz.querySelector('.fluxo-leg');
    const cont = raiz.querySelector('.fluxo-cont');
    const bAnt = raiz.querySelector('[data-f="ant"]');
    const bRep = raiz.querySelector('[data-f="rep"]');
    const bProx = raiz.querySelector('[data-f="prox"]');
    const passos = cfg.passos;
    const els = {};

    cfg.nos.forEach(n => {
      const d = document.createElement('div');
      d.className = 'fluxo-no' + (n.largo ? ' largo' : '');
      d.style.left = n.x + '%'; d.style.top = n.y + '%';
      const ic = n.ic && /\.(svg|png|jpg)$/.test(n.ic)
        ? `<img src="${n.ic}" alt="" class="fluxo-ic${n.mono ? ' mono' : ''}">`
        : `<span class="fluxo-ic">${n.ic || ''}</span>`;
      d.innerHTML = `${ic}<b></b><small></small>`;
      d.querySelector('b').textContent = n.rot;
      d.querySelector('small').textContent = n.sub || '';
      palco.appendChild(d);
      els[n.id] = d;
    });

    const centro = (id) => {
      const p = palco.getBoundingClientRect(), r = els[id].getBoundingClientRect();
      return [r.left - p.left + r.width / 2, r.top - p.top + r.height / 2];
    };
    const curva = (a, b, k) => {
      const [x1, y1] = centro(a), [x2, y2] = centro(b);
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      const dx = x2 - x1, dy = y2 - y1;
      const cx = mx - dy * (k ?? 0.12), cy = my + dx * (k ?? 0.12);
      return `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`;
    };
    const linhas = {};
    function desenhaLinhas() {
      svg.setAttribute('viewBox', `0 0 ${palco.clientWidth} ${palco.clientHeight}`);
      svg.innerHTML = '';
      const todas = new Map();
      ligs.forEach(([a, b, k]) => todas.set(a + '>' + b, [a, b, k]));
      passos.forEach(p => { if (p.pacote) { const { de, para, curva: k } = p.pacote; if (!todas.has(de + '>' + para)) todas.set(de + '>' + para, [de, para, k]); } });
      todas.forEach(([a, b, k], chave) => {
        const path = document.createElementNS(NS, 'path');
        path.setAttribute('d', curva(a, b, k));
        path.setAttribute('class', 'fluxo-linha');
        svg.appendChild(path);
        linhas[chave] = path;
      });
    }

    let i = -1, vez = 0;
    function estado(ate) {
      Object.values(els).forEach(e => { e.classList.remove('aceso', 'ok', 'alerta', 'erro', 'visto'); });
      Object.values(linhas).forEach(l => l.classList.remove('feita', 'agora'));
      cfg.nos.forEach(n => { els[n.id].querySelector('small').textContent = n.sub || ''; });
      for (let k = 0; k <= ate; k++) {
        const p = passos[k];
        (p.acende || []).forEach(id => els[id] && els[id].classList.add('visto'));
        Object.entries(p.muda || {}).forEach(([id, t]) => { els[id].querySelector('small').textContent = t; });
        Object.entries(p.marca || {}).forEach(([id, m]) => { els[id].classList.remove('ok', 'alerta', 'erro'); if (m) els[id].classList.add(m); });
        if (p.pacote) { const l = linhas[p.pacote.de + '>' + p.pacote.para]; l && l.classList.add('feita'); }
      }
      if (ate >= 0) (passos[ate].acende || []).forEach(id => els[id] && els[id].classList.add('aceso'));
      leg.innerHTML = ate < 0 ? (cfg.inicio || 'Aperte <b>Começar</b> e avance uma etapa por vez.') : passos[ate].legenda;
      cont.textContent = ate < 0 ? passos.length + ' etapas' : 'etapa ' + (ate + 1) + ' de ' + passos.length;
      bAnt.disabled = ate < 0;
      bRep.disabled = ate < 0;
      bProx.disabled = ate >= passos.length - 1;
      bProx.textContent = ate < 0 ? 'Começar ›' : ate >= passos.length - 1 ? 'Fim' : 'Próxima etapa ›';
    }
    function anima(k) {
      const minha = ++vez;
      raiz.querySelectorAll('.fluxo-pacote').forEach(p => p.remove());
      const p = passos[k];
      if (!p.pacote || reduz) return;
      const { de, para, txt } = p.pacote;
      const l = linhas[de + '>' + para];
      if (l) { l.classList.add('agora'); l.classList.remove('feita'); }
      const chip = document.createElement('span');
      chip.className = 'fluxo-pacote' + (p.pacote.tipo ? ' ' + p.pacote.tipo : '');
      chip.textContent = txt || '';
      chip.style.offsetPath = `path("${curva(de, para, p.pacote.curva)}")`;
      palco.appendChild(chip);
      const ani = chip.animate([{ offsetDistance: '0%', opacity: 0 }, { offsetDistance: '8%', opacity: 1, offset: 0.1 }, { offsetDistance: '92%', opacity: 1, offset: 0.9 }, { offsetDistance: '100%', opacity: 0 }],
        { duration: p.pacote.ms || 2200, easing: 'cubic-bezier(.45,0,.25,1)', fill: 'forwards' });
      els[para].classList.remove('aceso');
      ani.onfinish = () => {
        if (minha !== vez) return;
        chip.remove();
        if (l) { l.classList.remove('agora'); l.classList.add('feita'); }
        (p.acende || []).forEach(id => els[id] && els[id].classList.add('aceso'));
        els[para].animate([{ transform: 'translate(-50%,-50%) scale(1.08)' }, { transform: 'translate(-50%,-50%) scale(1)' }], { duration: 380, easing: 'ease-out' });
      };
    }
    bProx.addEventListener('click', () => { if (i < passos.length - 1) { i++; estado(i); anima(i); } });
    bAnt.addEventListener('click', () => { if (i >= 0) { i--; vez++; raiz.querySelectorAll('.fluxo-pacote').forEach(p => p.remove()); estado(i); } });
    bRep.addEventListener('click', () => { if (i >= 0) { estado(i); anima(i); } });

    const prepara = () => { desenhaLinhas(); estado(i); };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(prepara); else prepara();
    let t; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(prepara, 150); });
    prepara();
  }

  document.querySelectorAll('.fluxo').forEach(monta);
})();
