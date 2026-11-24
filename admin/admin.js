// ═══════════════════════════════════════════════════════════════════
//  Painel de edição do portfólio.
//  Edita o mesmo conteúdo que o site lê (window.CONTEUDO e
//  window.PLANOS), mostra a pré-visualização com o próprio site e
//  publica pelo /api/conteudo. Arquivos vão para o Vercel Blob.
// ═══════════════════════════════════════════════════════════════════
import { upload } from './blob-client.js'

const $ = (s, r = document) => r.querySelector(s)
const LOCAL = ['localhost', '127.0.0.1'].includes(location.hostname)
const SECOES = window.SECOES
const secao = (id) => SECOES.find(s => s.id === id)

// ── Estado ─────────────────────────────────────────────────────────
let estado = null          // { conteudo, planos } em edição
let publicado = ''         // cópia (JSON) do que está no ar
let atual = 'inicio'       // página aberta no editor
const RASCUNHO = 'portfolio-rascunho'

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
  const nome = `portfolio/${atual}/${limparNome(final.name)}`
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
function montarLista () {
  const ul = $('#lista-secoes'); ul.innerHTML = ''
  const sel = $('#sel-secao'); sel.innerHTML = ''
  for (const s of SECOES) {
    if (s.pai) continue
    const nome = s.menuTitulo || s.titulo
    ul.append(h('li', { class: s.filhos ? 'grupo' : '' }, h('a', { href: '#' + s.id, 'data-id': s.id }, nome)))
    sel.append(h('option', { value: s.id }, nome))
    for (const f of (s.filhos || [])) {
      ul.append(h('li', { class: 'filho' }, h('a', { href: '#' + f.id, 'data-id': f.id }, rotuloFilho(f))))
      sel.append(h('option', { value: f.id }, '   ' + rotuloFilho(f)))
    }
  }
  sel.onchange = () => { location.hash = sel.value }
}
const rotuloFilho = (f) => f.titulo

function abrir (id) {
  if (!secao(id)) id = 'inicio'
  atual = id
  document.querySelectorAll('#lista-secoes a').forEach(a =>
    a.dataset.id === id ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'))
  $('#sel-secao').value = id
  desenharEditor()
}

// ── Editor de uma página ───────────────────────────────────────────
function desenharEditor () {
  const s = secao(atual)
  const ed = $('#editor')
  const pai = s.pai ? secao(s.pai) : null
  const partes = []

  partes.push(h('div', { class: 'ed-cab' },
    h('div', {},
      pai ? h('p', { class: 'trilho' }, pai.titulo) : null,
      h('h1', {}, s.titulo)),
    h('a', { href: '../#/' + s.id, target: '_blank', rel: 'noopener' }, 'Ver esta página no site ↗')))

  if (s.id === 'inicio') partes.push(...editorInicio(s))
  else if (s.referencias) partes.push(editorBibliografia())
  else if (estado.planos[s.id]) partes.push(editorPlano(s))
  else {
    const d = dadosDe(s.id)
    if (s.campos || s.pai) {
      const g = h('div', { class: 'grade-campos' },
        (s.campos || []).map(([k, rot]) => campo(rot, d, k)))
      if (s.pai) g.append(campo('Resumo', d, 'resumo', { classe: 'largo', dica: 'Frase curta que aparece na lista de ' + (pai.menuTitulo || pai.titulo).toLowerCase() + '.' }))
      partes.push(h('section', { class: 'ed-parte' }, h('h2', {}, 'Informações'), g))
    }
    partes.push(editorBlocos(d, {
      titulo: s.filhos ? 'Texto de abertura' : 'Conteúdo da página',
      dica: s.filhos ? 'Aparece no alto da página, antes da lista.' : s.dica ? 'O que escrever: ' + s.dica : 'Textos, fotos, vídeos e documentos, na ordem em que aparecem no site.',
    }))
  }

  ed.replaceChildren(...partes)
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
  texto: { tipo: 'texto', texto: '' }, subtitulo: { tipo: 'subtitulo', texto: '' }, citacao: { tipo: 'citacao', texto: '' },
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
      if (alvo) { alvo.scrollIntoView({ block: 'center', behavior: 'smooth' }); setTimeout(() => alvo.querySelector('input, textarea, button.bt')?.focus({ preventScroll: true }), 300) }
    }
  }
  desenhar()
  return sec
}

