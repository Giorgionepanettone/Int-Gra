import { SRGBColorSpace, EquirectangularReflectionMapping, Scene} from 'three';

function createScene(backgroundTexture) {
  const scene = new Scene();
  
  backgroundTexture.mapping = EquirectangularReflectionMapping;
  backgroundTexture.colorSpace = SRGBColorSpace;
  scene.background = backgroundTexture;

  return scene;
}

export { createScene };