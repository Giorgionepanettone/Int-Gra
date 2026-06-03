import { Color, Scene, TextureLoader } from 'https://esm.sh/three@0.184.0';

function createScene() {
  const scene = new Scene();
  
  const textureLoader = new TextureLoader();

  const texture = textureLoader.load(
    './assets/textures/space_spheremaps/blue_nebulae_1.png',
  );
  scene.background = texture;

  return scene;
}

export { createScene };