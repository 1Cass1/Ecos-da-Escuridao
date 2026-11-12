// Mostra o final salvo pelo jogo.
var tipo = lerTexto("final");
var titulo = "";
var texto = "";

if (tipo === "perfeito") {
  titulo = "Fuga perfeita";
  texto = "Você atravessa a porta da frente. Do lado de fora, o som dos dutos finalmente cessa. No corredor, a Sombra fica imóvel diante do retrato.";
} else if (tipo === "secreto") {
  titulo = "Final secreto: o pacto";
  texto = "Junto à porta da frente, você estende o medalhão. A Sombra toca a meia-lua riscada, a mesma marca na moldura do retrato do corredor. A antiga guardiã se desfaz em cinzas. Dos dutos, você ouve seu próprio nome. Agora é você quem guarda a casa.";
} else {
  window.location.href = "index.html";
}

pegar("titulo").textContent = titulo;
pegar("texto").textContent = texto;
