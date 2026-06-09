import * as CANNON from 'https://unpkg.com/cannon-es@0.20.0/dist/cannon-es.js';
import { GLTFLoader } from "https://esm.sh/three@0.184.0/examples/jsm/loaders/GLTFLoader.js";

const MASS = 70;

class MainCharacter {

    constructor(cannonWorld, MainCharacterModel){
        const shape = new CANNON.Box(new CANNON.Vec3(0.3,1.7,0.3));
        this.cannonBody = new CANNON.Body({
            mass: MASS,
        });

        this.cannonBody.addShape(shape);
        
        cannonWorld.addBody(this.cannonBody);
        this.cannonBody.position.set(0, -0.15, -0.25);
        this.MainCharacterModel = MainCharacterModel;
    }

    update(){
        this.MainCharacterModel.position.copy(this.cannonBody.position);
        this.MainCharacterModel.quaternion.copy(this.cannonBody.quaternion);
    }

}

export { MainCharacter }