import * as THREE from 'three';

import { CargarModelo } from './CargarModelo.js';

import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.167.1/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://cdn.jsdelivr.net/npm/three@0.167.1/examples/jsm/loaders/MTLLoader.js';

const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 8, 8); 
camera.lookAt(0, 0, 0);


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
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const AmbientLight = new THREE.AmbientLight(0x404040,40);
scene.add(AmbientLight);

// Crear la luz spot
const spotLight = new THREE.SpotLight(0xffec77, 10); // Luz blanca con intensidad 1
spotLight.position.set(4, 3, 1.9); // Posicionar la luz en las coordenadas especificadas
spotLight.target.position.set(4, -1, 2.1); // Hacer que apunte hacia abajo

// Añadir la luz y su objetivo a la escena
scene.add(spotLight);
scene.add(spotLight.target);

// Opcional: Helper para visualizar la dirección de la luz
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
//scene.add(spotLightHelper);

spotLight.angle = Math.PI / 8; // Ángulo del haz (en radianes)
spotLight.distance = 10; // Distancia máxima de la luz
spotLight.castShadow = true; // Habilitar sombras (si las usas)


// const restaurant = new CargarModelo('Models/crustacio/Crustacio', manager, world, scene);
// restaurant.SetPosition(1,-4,-18)
// restaurant.AddToScene(scene);
// restaurant.SeeBB=false;

// const restaurant = new CargarModelo('Models/restaurant2/restaurant2', manager, world, scene);
// restaurant.SetPosition(1,-4,-12)
// restaurant.AddToScene(scene);A
// restaurant.SeeBB=false;


const restaurant = new CargarModelo('Models/restaurant3/Nieve', manager, world, scene);
restaurant.SetPosition(2, -3,-8)
restaurant.AddToScene(scene);
restaurant.SeeBB=false;



const soda = new CargarModelo('Models/soda/soda', manager, scene);
soda.SetPosition(2,0,-1.6);
soda.AddToScene(scene);
soda.Scale(1.6,1.6,1.6);

const deliver = new CargarModelo('Models/deliver/deliver', manager, scene);
deliver.SetPosition(4,0,2.1);
deliver.AddToScene(scene);
deliver.Scale(1.3,1.3,1.3);

const letuce = new CargarModelo('Models/tomato/Tomato', manager,  scene);
letuce.SetPosition(-0.3,0,-1.5);
letuce.AddToScene(scene);
letuce.Scale(1.7,1.7,1.7)

const tomato = new CargarModelo('Models/letuce/ChopLetuce', manager, scene);
tomato.SetPosition(-4.9,0,.25);
tomato.AddToScene(scene);
tomato.Scale(1.3,1.1,1.3)

const stove = new CargarModelo('Models/stove/stove', manager, scene);
stove.SetPosition(-2.7,0,-1.5)
stove.AddToScene(scene);
stove.Scale(1.8,1.7,1.7)

// const stoveBurned = new CargarModelo('Models/stove/burned/stoveAndMeatBurned', manager, world, scene);
// stoveBurned.SetPosition(4.5,0,-2)
// stoveBurned.AddToScene(scene);
// stoveBurned.Scale(1.5,1.5,1.5)

// const stoveRaw = new CargarModelo('Models/stove/raw/stoveAndMeatRaw', manager, world, scene);
// stoveRaw.SetPosition(6,0,-2)
// stoveRaw.AddToScene(scene);
// stoveRaw.Scale(1.5,1.5,1.5)

const bigtable2 = new CargarModelo('Models/table2/smalltable', manager,  scene);
bigtable2.SetPosition(-4.8, 0, -1.6);
bigtable2.AddToScene(scene);
bigtable2.Scale(1.3, 1.3, 1.3);

const bigtable3 = new CargarModelo('Models/bigtable2/bigtable2', manager,  scene);
bigtable3.SetPosition(4.1, 0, -.9)
bigtable3.AddToScene(scene);
bigtable3.Scale(1.4, 1.2, 1)

const chef = new CargarModelo('Models/chef/chef', manager, scene);
chef.SetPosition(0,0,1)
chef.AddToScene(scene);

