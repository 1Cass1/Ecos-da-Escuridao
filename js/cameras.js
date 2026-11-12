// A ordem dos canais também define a ordem dos dígitos no terminal.
var cameras = [
  { nome: "Quarto", imagem: "images/quarto.png", digito: "4", x: 29, y: 53 },
  { nome: "Subsolo", imagem: "images/subsolo.png", digito: "8", x: 60, y: 36 },
  { nome: "Corredor", imagem: "images/corredor.png", digito: "2", x: 67, y: 53 },
  { nome: "Armazém", imagem: "images/armazem.png", digito: "7", x: 39, y: 68 }
];

function senhaDoTerminal() {
  return cameras.map(function (camera) { return camera.digito; }).join("");
}
