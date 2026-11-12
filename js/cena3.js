// Cena 3: corredor

function clicarPortaSeguranca() {
  irPara("cena4.html");
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

iniciarPagina();
