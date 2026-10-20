/* Capítulo 2 · simulador "Você é o porteiro" */
(function () {
  const raiz = document.getElementById('sim-porteiro'); if (!raiz) return;
  const PEDIDOS = [
    { ic: '📂', t: 'Quero listar os arquivos da pasta bagunca.', s: 'ferramenta: ler pasta', certa: 'aprovar',
      fb: 'Ler não altera nada, e é exatamente o que você pediu. Na prática, no modo Manual, leitura nem costuma pedir permissão.' },
    { ic: '📝', t: 'Posso criar o arquivo diario.txt com o resumo?', s: 'ferramenta: criar arquivo · dentro da pasta', certa: 'aprovar',
      fb: 'Está dentro do pedido e dentro da pasta combinada. Aprovar é o certo; depois você confere o arquivo.' },
    { ic: '🗑️', t: 'Para começar do zero, posso apagar os 34 arquivos da pasta bagunca?', s: 'ferramenta: apagar · 34 arquivos', certa: 'recusar',
      fb: 'Você não pediu para apagar nada, e apagar é difícil de desfazer. Recuse. Se um dia precisar limpar, peça para mover para uma pasta “lixeira” primeiro.' },
    { ic: '⚙️', t: 'Para ler os PDFs melhor, posso instalar uma ferramenta pelo terminal?', s: 'ferramenta: rodar comando · instalação', certa: 'perguntar',
      fb: 'Instalar pode ser necessário, mas pergunte antes: “para que serve e é obrigatório?”. Se a explicação fizer sentido, aprove. Ler PDF, por exemplo, ele já faz sem instalar nada.' },
    { ic: '🚪', t: 'Posso mover arquivos de Documentos/Financeiro para organizar junto?', s: 'fora da pasta aberta', certa: 'recusar',
      fb: 'Está fora da pasta combinada. Recuse. Se quiser trabalhar em outra pasta, você mesmo abre essa pasta no app.' },
    { ic: '✏️', t: 'Errei a data no diario.txt que acabei de criar. Posso corrigir?', s: 'ferramenta: editar · arquivo criado por ele', certa: 'aprovar',
      fb: 'Corrigir o próprio arquivo, dentro do pedido, é seguro. Aprove e confira a alteração que ele mostra.' },
    { ic: '📧', t: 'Já que tenho os contatos, posso enviar um e-mail a todos avisando da organização?', s: 'ação externa · irreversível', certa: 'recusar',
      fb: 'Mensagem enviada não volta, e ninguém pediu isso. Ações para fora (e-mail, mensagem, publicação) sempre como rascunho primeiro, com você apertando enviar.' }
  ];
  const NOMES = { aprovar: '✅ Aprovar', perguntar: '❓ Perguntar antes', recusar: '⛔ Recusar' };
  let i = 0, acertos = 0;
  const elP = document.getElementById('pt-pedido'), elFb = document.getElementById('pt-fb');
  const elPlacar = document.getElementById('pt-placar'), bProx = document.getElementById('pt-prox');
  const botoes = [...raiz.querySelectorAll('.pt-btn')];
  function mostra() {
    const p = PEDIDOS[i];
    elP.innerHTML = '<span class="pt-ic"></span><div><b></b><small></small></div>';
    elP.querySelector('.pt-ic').textContent = p.ic;
    elP.querySelector('b').textContent = '“' + p.t + '”';
    elP.querySelector('small').textContent = p.s;
    elFb.textContent = 'O que você responde?';
    botoes.forEach(b => { b.disabled = false; b.classList.remove('marcado'); });
    bProx.disabled = true;
    elPlacar.textContent = `pedido ${i + 1} de ${PEDIDOS.length} · ${acertos} certo(s)`;
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      elP.animate([{ transform: 'translateY(12px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 350, easing: 'cubic-bezier(.22,1,.36,1)' });
  }
  botoes.forEach(b => b.addEventListener('click', () => {
    const p = PEDIDOS[i], ok = b.dataset.r === p.certa;
    if (ok) acertos++;
    botoes.forEach(x => (x.disabled = true));
    b.classList.add('marcado');
    elFb.innerHTML = `<b class="${ok ? 'certo' : 'errado'}">${ok ? 'Boa decisão.' : 'Melhor: ' + NOMES[p.certa] + '.'}</b> `;
    elFb.appendChild(document.createTextNode(p.fb));
    elPlacar.textContent = `pedido ${i + 1} de ${PEDIDOS.length} · ${acertos} certo(s)`;
    if (i < PEDIDOS.length - 1) bProx.disabled = false;
    else elPlacar.textContent = `Fim: ${acertos} de ${PEDIDOS.length}. ${acertos >= 6 ? 'Porteiro de confiança.' : 'Releia os que você errou: são os erros mais comuns.'}`;
  }));
  bProx.addEventListener('click', () => { if (i < PEDIDOS.length - 1) { i++; mostra(); } });
  document.getElementById('pt-reset').addEventListener('click', () => { i = 0; acertos = 0; mostra(); });
  mostra();
})();
