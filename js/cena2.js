function clicarChaveDeFenda() {
  atualizarAposAcao(puzzles.chaveFenda.tentar());
}

function clicarAlicate() {
  atualizarAposAcao(puzzles.alicate.tentar());
}

function clicarCaldeira() {
  atualizarAposAcao(puzzles.caldeira.tentar(inventario.selecionado));
}

function clicarPapel() {
  atualizarAposAcao(puzzles.relatorio.tentar());
  if (puzzles.relatorio.estado === "resolvido") {
    pegar("papel-texto").textContent = puzzles.relatorio.texto + " " + pistaDoPingente();
    abrirPainel("papel");
  }
}

iniciarPagina();
