// Cena 5: sala de segurança
var fiosCortados = ler("fiosCortados");
var ordemFios = ["vermelho", "azul", "verde"];

function clicarCaixa() {
  if (foi("energiaLigada")) {
    falar("A energia está ligada.");
  } else if (itemSelecionado() === "fusivel") {
    perder("fusivel");
    marcar("energiaLigada");
    falar("As luzes piscam. A energia voltou, mas o ar fica mais frio.");
    registrarDiario("Ação: energia religada na caixa de fusíveis.");
  } else {
    falar("A caixa está sem fusível. Selecione o fusível encontrado no corredor.");
  }
}

function clicarTerminal() {
  if (!foi("energiaLigada")) {
    falar("O terminal está sem energia.");
  } else if (foi("terminalLiberado")) {
    falar("Acesso liberado. A gaveta já pode ser aberta.");
  } else if (foi("terminalBloqueado")) {
    falar("Terminal bloqueado. Use a alavanca no corredor para reiniciá-lo.");
  } else {
    pegar("in-terminal").value = "";
    abrirPainel("terminal");
  }
}

function tentarTerminal() {
  if (pegar("in-terminal").value.trim() === "0713") {
    marcar("terminalLiberado");
    marcar("gavetaDestrancada");
    fecharPainel();
    falar("Acesso liberado. A gaveta eletrônica destravou.");
    registrarDiario("Ação: terminal desbloqueado com a senha 0713.");
    return;
  }

  var erros = ler("errosTerminal") + 1;
  gravar("errosTerminal", erros);
  falar("Senha incorreta (" + erros + "/2).");
  if (erros >= 2) {
    marcar("terminalBloqueado");
    marcar("gavetaBloqueada");
    fecharPainel();
    falar("Terminal bloqueado. A alavanca do corredor pode reiniciá-lo.");
    registrarDiario("Erro: terminal bloqueado após duas tentativas; reinicie-o no corredor.");
  }
}

function clicarGaveta() {
  if (foi("gavetaBloqueada")) {
    falar("A gaveta travou junto com o terminal.");
  } else if (!foi("gavetaDestrancada")) {
    falar("A gaveta aguarda a senha correta no terminal.");
  } else if (foi("cartaoPego")) {
    falar("A gaveta está vazia.");
  } else {
    marcar("cartaoPego");
    ganhar("cartao");
    falar("A gaveta desliza e revela um cartão de acesso.");
    registrarDiario("Ação: cartão de acesso obtido.");
  }
}

function clicarFios() {
  if (foi("laserDesligado")) {
    falar("Os fios já foram cortados e o laser está desligado.");
    return;
  }
  if (!foi("fiosIniciados")) {
    marcar("fiosIniciados");
    registrarDiario("Pista: os fios expostos do laser podem ser desligados na ordem indicada pelo relógio.");
  }
  pegar("fios-contagem").textContent = fiosCortados;
  abrirPainel("fios");
}

function cortarFio(cor) {
  if (cor === ordemFios[fiosCortados]) {
    fiosCortados++;
    gravar("fiosCortados", fiosCortados);
    pegar("fios-contagem").textContent = fiosCortados;
    if (fiosCortados === ordemFios.length) {
      marcar("laserDesligado");
      fecharPainel();
      falar("O laser da saída se apaga.");
      registrarDiario("Ação: fios cortados na ordem indicada pelo relógio.");
    }
    return;
  }

  fiosCortados = 0;
  gravar("fiosCortados", 0);
  pegar("fios-contagem").textContent = 0;
  fecharPainel();
  falar("Faíscas! A ordem estava errada. Tente novamente.");
  registrarDiario("Erro: a ordem dos fios estava incorreta.");
}

iniciarPagina();
