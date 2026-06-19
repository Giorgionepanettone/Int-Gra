import { Particles } from "./particles.js"
import { getRandomInInterval } from "../components/randomUtils.js";
import { Vector3 } from 'three'

class Fire {

    constructor(fireTexture, fireStartingPosition, scene, fireDirection, particlesNumber, spawnRate){
        this.startingPosition = fireStartingPosition.clone();
        this.fireDirection = fireDirection.clone();

        this.particles = new Particles(fireTexture, particlesNumber, spawnRate, this.getAttributes.bind(this));
        scene.add(this.particles.points);
    }

    setParticlesSpawnRate(spawnRate){
        this.particles.setSpawnrate(spawnRate);
    }

    setDirection(newDirection){
        this.fireDirection.copy(newDirection);
    }

    setStartingPosition(startingPosition){
        this.startingPosition.copy(startingPosition);
    }

    getAttributes(){
        const life = getRandomInInterval(0.5, 1.5); 

        const spawnRadius = 0.2;
        const initPos = this.startingPosition.clone().add(new Vector3(
            getRandomInInterval(-spawnRadius, spawnRadius),
            getRandomInInterval(-spawnRadius, spawnRadius),
            getRandomInInterval(-spawnRadius, spawnRadius)
        ));

        const initRot = getRandomInInterval(0, 2 * Math.PI);
        const spread = 0.15
        const randomSpread = new Vector3(
            getRandomInInterval(-spread, spread),            
            getRandomInInterval(-spread, spread),
            getRandomInInterval(-spread, spread)
        );

        const initialSpeed = getRandomInInterval(15,25);
        const initVel = this.fireDirection.clone().add(randomSpread).normalize().multiplyScalar(initialSpeed);

        const initSize = getRandomInInterval(1, 3)

        const rotVel = getRandomInInterval(-0.5, 0.5);

        const sizeVel = getRandomInInterval(1, 2.5);

        const acc = new Vector3(0, getRandomInInterval(0,2), 0);
        
        return {
                life,
                initPos,
                initRot,
                initVel,
                initSize,
                rotVel,
                sizeVel,
                acc
            };
    }

    tick(delta){
        this.particles.tick(delta);
    }

}

export { Fire }