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
import { CannonWorld } from './systems/engine/cannonWorld.js'
import { MainCharacter } from './components/mainCharacter.js';

// These variables are module-scoped: we cannot access them
// from outside the module

let camera;
let scene;
let renderer;
let loop;
let cannonWorld;

class World {
  constructor(container) {
    cannonWorld = new CannonWorld();
    camera = createCamera();
    scene = createScene();
    renderer = createRenderer();
    loop = new Loop(camera, scene, renderer, cannonWorld);
    container.append(renderer.domElement);
    
    const {directLight, ambientLight} = createLights();

    scene.add(directLight, ambientLight);

    const resizer = new Resizer(container, camera, renderer);
  }

  async init() {
    const {map} = await loadModels();
    scene.add(map);
    const pointerLockControls = createPointerLockControls(camera, renderer.domElement); 
    loop.addUpdateTable(pointerLockControls);
    pointerLockControls.lock(true);

    const axesHelper = new AxesHelper( 5 );
    axesHelper.position.z -= 1;
    axesHelper.position.x -= 1;
    scene.add( axesHelper );

    const mainCharacter = new MainCharacter(cannonWorld);
    mainCharacter.init(scene, camera);

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

  animate(){
    requestAnimationFrame()
  }
}

export { World };