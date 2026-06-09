import { Vector3, MathUtils} from 'https://esm.sh/three@0.184.0';
import {Tween, Easing, Group} from 'https://unpkg.com/@tweenjs/tween.js@25.0.0/dist/tween.esm.js'
import { getRandomInInterval } from './randomUtils.js';

const MOVEMENT_SPEED = 20;

const LEFT_WING_START_ROTATION = MathUtils.degToRad(18);
const RIGHT_WING_START_ROTATION = MathUtils.degToRad(-60);

const LEFT_WING_END_ROTATION = MathUtils.degToRad(-60);
const RIGHT_WING_END_ROTATION = MathUtils.degToRad(18);

class Fly {
    constructor(flyModel){
        this.model = flyModel;
        this.directionTimer = 0;
        this.alphaTimer = 0; //needed for lerping movement and rotation

        this.currentDirection = new Vector3().randomDirection();
        this.newDirection = new Vector3();
        this.oldDirection = new Vector3();
        this.directionChangeTime = 1;
        this.initAnimationStuff();
    }

    initAnimationStuff(){
        const leftWing = this.model.getObjectByName("leftWing");
        const rightWing = this.model.getObjectByName("rightWing");
        
        rightWing.rotation.x = RIGHT_WING_START_ROTATION;
        leftWing.rotation.x = LEFT_WING_START_ROTATION;        

        const rightDownTween = new Tween(rightWing.rotation).to({x:RIGHT_WING_END_ROTATION}, 100);
        const rightUpTween = new Tween(rightWing.rotation).to({x:RIGHT_WING_START_ROTATION}, 100);
        
        rightDownTween.chain(rightUpTween);
        rightUpTween.chain(rightDownTween);
        rightDownTween.start();
        this.rightGroup = new Group(rightUpTween, rightDownTween);

        const leftDownTween = new Tween(leftWing.rotation).to({x:LEFT_WING_END_ROTATION}, 100);
        const leftUpTween = new Tween(leftWing.rotation).to({x:LEFT_WING_START_ROTATION}, 100);

        leftDownTween.chain(leftUpTween);
        leftUpTween.chain(leftDownTween);
        leftDownTween.start();
        this.leftGroup = new Group(leftUpTween, leftDownTween);
    }

    tick(delta){
        this.updateTimers(delta);
        
        if(this.directionTimer > this.directionChangeTime){
            this.changeDirection();
            this.resetTimers();
        }

        this.move(delta);
        this.rotate(delta);
        this.animate();
    }

    animate(){
        this.rightGroup.update();
        this.leftGroup.update();
    }

    move(delta){
        const translation = new Vector3();
        translation.lerpVectors(this.oldDirection, this.currentDirection, this.alpha);
        this.model.position.addScaledVector(translation, delta * MOVEMENT_SPEED);
    }

    rotate(delta){
        const oldLookPoint = new Vector3().addVectors(this.oldDirection, this.model.position);
        const lookPoint = new Vector3().addVectors(this.currentDirection, this.model.position);
        
        
        this.model.lookAt(oldLookPoint.lerp(lookPoint, this.alpha));
        this.model.rotateY(-Math.PI/2);
    }

    changeDirection(){
        
        this.newDirection.randomDirection();
        
        if(this.newDirection.dot(this.currentDirection) < 0){
            //console.log("Hey");
            this.newDirection.reflect(this.currentDirection);
        }
        this.oldDirection.copy(this.currentDirection);
        this.currentDirection.copy(this.newDirection);

        this.directionChangeTime = getRandomInInterval(0.5,1.5);
        
    }

    forceDirectionChange(collisionNormal){
        const forcedDirection = this.currentDirection.reflect(collisionNormal); 
        this.oldDirection.copy(this.currentDirection);
        this.currentDirection.copy(forcedDirection);
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
}

export { Fly}