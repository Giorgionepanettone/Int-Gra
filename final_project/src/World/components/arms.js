import { MathUtils,  Vector3} from 'three';
import {Tween, Easing, Group } from 'tween'

const SWING_ANIMATION_DURATION = 200;

class Arms {
    constructor(armsModel, camera){
        this.model = armsModel;
        
        this.bonesInit();

        this.nextIsLeft = 1;

        this.originalProperties = new Map();

        this.model.traverse((child) => {
            this.originalProperties.set(child.uuid, {
                position: child.position.clone(),
                quaternion : child.quaternion.clone(),
                scale : child.scale.clone()
            });
        });

        this.camera = camera;
        this.camera.add(this.model);
    }

    restoreOriginalPosition(){
        this.model.traverse((child) => {
            const originalChild = this.originalProperties.get(child.uuid);
            if(originalChild){
                child.position.copy(originalChild.position);
                child.quaternion.copy(originalChild.quaternion);
                child.scale.copy(originalChild.scale);
            }
        });
    }

    zapperPositionInit(){
        this.model.position.set(0.6,-30,-28);
        this.leftArm.position.set(0,1000,0);
       

        
        this.rightArm.rotateZ(MathUtils.degToRad(-120));
        
        this.rightArm.rotateY(MathUtils.degToRad(70));
        
   
        this.rightArm.position.set(-0.05,0,1.4);
        this.HandHoldPositionR();

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

        this.leftTweenGroupR = new Group(this.leftTweenRightArm, this.leftTweenHandR1, this.leftTweenHandR2, this.leftTweenForearmR, this.leftTweenRightArm2);
        this.rightTweenGroupR = new Group(this.rightTweenRightArm, this.rightTweenHandR1, this.rightTweenHandR2, this.rightTweenForearmR, this.rightTweenRightArm2);

        this.leftTweenArray = [];
        this.leftTweenArray.push(this.leftTweenRightArm, this.leftTweenHandR1, this.leftTweenHandR2, this.leftTweenForearmR, this.leftTweenRightArm2);

        this.rightTweenArray = [];
        this.rightTweenArray.push(this.rightTweenRightArm, this.rightTweenHandR1, this.rightTweenHandR2, this.rightTweenForearmR, this.rightTweenRightArm2);
    }

