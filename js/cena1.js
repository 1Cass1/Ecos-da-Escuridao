function clicarCaixas() {
  atualizarAposAcao(puzzles.caixas.tentar(inventario.selecionado));
}

function clicarDiario() {
  atualizarAposAcao(puzzles.diario.tentar());
}

function clicarBueiro() {
  var mensagem = puzzles.bueiro.tentar(inventario.selecionado);
  atualizarAposAcao(mensagem);
  if (mensagem) return;
  atualizarParafuso();
  abrirPainel("parafuso");
}

function atualizarParafuso() {
  var voltas = puzzles.bueiro.voltas;
  pegar("voltas-texto").textContent = voltas;
  pegar("parafuso").style.transform =
    "translateY(" +
    -9 * voltas +
    "px) rotate(" +
    -65 * voltas +
    "deg) scale(" +
    (1 + 0.07 * voltas) +
    ")";
}

function girarParafuso(sentido) {
  if (painelAtual !== "parafuso") return;
  atualizarAposAcao(puzzles.bueiro.tentar(inventario.selecionado, sentido));
  atualizarParafuso();
  if (puzzles.bueiro.estado === "resolvido") {
    setTimeout(function () {
      if (painelAtual === "parafuso") fecharPainel();
    }, 420);
  }
}

function clicarPorta() {
  if (puzzles.portaQuarto.estado === "resolvido") {
    irPara("cena3.html");
  } else {
    atualizarAposAcao(puzzles.portaQuarto.tentar(inventario.selecionado));
  }
}

iniciarPagina();
