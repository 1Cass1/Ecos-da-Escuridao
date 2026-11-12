# Ecos da Escuridão

Escape room em HTML, CSS e JavaScript. A casa permanece no escuro durante toda a partida. A lanterna ilumina os cenários conforme o jogador move o mouse.

## Mapa e arquivos

| Página | Cena | Fundo em `images/` |
| --- | --- | --- |
| `cena1.html` | Quarto | `quarto.png` |
| `cena2.html` | Subsolo | `subsolo.png` |
| `cena3.html` | Corredor | `corredor.png` |
| `cena4.html` | Sala de Segurança | `seguranca.png` |
| `cena5.html` | Armazém | `armazem.png` |
| `cena6.html` | Saída | `saida.png` |

Comece em `index.html`. O Quarto leva ao Subsolo e, depois que a porta é destrancada, ao Corredor. Pelo Corredor, o jogador pode voltar ao Quarto ou seguir para a Sala de Segurança, para o Armazém ou pela porta da frente até a Saída. `final.html` mostra o desfecho.

O botão **Porta da frente** abre o terminal do Corredor. O terminal libera a Saída depois que os monitores estiverem ligados e a senha for inserida.

## Enigmas e história

- No Subsolo, encontre a chave de fenda. Selecione-a e gire o parafuso do bueiro três vezes para a esquerda. A chave de latão encontrada na grade abre a porta do Quarto.
- O alicate abre a caldeira. O relatório contém o pingente e explica a ligação entre a guardiã e a meia-lua riscada na moldura do retrato do Corredor.
- O diário no Quarto guarda a corrente. Selecione a corrente e o pingente em sequência para montar o medalhão. O desfecho reconhece quem chega à Saída com o medalhão montado.
- Na Sala de Segurança, pegue o pé de cabra e selecione-o para abrir a porta emperrada do Armazém. Pegue a bateria na bancada, volte à Sala de Segurança e selecione a bateria para conectar a qualquer um dos quatro monitores.
- Os canais 01 a 04 mostram Quarto, Subsolo, Corredor e Armazém, nessa ordem. Em cada câmera, ligue o filtro UV para descobrir um dígito. Digite a sequência no terminal do Corredor.
- Na Saída, `audio/batidas-dutos.wav` reproduz dois grupos de três batidas quando o navegador permite reprodução automática. A legenda descreve o eco.

## Organização do código

- `js/jogo.js` reúne progresso, inventário, diário, painéis e lanterna.
- `camera.html` e `js/camera.js` controlam a visualização e o filtro UV. `js/cameras.js` reúne a ordem, as imagens, os dígitos e suas posições, e fornece a senha ao terminal.
- Os scripts das cenas cuidam das interações locais. `js/cena6.js` define o final e `js/final.js` exibe o desfecho.
- `css/base.css` define cores e botões. `css/cena.css` cuida do palco e da lanterna. `css/hud.css` estiliza o inventário, o diário e os painéis.
- O progresso fica no `localStorage` com o prefixo `ecos:`. Começar de novo apaga somente as chaves do jogo.
- O inventário fica no canto superior esquerdo do palco nas seis cenas. O item selecionado acompanha o jogador entre as salas.

## Cenários e sprites

Mantenha a pasta `images/` do projeto junto aos HTMLs. Use fundos com proporção 16:9 e confira os nomes na tabela. O fundo do Armazém deve estar em `images/armazem.png`. Para usar outro caminho, atualize `cena5.html` e `js/cameras.js`.

Os campos usam posições em porcentagem sobre o palco. As câmeras usam os mesmos quatro fundos indicados na tabela, com o dígito sobreposto pelo código. Para conferir a posição dos campos, adicione temporariamente `class="debug"` ao `body`.

Coloque os PNGs dos equipamentos em `images/objetos/`. O pé de cabra usa `pe-de-cabra.png`, e o terminal usa `terminal-senha.png`. Os monitores 01 a 04 usam `monitor-01.png`, `monitor-02.png`, `monitor-03.png` e `monitor-04.png`, na ordem Quarto, Subsolo, Corredor e Armazém. Cada área clicável fica transparente até que a imagem correspondente esteja na pasta.

## Como testar

Abra `index.html` pelo Live Server ou sirva a pasta com `python -m http.server 8000` e acesse `http://localhost:8000`. Teste uma partida montando o medalhão e outra resolvendo o caminho das câmeras até a Saída sem montar o medalhão.
