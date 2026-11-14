var PREFIXO = "ecos:";
var partida = { iniciada: false, final: "" };

var fichaDosItens = {
  chavefenda: { nome: "Chave de fenda", descricao: "A ponta encaixa no parafuso enferrujado do bueiro." },
  alicate: { nome: "Alicate", descricao: "Forte o bastante para cortar as correntes da caldeira." },
  chave: { nome: "Chave de latão", descricao: "Os dentes da chave encaixam no cadeado do quarto." },
  corrente: { nome: "Corrente de prata", descricao: "O fecho tem espaço para um pingente." },
  pingente: { nome: "Pingente", descricao: "Tem uma meia-lua riscada e um furo para passar uma corrente." },
  medalhao: { nome: "Medalhão", descricao: "A meia-lua riscada é a marca de quem guardava a casa." },
  pedecabra: { nome: "Pé de cabra", descricao: "Serve para forçar a porta do armazém e a tampa das caixas no quarto." },
  bateria: { nome: "Bateria portátil", descricao: "O plugue encaixa na entrada de energia dos monitores." },
  recorte: { nome: "Recorte de papel", descricao: "Um pedaço de papel com a frase «Ligue o UV…». A frase continua na outra metade." },
  fragmento: { nome: "Fragmento do retrato", descricao: "Uma tira de papel com a frase «…e leia os canais de 01 a 04». A borda está rasgada." },
  bilhete: { nome: "Bilhete da guardiã", descricao: "Ligue o UV e leia os canais de 01 a 04. Digite os números nessa ordem." }
};

var inventario = {
  itens: [],
  selecionado: "",

  tem: function (item) {
    return this.itens.indexOf(item) !== -1;
  },

  ganhar: function (item) {
    if (!this.tem(item)) this.itens.push(item);
  },

  perder: function (item) {
    var posicao = this.itens.indexOf(item);
    if (posicao !== -1) this.itens.splice(posicao, 1);
    if (this.selecionado === item) this.selecionado = "";
  },

  selecionar: function (item) {
    this.selecionado = this.tem(item) ? item : "";
  },

  inspecionar: function () {
    var item = this.selecionado;
    if (item === "medalhao" && puzzles.retrato.inspecionado) {
      return "A meia-lua do medalhão tem o mesmo risco que você viu na moldura do retrato.";
    }
    return item ? fichaDosItens[item].descricao : "Selecione um item para inspecionar.";
  },

  combinar: function (primeiro, segundo) {
    if (!this.tem(primeiro) || !this.tem(segundo)) return "";
    return puzzles.medalhao.tentar(primeiro, segundo) || puzzles.bilhete.tentar(primeiro, segundo);
  }
};

var diario = {
  entradas: [],

  registrar: function (texto) {
    if (this.entradas.indexOf(texto) === -1) this.entradas.push(texto);
  },

  abrir: function () {
    if (puzzles.diario.estado !== "resolvido") return;
    paginaDiario = 0;
    atualizarPaginaDiario();
    abrirPainel("diario");
  }
};

function criarEnigma(dados) {
  var enigma = {
    estado: "trancado",
    itemNecessario: "",
    pistasNecessarias: [],
    inspecionado: false,
    tentativas: 0,
    afeta: [],

    inspecionar: function () {
      this.inspecionado = true;
      return this.pista;
    },

    tentar: function (item) {
      if (this.estado === "resolvido") return "";
      this.inspecionar();
      this.tentativas++;
      if (this.itemNecessario && item !== this.itemNecessario) return this.pista;
      return this.resolver();
    },

    resolver: function () {
      if (this.estado === "resolvido") return "";
      this.estado = "resolvido";
      if (this.aoResolver) this.aoResolver();
      return this.sucesso;
    }
  };
  for (var campo in dados) enigma[campo] = dados[campo];
  return enigma;
}

