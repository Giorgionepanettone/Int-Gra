import * as CANNON from 'https://unpkg.com/cannon-es@0.20.0/dist/cannon-es.js';
import { GLTFLoader } from "https://esm.sh/three@0.184.0/examples/jsm/loaders/GLTFLoader.js";

const MASS = 70;

class MainCharacter {

    constructor(cannonWorld){
        const shape = new CANNON.Box(new CANNON.Vec3(0.3,1.7,0.3));
        this.cannonBody = new CANNON.Body({
            mass: MASS,
        });

        this.cannonBody.addShape(shape);
        
        cannonWorld.addBody(this.cannonBody);
    }

    update(){
        this.threeModel.position.copy(this.cannonBody.position);
        this.threeModel.quaternion.copy(this.cannonBody.quaternion);
    }

    async init(threeScene, threeCamera){
        const loader = new GLTFLoader();

        const modelData = await loader.loadAsync("./assets/models/fps_arms/rigged_low_poly_fps_hands.glb");

        this.threeModel = modelData.scene;
        this.threeModel.rotation.y = Math.PI;
        this.threeModel.position.set(0, -0.15, -0.25);

        threeScene.add(threeCamera);
        threeCamera.add(this.threeModel);
    }
}

export { MainCharacter }