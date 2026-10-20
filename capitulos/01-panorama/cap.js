/* =========================================================
   Capítulo 1 · Panorama — simulações do capítulo
   Tudo avança por ação do aluno (nada começa sozinho).
   Motion (motion.dev) dá as molas quando carrega; sem ele,
   a Web Animations API nativa faz o mesmo papel.
   ========================================================= */
(function () {
  const { $, $$, reduz } = window.CURSO;
  const espera = (ms) => new Promise(r => setTimeout(r, reduz ? 0 : ms));
  const anima = (el, kf, opts = {}) => {
    if (reduz || !el) return;
    try {
      if (window.Motion && window.Motion.animate) return window.Motion.animate(el, kf, opts);
    } catch (e) { /* cai para a animação nativa */ }
    const frames = Object.keys(kf).length ? [Object.fromEntries(Object.entries(kf).map(([k, v]) => [k, v[0]])), Object.fromEntries(Object.entries(kf).map(([k, v]) => [k, v[v.length - 1]]))] : [];
    return el.animate(frames, { duration: (opts.duration || 0.4) * 1000, easing: 'cubic-bezier(.22,1,.36,1)' });
  };
  const mola = { type: 'spring', stiffness: 420, damping: 22 };

  /* ═════════ SIM 1 · máquina da próxima palavra ═════════ */
  (function () {
    const raiz = $('#sim-palavra'); if (!raiz) return;
    const CENARIOS = {
      vago: {
        pedido: 'Escreva um e-mail para o cliente.',
        passos: [
          ['Prezado', [['Prezado', 31], ['Olá', 27], ['Caro', 22], ['Bom dia', 20]]],
          ['cliente,', [['cliente,', 34], ['senhor,', 25], ['(a)', 21], ['amigo,', 20]]],
          ['espero', [['espero', 30], ['gostaríamos', 26], ['venho', 24], ['segue', 20]]],
          ['que', [['que', 82], ['estar', 8], ['muito', 6], ['sinceramente', 4]]],
          ['esteja', [['esteja', 64], ['tudo', 20], ['você', 10], ['seu', 6]]],
          ['bem.', [['bem.', 78], ['ótimo.', 12], ['bem!', 6], ['em', 4]]],
          ['Gostaríamos', [['Gostaríamos', 27], ['Venho', 26], ['Escrevo', 24], ['Temos', 23]]],
          ['de', [['de', 84], ['muito', 8], ['imensamente', 5], ['hoje', 3]]],
          ['apresentar', [['apresentar', 26], ['informar', 25], ['oferecer', 25], ['lembrar', 24]]],
          ['nossos', [['nossos', 28], ['uma', 26], ['as', 24], ['algumas', 22]]],
          ['serviços.', [['serviços.', 30], ['produtos.', 28], ['novidades.', 22], ['soluções.', 20]]]
        ],
        fim: '<b>Pronto, e genérico.</b> "Apresentar nossos serviços" serve para qualquer empresa e qualquer cliente. Repare como as barras ficaram quase empatadas nas palavras que importam: a IA estava chutando.'
      },
      claro: {
        pedido: 'Sou da Aurora Assessoria (contabilidade). Escreva ao Supermercado Bom Preço pedindo o extrato bancário de setembro para fecharmos a conciliação. Tom cordial, 3 linhas.',
        passos: [
          ['Prezados,', [['Prezados,', 58], ['Olá,', 22], ['Bom dia,', 14], ['Caros,', 6]]],
          ['para', [['para', 52], ['solicitamos', 30], ['gostaríamos', 12], ['segue', 6]]],
          ['fecharmos', [['fecharmos', 61], ['concluirmos', 24], ['finalizarmos', 11], ['fazermos', 4]]],
          ['a', [['a', 90], ['nossa', 6], ['toda', 3], ['uma', 1]]],
          ['conciliação', [['conciliação', 86], ['contabilidade', 8], ['folha', 4], ['declaração', 2]]],
          ['de', [['de', 88], ['do', 6], ['bancária', 4], ['referente', 2]]],
          ['setembro,', [['setembro,', 91], ['outubro,', 4], ['agosto,', 3], ['do mês,', 2]]],
          ['pedimos', [['pedimos', 57], ['solicitamos', 33], ['precisamos', 8], ['queremos', 2]]],
          ['o', [['o', 92], ['por', 5], ['gentilmente', 2], ['que', 1]]],
          ['extrato', [['extrato', 88], ['comprovante', 6], ['relatório', 4], ['arquivo', 2]]],
          ['bancário', [['bancário', 84], ['completo', 9], ['de', 5], ['mensal', 2]]],
          ['do', [['do', 70], ['referente', 20], ['de', 8], ['da', 2]]],
          ['período.', [['período.', 62], ['mês.', 28], ['setembro.', 8], ['ano.', 2]]]
        ],
        fim: '<b>Pronto, e utilizável.</b> Com cliente, documento e mês na conversa, uma barra disparava quase toda vez. O texto saiu específico porque o contexto estreitou as opções.'
      }
    };
    let cen = 'vago', i = 0, ocupado = false, rodando = false;
    const elPedido = $('#np-pedido'), elTexto = $('#np-texto'), elCands = $('#np-cands'), elLeg = $('#np-legenda');
    const bProx = $('#np-prox'), bTudo = $('#np-tudo');

    function desenhaTexto(nova) {
      const passos = CENARIOS[cen].passos.slice(0, i);
      elTexto.replaceChildren();
      passos.forEach(([w], k) => {
        const s = document.createElement('span');
        s.textContent = w;
        if (k === i - 1 && nova) { s.className = 'np-palavra'; }
        elTexto.append(s, document.createTextNode(' '));
      });
      const c = document.createElement('span'); c.className = 'cursor'; elTexto.append(c);
      if (nova) anima(elTexto.querySelector('.np-palavra'), { transform: ['scale(.6)', 'scale(1)'], opacity: [0, 1] }, mola);
    }
    function reset() {
      i = 0; ocupado = false; rodando = false;
      elPedido.textContent = CENARIOS[cen].pedido;
      desenhaTexto(false);
      elCands.innerHTML = '<p class="np-vazio">As possibilidades para a próxima palavra aparecem aqui.</p>';
      elLeg.innerHTML = 'Aperte <b>Próxima palavra</b> para ver a IA calcular e escolher.';
      bProx.disabled = false; bTudo.disabled = false;
    }
    async function passo(rapido) {
      const passos = CENARIOS[cen].passos;
      if (ocupado || i >= passos.length) return;
      ocupado = true;
      const [escolha, cands] = passos[i];
      elCands.replaceChildren();
      const linhas = cands.map(([w, p]) => {
        const d = document.createElement('div'); d.className = 'cand';
        d.innerHTML = '<div class="cand-barra"></div><b></b><span></span>';
        d.querySelector('b').textContent = w;
        d.querySelector('span').textContent = p + '%';
        elCands.append(d);
        return [d, p, w];
      });
      requestAnimationFrame(() => linhas.forEach(([d, p]) => (d.querySelector('.cand-barra').style.width = p + '%')));
      const topo = cands[0][1];
      elLeg.innerHTML = topo < 40
        ? '<b>Barras parecidas:</b> várias continuações têm chance quase igual. A IA está em dúvida.'
        : topo >= 75 ? '<b>Uma barra dispara:</b> o que está na conversa praticamente decidiu a palavra.'
        : '<b>Uma opção na frente,</b> mas ainda há concorrência.';
      await espera(rapido ? 260 : 800);
      linhas.forEach(([d, , w]) => { if (w === escolha) d.classList.add('escolhida'); });
      await espera(rapido ? 140 : 350);
      i++;
      desenhaTexto(true);
      if (i >= passos.length) {
        elLeg.innerHTML = CENARIOS[cen].fim;
        bProx.disabled = true; bTudo.disabled = true;
      }
      ocupado = false;
    }
    bProx.addEventListener('click', () => passo(false));
    bTudo.addEventListener('click', async () => {
      if (rodando) return; rodando = true; bTudo.disabled = true;
      const meu = cen;
      while (rodando && cen === meu && i < CENARIOS[cen].passos.length) await passo(true);
      rodando = false;
    });
    $('#np-reset').addEventListener('click', reset);
    $$('.cenario', raiz).forEach(b => b.addEventListener('click', () => {
      cen = b.dataset.cenario;
      $$('.cenario', raiz).forEach(x => x.setAttribute('aria-pressed', x === b));
      reset();
    }));
    reset();
  })();

  /* ═════════ CENA NARRADA · a multa (vozes locais) ═════════ */
  (function () {
    const raiz = $('#sim-fonte'); if (!raiz) return;
    const FALAS = {
      0: [['MARTA', 'Tico, o Bom Preço quer saber: quanto paga de multa se cancelar o contrato com a RefriTec?'], ['LLM', 'Hum. O contrato não está na nossa conversa. Mas eu sei muito bem como uma resposta sobre multa costuma soar.']],
      1: [['LLM', 'A multa por rescisão é de cinco mil reais, conforme a cláusula nona.']],
      2: [['MARTA', 'Cinco mil? Cláusula nona? De onde você tirou isso?'], ['LLM', 'De lugar nenhum. Eu escrevi o que parecia uma resposta certa. Valor, cláusula, tom profissional. E nada disso veio do contrato. Isso tem nome: alucinação.']],
      3: [['MARTA', 'Então toma. Aqui está o contrato, as quarenta e uma páginas.'], ['LLM', 'Agora a conversa mudou. A multa é de catorze mil e setecentos reais, o equivalente a duas mensalidades. Está na cláusula quinta.']],
      4: [['LLM', 'Mas não acredite só em mim. Abra o trecho que eu citei e confira com os seus olhos.'], ['MARTA', 'Valor, cláusula e trecho conferido. Isso eu mando para o cliente.']]
    };
    const ULTIMO = 4;
    const NOMES = { MARTA: 'Marta', LLM: 'Tico · a IA' };
    const RESP_SEM = 'A multa por rescisão é de R$ 5.000,00, conforme a Cláusula Nona.';
    const RESP_COM = 'Multa de R$ 14.700,00, o equivalente a duas mensalidades (Cláusula Quinta).';
    const trilhas = window.MULTA_AUDIO || {};
    const temAudio = Object.keys(trilhas).length > 0;
    const bPlay = $('#cena-play'), bPasso = $('#cena-passo'), bSom = $('#cena-som');
    const falaMarta = $('#fala-marta'), falaTico = $('#fala-tico'), tico = $('.ator-tico', raiz);
    const quem = $('#cena-quem'), legenda = $('#cena-texto'), prog = $('#cena-progresso');
    let passo = -1, tocando = false, mudo = false, audio = null, id = 0, timer = null;
    bSom.hidden = !temAudio;

    async function digita(el, texto, vez) {
      if (reduz) { el.textContent = texto; return; }
      el.textContent = '';
      for (let k = 1; k <= texto.length; k++) {
        if (vez !== id) { el.textContent = texto; return; }
        el.textContent = texto.slice(0, k);
        await new Promise(r => setTimeout(r, 22));
      }
    }
    function falaDe(papel, texto) {
      const alvo = papel === 'MARTA' ? falaMarta : falaTico;
      alvo.textContent = texto; alvo.classList.add('on');
      quem.textContent = NOMES[papel]; legenda.textContent = texto;
    }
    function aplica(p, vez) {
      raiz.dataset.passo = Math.max(p, 0);
      prog.textContent = 'passo ' + (p + 1) + ' de ' + (ULTIMO + 1);
      tico.classList.toggle('pensando', p === 0);
      if (p < 1) { $('#resp-sem').innerHTML = '<span class="dim">aguardando…</span>'; }
      if (p < 3) { $('#resp-com').innerHTML = '<span class="dim">aguardando…</span>'; }
      if (p === 1) digita($('#resp-sem'), RESP_SEM, vez);
      if (p > 1) $('#resp-sem').textContent = RESP_SEM;
      if (p === 3) digita($('#resp-com'), RESP_COM, vez);
      if (p > 3) $('#resp-com').textContent = RESP_COM;
      if (p === 2) anima($('#lado-sem .selo'), { transform: ['scale(2.2) rotate(-14deg)', 'scale(1) rotate(-6deg)'] }, mola);
      if (p === 3) anima($('#c-pdf'), { transform: ['translateX(60px) scale(.8)', 'translateX(0) scale(1)'] }, mola);
      if (p === 4) anima($('#lado-com .selo'), { transform: ['scale(2.2) rotate(-14deg)', 'scale(1) rotate(-6deg)'] }, mola);
      (FALAS[p] || []).forEach(([papel, t]) => {
        const alvo = papel === 'MARTA' ? falaMarta : falaTico;
        alvo.textContent = t; alvo.classList.remove('on');
      });
    }
    function cancela() {
      id++; clearTimeout(timer); delete raiz.dataset.falando;
      if (audio) { audio.onended = audio.onerror = null; audio.pause(); audio = null; }
    }
    function para() {
      tocando = false; cancela();
      bPlay.textContent = passo >= ULTIMO ? '▶ Assistir de novo' : '▶ Assistir';
    }
    function tocaPasso() {
      const vez = ++id;
      const clips = (FALAS[passo] || []).map(([papel, t], k) => ({ papel, t, arq: ((trilhas['0-' + passo] || [])[k] || {}).file }));
      let k = 0;
      const prox = () => {
        if (vez !== id || !tocando) return;
        delete raiz.dataset.falando;
        if (k >= clips.length) {
          timer = setTimeout(() => {
            if (vez !== id || !tocando) return;
            if (passo >= ULTIMO) { para(); quem.textContent = 'Cena concluída'; return; }
            passo++; aplica(passo, id + 1); tocaPasso();
          }, mudo || !temAudio ? 2600 : 500);
          return;
        }
        const c = clips[k++];
        falaDe(c.papel, c.t);
        raiz.dataset.falando = c.papel.toLowerCase();
        if (mudo || !c.arq) { timer = setTimeout(prox, 900 + c.t.length * 45); return; }
        const a = new Audio('teatro-multa/audio/' + c.arq);
        audio = a;
        a.onended = prox;
        a.onerror = prox;
        a.play().catch(() => { if (vez === id) { legenda.textContent = c.t + ' (áudio indisponível, siga pela legenda)'; timer = setTimeout(prox, 900 + c.t.length * 45); } });
      };
      prox();
    }
    bPlay.addEventListener('click', () => {
      if (tocando) { para(); return; }
      tocando = true; bPlay.textContent = 'Ⅱ Pausar';
      if (passo < 0 || passo >= ULTIMO) { passo = 0; }
      aplica(passo, id + 1);
      tocaPasso();
    });
    bPasso.addEventListener('click', () => {
      para();
      if (passo >= ULTIMO) return;
      passo++; aplica(passo, id);
      const ult = (FALAS[passo] || []).slice(-1)[0];
      if (ult) { quem.textContent = NOMES[ult[0]]; legenda.textContent = ult[1]; }
      (FALAS[passo] || []).forEach(([papel]) => (papel === 'MARTA' ? falaMarta : falaTico).classList.add('on'));
    });
    $('#cena-reset').addEventListener('click', () => {
      para(); passo = -1; raiz.dataset.passo = 0;
      falaMarta.textContent = ''; falaTico.textContent = '';
      falaMarta.classList.remove('on'); falaTico.classList.remove('on');
      tico.classList.remove('pensando');
      $('#resp-sem').innerHTML = $('#resp-com').innerHTML = '<span class="dim">aguardando…</span>';
      quem.textContent = 'Marta e Tico';
      legenda.textContent = 'Aperte Assistir para ouvir a cena, ou avance passo a passo em silêncio.';
      prog.textContent = 'passo 0 de ' + (ULTIMO + 1);
      bPlay.textContent = '▶ Assistir';
    });
    bSom.addEventListener('click', () => {
      mudo = !mudo; bSom.setAttribute('aria-pressed', !mudo);
      bSom.textContent = mudo ? '🔇 Sem voz' : '🔊 Vozes';
      if (tocando) { cancela(); tocaPasso(); }
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden && tocando) para(); });
    new IntersectionObserver(e => { if (!e[0].isIntersecting && tocando) para(); }).observe(raiz);
    prog.textContent = 'passo 0 de ' + (ULTIMO + 1);
    raiz.dataset.passo = 0;
  })();

  /* ═════════ MONTADOR · o briefing de 4 peças ═════════ */
  (function () {
    const raiz = $('#sim-briefing'); if (!raiz) return;
    const PECAS = [['contexto', 'Contexto'], ['objetivo', 'Objetivo'], ['formato', 'Formato'], ['restricoes', 'Restrições']];
    const AREAS = [
      { nome: 'Contabilidade',
        fraco: 'Escreva um e-mail para cliente.',
        contexto: 'Sou contadora na Aurora Assessoria e atendo pequenos comércios.',
        objetivo: 'Escreva um e-mail ao cliente Supermercado Bom Preço pedindo o extrato bancário de setembro para fecharmos a conciliação.',
        formato: 'Até 5 linhas, com assunto e uma lista do que preciso.',
        restricoes: 'Tom cordial e direto. Não invente prazos nem valores.',
        resp: ['Prezado cliente,\nEsperamos que esteja bem! Gostaríamos de apresentar nossos serviços e nos colocar à disposição para o que precisar…',
               'Prezados,\nPara fecharmos a conciliação de setembro, precisamos do extrato bancário do período. Podem enviar até sexta, dia 10?\n⚠ prazo inventado: você não informou nenhum.',
               'Assunto: Extrato de setembro para a conciliação\nPrezados, para fecharmos a conciliação de setembro precisamos de:\n• extrato bancário completo de setembro\nFicamos à disposição. Obrigada!'] },
      { nome: 'Jurídico',
        fraco: 'Faça uma notificação.',
        contexto: 'Sou advogada da Aurora Assessoria. Nosso cliente é locador de uma sala comercial.',
        objetivo: 'Redija uma notificação extrajudicial cobrando três aluguéis em atraso do locatário.',
        formato: 'Uma página, com campos em branco [NOME], [VALOR] e [DATA].',
        restricoes: 'Linguagem formal e clara. Não cite artigos de lei nem invente valores.',
        resp: ['NOTIFICAÇÃO\nPela presente, fica Vossa Senhoria notificado acerca dos fatos a seguir expostos…\n(notificação de quê? para quem? a IA decide sozinha)',
               'NOTIFICAÇÃO EXTRAJUDICIAL\nFica o locatário notificado do débito de R$ 4.500,00 referente a aluguéis, nos termos do art. 62 da lei do inquilinato…\n⚠ valor e artigo vieram do "provável", não de você.',
               'NOTIFICAÇÃO EXTRAJUDICIAL\nNotificante: [NOME] · Notificado: [NOME]\nFica V. Sa. notificado(a) do atraso de três aluguéis, no total de [VALOR], vencidos até [DATA]. Solicitamos a regularização no prazo de [PRAZO]…'] },
      { nome: 'Administrativo e RH',
        fraco: 'Crie um comunicado.',
        contexto: 'Trabalho no RH da Aurora Assessoria, uma equipe de 25 pessoas.',
        objetivo: 'Escreva um comunicado avisando que o ponto passa a ser registrado pelo aplicativo a partir do mês que vem.',
        formato: 'Mensagem curta para o grupo da equipe, com 3 passos numerados.',
        restricoes: 'Tom acolhedor, sem jargão. Não invente o nome do aplicativo nem datas.',
        resp: ['Prezados colaboradores,\nInformamos que haverá mudanças importantes em nossos processos internos. Contamos com a colaboração de todos…',
               'Pessoal, a partir do mês que vem o ponto será pelo app PontoFácil! Baixem até o dia 25.\n⚠ nome do app e data inventados.',
               'Oi, equipe! A partir do mês que vem, o ponto passa a ser registrado pelo aplicativo.\n1. Instale o app indicado pelo RH\n2. Entre com o seu e-mail da empresa\n3. Registre entrada e saída por ele\nDúvidas? Chamem o RH. 😊'] },
      { nome: 'Educação',
        fraco: 'Faça uma prova.',
        contexto: 'Sou professora do 9º ano e trabalhei fotossíntese nesta semana.',
        objetivo: 'Crie 5 questões de múltipla escolha sobre fotossíntese.',
        formato: '4 alternativas cada, com gabarito comentado no final.',
        restricoes: 'Linguagem do 9º ano. Nada de respiração celular, que ainda não dei.',
        resp: ['Prova\n1. O que é a vida?\n2. Explique as causas da Revolução Francesa…\n(prova de quê? para qual série?)',
               '1. Qual organela realiza a fotossíntese?\na) mitocôndria b) cloroplasto c) ribossomo d) núcleo\n⚠ sem gabarito, e a questão 5 cobra respiração celular.',
               '1. Onde ocorre a fotossíntese na célula vegetal?\na) núcleo b) cloroplasto c) parede celular d) vacúolo\n…\nGabarito: 1-b. O cloroplasto tem clorofila, que capta a luz.'] },
      { nome: 'Comercial e marketing',
        fraco: 'Faça um post.',
        contexto: 'Cuido do marketing de uma clínica odontológica de bairro.',
        objetivo: 'Crie um post para o Instagram divulgando a avaliação gratuita de clareamento.',
        formato: 'Legenda de até 80 palavras, com chamada para agendar pelo WhatsApp.',
        restricoes: 'Sem promessa de resultado e sem preço (regra do conselho profissional).',
        resp: ['✨ Venha conhecer nossos serviços! Qualidade e excelência para você! #sucesso #foco',
               'Sorriso branco garantido em 1 sessão! 😁 Clareamento por apenas R$ 299…\n⚠ promessa de resultado e preço: o conselho proíbe.',
               'Quer um sorriso mais claro? 😁 Agende sua avaliação gratuita de clareamento: a dentista avalia o que é indicado para você. Chame no WhatsApp e escolha o melhor horário!'] }
    ];
    let area = 0;
    const ligadas = new Set();
    const elAreas = $('#mb-areas'), elPecas = $('#mb-pecas'), elPed = $('#mb-pedido'), elResp = $('#mb-resp');
    const elMed = $('#mb-medidor'), elPct = $('#mb-pct'), elRot = $('#mb-rot'), elLeg = $('#mb-legenda');

    AREAS.forEach((a, k) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'mb-area'; b.textContent = a.nome;
      b.addEventListener('click', () => { area = k; desenha(); });
      elAreas.append(b);
    });
    PECAS.forEach(([chave, nome]) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'mb-peca'; b.dataset.peca = chave; b.textContent = nome;
      b.addEventListener('click', () => { ligadas.has(chave) ? ligadas.delete(chave) : ligadas.add(chave); desenha(chave); });
      elPecas.append(b);
    });
    function desenha(nova) {
      const a = AREAS[area];
      $$('.mb-area', elAreas).forEach((b, k) => b.setAttribute('aria-pressed', k === area));
      $$('.mb-peca', elPecas).forEach(b => b.setAttribute('aria-pressed', ligadas.has(b.dataset.peca)));
      elPed.replaceChildren();
      const linhas = [];
      if (ligadas.has('contexto')) linhas.push(['contexto', a.contexto]);
      linhas.push(ligadas.has('objetivo') ? ['objetivo', a.objetivo] : ['', a.fraco]);
      if (ligadas.has('formato')) linhas.push(['formato', a.formato]);
      if (ligadas.has('restricoes')) linhas.push(['restricoes', a.restricoes]);
      linhas.forEach(([cls, t], k) => {
        const s = document.createElement('span');
        if (cls) s.className = 't-' + cls;
        if (cls !== nova) s.style.animation = 'none';
        s.textContent = t + (k < linhas.length - 1 ? '\n' : '');
        elPed.append(s);
      });
      const n = ligadas.size;
      const nivel = n <= 1 ? 0 : n <= 3 ? 1 : 2;
      elResp.textContent = a.resp[nivel];
      if (nova) anima(elResp, { opacity: [0.3, 1], transform: ['translateY(6px)', 'translateY(0)'] }, { duration: 0.4 });
      const pct = [100, 78, 55, 33, 10][n];
      elMed.style.width = pct + '%';
      elMed.style.background = pct > 60 ? 'var(--bad)' : pct > 30 ? 'var(--warn)' : 'var(--ok)';
      elPct.textContent = pct + '%';
      elRot.textContent = n === 4 ? '✨ briefing completo' : n === 0 ? 'pedido fraco' : n + ' de 4 peças';
      elLeg.innerHTML = n === 4 ? '<b>Quase nada para adivinhar.</b> Copie e leve para a Prática A.'
        : ligadas.has('restricoes') ? 'Ligue as outras peças para fechar o briefing.'
        : n >= 2 ? '<b>Repare no ⚠:</b> sem restrições, a IA preenche lacunas com o "provável". Ligue <b>Restrições</b>.'
        : 'Ligue as peças na ordem que quiser.';
    }
    $('#mb-limpar').addEventListener('click', () => { ligadas.clear(); desenha(); });
    desenha();
  })();

  /* ═════════ SEMÁFORO · o que pode ir para um chat ═════════ */
  (function () {
    const raiz = $('#semaforo'); if (!raiz) return;
    const LUZES = { verde: ['verde', '🟢 Verde'], amarela: ['amarela', '🟡 Amarelo'], vermelha: ['vermelha', '🔴 Vermelho'] };
    const DADOS = [
      ['Modelo de e-mail de cobrança, sem nome de cliente', 'verde', 'Texto genérico, sem dado de ninguém. Pode colar.'],
      ['Senha do portal da prefeitura ou de um órgão público', 'vermelha', 'Senha nunca vai para um chat, nem "só para testar".'],
      ['Planilha da folha de pagamento com nomes e salários', 'amarela', 'Troque os nomes por "Funcionário 1, 2, 3" antes. Para a IA, o que importa é o padrão da planilha.'],
      ['Texto de uma lei ou norma pública', 'verde', 'É público. Pode colar, e ainda dá à IA a fonte certa.'],
      ['Prontuário de paciente com nome e diagnóstico', 'vermelha', 'Dado de saúde é dado sensível pela LGPD. Siga a regra do seu conselho e da sua instituição.'],
      ['Contrato de um cliente, para revisar uma cláusula', 'amarela', 'Cole só a cláusula, sem nomes, CPF, CNPJ e valores. Se a empresa tiver ferramenta aprovada, use ela.'],
      ['Foto do cartão de crédito ou dados bancários completos', 'vermelha', 'Dado financeiro completo não vai para chat. Ponto.'],
      ['Ata de reunião interna, sem dados pessoais', 'verde', 'Em geral pode, se a política da empresa permitir. Na dúvida, pergunte antes.']
    ];
    let feitos = 0, certos = 0;
    const placar = $('#semaforo-placar');
    const atualiza = () => {
      placar.textContent = feitos === 0 ? 'Classifique cada dado. A resposta aparece na hora.'
        : feitos < DADOS.length ? `${certos} de ${feitos} certos até aqui.`
        : `Você acertou ${certos} de ${DADOS.length}. ${certos === DADOS.length ? 'Semáforo afinado.' : 'Releia os que ficaram vermelhos na borda.'}`;
    };
    DADOS.forEach(([texto, certa, porque]) => {
      const card = document.createElement('div'); card.className = 'dado';
      const p = document.createElement('p'); p.textContent = texto;
      const botoes = document.createElement('div'); botoes.className = 'dado-botoes';
      const fb = document.createElement('div'); fb.className = 'dado-fb';
      Object.entries(LUZES).forEach(([chave, [, rotulo]]) => {
        const b = document.createElement('button'); b.type = 'button'; b.className = 'dado-btn'; b.textContent = rotulo;
        b.addEventListener('click', () => {
          const ok = chave === certa;
          $$('.dado-btn', botoes).forEach(x => (x.disabled = true));
          b.classList.add('marcado');
          card.classList.add(ok ? 'certo' : 'errado');
          fb.innerHTML = '';
          const tit = document.createElement('b');
          tit.textContent = ok ? '✅ Isso. ' : `❌ Era ${LUZES[certa][1]}. `;
          fb.append(tit, document.createTextNode(porque));
          fb.classList.add('on');
          feitos++; if (ok) certos++; atualiza();
          anima(card, { transform: ['scale(.97)', 'scale(1)'] }, mola);
        });
        botoes.append(b);
      });
      card.append(p, botoes, fb);
      raiz.append(card);
    });
    atualiza();
  })();

  /* ═════════ CHAT × AGENTE · 30 e-mails ═════════ */
  (function () {
    const raiz = $('#sim-agente'); if (!raiz) return;
    const pChat = $$('#pista-chat li'), pAg = $$('#pista-agente li');
    const cChat = $('#cont-chat'), cAg = $('#cont-agente'), leg = $('#agente-legenda');
    const bPlay = $('#agente-play');
    let vez = 0;
    const marca = (lista, k) => lista.forEach((li, j) => li.classList.toggle('agora', j === k));
    function reset() {
      vez++; marca(pChat, -1); marca(pAg, -1);
      cChat.textContent = cAg.textContent = '0';
      $$('.pista', raiz).forEach(p => p.classList.remove('fim'));
      leg.textContent = 'Os dois jeitos começam juntos. Quem termina primeiro?';
      bPlay.disabled = false;
    }
    async function chat(minha) {
      for (let n = 1; n <= 30; n++) {
        for (let k = 0; k < 5; k++) {
          if (minha !== vez) return;
          marca(pChat, k); await espera(n <= 2 ? 380 : 110);
        }
        cChat.textContent = n;
      }
      marca(pChat, -1); pChat[0].closest('.pista').classList.add('fim');
    }
    async function agente(minha) {
      const tempos = [1100, 1300, 0, 0, 900];
      for (let k = 0; k < 5; k++) {
        if (minha !== vez) return;
        marca(pAg, k);
        if (k === 2) { leg.innerHTML = '<b>O agente parou e pediu permissão.</b> Nada acontece sem o seu ok.'; await espera(1800); leg.textContent = 'Permissão dada. Mãos à obra.'; }
        else if (k === 3) { for (let n = 1; n <= 30; n++) { if (minha !== vez) return; cAg.textContent = n; await espera(45); } }
        else await espera(tempos[k]);
      }
      if (minha !== vez) return;
      marca(pAg, -1); pAg[0].closest('.pista').classList.add('fim');
      leg.innerHTML = `<b>O agente terminou os 30 rascunhos</b> enquanto, no chat, você está no e-mail ${cChat.textContent}.`;
    }
    bPlay.addEventListener('click', async () => {
      reset(); bPlay.disabled = true;
      const minha = vez;
      await Promise.all([chat(minha), agente(minha)]);
      if (minha !== vez) return;
      leg.innerHTML = '<b>No chat: 150 copiar e colar.</b> Com o agente: um pedido, uma permissão e uma conferência. Isso é o Capítulo 2.';
      bPlay.disabled = false; bPlay.textContent = '▶ De novo';
    });
    $('#agente-reset').addEventListener('click', reset);
  })();
})();

/* mitos × realidade: virar a carta */
document.querySelectorAll('.mito').forEach(m => m.addEventListener('click', () => m.classList.toggle('virado')));
