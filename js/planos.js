// ═══════════════════════════════════════════════════════════════════
//  PLANOS DE AULA — cada página exibe o próprio arquivo do plano.
//  arquivo: o PDF dentro de midia/planos/
//  drive:   link do mesmo arquivo no Google Drive
//  titulo e data aparecem na lista de planos e no botão do relato.
// ═══════════════════════════════════════════════════════════════════

const DRIVE = (id) => 'https://drive.google.com/file/d/' + id + '/view'

window.PLANOS = {
  'plano-1': { titulo: 'Introdução às células rítmicas',        data: '22/09/2026',
    arquivo: 'midia/planos/plano-1.pdf', drive: DRIVE('1kX-SgqtDLVt1dGGX7qeXZd6I95TbTHv0') },
  'plano-2': { titulo: 'Canto e ritmo ao mesmo tempo',          data: '29/09/2026',
    arquivo: 'midia/planos/plano-2.pdf', drive: DRIVE('1k92jkKTWo55OGqBHpNLqkxBqaANgdOjH') },
  'plano-3': { titulo: 'Ritmos brasileiros e percussão',        data: '06/10/2026',
    arquivo: 'midia/planos/plano-3.pdf', drive: DRIVE('1p4lQXcyq_KW36pncti4Ojs9rHUVcInfz') },
  'plano-4': { titulo: 'Feira de Disciplinas: oficina musical', data: '13/10/2026',
    arquivo: 'midia/planos/plano-4.pdf', drive: DRIVE('11c0zbDcSOm87mVBZwDDjieQtsTffIm_t') },
  'plano-5': { titulo: 'Construindo acompanhamentos rítmicos',  data: '27/10/2026',
    arquivo: 'midia/planos/plano-5.pdf', drive: DRIVE('1agp8m4PdSTZtK3uMCtoLTD6ie88Ccm8Y') },
  'plano-6': { titulo: 'Ensaio: canto e percussão juntos',      data: '10/11/2026',
    arquivo: 'midia/planos/plano-6.pdf', drive: DRIVE('1uRwRfCjqGfvNvSicceB4cp4jlDRoxCjV') },
  'plano-7': { titulo: 'Apresentação final',                    data: '17/11/2026',
    arquivo: 'midia/planos/plano-7.pdf', drive: DRIVE('1DvkS2fflLnSeVR-I39EPfx8gzhpNweX_') },
}
