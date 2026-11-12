// Mostra o final salvo pelo jogo.
var tipo = lerTexto("final");
var titulo = "";
var texto = "";

if (tipo === "perfeito") {
  titulo = "Fuga perfeita";
  texto = "Você cruza o portão sem pressa e com a sanidade intacta. Lá atrás, a Sombra só observa. Ela perdeu.";
} else if (tipo === "secreto") {
  titulo = "Final secreto: o pacto";
  texto = "Você estende o medalhão. A Sombra hesita, reconhece o rosto do retrato e se desfaz em cinzas. Era a guardiã da casa e agora você ocupa o lugar dela.";
} else {
  window.location.href = "index.html";
}

pegar("titulo").textContent = titulo;
pegar("texto").textContent = texto;
