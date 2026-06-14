import { MathUtils, ObjectLoader} from 'https://esm.sh/three@0.184.0';
import {Tween, Easing, Group } from 'https://unpkg.com/@tweenjs/tween.js@25.0.0/dist/tween.esm.js'

const SWING_ANIMATION_DURATION = 200;

class Arms {
    constructor(armsModel){
        this.model = armsModel;
        
        this.bonesInit();

        this.nextIsLeft = 1;
    }


    zapperPositionInit(zapperModel){
        this.model.position.set(0.6,-30,-28);
        this.leftArm.position.set(0,1000,0);
       
        //this.model.rotateY(MathUtils.degToRad(-120));
        
        this.rightArm.rotateZ(MathUtils.degToRad(-120));
        
        this.rightArm.rotateY(MathUtils.degToRad(70));
        
        //this.rightArm.rotateY(-30.2);
        this.rightArm.position.set(-0.05,0,1.4);
        this.HandHoldPositionR();
        //this.foreArmR.rotateY(MathUtils.degToRad(10));
        //TEST ROTATION
        this.leftTweenRightArm = new Tween(this.rightArm.rotation).to({y:MathUtils.degToRad(60)}, SWING_ANIMATION_DURATION);
        this.leftTweenHandR1 = new Tween(this.handR.rotation).to({y:MathUtils.degToRad(20)}, SWING_ANIMATION_DURATION);
        this.leftTweenHandR2 = new Tween(this.handR.rotation).to({z:MathUtils.degToRad(25)}, SWING_ANIMATION_DURATION);
        this.leftTweenForearmR = new Tween(this.forearmR.rotation).to({z:MathUtils.degToRad(30)}, SWING_ANIMATION_DURATION);
        this.leftTweenRightArm2 = new Tween(this.rightArm.position).to({x:-0.08}, SWING_ANIMATION_DURATION)

        this.rightTweenRightArm = new Tween(this.rightArm.rotation).to({y:this.rightArm.rotation.y}, SWING_ANIMATION_DURATION);
        this.rightTweenHandR1 = new Tween(this.handR.rotation).to({y:this.handR.rotation.y}, SWING_ANIMATION_DURATION);
        this.rightTweenHandR2 = new Tween(this.handR.rotation).to({z:this.handR.rotation.z}, SWING_ANIMATION_DURATION);
        this.rightTweenForearmR = new Tween(this.forearmR.rotation).to({z:this.forearmR.rotation.z}, SWING_ANIMATION_DURATION);
        this.rightTweenRightArm2 = new Tween(this.rightArm.position).to({x:this.rightArm.position.x}, SWING_ANIMATION_DURATION)

        /* this.leftTweenRightArm.start();
        this.leftTweenHandR1.start();    
        this.leftTweenHandR2.start();
        this.leftTweenForearmR.start(); */

        this.leftTweenGroupR = new Group(this.leftTweenRightArm, this.leftTweenHandR1, this.leftTweenHandR2, this.leftTweenForearmR, this.leftTweenRightArm2);
        ///TEST ROTATION
        this.rightTweenGroupR = new Group(this.rightTweenRightArm, this.rightTweenHandR1, this.rightTweenHandR2, this.rightTweenForearmR, this.rightTweenRightArm2);

        this.leftTweenArray = [];
        this.leftTweenArray.push(this.leftTweenRightArm, this.leftTweenHandR1, this.leftTweenHandR2, this.leftTweenForearmR, this.leftTweenRightArm2);

        this.rightTweenArray = [];
        this.rightTweenArray.push(this.rightTweenRightArm, this.rightTweenHandR1, this.rightTweenHandR2, this.rightTweenForearmR, this.rightTweenRightArm2);
    }

    updateCurrentWeapon(weapon){
        this.currentWeapon = weapon;
    }

    tick(delta){
        this.leftTweenGroupR.update();
        this.rightTweenGroupR.update();
    }

    swingLeft(){
        if(this.rightTweenRightArm.isPlaying()){
            this.stopRight();
        }
        this.startLeft();
    }

    swingRight(){
        if(this.leftTweenRightArm.isPlaying()){
            this.stopLeft();
        }
        this.startRight();
    }

    startLeft(){
        this.leftTweenArray.forEach( tween => {
            tween.startFromCurrentValues();
        });
        /* this.leftTweenRightArm.startFromCurrentValues();
        this.leftTweenHandR1.startFromCurrentValues();
        this.leftTweenHandR2.startFromCurrentValues();
        this.leftTweenForearmR.startFromCurrentValues(); */
    }

    startRight(){
        this.rightTweenArray.forEach( tween => {
            tween.startFromCurrentValues();
        });
    }

    stopLeft(){
        this.leftTweenArray.forEach( tween => {
            tween.stop();
        });
    }

