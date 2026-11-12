# Ecos da Escuridão

Escape room feito com HTML, CSS e JavaScript. Os cliques ficam definidos nos elementos do HTML.

## Arquivos
- `index.html`: tela inicial. `final.html`: mostra o final.
- `cena1.html` Quarto, `cena2.html` Subsolo, `cena3.html` Corredor, `cena4.html` Biblioteca, `cena5.html` Sala de Segurança, `cena6.html` Saída.
- `js/jogo.js`: funções usadas por todas as cenas (inventário, mensagens, diário e finais).
- `js/cena1.js` até `js/cena6.js`: interações e enigmas de cada ambiente.
- `js/final.js`: textos dos finais. Os HTMLs contêm a estrutura e carregam seus scripts no fim da página.
- `css/base.css` (cores e botões), `css/cena.css` (cena, áreas clicáveis e lanterna), `css/hud.css` (inventário e painéis).

## Como funciona
Cada cena é uma página. O jogo guarda itens e pistas no `localStorage` do navegador para manter o progresso ao trocar de cena.
Para testar, use a extensão Live Server do VS Code ou o link da Vercel.

## Imagens de fundo
Coloque na pasta `images/` com estes nomes (ou troque o nome no `style` do `#palco` de cada cena):
`quarto1.jpg` (cena1), `subsolo.png` (cena2), `corredor.png` (cena3), `biblioteca.png` (cena4), `seguranca.png` (cena5), `saida.png` (cena6).
O palco tem sempre a proporção 16:9 (`aspect-ratio` no `cena.css`) e uma moldura em volta, então o fundo não estica. Use imagens 16:9, por exemplo 1920x1080.

## Campos clicáveis
Cada campo é uma `<div class="campo">` com `left`, `top`, `width` e `height` em % no `style`.
Com `class="debug"` no `<body>` os campos ganham contorno e a lanterna é desligada. Apague a classe no final.

## Sprites e brilho
- Sprite recortado: tire o comentário da linha `<img>` dentro do campo e ajuste `left/top/width/height` para cobrir o objeto.
  Cálculo: `left = x / largura_do_fundo * 100`, `top = y / altura_do_fundo * 100`, `width = w / largura_do_fundo * 100`, `height = h / altura_do_fundo * 100`.
- Sprite do tamanho da cena (PNG com o mesmo tamanho do fundo): coloque `<img class="sprite" src="images/objetos/nome.png">` logo DEPOIS da div do campo.
- Ao passar o mouse o objeto brilha (`drop-shadow` na regra `.campo:hover img` do `cena.css`). A cor do brilho é `--brilho` no `base.css`.

## Lanterna
A casa permanece no escuro durante toda a partida. A lanterna é a única fonte de iluminação dos cenários. Seu alcance é controlado por `--luz-claro` e `--luz-escuro` no `css/base.css`.

## Organização do JavaScript
- `jogo.js` cuida dos dados salvos, mensagens, painéis, inventário, diário e finais.
- `cenaN.js` contém apenas as interações daquele ambiente e chama `iniciarPagina()` no fim.
- `final.js` escolhe o texto do desfecho salvo.
- Os eventos do jogo ficam nos elementos HTML, usando atributos como `onclick` e `onmousemove`.

### Progresso
`gravar` e `lerTexto` salvam e leem textos; `ler` lê números. `marcar`, `foi` e `desmarcar` controlam acontecimentos como abrir uma porta.
Todas as chaves novas começam com `ecos:`. Reiniciar remove apenas os dados deste jogo.

### Inventário, diário e desafios
Clique em um item para selecioná-lo e novamente para guardá-lo. Clique em outro para trocar a seleção. Corrente e pingente se combinam automaticamente quando selecionados em sequência.
O diário reúne até três informações em cada página. Use as setas para avançar e voltar. Os itens aparecem no canto superior direito e brilham quando selecionados.
As tentativas erradas do terminal persistem ao trocar de página e são zeradas pela alavanca. Fechar o painel de setas cancela o desafio.

## Verificação
Com Node.js instalado, execute:

```sh
node --test tests/jogo.test.cjs
```

Os testes simulam o armazenamento e os elementos usados pelas funções. Eles não substituem a conferência visual no navegador.

Os fundos `biblioteca.png` e `saida.png` ainda precisam ser adicionados à pasta `images/`.


## Enigmas e itens
A partida tem quatro enigmas principais: soltar o bueiro com a chave de fenda, descobrir a senha do terminal, cortar os fios na ordem da pista e repetir a sequência de setas. O diário e o livro fornecem pistas; a porta do porão usa a chave encontrada no bueiro.
A chave de fenda, o alicate, a chave e o cartão são consumidos ao serem usados. Os sprites da chave de fenda, do alicate e do cadeado somem da cena quando deixam de estar disponíveis. O diário entrega a corrente; o pingente vem do retrato. Juntos, os dois itens permitem o final secreto.

Os dispositivos de segurança funcionam independentemente da iluminação da casa. A saída é acessível pelo corredor. Para abrir o portão, desative o laser infravermelho, passe o cartão no leitor e acerte a sequência de setas.
