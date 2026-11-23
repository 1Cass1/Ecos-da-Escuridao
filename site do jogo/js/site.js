function enviarFormulario(evento) {
  evento.preventDefault();
  var formulario = document.getElementById("form-contato");
  document.getElementById("aviso-formulario").hidden = false;
  formulario.reset();
}
