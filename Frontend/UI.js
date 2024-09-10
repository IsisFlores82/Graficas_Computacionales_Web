const pauseModalElement = document.getElementById('PauseModal');
 const pauseModal = new bootstrap.Modal(pauseModalElement);


 document.addEventListener('keydown', function(event) {
     if (event.key === 'Escape') {
         if (pauseModalElement.classList.contains('show')) {
             pauseModal.hide(); 
         } else {
             pauseModal.show();
         }
     }
 });

 document.getElementById('BtnSalir').addEventListener('click', function() {
    window.location.href = 'index.html';
});