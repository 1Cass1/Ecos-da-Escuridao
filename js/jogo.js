var timerMensagem;
var painelAtual = "";
var focoAntesPainel;
var paginaDiario = 0;
var informacoesPorPagina = 3;

function pegar(id) { return document.getElementById(id); }

function novoJogo() {
  limparJogo();
  puzzles = criarPuzzles();
  partida = { iniciada: true, final: "" };
  inventario.itens = [];
  inventario.selecionar("");
  diario.entradas = [];
  diario.registrar("Você acordou no quarto.");
  iniciarTempo();
  salvarEstado();
  irPara("cena1.html");
}

function iniciarPagina() {
  carregarEstado();
  if (!partida.iniciada) {
    irPara("index.html");
    return false;
  }
  if (partida.final) {
    irPara("final.html");
    return false;
  }
  prepararPartida();
  if (!iniciarRelogio()) return false;

  var travessia = pegar("travessia");
  if (travessia && puzzles.portaQuarto.estado !== "resolvido") {
    irPara("cena1.html");
    return false;
  }
  var progresso = travessia && travessia.getAttribute("data-requer-progresso");
  if (progresso && puzzles[progresso].estado !== "resolvido") {
    irPara(travessia.getAttribute("data-voltar") || "cena3.html");
    return false;
  }
  atualizarCena();
  return true;
}

function irPara(pagina) { window.location.href = pagina; }

function atualizarModoClaro() {
  var ativo = localStorage.getItem(PREFIXO + "modoClaro") === "sim";
  var botao = document.querySelector(".botao-modo-claro");
  document.body.classList.toggle("modo-claro", ativo);
  if (botao) botao.setAttribute("aria-pressed", String(ativo));
}

function alternarModoClaro() {
  var chave = PREFIXO + "modoClaro";
  if (localStorage.getItem(chave) === "sim") {
    localStorage.removeItem(chave);
  } else {
    localStorage.setItem(chave, "sim");
  }
  atualizarModoClaro();
}

function falar(texto) {
  pegar("mensagem").textContent = texto;
  pegar("mensagem").style.opacity = 1;
  clearTimeout(timerMensagem);
  timerMensagem = setTimeout(esconderMensagem, 2500 + texto.length * 40);
}

function esconderMensagem() { pegar("mensagem").style.opacity = 0; }

function abrirPainel(nome) {
  focoAntesPainel = document.activeElement;
  var pedacos = document.getElementsByClassName("subpainel");
  for (var i = 0; i < pedacos.length; i++) pedacos[i].style.display = "none";
  painelAtual = nome;
  pegar("botao-fechar-painel").textContent = nome === "diario" ? "Fechar diário" : "Fechar";
  var painel = pegar("p-" + nome);
  painel.style.display = "flex";
  pegar("painel").style.display = "flex";
  var titulo = painel.querySelector("h2");
  titulo.tabIndex = -1;
  titulo.focus();
}

function fecharPainel() {
  if (!painelAtual) return;
  painelAtual = "";
  pegar("painel").style.display = "none";
  if (focoAntesPainel && !focoAntesPainel.hidden && focoAntesPainel !== document.body) {
    focoAntesPainel.focus();
  } else {
    pegar("palco").querySelector("h1").focus();
  }
}

function moverLanterna(evento) {
  var palco = pegar("palco");
  var caixa = palco.getBoundingClientRect();
  palco.style.setProperty("--x", (evento.clientX - caixa.left) + "px");
  palco.style.setProperty("--y", (evento.clientY - caixa.top) + "px");
}

function atualizarCena() {
  atualizarInventario();

  var objetos = {
    "campo-chave-de-fenda": "chaveFenda",
    "campo-alicate": "alicate",
    "campo-diario1": "diario",
    "campo-cadeado": "portaQuarto",
    "campo-caldeira": "caldeira",
    "campo-pe-de-cabra": "peDeCabra",
    "campo-bateria": "bateria"
  };
  for (var id in objetos) {
    var campo = pegar(id);
    if (campo) campo.hidden = puzzles[objetos[id]].estado === "resolvido";
  }

  var papel = pegar("campo-papel");
  if (papel) papel.hidden = puzzles.relatorio.estado === "trancado";

  var retrato = pegar("campo-retrato");
  if (retrato) retrato.classList.toggle("retrato-inspecionado", puzzles.retrato.inspecionado);

  var botao = pegar("botao-diario");
  if (botao) botao.hidden = puzzles.diario.estado !== "resolvido";

  var pacto = pegar("botao-pacto");
  if (pacto) pacto.disabled = !inventario.tem("medalhao");

  var ritmo = pegar("botao-ritmo");
  if (ritmo) {
    ritmo.disabled = puzzles.ritmo.estado === "resolvido";
    ritmo.textContent = ritmo.disabled ? "Ritmo reconhecido" : "Repetir batidas";
  }

  var portaAberta = pegar("sprite-porta-saida-aberta");
  if (portaAberta) portaAberta.hidden = puzzles.terminal.estado !== "resolvido";
}

