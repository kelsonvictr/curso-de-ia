#!/usr/bin/env python3
"""
Regera o contrato de treino do kit (assets/kit/contrato/contrato-prestacao-servicos.pdf).

    python3 tools/gerar_contrato.py

Por que existe: o gerador da v1 numerava as cláusulas em ciclo (PRIMEIRA…VIGÉSIMA e de novo
PRIMEIRA), então "Cláusula Quinta" aparecia duas vezes com conteúdos diferentes. Aqui cada uma das
11 cláusulas aparece UMA vez (Primeira na pág. 2 … Décima Primeira na pág. 12); as páginas 13 a 40
são procedimentos operacionais sem valores nem prazos, só para o documento ter 41 páginas.
"""
import io
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
DESTINO = RAIZ / 'assets' / 'kit' / 'contrato' / 'contrato-prestacao-servicos.pdf'

def _pdf_escape(linha: str) -> bytes:
    txt = linha.replace('\\', r'\\').replace('(', r'\(').replace(')', r'\)')
    return txt.encode('cp1252', errors='replace')


def make_pdf(caminho: Path, paginas):
    """paginas: lista de páginas; cada página é uma lista de linhas (str)."""
    objetos = []          # (num, bytes) — numerados a partir de 1

    def add(corpo: bytes) -> int:
        objetos.append(corpo)
        return len(objetos)

    n_font = add(b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica '
                 b'/Encoding /WinAnsiEncoding >>')
    nums_paginas = []
    # reservamos o obj /Pages depois; primeiro conteúdos e páginas
    conteudos = []
    for linhas in paginas:
        fluxo = io.BytesIO()
        fluxo.write(b'BT /F1 11 Tf 50 800 Td 15 TL\n')
        for linha in linhas:
            fluxo.write(b'(' + _pdf_escape(linha) + b') Tj T*\n')
        fluxo.write(b'ET')
        dados = fluxo.getvalue()
        n_cont = add(b'<< /Length ' + str(len(dados)).encode() + b' >>\nstream\n'
                     + dados + b'\nendstream')
        conteudos.append(n_cont)

    n_pages = len(objetos) + len(paginas) + 1   # número que o obj /Pages terá
    for n_cont in conteudos:
        n_pg = add(f'<< /Type /Page /Parent {n_pages} 0 R '
                   f'/MediaBox [0 0 595 842] '
                   f'/Resources << /Font << /F1 {n_font} 0 R >> >> '
                   f'/Contents {n_cont} 0 R >>'.encode())
        nums_paginas.append(n_pg)

    kids = ' '.join(f'{n} 0 R' for n in nums_paginas)
    add(f'<< /Type /Pages /Kids [{kids}] /Count {len(nums_paginas)} >>'.encode())
    n_cat = add(f'<< /Type /Catalog /Pages {n_pages} 0 R >>'.encode())

    saida = io.BytesIO()
    saida.write(b'%PDF-1.4\n')
    offsets = [0]
    for i, corpo in enumerate(objetos, start=1):
        offsets.append(saida.tell())
        saida.write(f'{i} 0 obj\n'.encode() + corpo + b'\nendobj\n')
    inicio_xref = saida.tell()
    saida.write(f'xref\n0 {len(objetos) + 1}\n'.encode())
    saida.write(b'0000000000 65535 f \n')
    for off in offsets[1:]:
        saida.write(f'{off:010d} 00000 n \n'.encode())
    saida.write(f'trailer\n<< /Size {len(objetos) + 1} /Root {n_cat} 0 R >>\n'
                f'startxref\n{inicio_xref}\n%%EOF'.encode())
    caminho.write_bytes(saida.getvalue())



ORDINAIS = ['PRIMEIRA', 'SEGUNDA', 'TERCEIRA', 'QUARTA', 'QUINTA', 'SEXTA', 'SÉTIMA',
            'OITAVA', 'NONA', 'DÉCIMA', 'DÉCIMA PRIMEIRA']

PROCEDIMENTOS = [
    ('ABERTURA DE CHAMADOS', ['Os chamados serão abertos pelo canal eletrônico indicado pela',
                              'CONTRATADA, informando unidade, setor e equipamento afetado.']),
    ('VISITAS PREVENTIVAS', ['As visitas preventivas seguirão cronograma acordado entre as',
                             'partes, com registro das verificações realizadas em cada visita.']),
    ('RELATÓRIOS', ['A CONTRATADA manterá registro das intervenções, peças substituídas',
                    'e recomendações técnicas, disponível para consulta da CONTRATANTE.']),
    ('SEGURANÇA DO TRABALHO', ['Os técnicos utilizarão equipamentos de proteção individual e',
                               'seguirão as normas internas de acesso de cada unidade.']),
    ('PEÇAS E MATERIAIS', ['Peças de reposição serão novas ou recondicionadas com garantia de',
                           'fábrica, mediante aprovação prévia da CONTRATANTE.']),
    ('ACESSO ÀS INSTALAÇÕES', ['O acesso dos técnicos será feito em horário comercial, salvo',
                               'chamados urgentes, com identificação na portaria.']),
    ('COMUNICAÇÃO', ['As partes indicarão responsáveis para acompanhamento do contrato e',
                     'manterão seus dados de contato atualizados.']),
]

