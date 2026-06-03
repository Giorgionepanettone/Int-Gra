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
    this.actors = [];
  }

  start() {
    this.renderer.setAnimationLoop(() => {
        this.cannonWorld.makeFixedStep();

        //COPY OBJECTS POSITIONS AND ROTATIONS FROM CANNON TO THREE BEFORE RENDERING
        for(const actor of this.actors){
          actor.update();
        }

        for(const obj of this.updateTable){
          obj.tick();
        }

        this.renderer.render(this.scene, this.camera);
    });
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }

  addActor(actor){
    this.actors.push(actor);
  }

  addUpdateTable(obj){
    this.updateTable.push(obj);
  }

  removeActor(actor){
    this.actors.splice(0,1,actor);
  }

  removeUpdateTable(obj){
    this.updateTable.splice(0,1,obj);
  }
}

export { Loop };