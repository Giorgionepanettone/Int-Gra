import { GLTFLoader } from "https://esm.sh/three@0.184.0/examples/jsm/loaders/GLTFLoader.js";
//import { setupModel } from './setupModel.js';

async function loadMap(){
    const loader = new GLTFLoader();

    const mapData = await loader.loadAsync("./assets/models/map/scene_out.gltf");

    //const map = setupModel(mapData);
    //console.log(mapData);
    const map = mapData.scene;
    return map;
}

export {loadMap};