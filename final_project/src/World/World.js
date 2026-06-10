
import { createPointerLockControls } from './systems/PointerLockControls.js';
import { createFirstPersonControls } from './systems/firstPersonControls.js';
import { createOrbitControls } from './systems/orbitControls.js';
import { AxesHelper} from 'https://esm.sh/three@0.184.0'

import { loadMap } from './components/map.js';
import { loadModels } from './components/loadModels.js';
import { createCamera } from './components/camera.js';
import { createMeshGroup } from './components/meshGroup.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';
import { MainCharacter } from './components/mainCharacter.js';
import { Fly } from './components/fly.js';

import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';
import { CannonWorld } from './systems/engine/cannonWorld.js'
import { createRenderer } from './systems/renderer.js';
import { fpsControls } from './systems/fpsControls.js';

import { Octree } from 'https://esm.sh/three@0.184.0/examples/jsm/math/Octree.js';
import { CylinderGeometry } from 'https://esm.sh/three@0.184.0'
import { Capsule } from 'https://esm.sh/three@0.184.0/examples/jsm/math/Capsule.js';
import { Vector3, MeshBasicMaterial, MeshNormalMaterial, BoxHelper, Sphere, SphereGeometry, Mesh } from 'https://esm.sh/three@0.184.0';

import {Tween, Easing} from 'https://unpkg.com/@tweenjs/tween.js@25.0.0/dist/tween.esm.js'

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
    const {houseModel, flyModel} = await loadModels();
    const material = new MeshNormalMaterial( { color: 0xffff00 } );
    
    houseModel.traverse((child) => {
        if (child.isMesh) {
            child.material = material;
        }
    });
    //houseModel.visible = false;
    scene.add(houseModel);
    
    const pointerLockControls = createPointerLockControls(camera, renderer.domElement); 
    loop.addUpdateTable(pointerLockControls);
    pointerLockControls.lock(true);
    document.addEventListener( 'keydown', ( event ) => {
			pointerLockControls.lock(true);
		});
    const axesHelper = new AxesHelper( 5 );
    axesHelper.position.set(0,-17,0);
    scene.add( axesHelper ) ;

    /* mainCharacterModel.rotation.y = Math.PI;
    mainCharacterModel.position.set(0, -0.15, -0.25);
    const mainCharacter = new MainCharacter(cannonWorld, mainCharacterModel);
    //loop.addActor(mainCharacter);
    camera.add(mainCharacterModel);
    scene.add(camera); */
    
    
    

    //const orbitControls = createOrbitControls(camera, renderer.domElement);
    //loop.addUpdateTable(orbitControls);

    const player = new Capsule();
    player.translate(new Vector3(72,-10,16));
    camera.rotation.set(0.63, 1.31, -0.62);
    const octree = new Octree().fromGraphNode(scene);
    
    const playerControls = new fpsControls(player, camera, octree);
    loop.addUpdateTable(playerControls);

    const sphereTranslationVector = new Vector3(0,0.25,-0.17);

    //flyModel.up = new Vector3(0,1,0);
    for (var i = 0; i < 100; i++){
      const new_model = flyModel.clone();
      new_model.geometry.computeBoundingSphere();
      const hitboxSphere = new Sphere(new_model.position, new_model.geometry.boundingSphere.radius/8);
      
      /* const sphere = new SphereGeometry(new_model.geometry.boundingSphere.radius/8w);
      const material = new MeshBasicMaterial({
        color: 'cyan',
        transparent: true,
        opacity: 0.4
      });
      //material.opacity = 1;
      const mesh = new Mesh(sphere, material);
      //mesh.opacity = 1;
      mesh.position.set(0,-17,0);
      //const sphereTranslationVector = new Vector3(0,0.25,-0.17);
      //mesh.position.add(sphereTranslationVector);
      new_model.position.set(0,-17,0);
      //new_model.rotation.x += Math.PI/2;
      //new_model.rotation.y += Math.PI;
      scene.add(mesh); */

      const fly = new Fly(new_model, hitboxSphere);
      //new_model.position.set(0,0,0);
      scene.add(new_model);
      loop.addUpdateTable(fly);
      playerControls.addActor(fly);
    }

    /* const fly = new Fly(flyModel);
    //flyModel.position.set(0,-18,0);
    scene.add(flyModel);
    loop.addUpdateTable(fly);
    playerControls.addActor(fly); */

    /* const box = new BoxHelper(flyModel, 0xffff00);
    scene.add(box); */

  }

  render() {
    // draw a single frame
    renderer.render(scene, camera);
  }

  start() {
    loop.start(this.octree, this.player);
  }

  stop() {
    loop.stop();
  }

  animate(){
    requestAnimationFrame()
  }
}

export { World };