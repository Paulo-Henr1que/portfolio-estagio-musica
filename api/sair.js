// POST /api/sair  → encerra a sessão
import { responder, encerrarSessao } from './_lib.js'

export default async function handler (req, res) {
  encerrarSessao(res)
  responder(res, 200, { ok: true })
}
