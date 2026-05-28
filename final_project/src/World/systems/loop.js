import { Timer } from "https://esm.sh/three@0.184.0";
import {Vector3} from "https://esm.sh/three@0.184.0";

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
        // render a frame
        this.tick()
        this.renderer.render(this.scene, this.camera);
    });
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }

  tick(){
    clock.update();
    const delta = clock.getDelta();
    for(const object of this.updateTable){
        object.tick(delta);
    }
    this.camera.tick();
  }
}

export { Loop };