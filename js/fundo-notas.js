// Fundo animado com figuras rítmicas, só nas áreas verdes.
// Desenha um "azulejo" SVG com as figuras espalhadas e usa como fundo
// de duas camadas que derivam devagar em velocidades diferentes.
;(function () {
  const cor = '#6E9166'
  const H = 30 // altura da haste

  const cab = (x, y, cheia) => `<ellipse cx="${x}" cy="${y}" rx="6.2" ry="4.4" transform="rotate(-22 ${x} ${y})" ${cheia ? `fill="${cor}"` : `fill="none" stroke="${cor}" stroke-width="1.9"`}/>`
  const haste = (x, y) => `<line x1="${x + 5.6}" y1="${y - 1}" x2="${x + 5.6}" y2="${y - H}" stroke="${cor}" stroke-width="1.6"/>`
  const ponto = (x, y) => `<circle cx="${x + 13}" cy="${y}" r="1.9" fill="${cor}"/>`
  const bandeira = (x, y, dy = 0) => `<path d="M${x + 5.6} ${y - H + dy} q1 8 9 12 q-3 -4 -9 -6z" fill="${cor}"/>`
  const viga = (x1, x2, y, dy = 0) => `<rect x="${x1 + 4.8}" y="${y - H + dy}" width="${x2 - x1 + 1.6}" height="3.6" fill="${cor}"/>`
  const nota = (x, y) => cab(x, y, true) + haste(x, y)

  // cada figura desenhada em torno de (0,0)
  const F = [
    () => cab(0, 0, false).replace('stroke-width="1.9"', 'stroke-width="2.6"'),        // semibreve
    () => cab(0, 0, false) + haste(0, 0) + ponto(0, 0),                                // mínima pontuada
    () => cab(0, 0, false) + haste(0, 0),                                              // mínima
    () => nota(0, 0) + ponto(0, 0),                                                    // semínima pontuada
    () => nota(0, 0),                                                                  // semínima
    () => nota(0, 0) + nota(16, 0) + viga(0, 16, 0),                                   // 2 colcheias
    () => nota(0, 0) + bandeira(0, 0),                                                 // colcheia
    () => nota(0, 0) + bandeira(0, 0) + bandeira(0, 0, 7),                             // semicolcheia
    () => nota(0, 0) + nota(16, 0) + viga(0, 16, 0) + viga(0, 16, 0, 6),               // 2 semicolcheias
    () => [0, 14, 28, 42].map(x => nota(x, 0)).join('') + viga(0, 42, 0) + viga(0, 42, 0, 6), // 4 semicolcheias
    () => [0, 14, 28].map(x => nota(x, 0)).join('') + viga(0, 28, 0) + viga(14, 28, 0, 6),    // colcheia + 2 semicolcheias
    () => [0, 14, 28].map(x => nota(x, 0)).join('') + viga(0, 28, 0) + viga(0, 14, 0, 6),     // 2 semicolcheias + colcheia
  ]

  // Azulejo grande (960x960) numa grade 6x6 com deslocamento pseudoaleatório
  // fixo. A ordem das figuras pula de 5 em 5 (5 e 12 não têm divisor comum),
  // então vizinhas nunca são a mesma figura e a sequência não fica óbvia.
  const T = 960, N = 6, C = T / N
  let s = 7; const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280
  const P = []
  for (let l = 0; l < N; l++) for (let c = 0; c < N; c++)
    P.push([c * C + 25 + rnd() * (C - 75) + (l % 2) * C / 2 % C, l * C + 45 + rnd() * (C - 80), -25 + rnd() * 50, .8 + rnd() * .5])
  const tile = (escala, deslocar) => {
    const g = P.map(([x, y, r, k], i) =>
      `<g transform="translate(${x % T} ${y}) rotate(${r.toFixed(1)}) scale(${(escala * k).toFixed(2)})">${F[(i * 5 + (i / N | 0) * 2 + deslocar) % F.length]()}</g>`).join('')
    return `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${T}" height="${T}" viewBox="0 0 ${T} ${T}">${g}</svg>`)}")`
  }

  const camada = document.createElement('div')
  camada.className = 'fundo-notas'
  camada.setAttribute('aria-hidden', 'true')
  camada.innerHTML = '<i></i><i></i>'
  camada.children[0].style.backgroundImage = tile(1, 0)
  camada.children[1].style.backgroundImage = tile(.8, 5)
  document.body.prepend(camada)
})()
