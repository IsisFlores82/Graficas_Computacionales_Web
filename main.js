import * as THREE from 'three';

import { CargarModelo } from './CargarModelo.js';
import { Inventario } from './Inventario.js';

import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.167.1/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://cdn.jsdelivr.net/npm/three@0.167.1/examples/jsm/loaders/MTLLoader.js';

const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 8, 8);
camera.lookAt(0, 0, 0);

// Mapa Restaurate = 1
// Mapa Navidad = 2
// Mapa Crustacio = 3 (Multijugador)
let SelectedMap = 2;

//variables del mapa de navidad
let soda, deliver, letuce, tomato, stove, bigtable2, bigtable3, chef, bigtable, table, trash,
  bread, table2, meat, stoveMeat, stoveBurned, stoveRaw, chef2;

//mas necesarias para el mapa de crustacio
let soda2, deliver2, letuce2, stove2, bread2, table3, table4, stoveMeat2, stoveBurned2, stoveRaw2, trash2;

//mas necesarias para el mapa de restaurant
let table5;

//pausa
let pause = false;

// Inventario del jugador
const inventario = new Inventario();
let imgInventario = 'Inventory/empty.png';

const inventario2 = new Inventario();
let imgInventario2 = 'Inventory/empty.png';

//estados de la estufa
let stoveState = 1; // 0 = vacia 1 = crudo, 2 = cocido, 3 = quemado
let stoveState2 = 1; //por si se juega el mapa de crustacio(mutijugador)

// Variables para el cronómetro
let startTime;
let cronometroInterval;
let fourSecondsPassed = false;
let cookingTimeout;

// Variables para las ordenes
const orders = [
  { id: 1, items: { bread: true, donemeat: true, letuce: true }, path: 'Orders/Hamb1.png' },
  { id: 2, items: { bread: true, donemeat: true, tomate: true }, path: 'Orders/Hamb2.png' },
  { id: 3, items: { hamburguer: true }, path: 'Orders/Hamb3.png' },
  { id: 4, items: { bread: true, donemeat: true }, path: 'Orders/Hamb4.png' },
  { id: 5, items: { letuce: true, tomate: true }, path: 'Orders/Salad.png' },
  { id: 6, items: { soda: true }, path: 'Orders/Soda.png' }
];

//arreglo de ordenes actuales
let currentOrders = [];
let currentOrders2 = [];

let maxOrders = 11;
// Generar órdenes aleatorias
setInterval(generateRandomOrder, 10000); // Intenta generar una nueva orden cada 10 segundos

let lives = 3; // Cantidad de vidas
const fullLifeImage = 'Assets/heat_icon.png'; 
const emptyLifeImage = 'Assets/heat_icon_empty.png';

let Score = 0; // Puntaje



const manager = new THREE.LoadingManager();
manager.onStart = function (url, itemsLoaded, itemsTotal) {
  console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
};

manager.onLoad = function () {
  console.log('Loading complete!');
};

manager.onProgress = function (url, itemsLoaded, itemsTotal) {
  console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
};

manager.onError = function (url) {
  console.log('There was an error loading ' + url);
};

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const AmbientLight = new THREE.AmbientLight(0x404040, 45);
scene.add(AmbientLight);

if (SelectedMap == 1) { MapaRestaurant() }
if (SelectedMap == 2) { MapaChristmas() }
if (SelectedMap == 3) { MapaCrustacio() }


manager.onLoad = function () {
  console.log('Todos los modelos se han cargado.');
};


