function pegarPeDeCabra() {
  atualizarAposAcao(puzzles.peDeCabra.tentar());
}

function acessarMonitor(canal) {
  var monitores = puzzles.monitores;
  atualizarAposAcao(monitores.tentar(inventario.selecionado));
  if (monitores.estado === "resolvido") irPara("camera.html?canal=" + canal);
}

iniciarPagina();
