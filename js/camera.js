var canalAtual;

function iniciarCamera() {
  if (!iniciarPagina()) return;
  canalAtual = Number(new URLSearchParams(window.location.search).get("canal"));
  var camera = cameras[canalAtual - 1];
  if (!camera) {
    irPara("cena4.html");
    return;
  }

  var imagem = pegar("imagem-camera");
  imagem.src = camera.imagem;
  imagem.alt = "Imagem do canal " + canalAtual + ": " + camera.nome;
  pegar("canal-camera").textContent =
    "CÂMERA 0" + canalAtual + " · " + camera.nome;
  pegar("digito-camera").style.setProperty("--digito-x", camera.x + "%");
  pegar("digito-camera").style.setProperty("--digito-y", camera.y + "%");
  pegar("bueiro-camera").hidden =
    canalAtual !== 1 || puzzles.bueiro.estado !== "resolvido";
  pegar("estado-camera").textContent = puzzles.cameras.descrever(camera);
  mostrarFiltroUV(!pegar("digito-camera").hidden);
}

function mostrarFiltroUV(ativo) {
  pegar("digito-camera").textContent = ativo ? digitoDoCanal(canalAtual) : "";
  pegar("digito-camera").hidden = !ativo;
  pegar("vulto-camera").hidden =
    !ativo || canalAtual !== partida.sorteio.canalVulto;
  pegar("aviso-vulto").textContent = pegar("vulto-camera").hidden
    ? ""
    : "Um vulto atravessa a imagem.";
  pegar("palco").classList.toggle("filtro-uv", ativo);
  pegar("botao-uv").setAttribute("aria-pressed", String(ativo));
  pegar("botao-uv").textContent = ativo
    ? "Filtro UV ligado"
    : "Filtro UV desligado";
}

function alternarFiltroUV() {
  if (!cameras[canalAtual - 1] || !atualizarRelogio()) return;
  var ativo = pegar("digito-camera").hidden;
  if (ativo) {
    puzzles.cameras.tentar(canalAtual);
    if (canalAtual === partida.sorteio.canalVulto) {
      diario.registrar(
        "Um vulto apareceu no canal " +
          canalAtual +
          ". A Sombra só ficou visível com o filtro UV.",
      );
    }
    salvarEstado();
  }
  mostrarFiltroUV(ativo);
}

iniciarCamera();
