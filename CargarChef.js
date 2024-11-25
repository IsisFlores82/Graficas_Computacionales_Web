import * as THREE from 'three';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.167.1/examples/jsm/loaders/GLTFLoader.js';

export class CargarChef {
  constructor(pathModelo, manager, scene) {
    this.objeto3D = null;
    this.boundingBox = new THREE.Box3();
    this.boundingBoxHelper = null;
    this.scene = scene;
    this.actions = {};
    this.PosX = 0;
    this.PosY = 0;
    this.PosZ = 0;
    this.currentAction = null;
    this.idleName = "";
    this.walkName = "";
    

    const loader = new GLTFLoader(manager);
    loader.load(pathModelo, (gltf) => {
      this.objeto3D = gltf.scene;
      this.createBoundingBox(); // Crear la caja de colisión visual

      // Configurar animaciones
      const mixer = new THREE.AnimationMixer(gltf.scene);
      gltf.animations.forEach((clip) => {
        this.actions[clip.name] = mixer.clipAction(clip);
      });
      this.mixer = mixer;

      // Imprimir los nombres de las animaciones
      gltf.animations.forEach((clip) => {
        console.log(`Animación disponible: ${clip.name}`);
      });

      // Si tienes una animación por defecto, la puedes iniciar
      if (gltf.animations.length > 0) {
        this.playAnimation(gltf.animations[0].name); // Inicia la primera animación si existe
        this.idleName = gltf.animations[0].name;
        this.walkName = gltf.animations[1].name;

        console.log(`Animación por idle: ${this.idleName}`);
        console.log(`Animación por walk: ${this.walkName}`);

      }

      // Añadir el objeto3D a la escena
      scene.add(this.objeto3D);

      // Establecer la posición de inicio
      //this.objeto3D.position.set(0, 0, 0);
    });

    this.objeto3D = new THREE.Object3D(); // Ya no es necesario porque gltf.scene se asigna después
  }

  createBoundingBox() {
     // Obtener la caja de colisión del objeto
    this.boundingBox.setFromObject(this.objeto3D);

    // Reducir el ancho (en el eje X) a la mitad
    const centerX = (this.boundingBox.min.x + this.boundingBox.max.x) / 2;
    this.boundingBox.min.x = centerX - (centerX - this.boundingBox.min.x) / 2;
    this.boundingBox.max.x = centerX + (this.boundingBox.max.x - centerX) / 2;

    // Crear el helper para la nueva caja de colisión
    this.createBoundingBoxHelper();
  }

  createBoundingBoxHelper() {
    // Crear el BoxHelper que servirá para visualizar la bounding box
    this.boundingBoxHelper = new THREE.BoxHelper(this.objeto3D, 0xff0000); // color rojo
    this.boundingBoxHelper.update(); // Actualizar la caja con las dimensiones del objeto
  
    // Asegúrate de que el helper se agregue a la escena
    //this.scene.add(this.boundingBoxHelper);
    
  }

  SetPosition(x, y, z) {
    if (isNaN(x) || isNaN(y) || isNaN(z)) {
      console.error('Posición contiene valores NaN:', { x, y, z });
      return;
    }
    this.objeto3D.position.set(x, y, z);

    // Actualizar la caja de colisión después de mover el objeto
    if (this.boundingBox) {
      this.boundingBox.setFromObject(this.objeto3D);
    }
  }

  SetPositionThis() {
    if (
      isNaN(this.PosX) ||
      isNaN(this.PosY) ||
      isNaN(this.PosZ)
    ) {
      console.error('Error: Posiciones inválidas en SetPositionThis', {
        PosX: this.PosX,
        PosY: this.PosY,
        PosZ: this.PosZ,
      });
      return;
    }
    this.SetPosition(this.PosX, this.PosY, this.PosZ);
  }

  AddToScene(scene) {
    scene.add(this.objeto3D);
  }

  RemoveFromScene(scene) {
    scene.remove(this.objeto3D);
    if (this.boundingBox) {
      scene.remove(this.boundingBox);
    }
    if (this.boundingBoxHelper) {
      scene.remove(this.boundingBoxHelper);
    }
    this.objeto3D = null;
    this.boundingBox = null;
    this.boundingBoxHelper = null;
  }

  Rotate(axis, angle) {
    const rotationAxis = new THREE.Vector3(axis.x, axis.y, axis.z).normalize();
    this.objeto3D.rotateOnAxis(rotationAxis, angle);
    if (this.boundingBoxHelper) {
      this.boundingBoxHelper.update(); // Actualiza la caja de colisión visual
    }
  }

  Update() {
    if (this.mixer) {
      this.mixer.update(0.01); // Asegurarse de que el mixer de animación se actualice
    }

    if (this.boundingBoxHelper) {
      this.boundingBoxHelper.update(); // Sincroniza la caja de colisión visual con el modelo
    }

    // Actualizar boundingBox si la posición cambió
    this.boundingBox.setFromObject(this.objeto3D);
  }

  // Método para verificar si el objeto está en la escena
  IsInScene(scene) {
    return scene.getObjectById(this.objeto3D.id) !== undefined;
  }

  playAnimation(animationName) {
    if (this.actions[animationName]) {
      if (this.currentAction) {
        this.currentAction.fadeOut(0); // Transición suave entre animaciones
      }
      this.currentAction = this.actions[animationName];
      this.currentAction.reset().fadeIn(0).play();
    } else {
      console.warn(`La animación ${animationName} no existe.`);
    }
  }

 //changeAnimation() {    
 //  this.playAnimation(this.idleName);   
 //}

  // Nuevo método para cambiar de animación
  changeAnimationWalk() {    
    this.playAnimation(this.walkName);   
  }

  changeAnimationIdle() {    
    this.playAnimation(this.idleName);   
  }
}
