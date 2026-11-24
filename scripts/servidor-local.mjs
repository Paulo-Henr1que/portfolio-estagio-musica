// Servidor para testar o site e o painel no computador: npm run dev
// Serve os arquivos e roda as funções da pasta api/ como o Vercel faria.
// Sem as variáveis do Redis, os dados ficam na memória (somem ao fechar).
// Sem o token do Blob, os envios vão para midia/_local/ (só para teste).
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const porta = Number(process.env.PORT || 3000)
const tipos = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.gif': 'image/gif', '.mp4': 'video/mp4', '.webm': 'video/webm', '.mov': 'video/quicktime', '.pdf': 'application/pdf' }

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost')
  try {
    // envio de teste, sem Vercel Blob
    if (url.pathname === '/api/_upload-local' && req.method === 'POST') {
      const nome = (url.searchParams.get('nome') || 'arquivo').replace(/[^\w.-]+/g, '-')
      const dir = path.join(raiz, 'midia', '_local'); fs.mkdirSync(dir, { recursive: true })
      const final = Date.now().toString(36) + '-' + nome
      const partes = []; for await (const p of req) partes.push(p)
      fs.writeFileSync(path.join(dir, final), Buffer.concat(partes))
      res.writeHead(200, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ url: '/midia/_local/' + final }))
    }
    if (url.pathname.startsWith('/api/')) {
      const arq = path.join(raiz, 'api', url.pathname.slice(5).replace(/\/$/, '') + '.js')
      if (!fs.existsSync(arq) || path.basename(arq).startsWith('_')) { res.writeHead(404); return res.end('{}') }
      const mod = await import(pathToFileURL(arq).href)
      req.query = Object.fromEntries(url.searchParams)
      res.status = (c) => { res.statusCode = c; return res }
      return await mod.default(req, res)
    }
    let p = decodeURIComponent(url.pathname)
    if (p.endsWith('/')) p += 'index.html'
    const arq = path.join(raiz, p)
    if (!arq.startsWith(raiz) || !fs.existsSync(arq) || fs.statSync(arq).isDirectory()) {
      if (fs.existsSync(arq + '/index.html')) { res.writeHead(301, { Location: p + '/' }); return res.end() }
      res.writeHead(404); return res.end('Não encontrado')
    }
    const st = fs.statSync(arq)
    const tipo = tipos[path.extname(arq).toLowerCase()] || 'application/octet-stream'
    const faixa = req.headers.range && /bytes=(\d*)-(\d*)/.exec(req.headers.range)
    if (faixa) { // vídeos precisam de "range" para avançar
      const ini = Number(faixa[1] || 0), fim = faixa[2] ? Number(faixa[2]) : st.size - 1
      res.writeHead(206, { 'Content-Type': tipo, 'Content-Range': `bytes ${ini}-${fim}/${st.size}`, 'Accept-Ranges': 'bytes', 'Content-Length': fim - ini + 1 })
      return fs.createReadStream(arq, { start: ini, end: fim }).pipe(res)
    }
    res.writeHead(200, { 'Content-Type': tipo, 'Content-Length': st.size, 'Accept-Ranges': 'bytes' })
    fs.createReadStream(arq).pipe(res)
  } catch (e) {
    console.error(e)
    if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ erro: e.message }))
  }
}).listen(porta, () => console.log(`Site:   http://localhost:${porta}\nPainel: http://localhost:${porta}/admin/`))
