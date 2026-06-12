import { Timer } from "https://esm.sh/three@0.184.0";
import { Vector3 } from "https://esm.sh/three@0.184.0";

const clock = new Timer();

class Loop {
  constructor(camera, scene, renderer, cannonWorld) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.cannonWorld = cannonWorld;
    this.updateTable = [];
  }

  start() {
    this.renderer.setAnimationLoop(() => {
        clock.update();
        const delta = clock.getDelta();
        for(const obj of this.updateTable){
          obj.tick(delta);
        }

        //const result = this.octree.capsuleIntersect(player); 
        
        //handleCollision

        this.renderer.render(this.scene, this.camera);
    });
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }


  addUpdateTable(obj){
    this.updateTable.push(obj);
  }



  removeUpdateTable(obj){
    const index = this.updateTable.indexOf(obj);
    if (index > -1) { 
      this.updateTable.splice(index, 1);
    }
  }
}

export { Loop };