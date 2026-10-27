// ═══════════════════════════════════════════════════════════════════
//  Área administrativa: entrar, editar, salvar rascunho e publicar.
//
//  Quem pode gravar é decidido pelo banco, não por este arquivo. Mesmo
//  que alguém abra o editor na marra pelo navegador, o Supabase recusa
//  a gravação se o e-mail não estiver na tabela "administradores".
// ═══════════════════════════════════════════════════════════════════

const Admin = {
  secaoAberta: null,
  rascunho: null,       // cópia em edição da seção aberta
  sujo: false,          // há alterações não salvas?
  enviando: 0,          // uploads em andamento
}

const LIMITE_ARQUIVO = 50 * 1024 * 1024 // 50 MB — igual ao limite do bucket

// ── Faixa superior ─────────────────────────────────────────────────
Admin.barra = function () {
  const p = document.getElementById('painel')
  if (!App.sessao) { p.classList.add('oculto'); return }
  const email = App.sessao.user.email
  p.classList.remove('oculto')
  p.innerHTML = `<div class="contem">
    <span>Conectada como <b>${esc(email)}</b></span>
    ${App.previa ? '<span style="color:#F0C475">· vendo o rascunho</span>' : ''}
    <span class="dir">
      <button class="bt leve" id="bt-previa">${App.previa ? 'Ver publicado' : 'Ver rascunho'}</button>
      <a class="bt leve" href="#/admin">Editar conteúdo</a>
      <button class="bt leve" id="bt-sair">Sair</button>
    </span></div>`
  p.querySelector('#bt-sair').onclick = async () => {
    await App.sb.auth.signOut(); App.sessao = null; App.previa = false
    Admin.barra(); await window.recarregar()
  }
  p.querySelector('#bt-previa').onclick = async () => {
    App.previa = !App.previa; Admin.barra(); await window.recarregar()
  }
}

Admin.iniciar = function () {
  Admin.barra()
  window.addEventListener('beforeunload', (e) => {
    if (Admin.sujo) { e.preventDefault(); e.returnValue = '' }
  })
}

// ── Tela de entrada ────────────────────────────────────────────────
Admin.telaEntrar = function (alvo, erro) {
  alvo.innerHTML = `<div class="contem"><div class="pagina entrar">
    <div class="cartao">
      <div style="text-align:center;margin-bottom:18px;color:var(--medio-f)">
        <svg viewBox="0 0 128 96" width="78" height="58" aria-hidden="true"><use href="#tamandua"/></svg>
      </div>
      <h2 class="titulo" style="font-size:27px;text-align:center">Área administrativa</h2>
      <p style="text-align:center;color:var(--tinta-2);font-size:15px;margin:0 0 22px">
        Acesso restrito às pessoas responsáveis pelo portfólio.</p>
      ${erro ? `<div class="erro">${esc(erro)}</div>` : ''}
      <form id="f-entrar">
        <label class="f"><b>E-mail</b>
          <input type="email" name="email" required autocomplete="username"></label>
        <label class="f"><b>Senha</b>
          <input type="password" name="senha" required autocomplete="current-password"></label>
        <button class="bt" style="width:100%" type="submit">Entrar</button>
      </form>
    </div>
  </div></div>`

  alvo.querySelector('#f-entrar').onsubmit = async (ev) => {
    ev.preventDefault()
    const bt = ev.target.querySelector('button')
    bt.disabled = true; bt.textContent = 'Entrando...'
    const { data, error } = await App.sb.auth.signInWithPassword({
      email: ev.target.email.value.trim(),
      password: ev.target.senha.value,
    })
    if (error) { Admin.telaEntrar(alvo, 'E-mail ou senha incorretos.'); return }
    App.sessao = data.session
    // Confere se o e-mail está autorizado a editar.
    const { data: ok } = await App.sb.rpc('eh_admin')
    if (!ok) {
      await App.sb.auth.signOut(); App.sessao = null
      Admin.telaEntrar(alvo, 'Esta conta não está autorizada a editar o portfólio.')
      return
    }
    Admin.barra(); await window.recarregar()
  }
}

