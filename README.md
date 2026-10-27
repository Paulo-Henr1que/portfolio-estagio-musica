# Portfólio Reflexivo de Estágio — Licenciatura em Música

Site do portfólio de Estágio Supervisionado: relatos de observação, planos de aula,
relatos das aulas ministradas, reflexão final, bibliografia e os documentos do estágio.

O site é estático e fica hospedado no GitHub Pages, de graça. Não há banco de dados,
não há login e não há mensalidade — **todo o conteúdo mora no arquivo
[`js/conteudo.js`](js/conteudo.js)**, versionado junto com o código. Ele não some.

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

## O que este site não faz

Por honestidade, e porque foi uma escolha consciente de simplicidade:

- **Não tem painel de edição nem login.** O conteúdo é escrito no arquivo e
  enviado pelo Git.
- **Não tem upload pelo navegador.** Os arquivos entram na pasta `midia/`.
- **Não tem rascunho separado do publicado.** O que está no arquivo e enviado
  ao GitHub está no ar. Para trabalhar sem publicar, use uma branch separada.
- **Não tem negrito ou itálico dentro do parágrafo.** Há subtítulos e citações,
  mas não formatação no meio do texto.
