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
  if (foi("papelBreuLido")) {
    falar("Você já leu o relatório encontrado atrás da caldeira.");
    return;
  }
  marcar("papelBreuLido");
  registrarDiario("Relatório antigo: o Breu se alimenta de matéria orgânica e emoções extremas. Frequências de luz ultravioleta o enfraquecem, mas a criatura entrou pelos dutos e corrompeu os pesquisadores.");
  sincronizarObjetos();
  pegar("papel-texto").textContent = "RELATÓRIO DE CAMPO — O Breu não é apenas escuridão. Ele se espalha pela matéria orgânica e parece reagir ao terror e à obsessão. Frequências de luz ultravioleta o enfraquecem. A contenção falhou quando a coisa entrou pelos dutos de ventilação. Os pesquisadores começaram a mudar. Se alguém encontrar isto, não confie nas vozes vindas do rádio.";
  abrirPainel("papel");
}

iniciarPagina();
