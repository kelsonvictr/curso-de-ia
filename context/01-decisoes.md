# Decisões (append-only)

## 2026-10-20 — criação da v2 e Capítulo 1
- Repo novo `curso-de-ia/` (git próprio, branch `main`), separado da v1. O Digenaldo segue editando a v1.
- A v2 entra já na T04 (começou 20/10), capítulo a capítulo, cada um pronto na véspera do encontro.
- Identidade nova "noite de trabalho": tinta quente, coral Claude, Fraunces (títulos) + Inter (texto)
  + JetBrains Mono (só o que se copia). Tema claro opcional para projetor (botão no topo).
- Motion (motion.dev 11.11.13 via jsDelivr) para molas; tudo funciona sem ele (Web Animations nativa).
- Capítulo 1 reaproveita o **teatro aprovado** da skill `teatro-didatico-animado` (Lia, Beto, Tico;
  áudios já existentes, sem custo) e ganha uma **cena narrada nova** (Marta + Tico, a multa com e
  sem fonte), 9 falas, ~805 caracteres no ElevenLabs.
- Vídeo 8-bit "Escolha sua ferramenta" (skill `video-8bit-didatico`), formato lutador com 4 rodadas e
  contagem 3-2-1; ~990 caracteres no ElevenLabs (inclui a regravação da fala dividida).
- Contrato do kit: as cláusulas certas são **Segunda (prazo), Terceira (valor), Quinta (multa),
  Oitava (atendimento)**. A v1 cita 3ª/4ª/5ª/7ª (errado em valor, prazo e atendimento) — avisar o Digenaldo.
- O contrato da v1 repetia o bloco de cláusulas e REINICIAVA a numeração depois da Vigésima (havia duas
  "Cláusula Quinta" com conteúdos diferentes). Regerado na v2 por `tools/gerar_contrato.py`: 11 cláusulas
  únicas (Primeira na pág. 2 … Décima Primeira na pág. 12) + anexo operacional sem valores até a pág. 40.
- WhatsApp: bot de verdade fica fora (Meta Business, servidor, custo, risco de banimento com API não
  oficial). No Capítulo 5: links `wa.me` em lote, WhatsApp Web assistido (humano aperta enviar) e
  demonstração da Pandora.
- Chrome: a extensão Claude in Chrome funciona com o app desktop do Claude Code (verificado nas docs
  em 2026-10-20). Prática do Capítulo 5 usa um portal-treino fictício publicado por nós.

## 2026-10-20 (tarde) — curso inteiro, capítulos e cobertura
- "Noite" virou "capítulo" (pastas `capitulos/`, textos). URLs antigas de `noites/` deixaram de existir.
- Estrutura dos capítulos segue a ementa VENDIDA da T04 (tabela `Cursos`): 3 = pasta + planilha, 4 = declarações
  + contrato, 5 = conteúdo, prova, Skills, Conectores, Cowork, 6 = mini-site, hábitos, voltar atrás, fluxo próprio.
  O Chrome entra no Cap 6 ("o agente no seu dia a dia"); WhatsApp como estação de links wa.me no Cap 4.
- Cap 1 ganhou mitos × realidade e Prática D (imagem com Nano Banana), itens vendidos que faltavam, e a
  demonstração ao vivo do Claude Code.
- Fluxos desenhados animados (`shared/fluxo.js`), avanço etapa a etapa, para a teoria; teatro só no Cap 1.
- Hub com a mini-IA treinável no navegador (`shared/mini-ia.js`). Logo oficial da Programa AI (SVG) e
  logos de ferramentas (simple-icons, CC0) em `assets/logos/`.
- Kit: imagens da pasta bagunca tornadas únicas (só as duplicatas intencionais continuam iguais).
