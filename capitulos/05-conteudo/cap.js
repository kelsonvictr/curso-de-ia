/* Capítulo 5 · simuladores: curadoria de questões e montador de Skill */
(function () {
  /* ═════════ CURADORIA ═════════ */
  (function () {
    const lista = document.getElementById('cur-lista'); if (!lista) return;
    const Q = [
      { q: 'Pela regra dos 72, a 8% ao ano, o dinheiro dobra em aproximadamente:', alt: ['72 anos', '9 anos', '8 anos', '6 anos'], gab: 'b', certa: 'aprovar',
        fb: 'Está na apostila (72 / 8 = 9), uma só correta e o gabarito bate. Pode aprovar.' },
      { q: 'Qual é a taxa Selic atual?', alt: ['10,5%', '11,25%', '13,75%', '15%'], gab: 'c', certa: 'cortar',
        fb: 'A apostila não fala de Selic. Questão fora do conteúdo, e com número que a IA pode ter inventado. Corte.' },
      { q: 'Onde os juros compostos aparecem CONTRA você?', alt: ['rotativo do cartão', 'cheque especial', 'poupança', 'parcelamento longo com juros'], gab: 'a', certa: 'corrigir',
        fb: 'A apostila cita três casos contra você: cartão, cheque especial e parcelamento longo. Há três alternativas certas. Corrija: “qual NÃO aparece contra você?” (poupança).' },
      { q: 'R$ 1.000,00 a 1% ao mês, com juros compostos. Quanto há no fim do mês 2?', alt: ['R$ 1.020,00', 'R$ 1.020,10', 'R$ 1.010,00', 'R$ 1.021,00'], gab: 'a', certa: 'corrigir',
        fb: 'O gabarito está errado: o certo é R$ 1.020,10 (b), exatamente o exemplo da apostila. R$ 1.020,00 seria juros simples. Corrija o gabarito.' }
    ];
    const ROT = { aprovar: '✅ Aprovar', cortar: '✂️ Cortar', corrigir: '🔧 Corrigir' };
    let feitos = 0, certos = 0;
    const placar = document.getElementById('cur-placar');
    Q.forEach((item, n) => {
      const c = document.createElement('div'); c.className = 'cur-q';
      const alts = item.alt.map((a, i) => `<li${'abcd'[i] === item.gab ? ' class="gab"' : ''}><b>${'abcd'[i]})</b> ${a}</li>`).join('');
      c.innerHTML = `<p class="cur-enun"><b>Questão ${n + 1}.</b> </p><ul class="cur-alts">${alts}</ul><small class="cur-gab">gabarito proposto pela IA: ${item.gab}</small><div class="cur-botoes"></div><p class="cur-fb"></p>`;
      c.querySelector('.cur-enun').appendChild(document.createTextNode(item.q));
      const bx = c.querySelector('.cur-botoes'), fb = c.querySelector('.cur-fb');
      Object.entries(ROT).forEach(([k, r]) => {
        const b = document.createElement('button'); b.type = 'button'; b.className = 'btn'; b.textContent = r;
        b.addEventListener('click', () => {
          const ok = k === item.certa;
          bx.querySelectorAll('button').forEach(x => (x.disabled = true));
          b.classList.add('marcado'); c.classList.add(ok ? 'certo' : 'errado');
          fb.innerHTML = `<b>${ok ? 'Isso.' : 'Melhor: ' + ROT[item.certa] + '.'}</b> `;
          fb.appendChild(document.createTextNode(item.fb));
          feitos++; if (ok) certos++;
          placar.textContent = feitos < Q.length ? `${certos} de ${feitos} certas até aqui.` : `Curadoria concluída: ${certos} de ${Q.length}. Em prova gerada por IA, procure: fora do conteúdo, mais de uma certa e gabarito errado.`;
        });
        bx.appendChild(b);
      });
      lista.appendChild(c);
    });
  })();

  /* ═════════ MONTADOR DE SKILL ═════════ */
  (function () {
    const raiz = document.getElementById('sim-skill'); if (!raiz) return;
    const nome = document.getElementById('sk-nome'), desc = document.getElementById('sk-desc'), inst = document.getElementById('sk-inst');
    const arq = document.getElementById('sk-arquivo'), res = document.getElementById('sk-resultado'), box = document.getElementById('sk-pedidos');
    const PEDIDOS = ['Escreva 3 legendas para o Dia dos Pais', 'Crie um post de LinkedIn sobre a Termo 500', 'Resuma o contrato da RefriTec', 'Monte uma prova de juros compostos', 'Ideias de texto para o Instagram da loja'];
    const norm = t => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    const raiz5 = w => w.slice(0, 5);
    const PARADA = new Set(['quando', 'pedir', 'pedirem', 'para', 'sobre', 'textos', 'texto', 'crie', 'escreva', 'monte', 'aurora', 'com', 'uma', 'use', 'usar']);
    const palavras = t => norm(t).split(/[^a-z0-9]+/).filter(w => w.length > 3 && !PARADA.has(w)).map(raiz5);
    function slug(t) { return norm(t).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'minha-skill'; }
    function desenha() {
      arq.textContent = `---\nname: ${slug(nome.value)}\ndescription: ${desc.value.trim()}\n---\n\n${inst.value.trim()}\n`;
    }
    function testa(p, botao) {
      box.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b === botao));
      const d = new Set(palavras(desc.value));
      const comum = palavras(p).filter(w => d.has(w));
      res.className = 'sk-resultado ' + (comum.length ? 'usa' : 'nao-usa');
      res.innerHTML = comum.length
        ? `<b>✅ Skill “${slug(nome.value)}” carregada.</b> O pedido combina com a descrição. O agente segue as instruções: ${inst.value.trim().split('\n')[0].replace(/^\d+\.\s*/, '').toLowerCase()}…`
        : `<b>— Skill não usada.</b> Nada no pedido combina com a descrição. O agente faz do jeito padrão. Se esse pedido devia usar a Skill, melhore a descrição.`;
    }
    PEDIDOS.forEach(p => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'mb-area'; b.textContent = p;
      b.addEventListener('click', () => testa(p, b));
      box.appendChild(b);
    });
    [nome, desc, inst].forEach(e => e.addEventListener('input', () => {
      desenha();
      const sel = box.querySelector('[aria-pressed="true"]'); if (sel) testa(sel.textContent, sel);
    }));
    desenha();
  })();
})();