const chef2 = new CargarModelo('Models/chef2/chef2', manager, scene);
chef2.PosX = 5;
chef2.PosZ = 1;
chef2.SetPosition(2,0,1)
chef2.AddToScene(scene);

const bigtable = new CargarModelo('Models/bigtable/bigtable', manager, scene);
bigtable.SetPosition(-4,0,4)
bigtable.AddToScene(scene);
bigtable.Scale(1.2,1.2,1.2)

const table = new CargarModelo('Models/table/table', manager, scene);
table.SetPosition(-1.4,0,4)
table.AddToScene(scene);
table.Scale(1.2,1.2,1.2)

const trash = new CargarModelo('Models/trash/trash', manager,  scene);
trash.SetPosition(.3,0,4)
trash.Scale(1.6, 1.6, 1.6);
trash.AddToScene(scene);

const bread = new CargarModelo('Models/bread/bread', manager, scene);
bread.SetPosition(2,0,4)
bread.AddToScene(scene);
bread.Scale(1.2,1.2,1.2)

const table2 = new CargarModelo('Models/table2/smalltable', manager, scene);
table2.SetPosition(3.9,0,4)
table2.AddToScene(scene);
table2.Scale(1.2,1.2,1.2)

const meat = new CargarModelo('Models/meat/meat', manager, scene);
meat.SetPosition(-4.8,0,2.2)
meat.AddToScene(scene);
meat.Scale(1.25,1.25,1.25)


manager.onLoad = function () {
  console.log('Todos los modelos se han cargado.');

};


$(document).ready(function() {
  // Objeto para almacenar el estado de las teclas presionadas
  const keysPressed = {};

  // Velocidad del movimiento
  const speed = 0.1;

  // Evento para cuando una tecla se presiona
  $(document).keydown(function(e) {
    keysPressed[e.key.toLowerCase()] = true; // Almacena la tecla presionada
    e.preventDefault(); // Evita que las flechas hagan scroll
  });

  // Evento para cuando una tecla se suelta
  $(document).keyup(function(e) {
    delete keysPressed[e.key.toLowerCase()]; // Elimina la tecla del registro cuando se suelta
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
    if (keysPressed['arrowleft']) { // Flecha izquierda
      chef2.PosX -= speed;
      chef2.SetPositionThis();
    }
    if (keysPressed['arrowright']) { // Flecha derecha
      chef2.PosX += speed;
      chef2.SetPositionThis();
    }
    if (keysPressed['arrowup']) { // Flecha arriba
      chef2.PosZ -= speed;
      chef2.SetPositionThis();
    }
    if (keysPressed['arrowdown']) { // Flecha abajo
      chef2.PosZ += speed;
      chef2.SetPositionThis();
    }

    letuce.Update();
    soda.Update();
    bread.Update();
    chef2.Update();
    bigtable.Update();
    bigtable2.Update();
    bigtable3.Update();
    stove.Update();
    meat.Update();
    soda.Update();
    deliver.Update();
    tomato.Update();


   
    chef.Update();
    trash.Update();

    // Vuelve a llamar a la función en el siguiente cuadro    
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  // Comienza la animación
  animate();
});


function isCollision(chef, obj) {

  // Verificar si haay colisión
  if ( chef.boundingBox.intersectsBox(obj.boundingBox) ) {
    console.log("Colisión detectada entre el chef y un objeto");
    return true;
  } 
  else{
    return false;
  }
}

function anyCollision(chef){
  if(
    isCollision(chef, trash) || isCollision(chef, bread) || isCollision(chef, letuce) || isCollision(chef, bigtable) ||
    isCollision(chef, bigtable2) || isCollision(chef, stove) || isCollision(chef, tomato) || 
    isCollision(chef, bigtable3) || isCollision(chef, meat) || isCollision(chef, soda) || isCollision(chef, deliver) 

  ){
    return true;
  }
  else{
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
  if (anyCollision(chef)) {
    return false; // No se puede mover en esta dirección
  }

  return true; // Se puede mover
}