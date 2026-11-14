// Funções usadas em todas as cenas.
var PREFIXO = "ecos:";
var nomesDosItens = {
  chavefenda: "Chave de fenda",
  alicate: "Alicate",
  chave: "Chave de latão",
  corrente: "Corrente de prata",
  pingente: "Pingente",
  medalhao: "Medalhão",
  pedecabra: "Pé de cabra",
  bateria: "Bateria portátil"
};
var itens = Object.keys(nomesDosItens);
var timerMensagem;
var painelAtual = "";
var focoAntesPainel;
var paginaDiario = 0;
var informacoesPorPagina = 3;

// Salvar e ler o progresso
function gravar(nome, valor) { localStorage.setItem(PREFIXO + nome, valor); }
function lerTexto(nome) { return localStorage.getItem(PREFIXO + nome) || ""; }
function ler(nome) { return Number(lerTexto(nome)) || 0; }
function marcar(nome) { gravar(nome, "sim"); }
function foi(nome) { return lerTexto(nome) === "sim"; }
function desmarcar(nome) { localStorage.removeItem(PREFIXO + nome); }
function pegar(id) { return document.getElementById(id); }

function limparJogo() {
  // Apaga somente os dados deste jogo.
  for (var i = localStorage.length - 1; i >= 0; i--) {
    var chave = localStorage.key(i);
    if (chave && chave.indexOf(PREFIXO) === 0 && chave !== PREFIXO + "modoClaro") {
      localStorage.removeItem(chave);
    }
  }
}

// Começar e trocar de cena
function novoJogo() {
  limparJogo();
  marcar("partidaIniciada");
  registrarDiario("Você acordou no quarto.");
  window.location.href = "cena1.html";
}

function iniciarPagina() {
  if (!foi("partidaIniciada")) {
    irPara("index.html");
    return false;
  }
  if (lerTexto("final")) {
    window.location.href = "final.html";
    return false;
  }
  var travessia = pegar("travessia");
  if (travessia && !foi("portaAberta")) {
    irPara("cena1.html");
    return false;
  }
  var progressoNecessario = travessia && travessia.getAttribute("data-requer-progresso");
  if (progressoNecessario && !foi(progressoNecessario)) {
    irPara(travessia.getAttribute("data-voltar") || "cena3.html");
    return false;
  }
  atualizarInventario();
  sincronizarObjetos();
  atualizarBotaoDiario();
  return true;
}

function irPara(pagina) {
  window.location.href = pagina;
}

function atualizarModoClaro() {
  var ativo = foi("modoClaro");
  var botao = document.querySelector(".botao-modo-claro");
  document.body.classList.toggle("modo-claro", ativo);
  if (botao) botao.setAttribute("aria-pressed", String(ativo));
}

function alternarModoClaro() {
  if (foi("modoClaro")) {
    desmarcar("modoClaro");
  } else {
    marcar("modoClaro");
  }
  atualizarModoClaro();
}

// Mensagens e painéis
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

// Inventário
function ganhar(item) {
  marcar("tem-" + item);
  atualizarInventario();
}

function perder(item) {
  desmarcar("tem-" + item);
  if (itemSelecionado() === item) gravar("selecionado", "");
  atualizarInventario();
}

function itemSelecionado() { return lerTexto("selecionado"); }

function soltarItem() {
  gravar("selecionado", "");
  atualizarInventario();
}

function sincronizarObjetos() {
  var objetos = [
    ["campo-chave-de-fenda", "chaveFendaPega"],
    ["campo-alicate", "alicatePego"],
    ["campo-diario1", "diarioPego"],
    ["campo-cadeado", "portaAberta"],
    ["campo-pe-de-cabra", "peDeCabraPego"],
    ["campo-bateria", "bateriaPega"]
  ];
  for (var i = 0; i < objetos.length; i++) {
    var campo = pegar(objetos[i][0]);
    if (campo) campo.hidden = foi(objetos[i][1]);
  }
  var caldeira = pegar("campo-caldeira");
  if (caldeira) caldeira.hidden = foi("caldeiraAberta");
  var papel = pegar("campo-papel");
  if (papel) papel.hidden = !foi("caldeiraAberta") || (foi("papelBreuLido") && foi("pingentePego"));
}

function atualizarBotaoDiario() {
  var botao = pegar("botao-diario");
  if (botao) botao.hidden = !foi("diarioPego");
}

