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
  // toque fora do menu ou Esc fecham o menu aberto
  document.addEventListener('click', (e) => {
    if (ul.classList.contains('aberto') && !ul.contains(e.target) && !bt.contains(e.target)) {
      ul.classList.remove('aberto'); bt.setAttribute('aria-expanded', 'false'); bt.setAttribute('aria-label', 'Abrir menu')
    }
  })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && ul.classList.contains('aberto')) { bt.click(); bt.focus() }
  })
  ul.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      ul.classList.remove('aberto')
      bt.setAttribute('aria-expanded', 'false')
      bt.setAttribute('aria-label', 'Abrir menu')
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
const dados = (id) => {
  const base = (window.CONTEUDO && window.CONTEUDO[id]) || {}
  const p = window.PLANOS && window.PLANOS[id]
  if (!p) return base
  return { ...base, titulo: p.titulo, data: p.data }
}

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
      // preload="metadata" para a barra de tempo e os saltos funcionarem logo
      return `<figure class="video"><video src="${esc(b.url)}" controls preload="metadata" playsinline
              ${b.poster ? `poster="${esc(b.poster)}"` : ''}></video>
        <div class="video-barra">
          ${b.drive ? `<a href="${esc(b.drive)}" target="_blank" rel="noopener">Abrir no Google Drive ↗</a>` : ''}
        </div>${leg}</figure>`
    case 'pdf':
      // Documento em PDF desenhado na página, no mesmo formato dos planos.
      if (!b.url) return ''
      return `<figure class="pdf-bloco">
        <div class="pl-doc" data-pdf="${esc(b.url)}">
          <div class="pl-folhas"><p class="pl-carregando">Carregando o documento…</p></div>
        </div>
        <p class="pl-links">
          <a href="${esc(b.url)}" target="_blank" rel="noopener">Abrir o PDF ↗</a>
          ${b.drive ? `<a href="${esc(b.drive)}" target="_blank" rel="noopener">Abrir no Google Drive ↗</a>` : ''}
        </p>${leg}</figure>`
    default:
      return ''
  }
}

const renderBlocos = (lista) =>
  (lista || []).map(renderBloco).join('') || ''

