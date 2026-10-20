/* Capítulo 3 · simuladores: a pasta se arruma (FLIP) e dado sujo engana gráfico */
(function () {
  const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ═════════ ORGANIZADOR DA PASTA ═════════ */
  (function () {
    const raiz = document.getElementById('sim-pasta'); if (!raiz) return;
    const NOMES = ["Captura de Tela às 14.33.10.png", "IMG_8274.jpg", "IMG_8275.jpg", "IMG_8276.jpg", "IMG_8277.jpg", "IMG_8278.jpg", "IMG_8279.jpg", "IMG_8280.jpg", "IMG_8281.jpg", "WhatsApp Image at 09.12.45.jpeg", "anotacoes reuniao (cópia).txt", "anotações reunião.txt", "boleto condominio.pdf", "comprovante pix.pdf", "contatos exportados.csv", "cópia de IMG_8274.jpg", "foto perfil nova (1).jpg", "ideias.txt", "lista de compras.txt", "logo-final-AGORA-VAI (2).png", "logo-final-AGORA-VAI.png", "manual-cafeteira.pdf", "orçamento móveis.csv", "print_tela.png", "rascunho email chefe.txt", "relatorio final FINAL (2).txt", "relatorio final FINAL.txt", "relatorio final.txt", "scan0001.pdf", "scan0002.pdf", "sem título (2).txt", "sem título.txt", "senha do wifi.txt", "vendas_marco.csv"];
    const DUPS = new Set(['anotacoes reuniao (cópia).txt', 'cópia de IMG_8274.jpg', 'logo-final-AGORA-VAI (2).png', 'relatorio final FINAL (2).txt', 'relatorio final FINAL.txt']);
    const tipo = n => /\.(jpe?g|png)$/i.test(n) ? 'img' : /\.pdf$/i.test(n) ? 'pdf' : /\.csv$/i.test(n) ? 'csv' : 'doc';
    const ICONE = { img: '🖼️', pdf: '📕', csv: '📊', doc: '📄' };
    const slug = n => n.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
      .replace(/\.(jpe?g)$/, '.jpg').replace(/[()]/g, '').replace(/[^a-z0-9.]+/g, '-').replace(/-+\./g, '.').replace(/^-|-$/g, '');
    const solta = document.getElementById('og-solta');
    const pastas = Object.fromEntries([...raiz.querySelectorAll('.og-pasta')].map(p => [p.dataset.tipo, p.querySelector('.og-dentro')]));
    const leg = document.getElementById('og-leg');
    const rel = document.getElementById('og-relatorio'), relTxt = document.getElementById('og-rel-txt');
    const b = { diag: document.getElementById('og-diag'), plano: document.getElementById('og-plano'), exec: document.getElementById('og-exec'), desfaz: document.getElementById('og-desfaz') };
    let chips = [];

    function monta() {
      solta.replaceChildren(); Object.values(pastas).forEach(p => p.replaceChildren());
      chips = NOMES.map(n => {
        const c = document.createElement('span');
        c.className = 'og-chip'; c.dataset.tipo = tipo(n);
        if (DUPS.has(n)) c.dataset.dup = '1';
        if (/senha/.test(n)) c.dataset.sens = '1';
        c.innerHTML = `<i>${ICONE[tipo(n)]}</i><span></span>`;
        c.querySelector('span').textContent = n;
        c.dataset.orig = n;
        solta.appendChild(c);
        return c;
      });
      raiz.classList.remove('diag', 'plano', 'feito');
      rel.hidden = true;
      b.diag.disabled = false; b.plano.disabled = true; b.exec.disabled = true; b.desfaz.disabled = true;
      leg.innerHTML = 'Etapa atual: <b>nenhuma</b>. Comece pelo diagnóstico.';
    }
    function flip(mover) {
      const antes = new Map(chips.map(c => [c, c.getBoundingClientRect()]));
      mover();
      if (reduz) return;
      chips.forEach((c, i) => {
        const a = antes.get(c), d = c.getBoundingClientRect();
        const dx = a.left - d.left, dy = a.top - d.top;
        if (!dx && !dy) return;
        c.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }],
          { duration: 900, delay: i * 35, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
      });
    }
    b.diag.addEventListener('click', () => {
      raiz.classList.add('diag');
      const n = t => chips.filter(c => c.dataset.tipo === t).length;
      leg.innerHTML = `<b>Diagnóstico:</b> ${chips.length} arquivos · ${n('img')} imagens · ${n('doc') + n('csv')} textos e planilhas · ${n('pdf')} PDFs · <b>${DUPS.size}</b> cópias marcadas com ⚠ · e um <b>arquivo sensível</b> (senha) em vermelho. Nada foi mexido.`;
      b.diag.disabled = true; b.plano.disabled = false;
    });
    b.plano.addEventListener('click', () => {
      raiz.classList.add('plano');
      let cont = {};
      const linhas = chips.map(c => {
        const t = c.dataset.dup ? 'dup' : c.dataset.tipo;
        const pasta = { img: 'imagens', doc: 'documentos', csv: 'planilhas', pdf: 'pdfs', dup: 'duplicados' }[t];
        let novo = slug(c.dataset.orig);
        if (/^img-\d+/.test(novo) || /^whatsapp|^foto/.test(novo)) { cont.f = (cont.f || 0) + 1; novo = 'foto-' + String(cont.f).padStart(2, '0') + '.jpg'; }
        c.dataset.novo = pasta + '/' + novo;
        return `"${c.dataset.orig}" vira ${pasta}/${novo}`;
      });
      relTxt.textContent = 'PLANO (nada foi mexido ainda)\n' + linhas.slice(0, 8).join('\n') + '\n…e mais ' + (linhas.length - 8) + ' linhas';
      rel.hidden = false;
      leg.innerHTML = '<b>Plano:</b> 5 pastas, nomes sem espaço nem acento, cópias separadas em “duplicados” (nada apagado). <b>Você aprova?</b>';
      b.plano.disabled = true; b.exec.disabled = false;
    });
    b.exec.addEventListener('click', () => {
      flip(() => {
        chips.forEach(c => {
          const [pasta, novo] = c.dataset.novo.split('/');
          const t = { imagens: 'img', documentos: 'doc', planilhas: 'csv', pdfs: 'pdf', duplicados: 'dup' }[pasta];
          c.querySelector('span').textContent = novo;
          pastas[t].appendChild(c);
        });
      });
      raiz.classList.add('feito');
      relTxt.textContent = 'relatorio-organizacao.txt\n' + chips.slice(0, 8).map(c => `${c.dataset.orig}  >>  ${c.dataset.novo}`).join('\n') + '\n…34 linhas no total';
      leg.innerHTML = '<b>Executado, com relatório.</b> Agora confira uma amostra. E se não gostou, o relatório permite desfazer.';
      b.exec.disabled = true; b.desfaz.disabled = false;
    });
    b.desfaz.addEventListener('click', () => {
      flip(() => { chips.forEach(c => { c.querySelector('span').textContent = c.dataset.orig; solta.appendChild(c); }); });
      raiz.classList.remove('feito', 'plano');
      rel.hidden = true;
      leg.innerHTML = '<b>Desfeito</b> usando o relatório: cada arquivo voltou para o nome e o lugar originais.';
      b.desfaz.disabled = true; b.plano.disabled = false;
    });
    monta();
  })();

  /* ═════════ DADO SUJO ENGANA GRÁFICO ═════════ */
  (function () {
    const raiz = document.getElementById('sim-grafias'); if (!raiz) return;
    const V = {"Moradia": 8460.71, "Mercado": 8277.18, "Saúde": 7308.79, "Alimentação": 6794.98, "mercado": 6508.16, "saúde": 5364.74, "Educação": 5045.33, "moradia": 3405.41, "educação": 3162.2, "Lazer": 2867.98, "EDUCAÇÃO": 2824.02, "Transporte": 2600.27, "MERCADO": 2408.44, "MORADIA": 2296.46, "transporte": 1615.39, "lazer": 1418.57, "(em branco)": 824.58, "LAZER": 707.88, "SAÚDE": 700.31, "educacao": 664.72, "TRANSPORTE": 653.28, "ALIMENTAÇÃO": 590.86, "alimentacao": 350.92, "alimentação": 93.96};
    const fam = k => k === '(em branco)' ? 'sem categoria' : k.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    const NOME = { mercado: 'Mercado', moradia: 'Moradia', saude: 'Saúde', educacao: 'Educação', alimentacao: 'Alimentação', lazer: 'Lazer', transporte: 'Transporte', 'sem categoria': 'sem categoria' };
    const COR = { mercado: '#7cb7ff', moradia: '#e07a55', saude: '#5ad19a', educacao: '#b69cff', alimentacao: '#f2b84b', lazer: '#ff8fb1', transporte: '#5fd4d4', 'sem categoria': '#8c8178' };
    const juntado = {};
    Object.entries(V).forEach(([k, v]) => { const f = fam(k); juntado[f] = (juntado[f] || 0) + v; });
    const box = document.getElementById('gr-barras'), leg = document.getElementById('gr-leg'), bt = document.getElementById('gr-troca');
    const brl = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    let modo = 'sujo';
    function desenha() {
      const dados = modo === 'sujo' ? Object.entries(V).map(([k, v]) => [k, v, fam(k)]) : Object.entries(juntado).map(([f, v]) => [NOME[f], v, f]);
      dados.sort((a, b) => b[1] - a[1]);
      const max = dados[0][1];
      box.replaceChildren();
      box.classList.toggle('juntado', modo !== 'sujo');
      dados.forEach(([rot, v, f], i) => {
        const l = document.createElement('div'); l.className = 'gr-linha';
        l.innerHTML = '<span class="gr-rot"></span><span class="gr-trilho"><span class="gr-barra"></span></span><span class="gr-val"></span>';
        l.querySelector('.gr-rot').textContent = rot;
        l.querySelector('.gr-val').textContent = brl(v);
        const barra = l.querySelector('.gr-barra');
        barra.style.background = COR[f];
        box.appendChild(l);
        requestAnimationFrame(() => setTimeout(() => (barra.style.width = (v / max * 100) + '%'), reduz ? 0 : i * 30));
      });
      if (modo === 'sujo') {
        leg.innerHTML = '<b>24 “categorias”.</b> Pelo gráfico, quem lidera é Moradia (R$ 8.460,71). Mas “Mercado” está espalhado em três barras da mesma cor.';
        bt.textContent = 'Juntar as grafias';
      } else {
        leg.innerHTML = '<b>8 categorias de verdade.</b> Agora o primeiro lugar é <b>Mercado, com R$ 17.193,78</b>. Mesmo dado, conclusão diferente. É por isso que o pedido diz “trate as grafias como a mesma categoria”.';
        bt.textContent = 'Voltar ao dado sujo';
      }
    }
    bt.addEventListener('click', () => { modo = modo === 'sujo' ? 'limpo' : 'sujo'; desenha(); });
    desenha();
  })();
})();