function corpoBloco (b) {
  switch (b.tipo) {
    case 'texto':
      return [campo('', b, 'texto', { area: true, dica: 'Deixe uma linha em branco entre um parágrafo e outro.' })]
    case 'subtitulo':
      return [campo('', b, 'texto', { ph: 'Ex.: Turma 5º A' })]
    case 'citacao':
      return [campo('', b, 'texto', { area: true, linhas: 3, ph: 'Trecho citado de um autor.' })]
    case 'imagem': return editorImagem(b)
    case 'galeria': return editorGaleria(b)
    case 'video': return editorVideo(b)
    case 'pdf': return [
      arquivoPdf(b, 'url'),
      h('div', { class: 'grade-campos' },
        campo('Legenda (opcional)', b, 'legenda'),
        campo('Link do Google Drive (opcional)', b, 'drive', { ph: 'https://drive.google.com/…' })),
    ]
    default:
      return [h('p', { class: 'dica' }, 'Tipo de bloco não editável aqui.')]
  }
}

function editorImagem (b) {
  const vista = h('div', { class: 'midia-vista' })
  const pintar = () => vista.replaceChildren(b.url ? h('img', { src: ver(b.url), alt: '' }) : 'Nenhuma foto ainda')
  pintar()
  return [h('div', { class: 'midia-linha' }, vista, h('div', { class: 'midia-campos' },
    botaoEnviar(b.url ? 'Trocar foto' : 'Enviar foto', 'image/*', (url) => { b.url = url; mudou(); pintar() }),
    campo('Legenda', b, 'legenda'),
    campo('Descrição para leitores de tela (opcional)', b, 'alt', { ph: 'O que aparece na foto' })))]
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
  for (const s of SECOES) {
    const d = (base.conteudo[s.id] = base.conteudo[s.id] || {})
    if (s.blocos) {
      d.blocos = (d.blocos || []).filter(b => b && b.tipo && !(b.tipo === 'texto' && !String(b.texto || '').trim()))
    }
    if (s.documentos) d.documentos = d.documentos || []
    if (s.referencias) d.referencias = d.referencias || []
  }
  return base
}

async function carregar () {
  $('#editor').replaceChildren(h('p', { class: 'carregando' }, 'Carregando o conteúdo…'))
  let d = {}
  try { d = await api('conteudo', { cache: 'no-store' }) } catch {}
  const base = d && !d.vazio && d.conteudo
    ? { conteudo: d.conteudo, planos: d.planos || {} }
    : { conteudo: copia(window.CONTEUDO || {}), planos: copia(window.PLANOS || {}) }
  normalizar(base)
  publicado = JSON.stringify(base)
  estado = copia(base)
  // rascunho deixado neste navegador (ex.: a aba fechou antes de publicar)
  try {
    const r = JSON.parse(localStorage.getItem(RASCUNHO) || 'null')
    if (r && r.estado && JSON.stringify(r.estado) !== publicado) {
      if (r.base === publicado) { estado = r.estado; avisar('Recuperamos as alterações que você não tinha publicado.') }
      else localStorage.removeItem(RASCUNHO)
    }
  } catch {}
  montarLista()
  abrir(location.hash.slice(1) || 'inicio')
  mudou()
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
  const enviar = () => q.contentWindow.postMessage({ tipo: 'previa', ...limparParaSalvar(estado), rota: atual }, location.origin)
  if (!previaPronta || !q.src) {
    q.src = '../index.html?previa=1#/' + atual
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
    await api('conteudo', { method: 'PUT', body: limpo })
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
  estado = JSON.parse(publicado); mudou(); desenharEditor()
})
window.addEventListener('hashchange', () => estado && abrir(location.hash.slice(1)))
window.addEventListener('beforeunload', (e) => { if (sujo()) { e.preventDefault(); e.returnValue = '' } })

// ── Início ─────────────────────────────────────────────────────────
;(async () => {
  try { mostrarPainel(await api('eu')) } catch { mostrarEntrar() }
})()