// ── Pedaços reaproveitados ─────────────────────────────────────────
// ── Índice ─────────────────────────────────────────────────────────
// Lista enumerada em linhas, no lugar de uma grade de cartões: com
// textos de tamanhos diferentes, a grade deixa buracos brancos; a lista
// não. A marca de ensaio já diz o número, então o nome não o repete.
function indice (itens) {
  return `<ol class="indice">` + itens.map(i => `
    <li><a href="#/${i.id}">
      <span class="marca">${String(i.n).padStart(2, '0')}</span>
      <span class="txt">
        <b>${esc(i.nome)}</b>
        ${i.meta ? `<em>${esc(i.meta)}</em>` : ''}
      </span>
      <span class="res${i.pendente ? ' pendente' : ''}">${i.pendente ? 'a preencher' : esc(i.res || '')}</span>
    </a></li>`).join('') + `</ol>`
}

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
    <div><dt>${esc(rot)}</dt><span class="pont"></span>
    <dd class="${vazio(d[k]) ? 'vazio' : ''}">${vazio(d[k]) ? 'a preencher' : esc(d[k])}</dd></div>`).join('')

  const atalhos = indice(window.SECOES
    .filter(x => x.menu && x.id !== 'inicio')
    .map((x, i) => ({ id: x.id, n: i + 1, nome: x.titulo, res: resumoSecao(x) })))

  return `
  <section class="capa">
    <!-- A pauta viva.
         Os grupos ficam numa linha flex, lado a lado: assim nenhum pode
         montar em cima do outro, em largura nenhuma. Quando o espaço
         aperta, grupos inteiros saem de cena, nunca se sobrepõem.
         A geometria é sempre a mesma caixa de 120 de altura, com as
         linhas da pauta em y = 40, 56, 72, 88 e 104. -->
    <div class="pentagrama" aria-hidden="true">
      <div class="linhas"></div>
      <div class="fila">

        <svg class="g-clave" viewBox="0 0 126 120">
          <g fill="currentColor">
            <g transform="translate(8 12)" opacity=".8"><use href="#clave" width="48" height="96"/></g>
            <text x="92" y="68" font-family="EB Garamond, Georgia, serif" font-size="42"
                  font-weight="600" text-anchor="middle" opacity=".72">4</text>
            <text x="92" y="101" font-family="EB Garamond, Georgia, serif" font-size="42"
                  font-weight="600" text-anchor="middle" opacity=".72">4</text>
          </g>
        </svg>

        <svg class="g-compasso" viewBox="0 0 160 120">
          <g fill="currentColor" opacity=".66">
          <g transform="translate(22 96)"><ellipse rx="7.6" ry="5.6" transform="rotate(-20)"/>
            <rect x="5.8" y="-32" width="2.6" height="32"/></g>
          <g transform="translate(62 80)"><ellipse rx="7.6" ry="5.6" transform="rotate(-20)"/>
            <rect x="5.8" y="-32" width="2.6" height="32"/>
            <path d="M8.4 -32 C17.6 -26.6 19.6 -17 14.4 -9.6 C17.6 -20 13.4 -25.4 8.4 -27.4 Z"/></g>
          <g transform="translate(102 88)"><ellipse rx="7.6" ry="5.6" transform="rotate(-20)"/>
            <rect x="5.8" y="-32" width="2.6" height="32"/></g>
            <rect x="150" y="40" width="1.8" height="64" opacity=".75"/>
          </g>
        </svg>

        <span class="elastico"></span>

        <svg class="g-compasso" viewBox="0 0 160 120">
          <g fill="currentColor" opacity=".66">
          <g transform="translate(22 64)"><ellipse rx="7.6" ry="5.6" transform="rotate(-20)"/>
            <rect x="5.8" y="-32" width="2.6" height="32"/></g>
          <g transform="translate(62 72)"><ellipse rx="7.6" ry="5.6" transform="rotate(-20)"/>
            <rect x="5.8" y="-32" width="2.6" height="32"/>
            <path d="M8.4 -32 C17.6 -26.6 19.6 -17 14.4 -9.6 C17.6 -20 13.4 -25.4 8.4 -27.4 Z"/></g>
          <g transform="translate(102 56)"><ellipse rx="7.6" ry="5.6" transform="rotate(-20)"/>
            <rect x="5.8" y="-32" width="2.6" height="32"/></g>
            <rect x="150" y="40" width="1.8" height="64" opacity=".75"/>
          </g>
        </svg>

        <svg class="g-compasso" viewBox="0 0 136 120">
          <g fill="currentColor" opacity=".66">
          <g transform="translate(22 80)"><ellipse rx="7.6" ry="5.6" transform="rotate(-20)"/>
            <rect x="5.8" y="-32" width="2.6" height="32"/></g>
          <g transform="translate(62 88)"><ellipse rx="7.6" ry="5.6" transform="rotate(-20)"/>
            <rect x="5.8" y="-32" width="2.6" height="32"/></g>
          <g transform="translate(102 64)"><ellipse rx="7.6" ry="5.6" transform="rotate(-20)"/>
            <rect x="5.8" y="-32" width="2.6" height="32"/>
            <path d="M8.4 -32 C17.6 -26.6 19.6 -17 14.4 -9.6 C17.6 -20 13.4 -25.4 8.4 -27.4 Z"/></g>
          </g>
        </svg>

        <span class="elastico"></span>

        <!-- compasso compacto: so aparece quando a tela nao comporta os cheios -->
        <svg class="g-mini" viewBox="0 0 120 120">
          <g fill="currentColor" opacity=".66">
            <g transform="translate(20 88)"><ellipse rx="7.6" ry="5.6" transform="rotate(-20)"/>
              <rect x="5.8" y="-32" width="2.6" height="32"/></g>
            <g transform="translate(60 72)"><ellipse rx="7.6" ry="5.6" transform="rotate(-20)"/>
              <rect x="5.8" y="-32" width="2.6" height="32"/>
              <path d="M8.4 -32 C17.6 -26.6 19.6 -17 14.4 -9.6 C17.6 -20 13.4 -25.4 8.4 -27.4 Z"/></g>
            <g transform="translate(100 80)"><ellipse rx="7.6" ry="5.6" transform="rotate(-20)"/>
              <rect x="5.8" y="-32" width="2.6" height="32"/></g>
          </g>
        </svg>

        <svg class="g-fim" viewBox="0 0 146 120">
          <g fill="currentColor">
            <!-- barra final: fina e depois grossa, como encerra a partitura -->
            <rect x="6" y="40" width="1.8" height="64" opacity=".55"/>
            <rect x="13" y="40" width="5.4" height="64" opacity=".75"/>
          </g>
          <g transform="translate(44 48.8) scale(0.62)" opacity=".92">
            <use href="#tamandua" width="150" height="100"/>
          </g>
        </svg>

      </div>
    </div>

    <div class="contem">
      <span class="rotulo">Portfólio reflexivo de estágio supervisionado</span>
      <h1>${vazio(d.titulo) ? 'Portfólio Reflexivo de Estágio Supervisionado em Licenciatura em Música'
                            : esc(d.titulo)}</h1>
      <p class="linha">Relatos de observação, planos de aula, relatos das aulas ministradas
        e reflexões sobre a prática docente.</p>
    </div>
  </section>

  <div class="contem">
    <div class="pagina">
      <h3 class="sub fig fig-1">Identificação</h3>
      <dl class="ident">${campos}</dl>

      <h3 class="sub fig fig-2">Sobre este portfólio</h3>
      <div class="cartao corpo">
        ${renderBlocos(d.blocos) || vazioAviso({
          titulo: 'Texto de apresentação',
          texto: 'Esta seção receberá a apresentação do portfólio: o que ele é, seu objetivo, o contexto do estágio, sua importância para a formação e como o material está organizado.',
        })}
      </div>

      <h3 class="sub fig fig-3">Documentos do estágio</h3>
      ${renderDocumentos(d.documentos)}

      <h3 class="sub fig fig-4">Seções do portfólio</h3>
      ${atalhos}
    </div>
  </div>`
}

function resumoSecao (s) {
  const r = {
    biografia: 'Trajetória, formação e relação com a música.',
    escola: 'Caracterização e contexto da escola onde o estágio foi realizado.',
    introducao: 'Contexto do estágio, as turmas e as leituras que acompanharam a prática.',
    observacoes: 'Três relatos das semanas de observação.',
    planos: 'Os sete planos de aula corrigidos.',
    relatos: 'Os sete relatos das aulas ministradas.',
    consideracoes: 'Reflexão sobre a experiência do estágio.',
    bibliografia: 'Referências utilizadas ao longo do portfólio.',
  }
  return r[s.id] || ''
}

function pagIndice (s) {
  const d = dados(s.id)
  // O nome não repete o número: a marca de ensaio já o traz.
  const cartoes = indice(s.filhos.map(f => {
    const fd = dados(f.id)
    return {
      id: f.id,
      n: f.ordem,
      nome: vazio(fd.titulo) ? (f.rotulo || f.titulo) : fd.titulo,
      meta: [fd.data, fd.turma, fd.tema].filter(x => !vazio(x)).join(' · '),
      res: fd.resumo || '',
      pendente: vazio(fd.resumo) && vazio(fd.titulo),
    }
  }))

  return `<div class="contem"><div class="pagina">
    <header><h2 class="titulo">${esc(s.titulo)}</h2></header>
    <div class="cartao corpo">
      ${renderBlocos(d.blocos) || vazioAviso({
        titulo: 'Introdução desta seção',
        texto: 'O texto de abertura desta seção ainda será escrito.',
      })}
    </div>
    <h3 class="sub">Acessar</h3>
    ${cartoes}
  </div></div>`
}

// ── Plano de aula ──────────────────────────────────────────────────
// Cada plano exibe o próprio PDF, desenhado na página pelo pdf.js (assim
// aparece igual no computador e no celular). Plano e relato da mesma
// aula se ligam por um botão ("ponte") nos dois sentidos.
const seta = (dir) => dir === 'dir'
  ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'

function ponte (n, para) {
  const plano = para === 'plano'
  const alvo = (plano ? 'plano-' : 'relato-') + n
  const ad = dados(alvo)
  const nome = plano ? 'Plano de Aula ' + n : 'Relato de Aula ' + n
  return `<a class="ponte ${plano ? 'volta' : ''}" href="#/${alvo}">
    <span class="ponte-ic">${plano ? seta('esq') : seta('dir')}</span>
    <span class="ponte-txt"><small>${plano ? 'Ver o planejamento desta aula' : 'Ver como esta aula aconteceu'}</small>
      <b>${nome}</b>${!vazio(ad.titulo) && ad.titulo !== nome ? `<em>${esc(ad.titulo)}</em>` : ''}</span>
  </a>`
}

function vizinhos (s) {
  const irm = window.secao(s.pai).filhos
  const i = irm.findIndex(f => f.id === s.id)
  const ant = irm[i - 1], prox = irm[i + 1]
  return `<nav class="vizinhos" aria-label="Navegar entre páginas">
    ${ant ? `<a href="#/${ant.id}">${seta('esq')} ${esc(ant.titulo)}</a>` : '<span></span>'}
    ${prox ? `<a href="#/${prox.id}">${esc(prox.titulo)} ${seta('dir')}</a>` : '<span></span>'}
  </nav>`
}

function pagPlano (s, p) {
  return `<div class="contem"><div class="pagina plano">
    <header>
      <p class="trilho"><a href="#/planos">Planos de Aula</a> <span>›</span> <span>${esc(s.titulo)}</span></p>
      <h2 class="titulo">${esc(s.titulo)}</h2>
      <p class="pl-sub">${esc(p.titulo)} · ${esc(p.data)}</p>
    </header>
    <div class="pl-doc" data-pdf="${esc(p.arquivo)}">
      <div class="pl-folhas"><p class="pl-carregando">Carregando o plano…</p></div>
    </div>
    <p class="pl-links">
      <a href="${esc(p.drive)}" target="_blank" rel="noopener">Abrir no Google Drive ↗</a>
    </p>
    ${ponte(s.ordem, 'relato')}
    ${vizinhos(s)}
  </div></div>`
}

// Desenha as páginas do PDF em canvas, na largura do quadro.
let pdfjsPronto = null
function carregarPdfjs () {
  if (pdfjsPronto) return pdfjsPronto
  pdfjsPronto = new Promise((ok, erro) => {
    const sc = document.createElement('script')
    sc.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
    sc.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
      ok(window.pdfjsLib)
    }
    sc.onerror = erro
    document.head.appendChild(sc)
  })
  return pdfjsPronto
}

async function desenharPdfs () {
  const caixas = document.querySelectorAll('.pl-doc[data-pdf]:not(.pronto)')
  if (!caixas.length) return
  for (const caixa of caixas) {
    caixa.classList.add('pronto')
    const alvo = caixa.querySelector('.pl-folhas')
    try {
      const lib = await carregarPdfjs()
      const doc = await lib.getDocument(caixa.dataset.pdf).promise
      alvo.innerHTML = ''
      const larg = alvo.clientWidth || 800
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5)
      for (let n = 1; n <= doc.numPages; n++) {
        const pg = await doc.getPage(n)
        const base = pg.getViewport({ scale: 1 })
        const vp = pg.getViewport({ scale: Math.max(larg * dpr, 1700) / base.width })
        const cv = document.createElement('canvas')
        cv.width = vp.width; cv.height = vp.height
        cv.setAttribute('role', 'img')
        cv.setAttribute('aria-label', 'Página ' + n + ' do plano de aula')
        cv.title = 'Toque para ampliar'
        cv.addEventListener('click', () => abrirLupa(cv.toDataURL('image/png'), 'Plano de aula, página ' + n))
        alvo.appendChild(cv)
        await pg.render({ canvasContext: cv.getContext('2d'), viewport: vp }).promise
      }
    } catch (e) {
      alvo.innerHTML = `<p class="pl-carregando">Não foi possível exibir o arquivo aqui.
        <a href="${esc(caixa.dataset.pdf)}" target="_blank" rel="noopener">Abrir o PDF</a></p>`
    }
  }
}

// ── Relatos em seções retráteis ────────────────────────────────────
// Cada subtítulo (as turmas, "Apresentações") vira uma seção que abre e
// fecha; fotos e vídeos soltos vão para uma seção própria, fechada.
// Assim a página começa curta e a pessoa abre só o que quer ler.
const MIDIA = ['imagem', 'galeria', 'video']
const contaMidia = (bs) => bs.reduce((t, b) =>
  t + (b.tipo === 'galeria' ? (b.itens || []).length : MIDIA.includes(b.tipo) ? 1 : 0), 0)

function dobra (titulo, conteudo, extra, aberta) {
  return `<details class="dobra"${aberta ? ' open' : ''}>
    <summary><span class="dobra-tit">${esc(titulo)}</span>
      ${extra ? `<span class="dobra-extra">${esc(extra)}</span>` : ''}
      <span class="dobra-seta" aria-hidden="true"></span></summary>
    <div class="dobra-corpo">${conteudo}</div>
  </details>`
}

function renderDobras (blocos) {
  const grupos = []
  let atual = { titulo: null, itens: [] }
  const midias = []
  for (const b of (blocos || [])) {
    if (b.tipo === 'subtitulo') { grupos.push(atual); atual = { titulo: b.texto, itens: [] }; continue }
    // mídia solta no meio do texto das turmas vai para "Fotos e vídeos"
    if (MIDIA.includes(b.tipo) && (!atual.titulo || /^Turma/.test(atual.titulo))) { midias.push(b); continue }
    atual.itens.push(b)
  }
  grupos.push(atual)
  if (midias.length) grupos.push({ titulo: 'Fotos e vídeos', itens: midias })

  let primeira = true
  return grupos.filter(g => g.itens.length).map(g => {
    if (!g.titulo) {
      // texto sem subtítulo: primeiro parágrafo à vista, o resto recolhido
      const txt = g.itens.filter(b => b.tipo === 'texto').map(b => b.texto).join('\n\n')
      const ps = txt.split(/\n{2,}/).filter(p => p.trim())
      if (ps.length <= 1) return renderBlocos(g.itens)
      const html = paragrafos(ps[0]) + dobra('Continuar lendo', paragrafos(ps.slice(1).join('\n\n')), '', false)
      primeira = false
      return html
    }
    const n = contaMidia(g.itens)
    const ehMidia = g.itens.every(b => MIDIA.includes(b.tipo))
    const extra = ehMidia ? n + (n === 1 ? ' item' : ' itens') : ''
    const html = dobra(g.titulo, renderBlocos(g.itens), extra, primeira && !ehMidia)
    primeira = false
    return html
  }).join('')
}

// Abre e fecha as seções animando a altura, em vez de pular de uma vez.
document.addEventListener('click', (e) => {
  const sum = e.target.closest('details.dobra > summary')
  if (!sum || calmo.matches || !sum.parentElement.animate) return
  e.preventDefault()
  const el = sum.parentElement
  if (el._anim) el._anim.cancel()
  const ini = el.offsetHeight
  const abrindo = !el.open
  if (abrindo) el.open = true
  const borda = el.offsetHeight - el.clientHeight
  const fim = (abrindo ? el.scrollHeight : sum.offsetHeight) + borda
  el.style.overflow = 'hidden'
  const anim = el.animate({ height: [ini + 'px', fim + 'px'] },
    { duration: Math.min(1100, 650 + Math.abs(fim - ini) * 0.35), easing: 'cubic-bezier(.45,.05,.25,1)' })
  el._anim = anim
  anim.onfinish = () => { if (!abrindo) el.open = false; el.style.overflow = ''; el._anim = null }
  anim.oncancel = () => { el._anim = null }
})

function pagSimples (s) {
  if (window.PLANOS && window.PLANOS[s.id]) return pagPlano(s, window.PLANOS[s.id])
  const d = dados(s.id)
  const pai = s.pai ? window.secao(s.pai) : null
  const titulo = vazio(d.titulo) ? s.titulo : d.titulo

  // As partes longas (usadas pelos planos de aula) viram subtítulo + texto.
  const partes = (s.partes || []).map(([k, rot]) =>
    vazio(d[k]) ? '' : `<h3 class="sub">${esc(rot)}</h3>${paragrafos(d[k])}`).join('')

  const corpo = s.pai === 'relatos' ? renderDobras(d.blocos) : renderBlocos(d.blocos)
  const temConteudo = partes || corpo

  return `<div class="contem"><div class="pagina">
    <header>
      ${pai ? `<p class="trilho"><a href="#/${pai.id}">${esc(pai.titulo)}</a> <span>›</span>
               <span>${esc(s.titulo)}</span></p>` : ''}
      <h2 class="titulo">${esc(titulo)}</h2>
    </header>
    ${renderCampos(s.campos, d)}
    <div class="cartao corpo${s.pai === 'relatos' && temConteudo ? ' com-dobras' : ''}">
      ${temConteudo ? partes + corpo : vazioAviso({
        titulo: 'Conteúdo a inserir',
        texto: 'Esta página está pronta e aguarda o texto, as fotografias e os vídeos.',
      })}
    </div>
    ${s.pai === 'relatos' ? ponte(s.ordem, 'plano') : ''}
    ${s.pai ? vizinhos(s) : ''}
  </div></div>`
}

// Introdução: quatro tópicos fixos, cada um com o próprio título. Tópico
// ainda sem texto mostra o que deve ser escrito ali.
function pagIntroducao (s) {
  const d = dados(s.id)
  const topicos = s.topicos.map(([k, rot, dica], i) => `
    <h3 class="sub fig fig-${i + 1}">${esc(rot)}</h3>
    <div class="cartao corpo">
      ${vazio(d[k]) ? vazioAviso({ titulo: 'A escrever', texto: dica }) : paragrafos(d[k])}
    </div>`).join('')
  const extra = renderBlocos(d.blocos)
  return `<div class="contem"><div class="pagina introducao">
    <header><h2 class="titulo">${esc(s.titulo)}</h2></header>
    ${topicos}
    ${extra ? `<div class="cartao corpo">${extra}</div>` : ''}
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

