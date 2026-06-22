import { PerspectiveCamera } from 'three';

function createCamera() {
  const camera = new PerspectiveCamera(
    50, // fov = Field Of View
    1, // aspect ratio (dummy value)
    0.1, // near clipping plane
    1000, // far clipping plane
  );

  camera.position.set(0, 0.1, -10);
  camera.rotation.y += Math.PI/2;
  return camera;
}

export { createCamera };