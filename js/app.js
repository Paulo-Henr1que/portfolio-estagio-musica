// ═══════════════════════════════════════════════════════════════════
//  Navegação e exibição pública do portfólio.
//  As rotas são hashes (#/plano-3), o que mantém o site 100% estático
//  e, mesmo assim, com um endereço próprio para cada página.
// ═══════════════════════════════════════════════════════════════════

const App = { conteudo: {} }

const el = document.getElementById('conteudo')
const esc = (t) => String(t ?? '').replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

// Quebra o texto digitado em parágrafos, preservando as linhas em branco.
const paragrafos = (t) => String(t || '').split(/\n{2,}/)
  .filter(p => p.trim())
  .map(p => '<p>' + esc(p.trim()).replace(/\n/g, '<br>') + '</p>').join('')

const vazio = (v) => v === undefined || v === null || String(v).trim() === ''

// ── Menu ───────────────────────────────────────────────────────────
function montarMenu () {
  const ul = document.getElementById('menu')
  ul.innerHTML = window.SECOES.filter(s => s.menu)
    .map(s => `<li><a href="#/${s.id}">${esc(s.menuTitulo || s.titulo)}</a></li>`).join('')

  const bt = document.getElementById('bt-menu')
  bt.addEventListener('click', () => {
    const aberto = ul.classList.toggle('aberto')
    bt.setAttribute('aria-expanded', String(aberto))
    bt.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu')
  })
  ul.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      ul.classList.remove('aberto')
      bt.setAttribute('aria-expanded', 'false')
    }
  })
}

function marcarMenu (id) {
  const s = window.secao(id)
  const raiz = s && s.pai ? s.pai : id
  document.querySelectorAll('#menu a').forEach(a => {
    const alvo = a.getAttribute('href').slice(2)
    if (alvo === raiz) a.setAttribute('aria-current', 'page')
    else a.removeAttribute('aria-current')
  })
}

// ── Leitura do conteúdo ────────────────────────────────────────────
// Tudo vem de js/conteudo.js, carregado junto com a página.
const dados = (id) => (window.CONTEUDO && window.CONTEUDO[id]) || {}

// ── Blocos de conteúdo ─────────────────────────────────────────────
function renderBloco (b) {
  if (!b || !b.tipo) return ''
  const leg = b.legenda ? `<figcaption>${esc(b.legenda)}</figcaption>` : ''
  switch (b.tipo) {
    case 'subtitulo':
      return b.texto ? `<h3 class="sub">${esc(b.texto)}</h3>` : ''
    case 'texto':
      return paragrafos(b.texto)
    case 'citacao':
      return b.texto ? `<blockquote>${esc(b.texto).replace(/\n/g, '<br>')}</blockquote>` : ''
    case 'imagem':
      if (!b.url) return ''
      return `<figure><img src="${esc(b.url)}" alt="${esc(b.alt || b.legenda || '')}"
              loading="lazy" data-lupa="imagem">${leg}</figure>`
    case 'galeria': {
      const itens = (b.itens || []).filter(i => i.url)
      if (!itens.length) return ''
      return `<div class="galeria">` + itens.map(i =>
        `<img src="${esc(i.url)}" alt="${esc(i.alt || i.legenda || '')}" loading="lazy"
          data-lupa="imagem" title="${esc(i.legenda || '')}">`).join('') + `</div>`
        + (b.legenda ? `<p class="legenda-galeria">${esc(b.legenda)}</p>` : '')
    }
    case 'video':
      if (!b.url) return ''
      // preload="none" — o vídeo só é baixado quando a pessoa der play
      return `<figure><video src="${esc(b.url)}" controls preload="none" playsinline
              ${b.poster ? `poster="${esc(b.poster)}"` : ''}></video>${leg}</figure>`
    default:
      return ''
  }
}

const renderBlocos = (lista) =>
  (lista || []).map(renderBloco).join('') || ''

// ── Pedaços reaproveitados ─────────────────────────────────────────
function renderCampos (defs, valores) {
  // titulo e numero já aparecem no H1 e na trilha; não se repetem nas fichas
  const ocultos = ['titulo', 'numero']
  const itens = (defs || []).filter(([k]) => !vazio(valores[k]) && !ocultos.includes(k))
  if (!itens.length) return ''
  return `<div class="campos">` + itens.map(([k, rot]) =>
    `<div class="campo"><b>${esc(rot)}</b><span>${esc(valores[k])}</span></div>`).join('') + `</div>`
}

