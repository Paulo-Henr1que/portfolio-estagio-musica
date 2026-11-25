// ═══════════════════════════════════════════════════════════════════
//  Painel de edição do portfólio.
//  Edita o mesmo conteúdo que o site lê (window.CONTEUDO e
//  window.PLANOS), mostra a pré-visualização com o próprio site e
//  publica pelo /api/conteudo. Arquivos vão para o Vercel Blob.
// ═══════════════════════════════════════════════════════════════════
import { upload } from './blob-client.js'

const $ = (s, r = document) => r.querySelector(s)
const LOCAL = ['localhost', '127.0.0.1'].includes(location.hostname)
// A lista de páginas muda quando se cria uma subpágina: sempre a atual.
const secao = (id) => window.SECOES.find(s => s.id === id)
// remonta a estrutura a partir do rascunho e atualiza a lista lateral
function atualizarEstrutura () {
  window.montarSecoes(estado.conteudo)
  montarLista()
}

// ── Estado ─────────────────────────────────────────────────────────
// Cada estágio (1, 2 e 3) é um portfólio próprio: ?estagio=2 no endereço.
const ESTAGIO = (() => { const n = Number(new URLSearchParams(location.search).get('estagio')); return [2, 3].includes(n) ? n : 1 })()
const doEstagio = (hash) => location.pathname + (ESTAGIO > 1 ? '?estagio=' + ESTAGIO : '') + (hash || '')
let ESTAGIOS = []          // estágios já publicados (vem da API)
let estado = null          // { conteudo, planos } em edição
let publicado = ''         // cópia (JSON) do que está no ar
let atual = 'inicio'       // página aberta no editor
const RASCUNHO = 'portfolio-rascunho' + (ESTAGIO > 1 ? '-' + ESTAGIO : '')
// configurações do site (aparência, menu, textos) ficam em conteudo._site
const site = () => (estado.conteudo._site = estado.conteudo._site || {})
const sob = (o, k) => (o[k] = o[k] && typeof o[k] === 'object' ? o[k] : {})

// endereço de arquivo visto de dentro de /admin/
const ver = (u) => !u || /^(https?:|\/|data:|blob:)/.test(u) ? u : '../' + u
const copia = (o) => JSON.parse(JSON.stringify(o))
const sujo = () => estado && JSON.stringify(estado) !== publicado
const dadosDe = (id) => (estado.conteudo[id] = estado.conteudo[id] || {})

// ── Utilidades de interface ────────────────────────────────────────
function h (tag, attrs = {}, ...filhos) {
  const e = document.createElement(tag)
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === false || v == null) continue
    if (k.startsWith('on')) e.addEventListener(k.slice(2), v)
    else if (k === 'class') e.className = v
    else if (k === 'html') e.innerHTML = v
    else e.setAttribute(k, v === true ? '' : v)
  }
  for (const f of filhos.flat()) if (f != null && f !== false) e.append(f.nodeType ? f : document.createTextNode(f))
  return e
}