def gerar():
    temas = [
        ('DO OBJETO', ['O presente contrato tem por objeto a prestação de serviços',
                       'de manutenção preventiva e corretiva dos equipamentos de',
                       'refrigeração da CONTRATANTE, conforme Anexo A.']),
        ('DO PRAZO', ['O contrato vigorará pelo prazo de 24 (vinte e quatro) meses,',
                      'contados da data de assinatura, prorrogável por igual período',
                      'mediante termo aditivo.']),
        ('DO VALOR', ['Pelos serviços, a CONTRATANTE pagará à CONTRATADA o valor',
                      'mensal de R$ 7.350,00 (sete mil, trezentos e cinquenta reais),',
                      'com vencimento todo dia 5 (cinco) de cada mês.']),
        ('DO REAJUSTE', ['O valor mensal será reajustado anualmente pela variação',
                         'do IPCA acumulado nos 12 (doze) meses anteriores.']),
        ('DA MULTA POR RESCISÃO', ['A rescisão imotivada por qualquer das partes',
                                   'implicará multa de R$ 14.700,00 (catorze mil e',
                                   'setecentos reais), equivalente a duas mensalidades.']),
        ('DA GARANTIA', ['Os serviços executados terão garantia de 3 (três) meses,',
                         'contados da conclusão de cada atendimento.']),
        ('DA CONFIDENCIALIDADE', ['As partes manterão sigilo sobre informações trocadas',
                                  'durante a vigência e por 5 (cinco) anos após o término.']),
        ('DO ATENDIMENTO', ['Chamados urgentes serão atendidos em até 6 (seis) horas',
                            'úteis; chamados comuns, em até 2 (dois) dias úteis.']),
        ('DAS OBRIGAÇÕES DA CONTRATADA', ['Executar os serviços com pessoal habilitado,',
                                          'fornecer relatório mensal de atividades e manter',
                                          'seguro de responsabilidade civil vigente.']),
        ('DAS OBRIGAÇÕES DA CONTRATANTE', ['Garantir acesso às instalações, comunicar',
                                           'defeitos em até 48 (quarenta e oito) horas e',
                                           'efetuar os pagamentos nos prazos ajustados.']),
        ('DO FORO', ['Fica eleito o foro da Comarca de João Pessoa/PB para dirimir',
                     'quaisquer controvérsias oriundas do presente instrumento.']),
    ]
    enchimento = [
        'Parágrafo primeiro. As condições aqui previstas aplicam-se a todas as',
        'unidades da CONTRATANTE relacionadas no Anexo B, incluindo eventuais',
        'filiais inauguradas durante a vigência, desde que comunicadas por escrito.',
        'Parágrafo segundo. A tolerância de qualquer das partes quanto ao',
        'descumprimento de obrigação não implicará novação ou renúncia de direito.',
        'Parágrafo terceiro. As comunicações entre as partes serão feitas por',
        'escrito, preferencialmente por meio eletrônico, com confirmação de leitura.',
    ]

    paginas = [[
        'CONTRATO DE PRESTAÇÃO DE SERVIÇOS Nº 041/TREINO', '',
        'CONTRATANTE: Supermercados Bom Preço do Vale Ltda. (fictícia)',
        'CONTRATADA: RefriTec Manutenção e Serviços ME (fictícia)', '',
        'As partes acima identificadas celebram o presente contrato de',
        'prestação de serviços, que se regerá pelas cláusulas seguintes.', '',
        'AVISO: documento inteiramente fictício, gerado para treino de',
        'leitura de PDF no Curso de IA da Programa AI. Não possui valor legal.',
    ]]
    for n, (tema, corpo) in enumerate(temas):
        pagina = [f'CLÁUSULA {ORDINAIS[n]} — {tema}', ''] + corpo + ['']
        while len(pagina) < 44:
            pagina.append(enchimento[len(pagina) % len(enchimento)])
        paginas.append(pagina)
    item = 1
    while len(paginas) < 40:
        titulo, corpo = PROCEDIMENTOS[(item - 1) % len(PROCEDIMENTOS)]
        pagina = [f'ANEXO OPERACIONAL — ITEM {item}: {titulo}', ''] + corpo + ['']
        while len(pagina) < 44:
            pagina.append(enchimento[len(pagina) % len(enchimento)])
        paginas.append(pagina)
        item += 1
    paginas.append(['E, por estarem justas e contratadas, as partes assinam o',
                    'presente instrumento em duas vias de igual teor.',
                    '', 'João Pessoa/PB.', '',
                    '________________________________  (CONTRATANTE)',
                    '', '________________________________  (CONTRATADA)'])
    make_pdf(DESTINO, paginas)
    print(f'{DESTINO.name}: {len(paginas)} páginas')


if __name__ == '__main__':
    gerar()
