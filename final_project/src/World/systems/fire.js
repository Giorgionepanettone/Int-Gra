import { Particles } from "./particles.js"
import { getRandomInInterval } from "../components/randomUtils.js";
import { Vector3 } from 'three'

const params = {
    SPAWN_RADIUS : 0.1,
    SPREAD : 0.1,
    INITIAL_SPEED_MIN : 15,
    INITIAL_SPEED_MAX : 25,
    LIFE_MIN : 0.5,
    LIFE_MAX : 1.5,
    INITIAL_SIZE_MIN : 1,
    INITIAL_SIZE_MAX : 3,
    ROTATIONAL_VELOCITY_MIN : -0.5,
    ROTATIONAL_VELOCITY_MAX : 0.5,
    SIZE_VELOCITY_MIN : 1,
    SIZE_VELOCITY_MAX : 2.5,
    VERTICAL_ACCELERATION_MIN : 0,
    VERTICAL_ACCELERATION_MAX : 2,
}

class Fire {

    constructor(fireTexture, fireStartingPosition, scene, fireDirection, particlesNumber, spawnRate, gui){
        this.startingPosition = fireStartingPosition.clone();
        this.fireDirection = fireDirection.clone();

        this.particles = new Particles(fireTexture, particlesNumber, spawnRate, this.getAttributes.bind(this));
        scene.add(this.particles.points);

        const folder = gui.addFolder("Fire");
        folder.add(params, "SPAWN_RADIUS", 0.01, 10);
        folder.add(params, "SPREAD", 0.01, 10);
        folder.add(params, "INITIAL_SPEED_MIN", 1, 100);
        folder.add(params, "INITIAL_SPEED_MAX", 1, 100);
        folder.add(params, "LIFE_MIN", 0.05, 30);
        folder.add(params, "LIFE_MAX", 0.05, 30);
        folder.add(params, "INITIAL_SIZE_MIN", 0.1, 10);
        folder.add(params, "INITIAL_SIZE_MAX", 0.1, 10);
        folder.add(params, "ROTATIONAL_VELOCITY_MIN", -10,10);
        folder.add(params, "ROTATIONAL_VELOCITY_MAX", -10,10);
        folder.add(params, "SIZE_VELOCITY_MIN", -10,10);
        folder.add(params, "SIZE_VELOCITY_MAX", -10,10);
        folder.add(params, "VERTICAL_ACCELERATION_MIN", -10, 10);
        folder.add(params, "VERTICAL_ACCELERATION_MAX", -10, 10);
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
        const life = getRandomInInterval(params.LIFE_MIN, params.LIFE_MAX); 

        const initPos = this.startingPosition.clone().add(new Vector3(
            getRandomInInterval(-params.SPAWN_RADIUS, params.SPAWN_RADIUS),
            getRandomInInterval(-params.SPAWN_RADIUS, params.SPAWN_RADIUS),
            getRandomInInterval(-params.SPAWN_RADIUS, params.SPAWN_RADIUS)
        ));

        const initRot = getRandomInInterval(0, 2 * Math.PI);
        const randomSpread = new Vector3(
            getRandomInInterval(-params.SPREAD, params.SPREAD),            
            getRandomInInterval(-params.SPREAD, params.SPREAD),
            getRandomInInterval(-params.SPREAD, params.SPREAD)
        );

        const initialSpeed = getRandomInInterval(params.INITIAL_SPEED_MIN, params.INITIAL_SPEED_MAX);
        const initVel = this.fireDirection.clone().add(randomSpread).normalize().multiplyScalar(initialSpeed);

        const initSize = getRandomInInterval(params.INITIAL_SIZE_MIN, params.INITIAL_SIZE_MAX)

        const rotVel = getRandomInInterval(params.ROTATIONAL_VELOCITY_MIN, params.ROTATIONAL_VELOCITY_MAX);

        const sizeVel = getRandomInInterval(params.SIZE_VELOCITY_MIN, params.SIZE_VELOCITY_MAX);

        const acc = new Vector3(0, getRandomInInterval(params.VERTICAL_ACCELERATION_MIN,params.VERTICAL_ACCELERATION_MAX), 0);
        
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