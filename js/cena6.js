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

iniciarPagina();
