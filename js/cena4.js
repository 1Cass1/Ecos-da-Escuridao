// Cena 4: biblioteca
function clicarLivro() {
  falar('Diário do guarda: "A senha do terminal é a data de nascimento da minha filha: 07/13."');
  registrarDiario("Pista: diário do guarda: senha do terminal é 0713.");
}

function clicarRetrato() {
  if (foi("pingentePego")) {
    falar("Uma mulher de olhos tristes. Ela parece familiar.");
    return;
  }
  marcar("pingentePego");
  ganhar("pingente");
  falar("Atrás do retrato há um pingente com o mesmo rosto. Falta algo para prendê-lo.");
  registrarDiario("Segredo: pingente encontrado atrás do retrato.");
}

iniciarPagina();
