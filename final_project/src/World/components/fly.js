import { DoubleSide, Vector3, MathUtils, Quaternion, Sphere, Mesh, MeshBasicMaterial, MeshStandardMaterial, SphereGeometry, Color, AdditiveBlending} from 'https://esm.sh/three@0.184.0';
import {Tween, Easing, Group} from 'https://unpkg.com/@tweenjs/tween.js@25.0.0/dist/tween.esm.js'
import { getRandomInInterval } from './randomUtils.js';

const ZERO_VECTOR = new Vector3(0,0,0);

const MOVEMENT_SPEED = 20;

const LEFT_WING_START_ROTATION = MathUtils.degToRad(18);
const RIGHT_WING_START_ROTATION = MathUtils.degToRad(18);

const LEFT_WING_END_ROTATION = MathUtils.degToRad(-60);
const RIGHT_WING_END_ROTATION = MathUtils.degToRad(-60);

const TWEEN_ANIMATION_DURATION = 100;

const STOP_PROBABILITY = 0.1;

const MINIMUM_DIRECTION_CHANGE_TIME = 0.5;
const MAXIMUM_DIRECTION_CHANGE_TIME = 1.5;

const KILL_ANIMATION_DURATION = 350;

const rand_vector = new Vector3();


class Fly {
    constructor(flyModel, controls, loop, scene, listener, deathAudioSharedBuffer, lightningTexture){
        this.model = flyModel;
        this.controls = controls;
        this.loop = loop;
        this.scene = scene;
        this.listener = listener;
        this.deathAudioSharedBuffer = deathAudioSharedBuffer;
        this.scene = scene;
        
        this.model.geometry.computeBoundingSphere();
        this.hitboxSphere = new Sphere(this.model.position, this.model.geometry.boundingSphere.radius/8); //this way the hitboxSphere center is always equal to model.position and I don't have to update it in collision checking
        const invisibleSphereGeometry = new SphereGeometry(this.model.geometry.boundingSphere.radius/8);
        //const invisibleSphereMaterial = new MeshStandardMaterial({color : 0x0000ff, roughness : 0});
        const invisibleSphereMaterial = new MeshBasicMaterial({
            color: 0xffffff,     
            map: lightningTexture, 
            transparent: false,
            opacity: 1,
            blending: AdditiveBlending,
            depthWrite: false,
            side: DoubleSide   
        });
        //invisibleSphereMaterial.emissive = new Color(0x0000ff);
        this.invisibleSphere = new Mesh(invisibleSphereGeometry, invisibleSphereMaterial);
        //this.model.add(this.invisibleSphere);
        
        this.directionTimer = 0;
        this.alphaTimer = 0; //needed for lerping movement
        this.stoppedTimer = 0;
        this.stopDuration = 2;
        this.alpha = 0;
        this.ignoreNextCollisions = 0;
        this.randomRotation = getRandomInInterval(0, MathUtils.degToRad(30));

        this.currentDirection = new Vector3().randomDirection();
        this.newDirection = new Vector3();
        this.oldDirection = new Vector3().copy(this.currentDirection);
        this.lookDirection = new Vector3();
        this.endQuaternion = new Quaternion();
        this.currentQuaternion = new Quaternion();
        this.directionChangeTime = getRandomInInterval(MINIMUM_DIRECTION_CHANGE_TIME, MAXIMUM_DIRECTION_CHANGE_TIME);
        this.initAnimationStuff();
        this.stopped = false;
        this.flicker = false;

        this.currentY = new Vector3();
        this.adjustQuaternion = new Quaternion();
        this.controls.addActor(this);
        this.loop.addUpdateTable(this);
        this.scene.add(this.model);
    }

    initAnimationStuff(){
        const leftWing = this.model.getObjectByName("leftWing");
        const rightWing = this.model.getObjectByName("rightWing");
        
        rightWing.rotation.x = RIGHT_WING_START_ROTATION;
        leftWing.rotation.x = LEFT_WING_START_ROTATION;        

        this.rightDownTween = new Tween(rightWing.rotation).to({x:RIGHT_WING_END_ROTATION}, TWEEN_ANIMATION_DURATION);
        this.rightUpTween = new Tween(rightWing.rotation).to({x:RIGHT_WING_START_ROTATION}, TWEEN_ANIMATION_DURATION);
        
        this.rightDownTween.chain(this.rightUpTween);
        this.rightUpTween.chain(this.rightDownTween);
        this.rightDownTween.start();
        //this.rightGroup = new Group(this.rightUpTween, this.rightDownTween);

        this.leftDownTween = new Tween(leftWing.rotation).to({x:LEFT_WING_END_ROTATION}, TWEEN_ANIMATION_DURATION);
        this.leftUpTween = new Tween(leftWing.rotation).to({x:LEFT_WING_START_ROTATION}, TWEEN_ANIMATION_DURATION);

        this.leftDownTween.chain(this.leftUpTween);
        this.leftUpTween.chain(this.leftDownTween);
        this.leftDownTween.start();
        this.tweenGroup = new Group(this.leftUpTween, this.leftDownTween, this.rightUpTween, this.rightDownTween);
    }

