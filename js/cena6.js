function concluirTravessia() {
  if (!foi("portaAberta")) {
    irPara("cena1.html");
    return;
  }
  if (!foi("portaFrenteAberta")) {
    irPara("cena3.html");
    return;
  }
  if (!lerTexto("final")) gravar("final", foi("tem-medalhao") ? "secreto" : "perfeito");
  irPara("final.html");
}

iniciarPagina();
