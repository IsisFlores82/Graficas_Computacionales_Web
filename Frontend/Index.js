// FUNCION PARA QUE SALGA LA MODAL POR PRESSIONAR LA TECLA
document.addEventListener('keydown', function(event) {
  // Presiona enter o espacio para lanzar el menu
  if (event.key === ' ' || event.key === 'Enter') {
  // Obtiene el elemento del dom 
  var myModalElement = document.getElementById('StartModal');
    
  // checa si tiene la clase show, para que no se vuelva a abrir si ya esta abierta
  if(!myModalElement.classList.contains('show')){
      var myModal = new bootstrap.Modal(myModalElement);
      myModal.show();
    }           
  }

});


// Función para abrir el modal del Leaderboard cuando se presione el botón con ID BtnLeaderboard
document.getElementById('BtnLeaderboard').addEventListener('click', function() {
  // Obtiene el elemento del modal de leaderboard
  var leaderboardModalElement = document.getElementById('LeaderboardModal');
  
  // Checa si tiene la clase "show" para que no se vuelva a abrir si ya está abierta
  if (!leaderboardModalElement.classList.contains('show')) {
    var leaderboardModal = new bootstrap.Modal(leaderboardModalElement);
    leaderboardModal.show();
  }
});