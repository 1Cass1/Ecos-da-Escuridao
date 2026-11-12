// Cena 3: corredor
function clicarRelogio() {
  falar('Parado às 3:33. Atrás do mostrador: "VERMELHO, AZUL, VERDE".');
  registrarDiario("Pista: atrás do relógio: ordem dos fios é vermelho, azul, verde.");
}

function clicarQuadro() {
  if (foi("fusivelPego")) {
    falar("Um retrato apagado. Nada mais atrás.");
    return;
  }
  marcar("fusivelPego");
  ganhar("fusivel");
  falar("Atrás do quadro há um fusível enrolado num pano.");
  registrarDiario("Ação: fusível encontrado atrás do quadro.");
}

// A alavanca abre a biblioteca e pode reiniciar o terminal.
function clicarAlavanca() {
  if (!foi("gradeAberta")) {
    marcar("gradeAberta");
    falar("CLANG! A grade da biblioteca sobe, rangendo.");
    registrarDiario("Ação: alavanca puxada. Biblioteca acessível.");
  } else if (foi("terminalBloqueado")) {
    desmarcar("terminalBloqueado");
    gravar("errosTerminal", 0);
    desmarcar("gavetaBloqueada");
    falar("Um curto-circuito reinicia o terminal e destrava a gaveta.");
    registrarDiario("Ação: a alavanca reiniciou o terminal e destravou a gaveta.");
  } else {
    falar("A alavanca já foi puxada.");
  }
}

function clicarPortaSeguranca() {
  irPara("cena5.html");
}

function clicarPortaArmazem() {
  falar("A porta do armazém está emperrada. O mecanismo não se move.");
}

function tentarIrBiblioteca() {
  if (foi("gradeAberta")) {
    irPara("cena4.html");
  } else {
    falar("Uma grade bloqueia o caminho.");
  }
}

function tentarIrSaida() {
  if (foi("energiaLigada")) {
    irPara("cena6.html");
  } else {
    falar("A porta elétrica está sem energia.");
  }
}

iniciarPagina();
