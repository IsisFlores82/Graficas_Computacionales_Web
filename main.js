import * as THREE from 'three';

import { CargarModelo } from './CargarModelo.js';

import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.167.1/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://cdn.jsdelivr.net/npm/three@0.167.1/examples/jsm/loaders/MTLLoader.js';

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
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const sl= new THREE.SpotLight (0xffffff, 30, 8, Math.PI/5, 2.0, 0.05);
sl.position.set(0, 7, 0);
const SpotLightelper = new THREE.SpotLightHelper(sl);
scene.add(sl);

// Crear la luz SpotLight
const sl1 = new THREE.SpotLight(0xffffff, 30, 8, Math.PI / 5, 2.0, 0.05);
sl1.position.set(5, 7, 0); // Posición de la luz
// Crear un objeto 3D como el objetivo (justo debajo de la luz)
const targetObject = new THREE.Object3D();
targetObject.position.set(7, 0, 0); // Directamente debajo de la luz
// Configurar la luz para que apunte al objetivo
sl1.target = targetObject;
// Añadir la luz y su objetivo a la escena
scene.add(sl1);
scene.add(targetObject);
// Crear y añadir el helper de la luz
const spotLightHelper1 = new THREE.SpotLightHelper(sl1);
//scene.add(spotLightHelper1);


const pl = new THREE.PointLight (0x31e0e3, 40, 10, 2);
pl.position.set(0,0,0);
const pointLighHelper = new THREE.PointLightHelper(pl);
pl.position.z = 0
pl.position.x = -4
scene.add(pl, pointLighHelper);


const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const textureLoader = new THREE.TextureLoader();

const material = new THREE.MeshStandardMaterial( { 
  color: 0x8131e3,  
  emissive: 0x8131e3,
  emissiveIntensity: 0.1
} );

const cube = new THREE.Mesh( geometry, material );
cube.position.z=-1;
cube.visible = true;


const hamburger = new CargarModelo('Models/hamburger/hamburger', manager);
hamburger.SetPosition(0,0,-2)
hamburger.AddToScene(scene);

const soda = new CargarModelo('Models/soda/soda', manager);
soda.SetPosition(1.5,0,-2)
soda.AddToScene(scene);

const letuce = new CargarModelo('Models/letuce/ChopLetuce', manager);
letuce.SetPosition(-1.5,0,-2)
letuce.AddToScene(scene);

const tomato = new CargarModelo('Models/tomato/Tomato', manager);
tomato.SetPosition(3,0,-2)
tomato.AddToScene(scene);

const stove = new CargarModelo('Models/stove/stove', manager);
stove.SetPosition(-3,0,-2)
stove.AddToScene(scene);

const stoveBurned = new CargarModelo('Models/stove/burned/stoveAndMeatBurned', manager);
stoveBurned.SetPosition(4.5,0,-2)
stoveBurned.AddToScene(scene);

const stoveRaw = new CargarModelo('Models/stove/raw/stoveAndMeatRaw', manager);
stoveRaw.SetPosition(6,0,-2)
stoveRaw.AddToScene(scene);

const trash = new CargarModelo('Models/trash/trash', manager);
trash.AddToScene(scene);

const chef = new CargarModelo('Models/chef/chef', manager);
chef.PosX = 3;
chef.PosZ = 1;
chef.SetPosition(3,0,1)
chef.AddToScene(scene);

const chef2 = new CargarModelo('Models/chef2/chef2', manager);
chef2.PosX = 5;
chef2.PosZ = 1;
chef2.SetPosition(5,0,1)
chef2.AddToScene(scene);

const floor = new CargarModelo('Models/floor/floor', manager);
floor.SetPosition(2,0,-6)
floor.Scale(0.8, 0.8, 0.8)
floor.AddToScene(scene);

//scene.add(cube);
const positionVec = new THREE.Vector3(-5, 0, 0); 
const positionVec2 = new THREE.Vector3(-4, 0, 0); 

const vectorpj = new THREE.Vector3(2,0,1);
const positionCubo = new THREE.Vector3(0,0,0); 
const lightOffsetY = 2;

let direction = 1;
let direction2 = 1;


//animate();
//renderer.setAnimationLoop(animate);

function animate() {  
  
  //vectorpj.x += 0.0001 * direction;
  //vectorpj.y +=0.0001*direction2;
//
  //if(vectorpj.x>=5  || vectorpj.x <= -5){
  //  direction *= -1;
  //}
  //if(vectorpj.y>=4  || vectorpj.x <= 2){
  //  direction2 *= -1;
  //}

  pl.position.set(vectorpj.x, vectorpj.y+1, vectorpj.z);
  cube.position.set(positionCubo.x, positionCubo.y, positionCubo.z);

	requestAnimationFrame(animate);
  renderer.render(scene, camera);

  {
  }
}
$(document).ready(function() {  
  animate();

  // Objeto para almacenar el estado de las teclas presionadas
  const keysPressed = {};

  // Evento para cuando una tecla se presiona
  $(document).keydown(function(e) {
    keysPressed[e.key.toLowerCase()] = true; // Almacena la tecla presionada
    e.preventDefault(); //hace que no se haga scroll cuando pulsas flechas

    // Movimiento del chef con W, A, S, D
    if (keysPressed['a']) {
      chef.PosX = chef.PosX - 0.1;
      chef.SetPositionThis();
    }
    if (keysPressed['d']) {
      chef.PosX = chef.PosX + 0.1;
      chef.SetPositionThis();
    }
    if (keysPressed['w']) {
      chef.PosZ = chef.PosZ - 0.1;
      chef.SetPositionThis();
    }
    if (keysPressed['s']) {
      chef.PosZ = chef.PosZ + 0.1;
      chef.SetPositionThis();
    }

    // Movimiento del chef2 con las flechas
    if (keysPressed['arrowleft']) { // Flecha izquierda
      chef2.PosX = chef2.PosX - 0.1;
      chef2.SetPositionThis();
    }
    if (keysPressed['arrowup']) { // Flecha arriba
      chef2.PosZ = chef2.PosZ - 0.1;
      chef2.SetPositionThis();
    }
    if (keysPressed['arrowright']) { // Flecha derecha
      chef2.PosX = chef2.PosX + 0.1;
      chef2.SetPositionThis();
    }
    if (keysPressed['arrowdown']) { // Flecha abajo
      chef2.PosZ = chef2.PosZ + 0.1;
      chef2.SetPositionThis();
    }
  });

  // Evento para cuando una tecla se suelta
  $(document).keyup(function(e) {
    delete keysPressed[e.key.toLowerCase()]; // Elimina la tecla del registro cuando se suelta
  });

});