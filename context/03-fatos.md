# Fatos verificados

## Claude Code + Chrome (verificado em 2026-10-20, code.claude.com/docs/en/chrome e /desktop)
- Extensão "Claude in Chrome" (Chrome Web Store), versão 1.0.36+. Funciona em Chrome e Edge (e outros
  Chromium). Não funciona no WSL.
- Exige plano direto da Anthropic (Pro, Max, Team ou Enterprise) e login com `/login` (não API key).
- CLI: `claude --chrome`; `/chrome` mostra status, permissões e "Enabled by default".
- O app desktop (aba Code) usa o Claude in Chrome quando está configurado. O app também tem um
  navegador próprio (painel Browser, Cmd/Ctrl+Shift+B) com perfil limpo, sem os logins do usuário.
- Compartilha os logins do navegador; para em página de login ou CAPTCHA e pede para o humano fazer.
- Permissões por site vêm da extensão.

## Planos e preços
- Claude Code exige plano pago; preço sempre por link: https://claude.com/pricing (não escrever valor).
- Fatos de instalação da v1 continuam em `../oficina-claude-code/context/03-fatos-instalacao.md`
  (verificados em 2026-08-12; revalidar antes do Capítulo 2).

## Contrato do kit (`assets/kit/contrato/contrato-prestacao-servicos.pdf`, 41 págs)
- Cláusula Segunda: prazo 24 meses, prorrogável por termo aditivo.
- Cláusula Terceira: R$ 7.350,00/mês, vencimento dia 5.
- Cláusula Quarta: reajuste anual pelo IPCA.
- Cláusula Quinta: multa por rescisão imotivada R$ 14.700,00 (duas mensalidades).
- Cláusula Oitava: urgente em até 6 horas úteis; comum em até 2 dias úteis.
- Não há nada sobre drones (pergunta-armadilha).

## App desktop (verificado em 2026-10-20, code.claude.com/docs/en/desktop-quickstart e /desktop)
- Download: macOS `https://claude.ai/api/desktop/darwin/universal/dmg/latest/redirect` ·
  Windows x64 `https://claude.ai/api/desktop/win32/x64/setup/latest/redirect` (ARM64 tem instalador próprio).
- Abas Chat, Cowork e Code. Code exige plano pago (Pro, Max, Team, Enterprise); se pedir upgrade, falta o plano.
- O app já inclui o Claude Code: não precisa de Node nem do CLI.
- Sessão: seletor de ambiente → **Local**; controle de pasta → **Open folder…**.
- Modos de permissão: **Manual** (pergunta antes de editar/rodar), **Accept edits**, **Plan** (só propõe),
  **Auto** (classificador decide), Bypass. Versões antigas chamavam de Ask permissions / Auto accept edits / Plan mode.
- Git: as docs atuais só dizem que o Git é exigido para "session isolation" (worktrees). A exigência para
  sessões locais no Windows (verificada em 2026-08-12) não aparece mais — material diz "se o app pedir".
- Conectores: botão **+** ao lado da caixa de texto → **Add connectors** (ou Connectors → Browse connectors);
  gerenciar em **Settings > Connectors**. Skills/conectores/plugins juntos em **Customize** na barra lateral.
- Skills: `~/.claude/skills/<nome>/SKILL.md` (pessoal) ou `.claude/skills/<nome>/SKILL.md` (projeto);
  frontmatter `name` + `description`; Claude carrega sozinho pela descrição ou com `/nome`.
- Tarefas agendadas locais: Code → **Scheduled** → **New task**; presets Hourly, Daily, Weekdays, Weekly, Manual;
  só rodam com o app aberto e o computador acordado; uma execução de recuperação se perder horários.
- Undo/checkpoints no app não estão documentados: o material usa "relatório do que mudou" + git como máquina do tempo.

## Kit (verificado em 2026-10-20)
- `bagunca/`: 34 arquivos = 15 imagens (10 jpg, 1 jpeg, 4 png), 14 textos/planilhas (11 txt, 3 csv), 5 PDFs.
  Duplicados de conteúdo: 4 grupos (3 "relatorio final…", 2 "anotações reunião", IMG_8274 + "cópia de IMG_8274",
  2 "logo-final-AGORA-VAI"). A v1 dizia 12 textos e 7 PDFs (errado). Imagens tornadas únicas em 2026-10-20.
- `planilha/gastos-2025.csv`: 306 lançamentos, separador `;`, decimal com vírgula. Totais (juntando grafias):
  Mercado 17.193,78 · Moradia 14.162,58 · Saúde 13.373,84 · Educação 11.696,27 · Alimentação 7.830,72 ·
  Lazer 4.994,43 · Transporte 4.868,94 · sem categoria 824,58 (6 linhas) · total 74.945,14.
  5 linhas duplicadas exatas; valor fora da curva: 17/08 "jantar de aniversário" R$ 4.890,00 (mediana da categoria ~R$ 79).
- `declaracoes/`: 30 pessoas (AUR-0001…AUR-0030), modelo com {{NOME}}, {{MATRICULA}}, {{CURSO}}, {{CARGA_HORARIA}}.
- `marketing/release-produto.txt`: Aurora Termo 500, 500 ml, quente 12h / gelado 24h, R$ 249,00 (pré-venda R$ 219,00).
- `professor/apostila-capitulo.txt`: juros compostos, regra dos 72 (8% a.a. → 9 anos).
- Contrato (cláusulas extras): Sexta garantia 3 meses; Sétima confidencialidade 5 anos; Décima Primeira foro João Pessoa.
  Uma cláusula por página (Primeira = pág. 2 … Décima Primeira = pág. 12); págs. 13–40 anexo operacional; 41 assinaturas.
