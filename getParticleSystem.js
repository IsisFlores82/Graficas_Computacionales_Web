import * as THREE from 'three';

function createSimpleFire(scene, position) {
  const textureLoader = new THREE.TextureLoader();
  const fireTexture = textureLoader.load('Assets/fire.png'); // Cambia el path si es necesario

  const particleMaterial = new THREE.PointsMaterial({
    size: 1, // Tamaño de las partículas
    map: fireTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particleGeometry = new THREE.BufferGeometry();
  const particleCount = 20;

  const positions = [];
  for (let i = 0; i < particleCount; i++) {
    positions.push(
      position.x + (Math.random() - 0.5) * 2,
      position.y + Math.random() * 2,
      position.z + (Math.random() - 0.5) * 2
    );
  }
  particleGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3)
  );

  const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particleSystem);

  let isAnimating = true; // Bandera para controlar la animación

  // Animación simple
  function animateParticles() {
    if (!isAnimating) return;

    const positions = particleGeometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] += 0.02; // Las partículas suben
      if (positions[i + 1] > position.y + 2) {
        positions[i + 1] = position.y; // Reinician al nivel base
      }
    }

    particleGeometry.attributes.position.needsUpdate = true;

    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // Destruir automáticamente después de 7 segundos
  setTimeout(() => {
    isAnimating = false; // Detiene la animación
    scene.remove(particleSystem); // Remueve el sistema de partículas de la escena
    particleGeometry.dispose(); // Limpia la geometría
    particleMaterial.dispose(); // Limpia el material
    console.log('Partículas eliminadas automáticamente');
  }, 5000); 

  return particleSystem; // Devuelve el sistema por si se necesita referenciar
}

export { createSimpleFire };
