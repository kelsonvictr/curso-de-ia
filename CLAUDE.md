# Curso de IA (v2) — Programa AI

Material HTML do curso presencial **Inteligência Artificial na Prática para Profissionais**
(6 noites × 2h). Público: profissionais de todas as áreas (contábil, jurídico, administrativo,
RH, educação, saúde), a maioria fora de TI. Claude Code é a ferramenta-chave a partir da Noite 2.
Sucessor do `oficina-claude-code/` (v1), que continua existindo e não deve ser editado daqui.

**A memória viva mora em `context/`** — leia `context/00-visao.md` primeiro.
- Decisões (append-only, datadas): `context/01-decisoes.md`
- Plano das noites: `context/02-plano-noites.md`
- Fatos verificados (planos, Chrome, instalação): `context/03-fatos.md` — nunca inventar comando/preço fora dele

## Estrutura
- `index.html` — hub (mapa das 6 noites)
- `noites/NN-slug/` — uma noite por pasta: `index.html`, `noite.css`, `noite.js`, teatros (`teatro-*/`) e vídeos (`video/`)
- `shared/base.css` + `shared/curso.js` — identidade "noite de trabalho" e comportamentos comuns
- `assets/kit/` — arquivos fictícios de treino (contrato de 41 páginas etc.)
- `tooling/` — projetos de vídeo 8-bit (HyperFrames); `node_modules`, `renders/`, `snapshots/` não vão pro git
- `tools/checar.py` — lint da casa

## Regras da casa
- Ligaduras OFF em toda fonte mono (regra global em `base.css` + repetir em classe mono local).
- Escapar `<>&` em `<pre>`. Nada de `->`, `!=`, `>=` virando símbolo.
- PT-BR, tom adulto e caloroso, um conceito por vez. Dados de exercício sempre fictícios.
- Nada de datas/semestre no conteúdo (material reaproveitável entre turmas).
- Cada noite: teoria → simulação/teatro → prática (núcleo + estação por área) → leve pro trabalho → quiz.
- Animações começam por ação do aluno (sem autoplay); vídeos com `preload="none"`, 720 px.
- Áudio ElevenLabs gerado na criação e salvo local; nunca TTS no navegador.

Depois de editar HTML:

```bash
python3 tools/checar.py
```
