import { GLTFLoader } from "https://esm.sh/three@0.184.0/examples/jsm/loaders/GLTFLoader.js";

function setupModel(modelData){
    return modelData.scene;
}

async function loadModels(){
    const loader = new GLTFLoader();   
    
    const [mapData, astronautData] = await Promise.all([
        loader.loadAsync("./assets/models/map/scene_out.gltf"),
        loader.loadAsync("./assets/models/astronaut/astronauta.glb"),
    ]);

    const map = setupModel(mapData);
    const astronaut = setupModel(astronautData)

    return {
        map,
        astronaut,
    }
}

export {loadModels}