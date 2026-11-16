# Ecos da Escuridão

Escape room em HTML, CSS e JavaScript puro. O jogador explora uma casa, coleta e combina itens, consulta pistas e tenta escapar em quatro minutos.

## Abrir o projeto

O jogo começa em `index.html`. Para testar como site estático, abra um terminal nesta pasta e rode:

```text
python -m http.server 8000
```

Depois acesse `http://localhost:8000`. O site sobre o jogo fica em `site do jogo/html/home.html` e também tem um link na tela inicial do jogo.

## Páginas do site

O site tem páginas para início, apresentação do jogo, história, cenários, equipe, contato e controles. Os cenários têm páginas próprias para Quarto, Subsolo, Corredor, Sala de Segurança, Armazém e Saída.

Antes da entrega, acrescentem os nomes reais dos integrantes à apresentação da equipe.

## Arquivos principais do jogo

- `js/puzzles.js`: enigmas, inventário, combinações e diário.
- `js/partida.js`: sorteios, tempo e cálculo dos finais.
- `js/jogo.js`: interface, navegação e salvamento no `localStorage`.
- `js/cena*.js`: ações de cada ambiente.
- `js/cena6.js`: minigame visual de ritmo, com teclado e botão.
- `css/`: estilos das cenas, câmeras, inventário e telas.
- `images/`: fundos e sprites.

O projeto não usa frameworks ou bibliotecas JavaScript. Não precisa de etapa de build para hospedagem estática.