function criarColeta(nome, cena, item, afeta, sucesso, anotacao) {
  return criarEnigma({
    nome: nome,
    cena: cena,
    estado: "aberto",
    afeta: afeta,
    sucesso: sucesso,

    aoResolver: function () {
      inventario.ganhar(item);
      diario.registrar(anotacao);
    }
  });
}

function criarCombinacao(nome, primeiroItem, segundoItem, resultado, afeta, sucesso) {
  return criarEnigma({
    nome: nome,
    cena: "Inventário",
    estado: "aberto",
    itemNecessario: [primeiroItem, segundoItem],
    afeta: afeta,
    sucesso: sucesso,

    tentar: function (primeiro, segundo) {
      var encaixa = (primeiro === primeiroItem && segundo === segundoItem) ||
        (primeiro === segundoItem && segundo === primeiroItem);
      if (!encaixa) return "";
      this.inspecionar();
      this.tentativas++;
      return this.resolver();
    },

    aoResolver: function () {
      inventario.perder(primeiroItem);
      inventario.perder(segundoItem);
      inventario.ganhar(resultado);
      diario.registrar(this.sucesso);
    }
  });
}

function criarPuzzles() {
  return {
    bueiro: criarEnigma({
      nome: "Bueiro",
      cena: "Quarto",
      itemNecessario: "chavefenda",
      voltas: 0,
      girosParaSoltar: 3,
      afeta: ["portaQuarto", "cameras"],
      pista: "O parafuso da grade está enferrujado. Selecione a chave de fenda.",
      sucesso: "A grade se solta. Você encontra uma chave de latão lá embaixo.",

      tentar: function (item, sentido) {
        this.inspecionar();
        if (this.estado === "resolvido") return "A grade está aberta. A chave de latão já foi retirada.";
        this.tentativas++;
        if (item !== this.itemNecessario) return this.pista;
        this.estado = "aberto";

        if (sentido === "esquerda") {
          this.voltas++;
          if (this.voltas === this.girosParaSoltar) return this.resolver();
        } else if (sentido === "direita") {
          if (this.voltas > 0) this.voltas--;
          return "Isso aperta o parafuso. Gire para a esquerda.";
        }
        return "";
      },

      aoResolver: function () {
        inventario.perder("chavefenda");
        inventario.ganhar("chave");
        diario.registrar("Bueiro aberto. A chave de latão estava sob a grade.");
      }
    }),

    portaQuarto: criarEnigma({
      nome: "Cadeado do quarto",
      cena: "Quarto",
      itemNecessario: "chave",
      afeta: ["retrato", "armazem", "peDeCabra", "monitores", "terminal"],
      pista: "A porta está presa por um cadeado. Encontre a chave de latão.",
      sucesso: "A chave gira. O cadeado cai e a porta se abre.",

      aoResolver: function () {
        inventario.perder("chave");
        diario.registrar("O cadeado do quarto abriu com a chave de latão.");
      }
    }),

    diario: criarEnigma({
      nome: "Diário antigo",
      cena: "Quarto",
      estado: "aberto",
      afeta: ["medalhao", "diario"],
      sucesso: "Você encontrou o diário e a corrente de prata. O botão Diário foi liberado.",

      aoResolver: function () {
        inventario.ganhar("corrente");
        diario.registrar("Encontrei o diário. A corrente de prata estava guardada entre as páginas e tem um fecho para pingente.");
      }
    }),

    caldeira: criarEnigma({
      nome: "Caldeira acorrentada",
      cena: "Subsolo",
      itemNecessario: "alicate",
      afeta: ["relatorio", "cameras"],
      pista: "A caldeira está presa por correntes. Selecione o alicate para cortá-las.",
      sucesso: "Você corta as correntes da caldeira. Um papel dobrado estava escondido dentro dela.",

      aoResolver: function () {
        inventario.perder("alicate");
        puzzles.relatorio.estado = "aberto";
        diario.registrar("Cortei as correntes da caldeira com o alicate.");
      }
    }),

    relatorio: criarEnigma({
      nome: "Relatório do Breu",
      cena: "Subsolo",
      afeta: ["medalhao", "retrato", "cameras"],
      pista: "Há algo escondido atrás das correntes da caldeira.",
      sucesso: "Você guardou o pingente que estava embrulhado no relatório.",
      texto: "O Breu se espalha pela matéria orgânica e reage ao medo. A luz ultravioleta o enfraquece. Desde que ele entrou pelos dutos, as vozes passaram a imitar as nossas. A guardiã deixou o retrato no corredor, perto da porta da frente. A meia-lua riscada na moldura também foi gravada no pingente que ela usava.",

      tentar: function () {
        this.tentativas++;
        this.inspecionar();
        if (this.estado === "trancado") return this.pista;
        return this.resolver();
      },

      aoResolver: function () {
        inventario.ganhar("pingente");
        diario.registrar("Relatório do Breu: a meia-lua riscada no retrato da guardiã também está gravada no pingente.");
      }
    }),

    medalhao: criarCombinacao("Montar medalhão", "corrente", "pingente", "medalhao",
      ["retrato", "final"], "A corrente e o pingente formam um medalhão gravado com uma meia-lua riscada."),

    armazem: criarEnigma({
      nome: "Porta emperrada do armazém",
      cena: "Corredor",
      itemNecessario: "pedecabra",
      afeta: ["bateria", "cameras"],
      pista: "A porta está emperrada. Talvez haja uma ferramenta na Sala de Segurança.",
      sucesso: "O pé de cabra soltou a porta emperrada do armazém.",

      aoResolver: function () {
        diario.registrar(this.sucesso);
      }
    }),

    monitores: criarEnigma({
      nome: "Central de monitores",
      cena: "Sala de Segurança",
      itemNecessario: "bateria",
      afeta: ["cameras", "terminal"],
      pista: "Os quatro monitores compartilham uma entrada de energia. Procure uma bateria portátil.",
      sucesso: "A bateria portátil ligou os quatro monitores da Sala de Segurança.",

      aoResolver: function () {
        inventario.perder("bateria");
        puzzles.cameras.estado = "aberto";
        puzzles.terminal.estado = "aberto";
        diario.registrar(this.sucesso);
      }
    }),

    cameras: criarEnigma({
      nome: "Filtro UV das quatro câmeras",
      cena: "Câmeras",
      canaisVistos: [],
      afeta: ["terminal"],
      pista: "A luz UV revela números que a câmera normal não mostra.",
      sucesso: "Os quatro dígitos foram descobertos.",

      descrever: function (camera) {
        if (camera.nome === "Quarto") {
          return puzzles.bueiro.estado === "resolvido" ? "Bueiro aberto" : "Bueiro fechado";
        }
        if (camera.nome === "Subsolo") {
          return puzzles.caldeira.estado === "resolvido" ? "Correntes da caldeira cortadas" : "Caldeira acorrentada";
        }
        if (camera.nome === "Corredor") {
          return puzzles.terminal.alarme > 0 ? "Alertas do terminal: " + puzzles.terminal.alarme : "";
        }
        if (camera.nome === "Armazém" && puzzles.bateria.estado === "resolvido") return "Bancada sem a bateria";
        return "";
      },

      tentar: function (camera) {
        if (this.estado === "trancado") return "";
        this.inspecionar();
        this.tentativas++;
        if (this.canaisVistos.indexOf(camera.nome) === -1) {
          this.canaisVistos.push(camera.nome);
          diario.registrar(camera.nome + " (UV): dígito " + camera.digito + ".");
        }
        if (this.canaisVistos.length === cameras.length) this.resolver();
        return camera.digito;
      }
    }),

    terminal: criarEnigma({
      nome: "Terminal da porta da frente",
      cena: "Corredor",
      pistasNecessarias: ["Quarto", "Subsolo", "Corredor", "Armazém"],
      alarme: 0,
      bloqueadoAte: 0,
      afeta: ["cameras", "saida"],
      pista: "A senha usa os dígitos dos canais 01 a 04, em ordem.",
      sucesso: "O terminal liberou a porta da frente.",

      tentar: function (codigo) {
        this.inspecionar();
        if (this.estado === "trancado") {
          return "A central de câmeras está desligada. Ligue os monitores na Sala de Segurança.";
        }
        if (this.estado === "resolvido") return "";
        if (Date.now() < this.bloqueadoAte) return "Aguarde o desbloqueio do terminal.";
        this.tentativas++;
        if (codigo === senhaDoTerminal(this.pistasNecessarias)) return this.resolver();

        this.alarme++;
        if (this.alarme % 3 === 0) {
          this.bloqueadoAte = Date.now() + 8000;
          diario.registrar("O alarme bloqueou o terminal por alguns segundos.");
          return "Alarme " + this.alarme + ". Terminal bloqueado por 8 segundos.";
        }
        return "Sequência incorreta. Alarme " + this.alarme + ". Confira os dígitos dos canais 01 a 04.";
      },

      aoResolver: function () {
        this.bloqueadoAte = 0;
        diario.registrar(this.sucesso);
      }
    }),

    retrato: criarEnigma({
      nome: "Retrato da guardiã",
      cena: "Corredor",
      estado: "aberto",
      itemNecessario: "medalhao",
      afeta: ["medalhao", "bilhete"],
      pista: "Uma meia-lua riscada marca a moldura. Atrás dela, você encontra um pedaço de papel.",
      sucesso: "A meia-lua riscada do medalhão coincide com a da moldura.",

      tentar: function (item) {
        var primeiraVez = !this.inspecionado;
        this.inspecionar();
        this.tentativas++;
        if (primeiraVez) {
          inventario.ganhar("fragmento");
          diario.registrar("Retrato: a guardiã usava o medalhão de meia-lua. No verso da moldura alguém escreveu: «A Sombra já sabe meu nome».");
        }
        if (item === this.itemNecessario) {
          this.resolver();
          return primeiraVez ? this.pista + " " + this.sucesso : this.sucesso;
        }
        return primeiraVez ? this.pista : "A meia-lua riscada na moldura parece a marca de uma joia.";
      },

      aoResolver: function () {
        diario.registrar(this.sucesso);
      }
    }),

    caixas: criarEnigma({
      nome: "Caixas do quarto",
      cena: "Quarto",
      itemNecessario: "pedecabra",
      afeta: ["bueiro", "bilhete"],
      pista: "Há marcas de arrasto até o bueiro. Uma das caixas tem um fundo que dá para forçar.",
      sucesso: "Você forçou o fundo da caixa e achou um recorte de papel.",

      tentar: function (item) {
        this.inspecionar();
        this.tentativas++;
        if (this.estado === "resolvido") return "O compartimento das caixas está vazio.";
        diario.registrar("Caixas: marcas de arrasto levam ao bueiro.");
        if (item !== this.itemNecessario) return this.pista;
        return this.resolver();
      },

      aoResolver: function () {
        inventario.ganhar("recorte");
        diario.registrar(this.sucesso);
      }
    }),

    bilhete: criarCombinacao("Reconstruir bilhete", "recorte", "fragmento", "bilhete",
      ["terminal"], "As duas metades formam o bilhete da guardiã: ligue o UV e leia os canais de 01 a 04 em ordem."),

    chaveFenda: criarColeta("Chave de fenda", "Subsolo", "chavefenda", ["bueiro"],
      "Chave de fenda coletada. Ela pode soltar o parafuso do bueiro.", "Encontrei a chave de fenda no subsolo."),
    alicate: criarColeta("Alicate", "Subsolo", "alicate", ["caldeira"],
      "Alicate coletado. As correntes da caldeira parecem cortáveis.", "Encontrei o alicate no subsolo."),
    peDeCabra: criarColeta("Pé de cabra", "Sala de Segurança", "pedecabra", ["armazem", "caixas"],
      "Você pegou o pé de cabra. Ele pode abrir a porta emperrada do armazém.", "Encontrei o pé de cabra na Sala de Segurança."),
    bateria: criarColeta("Bateria portátil", "Armazém", "bateria", ["monitores"],
      "Você pegou a bateria portátil. Use-a num monitor da Sala de Segurança.", "Encontrei uma bateria portátil no armazém.")
  };
}

