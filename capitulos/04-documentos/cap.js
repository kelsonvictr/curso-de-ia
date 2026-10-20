/* Capítulo 4 · simuladores: fábrica de declarações e caçador de cláusulas */
(function () {
  const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const espera = ms => new Promise(r => setTimeout(r, reduz ? 0 : ms));

  /* ═════════ FÁBRICA DE DECLARAÇÕES ═════════ */
  (function () {
    const raiz = document.getElementById('sim-fabrica'); if (!raiz) return;
    const P = [["AUR-0001","Ana Clara Beltrão","Oficina de Comunicação Escrita","20"],["AUR-0002","Bruno Cavalcanti","Introdução à Organização de Arquivos","12"],["AUR-0003","Camila Duarte","Oficina de Comunicação Escrita","20"],["AUR-0004","Diego Ferreira","Introdução à Organização de Arquivos","12"],["AUR-0005","Elisa Fontes","Introdução à Organização de Arquivos","12"],["AUR-0006","Fábio Guimarães","Introdução à Organização de Arquivos","12"],["AUR-0007","Gabriela Holanda","Curso de Atendimento ao Público","40"],["AUR-0008","Heitor Lins","Introdução à Organização de Arquivos","12"],["AUR-0009","Isadora Maia","Oficina de Comunicação Escrita","20"],["AUR-0010","João Pedro Nóbrega","Curso de Atendimento ao Público","40"],["AUR-0011","Karina Oliveira","Curso de Atendimento ao Público","40"],["AUR-0012","Lucas Pontes","Introdução à Organização de Arquivos","12"],["AUR-0013","Mariana Queiroz","Curso de Atendimento ao Público","40"],["AUR-0014","Nícolas Ramos","Introdução à Organização de Arquivos","12"],["AUR-0015","Olívia Santana","Oficina de Comunicação Escrita","20"],["AUR-0016","Paulo Tavares","Curso de Atendimento ao Público","40"],["AUR-0017","Quésia Uchoa","Introdução à Organização de Arquivos","12"],["AUR-0018","Rafael Vasconcelos","Curso de Atendimento ao Público","40"],["AUR-0019","Sofia Wanderley","Curso de Atendimento ao Público","40"],["AUR-0020","Tiago Ximenes","Oficina de Comunicação Escrita","20"],["AUR-0021","Úrsula Azevedo","Introdução à Organização de Arquivos","12"],["AUR-0022","Vicente Barros","Introdução à Organização de Arquivos","12"],["AUR-0023","Wesley Cordeiro","Oficina de Comunicação Escrita","20"],["AUR-0024","Yasmin Dantas","Oficina de Comunicação Escrita","20"],["AUR-0025","Arthur Espínola","Introdução à Organização de Arquivos","12"],["AUR-0026","Beatriz Farias","Curso de Atendimento ao Público","40"],["AUR-0027","Caio Galvão","Oficina de Comunicação Escrita","20"],["AUR-0028","Daniela Henriques","Oficina de Comunicação Escrita","20"],["AUR-0029","Emanuel Iglesias","Curso de Atendimento ao Público","40"],["AUR-0030","Flávia Julião","Introdução à Organização de Arquivos","12"]];
    const elModelo = document.getElementById('fb-modelo'), elDoc = document.getElementById('fb-doc');
    const pilha = document.getElementById('fb-pilha'), leg = document.getElementById('fb-leg');
    const chkErro = document.getElementById('fb-erro');
    const bPiloto = document.getElementById('fb-piloto'), bLote = document.getElementById('fb-lote');
    const modelo = () => [
      ['', 'DECLARAÇÃO DE PARTICIPAÇÃO'], ['', 'Declaramos que '], ['NOME', '{{NOME}}'], ['', ' (matrícula '], ['MATRICULA', '{{MATRICULA}}'],
      ['', ') participou do curso “'], ['CURSO', '{{CURSO}}'], ['', '”, com ' + (chkErro.checked ? 'carga horaria horaria' : 'carga horária') + ' total de '], ['CARGA', '{{CARGA_HORARIA}}'], ['', ' horas.']
    ];
    function desenhaModelo() {
      elModelo.replaceChildren();
      modelo().forEach(([k, t], i) => {
        const s = document.createElement(i === 0 ? 'b' : 'span');
        s.textContent = t + (i === 0 ? '\n' : '');
        if (k) s.className = 'fb-marcador';
        if (!k && /horaria horaria/.test(t)) s.className = 'fb-bug';
        elModelo.appendChild(s);
      });
    }
    function preenche(p, alvo) {
      alvo.replaceChildren();
      const val = { NOME: p[1], MATRICULA: p[0], CURSO: p[2], CARGA: p[3] };
      modelo().forEach(([k, t], i) => {
        const s = document.createElement(i === 0 ? 'b' : 'span');
        s.textContent = (k ? val[k] : t) + (i === 0 ? '\n' : '');
        if (k) s.className = 'fb-dado';
        if (!k && /horaria horaria/.test(t)) s.className = 'fb-bug';
        alvo.appendChild(s);
      });
    }
    function reset() {
      pilha.replaceChildren(); elDoc.innerHTML = '<span class="dim">Aperte “Gerar piloto”.</span>';
      bPiloto.disabled = false; bLote.disabled = true; chkErro.disabled = false;
      leg.textContent = 'Comece pelo piloto.'; desenhaModelo();
    }
    function cartinha(p, bug) {
      const c = document.createElement('div'); c.className = 'fb-carta' + (bug ? ' bug' : '');
      c.title = p[1]; c.textContent = p[1].split(' ')[0];
      pilha.appendChild(c);
      if (!reduz) c.animate([{ transform: 'translateY(-30px) rotate(-8deg)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 300, easing: 'cubic-bezier(.34,1.56,.64,1)' });
    }
    bPiloto.addEventListener('click', () => {
      preenche(P[0], elDoc); pilha.replaceChildren(); cartinha(P[0], chkErro.checked);
      bPiloto.disabled = true; bLote.disabled = false; chkErro.disabled = true;
      leg.innerHTML = chkErro.checked
        ? '<b>O piloto mostra o erro:</b> “carga horaria horaria”. Corrija o modelo agora e custa um documento. Ou ignore e veja o lote.'
        : '<b>Piloto da Ana Clara.</b> Leia inteiro: nome, matrícula, curso, 20 horas. Aprovado? Gere as outras 29.';
    });
    bLote.addEventListener('click', async () => {
      bLote.disabled = true;
      for (let i = 1; i < P.length; i++) { preenche(P[i], elDoc); cartinha(P[i], chkErro.checked); await espera(90); }
      leg.innerHTML = chkErro.checked
        ? '<b>30 declarações com o mesmo erro.</b> O lote copia tudo do modelo, inclusive o defeito. Por isso o piloto existe.'
        : '<b>30 declarações</b>, uma por pessoa, de AUR-0001 a AUR-0030. Agora confira 3 ao acaso com a lista.';
    });
    chkErro.addEventListener('change', desenhaModelo);
    document.getElementById('fb-reset').addEventListener('click', () => { chkErro.checked = false; reset(); });
    reset();
  })();

  /* ═════════ CAÇADOR DE CLÁUSULAS ═════════ */
  (function () {
    const raiz = document.getElementById('sim-cacador'); if (!raiz) return;
    const Q = [
      { q: 'Qual a multa por rescisão?', pag: 6, cl: 'Cláusula Quinta — Da multa por rescisão', t: 'A rescisão imotivada por qualquer das partes implicará multa de <mark>R$ 14.700,00</mark> (catorze mil e setecentos reais), equivalente a duas mensalidades.' },
      { q: 'Quanto custa por mês?', pag: 4, cl: 'Cláusula Terceira — Do valor', t: 'A CONTRATANTE pagará à CONTRATADA o valor mensal de <mark>R$ 7.350,00</mark>, com vencimento todo <mark>dia 5</mark> de cada mês.' },
      { q: 'Por quanto tempo vale?', pag: 3, cl: 'Cláusula Segunda — Do prazo', t: 'O contrato vigorará pelo prazo de <mark>24 (vinte e quatro) meses</mark>, prorrogável por igual período mediante termo aditivo.' },
      { q: 'Em quanto tempo atendem urgência?', pag: 9, cl: 'Cláusula Oitava — Do atendimento', t: 'Chamados urgentes serão atendidos em até <mark>6 (seis) horas úteis</mark>; chamados comuns, em até 2 (dois) dias úteis.' },
      { q: 'Qual é o foro?', pag: 12, cl: 'Cláusula Décima Primeira — Do foro', t: 'Fica eleito o foro da <mark>Comarca de João Pessoa/PB</mark>.' },
      { q: 'Prevê uso de drones?', pag: 0, cl: 'Não consta', t: 'Nenhuma das 41 páginas fala de drones. A resposta honesta é <b>“não consta”</b>.' }
    ];
    const elQ = document.getElementById('cc-perguntas'), elPag = document.getElementById('cc-paginas');
    const elT = document.getElementById('cc-trecho'), leg = document.getElementById('cc-leg');
    const pags = [];
    for (let i = 1; i <= 41; i++) {
      const d = document.createElement('span'); d.className = 'cc-pag'; d.textContent = i;
      if (i >= 2 && i <= 12) d.classList.add('cl');
      elPag.appendChild(d); pags.push(d);
    }
    let vez = 0;
    Q.forEach(item => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'mb-area'; b.textContent = item.q;
      b.addEventListener('click', async () => {
        const minha = ++vez;
        elQ.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
        pags.forEach(p => p.classList.remove('lida', 'achou'));
        elT.innerHTML = '<span class="dim">lendo…</span>';
        for (let i = 0; i < 41; i++) { if (minha !== vez) return; pags[i].classList.add('lida'); await espera(22); }
        if (minha !== vez) return;
        if (item.pag) pags[item.pag - 1].classList.add('achou');
        elT.innerHTML = `<span class="np-rot">${item.pag ? 'página ' + item.pag + ' · ' : ''}${item.cl}</span><p>${item.t}</p>`;
        leg.innerHTML = item.pag
          ? `<b>Resposta com endereço:</b> abra a página ${item.pag} e confira em segundos.`
          : '<b>Não achou, e disse.</b> É o comportamento que você quer: melhor “não consta” do que um palpite.';
      });
      elQ.appendChild(b);
    });
  })();
})();
