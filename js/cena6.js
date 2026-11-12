// Cena 6: saída
var sequencia = [];
var posSeta = 0;
var esperandoSetas = false;
var timerSetas;

function clicarLeitor() {
  if (foi("leitorLiberado")) {
    falar("Luz verde.");
  } else if (itemSelecionado() === "cartao") {
    perder("cartao");
    marcar("leitorLiberado");
    falar("Bip. Luz verde no leitor.");
    registrarDiario("Ação: leitor magnético liberado.");
  } else {
    falar("O leitor pede um cartão de acesso.");
  }
}

// Memorize e repita quatro setas.
function clicarPainelSetas() {
  if (foi("setasLiberado")) {
    falar("O painel está desbloqueado.");
    return;
  }

  var desenhos = ["↑", "↓", "←", "→"];
  var teclas = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  var texto = "";

  sequencia = [];
  for (var i = 0; i < 4; i++) {
    var n = Math.floor(Math.random() * 4);
    sequencia.push(teclas[n]);
    texto += desenhos[n] + " ";
  }

  posSeta = 0;
  esperandoSetas = false;
  pegar("setas-titulo").textContent = "MEMORIZE";
  pegar("setas-texto").textContent = texto;
  pegar("setas-dica").textContent = "";
  abrirPainel("setas");

  clearTimeout(timerSetas);
  timerSetas = setTimeout(esconderSetas, 2500);
}

function cancelarSetas() {
  clearTimeout(timerSetas);
  esperandoSetas = false;
}

function esconderSetas() {
  if (painelAtual !== "setas") return;
  pegar("setas-titulo").textContent = "REPITA COM O TECLADO";
  pegar("setas-texto").textContent = "? ? ? ?";
  pegar("setas-dica").textContent = "Use as setas do teclado";
  esperandoSetas = true;
}

// Confere as teclas digitadas.
function tecla(e) {
  if (!esperandoSetas) return;
  if (painelAtual !== "setas") return;
  if (e.repeat) return;
  if (e.key.indexOf("Arrow") !== 0) return;
  e.preventDefault();

  if (e.key === sequencia[posSeta]) {
    posSeta++;
    if (posSeta === sequencia.length) {
      esperandoSetas = false;
      marcar("setasLiberado");
      fecharPainel();
      falar("O painel apita. A tranca da saída cede.");
      registrarDiario("Ação: sequência do painel acertada.");
    }
  } else {
    esperandoSetas = false;
    fecharPainel();
    falar("Sequência errada. O painel zerou. Tente novamente.");
    registrarDiario("Erro: a sequência do painel estava incorreta.");
  }
}

// O portão exige que os três mecanismos estejam liberados.
function clicarPortao() {
  var faltando = [];
  if (!foi("laserDesligado")) faltando.push("laser ativo");
  if (!foi("leitorLiberado")) faltando.push("leitor sem cartão");
  if (!foi("setasLiberado")) faltando.push("painel travado");

  if (faltando.length > 0) {
    falar("O portão não abre: " + faltando.join(", ") + ".");
  } else {
    escapar();
  }
}

// O medalhão libera o final secreto.
function clicarSombra() {
  if (itemSelecionado() === "medalhao") {
    perder("medalhao");
    terminarJogo("secreto");
  } else {
    falar("Dois olhos vermelhos o encaram. Ela parece esperar algo de você.");
  }
}

iniciarPagina();
