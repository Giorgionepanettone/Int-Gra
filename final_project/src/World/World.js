
import { createPointerLockControls } from './systems/PointerLockControls.js';
import { createFirstPersonControls } from './systems/firstPersonControls.js';
import { createOrbitControls } from './systems/orbitControls.js';
import { AxesHelper} from 'https://esm.sh/three@0.184.0'

import { loadMap } from './components/map.js';
import { loadAssets } from './components/loadAssets.js';
import { createCamera } from './components/camera.js';
import { createMeshGroup } from './components/meshGroup.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';
import { MainCharacter } from './components/mainCharacter.js';
import { Fly } from './components/fly.js';
import { Zapper} from './components/zapper.js'
import { Arms } from './components/arms.js';

import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';
import { CannonWorld } from './systems/engine/cannonWorld.js'
import { createRenderer } from './systems/renderer.js';
import { fpsControls } from './systems/fpsControls.js';

import { Octree } from 'https://esm.sh/three@0.184.0/examples/jsm/math/Octree.js';
import { CylinderGeometry } from 'https://esm.sh/three@0.184.0'
import { Capsule } from 'https://esm.sh/three@0.184.0/examples/jsm/math/Capsule.js';
import { ObjectLoader,TextureLoader, Vector3, MeshBasicMaterial, MeshNormalMaterial, Box3Helper, Sphere, SphereGeometry, Mesh, MathUtils, AudioListener, Audio, AudioLoader, BoxGeometry } from 'https://esm.sh/three@0.184.0';
import { OctreeHelper } from 'https://esm.sh/three@0.184.0/examples/jsm/helpers/OctreeHelper.js'

import {Tween, Easing} from 'https://unpkg.com/@tweenjs/tween.js@25.0.0/dist/tween.esm.js'

let camera;
let scene;
let renderer;
let loop;
let cannonWorld;
let currentWeapon;


const NUMBER_OF_FLIES = 500;

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
    const {houseModel, flyModel, zapperModel, armsModel, zapSoundSharedBuffer, lightningTexture} = await loadAssets();
    const material = new MeshNormalMaterial( { color: 0x00ffff } );
    
    houseModel.traverse((child) => {
        if (child.isMesh) {
            child.material = material;
        }
    });

    currentWeapon = "ZAPPER";

    //houseModel.visible = false;
    scene.add(houseModel);

    this.setupPointerLockControls();

    this.addAxesHelper();

    const player = this.addPlayer();

    camera.rotation.set(0.63, 1.31, -0.62);

    const octree = new Octree().fromGraphNode(scene);

    //const helper = new OctreeHelper( octree );
    //cene.add( helper );
    
    const zapper = new Zapper(zapperModel, camera);

    const controls = new fpsControls(player, camera, octree);
    
    loop.addUpdateTable(controls);

    const listener = new AudioListener();
    listener.gain.gain.value = 0.1;
    camera.add(listener);
    
    for (let i = 0; i < NUMBER_OF_FLIES; i++){

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

      new Fly(flyModel.clone(), controls, loop, scene, listener, zapSoundSharedBuffer, lightningTexture);
      //new_model.position.set(0,0,0);
      //scene.add(new_model);
      //loop.addUpdateTable(fly);
      //ontrols.addActor(fly);
    }

    /* const fly = new Fly(flyModel);
    //flyModel.position.set(0,-18,0);
    scene.add(flyModel);
    loop.addUpdateTable(fly);
    playerControls.addActor(fly); */

    /* const box = new BoxHelper(flyModel, 0xffff00);
    scene.add(box); */

    
    //console.log(zapperModel);
    //scene.add(zapperModel);
    //camera.add(zapperModel);
    //zapper.localHitbox.rotation.x -= Math.PI/2;
    
    //camera.add(robotArmModel);
    //zapperModel.scale.multiplyScalar(0.01);
    //scene.add(zapperModel);

    //robotArmModel.position.set(0,0,-10);
    //robotArmModel.rotation.set(MathUtils.degToRad(60),MathUtils.degToRad(0),MathUtils.degToRad(-100));

    scene.add(camera);

    //const box3Helper = new Box3Helper(zapper.hitbox, 0xffff00);
    //scene.add(box3Helper);

    //scene.add(robotArmModel);
    controls.addWeapon(zapper);
    console.log(armsModel);

    
    //scene.add(armsModel);

    
    //armsModel.getObjectByName("RootNode").remove(armsModel.getObjectByName("Armature002"));
    
    //armsModel.getObjectByName("RootNode").add(object);
    camera.add(armsModel);
    //scene.add(object);

    const arms = new Arms(armsModel);
    arms.handR.add(zapperModel);
    arms.zapperPositionInit(zapperModel);
    arms.updateCurrentWeapon("ZAPPER");
    currentWeapon = arms;
    loop.addUpdateTable(arms);
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

  setupPointerLockControls(){
    const pointerLockControls = createPointerLockControls(camera, renderer.domElement); 
    loop.addUpdateTable(pointerLockControls);
    //sdpointerLockControls.lock(true);
    document.addEventListener( 'mousedown', ( event ) => {
			if(!pointerLockControls.isLocked) 
      {
        pointerLockControls.lock(true);
      }
      else{
        currentWeapon.clickDown();
      }
		});

    document.addEventListener( 'mouseup', ( event ) => {
			if(pointerLockControls.isLocked) 
        {
        currentWeapon.clickUp();
        }
		});
  }

  addAxesHelper(){
    const axesHelper = new AxesHelper( 5 );
    axesHelper.position.set(0,-17,0);
    scene.add( axesHelper ) ;
  }

  addPlayer(){
    const playerStart = new Vector3(0,0,0);
    const playerEnd = new Vector3(0,12,0);
    const playerRadius = 2.5;

    const player = new Capsule(playerStart, playerEnd, playerRadius);
    player.translate(new Vector3(72,-10,16));

    return player;
  }
}

export { World };