function renderDocumentos (lista) {
  const docs = (lista || []).filter(d => d.url && d.nome)
  if (!docs.length) return `<div class="aviso"><b>Ainda sem documentos</b>
    A ficha de frequência e a ficha de avaliação assinadas aparecerão aqui
    assim que forem adicionadas ao portfólio.</div>`
  return `<div class="docs">` + docs.map(d => `
    <div class="doc">
      <div class="ic" style="color:var(--medio-f)">
        <svg viewBox="0 0 48 48" aria-hidden="true"><use href="#doc"/></svg></div>
      <div class="txt">
        <b>${esc(d.nome)}</b>
        ${d.descricao ? `<span>${esc(d.descricao)}</span>` : ''}
      </div>
      <a class="bt leve" href="${esc(d.url)}" target="_blank" rel="noopener"
         download>Baixar</a>
    </div>`).join('') + `</div>`
}

function vazioAviso (o) {
  return `<div class="aviso"><b>${esc(o.titulo)}</b>${esc(o.texto)}</div>`
}

// ── Páginas ────────────────────────────────────────────────────────
function pagInicio (s) {
  const d = dados('inicio')
  const campos = s.campos.map(([k, rot]) => `
    <div><dt>${esc(rot)}</dt>
    <dd class="${vazio(d[k]) ? 'vazio' : ''}">${vazio(d[k]) ? 'a preencher' : esc(d[k])}</dd></div>`).join('')

  const atalhos = window.SECOES.filter(x => x.menu && x.id !== 'inicio').map((x, i) => `
    <a class="atalho" href="#/${x.id}">
      <span class="n">${String(i + 1).padStart(2, '0')}</span>
      <strong>${esc(x.titulo)}</strong>
      <span class="res">${esc(resumoSecao(x))}</span>
    </a>`).join('')

  return `
  <section class="capa">
    <svg class="pauta" viewBox="0 0 1200 60" preserveAspectRatio="none" aria-hidden="true" height="60">
      <g stroke="var(--claro)" stroke-width="1.4">
        <line x1="0" y1="12" x2="1200" y2="12"/><line x1="0" y1="24" x2="1200" y2="24"/>
        <line x1="0" y1="36" x2="1200" y2="36"/><line x1="0" y1="48" x2="1200" y2="48"/>
      </g>
    </svg>
    <div class="contem">
      <span class="rotulo">
        <svg viewBox="0 0 48 48" aria-hidden="true"><use href="#notas"/></svg>
        Portfólio Reflexivo de Estágio
      </span>
      <h1>${vazio(d.titulo) ? 'Portfólio Reflexivo de Estágio Supervisionado em Licenciatura em Música'
                            : esc(d.titulo)}</h1>
      <p class="linha">Relatos de observação, planos de aula, relatos das aulas ministradas
        e reflexões sobre a prática docente.</p>
    </div>
  </section>

  <div class="contem">
    <div class="pagina">
      <h3 class="sub">Identificação</h3>
      <dl class="ident">${campos}</dl>

      <h3 class="sub">Sobre este portfólio</h3>
      <div class="cartao corpo">
        ${renderBlocos(d.blocos) || vazioAviso({
          titulo: 'Texto de apresentação',
          texto: 'Esta seção receberá a apresentação do portfólio: o que ele é, seu objetivo, o contexto do estágio, sua importância para a formação e como o material está organizado.',
        })}
      </div>

      <h3 class="sub">Documentos do estágio</h3>
      ${renderDocumentos(d.documentos)}

      <h3 class="sub">Seções do portfólio</h3>
      <div class="grade">${atalhos}</div>
    </div>
  </div>`
}

function resumoSecao (s) {
  const r = {
    biografia: 'Trajetória, formação e relação com a música.',
    escola: 'Caracterização e contexto da escola onde o estágio foi realizado.',
    observacoes: 'Três relatos das semanas de observação.',
    planos: 'Os sete planos de aula corrigidos.',
    relatos: 'Os sete relatos das aulas ministradas.',
    consideracoes: 'Reflexão final sobre a experiência do estágio.',
    bibliografia: 'Referências utilizadas ao longo do portfólio.',
  }
  return r[s.id] || ''
}

function pagIndice (s) {
  const d = dados(s.id)
  const cartoes = s.filhos.map(f => {
    const fd = dados(f.id)
    const meta = [fd.data, fd.turma, fd.tema].filter(x => !vazio(x)).join(' · ')
    const titulo = vazio(fd.titulo) ? f.titulo : fd.titulo
    return `
    <a class="atalho" href="#/${f.id}">
      <span class="n">${String(f.ordem).padStart(2, '0')}</span>
      <strong>${esc(titulo)}</strong>
      ${meta ? `<span class="meta">${esc(meta)}</span>` : ''}
      <span class="res">${esc(fd.resumo || '')}</span>
    </a>`
  }).join('')

  return `<div class="contem"><div class="pagina">
    <header><h2 class="titulo">${esc(s.titulo)}</h2></header>
    <div class="cartao corpo">
      ${renderBlocos(d.blocos) || vazioAviso({
        titulo: 'Introdução desta seção',
        texto: 'O texto de abertura desta seção ainda será escrito.',
      })}
    </div>
    <h3 class="sub">Acessar</h3>
    <div class="grade">${cartoes}</div>
  </div></div>`
}

