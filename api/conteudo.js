// GET /api/conteudo  → conteúdo publicado (público; o site lê daqui)
// PUT /api/conteudo  { conteudo, planos }  → publica (só editores)
import { banco, CHAVE, responder, exigirLogin, exigirBanco, semBanco, lerCorpo } from './_lib.js'

const LIMITE = 900 * 1024 // o texto inteiro do site; fotos e vídeos vão para o Blob

export default async function handler (req, res) {
  if (req.method === 'GET') {
    if (semBanco && process.env.VERCEL) return responder(res, 200, { vazio: true })
    const d = await banco.get(CHAVE.conteudo)
    res.setHeader('CDN-Cache-Control', 'no-store')
    return responder(res, 200, d || { vazio: true })
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
    await banco.set(CHAVE.conteudo, doc)
    return responder(res, 200, { ok: true, atualizado: doc.atualizado, por: doc.por })
  }

  responder(res, 405, { erro: 'Método não permitido.' })
}
