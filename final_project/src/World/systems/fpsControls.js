// in order to implement this i looked at threejs examples on fps game. https://github.com/mrdoob/three.js/blob/master/examples/games_fps.html

import { Vector3 } from 'three';

const params = {
    GRAVITY : -200.0,
};

const MOVEMENT_ACCELERATION = 200;

const ZERO_VECTOR = new Vector3(0,0,0);

const JUMP_FORCE = 40; 

const PLAYER_MAX_VELOCITY = 80;

const MAX_VELOCITY = new Vector3(PLAYER_MAX_VELOCITY, Math.max(JUMP_FORCE, PLAYER_MAX_VELOCITY/3), PLAYER_MAX_VELOCITY);
const MIN_VELOCITY = new Vector3(-PLAYER_MAX_VELOCITY, -PLAYER_MAX_VELOCITY/3, -PLAYER_MAX_VELOCITY);


class fpsControls {

    constructor(player, camera, octree, gui){
        
        this.player = player;
        this.camera = camera;
        this.octree = octree;
        this.playerOnFloor = false;
        this.actors = [];
        this.weapons = [];
        this.state = {
            KeyW : false,
            KeyA : false,
            KeyS : false,
            KeyD : false,
            Space : false
        }
        this.forward = new Vector3();
        this.right = new Vector3();
        this.up = new Vector3();

        this.playerVelocity = new Vector3(0.0, 0.0, 0.0);

        document.addEventListener( 'keydown', ( event ) => {
			this.state[event.code] = true;
		});

        document.addEventListener( 'keyup', ( event ) => {
            this.state[event.code] = false;
        });

        const folder = gui.addFolder("Player movement");
        folder.add(params, "GRAVITY", -1000, -100);
    }

    addActor(actor){
        this.actors.push(actor);
    }

    removeActor(actor){
        const index = this.actors.indexOf(actor);
        if (index > -1) { 
            this.actors.splice(index, 1);
        }
    }

    addWeapon(weapon){
        this.weapons.push(weapon);

        if(this.weapons.length == 2){
            console.log("careful adding too many weapons may impact performance severely");
        }
    }

    removeWeapon(weapon){
        const index = this.weapons.indexOf(weapon);
        if (index > -1) { 
            this.weapons.splice(index, 1);
        }
    }

    clearWeapons(){
        while (this.weapons.length > 0) {
            this.weapons.pop();
        }
    }


    tick(delta){
        this.update(delta);
    }

    updatePlayerVelocity(delta){        
        if (this.state.KeyA){
            this.playerVelocity.x -= delta * MOVEMENT_ACCELERATION;
        }

        if (this.state.KeyS){
            this.playerVelocity.z += delta * MOVEMENT_ACCELERATION;
        }

        if (this.state.KeyD){
            this.playerVelocity.x += delta * MOVEMENT_ACCELERATION;
        }

        if (this.state.KeyW){
            this.playerVelocity.z -= delta * MOVEMENT_ACCELERATION;
        }

        if (this.state.Space && this.playerOnFloor){
            this.playerVelocity.y = JUMP_FORCE;
            this.playerOnFloor = false;
        }

        if (!this.playerOnFloor){
            this.playerVelocity.y += delta * params.GRAVITY;
        }


        if (!(this.state.KeyA || this.state.KeyD)){
            if(Math.abs(this.playerVelocity.x) < 0.1){
                this.playerVelocity.x = 0;
            }
            else {
                this.playerVelocity.x -= this.playerVelocity.x * delta * 10;
            }
        }

        if (!(this.state.KeyW || this.state.KeyS)){
            if(Math.abs(this.playerVelocity.z) < 0.1){
                this.playerVelocity.z = 0;
            }
            else {
                this.playerVelocity.z -= this.playerVelocity.z * delta * 10;
            }
            }

        this.playerVelocity.clamp(MIN_VELOCITY, MAX_VELOCITY);
    }

    updatePlayer(delta) {
        this.updatePlayerPosition(delta);
    }

    updatePlayerPosition(delta){
        this.camera.getWorldDirection(this.forward);
        this.forward.y = 0; 
        this.forward.normalize();

        this.right.crossVectors(this.camera.up, this.forward).normalize();

        this.right.multiplyScalar(-this.playerVelocity.x * delta);
        this.forward.multiplyScalar(-this.playerVelocity.z * delta);
        this.up.set(0, this.playerVelocity.y * delta, 0);

        this.player.translate(this.right);
        this.player.translate(this.forward);
        this.player.translate(this.up);
    }

    handleCollision() {
        
        let result = this.octree.capsuleIntersect( this.player );

        if (result){
            this.playerOnFloor = result.normal.y > 0.98
            for(let i = 0; i < 3; i++){
                this.player.translate( result.normal.multiplyScalar( result.depth ) );
                result = this.octree.capsuleIntersect(this.player);
                if(!result) break;
            }
        }

        for (const actor of this.actors){
            const result = this.octree.sphereIntersect(actor.hitboxSphere);
            if (result && !result.normal.equals(ZERO_VECTOR)){
                actor.model.position.addScaledVector(result.normal, result.depth);
                actor.handleCollision(result.normal);
            }
            for (const weapon of this.weapons){
                weapon.updateHitbox();
                const actorHit = weapon.intersectsSphere(actor.hitboxSphere);
                if(actorHit){
                    actor.handleHit(weapon.weaponName);
                }
            }
        }
        
    }

    updateCamera() {
        this.camera.position.copy(this.player.end);
    }

    update(delta) {
        this.updatePlayerVelocity(delta);

        this.updatePlayer(delta);

        this.handleCollision();

        this.updateCamera();
    }
}

export {fpsControls}