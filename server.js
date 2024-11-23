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
app.use('/CargarModelo.js', express.static(join(__dirname, 'CargarModelo.js')));
app.use('/Inventario.js', express.static(join(__dirname, 'Inventario.js')));
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
  { x: -3, y: 0, z: 2 },
  { x: 3, y: 0, z: 2 },
  { x: 0, y: 0, z: 5 },
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
    };

    listaJugadores.push(jugador);

    // Enviar lista completa al nuevo jugador
    socket.emit('ListaJugadores', listaJugadores);

    // Notificar a otros jugadores del nuevo jugador
    socket.broadcast.emit('JugadorConectado', jugador);

    console.log("[DEBUG] Lista actualizada de jugadores:", listaJugadores);
  });

  socket.on('PosicionActualizada', (data) => {
    console.log(`[DEBUG] Posición actualizada recibida de ${data.name}:`, data);
  
    // Buscar al jugador en la lista y actualizar su posición
    const jugador = listaJugadores.find((player) => player.name === data.name && player.socketId === socket.id);
    if (jugador) {
      jugador.PosX = data.PosX;
      jugador.PosY = data.PosY;
      jugador.PosZ = data.PosZ;
  
      // Emitir la posición actualizada a los demás jugadores
      socket.broadcast.emit('updatePlayerPosition', {
        name: data.name,
        PosX: data.PosX,
        PosY: data.PosY,
        PosZ: data.PosZ
      });
  
      console.log(`[DEBUG] Posición actualizada en el servidor para ${data.name}:`, jugador);
    } else {
      console.warn(`[WARN] Jugador ${data.name} no encontrado en la lista.`);
    }
  });
  

  socket.on('disconnect', () => {
    console.log(`[DEBUG] Usuario desconectado: ${socket.id}`);

    // Remover jugador de la lista
    const index = listaJugadores.findIndex((player) => player.socketId === socket.id);
    if (index !== -1) {
      const jugadorEliminado = listaJugadores.splice(index, 1)[0];

      // Notificar a los demás jugadores
      io.emit('JugadorDesconectado', { name: jugadorEliminado.name });
      console.log("[DEBUG] Jugador eliminado:", jugadorEliminado);
    }
  });
});


server.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
