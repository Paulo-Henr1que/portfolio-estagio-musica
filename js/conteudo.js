// ═══════════════════════════════════════════════════════════════════
//  TODO O CONTEÚDO DO PORTFÓLIO FICA NESTE ARQUIVO.
//
//  Para escrever, troque o texto entre as aspas. Exemplo:
//      universidade: '',   →   universidade: 'Nome da universidade',
//
//  Três regras que evitam 99% dos erros:
//   1. O texto vai sempre entre aspas simples: 'assim'.
//   2. Toda linha termina com vírgula.
//   3. Se o texto tiver apóstrofo, prefira a crase no lugar das aspas:
//      texto: `a aula de musica`  — a crase aceita apostrofo sem quebrar.
//
//  Para um texto com VÁRIOS PARÁGRAFOS, use crase no lugar das aspas
//  e deixe uma linha em branco entre os parágrafos:
//
//      texto: `Primeiro parágrafo.
//
//      Segundo parágrafo.`,
// ═══════════════════════════════════════════════════════════════════

window.CONTEUDO = {

  // ── Início ──────────────────────────────────────────────────
  'inicio': {
    titulo: '',             // título do trabalho
    universidade: 'Universidade de Brasília',       // Universidade
    curso: 'Licenciatura em Música',              // Curso
    disciplina: 'Estágio Supervisionado em Música 1',         // Disciplina / componente curricular
    estudante: 'Ana Luisa Barreto de Freitas',          // Estudante
    orientador: 'Dra. Jéssica de Almeida',         // Professor(a) orientador(a)
    supervisor: 'Hélio Ferreira Barreto',         // Professor(a) supervisor(a)
    escola: 'Centro de Ensino Fundamental (CEF) Tamanduá',             // Escola
    cidade: 'Zona rural do Gama',             // Cidade
    estado: 'DF',             // Estado
    ano: '2026.2',                // Ano
    blocos: [
      // { tipo: 'subtitulo', texto: '' },
      { tipo: 'texto', texto: `Este portfólio tem como objetivo documentar e apresentar as experiências, aprendizagens e reflexões desenvolvidas durante o estágio supervisionado em Música. Nele, estão reunidos os registros de observação, os planejamentos e relatos das aulas, além das atividades e experiências vivenciadas com os alunos do 5º ano do Ensino Fundamental. Este material representa um espaço de reflexão sobre a prática docente, os desafios encontrados e a construção da identidade como futura educadora musical, bem como sobre o processo de construção do saber musical dos alunos, buscando despertar a curiosidade, estimular questionamentos e incentivar a exploração e a descoberta da música como forma de expressão e aprendizagem.` },
      // { tipo: 'imagem', url: 'midia/arquivo.jpg', legenda: '', alt: '' },
      // { tipo: 'video',  url: 'midia/arquivo.mp4', legenda: '' },
      // { tipo: 'galeria', legenda: '', itens: [
      //     { url: 'midia/foto-1.jpg', legenda: '' },
      //     { url: 'midia/foto-2.jpg', legenda: '' },
      // ] },
    ],
    documentos: [
      // { nome: 'Ficha de frequência assinada', descricao: '', url: 'midia/ficha-frequencia.pdf' },
      // { nome: 'Ficha de avaliação assinada',  descricao: '', url: 'midia/ficha-avaliacao.pdf' },
    ],
  },

  // ── Biografia ───────────────────────────────────────────────
  'biografia': {
    blocos: [
      // { tipo: 'subtitulo', texto: '' },
      { tipo: 'texto', texto: `` },
      // { tipo: 'imagem', url: 'midia/arquivo.jpg', legenda: '', alt: '' },
      // { tipo: 'video',  url: 'midia/arquivo.mp4', legenda: '' },
      // { tipo: 'galeria', legenda: '', itens: [
      //     { url: 'midia/foto-1.jpg', legenda: '' },
      //     { url: 'midia/foto-2.jpg', legenda: '' },
      // ] },
    ],
  },

  // ── Dados da Escola ─────────────────────────────────────────
  'escola': {
    nome: '',               // Nome da escola
    localizacao: '',        // Localização
    etapas: '',             // Etapas de ensino
    turmas: '',             // Turmas acompanhadas
    blocos: [
      // { tipo: 'subtitulo', texto: '' },
      { tipo: 'texto', texto: `` },
      // { tipo: 'imagem', url: 'midia/arquivo.jpg', legenda: '', alt: '' },
      // { tipo: 'video',  url: 'midia/arquivo.mp4', legenda: '' },
      // { tipo: 'galeria', legenda: '', itens: [
      //     { url: 'midia/foto-1.jpg', legenda: '' },
      //     { url: 'midia/foto-2.jpg', legenda: '' },
      // ] },
    ],
  },

  // ── Introdução ──────────────────────────────────────────────
  // Página de abertura; cada um dos quatro tópicos tem página própria logo abaixo.
  'introducao': {
    blocos: [
      { tipo: 'texto', texto: `` },
    ],
  },

  // ── Introdução › Contexto do Estágio ─────────────────────
  'introducao-contexto-do-estagio': {
    resumo: '',             // frase curta que aparece na lista da Introdução
    blocos: [
      { tipo: 'texto', texto: `` },
    ],
  },

  // ── Introdução › Contexto deste Estágio ──────────────────
  'introducao-contexto-deste-estagio': {
    resumo: '',             // frase curta que aparece na lista da Introdução
    blocos: [
      { tipo: 'texto', texto: `Nesse último estágio, frequentei a escola CEF Tamanduá, situada na Ponte Alta Norte (Gama – DF). Compareci a escola uma vez por semana, sendo toda terça no período vespertino. Durante as três primeiras semanas observei a aula dada pelo professor, e após o período de observação, conduzi duas turmas no ensino de introdução a música. Nas quintas tínhamos a aula presencial de Estágio, em que nos era orientado como observar, escrever, atuar, pensar, ler, dentre outros aspectos necessários para o estágio e a vida acadêmica/profissional.` },
    ],
  },

  // ── Introdução › As Turmas ───────────────────────────────
  'introducao-turmas': {
    resumo: '',             // frase curta que aparece na lista da Introdução
    blocos: [
      { tipo: 'texto', texto: `As turmas que tive oportunidade de acompanhar e ensinar foram as do 5º Ano "A" e "B" do CEF Tamanduá. Somente há duas turmas de 5º ano na escola, por ser um ambiente rural a escola é considerada pequena. O 5º ano B era composto por 20 alunos e sua professora regente é a Carla. A didática usada pela professora desenvolve o contato entre aluno e professor, instigando a curiosidade, a conversa e a afetividade, com um vocabulário mais próximo para cativar o aluno, seu método de disciplina era a conversa, os alunos apresentavam um certo respeito por ela, os alunos demonstravam um bom convívio, mas ainda teve casos de brincadeiras verbais inadequadas. Já o 5º ano A é composto por 16 alunos, e a professora regente é a Lenir, sua didática envolve copiar no quadro e os alunos escreverem no caderno, não tinha tanto contato com a turma, desenvolvia jogos para trazer dinâmicas as aulas, a disciplina era desenvolvida a voz mais alta, não surtia certa autoridade na sala, a relações entre alunos é mais agressiva e violenta, tanto em palavras quanto em atitudes físicas, o ambiente da sala de difícil controle por conta das rivalidades entre os alunos do sexo masculino. A faixa etária das duas turmas englobam alunos de 10 a 12 anos, majoritariamente negros.

Durante o estágio introduzimos o conceito de Ritmo, pulso, figuras rítmicas, instrumentos de precursão, composição e performasse, trabalhei com o objetivo de que ao final do estágio os alunos deveriam apresentar uma música utilizando a voz acompanhada por instrumentos percussivos feitos por mim.` },
    ],
  },

  // ── Introdução › Leituras e Reflexões ────────────────────
  'introducao-leituras': {
    resumo: '',             // frase curta que aparece na lista da Introdução
    blocos: [
      { tipo: 'texto', texto: `Durante as aulas de estágios dada pela professora Jéssica de Almeida, e os mestrandos Alexa, Rodrigo e Arthur tivemos contato com várias metodologias para instigar a escrita, a leitura, reflexões, desejos e projetos. Em nossas primeiras aulas de estágios tivemos a oportunidade de aprofundar na leitura de Arroyo, com debates e discursões com o intuito de instigar a profundidade. Outra metodologia usada foi a construção de resenhas e textos reflexivos tanto do nosso saber pessoal, quando baseada em leituras que os próprios professores traziam. Pudemos desbravas métodos de linguagem como poemas, canções, vídeos e cartas, além de lermos artigos e portifólios desenvolvidos por eles para nos darem ideias e destravar a criatividade.` },
    ],
  },

  // ── Relatos de Observação ───────────────────────────────────
  'observacoes': {
    resumo: '',             // frase curta que aparece no cartão
    blocos: [
      // { tipo: 'subtitulo', texto: '' },
      { tipo: 'texto', texto: `` },
      // { tipo: 'imagem', url: 'midia/arquivo.jpg', legenda: '', alt: '' },
      // { tipo: 'video',  url: 'midia/arquivo.mp4', legenda: '' },
      // { tipo: 'galeria', legenda: '', itens: [
      //     { url: 'midia/foto-1.jpg', legenda: '' },
      //     { url: 'midia/foto-2.jpg', legenda: '' },
      // ] },
    ],
  },

  // ── Relato de Observação 1 ──────────────────────────────────
  'observacao-1': {
    data: '',               // Data
    turma: '',              // Turma
    resumo: '',             // frase curta que aparece no cartão
    blocos: [
      // { tipo: 'subtitulo', texto: '' },
      { tipo: 'texto', texto: `` },
      // { tipo: 'imagem', url: 'midia/arquivo.jpg', legenda: '', alt: '' },
      // { tipo: 'video',  url: 'midia/arquivo.mp4', legenda: '' },
      // { tipo: 'galeria', legenda: '', itens: [
      //     { url: 'midia/foto-1.jpg', legenda: '' },
      //     { url: 'midia/foto-2.jpg', legenda: '' },
      // ] },
    ],
  },

  // ── Relato de Observação 2 ──────────────────────────────────
  'observacao-2': {
    data: '',               // Data
    turma: '',              // Turma
    resumo: '',             // frase curta que aparece no cartão
    blocos: [
      // { tipo: 'subtitulo', texto: '' },
      { tipo: 'texto', texto: `` },
      // { tipo: 'imagem', url: 'midia/arquivo.jpg', legenda: '', alt: '' },
      // { tipo: 'video',  url: 'midia/arquivo.mp4', legenda: '' },
      // { tipo: 'galeria', legenda: '', itens: [
      //     { url: 'midia/foto-1.jpg', legenda: '' },
      //     { url: 'midia/foto-2.jpg', legenda: '' },
      // ] },
    ],
  },

  // ── Relato de Observação 3 ──────────────────────────────────
  'observacao-3': {
    data: '',               // Data
    turma: '',              // Turma
    resumo: '',             // frase curta que aparece no cartão
    blocos: [
      // { tipo: 'subtitulo', texto: '' },
      { tipo: 'texto', texto: `` },
      // { tipo: 'imagem', url: 'midia/arquivo.jpg', legenda: '', alt: '' },
      // { tipo: 'video',  url: 'midia/arquivo.mp4', legenda: '' },
      // { tipo: 'galeria', legenda: '', itens: [
      //     { url: 'midia/foto-1.jpg', legenda: '' },
      //     { url: 'midia/foto-2.jpg', legenda: '' },
      // ] },
    ],
  },

  // ── Planos de Aula ──────────────────────────────────────────
  'planos': {
    resumo: '',             // frase curta que aparece no cartão
    blocos: [
      // { tipo: 'subtitulo', texto: '' },
      { tipo: 'texto', texto: `` },
      // { tipo: 'imagem', url: 'midia/arquivo.jpg', legenda: '', alt: '' },
      // { tipo: 'video',  url: 'midia/arquivo.mp4', legenda: '' },
      // { tipo: 'galeria', legenda: '', itens: [
      //     { url: 'midia/foto-1.jpg', legenda: '' },
      //     { url: 'midia/foto-2.jpg', legenda: '' },
      // ] },
    ],
  },

  // ── Plano de Aula 1 ─────────────────────────────────────────
  'plano-1': {
    numero: '',             // Número do plano
    titulo: '',             // Título
    data: '',               // Data
    tema: '',               // Tema
    resumo: '',             // frase curta que aparece no cartão
    objetivos: ``,   // Objetivos
    conteudos: ``,   // Conteúdos
    metodologia: ``,   // Metodologia
    desenvolvimento: ``,   // Desenvolvimento
    recursos: ``,   // Recursos
    repertorio: ``,   // Repertório musical
    avaliacao: ``,   // Avaliação
    referencias: ``,   // Referências
    observacoes: ``,   // Observações
    blocos: [
      // { tipo: 'subtitulo', texto: '' },
      { tipo: 'texto', texto: `` },
      // { tipo: 'imagem', url: 'midia/arquivo.jpg', legenda: '', alt: '' },
      // { tipo: 'video',  url: 'midia/arquivo.mp4', legenda: '' },
      // { tipo: 'galeria', legenda: '', itens: [
      //     { url: 'midia/foto-1.jpg', legenda: '' },
      //     { url: 'midia/foto-2.jpg', legenda: '' },
      // ] },
    ],
  },

  // ── Plano de Aula 2 ─────────────────────────────────────────
  'plano-2': {
    numero: '',             // Número do plano
    titulo: '',             // Título
    data: '',               // Data
    tema: '',               // Tema
    resumo: '',             // frase curta que aparece no cartão
    objetivos: ``,   // Objetivos
    conteudos: ``,   // Conteúdos
    metodologia: ``,   // Metodologia
    desenvolvimento: ``,   // Desenvolvimento
    recursos: ``,   // Recursos
    repertorio: ``,   // Repertório musical
    avaliacao: ``,   // Avaliação
    referencias: ``,   // Referências
    observacoes: ``,   // Observações
    blocos: [
      // { tipo: 'subtitulo', texto: '' },
      { tipo: 'texto', texto: `` },
      // { tipo: 'imagem', url: 'midia/arquivo.jpg', legenda: '', alt: '' },
      // { tipo: 'video',  url: 'midia/arquivo.mp4', legenda: '' },
      // { tipo: 'galeria', legenda: '', itens: [
      //     { url: 'midia/foto-1.jpg', legenda: '' },
      //     { url: 'midia/foto-2.jpg', legenda: '' },
      // ] },
    ],
  },

  // ── Plano de Aula 3 ─────────────────────────────────────────
  'plano-3': {
    numero: '',             // Número do plano
    titulo: '',             // Título
    data: '',               // Data
    tema: '',               // Tema
    resumo: '',             // frase curta que aparece no cartão
    objetivos: ``,   // Objetivos
    conteudos: ``,   // Conteúdos
    metodologia: ``,   // Metodologia
    desenvolvimento: ``,   // Desenvolvimento
    recursos: ``,   // Recursos
    repertorio: ``,   // Repertório musical
    avaliacao: ``,   // Avaliação
    referencias: ``,   // Referências
    observacoes: ``,   // Observações
    blocos: [
      // { tipo: 'subtitulo', texto: '' },
      { tipo: 'texto', texto: `` },
      // { tipo: 'imagem', url: 'midia/arquivo.jpg', legenda: '', alt: '' },
      // { tipo: 'video',  url: 'midia/arquivo.mp4', legenda: '' },
      // { tipo: 'galeria', legenda: '', itens: [
      //     { url: 'midia/foto-1.jpg', legenda: '' },
      //     { url: 'midia/foto-2.jpg', legenda: '' },
      // ] },
    ],
  },

  // ── Plano de Aula 4 ─────────────────────────────────────────
  'plano-4': {
    numero: '',             // Número do plano
    titulo: '',             // Título
    data: '',               // Data
    tema: '',               // Tema
    resumo: '',             // frase curta que aparece no cartão
    objetivos: ``,   // Objetivos
    conteudos: ``,   // Conteúdos
    metodologia: ``,   // Metodologia
    desenvolvimento: ``,   // Desenvolvimento
    recursos: ``,   // Recursos
    repertorio: ``,   // Repertório musical
    avaliacao: ``,   // Avaliação
    referencias: ``,   // Referências
    observacoes: ``,   // Observações
    blocos: [
      // { tipo: 'subtitulo', texto: '' },
      { tipo: 'texto', texto: `` },
      // { tipo: 'imagem', url: 'midia/arquivo.jpg', legenda: '', alt: '' },
      // { tipo: 'video',  url: 'midia/arquivo.mp4', legenda: '' },
      // { tipo: 'galeria', legenda: '', itens: [
      //     { url: 'midia/foto-1.jpg', legenda: '' },
      //     { url: 'midia/foto-2.jpg', legenda: '' },
      // ] },
    ],
  },

  // ── Plano de Aula 5 ─────────────────────────────────────────
  'plano-5': {
    numero: '',             // Número do plano
    titulo: '',             // Título
    data: '',               // Data
    tema: '',               // Tema
    resumo: '',             // frase curta que aparece no cartão
    objetivos: ``,   // Objetivos
    conteudos: ``,   // Conteúdos
    metodologia: ``,   // Metodologia
    desenvolvimento: ``,   // Desenvolvimento
    recursos: ``,   // Recursos
    repertorio: ``,   // Repertório musical
    avaliacao: ``,   // Avaliação
    referencias: ``,   // Referências
    observacoes: ``,   // Observações
    blocos: [
      // { tipo: 'subtitulo', texto: '' },
      { tipo: 'texto', texto: `` },
      // { tipo: 'imagem', url: 'midia/arquivo.jpg', legenda: '', alt: '' },
      // { tipo: 'video',  url: 'midia/arquivo.mp4', legenda: '' },
      // { tipo: 'galeria', legenda: '', itens: [
      //     { url: 'midia/foto-1.jpg', legenda: '' },
      //     { url: 'midia/foto-2.jpg', legenda: '' },
      // ] },
    ],
  },

  // ── Plano de Aula 6 ─────────────────────────────────────────
  'plano-6': {
    numero: '',             // Número do plano
    titulo: '',             // Título
    data: '',               // Data
    tema: '',               // Tema
    resumo: '',             // frase curta que aparece no cartão
    objetivos: ``,   // Objetivos
    conteudos: ``,   // Conteúdos
    metodologia: ``,   // Metodologia
    desenvolvimento: ``,   // Desenvolvimento
    recursos: ``,   // Recursos
    repertorio: ``,   // Repertório musical
    avaliacao: ``,   // Avaliação
    referencias: ``,   // Referências
    observacoes: ``,   // Observações
    blocos: [
      // { tipo: 'subtitulo', texto: '' },
      { tipo: 'texto', texto: `` },
      // { tipo: 'imagem', url: 'midia/arquivo.jpg', legenda: '', alt: '' },
      // { tipo: 'video',  url: 'midia/arquivo.mp4', legenda: '' },
      // { tipo: 'galeria', legenda: '', itens: [
      //     { url: 'midia/foto-1.jpg', legenda: '' },
      //     { url: 'midia/foto-2.jpg', legenda: '' },
      // ] },
    ],
  },

  // ── Plano de Aula 7 ─────────────────────────────────────────
  'plano-7': {
    numero: '',             // Número do plano
    titulo: '',             // Título
    data: '',               // Data
    tema: '',               // Tema
    resumo: '',             // frase curta que aparece no cartão
    objetivos: ``,   // Objetivos
    conteudos: ``,   // Conteúdos
    metodologia: ``,   // Metodologia
    desenvolvimento: ``,   // Desenvolvimento
    recursos: ``,   // Recursos
    repertorio: ``,   // Repertório musical
    avaliacao: ``,   // Avaliação
    referencias: ``,   // Referências
    observacoes: ``,   // Observações
    blocos: [
      // { tipo: 'subtitulo', texto: '' },
      { tipo: 'texto', texto: `` },
      // { tipo: 'imagem', url: 'midia/arquivo.jpg', legenda: '', alt: '' },
      // { tipo: 'video',  url: 'midia/arquivo.mp4', legenda: '' },
      // { tipo: 'galeria', legenda: '', itens: [
      //     { url: 'midia/foto-1.jpg', legenda: '' },
      //     { url: 'midia/foto-2.jpg', legenda: '' },
      // ] },
    ],
  },

  // ── Relatos das Aulas ───────────────────────────────────────
  'relatos': {
    resumo: '',             // frase curta que aparece no cartão
    blocos: [
      // { tipo: 'subtitulo', texto: '' },
      { tipo: 'texto', texto: `Aqui estão reunidos os sete relatos de aula desenvolvidos ao longo do estágio supervisionado nas turmas de 5º ano (A e B). Os registros documentam o processo de ensino e aprendizagem musical aplicado em sala, partindo da leitura rítmica e da percepção de pulso até a exploração de gêneros musicais, instrumentos alternativos e performance em grupo.

Cada relato evidencia as metodologias utilizadas, o comportamento e a assimilação dos conteúdos por parte dos estudantes, bem como as estratégias de adaptação pedagógica adotadas até a culminância artística do projeto.` },
      // { tipo: 'imagem', url: 'midia/arquivo.jpg', legenda: '', alt: '' },
      // { tipo: 'video',  url: 'midia/arquivo.mp4', legenda: '' },
      // { tipo: 'galeria', legenda: '', itens: [
      //     { url: 'midia/foto-1.jpg', legenda: '' },
      //     { url: 'midia/foto-2.jpg', legenda: '' },
      // ] },
    ],
  },

  // ── Relato de Aula 1 ────────────────────────────────────────
  'relato-1': {
    numero: '1',
    data: '22/09/2026',
    turma: '5º A e 5º B',
    resumo: `Primeiro contato com as figuras rítmicas a partir de “Marcha Soldado”.`,
    blocos: [
      { tipo: `subtitulo`, texto: `Turma 5º B` },
      { tipo: `texto`, texto: `Escrevi no quadro as figuras rítmicas: semínima, colcheia e semicolcheia. Em outra parte do quadro, o professor Hélio escreveu a melodia rítmica da música "Marcha Soldado", enquanto eu explicava o que eram as figuras e o som que eles deveriam fazer quando eu apontasse para cada uma. Fizemos compasso por compasso, construindo o som junto com o metrônomo. Ao longo da aula, fui construindo as linhas rítmicas com os alunos, modificando as figuras da música. A grande dificuldade foi ensinar a figura pontuada que apareceu na música, porém o professor Hélio me deu a sugestão de solfejar e os alunos conseguiram apresentar. A leitura rítmica dos alunos foi impecável; senti que eles seguiam o tempo corretamente. Pude introduzir o conceito das pausas como uma forma de silêncio, explicando que o silêncio funciona como o espaço das nossas palavras, dando sentido à frase. Finalizei cantando a música "Marcha Soldado", mostrando que aquela melodia rítmica era a melodia da música. Fiz uma vez com eles cantando o ritmo e eu a letra, depois com eles cantando a letra. Minha maior dificuldade foi administrar o tempo da aula.` },
      { tipo: `subtitulo`, texto: `Turma 5º A` },
      { tipo: `texto`, texto: `Comecei com a mesma dinâmica da turma anterior, porém nessa turma tínhamos 2 alunos que não paravam de conversar e tive que parar a aula em diversos momentos. O professor Hélio separou os dois. A turma apresentou uma grande dificuldade em seguir o pulso, acelerando os ritmos. Fizemos as atividades de ir testando as linhas rítmicas, porém a dificuldade foi cantar junto com o metrônomo; por tal motivo, pedi para eles ficarem em pé e baterem palmas enquanto cantavam. Ainda tiveram dificuldades, mas melhorou gradativamente. Por conta das conversas e da diferença de disciplina na aula, teve um momento em que eu me perdi, e o professor Hélio me deu um toque para relembrar qual era o próximo passo.

Ao final, juntei as duas turmas e acompanhei a leitura rítmica com a letra da música "Marcha Soldado" e as figuras rítmicas da música no quadro.` },
      { tipo: `galeria`, legenda: `Registros da aula: a turma em sala, as figuras rítmicas no quadro e a partitura rítmica de “Marcha Soldado”.`, itens: [
        { url: `midia/relatos/r1-aula.webp`, legenda: `Aula com a turma` },
        { url: `midia/relatos/r1-quadro.webp`, legenda: `Figuras rítmicas no quadro` },
        { url: `midia/relatos/r1-partitura.webp`, legenda: `Partitura rítmica de “Marcha Soldado”` },
      ] },
      { tipo: `video`, url: `midia/relatos/r1-video.mp4`, drive: `https://drive.google.com/file/d/1L-IEU4laSNZ_MyIDDFdzoqWi-YUX8plz/view`, poster: `midia/relatos/r1-video-capa.webp`, legenda: `Registro em vídeo da aula.` },
    ],
  },

  // ── Relato de Aula 2 ────────────────────────────────────────
  'relato-2': {
    numero: '2',
    data: '29/09/2026',
    turma: '5º A e 5º B',
    resumo: `Canto e palmas ao mesmo tempo com “Se Essa Rua Fosse Minha”.`,
    blocos: [
      { tipo: `subtitulo`, texto: `Turma 5º B` },
      { tipo: `texto`, texto: `Tivemos uma aula reduzida por conta da coordenação dos professores. Reapresentei as figuras rítmicas (semínima, colcheia, semicolcheia) e os alunos relembraram perfeitamente. Introduzi a figura "mínima"; eles já estavam seguindo as figuras rítmicas perfeitamente no quadro: eu apontava e eles cantavam como Ta-a, Ta, Ti, Tiririri. Em outra parte do quadro, coloquei as melodias rítmicas dos primeiros compassos de "Se Essa Rua Fosse Minha" e solicitei que eles cantassem. Após isso, coloquei um ritmo para eles baterem palmas enquanto cantavam o ritmo da melodia. Fizemos separado a palma e, após sentirmos que estavam confiantes, fizemos separado o ritmo. Separamos a turma em 2, colocamos um grupo para bater palmas e o outro para cantar o ritmo. Introduzi a mínima pontuada, tiveram um bom êxito e conseguiram fazer a divisão dos dois grupos. Depois, enquanto a turma cantava, eu e o professor Hélio começamos a cantar a letra da música para os alunos associarem o ritmo cantado por Ta, Ti, Tiririri com a letra da música. Passei um exercício para casa, pedindo para os alunos me trazerem na próxima aula músicas que eles escutaram durante a semana, solicitando o nome da música e o artista. Eles conseguiram relembrar o conteúdo da aula passada e executaram muito bem, indo além das expectativas.` },
      { tipo: `subtitulo`, texto: `Turma 5º A` },
      { tipo: `texto`, texto: `Fizemos as mesmas dinâmicas, porém identifiquei que eles não conseguiam acompanhar a leitura do quadro; seu solfejo rítmico era composto por imitação, em vez de assimilação do que eu estava apontando no quadro, e por tal motivo eles aceleram e fogem do pulso. Parei algumas vezes para trabalhar o tempo e introduzi um método de fala (palma, pé...) com o intuito de eles assimilarem melhor o ritmo, e retornamos. Ao final, o Hélio colocou uma música para os alunos escutarem enquanto` },
      { tipo: `imagem`, url: `midia/relatos/r2-quadro.webp`, legenda: `Figuras rítmicas e a melodia rítmica no quadro.` },
    ],
  },

  // ── Relato de Aula 3 ────────────────────────────────────────
  'relato-3': {
    numero: '3',
    data: '06/10/2026',
    turma: '5º A e 5º B',
    resumo: `Estilos musicais brasileiros e os instrumentos confeccionados, em dia de interclasse.`,
    blocos: [
      { tipo: `texto`, texto: `A aula foi reduzida, visto que estava tendo interclasse na escola. Adaptei o plano de aula para fazer as 2 aulas no segundo horário. Por conta do interclasse, os meninos estavam muito agitados; de 10 em 10 minutos, um grupo de alunos saía e outro entrava na sala, visto que os jogos ainda estavam rolando.` },
      { tipo: `subtitulo`, texto: `Turma 5º B` },
      { tipo: `texto`, texto: `Apresentei o conceito de estilos musicais. O professor Hélio bateu na carteira usando pincéis o ritmo do funk, samba e sertanejo, enquanto eu batia o pulso. Apresentei os 4 instrumentos que confeccionei (tambor, reco-reco, pau de chuva, castanhola). Passei 3 músicas para eles escutarem enquanto usavam os instrumentos: para o funk foi o "Rap da Felicidade", para o samba foi "Não Deixe o Samba Morrer" e para o sertanejo foi "Evidências", porém os alunos mal conheciam as músicas, somente o "Rap da Felicidade". Eles me entregaram a pesquisa solicitada na aula passada. Por conta da dinâmica do interclasse, não pude aprofundar no tema e tive que trabalhar com a rotatividade dos grupos; isso atrapalhou a aula. Os alunos gostaram muito, mas, por conta do mapeamento da sala, que estava com cadeiras em fileira, os alunos participaram pouco. De início, não tinha incentivado eles a pegarem os instrumentos, mas por conselho do professor Hélio, alguns alunos pegaram e usaram para tocar a música. Expliquei como seria a dinâmica dos grupos para a apresentação final.` },
      { tipo: `subtitulo`, texto: `Turma 5º A` },
      { tipo: `texto`, texto: `Tive um melhor resultado, consegui explicar sobre os estilos musicais, eles tiveram uma melhora nas figuras musicais e pude aprofundar mais nos instrumentos. Contei a história do instrumento pau de chuva. Percebi que para a turma do 5º B seriam necessários mais instrumentos. A turma não estava tão agitada quanto a turma anterior. Não apresentei as músicas "Não Deixe o Samba Morrer" nem "Evidências", somente apresentei o "Rap da Felicidade", pela experiência da turma anterior. Cada aluno pegou um instrumento e bateu no ritmo que queria, enquanto eu e o professor Hélio trocávamos os instrumentos e, para cada tipo de instrumento, havia uma melodia rítmica. Recebi o dever de casa que tinha passado na aula anterior.` },
      { tipo: `imagem`, url: `midia/relatos/r3-instrumentos.webp`, legenda: `Instrumentos de percussão confeccionados para as aulas.` },
      { tipo: `video`, url: `midia/relatos/r3-video.mp4`, drive: `https://drive.google.com/file/d/1blOD4_Bk2PP1f1DCxJNol7Kg_A5lKsB5/view`, poster: `midia/relatos/r3-video-capa.webp`, legenda: `Registro em vídeo.` },
    ],
  },

  // ── Relato de Aula 4 ────────────────────────────────────────
  'relato-4': {
    numero: '4',
    data: '13/10/2026',
    turma: 'Feira de Disciplinas (2º, 4º e 5º anos)',
    resumo: `Oficina no estande de Música da feira cultural, com várias turmas.`,
    blocos: [
      { tipo: `texto`, texto: `Tivemos a feira cultural, em que fui colocada no pátio da escola e tive que fazer uma dinâmica tanto para o 4º ano quanto para o 5º ano. Os alunos do 4º ano não sabiam a base musical; introduzi as figuras rítmicas do método Kodály, introduzi os conceitos de pulso e de ritmo, e usando as figuras rítmicas pedi para eles fazerem o solfejo do Ta, Ti, Tiririri. Apresentei os instrumentos e, por serem uma turma de menor idade, eles danificaram alguns instrumentos; por tal motivo, tive que restaurar os instrumentos com fita. Eles demonstraram muita curiosidade. Tentei colocar a música "O Cravo Brigou com a Rosa", porém eles não conheciam; tinha apenas uma aluna que sabia cantar a música. Achei interessante que o 5º ano sabia as músicas folclóricas, porém o 4º ano não, e mesmo sendo um ano de distância, pude notar o comportamento mais agitado do que o 5º ano. Por não saber muito sobre o tempo de aula que teria com cada grupo da feira, eu acabei acelerando a aula, e, depois da apresentação, tive que improvisar uma nova dinâmica: separei o grupo em 2, pedi para cada grupo criar uma sequência rítmica de poucos compassos, e o outro grupo deveria reconhecer qual foi essa sequência usando as figuras rítmicas ensinadas. Um grupo escolheu que ia usar 4 semínimas e 8 colcheias; já o outro grupo escolheu usar 3 semínimas e 2 colcheias e 1 semínima. Finalizei a atividade e os alunos foram para o lanche.

O próximo grupo que veio enquanto o lanche rolava foi uma turma do 2º ano, com a idade de 7 anos mais ou menos. A maioria meninas, começaram a curiar os instrumentos e me perguntar como fazia. Mostrei o som dos instrumentos e, enquanto isso, eles passaram a imitar os meus movimentos com os instrumentos; o grupo demonstrou muita curiosidade e muito apego.

Após o lanche, o 5º A foi para o estande. Como eu não imaginava que teria uma apresentação com uma das turmas com quem eu já tinha trabalhado anteriormente, eu modifiquei o plano: solicitei que a turma se dividisse em grupos de 3, cada membro escolhesse um dos instrumentos que eu tinha (reco-reco, tambor, castanhola, pau de chuva), e eles deveriam cantar e tocar uma música. O primeiro grupo das meninas escolheu "Alecrim", o segundo grupo de meninas escolheu "Chapéu de Palha" e já o último grupo de meninos escolheu "Marcha Soldado". O grupo dos meninos apresentou mais dificuldade, então fui repassando a música com eles, passando cada ritmo que eles podiam fazer. Tinha um dos alunos que estava com mais dificuldade de seguir o ritmo; trocamos o instrumento dele com o de outro colega, ficou com o reco-reco e conseguiu melhorar sua percepção. O grupo que escolheu "Chapéu de Palha" estava tudo tranquilo. Já no grupo que escolheu "Alecrim", mudei o ritmo do reco-reco. Para finalizar, eu fiz uma encenação de apresentação, como se estivéssemos em um palco: me apresentei, trabalhei a postura no palco e também o contato com o público. Pedi para cada grupo apresentar. Primeiro foi o grupo do "Alecrim" e, por conta de elas terem sido as primeiras, os outros grupos começaram a conversar para ajustar como seria a apresentação deles, e isso dificultou na hora da apresentação. Então, após a apresentação das meninas, eu conversei sobre a postura da plateia. Depois chamei os outros grupos para apresentar. Após as apresentações, eu conversei sobre a apresentação, perguntei sobre a facilidade de apresentar e depois perguntei sobre como seria a reação se eles tivessem apresentado para a escola toda; a reação foi de recusar na hora. Conversamos sobre os empecilhos de se apresentar para um público, então trabalhei com eles o conceito de apresentar uma arte, falei sobre minha experiência de ser violinista e ter que engolir a timidez para poder apresentar meu instrumento. Após isso, guardamos os instrumentos e encerramos a aula.` },
      { tipo: `galeria`, legenda: `O estande de Música na feira e a partitura de “O Cravo Brigou com a Rosa”.`, itens: [
        { url: `midia/relatos/r4-estande.webp`, legenda: `Estande de Música na feira` },
        { url: `midia/relatos/r4-partitura.webp`, legenda: `Partitura de “O Cravo Brigou com a Rosa”` },
      ] },
    ],
  },

  // ── Relato de Aula 5 ────────────────────────────────────────
  'relato-5': {
    numero: '5',
    data: '27/10/2026',
    turma: '5º A e 5º B',
    resumo: `Formação dos grupos e escolha das músicas para a apresentação final.`,
    blocos: [
      { tipo: `subtitulo`, texto: `Turma 5º B` },
      { tipo: `texto`, texto: `Relembrei os conceitos de pulso, ritmo, as figuras rítmicas e os estilos musicais. Como a aula anterior com essa turma foi meio conturbada por conta do interclasse, reexpliquei como seriam as próximas aulas, apresentei os instrumentos novamente e pedi para a turma se dividir em 4 grupos de 5. Como essa turma tinha 20 pessoas, levei 4 garrafas de vidro com garfinhos para serem usados como instrumentos similares de vidro. Pedi para eles escolherem as músicas que gostariam de apresentar:

• 1º Grupo das meninas: "Você Não Sabe o Que Pode Fazer um Negro"
• 2º Grupo das meninas: "Fica" (Anavitória)
• 3º Grupo dos meninos: "Marcha Soldado"
• 4º Grupo dos meninos: "Vem Cá Neném".

Deixei eles ensaiando a música e escolhendo; após isso, recolhi os instrumentos.` },
      { tipo: `subtitulo`, texto: `Turma 5º A` },
      { tipo: `texto`, texto: `A turma estava agitada e a aula foi uma aula reduzida. Fiz a recapitulação dos assuntos anteriores e separei os grupos em 2 grupos de 4 e 2 grupos de 3. Tive dificuldade para formar os grupos dos meninos, visto que eles estavam sempre brigando entre si. Mostrei os instrumentos e fiz a mesma dinâmica, porém não chegamos a escolher a música como a outra turma; deixamos para escolher na próxima aula. Recolhi os instrumentos e finalizei a aula.` },
    ],
  },

  // ── Relato de Aula 6 ────────────────────────────────────────
  'relato-6': {
    numero: '6',
    data: '10/11/2026',
    turma: '5º A e 5º B',
    resumo: `Escrita dos ritmos de cada instrumento na pauta e ensaios em grupo.`,
    blocos: [
      { tipo: `subtitulo`, texto: `Turma 5º A` },
      { tipo: `texto`, texto: `Separei os grupos divididos na aula anterior. Do grupo dos meninos faltaram 4 pessoas; já as meninas estavam mais preparadas, levaram a letra escrita à mão para cantar em grupo. O professor Hélio ficou acompanhando um dos grupos dos meninos e eu fiquei acompanhando o outro grupo dos meninos. As músicas escolhidas foram: Meninas grupo 1: "Te Encontrar" (Claudinho e Buchecha); Meninas grupo 2: "Aliança" (Tribalistas); Meninos grupo 3: "Tomara" ; Meninos grupo 4: "Alecrim". Depois eu entreguei a eles uma folha com as pautas musicais e instruí eles a escreverem quais eram as figuras rítmicas que queriam que cada instrumento fizesse durante a música, usando as figuras trabalhadas anteriormente. Eu tive que passar de mesa em mesa para fazer a parte da escrita junto com eles. Os grupos das meninas tiveram um bom desenvolvimento; já os dos meninos precisei estimular e impulsionar para eles fazerem: enquanto eu batia o pulso, eles iam escolhendo as melodias rítmicas de cada instrumento. Eles tiveram muita dificuldade de vincular o ritmo que queriam com o pulso da música. No fim, eu recolhi as partituras.` },
      { tipo: `subtitulo`, texto: `Turma 5º B` },
      { tipo: `texto`, texto: `Entrei na sala e separei os grupos que já estavam demarcados da aula anterior; as músicas já estavam escolhidas. A turma já estava pronta para ensaiar. Desenhei uma pauta no quadro e expliquei como seria a apresentação na próxima aula, e expliquei o que era performance. Eles já tinham decidido os instrumentos. Tivemos alguns alunos que faltaram e tivemos que nos adaptar para dar certo, mas como a turma tem mais alunos, ainda deu para manter os grupos. Tentei ser mais explicativa em relação a como eu queria a parte da escrita nas pautas, porém ainda tive que passar de grupo em grupo fazendo junto com eles a escrita de cada ritmo instrumental. Um dos grupos dos meninos trocou a música "Vem Cá Neném" por ter xingamento; eles mudaram para a música "Eu Não Tenho Cabelo". Eles ainda estavam com dificuldade e eu fui repassando um por um. Os grupos ainda confundiam o ritmo do pulso; pedi para pelo menos um do grupo ficar batendo o pulso. O outro grupo dos meninos, que era "Marcha Soldado", tentou mudar a música para uma que não tinha letra, porém pedi para manter a anterior, visto que eu gostaria de trabalhar as letras. As meninas trocaram a música de "Fica" (Anavitória) para "Te Espero" (Luan Santana). Eles ensaiaram várias vezes, passei várias vezes em cada grupo para acompanhar os ensaios, recolhi os instrumentos e finalizei a aula.` },
      { tipo: `imagem`, url: `midia/relatos/r6-quadro.webp`, legenda: `Ritmo do tambor escrito na pauta, com as figuras rítmicas.` },
    ],
  },

  // ── Relato de Aula 7 ────────────────────────────────────────
  'relato-7': {
    numero: '7',
    data: '17/11/2026',
    turma: '5º A e 5º B',
    resumo: `Ensaio final e apresentações dos grupos entre as turmas.`,
    blocos: [
      { tipo: `subtitulo`, texto: `Turma 5º B` },
      { tipo: `texto`, texto: `O professor Hélio me informou que a turma estava com 7 alunos faltando e tive que reavaliar a forma que eles iam se dividir. Cheguei na turma e expliquei como seria a dinâmica de ensaio, apresentação e avaliação. Por conta da quantidade, eu separei os meninos continuando os mesmos grupos, porém juntei o grupo das meninas; só tinha 4 meninas, sendo 3 de um grupo e 1 de um outro, juntei elas, só tinha um grupo completo. Os grupos dos meninos escolheram mudar a música: o primeiro grupo, que tinha "Vem Cá Neném", ficou com "Alecrim Dourado", e as meninas cantaram a primeira parte de "Se Essa Rua Fosse Minha". Ensaiamos e passei de grupo em grupo. Depois eu fui na turma do 5º A, preparei a turma para receber a outra turma, falei sobre a postura da plateia e chamei a turma para a sala. Fizemos as 3 apresentações; eles ficaram muito tímidos, demoraram para começar, mas depois ocorreu tudo perfeitamente. Depois retornamos para a sala e entreguei a avaliação para a professora; expliquei para a turma que eles poderiam responder como quisessem. Como já tinha dado o horário do lanche, pedi para a professora me entregar as avaliações respondidas depois. Me despedi da turma, agradeci pela oportunidade que eles me deram e elogiei a evolução de todos. Finalizei a aula.` },
      { tipo: `subtitulo`, texto: `Turma 5º A` },
      { tipo: `texto`, texto: `Foi mais complicado: os meninos estavam mais agitados e eu demorei para aquietar os meninos; já as meninas estavam organizadas. Passei em cada grupo para trabalhar cada ritmo dos instrumentos. Eles destruíram os instrumentos; tive que remendar vários instrumentos por conta de terem sido quebrados, usei fita. Tive que sentar em cada grupo, principalmente no grupo dos meninos em que um dos alunos tinha mais dificuldade. Trabalhamos a música "Tomara", do Pablo. Os demais do grupo tinham menos paciência para esse aluno, porém ele conseguiu se adequar. Fui no 5º B, preparei a turma para receber a outra, falei sobre a postura da plateia e chamei o 5º A. Quando a turma estava entrando na sala, a diretora também foi assistir com outra professora. Eles apresentaram as músicas, mas fugiram dos ritmos que escreveram na pauta. A diretora tirou um tempo para elogiar a turma do 5º A, principalmente o grupo dos meninos que normalmente são os mais agitados. Voltei para a outra sala com os alunos e entreguei a avaliação; eles responderam e eu finalizei a aula.` },
      { tipo: `subtitulo`, texto: `Apresentações` },
      { tipo: `video`, url: `midia/relatos/r7-video-1.mp4`, drive: `https://drive.google.com/file/d/1VVVgMNko9PKDYRVS9Ig9wsw2hrQx6HjC/view`, poster: `midia/relatos/r7-video-1-capa.webp`, legenda: `Apresentação dos grupos — vídeo 1 de 7.` },
      { tipo: `video`, url: `midia/relatos/r7-video-2.mp4`, drive: `https://drive.google.com/file/d/17O2Pt80T77xtJazrpDe5YO8c9a5ly2vg/view`, poster: `midia/relatos/r7-video-2-capa.webp`, legenda: `Apresentação dos grupos — vídeo 2 de 7.` },
      { tipo: `video`, url: `midia/relatos/r7-video-3.mp4`, drive: `https://drive.google.com/file/d/1t5gKHO-xYJ4yvq2HN9BeM5iSixRrS5cg/view`, poster: `midia/relatos/r7-video-3-capa.webp`, legenda: `Apresentação dos grupos — vídeo 3 de 7.` },
      { tipo: `video`, url: `midia/relatos/r7-video-4.mp4`, drive: `https://drive.google.com/file/d/1cCG4pOMTQIkVLNwNKiIl_b6lA607vwyz/view`, poster: `midia/relatos/r7-video-4-capa.webp`, legenda: `Apresentação dos grupos — vídeo 4 de 7.` },
      { tipo: `video`, url: `midia/relatos/r7-video-5.mp4`, drive: `https://drive.google.com/file/d/1a_vm6nNKFr1wANiICsXq729dv6nIlxSD/view`, poster: `midia/relatos/r7-video-5-capa.webp`, legenda: `Apresentação dos grupos — vídeo 5 de 7.` },
      { tipo: `video`, url: `midia/relatos/r7-video-6.mp4`, drive: `https://drive.google.com/file/d/1V1QYE4EWRuSFMXZg-IC0GFNbbMxXorXp/view`, poster: `midia/relatos/r7-video-6-capa.webp`, legenda: `Apresentação dos grupos — vídeo 6 de 7.` },
      { tipo: `video`, url: `midia/relatos/r7-video-7.mp4`, drive: `https://drive.google.com/file/d/124CMBTEIjkgO1CGflbPzbqlR3zJ0-_ly/view`, poster: `midia/relatos/r7-video-7-capa.webp`, legenda: `Apresentação dos grupos — vídeo 7 de 7.` },
    ],
  },

  // ── Minhas Considerações e Observações ──────────────────────
  'consideracoes': {
    blocos: [
      // { tipo: 'subtitulo', texto: '' },
      { tipo: 'texto', texto: `` },
      // { tipo: 'imagem', url: 'midia/arquivo.jpg', legenda: '', alt: '' },
      // { tipo: 'video',  url: 'midia/arquivo.mp4', legenda: '' },
      // { tipo: 'galeria', legenda: '', itens: [
      //     { url: 'midia/foto-1.jpg', legenda: '' },
      //     { url: 'midia/foto-2.jpg', legenda: '' },
      // ] },
    ],
  },

  // ── Bibliografia ────────────────────────────────────────────
  'bibliografia': {
    referencias: [
      // A ordem alfabética é feita pelo site; escreva na ordem que quiser.
      // { texto: 'SOBRENOME, Nome. Título da obra. Cidade: Editora, 2020.', link: '' },
    ],
  },

}
