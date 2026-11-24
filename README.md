# Portfólio Reflexivo de Estágio — Licenciatura em Música

Site do portfólio de Estágio Supervisionado: relatos de observação, planos de aula,
relatos das aulas ministradas, reflexão final, bibliografia e os documentos do estágio.

O site fica no Vercel e tem um **painel de edição em `/admin`**: lá se entra com
usuário e senha e se editam textos, fotos, vídeos, PDFs e links, com
pré-visualização antes de publicar. Veja [Painel de edição](#painel-de-edição).

O arquivo [`js/conteudo.js`](js/conteudo.js) continua valendo como reserva: o site
usa o que foi publicado pelo painel e, se ainda não houver nada publicado, usa o arquivo.

---

## Onde se escreve o conteúdo

Abra o arquivo `js/conteudo.js`. Ele já vem com todas as seções prontas e vazias:
início, biografia, escola, os 3 relatos de observação, os 7 planos de aula, os 7
relatos de aula, as considerações finais e a bibliografia.

Para preencher, troque o texto entre as aspas:

```js
universidade: '',                  →   universidade: 'Nome da universidade',
```

Três regras que evitam quase todo erro:

1. O texto vai entre aspas simples: `'assim'`.
2. Toda linha termina com vírgula.
3. Para um texto longo, use crase no lugar das aspas e deixe **uma linha em
   branco** entre os parágrafos:

```js
{ tipo: 'texto', texto: `Primeiro parágrafo.

Segundo parágrafo.` },
```

A crase também resolve o apóstrofo, que quebraria o arquivo se estivesse entre
aspas simples.

### Blocos de conteúdo

Dentro de `blocos: [ ... ]`, a ordem é a ordem na página — fotos e vídeos podem
ficar no meio do texto:

```js
blocos: [
  { tipo: 'subtitulo', texto: 'A primeira aula' },
  { tipo: 'texto',     texto: `O relato vai aqui.` },
  { tipo: 'imagem',    url: 'midia/sala.jpg', legenda: 'A sala de música',
                       alt: 'Estudantes sentados em roda' },
  { tipo: 'video',     url: 'midia/aula-1.mp4', legenda: 'Atividade rítmica' },
  { tipo: 'citacao',   texto: 'Trecho citado de um autor.' },
  { tipo: 'galeria',   legenda: 'Registros da aula', itens: [
      { url: 'midia/foto-1.jpg', legenda: 'Primeiro momento' },
      { url: 'midia/foto-2.jpg', legenda: 'Segundo momento' },
  ] },
],
```

Qualquer bloco pode ser apagado ou repetido quantas vezes quiser.

---

## Fotos, vídeos e documentos

Coloque os arquivos na pasta [`midia/`](midia/) e aponte para eles pelo nome,
como nos exemplos acima.

- **Nomes sem acento e sem espaço**: `aula-3.mp4`, não `Aula 3.mp4`.
- **Imagens**: JPG com cerca de 1600px de largura basta.
- **Vídeos**: o GitHub **recusa** arquivos acima de 100 MB, e avisa acima de 50 MB.
  Comprima antes — o [HandBrake](https://handbrake.fr) faz isso de graça.
  Para vídeos longos, o caminho é subir no YouTube como "não listado".

### Sobre privacidade

O repositório e o site são públicos: **qualquer arquivo colocado na pasta `midia/`
fica acessível a quem tiver o link**. Só envie fotos e vídeos de estudantes que
tenham autorização de uso de imagem, conforme as regras da escola. Na dúvida,
prefira imagens em que os estudantes não sejam identificáveis.

---

## Publicar as alterações

Depois de editar, basta enviar para o GitHub:

```bash
git add -A
git commit -m "Preenche o relato de observação 2"
git push
```

O site se atualiza sozinho em um ou dois minutos.

Dá para editar direto pelo site do GitHub também: abra o arquivo, clique no
lápis, escreva e clique em **Commit changes**. Não precisa instalar nada.

---

## Ver o site no computador antes de publicar

Abrir o `index.html` com dois cliques **não funciona** — o navegador bloqueia.
Rode um servidor local, dentro da pasta do projeto:

```bash
npx serve .
```

Depois abra o endereço que aparecer (normalmente `http://localhost:3000`).

---

## Organização do código

```
index.html          página única; as rotas são #/plano-3, #/biografia, etc.
js/conteudo.js      TODO O CONTEÚDO — é o único arquivo que você precisa editar
js/dados.js         quais páginas existem e quais campos cada uma tem
js/app.js           navegação e montagem das páginas
css/estilo.css      identidade visual (paleta verde, tipografia, componentes)
midia/              fotos, vídeos e documentos
```

As ilustrações do tamanduá e os símbolos musicais são SVG desenhados à mão,
definidos uma vez no `index.html` e reaproveitados pelo site inteiro.

Para acrescentar um plano de aula ou um campo novo, mexa no `js/dados.js` — as
páginas se adaptam sozinhas.

---

## Painel de edição

Endereço: **`/admin`** do site (ex.: `https://seu-site.vercel.app/admin`).

- **Primeiro acesso:** usuário `admin`, senha `admin`. O painel avisa para trocar a senha.
- **Mudar a senha:** menu da conta (canto superior direito) → *Mudar minha senha*.
- **Outras pessoas:** menu da conta → *Quem pode editar* → usuário e senha inicial.
- **Editar:** escolha a página, edite e clique em **Salvar e publicar**. Antes de publicar,
  a pré-visualização mostra o próprio site com as alterações, no tamanho de computador e de celular.
- Alterações não publicadas ficam guardadas no navegador se a aba fechar sem querer.
- Fotos grandes são reduzidas antes de enviar; vídeos ganham uma capa automática.

### Ativar no Vercel (uma vez só)

No projeto do site no Vercel → aba **Storage**:

1. **Create Database → Upstash for Redis** (plano grátis) → conectar ao projeto.
   Guarda os textos, os usuários e as senhas (criptografadas).
2. **Create Database → Blob** → conectar ao projeto.
   Guarda as fotos, os vídeos e os PDFs enviados pelo painel (1 GB grátis).
3. **Deployments → Redeploy**, para o site enxergar os dois.

Opcional: variável de ambiente `SESSION_SECRET` com um texto longo e aleatório.
Sem ela, o painel gera um segredo sozinho e guarda no Redis.

### Testar no computador

```bash
npm install
npm run dev
```

Site em `http://localhost:3000` e painel em `http://localhost:3000/admin/`. Sem as variáveis
do Redis e do Blob, os dados ficam na memória e os envios vão para `midia/_local/`, só para teste.

### Organização do painel

```
admin/                painel (index.html, admin.js, admin.css)
admin/blob-client.js  envio de arquivos ao Vercel Blob (gerado com npm run build:blob)
api/                  funções do Vercel: login, sair, eu, conteudo, senha, usuarios, upload
scripts/              servidor local de teste
```
