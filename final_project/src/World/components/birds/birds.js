import { GLTFLoader } from "https://esm.sh/three@0.184.0/examples/jsm/loaders/GLTFLoader.js";
import { setupModel } from './setupModel.js';

async function loadBirds(){
    const loader = new GLTFLoader();

    const [storkData, parrotData, flamingoData] = await Promise.all([
        loader.loadAsync("./assets/models/Stork.glb"),
        loader.loadAsync("./assets/models/Parrot.glb"),
        loader.loadAsync("./assets/models/Flamingo.glb"),
    ]);

    console.log("stork", storkData);

    const stork = setupModel(storkData);
    const parrot = setupModel(parrotData);
    const flamingo = setupModel(flamingoData);

    return {
        stork,
        parrot,
        flamingo
    };
}

export {loadBirds};