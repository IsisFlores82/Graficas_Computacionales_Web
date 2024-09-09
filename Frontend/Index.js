// Función para verificar si hay algún modal visible y ocultar/mostrar el texto "parpadea"
function checkModalsVisibility() {
  var parpadeaText = document.querySelector('.parpadea');
  var anyModalOpen = document.querySelector('.modal.show'); // Verifica si algún modal tiene la clase "show"
  var startmenuopen = document.querySelector('.modal-open'); // Verifica si algún modal tiene la clase "show"
  if (parpadeaText) {
    if (anyModalOpen||startmenuopen) {
      parpadeaText.style.display = 'none'; // Oculta el texto parpadeante si algún modal está abierto
    } else {
      parpadeaText.style.display = 'block'; // Muestra el texto si no hay modales abiertos
    }
  }
}

// Función para manejar la apertura del StartModal con teclas
document.addEventListener('keydown', function(event) {
  // Presiona enter o espacio para lanzar el menu
  if (event.key === ' ' || event.key === 'Enter') {
    var myModalElement = document.getElementById('StartModal');

    // Verifica si el modal ya está abierto
    if (!myModalElement.classList.contains('show')) {
      var myModal = new bootstrap.Modal(myModalElement);
      myModal.show();

      // Oculta el texto parpadea cuando se muestra el modal
      checkModalsVisibility();
    }
  }
});

// Asegúrate de manejar el evento de cierre del modal StartModal una sola vez
document.getElementById('StartModal').addEventListener('hidden.bs.modal', function() {
  // Verifica si no hay otros modales visibles antes de mostrar el texto "parpadea"
  checkModalsVisibility();
});

// Función para ocultar StartModal y abrir GameMenuModal
document.getElementById('BtnComenzar').addEventListener('click', function() {
  var startModalElement = document.getElementById('StartModal');
  var gameMenuModalElement = document.getElementById('GameMenuModal');

  // Oculta el StartModal si está abierto
  var startModal = bootstrap.Modal.getInstance(startModalElement);
  if (startModal) {
    startModal.hide();
  }

  // Muestra el GameMenuModal
  var gameMenuModal = new bootstrap.Modal(gameMenuModalElement);
  gameMenuModal.show();

  // Oculta el texto parpadea cuando se muestra el modal
  checkModalsVisibility();

  // Cuando se cierra el GameMenuModal, vuelve a mostrar el StartModal
  gameMenuModalElement.addEventListener('hidden.bs.modal', function() {
    // No es necesario crear una nueva instancia, solo muestra la instancia existente
    startModal.show();

    // Verifica si no hay otros modales visibles antes de mostrar el texto "parpadea"
    checkModalsVisibility();
  }, { once: true }); // Asegura que el event listener se ejecute solo una vez
});

// Función para abrir el modal del Leaderboard cuando se presione el botón con ID BtnLeaderboard
document.getElementById('BtnLeaderboard').addEventListener('click', function() {
  var leaderboardModalElement = document.getElementById('LeaderboardModal');

  if (!leaderboardModalElement.classList.contains('show')) {
    var leaderboardModal = new bootstrap.Modal(leaderboardModalElement);
    leaderboardModal.show();

    // Oculta el texto parpadea cuando se muestra el modal
    checkModalsVisibility();

    // Cuando se cierra el LeaderboardModal, verifica si no hay otros modales visibles
    leaderboardModalElement.addEventListener('hidden.bs.modal', function() {
      checkModalsVisibility();
    });
  }
});

//Función para abrir el modal de Settings cuando se presione el boton
document.getElementById('BtnSettings').addEventListener('click', function() {
  var startModalElement = document.getElementById('StartModal');
  var settingsmodal = document.getElementById('Settings');

  // Oculta el StartModal si está abierto
  var startModal = bootstrap.Modal.getInstance(startModalElement);
  if (startModal) {
    startModal.hide();
  }

  // Muestra el GameMenuModal
  var gameMenuModal = new bootstrap.Modal(settingsmodal);
  gameMenuModal.show();

  // Oculta el texto parpadea cuando se muestra el modal
  checkModalsVisibility();

  // Cuando se cierra el GameMenuModal, vuelve a mostrar el StartModal
  settingsmodal.addEventListener('hidden.bs.modal', function() {
    // No es necesario crear una nueva instancia, solo muestra la instancia existente
    startModal.show();

    // Verifica si no hay otros modales visibles antes de mostrar el texto "parpadea"
    checkModalsVisibility();
  }, { once: true }); // Asegura que el event listener se ejecute solo una vez
});