    flamethrowerPositionInit(){
        //this.model.position.set(0.6,-30,-28);
        this.model.rotateY(MathUtils.degToRad(165));
        this.model.rotateX(MathUtils.degToRad(-25));

        this.leftArm.position.set(0.03, -1.77, -0.05);
        this.rightArm.position.set(-0.1, -1.55, -0.2);
        //this.rightArm.position.add(new Vector3(-0.521, 0.2150, 0.034));

        //RIGHT ARM
        this.rightArm.rotation.set(MathUtils.degToRad(139.61), MathUtils.degToRad(-67.28), MathUtils.degToRad(4.73));

        this.upperArmR.position.set(-0.009, 0.202, -0.011);
        this.upperArmR.rotation.set(MathUtils.degToRad(125.58), MathUtils.degToRad(-52.27), MathUtils.degToRad(113.58));

        this.forearmR.position.set(0, 0.322,0);
        this.forearmR.rotation.set(MathUtils.degToRad(11.80), MathUtils.degToRad(4.27), MathUtils.degToRad(86.23));

        this.handR.position.set(0, 0.237,0);
        this.handR.rotation.set(MathUtils.degToRad(-3.32), MathUtils.degToRad(6.26), MathUtils.degToRad(-33.51));

        this.palm01R.position.set(0.004, 0.038, 0.026);
        this.palm01R.rotation.set(MathUtils.degToRad(-143.46), MathUtils.degToRad(-76.54), MathUtils.degToRad(-152.30));

        this.index01R.position.set(0, 0.071, 0);
        this.index01R.rotation.set(MathUtils.degToRad(75.79), MathUtils.degToRad(-0.81), MathUtils.degToRad(-3.38));
        this.index02R.position.set(0, 0.049, 0);
        this.index02R.rotation.set(MathUtils.degToRad(85.06), MathUtils.degToRad(-9.91), MathUtils.degToRad(3.35));
        this.index03R.rotation.set(MathUtils.degToRad(93.95), MathUtils.degToRad(-11.67), MathUtils.degToRad(2.16));

        this.thumb01R.rotation.set(MathUtils.degToRad(-42.90), MathUtils.degToRad(-32.93), MathUtils.degToRad(-65.33));
        this.thumb02R.rotation.set(MathUtils.degToRad(55.80), MathUtils.degToRad(-15.99), MathUtils.degToRad(-13.54));
        this.thumb03R.rotation.set(MathUtils.degToRad(38.31), MathUtils.degToRad(16.51), MathUtils.degToRad(37.17));

        this.palm02R.rotation.set(MathUtils.degToRad(-114.67), MathUtils.degToRad(-80.57), MathUtils.degToRad(-117.78));

        this.middle01R.rotation.set(MathUtils.degToRad(77.17), MathUtils.degToRad(10.18), MathUtils.degToRad(1.49));
        this.middle02R.rotation.set(MathUtils.degToRad(89.92), MathUtils.degToRad(-5.32), MathUtils.degToRad(10.44));
        this.middle03R.rotation.set(MathUtils.degToRad(100.85), MathUtils.degToRad(-4.5), MathUtils.degToRad(13.54));

        this.palm03R.rotation.set(MathUtils.degToRad(74.74), MathUtils.degToRad(82.88), MathUtils.degToRad(-81.17));

        this.ring01R.rotation.set(MathUtils.degToRad(111.72), MathUtils.degToRad(-48.0), MathUtils.degToRad(-173.74));
        this.ring02R.rotation.set(MathUtils.degToRad(94.30), MathUtils.degToRad(-6.46), MathUtils.degToRad(40.21));
        //this.ring03R.position.y += 0.015;
        //this.ring03R.position.set(-0.019, 0.054, -0.002);
        this.ring03R.rotation.set(MathUtils.degToRad(102.55), MathUtils.degToRad(20.15), MathUtils.degToRad(-1.96));

        this.palm04R.rotation.set(MathUtils.degToRad(-114.22), MathUtils.degToRad(-80.70), MathUtils.degToRad(-118.08));

        this.pinky01R.rotation.set(MathUtils.degToRad(51.38), MathUtils.degToRad(36.37), MathUtils.degToRad(23.47));
        this.pinky02R.rotation.set(MathUtils.degToRad(85.52), MathUtils.degToRad(-7.19), MathUtils.degToRad(34.76));
        this.pinky03R.position.y += 0.022;
        this.pinky03R.position.x += 0.01;
        this.pinky03R.rotation.set(MathUtils.degToRad(115), MathUtils.degToRad(-12.27), MathUtils.degToRad(18.29));


        ///LEFT ARM
        this.leftArm.rotation.set(MathUtils.degToRad(-149.82), MathUtils.degToRad(44.19), MathUtils.degToRad(-87.09));
        
        this.upperArmL.rotation.set(MathUtils.degToRad(109.37), MathUtils.degToRad(70.17), MathUtils.degToRad(-139.26));

        this.forearmL.rotation.set(MathUtils.degToRad(27.64), MathUtils.degToRad(-0.51), MathUtils.degToRad(-6.82));

        this.handL.rotation.set(MathUtils.degToRad(6.68), MathUtils.degToRad(-13.31), MathUtils.degToRad(-6.49));

        this.palm01L.rotation.set(MathUtils.degToRad(-143.46), MathUtils.degToRad(76.54), MathUtils.degToRad(152.30));

        this.index01L.rotation.set(MathUtils.degToRad(20.71), MathUtils.degToRad(-5.67), MathUtils.degToRad(-1.57));
        this.index02L.rotation.set(MathUtils.degToRad(50.48), MathUtils.degToRad(-0.04), MathUtils.degToRad(18.96));
        this.index03L.rotation.set(MathUtils.degToRad(62.37), MathUtils.degToRad(1.61), MathUtils.degToRad(24.75));

        this.thumb01L.rotation.set(MathUtils.degToRad(-19.70), MathUtils.degToRad(45.76), MathUtils.degToRad(48.10));
        this.thumb02L.rotation.set(MathUtils.degToRad(20.39), MathUtils.degToRad(-0.83), MathUtils.degToRad(-2.47));
        this.thumb03L.rotation.set(MathUtils.degToRad(38.04), MathUtils.degToRad(12.78), MathUtils.degToRad(-66.12));

        this.palm02L.rotation.set(MathUtils.degToRad(-114.67), MathUtils.degToRad(80.57), MathUtils.degToRad(117.78));

        this.middle01L.rotation.set(MathUtils.degToRad(18.31), MathUtils.degToRad(-1.53), MathUtils.degToRad(-1.23));
        this.middle02L.rotation.set(MathUtils.degToRad(62.33), MathUtils.degToRad(-2.01), MathUtils.degToRad(16.25));
        this.middle03L.rotation.set(MathUtils.degToRad(69.65), MathUtils.degToRad(-0.26), MathUtils.degToRad(17.08));

        this.palm03L.rotation.set(MathUtils.degToRad(74.74), MathUtils.degToRad(-82.88), MathUtils.degToRad(81.16));

        this.ring01L.rotation.set(MathUtils.degToRad(161.85), MathUtils.degToRad(3.10), MathUtils.degToRad(-179.25));
        this.ring02L.rotation.set(MathUtils.degToRad(63.69), MathUtils.degToRad(8.63), MathUtils.degToRad(27.38));
        this.ring03L.rotation.set(MathUtils.degToRad(66.07), MathUtils.degToRad(-14.15), MathUtils.degToRad(24.50));

        this.palm04L.rotation.set(MathUtils.degToRad(-55.93), MathUtils.degToRad(80.71), MathUtils.degToRad(41.92));

        this.pinky01L.rotation.set(MathUtils.degToRad(17.15), MathUtils.degToRad(1.57), MathUtils.degToRad(-0.74));
        this.pinky02L.rotation.set(MathUtils.degToRad(55.53), MathUtils.degToRad(-7.18), MathUtils.degToRad(24.09));
        this.pinky03L.rotation.set(MathUtils.degToRad(67.94), MathUtils.degToRad(-16.26), MathUtils.degToRad(8.19));
    }

    onSwap(){
        
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