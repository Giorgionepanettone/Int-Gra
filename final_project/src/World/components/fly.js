import { Vector3, MathUtils, Quaternion} from 'https://esm.sh/three@0.184.0';
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

class Fly {
    constructor(flyModel, hitboxSphere){
        this.model = flyModel;
        this.hitboxSphere = hitboxSphere;
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

        this.currentY = new Vector3();
        this.adjustQuaternion = new Quaternion();
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
        this.rightGroup = new Group(this.rightUpTween, this.rightDownTween);

        this.leftDownTween = new Tween(leftWing.rotation).to({x:LEFT_WING_END_ROTATION}, TWEEN_ANIMATION_DURATION);
        this.leftUpTween = new Tween(leftWing.rotation).to({x:LEFT_WING_START_ROTATION}, TWEEN_ANIMATION_DURATION);

        this.leftDownTween.chain(this.leftUpTween);
        this.leftUpTween.chain(this.leftDownTween);
        this.leftDownTween.start();
        this.leftGroup = new Group(this.leftUpTween, this.leftDownTween);
    }

    tick(delta){
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
        this.rightGroup.update();
        this.leftGroup.update();
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