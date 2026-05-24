import { Color, Scene } from 'https://esm.sh/three@0.184.0';

function createScene() {
  const scene = new Scene();

  scene.background = new Color('skyblue');

  return scene;
}

export { createScene };