// ── Painel: escolher o que editar ──────────────────────────────────
Admin.render = async function (alvo) {
  if (!App.sb) {
    alvo.innerHTML = `<div class="contem"><div class="pagina"><div class="aviso">
      <b>Falta conectar o banco de dados</b>
      Preencha <code>js/config.js</code> com o endereço e a chave do Supabase.
      O passo a passo está no <code>README.md</code>.</div></div></div>`
    return
  }
  if (!App.sessao) return Admin.telaEntrar(alvo)
  if (Admin.secaoAberta) return Admin.editor(alvo)

  // Estado de cada seção: nunca publicada / alterações não publicadas / no ar
  const { data } = await App.sb.from('secoes').select('id, publicado_em, atualizado_em')
  const estado = {}
  ;(data || []).forEach(r => { estado[r.id] = r })

  const linha = (s) => {
    const e = estado[s.id]
    let marca = '<span style="color:var(--tinta-2)">não iniciada</span>'
    if (e && e.publicado_em && new Date(e.atualizado_em) <= new Date(e.publicado_em))
      marca = '<span style="color:var(--medio-f);font-weight:600">publicada</span>'
    else if (e && e.publicado_em)
      marca = '<span style="color:#B07A1E;font-weight:600">alterações não publicadas</span>'
    else if (e)
      marca = '<span style="color:#B07A1E;font-weight:600">rascunho</span>'
    return `<a class="atalho" href="#/admin" data-abrir="${s.id}">
      <strong>${esc(s.titulo)}</strong>
      <span class="res">${marca}</span></a>`
  }

  alvo.innerHTML = `<div class="contem"><div class="pagina">
    <header>
      <h2 class="titulo">Área administrativa</h2>
      <p style="color:var(--tinta-2);margin:0">Escolha a página que deseja editar.
        Nada fica visível para o público antes de você clicar em <b>Publicar</b>.</p>
    </header>
    <div class="grade">${window.SECOES.map(linha).join('')}</div>
  </div></div>`

  alvo.querySelectorAll('[data-abrir]').forEach(a => {
    a.onclick = (ev) => { ev.preventDefault(); Admin.abrir(a.dataset.abrir, alvo) }
  })
}

Admin.abrir = async function (id, alvo) {
  const { data } = await App.sb.from('secoes').select('rascunho').eq('id', id).maybeSingle()
  Admin.secaoAberta = id
  Admin.rascunho = JSON.parse(JSON.stringify((data && data.rascunho) || {}))
  Admin.sujo = false
  Admin.editor(alvo)
}

Admin.fechar = function (alvo) {
  if (Admin.sujo && !confirm('Há alterações não salvas. Sair mesmo assim?')) return
  Admin.secaoAberta = null; Admin.rascunho = null; Admin.sujo = false
  Admin.render(alvo)
}

