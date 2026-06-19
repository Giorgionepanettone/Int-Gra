import { Vector3, Box3 } from 'three';
import { OBB } from 'three/addons/math/OBB.js';

class Zapper {
    constructor(zapperModel){
        this.model = zapperModel;
      
        const box3 = new Box3().setFromObject(this.model.getObjectByName("gridMiddle"), true);
        box3.applyMatrix4(this.model.matrixWorld);
        this.hitbox = new OBB().fromBox3(box3);
        this.hitbox.halfSize.add(new Vector3(0.013,0.008,0));
        this.localHitbox = this.hitbox.clone();

        this.weaponName = "ZAPPER";
    }

    intersectsSphere(sphere){
        return this.hitbox.intersectsSphere(sphere);
    }

    updateHitbox(){
        this.hitbox.copy(this.localHitbox);
        this.hitbox.applyMatrix4(this.model.matrixWorld);
    }

    animate(){
        //TODO maybe implement electricty around zapper
    }
}

export { Zapper }