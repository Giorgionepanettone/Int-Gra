import * as CANNON from 'https://unpkg.com/cannon-es@0.20.0/dist/cannon-es.js';

const GRAVITY = -9.81;

class CannonWorld {
    constructor() {
        this.cannonWorld = new CANNON.World({
        gravity : new CANNON.Vec3(0, GRAVITY, 0),
        });
    }

    makeFixedStep(){
        this.cannonWorld.fixedStep();
    }

    addBody(body){
        this.cannonWorld.addBody(body);
    }

    addBodies(bodies){
        for (const body of bodies){
            this.cannonWorld.addBody();
        }
    }

    removeBody(body){
        this.cannonWorld.removeBody(body);
    }

    removeBodies(bodies){
        for (const body of bodies){
            this.cannonWorld.removeBody();
        }
    }

    getBodies(){
        return this.cannonWorld.bodies;
    }
}

export{ CannonWorld}