var puzzles = criarPuzzles();

function salvarEstado() {
  var estado = {
    partida: partida,
    puzzles: puzzles,
    itens: inventario.itens,
    selecionado: inventario.selecionado,
    entradas: diario.entradas
  };
  localStorage.setItem(PREFIXO + "estado", JSON.stringify(estado));
}

function carregarEstado() {
  var salvo = localStorage.getItem(PREFIXO + "estado");
  if (!salvo) {
    if (localStorage.getItem(PREFIXO + "partidaIniciada") === "sim") importarEtapa1();
    return;
  }

  var estado = JSON.parse(salvo);
  partida = estado.partida;
  inventario.itens = estado.itens;
  inventario.selecionar(estado.selecionado);
  diario.entradas = estado.entradas;

  // As funções ficam no código. Só o progresso vem do arquivo salvo.
  var campos = ["estado", "inspecionado", "tentativas", "voltas", "canaisVistos", "alarme", "bloqueadoAte"];
  for (var nome in puzzles) {
    if (!estado.puzzles[nome]) continue;
    for (var i = 0; i < campos.length; i++) {
      var campo = campos[i];
      if (campo in estado.puzzles[nome]) puzzles[nome][campo] = estado.puzzles[nome][campo];
    }
  }
}

function limparJogo(manterEstado) {
  for (var i = localStorage.length - 1; i >= 0; i--) {
    var chave = localStorage.key(i);
    if (chave.indexOf(PREFIXO) === 0 && chave !== PREFIXO + "modoClaro" &&
        (!manterEstado || chave !== PREFIXO + "estado")) {
      localStorage.removeItem(chave);
    }
  }
}

