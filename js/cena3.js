function tentarAbrirArmazem() {
  if (!foi("armazemAberto")) {
    if (itemSelecionado() !== "pedecabra" || !foi("tem-pedecabra")) {
      falar("A porta do armazém está emperrada. Talvez haja uma ferramenta na Sala de Segurança.");
      return;
    }
    marcar("armazemAberto");
    perder("pedecabra");
    registrarDiario("O pé de cabra soltou a porta emperrada do armazém.");
  }
  irPara("cena5.html");
}

function tentarPortaDaFrente() {
  if (foi("portaFrenteAberta")) {
    irPara("cena6.html");
    return;
  }
  pegar("senha-terminal").value = "";
  pegar("resposta-terminal").textContent = "";
  abrirPainel("terminal");
  pegar("senha-terminal").focus();
}

function tentarSenha(evento) {
  evento.preventDefault();
  var resposta = pegar("resposta-terminal");
  if (!foi("monitoresLigados")) {
    resposta.textContent = "A central de câmeras está desligada. Ligue os monitores na Sala de Segurança.";
    return;
  }
  if (pegar("senha-terminal").value.trim() !== senhaDoTerminal()) {
    resposta.textContent = "Sequência incorreta. Confira os dígitos dos canais 01 a 04.";
    return;
  }
  marcar("portaFrenteAberta");
  registrarDiario("O terminal liberou a porta da frente.");
  irPara("cena6.html");
}

iniciarPagina();
