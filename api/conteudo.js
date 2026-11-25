// GET /api/conteudo?estagio=N  → conteúdo publicado do estágio N (1, 2 ou 3)
//                                 + a lista de estágios (para o seletor do site)
// PUT /api/conteudo?estagio=N  { conteudo, planos }  → publica (só editores)
// O estágio 1 continua na chave antiga; os outros ganham chave própria.
import { banco, CHAVE, responder, exigirLogin, exigirBanco, semBanco, lerCorpo } from './_lib.js'

const LIMITE = 900 * 1024 // o texto inteiro do site; fotos e vídeos vão para o Blob
const ESTAGIOS = [1, 2, 3]
const chaveDe = (n) => n === 1 ? CHAVE.conteudo : CHAVE.conteudo + ':' + n
const CHAVE_LISTA = 'portfolio:estagios'

function numero (req) {
  const n = Number((req.query && req.query.estagio) || new URL(req.url, 'http://x').searchParams.get('estagio') || 1)
  return ESTAGIOS.includes(n) ? n : 1
}

// { "1": { nome, ativo }, ... } — o estágio 1 sempre existe
async function lista () {
  const l = (await banco.get(CHAVE_LISTA)) || {}
  if (!l[1]) l[1] = { nome: 'Estágio 1', ativo: true }
  return ESTAGIOS.filter(n => l[n]).map(n => ({ n, nome: l[n].nome || 'Estágio ' + n, ativo: l[n].ativo !== false }))
}

export default async function handler (req, res) {
  const n = numero(req)

  if (req.method === 'GET') {
    if (semBanco && process.env.VERCEL) return responder(res, 200, { vazio: true })
    const [d, estagios] = await Promise.all([banco.get(chaveDe(n)), lista()])
    res.setHeader('CDN-Cache-Control', 'no-store')
    return responder(res, 200, { ...(d || { vazio: true }), estagio: n, estagios })
  }

  if (req.method === 'PUT') {
    if (!exigirBanco(res)) return
    const u = await exigirLogin(req, res); if (!u) return
    const { conteudo, planos } = await lerCorpo(req)
    if (!conteudo || typeof conteudo !== 'object' || !planos || typeof planos !== 'object') {
      return responder(res, 400, { erro: 'Conteúdo inválido.' })
    }
    const doc = { conteudo, planos, atualizado: new Date().toISOString(), por: u.usuario }
    if (JSON.stringify(doc).length > LIMITE) {
      return responder(res, 413, { erro: 'O texto ficou grande demais para salvar de uma vez.' })
    }
    await banco.set(chaveDe(n), doc)
    // nome do estágio e se aparece no seletor do site
    const site = conteudo._site || {}
    const l = (await banco.get(CHAVE_LISTA)) || {}
    l[n] = { nome: (site.nomeEstagio || '').trim() || 'Estágio ' + n, ativo: n === 1 || site.ativo !== false }
    await banco.set(CHAVE_LISTA, l)
    return responder(res, 200, { ok: true, atualizado: doc.atualizado, por: doc.por })
  }

  responder(res, 405, { erro: 'Método não permitido.' })
}
