const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const listaJugadores = []; // Lista de jugadores

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use('/Models', express.static(join(__dirname, 'Models')));
app.use('/Assets', express.static(join(__dirname, 'Assets')));
app.use('/Orders', express.static(join(__dirname, 'Orders')));
app.use('/Inventory', express.static(join(__dirname, 'Inventory')));
app.use('/Frontend', express.static(join(__dirname, 'Frontend')));
app.use('/game.html', express.static(join(__dirname, 'game.html')));
app.use('/game.css', express.static(join(__dirname, 'game.css')));
app.use('/main.js', express.static(join(__dirname, 'main.js')));
app.use('/dishdashAPI', express.static(join(__dirname, 'dishdashAPI')));
app.use('/CargarModelo.js', express.static(join(__dirname, 'CargarModelo.js')));
app.use('/CargarChef.js', express.static(join(__dirname, 'CargarChef.js')));
app.use('/Inventario.js', express.static(join(__dirname, 'Inventario.js')));
app.use('/getParticleSystem.js', express.static(join(__dirname, 'getParticleSystem.js')));
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '/Frontend/Index.html'));
});

// io.on('connection', (socket) => {
//     console.log('Un jugador se ha conectado.');

//     // Cuando un jugador se mueva
//     socket.on('playerMove', (data) => {
//         console.log(`Jugador ${data.id} movido a X=${data.position.x}, Y=${data.position.y}, Z=${data.position.z}`);

//         // Transmitir la nueva posición a todos los demás jugadores
//         socket.broadcast.emit('updatePlayerPosition', data);
//     });

//     socket.on('disconnect', () => {
//         console.log('Un jugador se ha desconectado.');
//     });
// });
const posicionesIniciales = [
  { x: -2, y: 0, z: 1.5 },
  { x: 2, y: 0, z: 2 },
];
io.on('connection', (socket) => {
  console.log(`[DEBUG] Usuario conectado: ${socket.id}`);

  socket.on('Iniciar', (nombre) => {
    console.log(`[DEBUG] Jugador iniciado: ${nombre}`);

    // Crear jugador y asignar posición inicial
    const posicionIndex = listaJugadores.length;
    console.log(`[DEBUG] Posicion inicial index: ${posicionIndex}`);
    const posicion = posicionesIniciales[posicionIndex] || { x: 0, y: 0, z: 0 };

    const jugador = {
      socketId: socket.id,
      name: nombre,
      PosX: posicion.x,
      PosY: posicion.y,
      PosZ: posicion.z,
      lives:3,
      IsMoving: false,
    };

    listaJugadores.push(jugador);

    // Enviar lista completa al nuevo jugador
    socket.emit('ListaJugadores', listaJugadores);

    // Notificar a otros jugadores del nuevo jugador
    socket.broadcast.emit('JugadorConectado', jugador);

    console.log("[DEBUG] Lista actualizada de jugadores:", listaJugadores);
  });

  socket.on('PosicionActualizada', (data) => {
    // console.log(`[DEBUG] Posición actualizada recibida de ${data.name}:`, data);
  
    // Buscar al jugador en la lista y actualizar su posición
    const jugador = listaJugadores.find((player) => player.name === data.name && player.socketId === socket.id);
    if (jugador) {
      jugador.PosX = data.PosX;
      jugador.PosY = data.PosY;
      jugador.PosZ = data.PosZ;
      jugador.IsMoving = data.IsMoving;
  
      // Emitir la posición actualizada a los demás jugadores
      socket.broadcast.emit('updatePlayerPosition', {
        name: data.name,
        PosX: data.PosX,
        PosY: data.PosY,
        PosZ: data.PosZ,
        IsMoving: data.IsMoving,
      });
  
      // console.log(`[DEBUG] Posición actualizada en el servidor para ${data.name}:`, jugador);
    } else {
      console.warn(`[WARN] Jugador ${data.name} no encontrado en la lista.`);
    }
  });
  

  let playerConfig = {}; // Configuración del jugador conectado

  // Recibir configuración inicial del jugador
  socket.on('GameConfig', (config) => {
    playerConfig = { ...config, socketId: socket.id }; // Guardar configuración del jugador
    console.log(`[DEBUG] Configuración recibida de ${socket.id}:`, playerConfig);

    // Notificar a todos los jugadores conectados sobre el nuevo jugador
    socket.broadcast.emit('JugadorConectado', playerConfig);
  });

  // Manejar actualización de vidas compartidas
  socket.on('updateSharedLives', (data) => {
    console.log(`[DEBUG] Vidas compartidas actualizadas a: ${data.lives}`);
    io.emit('updateSharedLives', { lives: data.lives });

    // Fin del juego si las vidas llegan a 0
    if (data.lives === 0) {
      io.emit('FinDeJuego', { resultado: "Todos perdieron", map: playerConfig.map });
      console.log("[DEBUG] Fin del juego en modo cooperativo: todos perdieron.");
    }
  });

  // Manejar actualización de vidas individuales
  socket.on('updatePlayerLives', (data) => {
    console.log(`[DEBUG] Vidas individuales actualizadas para ${data.name}: ${data.lives}`);
    socket.broadcast.emit('updatePlayerLives', data);

    // Fin del juego si un jugador pierde todas las vidas
    if (data.lives === 0) {
      const jugadoresRestantes = listaJugadores.filter((p) => p.socketId !== socket.id && p.lives > 0);
      if (jugadoresRestantes.length === 1) {
        io.emit('FinDeJuego', {
          resultado: `Ganó ${jugadoresRestantes[0].name}`,
          map: playerConfig.map,
        });
        console.log(`[DEBUG] Fin del juego en modo versus: Ganó ${jugadoresRestantes[0].name}.`);
      } else if (jugadoresRestantes.length === 0) {
        io.emit('FinDeJuego', { resultado: "Empate", map: playerConfig.map });
        console.log("[DEBUG] Fin del juego en modo versus: Empate.");
      }
    }
  });


  // Manejar desconexión de un jugador
  socket.on('disconnect', () => {
    console.log(`[DEBUG] Usuario desconectado: ${socket.id}`);
  // Remover jugador de la lista
    const index = listaJugadores.findIndex((player) => player.socketId === socket.id);
    if (index !== -1) {
      const jugadorEliminado = listaJugadores.splice(index, 1)[0];
    }
    // Notificar a los demás jugadores que este jugador se desconectó
    io.emit('JugadorDesconectado', { name: playerConfig.name });
    console.log(`[DEBUG] Jugador desconectado: ${playerConfig.name}`);
  });

});


server.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
