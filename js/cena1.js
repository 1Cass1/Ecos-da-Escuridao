// CENA 1: PORÃO
var voltasParafuso = ler("voltasParafuso");

function clicarCaixas() {
  falar("Caixas velhas. Marcas de arrasto no chão levam ao bueiro.");
  registrarDiario("Pista: marcas no chão levam ao bueiro.");
}

// O diário libera o botão e traz itens e pistas.
function clicarDiario() {
  if (!foi("diarioPego")) {
    marcar("diarioPego");
    pegar("campo-diario1").hidden = true;
    atualizarBotaoDiario();
    falar("Você encontrou e guardou o diário. O botão Diário foi liberado.");
    registrarDiario("O diário foi encontrado no porão.");
  }
  if (!foi("correntePega")) {
    marcar("correntePega");
    ganhar("corrente");
    falar("Dentro do diário há uma corrente de prata e uma anotação: 'O retrato guarda o que falta'.");
    registrarDiario("Pista: o retrato da biblioteca esconde algo que pertence à corrente.");
  } else {
    falar("O diário fala de uma mulher retratada na biblioteca e de uma data: 07/13.");
    registrarDiario("Pista: a data anotada no diário é 07/13.");
  }
}

function clicarEscada() { irPara("cena2.html"); }

// Use a chave de fenda selecionada no bueiro.
function clicarBueiro() {
  if (foi("bueiroAberto")) {
    falar("A grade está aberta. A chave de latão já foi retirada.");
  } else if (itemSelecionado() === "chavefenda") {
    pegar("voltas-texto").textContent = voltasParafuso;
    pegar("parafuso").style.transform = "rotate(" + (voltasParafuso * -45) + "deg)";
    abrirPainel("parafuso");
  } else {
    falar("O parafuso da grade está enferrujado. Selecione a chave de fenda.");
  }
}

function girarParafuso(sentido) {
  if (sentido === "esquerda") {
    voltasParafuso = Math.min(voltasParafuso + 1, 8);
  } else {
    voltasParafuso = Math.max(voltasParafuso - 1, 0);
    falar("Isso aperta o parafuso. Gire para a esquerda.");
  }
  gravar("voltasParafuso", voltasParafuso);
  pegar("voltas-texto").textContent = voltasParafuso;
  pegar("parafuso").style.transform = "rotate(" + (voltasParafuso * -45) + "deg)";

  if (voltasParafuso === 8) {
    marcar("bueiroAberto");
    perder("chavefenda");
    ganhar("chave");
    fecharPainel();
    falar("A grade se solta. Você encontra uma chave de latão lá embaixo.");
    registrarDiario("Ação: bueiro aberto; chave de latão encontrada.");
  }
}

function clicarPorta() {
  if (foi("portaAberta")) {
    irPara("cena3.html");
  } else if (itemSelecionado() === "chave") {
    perder("chave");
    marcar("portaAberta");
    sincronizarObjetos();
    falar("A chave gira. O cadeado cai e a porta se abre.");
    registrarDiario("Ação: cadeado aberto com a chave de latão.");
  } else {
    falar("A porta está presa por um cadeado. Encontre a chave de latão.");
  }
}

// O cadeado usa a mesma ação da porta.
function clicarCadeado() { clicarPorta(); }

iniciarPagina();
