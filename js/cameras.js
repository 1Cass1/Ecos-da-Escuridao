// A ordem dos canais também define a ordem dos dígitos no terminal.
var cameras = [
  { nome: "Quarto", imagem: "images/quarto.png", x: 29, y: 53 },
  { nome: "Subsolo", imagem: "images/subsolo.png", x: 60, y: 36 },
  { nome: "Corredor", imagem: "images/corredor.png", x: 67, y: 53 },
  { nome: "Armazém", imagem: "images/armazem.png", x: 39, y: 68 },
];

function digitoDoCanal(canal) {
  return partida.sorteio.digitos[canal - 1];
}

function senhaDoTerminal() {
  return partida.sorteio.digitos.join("");
}
