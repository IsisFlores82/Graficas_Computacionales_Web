//clase para crear instancias de modelos, con los metodos para su escala, posicionamiento y renderizado
import * as THREE from 'three';

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';

export class CargarModelo {

  constructor(pathModelo, manager) {
    this.objeto3D = new THREE.Object3D();
    this.PosX = 0;
    this.PosY = 0;
    this.PosZ = 0;

    const ObjLoader = new OBJLoader(manager);
    const MtlLoader = new MTLLoader(manager);
    
    MtlLoader.load(pathModelo + '.mtl', (materials) => {
      materials.preload();
      ObjLoader.setMaterials(materials);

      ObjLoader.load(pathModelo + '.obj', (object) => {
        this.objeto3D.add(object);  // Añadir el modelo a nuestra instancia
      });
    });
  }

  // escalr el modelo
  Scale(ScaleX, ScaleY, ScaleZ) {
    this.objeto3D.scale.set(ScaleX, ScaleY, ScaleZ);
  }

  // posicionar el modelo 
  SetPosition(PosX, PosY, PosZ) {
    this.objeto3D.position.set(PosX, PosY, PosZ);
  }

  SetPositionThis() {
    this.objeto3D.position.set(this.PosX, this.PosY, this.PosZ);
  }

  // Agregarlo a la escena(se tiene q llamar despues de haber creado la escena)
  AddToScene(scene) {
    scene.add(this.objeto3D);
  }
}