function atualizarAposAcao(mensagem) {
  salvarEstado();
  atualizarCena();
  if (mensagem) falar(mensagem);
}

function atualizarInventario() {
  var lista = pegar("inv");
  if (!lista) return;

  var inspecionar = pegar("inspecionar-item");
  for (var item in fichaDosItens) {
    var botao = pegar("item-" + item);
    if (!botao) {
      botao = document.createElement("button");
      botao.type = "button";
      botao.id = "item-" + item;
      botao.value = item;
      botao.className = "item-inventario";
      botao.textContent = fichaDosItens[item].nome;
      botao.addEventListener("click", clicarItem);
      lista.insertBefore(botao, inspecionar);
    }
    botao.hidden = !inventario.tem(item);
    botao.classList.toggle("sel", inventario.selecionado === item);
    botao.setAttribute("aria-pressed", String(inventario.selecionado === item));
  }
  pegar("inventario-vazio").hidden = inventario.itens.length !== 0;
  inspecionar.hidden = !inventario.selecionado;
}

function clicarItem(evento) {
  var item = evento.currentTarget.value;
  var selecionado = inventario.selecionado;
  if (selecionado === item) {
    inventario.selecionar("");
    atualizarAposAcao("Item guardado.");
    return;
  }

  var mensagem = inventario.combinar(selecionado, item);
  if (!mensagem) {
    inventario.selecionar(item);
    mensagem = "Usando: " + fichaDosItens[item].nome;
  }
  atualizarAposAcao(mensagem);
}

function inspecionarItem() {
  falar(inventario.inspecionar());
}

function atualizarPaginaDiario() {
  var entradas = diario.entradas;
  var totalPaginas = Math.ceil(entradas.length / informacoesPorPagina) + 1;

  if (paginaDiario === 0) {
    pegar("diario-titulo").textContent = "ANOTAÇÃO ANTIGA";
    pegar("diario-texto").textContent = partida.sorteio.anotacao;
  } else {
    var primeira = (paginaDiario - 1) * informacoesPorPagina;
    var textoPagina = "";
    pegar("diario-titulo").textContent = "ANOTAÇÕES " + paginaDiario;

    for (var i = primeira; i < primeira + informacoesPorPagina && i < entradas.length; i++) {
      textoPagina += "- " + entradas[i] + "\n\n";
    }
    pegar("diario-texto").textContent = textoPagina;
  }

  pegar("pagina-diario").classList.toggle("esquerda", paginaDiario % 2 === 0);
  pegar("pagina-diario").classList.toggle("direita", paginaDiario % 2 !== 0);
  pegar("diario-pagina").textContent = (paginaDiario + 1) + " / " + totalPaginas;
  pegar("seta-diario-voltar").disabled = paginaDiario === 0;
  pegar("seta-diario-avancar").disabled = paginaDiario === totalPaginas - 1;
}

function passarPaginaDiario(direcao) {
  var totalPaginas = Math.ceil(diario.entradas.length / informacoesPorPagina) + 1;
  paginaDiario += direcao;
  if (paginaDiario < 0) paginaDiario = 0;
  if (paginaDiario >= totalPaginas) paginaDiario = totalPaginas - 1;
  atualizarPaginaDiario();
}

atualizarModoClaro();

window.onpageshow = function (evento) {
  atualizarModoClaro();
  if (!evento.persisted) return;
  if (pegar("painel")) fecharPainel();
  var palco = pegar("palco");
  if (palco) {
    if (palco.classList.contains("imagem-monitor")) {
      iniciarCamera();
    } else {
      iniciarPagina();
    }
  } else if (pegar("titulo")) {
    mostrarFinal();
  }
};

document.addEventListener("visibilitychange", function () {
  if (!document.hidden && relogio && partida.iniciada && !partida.final) atualizarRelogio();
});
