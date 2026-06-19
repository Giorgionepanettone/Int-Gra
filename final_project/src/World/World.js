

import { AxesHelper, RepeatWrapping, Vector3, MeshBasicMaterial, AudioListener, Audio, AudioLoader } from 'three';

import { loadAssets } from './components/loadAssets.js';
import { createCamera } from './components/camera.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';
import { Fly } from './components/fly.js';
import { Zapper} from './components/zapper.js'
import { Arms } from './components/arms.js';
import { Flamethrower } from './components/flamethrower.js';

import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';
import { createRenderer } from './systems/renderer.js';
import { fpsControls } from './systems/fpsControls.js';
import { Particles } from './systems/particles.js';
import { Fire } from './systems/fire.js';
import { FlySpawner } from './systems/FlySpawner.js';
import { createPointerLockControls } from './systems/PointerLockControls.js';
import { createFirstPersonControls } from './systems/firstPersonControls.js';

import { Octree } from 'three/addons/math/Octree.js';
import { Capsule } from 'three/addons/math/Capsule.js';
import { OctreeHelper } from 'three/addons/helpers/OctreeHelper.js'
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

import {Tween, Easing} from 'tween'


let camera;
let scene;
let renderer;
let loop;
let currentWeapon;

class World {
  constructor(container) {
    camera = createCamera();
    
    renderer = createRenderer();
    
    container.append(renderer.domElement);

    const resizer = new Resizer(container, camera, renderer);
  }

  async init() {
    
    const {houseModel, flyModel, zapperModel, armsModel, zapSoundSharedBuffer, burnSoundSharedBuffer,flamethrowerSound, lightningTexture, fireTexture, darkWoodTexture, darkWoodNormalTexture, darkWoodRoughTexture, darkWoodDispTexture,  pavementColorTexture, pavementNormalTexture, pavementRoughTexture, pavementAoMap, flamethrowerModel, backgroundTexture} = await loadAssets();
    scene = createScene(backgroundTexture);
    loop = new Loop(camera, scene, renderer);
    
    this.gui = new GUI({title : "Parameters"});
    this.zapperModel = zapperModel;
    this.flamethrowerModel = flamethrowerModel;
    this.weaponList = ["FLAMETHROWER", "ZAPPER"];
    this.currentWeaponIndex = 1;
    this.canChangeWeapon = true;

    this.setupMaterials(houseModel, darkWoodTexture, darkWoodNormalTexture, darkWoodRoughTexture, pavementColorTexture, pavementNormalTexture, pavementAoMap);
    createLights(scene, houseModel);

    scene.add(houseModel);
    scene.add(camera);

    this.setupPointerLockControls();
    this.setListeners();
    //this.addAxesHelper();

    const octree = new Octree().fromGraphNode(scene);

    const player = this.addPlayer();
    
    this.controls = new fpsControls(player, camera, octree, this.gui);
    
    loop.addUpdateTable(this.controls);

    const listener = new AudioListener();
    listener.gain.gain.value = 0.1;

    const flamethrowerAudio = new Audio(listener);
    flamethrowerAudio.setBuffer(flamethrowerSound);
    flamethrowerAudio.setLoop(true);
    flamethrowerAudio.setVolume(0.5);
    camera.add(listener);
    
    loop.addUpdateTable(new FlySpawner(scene, player, flyModel, loop, listener, zapSoundSharedBuffer, burnSoundSharedBuffer, lightningTexture, this.controls, this.gui));


    this.arms = new Arms(armsModel, camera, this.gui);
    this.arms.model.updateMatrixWorld(true);
    this.zapper = new Zapper(zapperModel, camera);
    this.flamethrower = new Flamethrower(flamethrowerModel, fireTexture, scene, flamethrowerAudio, this.gui);

    this.swapWeapon(this.weaponList[this.currentWeaponIndex]);
    this.removeLoadingScreen();
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
    this.pointerLockControls = createPointerLockControls(camera, renderer.domElement); 
    loop.addUpdateTable(this.pointerLockControls);
  }

  setListeners(){
    renderer.domElement.addEventListener( 'mousedown', ( event ) => {
			if(!this.pointerLockControls.isLocked) 
      {
        this.pointerLockControls.lock(true);
      }
      else{
        if(currentWeapon){
          currentWeapon.clickDown();
        }
      }
		});

    renderer.domElement.addEventListener( 'mouseup', ( event ) => {
			if(this.pointerLockControls.isLocked) 
        {
          if(currentWeapon){
            currentWeapon.clickUp();
          }
        }
		});

    renderer.domElement.addEventListener("wheel", (event) => {
      if( this.canChangeWeapon){
        this.currentWeaponIndex++;
        this.currentWeaponIndex %= this.weaponList.length;
        this.swapWeapon(this.weaponList[this.currentWeaponIndex]);
        this.canChangeWeapon = false;
        window.setTimeout( () => {
            this.canChangeWeapon = true;
        }, 300);
      }
    });
  }

  removeLoadingScreen(){
    const loading = document.getElementById("loading_screen");

    loading.remove();
  }

