// Funções usadas em todas as cenas.
var PREFIXO = "ecos:";
var itens = ["chavefenda", "alicate", "chave", "fusivel", "cartao", "corrente", "pingente", "medalhao"];
var timerMensagem;
var painelAtual = "";
var jogoEncerrado = false;
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
    if (chave.indexOf(PREFIXO) === 0) localStorage.removeItem(chave);
  }
}

// Começar e trocar de cena
function novoJogo() {
  limparJogo();
  marcar("partidaIniciada");
  registrarDiario("Você acordou no porão.");
  window.location.href = "cena1.html";
}

function iniciarPagina() {
  if (!foi("partidaIniciada")) {
    if (!lerTexto("diario")) {
      window.location.href = "index.html";
      return;
    }
    marcar("partidaIniciada");
  }
  if (lerTexto("final")) {
    window.location.href = "final.html";
    return;
  }
  atualizarInventario();
  sincronizarObjetos();
  atualizarBotaoDiario();
}

function irPara(pagina) {
  window.location.href = pagina;
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
  fecharPainel();
  var pedacos = document.getElementsByClassName("subpainel");
  for (var i = 0; i < pedacos.length; i++) pedacos[i].style.display = "none";
  painelAtual = nome;
  pegar("botao-fechar-painel").textContent = nome === "diario" ? "Fechar diário" : "Fechar";
  pegar("p-" + nome).style.display = "flex";
  pegar("painel").style.display = "flex";
}

function fecharPainel() {
  // Fecha o desafio de setas, se ele estiver aberto.
  if (painelAtual === "setas") cancelarSetas();
  painelAtual = "";
  pegar("painel").style.display = "none";
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
    ["campo-papel", "papelBreuLido"],
    ["campo-cadeado", "portaAberta"]
  ];
  for (var i = 0; i < objetos.length; i++) {
    var campo = pegar(objetos[i][0]);
    if (campo) campo.hidden = foi(objetos[i][1]);
  }
  var caldeira = pegar("campo-caldeira");
  if (caldeira && foi("caldeiraAberta")) caldeira.hidden = true;
  var papel = pegar("campo-papel");
  if (papel) papel.hidden = !foi("caldeiraAberta") || foi("papelBreuLido");
}

function atualizarBotaoDiario() {
  var botao = pegar("botao-diario");
  if (botao) botao.hidden = !foi("diarioPego");
}

function atualizarInventario() {
  var selecionado = itemSelecionado();
  for (var i = 0; i < itens.length; i++) {
    var botao = pegar("item-" + itens[i]);
    if (!botao) continue;
    botao.style.display = foi("tem-" + itens[i]) ? "block" : "none";
    botao.classList.toggle("sel", selecionado === itens[i]);
    botao.setAttribute("aria-pressed", String(selecionado === itens[i]));
  }
}

function combinarItens(primeiro, segundo) {
  var combina = (primeiro === "corrente" && segundo === "pingente") ||
                (primeiro === "pingente" && segundo === "corrente");
  if (!combina) return false;
  perder("corrente");
  perder("pingente");
  ganhar("medalhao");
  falar("A corrente e o pingente formam um medalhão.");
  registrarDiario("Combinação: corrente + pingente = medalhão.");
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
    falar("Usando: " + pegar("item-" + nome).textContent);
  }
}

// Diário
function lerDiario() { return JSON.parse(lerTexto("diario") || "[]"); }

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

// Finais
function terminarJogo(tipo) {
  if (jogoEncerrado) return;
  jogoEncerrado = true;
  clearTimeout(timerMensagem);
  fecharPainel();
  gravar("final", tipo);
  window.location.href = "final.html";
}

function escapar() {
  terminarJogo("perfeito");
}

// Atualiza a página quando o jogador volta pelo histórico do navegador.
window.onpageshow = function (evento) {
  if (evento.persisted) iniciarPagina();
};
