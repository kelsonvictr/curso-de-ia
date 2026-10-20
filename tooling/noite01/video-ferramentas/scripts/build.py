#!/usr/bin/env python3
"""Mundo 1 · Modo arcade · Escolha sua ferramenta — Noite 1 do Curso de IA.

Quatro "lutadores" (chat, NotebookLM, gerador de imagem, agente) e quatro rodadas com contagem
3-2-1 para a turma decidir antes do Beto. Na última, o Beto quase escolhe o chat e muda para o agente.
Depois: sh ~/.claude/skills/video-8bit-didatico/scripts/montar.sh
"""
from pathlib import Path
import sys

PROJ = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJ / 'scripts/pixel8'))
from lib import *  # noqa: E402,F403

TITULO = 'Escolha sua ferramenta — Noite 1 · Curso de IA'
PAUSA = 3.4  # contagem regressiva para a turma responder
ORDEM = [('D01', 0.8), ('D02', 0.4), ('D02B', 0.3), ('D03', 0.8), ('D04', PAUSA), ('D05', 0.8), ('D06', PAUSA), ('D07', 0.8),
         ('D08', PAUSA), ('D09', 0.8), ('D10', PAUSA), ('D11', 0.8)]
F = tempos(PROJ, ORDEM)
FIM_FALAS = F['D11']['s'] + F['D11']['d']
TOTAL = round(FIM_FALAS + 4.5, 1)
pw = lambda k, i: palavra(F, k, i)  # noqa: E731

RODADAS = [('D03', 'D04', 'ata da reunião vira 5 tópicos', 'chat'),
           ('D05', 'D06', 'manual do convênio: reembolso, com a página', 'nb'),
           ('D07', 'D08', 'capa para o post da festa', 'img'),
           ('D09', 'D10', 'renomear 300 notas fiscais da pasta', 'ag')]
T = {
    'chat': pw('D02', 3), 'nb': pw('D02', 12), 'img': pw('D02B', 1), 'ag': pw('D02B', 7),
    'quasechat': pw('D10', 0), 'nempensar': pw('D10', 7), 'agente': pw('D10', 9),
    'certa': pw('D11', 7), 'fimcard': round(FIM_FALAS + 0.4, 2),
}
for i, (perg, resp, _, _) in enumerate(RODADAS, 1):
    T[f'r{i}'] = F[perg]['s']
    T[f'c{i}'] = round(F[perg]['s'] + F[perg]['d'] + 0.25, 2)
    T[f'v{i}'] = F[resp]['s']

CHAT_LUT = ["............", ".aaaaaaaaaa.", "aaaaaaaaaaaa", "aakaaaaaakaa", "aaaaaaaaaaaa", "aannnnnnnaaa",
            "aaaaaaaaaaaa", "aannnnnaaaaa", ".aaaaaaaaaa.", "..aaa.......", "...k....k...", "...k....k...",
            "..kk...kk..."]
PINTOR_LUT = ["yyyyyyyyyyyy", "yaaaaaaaaooy", "yaaaaaaaaooy", "yakaaaakaaay", "yaaaaaaaaaay", "yaaaaGaaaaay",
              "yaaaGGGaaaay", "yaaGGGGGaGay", "yGGGGGGGGGGy", "yyyyyyyyyyyy", "...k....k...", "...k....k...",
              "..kk...kk..."]
LUTADORES = [('chat', 'CHAT', 'texto e ideias', svg(CHAT_LUT, 8)),
             ('nb', 'NOTEBOOKLM', 'só as suas fontes', svg(CADERNO_LUT, 8)),
             ('img', 'IMAGEM', 'capas e artes', svg(PINTOR_LUT, 8)),
             ('ag', 'AGENTE', 'mexe nos arquivos', svg(TICO2, 4.4))]

CSS = """
.telao{background:#1a1c2c}
.tela{color:#f4f4f4}
.cards{position:absolute;left:0;right:0;top:0;display:grid;grid-template-columns:1fr 1fr;gap:12px}
.card{position:relative;height:144px;padding:0 14px;background:#29366f;border:4px solid #566c86;display:flex;align-items:center;gap:18px}
.card .spr{width:112px;flex:none;display:flex;align-items:center;justify-content:center}
.card .nome{font-size:24px;color:#ffcd75}
.card .sub{margin-top:10px;font-family:"Pixelify Sans",monospace;font-size:30px;line-height:1.1;color:#f4f4f4}
.card.ag{border-color:#ef7d57}
.tag{position:absolute;right:-4px;bottom:-4px;padding:6px 12px;background:#a7f070;color:#1a1c2c;font-size:15px;border:4px solid #f4f4f4}
.xis{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:120px;color:#ff5a5a;text-shadow:8px 8px 0 #5d275d}
.round{position:absolute;left:0;right:0;bottom:0;padding:10px 12px;background:#29366f;border:4px solid #ffcd75;text-align:center}
.round b{display:block;font-weight:400;font-size:18px;color:#ffcd75}
.round span{display:block;margin-top:6px;font-family:"Pixelify Sans",monospace;font-size:32px;color:#f4f4f4}
.camada-contagem{height:300px;padding-bottom:24px}
.camada-contagem .cd-txt{font-size:28px}
.cd-num{top:160px;font-size:120px}
"""