// Transfere o progresso de quem já começou uma partida na Etapa 1.
function importarEtapa1() {
  var resolvidos = {
    bueiroAberto: "bueiro",
    portaAberta: "portaQuarto",
    diarioPego: "diario",
    caldeiraAberta: "caldeira",
    papelBreuLido: "relatorio",
    "tem-medalhao": "medalhao",
    armazemAberto: "armazem",
    monitoresLigados: "monitores",
    portaFrenteAberta: "terminal",
    chaveFendaPega: "chaveFenda",
    alicatePego: "alicate",
    peDeCabraPego: "peDeCabra",
    bateriaPega: "bateria"
  };
  for (var chave in resolvidos) {
    if (localStorage.getItem(PREFIXO + chave) !== "sim") continue;
    var enigma = puzzles[resolvidos[chave]];
    enigma.estado = "resolvido";
    enigma.inspecionado = true;
  }
  for (var item in fichaDosItens) {
    if (localStorage.getItem(PREFIXO + "tem-" + item) === "sim") inventario.ganhar(item);
  }
  if (puzzles.armazem.estado === "resolvido") inventario.ganhar("pedecabra");
  if (puzzles.monitores.estado === "resolvido") {
    puzzles.cameras.estado = "aberto";
    if (puzzles.terminal.estado === "trancado") puzzles.terminal.estado = "aberto";
  }
  if (puzzles.caldeira.estado === "resolvido" && puzzles.relatorio.estado === "trancado") {
    puzzles.relatorio.estado = "aberto";
  }

  puzzles.bueiro.voltas = Number(localStorage.getItem(PREFIXO + "voltasParafuso")) || 0;
  if (puzzles.bueiro.voltas > 0 && puzzles.bueiro.estado === "trancado") puzzles.bueiro.estado = "aberto";
  inventario.selecionar(localStorage.getItem(PREFIXO + "selecionado"));
  diario.entradas = JSON.parse(localStorage.getItem(PREFIXO + "diario") || "[]");
  partida.iniciada = true;
  partida.final = localStorage.getItem(PREFIXO + "final") || "";
  salvarEstado();
  limparJogo(true);
}
