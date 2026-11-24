// ═══════════════════════════════════════════════════════════════════
//  Peças comuns das funções do painel (pasta api/).
//  Arquivos com "_" no início não viram rota no Vercel.
//
//  Onde mora cada coisa:
//   • textos do site e usuários → Redis (Upstash, ativado no Vercel)
//   • fotos, vídeos e PDFs      → Vercel Blob (ver api/upload.js)
// ═══════════════════════════════════════════════════════════════════
import crypto from 'node:crypto'
import { Redis } from '@upstash/redis'

const URL_REDIS = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
const TOKEN_REDIS = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN

// Sem Redis configurado: no computador (teste local) usa a memória;
// publicado no Vercel, avisa para ativar o banco.
const memoria = new Map()
const banco = URL_REDIS && TOKEN_REDIS
  ? new Redis({ url: URL_REDIS, token: TOKEN_REDIS })
  : {
      async get (k) { return memoria.has(k) ? structuredClone(memoria.get(k)) : null },
      async set (k, v, o) { if (o && o.nx && memoria.has(k)) return null; memoria.set(k, structuredClone(v)); return 'OK' },
      async hget (k, f) { const h = memoria.get(k); return h && f in h ? structuredClone(h[f]) : null },
      async hset (k, o) { memoria.set(k, { ...(memoria.get(k) || {}), ...structuredClone(o) }); return 1 },
      async hdel (k, f) { const h = memoria.get(k); if (h) delete h[f]; return 1 },
      async hgetall (k) { const h = memoria.get(k); return h && Object.keys(h).length ? structuredClone(h) : null },
    }
export const semBanco = !(URL_REDIS && TOKEN_REDIS)

export const CHAVE = {
  conteudo: 'portfolio:conteudo',
  usuarios: 'portfolio:usuarios',
  segredo: 'portfolio:segredo',
}
export { banco }

// ── Respostas ──────────────────────────────────────────────────────
export function responder (res, status, corpo) {
  res.status(status)
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(corpo))
}

export function exigirBanco (res) {
  if (semBanco && process.env.VERCEL) {
    responder(res, 500, { erro: 'O banco de dados ainda não foi ativado no Vercel. Veja o passo a passo no README.' })
    return false
  }
  return true
}

// ── Senhas ─────────────────────────────────────────────────────────
// scrypt com sal próprio por usuário: a senha nunca fica gravada.
export function gerarHash (senha) {
  const sal = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(String(senha), sal, 64).toString('hex')
  return { sal, hash }
}
export function conferirSenha (senha, u) {
  if (!u || !u.sal || !u.hash) return false
  const a = crypto.scryptSync(String(senha), u.sal, 64)
  const b = Buffer.from(u.hash, 'hex')
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

export const normalizarUsuario = (u) => String(u || '').trim().toLowerCase()
export const usuarioValido = (u) => /^[a-z0-9._-]{3,32}$/.test(u)
export const SENHA_MIN = 5

// Na primeira vez, o painel nasce com admin / admin.
export async function garantirAdmin () {
  const todos = await banco.hgetall(CHAVE.usuarios)
  if (todos && Object.keys(todos).length) return
  await banco.hset(CHAVE.usuarios, { admin: { ...gerarHash('admin'), criado: Date.now(), padrao: true } })
}

// ── Sessão ─────────────────────────────────────────────────────────
// Cookie assinado (HMAC), válido por 7 dias. O segredo vem da variável
// SESSION_SECRET ou é criado uma vez e guardado no banco.
let segredoCache = null
async function segredo () {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET
  if (segredoCache) return segredoCache
  let s = await banco.get(CHAVE.segredo)
  if (!s) {
    await banco.set(CHAVE.segredo, crypto.randomBytes(32).toString('hex'), { nx: true })
    s = await banco.get(CHAVE.segredo)
  }
  segredoCache = String(s)
  return segredoCache
}

const SETE_DIAS = 7 * 24 * 3600
const b64 = (s) => Buffer.from(s).toString('base64url')
const assinar = (dados, seg) => crypto.createHmac('sha256', seg).update(dados).digest('base64url')

export async function criarSessao (res, usuario) {
  const dados = b64(JSON.stringify({ u: usuario, exp: Date.now() + SETE_DIAS * 1000 }))
  const token = dados + '.' + assinar(dados, await segredo())
  const seguro = process.env.VERCEL ? '; Secure' : ''
  res.setHeader('Set-Cookie', `sessao=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SETE_DIAS}${seguro}`)
}

export function encerrarSessao (res) {
  res.setHeader('Set-Cookie', 'sessao=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0')
}

function lerCookie (req, nome) {
  const c = req.headers.cookie || ''
  const m = c.split(/;\s*/).find(p => p.startsWith(nome + '='))
  return m ? m.slice(nome.length + 1) : null
}

// Devolve o usuário logado (e ainda cadastrado) ou null.
export async function usuarioLogado (req) {
  const token = lerCookie(req, 'sessao')
  if (!token || !token.includes('.')) return null
  const [dados, ass] = token.split('.')
  const esperado = assinar(dados, await segredo())
  if (ass.length !== esperado.length ||
      !crypto.timingSafeEqual(Buffer.from(ass), Buffer.from(esperado))) return null
  let p
  try { p = JSON.parse(Buffer.from(dados, 'base64url').toString()) } catch { return null }
  if (!p.u || !p.exp || p.exp < Date.now()) return null
  const u = await banco.hget(CHAVE.usuarios, p.u)
  return u ? { usuario: p.u, ...u } : null
}

// Para as rotas que só editores usam.
export async function exigirLogin (req, res) {
  if (!exigirBanco(res)) return null
  const u = await usuarioLogado(req)
  if (!u) { responder(res, 401, { erro: 'Sua sessão expirou. Entre de novo.' }); return null }
  return u
}

// Corpo JSON (o Vercel já entrega pronto; o servidor local, não).
export async function lerCorpo (req) {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string') { try { return JSON.parse(req.body) } catch { return {} } }
  const partes = []
  for await (const p of req) partes.push(p)
  try { return JSON.parse(Buffer.concat(partes).toString() || '{}') } catch { return {} }
}
