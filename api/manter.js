// GET /api/manter — chamado uma vez por dia pelo Vercel (vercel.json → crons).
// Faz uma leitura no banco para ele nunca ficar "parado" por falta de uso,
// mesmo em semanas sem visitas no site.
import { banco, CHAVE, responder, semBanco } from './_lib.js'

export default async function handler (req, res) {
  if (semBanco) return responder(res, 200, { ok: true, banco: false })
  try {
    const d = await banco.get(CHAVE.conteudo)
    return responder(res, 200, { ok: true, banco: true, conteudo: !!d, quando: new Date().toISOString() })
  } catch (e) {
    return responder(res, 500, { ok: false, erro: e.message })
  }
}