const ICONES = {
  cima: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  baixo: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  esq: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  dir: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  lixo: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/>',
  mais: '<path d="M12 5v14M5 12h14"/>',
  subir: '<path d="M12 16V4M6 10l6-6 6 6M4 20h16"/>',
  estagios: '<path d="M4 6h16M4 12h16M4 18h10"/><circle cx="19" cy="18" r="2"/>',
  paleta: '<path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.6-.9 1.2-1.8-.5-1.1.2-2.2 1.4-2.2H17a4 4 0 0 0 4-4c0-5-4-10-9-10Z"/><circle cx="7.5" cy="11" r="1.2"/><circle cx="10.5" cy="7" r="1.2"/><circle cx="15" cy="7.5" r="1.2"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  texto: '<path d="M5 6V4h14v2M12 4v16M9 20h6"/>',
  pagina: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"/>',
}
const ic = (n) => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONES[n]}</svg>`
const icBt = (n, rotulo, aoClicar, extra = {}) =>
  h('button', { type: 'button', class: 'ic-bt' + (n === 'lixo' ? ' risco' : ''), 'aria-label': rotulo, title: rotulo, html: ic(n), onclick: aoClicar, ...extra })

function avisar (txt, erro = false) {
  const a = $('#aviso-flut')
  a.textContent = txt
  a.classList.toggle('erro-flut', erro)
  a.hidden = false
  clearTimeout(avisar.t)
  avisar.t = setTimeout(() => { a.hidden = true }, erro ? 6000 : 3200)
}

async function api (caminho, opcoes = {}) {
  const r = await fetch('/api/' + caminho, {
    credentials: 'same-origin',
    headers: opcoes.body ? { 'Content-Type': 'application/json' } : {},
    ...opcoes,
    body: opcoes.body ? JSON.stringify(opcoes.body) : undefined,
  })
  let d = {}
  try { d = await r.json() } catch {}
  if (r.status === 401 && caminho !== 'login' && caminho !== 'eu') { mostrarEntrar('Sua sessão expirou. Entre de novo.') }
  if (!r.ok) throw new Error(d.erro || 'Algo deu errado. Tente de novo.')
  return d
}

function confirmar (titulo, texto, botao = 'Remover') {
  const j = $('#jan-confirma')
  $('#confirma-tit').textContent = titulo
  $('#confirma-txt').textContent = texto
  $('#confirma-sim').textContent = botao
  j.returnValue = ''
  j.showModal()
  return new Promise(ok => j.addEventListener('close', () => ok(j.returnValue === 'sim'), { once: true }))
}

// Campo de texto ligado direto ao objeto: digitar já atualiza o estado.
function campo (rotulo, obj, chave, { area = false, dica = '', classe = '', ph = '', linhas } = {}) {
  const attrs = { placeholder: ph, oninput: (e) => { obj[chave] = e.target.value; mudou() } }
  const entrada = area ? h('textarea', { ...attrs, rows: linhas || 6 }) : h('input', attrs)
  entrada.value = obj[chave] ?? ''
  if (area) autoAltura(entrada)
  return h('label', { class: 'cx ' + classe }, rotulo, dica ? h('small', {}, dica) : null, entrada)
}
function autoAltura (t) {
  const ajustar = () => { t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight + 2, 900) + 'px' }
  t.addEventListener('input', ajustar)
  requestAnimationFrame(ajustar)
}

// ── Envio de arquivos ──────────────────────────────────────────────
// Fotos grandes (de celular) são reduzidas antes de enviar: carregam
// rápido no site e continuam nítidas.
async function reduzirImagem (arq) {
  if (!/^image\/(jpeg|png|webp)$/.test(arq.type)) return arq
  try {
    const bmp = await createImageBitmap(arq)
    const max = 2000
    if (bmp.width <= max && bmp.height <= max && arq.size < 1.5e6) return arq
    const k = Math.min(1, max / Math.max(bmp.width, bmp.height))
    const cv = document.createElement('canvas')
    cv.width = Math.round(bmp.width * k); cv.height = Math.round(bmp.height * k)
    cv.getContext('2d').drawImage(bmp, 0, 0, cv.width, cv.height)
    const blob = await new Promise(ok => cv.toBlob(ok, 'image/webp', 0.86))
    if (!blob || blob.size >= arq.size) return arq
    return new File([blob], arq.name.replace(/\.\w+$/, '') + '.webp', { type: 'image/webp' })
  } catch { return arq }
}

const limparNome = (n) => n.normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^\w.-]+/g, '-').replace(/-+/g, '-').toLowerCase().slice(-80)

async function enviarArquivo (arq, aoProgredir = () => {}) {
  const final = arq.type.startsWith('image/') ? await reduzirImagem(arq) : arq
  const nome = `portfolio/${ESTAGIO > 1 ? 'estagio-' + ESTAGIO + '/' : ''}${atual.replace(/^_/, '')}/${limparNome(final.name)}`
  // No computador, sem Vercel Blob: o servidor local guarda em midia/_local
  if (LOCAL && !new URLSearchParams(location.search).has('blob')) {
    const r = await fetch('/api/_upload-local?nome=' + encodeURIComponent(limparNome(final.name)), { method: 'POST', body: final })
    aoProgredir(100)
    return (await r.json()).url
  }
  const r = await upload(nome, final, {
    access: 'public',
    handleUploadUrl: '/api/upload',
    multipart: final.size > 20 * 1024 * 1024,
    contentType: final.type || undefined,
    onUploadProgress: (p) => aoProgredir(p.percentage),
  })
  return r.url
}

// Capa do vídeo: um quadro do próprio vídeo, gerado no navegador.
async function capaDoVideo (arq) {
  try {
    const v = document.createElement('video')
    v.muted = true; v.playsInline = true; v.preload = 'auto'
    v.src = URL.createObjectURL(arq)
    await new Promise((ok, erro) => { v.onloadeddata = ok; v.onerror = erro; setTimeout(erro, 15000) })
    v.currentTime = Math.min(1, (v.duration || 2) / 3)
    await new Promise(ok => { v.onseeked = ok; setTimeout(ok, 4000) })
    const k = Math.min(1, 1280 / v.videoWidth)
    const cv = document.createElement('canvas')
    cv.width = Math.round(v.videoWidth * k); cv.height = Math.round(v.videoHeight * k)
    cv.getContext('2d').drawImage(v, 0, 0, cv.width, cv.height)
    URL.revokeObjectURL(v.src)
    const blob = await new Promise(ok => cv.toBlob(ok, 'image/webp', 0.82))
    return blob ? new File([blob], arq.name.replace(/\.\w+$/, '') + '-capa.webp', { type: 'image/webp' }) : null
  } catch { return null }
}

// Botão de envio com barra de progresso.
function botaoEnviar (rotulo, aceita, aoEnviar, { varios = false } = {}) {
  const inp = h('input', { type: 'file', accept: aceita, multiple: varios })
  const barra = h('div', { class: 'progresso', hidden: true }, h('i'))
  const txt = h('span', { class: 'envio-txt' })
  const bt = h('button', { type: 'button', class: 'bt leve pequeno', html: ic('subir') + ' ' + rotulo, onclick: () => inp.click() })
  inp.addEventListener('change', async () => {
    const arqs = [...inp.files]; inp.value = ''
    if (arqs.length) await enviarVarios(arqs, aoEnviar, { bt, barra, txt })
  })
  return h('div', { class: 'enviar-cx' }, h('div', { class: 'enviar' }, bt, inp, txt), barra)
}

async function enviarVarios (arqs, aoEnviar, { bt, barra, txt }) {
  if (bt) bt.disabled = true
  barra.hidden = false
  try {
    for (let i = 0; i < arqs.length; i++) {
      const a = arqs[i]
      const prefixo = arqs.length > 1 ? `${i + 1} de ${arqs.length} · ` : ''
      txt.textContent = prefixo + 'enviando ' + a.name + '…'
      const url = await enviarArquivo(a, (p) => {
        barra.firstChild.style.width = ((i + p / 100) / arqs.length * 100) + '%'
        txt.textContent = prefixo + 'enviando ' + a.name + ' — ' + Math.round(p) + '%'
      })
      await aoEnviar(url, a)
    }
    txt.textContent = arqs.length > 1 ? arqs.length + ' arquivos enviados.' : 'Arquivo enviado.'
  } catch (e) {
    txt.textContent = ''
    avisar('Não foi possível enviar: ' + e.message, true)
  } finally {
    if (bt) bt.disabled = false
    setTimeout(() => { barra.hidden = true; barra.firstChild.style.width = '0' }, 800)
  }
}

// ── Navegação entre páginas ────────────────────────────────────────
// Páginas de configuração (não são páginas do site).
const CONFIG = [
  ['_estagios', 'Estágios', 'estagios', 'Os portfólios de cada estágio: nome, se aparece no site e qual você está editando.'],
  ['_aparencia', 'Aparência', 'paleta', 'Cores, fontes e logo do site. A mudança aparece aqui no painel na hora.'],
  ['_menu', 'Menu e páginas', 'menu', 'Nomes, ordem e quais seções aparecem no menu do topo, e quantas páginas cada lista tem.'],
  ['_textos', 'Textos do site', 'texto', 'Títulos, avisos e botões que não fazem parte de uma página. Vazio volta ao texto original.'],
]
const ehConfig = (id) => CONFIG.some(c => c[0] === id)

function montarLista () {
  const ul = $('#lista-secoes'); ul.innerHTML = ''
  const sel = $('#sel-secao'); sel.innerHTML = ''
  ul.append(h('li', { class: 'titulo-grupo' }, 'Configurações'))
  const og1 = h('optgroup', { label: 'Configurações' })
  for (const [id, nome, icone] of CONFIG) {
    ul.append(h('li', { class: 'cfg' }, h('a', { href: '#' + id, 'data-id': id, html: ic(icone) + '<span>' + nome + '</span>' })))
    og1.append(h('option', { value: id }, nome))
  }
  ul.append(h('li', { class: 'titulo-grupo' }, 'Páginas'))
  const og2 = h('optgroup', { label: 'Páginas' })
  for (const s of window.SECOES) {
    if (s.pai) continue
    const nome = s.menuTitulo || s.titulo
    const temFilhos = (s.filhos || []).length
    const li = h('li', { class: (temFilhos ? 'grupo' : '') + (s.oculto ? ' oculto' : '') },
      h('a', { href: '#' + s.id, 'data-id': s.id, title: s.oculto ? 'Fora do menu do site' : null }, nome))
    ul.append(li)
    og2.append(h('option', { value: s.id }, nome))
    if (temFilhos) {
      const sub = h('ul', { class: 'filhos' })
      for (const f of s.filhos) {
        sub.append(h('li', { class: 'filho' }, h('a', { href: '#' + f.id, 'data-id': f.id }, rotuloFilho(f))))
        og2.append(h('option', { value: f.id }, '   ' + rotuloFilho(f)))
      }
      ul.append(h('li', { class: 'filhos-cx' }, sub))
    }
  }
  sel.append(og1, og2)
  sel.onchange = () => { location.hash = sel.value }
  marcarLista()
}
// marca a página aberta e abre o grupo dela na lista lateral
function marcarLista () {
  document.querySelectorAll('#lista-secoes a').forEach(a =>
    a.dataset.id === atual ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'))
  const s = secao(atual)
  const raiz = s ? (s.pai || s.id) : null
  document.querySelectorAll('#lista-secoes li.grupo').forEach(li => {
    const cx = li.nextElementSibling
    const aberto = li.firstChild.dataset.id === raiz
    li.classList.toggle('aberto', aberto)
    if (cx && cx.classList.contains('filhos-cx')) cx.classList.toggle('aberto', aberto)
  })
  const sel = $('#sel-secao'); if (sel) sel.value = atual
}
const rotuloFilho = (f) => f.titulo

function abrir (id) {
  if (!secao(id) && !ehConfig(id)) id = 'inicio'
  atual = id
  marcarLista()
  desenharEditor(true)
}

// ── Editor de uma página ───────────────────────────────────────────
function desenharEditor (animar) {
  const ed = $('#editor')
  const partes = []
  const cfg = CONFIG.find(c => c[0] === atual)
  if (cfg) {
    partes.push(h('div', { class: 'ed-cab' },
      h('div', {}, h('p', { class: 'trilho' }, 'Configurações'), h('h1', {}, cfg[1]), h('p', { class: 'ed-desc' }, cfg[3]))))
    partes.push(...{ _estagios: editorEstagios, _aparencia: editorAparencia, _menu: editorMenu, _textos: editorTextos }[atual]())
    return mostrarEditor(ed, partes, animar)
  }
  const s = secao(atual)
  const pai = s.pai ? secao(s.pai) : null
  const urlSite = ESTAGIO > 1 ? '../?estagio=' + ESTAGIO : '../'

  partes.push(h('div', { class: 'ed-cab' },
    h('div', {},
      pai ? h('p', { class: 'trilho' }, h('a', { href: '#' + pai.id }, pai.titulo)) : h('p', { class: 'trilho' }, 'Página'),
      h('h1', {}, s.titulo)),
    h('a', { class: 'ver-site', href: urlSite + '#/' + s.id, target: '_blank', rel: 'noopener' }, 'Ver no site ↗')))

  if (s.id === 'inicio') partes.push(...editorInicio(s))
  else if (s.referencias) partes.push(editorBibliografia())
  else if (estado.planos[s.id]) partes.push(editorPlano(s))
  else {
    const d = dadosDe(s.id)
    if (s.subpaginas) partes.push(editorSubpaginas(s))
    if (s.criada) {
      const p = paginasDe(s.pai).find(x => x.id === s.id)
      if (p) {
        const tit = campo('Título da página', p, 'titulo')
        tit.querySelector('input').addEventListener('change', () => atualizarEstrutura())
        partes.push(h('section', { class: 'ed-parte' }, h('h2', {}, 'Nome da página'),
          h('p', { class: 'dica' }, 'Aparece no alto da página e na lista de ' + pai.titulo.toLowerCase() + '.'), tit))
      }
    }
    if (s.campos || s.pai) {
      const g = h('div', { class: 'grade-campos' },
        (s.campos || []).map(([k, rot]) => campo(rot, d, k)))
      if (s.pai) g.append(campo('Resumo', d, 'resumo', { classe: 'largo', dica: 'Frase curta que aparece na lista de ' + (pai.menuTitulo || pai.titulo).toLowerCase() + '.' }))
      partes.push(h('section', { class: 'ed-parte' }, h('h2', {}, 'Informações'), g))
    }
    partes.push(editorBlocos(d, {
      titulo: s.filhos ? 'Texto de abertura (opcional)' : 'Conteúdo da página',
      dica: s.filhos ? 'Aparece no alto da página, antes da lista. Vazio, não aparece.' : s.dica ? 'O que escrever: ' + s.dica : 'Textos, fotos, vídeos e documentos, na ordem em que aparecem no site.',
    }))
  }

  mostrarEditor(ed, partes, animar)
}

// Troca o conteúdo do editor; ao mudar de página, as partes entram em sequência.
function mostrarEditor (ed, partes, animar) {
  ed.replaceChildren(...partes)
  if (!animar) return
  ed.classList.remove('entra'); void ed.offsetWidth; ed.classList.add('entra')
  window.scrollTo({ top: 0, behavior: 'instant' })
}

// ── Subpáginas ─────────────────────────────────────────────────────
// A lista fica em conteudo[secao].paginas. Na primeira mudança, a lista
// padrão (ex.: os 4 tópicos da Introdução) é copiada para lá.
function paginasDe (paiId) {
  const d = dadosDe(paiId)
  if (!Array.isArray(d.paginas)) {
    d.paginas = (secao(paiId).filhos || []).map(f => ({ id: f.id, titulo: f.titulo, ...(f.dica ? { dica: f.dica } : {}) }))
  }
  return d.paginas
}

const slug = (t) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'pagina'

function editorSubpaginas (s) {
  const sec = h('section', { class: 'ed-parte' },
    h('h2', {}, 'Subpáginas'),
    h('p', { class: 'dica' }, 'Cada subpágina tem o próprio texto, fotos, vídeos e documentos. Com pelo menos uma, '
      + (s.menuTitulo || s.titulo) + ' vira uma lista para acessar cada parte, como na Introdução.'))
  const caixa = h('div'); sec.append(caixa)
  const desenhar = () => {
    const lista = (secao(s.id).filhos || []).map(f => ({ id: f.id, titulo: f.titulo }))
    const itens = lista.length
      ? h('div', { class: 'itens' }, lista.map((p, i) => {
          const nome = h('input', { 'aria-label': 'Nome da subpágina ' + (i + 1) })
          nome.value = p.titulo || ''
          nome.addEventListener('input', () => { paginasDe(s.id)[i].titulo = nome.value; mudou() })
          nome.addEventListener('change', () => atualizarEstrutura())
          return h('div', { class: 'item sub-item' },
            h('div', { class: 'sub-linha' },
              h('span', { class: 'sub-n' }, String(i + 1).padStart(2, '0')),
              h('label', { class: 'cx' }, nome),
              h('a', { class: 'bt leve pequeno', href: '#' + p.id }, 'Editar conteúdo →')),
            h('div', { class: 'acoes-item' },
              icBt('cima', 'Subir', () => { mover(paginasDe(s.id), i, -1); atualizarEstrutura(); desenhar() }, { disabled: i === 0 }),
              icBt('baixo', 'Descer', () => { mover(paginasDe(s.id), i, 1); atualizarEstrutura(); desenhar() }, { disabled: i === lista.length - 1 }),
              icBt('lixo', 'Remover subpágina', async () => {
                if (!(await confirmar('Remover “' + (p.titulo || 'subpágina') + '”?', 'A página e todo o conteúdo dela saem do site quando você publicar.'))) return
                paginasDe(s.id).splice(i, 1); delete estado.conteudo[p.id]
                mudou(); atualizarEstrutura(); desenhar()
              })))
        }))
      : h('div', { class: 'vazio-blocos' }, 'Nenhuma subpágina. A seção aparece como uma página única.')
    const novo = h('input', { placeholder: 'Nome da nova subpágina', 'aria-label': 'Nome da nova subpágina' })
    const criar = () => {
      const titulo = novo.value.trim()
      if (!titulo) { novo.focus(); return }
      const pags = paginasDe(s.id)
      let id = s.id + '-' + slug(titulo), n = 2
      while (secao(id) || estado.conteudo[id]) id = s.id + '-' + slug(titulo) + '-' + n++
      pags.push({ id, titulo })
      estado.conteudo[id] = { resumo: '', blocos: [] }
      mudou(); atualizarEstrutura(); desenhar()
      avisar('Subpágina criada. Clique em “Editar conteúdo” para escrever nela.')
    }
    novo.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); criar() } })
    caixa.replaceChildren(itens, h('div', { class: 'nova-sub' }, novo,
      h('button', { type: 'button', class: 'chip', html: ic('mais') + ' Adicionar subpágina', onclick: criar })))
  }
  desenhar()
  return sec
}

function editorInicio (s) {
  const d = dadosDe('inicio')
  d.documentos = d.documentos || []
  const ident = h('section', { class: 'ed-parte' },
    h('h2', {}, 'Identificação'),
    h('p', { class: 'dica' }, 'Os dados da capa do portfólio. Campo vazio aparece como “a preencher”.'),
    h('div', { class: 'grade-campos' },
      campo('Título do trabalho', d, 'titulo', { classe: 'largo', dica: 'Vazio: usa “Portfólio Reflexivo de Estágio Supervisionado em Licenciatura em Música”.' }),
      s.campos.map(([k, rot]) => campo(rot, d, k))))

  const sobre = editorBlocos(d, {
    titulo: 'Sobre este portfólio',
    dica: 'O texto de apresentação. Pode ter também fotos, vídeos e documentos em PDF.',
  })

  const docs = h('section', { class: 'ed-parte' },
    h('h2', {}, 'Documentos do estágio'),
    h('p', { class: 'dica' }, 'Arquivos para baixar, como a ficha de frequência e a ficha de avaliação assinadas.'),
    listaItens(d.documentos, (doc) => [
      h('div', { class: 'grade-campos' },
        campo('Nome do documento', doc, 'nome', { ph: 'Ficha de frequência assinada' }),
        campo('Descrição (opcional)', doc, 'descricao')),
      arquivoPdf(doc, 'url'),
    ], () => ({ nome: '', descricao: '', url: '' }), 'Adicionar documento'))
  return [ident, sobre, docs]
}

function editorPlano (s) {
  const p = estado.planos[s.id]
  return h('section', { class: 'ed-parte' },
    h('h2', {}, 'Plano de aula'),
    h('p', { class: 'dica' }, 'A página do plano mostra o próprio arquivo PDF, folha por folha.'),
    h('div', { class: 'grade-campos' },
      campo('Título', p, 'titulo', { classe: 'largo' }),
      campo('Data', p, 'data', { ph: 'dd/mm/aaaa' }),
      campo('Link do Google Drive', p, 'drive', { ph: 'https://drive.google.com/…' })),
    h('div', { style: 'margin-top:14px' }, arquivoPdf(p, 'arquivo')))
}

function editorBibliografia () {
  const d = dadosDe('bibliografia')
  d.referencias = d.referencias || []
  return h('section', { class: 'ed-parte' },
    h('h2', {}, 'Referências'),
    h('p', { class: 'dica' }, 'Escreva na ordem que quiser: o site coloca em ordem alfabética sozinho.'),
    listaItens(d.referencias, (r) => [
      campo('Referência', r, 'texto', { area: true, linhas: 2, ph: 'SOBRENOME, Nome. Título da obra. Cidade: Editora, 2020.' }),
      campo('Link (opcional)', r, 'link', { ph: 'https://…' }),
    ], () => ({ texto: '', link: '' }), 'Adicionar referência'))
}

// Lista genérica: cada item com subir, descer e remover.
function listaItens (lista, montar, novo, rotuloNovo) {
  const caixa = h('div')
  const desenhar = () => {
    const itens = lista.length
      ? h('div', { class: 'itens' }, lista.map((it, i) => h('div', { class: 'item' },
          h('div', { class: 'bloco-corpo', style: 'padding:0' }, montar(it)),
          h('div', { class: 'acoes-item' },
            icBt('cima', 'Subir', () => { mover(lista, i, -1); desenhar() }, { disabled: i === 0 }),
            icBt('baixo', 'Descer', () => { mover(lista, i, 1); desenhar() }, { disabled: i === lista.length - 1 }),
            icBt('lixo', 'Remover', async () => {
              if (await confirmar('Remover este item?', 'Ele sai do site quando você publicar.')) { lista.splice(i, 1); mudou(); desenhar() }
            })))))
      : h('div', { class: 'vazio-blocos' }, 'Nenhum item ainda.')
    caixa.replaceChildren(itens, h('div', { class: 'adicionar' },
      h('button', { type: 'button', class: 'chip', html: ic('mais') + ' ' + rotuloNovo, onclick: () => { lista.push(novo()); mudou(); desenhar() } })))
  }
  desenhar()
  return caixa
}
function mover (lista, i, d) {
  const j = i + d
  if (j < 0 || j >= lista.length) return
  ;[lista[i], lista[j]] = [lista[j], lista[i]]
  mudou()
}

// ── Blocos de conteúdo ─────────────────────────────────────────────
const TIPOS = [
  ['texto', 'Parágrafo'], ['subtitulo', 'Subtítulo'], ['citacao', 'Citação'],
  ['imagem', 'Foto'], ['galeria', 'Galeria de fotos'], ['video', 'Vídeo'], ['pdf', 'Documento PDF'],
]
const nomeTipo = (t) => (TIPOS.find(x => x[0] === t) || [t, t])[1]
const novoBloco = (t) => ({
  texto: { tipo: 'texto', texto: '' }, retratil: { tipo: 'retratil', titulo: '', texto: '' }, subtitulo: { tipo: 'subtitulo', texto: '' }, citacao: { tipo: 'citacao', texto: '' },
  imagem: { tipo: 'imagem', url: '', legenda: '', alt: '' }, galeria: { tipo: 'galeria', legenda: '', itens: [] },
  video: { tipo: 'video', url: '', poster: '', drive: '', legenda: '' }, pdf: { tipo: 'pdf', url: '', drive: '', legenda: '' },
}[t])

function editorBlocos (d, { titulo, dica }) {
  d.blocos = d.blocos || []
  const sec = h('section', { class: 'ed-parte' }, h('h2', {}, titulo), h('p', { class: 'dica' }, dica))
  const caixa = h('div')
  sec.append(caixa)

  const desenhar = (foco) => {
    const lista = d.blocos
    const blocos = lista.length
      ? h('div', { class: 'blocos' }, lista.map((b, i) => h('div', { class: 'bloco', 'data-i': i },
          h('div', { class: 'bloco-cab' },
            h('span', { class: 'tipo' }, nomeTipo(b.tipo)),
            icBt('cima', 'Subir', () => { mover(lista, i, -1); desenhar() }, { disabled: i === 0 }),
            icBt('baixo', 'Descer', () => { mover(lista, i, 1); desenhar() }, { disabled: i === lista.length - 1 }),
            icBt('lixo', 'Remover', async () => {
              if (await confirmar('Remover este bloco?', nomeTipo(b.tipo) + ' — ele sai do site quando você publicar.')) {
                lista.splice(i, 1); mudou(); desenhar()
              }
            })),
          h('div', { class: 'bloco-corpo' }, corpoBloco(b)))))
      : h('div', { class: 'vazio-blocos' }, 'Esta parte ainda está vazia. Comece adicionando um parágrafo.')

    caixa.replaceChildren(blocos, h('div', { class: 'adicionar' },
      h('span', {}, 'Adicionar:'),
      TIPOS.map(([t, nome]) => h('button', {
        type: 'button', class: 'chip', html: ic('mais') + ' ' + nome,
        onclick: () => { lista.push(novoBloco(t)); mudou(); desenhar(lista.length - 1) },
      }))))
    if (foco != null) {
      const alvo = caixa.querySelector(`.bloco[data-i="${foco}"]`)
      if (alvo) { alvo.classList.add('novo'); alvo.scrollIntoView({ block: 'center', behavior: 'smooth' }); setTimeout(() => alvo.querySelector('input, textarea, button.bt')?.focus({ preventScroll: true }), 300) }
    }
  }
  desenhar()
  return sec
}

function corpoBloco (b) {
  switch (b.tipo) {
    case 'texto':
      return [comLink(campo('', b, 'texto', { area: true, dica: 'Deixe uma linha em branco entre um parágrafo e outro.' }), b, 'texto'), opcaoRetratil(b)]
    case 'retratil': {
      const aberta = h('input', { type: 'checkbox', onchange: (e) => { if (e.target.checked) b.aberta = true; else delete b.aberta; mudou() } })
      aberta.checked = !!b.aberta
      return [
        campo('Título (aparece na caixa fechada)', b, 'titulo', { ph: 'Ex.: Turma 5º A' }),
        comLink(campo('Texto', b, 'texto', { area: true, dica: 'Fica escondido até a pessoa clicar no título. Linha em branco separa os parágrafos.' }), b, 'texto'),
        h('label', { class: 'marcar' }, aberta, 'Começar aberto'),
      ]
    }
    case 'subtitulo':
      return [campo('', b, 'texto', { ph: 'Ex.: Turma 5º A' })]
    case 'citacao':
      return [campo('', b, 'texto', { area: true, linhas: 3, ph: 'Trecho citado de um autor.' }), opcaoRetratil(b)]
    case 'imagem': return [...editorImagem(b), opcaoRetratil(b)]
    case 'galeria': return [...editorGaleria(b), opcaoRetratil(b)]
    case 'video': return [...editorVideo(b), opcaoRetratil(b)]
    case 'pdf': return [
      arquivoPdf(b, 'url'),
      formatoPdf(b),
      h('div', { class: 'grade-campos' },
        campo('Legenda (opcional)', b, 'legenda'),
        campo('Link do Google Drive (opcional)', b, 'drive', { ph: 'https://drive.google.com/…' })),
      opcaoRetratil(b),
    ]
    default:
      return [h('p', { class: 'dica' }, 'Tipo de bloco não editável aqui.')]
  }
}

// Botão "Link": transforma o trecho selecionado em link. No texto fica
// [trecho](https://endereço), e o site mostra só o trecho, clicável.
function comLink (rotulo, obj, chave) {
  const area = rotulo.querySelector('textarea')
  const form = h('div', { class: 'link-form', hidden: true })
  const url = h('input', { type: 'url', placeholder: 'https://…', 'aria-label': 'Endereço do link' })
  const txt = h('input', { placeholder: 'Texto que aparece (opcional)', 'aria-label': 'Texto do link' })
  let sel = [0, 0]
  const aplicar = () => {
    let u = url.value.trim()
    if (!u) { url.focus(); return }
    if (!/^https?:\/\//i.test(u)) u = 'https://' + u
    const v = area.value
    const trecho = txt.value.trim() || v.slice(sel[0], sel[1]).trim()
    const novo = trecho ? `[${trecho.replace(/[\[\]]/g, '')}](${u})` : u
    area.value = v.slice(0, sel[0]) + novo + v.slice(sel[1])
    obj[chave] = area.value; mudou()
    area.dispatchEvent(new Event('input'))
    form.hidden = true
    area.focus(); area.setSelectionRange(sel[0] + novo.length, sel[0] + novo.length)
  }
  url.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); aplicar() } })
  txt.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); aplicar() } })
  form.append(url, txt,
    h('button', { type: 'button', class: 'bt pequeno', onclick: aplicar }, 'Inserir'),
    h('button', { type: 'button', class: 'bt leve pequeno', onclick: () => { form.hidden = true } }, 'Cancelar'))
  const bt = h('button', { type: 'button', class: 'chip', html: ic('link') + ' Link', onclick: () => {
    sel = [area.selectionStart, area.selectionEnd]
    txt.value = ''; url.value = ''
    txt.placeholder = sel[1] > sel[0] ? 'Texto: “' + area.value.slice(sel[0], sel[1]).slice(0, 40) + '”' : 'Texto que aparece (opcional)'
    form.hidden = false; url.focus()
  } })
  return h('div', { class: 'com-link' }, rotulo,
    h('div', { class: 'link-barra' }, bt, h('span', { class: 'envio-txt' }, 'Selecione um trecho do texto e clique em Link.')), form)
}

// Deixa foto, galeria ou vídeo dentro de uma caixa que abre e fecha.
function opcaoRetratil (b) {
  const caixa = h('div', { class: 'retratil-op' })
  const pintar = () => {
    const marca = h('input', { type: 'checkbox', onchange: (e) => {
      if (e.target.checked) b.retratil = true
      else { delete b.retratil; delete b.tituloRetratil; delete b.aberta }
      mudou(); pintar()
    } })
    marca.checked = !!b.retratil
    const partes = [h('label', { class: 'marcar' }, marca, 'Deixar retrátil (abre e fecha no site)')]
    if (b.retratil) {
      const aberta = h('input', { type: 'checkbox', onchange: (e) => { if (e.target.checked) b.aberta = true; else delete b.aberta; mudou() } })
      aberta.checked = !!b.aberta
      const padrao = { texto: 'Ver mais', citacao: 'Citação', imagem: 'Foto', galeria: 'Fotos', video: 'Vídeo', pdf: 'Documento' }[b.tipo]
      partes.push(campo('Título da caixa', b, 'tituloRetratil', { ph: 'Ex.: ' + padrao + ' da aula — vazio usa “' + padrao + '”' }),
        h('label', { class: 'marcar' }, aberta, 'Começar aberto'))
    }
    caixa.replaceChildren(...partes)
  }
  pintar()
  return caixa
}

function editorImagem (b) {
  const vista = h('div', { class: 'midia-vista' })
  const pintar = () => vista.replaceChildren(b.url ? h('img', { src: ver(b.url), alt: '' }) : 'Nenhuma foto ainda')
  pintar()
  return [h('div', { class: 'midia-linha' }, vista, h('div', { class: 'midia-campos' },
    botaoEnviar(b.url ? 'Trocar foto' : 'Enviar foto', 'image/*', (url) => { b.url = url; mudou(); pintar() }),
    escolhaTamanho(b),
    campo('Legenda', b, 'legenda'),
    campo('Descrição para leitores de tela (opcional)', b, 'alt', { ph: 'O que aparece na foto' })))]
}

// Tamanho da foto na página. A miniatura do lado não muda; use a
// pré-visualização para ver como fica no site.
const TAMANHOS = [['pequena', 'Pequena'], ['media', 'Média'], ['grande', 'Grande'], ['total', 'Largura total']]
// PDF aberto na página ou só como cartão com botão de baixar
function formatoPdf (b) {
  const grupo = h('div', { class: 'tamanhos', role: 'group', 'aria-label': 'Formato do PDF' })
  const nome = campo('Nome do documento (aparece no cartão)', b, 'nome', { ph: 'Ex.: Ficha de Frequência' })
  const pintar = () => {
    nome.hidden = b.formato !== 'botao'
    grupo.replaceChildren(...[['aberto', 'Aberto na página'], ['botao', 'Cartão com botão Baixar']].map(([v, rot]) =>
      h('button', { type: 'button', 'aria-pressed': String((b.formato || 'aberto') === v),
        onclick: () => { if (v === 'aberto') delete b.formato; else b.formato = v; mudou(); pintar() } }, rot)))
  }
  pintar()
  return h('div', {}, h('div', { class: 'cx' }, 'Como aparece no site', grupo), nome)
}

function escolhaTamanho (b) {
  const atual = () => b.tamanho || 'total'
  const grupo = h('div', { class: 'tamanhos', role: 'group', 'aria-label': 'Tamanho da foto' })
  const pintar = () => grupo.replaceChildren(...TAMANHOS.map(([v, rot]) => h('button', {
    type: 'button', 'aria-pressed': String(atual() === v),
    onclick: () => { if (v === 'total') delete b.tamanho; else b.tamanho = v; mudou(); pintar() },
  }, h('span', { class: 'tam-ic tam-ic-' + v }), rot)))
  pintar()
  const posGrupo = h('div', { class: 'tamanhos', role: 'group', 'aria-label': 'Posição da foto' })
  const posCx = h('div', { class: 'cx' }, 'Posição', posGrupo)
  const posAtual = () => b.posicao || (b.tamanho === 'pequena' ? 'esquerda' : 'centro')
  const pintarPos = () => {
    posCx.hidden = !(b.tamanho === 'pequena' || b.tamanho === 'media')
    posGrupo.replaceChildren(...[['esquerda', 'Ao lado do texto (esquerda)'], ['centro', 'Centralizada'], ['direita', 'Ao lado do texto (direita)']]
      .map(([v, rot]) => h('button', { type: 'button', 'aria-pressed': String(posAtual() === v),
        onclick: () => { b.posicao = v; mudou(); pintarPos() } }, rot)))
  }
  pintarPos()
  grupo.addEventListener('click', () => setTimeout(pintarPos))
  return h('div', {}, h('div', { class: 'cx' }, 'Tamanho na página', grupo), posCx)
}

function editorVideo (b) {
  const vista = h('div', { class: 'midia-vista' })
  const pintar = () => vista.replaceChildren(b.url
    ? h('video', { src: ver(b.url), poster: b.poster ? ver(b.poster) : false, controls: true, preload: 'metadata', playsinline: true })
    : 'Nenhum vídeo ainda')
  pintar()
  const capaTxt = h('span', { class: 'envio-txt' })
  return [h('div', { class: 'midia-linha' }, vista, h('div', { class: 'midia-campos' },
    botaoEnviar(b.url ? 'Trocar vídeo' : 'Enviar vídeo', 'video/mp4,video/webm,video/quicktime', async (url, arq) => {
      b.url = url; mudou(); pintar()
      capaTxt.textContent = 'gerando a capa do vídeo…'
      const capa = await capaDoVideo(arq)
      if (capa) { b.poster = await enviarArquivo(capa); mudou(); pintar() }
      capaTxt.textContent = ''
    }),
    capaTxt,
    botaoEnviar('Trocar capa', 'image/*', (url) => { b.poster = url; mudou(); pintar() }),
    campo('Legenda', b, 'legenda'),
    campo('Link do Google Drive (opcional)', b, 'drive', { ph: 'https://drive.google.com/…', dica: 'Aparece como “Abrir no Google Drive” embaixo do vídeo.' })))]
}

function editorGaleria (b) {
  b.itens = b.itens || []
  const grade = h('div', { class: 'ed-galeria' })
  let arrastado = null
  const pintar = () => {
    grade.replaceChildren(...b.itens.map((it, i) => {
      const leg = h('input', { placeholder: 'Legenda', 'aria-label': 'Legenda da foto ' + (i + 1), oninput: (e) => { it.legenda = e.target.value; mudou() } })
      leg.value = it.legenda || ''
      const card = h('div', { class: 'ed-foto', draggable: 'true' },
        h('div', { class: 'ft' }, h('img', { src: ver(it.url), alt: '' }), h('span', { class: 'n' }, String(i + 1))),
        leg,
        h('div', { class: 'acoes' },
          icBt('esq', 'Mover para antes', () => { mover(b.itens, i, -1); pintar() }, { disabled: i === 0 }),
          icBt('lixo', 'Remover foto', async () => {
            if (await confirmar('Remover esta foto?', 'Ela sai da galeria quando você publicar.')) { b.itens.splice(i, 1); mudou(); pintar() }
          }),
          icBt('dir', 'Mover para depois', () => { mover(b.itens, i, 1); pintar() }, { disabled: i === b.itens.length - 1 })))
      // arrastar para reordenar (computador)
      card.addEventListener('dragstart', () => { arrastado = i; card.classList.add('arrastando') })
      card.addEventListener('dragend', () => { arrastado = null; card.classList.remove('arrastando') })
      card.addEventListener('dragover', (e) => { if (arrastado != null) { e.preventDefault(); card.classList.add('alvo') } })
      card.addEventListener('dragleave', () => card.classList.remove('alvo'))
      card.addEventListener('drop', (e) => {
        e.preventDefault(); card.classList.remove('alvo')
        if (arrastado == null || arrastado === i) return
        const [x] = b.itens.splice(arrastado, 1); b.itens.splice(i, 0, x); mudou(); pintar()
      })
      return card
    }))
  }
  pintar()

  const env = botaoEnviar('Adicionar fotos', 'image/*', (url, arq) => {
    b.itens.push({ url, legenda: '' }); mudou(); pintar()
  }, { varios: true })
  // soltar fotos do computador direto na área
  const soltar = h('div', { class: 'soltar' }, 'Arraste fotos para cá ou use o botão acima. A grade se organiza sozinha.')
  soltar.addEventListener('click', () => env.querySelector('input').click())
  soltar.addEventListener('dragover', (e) => { if (e.dataTransfer.types.includes('Files')) { e.preventDefault(); soltar.classList.add('sobre') } })
  soltar.addEventListener('dragleave', () => soltar.classList.remove('sobre'))
  soltar.addEventListener('drop', (e) => {
    e.preventDefault(); soltar.classList.remove('sobre')
    const arqs = [...e.dataTransfer.files].filter(f => f.type.startsWith('image/'))
    if (arqs.length) enviarVarios(arqs, (url) => { b.itens.push({ url, legenda: '' }); mudou(); pintar() },
      { bt: env.querySelector('button'), barra: env.querySelector('.progresso'), txt: env.querySelector('.envio-txt') })
  })
  return [campo('Legenda da galeria (opcional)', b, 'legenda'), grade, env, soltar]
}

function arquivoPdf (obj, chave) {
  const vista = h('div', { class: 'midia-vista pdf' })
  const pintar = () => {
    const url = obj[chave]
    vista.replaceChildren(url
      ? h('span', {}, h('b', { style: 'color:var(--escuro)' }, decodeURIComponent(url.split('/').pop().split('?')[0])), h('br'),
          h('a', { href: ver(url), target: '_blank', rel: 'noopener' }, 'Abrir o PDF ↗'))
      : 'Nenhum PDF ainda')
  }
  pintar()
  return h('div', { class: 'midia-linha' }, vista, h('div', { class: 'midia-campos' },
    botaoEnviar(obj[chave] ? 'Trocar PDF' : 'Enviar PDF', 'application/pdf', (url) => { obj[chave] = url; mudou(); pintar() })))
}

// ── Configurações: estágios ────────────────────────────────────────
function editorEstagios () {
  const s = site()
  const url = (n, hash = '#inicio') => location.pathname + (n > 1 ? '?estagio=' + n : '') + hash
  const cartoes = h('div', { class: 'estagios-grade' }, [1, 2, 3].map(n => {
    const pub = ESTAGIOS.find(e => e.n === n)
    const aqui = n === ESTAGIO
    const nome = aqui ? ((s.nomeEstagio || '').trim() || 'Estágio ' + n) : (pub ? pub.nome : 'Estágio ' + n)
    const status = aqui && !pub ? 'Em edição, ainda não publicado'
      : !pub ? 'Ainda não criado'
      : pub.ativo ? 'Publicado e visível no site' : 'Publicado, escondido do site'
    return h('div', { class: 'estagio-cartao' + (aqui ? ' atual' : '') + (pub ? '' : ' novo') },
      h('span', { class: 'estagio-n' }, String(n)),
      h('div', { class: 'estagio-txt' }, h('b', {}, nome), h('small', {}, status)),
      aqui
        ? h('span', { class: 'estagio-selo' }, 'Editando agora')
        : h('a', { class: 'bt leve pequeno', href: url(n) }, pub ? 'Editar este →' : 'Criar e editar →'))
  }))
  const lista = h('section', { class: 'ed-parte' },
    h('h2', {}, 'Seus estágios'),
    h('p', { class: 'dica' }, 'Cada estágio é um portfólio completo, com páginas, textos, cores e menu próprios. Um estágio novo só aparece no site depois de publicado.'),
    cartoes)

  const nome = campo('Nome do estágio', s, 'nomeEstagio', { ph: 'Estágio ' + ESTAGIO, dica: 'Aparece no seletor do topo do site, por exemplo “Estágio 1” ou “Estágio Supervisionado 2”.' })
  nome.querySelector('input').addEventListener('input', nomeEstagioTopo)
  const ativo = h('input', { type: 'checkbox', onchange: (e) => { if (e.target.checked) delete s.ativo; else s.ativo = false; mudou() } })
  ativo.checked = s.ativo !== false
  const seletor = campo('Rótulo do seletor no site', sob(s, 'textos'), 'estagioSeletor', { ph: window.texto('estagioSeletor', {}) })
  const este = h('section', { class: 'ed-parte' },
    h('h2', {}, 'Este estágio'),
    h('p', { class: 'dica' }, 'O seletor de estágios só aparece no topo do site quando houver mais de um estágio visível.'),
    h('div', { class: 'grade-campos' }, nome, seletor),
    ESTAGIO > 1 ? h('label', { class: 'marcar', style: 'margin-top:14px' }, ativo, 'Mostrar este estágio no site') : null)

  const partes = [lista, este]
  // estágio novo: aproveitar aparência, menu e textos do estágio 1
  if (ESTAGIO > 1) {
    const bt = h('button', { type: 'button', class: 'bt leve', onclick: async () => {
      bt.disabled = true; bt.textContent = 'Copiando…'
      try {
        const d = await api('conteudo?estagio=1', { cache: 'no-store' })
        const base = (d && d.conteudo && d.conteudo._site) || {}
        const { nomeEstagio, ativo: _a, ...resto } = copia(base)
        estado.conteudo._site = { ...resto, ...(s.nomeEstagio ? { nomeEstagio: s.nomeEstagio } : {}), ...(s.ativo === false ? { ativo: false } : {}) }
        mudou(); window.aplicarTema(estado.conteudo); atualizarEstrutura(); desenharEditor()
        avisar('Aparência, menu e textos copiados do Estágio 1.')
      } catch (e) { avisar('Não foi possível copiar: ' + e.message, true); bt.disabled = false; bt.textContent = 'Copiar do Estágio 1' }
    } }, 'Copiar do Estágio 1')
    partes.push(h('section', { class: 'ed-parte' },
      h('h2', {}, 'Começar parecido com o Estágio 1'),
      h('p', { class: 'dica' }, 'Copia as cores, as fontes, a logo, o menu e os textos do site. As páginas continuam vazias para você escrever.'),
      bt))
  }
  return partes
}

// ── Configurações: aparência ───────────────────────────────────────
function editorAparencia () {
  const s = site()
  const tema = sob(s, 'tema')
  const aplicar = () => { mudou(); window.aplicarTema(estado.conteudo) }
  // carrega todas as fontes da lista para as amostras
  window.carregarFontes([...new Set([...window.FONTES_TITULO, ...window.FONTES_TEXTO])], 'fontes-amostra')

  // paleta
  const grade = h('div', { class: 'paletas' })
  const proprias = h('div', { class: 'cores-proprias' })
  const pintar = () => {
    const atualP = tema.paleta || 'verde'
    const opcoes = [...Object.entries(window.PALETAS), ['propria', { nome: 'Personalizada', ...window.coresDoTema(estado.conteudo) }]]
    grade.replaceChildren(...opcoes.map(([k, p]) => h('button', {
      type: 'button', class: 'paleta', 'aria-pressed': String(atualP === k),
      onclick: () => {
        if (k === 'propria' && !tema.cores) tema.cores = Object.fromEntries(window.CORES_EDITAVEIS.map(([c]) => [c, window.coresDoTema(estado.conteudo)[c]]))
        if (k === 'verde') delete tema.paleta; else tema.paleta = k
        aplicar(); pintar()
      } },
      h('span', { class: 'paleta-cores' }, ['pastel', 'medio', 'medio-f', 'escuro'].map(c => h('i', { style: 'background:' + p[c] }))),
      h('span', { class: 'paleta-nome' }, k === 'propria' ? 'Personalizada' : p.nome))))
    proprias.hidden = atualP !== 'propria'
    if (atualP === 'propria') {
      const cores = sob(tema, 'cores')
      proprias.replaceChildren(...window.CORES_EDITAVEIS.map(([c, rot]) => {
        const inp = h('input', { type: 'color', 'aria-label': rot })
        inp.value = cores[c] || window.PALETAS.verde[c]
        const cod = h('code', {}, inp.value.toUpperCase())
        inp.addEventListener('input', () => { cores[c] = inp.value; cod.textContent = inp.value.toUpperCase(); aplicar() })
        return h('label', { class: 'cor' }, inp, h('span', {}, rot, cod))
      }))
    }
  }
  pintar()
  const secCores = h('section', { class: 'ed-parte' },
    h('h2', {}, 'Paleta de cores'),
    h('p', { class: 'dica' }, 'Escolha uma paleta pronta ou monte a sua em “Personalizada”. O painel já mostra as cores novas.'),
    grade, proprias)

  // fontes
  const escolhaFonte = (rotulo, chave, lista, padrao, amostra, classe) => {
    const sel = h('select', { 'aria-label': rotulo })
    for (const f of lista) sel.append(h('option', { value: f }, f + (f === padrao ? ' (original)' : '')))
    sel.value = tema[chave] || padrao
    const ex = h('p', { class: 'fonte-amostra ' + classe, style: `font-family:"${sel.value}"` }, amostra)
    sel.addEventListener('change', () => {
      if (sel.value === padrao) delete tema[chave]; else tema[chave] = sel.value
      ex.style.fontFamily = `"${sel.value}"`; aplicar()
    })
    return h('div', { class: 'cx' }, rotulo, sel, ex)
  }
  const secFontes = h('section', { class: 'ed-parte' },
    h('h2', {}, 'Fontes'),
    h('p', { class: 'dica' }, 'Uma fonte para os títulos e os textos longos, outra para o menu, os rótulos e os botões.'),
    h('div', { class: 'grade-campos duas-col' },
      escolhaFonte('Títulos e textos', 'fonteTitulo', window.FONTES_TITULO, 'EB Garamond', 'Relatos de observação e reflexões sobre a prática docente.', 'grande'),
      escolhaFonte('Menu, rótulos e botões', 'fonteTexto', window.FONTES_TEXTO, 'Karla', 'Início · A Escola · Planos de Aula · Baixar', '')))

  // logo e nome
  const vista = h('div', { class: 'logo-vista' })
  const pintarLogo = () => {
    vista.replaceChildren(s.logo
      ? h('img', { src: ver(s.logo), alt: 'Logo atual' })
      : h('svg', { viewBox: '0 0 128 96', html: '<use href="#tamandua"/>', style: 'color:var(--medio-f)' }))
    tirar.hidden = !s.logo
  }
  const tirar = h('button', { type: 'button', class: 'bt leve pequeno', onclick: () => { delete s.logo; mudou(); pintarLogo() } }, 'Voltar ao tamanduá')
  const textos = sob(s, 'textos')
  const secLogo = h('section', { class: 'ed-parte' },
    h('h2', {}, 'Logo e nome do site'),
    h('p', { class: 'dica' }, 'A logo aparece no topo e no fim da pauta da capa. Imagem PNG com fundo transparente fica melhor.'),
    h('div', { class: 'midia-linha' }, vista, h('div', { class: 'midia-campos' },
      h('div', { class: 'enviar' }, botaoEnviar('Enviar logo', 'image/png,image/svg+xml,image/webp,image/jpeg', (url) => { s.logo = url; mudou(); pintarLogo() }), tirar),
      campo('Nome ao lado da logo', textos, 'marcaTitulo', { ph: window.texto('marcaTitulo', {}) }),
      campo('Linha pequena abaixo do nome', textos, 'marcaSub', { ph: window.texto('marcaSub', {}) }))))
  pintarLogo()

  return [secCores, secFontes, secLogo]
}

// ── Configurações: menu e quantidades ──────────────────────────────
function editorMenu () {
  const s = site()
  const menu = sob(s, 'menu')
  const caixa = h('div')
  const desenhar = () => {
    const raiz = window.SECOES.filter(x => !x.pai)
    caixa.replaceChildren(h('div', { class: 'menu-itens' }, raiz.map((x, i) => {
      const m = sob(menu, x.id)
      const nomeMenu = campo('Nome no menu', m, 'menu', { ph: x.menuPadrao })
      const titulo = campo('Título da página', m, 'titulo', { ph: x.tituloPadrao })
      for (const c of [nomeMenu, titulo]) c.querySelector('input').addEventListener('change', () => { limpar(x.id); atualizarEstrutura() })
      const ver = h('input', { type: 'checkbox', disabled: x.id === 'inicio', onchange: (e) => {
        if (e.target.checked) delete m.oculto; else m.oculto = true
        limpar(x.id); mudou(); atualizarEstrutura(); desenhar()
      } })
      ver.checked = !m.oculto
      const mexer = (d) => {
        const ids = raiz.map(r => r.id)
        const j = i + d
        if (j < 1 || j >= ids.length) return
        ;[ids[i], ids[j]] = [ids[j], ids[i]]
        s.ordem = ids.filter(id => id !== 'inicio')
        mudou(); atualizarEstrutura(); desenhar()
      }
      return h('div', { class: 'menu-item' + (m.oculto ? ' fora' : '') },
        h('span', { class: 'sub-n' }, String(i + 1).padStart(2, '0')),
        h('div', { class: 'menu-campos' }, nomeMenu, titulo,
          h('label', { class: 'marcar' }, ver, x.id === 'inicio' ? 'Sempre no menu' : 'Aparece no menu')),
        h('div', { class: 'acoes-item' },
          icBt('cima', 'Subir', () => mexer(-1), { disabled: i <= 1 }),
          icBt('baixo', 'Descer', () => mexer(1), { disabled: i === 0 || i === raiz.length - 1 })))
    })))
  }
  // não guarda objetos vazios
  const limpar = (id) => {
    const m = menu[id]
    if (m) for (const k of Object.keys(m)) if (m[k] === '' || m[k] == null) delete m[k]
  }
  desenhar()
  const secMenu = h('section', { class: 'ed-parte' },
    h('h2', {}, 'Itens do menu'),
    h('p', { class: 'dica' }, 'Campo vazio usa o nome original (o que aparece em cinza). O Início fica sempre em primeiro.'),
    caixa)

  const qtd = sob(s, 'quantidades')
  const numero = (k) => {
    const sec = secao(k) || { titulo: k }
    const inp = h('input', { type: 'number', min: 1, max: 30, inputmode: 'numeric' })
    inp.value = qtd[k] || window.QTD_PADRAO[k]
    inp.addEventListener('change', () => {
      const n = Math.max(1, Math.min(30, Math.round(Number(inp.value) || window.QTD_PADRAO[k])))
      inp.value = n
      if (n === window.QTD_PADRAO[k]) delete qtd[k]; else qtd[k] = n
      mudou(); atualizarEstrutura()
    })
    return h('label', { class: 'cx' }, sec.menuTitulo || sec.titulo, inp)
  }
  const secQtd = h('section', { class: 'ed-parte' },
    h('h2', {}, 'Quantidade de páginas'),
    h('p', { class: 'dica' }, 'Quantas páginas numeradas cada lista tem. Diminuir só esconde as últimas: o que foi escrito nelas não é apagado.'),
    h('div', { class: 'grade-campos' }, numero('observacoes'), numero('planos'), numero('relatos')))
  return [secMenu, secQtd]
}

// ── Configurações: textos fixos e nomes de campos ──────────────────
function editorTextos () {
  const s = site()
  const textos = sob(s, 'textos')
  const partes = window.TEXTOS_PADRAO.filter(([g]) => g !== 'Topo do site').map(([grupo, lista]) =>
    h('section', { class: 'ed-parte' },
      h('h2', {}, grupo),
      h('div', { class: 'grade-campos' }, lista.map(([k, rot, padrao]) => {
        const c = campo(rot, textos, k, padrao.length > 70 ? { area: true, linhas: 2, ph: padrao, classe: 'largo texto-curto' } : { ph: padrao })
        c.querySelector('input, textarea').addEventListener('change', () => { if (!textos[k]) delete textos[k]; atualizarEstrutura() })
        return c
      }))))
  const rotulos = sob(s, 'rotulos')
  for (const [titulo, grupo, campos] of window.CAMPOS_ROTULOS) {
    const g = sob(rotulos, grupo)
    partes.push(h('section', { class: 'ed-parte' },
      h('h2', {}, titulo),
      h('p', { class: 'dica' }, 'O nome de cada campo, como aparece no site e no painel.'),
      h('div', { class: 'grade-campos' }, campos.map(([k, rot]) => {
        const c = campo(rot, g, k, { ph: rot })
        c.querySelector('input').addEventListener('change', () => { if (!g[k]) delete g[k]; atualizarEstrutura() })
        return c
      }))))
  }
  return partes
}

// ── Mudanças, rascunho e publicação ────────────────────────────────
function mudou () {
  const s = sujo()
  $('#barra').classList.toggle('sujo', s)
  $('#estado').textContent = s ? 'Alterações ainda não publicadas.' : 'Tudo publicado.'
  $('#bt-salvar').disabled = !s
  $('#bt-descartar').hidden = !s
  try { s ? localStorage.setItem(RASCUNHO, JSON.stringify({ base: publicado, estado })) : localStorage.removeItem(RASCUNHO) } catch {}
}

// Deixa toda página com a mesma forma (listas existentes, sem os modelos
// vazios do arquivo original), para "sem alterações" ser comparável.
function normalizar (base) {
  // esqueleto das configurações: abrir uma tela não conta como alteração
  const st = (base.conteudo._site = base.conteudo._site || {})
  for (const k of ['tema', 'textos', 'menu', 'quantidades', 'rotulos']) st[k] = st[k] || {}
  st.rotulos.ident = st.rotulos.ident || {}; st.rotulos.escola = st.rotulos.escola || {}
  for (const sec of window.SECOES) if (!sec.pai) st.menu[sec.id] = st.menu[sec.id] || {}
  for (const s of window.SECOES) {
    const d = (base.conteudo[s.id] = base.conteudo[s.id] || {})
    if (s.blocos) {
      d.blocos = (d.blocos || []).map(b => b && b.tipo === 'retratil'
        ? { tipo: 'texto', texto: b.texto || '', retratil: true, ...(b.titulo ? { tituloRetratil: b.titulo } : {}), ...(b.aberta ? { aberta: true } : {}) }
        : b)
      d.blocos = d.blocos.filter(b => b && b.tipo && !(b.tipo === 'texto' && !String(b.texto || '').trim()))
    }
    if (s.documentos) d.documentos = d.documentos || []
    if (s.referencias) d.referencias = d.referencias || []
  }
  return base
}

async function carregar () {
  $('#editor').replaceChildren(h('p', { class: 'carregando' }, 'Carregando o conteúdo…'))
  let d = {}
  try { d = await api('conteudo?estagio=' + ESTAGIO, { cache: 'no-store' }) } catch {}
  ESTAGIOS = (d && d.estagios) || []
  // estágios 2 e 3 começam vazios (os textos de reserva são do estágio 1)
  const base = d && !d.vazio && d.conteudo
    ? { conteudo: d.conteudo, planos: d.planos || {} }
    : ESTAGIO > 1 ? { conteudo: {}, planos: {} }
    : { conteudo: copia(window.CONTEUDO || {}), planos: copia(window.PLANOS || {}) }
  window.montarSecoes(base.conteudo)
  normalizar(base)
  publicado = JSON.stringify(base)
  estado = copia(base)
  // rascunho deixado neste navegador (ex.: a aba fechou antes de publicar)
  try {
    const r = JSON.parse(localStorage.getItem(RASCUNHO) || 'null')
    if (r && r.estado && JSON.stringify(r.estado) !== publicado) {
      if (r.base === publicado) { estado = r.estado; window.montarSecoes(estado.conteudo); avisar('Recuperamos as alterações que você não tinha publicado.') }
      else localStorage.removeItem(RASCUNHO)
    }
  } catch {}
  window.aplicarTema(estado.conteudo)
  nomeEstagioTopo()
  montarLista()
  abrir(location.hash.slice(1) || 'inicio')
  mudou()
}

function nomeEstagioTopo () {
  const n = ((estado.conteudo._site || {}).nomeEstagio || '').trim() || 'Estágio ' + ESTAGIO
  $('#p-estagio').textContent = n
}

// O site só mostra o que tem conteúdo; os modelos vazios saem antes de salvar.
function limparParaSalvar (e) {
  const c = copia(e)
  for (const d of Object.values(c.conteudo)) {
    if (Array.isArray(d.blocos)) d.blocos = d.blocos.filter(b => b && b.tipo)
    if (Array.isArray(d.documentos)) d.documentos = d.documentos.filter(x => x.nome || x.url)
    if (Array.isArray(d.referencias)) d.referencias = d.referencias.filter(x => (x.texto || '').trim())
  }
  return c
}

// Pré-visualização: o próprio site, num quadro, com o rascunho.
let previaPronta = false
function abrirPrevia (paraPublicar) {
  const tela = $('#previa'), q = $('#previa-quadro')
  $('#previa-titulo').textContent = paraPublicar ? 'Confira antes de publicar' : 'Pré-visualização'
  $('#previa-sub').textContent = paraPublicar
    ? 'Veja se está tudo certo. Navegue pelo menu para conferir outras páginas.'
    : 'Assim a página vai ficar. Nada foi publicado ainda.'
  $('#previa-publicar').hidden = !sujo()
  tela.hidden = false
  document.body.style.overflow = 'hidden'
  const enviar = () => q.contentWindow.postMessage({ tipo: 'previa', ...limparParaSalvar(estado), rota: ehConfig(atual) ? 'inicio' : atual }, location.origin)
  if (!previaPronta || !q.src) {
    q.src = '../index.html?previa=1#/' + (ehConfig(atual) ? 'inicio' : atual)
    window.addEventListener('message', function pronto (e) {
      if (e.origin === location.origin && e.data && e.data.tipo === 'previa-pronta') { previaPronta = true; enviar() }
    })
  } else enviar()
  $('#previa-voltar').focus()
}
function fecharPrevia () {
  $('#previa').hidden = true
  document.body.style.overflow = ''
  $('#bt-previa').focus()
}

async function publicar () {
  const bt = $('#previa-publicar')
  bt.disabled = true; bt.textContent = 'Publicando…'
  try {
    const limpo = limparParaSalvar(estado)
    await api('conteudo?estagio=' + ESTAGIO, { method: 'PUT', body: limpo })
    const nome = ((estado.conteudo._site || {}).nomeEstagio || '').trim() || 'Estágio ' + ESTAGIO
    ESTAGIOS = [...ESTAGIOS.filter(e => e.n !== ESTAGIO), { n: ESTAGIO, nome, ativo: ESTAGIO === 1 || (estado.conteudo._site || {}).ativo !== false }]
    publicado = JSON.stringify(estado)
    mudou()
    fecharPrevia()
    avisar('Publicado! O site já mostra as alterações.')
  } catch (e) {
    avisar('Não foi possível publicar: ' + e.message, true)
  } finally {
    bt.disabled = false; bt.textContent = 'Publicar'
  }
}

// ── Entrar, sair, senha e editores ─────────────────────────────────
function mostrarEntrar (msg) {
  $('#tela-painel').hidden = true
  $('#tela-entrar').hidden = false
  const e = $('#entrar-erro'); e.hidden = !msg; e.textContent = msg || ''
  $('#form-entrar [name=usuario]').focus()
}

function mostrarPainel (eu) {
  $('#tela-entrar').hidden = true
  $('#tela-painel').hidden = false
  $('#conta-nome').textContent = eu.usuario
  $('#conta-inicial').textContent = eu.usuario.slice(0, 1).toUpperCase()
  $('#aviso-senha').hidden = !eu.senhaPadrao
  carregar()
}

$('#form-entrar').addEventListener('submit', async (e) => {
  e.preventDefault()
  const f = e.target, bt = f.querySelector('[type=submit]')
  bt.disabled = true; bt.textContent = 'Entrando…'
  try {
    const eu = await api('login', { method: 'POST', body: { usuario: f.usuario.value, senha: f.senha.value } })
    f.senha.value = ''
    mostrarPainel(eu)
  } catch (err) {
    const x = $('#entrar-erro'); x.hidden = false; x.textContent = err.message
  } finally { bt.disabled = false; bt.textContent = 'Entrar' }
})
document.querySelectorAll('.ver-senha').forEach(b => b.addEventListener('click', () => {
  const i = b.previousElementSibling, ver = i.type === 'password'
  i.type = ver ? 'text' : 'password'; b.textContent = ver ? 'ocultar' : 'mostrar'
  b.setAttribute('aria-label', ver ? 'Ocultar senha' : 'Mostrar senha')
}))

// menu da conta
const btConta = $('#bt-conta'), menuConta = $('#menu-conta')
btConta.addEventListener('click', () => { const a = menuConta.hidden; menuConta.hidden = !a; btConta.setAttribute('aria-expanded', String(a)) })
document.addEventListener('click', (e) => { if (!menuConta.hidden && !e.target.closest('.p-conta')) { menuConta.hidden = true; btConta.setAttribute('aria-expanded', 'false') } })
document.addEventListener('click', async (e) => {
  const a = e.target.closest('[data-acao]'); if (!a) return
  menuConta.hidden = true
  if (a.dataset.acao === 'senha') abrirSenha()
  if (a.dataset.acao === 'editores') abrirEditores()
  if (a.dataset.acao === 'sair') {
    if (sujo() && !(await confirmar('Sair sem publicar?', 'As alterações ficam guardadas neste navegador e voltam quando você entrar de novo.', 'Sair'))) return
    await api('sair', { method: 'POST' }).catch(() => {})
    mostrarEntrar()
  }
})
document.querySelectorAll('[data-fechar]').forEach(b => b.addEventListener('click', () => b.closest('dialog').close()))

function msgJanela (form, tipo, txt) {
  form.querySelector('.erro').hidden = tipo !== 'erro'
  form.querySelector('.ok').hidden = tipo !== 'ok'
  if (tipo) form.querySelector('.' + tipo).textContent = txt
}

function abrirSenha () {
  const f = $('#form-senha'); f.reset(); msgJanela(f)
  $('#jan-senha').showModal()
}
$('#form-senha').addEventListener('submit', async (e) => {
  e.preventDefault()
  const f = e.target
  if (f.nova.value !== f.nova2.value) return msgJanela(f, 'erro', 'As duas senhas novas não são iguais.')
  try {
    await api('senha', { method: 'POST', body: { atual: f.atual.value, nova: f.nova.value } })
    msgJanela(f, 'ok', 'Senha alterada.')
    $('#aviso-senha').hidden = true
    setTimeout(() => $('#jan-senha').close(), 1200)
  } catch (err) { msgJanela(f, 'erro', err.message) }
})

async function abrirEditores () {
  const f = $('#form-editor'); f.reset(); msgJanela(f)
  $('#jan-editores').showModal()
  await listarEditores()
}
async function listarEditores () {
  const ul = $('#lista-editores')
  ul.replaceChildren(h('li', {}, 'Carregando…'))
  try {
    const { usuarios } = await api('usuarios')
    ul.replaceChildren(...usuarios.map(u => h('li', {},
      h('span', { class: 'avatar' }, u.usuario.slice(0, 1).toUpperCase()),
      h('span', { class: 'quem' }, h('b', {}, u.usuario + (u.voce ? ' (você)' : '')),
        h('small', {}, u.criado ? 'desde ' + new Date(u.criado).toLocaleDateString('pt-BR') + (u.por ? ' · adicionado por ' + u.por : '') : '')),
      u.voce ? null : icBt('lixo', 'Remover ' + u.usuario, async () => {
        if (!(await confirmar('Remover ' + u.usuario + '?', 'Essa pessoa não vai mais conseguir entrar no painel.'))) return
        try { await api('usuarios?usuario=' + encodeURIComponent(u.usuario), { method: 'DELETE' }); listarEditores() } catch (err) { avisar(err.message, true) }
      }))))
  } catch (err) { ul.replaceChildren(h('li', {}, err.message)) }
}
$('#form-editor').addEventListener('submit', async (e) => {
  e.preventDefault()
  const f = e.target
  try {
    await api('usuarios', { method: 'POST', body: { usuario: f.usuario.value, senha: f.senha.value } })
    msgJanela(f, 'ok', `Pronto! ${f.usuario.value.trim().toLowerCase()} já pode entrar no painel.`)
    f.reset(); listarEditores()
  } catch (err) { msgJanela(f, 'erro', err.message) }
})

// ── Botões da barra ────────────────────────────────────────────────
$('#bt-previa').addEventListener('click', () => abrirPrevia(false))
$('#bt-salvar').addEventListener('click', () => abrirPrevia(true))
$('#previa-voltar').addEventListener('click', fecharPrevia)
$('#previa-publicar').addEventListener('click', publicar)
document.querySelectorAll('.previa-tam button').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('.previa-tam button').forEach(x => x.setAttribute('aria-pressed', String(x === b)))
  $('#previa').classList.toggle('cel', b.dataset.tam === 'cel')
}))
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('#previa').hidden) fecharPrevia() })
$('#bt-descartar').addEventListener('click', async () => {
  if (!(await confirmar('Descartar as alterações?', 'Tudo volta a ser como está publicado no site.', 'Descartar'))) return
  estado = JSON.parse(publicado); mudou(); atualizarEstrutura()
  window.aplicarTema(estado.conteudo); nomeEstagioTopo()
  if (!secao(atual) && !ehConfig(atual)) location.hash = 'inicio'; else desenharEditor()
})
window.addEventListener('hashchange', () => estado && abrir(location.hash.slice(1)))
window.addEventListener('beforeunload', (e) => { if (sujo()) { e.preventDefault(); e.returnValue = '' } })

// ── Início ─────────────────────────────────────────────────────────
;(async () => {
  try { mostrarPainel(await api('eu')) } catch { mostrarEntrar() }
})()