// ── Editor ─────────────────────────────────────────────────────────
Admin.editor = function (alvo) {
  const s = window.secao(Admin.secaoAberta)
  const d = Admin.rascunho

  const campoTexto = (chave, rotulo, linhas) => `
    <label class="f"><b>${esc(rotulo)}</b>
      ${linhas ? `<textarea data-campo="${chave}" rows="${linhas}">${esc(d[chave] || '')}</textarea>`
                : `<input type="text" data-campo="${chave}" value="${esc(d[chave] || '')}">`}
    </label>`

  let html = ''

  if (s.campoTitulo) html += campoTexto('titulo', 'Título do trabalho')
  if (s.campos) html += `<div style="display:grid;gap:0 16px;grid-template-columns:repeat(auto-fit,minmax(230px,1fr))">`
    + s.campos.map(([k, r]) => campoTexto(k, r)).join('') + `</div>`
  if (s.filhos) html += campoTexto('resumo', 'Resumo curto (aparece no cartão)', 2)
  if (s.pai) html += campoTexto('resumo', 'Resumo curto (aparece no cartão desta página)', 2)
  if (s.partes) html += `<h3 class="sub">Partes do plano</h3>`
    + s.partes.map(([k, r]) => campoTexto(k, r, 5)).join('')

  if (s.blocos) html += `
    <h3 class="sub">Conteúdo da página</h3>
    <p style="color:var(--tinta-2);font-size:14.5px;margin:-4px 0 14px">
      Monte o texto em blocos. A ordem aqui é a ordem na página — as imagens e
      os vídeos podem ficar no meio do texto.</p>
    <div id="blocos">${(d.blocos || []).map((b, i) => Admin.blocoHtml(b, i)).join('')}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">
      ${Object.entries(window.TIPOS_BLOCO).map(([t, r]) =>
        `<button class="bt leve" data-novo="${t}" type="button">+ ${esc(r)}</button>`).join('')}
    </div>`

  if (s.documentos) html += Admin.documentosHtml(d.documentos || [])
  if (s.referencias) html += Admin.referenciasHtml(d.referencias || [])

  alvo.innerHTML = `<div class="contem"><div class="pagina">
    <header>
      <p class="trilho"><a href="#/admin" id="voltar">Área administrativa</a> <span>›</span>
        <span>${esc(s.titulo)}</span></p>
      <h2 class="titulo">${esc(s.titulo)}</h2>
    </header>
    <div id="recado"></div>
    <div class="cartao">${html}</div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;position:sticky;bottom:0;
                background:var(--pastel);padding:14px 0;border-top:1px solid var(--borda)">
      <button class="bt leve" id="bt-rascunho" type="button">Salvar rascunho</button>
      <button class="bt" id="bt-publicar" type="button">Publicar</button>
      <a class="bt leve" href="#/${s.id}" style="margin-left:auto">Ver a página</a>
    </div>
  </div></div>`

  // ── ligações ──
  alvo.querySelector('#voltar').onclick = (e) => { e.preventDefault(); Admin.fechar(alvo) }

  alvo.querySelectorAll('[data-campo]').forEach(i => {
    i.oninput = () => { d[i.dataset.campo] = i.value; Admin.sujo = true }
  })

  alvo.querySelectorAll('[data-novo]').forEach(b => {
    b.onclick = () => {
      d.blocos = d.blocos || []
      d.blocos.push({ tipo: b.dataset.novo, texto: '', itens: [] })
      Admin.sujo = true; Admin.editor(alvo)
    }
  })

  Admin.ligarBlocos(alvo)
  Admin.ligarListas(alvo)

  alvo.querySelector('#bt-rascunho').onclick = () => Admin.salvar(alvo, false)
  alvo.querySelector('#bt-publicar').onclick = () => Admin.salvar(alvo, true)
}

// ── Blocos ─────────────────────────────────────────────────────────
Admin.blocoHtml = function (b, i) {
  const opcoes = Object.entries(window.TIPOS_BLOCO).map(([t, r]) =>
    `<option value="${t}" ${b.tipo === t ? 'selected' : ''}>${esc(r)}</option>`).join('')

  let miolo = ''
  if (b.tipo === 'subtitulo')
    miolo = `<input type="text" data-b="${i}" data-k="texto" value="${esc(b.texto || '')}"
             placeholder="Texto do subtítulo">`
  else if (b.tipo === 'texto' || b.tipo === 'citacao')
    miolo = `<textarea data-b="${i}" data-k="texto" rows="${b.tipo === 'citacao' ? 3 : 7}"
             placeholder="${b.tipo === 'citacao' ? 'Texto da citação' : 'Deixe uma linha em branco entre os parágrafos.'}">${esc(b.texto || '')}</textarea>`
  else if (b.tipo === 'imagem' || b.tipo === 'video')
    miolo = Admin.arquivoHtml(b, i)
  else if (b.tipo === 'galeria')
    miolo = `
      <div class="galeria" style="margin:0 0 10px">
        ${(b.itens || []).map((it, j) => `
          <div style="position:relative">
            <img src="${esc(it.url)}" alt="" style="aspect-ratio:4/3;object-fit:cover;
                 border-radius:9px;border:1px solid var(--borda)">
            <button class="mini x" type="button" data-remitem="${i}:${j}"
              style="position:absolute;top:5px;right:5px" aria-label="Remover imagem">×</button>
          </div>`).join('')}
      </div>
      <input type="file" accept="image/*" multiple data-galeria="${i}">
      <label class="f" style="margin-top:10px"><b>Legenda da galeria</b>
        <input type="text" data-b="${i}" data-k="legenda" value="${esc(b.legenda || '')}"></label>`

  return `<div class="bloco-ed">
    <div class="cab">
      <select data-tipo="${i}">${opcoes}</select>
      <span class="esp">
        <button class="mini" type="button" data-sobe="${i}" aria-label="Mover para cima">↑</button>
        <button class="mini" type="button" data-desce="${i}" aria-label="Mover para baixo">↓</button>
        <button class="mini x" type="button" data-apaga="${i}" aria-label="Remover bloco">×</button>
      </span>
    </div>
    ${miolo}
  </div>`
}

