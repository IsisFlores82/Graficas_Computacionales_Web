const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const listaJugadores=[];

const app = express();
const server = createServer(app);
const io = new Server(server);


app.use('/models',express.static( join(__dirname, 'models')))

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('Iniciar', (nombre) => {
    console.log('iniciar nombre: '+nombre);

  listaJugadores.push( {
    name:nombre,
    x:0,
    y:0,
    z:0
  });
  
  for(let item of listaJugadores){
    
   io.emit('Iniciar',item.name);

  }

  });

  socket.on('Posicion', (posicion,nombre) => {
  
    //console.log('nombre: '+nombre+'posicion:'+posicion.x);
   for(let item of listaJugadores){
    console.log('nombre: '+item.name+'posicion:'+item.x);
     if(item.name==nombre){

      item.x=posicion.x;
      item.y=posicion.y;
      item.z=posicion.z;
      console.log('nombre: '+item.name+'posicion:'+item.x);
     }

    io.emit('Posicion',item,item.name);

   }
   });

  
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});