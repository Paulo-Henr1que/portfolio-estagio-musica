# Portfólio Reflexivo de Estágio — Licenciatura em Música

Site do portfólio de Estágio Supervisionado: relatos de observação, planos de aula,
relatos das aulas ministradas, reflexão final, bibliografia e os documentos do estágio.

O site é **público para quem tem o link**. A edição é restrita: só os e-mails
cadastrados como administradores conseguem alterar qualquer coisa.

---

## Como isso funciona

| Parte | Onde fica | Custo |
|---|---|---|
| Páginas do site (HTML, CSS, JavaScript) | GitHub Pages | grátis |
| Textos e estrutura | Supabase — banco Postgres | grátis até 500 MB |
| Fotos, vídeos e documentos | Supabase — Storage | grátis até 1 GB |
| Login da área administrativa | Supabase — Auth | grátis |

Nada roda em servidor próprio e não há mensalidade.

---

## Configuração — uma vez só

### 1. Criar o projeto no Supabase

1. Entre em <https://supabase.com> e crie uma conta (pode usar o Google).
2. **New project**. Dê um nome, escolha a região **South America (São Paulo)**
   e guarde a senha do banco num lugar seguro.
3. Espere uns dois minutos até o projeto ficar pronto.

### 2. Preencher as chaves

No painel do Supabase, vá em **Project Settings › API** e copie dois valores:

- **Project URL**
- **anon public** (a chave `anon`)

Abra o arquivo `js/config.js` e cole os dois:

```js
window.CONFIG = {
  SUPABASE_URL: 'https://xxxxxxxx.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOi...',
}
```

> A chave `anon` pode ficar visível no código — ela é pública por natureza, e
> quem protege os dados são as regras do banco. **Nunca** cole aqui a chave
> `service_role`: essa dá acesso total e precisa ficar em segredo.

### 3. Criar as tabelas

No Supabase, vá em **SQL Editor › New query**, cole todo o conteúdo do arquivo
[`supabase/schema.sql`](supabase/schema.sql) e clique em **Run**.

Isso cria as tabelas, as regras de permissão e a pasta de arquivos.

### 4. Cadastrar quem pode editar

Ainda no **SQL Editor**, rode (trocando pelos e-mails reais):

```sql
insert into public.administradores (email, nome) values
  ('email-da-estudante@exemplo.com', 'Nome da estudante'),
  ('email-do-paulo@exemplo.com',     'Paulo Henrique');
```

Depois vá em **Authentication › Users › Add user** e crie uma conta para cada
um desses e-mails, com uma senha. Marque **Auto Confirm User**.

As senhas ficam guardadas criptografadas pelo Supabase. Elas não aparecem no
código do site nem neste repositório.

### 5. Publicar o site

No GitHub, em **Settings › Pages**, escolha a branch `main` e a pasta `/ (root)`.
Em um ou dois minutos o site fica no ar e o GitHub mostra o endereço.

---

## Como usar a área administrativa

1. Abra o site e clique em **Área administrativa**, no rodapé.
2. Entre com o e-mail e a senha cadastrados.
3. Escolha a página que quer editar.
4. Escreva. Para montar a página, use os blocos:
   **Parágrafo**, **Subtítulo**, **Citação**, **Imagem**, **Galeria** e **Vídeo**.
   A ordem dos blocos no editor é a ordem na página, então as fotos e os vídeos
   podem ficar no meio do texto.
5. **Salvar rascunho** guarda sem mostrar para ninguém.
   **Publicar** é o que torna o conteúdo visível para quem abrir o site.

O botão **Ver rascunho**, na faixa escura do topo, mostra como a página vai
ficar antes de publicar.

### Parágrafos

Dentro de um bloco de texto, deixe **uma linha em branco** entre um parágrafo
e outro. É isso que separa os parágrafos na página.

---

## Limites que você precisa conhecer

Estes são limites reais do plano gratuito, não do site:

- **50 MB por arquivo.** Um vídeo de celular de 3 minutos costuma passar disso.
  Comprime antes de enviar — o [HandBrake](https://handbrake.fr) faz isso de
  graça. O editor avisa quando o arquivo é grande demais.
- **1 GB de armazenamento no total.** Dá para uns 20 a 40 vídeos curtos, ou
  centenas de fotos. Quando acabar, o editor mostra um aviso claro.
- **Projeto pausado por inatividade.** O Supabase pausa projetos gratuitos
  depois de uma semana sem nenhum acesso. É só entrar no painel e clicar em
  *Restore* — nada se perde. Para evitar: abra o site de vez em quando.

Se o espaço ficar apertado, a alternativa é hospedar os vídeos longos no
YouTube como "não listados" e deixar no site só os curtos.

---

## Sobre privacidade

Os arquivos enviados ficam num endereço público: **quem tiver o link direto do
arquivo consegue abri-lo**, mesmo que a página ainda esteja como rascunho. O
rascunho esconde o conteúdo da navegação do site, mas não torna o arquivo
secreto.

Na prática, isso significa: **só envie fotos e vídeos de estudantes que já
tenham autorização de uso de imagem**, conforme as regras da escola. Em caso de
dúvida, prefira fotos em que os estudantes não sejam identificáveis.

Para apagar um arquivo de vez, vá no Supabase em **Storage › midia** e remova-o
de lá.

---

## Organização do código

```
index.html            página única; as rotas são #/plano-3, #/biografia, etc.
css/estilo.css        identidade visual (paleta verde, tipografia, componentes)
js/config.js          chaves do Supabase — o único arquivo a preencher
js/dados.js           quais páginas existem e quais campos cada uma tem
js/app.js             navegação e exibição pública
js/admin.js           login, editor, upload e publicação
supabase/schema.sql   tabelas, permissões e pasta de arquivos
```

As ilustrações do tamanduá e os símbolos musicais são SVG desenhados à mão,
definidos uma vez no `index.html` e reaproveitados pelo site inteiro.

### Mudar a estrutura do portfólio

Para acrescentar um plano de aula ou um campo novo, mexa só no `js/dados.js`.
O editor e as páginas públicas se adaptam sozinhos — não é preciso alterar o
banco, porque o conteúdo é guardado em JSON.

---

## O que ainda não existe

Por honestidade, o que **não** foi implementado:

- **Histórico de versões.** Publicar substitui o que estava publicado. Não dá
  para voltar a uma versão anterior.
- **Edição simultânea.** Se as duas pessoas editarem a mesma página ao mesmo
  tempo, quem salvar por último sobrescreve a outra. Combinem antes quem mexe
  em quê.
- **Negrito e itálico dentro do texto.** Os blocos aceitam texto corrido,
  subtítulos e citações, mas não formatação dentro do parágrafo.
