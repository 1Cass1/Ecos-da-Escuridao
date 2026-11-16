# A Luz que Resta — site/wiki

Este pacote contém um site em HTML e CSS com 13 páginas, imagens das cenas do jogo e um formulário de contato demonstrativo.

## Como organizar com o jogo

1. Extraia a pasta `a_luz_que_resta_site` para a mesma pasta onde estão os arquivos do jogo.
2. A organização esperada é:

   ```
   projeto/
   ├── jogo.html
   ├── jogo.css
   ├── jogo.js
   └── a_luz_que_resta_site/
       ├── index.html
       ├── sobre.html
       ├── jogar.html
       ├── historia.html
       ├── salas.html
       ├── quarto.html
       ├── corredor.html
       ├── seguranca.html
       ├── arquivo-morto.html
       ├── oficina.html
       ├── lanterna.html
       ├── controles.html
       ├── contato.html
       ├── style.css
       ├── script.js
       └── assets/
   ```

3. Abra `a_luz_que_resta_site/index.html` no navegador.
4. Os botões **Jogar** apontam para `../jogo.html`. Se o seu jogo estiver em outro local, altere o caminho nos links que contêm `../jogo.html`.

## Configurar o contato

Abra `script.js` e troque:

```js
const EMAIL_DESENVOLVEDORES = "seuemail@exemplo.com";
```

pelo e-mail real da equipe. O formulário prepara uma mensagem no aplicativo de e-mail do visitante. Ele não envia mensagens por conta própria nem armazena dados.

## Personalização

- Cores, fontes, espaçamentos e layout: `style.css`.
- Textos e imagens de cada página: arquivos `.html`.
- Imagens: pasta `assets/`.

## Páginas incluídas

1. Início (`index.html`)
2. Sobre o jogo (`sobre.html`)
3. Acesso para jogar (`jogar.html`)
4. História (`historia.html`)
5. Salas e ambientes (`salas.html`)
6. Quarto (`quarto.html`)
7. Corredor (`corredor.html`)
8. Segurança e Monitoramento (`seguranca.html`)
9. Arquivo Morto (`arquivo-morto.html`)
10. Oficina (`oficina.html`)
11. Lanterna (`lanterna.html`)
12. Controles (`controles.html`)
13. Contato (`contato.html`)

O pacote entrega 13 páginas HTML, além do jogo separado.
