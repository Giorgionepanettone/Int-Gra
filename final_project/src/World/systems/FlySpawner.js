import { Fly } from "../components/fly.js";
import { Vector3 } from "three";
import { getRandomInInterval } from "../components/randomUtils.js";

const NUMBER_OF_FLIES = 500;
const SPAWN_RATE = 20;

const KITCHEN = new Vector3(21,0,10);
const BATHROOM = new Vector3(38,0,-113);
const BEDROOM = new Vector3(149,0,-136);
const LIVINGROOM = new Vector3(120, 0, -22);


class FlySpawner {
    constructor(scene, player, flyModel, loop, listener, zapSoundSharedBuffer, burnSoundSharedBuffer, lightningTexture, controls){
        this.scene = scene;
        this.player = player;
        this.flyModel = flyModel;
        this.loop = loop;
        this.listener = listener;
        this.zapSoundSharedBuffer = zapSoundSharedBuffer;
        this.burnSoundSharedBuffer = burnSoundSharedBuffer;
        this.lightningTexture = lightningTexture;
        this.controls = controls;
        this.aliveCount = 0;
        this.spawnableRooms = [];
    }

    tick(delta){
        if(this.aliveCount == NUMBER_OF_FLIES){
            return;
        }
        this.decideSpawnPosition();
        var spawned = 0;
        while (this.aliveCount < NUMBER_OF_FLIES && spawned < SPAWN_RATE){
            const choice = Math.floor(Math.random() * 3);
            const newModel = this.flyModel.clone();
            newModel.position.copy(this.spawnableRooms[choice]);
            new Fly(newModel, this.controls, this.loop, this.scene, this.listener, this.zapSoundSharedBuffer, this.burnSoundSharedBuffer, this.lightningTexture, this);
            this.aliveCount++;
            spawned++;
        }
    }

    decideSpawnPosition(){
        
        const playerStart = this.player.start;
        const distances = [];
        this.spawnableRooms = [];
        this.spawnableRooms.push(BATHROOM, KITCHEN, BEDROOM, LIVINGROOM);
        distances.push([playerStart.distanceTo(BATHROOM), BATHROOM]);        
        distances.push([playerStart.distanceTo(BEDROOM), BEDROOM]);
        distances.push([playerStart.distanceTo(KITCHEN), KITCHEN]);
        distances.push([playerStart.distanceTo(LIVINGROOM), LIVINGROOM]);
        
        distances.sort((a,b) => a[0] - b[0]);
        const index = this.spawnableRooms.indexOf(distances[0][1]);
        this.spawnableRooms.splice(index, 1);
    }

    decreaseAliveCount(){
        this.aliveCount--;
        if(this.aliveCount < 0){
            console.log("FATAL ERROR FLYSPAWNER ALIVE COUNT IS NEGATIVE");
        }
    }
}

export { FlySpawner }