    tick(delta){
        
        if(this.flicker){
            this.flickerFly(delta);
            return;
        }
        
        if(!this.stopped){
            this.updateTimers(delta);
            if(this.directionTimer > this.directionChangeTime){
                this.changeDirection(this.currentDirection, 1);
                this.resetTimers();
            }

            this.move(delta);
            this.rotate();
            this.animate();
        }

        else{
            this.stoppedTimer += delta;
            if (this.stoppedTimer > this.stopDuration){
                this.stopped = false;
                this.stoppedTimer = 0;
                
                this.resumeWings();
            }
        }
        
    }

    animate(){
        this.tweenGroup.update();
    }

    flickerFly(delta){
        rand_vector.randomDirection().multiplyScalar(15*delta);

        this.invisibleSphere.position.add(rand_vector);

        this.model.position.add(rand_vector);

        this.invisibleSphere.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        this.model.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    }

    move(delta){
        
        if (this.alpha < 1){
            const easedAlpha = Easing.Quadratic.InOut(this.alpha);

            this.currentQuaternion.identity().slerp(this.endQuaternion, easedAlpha);
            this.lookDirection.copy(this.oldDirection).applyQuaternion(this.currentQuaternion);
        }
        else{
            this.lookDirection.copy(this.currentDirection);
        }   
        this.model.position.addScaledVector(this.lookDirection, delta * MOVEMENT_SPEED);
    }

    rotate(){
        this.model.lookAt(this.lookDirection.add(this.model.position));
        this.model.rotateZ(this.randomRotation);
    }

    changeDirection(strictnessVector, strictness){  //strictness indicates how close the new direction should be to the strictness vector. Higher = closer
        
        if(strictness == 0){
            console.log("STRICTNESS EQUAL TO 0 THIS SHOULD NOT HAPPEN");
            strictness = 1;
        }

        this.oldDirection.copy(this.currentDirection);

        this.newDirection.randomDirection().divideScalar(strictness);
        this.currentDirection.addVectors(this.newDirection, strictnessVector);
        
        if(this.currentDirection.equals(ZERO_VECTOR)){
            this.currentDirection.copy(this.oldDirection);
        }
        
        this.currentDirection.normalize();

        this.directionChangeTime = getRandomInInterval(MINIMUM_DIRECTION_CHANGE_TIME,MAXIMUM_DIRECTION_CHANGE_TIME);
        
        this.endQuaternion.setFromUnitVectors(this.oldDirection, this.currentDirection);
    }


    handleCollision(collisionNormal){
        if(this.currentDirection.dot(collisionNormal) >= 0){ //fly is already trying to move away from wall but collision box still hitting
            return;
        }

        const choice = Math.random();

        if(choice <= STOP_PROBABILITY){
            this.stopFly(collisionNormal);
        }
        else{
            this.reflectFly(collisionNormal);
        }
    }

    handleHit(weaponName){
        switch(weaponName){
            case "ZAPPER":
                this.flicker = true;
                this.killFly();
                break;
        }
    }
    
    killFly(){
        this.pauseWings();
        this.controls.removeActor(this);
        
        this.playSound(this.deathAudioSharedBuffer);

        this.invisibleSphere.position.copy(this.model.position);
        
        //this.invisibleSphere.material.map.offset.set(Math.random(), Math.random());
        

        this.scene.add(this.invisibleSphere);

        window.setInterval( () => {
            this.loop.removeUpdateTable(this);
            this.scene.remove(this.model);
            this.scene.remove(this.invisibleSphere);

            this.invisibleSphere.geometry.dispose();
            this.invisibleSphere.material.dispose();
        }, KILL_ANIMATION_DURATION);
    }



    reflectFly(collisionNormal){
        this.oldDirection.copy(this.currentDirection);
        this.currentDirection.reflect(collisionNormal); 
        
        this.endQuaternion.setFromUnitVectors(this.oldDirection, this.currentDirection);
        
    }

    stopFly(collisionNormal){
        this.currentDirection.projectOnPlane(collisionNormal).normalize();
        this.oldDirection.copy(this.currentDirection);
        this.lookDirection.copy(this.currentDirection);
        this.endQuaternion.setFromUnitVectors(this.oldDirection, this.currentDirection);
        //this.rotate();
        //this.model.rotateZ(-this.randomRotation);
        
        this.currentY.set(0,1,0);
        this.currentY.applyQuaternion(this.model.quaternion);

        this.adjustQuaternion.identity();
        this.adjustQuaternion.setFromUnitVectors(this.currentY, collisionNormal);

        this.model.quaternion.premultiply(this.adjustQuaternion);

        this.stopped = true;
        
        this.pauseWings();

        this.changeDirection(collisionNormal, 2);

        this.stopDuration = getRandomInInterval(2, 10);
    }

    playSound(soundBuffer){
        if(!soundBuffer){
            console.log("playSound: empty sound buffer");
            return
        }

        const source = this.listener.context.createBufferSource();
        source.buffer = soundBuffer;
        
        //console.log(this.listener);
        source.connect(this.listener.getInput());
        source.start(0);
    }
    

    updateTimers(delta){
        this.directionTimer += delta;
        this.alphaTimer += delta;
        this.alpha = Math.min(this.alphaTimer*5,1);
    }

    resetTimers(){
        this.directionTimer = 0;
        this.alphaTimer = 0;
    }

    resumeWings(){
        this.rightDownTween.resume();
        this.rightUpTween.resume();
        this.leftDownTween.resume();
        this.leftUpTween.resume();
    }

    pauseWings(){
        this.rightDownTween.pause();
        this.rightUpTween.pause();
        this.leftDownTween.pause();
        this.leftUpTween.pause();
    }
}

export { Fly}