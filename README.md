# Ecos da Escuridão

Escape room em HTML, CSS e JavaScript. A casa permanece no escuro durante toda a partida. A lanterna ilumina os cenários conforme o jogador move o mouse. O Modo claro reduz a escuridão e os botões podem ser acionados com Tab e Enter.

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

O botão **Porta da frente** abre o terminal do Corredor. O terminal libera a Saída depois que os monitores estiverem ligados e a senha for inserida. Você tem quatro minutos para decidir o que fazer na Saída.

## Enigmas e história

- No Subsolo, encontre a chave de fenda. Selecione-a e gire o parafuso do bueiro três vezes para a esquerda. A chave de latão encontrada na grade abre a porta do Quarto.
- O alicate abre a caldeira. Leia o relatório para descobrir onde o pingente foi escondido. Ele pode estar no próprio papel ou no fundo falso das caixas do Quarto.
- O diário no Quarto guarda a corrente. Selecione a corrente e o pingente em sequência para montar o medalhão. Com ele selecionado, examine o retrato para comparar as marcas da meia-lua.
- Na Sala de Segurança, pegue o pé de cabra para abrir a porta emperrada do Armazém e o fundo falso das caixas do Quarto. Junte o recorte das caixas ao fragmento do retrato para recuperar o bilhete da guardiã.
- Leve a bateria do Armazém à Sala de Segurança. Os canais 01 a 04 mostram Quarto, Subsolo, Corredor e Armazém, nessa ordem. Ative o UV em cada canal para revelar a senha. Um deles também mostra o vulto da Sombra.
- Na Saída, **Ouvir batidas** toca dois grupos de três batidas. O mesmo botão pausa o áudio, e **Silenciar batidas** liga ou desliga o som.

## Finais

| Final | Condição |
| --- | --- |
| Fuga perfeita | Escolher Fugir com pelo menos 1 minuto restante, os quatro dígitos vistos e zero erros no terminal. |
| Fuga com sequelas | Escolher Fugir sem cumprir todos os critérios da fuga perfeita. |
| Captura pelo alarme | Errar a senha três vezes. |
| Captura pelo Breu | Deixar o tempo acabar. |
| O pacto | Montar o medalhão e escolher Usar o medalhão na Saída. |
| Você ficou | Escolher Ficar na Saída. |

## Organização do código

- `js/puzzles.js` define os objetos dos enigmas, do inventário e do diário. As cenas chamam seus métodos e atualizam a tela. Use **Inspecionar** no inventário para ver a descrição do item selecionado.
- `js/partida.js` sorteia a senha, o esconderijo, o canal do vulto e os textos da partida. Também calcula o tempo restante e decide o final. A lanterna perde alcance e a vinheta escurece à medida que o relógio avança.
- `js/jogo.js` atualiza a interface, os painéis, a lanterna e a navegação. `js/cameras.js` fornece os dígitos sorteados para o filtro UV e o terminal. `js/final.js` exibe o desfecho, o tempo gasto e as anotações da partida.
- `css/base.css` define cores e botões. `css/cena.css` cuida do palco e da lanterna. `css/hud.css` estiliza o inventário, o diário e os painéis.
- `salvarEstado()` grava a partida, os enigmas, o inventário e o diário em `ecos:estado`. `carregarEstado()` restaura esses dados ao mudar de página. Começar de novo apaga o progresso e preserva o **Modo claro**.
- O inventário fica no canto superior esquerdo do palco nas seis cenas. O item selecionado acompanha o jogador entre as salas.

## Cenários e sprites

Mantenha a pasta `images/` do projeto junto aos HTMLs. Use fundos com proporção 16:9 e confira os nomes na tabela. O fundo do Armazém deve estar em `images/armazem.png`. Para usar outro caminho, atualize `cena5.html` e `js/cameras.js`.

Os campos usam posições em porcentagem sobre o palco. As câmeras usam os mesmos quatro fundos indicados na tabela, com o dígito sobreposto pelo código. Para conferir a posição dos campos, adicione temporariamente `class="debug"` ao `body`.

Coloque os PNGs dos equipamentos em `images/objetos/`. O pé de cabra usa `pe-de-cabra.png`, e o terminal usa `terminal-senha.png`. Os monitores 01 a 04 usam `monitor-01.png`, `monitor-02.png`, `monitor-03.png` e `monitor-04.png`, na ordem Quarto, Subsolo, Corredor e Armazém. Cada área clicável fica transparente até que a imagem correspondente esteja na pasta.

## Como testar

Abra `index.html` pelo Live Server ou sirva a pasta com `python -m http.server 8000` e acesse `http://localhost:8000`. Confira se o relógio continua ao entrar no Subsolo e ao recarregar a página. Na Saída, experimente Fugir, Ficar e Usar o medalhão em partidas diferentes.
