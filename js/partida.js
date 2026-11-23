var duracaoPartida = 4 * 60 * 1000;
var tempoFugaPerfeita = 60 * 1000;
var limiteAlarme = 3;
var relogio;
var avisoSussurro;

var esconderijos = {
  relatorio: "O pingente está embrulhado neste relatório.",
  caixas: "Escondi o pingente no fundo falso de uma das caixas do quarto. É preciso forçar a tampa.",
};
var locaisPingente = ["relatorio", "caixas"];

var anotacoesAntigas = [
  "A Sombra aprendeu a falar com a minha voz. Se ouvir alguém chamando nos dutos, não responda.",
  "Vi a Sombra parada diante do retrato. Ela repetiu meu nome antes que eu dissesse uma palavra.",
  "A luz violeta fez a Sombra recuar. Anotei isso antes que ela voltasse a bater nos canos.",
];

var sussurros = [
  "Uma voz sussurra seu nome de dentro da parede.",
  "As batidas nos dutos parecem passos por um instante.",
  "Uma voz conhecida pede que você apague a lanterna.",
  "Alguém atrás de você sussurra: «Eu ainda estou aqui».",
];

function sortearPartida() {
  var digitos = [];
  for (var i = 0; i < 4; i++)
    digitos.push(String(Math.floor(Math.random() * 10)));

  var primeiroSussurro = Math.floor(Math.random() * sussurros.length);
  var segundoSussurro = Math.floor(Math.random() * sussurros.length);
  while (segundoSussurro === primeiroSussurro) {
    segundoSussurro = Math.floor(Math.random() * sussurros.length);
  }
  return {
    digitos: digitos,
    localPingente:
      locaisPingente[Math.floor(Math.random() * locaisPingente.length)],
    canalVulto: 1 + Math.floor(Math.random() * 4),
    anotacao:
      anotacoesAntigas[Math.floor(Math.random() * anotacoesAntigas.length)],
    sussurros: [sussurros[primeiroSussurro], sussurros[segundoSussurro]],
  };
}

function iniciarTempo() {
  partida.inicio = Date.now();
  partida.sorteio = sortearPartida();
  partida.sussurrosMostrados = 0;
}

function prepararPartida() {
  if (!partida.iniciada || partida.final || partida.sorteio) return;
  iniciarTempo();
  salvarEstado();
}

function pistaDoPingente() {
  return esconderijos[partida.sorteio.localPingente];
}

function tempoDecorrido() {
  var tempo = Date.now() - partida.inicio;
  if (tempo < 0) return 0;
  if (tempo > duracaoPartida) return duracaoPartida;
  return tempo;
}

function formatarTempo(segundos) {
  var minutos = Math.floor(segundos / 60);
  var resto = segundos % 60;
  return minutos + ":" + (resto < 10 ? "0" : "") + resto;
}

function calcularFinal(escolha, tempoGasto) {
  if (tempoGasto >= duracaoPartida) return "tempo";
  if (puzzles.terminal.alarme >= limiteAlarme) return "alarme";
  if (puzzles.terminal.estado !== "resolvido") return "";
  if (puzzles.ritmo.estado !== "resolvido") return "";
  if (escolha === "medalhao" && inventario.tem("medalhao")) return "secreto";
  if (escolha === "ficar") return "ficou";
  if (escolha !== "fugir") return "";

  var tempoRestante = duracaoPartida - tempoGasto;
  if (
    tempoRestante >= tempoFugaPerfeita &&
    puzzles.terminal.alarme === 0 &&
    puzzles.cameras.estado === "resolvido"
  )
    return "perfeito";
  return "sequelas";
}

function encerrarPartida(escolha) {
  if (partida.final) return;
  var tempo = tempoDecorrido();
  var final = calcularFinal(escolha, tempo);
  if (!final) return;

  partida.final = final;
  partida.tempoGasto = tempo;
  salvarEstado();
  clearInterval(relogio);
  irPara("final.html");
}

function iniciarRelogio() {
  clearInterval(relogio);
  if (!atualizarRelogio()) return false;
  relogio = setInterval(atualizarRelogio, 1000);
  return true;
}

function atualizarRelogio() {
  if (partida.final) return false;
  var tempo = tempoDecorrido();
  var restante = duracaoPartida - tempo;
  var proporcao = tempo / duracaoPartida;
  var palco = pegar("palco");
  var contador = pegar("tempo-restante");

  contador.textContent = formatarTempo(Math.ceil(restante / 1000));
  contador.classList.toggle("tempo-baixo", restante <= 30000);
  palco.style.setProperty("--luz-escuro", 250 - 140 * proporcao + "px");
  palco.style.setProperty("--breu", 0.7 * proporcao);

  if (restante === 0 || puzzles.terminal.alarme >= limiteAlarme) {
    encerrarPartida("");
    return false;
  }

  mostrarSussurro(tempo);
  return true;
}

function mostrarSussurro(tempo) {
  var momentos = [75000, 155000];
  var indice = partida.sussurrosMostrados;
  if (indice >= momentos.length || tempo < momentos[indice]) return;

  var aviso = pegar("sussurro");
  aviso.textContent = partida.sorteio.sussurros[indice];
  partida.sussurrosMostrados++;
  salvarEstado();
  clearTimeout(avisoSussurro);
  avisoSussurro = setTimeout(function () {
    aviso.textContent = "";
  }, 4800);
}
