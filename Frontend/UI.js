 // Abrir el modal cuando se presiona la tecla Escape
 const pauseModalElement = document.getElementById('PauseModal');
 const pauseModal = new bootstrap.Modal(pauseModalElement);

 // Abrir o cerrar el modal cuando se presiona la tecla Escape
 document.addEventListener('keydown', function(event) {
     if (event.key === 'Escape') {
         // Verificar si el modal ya está visible
         if (pauseModalElement.classList.contains('show')) {
             pauseModal.hide();  // Cerrar el modal si está abierto
         } else {
             pauseModal.show();  // Abrir el modal si está cerrado
         }
     }
 });

 document.getElementById('BtnSalir').addEventListener('click', function() {
    window.location.href = 'index.html';  // Redirigir a index.html
});