function pagSimples (s) {
  const d = dados(s.id)
  const pai = s.pai ? window.secao(s.pai) : null
  const titulo = vazio(d.titulo) ? s.titulo : d.titulo

  // As partes longas (usadas pelos planos de aula) viram subtítulo + texto.
  const partes = (s.partes || []).map(([k, rot]) =>
    vazio(d[k]) ? '' : `<h3 class="sub">${esc(rot)}</h3>${paragrafos(d[k])}`).join('')

  const corpo = renderBlocos(d.blocos)
  const temConteudo = partes || corpo

  return `<div class="contem"><div class="pagina">
    <header>
      ${pai ? `<p class="trilho"><a href="#/${pai.id}">${esc(pai.titulo)}</a> <span>›</span>
               <span>${esc(s.titulo)}</span></p>` : ''}
      <h2 class="titulo">${esc(titulo)}</h2>
    </header>
    ${renderCampos(s.campos, d)}
    <div class="cartao corpo">
      ${temConteudo ? partes + corpo : vazioAviso({
        titulo: 'Conteúdo a inserir',
        texto: 'Esta página está pronta e aguarda o texto, as fotografias e os vídeos.',
      })}
    </div>
  </div></div>`
}

function pagBibliografia (s) {
  const d = dados('bibliografia')
  const refs = (d.referencias || []).filter(r => !vazio(r.texto))
  // Ordem alfabética, ignorando acentos — como pede a ABNT.
  refs.sort((a, b) => a.texto.localeCompare(b.texto, 'pt-BR', { sensitivity: 'base' }))

  const lista = refs.length
    ? `<ol class="refs">` + refs.map(r => {
        const t = esc(r.texto)
        return `<li>${r.link ? `${t} Disponível em:
          <a href="${esc(r.link)}" target="_blank" rel="noopener">${esc(r.link)}</a>.` : t}</li>`
      }).join('') + `</ol>`
    : vazioAviso({
        titulo: 'Referências',
        texto: 'As referências ainda serão cadastradas. Elas aparecem aqui ordenadas alfabeticamente de forma automática.',
      })

  return `<div class="contem"><div class="pagina">
    <header><h2 class="titulo">${esc(s.titulo)}</h2></header>
    <div class="cartao">${lista}</div>
  </div></div>`
}

// ── Roteador ───────────────────────────────────────────────────────
function rota () {
  return (location.hash.replace(/^#\/?/, '') || 'inicio').split('?')[0]
}

function render () {
  const id = rota()

  const s = window.secao(id)
  if (!s) { location.hash = '#/inicio'; return }

  marcarMenu(id)

  if (s.id === 'inicio') el.innerHTML = pagInicio(s)
  else if (s.filhos) el.innerHTML = pagIndice(s)
  else if (s.referencias) el.innerHTML = pagBibliografia(s)
  else el.innerHTML = pagSimples(s)

  document.title = (s.id === 'inicio' ? '' : s.titulo + ' · ') +
    'Portfólio de Estágio · Licenciatura em Música'
  window.scrollTo({ top: 0, behavior: 'instant' })
}

// ── Lupa (ampliar imagem) ──────────────────────────────────────────
function abrirLupa (src, alt) {
  const d = document.createElement('div')
  d.className = 'lupa'
  d.setAttribute('role', 'dialog')
  d.setAttribute('aria-modal', 'true')
  d.setAttribute('aria-label', alt || 'Imagem ampliada')
  d.innerHTML = `<img src="${esc(src)}" alt="${esc(alt || '')}">
                 <button type="button" aria-label="Fechar">&times;</button>`
  const fechar = () => { d.remove(); document.removeEventListener('keydown', aoTeclar) }
  const aoTeclar = (e) => { if (e.key === 'Escape') fechar() }
  d.addEventListener('click', (e) => { if (e.target === d || e.target.tagName === 'BUTTON') fechar() })
  document.addEventListener('keydown', aoTeclar)
  document.body.appendChild(d)
  d.querySelector('button').focus()
}

document.addEventListener('click', (e) => {
  const img = e.target.closest('[data-lupa="imagem"]')
  if (img) abrirLupa(img.src, img.alt)
})

// ── Início ─────────────────────────────────────────────────────────
;(function iniciar () {
  montarMenu()
  window.addEventListener('hashchange', render)
  render()
})()

window.App = App
window.esc = esc
