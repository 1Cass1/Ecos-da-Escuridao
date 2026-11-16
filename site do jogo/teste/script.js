// Contato demonstrativo: troque pelo e-mail real dos desenvolvedores.
const EMAIL_DESENVOLVEDORES = "seuemail@exemplo.com";

function enviarContato(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const assunto = document.getElementById("assunto").value;
  const mensagem = document.getElementById("mensagem").value;

  const corpo = "Nome: " + nome + "\nE-mail para resposta: " + email + "\n\n" + mensagem;
  const link = "mailto:" + EMAIL_DESENVOLVEDORES
    + "?subject=" + encodeURIComponent(assunto)
    + "&body=" + encodeURIComponent(corpo);

  window.location.href = link;
}
