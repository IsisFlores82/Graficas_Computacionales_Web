import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';

export class CargarModelo {

  constructor(pathModelo, manager, scene) {
    this.objeto3D = new THREE.Object3D();
    this.PosX = 0;
    this.PosY = 0;
    this.PosZ = 0;
    this.boundingBox = new THREE.Box3().setFromObject(this.objeto3D);

    this.scene = scene;

    const ObjLoader = new OBJLoader(manager);
    const MtlLoader = new MTLLoader(manager);

    MtlLoader.load(pathModelo + '.mtl', (materials) => {
      materials.preload();
      ObjLoader.setMaterials(materials);

      ObjLoader.load(pathModelo + '.obj', (object) => {
        this.objeto3D.add(object);
        this.createBoundingBox(); // Crear la caja de colisión visual
      });
    });
  }

  createBoundingBox() {
    // Obtener el tamaño del modelo cargado para crear la caja de colisión    
    const size = new THREE.Vector3();
    this.boundingBox.getSize(size); 

    // Crear el helper para la caja de colisión
    this.createBoundingBoxHelper(size);
  }

  createBoundingBoxHelper(size) {
    // Crear el BoxHelper que servirá para visualizar la bounding box
    this.boundingBoxHelper = new THREE.BoxHelper(this.objeto3D, 0xff0000); // color rojo
    this.boundingBoxHelper.update(); // Actualizar la caja con las dimensiones del objeto
    this.scene.add(this.boundingBoxHelper);
    //this.toggleBoundingBoxVisibility();
  }

  Scale(ScaleX, ScaleY, ScaleZ) {
    this.objeto3D.scale.set(ScaleX, ScaleY, ScaleZ);
    if (this.boundingBoxHelper) {
      this.boundingBoxHelper.update(); // Actualiza la caja de colisión visual
    }
  }

  SetPosition(PosX, PosY, PosZ) {
    this.objeto3D.position.set(PosX, PosY, PosZ);
    if (this.boundingBoxHelper) {
      this.boundingBoxHelper.update(); // Actualiza la caja de colisión visual
    }
  }

  SetPositionThis() {
    this.SetPosition(this.PosX, this.PosY, this.PosZ);
  }

  AddToScene(scene) {
    scene.add(this.objeto3D);
  }
  
  RemoveFromScene(scene) {
    scene.remove(this.objeto3D);
  }


  Rotate(axis, angle) {
    const rotationAxis = new THREE.Vector3(axis.x, axis.y, axis.z).normalize();
    this.objeto3D.rotateOnAxis(rotationAxis, angle);
    if (this.boundingBoxHelper) {
      this.boundingBoxHelper.update(); // Actualiza la caja de colisión visual
    }
  }

  Update() {
    // Aquí se puede actualizar cualquier lógica relacionada con la posición del modelo
    if (this.boundingBoxHelper) {
      this.boundingBoxHelper.update(); // Sincroniza la caja de colisión visual con el modelo
    }
    // Actualizar boundingBox si la posición cambió
    this.boundingBox.setFromObject(this.objeto3D);
  }

  // Método para activar o desactivar la visibilidad de la bounding box
  toggleBoundingBoxVisibility() {
    if (this.boundingBoxHelper) {
      this.boundingBoxHelper.visible = !this.boundingBoxHelper.visible;
    }
  }
}
