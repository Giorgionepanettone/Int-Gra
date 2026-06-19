import { Vector3 } from 'three';
import { Fire } from '../systems/fire.js';

const SPAWN_RATE = 1000;
const MAX_PARTICLES = 4000;
const DISTANCE_THRESHOLD = 40;
const ANGLE_THRESHOLD = 0.99;

class Flamethrower {
    constructor(flamethrowerModel, fireTexture, scene, flamethrowerAudio){
        this.model = flamethrowerModel;
        this.fire = new Fire(fireTexture, new Vector3(0,0,0), scene, new Vector3(1,0,0), MAX_PARTICLES, 0);
        
        this.fireStart = this.model.getObjectByName("fireStart"); //where the fire should shoot from. Added this in blender. Sounded nice but it did not work and I had to add a displacement vector anyway

        this.currentPosition = new Vector3();
        this.currentDirection = new Vector3();

        const displacementVector = new Vector3(0,-0.35,0.4);

        this.fireStart.position.add(displacementVector);
        this.shooting = false;
        this.weaponName = "FLAMETHROWER";
        this.fireStartToFly = new Vector3();
        this.flamethrowerAudio = flamethrowerAudio;
    }

    clickDown(){
        this.fire.setParticlesSpawnRate(SPAWN_RATE);
        this.shooting = true;
        this.flamethrowerAudio.play();
    }

    clickUp(){
        this.fire.setParticlesSpawnRate(0);
        this.shooting = false;
        this.flamethrowerAudio.stop();
    }

    onSwap(){
        this.clickUp();
    }

    intersectsSphere(sphere){
        if(!this.shooting){
            return false;
        }

        const distance = this.currentPosition.distanceTo(sphere.center);
        if (distance > DISTANCE_THRESHOLD){
            return false;
        }

        this.fireStartToFly.subVectors(sphere.center, this.currentPosition);
        const cos = this.currentDirection.dot(this.fireStartToFly.normalize());

        if (cos < ANGLE_THRESHOLD){
            return false;
        }

        return true;
    }

    playSound

    tick(delta){
        

        this.model.getWorldDirection(this.currentDirection);
        this.fire.setDirection(this.currentDirection);
        
        this.fireStart.getWorldPosition(this.currentPosition);
        this.fire.setStartingPosition(this.currentPosition);
       
    
        this.fire.tick(delta);
    }

    updateHitbox(){

    }
}

export {Flamethrower}