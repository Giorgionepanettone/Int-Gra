import { WebGLRenderer } from 'three';

function createRenderer() {
  const renderer = new WebGLRenderer({antialias : true});
  //renderer.physicallyCorrectLights = true; //this kind of kills performance. Turned it off
  return renderer;
}

export { createRenderer };