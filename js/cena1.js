// CENA 1: QUARTO
var voltasParafuso = 0;
var girosParaSoltar = 3;

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
    registrarDiario("O diário foi encontrado no quarto.");
  }
  if (!foi("correntePega")) {
    marcar("correntePega");
    ganhar("corrente");
    falar("Dentro do diário há uma corrente de prata com um fecho para pingente.");
    registrarDiario("Pista: a corrente de prata tem um fecho para pingente.");
  }
}

function clicarEscada() { irPara("cena2.html"); }

// Use a chave de fenda selecionada no bueiro.
function clicarBueiro() {
  if (foi("bueiroAberto")) {
    falar("A grade está aberta. A chave de latão já foi retirada.");
  } else if (itemSelecionado() === "chavefenda") {
    // Partidas antigas usavam até oito giros.
    voltasParafuso = Math.max(0, Math.min(ler("voltasParafuso"), girosParaSoltar - 1));
    atualizarParafuso();
    abrirPainel("parafuso");
  } else {
    falar("O parafuso da grade está enferrujado. Selecione a chave de fenda.");
  }
}

function atualizarParafuso() {
  pegar("voltas-texto").textContent = voltasParafuso;
  pegar("parafuso").style.transform = "translateY(" + (-9 * voltasParafuso) + "px) rotate(" +
    (-65 * voltasParafuso) + "deg) scale(" + (1 + 0.07 * voltasParafuso) + ")";
}

function girarParafuso(sentido) {
  if (painelAtual !== "parafuso" || itemSelecionado() !== "chavefenda" || foi("bueiroAberto")) return;
  if (sentido === "esquerda") {
    voltasParafuso++;
  } else {
    voltasParafuso = Math.max(voltasParafuso - 1, 0);
    falar("Isso aperta o parafuso. Gire para a esquerda.");
  }
  gravar("voltasParafuso", voltasParafuso);
  atualizarParafuso();

  if (voltasParafuso === girosParaSoltar) {
    marcar("bueiroAberto");
    perder("chavefenda");
    ganhar("chave");
    falar("A grade se solta. Você encontra uma chave de latão lá embaixo.");
    registrarDiario("Ação: bueiro aberto; chave de latão encontrada.");
    setTimeout(function () {
      if (painelAtual === "parafuso") fecharPainel();
    }, 420);
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
