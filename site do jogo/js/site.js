var formulario = document.getElementById("form-contato");

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();
  document.getElementById("aviso-formulario").hidden = false;
  formulario.reset();
});