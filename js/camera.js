var cameraAtual;

function iniciarCamera() {
  if (!iniciarPagina()) return;
  var canal = Number(new URLSearchParams(window.location.search).get("canal"));
  cameraAtual = cameras[canal - 1];
  if (!cameraAtual) {
    irPara("cena4.html");
    return;
  }

  var imagem = pegar("imagem-camera");
  imagem.src = cameraAtual.imagem;
  imagem.alt = "Imagem da câmera do " + cameraAtual.nome.toLowerCase();
  pegar("canal-camera").textContent = "CÂMERA 0" + canal + " · " + cameraAtual.nome;
  pegar("digito-camera").style.setProperty("--digito-x", cameraAtual.x + "%");
  pegar("digito-camera").style.setProperty("--digito-y", cameraAtual.y + "%");
}

function alternarFiltroUV() {
  if (!cameraAtual) return;
  var digito = pegar("digito-camera");
  var ativo = digito.hidden;
  digito.textContent = ativo ? cameraAtual.digito : "";
  digito.hidden = !ativo;
  pegar("palco").classList.toggle("filtro-uv", ativo);
  pegar("botao-uv").setAttribute("aria-pressed", String(ativo));
  pegar("botao-uv").textContent = ativo ? "Filtro UV ligado" : "Filtro UV desligado";
}

iniciarCamera();
