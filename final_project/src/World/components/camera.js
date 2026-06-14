import { PerspectiveCamera } from 'https://esm.sh/three@0.184.0';

function createCamera() {
  const camera = new PerspectiveCamera(
    50, // fov = Field Of View
    1, // aspect ratio (dummy value)
    0.1, // near clipping plane
    1000, // far clipping plane
  );

  // move the camera back so we can view the scene
  //camera.rotation.y = Math.PI;
  camera.position.set(0, 0.1, -10);
  camera.tick = () => {

    //camera.rotation.x += 0.01;
    //camera.rotation.y += 0.01;
    //camera.rotation.z += 0.01;
  }
  return camera;
}

export { createCamera };