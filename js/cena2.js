// CENA 2: SUBSOLO
function clicarEscadaCima() { irPara("cena1.html"); }

function clicarChaveDeFenda() {
  if (foi("chaveFendaPega")) {
    falar("A bancada está vazia. Você já pegou a chave de fenda.");
    return;
  }
  marcar("chaveFendaPega");
  pegar("campo-chave-de-fenda").hidden = true;
  ganhar("chavefenda");
  falar("Chave de fenda coletada. Ela pode soltar o parafuso do bueiro.");
  registrarDiario("Ação: chave de fenda encontrada no subsolo.");
}

function clicarAlicate() {
  if (foi("alicatePego")) {
    falar("O alicate não está mais na bancada.");
    return;
  }
  marcar("alicatePego");
  pegar("campo-alicate").hidden = true;
  ganhar("alicate");
  falar("Alicate coletado. As correntes da caldeira parecem cortáveis.");
  registrarDiario("Ação: alicate encontrado no subsolo.");
}

function clicarCaldeira() {
  if (foi("caldeiraAberta")) {
    falar("Você corta as correntes. A caldeira se abre.");
  } else if (itemSelecionado() === "alicate") {
    perder("alicate");
    marcar("caldeiraAberta");
    sincronizarObjetos();
    falar("Você corta as correntes da caldeira. Um papel dobrado estava escondido dentro dela.");
    registrarDiario("Ação: correntes da caldeira cortadas com o alicate.");
  } else {
    falar("A caldeira está presa por correntes. Selecione o alicate para cortá-las.");
  }
}

function clicarPapel() {
  if (!foi("caldeiraAberta")) {
    falar("Há algo escondido atrás das correntes da caldeira.");
    return;
  }
  if (foi("papelBreuLido") && foi("pingentePego")) {
    falar("Você já leu o relatório encontrado atrás da caldeira.");
    return;
  }
  marcar("papelBreuLido");
  if (!foi("pingentePego")) {
    marcar("pingentePego");
    ganhar("pingente");
    falar("Você guardou o pingente que estava embrulhado no relatório.");
  }
  registrarDiario("Relatório do Breu: a guardiã deixou seu retrato no corredor. A meia-lua riscada da moldura também está gravada no pingente.");
  sincronizarObjetos();
  pegar("papel-texto").textContent = "O Breu se espalha pela matéria orgânica e reage ao medo. A luz ultravioleta o enfraquece. Desde que ele entrou pelos dutos, as vozes passaram a imitar as nossas. A guardiã deixou o retrato no corredor, perto da porta da frente. A meia-lua riscada na moldura também foi gravada no pingente que ela usava.";
  abrirPainel("papel");
}

iniciarPagina();
