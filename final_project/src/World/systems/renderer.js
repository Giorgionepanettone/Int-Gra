import { WebGLRenderer } from 'https://esm.sh/three@0.184.0';

function createRenderer() {
  const renderer = new WebGLRenderer({antialias : true});
  renderer.physicallyCorrectLights = true;
  return renderer;
}

export { createRenderer };