import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { FBXLoader } from "three/addons/loaders/FBXLoader.js"
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';
import { Group, MathUtils, AudioLoader, TextureLoader } from 'three';

function setupModel(modelData){
    return modelData.scene;
}

function setupFlyModel(flyModel) {
    const rootNode = flyModel.scene.children[0].children[0].children[0];

    const face = rootNode.children[0].children[0];
    face.name = "face";
    const body = rootNode.children[1].children[0];
    body.name = "body";
    const rightWing = rootNode.children[2].children[0];
    rightWing.name = "rightWing";
    const leftWing = rootNode.children[2].children[1];
    leftWing.name = "leftWing";
    const eyes = rootNode.children[3].children[0];
    eyes.name = "eyes";
    const frontLegs = rootNode.children[4].children[0];
    frontLegs.name = "frontLegs";
    const middleLegs = rootNode.children[5].children[0];
    middleLegs.name = "middleLegs";
    const backLegs = rootNode.children[6].children[0];
    backLegs.name = "backlegs";
    const nose = rootNode.children[7].children[0];
    nose.name = "nose";
    
    const legs = new Group();
    legs.attach(backLegs);
    legs.attach(middleLegs);
    legs.attach(frontLegs);

    body.attach(face);
    body.attach(rightWing);
    body.attach(leftWing);
    body.attach(nose);
    body.attach(legs);
    body.attach(eyes);


    body.scale.multiplyScalar(0.1);

    return body;
}

function setupZapperModel(zapperModel){
    const rootNode = zapperModel.scene.children[0].children[0].children[0];


    const grid = rootNode.children[0].children[0];
    grid.name = "grid";

    const gridMiddle = rootNode.children[0].children[1];
    gridMiddle.name = "gridMiddle";

    const racket = rootNode.children[0].children[2];
    racket.name = "racket";
    
    racket.attach(grid);
    racket.attach(gridMiddle);

    racket.position.set(-0.025,0.09,0.3);

    racket.scale.multiplyScalar(1.6);
    racket.rotation.set(MathUtils.degToRad(0),MathUtils.degToRad(0),MathUtils.degToRad(60));

    return racket;
}

function setupArmsModel(armsModel){
    armsModel =  armsModel.scene;
    armsModel.scale.multiplyScalar(18);

    return armsModel;
}

function setupFlamethrowerModel(flamethrowerData){
    const flamethrowerModel = flamethrowerData.scene;
    flamethrowerModel.rotateX(MathUtils.degToRad(90));
    flamethrowerModel.rotateY(MathUtils.degToRad(165));
    flamethrowerModel.position.set(0.05,0.4,-0.05);

    return flamethrowerModel;
}

async function loadAssets(){
    const gltfLoader = new GLTFLoader();   
    const audioLoader = new AudioLoader();
    const textureLoader = new TextureLoader();
    const fbxLoader = new FBXLoader();
    const exrLoader = new EXRLoader();

    const [houseData, flyData, zapperData, armsData, zapSoundSharedBuffer, burnSoundSharedBuffer, flamethrowerSound, lightningTexture, fireTexture, darkWoodTexture, darkWoodNormalTexture, darkWoodRoughTexture,darkWoodDispTexture, pavementColorTexture, pavementNormalTexture, pavementRoughTexture, pavementAoMap, flamethrowerData, backgroundTexture] = await Promise.all([
        gltfLoader.loadAsync("./assets/models/house.glb"),
        gltfLoader.loadAsync("./assets/models/fly_v2/new_new_fly.glb"),
        //gltfLoader.loadAsync("./assets/models/mosquito_racket/mosquito_racket.glb"),
        gltfLoader.loadAsync("./assets/models/bug_zapper/new_racket.glb"),
        //gltfLoader.loadAsync("./assets/models/low-poly_fps_arms_rigged/scene.gltf"),
        //fbxLoader.loadAsync("./assets/models/low-poly-fps-arms-rigged/source/FPSARmsRIG.fbx"),
        //gltfLoader.loadAsync("./assets/models/fps_arms_naked/rigged_arms.glb"),
        gltfLoader.loadAsync("./assets/models/psx-first-person-arms-free-game-assets/arms_rig.glb"),
        audioLoader.loadAsync('./assets/sounds/512471__michael_grinnell__electric-zap.wav'),
        audioLoader.loadAsync('./assets/sounds/floraphonic-fireball-whoosh-2-179126.mp3'),
        audioLoader.loadAsync('./assets/sounds/freesound_community-gas-torch-burn-74271.mp3'),
        textureLoader.loadAsync('./assets/textures/lightning/vecteezy_a-minimal-blue-lightning-thunder_51015894.png'),
        textureLoader.loadAsync('./assets/textures/fire/vecteezy_fire-explode-png-design_9374891.png'),
        textureLoader.loadAsync('./assets/textures/wood/wood_cabinet_worn_long_1k.blend/textures/wood_cabinet_worn_long_diff_1k.jpg'),
        //textureLoader.loadAsync('./assets/textures/wood/normal/oleg-maminov-wood-normal.jpg')
        exrLoader.loadAsync('./assets/textures/wood/wood_cabinet_worn_long_1k.blend/textures/wood_cabinet_worn_long_nor_gl_1k.exr'),
        exrLoader.loadAsync('./assets/textures/wood/wood_cabinet_worn_long_1k.blend/textures/wood_cabinet_worn_long_rough_1k.exr'),
        textureLoader.loadAsync('./assets/textures/wood/wood_cabinet_worn_long_1k.blend/textures/wood_cabinet_worn_long_disp_1k.png'),
        textureLoader.loadAsync('./assets/textures/wood/pavement/plank_flooring_03_diff_1k.jpg'),
        exrLoader.loadAsync('./assets/textures/wood/pavement/plank_flooring_03_nor_gl_1k.exr'),
        exrLoader.loadAsync('./assets/textures/wood/pavement/plank_flooring_03_rough_1k.exr'),
        textureLoader.loadAsync('./assets/textures/wood/pavement/plank_flooring_03_ao_1k.jpg'),
        gltfLoader.loadAsync("./assets/models/flamethrower-v2.glb"),
        textureLoader.loadAsync('./assets/textures/background/montreal-sunrise-panorama.jpg'),
    ]);

    
    const houseModel = setupModel(houseData);
    const flyModel = setupFlyModel(flyData);
    const zapperModel = setupZapperModel(zapperData);
    const armsModel = setupArmsModel(armsData);
    const flamethrowerModel = setupFlamethrowerModel(flamethrowerData);

    return {
        houseModel,
        flyModel,
        zapperModel,
        armsModel,
        zapSoundSharedBuffer,
        burnSoundSharedBuffer,
        flamethrowerSound,
        lightningTexture,
        fireTexture,
        darkWoodTexture,
        darkWoodNormalTexture,
        darkWoodRoughTexture,
        darkWoodDispTexture,
        pavementColorTexture,
        pavementNormalTexture,
        pavementRoughTexture,
        pavementAoMap,
        flamethrowerModel,
        backgroundTexture
    };
}

export {loadAssets}