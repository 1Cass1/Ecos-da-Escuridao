function pegarBateria() {
  if (foi("bateriaPega")) return;
  marcar("bateriaPega");
  ganhar("bateria");
  sincronizarObjetos();
  falar("Você pegou uma bateria portátil. Selecione-a e conecte-a a um monitor na Sala de Segurança.");
  registrarDiario("Encontrei uma bateria portátil na bancada do armazém.");
}

iniciarPagina();
