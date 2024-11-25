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
    window.location.href = '/';
});

document.getElementById('BtnContinuar').addEventListener('click', function() {
   pauseModal.hide();
});

function obtenerNombreJugador() {
    // Obtener el nombre del jugador desde localStorage
    const jugadorNombre = localStorage.getItem('playerName');
    
    // Verificar si el nombre está disponible
    if (jugadorNombre) {
      // Actualizar el contenido del elemento con id="cronometro"
      const namePlayerElement = document.getElementById('namePlayer');
      namePlayerElement.textContent = jugadorNombre;
    } else {
      console.error('No se ha encontrado el nombre del jugador en localStorage');
    }
  }
  
  // Llamar a la función para obtener el nombre cuando la página se carga
  window.onload = obtenerNombreJugador;