def corpo():
    cards = ''.join(f'<div class="card {k}" id="cena-card-{k}"><div class="spr" id="cena-spr-{k}">{spr}</div>'
                    f'<div><div class="nome">{nome}</div><div class="sub">{sub}</div></div>'
                    f'<div class="tag" id="cena-tag-{k}">ESCOLHIDA!</div></div>' for k, nome, sub, spr in LUTADORES)
    rounds = ''.join(f'<div class="round" id="cena-round{i}"><b>RODADA {i}</b><span>{txt}</span></div>'
                     for i, (_, _, txt, _) in enumerate(RODADAS, 1))
    tela = (f'<div class="tela"><div class="cards">{cards}</div>{rounds}'
            '<div class="xis" id="cena-xis">X</div></div>')
    return cena_padrao('cena', tela, ('MUNDO <b>1</b> · MODO ARCADE', 'NOITE 1 · CURSO DE IA'),
                       ('MUNDO 1 · SALA DA PROGRAMA AI', 'ESCOLHA SUA FERRAMENTA'),
                       ('FASE COMPLETA!', '+1 FERRAMENTA CERTA',
                        'Não existe ferramenta melhor. <b>Existe a ferramenta certa para cada tarefa.</b>'),
                       contagem=True)


JS = """
const VENC = """ + str({i: v for i, (_, _, _, v) in enumerate(RODADAS, 1)}).replace("'", '"') + """;
const TODOS = ["chat", "nb", "img", "ag"];
tl.set([P("fimcard"), P("telao"), P("xis"), P("round1"), P("round2"), P("round3"), P("round4")], { opacity: 0 }, 0);
TODOS.forEach(k => tl.set(P("tag-" + k), { opacity: 0 }, 0));
faixa(0.1, F.D01.d + 0.6);
tl.fromTo(P("telao"), { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "steps(2)" }, F.D01.d + 0.8);
TODOS.forEach((k, j) => tl.from(P("card-" + k), { y: 360, duration: 0.4, ease: "steps(6)" }, F.D01.d + 0.9 + j * 0.15));
["D01", "D02", "D02B", "D11"].forEach(k => falar("tico", k));
["D03", "D05", "D07", "D09"].forEach(k => falar("lia", k));
["D04", "D06", "D08", "D10"].forEach(k => falar("beto", k));
TODOS.forEach(k => { pula("spr-" + k, T[k], 3); pisca("card-" + k, T[k], 2); });
const dimTodos = (t) => tl.to(TODOS.map(k => P("card-" + k)), { opacity: 1, duration: 0.1, ease: "steps(1)" }, t);
[1, 2, 3, 4].forEach(i => {
  const r = T["r" + i], c = T["c" + i], v = T["v" + i], ganha = VENC[i];
  if (i > 1) { some("round" + (i - 1), r - 0.2); some("tag-" + VENC[i - 1], r - 0.2); dimTodos(r - 0.2); }
  surge("round" + i, r);
  contagem(c);
  if (i < 4) {
    surge("tag-" + ganha, v + 0.1);
    tl.to(TODOS.filter(k => k !== ganha).map(k => P("card-" + k)), { opacity: 0.3, duration: 0.1, ease: "steps(1)" }, v + 0.1);
    pula("spr-" + ganha, v + 0.1, 4);
  }
});
// Rodada 4: o Beto quase vai de chat.
pisca("card-chat", T.quasechat, 2);
surge("xis", T.nempensar - 0.3);
treme("card-chat", T.nempensar - 0.3);
some("xis", T.agente - 0.05);
surge("tag-ag", T.agente);
tl.to(["chat", "nb", "img"].map(k => P("card-" + k)), { opacity: 0.3, duration: 0.1, ease: "steps(1)" }, T.agente);
pula("spr-ag", T.agente, 5);
reage(0, "KKKK", T.nempensar, 1.6);
reage(2, "UAU", T.agente + 0.2, 1.6);
some("round4", F.D11.s); some("tag-ag", F.D11.s); dimTodos(F.D11.s);
TODOS.forEach(k => pula("spr-" + k, T.certa, 3));
fimDeFase(T.fimcard);
"""

SFX = [('assets/sfx/coin.wav', 0.3, 0.5), ('assets/sfx/start.wav', F['D01']['d'] + 0.9, 0.5)]
for i in range(1, 5):
    SFX += [('assets/sfx/blip.wav', T[f'r{i}'], 0.45)]
    SFX += [(f'assets/sfx/passo{j}.wav', round(T[f'c{i}'] + j, 2), 0.45) for j in range(3)]
    if i < 4:
        SFX += [('assets/sfx/pronto.wav', T[f'v{i}'] + 0.1, 0.5)]
SFX += [('assets/sfx/gameover.wav', T['nempensar'] - 0.3, 0.45), ('assets/sfx/pronto.wav', T['agente'], 0.5)]
SFX += [('assets/sfx/fanfarra.wav', T['fimcard'], 0.55)]

if __name__ == '__main__':
    preparar_audio(PROJ, TOTAL, [(0, 4, 132, ['C', 'G'], 'intro'), (4, T['r1'], 132, ['C', 'G', 'Am', 'F'], 'fase1'),
                                 (T['r1'], TOTAL, 132, ['F', 'C', 'G', 'C'], 'fase2')])
    montar(PROJ, F, TOTAL, CSS, corpo(), JS, T, SFX, TITULO)
