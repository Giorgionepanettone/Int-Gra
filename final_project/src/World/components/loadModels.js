import { GLTFLoader } from "https://esm.sh/three@0.184.0/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "https://esm.sh/three@0.184.0/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from 'https://esm.sh/three@0.184.0/examples/jsm/loaders/MTLLoader.js';
import { Group } from 'https://esm.sh/three@0.184.0'

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

async function loadModels(){
    const gltfLoader = new GLTFLoader();   
    
    const [houseData, flyData] = await Promise.all([
        gltfLoader.loadAsync("./assets/models/house.glb"),
        gltfLoader.loadAsync("./assets/models/fly_v2/new_new_fly.glb"),
    ]);

    //const houseData = await gltfLoader.loadAsync("./assets/models/house.glb");
    const houseModel = setupModel(houseData);
    const flyModel = setupFlyModel(flyData);
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
        flyModel
    };
}

export {loadModels}