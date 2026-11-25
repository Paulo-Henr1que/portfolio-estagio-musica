// ═══════════════════════════════════════════════════════════════════
//  Estrutura do portfólio: quais páginas existem, quais campos cada
//  uma tem, o que aparece no menu, os textos fixos e a aparência.
//  Nada de conteúdo de página aqui — ele fica em js/conteudo.js (ou
//  no que o painel publicou).
// ═══════════════════════════════════════════════════════════════════

// Campos de identificação da capa. Chave + rótulo padrão.
const IDENTIFICACAO = [
  ['universidade', 'Universidade'],
  ['curso',        'Curso'],
  ['disciplina',   'Disciplina'],
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

// Rótulos dos campos que o painel pode renomear (Textos do site).
window.CAMPOS_ROTULOS = [
  ['Campos da Identificação', 'ident', IDENTIFICACAO],
  ['Campos da Escola', 'escola', CAMPOS_ESCOLA],
]

// Os quatro tópicos da Introdução: chave, título e o que escrever.
const TOPICOS_INTRODUCAO = [
  ['contexto-do-estagio', 'Contexto do Estágio',
    'Um ou dois parágrafos sobre o projeto de estágio e os outros níveis de estágio cursados: em que local, o que desenvolveu e o que aprendeu em cada um deles.'],
  ['contexto-deste-estagio', 'Contexto deste Estágio',
    'Organização da disciplina de estágio e das atividades desenvolvidas, organização do estágio na escola campo, distribuição da carga horária, período em que ocorreu e a carga horária de cada atividade.'],
  ['turmas', 'As Turmas',
    'As turmas em que o estágio foi realizado: número de alunos, faixa etária e informações gerais das semanas de observação, como a relação professor-aluno, a relação entre os alunos e os conteúdos desenvolvidos.'],
  ['leituras', 'Leituras e Reflexões',
    'Breve relato sobre as atividades de leitura e reflexão sobre o estágio propostas pela equipe de professores do estágio.'],
]

// ── Textos fixos do site ───────────────────────────────────────────
// Tudo que aparece escrito no site e não é conteúdo de página. O painel
// edita em "Textos do site"; campo vazio volta ao padrão daqui.
window.TEXTOS_PADRAO = [
  ['Topo do site', [
    ['marcaTitulo', 'Nome ao lado da logo', 'Portfólio de Estágio'],
    ['marcaSub', 'Linha pequena abaixo do nome', 'Licenciatura em Música'],
    ['estagioSeletor', 'Rótulo do seletor de estágios', 'Estágio'],
  ]],
  ['Capa', [
    ['capaRotulo', 'Frase pequena acima do título', 'Portfólio reflexivo de estágio supervisionado'],
    ['capaTitulo', 'Título (quando a Identificação não tem título)', 'Portfólio Reflexivo de Estágio Supervisionado em Licenciatura em Música'],
    ['capaLinha', 'Frase abaixo do título', 'Relatos de observação, planos de aula, relatos das aulas ministradas e reflexões sobre a prática docente.'],
  ]],
  ['Títulos da página inicial', [
    ['secIdent', 'Identificação', 'Identificação'],
    ['secSobre', 'Sobre este portfólio', 'Sobre este portfólio'],
    ['secDocs', 'Documentos do estágio', 'Documentos do estágio'],
    ['secSecoes', 'Seções do portfólio', 'Seções do portfólio'],
    ['semDocsTit', 'Aviso sem documentos (título)', 'Ainda sem documentos'],
    ['semDocs', 'Aviso sem documentos (texto)', 'A ficha de frequência e a ficha de avaliação assinadas aparecerão aqui assim que forem adicionadas ao portfólio.'],
  ]],
  ['Resumos das seções (lista da página inicial)', [
    ['res-biografia', 'Biografia', 'Trajetória, formação e relação com a música.'],
    ['res-escola', 'A Escola', 'Caracterização e contexto da escola onde o estágio foi realizado.'],
    ['res-introducao', 'Introdução', 'Contexto do estágio, as turmas e as leituras que acompanharam a prática.'],
    ['res-observacoes', 'Observações', 'Três relatos das semanas de observação.'],
    ['res-planos', 'Planos de Aula', 'Os sete planos de aula corrigidos.'],
    ['res-relatos', 'Relatos de Aula', 'Os sete relatos das aulas ministradas.'],
    ['res-consideracoes', 'Reflexões', 'Reflexão sobre a experiência do estágio.'],
    ['res-bibliografia', 'Bibliografia', 'Referências utilizadas ao longo do portfólio.'],
  ]],
  ['Nomes das páginas numeradas', [
    ['nomeObservacao', 'Relato de observação', 'Relato de Observação'],
    ['nomePlano', 'Plano de aula', 'Plano de Aula'],
    ['nomeRelato', 'Relato de aula', 'Relato de Aula'],
  ]],
  ['Botões, links e avisos', [
    ['acessar', 'Título acima das listas', 'Acessar'],
    ['aPreencher', 'Marca de campo vazio', 'a preencher'],
    ['pontePlano', 'Botão do relato para o plano', 'Ver o planejamento desta aula'],
    ['ponteRelato', 'Botão do plano para o relato', 'Ver como esta aula aconteceu'],
    ['abrirPdf', 'Link do PDF', 'Abrir o PDF ↗'],
    ['abrirDrive', 'Link do Google Drive', 'Abrir no Google Drive ↗'],
    ['baixar', 'Botão de baixar', 'Baixar'],
    ['abrir', 'Botão de abrir', 'Abrir'],
    ['continuar', 'Texto que abre o resto do relato', 'Continuar lendo'],
    ['fotosVideos', 'Caixa de fotos e vídeos do relato', 'Fotos e vídeos'],
    ['refsVazio', 'Aviso da bibliografia vazia', 'As referências ainda serão cadastradas. Elas aparecem aqui ordenadas alfabeticamente de forma automática.'],
  ]],
]
const TEXTO_MAPA = Object.fromEntries(window.TEXTOS_PADRAO.flatMap(([, l]) => l.map(([k, , v]) => [k, v])))
window.texto = (k, conteudo) => {
  const c = conteudo || window.CONTEUDO || {}
  const v = ((c._site || {}).textos || {})[k]
  return v && String(v).trim() ? String(v).trim() : (TEXTO_MAPA[k] ?? '')
}
// rótulo de campo, com o nome editado no painel (rotulos.ident.curso etc.)
window.rotuloCampo = (grupo, k, padrao, conteudo) => {
  const c = conteudo || window.CONTEUDO || {}
  const v = (((c._site || {}).rotulos || {})[grupo] || {})[k]
  return v && String(v).trim() ? String(v).trim() : padrao
}

// ── Montagem das seções ────────────────────────────────────────────
const S = (id, titulo, extra = {}) => ({ id, titulo, blocos: true, ...extra })

// Subpáginas padrão da Introdução: cada tópico é uma página própria.
const PAGINAS_PADRAO = {
  introducao: TOPICOS_INTRODUCAO.map(([k, titulo, dica]) => ({ id: 'introducao-' + k, titulo, dica })),
}

// Seções em que o painel pode criar, renomear e remover subpáginas.
// A lista fica no conteúdo (conteudo[secao].paginas); sem ela, vale o padrão.
const COM_SUBPAGINAS = ['biografia', 'escola', 'introducao', 'consideracoes']

// Quantas páginas cada lista numerada tem (o painel pode mudar).
window.QTD_PADRAO = { observacoes: 3, planos: 7, relatos: 7 }
const faixa = (n) => Array.from({ length: n }, (_, i) => i + 1)
const qtd = (site, k) => Math.max(1, Math.min(30, Number((site.quantidades || {})[k]) || window.QTD_PADRAO[k]))

// Seção que aceita subpáginas: sem nenhuma, é uma página comum; com
// subpáginas, vira um índice (texto de abertura opcional + lista).
function comSubpaginas (sec, conteudo) {
  const salvas = conteudo && conteudo[sec.id] && conteudo[sec.id].paginas
  const lista = (Array.isArray(salvas) ? salvas : PAGINAS_PADRAO[sec.id] || []).filter(p => p && p.id)
  const filhos = lista.map((p, i) => S(p.id, p.titulo || 'Página sem título',
    { pai: sec.id, ordem: i + 1, dica: p.dica || '', criada: true }))
  return [{ ...sec, subpaginas: true, semAbertura: true, filhos: filhos.length ? filhos : undefined }, ...filhos]
}

// Monta a lista de páginas do site. O site e o painel chamam de novo
// sempre que o conteúdo muda (subpágina nova, menu editado etc.).
window.montarSecoes = function (conteudo) {
  const c = conteudo || window.CONTEUDO || {}
  const site = c._site || {}
  const T = (k) => window.texto(k, c)
  const R = (lista, grupo) => lista.map(([k, rot]) => [k, window.rotuloCampo(grupo, k, rot, c)])
  const sub = (s) => COM_SUBPAGINAS.includes(s.id) ? comSubpaginas(s, c) : [s]

  const observacoes = faixa(qtd(site, 'observacoes')).map(n => S(
    'observacao-' + n, T('nomeObservacao') + ' ' + n,
    { campos: CAMPOS_OBSERVACAO, pai: 'observacoes', ordem: n, rotulo: T('nomeObservacao') }))
  const planos = faixa(qtd(site, 'planos')).map(n => S(
    'plano-' + n, T('nomePlano') + ' ' + n,
    { campos: CAMPOS_PLANO, partes: PARTES_PLANO, pai: 'planos', ordem: n, rotulo: T('nomePlano') }))
  const relatos = faixa(qtd(site, 'relatos')).map(n => S(
    'relato-' + n, T('nomeRelato') + ' ' + n,
    { campos: CAMPOS_RELATO_AULA, pai: 'relatos', ordem: n, rotulo: T('nomeRelato') }))

  let lista = [
    { id: 'inicio', titulo: 'Início', menu: true,
      campos: R(IDENTIFICACAO, 'ident'), campoTitulo: true, blocos: true, documentos: true },

    ...sub(S('biografia', 'Biografia', { menu: true })),

    ...sub(S('escola', 'Dados da Escola', { menu: true, menuTitulo: 'A Escola', campos: R(CAMPOS_ESCOLA, 'escola') })),

    ...sub(S('introducao', 'Introdução', { menu: true })),

    S('observacoes', 'Relatos de Observação', { menu: true, menuTitulo: 'Observações', filhos: observacoes }),
    ...observacoes,

    S('planos', 'Planos de Aula', { menu: true, filhos: planos }),
    ...planos,

    S('relatos', 'Relatos das Aulas', { menu: true, menuTitulo: 'Relatos de Aula', filhos: relatos }),
    ...relatos,

    ...sub(S('consideracoes', 'Minhas Reflexões e Observações', { menu: true, menuTitulo: 'Reflexões' })),

    { id: 'bibliografia', titulo: 'Bibliografia', menu: true, referencias: true },
  ]

  // Menu editado no painel: nome no menu, título da página, ocultar e ordem.
  const menu = site.menu || {}
  lista = lista.map(s => {
    const m = !s.pai && menu[s.id]
    const base = s.pai ? s : { ...s, menuPadrao: s.menuTitulo || s.titulo, tituloPadrao: s.titulo }
    if (!m) return base
    return { ...base,
      ...(m.titulo && m.titulo.trim() ? { titulo: m.titulo.trim() } : {}),
      ...(m.menu && m.menu.trim() ? { menuTitulo: m.menu.trim() } : {}),
      ...(m.oculto && s.id !== 'inicio' ? { menu: false, oculto: true } : {}) }
  })
  const ordem = Array.isArray(site.ordem) ? site.ordem : []
  if (ordem.length) {
    // reordena os grupos de primeiro nível, levando junto as páginas filhas
    const grupos = []
    for (const s of lista) if (!s.pai) grupos.push([s, ...lista.filter(x => x.pai === s.id)])
    const pos = (id) => { const i = ordem.indexOf(id); return id === 'inicio' ? -1 : i < 0 ? 999 : i }
    grupos.sort((a, b) => pos(a[0].id) - pos(b[0].id))
    lista = grupos.flat()
  }
  window.SECOES = lista
  return window.SECOES
}

window.secao = (id) => window.SECOES.find(s => s.id === id)

// ── Aparência: paletas, fontes e logo ──────────────────────────────
// Cada paleta define as cores-base; as intermediárias saem da mistura.
window.PALETAS = {
  verde:     { nome: 'Verde (original)', pastel: '#E9F1E4', medio: '#6E9166', 'medio-f': '#4F7549', escuro: '#24402A', tinta: '#2E3A33' },
  azul:      { nome: 'Azul sereno', pastel: '#E6EEF5', medio: '#5F86A8', 'medio-f': '#3F6688', escuro: '#1F3550', tinta: '#2B3440' },
  lilas:     { nome: 'Lilás', pastel: '#F0EAF5', medio: '#8C73A8', 'medio-f': '#6B5288', escuro: '#3A2A50', tinta: '#352E3D' },
  terracota: { nome: 'Terracota', pastel: '#F6ECE4', medio: '#B9775A', 'medio-f': '#97573D', escuro: '#4E2A1C', tinta: '#3B302B' },
  rosa:      { nome: 'Rosa antigo', pastel: '#F7EAED', medio: '#B0707F', 'medio-f': '#8E4F5F', escuro: '#4C2430', tinta: '#3C2F33' },
  mostarda:  { nome: 'Mostarda', pastel: '#F6F0DF', medio: '#B39445', 'medio-f': '#8C722C', escuro: '#43361A', tinta: '#38322A' },
  grafite:   { nome: 'Grafite', pastel: '#EEEFEF', medio: '#77807F', 'medio-f': '#545D5C', escuro: '#232828', tinta: '#2D3232' },
}
window.CORES_EDITAVEIS = [
  ['pastel', 'Fundo do site'], ['medio', 'Detalhes e ícones'], ['medio-f', 'Destaque e links'],
  ['escuro', 'Títulos'], ['tinta', 'Texto'],
]
window.FONTES_TITULO = ['EB Garamond', 'Cormorant Garamond', 'Playfair Display', 'Lora', 'Libre Baskerville', 'Merriweather', 'Fraunces', 'Crimson Pro', 'Spectral', 'Poppins', 'Montserrat', 'Nunito']
window.FONTES_TEXTO = ['Karla', 'Inter', 'Nunito Sans', 'Lato', 'Open Sans', 'Source Sans 3', 'Work Sans', 'DM Sans', 'Poppins', 'Manrope', 'Rubik']

// as cores em uso (paleta escolhida ou a própria)
window.coresDoTema = function (conteudo) {
  const t = ((conteudo || {})._site || {}).tema || {}
  const pal = window.PALETAS[t.paleta] || window.PALETAS.verde
  return { ...window.PALETAS.verde, ...pal, ...(t.paleta === 'propria' ? t.cores || {} : {}) }
}

// Aplica cores e fontes na página (site, pré-visualização e painel).
window.aplicarTema = function (conteudo, alvo = document.documentElement) {
  const t = ((conteudo || {})._site || {}).tema || {}
  const st = alvo.style
  const todas = ['pastel', 'pastel-2', 'claro', 'medio', 'medio-f', 'escuro', 'escuro-2', 'tinta', 'tinta-2', 'borda', 'linha', 'creme']
  if (!t.paleta || t.paleta === 'verde') todas.forEach(k => st.removeProperty('--' + k))
  else {
    const b = window.coresDoTema(conteudo)
    for (const [k] of window.CORES_EDITAVEIS) st.setProperty('--' + k, b[k])
    const mix = (x, y, p) => `color-mix(in srgb, ${x} ${p}%, ${y})`
    st.setProperty('--pastel-2', mix(b.pastel, b.medio, 86))
    st.setProperty('--claro', mix(b.pastel, b.medio, 62))
    st.setProperty('--borda', mix(b.pastel, b.medio, 76))
    st.setProperty('--linha', mix(b.pastel, b.medio, 66))
    st.setProperty('--escuro-2', mix(b.escuro, '#000', 70))
    st.setProperty('--tinta-2', mix(b.tinta, b.pastel, 64))
    st.setProperty('--creme', mix('#FFFFFF', b.pastel, 55))
  }
  // fontes do Google (as originais já vêm carregadas)
  const ft = t.fonteTitulo && t.fonteTitulo !== 'EB Garamond' ? t.fonteTitulo : ''
  const fx = t.fonteTexto && t.fonteTexto !== 'Karla' ? t.fonteTexto : ''
  if (ft) st.setProperty('--serif', `"Ordinal", "${ft}", Georgia, serif`); else st.removeProperty('--serif')
  if (fx) st.setProperty('--sans', `"Ordinal", "${fx}", -apple-system, "Segoe UI", Roboto, Arial, sans-serif`); else st.removeProperty('--sans')
  window.carregarFontes([ft, fx].filter(Boolean), 'fontes-tema')
}
window.carregarFontes = function (familias, id) {
  let ln = document.getElementById(id)
  if (!familias.length) { if (ln) ln.remove(); return }
  const href = 'https://fonts.googleapis.com/css2?' +
    familias.map(f => 'family=' + f.replace(/ /g, '+') + ':wght@400;500;600;700').join('&') + '&display=swap'
  if (!ln) { ln = document.createElement('link'); ln.id = id; ln.rel = 'stylesheet'; document.head.appendChild(ln) }
  if (ln.getAttribute('href') !== href) ln.setAttribute('href', href)
}

window.montarSecoes()

// Tipos de bloco que o editor oferece.
window.TIPOS_BLOCO = {
  subtitulo: 'Subtítulo',
  texto:     'Parágrafo',
  citacao:   'Citação',
  imagem:    'Imagem',
  galeria:   'Galeria de imagens',
  video:     'Vídeo',
}
