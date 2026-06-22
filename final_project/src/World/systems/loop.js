import { Vector3, Timer } from "three";

const clock = new Timer();

class Loop {
  constructor(camera, scene, renderer) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.updateTable = [];
  }

  start() {
    this.renderer.setAnimationLoop(() => {
        clock.update();
        const delta = Math.min( 0.03, clock.getDelta()); //when brower window is not focused delta becomes really big causing problems

        for(const obj of this.updateTable){
          obj.tick(delta);
        }

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

  removeUpdateTableIfExists(obj){
    if (this.updateTable.includes(obj)){
      this.removeUpdateTable(obj);
    }
  }
}

export { Loop };