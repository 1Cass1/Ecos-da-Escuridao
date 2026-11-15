var escolhaDepoisRitmo = "";
var origemRitmo = null;
var faseRitmo = "parado";
var temposBatidas = [];
var timerPreviewRitmo;
var timerRespostaRitmo;
var timerSinalRitmo;
var espacoPressionado = false;

function abrirDesafioBatidas(escolha) {
  if (puzzles.ritmo.estado === "resolvido") {
    falar("O ritmo foi reconhecido. Agora escolha seu desfecho.");
    return;
  }

  escolhaDepoisRitmo = escolha || "";
  origemRitmo = document.activeElement;
  faseRitmo = "parado";
  temposBatidas = [];
  pegar("ritmo-progresso").textContent = "Pronto para mostrar a sequência.";
  apagarSinaisRitmo();
  pegar("botao-mostrar-ritmo").disabled = false;
  pegar("botao-batida-manual").disabled = true;
  pegar("minigame-ritmo").hidden = false;
  pegar("botao-mostrar-ritmo").focus();
}

function apagarSinaisRitmo() {
  var sinais = document.querySelectorAll(".pulso-ritmo");
  for (var i = 0; i < sinais.length; i++) sinais[i].classList.remove("aceso");
}

function mostrarBatida(indice) {
  var sinais = document.querySelectorAll(".pulso-ritmo");
  apagarSinaisRitmo();
  sinais[indice].classList.add("aceso");
  clearTimeout(timerSinalRitmo);
  timerSinalRitmo = setTimeout(function () {
    sinais[indice].classList.remove("aceso");
  }, 220);
}

function mostrarSequenciaRitmo() {
  if (faseRitmo === "mostrando") return;
  clearTimeout(timerPreviewRitmo);
  clearTimeout(timerRespostaRitmo);
  clearTimeout(timerSinalRitmo);
  apagarSinaisRitmo();
  faseRitmo = "mostrando";
  pegar("botao-mostrar-ritmo").disabled = true;
  pegar("botao-batida-manual").disabled = true;
  pegar("ritmo-progresso").textContent = "Observe os sinais...";
  mostrarBatida(0);
  agendarProximaBatida(0);
}

function agendarProximaBatida(indice) {
  timerPreviewRitmo = setTimeout(function () {
    if (faseRitmo !== "mostrando") return;
    mostrarBatida(indice + 1);
    if (indice + 1 < puzzles.ritmo.intervalos.length) {
      agendarProximaBatida(indice + 1);
    } else {
      timerPreviewRitmo = setTimeout(iniciarRespostaRitmo, 650);
    }
  }, puzzles.ritmo.intervalos[indice]);
}

function iniciarRespostaRitmo() {
  faseRitmo = "respondendo";
  temposBatidas = [];
  pegar("botao-mostrar-ritmo").disabled = true;
  pegar("botao-batida-manual").disabled = false;
  pegar("ritmo-progresso").textContent = "Agora repita as batidas: 0 de 3.";
  pegar("botao-batida-manual").focus();
  timerRespostaRitmo = setTimeout(falharRitmo, 4000);
}

function registrarBatida() {
  if (faseRitmo !== "respondendo") return;

  temposBatidas.push(Date.now());
  pegar("ritmo-progresso").textContent =
    "Batidas registradas: " + temposBatidas.length + " de 3.";
  clearTimeout(timerRespostaRitmo);

  if (temposBatidas.length < 3) {
    timerRespostaRitmo = setTimeout(falharRitmo, 2000);
    return;
  }

  var intervalos = [
    temposBatidas[1] - temposBatidas[0],
    temposBatidas[2] - temposBatidas[1],
  ];
  avaliarRitmo(intervalos);
}

function falharRitmo() {
  if (faseRitmo !== "respondendo") return;
  avaliarRitmo([]);
}

function avaliarRitmo(intervalos) {
  clearTimeout(timerRespostaRitmo);
  faseRitmo = "parado";
  var mensagem = puzzles.ritmo.tentar(intervalos);
  salvarEstado();

  if (puzzles.ritmo.estado === "resolvido") {
    pegar("minigame-ritmo").hidden = true;
    pegar("botao-batida-manual").disabled = true;
    var escolha = escolhaDepoisRitmo;
    var origem = origemRitmo;
    escolhaDepoisRitmo = "";
    if (origem) origem.focus();
    if (escolha) pedirConfirmacaoFinal(escolha);
    else falar(mensagem);
    return;
  }

  if (puzzles.terminal.alarme >= limiteAlarme) {
    encerrarPartida("");
    return;
  }

  pegar("ritmo-progresso").textContent =
    mensagem + " Observe e tente novamente.";
  pegar("botao-mostrar-ritmo").disabled = false;
  pegar("botao-batida-manual").disabled = true;
  pegar("botao-mostrar-ritmo").focus();
}

function fecharMinigameRitmo() {
  clearTimeout(timerPreviewRitmo);
  clearTimeout(timerRespostaRitmo);
  clearTimeout(timerSinalRitmo);
  apagarSinaisRitmo();
  faseRitmo = "parado";
  escolhaDepoisRitmo = "";
  pegar("minigame-ritmo").hidden = true;
  if (origemRitmo) origemRitmo.focus();
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
  if (puzzles.ritmo.estado !== "resolvido") {
    abrirDesafioBatidas(escolha);
    return;
  }

  escolhaConfirmacaoFinal = escolha;
  focoAntesConfirmacao = document.activeElement;

  var titulo = pegar("titulo-confirmacao-final");
  var texto = pegar("texto-confirmacao-final");
  var botao = pegar("confirmar-final");

  if (escolha === "medalhao") {
    titulo.textContent = "O espelho chama";
    texto.textContent =
      "Entregar o medalhão pode mudar seu destino. Você tem certeza?";
    botao.textContent = "Entregar medalhão";
  } else if (escolha === "fugir") {
    titulo.textContent = "Sair da casa?";
    texto.textContent =
      "Atravessar esta porta encerra a partida com um final de fuga. Tem certeza?";
    botao.textContent = "Fugir pela porta";
  } else {
    titulo.textContent = "Ficar na casa?";
    texto.textContent =
      "Ficar encerra a partida e leva a um final. Tem certeza de que quer ficar?";
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
  encerrarPartida(escolhaConfirmacaoFinal);
}

document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape") {
    if (!pegar("confirmacao-final").hidden) fecharConfirmacaoFinal();
    else if (!pegar("minigame-ritmo").hidden) fecharMinigameRitmo();
    return;
  }

  if (
    evento.code === "Space" &&
    !pegar("minigame-ritmo").hidden &&
    faseRitmo === "respondendo"
  ) {
    evento.preventDefault();
    if (!espacoPressionado) {
      espacoPressionado = true;
      registrarBatida();
    }
  }
});

document.addEventListener("keyup", function (evento) {
  if (evento.code === "Space") espacoPressionado = false;
});

iniciarPagina();