  setupMaterials(houseModel, darkWoodTexture, darkWoodNormalTexture, darkWoodRoughTexture, pavementColorTexture, pavementNormalTexture, pavementAoMap){
    const simpleGlassMaterial = new MeshBasicMaterial({
      color: 0xd8e4e9,
      transparent: true,
      opacity: 0.5
    });
    darkWoodTexture.repeat.set(20,20);
    darkWoodTexture.wrapS = RepeatWrapping;
    darkWoodTexture.wrapT = RepeatWrapping;
    darkWoodTexture.center.set(0.5, 0.5);

    darkWoodTexture.rotation = Math.PI / 2;

    darkWoodNormalTexture.repeat.set(20,20);
    darkWoodNormalTexture.wrapS = RepeatWrapping;
    darkWoodNormalTexture.wrapT = RepeatWrapping;

    darkWoodNormalTexture.center.set(0.5, 0.5);
    darkWoodNormalTexture.rotation = Math.PI / 2;

    houseModel.getObjectByName("Cylinder002_1").material.transparent = true;
    houseModel.getObjectByName("Cylinder002_1").material.opacity = 0.6;

    houseModel.getObjectByName("Cylinder006_1").material.transparent = true;
    houseModel.getObjectByName("Cylinder006_1").material.opacity = 0.6;

    const bathroom = houseModel.getObjectByName("Cube001");
    const bedroom = houseModel.getObjectByName("Cube003");
    const livingroom = houseModel.getObjectByName("Cube004");
    const kitchen = houseModel.getObjectByName("Cube");
    const pavement = houseModel.getObjectByName("Cube002");
    const ceiling = houseModel.getObjectByName("Cube006");
    const ceilingFan = houseModel.getObjectByName("Ceiling_fan");

    houseModel.getObjectByName("Cube005").material = simpleGlassMaterial;
    houseModel.getObjectByName("Cube007").material = simpleGlassMaterial;
    bathroom.material = bathroom.material.clone();
    bathroom.material.map = darkWoodTexture;
    bathroom.material.normalScale.set(0.2,0.2);
    //darkWoodNormalTexture.repeat.set(20,20);
    bathroom.material.normalMap = darkWoodNormalTexture;

    bathroom.material.metalness = 0.0;
    bathroom.material.roughnessMap = darkWoodRoughTexture;
    //bathroom.material.displacementMap = darkWoodDispTexture;
    //bathroom.material.displacementScale = 0.01;
    bathroom.material.roughness = 0.8;
    
    ceilingFan.tick = (delta) =>{
      ceilingFan.rotation.y -= delta * 2;
    }
    loop.addUpdateTable(ceilingFan);
    bedroom.material = bathroom.material;
    livingroom.material = bathroom.material;

    kitchen.material = bathroom.material;
    ceiling.material = bathroom.material;
    pavement.material = pavement.material.clone();

    pavementColorTexture.repeat.set(25,25);
    pavementColorTexture.wrapS = RepeatWrapping;
    pavementColorTexture.wrapT = RepeatWrapping;
    pavement.material.map = pavementColorTexture;
    //pavement.material.roughnessMap = pavementRoughTexture;
    pavement.material.normalMap = pavementNormalTexture;
    pavement.material.aoMap = pavementAoMap;
    pavement.aoMapIntensity = 0.5;
    pavement.material.metalness = 0;
    pavement.material.roughness = 1;
    pavement.material.normalScale.set(0.2,0.2);
  }

  addAxesHelper(){
    const axesHelper = new AxesHelper( 5 );
    axesHelper.position.set(0,-17,0);
    scene.add( axesHelper ) ;
  }

  addPlayer(){
    const playerStart = new Vector3(0,0,0);
    const playerEnd = new Vector3(0,15,0);
    const playerRadius = 2.5;

    const player = new Capsule(playerStart, playerEnd, playerRadius);
    player.translate(new Vector3(72,-10,16));

    return player;
  }

  swapWeapon(weaponName){
    this.arms.restoreOriginalPosition();
    this.controls.clearWeapons();
    if(currentWeapon) {
      currentWeapon.onSwap();
    }
    switch(weaponName){
      case "ZAPPER":
        this.arms.zapperPositionInit();  
        this.arms.handR.remove(this.flamethrowerModel);
        this.arms.handR.add(this.zapperModel);
        currentWeapon = this.arms;
        this.controls.addWeapon(this.zapper);
        loop.removeUpdateTableIfExists(this.flamethrower)
        loop.addUpdateTable(this.arms);
        this.arms.updateCurrentWeapon("ZAPPER");
        break;

      case "FLAMETHROWER":
        this.arms.flamethrowerPositionInit();
        this.arms.handR.remove(this.zapperModel);
        this.arms.handR.add(this.flamethrowerModel);
        currentWeapon = this.flamethrower;
        this.controls.addWeapon(this.flamethrower);
        loop.removeUpdateTableIfExists(this.arms)
        loop.addUpdateTable(this.flamethrower);
        this.arms.updateCurrentWeapon("FLAMETHROWER");
        break;

      default:
        console.log("UNDEFINED WEAPON");
        console.log(weaponName);
      }

  }
}

export { World };