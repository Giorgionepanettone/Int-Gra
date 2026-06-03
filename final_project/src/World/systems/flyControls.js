import { FlyControls } from 'https://esm.sh/three@0.184.0/examples/jsm/controls/FlyControls.js?module';

function createControls(object, canvas) {
    const controls = new FlyControls(object, canvas);
    controls.movementSpeed = 50;
    controls.rollSpeed = 1;
    controls.tick = (delta) => {
        controls.update(delta);
    }
    return controls;
}

export { createControls };