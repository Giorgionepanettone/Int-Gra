// in order to implement this i looked at threejs examples on fps game. https://github.com/mrdoob/three.js/blob/master/examples/games_fps.html

import { Vector3 } from 'https://esm.sh/three@0.184.0';

const JUMP_FORCE = 40; 
const PLAYER_MAX_VELOCITY = 40;
const GRAVITY = -200.1;
const max_velocity = new Vector3(PLAYER_MAX_VELOCITY, PLAYER_MAX_VELOCITY/3, PLAYER_MAX_VELOCITY);
const min_velocity = new Vector3(-PLAYER_MAX_VELOCITY, -PLAYER_MAX_VELOCITY/3, -PLAYER_MAX_VELOCITY);
const MOVEMENT_ACCELERATION = 100;

class fpsControls {

    constructor(player, camera, octree){
        
        this.player = player;
        this.camera = camera;
        this.octree = octree;
        this.playerOnFloor = false;
        this.actors = [];
        this.state = {
            KeyW : false,
            KeyA : false,
            KeyS : false,
            KeyD : false,
            Space : false
        }

        this.playerVelocity = new Vector3(0.0, 0.0, 0.0);

        document.addEventListener( 'keydown', ( event ) => {
			this.state[event.code] = true;
		});

        document.addEventListener( 'keyup', ( event ) => {
            this.state[event.code] = false;
        });

    }

    addActor(actor){
        this.actors.push(actor);
    }

    removeActor(actor){
        this.actors.splice(0,1,actor);
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
            this.playerVelocity.y += delta * GRAVITY;
        }

        //const damping = Math.exp( - 4 * delta ) - 1;

        if (!(this.state.KeyA || this.state.KeyD)){
            //this.playerVelocity.x = (Math.abs(this.playerVelocity.x) - damping) * Math.sign(this.playerVelocity.x);
            if(Math.abs(this.playerVelocity.x) < 0.1){
                this.playerVelocity.x = 0;
            }
            else {
                this.playerVelocity.x -= this.playerVelocity.x * delta * 10;
            }
        }

        if (!(this.state.KeyW || this.state.KeyS)){
            //this.playerVelocity.z = (Math.abs(this.playerVelocity.z) - damping) * Math.sign(this.playerVelocity.z);
            if(Math.abs(this.playerVelocity.z) < 0.1){
                this.playerVelocity.z = 0;
            }
            else {
                this.playerVelocity.z -= this.playerVelocity.z * delta * 10;
            }
            }

        this.playerVelocity.clamp(min_velocity, max_velocity);
    }

    updatePlayer(delta) {
        //const damping = Math.exp( - 4 * delta ) - 1;

        //this.playerVelocity.addScaledVector(this.playerVelocity, damping);
        this.updatePlayerPosition(delta);
    }

    updatePlayerPosition(delta){
        const forward = new Vector3();
        this.camera.getWorldDirection(forward);
        forward.y = 0; 
        forward.normalize();

        const right = new Vector3().crossVectors(this.camera.up, forward).normalize();

        const moveX = right.multiplyScalar(-this.playerVelocity.x * delta);
        const moveZ = forward.multiplyScalar(-this.playerVelocity.z * delta);

        this.player.translate(moveX);
        this.player.translate(moveZ);

        this.player.translate(new Vector3(0, this.playerVelocity.y * delta, 0));
    }

    handleCollision(delta) {
        
        const result = this.octree.capsuleIntersect( this.player );

        if (result){
            //console.log(result);
            this.playerOnFloor = result.normal.y > 0.98
            this.player.translate( result.normal.multiplyScalar( result.depth ) );
            /* if ( ! this.playerOnFloor ) {
                this.playerVelocity.addScaledVector( result.normal, - result.normal.dot( this.playerVelocity ) );
            }

            if ( result.depth >= 1e-10 ) {
                this.player.translate( result.normal.multiplyScalar( result.depth ) );
            } */

        }

        for (const actor of this.actors){
            actor.model.geometry.boundingBox.setFromObject(actor.model, true);
            const result = this.octree.boxIntersect( actor.model.geometry.boundingBox );
            //console.log(actor.geometry.boundingBox);
            if (result){
                //console.log(result);
                actor.model.position.addScaledVector(result.normal, result.depth);
                actor.forceDirectionChange(result.normal);
                //console.log(actor.position);
                //translateOnAxis( -result.normal , result.normal.multiplyScalar( result.depth ) );
            }
        }
        
    }

    updateCamera() {
        this.camera.position.copy(this.player.end);
    }

    update(delta) {
		
        this.updatePlayerVelocity(delta);

        this.updatePlayer(delta);

        this.handleCollision(delta);

        this.updateCamera();
    }
}

export {fpsControls}