// Transição entre páginas: a atual some suave, o conteúdo troca e a
// nova entra subindo de leve, com os blocos aparecendo em sequência.
const calmo = window.matchMedia('(prefers-reduced-motion: reduce)')
let primeira = true, saindo = null
function render () {
  if (primeira || calmo.matches) { primeira = false; trocar(); return }
  clearTimeout(saindo)
  el.classList.remove('entrando')
  el.classList.add('saindo')
  saindo = setTimeout(() => {
    trocar()
    el.classList.remove('saindo')
    void el.offsetWidth
    el.classList.add('entrando')
  }, 220)
}

function trocar () {
  const id = rota()

  const s = window.secao(id)
  if (!s) { location.hash = '#/inicio'; return }

  marcarMenu(id)

  if (s.id === 'inicio') el.innerHTML = pagInicio(s)
  else if (s.filhos) el.innerHTML = pagIndice(s)
  else if (s.referencias) el.innerHTML = pagBibliografia(s)
  else if (s.topicos) el.innerHTML = pagIntroducao(s)
  else el.innerHTML = pagSimples(s)
  desenharPdfs()

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
// ── Voltar ao topo (flutuante) ─────────────────────────────────────
// Aparece depois que a pessoa desce bastante. O x esconde o botão só
// nesta página: ao trocar de página pelo menu, ele volta.
function montarTopo () {
  const box = document.getElementById('topo-flut')
  let fechado = false
  box.hidden = false
  const ver = () => box.classList.toggle('visivel', !fechado && window.scrollY > window.innerHeight * 1.2)
  window.addEventListener('scroll', ver, { passive: true }); ver()
  window.addEventListener('hashchange', () => { fechado = false; setTimeout(ver, 400) })
  box.querySelector('.topo-ir').addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: calmo.matches ? 'auto' : 'smooth' }))
  box.querySelector('.topo-x').addEventListener('click', () => { fechado = true; ver() })
}