$(document).ready(function () {
  // Objeto para almacenar el estado de las teclas presionadas
  const keysPressed = {};

  // Velocidad del movimiento
  const speed = 0.1;

  //Renderizado de vidas
  renderLives();

  // Evento para cuando una tecla se presiona
  $(document).keydown(function (e) {
    keysPressed[e.key.toLowerCase()] = true; // Almacena la tecla presionada
    e.preventDefault(); // Evita que las flechas hagan scroll
  });

  // Evento para cuando una tecla se suelta
  $(document).keyup(function (e) {
    delete keysPressed[e.key.toLowerCase()]; // Elimina la tecla del registro cuando se suelta

    // Lógica de recolección de objetos cuando se suelta la tecla 'e'
    if (e.key.toLowerCase() === 'e') {

      //si estas colisionandon con la estufa y el tomate a la vez, se le da prioridad al tomate
      if (isCollision(chef, tomato) && isCollision(chef, stoveBurned)) {

        if (isCollision(chef, tomato)) {
          console.log("Colisión detectada entre el chef y el tomate");
          imgInventario = inventario.getTomate();
        }

      }

      if (isCollision(chef, letuce) && isCollision(chef, stoveMeat)) {

        if (isCollision(chef, letuce)) {
          console.log("Colisión detectada entre el chef y la lechuga");
          // Lógica para recoger la entrega
          imgInventario = inventario.getLetuce();
        }

      }

      if (isCollision(chef, tomato)) {
        console.log("Colisión detectada entre el chef y el tomate");
        imgInventario = inventario.getTomate();
      }

      if (isCollision(chef, meat)) {
        console.log("Colisión detectada entre el chef y carne");
        // Lógica para recoger la carne
        imgInventario = inventario.getRawMeat();
      }

      if (isCollision(chef, deliver)) {
        console.log("Colisión detectada entre el chef y la entrega");

        checkDelivery(inventario);
        imgInventario = inventario.completeOrder();
      }

      if (isCollision(chef, letuce)) {
        console.log("Colisión detectada entre el chef y la lechuga");
        // Lógica para recoger la entrega
        imgInventario = inventario.getLetuce();
      }

      if (isCollision(chef, bread)) {
        console.log("Colisión detectada entre el chef y el pan");
        // Lógica para recoger la entrega
        imgInventario = inventario.getBread();
      }

      if (isCollision(chef, trash)) {
        console.log("Colisión detectada entre el chef y la basura");
        // Lógica para recoger la entrega
        imgInventario = inventario.trash();
      }

      if (isCollision(chef, soda)) {
        console.log("Colisión detectada entre el chef2 y la soda2");
        // Lógica para recoger la entrega
        imgInventario = inventario.getSoda();
      }

      //pone a cocinar la carne cruda
      if (isCollision(chef, stove) && stoveState == 1 && inventario.rawmeat) {
        console.log("Colisión detectada entre el chef y la estufa");
        // Lógica para recoger la entrega
        imgInventario = inventario.trash();
        stoveState = 2; //cruda cocinando
        startCronometro(4000);

      }
      if (isCollision(chef, stove) && stoveState == 2) {    // && inventario.isInventoryEmpty()
        console.log("Colisión detectada entre el chef y la estufa con carne cocinando");  //si intentas quitar la carne mientras se cocina
        console.log("La carne se esta cocinando, espera un momento");
      }

      if (isCollision(chef, stove) && stoveState == 3) {   // para recoger la carne cocida
        console.log("Colisión detectada entre el chef y la estufa con carne cocida");
        // Lógica para recoger la entrega
        imgInventario = inventario.getDoneMeat();
        stoveState = 1; //vaciar la estufa
        stopCronometro();
      }

      if (isCollision(chef, stove) && stoveState == 4 && inventario.isInventoryEmpty()) {    //para recoger la carne quemada
        console.log("Colisión detectada entre el chef y la estufa con carne quemada");
        // Lógica para recoger la entrega
        imgInventario = inventario.getBurnedMeat();
        stoveState = 1; //vaciar la estufa

      }

      //manda a actualizar la imagen del inventario chef1
      if (imgInventario) {
        console.log(imgInventario);
        InventoryImage(imgInventario);
      }

    }


    if (e.key.toLowerCase() === '0') {

      //si estas colisionandon con la estufa y el tomate a la vez, se le da prioridad al tomate
      if (isCollision(chef2, tomato) && isCollision(chef2, stoveBurned)) {

        if (isCollision(chef2, tomato)) {
          console.log("Colisión detectada entre el chef2 y el tomate");
          imgInventario2 = inventario2.getTomate();
        }

      }

      if (isCollision(chef2, letuce) && isCollision(chef2, stoveMeat)) {

        if (isCollision(chef2, letuce)) {
          console.log("Colisión detectada entre el chef2 y la lechuga");
          // Lógica para recoger la entrega
          imgInventario2 = inventario2.getLetuce();
        }

      }

      if (isCollision(chef2, tomato)) {
        console.log("Colisión detectada entre el chef2 y el tomate");
        imgInventario2 = inventario2.getTomate();
      }

      if (isCollision(chef2, meat)) {
        console.log("Colisión detectada entre el chef2 y carne");
        // Lógica para recoger la carne
        imgInventario2 = inventario2.getRawMeat();
      }

      if (isCollision(chef2, deliver)) {
        console.log("Colisión detectada entre el chef2 y la entrega");

        checkDelivery(inventario2);
        imgInventario2 = inventario2.completeOrder();
      }

      if (isCollision(chef2, letuce)) {
        console.log("Colisión detectada entre el chef2 y la lechuga");
        // Lógica para recoger la entrega
        imgInventario2 = inventario2.getLetuce();
      }

      if (isCollision(chef2, bread)) {
        console.log("Colisión detectada entre el chef2 y el pan");
        // Lógica para recoger la entrega
        imgInventario2 = inventario2.getBread();
      }

      if (isCollision(chef2, trash)) {
        console.log("Colisión detectada entre el chef2 y la basura");
        // Lógica para recoger la entrega
        imgInventario2 = inventario2.trash();
      }

      if (isCollision(chef2, soda)) {
        console.log("Colisión detectada entre el chef2 y la soda2");
        // Lógica para recoger la entrega
        imgInventario2 = inventario2.getSoda();
      }

      //pone a cocinar la carne cruda
      if (isCollision(chef2, stove) && stoveState == 1 && inventario2.rawmeat) {
        console.log("Colisión detectada entre el chef2 y la estufa");
        // Lógica para recoger la entrega
        imgInventario2 = inventario2.trash();
        stoveState = 2; //cruda cocinando
        startCronometro(4000);
      }

      if (isCollision(chef2, stove) && stoveState == 2) {    // && inventario.isInventoryEmpty()
        console.log("Colisión detectada entre el chef2 y la estufa con carne cocinando");  //si intentas quitar la carne mientras se cocina
        console.log("La carne se esta cocinando, espera un momento");
      }

      if (isCollision(chef2, stove) && stoveState == 3) {   // para recoger la carne cocida
        console.log("Colisión detectada entre el chef2 y la estufa con carne cocida");
        // Lógica para recoger la entrega
        imgInventario2 = inventario2.getDoneMeat();
        stoveState = 1; //vaciar la estufa
        stopCronometro();
      }

      if (isCollision(chef2, stove) && stoveState == 4 && inventario2.isInventoryEmpty()) {    //para recoger la carne quemada
        console.log("Colisión detectada entre el chef2 y la estufa con carne quemada");
        // Lógica para recoger la entrega
        imgInventario2 = inventario2.getBurnedMeat();
        stoveState = 1; //vaciar la estufa
      }

      //segunda estufa     
      if (SelectedMap == 3) {

        if (isCollision(chef2, letuce2)) {
          console.log("Colisión detectada entre el chef2 y la lechuga2");
          imgInventario2 = inventario2.getLetuce();
        }
        if (isCollision(chef2, bread2)) {
          console.log("Colisión detectada entre el chef2 y el pan2");
          imgInventario2 = inventario2.getBread();
        }
        if (isCollision(chef2, soda2)) {
          console.log("Colisión detectada entre el chef2 y la soda2");
          imgInventario2 = inventario2.getSoda();
        }
        if (isCollision(chef2, deliver2)) {
          console.log("Colisión detectada entre el chef2 y la entrega2");
          imgInventario2 = inventario2.completeOrder();
        }
        if (isCollision(chef2, trash2)) {
          console.log("Colisión detectada entre el chef2 y la basura2");
          imgInventario2 = inventario2.trash();
        }


        //pone a cocinar la carne cruda
        if (isCollision(chef2, stove2) && stoveState2 == 1 && inventario2.rawmeat) {
          console.log("Colisión detectada entre el chef2 y la estufa2");
          // Lógica para recoger la entrega
          imgInventario2 = inventario2.trash();
          stoveState2 = 2; //cruda cocinando
          startCronometro2(4000);

        }
        if (isCollision(chef2, stove2) && stoveState2 == 2) {    // && inventario.isInventoryEmpty()
          console.log("Colisión detectada entre el chef2 y la estufa con carne cocinando");  //si intentas quitar la carne mientras se cocina
          console.log("La carne se esta cocinando, espera un momento");
        }

        if (isCollision(chef2, stove2) && stoveState2 == 3) {   // para recoger la carne cocida
          console.log("Colisión detectada entre el chef2 y la estufa con carne cocida");
          // Lógica para recoger la entrega
          imgInventario2 = inventario2.getDoneMeat();
          stoveState2 = 1; //vaciar la estufa
          stopCronometro();
        }

        if (isCollision(chef2, stove2) && stoveState2 == 4 && inventario.isInventoryEmpty()) {    //para recoger la carne quemada
          console.log("Colisión detectada entre el chef2 y la estufa con carne quemada");
          // Lógica para recoger la entrega
          imgInventario2 = inventario2.getBurnedMeat();
          stoveState2 = 1; //vaciar la estufa
        }



      }

      if (imgInventario2) {
        console.log("imgInventario2:", imgInventario2);
        InventoryImage2(imgInventario2);
      }

    }

    //COSAS CON FIN DE DEBUGGEO, NO SE DEBERIAN DEJAR EN EL JUEGO FINAL (no molestar Zzz)
    if (e.key.toLowerCase() === 'i') {
      inventario.mostrarInventario();
    }

    if (e.key.toLowerCase() === '1') {
      stoveState = 1;
    }
    if (e.key.toLowerCase() === '2') {
      stoveState = 2;
    }
    if (e.key.toLowerCase() === '3') {
      stoveState = 3;
    }
    if (e.key.toLowerCase() === '4') {
      stoveState = 4;
    }
    if (e.key.toLowerCase() === '5') {
      togglePause();
    }
    if (e.key.toLowerCase() === '6') {
     console.log("Ordenes actuales: ", currentOrders);
    }
    if (e.key.toLowerCase() === '9') {
      inventario2.mostrarInventario();
    }
  });

  // Función de animación para mover los chefs
  function animate() {

    // Movimiento del chef con W, A, S, D
    if (keysPressed['a'] && canMove(chef, { x: -speed, z: 0 })) {
      chef.PosX -= speed;
      chef.SetPositionThis();
    }

    if (keysPressed['d'] && canMove(chef, { x: speed, z: 0 })) {
      chef.PosX += speed;
      chef.SetPositionThis();
    }

    if (keysPressed['w'] && canMove(chef, { x: 0, z: -speed })) {
      chef.PosZ -= speed;
      chef.SetPositionThis();
    }

    if (keysPressed['s'] && canMove(chef, { x: 0, z: speed })) {
      chef.PosZ += speed;
      chef.SetPositionThis();
    }

    // Movimiento del chef2 con las flechas

    if (keysPressed['arrowleft'] && canMove(chef2, { x: -speed, z: 0 })) {
      chef2.PosX -= speed;
      chef2.SetPositionThis();
    }

    if (keysPressed['arrowright'] && canMove(chef2, { x: speed, z: 0 })) {
      chef2.PosX += speed;
      chef2.SetPositionThis();
    }

    if (keysPressed['arrowup'] && canMove(chef2, { x: 0, z: -speed })) {
      chef2.PosZ -= speed;
      chef2.SetPositionThis();
    }

    if (keysPressed['arrowdown'] && canMove(chef2, { x: 0, z: speed })) {
      chef2.PosZ += speed;
      chef2.SetPositionThis();
    }

    //Mapa Navidad y Restaurante
    if (SelectedMap == 2 || SelectedMap == 1) {

      soda.Update();
      deliver.Update();
      letuce.Update();
      tomato.Update();
      stove.Update();
      bigtable2.Update();
      bigtable3.Update();
      chef.Update();

      bigtable.Update();
      table.Update();
      trash.Update();
      bread.Update();
      table2.Update();
      meat.Update();
      stoveBurned.Update();
      stoveRaw.Update();
      stoveMeat.Update();

    }

    //Mapa Coop
    if (SelectedMap == 3) {
      soda.Update();
      soda2.Update();
      deliver.Update();
      deliver2.Update();
      table2.Update();
      letuce.Update();
      letuce2.Update();
      tomato.Update();
      meat.Update();
      stove.Update();
      stove2.Update();
      bread.Update();
      bread2.Update();
      table3.Update();
      table4.Update();
      bigtable.Update();
      bigtable3.Update();
      chef.Update();

      trash.Update();
      stoveBurned.Update();
      stoveBurned2.Update();
      stoveRaw.Update();
      stoveRaw2.Update();
      stoveMeat.Update();
      stoveMeat2.Update();
      trash2.Update();

    }

    // Cambiar el estado de la ESTUFA 1 ------
    if (stoveState == 1) {  //vacio
      stoveBurned.RemoveFromScene(scene);
      stoveRaw.RemoveFromScene(scene);
      stoveMeat.RemoveFromScene(scene);

      stove.AddToScene(scene);
    }
    if (stoveState == 2) {  //crudo
      //quita los otros modelos que no se veran
      stoveBurned.RemoveFromScene(scene);
      stoveMeat.RemoveFromScene(scene);
      stove.RemoveFromScene(scene);

      stoveRaw.AddToScene(scene);

    }
    if (stoveState == 3) { //cocido
      stoveRaw.RemoveFromScene(scene);
      stoveBurned.RemoveFromScene(scene);
      stove.RemoveFromScene(scene);

      stoveMeat.AddToScene(scene)

    }
    if (stoveState == 4) {  //quemado
      stove.RemoveFromScene(scene);
      stoveRaw.RemoveFromScene(scene);
      stoveMeat.RemoveFromScene(scene);

      stoveBurned.AddToScene(scene);
    }

    if (SelectedMap == 3) {   // Cambiar el estado de la ESTUFA 2 ------
      if (stoveState2 == 1) {  //vacio
        stoveBurned2.RemoveFromScene(scene);
        stoveRaw2.RemoveFromScene(scene);
        stoveMeat2.RemoveFromScene(scene);

        stove2.AddToScene(scene);

      }

      if (stoveState2 == 2) {  //crudo
        //quita los otros modelos que no se veran
        stoveBurned2.RemoveFromScene(scene);
        stoveMeat2.RemoveFromScene(scene);
        stove2.RemoveFromScene(scene);

        stoveRaw2.AddToScene(scene);

      }

      if (stoveState2 == 3) { //cocido
        stoveRaw2.RemoveFromScene(scene);
        stoveBurned2.RemoveFromScene(scene);
        stove2.RemoveFromScene(scene);

        stoveMeat2.AddToScene(scene)

      }
      if (stoveState2 == 4) {  //quemado
        stove2.RemoveFromScene(scene);
        stoveRaw2.RemoveFromScene(scene);
        stoveMeat2.RemoveFromScene(scene);

        stoveBurned2.AddToScene(scene);
      }
    }

    chef.Update();
    chef2.Update();

    // Vuelve a llamar a la función en el siguiente cuadro    
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  // Comienza la animación
  animate();
});

// Función para actualizar la imagen del invnetario
function InventoryImage(imagePath) {
  const inventoryImg = document.getElementById('inventory-image');
  if (inventoryImg) {
    inventoryImg.src = imagePath;
  }
}

// Función para actualizar la imagen del invnetario
function InventoryImage2(imagePath) {
  const inventoryImg2 = document.getElementById('inventory-image2');
  if (inventoryImg2) {
    inventoryImg2.src = imagePath;
  }
}

function isCollision(chef, obj) {

  // Verificar si haay colisión
  if (chef.boundingBox.intersectsBox(obj.boundingBox)) {
    //console.log("Colisión detectada entre el chef y un objeto");
    return true;
  }
  else {
    return false;
  }
}

function anyCollisionCrustacio(chef) {
  if (
    isCollision(chef, trash) || isCollision(chef, bread) || isCollision(chef, letuce) || isCollision(chef, bigtable) ||
    isCollision(chef, table3) || isCollision(chef, stove) || isCollision(chef, tomato) || isCollision(chef, stove2) ||
    isCollision(chef, bigtable3) || isCollision(chef, meat) || isCollision(chef, soda) || isCollision(chef, deliver) ||
    isCollision(chef, table2) || isCollision(chef, soda2) || isCollision(chef, letuce2) || isCollision(chef, deliver2) ||
    isCollision(chef, table4) || isCollision(chef, bread2) || isCollision(chef, trash2)
  ) {
    return true;
  }
  else {
    return false;
  }
}


function anyCollisionNavidad(chef) {
  if (
    isCollision(chef, soda) || isCollision(chef, deliver) || isCollision(chef, letuce) ||
    isCollision(chef, tomato) || isCollision(chef, stove) || isCollision(chef, bigtable2) ||
    isCollision(chef, bigtable3) || isCollision(chef, bigtable) ||
    isCollision(chef, table) || isCollision(chef, trash) || isCollision(chef, bread) || isCollision(chef, table2) ||
    isCollision(chef, meat)
  ) {
    return true;
  }
  else {
    return false;
  }
}

function anyCollisionRestaurant(chef) {
  if (
    isCollision(chef, soda) || isCollision(chef, deliver) || isCollision(chef, letuce) ||
    isCollision(chef, tomato) || isCollision(chef, stove) || isCollision(chef, bigtable2) ||
    isCollision(chef, bigtable3) || isCollision(chef, bigtable) || isCollision(chef, table) ||
    isCollision(chef, trash) || isCollision(chef, bread) || isCollision(chef, table2) ||
    isCollision(chef, meat) || isCollision(chef, table5)
  ) {
    return true;
  }
  else {
    return false;
  }
}

function canMove(chef, direction) {
  // Crear una copia de la posición del chef y aplicar el movimiento
  const newPosX = chef.PosX + direction.x;
  const newPosZ = chef.PosZ + direction.z;

  // Crear una caja de colisión temporal con la nueva posición
  chef.SetPosition(newPosX, 0, newPosZ);
  chef.Update();

  // Verificar si hay colisión

  if (SelectedMap == 1) {
    if (anyCollisionRestaurant(chef)) {
      return false; // No se puede mover en esta dirección
    }
  }
  if (SelectedMap == 2) {
    if (anyCollisionNavidad(chef)) {
      return false; // No se puede mover en esta dirección
    }
  }
  if (SelectedMap == 3) {
    if (anyCollisionCrustacio(chef)) {
      return false; // No se puede mover en esta dirección
    }
  }

  return true; // Se puede mover
}


function MapaRestaurant() {

  const restaurant = new CargarModelo('Models/restaurant2/restaurant2', manager, scene);
  restaurant.SetPosition(-.5, -4, -12)
  restaurant.AddToScene(scene);
  restaurant.SeeBB = false;

  soda = new CargarModelo('Models/soda/soda', manager, scene);
  soda.SetPosition(-2.7, 0, -3.5)
  soda.AddToScene(scene);
  soda.Scale(1.7, 1.7, 1.7);

  table = new CargarModelo('Models/table2/smalltable', manager, scene);
  table.SetPosition(-0.4, 0, -3.5);
  table.AddToScene(scene);
  table.Scale(1.6, 1.6, 1.6);

  bread = new CargarModelo('Models/bread/bread', manager, scene);
  bread.SetPosition(1.85, 0, -3.55);
  bread.AddToScene(scene);
  bread.Scale(1.7, 1.7, 1.7)

  tomato = new CargarModelo('Models/letuce/ChopLetuce', manager, scene);
  tomato.SetPosition(-5, 0, .6);
  tomato.AddToScene(scene);
  tomato.Scale(1.5, 1.5, 1.5)

  stove = new CargarModelo('Models/stove/stove', manager, scene);
  stove.SetPosition(-4.95, 0, 2.4);
  const axis = { x: 0, y: 1, z: 0 };
  const angle = Math.PI / 2;
  stove.Rotate(axis, angle);
  stove.Scale(1.6, 1.6, 1.6)
  //stove.AddToScene(scene);

  stoveMeat = new CargarModelo('Models/stove/done/stoveAndMeat', manager, scene);
  stoveMeat.SetPosition(-4.95, 0, 2.4);
  stoveMeat.Rotate(axis, angle);
  stoveMeat.Scale(1.6, 1.6, 1.6);

  stoveBurned = new CargarModelo('Models/stove/burned/stoveAndMeatBurned', manager, scene);
  stoveBurned.SetPosition(-4.95, 0, 2.4);
  stoveBurned.Rotate(axis, angle);
  stoveBurned.Scale(1.6, 1.6, 1.6);
  //stoveBurned.AddToScene(scene);

  stoveRaw = new CargarModelo('Models/stove/raw/stoveAndMeatRaw', manager, scene);
  stoveRaw.SetPosition(-4.95, 0, 2.4);
  stoveRaw.Rotate(axis, angle);
  stoveRaw.Scale(1.6, 1.6, 1.6);
  //stoveRaw.AddToScene(scene);

  letuce = new CargarModelo('Models/tomato/Tomato', manager, scene);
  letuce.SetPosition(-5, 0, -1.6);
  letuce.AddToScene(scene);
  letuce.Scale(1.6, 1.6, 1.6);

  bigtable3 = new CargarModelo('Models/bigtable2/bigtable2', manager, scene);
  bigtable3.SetPosition(4, 0, -2.9);
  bigtable3.AddToScene(scene);
  bigtable3.Scale(1.2, 1.2, 1.1)

  deliver = new CargarModelo('Models/deliver/deliver', manager, scene);
  deliver.SetPosition(4.1, 0, 0.4);
  deliver.AddToScene(scene);
  deliver.Scale(1.3, 1.3, 1.3);

  table2 = new CargarModelo('Models/bigtable2/bigtable2', manager, scene);
  table2.SetPosition(4, 0, 3.2);
  table2.AddToScene(scene);
  table2.Scale(1.2, 1.2, .8);

  chef = new CargarModelo('Models/chef/chef', manager, scene);
  chef.PosX = -2;
  chef.PosZ = 1;
  chef.SetPositionThis();
  chef.SetPosition(-2, 0, 1)
  chef.AddToScene(scene);

  chef2 = new CargarModelo('Models/chef2/chef2', manager, scene);
  chef2.PosX = 1;
  chef2.PosZ = 1;
  chef2.SetPositionThis();
  chef2.SetPosition(1, 0, 1);
  chef2.AddToScene(scene);

  // chef2 = new CargarModelo('Models/chef2/chef2', manager, scene);
  // chef2.PosX = 5;
  // chef2.PosZ = 1;
  // chef2.SetPosition(2, 0, 1);
  // chef2.AddToScene(scene);

  bigtable = new CargarModelo('Models/bigtable/bigtable', manager, scene);
  bigtable.SetPosition(-4.1, 0, 4)
  bigtable.AddToScene(scene);
  bigtable.Scale(1.3, 1.2, 1.2);

  trash = new CargarModelo('Models/trash/trash', manager, scene);
  trash.SetPosition(-1.3, 0, 4.05)
  trash.Scale(1.65, 1.65, 1.65);
  trash.AddToScene(scene);

  table5 = new CargarModelo('Models/table2/smalltable', manager, scene);
  table5.SetPosition(.4, 0, 4);
  table5.Scale(1.2, 1.2, 1.2);
  table5.AddToScene(scene);

  meat = new CargarModelo('Models/meat/meat', manager, scene);
  meat.SetPosition(2.1, 0, 4)
  meat.AddToScene(scene);
  meat.Scale(1.2, 1.2, 1.2)

  bigtable2 = new CargarModelo('Models/table2/smalltable', manager, scene);
  bigtable2.SetPosition(-5, 0, -3.5);
  bigtable2.AddToScene(scene);
  bigtable2.Scale(1.5, 1.5, 1.5);


  const spotLight = new THREE.SpotLight(0xffec77, 10); // Luz blanca con intensidad 1
  spotLight.position.set(4, 3, 0.4); // Posicionar la luz en las coordenadas especificadas
  spotLight.target.position.set(4, -1, 0.4); // Hacer que apunte hacia abajo

  // Añadir la luz y su objetivo a la escena
  scene.add(spotLight);
  scene.add(spotLight.target);

  spotLight.angle = Math.PI / 8; // Ángulo del haz (en radianes)
  spotLight.distance = 10; // Distancia máxima de la luz
  spotLight.castShadow = true; // Habilitar sombras (si las usas)

  // Opcional: Helper para visualizar la dirección de la luz
  //const spotLightHelper = new THREE.SpotLightHelper(spotLight);
  //scene.add(spotLightHelper);


}


function MapaChristmas() {

  const restaurant = new CargarModelo('Models/restaurant3/Nieve', manager, scene);
  restaurant.SetPosition(2, -3, -8)
  restaurant.AddToScene(scene);
  restaurant.SeeBB = false;

  soda = new CargarModelo('Models/soda/soda', manager, scene);
  soda.SetPosition(2, 0, -1.6);
  soda.AddToScene(scene);
  soda.Scale(1.6, 1.6, 1.6);

  deliver = new CargarModelo('Models/deliver/deliver', manager, scene);
  deliver.SetPosition(4, 0, 2.1);
  deliver.AddToScene(scene);
  deliver.Scale(1.3, 1.3, 1.3);

  letuce = new CargarModelo('Models/tomato/Tomato', manager, scene);
  letuce.SetPosition(-0.3, 0, -1.5);
  letuce.AddToScene(scene);
  letuce.Scale(1.7, 1.7, 1.7)

  tomato = new CargarModelo('Models/letuce/ChopLetuce', manager, scene);
  tomato.SetPosition(-4.9, 0, .25);
  tomato.AddToScene(scene);
  tomato.Scale(1.3, 1.1, 1.3)

  stove = new CargarModelo('Models/stove/stove', manager, scene);
  stove.SetPosition(-2.9, 0, -1.5)
  stove.AddToScene(scene);
  stove.Scale(1.8, 1.7, 1.7)

  stoveRaw = new CargarModelo('Models/stove/raw/stoveAndMeatRaw', manager, scene);
  stoveRaw.SetPosition(-2.9, 0, -1.5)
  stoveRaw.AddToScene(scene);
  stoveRaw.Scale(1.8, 1.7, 1.7);

  stoveMeat = new CargarModelo('Models/stove/done/stoveAndMeat', manager, scene);
  stoveMeat.SetPosition(-2.9, 0, -1.5)
  stoveMeat.AddToScene(scene);
  stoveMeat.Scale(1.8, 1.7, 1.7);

  stoveBurned = new CargarModelo('Models/stove/burned/stoveAndMeatBurned', manager, scene);
  stoveBurned.SetPosition(-2.9, 0, -1.5);
  stoveBurned.AddToScene(scene);
  stoveBurned.Scale(1.8, 1.7, 1.7);

  bigtable2 = new CargarModelo('Models/table2/smalltable', manager, scene);
  bigtable2.SetPosition(-4.8, 0, -1.6);
  bigtable2.AddToScene(scene);
  bigtable2.Scale(1.3, 1.3, 1.3);

  bigtable3 = new CargarModelo('Models/bigtable2/bigtable2', manager, scene);
  bigtable3.SetPosition(4.1, 0, -.9)
  bigtable3.AddToScene(scene);
  bigtable3.Scale(1.4, 1.2, 1)

  chef = new CargarModelo('Models/chef/chef', manager, scene);
  chef.SetPosition(-1, 0, 1)
  chef.AddToScene(scene);

  chef2 = new CargarModelo('Models/chef2/chef2', manager, scene);
  chef2.PosX = 1;
  chef2.PosZ = 1;
  chef2.SetPosition(1, 0, 1)
  chef2.AddToScene(scene);

  bigtable = new CargarModelo('Models/bigtable/bigtable', manager, scene);
  bigtable.SetPosition(-4, 0, 4)
  bigtable.AddToScene(scene);
  bigtable.Scale(1.2, 1.2, 1.2)

  table = new CargarModelo('Models/table/table', manager, scene);
  table.SetPosition(-1.4, 0, 4)
  table.AddToScene(scene);
  table.Scale(1.2, 1.2, 1.2)

  trash = new CargarModelo('Models/trash/trash', manager, scene);
  trash.SetPosition(.3, 0, 4)
  trash.Scale(1.6, 1.6, 1.6);
  trash.AddToScene(scene);

  bread = new CargarModelo('Models/bread/bread', manager, scene);
  bread.SetPosition(2, 0, 4)
  bread.AddToScene(scene);
  bread.Scale(1.2, 1.2, 1.2)

  table2 = new CargarModelo('Models/table2/smalltable', manager, scene);
  table2.SetPosition(3.9, 0, 4)
  table2.AddToScene(scene);
  table2.Scale(1.2, 1.2, 1.2)

  meat = new CargarModelo('Models/meat/meat', manager, scene);
  meat.SetPosition(-4.8, 0, 2.2)
  meat.AddToScene(scene);
  meat.Scale(1.25, 1.25, 1.25)

  const spotLight = new THREE.SpotLight(0xffec77, 10); // Luz blanca con intensidad 1
  spotLight.position.set(4, 3, 2.1); // Posicionar la luz en las coordenadas especificadas
  spotLight.target.position.set(4, -1, 2.1); // Hacer que apunte hacia abajo

  // Añadir la luz y su objetivo a la escena
  scene.add(spotLight);
  scene.add(spotLight.target);

  spotLight.angle = Math.PI / 8; // Ángulo del haz (en radianes)
  spotLight.distance = 10; // Distancia máxima de la luz
  spotLight.castShadow = true; // Habilitar sombras (si las usas)

  // Opcional: Helper para visualizar la dirección de la luz
  //const spotLightHelper = new THREE.SpotLightHelper(spotLight);
  //scene.add(spotLightHelper);


}

function MapaCrustacio() {

  const restaurant = new CargarModelo('Models/crustacio/Crustacio', manager, scene);
  restaurant.SetPosition(1, -4, -18)
  restaurant.AddToScene(scene);
  restaurant.SeeBB = false;

  soda2 = new CargarModelo('Models/soda/soda', manager, scene);
  soda2.SetPosition(2.4, 0, -1.8);
  soda2.AddToScene(scene);
  soda2.Scale(1.7, 1.7, 1.7);

  soda = new CargarModelo('Models/soda/soda', manager, scene);
  soda.SetPosition(-2.35, 0, -1.8);
  soda.AddToScene(scene);
  soda.Scale(1.7, 1.7, 1.7);

  trash2 = new CargarModelo('Models/trash/trash', manager, scene);
  trash2.SetPosition(4.8, -.2, -1.8)
  trash2.Scale(2.3, 2.3, 2.3);
  trash2.AddToScene(scene);

  trash = new CargarModelo('Models/trash/trash', manager, scene);
  trash.SetPosition(-4.8, -.2, -1.8)
  trash.Scale(2.3, 2.3, 2.3);
  trash.AddToScene(scene);

  deliver2 = new CargarModelo('Models/deliver/deliver', manager, scene);
  deliver2.SetPosition(7, 0, 2.5);
  deliver2.AddToScene(scene);
  deliver2.Scale(1.45, 1.4, 1.4);

  deliver = new CargarModelo('Models/deliver/deliver', manager, scene);
  deliver.SetPosition(-7, 0, 2.5);
  const axis = { x: 0, y: 1, z: 0 };
  const angle = Math.PI;
  deliver.Rotate(axis, angle);
  deliver.Scale(1.45, 1.4, 1.4);
  deliver.AddToScene(scene);

  table2 = new CargarModelo('Models/table2/smalltable', manager, scene);
  table2.SetPosition(0, 0, -1.5)
  table2.AddToScene(scene);
  table2.Scale(1.6, 1.6, 1.6)

  letuce = new CargarModelo('Models/tomato/Tomato', manager, scene);
  letuce.SetPosition(-2, 0, 4.85);
  letuce.AddToScene(scene);
  letuce.Scale(1.5, 1.4, 1.4)

  letuce2 = new CargarModelo('Models/tomato/Tomato', manager, scene);
  letuce2.SetPosition(2, 0, 4.7);
  letuce2.AddToScene(scene);
  letuce2.Scale(1.5, 1.4, 1.4)

  tomato = new CargarModelo('Models/letuce/ChopLetuce', manager, scene);
  tomato.SetPosition(0, 0, .75);
  tomato.AddToScene(scene);
  tomato.Scale(1.55, 1.55, 1.55)

  meat = new CargarModelo('Models/meat/meat', manager, scene);
  meat.SetPosition(0, 0, 2.9)
  meat.AddToScene(scene);
  meat.Scale(1.5, 1.5, 1.5)

  table2 = new CargarModelo('Models/table2/smalltable', manager, scene);
  table2.SetPosition(0, 0, 4.8)
  table2.AddToScene(scene);
  table2.Scale(1.5, 1.4, 1.2)

  stove2 = new CargarModelo('Models/stove/stove', manager, scene);
  stove2.SetPosition(4.1, 0, 4.8)
  stove2.Scale(1.6, 1.5, 1.5)
  stove2.Rotate(axis, angle);
  stove2.AddToScene(scene);

  stoveBurned2 = new CargarModelo('Models/stove/burned/stoveAndMeatBurned', manager, scene);
  stoveBurned2.SetPosition(4.1, 0, 4.8)
  stoveBurned2.Scale(1.6, 1.5, 1.5)
  stoveBurned2.Rotate(axis, angle);

  stoveRaw2 = new CargarModelo('Models/stove/raw/stoveAndMeatRaw', manager, scene);
  stoveRaw2.SetPosition(4.1, 0, 4.8)
  stoveRaw2.Scale(1.6, 1.5, 1.5)
  stoveRaw2.Rotate(axis, angle);

  stoveMeat2 = new CargarModelo('Models/stove/done/stoveAndMeat', manager, scene);
  stoveMeat2.SetPosition(4.1, 0, 4.8)
  stoveMeat2.Scale(1.6, 1.5, 1.5)
  stoveMeat2.Rotate(axis, angle);


  stove = new CargarModelo('Models/stove/stove', manager, scene);
  stove.SetPosition(-4, 0, 4.8)
  stove.Scale(1.5, 1.5, 1.5)
  stove.Rotate(axis, angle);

  stoveBurned = new CargarModelo('Models/stove/burned/stoveAndMeatBurned', manager, scene);
  stoveBurned.SetPosition(-4, 0, 4.8)
  stoveBurned.Scale(1.5, 1.5, 1.5)
  stoveBurned.Rotate(axis, angle);

  stoveRaw = new CargarModelo('Models/stove/raw/stoveAndMeatRaw', manager, scene);
  stoveRaw.SetPosition(-4, 0, 4.8)
  stoveRaw.Scale(1.5, 1.5, 1.5)
  stoveRaw.Rotate(axis, angle);

  stoveMeat = new CargarModelo('Models/stove/done/stoveAndMeat', manager, scene);
  stoveMeat.SetPosition(-4, 0, 4.8)
  stoveMeat.Scale(1.5, 1.5, 1.5)
  stoveMeat.Rotate(axis, angle);



  bread2 = new CargarModelo('Models/bread/bread', manager, scene);
  bread2.SetPosition(7, 0, .5)
  bread2.AddToScene(scene);
  bread2.Scale(1.5, 1.4, 1.4)

  bread = new CargarModelo('Models/bread/bread', manager, scene);
  bread.SetPosition(-7, 0, .5)
  bread.AddToScene(scene);
  bread.Scale(1.5, 1.4, 1.4)



  table3 = new CargarModelo('Models/table2/smalltable', manager, scene);
  table3.SetPosition(-6.3, 0, 4.7);
  table3.Scale(2, 1.4, 1.2);
  table3.AddToScene(scene);

  table4 = new CargarModelo('Models/table2/smalltable', manager, scene);
  table4.SetPosition(6.4, 0, 4.7);
  table4.Scale(2, 1.4, 1.2);
  table4.AddToScene(scene);

  bigtable = new CargarModelo('Models/bigtable/bigtable', manager, scene);
  bigtable.SetPosition(7, 0, -1.7);
  bigtable.AddToScene(scene);
  bigtable.Scale(.7, 1.6, 1.7);

  //rotated
  bigtable3 = new CargarModelo('Models/bigtable/bigtable', manager, scene);
  bigtable3.SetPosition(-7, 0, -1.7);
  bigtable3.AddToScene(scene);
  bigtable3.Scale(.7, 1.6, 1.7);

  chef = new CargarModelo('Models/chef/chef', manager, scene);
  //chef.SetPosition(-3, 0, 2)
  chef.PosX = -3;
  chef.PosZ = 2;
  chef.SetPositionThis();
  chef.AddToScene(scene);

  chef2 = new CargarModelo('Models/chef2/chef2', manager, scene);
  chef2.PosX = 3;
  chef2.PosZ = 2;
  chef2.SetPositionThis();
  chef2.SetPosition(3, 0, 2);
  chef2.AddToScene(scene);

  // Crear la luz spot
  const spotLight = new THREE.SpotLight(0xffec77, 10); // Luz blanca con intensidad 1
  spotLight.position.set(7, 3, 2.5); // Posicionar la luz en las coordenadas especificadas
  spotLight.target.position.set(7, -1, 2.5); // Hacer que apunte hacia abajo

  // Añadir la luz y su objetivo a la escena
  scene.add(spotLight);
  scene.add(spotLight.target);

  spotLight.angle = Math.PI / 8; // Ángulo del haz (en radianes)
  spotLight.distance = 10; // Distancia máxima de la luz
  spotLight.castShadow = true; // Habilitar sombras (si las usas)

  // Opcional: Helper para visualizar la dirección de la luz
  //const spotLightHelper = new THREE.SpotLightHelper(spotLight);
  //scene.add(spotLightHelper);


  // Crear la luz spot
  const spotLight2 = new THREE.SpotLight(0xffec77, 10); // Luz blanca con intensidad 1
  spotLight2.position.set(-7, 3, 2.5); // Posicionar la luz en las coordenadas especificadas
  spotLight2.target.position.set(-7, -1, 2.5); // Hacer que apunte hacia abajo

  // Añadir la luz y su objetivo a la escena
  scene.add(spotLight2);
  scene.add(spotLight2.target);

  spotLight2.angle = Math.PI / 8; // Ángulo del haz (en radianes)
  spotLight2.distance = 10; // Distancia máxima de la luz
  spotLight2.castShadow = true; // Habilitar sombras (si las usas)

}


// Función para iniciar el cronómetro
function startCronometro(duration) {
  startTime = Date.now();
  cronometroInterval = setInterval(updateCronometro, 1000);
  console.log("Carne cocinandose...");

  // Configurar un timeout para dos segundos
  setTimeout(() => {
    fourSecondsPassed = true;
    console.log("Han pasado 4 segundos");
    console.log("StoveState: " + stoveState);
    if (stoveState == 2 && fourSecondsPassed) {

      console.log("La carne se ha cocinado");
      stoveState = 3; //pasa a ser carne cocinada
      fourSecondsPassed = false;
      stopCronometro();
      startCronometro(4000); //este puede cambiar lo que tarda en quemarse, para los powerup, por ejemplo
    }
    if (stoveState == 3 && fourSecondsPassed) {
      stoveState = 4; //pasa a ser carne quemada(cenizas lol)
      console.log("La carne se ha quemado");
      fourSecondsPassed = false;
      stopCronometro();
    }
  }, duration); //4000 ms = 4 segundos

}

function startCronometro2(duration) {
  startTime = Date.now();
  cronometroInterval = setInterval(updateCronometro, 1000);
  console.log("Carne cocinandose...");

  // Configurar un timeout para dos segundos
  setTimeout(() => {
    fourSecondsPassed = true;
    console.log("Han pasado 4 segundos");
    console.log("stoveState2: " + stoveState2);
    if (stoveState2 == 2 && fourSecondsPassed) {

      console.log("La carne se ha cocinado");
      stoveState2 = 3; //pasa a ser carne cocinada
      fourSecondsPassed = false;
      stopCronometro();
      startCronometro2(4000);  //esto puede modificar el tiempo que tarda en quemarse
    }
    if (stoveState2 == 3 && fourSecondsPassed) {
      stoveState2 = 4; //pasa a ser carne quemada(cenizas lol)
      console.log("La carne se ha quemado");
      fourSecondsPassed = false;
      stopCronometro();
    }
  }, duration); //4000 ms = 4 segundos

}

// Función para actualizar el cronómetro
function updateCronometro() {
  const elapsedTime = Date.now() - startTime;
  const minutes = Math.floor(elapsedTime / 60000);
  const seconds = Math.floor((elapsedTime % 60000) / 1000);
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  document.getElementById('cronometro').textContent = formattedTime;
}


// Función para detener el cronómetro
function stopCronometro() {
  clearInterval(cronometroInterval);
  clearTimeout(cookingTimeout);
  console.log("Cronómetro detenido");
}

function generateRandomOrder() {

  if (!pause && currentOrders.length < maxOrders) {
    const randomIndex = Math.floor(Math.random() * orders.length);
    const randomOrder = orders[randomIndex];
    currentOrders.push(randomOrder);
    console.log('Nueva orden generada:', randomOrder);

    const imagePath = randomOrder.path; // Path de la imagen
    console.log('Imagen de la orden:', imagePath);

    // Usa un atributo único para identificar la imagen
    const imgElement = `<img src="${imagePath}" alt="Order" data-order-id="${randomOrder.id}">`;
    $('#gallery').append(imgElement);
  }
  if (currentOrders.length >= maxOrders) {
    console.log("Maximo de ordenes alcanzado");
    loseLife();
  }


}

function togglePause() {
  pause = !pause;
  console.log(pause ? "Juego pausado" : "Juego reanudado");
}

function compareOrder(inventory, order) {
  const orderItems = order.items;
  for (const key in orderItems) {
    if (orderItems[key] && !inventory[key]) {
      // Si el ingrediente es requerido por la orden y no está en el inventario, falla
      return false;
    }
  }
  // Si pasa todas las verificaciones, la orden es cumplida
  return true;
}

function checkDelivery(inventory) {
  for (let i = currentOrders.length - 1; i >= 0; i--) {
    if (compareOrder(inventory, currentOrders[i])) {
      const orderId = currentOrders[i].id; // Guarda el ID antes de eliminar
      console.log('Orden cumplida:', currentOrders[i]);
      Score += 10;
      updateScore(Score);
      currentOrders.splice(i, 1); // Elimina la orden cumplida
      removeOrder(orderId); // Elimina la imagen asociada
      return true; // Detiene la función si cumple con una orden
    }
  }
  console.log('Orden no cumplida');
  loseLife();
  return false;
}

function removeOrder(orderId) {
  // Elimina solo la primera instancia visual de la imagen
  const $imageToRemove = $(`#gallery img[data-order-id="${orderId}"]:first`);
  if ($imageToRemove.length > 0) {
    $imageToRemove.remove(); // Remueve la imagen de la galería
    console.log('Imagen eliminada:', orderId);
  } else {
    console.log('No se encontró la imagen para el ID:', orderId);
  }
}

function renderLives() {
  const $livesContainer = $('#player-lives');
  $livesContainer.empty(); // Limpia el contenedor antes de renderizar

  for (let i = 0; i < 3; i++) { // Asume que siempre hay un máximo de 3 vidas
    const imgPath = i < lives ? fullLifeImage : emptyLifeImage;
    const lifeImage = `<img src="${imgPath}" alt="Life">`;
    $livesContainer.append(lifeImage);
  }
}

function loseLife() {
  if (lives > 1) {
    lives--; // Reduce una vida
    renderLives(); // Actualiza la interfaz
    console.log(`Vidas restantes: ${lives}`);
  }
  else if (lives == 1) {
    lives--;
    renderLives(); // Actualiza la interfaz
    console.log('Game Over');
    gameOver(); 
  }
}

function gameOver() {
  const gameOverImage = 'Assets/game_over.png'; // Ruta de tu imagen de Game Over

  // Crea el contenedor de la pantalla de Game Over
  const overlay = `
    <div id="game-over-overlay">
      <img src="${gameOverImage}" alt="Game Over">
    </div>
  `;

  // Añádelo al body
  $('body').append(overlay);

  console.log('Game Over');
}

function updateScore(newScore) {
  $('#score-value').text(newScore); // Actualiza el texto en la card
}