// POST /api/login  { usuario, senha }  → abre a sessão do painel
import { banco, CHAVE, responder, exigirBanco, conferirSenha, garantirAdmin,
         criarSessao, normalizarUsuario, lerCorpo } from './_lib.js'

export default async function handler (req, res) {
  if (req.method !== 'POST') return responder(res, 405, { erro: 'Método não permitido.' })
  if (!exigirBanco(res)) return
  await garantirAdmin()
  const { usuario, senha } = await lerCorpo(req)
  const nome = normalizarUsuario(usuario)
  const u = nome ? await banco.hget(CHAVE.usuarios, nome) : null
  if (!u || !conferirSenha(senha || '', u)) {
    await new Promise(r => setTimeout(r, 600)) // atrasa tentativas repetidas
    return responder(res, 401, { erro: 'Usuário ou senha incorretos.' })
  }
  await criarSessao(res, nome)
  responder(res, 200, { usuario: nome, senhaPadrao: !!u.padrao })
}
