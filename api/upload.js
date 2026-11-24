// POST /api/upload  → autoriza o navegador a enviar um arquivo direto
// para o Vercel Blob. O arquivo não passa por esta função (o limite de
// uma função é 4,5 MB; assim vídeos grandes também entram).
import { handleUpload } from '@vercel/blob/client'
import { responder, exigirLogin, lerCorpo } from './_lib.js'

const TIPOS = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif',
  'video/mp4', 'video/webm', 'video/quicktime',
  'application/pdf',
]

export default async function handler (req, res) {
  if (req.method !== 'POST') return responder(res, 405, { erro: 'Método não permitido.' })
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return responder(res, 500, { erro: 'O armazenamento de arquivos (Vercel Blob) ainda não foi ativado. Veja o README.' })
  }
  const body = await lerCorpo(req)

  // O pedido de autorização exige login. O aviso de "envio concluído",
  // que o próprio Vercel Blob manda depois, vem assinado e é conferido
  // dentro do handleUpload.
  if (body.type === 'blob.generate-client-token') {
    const u = await exigirLogin(req, res); if (!u) return
  }

  try {
    const r = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: TIPOS,
        maximumSizeInBytes: 500 * 1024 * 1024,
        addRandomSuffix: true,
      }),
      onUploadCompleted: async () => {},
    })
    responder(res, 200, r)
  } catch (e) {
    responder(res, 400, { erro: e.message || 'Falha ao enviar o arquivo.' })
  }
}