// ── Conteúdo publicado pelo painel ─────────────────────────────────
// O painel (/admin) salva no banco do Vercel. Se ainda não houver nada
// salvo, ou se a consulta falhar, o site usa js/conteudo.js e
// js/planos.js, que continuam valendo como reserva.
function aplicarConteudo (d) {
  if (!d || d.vazio || !d.conteudo) return
  window.CONTEUDO = d.conteudo
  if (d.planos) window.PLANOS = d.planos
}

async function buscarPublicado () {
  if (location.protocol === 'file:') return
  try {
    const ctl = new AbortController()
    const t = setTimeout(() => ctl.abort(), 4000)
    const r = await fetch('/api/conteudo', { signal: ctl.signal, cache: 'no-store' })
    clearTimeout(t)
    if (r.ok) aplicarConteudo(await r.json())
  } catch (e) { /* segue com o conteúdo dos arquivos */ }
}

// Pré-visualização: o painel abre o site num quadro com ?previa=1 e
// manda o rascunho por mensagem. Nada é salvo; só se vê como fica.
const PREVIA = new URLSearchParams(location.search).has('previa')

;(async function iniciar () {
  montarTopo()
  montarMenu()
  window.addEventListener('hashchange', render)
  if (PREVIA) {
    document.documentElement.classList.add('previa')
    window.addEventListener('message', (e) => {
      if (e.origin !== location.origin || !e.data || e.data.tipo !== 'previa') return
      aplicarConteudo(e.data)
      const alvo = '#/' + (e.data.rota || 'inicio')
      if (location.hash !== alvo) location.hash = alvo
      else { const y = window.scrollY; trocar(); window.scrollTo(0, y) }
    })
    window.parent.postMessage({ tipo: 'previa-pronta' }, location.origin)
    return
  }
  await buscarPublicado()
  render()
})()

window.App = App
window.esc = esc
