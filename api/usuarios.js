// Quem pode editar o site.
// GET    /api/usuarios                      → lista
// POST   /api/usuarios  { usuario, senha }  → adiciona um editor
// DELETE /api/usuarios?usuario=nome         → remove (não dá para remover a si mesmo)
import { banco, CHAVE, responder, exigirLogin, gerarHash, lerCorpo,
         normalizarUsuario, usuarioValido, SENHA_MIN } from './_lib.js'

export default async function handler (req, res) {
  const eu = await exigirLogin(req, res); if (!eu) return

  if (req.method === 'GET') {
    const todos = (await banco.hgetall(CHAVE.usuarios)) || {}
    const lista = Object.entries(todos)
      .map(([usuario, u]) => ({ usuario, criado: u.criado || null, por: u.por || null, voce: usuario === eu.usuario }))
      .sort((a, b) => (a.criado || 0) - (b.criado || 0))
    return responder(res, 200, { usuarios: lista })
  }

  if (req.method === 'POST') {
    const { usuario, senha } = await lerCorpo(req)
    const nome = normalizarUsuario(usuario)
    if (!usuarioValido(nome)) {
      return responder(res, 400, { erro: 'O usuário deve ter de 3 a 32 caracteres: letras sem acento, números, ponto, hífen ou sublinhado.' })
    }
    if (String(senha || '').length < SENHA_MIN) {
      return responder(res, 400, { erro: `A senha precisa ter pelo menos ${SENHA_MIN} caracteres.` })
    }
    if (await banco.hget(CHAVE.usuarios, nome)) return responder(res, 409, { erro: 'Já existe alguém com esse usuário.' })
    await banco.hset(CHAVE.usuarios, { [nome]: { ...gerarHash(senha), criado: Date.now(), por: eu.usuario } })
    return responder(res, 200, { ok: true })
  }

  if (req.method === 'DELETE') {
    const nome = normalizarUsuario(req.query && req.query.usuario ||
      new URL(req.url, 'http://x').searchParams.get('usuario'))
    if (nome === eu.usuario) return responder(res, 400, { erro: 'Você não pode remover o seu próprio acesso.' })
    if (!(await banco.hget(CHAVE.usuarios, nome))) return responder(res, 404, { erro: 'Usuário não encontrado.' })
    await banco.hdel(CHAVE.usuarios, nome)
    return responder(res, 200, { ok: true })
  }

  responder(res, 405, { erro: 'Método não permitido.' })
}