function atualizarInventario() {
  var inventario = pegar("inv");
  if (!inventario) return;

  var selecionado = itemSelecionado();
  if (selecionado && (itens.indexOf(selecionado) === -1 || !foi("tem-" + selecionado))) {
    desmarcar("selecionado");
    selecionado = "";
  }
  var vazio = true;
  itens.forEach(function (item) {
    var id = "item-" + item;
    var botao = pegar(id);
    if (!botao) {
      botao = document.createElement("button");
      botao.type = "button";
      botao.id = id;
      botao.className = "item-inventario";
      botao.textContent = nomesDosItens[item];
      botao.addEventListener("click", function () { clicarItem(item); });
      inventario.appendChild(botao);
    }
    botao.hidden = !foi("tem-" + item);
    botao.classList.toggle("sel", selecionado === item);
    botao.setAttribute("aria-pressed", String(selecionado === item));
    if (!botao.hidden) vazio = false;
  });
  pegar("inventario-vazio").hidden = !vazio;
}

function combinarItens(primeiro, segundo) {
  var combina = (primeiro === "corrente" && segundo === "pingente") ||
                (primeiro === "pingente" && segundo === "corrente");
  if (!combina || !foi("tem-" + primeiro) || !foi("tem-" + segundo)) return false;
  perder("corrente");
  perder("pingente");
  ganhar("medalhao");
  falar("A corrente e o pingente formam um medalhão gravado com uma meia-lua riscada.");
  registrarDiario("A corrente e o pingente formam um medalhão com uma meia-lua riscada.");
  return true;
}

function clicarItem(nome) {
  if (!foi("tem-" + nome)) return;
  var selecionado = itemSelecionado();
  if (selecionado === nome) {
    soltarItem();
    falar("Item guardado.");
  } else if (!combinarItens(selecionado, nome)) {
    // Outro item só troca o que está selecionado.
    gravar("selecionado", nome);
    atualizarInventario();
    falar("Usando: " + nomesDosItens[nome]);
  }
}

// Diário
function lerDiario() {
  try {
    var diario = JSON.parse(lerTexto("diario") || "[]");
    return Array.isArray(diario) ? diario.filter(function (anotacao) {
      return typeof anotacao === "string";
    }) : [];
  } catch (erro) {
    return [];
  }
}

function registrarDiario(texto) {
  var diario = lerDiario();
  if (diario.indexOf(texto) !== -1) return;
  diario.push(texto);
  gravar("diario", JSON.stringify(diario));
}

function abrirDiario() {
  if (!foi("diarioPego")) {
    falar("Você precisa encontrar o diário antes de consultá-lo.");
    return;
  }
  paginaDiario = 0;
  atualizarPaginaDiario();
  abrirPainel("diario");
}

function atualizarPaginaDiario() {
  var diario = lerDiario();
  var totalPaginas = Math.ceil(diario.length / informacoesPorPagina) + 1;

  if (paginaDiario === 0) {
    pegar("diario-titulo").textContent = "ANOTAÇÃO ANTIGA";
    pegar("diario-texto").textContent = "Se alguém encontrar este caderno, não siga as vozes nos dutos. A escuridão sabe repetir o que escuta. Eu tranquei a passagem, mas ela continua chamando pelo meu nome. — registro sem assinatura";
  } else {
    var primeiraInformacao = (paginaDiario - 1) * informacoesPorPagina;
    var textoPagina = "";
    pegar("diario-titulo").textContent = "ANOTAÇÕES " + paginaDiario;

    for (var i = primeiraInformacao; i < primeiraInformacao + informacoesPorPagina && i < diario.length; i++) {
      textoPagina += "- " + diario[i] + "\n\n";
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
  var totalPaginas = Math.ceil(lerDiario().length / informacoesPorPagina) + 1;
  paginaDiario = paginaDiario + direcao;
  if (paginaDiario < 0) paginaDiario = 0;
  if (paginaDiario >= totalPaginas) paginaDiario = totalPaginas - 1;
  atualizarPaginaDiario();
}

atualizarModoClaro();

// Atualiza a página quando o jogador volta pelo histórico do navegador.
window.onpageshow = function (evento) {
  atualizarModoClaro();
  if (!evento.persisted || !pegar("palco")) return;
  if (pegar("painel")) fecharPainel();
  iniciarPagina();
};