// Función para validar que se ingrese un nombre de usuario
function validateUsername() {
  var usernameInput = document.getElementById('usernameInput');
  var usernameError = document.getElementById('usernameError');

  // Verifica si el campo de nombre de usuario está vacío
  if (usernameInput.value.trim() === "") {
    usernameError.classList.remove('d-none');  // Muestra el mensaje de error
    return false;
  } else {
    usernameError.classList.add('d-none');  // Oculta el mensaje de error
    return true;
  }
}


document.addEventListener('DOMContentLoaded', function() {
  var playerList = document.getElementById('playerList');

  // Ejemplo de jugadores
  var players = ['Nevi', 'Ryneh', 'Imsis']; 

  players.forEach(function(player) {
    if (playerList.children.length < 4) { // Asegura que no haya más de 4 jugadores
      var listItem = document.createElement('li');
      listItem.className = 'list-group-item';
      listItem.textContent = player;
      playerList.appendChild(listItem);
    }
  });
});

document.getElementById('BtnCreateGame').addEventListener('click', function() {
  var gameMenuModalElement = document.getElementById('GameMenuModal');
  var createGameModalElement = document.getElementById('CreateGameModal');
  if (validateUsername()){
  alert('Partida creada con el nombre de usuario: ' + document.getElementById('usernameInput').value);

  var gameMenuModal = bootstrap.Modal.getInstance(gameMenuModalElement);
  if (gameMenuModal) {
    gameMenuModal.hide();
  }

    var createGameModal = new bootstrap.Modal(createGameModalElement);
    createGameModal.show();
  }
});

document.getElementById('BtnSearchGame').addEventListener('click', function() {
  var gameMenuModalElement = document.getElementById('GameMenuModal');
  var joinGameModalElement = document.getElementById('JoinGameModal');
  if (validateUsername()){
    alert('Buscando partidas con el nombre de usuario: ' + document.getElementById('usernameInput').value);

  var gameMenuModal = bootstrap.Modal.getInstance(gameMenuModalElement);
  if (gameMenuModal) {
    gameMenuModal.hide();
  }

    var joinGameModal = new bootstrap.Modal(joinGameModalElement);
    joinGameModal.show();
  }
});

document.querySelectorAll('#availableGamesList .list-group-item').forEach(item => {
  item.addEventListener('click', function() {
    // Desmarcar todos los elementos
    document.querySelectorAll('#availableGamesList .list-group-item').forEach(el => {
      el.classList.remove('active');
    });

    // Marcar el elemento seleccionado
    this.classList.add('active');

    // Habilitar el botón "Unirse"
    document.getElementById('joinGameButton').disabled = false;
    document.getElementById('joinGameButton').dataset.game = this.dataset.game;
  });
});

document.getElementById('joinGameButton').addEventListener('click', function() {
  var selectedGame = this.dataset.game;

  if (selectedGame) {
    // Lógica para unirse a la partida seleccionada
    console.log('Unirse a la partida:', selectedGame);
    
    // Cierra el modal después de unirse a la partida
    var joinGameModalElement = document.getElementById('JoinGameModal');
    var joinGameModal = bootstrap.Modal.getInstance(joinGameModalElement);
    if (joinGameModal) {
      joinGameModal.hide();
    }
  } else {
    alert('Por favor, selecciona una partida antes de unirte.');
  }
});

// Valor del porcentaje de la barra de volumen 
const volumeSlider = document.getElementById('volumegame');
const volumeValue = document.getElementById('volumeValue');

const volumeSlider1 = document.getElementById('volumemusic');
const volumeValue1 = document.getElementById('volumeValue2');

const volumeSlider2 = document.getElementById('volumesfx');
const volumeValue2 = document.getElementById('volumeValue3');


volumeSlider.addEventListener('input', function() {
  volumeValue.textContent = volumeSlider.value + '%';
});

volumeSlider1.addEventListener('input', function() {
  volumeValue1.textContent = volumeSlider1.value + '%';
});

volumeSlider2.addEventListener('input', function() {
  volumeValue2.textContent = volumeSlider2.value + '%';
});