function alternarBatidas() {
  var audio = pegar("audio-batidas");
  if (audio.paused) {
    audio.play().catch(function () {
      falar("Não deu para tocar as batidas.");
    });
  } else {
    audio.pause();
  }
}

function atualizarBotaoBatidas() {
  var audio = pegar("audio-batidas");
  pegar("botao-batidas").textContent = audio.paused ? "Ouvir batidas" : "Pausar batidas";
}

function alternarMudo() {
  var audio = pegar("audio-batidas");
  audio.muted = !audio.muted;
  pegar("botao-mudo").setAttribute("aria-pressed", String(audio.muted));
}

function concluirTravessia(escolha) {
  encerrarPartida(escolha);
}

var escolhaConfirmacaoFinal = "";
var focoAntesConfirmacao = null;

function clicarEspelho() {
  if (!inventario.tem("medalhao")) {
    falar("O espelho parece esperar por algo que você ainda não encontrou.");
    return;
  }
  pedirConfirmacaoFinal("medalhao");
}

function clicarPortaFinal() {
  pedirConfirmacaoFinal("fugir");
}

function pedirConfirmacaoFinal(escolha) {
  escolhaConfirmacaoFinal = escolha;
  focoAntesConfirmacao = document.activeElement;

  var titulo = pegar("titulo-confirmacao-final");
  var texto = pegar("texto-confirmacao-final");
  var botao = pegar("confirmar-final");

  if (escolha === "medalhao") {
    titulo.textContent = "O espelho chama";
    texto.textContent = "Entregar o medalhão pode mudar seu destino. Você tem certeza?";
    botao.textContent = "Entregar medalhão";
  } else if (escolha === "fugir") {
    titulo.textContent = "Sair da casa?";
    texto.textContent = "Atravessar esta porta encerra a partida com um final de fuga. Tem certeza?";
    botao.textContent = "Fugir pela porta";
  } else {
    titulo.textContent = "Ficar na casa?";
    texto.textContent = "Ficar encerra a partida e leva a um final. Tem certeza de que quer ficar?";
    botao.textContent = "Sim, vou ficar";
  }

  pegar("confirmacao-final").hidden = false;
  botao.focus();
}

function fecharConfirmacaoFinal() {
  pegar("confirmacao-final").hidden = true;
  if (focoAntesConfirmacao) focoAntesConfirmacao.focus();
}

function confirmarFinal() {
  concluirTravessia(escolhaConfirmacaoFinal);
}

document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape" && !pegar("confirmacao-final").hidden) {
    fecharConfirmacaoFinal();
  }
});

iniciarPagina();
