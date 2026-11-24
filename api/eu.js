// GET /api/eu  → quem está logado (o painel usa para decidir se mostra o login)
import { responder, usuarioLogado, exigirBanco, garantirAdmin } from './_lib.js'

export default async function handler (req, res) {
  if (!exigirBanco(res)) return
  await garantirAdmin()
  const u = await usuarioLogado(req)
  if (!u) return responder(res, 401, { erro: 'Não logado.' })
  responder(res, 200, { usuario: u.usuario, senhaPadrao: !!u.padrao })
}