Admin.arquivoHtml = function (b, i) {
  const eVideo = b.tipo === 'video'
  const previa = b.url
    ? (eVideo ? `<video src="${esc(b.url)}" controls preload="none"
                  style="max-height:220px;border-radius:9px;border:1px solid var(--borda);margin-bottom:10px"></video>`
              : `<img src="${esc(b.url)}" alt="" style="max-height:220px;width:auto;
                  border-radius:9px;border:1px solid var(--borda);margin-bottom:10px">`)
    : ''
  return `${previa}
    <input type="file" accept="${eVideo ? 'video/*' : 'image/*'}" data-arq="${i}">
    <div data-progresso="${i}" style="font-size:13.5px;color:var(--medio-f);margin-top:6px"></div>
    <label class="f" style="margin-top:10px"><b>Legenda</b>
      <input type="text" data-b="${i}" data-k="legenda" value="${esc(b.legenda || '')}"></label>
    ${eVideo ? '' : `<label class="f"><b>Descrição para leitor de tela</b>
      <input type="text" data-b="${i}" data-k="alt" value="${esc(b.alt || '')}"
        placeholder="O que a imagem mostra"></label>`}`
}

Admin.ligarBlocos = function (alvo) {
  const d = Admin.rascunho
  const mexeu = () => { Admin.sujo = true; Admin.editor(alvo) }

  alvo.querySelectorAll('[data-b]').forEach(i => {
    i.oninput = () => { d.blocos[+i.dataset.b][i.dataset.k] = i.value; Admin.sujo = true }
  })
  alvo.querySelectorAll('[data-tipo]').forEach(s => {
    s.onchange = () => { d.blocos[+s.dataset.tipo].tipo = s.value; mexeu() }
  })
  alvo.querySelectorAll('[data-apaga]').forEach(b => {
    b.onclick = () => {
      if (!confirm('Remover este bloco?')) return
      d.blocos.splice(+b.dataset.apaga, 1); mexeu()
    }
  })
  alvo.querySelectorAll('[data-sobe]').forEach(b => {
    b.onclick = () => {
      const i = +b.dataset.sobe; if (i === 0) return
      ;[d.blocos[i - 1], d.blocos[i]] = [d.blocos[i], d.blocos[i - 1]]; mexeu()
    }
  })
  alvo.querySelectorAll('[data-desce]').forEach(b => {
    b.onclick = () => {
      const i = +b.dataset.desce; if (i >= d.blocos.length - 1) return
      ;[d.blocos[i + 1], d.blocos[i]] = [d.blocos[i], d.blocos[i + 1]]; mexeu()
    }
  })
  alvo.querySelectorAll('[data-remitem]').forEach(b => {
    b.onclick = () => {
      const [i, j] = b.dataset.remitem.split(':').map(Number)
      d.blocos[i].itens.splice(j, 1); mexeu()
    }
  })

  // upload de um arquivo só (imagem ou vídeo)
  alvo.querySelectorAll('[data-arq]').forEach(inp => {
    inp.onchange = async () => {
      const i = +inp.dataset.arq
      const f = inp.files[0]; if (!f) return
      const aviso = alvo.querySelector(`[data-progresso="${i}"]`)
      const url = await Admin.enviar(f, aviso)
      if (url) { d.blocos[i].url = url; mexeu() }
    }
  })

  // upload de várias imagens para a galeria
  alvo.querySelectorAll('[data-galeria]').forEach(inp => {
    inp.onchange = async () => {
      const i = +inp.dataset.galeria
      d.blocos[i].itens = d.blocos[i].itens || []
      for (const f of inp.files) {
        const url = await Admin.enviar(f, inp.parentElement)
        if (url) d.blocos[i].itens.push({ url, legenda: '', alt: '' })
      }
      mexeu()
    }
  })
}

