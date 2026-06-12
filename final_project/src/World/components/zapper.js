import { Vector3, Box3, MathUtils } from 'https://esm.sh/three@0.184.0';
import { OBB } from 'https://esm.sh/three@0.184.0/examples/jsm/math/OBB.js';

class Zapper {
    constructor(zapperModel){
        this.model = zapperModel;
        //his.model.getObjectByName("grid").geometry.computeBoundingBox();
        //const boundingBox = this.model.getObjectByName("grid").geometry.boundingBox;
        //this.model.rotation.set(MathUtils.degToRad(-150),MathUtils.degToRad(0),MathUtils.degToRad(-70));
        
        const box3 = new Box3().setFromObject(this.model.getObjectByName("gridMiddle"), true);
        //box3.translate(new Vector3(0,0,4));

        box3.applyMatrix4(this.model.matrixWorld);
        this.hitbox = new OBB().fromBox3(box3);
        this.hitbox.halfSize.add(new Vector3(0.013,0.008,0));
        this.localHitbox = this.hitbox.clone();
        //this.localHitbox.applyMatrix4(this.model.matrixWorld);
        //this.hitboxModel = this.model.getObjectByName("gridMiddle");
        //this.hitbox.setFromObject(this.model.children[0], true);
        //this.model.rotation.set(MathUtils.degToRad(-150),MathUtils.degToRad(0),MathUtils.degToRad(-70));
        this.weaponName = "ZAPPER";
    }



    animate(){
        //TODO maybe implement electricty around zapper
    }
}

export { Zapper }