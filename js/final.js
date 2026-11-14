var finais = {
  perfeito: {
    titulo: "Fuga perfeita",
    texto: "Você fecha a porta por fora e as batidas param. Do outro lado do vidro, a Sombra ainda está olhando para o corredor. Ela não viu você sair."
  },
  sequelas: {
    titulo: "Fuga com sequelas",
    texto: "Você consegue sair, mas traz o som dos dutos com você. Na primeira noite fora da casa, as mesmas três batidas vêm de dentro da parede."
  },
  alarme: {
    titulo: "Captura pelo alarme",
    texto: "Ao terceiro erro, uma sirene ecoa pelos dutos. As travas da porta descem. Antes que a sirene pare, a Sombra já está atrás de você."
  },
  tempo: {
    titulo: "Captura pelo Breu",
    texto: "A lanterna apaga. Quando você estende a mão, alguém do escuro segura a sua. Já é tarde para encontrar a saída."
  },
  secreto: {
    titulo: "Final secreto: o pacto",
    texto: "Você oferece o medalhão. A Sombra toca o risco na meia-lua, e a porta se abre. Quando os dutos chamam pelo seu nome, você entende o preço: a guardiã pode sair, e a casa agora é sua."
  },
  ficou: {
    titulo: "Você ficou",
    texto: "Você solta a maçaneta e volta pelo corredor. Atrás de você, a porta fecha devagar. As batidas nos dutos aprendem a repetir o seu nome."
  }
};

function mostrarFinal() {
  carregarEstado();
  var final = finais[partida.final];
  if (!final) {
    irPara("index.html");
    return;
  }

  pegar("titulo").textContent = final.titulo;
  pegar("texto").textContent = final.texto;
  pegar("tempo-gasto").textContent = partida.tempoGasto === undefined
    ? "Tempo gasto indisponível para esta partida."
    : "Tempo gasto: " + formatarTempo(Math.floor(partida.tempoGasto / 1000));
  var lista = pegar("pistas-encontradas");
  lista.textContent = "";
  pegar("pistas-vazias").hidden = diario.entradas.length !== 0;
  for (var i = 0; i < diario.entradas.length; i++) {
    var pista = document.createElement("li");
    pista.textContent = diario.entradas[i];
    lista.appendChild(pista);
  }
}

mostrarFinal();
