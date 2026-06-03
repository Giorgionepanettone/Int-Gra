import { GLTFLoader } from "https://esm.sh/three@0.184.0/examples/jsm/loaders/GLTFLoader.js";

function setupModel(modelData){
    return modelData.scene.children[0];
}

async function loadModels(){
    const loader = new GLTFLoader();   
    
    /*const [mapData] = await Promise.all([
        loader.loadAsync("./assets/models/map/scene_out.gltf"),
    ]);
    */
    const mapData = await loader.loadAsync("./assets/models/map/scene_out.gltf");

    const map = setupModel(mapData);

    return {
        map
    }
}

export {loadModels}