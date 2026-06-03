import { createCamera } from './components/camera.js';
import { createMeshGroup } from './components/meshGroup.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';
import { createPointerLockControls } from './systems/PointerLockControls.js';
import { createFirstPersonControls } from './systems/firstPersonControls.js';
import { AxesHelper} from 'https://esm.sh/three@0.184.0'

import { createRenderer } from './systems/renderer.js';
import { loadMap } from './components/map.js';
import { loadModels } from './components/loadModels.js';

import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';

// These variables are module-scoped: we cannot access them
// from outside the module

let camera;
let scene;
let renderer;
let loop;

class World {
  constructor(container) {
    camera = createCamera();
    scene = createScene();
    renderer = createRenderer();
    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);
    
    const {directLight, ambientLight} = createLights();

    scene.add(directLight, ambientLight);

    const resizer = new Resizer(container, camera, renderer);
  }

  async init() {
    const {map, astronaut} = await loadModels();

    //astronaut.rotation.y = Math.PI/2;
    //astronaut.rotation.y = Math.PI;
    //astronaut.add(camera);
    const pointerLockControls = createPointerLockControls(camera, renderer.domElement); 
    //const firstPersonControls = createFirstPersonControls(camera, renderer.domElement);
    loop.updateTable.push(pointerLockControls);
    pointerLockControls.lock(true);

    const axesHelper = new AxesHelper( 5 );
    scene.add( axesHelper );

  }

  render() {
    // draw a single frame
    renderer.render(scene, camera);
  }

  start() {
    loop.start();
  }

  stop() {
    loop.stop();
  }
}

export { World };