function pegarPeDeCabra() {
  if (foi("peDeCabraPego")) return;
  marcar("peDeCabraPego");
  ganhar("pedecabra");
  sincronizarObjetos();
  falar("Você pegou o pé de cabra. Ele pode abrir a porta emperrada do armazém.");
  registrarDiario("Encontrei um pé de cabra na Sala de Segurança.");
}

function acessarMonitor(canal) {
  if (!foi("monitoresLigados")) {
    if (itemSelecionado() !== "bateria" || !foi("tem-bateria")) {
      falar("Os quatro monitores compartilham uma entrada de energia. Procure uma bateria portátil.");
      return;
    }
    marcar("monitoresLigados");
    perder("bateria");
    registrarDiario("A bateria portátil ligou os quatro monitores da Sala de Segurança.");
  }
  irPara("camera.html?canal=" + canal);
}

iniciarPagina();
