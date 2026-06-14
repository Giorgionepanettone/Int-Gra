import { GLTFLoader } from "https://esm.sh/three@0.184.0/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "https://esm.sh/three@0.184.0/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from 'https://esm.sh/three@0.184.0/examples/jsm/loaders/MTLLoader.js';
import { FBXLoader } from "https://esm.sh/three@0.184.0/examples/jsm/loaders/FBXLoader.js"
import { Group, MathUtils, AudioLoader, TextureLoader } from 'https://esm.sh/three@0.184.0';

function setupModel(modelData){
    return modelData.scene;
}

function setupFlyModel(flyModel) {
    const rootNode = flyModel.scene.children[0].children[0].children[0];
    //console.log(flyModel);
    //console.log(rootNode);
    //console.log(rootNode);

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

    //console.log(body);
    body.scale.multiplyScalar(0.1);
    //body.geometry.computeBoundingBox();
    return body;
}

function setupZapperModel(zapperModel){
    const rootNode = zapperModel.scene.children[0].children[0].children[0];
    //console.log(rootNode);

    const grid = rootNode.children[0].children[0];
    grid.name = "grid";

    const gridMiddle = rootNode.children[0].children[1];
    gridMiddle.name = "gridMiddle";

    const racket = rootNode.children[0].children[2];
    racket.name = "racket";
    
    racket.attach(grid);
    racket.attach(gridMiddle);

    //racket.position.set(3,0,-22);
    //racket.position.set(3,0-70);
    //racket.position.set(-0.022,0.09,0.2);
    racket.position.set(-0.025,0.09,0.3);
    //racket.position.set(0.1,0.77,0.1);
    
    racket.scale.multiplyScalar(1.6);
    racket.rotation.set(MathUtils.degToRad(0),MathUtils.degToRad(0),MathUtils.degToRad(60));
    //racket.rotation.set(MathUtils.degToRad(-90),MathUtils.degToRad(0),MathUtils.degToRad(0));


    return racket;
}

function setupArmsModel(armsModel){
    armsModel =  armsModel.scene;

    
    //return armsModel;
    //const model = armsModel.scene;
    ///console.log(model);
    armsModel.scale.multiplyScalar(18);
    //armsModel.position.set(0,-30,-30);
    return armsModel;
    //armsModel.rotateY(Math.PI);
    //armsModel.rotateX(-Math.PI/3);
    

}

async function loadAssets(){
    const gltfLoader = new GLTFLoader();   
    const audioLoader = new AudioLoader();
    const textureLoader = new TextureLoader();
    const fbxLoader = new FBXLoader();

    //let sharedBuffer = null;
    const [houseData, flyData, zapperData, armsData, zapSoundSharedBuffer, lightningTexture] = await Promise.all([
        gltfLoader.loadAsync("./assets/models/house.glb"),
        gltfLoader.loadAsync("./assets/models/fly_v2/new_new_fly.glb"),
        //gltfLoader.loadAsync("./assets/models/mosquito_racket/mosquito_racket.glb"),
        gltfLoader.loadAsync("./assets/models/bug_zapper/new_racket.glb"),
        //gltfLoader.loadAsync("./assets/models/low-poly_fps_arms_rigged/scene.gltf"),
        //fbxLoader.loadAsync("./assets/models/low-poly-fps-arms-rigged/source/FPSARmsRIG.fbx"),
        //gltfLoader.loadAsync("./assets/models/fps_arms_naked/rigged_arms.glb"),
        gltfLoader.loadAsync("./assets/models/psx-first-person-arms-free-game-assets/arms_rig.glb"),
        audioLoader.loadAsync('./assets/sounds/512471__michael_grinnell__electric-zap.wav'),
        textureLoader.loadAsync('./assets/textures/vecteezy_a-minimal-blue-lightning-thunder_51015894.png')
    ]);

    
    //const houseData = await gltfLoader.loadAsync("./assets/models/house.glb");
    const houseModel = setupModel(houseData);
    const flyModel = setupFlyModel(flyData);
    const zapperModel = setupZapperModel(zapperData);
    const armsModel = setupArmsModel(armsData);
    //console.log(houseModel);
/*     const mtlLoader = new MTLLoader();

    const mtl = await mtlLoader.loadAsync('./assets/models/20-livingroom_obj/InteriorTest.mtl');
    console.log(mtl);
    mtl.preload();

    const objLoader = new OBJLoader();

    objLoader.setMaterials(mtl);

    const roomModel = await objLoader.loadAsync("./assets/models/20-livingroom_obj/InteriorTest.obj"); */

    return {
        houseModel,
        flyModel,
        zapperModel,
        armsModel,
        zapSoundSharedBuffer,
        lightningTexture
    };
}

export {loadAssets}