// ═══════════════════════════════════════════════════════════════════
//  Estrutura do portfólio: quais páginas existem, quais campos cada
//  uma tem e o que aparece no menu. Nada de conteúdo aqui — o
//  conteúdo vive no banco e é escrito pela área administrativa.
// ═══════════════════════════════════════════════════════════════════

// Campos de identificação da capa. Rótulo + dica, nenhum valor.
const IDENTIFICACAO = [
  ['universidade', 'Universidade'],
  ['curso',        'Curso'],
  ['disciplina',   'Disciplina / componente curricular'],
  ['estudante',    'Estudante'],
  ['orientador',   'Professor(a) orientador(a)'],
  ['supervisor',   'Professor(a) supervisor(a)'],
  ['escola',       'Escola'],
  ['cidade',       'Cidade'],
  ['estado',       'Estado'],
  ['ano',          'Ano'],
]

const CAMPOS_ESCOLA = [
  ['nome',        'Nome da escola'],
  ['localizacao', 'Localização'],
  ['etapas',      'Etapas de ensino'],
  ['turmas',      'Turmas acompanhadas'],
]

const CAMPOS_OBSERVACAO = [
  ['data',  'Data'],
  ['turma', 'Turma'],
]

const CAMPOS_PLANO = [
  ['numero', 'Número do plano'],
  ['titulo', 'Título'],
  ['data',   'Data'],
  ['tema',   'Tema'],
]

// As partes longas de um plano de aula. Cada uma vira um bloco de
// texto próprio no editor, na ordem em que aparecem aqui.
const PARTES_PLANO = [
  ['objetivos',     'Objetivos'],
  ['conteudos',     'Conteúdos'],
  ['metodologia',   'Metodologia'],
  ['desenvolvimento','Desenvolvimento'],
  ['recursos',      'Recursos'],
  ['repertorio',    'Repertório musical'],
  ['avaliacao',     'Avaliação'],
  ['referencias',   'Referências'],
  ['observacoes',   'Observações'],
]

const CAMPOS_RELATO_AULA = [
  ['numero', 'Número da aula'],
  ['data',   'Data'],
  ['turma',  'Turma'],
]

// ── Montagem das seções ────────────────────────────────────────────
const S = (id, titulo, extra = {}) => ({ id, titulo, blocos: true, ...extra })

const observacoes = [1, 2, 3].map(n => S(
  'observacao-' + n, 'Relato de Observação ' + n,
  { campos: CAMPOS_OBSERVACAO, pai: 'observacoes', ordem: n }
))

const planos = [1, 2, 3, 4, 5, 6, 7].map(n => S(
  'plano-' + n, 'Plano de Aula ' + n,
  { campos: CAMPOS_PLANO, partes: PARTES_PLANO, pai: 'planos', ordem: n }
))

const relatos = [1, 2, 3, 4, 5, 6, 7].map(n => S(
  'relato-' + n, 'Relato de Aula ' + n,
  { campos: CAMPOS_RELATO_AULA, pai: 'relatos', ordem: n }
))

window.SECOES = [
  { id: 'inicio', titulo: 'Início', menu: true,
    campos: IDENTIFICACAO, campoTitulo: true, blocos: true, documentos: true },

  S('biografia', 'Biografia', { menu: true }),

  S('escola', 'Dados da Escola', { menu: true, campos: CAMPOS_ESCOLA }),

  S('observacoes', 'Relatos de Observação', { menu: true, filhos: observacoes }),
  ...observacoes,

  S('planos', 'Planos de Aula', { menu: true, filhos: planos }),
  ...planos,

  S('relatos', 'Relatos das Aulas', { menu: true, filhos: relatos }),
  ...relatos,

  S('consideracoes', 'Minhas Considerações e Observações', { menu: true, menuTitulo: 'Considerações' }),

  { id: 'bibliografia', titulo: 'Bibliografia', menu: true, referencias: true },
]

window.secao = (id) => window.SECOES.find(s => s.id === id)

// Tipos de bloco que o editor oferece.
window.TIPOS_BLOCO = {
  subtitulo: 'Subtítulo',
  texto:     'Parágrafo',
  citacao:   'Citação',
  imagem:    'Imagem',
  galeria:   'Galeria de imagens',
  video:     'Vídeo',
}
