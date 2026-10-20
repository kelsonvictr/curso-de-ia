/* =========================================================
   Curso de IA — shared/mini-ia.js
   Uma IA de bolso DE VERDADE: um modelo de linguagem minúsculo
   (contagem de "qual palavra vem depois de quais duas") treinado
   ali mesmo, no navegador, com as bibliotecas que o aluno escolhe.
   Não é um LLM: é o mesmo princípio em escala de brinquedo.
   ========================================================= */
(function () {
  const raiz = document.getElementById('mini-ia');
  if (!raiz) return;
  const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s) => raiz.querySelector(s);

  const BIBLIOTECAS = {
    emails: { nome: 'E-mails da Aurora', ic: '✉️', frases: [
      'Prezado cliente, segue em anexo o boleto de setembro.',
      'Prezado cliente, segue em anexo o extrato do mês.',
      'Prezado cliente, precisamos do extrato bancário de setembro.',
      'Prezada Marta, segue em anexo o contrato revisado.',
      'Bom dia, a multa por rescisão é de duas mensalidades.',
      'Bom dia, o prazo do contrato é de vinte e quatro meses.',
      'Bom dia, precisamos das notas fiscais de setembro.',
      'A multa por atraso é de dois por cento ao mês.',
      'A multa por rescisão está na cláusula quinta.',
      'O prazo de entrega é sexta-feira.',
      'O prazo do contrato vence em dezembro.',
      'Precisamos do comprovante de pagamento do DAS.',
      'Precisamos das notas fiscais emitidas em setembro.',
      'Segue em anexo a declaração de rendimentos.',
      'Segue em anexo a planilha de gastos do mês.',
      'A reunião com o cliente foi remarcada para segunda-feira.',
      'A reunião de equipe começa às nove horas.',
      'O cliente pediu o resumo do contrato até sexta-feira.',
      'O cliente enviou o extrato bancário ontem.',
      'Favor enviar os documentos até sexta-feira.',
      'Favor confirmar o recebimento deste e-mail.',
      'Qualquer dúvida, estamos à disposição.',
      'Atenciosamente, equipe Aurora.'
    ] },
    receitas: { nome: 'Receitas da vovó', ic: '🍰', frases: [
      'Misture a farinha com o açúcar e os ovos.',
      'Misture o leite com a manteiga derretida.',
      'Asse em forno médio por quarenta minutos.',
      'Asse até dourar e sirva com café.',
      'Bata as claras em neve e reserve.',
      'Despeje a massa na forma untada.',
      'Segue a receita do bolo de fubá da vovó.',
      'O bolo de cenoura leva três ovos.',
      'O bolo fica pronto em quarenta minutos.',
      'Sirva quente com uma xícara de café.'
    ] },
    ditados: { nome: 'Ditados populares', ic: '🗣️', frases: [
      'Água mole em pedra dura tanto bate até que fura.',
      'Quem não tem cão caça com gato.',
      'Devagar se vai ao longe.',
      'De grão em grão a galinha enche o papo.',
      'Mais vale um pássaro na mão do que dois voando.',
      'O apressado come cru.',
      'Quem espera sempre alcança.',
      'A pressa é inimiga da perfeição.'
    ] }
  };
  const SUGESTOES = ['Prezado cliente,', 'A multa', 'O prazo', 'Bom dia,', 'Misture a', 'Quem'];

  let ligadas = new Set(['emails']);
  let extras = [];
  let modelo = null, frasesTreino = [];
  let texto = [], temperatura = 0.6;

  /* ---------- treino: conta o que vem depois de cada par de palavras ---------- */
  function treina() {
    frasesTreino = [...ligadas].flatMap(k => BIBLIOTECAS[k].frases).concat(extras);
    const tri = {}, bi = {}, inicio = {};
    let pares = 0;
    const soma = (obj, k, w) => { (obj[k] = obj[k] || {})[w] = (obj[k][w] || 0) + 1; };
    frasesTreino.forEach(f => {
      const w = f.split(/\s+/).filter(Boolean);
      inicio[w[0]] = (inicio[w[0]] || 0) + 1;
      for (let i = 0; i < w.length - 1; i++) {
        soma(bi, w[i].toLowerCase(), w[i + 1]); pares++;
        if (i > 0) soma(tri, (w[i - 1] + ' ' + w[i]).toLowerCase(), w[i + 1]);
      }
    });
    modelo = { tri, bi, inicio, pares };
    return pares;
  }
  function candidatos() {
    if (!texto.length) return Object.entries(modelo.inicio);
    const n = texto.length;
    const k3 = n >= 2 ? (texto[n - 2] + ' ' + texto[n - 1]).toLowerCase() : null;
    if (k3 && modelo.tri[k3]) return Object.entries(modelo.tri[k3]);
    const k2 = texto[n - 1].toLowerCase();
    if (modelo.bi[k2]) return Object.entries(modelo.bi[k2]);
    return [];
  }
  function probabilidades() {
    const c = candidatos();
    if (!c.length) return [];
    const t = Math.max(0.05, temperatura);
    const pesos = c.map(([w, n]) => [w, Math.pow(n, 1 / t)]);
    const total = pesos.reduce((a, [, p]) => a + p, 0);
    return pesos.map(([w, p]) => [w, p / total]).sort((a, b) => b[1] - a[1]);
  }
  function sorteia(probs) {
    let r = Math.random();
    for (const [w, p] of probs) { r -= p; if (r <= 0) return w; }
    return probs[0][0];
  }
  const terminou = () => texto.length && /[.!?]$/.test(texto[texto.length - 1]) || texto.length >= 24;

  /* ---------- desenho ---------- */
  function desenhaBibliotecas() {
    const box = $('#mi-bibs'); box.replaceChildren();
    Object.entries(BIBLIOTECAS).forEach(([k, b]) => {
      const bt = document.createElement('button');
      bt.type = 'button'; bt.className = 'mi-bib'; bt.setAttribute('aria-pressed', ligadas.has(k));
      bt.innerHTML = `<span>${b.ic}</span><b></b><small>${b.frases.length} frases</small>`;
      bt.querySelector('b').textContent = b.nome;
      bt.addEventListener('click', () => {
        if (ligadas.has(k) && ligadas.size === 1 && !extras.length) return;
        ligadas.has(k) ? ligadas.delete(k) : ligadas.add(k);
        desenhaBibliotecas(); $('#mi-status').innerHTML = 'Biblioteca mudou. Aperte <b>Treinar</b> de novo.';
        $('#mi-treinar').classList.add('pulsa');
      });
      box.appendChild(bt);
    });
    $('#mi-extras').textContent = extras.length ? `+ ${extras.length} frase(s) ensinada(s) por você` : '';
  }
  function desenhaTexto(nova) {
    const el = $('#mi-texto'); el.replaceChildren();
    texto.forEach((w, i) => {
      const s = document.createElement('span'); s.textContent = w + ' ';
      if (nova && i === texto.length - 1) { s.className = 'mi-nova'; }
      el.appendChild(s);
    });
    const c = document.createElement('span'); c.className = 'cursor'; el.appendChild(c);
    const selo = $('#mi-selo');
    if (terminou()) {
      const frase = texto.join(' ');
      const existe = frasesTreino.some(f => f === frase);
      selo.hidden = false;
      selo.className = 'mi-selo ' + (existe ? 'copia' : 'nova');
      selo.textContent = existe ? '📋 frase idêntica a uma da biblioteca' : '✨ frase inventada: não existe na biblioteca';
    } else selo.hidden = true;
  }
  function desenhaCands(escolhida) {
    const box = $('#mi-cands'); box.replaceChildren();
    const probs = probabilidades().slice(0, 5);
    if (!probs.length) { box.innerHTML = '<p class="mi-vazio">Fim: o modelo nunca viu nada depois disso. É o limite de uma biblioteca pequena.</p>'; return probs; }
    probs.forEach(([w, p]) => {
      const d = document.createElement('div'); d.className = 'cand' + (w === escolhida ? ' escolhida' : '');
      d.innerHTML = '<div class="cand-barra"></div><b></b><span></span>';
      d.querySelector('b').textContent = w;
      d.querySelector('span').textContent = Math.round(p * 100) + '%';
      box.appendChild(d);
      requestAnimationFrame(() => (d.querySelector('.cand-barra').style.width = Math.max(2, p * 100) + '%'));
    });
    return probs;
  }

  /* ---------- ações ---------- */
  async function animaTreino() {
    const voo = $('#mi-voo'); voo.replaceChildren();
    const amostra = frasesTreino.slice().sort(() => Math.random() - 0.5).slice(0, reduz ? 0 : 7);
    amostra.forEach((f, i) => {
      const s = document.createElement('span'); s.className = 'mi-frase-voa'; s.textContent = f;
      s.style.top = (8 + (i * 12) % 80) + '%';
      voo.appendChild(s);
      s.animate([{ transform: 'translateX(0) scale(1)', opacity: 0 }, { opacity: 1, offset: 0.15 }, { transform: 'translateX(calc(var(--voo) * 1px)) scale(.3)', opacity: 0 }],
        { duration: 1300, delay: i * 140, easing: 'cubic-bezier(.5,0,.6,1)', fill: 'forwards' });
    });
    $('#mi-cerebro').classList.add('treinando');
    const pares = modelo.pares, cont = $('#mi-pares');
    const passos = reduz ? 1 : 24;
    for (let k = 1; k <= passos; k++) { cont.textContent = Math.round(pares * k / passos); await new Promise(r => setTimeout(r, reduz ? 0 : 60)); }
    $('#mi-cerebro').classList.remove('treinando');
  }
  async function treinar() {
    $('#mi-treinar').classList.remove('pulsa');
    $('#mi-voo').style.setProperty('--voo', Math.max(200, $('#mi-voo').clientWidth - 40));
    treina();
    await animaTreino();
    texto = []; desenhaTexto(false); desenhaCands();
    $('#mi-status').innerHTML = `Treinada com <b>${frasesTreino.length} frases</b>. Escolha um começo ou aperte <b>Próxima palavra</b>.`;
    $('#mi-gerar').hidden = false;
  }
  function proxima() {
    if (!modelo || terminou()) return;
    const probs = probabilidades();
    if (!probs.length) { desenhaCands(); return; }
    const w = sorteia(probs);
    desenhaCands(w);
    texto.push(w);
    desenhaTexto(true);
    const nova = $('.mi-nova');
    if (nova && !reduz) nova.animate([{ transform: 'translateY(-10px) scale(1.3)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 380, easing: 'cubic-bezier(.34,1.56,.64,1)' });
    if (terminou()) setTimeout(() => desenhaCands(), 600);
  }
  async function fraseInteira() {
    while (modelo && !terminou() && probabilidades().length) { proxima(); await new Promise(r => setTimeout(r, reduz ? 0 : 280)); }
  }

  $('#mi-treinar').addEventListener('click', treinar);
  $('#mi-prox').addEventListener('click', proxima);
  $('#mi-tudo').addEventListener('click', fraseInteira);
  $('#mi-limpa').addEventListener('click', () => { texto = []; desenhaTexto(false); desenhaCands(); });
  $('#mi-temp').addEventListener('input', (e) => {
    temperatura = Number(e.target.value) / 100;
    $('#mi-temp-rot').textContent = temperatura < 0.35 ? 'cuidadosa: quase sempre a mais provável' : temperatura < 0.9 ? 'equilibrada' : 'criativa: arrisca as raras';
    if (modelo && !terminou()) desenhaCands();
  });
  $('#mi-ensina').addEventListener('submit', (e) => {
    e.preventDefault();
    const inp = $('#mi-frase');
    let f = inp.value.trim().replace(/\s+/g, ' ');
    if (f.split(' ').length < 3) { $('#mi-status').textContent = 'Escreva uma frase com pelo menos três palavras.'; return; }
    if (!/[.!?]$/.test(f)) f += '.';
    extras.push(f); inp.value = '';
    desenhaBibliotecas();
    $('#mi-status').innerHTML = `Frase guardada na biblioteca. Aperte <b>Treinar</b> para a IA aprender com ela.`;
    $('#mi-treinar').classList.add('pulsa');
  });
  const sug = $('#mi-sugestoes');
  SUGESTOES.forEach(t => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'mi-sug'; b.textContent = t;
    b.addEventListener('click', () => {
      if (!modelo) return;
      texto = t.split(' '); desenhaTexto(false); desenhaCands();
    });
    sug.appendChild(b);
  });
  desenhaBibliotecas();
  desenhaTexto(false);
})();
