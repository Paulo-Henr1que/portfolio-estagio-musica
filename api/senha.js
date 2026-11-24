// POST /api/senha  { atual, nova }  → troca a própria senha
import { banco, CHAVE, responder, exigirLogin, conferirSenha, gerarHash, lerCorpo, SENHA_MIN } from './_lib.js'

export default async function handler (req, res) {
  if (req.method !== 'POST') return responder(res, 405, { erro: 'Método não permitido.' })
  const u = await exigirLogin(req, res); if (!u) return
  const { atual, nova } = await lerCorpo(req)
  if (!conferirSenha(atual || '', u)) return responder(res, 400, { erro: 'A senha atual não confere.' })
  if (String(nova || '').length < SENHA_MIN) {
    return responder(res, 400, { erro: `A nova senha precisa ter pelo menos ${SENHA_MIN} caracteres.` })
  }
  const { usuario, sal, hash, padrao, ...resto } = u
  await banco.hset(CHAVE.usuarios, { [u.usuario]: { ...resto, ...gerarHash(nova) } })
  responder(res, 200, { ok: true })
}