// ── Envio de arquivos ──────────────────────────────────────────────
Admin.enviar = async function (arquivo, aviso) {
  const diz = (t, erro) => { if (aviso) aviso.innerHTML =
    `<span style="color:${erro ? '#9C3636' : 'var(--medio-f)'}">${esc(t)}</span>` }

  if (arquivo.size > LIMITE_ARQUIVO) {
    diz(`Arquivo de ${(arquivo.size / 1048576).toFixed(0)} MB. O limite por arquivo é de 50 MB — `
      + `comprima o vídeo ou divida-o em partes antes de enviar.`, true)
    return null
  }

  diz(`Enviando ${arquivo.name}...`)
  const limpo = arquivo.name.normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase()
  const caminho = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${limpo}`

  const { error } = await App.sb.storage.from('midia')
    .upload(caminho, arquivo, { cacheControl: '31536000', upsert: false })

  if (error) {
    diz(error.message.includes('exceeded')
      ? 'O armazenamento do plano gratuito (1 GB) acabou. Apague arquivos antigos ou amplie o plano no Supabase.'
      : 'Não foi possível enviar: ' + error.message, true)
    return null
  }
  const { data } = App.sb.storage.from('midia').getPublicUrl(caminho)
  diz('Enviado.')
  return data.publicUrl
}

// ── Documentos e referências ───────────────────────────────────────
Admin.documentosHtml = function (lista) {
  return `<h3 class="sub">Documentos do estágio</h3>
    <p style="color:var(--tinta-2);font-size:14.5px;margin:-4px 0 14px">
      Ficha de frequência, ficha de avaliação e outros documentos.
      Eles só aparecem para o público depois de publicados.</p>
    <div id="docs">${lista.map((doc, i) => `
      <div class="bloco-ed">
        <div class="cab">
          <b style="color:var(--escuro)">Documento ${i + 1}</b>
          <span class="esp">
            <button class="mini x" type="button" data-apagadoc="${i}" aria-label="Remover">×</button>
          </span>
        </div>
        <label class="f"><b>Nome</b>
          <input type="text" data-doc="${i}" data-k="nome" value="${esc(doc.nome || '')}"
            placeholder="Ex.: Ficha de frequência assinada"></label>
        <label class="f"><b>Descrição (opcional)</b>
          <input type="text" data-doc="${i}" data-k="descricao" value="${esc(doc.descricao || '')}"></label>
        ${doc.url ? `<p style="font-size:13.5px;margin:0 0 8px">
            <a href="${esc(doc.url)}" target="_blank" rel="noopener">arquivo atual</a></p>` : ''}
        <input type="file" accept=".pdf,image/*" data-arqdoc="${i}">
        <div data-progdoc="${i}" style="font-size:13.5px;margin-top:6px"></div>
      </div>`).join('')}</div>
    <button class="bt leve" type="button" id="novo-doc">+ Documento</button>`
}

Admin.referenciasHtml = function (lista) {
  return `<h3 class="sub">Referências</h3>
    <p style="color:var(--tinta-2);font-size:14.5px;margin:-4px 0 14px">
      Digite cada referência já no formato da norma adotada pela universidade.
      A ordenação alfabética é feita pelo site, automaticamente.</p>
    <div id="refs">${lista.map((r, i) => `
      <div class="bloco-ed">
        <div class="cab">
          <b style="color:var(--escuro)">Referência ${i + 1}</b>
          <span class="esp">
            <button class="mini x" type="button" data-apagaref="${i}" aria-label="Remover">×</button>
          </span>
        </div>
        <textarea data-ref="${i}" data-k="texto" rows="3"
          placeholder="SOBRENOME, Nome. Título da obra. Cidade: Editora, ano.">${esc(r.texto || '')}</textarea>
        <label class="f" style="margin-top:10px"><b>Link (opcional)</b>
          <input type="text" data-ref="${i}" data-k="link" value="${esc(r.link || '')}"></label>
      </div>`).join('')}</div>
    <button class="bt leve" type="button" id="nova-ref">+ Referência</button>`
}

Admin.ligarListas = function (alvo) {
  const d = Admin.rascunho
  const mexeu = () => { Admin.sujo = true; Admin.editor(alvo) }

  const novoDoc = alvo.querySelector('#novo-doc')
  if (novoDoc) novoDoc.onclick = () => {
    d.documentos = d.documentos || []; d.documentos.push({ nome: '', descricao: '', url: '' }); mexeu()
  }
  const novaRef = alvo.querySelector('#nova-ref')
  if (novaRef) novaRef.onclick = () => {
    d.referencias = d.referencias || []; d.referencias.push({ texto: '', link: '' }); mexeu()
  }

  alvo.querySelectorAll('[data-doc]').forEach(i => {
    i.oninput = () => { d.documentos[+i.dataset.doc][i.dataset.k] = i.value; Admin.sujo = true }
  })
  alvo.querySelectorAll('[data-ref]').forEach(i => {
    i.oninput = () => { d.referencias[+i.dataset.ref][i.dataset.k] = i.value; Admin.sujo = true }
  })
  alvo.querySelectorAll('[data-apagadoc]').forEach(b => {
    b.onclick = () => { if (confirm('Remover este documento?')) {
      d.documentos.splice(+b.dataset.apagadoc, 1); mexeu() } }
  })
  alvo.querySelectorAll('[data-apagaref]').forEach(b => {
    b.onclick = () => { if (confirm('Remover esta referência?')) {
      d.referencias.splice(+b.dataset.apagaref, 1); mexeu() } }
  })
  alvo.querySelectorAll('[data-arqdoc]').forEach(inp => {
    inp.onchange = async () => {
      const i = +inp.dataset.arqdoc
      const f = inp.files[0]; if (!f) return
      const url = await Admin.enviar(f, alvo.querySelector(`[data-progdoc="${i}"]`))
      if (url) { d.documentos[i].url = url; mexeu() }
    }
  })
}

// ── Gravação ───────────────────────────────────────────────────────
Admin.salvar = async function (alvo, publicar) {
  const recado = alvo.querySelector('#recado')
  const linha = { id: Admin.secaoAberta, rascunho: Admin.rascunho, atualizado_em: new Date().toISOString() }
  if (publicar) {
    linha.publicado = Admin.rascunho
    linha.publicado_em = new Date().toISOString()
  }

  const { error } = await App.sb.from('secoes').upsert(linha, { onConflict: 'id' })

  if (error) {
    recado.innerHTML = `<div class="erro">Não foi possível salvar: ${esc(error.message)}
      ${error.message.includes('policy')
        ? '<br>Verifique se o seu e-mail está na tabela <b>administradores</b>.' : ''}</div>`
    return
  }
  Admin.sujo = false
  recado.innerHTML = `<div class="ok">${publicar
    ? 'Publicado. O conteúdo já está visível para quem abrir o site.'
    : 'Rascunho salvo. Ele ainda não aparece para o público.'}</div>`
  recado.scrollIntoView({ block: 'nearest' })
  // recarrega o conteúdo público em segundo plano, para a prévia ficar correta
  if (publicar) {
    const { data } = await App.sb.from('secoes_publicas').select('id, conteudo')
    const mapa = {}; (data || []).forEach(r => { mapa[r.id] = r.conteudo || {} })
    if (!App.previa) App.conteudo = mapa
  }
}

window.Admin = Admin
