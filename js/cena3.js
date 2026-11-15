function tentarAbrirArmazem() {
  var armazem = puzzles.armazem;
  atualizarAposAcao(armazem.tentar(inventario.selecionado));
  if (armazem.estado === "resolvido") irPara("cena5.html");
}

function clicarRetrato() {
  atualizarAposAcao(puzzles.retrato.tentar(inventario.selecionado));
}

function tentarPortaDaFrente() {
  var terminal = puzzles.terminal;
  if (terminal.estado === "resolvido") {
    irPara("cena6.html");
    return;
  }
  pegar("senha-terminal").value = "";
  pegar("resposta-terminal").textContent = terminal.inspecionar();
  salvarEstado();
  abrirPainel("terminal");
  pegar("senha-terminal").focus();
}

function tentarSenha(evento) {
  evento.preventDefault();
  if (!atualizarRelogio()) return;
  var terminal = puzzles.terminal;
  pegar("resposta-terminal").textContent = terminal.tentar(
    pegar("senha-terminal").value,
  );
  salvarEstado();
  if (terminal.alarme >= limiteAlarme) {
    encerrarPartida("");
  } else if (terminal.estado === "resolvido") {
    pegar("sprite-porta-saida-aberta").hidden = false;
    fecharPainel();
    falar("A porta de saída foi destrancada. Clique nela para sair.");
  }
}

iniciarPagina();
