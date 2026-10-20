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