    stopRight(){
        this.rightTweenArray.forEach( tween => {
            tween.stop();
        });
    }
    

    clickDown(){
        switch(this.currentWeapon){
            case "ZAPPER":
                if(this.nextIsLeft){
                    this.swingLeft();
                }
                else{
                    this.swingRight();
                }
                this.nextIsLeft ^= 1;
                break;
        }

    }

    HandHoldPositionR(){
        this.handR.rotateY(MathUtils.degToRad(55));

        this.rightArm.rotateX(MathUtils.degToRad(10));
        this.fingers01R.forEach(finger => {
            finger.rotateX(MathUtils.degToRad(10));
        });

        this.fingers02R.forEach(finger => {
            finger.rotateX(MathUtils.degToRad(90));
        });

        this.fingers03R.forEach(finger => {
            finger.rotateX(MathUtils.degToRad(15));
        });

        this.thumb01R.rotation.set(MathUtils.degToRad(-121.53),MathUtils.degToRad(-11.07),MathUtils.degToRad(-148.89));
        this.thumb02R.rotation.set(MathUtils.degToRad(22.27),MathUtils.degToRad(10.75),MathUtils.degToRad(-13.74));
        this.thumb03R.rotation.set(MathUtils.degToRad(78.11),MathUtils.degToRad(14.54),MathUtils.degToRad(-2.73));
    }

    bonesInit(){
        this.leftArm = this.model.getObjectByName("shoulderL");
        this.rightArm = this.model.getObjectByName("shoulderR");


        this.upperArmR = this.model.getObjectByName("upper_armR");
        this.upperArmL = this.model.getObjectByName("upper_armL");
    

        this.forearmR = this.model.getObjectByName("forearmR");
        this.forearmL = this.model.getObjectByName("forearmL");


        this.handL = this.model.getObjectByName("handL");
        this.handR = this.model.getObjectByName("handR");


        this.palm01L = this.model.getObjectByName("palm01L");
        this.palm02L = this.model.getObjectByName("palm02L");
        this.palm03L = this.model.getObjectByName("palm03L");
        this.palm04L = this.model.getObjectByName("palm04L");

        this.palm01R = this.model.getObjectByName("palm01R");
        this.palm02R = this.model.getObjectByName("palm02R");
        this.palm03R = this.model.getObjectByName("palm03R");
        this.palm04R = this.model.getObjectByName("palm04R");
    

        this.index01L = this.model.getObjectByName("f_index01L");
        this.index02L = this.model.getObjectByName("f_index02L");
        this.index03L = this.model.getObjectByName("f_index03L");

        this.index01R = this.model.getObjectByName("f_index01R");
        this.index02R = this.model.getObjectByName("f_index02R");
        this.index03R = this.model.getObjectByName("f_index03R");


        this.thumb01L = this.model.getObjectByName("thumb01L");
        this.thumb02L = this.model.getObjectByName("thumb02L");
        this.thumb03L = this.model.getObjectByName("thumb03L");

        this.thumb01R = this.model.getObjectByName("thumb01R");
        this.thumb02R = this.model.getObjectByName("thumb02R");
        this.thumb03R = this.model.getObjectByName("thumb03R");


        this.middle01L = this.model.getObjectByName("f_middle01L");
        this.middle02L = this.model.getObjectByName("f_middle02L");
        this.middle03L = this.model.getObjectByName("f_middle03L");

        this.middle01R = this.model.getObjectByName("f_middle01R");
        this.middle02R = this.model.getObjectByName("f_middle02R");
        this.middle03R = this.model.getObjectByName("f_middle03R");


        this.ring01L = this.model.getObjectByName("f_ring01L");
        this.ring02L = this.model.getObjectByName("f_ring02L");
        this.ring03L = this.model.getObjectByName("f_ring03L");

        this.ring01R = this.model.getObjectByName("f_ring01R");
        this.ring02R = this.model.getObjectByName("f_ring02R");
        this.ring03R = this.model.getObjectByName("f_ring03R");


        this.pinky01L = this.model.getObjectByName("f_pinky01L");
        this.pinky02L = this.model.getObjectByName("f_pinky02L");
        this.pinky03L = this.model.getObjectByName("f_pinky03L");

        this.pinky01R = this.model.getObjectByName("f_pinky01R");
        this.pinky02R = this.model.getObjectByName("f_pinky02R");
        this.pinky03R = this.model.getObjectByName("f_pinky03R");

        this.fingers01R = [];
        this.fingers01R.push( this.index01R, this.middle01R, this.ring01R, this.pinky01R);

        this.fingers02R = [];
        this.fingers02R.push( this.index02R, this.middle02R, this.ring02R, this.pinky02R);

        this.fingers03R = [];
        this.fingers03R.push( this.index03R, this.middle03R, this.ring03R, this.pinky03R);
    }

    clickUp(){

    }
}

export {Arms}