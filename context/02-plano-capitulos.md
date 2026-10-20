# Plano dos 6 capítulos (um por encontro de 2h)

Formato de cada capítulo: abertura com a demanda da Marta → regra central → teoria com **fluxo desenhado
animado** (shared/fluxo.js, etapa por etapa, sem autoplay) → **simulador** → práticas guiadas com prompt
copiável e gabarito conferido no kit → estação por área → "leve para o trabalho" → quiz → navegação.

| Cap | Pasta | Tema | Fluxos | Simuladores | Práticas |
|---|---|---|---|---|---|
| 1 | `capitulos/01-panorama` | O que a IA faz de verdade | do Enter à resposta · treino × conversa · para onde vai o que você cola · ciclo do agente | teatro aprovado (Lia/Beto/Tico, vozes) · próxima palavra · cena da multa (Marta/Tico, vozes) · montador de briefing · mitos (cartas) · semáforo · chat × agente · vídeo 8-bit | A fraco × forte · B três IAs · C NotebookLM · D imagem (Nano Banana) · demo Claude Code ao vivo |
| 2 | `capitulos/02-agente` | Do chat ao agente | o agente por dentro · onde mora cada Claude | você é o porteiro (7 pedidos) | A instalação pelo app · B kit + primeira conversa · estações por área |
| 3 | `capitulos/03-arquivos` | O agente nos seus arquivos | diagnóstico→plano→execução→conferência · conta de cabeça × programa | a pasta se arruma (FLIP, desfazer) · dado sujo engana gráfico | A pasta bagunçada · B planilha de gastos · estações |
| 4 | `capitulos/04-documentos` | O agente nos seus documentos | modelo + lista = lote · do PDF à resposta com endereço · contato → link wa.me | fábrica de declarações (erro no modelo) · caçador de cláusulas | A 30 declarações em PDF · B contrato · estação WhatsApp (links) |
| 5 | `capitulos/05-conteudo` | Conteúdo e ensino no automático | um release, quatro canais · prepare a reunião (Skill + Conectores) | curadoria de questões · monte uma Skill | A um texto vira dez · B prova A/B · C primeira Skill · conectores e Cowork (demo) |
| 6 | `capitulos/06-dia-a-dia` | Sua página e o agente no dia a dia | Claude Code + Chrome · prompt injection · tarefa agendada | máquina do tempo · planejador do seu fluxo | A mini-site · B portal-treino (extrair + formulário) · CLAUDE.md · tarefa agendada |

Extras: hub com a mini-IA treinável (`shared/mini-ia.js`); `portal-treino/` (prefeitura fictícia de Vila Aurora:
notas em 3 páginas, formulário de certidão, página de avisos com instrução escondida).

## Matriz de cobertura da ementa vendida (tabela `Cursos`, T04, lida em 2026-10-20)

| Item vendido | Onde |
|---|---|
| O que é IA generativa / o que um LLM faz | Cap 1 · 01 (fluxo, teatro, próxima palavra) |
| Mitos × realidade | Cap 1 · cartas de mitos |
| Alucinação | Cap 1 · 02 (cena da multa, hábitos) |
| Contexto × memória | Cap 1 · fluxo treino × conversa |
| Dados sensíveis | Cap 1 · 05 semáforo + fluxo "para onde vai" |
| Fórmula do pedido testada no ChatGPT, Gemini e Claude | Cap 1 · 03 montador + Práticas A e B |
| Imagens com o Nano Banana | Cap 1 · Prática D |
| NotebookLM com citação | Cap 1 · Prática C |
| Chat × agente | Cap 1 · demo + Cap 2 · 01 |
| Claude na web (Artifacts e Projects) × Claude Code | Cap 2 · 03 |
| Instalação guiada Windows/Mac pelo app, sem terminal | Cap 2 · Prática A |
| Primeira conversa e o kit | Cap 2 · Prática B |
| Pasta bagunçada, 34 arquivos, plano antes de mexer | Cap 3 · Prática A (+ simulador) |
| Planilha de gastos: análise, gráfico, respostas sem fórmula | Cap 3 · Prática B (+ simulador) |
| Conferência na fonte por amostra | Cap 3 · método e etapas 4/5 |
| Declarações em lote, em PDF | Cap 4 · Prática A |
| Contrato: resumo executivo, tabela de valores e prazos, cláusula exata | Cap 4 · Prática B |
| Armadilhas (números, datas, certezas) | Cap 4 · 07 |
| Um texto vira dez com arquivo de regras de tom | Cap 5 · Prática A |
| Prova com gabarito comentado, versões A e B, lista de presença, curadoria | Cap 5 · Prática B + simulador |
| Skills | Cap 5 · 05–07 |
| Conectores Google Drive, Gmail e Agenda | Cap 5 · 05 e 08 |
| Cowork operando com o seu ok | Cap 5 · 05 e 08 (descrição + demo) |
| Mini-site (currículo, portfólio, negócio) aberto no navegador | Cap 6 · Prática A |
| 5 hábitos, limites honestos | Cap 6 · 09 |
| Como voltar atrás | Cap 6 · 05 (máquina do tempo) + relatório do Cap 3 |
| Montar o próprio fluxo / primeira automação | Cap 6 · 08 (planejador) + tarefa agendada |
| Prompts prontos, kit fictício, quiz em cada módulo | todos os capítulos · kit-aurora.zip |
| Os 11 capítulos da Oficina Claude Code | link de apoio no hub e no Cap 6 (v1 publicada) |

Extras além da ementa: Claude Code + Chrome (Cap 6), prompt injection, links de WhatsApp em lote (Cap 4),
tarefas agendadas, CLAUDE.md, mini-IA do hub.

## Estado (2026-10-20)
- Capítulos 1 a 6 escritos e testados no navegador (desktop e 375 px).
- Pendente de produção: cenas narradas (vozes) e vídeos 8-bit dos Caps 2–6, se o professor quiser.
- Revalidar a instalação no app na véspera do Cap 2 (os nomes de menu mudam entre versões).
