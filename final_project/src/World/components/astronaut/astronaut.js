import { GLTFLoader } from "https://esm.sh/three@0.184.0/examples/jsm/loaders/GLTFLoader.js";

async function loadAstronaut(){
    const loader = new GLTFLoader();

    const astronautData = await loader.loadAsync("./assets/models/astronaut/astronaut.glb");

    //const map = setupModel(mapData);
    console.log(mapData);
    
    const astronaut = astronautData.scene;
    return astronaut;
}

export {loadAstronaut};