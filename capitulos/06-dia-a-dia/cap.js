/* Capítulo 6 · simuladores: máquina do tempo e planejador do seu fluxo */
(function () {
  const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ═════════ MÁQUINA DO TEMPO ═════════ */
  (function () {
    const raiz = document.getElementById('sim-tempo'); if (!raiz) return;
    const MUDANCAS = [
      { rot: 'título maior', aplica: s => ({ ...s, titulo: 30 }) },
      { rot: 'fundo claro', aplica: s => ({ ...s, fundo: '#f5efe6', texto: '#1d1714' }) },
      { rot: 'seção “Como eu ajudo”', aplica: s => ({ ...s, cartoes: 3 }) },
      { rot: 'reorganizou as pastas e quebrou o site', quebra: true, aplica: s => ({ ...s, quebrado: true }) },
      { rot: 'botão de contato', aplica: s => ({ ...s, botao: true }) }
    ];
    const inicial = { titulo: 20, fundo: '#28231f', texto: '#f5efe8', cartoes: 0, botao: false, quebrado: false };
    let estado = { ...inicial }, pontos = [{ nome: 'estado inicial', s: { ...inicial } }], historico = [], prox = 0;
    const linha = document.getElementById('mt-linha'), site = document.getElementById('mt-site'), leg = document.getElementById('mt-leg');
    function desenhaSite() {
      if (estado.quebrado) { site.innerHTML = '<div class="mt-erro">⚠️ Página não encontrada<br><small>os arquivos mudaram de lugar</small></div>'; site.style.background = ''; return; }
      site.style.background = estado.fundo; site.style.color = estado.texto;
      site.innerHTML = `<b style="font-size:${estado.titulo}px">Marta Andrade</b><small>Consultoria contábil para pequenos negócios</small>` +
        (estado.cartoes ? '<div class="mt-cartoes">' + '<span></span>'.repeat(estado.cartoes) + '</div>' : '') +
        (estado.botao ? '<span class="mt-botao">Fale comigo</span>' : '');
      if (!reduz) site.animate([{ transform: 'scale(.98)', opacity: .6 }, { transform: 'none', opacity: 1 }], { duration: 300 });
    }
    function desenhaLinha() {
      linha.replaceChildren();
      const itens = [];
      pontos.forEach((p, i) => itens.push({ tipo: 'ponto', txt: p.nome, i }));
      historico.forEach(h => itens.push({ tipo: h.quebra ? 'quebra' : 'mudanca', txt: h.rot }));
      itens.forEach(it => {
        const s = document.createElement('span');
        s.className = 'mt-item ' + it.tipo;
        s.textContent = (it.tipo === 'ponto' ? '📌 ' : it.tipo === 'quebra' ? '💥 ' : '✏️ ') + it.txt;
        linha.appendChild(s);
      });
    }
    document.getElementById('mt-mudar').addEventListener('click', () => {
      const m = MUDANCAS[prox % MUDANCAS.length]; prox++;
      estado = m.aplica(estado); historico.push(m);
      desenhaSite(); desenhaLinha();
      leg.innerHTML = m.quebra ? '<b>Quebrou.</b> E agora? Se você criou um ponto antes, é só voltar.' : `Mudança: <b>${m.rot}</b>. Gostou? Crie um ponto.`;
    });
    document.getElementById('mt-ponto').addEventListener('click', () => {
      if (estado.quebrado) { leg.innerHTML = '<b>Melhor não salvar um ponto quebrado.</b> Volte primeiro.'; return; }
      pontos.push({ nome: 'ponto ' + pontos.length, s: { ...estado } }); historico = [];
      desenhaLinha(); leg.innerHTML = '<b>Ponto criado.</b> Daqui para trás, nada se perde.';
    });
    document.getElementById('mt-voltar').addEventListener('click', () => {
      const p = pontos[pontos.length - 1];
      estado = { ...p.s }; const desfeitas = historico.length; historico = [];
      desenhaSite(); desenhaLinha();
      leg.innerHTML = desfeitas ? `<b>Voltou ao “${p.nome}”.</b> ${desfeitas} mudança(s) desfeita(s) num clique.` : 'Nada para desfazer desde o último ponto.';
    });
    desenhaSite(); desenhaLinha();
  })();

  /* ═════════ PLANEJADOR DO SEU FLUXO ═════════ */
  (function () {
    const raiz = document.getElementById('sim-fluxo'); if (!raiz) return;
    const $ = id => document.getElementById(id);
    const ONDE = { pasta: 'nos arquivos da pasta que eu abrir', planilha: 'na planilha [NOME DA PLANILHA]', site: 'no site [ENDEREÇO], que você vai abrir no Chrome', email: 'nos meus e-mails ou na minha agenda (pelo conector)', cabeca: 'nas informações que vou escrever abaixo' };
    const SAIDA = { docs: 'um documento para cada pessoa ou cliente, numa pasta nova', planilha: 'uma planilha resumo com os pontos de atenção', mensagens: 'rascunhos de mensagem, um por pessoa, para eu revisar e enviar', texto: 'um texto pronto para eu revisar' };
    function ferramenta(onde, saida, freq) {
      const f = [];
      f.push(onde === 'site' ? 'Claude Code + Claude in Chrome (Capítulo 6)' : onde === 'email' ? 'Claude com Conectores (Capítulo 5)' : 'Claude Code na pasta do assunto (Capítulos 2 a 4)');
      if (saida === 'docs') f.push('piloto antes do lote (Capítulo 4)');
      if (saida === 'mensagens') f.push('rascunho e você aperta enviar (Capítulo 4)');
      if (saida === 'texto') f.push('arquivo de regras ou Skill para o tom (Capítulo 5)');
      if (freq !== 'sob') f.push('tarefa agendada no app (Capítulo 6)');
      return f;
    }
    function desenha() {
      const tarefa = $('pl-tarefa').value.trim() || '[sua tarefa]';
      const onde = $('pl-onde').value, saida = $('pl-saida').value, freq = $('pl-freq').value;
      const quando = { sob: '', semana: 'Vou repetir isto toda semana. ', dia: 'Vou repetir isto todo dia. ' }[freq];
      const pedido = `Quero automatizar esta tarefa: ${tarefa}.\nOs dados estão ${ONDE[onde]}.\nO resultado deve ser ${SAIDA[saida]}.\n${quando}Antes de fazer, me mostre o plano. Comece por um piloto com um único caso.\nNada é enviado para fora sem a minha aprovação. No final, faça um relatório do que mudou.`;
      const box = $('pl-saida-box');
      box.innerHTML = '<span class="np-rot">seu pedido pronto</span><div class="prompt"><div class="prompt-topo"><span class="rot">✨ primeira automação</span><button class="btn-copiar" type="button">📋 copiar</button></div><pre></pre></div><span class="np-rot">o que usar do curso</span><ul class="check pl-ferr"></ul>';
      box.querySelector('pre').textContent = pedido;
      const ul = box.querySelector('.pl-ferr');
      ferramenta(onde, saida, freq).forEach(t => { const li = document.createElement('li'); li.textContent = t; ul.appendChild(li); });
      const bc = box.querySelector('.btn-copiar');
      bc.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(pedido); } catch (e) {}
        bc.textContent = '✓ copiado'; setTimeout(() => (bc.textContent = '📋 copiar'), 1500);
      });
    }
    ['pl-tarefa', 'pl-onde', 'pl-saida', 'pl-freq'].forEach(id => $(id).addEventListener('input', desenha));
    desenha();
  })();
})();
